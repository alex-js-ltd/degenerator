use anchor_lang::system_program::{transfer, Transfer};
use anchor_lang::{prelude::*, solana_program::entrypoint::ProgramResult};
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token_interface::{self, Mint, TokenAccount, TokenInterface, TransferChecked};

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

impl<'info> BuyToken<'info> {
    /// Transfers SOL to the pool authority
    fn transfer_sol(&self, amount: u64) -> ProgramResult {
        let cpi_accounts = Transfer {
            from: self.signer.to_account_info(),
            to: self.pool_authority.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(self.system_program.to_account_info(), cpi_accounts);
        transfer(cpi_ctx, amount)?;
        Ok(())
    }
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

    // Prepare CPI accounts and context for token transfer
    let mint_key = ctx.accounts.mint.key();
    let seeds = &[
        b"pool".as_ref(),
        mint_key.as_ref(),
        &[ctx.bumps.pool_authority],
    ];
    let signer = &[&seeds[..]];

    let cpi_accounts = TransferChecked {
        from: ctx.accounts.pool_ata.to_account_info().clone(),
        mint: ctx.accounts.mint.to_account_info().clone(),
        to: ctx.accounts.payer_ata.to_account_info().clone(),
        authority: ctx.accounts.pool_authority.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_context = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);

    // Transfer tokens
    token_interface::transfer_checked(cpi_context, amount, ctx.accounts.mint.decimals)?;
    msg!("Transfer Token");

    // Transfer SOL to the pool authority
    ctx.accounts.transfer_sol(price)?;
    Ok(())
}
