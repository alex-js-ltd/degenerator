pub mod error;
pub mod instructions;
pub mod states;
pub mod utils;

use anchor_lang::prelude::*;
use instructions::*;

declare_id!("EsKHsBi2VrQnZHLX57yWmwp3RecmRPzh6fJQ9TLRFV19");

#[program]
pub mod degenerator {

    use super::*;

    pub fn create_bonding_curve(ctx: Context<CreateBondingCurve>, amount: u64) -> Result<()> {
        instructions::create_bonding_curve(ctx, amount)
    }

    pub fn buy_token(ctx: Context<BuyToken>, amount: u64) -> Result<()> {
        instructions::buy_token(ctx, amount)
    }

    pub fn sell_token(ctx: Context<SellToken>, amount: u64) -> Result<()> {
        instructions::sell_token(ctx, amount)
    }

    pub fn wrap_sol(ctx: Context<WrapSol>, amount: u64) -> Result<()> {
        instructions::wrap_sol(ctx, amount)
    }

    pub fn proxy_initialize(
        ctx: Context<ProxyInitialize>,
        init_amount_0: u64,
        init_amount_1: u64,
        open_time: u64,
    ) -> Result<()> {
        instructions::proxy_initialize(ctx, init_amount_0, init_amount_1, open_time)
    }
}
