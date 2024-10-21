use anchor_lang::prelude::*;
use anchor_spl::token_interface::spl_token_2022::amount_to_ui_amount;
use anchor_spl::token_interface::spl_token_2022::ui_amount_to_amount;

pub const BASE_PRICE: f64 = 0.000000200;
pub const SLOPE: f64 = 0.08;
pub const TARGET: f64 = 50.0;

#[account]
#[derive(InitSpace)]
pub struct BondingCurveState {
    pub mint: Pubkey,
    pub base_price: f64,
    pub slope: f64,
    pub current_supply: u64,
    pub reserve_balance: u64,
    pub mint_decimals: u8,
    pub progress: f64,
}

pub fn price(supply: f64) -> f64 {
    SLOPE * supply + BASE_PRICE
}

pub fn get_reserve_balance(supply: f64) -> f64 {
    (SLOPE / 2.0) * supply.powi(2) + BASE_PRICE * supply
}

pub fn get_token_supply(reserve_balance: f64) -> f64 {
    (f64::sqrt(BASE_PRICE.powi(2) + 2.0 * SLOPE * reserve_balance) - BASE_PRICE) / SLOPE
}

pub fn calculate_buy_price(current_supply: u64, decimals: u8, amount: u64) -> Result<u64> {
    let current_supply = amount_to_ui_amount(current_supply, decimals);
    let amount = amount_to_ui_amount(amount, decimals);

    let new_supply = current_supply + amount;

    // Calculate the reserves before and after the purchase
    let reserve_before = get_reserve_balance(current_supply);
    let reserve_after = get_reserve_balance(new_supply);

    // Total cost for buying the tokens is the difference in reserves
    let total_cost = reserve_after - reserve_before;

    Ok(total_cost.round() as u64)
}

pub fn calculate_buy_amount(reserve_balance: u64, decimals: u8, lamports: u64) -> Result<u64> {
    let new_reserve = reserve_balance + lamports;

    // Calculate the reserves before and after the purchase
    let tokens_before = get_token_supply(reserve_balance as f64);
    let tokens_after = get_token_supply(new_reserve as f64);

    // Total cost for buying the tokens is the difference in target supplies
    let total_tokens = tokens_after - tokens_before;

    let output = ui_amount_to_amount(total_tokens, decimals);

    Ok(output)
}

pub fn calculate_sell_price(current_supply: u64, decimals: u8, amount: u64) -> Result<u64> {
    let current_supply = amount_to_ui_amount(current_supply, decimals);
    let amount = amount_to_ui_amount(amount, decimals);

    let new_supply = current_supply - amount;

    // Calculate the reserves before and after the sale
    let reserve_before = get_reserve_balance(current_supply);
    let reserve_after = get_reserve_balance(new_supply);

    // Revenue from selling is the difference in reserves
    let sell_revenue = reserve_before - reserve_after;

    Ok(sell_revenue.round() as u64)
}

pub fn calculate_progress(reserve_balance: u64) -> Result<f64> {
    let reserve_balance = amount_to_ui_amount(reserve_balance, 9);
    let progress = (reserve_balance / TARGET) * 100.0;

    Ok(progress.clamp(0.0, 100.0))
}

// Function to update bonding curve state
pub fn set_bonding_curve_state<'a>(
    curve: &mut Account<BondingCurveState>,
    payload: BondingCurveState,
) -> Result<()> {
    curve.mint = payload.mint;
    curve.base_price = payload.base_price;
    curve.slope = payload.slope;
    curve.current_supply = payload.current_supply;
    curve.reserve_balance = payload.reserve_balance;
    curve.mint_decimals = payload.mint_decimals;
    curve.progress = payload.progress;

    Ok(())
}
