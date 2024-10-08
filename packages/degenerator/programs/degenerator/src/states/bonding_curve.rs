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

    pub fn calculate_buy_price(&self, current_supply: u64, amount: u64) -> u64 {
        // Calculate the price increase component based on the remaining supply

        let price_increase = PRICE_INCREMENT.saturating_mul(current_supply);

        // Total price per token including the increase
        let price_per_token = BASE_PRICE.saturating_add(price_increase);

        // Total price for the amount of tokens requested
        let total_price = price_per_token.saturating_mul(amount);

        total_price.try_into().unwrap_or(u64::MAX)
    }

    pub fn calculate_sell_price(&self, current_supply: u64, amount: u64) -> u64 {
        // Calculate the price decrease component based on the current supply
        let price_decrease = PRICE_INCREMENT.saturating_mul(current_supply);

        // Total price per token including the decrease
        let price_per_token = BASE_PRICE.saturating_sub(price_decrease);

        // Ensure that price does not drop below BASE_PRICE
        let price_per_token = price_per_token.max(BASE_PRICE);

        // Total price for the amount of tokens being sold
        let total_price = price_per_token.saturating_mul(amount);

        total_price.try_into().unwrap_or(u64::MAX)
    }

    pub fn calculate_progress(&self, lamports_balance: u64) -> u64 {
        // Define the total lamports for 100 SOL using the imported constant
        let total_lamports = 1_000_000_000;

        // Calculate progress as a percentage by first dividing, then multiplying
        let progress = lamports_balance
            .saturating_div(total_lamports) // First, divide the balance by 100 SOL worth of lamports
            .saturating_mul(100); // Then, multiply the fraction by 100 to get the percentage

        // Ensure progress does not exceed 100%
        if progress > 100 {
            return 100;
        }

        progress.try_into().unwrap_or(u64::MAX)
    }

    pub fn set_state(&mut self, supply: u64, lamports: u64) {
        self.buy_price = self.calculate_buy_price(supply, 1);
        self.sell_price = self.calculate_sell_price(supply, 1);
        self.progress = self.calculate_progress(lamports);
        self.lamports = lamports;
        self.supply = supply;
    }
}
