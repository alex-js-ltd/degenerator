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
    pub const LEN: usize = 8 + 8 + 8 + 8 + 8 + 8 + 8 + 8;
}

const BASE_PRICE: u64 = 10_000; // 0.00001 SOL
const PRICE_INCREMENT: u64 = 1_000; // Linear increment per unit of supply

pub fn calculate_price(supply: u64) -> u64 {
    // Calculate the price increase component based on the remaining supply

    let price_increase = PRICE_INCREMENT.saturating_mul(supply);

    // Total price per token including the increase
    let price_per_token = price_increase.saturating_add(BASE_PRICE);

    price_per_token.try_into().unwrap_or(u64::MAX)
}
pub fn set_bonding_curve_state<'a>(
    state: &mut Account<BondingCurveState>,
    &initial_supply: &u64,
    &current_supply: &u64,
    &lamports: &u64,
) {
    state.sell_price = calculate_price(initial_supply);
    state.buy_price = calculate_price(current_supply);
    state.lamports = lamports;
    state.supply = current_supply;
}
