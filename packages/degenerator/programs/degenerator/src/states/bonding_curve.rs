use crate::utils::{precise_number, PreciseNumber, ONE};
use anchor_lang::prelude::*;
use anchor_spl::token_interface::spl_token_2022;

#[account]
#[derive(InitSpace)]
pub struct BondingCurveState {
    pub total_supply: u64,    // Total fixed supply of tokens
    pub reserve_balance: u64, // Amount of reserve tokens (e.g., SOL)
    pub reserve_weight: u128, // Fixed connector weight (e.g., 0.5 for 50%)
    pub decimals: u8,
}

impl BondingCurveState {
    pub const LEN: usize = 8 + 8 + 8 + 8 + 8 + 8 + 8 + 8; // Adjusted length if necessary
}

pub const RESERVE_WEIGHT: u128 = ONE / 2;
pub const MAX_WEIGHT: u128 = ONE;

pub fn purchase_target_amount(supply: u128, reserve_balance: u128, amount: u128) -> Result<u64> {
    let supply = PreciseNumber::new(supply).unwrap();
    let reserve_balance = PreciseNumber::new(reserve_balance).unwrap();
    let amount = PreciseNumber::new(amount).unwrap();
    // Step 1: Calculate the ratio of the amount to the reserve balance
    let ratio = amount.checked_div(&reserve_balance).unwrap();

    let one = PreciseNumber::new(ONE).unwrap();

    let base = ratio.checked_add(&one).unwrap();

    // reserve weight i.e. 1/2
    let exponent = PreciseNumber::new(RESERVE_WEIGHT).unwrap();

    let power = base.checked_pow_fraction(&exponent).unwrap();

    let adjusted_power = power.checked_sub(&one).unwrap();

    let target = supply.checked_mul(&adjusted_power).unwrap();

    // Step 2: Calculate the target amount using the formula
    // let target = supply * ((ONE + ratio).pow(RESERVE_WEIGHT / MAX_WEIGHT) - ONE);
    let tokens = target.to_imprecise().unwrap();
    Ok(tokens as u64)
}

pub fn sale_target_amount(supply: u128, reserve_balance: u128, amount: u128) -> Result<u64> {
    let supply = PreciseNumber::new(supply).unwrap();
    let reserve_balance = PreciseNumber::new(reserve_balance).unwrap();
    let amount = PreciseNumber::new(amount).unwrap();

    // Step 1: Calculate the ratio of the amount to the supply
    let ratio = amount.checked_div(&supply).unwrap();
    let one = PreciseNumber::new(ONE).unwrap();
    let base = one.checked_sub(&ratio).unwrap();

    // Calculate MAX_WEIGHT / RESERVE_WEIGHT
    let weight_ratio = MAX_WEIGHT / RESERVE_WEIGHT;

    // Calculate the target amount using the formula
    let target = reserve_balance
        .checked_mul(&base.checked_pow(2).unwrap())
        .unwrap();

    // Convert the target back to u64 and return it
    let tokens = target.to_imprecise().unwrap();
    Ok(tokens as u64)
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
