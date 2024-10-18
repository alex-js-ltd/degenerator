use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token_interface::{
    spl_token_2022::instruction::AuthorityType, Mint, TokenAccount, TokenInterface,
};

use crate::states::{set_bonding_curve_state, BondingCurveState, SLOPE, BASE_PRICE};
use crate::utils::seed::{BONDING_CURVE_STATE_SEED, BONDING_CURVE_VAULT_SEED};
use crate::utils::token::{
    get_account_balance, set_authority, token_mint_to, 
    update_account_lamports_to_minimum_balance,
};

pub fn create_bonding_curve(ctx: Context<CreateBondingCurve>) -> Result<()> {
    
     // transfer minimum rent to vault pda
    update_account_lamports_to_minimum_balance(
        ctx.accounts.vault.to_account_info(),
        ctx.accounts.payer.to_account_info(),
        ctx.accounts.system_program.to_account_info(),
    )?;

    // set vault to mint authority
    set_authority(
        ctx.accounts.token_program.to_account_info(),
        ctx.accounts.payer.to_account_info(),
        ctx.accounts.mint.to_account_info(),
        AuthorityType::MintTokens,
        Some(ctx.accounts.vault.to_account_info().key()), // Wrap the Pubkey in Some
    )?;



    let vault_balance = get_account_balance(ctx.accounts.vault.to_account_info())?;


    let smallest_unit = 10u64
        .checked_pow(ctx.accounts.mint.decimals as u32)
        .unwrap();

    // add liquidity to token supply
    token_mint_to(
        ctx.accounts.vault.to_account_info(),
        ctx.accounts.token_program.to_account_info(),
        ctx.accounts.mint.to_account_info(),
        ctx.accounts.vault_ata.to_account_info(),
      smallest_unit,
        &[&[
            BONDING_CURVE_VAULT_SEED.as_bytes(),
            ctx.accounts.mint.key().as_ref(),
            &[ctx.bumps.vault],
        ]],
    )?;

    ctx.accounts.mint.reload()?;

    let initial_state = BondingCurveState {
        slope: SLOPE,
        base_price: BASE_PRICE,
        current_supply: ctx.accounts.mint.supply,
        reserve_balance: vault_balance,
        mint_decimals: ctx.accounts.mint.decimals
    };

    set_bonding_curve_state(&mut ctx.accounts.bonding_curve_state, initial_state)?;

    Ok(())
}

#[derive(Accounts)]
pub struct CreateBondingCurve<'info> {
    /// The payer for the transaction
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        mint::token_program = token_program,
   
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
