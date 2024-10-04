use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token_interface::{Mint, TokenAccount, TokenInterface};

use crate::errors::Errors;
use crate::utils::{
    calculate_buy_price, set_bonding_curve_state, transfer_from_bonding_curve_vault_to_user,
    transfer_sol_to_bonding_curve_vault, BONDING_CURVE_STATE_SEED, MEME_VAULT_SEED, SOL_VAULT_SEED,
};

use crate::state::BondingCurveState;

#[derive(Accounts)]
pub struct BuyToken<'info> {
    /// The payer of the transaction and the signer
    #[account(mut)]
    pub payer: Signer<'info>,

    /// CHECK: pda to control bonding_curve_vault_ata & store lamports
    #[account(
        mut,
        seeds = [MEME_VAULT_SEED.as_bytes(), token_1_mint.key().as_ref()],
        bump,
    )]
    pub meme_vault: AccountInfo<'info>,

    /// CHECK: pda to control sol
    #[account(mut,
        seeds = [SOL_VAULT_SEED.as_bytes(), token_1_mint.key().as_ref()],
            bump,
        )]
    pub sol_vault: AccountInfo<'info>,

    /// CHECK: pda to store current price
    #[account(
            mut,
            seeds = [BONDING_CURVE_STATE_SEED.as_bytes(), token_1_mint.key().as_ref()],
            bump,
        )]
    pub bonding_curve_state: Account<'info, BondingCurveState>,

    /// Token account from which the tokens will be transferred
    #[account(mut)]
    pub meme_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    /// Token account to which the tokens will be transferred (created if needed)
    #[account(
        init_if_needed,
        associated_token::mint = token_1_mint,
        payer = payer,
        associated_token::authority = payer,
        associated_token::token_program = token_1_program
     
    )]
    pub payer_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    /// Mint associated with the token
    #[account(
        mint::token_program = token_1_program,
    )]
    pub token_1_mint: Box<InterfaceAccount<'info, Mint>>,

    /// Spl token program or token program 2022
    pub token_1_program: Interface<'info, TokenInterface>,

    /// System program
    pub system_program: Program<'info, System>,

    /// Associated token program
    pub associated_token_program: Program<'info, AssociatedToken>,
}

pub fn buy_token(ctx: Context<BuyToken>, amount: u64) -> Result<()> {
    let total_supply = ctx.accounts.bonding_curve_state.total_supply;

    let price = calculate_buy_price(
        ctx.accounts.meme_ata.amount as u128,
        total_supply as u128,
        amount as u128,
    );

    // Ensure the requested amount does not exceed available supply
    if amount > ctx.accounts.meme_ata.amount {
        return Err(Errors::InsufficientTokens.into());
    }

    // Check if the payer has enough lamports to cover the price
    let payer_balance = ctx.accounts.payer.lamports();
    if payer_balance < price {
        return Err(ProgramError::InsufficientFunds.into());
    }

    transfer_from_bonding_curve_vault_to_user(
        ctx.accounts.meme_vault.to_account_info(),
        ctx.accounts.meme_ata.to_account_info(),
        ctx.accounts.payer_ata.to_account_info(),
        ctx.accounts.token_1_mint.to_account_info(),
        ctx.accounts.token_1_program.to_account_info(),
        amount,
        ctx.accounts.token_1_mint.decimals,
        &[&[
            MEME_VAULT_SEED.as_bytes(),
            ctx.accounts.token_1_mint.key().as_ref(),
            &[ctx.bumps.meme_vault][..],
        ][..]],
    )?;

    transfer_sol_to_bonding_curve_vault(
        ctx.accounts.payer.to_account_info(),
        ctx.accounts.sol_vault.to_account_info(),
        ctx.accounts.system_program.to_account_info(),
        price,
    )?;

    ctx.accounts.meme_ata.reload()?;

    let current_supply = ctx.accounts.meme_ata.amount as u128;
    let total_supply = ctx.accounts.bonding_curve_state.total_supply as u128;

    set_bonding_curve_state(
        &mut ctx.accounts.bonding_curve_state,
        current_supply,
        total_supply,
    );

    Ok(())
}
