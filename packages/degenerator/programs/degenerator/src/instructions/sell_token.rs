use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token_interface::{Mint, TokenAccount, TokenInterface};

use crate::errors::Errors;
use crate::utils::{
    get_price_per_token, get_total_price, set_price_per_token, transfer_from_user_to_pool_vault,
    transfer_sol_to_user, Price, POOL_PRICE_SEED, POOL_VAULT_SEED,
};

#[derive(Accounts)]
pub struct SellToken<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut)]
    pub payer_ata: InterfaceAccount<'info, TokenAccount>,
    /// CHECK: Pool authority (used for transfer)
    #[account(
        mut,
        seeds = [POOL_VAULT_SEED.as_bytes(), mint.key().as_ref()],
        bump,
    )]
    pub pool_authority: AccountInfo<'info>,

    /// CHECK: Pool current price (used for transfer)
    #[account(
            mut,
            seeds = [POOL_PRICE_SEED.as_bytes(), mint.key().as_ref()],
            bump,
        )]
    pub current_price: Account<'info, Price>,

    #[account(
        init_if_needed,
        associated_token::mint = mint,
        payer = signer,
        associated_token::authority = pool_authority
    )]
    pub pool_ata: InterfaceAccount<'info, TokenAccount>,

    #[account(mut)]
    pub mint: InterfaceAccount<'info, Mint>,

    pub token_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

pub fn sell_token(ctx: Context<SellToken>, amount: u64) -> Result<()> {
    // Get the current supply of tokens
    let user_supply = ctx.accounts.payer_ata.amount;

    // Ensure the requested amount does not exceed available supply
    if amount > user_supply {
        return Err(Errors::InsufficientTokens.into());
    }

    // Calculate the price for the requested amount
    let price_per_token = ctx.accounts.current_price.price_per_token;
    let total_price = get_total_price(price_per_token as u128, amount as u128);

    let pool_balance = ctx.accounts.pool_authority.lamports(); // Access lamports in pool authority

    if pool_balance < total_price {
        return Err(ProgramError::InsufficientFunds.into());
    }

    // Transfer the tokens
    transfer_from_user_to_pool_vault(
        ctx.accounts.signer.to_account_info(),
        ctx.accounts.payer_ata.to_account_info(),
        ctx.accounts.pool_ata.to_account_info(),
        ctx.accounts.mint.to_account_info(),
        ctx.accounts.token_program.to_account_info(),
        amount,
        ctx.accounts.mint.decimals,
    )?;

    transfer_sol_to_user(
        ctx.accounts.pool_authority.to_account_info(),
        ctx.accounts.signer.to_account_info(),
        ctx.accounts.system_program.to_account_info(),
        total_price,
        &[&[
            POOL_VAULT_SEED.as_bytes(),
            ctx.accounts.mint.key().as_ref(),
            &[ctx.bumps.pool_authority][..],
        ][..]],
    )?;

    let new_price_per_token = get_price_per_token(
        ctx.accounts.payer_ata.amount as u128,
        ctx.accounts.mint.supply as u128,
    );

    set_price_per_token(&mut ctx.accounts.current_price, new_price_per_token);

    Ok(())
}
