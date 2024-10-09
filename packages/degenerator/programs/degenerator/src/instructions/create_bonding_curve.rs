use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token_interface::{Mint, TokenAccount, TokenInterface};

use crate::states::{set_bonding_curve_state, BondingCurveState};
use crate::utils::seed::{BONDING_CURVE_AUTHORITY, BONDING_CURVE_STATE_SEED};
use crate::utils::token::update_account_lamports_to_minimum_balance;

pub fn create_bonding_curve(ctx: Context<CreateBondingCurve>) -> Result<()> {
    // transfer minimum rent to pda
    update_account_lamports_to_minimum_balance(
        ctx.accounts.authority.to_account_info(),
        ctx.accounts.payer.to_account_info(),
        ctx.accounts.system_program.to_account_info(),
    )?;

    set_bonding_curve_state(
        &mut ctx.accounts.bonding_curve_state,
        &ctx.accounts.mint.supply,
        &ctx.accounts.authority.lamports(),
    );

    Ok(())
}

#[derive(Accounts)]
pub struct CreateBondingCurve<'info> {
    /// The payer for the transaction
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        mint::token_program = token_program,
        mint::authority = authority,
    )]
    pub mint: Box<InterfaceAccount<'info, Mint>>,

    /// CHECK: pda to control vault_meme_ata & lamports
    #[account(mut,
            seeds = [BONDING_CURVE_AUTHORITY.as_bytes(), mint.key().as_ref()],
            bump,
        )]
    pub authority: AccountInfo<'info>,

    /// pda to store bonding curve state
    #[account(init,
        seeds = [BONDING_CURVE_STATE_SEED.as_bytes(),  mint.key().as_ref()],
        bump,
        payer = payer,
        space = BondingCurveState::LEN
    )]
    pub bonding_curve_state: Account<'info, BondingCurveState>,

    /// Spl token program or token program 2022
    pub token_program: Interface<'info, TokenInterface>,

    /// Associated Token Program
    pub associated_token_program: Program<'info, AssociatedToken>,

    /// System Program
    pub system_program: Program<'info, System>,

    /// Sysvar for program account
    pub rent: Sysvar<'info, Rent>,
}
