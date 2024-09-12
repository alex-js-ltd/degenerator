use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token_interface::{Mint, TokenAccount, TokenInterface};

use crate::errors::Errors;
use crate::utils::{
    calculate_price, transfer_from_pool_vault_to_user, transfer_sol_to_pool_vault, POOL_VAULT_SEED,
};

#[derive(Accounts)]
pub struct BuyToken<'info> {
    /// The payer of the transaction and the signer
    #[account(mut)]
    pub signer: Signer<'info>,

    /// CHECK: Pool authority (used for transfer)
    #[account(
        mut,
        seeds = [POOL_VAULT_SEED.as_bytes(), mint.key().as_ref()],
        bump,
    )]
    pub pool_authority: AccountInfo<'info>,

    /// Token account from which the tokens will be transferred
    #[account(mut)]
    pub pool_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    /// Token account to which the tokens will be transferred (created if needed)
    #[account(
        init_if_needed,
        associated_token::mint = mint,
        payer = signer,
        associated_token::authority = signer
    )]
    pub payer_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    /// Mint associated with the token
    #[account(mut)]
    pub mint: InterfaceAccount<'info, Mint>,

    /// Token program
    pub token_program: Interface<'info, TokenInterface>,

    /// System program
    pub system_program: Program<'info, System>,

    /// Associated token program
    pub associated_token_program: Program<'info, AssociatedToken>,
}

pub fn buy_token(ctx: Context<BuyToken>, amount: u64) -> Result<()> {
    // Get the current supply of tokens
    let current_supply = ctx.accounts.pool_ata.amount;
    let total_supply = ctx.accounts.mint.supply;

    // Ensure the requested amount does not exceed available supply
    if amount > total_supply {
        return Err(Errors::InsufficientTokens.into());
    }

    // Calculate the price for the requested amount
    let price = calculate_price(current_supply as u128, total_supply as u128, amount as u128);

    // Check if the signer has enough lamports to cover the price
    let signer_balance = ctx.accounts.signer.lamports();
    if signer_balance < price {
        return Err(ProgramError::InsufficientFunds.into());
    }

    transfer_from_pool_vault_to_user(
        ctx.accounts.pool_authority.to_account_info(),
        ctx.accounts.pool_ata.to_account_info(),
        ctx.accounts.payer_ata.to_account_info(),
        ctx.accounts.mint.to_account_info(),
        ctx.accounts.token_program.to_account_info(),
        amount,
        ctx.accounts.mint.decimals,
        &[&[
            POOL_VAULT_SEED.as_bytes(),
            ctx.accounts.mint.key().as_ref(),
            &[ctx.bumps.pool_authority][..],
        ][..]],
    )?;

    transfer_sol_to_pool_vault(
        ctx.accounts.signer.to_account_info(),
        ctx.accounts.pool_authority.to_account_info(),
        ctx.accounts.system_program.to_account_info(),
        price,
    )?;

    Ok(())
}
