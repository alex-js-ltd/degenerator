use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token_interface::{Mint, TokenAccount, TokenInterface};

use crate::utils::{
    set_bonding_curve_state, token_mint_to, update_account_lamports_to_minimum_balance,
    BONDING_CURVE_STATE_SEED, HODL_VAULT_SEED, MEME_VAULT_SEED, SOL_VAULT_SEED,
};

use anchor_spl::token::spl_token::native_mint;

use crate::state::BondingCurveState;

pub fn create_bonding_curve(ctx: Context<CreateBondingCurve>, amount: u64) -> Result<()> {
    // transfer minimum rent to sol vault
    update_account_lamports_to_minimum_balance(
        ctx.accounts.sol_vault.to_account_info(),
        ctx.accounts.payer.to_account_info(),
        ctx.accounts.system_program.to_account_info(),
    )?;

    // transfer minimum rent to meme vault
    update_account_lamports_to_minimum_balance(
        ctx.accounts.meme_vault.to_account_info(),
        ctx.accounts.payer.to_account_info(),
        ctx.accounts.system_program.to_account_info(),
    )?;

    // transfer minimum rent to hodl vault
    update_account_lamports_to_minimum_balance(
        ctx.accounts.hodl_vault.to_account_info(),
        ctx.accounts.payer.to_account_info(),
        ctx.accounts.system_program.to_account_info(),
    )?;

    let eighty_percent = amount.saturating_mul(80).saturating_div(100);
    let twenty_percent = amount.saturating_mul(20).saturating_div(100);

    // mint 80% to meme vault
    token_mint_to(
        ctx.accounts.payer.to_account_info(),
        ctx.accounts.token_1_program.to_account_info(),
        ctx.accounts.token_1_mint.to_account_info(),
        ctx.accounts.meme_ata.to_account_info(),
        eighty_percent,
        ctx.accounts.token_1_mint.decimals,
    )?;

    // mint 20% to hodl vault
    token_mint_to(
        ctx.accounts.payer.to_account_info(),
        ctx.accounts.token_1_program.to_account_info(),
        ctx.accounts.token_1_mint.to_account_info(),
        ctx.accounts.hodl_ata.to_account_info(),
        twenty_percent,
        ctx.accounts.token_1_mint.decimals,
    )?;

    ctx.accounts.meme_ata.reload()?;

    let current_supply = ctx.accounts.meme_ata.amount as u128;
    let total_supply = ctx.accounts.meme_ata.amount as u128;

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

    #[account(
        constraint = token_0_mint.key() == native_mint::id(),
        mint::token_program = token_0_program,
    )]
    pub token_0_mint: Box<InterfaceAccount<'info, Mint>>,

    #[account(
        mint::token_program = token_1_program,
    )]
    pub token_1_mint: Box<InterfaceAccount<'info, Mint>>,

    /// CHECK: pda to control sol
    #[account(mut,
        seeds = [SOL_VAULT_SEED.as_bytes(), token_0_mint.key().as_ref(), token_1_mint.key().as_ref()],
        bump,
    )]
    pub sol_vault: AccountInfo<'info>,

    /// CHECK: pda to control meme tokens
    #[account(mut,
            seeds = [MEME_VAULT_SEED.as_bytes(), token_1_mint.key().as_ref()],
            bump,
        )]
    pub meme_vault: AccountInfo<'info>,

    /// CHECK: pda to hodl tokens for the raydium pool
    #[account(mut,
                seeds = [HODL_VAULT_SEED.as_bytes(), token_1_mint.key().as_ref()],
                bump,
            )]
    pub hodl_vault: AccountInfo<'info>,

    /// The ATA for the sol
    #[account(
            init,
            payer = payer,
            associated_token::mint = token_0_mint,
            associated_token::authority = sol_vault,
            associated_token::token_program = token_0_program
        )]
    pub sol_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    /// The ATA for the meme coin
    #[account(
        init,
        payer = payer,
        associated_token::mint = token_1_mint,
        associated_token::authority = meme_vault,
        associated_token::token_program = token_1_program

    )]
    pub meme_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    /// The ATA to hodl meme token
    #[account(
            init,
            payer = payer,
            associated_token::mint = token_1_mint,
            associated_token::authority = hodl_vault,
            associated_token::token_program = token_1_program
        )]
    pub hodl_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    /// pda to store bonding curve state
    #[account(init,
        seeds = [BONDING_CURVE_STATE_SEED.as_bytes(), token_0_mint.key().as_ref(), token_1_mint.key().as_ref()],
        bump,
        payer = payer,
        space = BondingCurveState::LEN
    )]
    pub bonding_curve_state: Account<'info, BondingCurveState>,

    /// Spl token program or token program 2022
    pub token_0_program: Interface<'info, TokenInterface>,

    /// Spl token program or token program 2022
    pub token_1_program: Interface<'info, TokenInterface>,

    /// Associated Token Program
    pub associated_token_program: Program<'info, AssociatedToken>,

    /// System Program
    pub system_program: Program<'info, System>,

    /// Sysvar for program account
    pub rent: Sysvar<'info, Rent>,
}
