use anchor_lang::prelude::*;
use anchor_spl::token_interface::spl_token_2022;

use spl_token_2022::amount_to_ui_amount;

#[account]
#[derive(InitSpace)]
pub struct BondingCurveState {
    pub total_supply: u64,    // Total fixed supply of tokens
    pub reserve_balance: u64, // Amount of reserve tokens (e.g., SOL)
    pub reserve_weight: f64,  // Fixed connector weight (e.g., 0.5 for 50%)
    pub decimals: u8,
}

impl BondingCurveState {
    pub const LEN: usize = 8 + 8 + 8 + 8 + 8 + 8 + 8 + 8; // Adjusted length if necessary
}

pub const BASE_PRICE: f64 = 0.000000200;
pub const SLOPE: f64 = 1.2;

pub fn price(supply: f64) -> f64 {
    SLOPE * supply + BASE_PRICE
}

pub fn reserve(supply: f64) -> f64 {
    // This mirrors the Ethereum formula for calculating the pool balance
    (SLOPE / 2.0) * supply.powi(2) + BASE_PRICE * supply
}

pub fn calculate_buy_price(current_supply: u64, _reserve_balance: u64, amount: u64) -> Result<u64> {
    let current_supply = spl_token_2022::amount_to_ui_amount(current_supply, 9);
    let amount = spl_token_2022::amount_to_ui_amount(amount, 9);
    // Step 3: Convert the target back to u64 and return it

    let new_supply = current_supply + amount;

    // Calculate the reserves before and after the purchase
    let reserve_before = reserve(current_supply);
    let reserve_after = reserve(new_supply);

    // Total cost for buying the tokens is the difference in reserves
    let total_cost = reserve_after - reserve_before;

    Ok(total_cost.round() as u64)
}

pub fn calculate_sell_price(
    current_supply: u64,
    _reserve_balance: u64,
    amount: u64,
) -> Result<u64> {
    let current_supply = spl_token_2022::amount_to_ui_amount(current_supply, 9);
    let amount = spl_token_2022::amount_to_ui_amount(amount, 9);
    // Step 3: Convert the target back to u64 and return it

    let new_supply = current_supply - amount;

    // Calculate the reserves before and after the sale
    let reserve_before = reserve(current_supply);
    let reserve_after = reserve(new_supply);

    // Revenue from selling is the difference in reserves
    let sell_revenue = reserve_before - reserve_after;

    Ok(sell_revenue.floor() as u64)
}

// Function to update bonding curve state
pub fn set_bonding_curve_state<'a>(
    curve: &mut Account<BondingCurveState>,
    payload: BondingCurveState,
) -> Result<()> {
    curve.total_supply = payload.total_supply;
    curve.reserve_balance = payload.reserve_balance;
    curve.reserve_weight = payload.reserve_weight;
    curve.decimals = payload.decimals;

    Ok(())
}

pub const RESERVE_WEIGHT: f64 = 0.5;
