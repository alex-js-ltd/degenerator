use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token_interface::{Mint, TokenAccount, TokenInterface};

use crate::errors::Errors;
use crate::utils::{
    calculate_sell_price, set_bonding_curve_state, transfer_from_user_to_bonding_curve_vault,
    transfer_sol_to_user, BONDING_CURVE_STATE_SEED, MEME_VAULT_SEED,
};

use crate::state::BondingCurveState;

#[derive(Accounts)]
pub struct SellToken<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut)]
    pub payer_ata: InterfaceAccount<'info, TokenAccount>,
    /// CHECK: pda to control bonding_curve_vault_ata & store lamports
    #[account(
        mut,
        seeds = [MEME_VAULT_SEED.as_bytes(), mint.key().as_ref()],
        bump,
    )]
    pub bonding_curve_vault: AccountInfo<'info>,

    /// CHECK: pda to store current price
    #[account(
            mut,
            seeds = [BONDING_CURVE_STATE_SEED.as_bytes(), mint.key().as_ref()],
            bump,
        )]
    pub bonding_curve_state: Account<'info, BondingCurveState>,

    #[account(
        init_if_needed,
        associated_token::mint = mint,
        payer = signer,
        associated_token::authority = bonding_curve_vault
    )]
    pub bonding_curve_vault_ata: InterfaceAccount<'info, TokenAccount>,

    /// Mint associated with the token
    #[account(mut)]
    pub mint: InterfaceAccount<'info, Mint>,

    /// Token program
    pub token_program: Interface<'info, TokenInterface>,

    /// System program
    pub system_program: Program<'info, System>,

    /// Associated token program
    pub associated_token_program: Program<'info, AssociatedToken>,
}

pub fn sell_token(ctx: Context<SellToken>, amount: u64) -> Result<()> {
    let total_supply = ctx.accounts.bonding_curve_state.total_supply;

    let price = calculate_sell_price(
        ctx.accounts.bonding_curve_vault_ata.amount as u128,
        total_supply as u128,
        amount as u128,
    );
    // Get the current supply of tokens
    let user_supply = ctx.accounts.payer_ata.amount;

    // Ensure the requested amount does not exceed available supply
    if amount > user_supply {
        return Err(Errors::InsufficientTokens.into());
    }

    let pool_balance = ctx.accounts.bonding_curve_vault.lamports(); // Access lamports in pool vault

    if pool_balance < price {
        return Err(ProgramError::InsufficientFunds.into());
    }

    // Transfer the tokens
    transfer_from_user_to_bonding_curve_vault(
        ctx.accounts.signer.to_account_info(),
        ctx.accounts.payer_ata.to_account_info(),
        ctx.accounts.bonding_curve_vault_ata.to_account_info(),
        ctx.accounts.mint.to_account_info(),
        ctx.accounts.token_program.to_account_info(),
        amount,
        ctx.accounts.mint.decimals,
    )?;

    transfer_sol_to_user(
        ctx.accounts.bonding_curve_vault.to_account_info(),
        ctx.accounts.signer.to_account_info(),
        ctx.accounts.system_program.to_account_info(),
        price,
        &[&[
            MEME_VAULT_SEED.as_bytes(),
            ctx.accounts.mint.key().as_ref(),
            &[ctx.bumps.bonding_curve_vault][..],
        ][..]],
    )?;

    ctx.accounts.bonding_curve_vault_ata.reload()?;

    let current_supply = ctx.accounts.bonding_curve_vault_ata.amount as u128;
    let total_supply = ctx.accounts.bonding_curve_state.total_supply as u128;

    set_bonding_curve_state(
        &mut ctx.accounts.bonding_curve_state,
        current_supply,
        total_supply,
    );

    Ok(())
}
