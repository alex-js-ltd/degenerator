use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token_interface::{Mint, TokenAccount, TokenInterface};

use crate::errors::Errors;
use crate::state::BondingCurveState;
use crate::utils::{
    calculate_buy_price, set_bonding_curve_state, token_mint_to,
    transfer_sol_to_bonding_curve_vault, BONDING_CURVE_AUTHORITY, BONDING_CURVE_STATE_SEED,
};

#[derive(Accounts)]
pub struct BuyToken<'info> {
    /// The payer of the transaction and the signer
    #[account(mut)]
    pub payer: Signer<'info>,

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
        mint::authority = authority,
    )]
    pub mint: Box<InterfaceAccount<'info, Mint>>,

    /// SPL token program or token program 2022
    pub token_program: Interface<'info, TokenInterface>,

    /// System program
    pub system_program: Program<'info, System>,

    /// Associated token program
    pub associated_token_program: Program<'info, AssociatedToken>,
}

pub fn buy_token(ctx: Context<BuyToken>, amount: u64) -> Result<()> {
    let price = ctx.accounts.bonding_curve_state.buy_price;

    let total_price = price.saturating_mul(amount);

    // Check if the payer has enough lamports to cover the price
    let payer_balance = ctx.accounts.payer.lamports();
    if payer_balance < total_price {
        return Err(ProgramError::InsufficientFunds.into());
    }

    token_mint_to(
        ctx.accounts.authority.to_account_info(),
        ctx.accounts.token_program.to_account_info(),
        ctx.accounts.mint.to_account_info(),
        ctx.accounts.payer_ata.to_account_info(),
        amount,
        ctx.accounts.mint.decimals,
        &[&[
            BONDING_CURVE_AUTHORITY.as_bytes(),
            ctx.accounts.mint.key().as_ref(),
            &[ctx.bumps.authority],
        ]],
    )?;

    // Transfer SOL to pda
    transfer_sol_to_bonding_curve_vault(
        ctx.accounts.payer.to_account_info(),
        ctx.accounts.authority.to_account_info(),
        ctx.accounts.system_program.to_account_info(),
        total_price,
    )?;

    ctx.accounts.mint.reload()?;

    let updated_supply = ctx.accounts.mint.supply;

    // Update bonding curve state
    set_bonding_curve_state(&mut ctx.accounts.bonding_curve_state, updated_supply);

    Ok(())
}
