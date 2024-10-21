pub mod error;
pub mod instructions;
pub mod states;
pub mod utils;

use anchor_lang::prelude::*;
use instructions::*;

declare_id!("2Gpw4jeQMve1wTGkE1xusRgGQbLG3wvaap5L75JQKime");

#[program]
pub mod degenerator {

    use super::*;

    pub fn create_mint_account(
        ctx: Context<CreateMintAccount>,
        token_decimals: u8,
        args: CreateMintAccountArgs,
    ) -> Result<()> {
        instructions::create_mint_account(ctx, token_decimals, args)
    }

    pub fn create_bonding_curve(ctx: Context<CreateBondingCurve>) -> Result<()> {
        instructions::create_bonding_curve(ctx)
    }

    pub fn buy_token(ctx: Context<BuyToken>, lamports: u64) -> Result<()> {
        instructions::buy_token(ctx, lamports)
    }

    pub fn sell_token(ctx: Context<SellToken>, amount: u64) -> Result<()> {
        instructions::sell_token(ctx, amount)
    }

    pub fn wrap_sol(ctx: Context<WrapSol>, amount: u64) -> Result<()> {
        instructions::wrap_sol(ctx, amount)
    }
}
