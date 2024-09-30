use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct PoolState {
    pub buy_price: u64,
    pub sell_price: u64,
    pub current_supply: u64,
    pub total_supply: u64,
    pub progress: u64,
}

impl PoolState {
    pub const LEN: usize = 8 + 8 + 8 + 8 + 8 + 8 + 8;
}
