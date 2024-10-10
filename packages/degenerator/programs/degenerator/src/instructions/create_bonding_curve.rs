use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token_interface::{spl_token_2022, Mint, TokenAccount, TokenInterface};

use crate::states::{set_bonding_curve_state, BondingCurveState};
use crate::utils::seed::{BONDING_CURVE_STATE_SEED, BONDING_CURVE_VAULT_SEED};
use crate::utils::token::{
    get_account_balance, token_mint_to, transfer_sol_to_bonding_curve_vault,
    update_account_lamports_to_minimum_balance,
};

pub fn create_bonding_curve(ctx: Context<CreateBondingCurve>) -> Result<()> {
    // transfer minimum rent to pda
    update_account_lamports_to_minimum_balance(
        ctx.accounts.vault.to_account_info(),
        ctx.accounts.payer.to_account_info(),
        ctx.accounts.system_program.to_account_info(),
    )?;

    let mint_liquidity = spl_token_2022::ui_amount_to_amount(1 as f64, ctx.accounts.mint.decimals);

    let vault_liquidity =
        spl_token_2022::ui_amount_to_amount(0.000000001 as f64, ctx.accounts.mint.decimals);

    token_mint_to(
        ctx.accounts.vault.to_account_info(),
        ctx.accounts.token_program.to_account_info(),
        ctx.accounts.mint.to_account_info(),
        ctx.accounts.vault_ata.to_account_info(),
        mint_liquidity,
        &[&[
            BONDING_CURVE_VAULT_SEED.as_bytes(),
            ctx.accounts.mint.key().as_ref(),
            &[ctx.bumps.vault],
        ]],
    )?;

    transfer_sol_to_bonding_curve_vault(
        ctx.accounts.payer.to_account_info(),
        ctx.accounts.vault.to_account_info(),
        ctx.accounts.system_program.to_account_info(),
        vault_liquidity,
    )?;

    ctx.accounts.mint.reload()?;

    set_bonding_curve_state(
        &mut ctx.accounts.bonding_curve_state,
        &ctx.accounts.mint.supply,
        &get_account_balance(ctx.accounts.vault.to_account_info())?,
    )?;

    Ok(())
}

#[derive(Accounts)]
pub struct CreateBondingCurve<'info> {
    /// The payer for the transaction
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        mint::token_program = token_program,
        mint::authority = vault,
    )]
    pub mint: Box<InterfaceAccount<'info, Mint>>,

    /// CHECK: pda to control vault_meme_ata & lamports
    #[account(mut,
            seeds = [BONDING_CURVE_VAULT_SEED.as_bytes(), mint.key().as_ref()],
            bump,
        )]
    pub vault: AccountInfo<'info>,

    #[account(
        init,
        associated_token::mint = mint,
        payer = payer,
        associated_token::authority = vault,
        associated_token::token_program = token_program,
    )]
    pub vault_ata: Box<InterfaceAccount<'info, TokenAccount>>,

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
