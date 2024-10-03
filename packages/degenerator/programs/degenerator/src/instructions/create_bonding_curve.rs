use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token_interface::{Mint, TokenAccount, TokenInterface};

use crate::utils::{
    set_bonding_curve_state, token_mint_to, update_account_lamports_to_minimum_balance,
    BONDING_CURVE_HODL_SEED, BONDING_CURVE_STATE_SEED, BONDING_CURVE_VAULT_SEED,
};

use crate::state::BondingCurveState;

pub fn create_bonding_curve(ctx: Context<CreateBondingCurve>, amount: u64) -> Result<()> {
    // transfer minimum rent to pool account
    update_account_lamports_to_minimum_balance(
        ctx.accounts.bonding_curve_vault.to_account_info(),
        ctx.accounts.payer.to_account_info(),
        ctx.accounts.system_program.to_account_info(),
    )?;

    update_account_lamports_to_minimum_balance(
        ctx.accounts.bonding_curve_hodl.to_account_info(),
        ctx.accounts.payer.to_account_info(),
        ctx.accounts.system_program.to_account_info(),
    )?;

    let eighty_percent = amount.saturating_mul(80).saturating_div(100);
    let twenty_percent = amount.saturating_mul(20).saturating_div(100);

    // mint 80% to bonding curve vault
    token_mint_to(
        ctx.accounts.payer.to_account_info(),
        ctx.accounts.token_program_2022.to_account_info(),
        ctx.accounts.mint.to_account_info(),
        ctx.accounts.bonding_curve_vault_ata.to_account_info(),
        eighty_percent,
        ctx.accounts.mint.decimals,
    )?;

    // mint 20% to hodl address
    token_mint_to(
        ctx.accounts.payer.to_account_info(),
        ctx.accounts.token_program_2022.to_account_info(),
        ctx.accounts.mint.to_account_info(),
        ctx.accounts.bonding_curve_hodl_ata.to_account_info(),
        twenty_percent,
        ctx.accounts.mint.decimals,
    )?;

    ctx.accounts.mint.reload()?;
    ctx.accounts.bonding_curve_vault_ata.reload()?;
    ctx.accounts.bonding_curve_hodl_ata.reload()?;

    let current_supply = ctx.accounts.bonding_curve_vault_ata.amount as u128;
    let total_supply = ctx.accounts.bonding_curve_vault_ata.amount as u128;

    set_bonding_curve_state(
        &mut ctx.accounts.bonding_curve_state,
        current_supply,
        total_supply,
    );

    Ok(())
}

#[derive(Accounts)]
pub struct CreateBondingCurve<'info> {
    /// The payer for the transaction
    #[account(mut)]
    pub payer: Signer<'info>,

    /// CHECK: pda to control bonding_curve_vault_ata & store lamports
    #[account(mut,
        seeds = [BONDING_CURVE_VAULT_SEED.as_bytes(), mint.key().as_ref()],
        bump,
    )]
    pub bonding_curve_vault: AccountInfo<'info>,

    /// CHECK: pda to hodl tokens for the raydium pool
    #[account(mut,
            seeds = [BONDING_CURVE_HODL_SEED.as_bytes(), mint.key().as_ref()],
            bump,
        )]
    pub bonding_curve_hodl: AccountInfo<'info>,

    /// The Mint for which the ATA is being created
    pub mint: Box<InterfaceAccount<'info, Mint>>,

    /// The ATA that will be created
    #[account(
        init,
        payer = payer,
        associated_token::mint = mint,
        associated_token::authority = bonding_curve_vault,
        associated_token::token_program = token_program_2022

    )]
    pub bonding_curve_vault_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    /// The ATA that will be created
    #[account(
            init,
            payer = payer,
            associated_token::mint = mint,
            associated_token::authority = bonding_curve_hodl,
            associated_token::token_program = token_program_2022
        )]
    pub bonding_curve_hodl_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    /// pda to store current price
    #[account(init,
        seeds = [BONDING_CURVE_STATE_SEED.as_bytes(), mint.key().as_ref()],
        bump,
        payer = payer,
        space = BondingCurveState::LEN
    )]
    pub bonding_curve_state: Account<'info, BondingCurveState>,

    /// Spl token program or token program 2022
    pub token_program_2022: Interface<'info, TokenInterface>,

    /// Associated Token Program
    pub associated_token_program: Program<'info, AssociatedToken>,

    /// System Program
    pub system_program: Program<'info, System>,

    /// Sysvar for program account
    pub rent: Sysvar<'info, Rent>,
}
