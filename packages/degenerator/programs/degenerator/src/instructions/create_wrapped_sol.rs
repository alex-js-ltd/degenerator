use anchor_lang::prelude::*;
use anchor_lang::system_program;
use anchor_spl::associated_token::AssociatedToken;

use anchor_spl::token;
use anchor_spl::token_2022;
use anchor_spl::token_interface::{Mint, TokenAccount, TokenInterface};

use anchor_spl::token::spl_token::native_mint;

use crate::utils::{
    set_bonding_curve_state, token_mint_to, update_account_lamports_to_minimum_balance,
    BONDING_CURVE_HODL_SEED, BONDING_CURVE_STATE_SEED, BONDING_CURVE_VAULT_SEED,
};

pub fn create_wrapped_sol(ctx: Context<CreateWrappedSol>) -> Result<()> {
    // Transfer SOL to the hodl pda

    system_program::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.vault.to_account_info(),
                to: ctx.accounts.hodl.to_account_info(),
            },
            &[&[
                BONDING_CURVE_VAULT_SEED.as_bytes(),
                ctx.accounts.token_1_mint.key().as_ref(),
                &[ctx.bumps.vault][..],
            ][..]],
        ),
        ctx.accounts.vault.lamports(),
    )?;

    let total_lamports = ctx.accounts.hodl.lamports();
    let lamports_to_transfer = (total_lamports as f64 * 0.9) as u64; // Calculate 90%

    system_program::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.hodl.to_account_info(),
                to: ctx.accounts.hodl_sol_ata.to_account_info(),
            },
            &[&[
                BONDING_CURVE_HODL_SEED.as_bytes(),
                ctx.accounts.token_1_mint.key().as_ref(),
                &[ctx.bumps.hodl][..],
            ][..]],
        ),
        lamports_to_transfer, // Use the calculated amount
    )?;

    token::sync_native(CpiContext::new(
        ctx.accounts.system_program.to_account_info(),
        token::SyncNative {
            account: ctx.accounts.hodl_sol_ata.to_account_info(),
        },
    ))?;

    Ok(())
}

#[derive(Accounts)]
pub struct CreateWrappedSol<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        constraint = token_0_mint.key() == native_mint::id(),
        mint::token_program = token_0_program,
    )]
    pub token_0_mint: Box<InterfaceAccount<'info, Mint>>,

    #[account(
        mint::token_program = token_1_program,
    )]
    pub token_1_mint: Box<InterfaceAccount<'info, Mint>>,

    /// CHECK: pda to control vault_meme_ata & lamports
    #[account(mut,
        seeds = [BONDING_CURVE_VAULT_SEED.as_bytes(), token_1_mint.key().as_ref()],
        bump,
    )]
    pub vault: AccountInfo<'info>,

    /// CHECK: pda to hodl tokens for the raydium pool
    #[account(mut,
            seeds = [BONDING_CURVE_HODL_SEED.as_bytes(), token_1_mint.key().as_ref()],
            bump,
        )]
    pub hodl: AccountInfo<'info>,

    /// The ATA to the sol account
    #[account(
       mut,
        associated_token::mint = token_0_mint,
        associated_token::authority = hodl,
        associated_token::token_program = token_0_program
    )]
    pub hodl_sol_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    /// Spl token program or token program 2022
    pub token_0_program: Interface<'info, TokenInterface>,

    /// Spl token program or token program 2022
    pub token_1_program: Interface<'info, TokenInterface>,

    /// Associated token program
    pub associated_token_program: Program<'info, AssociatedToken>,

    pub system_program: Program<'info, System>,
}
