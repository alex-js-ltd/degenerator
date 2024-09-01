use anchor_lang::{prelude::*, solana_program::entrypoint::ProgramResult};
use anchor_lang::system_program::{Transfer, transfer};
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token_interface::{
    self, Mint, TokenAccount, TokenInterface, TransferChecked,
};
use crate::errors::Errors;

#[derive(Accounts)]
pub struct BuyToken<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        mut,
        seeds = [b"pool", mint.key().as_ref()],
        bump,
    )]
    pub pool_authority: AccountInfo<'info>,

    #[account(mut)]
    pub from: InterfaceAccount<'info, TokenAccount>,

    #[account(
        init_if_needed,
        associated_token::mint = mint,
        payer = signer,
        associated_token::authority = signer
    )]
    pub to_ata: InterfaceAccount<'info, TokenAccount>,

    #[account(mut)]
    pub mint: InterfaceAccount<'info, Mint>,

    pub token_program: Interface<'info, TokenInterface>,

    pub system_program: Program<'info, System>,

    pub associated_token_program: Program<'info, AssociatedToken>,
}

impl<'info> BuyToken<'info> {
    fn transfer_sol(
        &self,
        amount: u64
    ) -> ProgramResult {
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
    let supply = ctx.accounts.from.amount;

    if amount > supply {
        return Err(Errors::InsufficientTokens.into());
    }

    let mint_key = ctx.accounts.mint.key();
    let seeds = &[
        b"pool".as_ref(),
        mint_key.as_ref(),
        &[ctx.bumps.pool_authority],
    ];
    let signer = &[&seeds[..]];

    let cpi_accounts = TransferChecked {
        from: ctx.accounts.from.to_account_info().clone(),
        mint: ctx.accounts.mint.to_account_info().clone(),
        to: ctx.accounts.to_ata.to_account_info().clone(),
        authority: ctx.accounts.pool_authority.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_context = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
    token_interface::transfer_checked(cpi_context, amount, ctx.accounts.mint.decimals)?;
    msg!("Transfer Token");

    ctx.accounts.transfer_sol(100)?;
    Ok(())
}
