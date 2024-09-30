use borsh::BorshDeserialize;
use raydium_cp_swap::{
    cpi, instructions,
    program::RaydiumCpSwap,
    states::{AmmConfig, OBSERVATION_SEED, POOL_LP_MINT_SEED, POOL_SEED, POOL_VAULT_SEED},
};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    instruction::{AccountMeta, Instruction},
    program::invoke,
    pubkey::Pubkey,
};

entrypoint!(proxy_initialize);

fn proxy_initialize(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    // Extract accounts from the account iterator
    let creator = next_account_info(accounts_iter)?;
    let amm_config = next_account_info(accounts_iter)?;
    let authority = next_account_info(accounts_iter)?;
    let pool_state = next_account_info(accounts_iter)?;
    let token_0_mint = next_account_info(accounts_iter)?;
    let token_1_mint = next_account_info(accounts_iter)?;
    let lp_mint = next_account_info(accounts_iter)?;
    let creator_token_0 = next_account_info(accounts_iter)?;
    let creator_token_1 = next_account_info(accounts_iter)?;
    let creator_lp_token = next_account_info(accounts_iter)?;
    let token_0_vault = next_account_info(accounts_iter)?;
    let token_1_vault = next_account_info(accounts_iter)?;
    let create_pool_fee = next_account_info(accounts_iter)?;
    let observation_state = next_account_info(accounts_iter)?;
    let token_program = next_account_info(accounts_iter)?;
    let token_0_program = next_account_info(accounts_iter)?;
    let token_1_program = next_account_info(accounts_iter)?;
    let associated_token_program = next_account_info(accounts_iter)?;
    let system_program = next_account_info(accounts_iter)?;
    let rent = next_account_info(accounts_iter)?;

    // Deserialize the instruction data

    Ok(())
}
