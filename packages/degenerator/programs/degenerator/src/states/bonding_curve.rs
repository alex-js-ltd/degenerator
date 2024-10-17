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
pub const MAX_WEIGHT: f64 = 1_000_000.0; // Max weight in parts per million
pub const ONE: f64 = 1.0;

pub fn purchase_target_amount(supply: u64, reserve_balance: u64, amount: u64) -> Result<u64> {
    let supply = spl_token_2022::amount_to_ui_amount(supply, 9);
    let reserve = spl_token_2022::amount_to_ui_amount(reserve_balance, 9);
    let amount = spl_token_2022::amount_to_ui_amount(amount, 9);
    // Step 1: Calculate the ratio of the amount to the reserve balance
    let ratio = amount / reserve;

    // Step 2: Calculate the target amount using the formula
    let target = supply * ((ONE + ratio).powf(RESERVE_WEIGHT / MAX_WEIGHT) - ONE);

    let tokens = spl_token_2022::ui_amount_to_amount(target, 9);

    // Step 3: Convert the target back to u64 and return it
    Ok(tokens)
}

pub fn sale_target_amount(supply: u64, reserve_balance: u64, amount: u64) -> Result<u64> {
    let supply = spl_token_2022::amount_to_ui_amount(supply, 9);
    let reserve = spl_token_2022::amount_to_ui_amount(reserve_balance, 9);
    let amount = spl_token_2022::amount_to_ui_amount(amount, 9);
    // Calculate the ratio of the amount to the supply
    let ratio = amount / supply;

    // Calculate the target amount using the formula
    let target = reserve * (ONE - (ONE - ratio).powf(MAX_WEIGHT / RESERVE_WEIGHT));

    let sol = spl_token_2022::ui_amount_to_amount(target, 9);

    // Convert the target back to u64 and return it
    Ok(sol)
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
