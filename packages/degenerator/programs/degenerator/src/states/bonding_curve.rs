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

pub fn calculate_buy_price(curve: &mut Account<BondingCurveState>, amount: u64) -> u64 {
    if curve.collateral == 0 || curve.cw == 0.0 {
        return 0; // Prevent division by zero
    }

    // Calculate the buy amount using the formula
    let fraction = amount as f64 / curve.collateral as f64;
    let power_term = (1.0 + fraction).powf(curve.cw);
    let total_price = curve.supply as f64 * (power_term - 1.0);

    total_price as u64
}

pub fn calculate_sell_price(curve: &mut Account<BondingCurveState>, amount: u64) -> u64 {
    if curve.supply == 0 || curve.cw == 0.0 {
        return 0; // Prevent division by zero
    }

    // Calculate the fraction of tokens sold relative to the total supply
    let fraction = amount as f64 / curve.supply as f64;

    // Apply the bonding curve formula with the inverse of the connector weight (1/CW)
    let power_term = (1.0 + fraction).powf(1.0 / curve.cw);

    // Calculate the sell amount in terms of the decrease in collateral
    let total_price = curve.collateral as f64 * (power_term - 1.0);

    // Return the calculated sell amount as u64
    total_price as u64
}

// Function to set bonding curve state
pub fn set_bonding_curve_state<'a>(
    curve: &mut Account<BondingCurveState>,
    &collateral: &u64,
    &supply: &u64,
    &market_cap: &u64,
) -> Result<()> {
    curve.collateral = collateral;
    curve.supply = supply;
    curve.cw = calculate_cw(collateral, market_cap);

    Ok(())
}
