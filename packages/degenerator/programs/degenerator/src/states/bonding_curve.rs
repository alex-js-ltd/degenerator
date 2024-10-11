use crate::utils::token::{
    get_account_balance, token_mint_to, token_ui_amount_to_amount,
    transfer_sol_to_bonding_curve_vault,
};
use anchor_lang::prelude::*;
use anchor_lang::solana_program::native_token::LAMPORTS_PER_SOL;

#[account]
#[derive(InitSpace)]
pub struct BondingCurveState {
    pub cw: f64,
    pub market_cap: u64, // Initial price per token in lamports
    pub price: u64,
    pub collateral: u64,
    pub supply: u64,
}

impl BondingCurveState {
    pub const LEN: usize = 8 + 8 + 8 + 8 + 8 + 8 + 8 + 8; // Adjusted length if necessary
}

pub fn calculate_cw(collateral: u64, market_cap: u64) -> f64 {
    if market_cap == 0 {
        return 0.0; // Prevent division by zero
    }
    collateral as f64 / market_cap as f64
}

pub fn calculate_market_cap(price: u64, token_supply: u64) -> u64 {
    price * token_supply
}

pub fn calculate_price(collateral: u64, supply: u64, cw: f64) -> u64 {
    if supply == 0 || cw == 0.0 {
        return 0; // Prevent division by zero
    }
    (collateral as f64 / (supply as f64 * cw)) as u64
}

// Function to set bonding curve state
pub fn set_bonding_curve_state<'a>(
    curve: &mut Account<BondingCurveState>,
    &collateral: &u64,
    &price: &u64,
    &market_cap: &u64,
    &supply: &u64,
) -> Result<()> {
    curve.cw = calculate_cw(collateral, market_cap);
    curve.market_cap = calculate_market_cap(price, supply);
    curve.price = calculate_price(collateral, supply, curve.cw);

    Ok(())
}
