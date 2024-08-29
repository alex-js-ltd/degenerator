#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;



mod instructions;



declare_id!("7d8qJx4mFJhxNHkGpgDcaK9DbokNJSVFKjtYq89ESFUa");

#[program]
pub mod degenerator {
  
    pub use super::instructions::*;
    use super::*;

    pub fn initialize(ctx: Context<Initialize>,  token_decimals: u8, args: TokenMetadataArgs) -> Result<()> {
        instructions::initialize(ctx, token_decimals, args)
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

    pub fn create_token_account(ctx: Context<CreateTokenAccount>) -> Result<()> {
        instructions::create_token_account(ctx)
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

     pub fn transfer_token(ctx: Context<TransferToken>, amount: u64) -> Result<()> {
        instructions::transfer_token(ctx, amount)
    }

 
}