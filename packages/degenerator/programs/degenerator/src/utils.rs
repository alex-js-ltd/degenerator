use anchor_lang::prelude::*;
use anchor_lang::system_program;
use anchor_lang::{
    prelude::Result,
    solana_program::{
        account_info::AccountInfo, program::invoke, rent::Rent, system_instruction::transfer,
        sysvar::Sysvar,
    },
    Lamports,
};
use anchor_spl::token_2022;

use crate::state::BondingCurveState;

pub const BONDING_CURVE_AUTHORITY: &str = "bonding_curve_authority";
pub const BONDING_CURVE_STATE_SEED: &str = "bonding_curve_state";

pub fn update_account_lamports_to_minimum_balance<'info>(
    account: AccountInfo<'info>,
    payer: AccountInfo<'info>,
    system_program: AccountInfo<'info>,
) -> Result<()> {
    let extra_lamports = Rent::get()?.minimum_balance(account.data_len()) - account.get_lamports();
    if extra_lamports > 0 {
        invoke(
            &transfer(payer.key, account.key, extra_lamports),
            &[payer, account, system_program],
        )?;
    }
    Ok(())
}

pub fn calculate_buy_price(supply: u64, amount: u64) -> u64 {
    let m: u64 = 10; // Slope for buy price (increases price with supply)
    let b: u64 = 100; // Base price (initial price)

    // Calculate buy price based on the bonding curve
    // Use saturating to prevent overflow
    let price_per_token = m.saturating_mul(supply).saturating_add(b); // Price increases as supply increases

    let total_price = price_per_token.saturating_mul(amount);
    total_price.try_into().unwrap_or(u64::MAX)
}

pub fn calculate_sell_price(supply: u64, amount: u64) -> u64 {
    let m: u64 = 10; // Slope for sell price (decreases price with supply)
    let b: u64 = 100; // Base price (initial price)

    // Calculate sell price based on the bonding curve
    let price_per_token = m
        .saturating_mul(supply.saturating_sub(amount))
        .saturating_add(b); // Price decreases as supply decreases

    let total_price = price_per_token.saturating_mul(amount);
    total_price.try_into().unwrap_or(u64::MAX)
}

/// Sets the price per token in the Pool account.
pub fn set_bonding_curve_state(
    bonding_curve_state: &mut Account<BondingCurveState>,
    current_supply: u64,
    new_supply: u64,
) {
    bonding_curve_state.supply = new_supply;
    bonding_curve_state.buy_price = calculate_buy_price(new_supply, 1);
    bonding_curve_state.sell_price = calculate_sell_price(current_supply, 1);
    bonding_curve_state.progress = 0;
}

pub fn transfer_from_user_to_bonding_curve<'a>(
    authority: AccountInfo<'a>,
    from: AccountInfo<'a>,
    to_vault: AccountInfo<'a>,
    mint: AccountInfo<'a>,
    token_program: AccountInfo<'a>,
    amount: u64,
    mint_decimals: u8,
) -> Result<()> {
    if amount == 0 {
        return Ok(());
    }
    token_2022::transfer_checked(
        CpiContext::new(
            token_program.to_account_info(),
            token_2022::TransferChecked {
                from,
                to: to_vault,
                authority,
                mint,
            },
        ),
        amount * 10u64.pow(mint_decimals as u32),
        mint_decimals,
    )
}

pub fn transfer_from_bonding_curve_vault_to_user<'a>(
    authority: AccountInfo<'a>,
    from_vault: AccountInfo<'a>,
    to: AccountInfo<'a>,
    mint: AccountInfo<'a>,
    token_program: AccountInfo<'a>,
    amount: u64,
    mint_decimals: u8,
    signer_seeds: &[&[&[u8]]],
) -> Result<()> {
    if amount == 0 {
        return Ok(());
    }
    token_2022::transfer_checked(
        CpiContext::new_with_signer(
            token_program.to_account_info(),
            token_2022::TransferChecked {
                from: from_vault,
                to,
                authority,
                mint,
            },
            signer_seeds,
        ),
        amount * 10u64.pow(mint_decimals as u32),
        mint_decimals,
    )
}

pub fn transfer_sol_to_bonding_curve_vault<'a>(
    from: AccountInfo<'a>,
    to: AccountInfo<'a>,
    system_program: AccountInfo<'a>,
    amount: u64,
) -> Result<()> {
    system_program::transfer(
        CpiContext::new(
            system_program.to_account_info(),
            system_program::Transfer { from, to },
        ),
        amount,
    )
}

pub fn transfer_sol_to_user<'a>(
    from: AccountInfo<'a>,
    to: AccountInfo<'a>,
    system_program: AccountInfo<'a>,
    amount: u64,
    signer_seeds: &[&[&[u8]]],
) -> Result<()> {
    system_program::transfer(
        CpiContext::new_with_signer(
            system_program.to_account_info(),
            system_program::Transfer { from, to },
            signer_seeds,
        ),
        amount,
    )
}

/// Issue a spl_token `MintTo` instruction.
pub fn token_mint_to<'a>(
    authority: AccountInfo<'a>,
    token_program: AccountInfo<'a>,
    mint: AccountInfo<'a>,
    destination: AccountInfo<'a>,
    amount: u64,
    mint_decimals: u8,
    signer_seeds: &[&[&[u8]]],
) -> Result<()> {
    token_2022::mint_to(
        CpiContext::new_with_signer(
            token_program,
            token_2022::MintTo {
                to: destination,
                authority,
                mint,
            },
            signer_seeds,
        ),
        amount * 10u64.pow(mint_decimals as u32),
    )
}

pub fn token_burn<'a>(
    authority: AccountInfo<'a>,
    token_program: AccountInfo<'a>,
    mint: AccountInfo<'a>,
    from: AccountInfo<'a>,
    amount: u64,
    mint_decimals: u8,
    signer_seeds: &[&[&[u8]]],
) -> Result<()> {
    token_2022::burn(
        CpiContext::new_with_signer(
            token_program.to_account_info(),
            token_2022::Burn {
                from,
                authority,
                mint,
            },
            signer_seeds,
        ),
        amount * 10u64.pow(mint_decimals as u32),
    )
}
