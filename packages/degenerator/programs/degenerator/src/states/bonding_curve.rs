use anchor_lang::prelude::*;
use anchor_spl::token_interface::spl_token_2022::amount_to_ui_amount;

pub const BASE_PRICE: f64 = 0.000000200;
pub const SLOPE: f64 = 1.2;

#[account]
#[derive(InitSpace)]
pub struct BondingCurveState {
    pub base_price: f64,
    pub slope: f64,
    pub current_supply: u64,
    pub reserve_balance: u64,
    pub mint_decimals: u8,
    pub buy_price: u64,
    pub sell_price: u64,
}

impl BondingCurveState {
    pub const LEN: usize = 56 + 8;
}

pub fn price(supply: f64) -> f64 {
    SLOPE * supply + BASE_PRICE
}

pub fn get_reserve_balance(supply: f64) -> f64 {
    (SLOPE / 2.0) * supply.powi(2) + BASE_PRICE * supply
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

pub fn calculate_price_per_token(current_supply: u64, decimals: u8) -> Result<(u64, u64)> {
    let smallest_unit = 10u64.checked_pow(decimals as u32).unwrap();
    let buy_price = calculate_buy_price(current_supply, decimals, smallest_unit)?;
    let sell_price = calculate_sell_price(current_supply, decimals, smallest_unit)?;

    Ok((buy_price, sell_price))
}

// Function to update bonding curve state
pub fn set_bonding_curve_state<'a>(
    curve: &mut Account<BondingCurveState>,
    payload: BondingCurveState,
) -> Result<()> {
    curve.base_price = payload.base_price;
    curve.slope = payload.slope;
    curve.current_supply = payload.current_supply;
    curve.reserve_balance = payload.reserve_balance;
    curve.mint_decimals = payload.mint_decimals;
    curve.buy_price = payload.buy_price;
    curve.sell_price = payload.sell_price;

    Ok(())
}
