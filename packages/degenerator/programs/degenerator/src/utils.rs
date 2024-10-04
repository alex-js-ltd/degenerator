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

use anchor_spl::{
    token::TokenAccount,
    token_2022::spl_token_2022::{
        self,
        extension::{ExtensionType, StateWithExtensions},
    },
    token_interface::{
        initialize_account3, spl_token_2022::extension::BaseStateWithExtensions, InitializeAccount3,
    },
};

use crate::state::BondingCurveState;

pub const AUTH_SEED: &str = "auth";
pub const BONDING_CURVE_VAULT_SEED: &str = "bonding_curve_vault";
pub const MEME_VAULT_SEED: &str = "meme_vault";
pub const SOL_VAULT_SEED: &str = "sol_vault";
pub const HODL_VAULT_SEED: &str = "hodl_vault";
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

const BASE_PRICE: u128 = 10_000; // Base price per token (0.00001 SOL)
const PRICE_INCREMENT: u128 = 1_000; // Linear increment per unit of supply

pub fn calculate_buy_price(current_supply: u128, total_supply: u128, amount: u128) -> u64 {
    // Calculate the price increase component based on the remaining supply
    let remaining_supply = total_supply.saturating_sub(current_supply);
    let price_increase = PRICE_INCREMENT * remaining_supply / total_supply;

    // Total price per token including the increase
    let price_per_token = BASE_PRICE.saturating_add(price_increase);

    // Total price for the amount of tokens requested
    let total_price = price_per_token.saturating_mul(amount as u128);

    // Convert to u64, with a maximum cap to avoid overflow
    total_price.try_into().unwrap_or(u64::MAX)
}

pub fn calculate_sell_price(current_supply: u128, total_supply: u128, amount: u128) -> u64 {
    // Calculate the price decrease component based on the current supply
    let price_decrease = PRICE_INCREMENT * current_supply / total_supply;

    // Total price per token including the decrease
    let price_per_token = BASE_PRICE.saturating_sub(price_decrease);

    // Ensure that price does not drop below zero
    let price_per_token = price_per_token.max(0);

    // Total price for the amount of tokens being sold
    let total_price = price_per_token.saturating_mul(amount as u128);

    // Convert to u64, with a maximum cap to avoid overflow
    total_price.try_into().unwrap_or(u64::MAX)
}

pub fn calculate_progress(current_supply: u128, total_supply: u128) -> u64 {
    // Handle edge case where currentSupply is zero
    if current_supply == 0 {
        return 100; // Progress is 100% if current supply is zero
    }

    // Handle edge case where currentSupply equals totalSupply
    if current_supply == total_supply {
        return 0; // Progress is 0% if current supply is equal to total supply
    }

    // Calculate progress as inverse percentage using saturating_sub
    let progress = (total_supply.saturating_sub(current_supply)) * 100 / total_supply;

    progress.try_into().unwrap_or(u64::MAX)
}

/// Sets the price per token in the Pool account.
pub fn set_bonding_curve_state(
    bonding_curve_state: &mut Account<BondingCurveState>,
    current_supply: u128,
    total_supply: u128,
) {
    bonding_curve_state.current_supply = current_supply as u64;
    bonding_curve_state.total_supply = total_supply as u64;
    bonding_curve_state.buy_price = calculate_buy_price(current_supply, total_supply, 1);
    bonding_curve_state.sell_price = calculate_sell_price(current_supply, total_supply, 1);
    bonding_curve_state.progress = calculate_progress(current_supply, total_supply);
}

pub fn transfer_from_user_to_bonding_curve_vault<'a>(
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
) -> Result<()> {
    token_2022::mint_to(
        CpiContext::new(
            token_program,
            token_2022::MintTo {
                to: destination,
                authority,
                mint,
            },
        ),
        amount * 10u64.pow(mint_decimals as u32), // Mint tokens
    )
}

/// Creates wrapped sol
pub fn transfer_sol_to_native_account<'a>(
    from: &AccountInfo<'a>,
    to: &AccountInfo<'a>,
    system_program: &AccountInfo<'a>,
    amount: u64,
    signer_seeds: &[&[&[u8]]],
) -> Result<()> {
    system_program::transfer(
        CpiContext::new_with_signer(
            system_program.to_account_info(),
            system_program::Transfer {
                from: from.to_account_info(),
                to: to.to_account_info(),
            },
            signer_seeds,
        ),
        amount,
    )?;

    token_2022::sync_native(CpiContext::new(
        system_program.to_account_info(),
        token_2022::SyncNative {
            account: to.to_account_info(),
        },
    ))
}

pub fn create_token_account<'a>(
    authority: &AccountInfo<'a>,
    payer: &AccountInfo<'a>,
    token_account: &AccountInfo<'a>,
    mint_account: &AccountInfo<'a>,
    system_program: &AccountInfo<'a>,
    token_program: &AccountInfo<'a>,
    signer_seeds: &[&[&[u8]]],
) -> Result<()> {
    let space = {
        let mint_info = mint_account.to_account_info();
        if *mint_info.owner == token_2022::Token2022::id() {
            let mint_data = mint_info.try_borrow_data()?;
            let mint_state =
                StateWithExtensions::<spl_token_2022::state::Mint>::unpack(&mint_data)?;
            let mint_extensions = mint_state.get_extension_types()?;
            let required_extensions =
                ExtensionType::get_required_init_account_extensions(&mint_extensions);
            ExtensionType::try_calculate_account_len::<spl_token_2022::state::Account>(
                &required_extensions,
            )?
        } else {
            TokenAccount::LEN
        }
    };
    let lamports = Rent::get()?.minimum_balance(space);
    let cpi_accounts = anchor_lang::system_program::CreateAccount {
        from: payer.to_account_info(),
        to: token_account.to_account_info(),
    };
    let cpi_context = CpiContext::new(system_program.to_account_info(), cpi_accounts);
    anchor_lang::system_program::create_account(
        cpi_context.with_signer(signer_seeds),
        lamports,
        space as u64,
        token_program.key,
    )?;
    initialize_account3(CpiContext::new(
        token_program.to_account_info(),
        InitializeAccount3 {
            account: token_account.to_account_info(),
            mint: mint_account.to_account_info(),
            authority: authority.to_account_info(),
        },
    ))
}
