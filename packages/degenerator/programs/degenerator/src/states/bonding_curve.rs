use anchor_lang::prelude::*;
use anchor_spl::token_interface::spl_token_2022;
use {spl_math::precise_number::PreciseNumber, std::fmt::Debug};

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

pub const RESERVE_WEIGHT: u128 = 500_000; // Reserve weight in parts per million
pub const MAX_WEIGHT: u128 = 1_000_000; // Max weight in parts per million
pub const ONE: u128 = 1_000_000;

pub fn get_precise_numbers(
    supply: u128,
    reserve_balance: u128,
    amount: u128,
) -> (PreciseNumber, PreciseNumber, PreciseNumber) {
    let supply = PreciseNumber::new(supply).unwrap();
    let reserve_balance = PreciseNumber::new(reserve_balance).unwrap();
    let amount = PreciseNumber::new(amount).unwrap();

    (supply, reserve_balance, amount) // Return a tuple of the three numbers
}

pub fn purchase_target_amount(supply: u128, reserve_balance: u128, amount: u128) -> Result<u64> {
    let (supply, reserve_balance, amount) = get_precise_numbers(supply, reserve_balance, amount);

    let one = PreciseNumber::new(ONE).unwrap();

    let ratio = PreciseNumber::checked_mul(&amount, &one)
        .and_then(|scaled_amount| PreciseNumber::checked_div(&scaled_amount, &reserve_balance))
        .unwrap();

    msg!("ratio: {}", ratio.to_imprecise().unwrap());

    let base = PreciseNumber::checked_add(&one, &ratio).unwrap();

    let exponent = RESERVE_WEIGHT / MAX_WEIGHT;

    let power = PreciseNumber::checked_pow(&base, exponent).unwrap();

    let target = PreciseNumber::checked_mul(&supply, &power).unwrap();

    let end = PreciseNumber::checked_sub(&target, &one).unwrap();
    // Step 2: Calculate the target amount using the formula
    //let target = supply * ((1.0 + ratio).powf(RESERVE_WEIGHT / MAX_WEIGHT) - 1.0);

    // Step 3: Convert the target back to u64 and return it
    msg!("purcahse_target_result: {}", end.to_imprecise().unwrap());
    Ok(end.to_imprecise().unwrap() as u64)
}

pub fn sale_target_amount(supply: u128, reserve_balance: u128, amount: u128) -> Result<u64> {
    let (supply, reserve_balance, amount) = get_precise_numbers(supply, reserve_balance, amount);

    let one = PreciseNumber::new(ONE).unwrap();

    let ratio = PreciseNumber::checked_mul(&amount, &one)
        .and_then(|scaled_amount| PreciseNumber::checked_div(&scaled_amount, &supply))
        .unwrap();

    let base = PreciseNumber::checked_sub(&one, &ratio).unwrap();

    let exponent = MAX_WEIGHT / RESERVE_WEIGHT;

    let power = PreciseNumber::checked_pow(&base, exponent).unwrap();

    let target = PreciseNumber::checked_sub(&one, &power).unwrap();

    let end = PreciseNumber::checked_mul(&reserve_balance, &target).unwrap();

    // Calculate the target amount using the formula
    // let target = reserve * (1.0 - (1.0 - ratio).powf(MAX_WEIGHT / RESERVE_WEIGHT));

    msg!("sale_target_result: {}", end.to_imprecise().unwrap());
    Ok(end.to_imprecise().unwrap() as u64)
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
