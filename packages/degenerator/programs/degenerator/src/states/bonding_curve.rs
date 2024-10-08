use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct BondingCurveState {
    pub buy_price: u64,
    pub sell_price: u64,
    pub supply: u64,
    pub progress: u64,
}

const BASE_PRICE: u64 = 10_000; // Base price per token (0.00001 SOL)
const PRICE_INCREMENT: u64 = 1_000; // Linear increment per unit of supply

impl BondingCurveState {
    pub const LEN: usize = 8 + 8 + 8 + 8 + 8 + 8;

    /// Sets the price per token in the bonding curve state.
    pub fn set_state(&mut self, current_supply: u64) {
        self.sell_price = self.calculate_sell_price(current_supply, 1);
        self.buy_price = self.calculate_buy_price(current_supply, 1);
        self.supply = current_supply;
    }

    pub fn calculate_buy_price(&self, current_supply: u64, amount: u64) -> u64 {
        // Calculate the price increase component based on the remaining supply

        let price_increase = PRICE_INCREMENT.saturating_mul(current_supply);

        // Total price per token including the increase
        let price_per_token = BASE_PRICE.saturating_add(price_increase);

        // Total price for the amount of tokens requested
        let total_price = price_per_token.saturating_mul(amount);

        // Convert to u64, with a maximum cap to avoid overflow
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

        // Convert to u64, with a maximum cap to avoid overflow
        total_price.try_into().unwrap_or(u64::MAX)
    }
}
