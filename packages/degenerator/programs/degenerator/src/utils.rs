use anchor_lang::prelude::*;
use anchor_lang::system_program;
use anchor_lang::{
    prelude::Result,
    solana_program::{
        account_info::AccountInfo, program::invoke, pubkey::Pubkey, rent::Rent,
        system_instruction::transfer, sysvar::Sysvar,
    },
    Lamports,
};
use anchor_spl::token_2022;
use anchor_spl::token_interface::spl_token_2022::{
    extension::{BaseStateWithExtensions, Extension, StateWithExtensions},
    solana_zk_token_sdk::zk_token_proof_instruction::Pod,
    state::Mint,
};
use spl_tlv_account_resolution::{account::ExtraAccountMeta, state::ExtraAccountMetaList};
use spl_type_length_value::variable_len_pack::VariableLenPack;

pub const POOL_VAULT_SEED: &str = "pool_vault";
pub const POOL_STATE_SEED: &str = "pool_state";
pub const META_LIST_ACCOUNT_SEED: &str = "extra-account-metas";

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

pub fn get_mint_extensible_extension_data<T: Extension + VariableLenPack>(
    account: &mut AccountInfo,
) -> Result<T> {
    let mint_data = account.data.borrow();
    let mint_with_extension = StateWithExtensions::<Mint>::unpack(&mint_data)?;
    let extension_data = mint_with_extension.get_variable_len_extension::<T>()?;
    Ok(extension_data)
}

pub fn get_mint_extension_data<T: Extension + Pod>(account: &mut AccountInfo) -> Result<T> {
    let mint_data = account.data.borrow();
    let mint_with_extension = StateWithExtensions::<Mint>::unpack(&mint_data)?;
    let extension_data = *mint_with_extension.get_extension::<T>()?;
    Ok(extension_data)
}

pub fn get_meta_list(approve_account: Option<Pubkey>) -> Vec<ExtraAccountMeta> {
    if let Some(approve_account) = approve_account {
        return vec![ExtraAccountMeta {
            discriminator: 0,
            address_config: approve_account.to_bytes(),
            is_signer: false.into(),
            is_writable: true.into(),
        }];
    }
    vec![]
}

pub fn get_meta_list_size(approve_account: Option<Pubkey>) -> usize {
    // safe because it's either 0 or 1
    ExtraAccountMetaList::size_of(get_meta_list(approve_account).len()).unwrap()
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

/// Sets the price per token in the Pool account.
pub fn set_pool_state(
    pool_state: &mut Account<PoolState>,
    buy_price: u64,
    sell_price: u64,
    current_supply: u64,
    total_supply: u64,
) {
    pool_state.buy_price = buy_price;
    pool_state.sell_price = sell_price;
    pool_state.current_supply = current_supply;
    pool_state.total_supply = total_supply;
}

pub fn transfer_from_user_to_pool_vault<'a>(
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

pub fn transfer_from_pool_vault_to_user<'a>(
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

pub fn transfer_sol_to_pool_vault<'a>(
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

#[account]
#[derive(InitSpace)]
pub struct PoolState {
    pub buy_price: u64,
    pub sell_price: u64,
    pub current_supply: u64,
    pub total_supply: u64,
}

impl PoolState {
    // Discriminator (8 bytes) + price_per_token (u64 = 8 bytes)
    pub const LEN: usize = 8 + 8 + 8 + 8 + 8;
}
