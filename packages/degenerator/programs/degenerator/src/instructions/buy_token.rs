use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token_interface::{Mint, TokenInterface, TokenAccount, transfer_checked, TransferCheckedBumps};
use crate::errors::Errors;


/// Buy tokens from the pool using an inverse linear bonding curve.
/// The price per token increases as the current supply decreases.
pub fn buy_token(ctx: Context<BuyToken>, amount: u64) -> Result<()> {
    // Get the current supply of tokens in the pool
    let current_supply = ctx.accounts.pool_token_account.amount;

   
    // Ensure there are enough tokens available in the pool
    if amount > current_supply {
        return Err(Errors::InsufficientTokens.into());
    }




    Ok(())
}

#[derive(Accounts)]
pub struct BuyToken<'info> {
    /// The buyer of the tokens, must sign the transaction
    #[account(mut)]
    pub buyer: Signer<'info>,

    /// The PDA that controls the pool's token account
    #[account(
        mut,
        seeds = [b"pool".as_ref(), mint.key().as_ref()],
        bump,
    )]
    pub pda: AccountInfo<'info>,

    /// The token account controlled by the pool (from which tokens are withdrawn)
    #[account(mut)]
    pub pool_token_account: InterfaceAccount<'info, TokenAccount>,

    /// The token account for the buyer. Initialized if needed
    #[account(
        init_if_needed,
        payer = buyer,
        associated_token::mint = mint,
        associated_token::authority = buyer,
    )]
    pub buyer_token_account: InterfaceAccount<'info, TokenAccount>,

    /// The mint account for the tokens
    pub mint: InterfaceAccount<'info, Mint>,

    /// The token program used for token operations
    pub token_program: Interface<'info, TokenInterface>,

    /// The system program (needed for account initialization)
    pub system_program: Program<'info, System>,

    /// The associated token program (used for managing associated token accounts)
    pub associated_token_program: Program<'info, AssociatedToken>,
}
