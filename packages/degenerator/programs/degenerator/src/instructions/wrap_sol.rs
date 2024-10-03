use anchor_lang::prelude::*;
use anchor_lang::system_program;
use anchor_spl::associated_token::AssociatedToken;

use anchor_spl::token_2022;
use anchor_spl::token_interface::{Mint, TokenAccount, TokenInterface};

use anchor_spl::token::spl_token::native_mint;

pub fn wrap_sol(ctx: Context<WrapSol>, amount: u64) -> Result<()> {
    // Transfer SOL to the associated token account
    system_program::transfer(
        CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.payer.to_account_info(),
                to: ctx.accounts.payer_ata.to_account_info(),
            },
        ),
        amount,
    )?;

    // Sync the native token to reflect the new SOL balance as wSOL
    token_2022::sync_native(CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        token_2022::SyncNative {
            account: ctx.accounts.payer_ata.to_account_info(),
        },
    ))?;

    Ok(())
}

#[derive(Accounts)]
pub struct WrapSol<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
        init_if_needed,
        payer = payer,
        associated_token::mint = native_mint,
        associated_token::authority = payer)]
    pub payer_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(
        constraint = native_mint.key() == native_mint::id(),
    )]
    pub native_mint: Box<InterfaceAccount<'info, Mint>>,

    /// Associated token program
    pub associated_token_program: Program<'info, AssociatedToken>,

    pub system_program: Program<'info, System>,
    /// Token program
    pub token_program: Interface<'info, TokenInterface>,
}
