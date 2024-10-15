use anchor_lang::prelude::*;
use anchor_spl::token_interface::spl_token_2022;

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
    let base_price = 1_000_000_000.0; // Set your base price

    let supply = spl_token_2022::amount_to_ui_amount(supply as u64, 9);
    let amount = spl_token_2022::amount_to_ui_amount(amount as u64, 9);

    let new_supply = supply + amount;
    // let price = base_price + (slope * (new_supply));

    let price = base_price * new_supply.powf(2.0);

    let scale = spl_token_2022::ui_amount_to_amount(price, 9);

    Ok(scale / 1_000_000_000)
}

pub fn calculate_sell_price(supply: u128, amount: u128) -> Result<u64> {
    let base_price = 1_000_000_000.0; // Set your base price

    let supply = spl_token_2022::amount_to_ui_amount(supply as u64, 9);
    let amount = spl_token_2022::amount_to_ui_amount(amount as u64, 9);

    // Calculate the new supply after selling the amount
    let new_supply = supply - amount;
    // let price = base_price + (slope * new_supply);

    let price = base_price * new_supply.powf(2.0);

    let scale = spl_token_2022::ui_amount_to_amount(price, 9);

    Ok(scale / 1_000_000_000)
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
