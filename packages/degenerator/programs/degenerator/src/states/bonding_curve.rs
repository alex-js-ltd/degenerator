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

const BASE_PRICE: u64 = 10_000; // 0.00001 SOL
const PRICE_INCREMENT: u64 = 1_000; // Linear increment per unit of supply

impl BondingCurveState {
    pub const LEN: usize = 8 + 8 + 8 + 8 + 8 + 8 + 8 + 8;

    pub fn calculate_price(&self, supply: u64) -> u64 {
        // Calculate the price increase component based on the remaining supply

        let price_increase = PRICE_INCREMENT.saturating_mul(supply);

        // Total price per token including the increase
        let price_per_token = price_increase.saturating_add(BASE_PRICE);

        price_per_token.try_into().unwrap_or(u64::MAX)
    }

    pub fn set_buy_price(&mut self, price: u64) {
        self.buy_price = price;
    }

    pub fn set_sell_price(&mut self, price: u64) {
        self.sell_price = price;
    }

    pub fn set_state(&mut self, supply_0: u64, supply_1: u64) {
        self.buy_price = self.calculate_price(supply_0);
        self.sell_price = self.calculate_price(supply_1);
    }
}
