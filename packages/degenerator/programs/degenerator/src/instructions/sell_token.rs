use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token_interface::{Mint, TokenAccount, TokenInterface};

use crate::error::ErrorCode;
use crate::states::{calculate_sell_price, set_bonding_curve_state, BondingCurveState};
use crate::utils::seed::{BONDING_CURVE_AUTHORITY, BONDING_CURVE_STATE_SEED};
use crate::utils::token::{
    token_approve_burn, token_burn, token_ui_amount_to_amount, transfer_sol_to_user,
    update_account_lamports_to_minimum_balance,
};

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

    /// Token program
    pub token_program: Interface<'info, TokenInterface>,

    /// System program
    pub system_program: Program<'info, System>,

    /// Associated token program
    pub associated_token_program: Program<'info, AssociatedToken>,
}

pub fn sell_token(ctx: Context<SellToken>, ui_amount: String) -> Result<()> {
    let amount = token_ui_amount_to_amount(
        ctx.accounts.token_program.to_account_info(),
        ctx.accounts.mint.to_account_info(),
        &ui_amount,
    )?;
    msg!("sell amount: {}", amount);

    let supply = ctx.accounts.mint.supply;

    let price = calculate_sell_price(supply, amount);
    msg!("sell price: {}", price);
    let user_supply = ctx.accounts.payer_ata.amount;

    let pda_balance = ctx.accounts.authority.lamports();

    // Ensure the requested amount does not exceed available supply
    if amount > user_supply {
        return Err(ErrorCode::InsufficientUserSupply.into());
    }

    // Ensure the requested amount does not exceed available supply
    // if price > pda_balance {
    //     return Err(ProgramError::InsufficientFunds.into());
    // }

    update_account_lamports_to_minimum_balance(
        ctx.accounts.authority.to_account_info(),
        ctx.accounts.signer.to_account_info(),
        ctx.accounts.system_program.to_account_info(),
    )?;

    token_approve_burn(
        ctx.accounts.token_program.to_account_info(),
        ctx.accounts.payer_ata.to_account_info(),
        ctx.accounts.authority.to_account_info(),
        ctx.accounts.signer.to_account_info(),
        amount,
    )?;

    // burn tokens
    token_burn(
        ctx.accounts.authority.to_account_info(),
        ctx.accounts.token_program.to_account_info(),
        ctx.accounts.mint.to_account_info(),
        ctx.accounts.payer_ata.to_account_info(),
        amount,
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

    set_bonding_curve_state(
        &mut ctx.accounts.bonding_curve_state,
        &ctx.accounts.mint.supply,
        &ctx.accounts.authority.lamports(),
    );

    Ok(())
}
