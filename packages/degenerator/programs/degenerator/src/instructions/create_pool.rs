use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token_interface::{Mint, TokenAccount, TokenInterface};

use crate::utils::{
    update_account_lamports_to_minimum_balance, POOL_ACCOUNT_SEED,
};

pub fn create_pool(ctx: Context<CreatePool>) -> Result<()> {
        // transfer minimum rent to pool account
        update_account_lamports_to_minimum_balance(
            ctx.accounts.pool_authority.to_account_info(),
            ctx.accounts.payer.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
        )?;
    Ok(())
}

#[derive(Accounts)]
pub struct CreatePool<'info> {
    /// The payer for the transaction
    #[account(mut)]
    pub payer: Signer<'info>,

    /// CHECK: pool vault
    #[account(mut,
        seeds = [POOL_ACCOUNT_SEED, mint.key().as_ref()],
        bump,
    )]
    pub pool_authority: AccountInfo<'info>,

    /// The Mint for which the ATA is being created
    pub mint: Box<InterfaceAccount<'info, Mint>>,

    /// The ATA that will be created
    #[account(
        init,
        payer = payer,
        associated_token::mint = mint,
        associated_token::authority = pool_authority,
    )]
    pub token_account: Box<InterfaceAccount<'info, TokenAccount>>,

    /// System Program
    pub system_program: Program<'info, System>,

    /// Rent Sysvar
    pub rent: Sysvar<'info, Rent>,

    /// Token Program
    pub token_program: Interface<'info, TokenInterface>,

    /// Associated Token Program
    pub associated_token_program: Program<'info, AssociatedToken>,
}

