use anchor_lang::prelude::*;

use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token_interface::{spl_token_2022, Mint, TokenAccount, TokenInterface};

use crate::states::{
    calculate_buy_price, calculate_sell_price, set_bonding_curve_state, BondingCurveState,
    RESERVE_WEIGHT,
};
use crate::utils::seed::{BONDING_CURVE_STATE_SEED, BONDING_CURVE_VAULT_SEED};
use crate::utils::token::{
    get_account_balance, token_mint_to, transfer_sol_to_bonding_curve_vault,
};

use spl_token_2022::amount_to_ui_amount;

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

pub fn buy_token(ctx: Context<BuyToken>, amount: u64) -> Result<()> {
    let curve = &mut ctx.accounts.bonding_curve_state;

    let sol_amount = calculate_buy_price(u128::from(curve.total_supply), u128::from(amount))?;

    msg!(
        "purchase_target_amount: {}",
        spl_token_2022::amount_to_ui_amount(amount, ctx.accounts.mint.decimals)
    );

    msg!(
        "sol_amount: {}",
        spl_token_2022::amount_to_ui_amount(sol_amount, 9)
    );

    if ctx.accounts.payer.lamports() < sol_amount {
        return Err(ProgramError::InsufficientFunds.into());
    }

    token_mint_to(
        ctx.accounts.vault.to_account_info(),
        ctx.accounts.token_program.to_account_info(),
        ctx.accounts.mint.to_account_info(),
        ctx.accounts.payer_ata.to_account_info(),
        amount,
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
        sol_amount,
    )?;

    ctx.accounts.mint.reload()?;

    let vault_balance = get_account_balance(ctx.accounts.vault.to_account_info())?;

    let update_state = BondingCurveState {
        total_supply: ctx.accounts.mint.supply,
        reserve_balance: vault_balance,
        reserve_weight: RESERVE_WEIGHT,
        decimals: ctx.accounts.mint.decimals,
    };

    set_bonding_curve_state(&mut ctx.accounts.bonding_curve_state, update_state)?;

    Ok(())
}
