use crate::utils::token::{
    get_account_balance, token_mint_to, token_ui_amount_to_amount,
    transfer_sol_to_bonding_curve_vault,
};
use anchor_lang::prelude::*;
use anchor_lang::solana_program::native_token::LAMPORTS_PER_SOL;

#[account]
#[derive(InitSpace)]
pub struct BondingCurveState {
    pub base_price: f64,    // Initial price per token in lamports
    pub reserve_ratio: f64, // Ratio to determine liquidity (consider using f64)
    pub total_supply: u64,  // Total number of tokens issued
    pub vault_balance: u64, // Balance of reserves (in lamports)
    pub buy_price: u64,
    pub sell_price: u64,
}

impl BondingCurveState {
    pub const LEN: usize = 8 + 8 + 8 + 8 + 8 + 8 + 8 + 8; // Adjusted length if necessary
}

const BASE_PRICE: f64 = 0.00001;

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
    &total_supply: &u64,
    &vault_balance: &u64,
) -> Result<()> {
    curve.base_price = BASE_PRICE;
    curve.reserve_ratio = calculate_reserve_ratio(total_supply, vault_balance);
    curve.total_supply = total_supply;
    curve.vault_balance = vault_balance;
    curve.buy_price = calculate_buy_price(curve, 1)?;
    curve.sell_price = calculate_sell_price(curve, 1)?;

    Ok(())
}
