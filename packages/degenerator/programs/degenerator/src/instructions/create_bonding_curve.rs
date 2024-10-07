use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token_interface::{Mint, TokenAccount, TokenInterface};

use crate::utils::{
    set_bonding_curve_state, update_account_lamports_to_minimum_balance,
    BONDING_CURVE_MINT_AUTHORITY, BONDING_CURVE_STATE_SEED, BONDING_CURVE_VAULT_SEED,
};

use crate::state::BondingCurveState;

pub fn create_bonding_curve(ctx: Context<CreateBondingCurve>) -> Result<()> {
    // transfer minimum rent to sol vault
    update_account_lamports_to_minimum_balance(
        ctx.accounts.mint_authority.to_account_info(),
        ctx.accounts.payer.to_account_info(),
        ctx.accounts.system_program.to_account_info(),
    )?;

    // transfer minimum rent to sol vault
    update_account_lamports_to_minimum_balance(
        ctx.accounts.vault.to_account_info(),
        ctx.accounts.payer.to_account_info(),
        ctx.accounts.system_program.to_account_info(),
    )?;

    let current_supply = ctx.accounts.mint.supply as u128;

    set_bonding_curve_state(&mut ctx.accounts.bonding_curve_state, current_supply);

    Ok(())
}

#[derive(Accounts)]
pub struct CreateBondingCurve<'info> {
    /// The payer for the transaction
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        mint::token_program = token_program,
        mint::authority = mint_authority,
    )]
    pub mint: Box<InterfaceAccount<'info, Mint>>,

    /// CHECK: pda to control vault_meme_ata & lamports
    #[account(mut,
            seeds = [BONDING_CURVE_MINT_AUTHORITY.as_bytes(), mint.key().as_ref()],
            bump,
        )]
    pub mint_authority: AccountInfo<'info>,

    /// CHECK: pda to store lamports
    #[account(mut,
        seeds = [BONDING_CURVE_VAULT_SEED.as_bytes(), mint.key().as_ref()],
        bump,
    )]
    pub vault: AccountInfo<'info>,

    /// pda to store bonding curve state
    #[account(init,
        seeds = [BONDING_CURVE_STATE_SEED.as_bytes(),  mint.key().as_ref()],
        bump,
        payer = payer,
        space = BondingCurveState::LEN
    )]
    pub bonding_curve_state: Account<'info, BondingCurveState>,

    /// ata to burn tokens
    #[account(
            init,
            associated_token::mint = mint,
            payer = payer,
            associated_token::authority = mint_authority,
            associated_token::token_program = token_program,
        )]
    pub burn_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    /// Spl token program or token program 2022
    pub token_program: Interface<'info, TokenInterface>,

    /// Associated Token Program
    pub associated_token_program: Program<'info, AssociatedToken>,

    /// System Program
    pub system_program: Program<'info, System>,

    /// Sysvar for program account
    pub rent: Sysvar<'info, Rent>,
}
