use anchor_lang::system_program::{transfer, Transfer};
use anchor_lang::{prelude::*, solana_program::entrypoint::ProgramResult};
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token_interface::{self, Mint, TokenAccount, TokenInterface, TransferChecked};

use crate::errors::Errors;
use crate::utils::{calculate_price, get_pool_bump, POOL_ACCOUNT_SEED};

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

impl<'info> SellToken<'info> {
    /// Transfers SOL to the pool authority
    fn transfer_token(&self, amount: u64) -> ProgramResult {
        let cpi_accounts = TransferChecked {
            from: self.payer_ata.to_account_info(),
            mint: self.mint.to_account_info(),
            to: self.pool_ata.to_account_info(),
            authority: self.signer.to_account_info(),
        };
        let cpi_program = self.token_program.to_account_info();
        let cpi_context = CpiContext::new(cpi_program, cpi_accounts);

        token_interface::transfer_checked(cpi_context, amount, self.mint.decimals)?;
        Ok(())
    }

    fn transfer_sol(&self, amount: u64) -> ProgramResult {
        let mint_key = self.mint.key();
        let bump = get_pool_bump(mint_key);
        let seeds = &[b"pool".as_ref(), mint_key.as_ref(), &[bump]];
        let signer = &[&seeds[..]];

        // Perform the transfer of SOL from the pool authority to the signer
        let cpi_accounts = Transfer {
            from: self.pool_authority.to_account_info(),
            to: self.signer.to_account_info(),
        };
        let cpi_ctx = CpiContext::new_with_signer(
            self.system_program.to_account_info(),
            cpi_accounts,
            signer,
        );
        transfer(cpi_ctx, amount)?;
        Ok(())
    }
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

    // Transfer the tokens
    ctx.accounts.transfer_token(amount)?;
    ctx.accounts.transfer_sol(price)?;

    Ok(())
}
