use anchor_lang::system_program;
use anchor_lang::{prelude::*, solana_program::entrypoint::ProgramResult};
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token_2022;
use anchor_spl::token_interface::{Mint, TokenAccount, TokenInterface};

use crate::errors::Errors;
use crate::utils::{calculate_price, POOL_ACCOUNT_SEED};

#[derive(Accounts)]
pub struct SellToken<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut)]
    pub payer_ata: InterfaceAccount<'info, TokenAccount>,

    #[account(
        mut,
        seeds = [POOL_ACCOUNT_SEED, mint.key().as_ref()],
        bump,
    )]
    pub pool_authority: AccountInfo<'info>,

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

fn transfer_from_user_to_pool_vault<'a>(
    authority: AccountInfo<'a>,
    from: AccountInfo<'a>,
    to_vault: AccountInfo<'a>,
    mint: AccountInfo<'a>,
    token_program: AccountInfo<'a>,
    amount: u64,
    mint_decimals: u8,
) -> Result<()> {
    if amount == 0 {
        return Ok(());
    }
    token_2022::transfer_checked(
        CpiContext::new(
            token_program.to_account_info(),
            token_2022::TransferChecked {
                from,
                to: to_vault,
                authority,
                mint,
            },
        ),
        amount,
        mint_decimals,
    )
}

fn transfer_sol_to_user<'a>(
    from: AccountInfo<'a>,
    to: AccountInfo<'a>,
    system_program: AccountInfo<'a>,
    amount: u64,
    signer_seeds: &[&[&[u8]]],
) -> ProgramResult {
    let cpi_accounts = system_program::Transfer { from, to };
    let cpi_ctx = CpiContext::new_with_signer(system_program, cpi_accounts, signer_seeds);
    system_program::transfer(cpi_ctx, amount)?;
    Ok(())
}

pub fn sell_token(ctx: Context<SellToken>, amount: u64) -> Result<()> {
    // Get the current supply of tokens
    let supply = ctx.accounts.payer_ata.amount;

    // Ensure the requested amount does not exceed available supply
    if amount > supply {
        return Err(Errors::InsufficientTokens.into());
    }

    // Calculate the price for the requested amount
    let price = calculate_price(supply, amount);

    // Ensure the pool authority has enough balance to cover the price
    let pool_balance = ctx.accounts.pool_authority.lamports();
    if pool_balance < price {
        return Err(ProgramError::InsufficientFunds.into());
    }

    let mint_key = ctx.accounts.mint.key();
    let seeds: &[&[u8]; 3] = &[
        b"pool".as_ref(),
        mint_key.as_ref(),
        &[ctx.bumps.pool_authority],
    ];
    let signer_seeds = &[&seeds[..]];

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
        price,
        signer_seeds,
    )?;

    Ok(())
}
