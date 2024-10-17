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

pub const BASE_PRICE: u64 = 1;
pub const SLOPE: u64 = 1_000; // Max weight in parts per million

pub fn price_step(supply: f64) -> f64 {
    match supply {
        x if x <= 1_000.0 => 0.000000001,         // Price for 0-100 tokens
        x if x <= 2_000.0 => 0.000000002,         // Price for 101-200 tokens
        x if x <= 3_000.0 => 0.000000003,         // Price for 201-300 tokens
        x if x <= 5_000.0 => 0.000000005,         // Price for 301-500 tokens
        x if x <= 10_000.0 => 0.000000010,        // Price for 501-1,000 tokens
        x if x <= 20_000.0 => 0.000000020,        // Price for 1,001-2,000 tokens
        x if x <= 40_000.0 => 0.000000040,        // Price for 2,001-4,000 tokens
        x if x <= 80_000.0 => 0.0000000080,       // Price for 4,001-8,000 tokens
        x if x <= 160_000.0 => 0.000000160,       // Price for 8,001-16,000 tokens
        x if x <= 320_000.0 => 0.0000000320,      // Price for 16,001-32,000 tokens
        x if x <= 640_000.0 => 0.00000000640,     // Price for 32,001-64,000 tokens
        x if x <= 1_250_000.0 => 0.0000001250,    // Price for 64,001-125,000 tokens
        x if x <= 2_500_000.0 => 0.0000002500,    // Price for 125,001-250,000 tokens
        x if x <= 500_000_000.0 => 0.0000500000,  // Price for 250,001-500,000 tokens
        x if x <= 1_000_000_000.0 => 0.001000000, // Price for 500,001-1,000,000 tokens
        _ => 0.100000000,                         // Default price for above 1 million tokens
    }
}

pub fn calculate_buy_price(current_supply: u64, _reserve_balance: u64, amount: u64) -> Result<u64> {
    let current_supply = spl_token_2022::amount_to_ui_amount(current_supply, 9);
    let amount = spl_token_2022::amount_to_ui_amount(amount, 9);
    // Step 3: Convert the target back to u64 and return it
    let new_supply = current_supply + amount;

    let price = price_step(new_supply);

    let price = spl_token_2022::ui_amount_to_amount(price, 9);

    Ok(price * (amount as u64))
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

    let price = price_step(new_supply);

    let price = spl_token_2022::ui_amount_to_amount(price, 9);

    Ok(price * (amount as u64))
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
