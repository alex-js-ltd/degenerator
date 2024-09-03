use anchor_lang::system_program;
use anchor_lang::{prelude::*, solana_program::entrypoint::ProgramResult};
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token_2022;
use anchor_spl::token_interface::{Mint, TokenAccount, TokenInterface};

use crate::errors::Errors;
use crate::utils::{calculate_price, POOL_ACCOUNT_SEED};

#[derive(Accounts)]
pub struct BuyToken<'info> {
    /// The payer of the transaction and the signer
    #[account(mut)]
    pub signer: Signer<'info>,

    /// CHECK: Pool authority (used for transfer)
    #[account(
        mut,
        seeds = [POOL_ACCOUNT_SEED, mint.key().as_ref()],
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

fn transfer_sol_to_pool_vault<'a>(
    from: AccountInfo<'a>,
    to: AccountInfo<'a>,
    system_program: AccountInfo<'a>,
    amount: u64,
) -> ProgramResult {
    let cpi_accounts = system_program::Transfer { from, to };
    let cpi_ctx = CpiContext::new(system_program, cpi_accounts);
    system_program::transfer(cpi_ctx, amount)?;
    Ok(())
}

fn transfer_from_pool_vault_to_user<'a>(
    authority: AccountInfo<'a>,
    from_vault: AccountInfo<'a>,
    to: AccountInfo<'a>,
    mint: AccountInfo<'a>,
    token_program: AccountInfo<'a>,
    amount: u64,
    mint_decimals: u8,
    signer_seeds: &[&[&[u8]]],
) -> Result<()> {
    if amount == 0 {
        return Ok(());
    }
    token_2022::transfer_checked(
        CpiContext::new_with_signer(
            token_program.to_account_info(),
            token_2022::TransferChecked {
                from: from_vault,
                to,
                authority,
                mint,
            },
            signer_seeds,
        ),
        amount,
        mint_decimals,
    )
}

pub fn buy_token(ctx: Context<BuyToken>, amount: u64) -> Result<()> {
    // Get the current supply of tokens
    let supply = ctx.accounts.pool_ata.amount;

    // Ensure the requested amount does not exceed available supply
    if amount > supply {
        return Err(Errors::InsufficientTokens.into());
    }

    // Calculate the price for the requested amount
    let price = calculate_price(supply, amount);

    // Check if the signer has enough lamports to cover the price
    let signer_balance = ctx.accounts.signer.lamports();
    if signer_balance < price {
        return Err(ProgramError::InsufficientFunds.into());
    }

    let mint_key = ctx.accounts.mint.key();
    let seeds: &[&[u8]; 3] = &[
        b"pool".as_ref(),
        mint_key.as_ref(),
        &[ctx.bumps.pool_authority],
    ];
    let signer_seeds = &[&seeds[..]];

    transfer_from_pool_vault_to_user(
        ctx.accounts.pool_authority.to_account_info(),
        ctx.accounts.pool_ata.to_account_info(),
        ctx.accounts.payer_ata.to_account_info(),
        ctx.accounts.mint.to_account_info(),
        ctx.accounts.token_program.to_account_info(),
        amount,
        ctx.accounts.mint.decimals,
        signer_seeds,
    )?;

    transfer_sol_to_pool_vault(
        ctx.accounts.signer.to_account_info(),
        ctx.accounts.pool_authority.to_account_info(),
        ctx.accounts.system_program.to_account_info(),
        price,
    )?;

    Ok(())
}
