use anchor_lang::prelude::*;

mod errors;
mod instructions;
mod utils;

declare_id!("H7VMEGEUDZ5VX9MQc5zAhU5AmSjJx4AoC11NDq8wst1w");

#[program]
pub mod degenerator {

    pub use super::instructions::*;
    use super::*;

    pub fn create_mint_account(
        ctx: Context<CreateMintAccount>,
        args: CreateMintAccountArgs,
    ) -> Result<()> {
        instructions::handler(ctx, args)
    }

    pub fn check_mint_extensions_constraints(
        _ctx: Context<CheckMintExtensionConstraints>,
    ) -> Result<()> {
        Ok(())
    }

    pub fn mint_token(ctx: Context<MintToken>, amount: u64) -> Result<()> {
        instructions::mint_token(ctx, amount)
    }

    pub fn revoke_mint_authority(ctx: Context<CloseMint>) -> Result<()> {
        instructions::revoke_mint(ctx)
    }

    pub fn revoke_freeze_authority(ctx: Context<RevokeFreeze>) -> Result<()> {
        instructions::revoke_freeze(ctx)
    }

    pub fn transfer_token(ctx: Context<TransferToken>, amount: u64) -> Result<()> {
        instructions::transfer_token(ctx, amount)
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
}
