use anchor_lang::prelude::*;

mod errors;
mod instructions;
mod state;
mod utils;

declare_id!("EAcDKrHzsqQbfH7tAz11534NAkzhuJRfBrgRriYrP1jw");

#[program]
pub mod degenerator {

    pub use super::instructions::*;
    use super::*;

    pub fn create_mint_account(
        ctx: Context<CreateMintAccount>,
        token_decimals: u8,
        args: CreateMintAccountArgs,
    ) -> Result<()> {
        instructions::handler(ctx, token_decimals, args)
    }

    pub fn mint_token(ctx: Context<MintToken>, amount: u64) -> Result<()> {
        instructions::mint_token(ctx, amount)
    }

    pub fn revoke_mint_authority(ctx: Context<Authority>) -> Result<()> {
        instructions::revoke_mint_authority(ctx)
    }

    pub fn revoke_freeze_authority(ctx: Context<Authority>) -> Result<()> {
        instructions::revoke_freeze_authority(ctx)
    }

    pub fn create_pool(ctx: Context<CreatePool>, amount: u64) -> Result<()> {
        instructions::create_pool(ctx, amount)
    }

    pub fn buy_token(ctx: Context<BuyToken>, amount: u64) -> Result<()> {
        instructions::buy_token(ctx, amount)
    }

    pub fn sell_token(ctx: Context<SellToken>, amount: u64) -> Result<()> {
        instructions::sell_token(ctx, amount)
    }

    pub fn proxy_initialize_pool(
        ctx: Context<ProxyInitializePool>,
        tick_spacing: u16,
        initial_sqrt_price: u128,
    ) -> Result<()> {
        return instructions::proxy_initialize_pool(ctx, tick_spacing, initial_sqrt_price);
    }

    pub fn proxy_initialize_tick_array(
        ctx: Context<ProxyInitializeTickArray>,
        start_tick_index: i32,
    ) -> Result<()> {
        return instructions::proxy_initialize_tick_array(ctx, start_tick_index);
    }
}
