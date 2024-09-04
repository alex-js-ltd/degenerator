use anchor_lang::prelude::*;
use anchor_spl::token_2022;
use anchor_spl::token_interface::{Mint, TokenAccount, TokenInterface};

pub fn mint_token(ctx: Context<MintToken>, amount: u64) -> Result<()> {
    token_2022::mint_to(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            token_2022::MintTo {
                to: ctx.accounts.receiver.to_account_info(),
                authority: ctx.accounts.signer.to_account_info(),
                mint: ctx.accounts.mint.to_account_info(),
            },
        ),
        amount,
    )
}

#[derive(Accounts)]
pub struct MintToken<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(mut)]
    pub mint: InterfaceAccount<'info, Mint>,
    #[account(mut)]
    pub receiver: InterfaceAccount<'info, TokenAccount>,
    pub token_program: Interface<'info, TokenInterface>,
}
