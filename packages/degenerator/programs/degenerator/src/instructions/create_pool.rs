use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token_interface::{Mint, TokenAccount, TokenInterface};

pub fn create_pool(_ctx: Context<CreatePool>) -> Result<()> {
    Ok(())
}

#[derive(Accounts)]
pub struct CreatePool<'info> {
    /// The payer for the transaction
    #[account(mut)]
    pub payer: Signer<'info>,

    /// The PDA that will control the ATA
    /// PDA seeds can be anything; this is just an example.
    /// Make sure to use the same seeds when signing the transaction.
    #[account(
        seeds = [b"pool", mint.key().as_ref()],
        bump,
    )]
    pub pda: AccountInfo<'info>,

    /// The Mint for which the ATA is being created
    pub mint: InterfaceAccount<'info, Mint>,

    /// The ATA that will be created
    #[account(
        init,
        payer = payer,
        associated_token::mint = mint,
        associated_token::authority = pda,
    )]
    pub token_account: InterfaceAccount<'info, TokenAccount>,

    /// System Program
    pub system_program: Program<'info, System>,

    /// Rent Sysvar
    pub rent: Sysvar<'info, Rent>,

    /// Token Program
    pub token_program: Interface<'info, TokenInterface>,

    /// Associated Token Program
    pub associated_token_program: Program<'info, AssociatedToken>,
}
