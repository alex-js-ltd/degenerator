use crate::utils::seed::META_LIST_ACCOUNT_SEED;
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

use anchor_spl::token_interface;
use anchor_spl::token_interface::spl_token_2022::{
    extension::{BaseStateWithExtensions, Extension, StateWithExtensions},
    state::Mint,
};

use anchor_spl::token_interface::spl_token_metadata_interface::instruction::UpdateAuthority;
use spl_tlv_account_resolution::{account::ExtraAccountMeta, state::ExtraAccountMetaList};
use spl_type_length_value::variable_len_pack::VariableLenPack;

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

pub fn get_extra_meta_list_account_pda(mint: Pubkey) -> Pubkey {
    Pubkey::find_program_address(
        &[META_LIST_ACCOUNT_SEED.as_bytes(), mint.as_ref()],
        &crate::id(),
    )
    .0
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

pub fn get_account_balance<'a>(account: AccountInfo<'a>) -> Result<u64> {
    Ok(account
        .lamports()
        .saturating_sub(Rent::get()?.minimum_balance(account.data_len())))
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
        amount,
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
        amount,
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
        amount,
    )
}

pub fn token_burn<'a>(
    authority: AccountInfo<'a>,
    token_program: AccountInfo<'a>,
    mint: AccountInfo<'a>,
    from: AccountInfo<'a>,
    amount: u64,
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
        amount,
    )
}

pub fn token_ui_amount_to_amount<'a>(
    token_program: AccountInfo<'a>,
    mint: AccountInfo<'a>,
    ui_amount: &str,
) -> Result<u64> {
    token_2022::ui_amount_to_amount(
        CpiContext::new(
            token_program,
            token_2022::UiAmountToAmount { account: mint },
        ),
        ui_amount,
    )
}

pub fn token_approve_burn<'a>(
    token_program: AccountInfo<'a>,
    to: AccountInfo<'a>,
    delegate: AccountInfo<'a>,
    authority: AccountInfo<'a>,
    amount: u64,
) -> Result<()> {
    token_2022::approve(
        CpiContext::new(
            token_program,
            token_2022::Approve {
                to,
                delegate,
                authority,
            },
        ),
        amount,
    )
}

pub fn set_authority<'a>(
    token_program: AccountInfo<'a>,
    current_authority: AccountInfo<'a>,
    account_or_mint: AccountInfo<'a>,
    authority_type: token_interface::spl_token_2022::instruction::AuthorityType,
    new_authority: Option<Pubkey>,
) -> Result<()> {
    token_interface::set_authority(
        CpiContext::new(
            token_program,
            token_interface::SetAuthority {
                current_authority,
                account_or_mint,
            },
        ),
        authority_type,
        new_authority,
    )
}
