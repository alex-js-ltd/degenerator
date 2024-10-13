use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct BondingCurveState {
    pub total_supply: u64,    // Total fixed supply of tokens
    pub reserve_balance: u64, // Amount of reserve tokens (e.g., SOL)
    pub reserve_weight: u64,  // Fixed connector weight (e.g., 0.5 for 50%)
}

impl BondingCurveState {
    pub const LEN: usize = 8 + 8 + 8 + 8 + 8 + 8 + 8 + 8; // Adjusted length if necessary
}

pub const RESERVE_WEIGHT: u64 = 500_000;

// amount = amount of sol
pub fn purchase_target_amount(supply: u128, reserve_balance: u128, amount: u128) -> Result<u64> {
    // Calculate the ratio of the amount to the reserve balance
    let ratio = amount / reserve_balance;

    let one = 1_000_000;
    // Calculate the target amount using the formula
    let target = (supply) * ((one + ratio).pow(RESERVE_WEIGHT as u32) - one);

    // Convert the target back to u64 and return it
    Ok(target as u64)
}

pub fn sale_target_amount(supply: u128, reserve_balance: u128, amount: u128) -> Result<u64> {
    // Calculate the ratio of the amount to the supply
    let ratio = amount / supply;

    let one = 1_000_000;

    // Calculate the target amount using the formula
    let target = reserve_balance * (one - (one - ratio).pow(RESERVE_WEIGHT as u32));

    // Convert the target back to u64 and return it
    Ok(target as u64)
}

// Function to set bonding curve state
pub fn set_bonding_curve_state<'a>(
    curve: &mut Account<BondingCurveState>,
    payload: BondingCurveState,
) -> Result<()> {
    curve.total_supply = payload.total_supply;
    curve.reserve_balance = payload.reserve_balance;
    curve.reserve_weight = payload.reserve_weight;

    Ok(())
}
