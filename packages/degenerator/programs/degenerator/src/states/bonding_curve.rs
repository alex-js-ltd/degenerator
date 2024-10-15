use anchor_lang::prelude::*;

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

pub const RESERVE_WEIGHT: f64 = 500_000.0; // Reserve weight in parts per million
pub const MAX_WEIGHT: f64 = 800_000.0; // Max weight in parts per million

pub fn calculate_buy_price(supply: u128, amount: u128) -> Result<u64> {
    let base_price = 1_000_000; // Set your base price
    let slope = 1_000; // Set your slope for the price increase

    let new_supply = supply + amount;
    let price = base_price + (slope * (new_supply));

    // Step 3: Convert the target back to u64 and return it

    let scale = price.checked_div(1_000_000_000).unwrap();

    Ok(scale as u64)
}

pub fn calculate_sell_price(supply: u128, amount: u128) -> Result<u64> {
    let base_price = 1_000_000; // Set your base price
    let slope = 1_000; // Set your slope for the price decrease

    // Calculate the new supply after selling the amount
    let new_supply = supply - amount;
    let price = base_price + (slope * new_supply);

    let scale = price.checked_div(1_000_000_000).unwrap();

    Ok(scale as u64)
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
