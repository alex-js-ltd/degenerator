use crate::state::BondingCurveState;
use crate::utils::{
    set_bonding_curve_state, token_mint_to, update_account_lamports_to_minimum_balance,
    BONDING_CURVE_HODL_SEED, BONDING_CURVE_STATE_SEED, BONDING_CURVE_VAULT_SEED,
};
use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::spl_token::native_mint;
use anchor_spl::token::Token;
use anchor_spl::token_interface::{Mint, TokenAccount, TokenInterface};

#[derive(Accounts)]
pub struct CreateBondingCurve<'info> {
    /// Address paying to create the pool. Can be anyone
    #[account(mut)]
    pub creator: Signer<'info>,

    /// Token_0 mint, the key must smaller then token_1 mint.
    #[account(
        constraint = token_0_mint.key() < token_1_mint.key(),
        constraint = token_0_mint.key() == native_mint::id(),


    )]
    pub token_0_mint: Box<InterfaceAccount<'info, Mint>>,

    pub token_1_mint: Box<InterfaceAccount<'info, Mint>>,

    #[account(
        init,
        payer = creator,
        associated_token::mint = token_0_mint,
        associated_token::authority = token_0_vault
    )]
    pub token_0_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(
        init,
        payer = creator,
        associated_token::mint = token_1_mint,
        associated_token::authority = token_1_vault
    )]
    pub token_1_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    /// CHECK: Token_0 vault for the pool
    #[account(
        mut,
        seeds = [
           BONDING_CURVE_VAULT_SEED.as_bytes(),
            token_0_mint.key().as_ref()
        ],
        bump,
    )]
    pub token_0_vault: UncheckedAccount<'info>,

    /// CHECK: Token_1 vault for the pool
    #[account(
        mut,
        seeds = [
            BONDING_CURVE_VAULT_SEED.as_bytes(),
            token_1_mint.key().as_ref()
        ],
        bump,
    )]
    pub token_1_vault: UncheckedAccount<'info>,

    /// Spl token program or token program 2022
    pub token_program: Interface<'info, TokenInterface>,
    /// Program to create an ATA for receiving position NFT
    pub associated_token_program: Program<'info, AssociatedToken>,
    /// To create a new program account
    pub system_program: Program<'info, System>,
    /// Sysvar for program account
    pub rent: Sysvar<'info, Rent>,
}

pub fn create_bonding_curve(ctx: Context<CreateBondingCurve>, amount: u64) -> Result<()> {
    update_account_lamports_to_minimum_balance(
        ctx.accounts.token_0_vault.to_account_info(),
        ctx.accounts.creator.to_account_info(),
        ctx.accounts.system_program.to_account_info(),
    )?;

    update_account_lamports_to_minimum_balance(
        ctx.accounts.token_1_vault.to_account_info(),
        ctx.accounts.creator.to_account_info(),
        ctx.accounts.system_program.to_account_info(),
    )?;

    Ok(())
}
