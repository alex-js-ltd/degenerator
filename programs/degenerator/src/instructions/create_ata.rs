use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token_interface::{
   Mint, TokenAccount, TokenInterface, 
};


pub fn create_ata(
    _ctx: Context<CreateAssociatedTokenAccount>,
) -> Result<()> {
    msg!("Create Associated Token Account");
    Ok(())
}


#[derive(Accounts)]
pub struct CreateAssociatedTokenAccount<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    pub mint: InterfaceAccount<'info, Mint>,
    #[account(
        init,
        associated_token::mint = mint,
        payer = signer,
        associated_token::authority = signer,
    
    )]
    pub token_account: InterfaceAccount<'info, TokenAccount>,
    pub system_program: Program<'info, System>,
    pub token_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}



