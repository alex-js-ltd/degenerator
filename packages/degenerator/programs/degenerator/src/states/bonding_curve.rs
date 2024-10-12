use crate::utils::token::{
    get_account_balance, token_mint_to, token_ui_amount_to_amount,
    transfer_sol_to_bonding_curve_vault,
};
use anchor_lang::prelude::*;
use anchor_lang::solana_program::native_token::LAMPORTS_PER_SOL;

#[account]
#[derive(InitSpace)]
pub struct BondingCurveState {
    pub total_supply: u64,     // Total fixed supply of tokens
    pub reserve_balance: u64,  // Amount of reserve tokens (e.g., SOL)
    pub connector_weight: f64, // Fixed connector weight (e.g., 0.5 for 50%)
    pub price: u64,            // Current price of the token
}

impl BondingCurveState {
    pub const LEN: usize = 8 + 8 + 8 + 8 + 8 + 8 + 8 + 8; // Adjusted length if necessary
}

pub const CONNECTOR_WEIGHT: f64 = 0.5;

pub fn calculate_price(reserve_balance: u64, total_supply: u64) -> Result<u64> {
    let price = CONNECTOR_WEIGHT * (reserve_balance as f64 / total_supply as f64);

    Ok(price as u64)
}

pub fn calculate_reserve_ratio(total_supply: u64, vault_balance: u64) -> f64 {
    let reserve_ratio = vault_balance as f64 / total_supply as f64;
    reserve_ratio
}

pub fn calculate_buy_price(curve: &Account<BondingCurveState>, amount: u64) -> Result<u64> {
    // Use saturating operations for integer arithmetic
    let new_total_supply = curve.total_supply.saturating_add(amount);

    // Calculate price per token using the Bancor formula
    let price_per_token = (curve.base_price)
        * (new_total_supply as f64 / curve.total_supply as f64).powf(curve.reserve_ratio);

    // Calculate total cost in lamports, ensuring it remains within u64 bounds
    let total_cost = (price_per_token * amount as f64)
        .round()
        .min(u64::MAX as f64) as u64;

    Ok(total_cost)
}

pub fn calculate_sell_price(curve: &Account<BondingCurveState>, amount: u64) -> Result<u64> {
    // Use saturating operations for integer arithmetic
    let new_total_supply = curve.total_supply.saturating_sub(amount);

    // Calculate price per token using the Bancor formula
    let price_per_token = (curve.base_price)
        * (new_total_supply as f64 / curve.total_supply as f64).powf(curve.reserve_ratio);

    // Calculate total revenue in lamports, ensuring it remains within u64 bounds
    let total_revenue = (price_per_token * amount as f64)
        .round()
        .min(u64::MAX as f64) as u64;

    Ok(total_revenue)
}

// Function to set bonding curve state
pub fn set_bonding_curve_state<'a>(
    curve: &mut Account<BondingCurveState>,
    payload: BondingCurveState,
) -> Result<()> {
    curve.total_supply = payload.total_supply;
    curve.reserve_balance = payload.reserve_balance;
    curve.connector_weight = payload.connector_weight;
    curve.price = payload.price;

    Ok(())
}
