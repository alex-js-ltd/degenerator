use anchor_lang::{
    prelude::Result,
    solana_program::{
        account_info::AccountInfo,
        instruction::{get_stack_height, TRANSACTION_LEVEL_STACK_HEIGHT},
        program::invoke,
        pubkey::Pubkey,
        rent::Rent,
        system_instruction::transfer,
        sysvar::Sysvar,
    },
    Lamports,
};
use anchor_spl::token_interface::spl_token_2022::{
    extension::{BaseStateWithExtensions, Extension, StateWithExtensions},
    solana_zk_token_sdk::zk_token_proof_instruction::Pod,
    state::Mint,
};
use spl_tlv_account_resolution::{account::ExtraAccountMeta, state::ExtraAccountMetaList};
use spl_type_length_value::variable_len_pack::VariableLenPack;

pub const POOL_ACCOUNT_SEED: &[u8] = b"pool";
pub const APPROVE_ACCOUNT_SEED: &[u8] = b"approve-account";
pub const META_LIST_ACCOUNT_SEED: &[u8] = b"extra-account-metas";

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

pub fn get_extra_meta_list_account_pda(mint: Pubkey) -> Pubkey {
    Pubkey::find_program_address(&[META_LIST_ACCOUNT_SEED, mint.as_ref()], &crate::id()).0
}

pub fn get_approve_account_pda(mint: Pubkey) -> Pubkey {
    Pubkey::find_program_address(&[APPROVE_ACCOUNT_SEED, mint.as_ref()], &crate::id()).0
}

pub fn get_pool_bump(mint: Pubkey) -> u8 {
    // Find the PDA bump seed
    let (_, bump) = Pubkey::find_program_address(&[POOL_ACCOUNT_SEED, mint.as_ref()], &crate::id());

    bump
}

/// Determine if we are in CPI
pub fn hook_in_cpi() -> bool {
    let stack_height = get_stack_height();
    let tx_height = TRANSACTION_LEVEL_STACK_HEIGHT;
    let hook_height: usize = tx_height + 1;

    stack_height > hook_height
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

const BASE_PRICE: u64 = 10_000; // Base price in lamports (0.00001 SOL)
const LAMPORTS_PER_SOL: u128 = 1_000_000_000; // Conversion factor from SOL to lamports

pub fn calculate_price(supply: u64, amount: u64) -> u64 {
    let supply_u128 = supply as u128;
    let base_price_u128 = BASE_PRICE as u128;

    // Calculate price per token with a base price and a term that increases with supply
    let price_per_token = base_price_u128
        .saturating_add(supply_u128.saturating_mul(base_price_u128) / LAMPORTS_PER_SOL);

    // Calculate total price
    let total_price = price_per_token.saturating_mul(amount as u128);

    // Return total price, converting back to u64 and handling potential overflow
    total_price.try_into().unwrap_or(u64::MAX)
}
