use anchor_lang::prelude::*;

mod errors;
mod instructions;
mod utils;

declare_id!("4DwsLqEToKjeZoEFgnGAiD48U7smxRmnKryhxQviYgfj");

#[program]
pub mod degenerator {

    pub use super::instructions::*;
    use super::*;

    pub fn initialize(
        ctx: Context<Initialize>,
        token_decimals: u8,
        args: TokenMetadataArgs,
    ) -> Result<()> {
        instructions::initialize(ctx, token_decimals, args)
    }

    pub fn create_associated_token_account(
        ctx: Context<CreateAssociatedTokenAccount>,
    ) -> Result<()> {
        instructions::create_associated_token_account(ctx)
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
}
