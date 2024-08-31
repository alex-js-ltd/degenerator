use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token_interface::{
    self, Mint, TokenAccount, TokenInterface, TransferChecked,
};

pub fn buy_token(ctx: Context<BuyToken>, amount: u64) -> Result<()> {
    let mint_key = ctx.accounts.mint.key();
    let seeds = &[
        b"pool".as_ref(),
        mint_key.as_ref(),
        &[ctx.bumps.pda],
    ];
    let signer = &[&seeds[..]];

    let cpi_accounts = TransferChecked {
        from: ctx.accounts.from.to_account_info().clone(),
        mint: ctx.accounts.mint.to_account_info().clone(),
        to: ctx.accounts.to_ata.to_account_info().clone(),
        authority: ctx.accounts.pda.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_context = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
    token_interface::transfer_checked(cpi_context, amount, ctx.accounts.mint.decimals)?;
    msg!("Transfer Token");


    Ok(())
}

#[derive(Accounts)]
pub struct BuyToken<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut,
        seeds = [b"pool", mint.key().as_ref()],
        bump,
    )]
    pub pda: AccountInfo<'info>,
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
