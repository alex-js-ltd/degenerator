use crate::error::ErrorCode;
use crate::states::{
    calculate_progress, calculate_sell_price, get_swap_event, set_bonding_curve_state, ActionType,
    BondingCurveState, BASE_PRICE, SLOPE,
};
use crate::utils::seed::{BONDING_CURVE_STATE_SEED, BONDING_CURVE_VAULT_SEED};
use crate::utils::token::{
    get_account_balance, token_approve_burn, token_burn, transfer_sol_to_user,
};
use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token_interface::{Mint, TokenAccount, TokenInterface};

#[derive(Accounts)]
pub struct SellToken<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    /// CHECK: pda to control vault_meme_ata & lamports
    #[account(mut,
            seeds = [BONDING_CURVE_VAULT_SEED.as_bytes(), mint.key().as_ref()],
            bump,
        )]
    pub vault: AccountInfo<'info>,

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
        mint::authority = vault,
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

pub fn sell_token(ctx: Context<SellToken>, burn_amount: u64) -> Result<()> {
    let lamports = calculate_sell_price(
        ctx.accounts.bonding_curve_state.current_supply,
        ctx.accounts.bonding_curve_state.mint_decimals,
        burn_amount,
    )?;

    if burn_amount > ctx.accounts.payer_ata.amount {
        return Err(ErrorCode::InsufficientUserSupply.into());
    }

    if lamports > ctx.accounts.bonding_curve_state.reserve_balance {
        return Err(ProgramError::InsufficientFunds.into());
    }

    token_approve_burn(
        ctx.accounts.token_program.to_account_info(),
        ctx.accounts.payer_ata.to_account_info(),
        ctx.accounts.vault.to_account_info(),
        ctx.accounts.signer.to_account_info(),
        burn_amount,
    )?;

    // burn tokens
    token_burn(
        ctx.accounts.vault.to_account_info(),
        ctx.accounts.token_program.to_account_info(),
        ctx.accounts.mint.to_account_info(),
        ctx.accounts.payer_ata.to_account_info(),
        burn_amount,
        &[&[
            BONDING_CURVE_VAULT_SEED.as_bytes(),
            ctx.accounts.mint.key().as_ref(),
            &[ctx.bumps.vault][..],
        ][..]],
    )?;

    transfer_sol_to_user(
        ctx.accounts.vault.to_account_info(),
        ctx.accounts.signer.to_account_info(),
        ctx.accounts.system_program.to_account_info(),
        lamports,
        &[&[
            BONDING_CURVE_VAULT_SEED.as_bytes(),
            ctx.accounts.mint.key().as_ref(),
            &[ctx.bumps.vault][..],
        ][..]],
    )?;

    msg!("supply before: {}", ctx.accounts.mint.supply);

    ctx.accounts.mint.reload()?;

    msg!("supply after: {}", ctx.accounts.mint.supply);

    let vault_balance = get_account_balance(ctx.accounts.vault.to_account_info())?;

    let progress = calculate_progress(vault_balance)?;

    let payload = BondingCurveState {
        mint: ctx.accounts.mint.key(),
        slope: SLOPE,
        base_price: BASE_PRICE,
        current_supply: ctx.accounts.mint.supply,
        reserve_balance: vault_balance,
        mint_decimals: ctx.accounts.mint.decimals,
        progress,
    };

    set_bonding_curve_state(&mut ctx.accounts.bonding_curve_state, payload)?;

    let event = get_swap_event(
        ctx.accounts.mint.to_account_info(),
        ctx.accounts.mint.decimals,
        burn_amount,
        lamports,
        ActionType::Sell,
    )?;

    emit!(event);

    Ok(())
}
