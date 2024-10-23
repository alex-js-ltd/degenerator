use anchor_lang::prelude::*;

use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token_interface::{Mint, TokenAccount, TokenInterface};

use crate::states::{
    calculate_buy_amount, calculate_progress, get_swap_event, set_bonding_curve_state, ActionType,
    BondingCurveState, BASE_PRICE, SLOPE,
};
use crate::utils::seed::{BONDING_CURVE_STATE_SEED, BONDING_CURVE_VAULT_SEED};
use crate::utils::token::{
    get_account_balance, token_mint_to, transfer_sol_to_bonding_curve_vault,
};

#[derive(Accounts)]
pub struct BuyToken<'info> {
    /// The payer of the transaction and the signer
    #[account(mut)]
    pub payer: Signer<'info>,

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

    /// Token account to which the tokens will be transferred (created if needed)
    #[account(
        init_if_needed,
        associated_token::mint = mint,
        payer = payer,
        associated_token::authority = payer,
        associated_token::token_program = token_program,
    )]
    pub payer_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    /// Mint associated with the token
    #[account(mut,
        mint::token_program = token_program,
        mint::authority = vault,
    )]
    pub mint: Box<InterfaceAccount<'info, Mint>>,

    /// SPL token program or token program 2022
    pub token_program: Interface<'info, TokenInterface>,

    /// System program
    pub system_program: Program<'info, System>,

    /// Associated token program
    pub associated_token_program: Program<'info, AssociatedToken>,
}

pub fn buy_token(ctx: Context<BuyToken>, lamports: u64) -> Result<()> {
    let mint_amount = calculate_buy_amount(
        ctx.accounts.bonding_curve_state.reserve_balance,
        ctx.accounts.mint.decimals,
        lamports,
    )?;

    if ctx.accounts.payer.lamports() < lamports {
        return Err(ProgramError::InsufficientFunds.into());
    }

    token_mint_to(
        ctx.accounts.vault.to_account_info(),
        ctx.accounts.token_program.to_account_info(),
        ctx.accounts.mint.to_account_info(),
        ctx.accounts.payer_ata.to_account_info(),
        mint_amount,
        &[&[
            BONDING_CURVE_VAULT_SEED.as_bytes(),
            ctx.accounts.mint.key().as_ref(),
            &[ctx.bumps.vault],
        ]],
    )?;

    // Transfer SOL to pda
    transfer_sol_to_bonding_curve_vault(
        ctx.accounts.payer.to_account_info(),
        ctx.accounts.vault.to_account_info(),
        ctx.accounts.system_program.to_account_info(),
        lamports,
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
        mint_amount,
        lamports,
        ActionType::Buy,
    )?;

    emit!(event);

    Ok(())
}
