use crate::error::ErrorCode;
use crate::states::{
    calculate_price_per_token, calculate_sell_price, set_bonding_curve_state, BondingCurveState,
    BASE_PRICE, SLOPE,
};
use crate::utils::seed::{BONDING_CURVE_STATE_SEED, BONDING_CURVE_VAULT_SEED};
use crate::utils::token::{
    get_account_balance, token_approve_burn, token_burn, transfer_sol_to_user,
};
use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token_interface::{spl_token_2022, Mint, TokenAccount, TokenInterface};

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

pub fn sell_token(ctx: Context<SellToken>, amount: u64) -> Result<()> {
    let curve = &mut ctx.accounts.bonding_curve_state;

    let sol_amount = calculate_sell_price(curve.current_supply, curve.mint_decimals, amount)?;

    let user_supply = ctx.accounts.payer_ata.amount;

    msg!(
        "Price Per Token {} SOL",
        spl_token_2022::amount_to_ui_amount(ctx.accounts.bonding_curve_state.sell_price, 9)
    );

    msg!(
        "Sell Amount {}",
        spl_token_2022::amount_to_ui_amount(amount, ctx.accounts.mint.decimals),
    );

    msg!(
        "Total Revenue {} SOL",
        spl_token_2022::amount_to_ui_amount(sol_amount, 9)
    );

    if amount > user_supply {
        return Err(ErrorCode::InsufficientUserSupply.into());
    }

    if sol_amount > ctx.accounts.bonding_curve_state.reserve_balance {
        return Err(ProgramError::InsufficientFunds.into());
    }

    token_approve_burn(
        ctx.accounts.token_program.to_account_info(),
        ctx.accounts.payer_ata.to_account_info(),
        ctx.accounts.vault.to_account_info(),
        ctx.accounts.signer.to_account_info(),
        amount,
    )?;

    // burn tokens
    token_burn(
        ctx.accounts.vault.to_account_info(),
        ctx.accounts.token_program.to_account_info(),
        ctx.accounts.mint.to_account_info(),
        ctx.accounts.payer_ata.to_account_info(),
        amount,
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
        sol_amount,
        &[&[
            BONDING_CURVE_VAULT_SEED.as_bytes(),
            ctx.accounts.mint.key().as_ref(),
            &[ctx.bumps.vault][..],
        ][..]],
    )?;

    ctx.accounts.mint.reload()?;

    let vault_balance = get_account_balance(ctx.accounts.vault.to_account_info())?;

    let (buy_price, sell_price) =
        calculate_price_per_token(ctx.accounts.mint.supply, ctx.accounts.mint.decimals)?;

    let payload = BondingCurveState {
        slope: SLOPE,
        base_price: BASE_PRICE,
        current_supply: ctx.accounts.mint.supply,
        reserve_balance: vault_balance,
        mint_decimals: ctx.accounts.mint.decimals,
        buy_price,
        sell_price,
    };

    set_bonding_curve_state(&mut ctx.accounts.bonding_curve_state, payload)?;

    Ok(())
}
