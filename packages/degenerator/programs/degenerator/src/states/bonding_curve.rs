use crate::utils::token::{
    get_account_balance, token_mint_to, token_ui_amount_to_amount,
    transfer_sol_to_bonding_curve_vault,
};
use anchor_lang::prelude::*;
use anchor_lang::solana_program::native_token::LAMPORTS_PER_SOL;

#[account]
#[derive(InitSpace)]
pub struct BondingCurveState {
    pub total_supply: u64,    // Total fixed supply of tokens
    pub reserve_balance: u64, // Amount of reserve tokens (e.g., SOL)
    pub reserve_weight: f64,  // Fixed connector weight (e.g., 0.5 for 50%)
}

impl BondingCurveState {
    pub const LEN: usize = 8 + 8 + 8 + 8 + 8 + 8 + 8 + 8; // Adjusted length if necessary
}

pub const RESERVE_WEIGHT: f64 = 0.5;

pub fn purchase_target_amount(supply: u64, reserve_balance: u64, amount: u64) -> Result<u64> {
    // Calculate the ratio of the amount to the reserve balance
    let ratio = amount as f64 / reserve_balance as f64;

    // Calculate the exponent using the reserve weight in ppm
    let exponent = RESERVE_WEIGHT as f64 / 1_000_000.0;

    // Calculate the target amount using the formula
    let target = (supply as f64) * ((1.0 + ratio).powf(exponent) - 1.0);

    // Convert the target back to u64 and return it
    Ok(target.round() as u64)
}

pub fn sale_target_amount(supply: u64, reserve_balance: u64, amount: u64) -> Result<u64> {
    // Calculate the fraction of the amount being sold to the total supply
    let fraction = amount as f64 / supply as f64;

    // Calculate the target amount using the formula
    let target = reserve_balance as f64
        * (1.0 - (1.0 - fraction).powf(1_000_000.0 / (RESERVE_WEIGHT as f64)));

    // Convert the target back to u64 and return it
    Ok(target.round() as u64)
}

// Function to set bonding curve state
pub fn set_bonding_curve_state<'a>(
    curve: &mut Account<BondingCurveState>,
    payload: BondingCurveState,
) -> Result<()> {
    curve.total_supply = payload.total_supply;
    curve.reserve_balance = payload.reserve_balance;
    curve.reserve_weight = payload.reserve_weight;

    Ok(())
}
