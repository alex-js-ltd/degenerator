use anchor_lang::prelude::*;
use anchor_lang::solana_program::native_token::LAMPORTS_PER_SOL;

#[account]
#[derive(InitSpace)]
pub struct BondingCurveState {
    pub buy_price: u64,
    pub sell_price: u64,
    pub supply: u64,
    pub lamports: u64,
    pub progress: u64,
}

impl BondingCurveState {
    pub const LEN: usize = 8 + 8 + 8 + 8 + 8 + 8 + 8; // Adjusted length if necessary
}

// Constants for pricing
const BASE_PRICE: u64 = 1; // 0.00001 SOL in lamports
const PRICE_INCREMENT: u64 = 1_000; // Linear increment per unit of supply

pub fn calculate_buy_price(supply: u64, amount: u64) -> u64 {
    // Use LAMPORTS_PER_SOL if the supply is 0

    // Use saturating_add and saturating_mul to prevent overflow
    let total_price = (BASE_PRICE.saturating_add(PRICE_INCREMENT.saturating_mul(supply)))
        .saturating_mul(amount)
        .saturating_div(LAMPORTS_PER_SOL)
        .max(BASE_PRICE);

    total_price
}

pub fn calculate_sell_price(supply: u64, amount: u64) -> u64 {
    // Ensure no underflow when subtracting
    let new_supply = supply.saturating_sub(amount);

    // Use saturating_add and saturating_mul to prevent overflow
    let total_price = (BASE_PRICE.saturating_add(PRICE_INCREMENT.saturating_mul(new_supply)))
        .saturating_mul(amount)
        .saturating_div(LAMPORTS_PER_SOL)
        .max(BASE_PRICE);

    total_price
}

// Function to set bonding curve state
pub fn set_bonding_curve_state(
    state: &mut Account<BondingCurveState>,
    &current_supply: &u64,
    &lamports: &u64,
) {
    state.supply = current_supply;
    state.lamports = lamports;
    state.buy_price = calculate_buy_price(current_supply, 1); // Set initial buy price
    state.sell_price = calculate_sell_price(current_supply, 1); // Set initial sell price
}
