use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token_interface::{Mint, TokenAccount, TokenInterface};

use crate::errors::Errors;
use crate::utils::{
    calculate_sell_price, set_bonding_curve_state, token_burn, transfer_from_user_to_bonding_curve,
    transfer_sol_to_user, BONDING_CURVE_AUTHORITY, BONDING_CURVE_STATE_SEED,
};

use crate::state::BondingCurveState;

#[derive(Accounts)]
pub struct SellToken<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    /// CHECK: pda to control vault_meme_ata & lamports
    #[account(mut,
            seeds = [BONDING_CURVE_AUTHORITY.as_bytes(), mint.key().as_ref()],
            bump,
        )]
    pub authority: AccountInfo<'info>,

    /// CHECK: pda to store current price
    #[account(
        mut,
        seeds = [BONDING_CURVE_STATE_SEED.as_bytes(), mint.key().as_ref()],
        bump,
    )]
    pub bonding_curve_state: Account<'info, BondingCurveState>,

    /// Mint associated with the token
    #[account(mut,
        mint::token_program = token_program,
        mint::authority = authority,
    )]
    pub mint: Box<InterfaceAccount<'info, Mint>>,

    /// Token account the tokens will be transferred from
    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = signer,
        associated_token::token_program = token_program,
    )]
    pub payer_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    /// ata to burn tokens
    #[account(
            mut,
            associated_token::mint = mint,
            associated_token::authority = authority,
            associated_token::token_program = token_program,
        )]
    pub burn_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    /// Token program
    pub token_program: Interface<'info, TokenInterface>,

    /// System program
    pub system_program: Program<'info, System>,

    /// Associated token program
    pub associated_token_program: Program<'info, AssociatedToken>,
}

pub fn sell_token(ctx: Context<SellToken>, amount: u64) -> Result<()> {
    let supply = ctx.accounts.mint.supply;

    let price = calculate_sell_price(supply, amount);

    let user_supply = ctx.accounts.payer_ata.amount;

    let pda_balance = ctx.accounts.authority.lamports();

    // Ensure the requested amount does not exceed available supply
    if amount > user_supply {
        return Err(Errors::InsufficientUserSupply.into());
    }

    // Ensure the requested amount does not exceed available supply
    if price > pda_balance {
        return Err(ProgramError::InsufficientFunds.into());
    }

    // transfer the tokens
    transfer_from_user_to_bonding_curve(
        ctx.accounts.signer.to_account_info(),
        ctx.accounts.payer_ata.to_account_info(),
        ctx.accounts.burn_ata.to_account_info(),
        ctx.accounts.mint.to_account_info(),
        ctx.accounts.token_program.to_account_info(),
        amount,
        ctx.accounts.mint.decimals,
    )?;

    // burn tokens
    token_burn(
        ctx.accounts.authority.to_account_info(),
        ctx.accounts.token_program.to_account_info(),
        ctx.accounts.mint.to_account_info(),
        ctx.accounts.burn_ata.to_account_info(),
        amount,
        ctx.accounts.mint.decimals,
        &[&[
            BONDING_CURVE_AUTHORITY.as_bytes(),
            ctx.accounts.mint.key().as_ref(),
            &[ctx.bumps.authority][..],
        ][..]],
    )?;

    transfer_sol_to_user(
        ctx.accounts.authority.to_account_info(),
        ctx.accounts.signer.to_account_info(),
        ctx.accounts.system_program.to_account_info(),
        price,
        &[&[
            BONDING_CURVE_AUTHORITY.as_bytes(),
            ctx.accounts.mint.key().as_ref(),
            &[ctx.bumps.authority][..],
        ][..]],
    )?;

    ctx.accounts.mint.reload()?;

    let updated_supply = ctx.accounts.mint.supply;

    // Update bonding curve state
    set_bonding_curve_state(&mut ctx.accounts.bonding_curve_state, updated_supply);

    Ok(())
}
