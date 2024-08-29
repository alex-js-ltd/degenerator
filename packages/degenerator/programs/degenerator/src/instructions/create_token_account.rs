

use anchor_lang::prelude::*;
use anchor_spl::token_interface::{
 Mint, TokenAccount, TokenInterface, 
};

pub fn create_token_account(_ctx: Context<CreateTokenAccount>) -> Result<()> {
    msg!("Create Token Account");
    Ok(())
}


#[derive(Accounts)]
pub struct CreateTokenAccount<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    pub mint: InterfaceAccount<'info, Mint>,
    #[account(
        init,
        token::mint = mint,
        token::authority = signer,
        payer = signer,
        seeds = [b"token-2022-token-account", signer.key().as_ref(), mint.key().as_ref()],
        bump,
    )]
    pub token_account: InterfaceAccount<'info, TokenAccount>,
    pub system_program: Program<'info, System>,
    pub token_program: Interface<'info, TokenInterface>,
}

