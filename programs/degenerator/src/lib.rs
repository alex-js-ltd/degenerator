#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

mod constants;
mod errors;
mod instructions;
mod state;

// Set the correct key here
declare_id!("DMVQUYEbAkkqkgxjrRE85MLezYf6mUwbP8aDLmf8xAne");

#[program]
pub mod degenerator {
  
    pub use super::instructions::*;
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, args: TokenMetadataArgs, token_decimals: u8) -> Result<()> {
        instructions::initialize(ctx, args, token_decimals)
    }

    pub fn update_field(ctx: Context<UpdateField>, args: UpdateFieldArgs) -> Result<()> {
        instructions::update_field(ctx, args)
    }

    pub fn remove_key(ctx: Context<RemoveKey>, key: String) -> Result<()> {
        instructions::remove_key(ctx, key)
    }

    pub fn emit(ctx: Context<Emit>) -> Result<()> {
        instructions::emit(ctx)
    }

    pub fn update_authority(ctx: Context<UpdateAuthority>) -> Result<()> {
        instructions::update_authority(ctx)
    }

    pub fn create_associated_token_account(ctx: Context<CreateAssociatedTokenAccount>) -> Result<()> {
        instructions::create_ata(ctx)
    }

    pub fn mint_token(ctx: Context<MintToken>, amount: u64) -> Result<()> {
        instructions::mint_token(ctx, amount)
    }

    pub fn revoke_mint_authority(ctx: Context<CloseMint>) -> Result<()> {
        instructions::revoke_mint(ctx)
     }

     pub fn revoke_freeze_authority(ctx: Context<RevokeFreeze>) -> Result<()> {
        instructions::revoke_freeze(ctx)
     }

     pub fn create_amm(ctx: Context<CreateAmm>, id: Pubkey, fee: u16) -> Result<()> {
        instructions::create_amm(ctx, id, fee)
     }

 
}