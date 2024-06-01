use anchor_lang::prelude::*;

use instructions::*;
mod instructions;


declare_id!("7oUZYs5kMhHAvtGSU2U5QpqMHpRcNJBSA1Deyswhr2j9");

#[program]
pub mod degenerator {
  
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, args: TokenMetadataArgs, token_decimals: u8) -> Result<()> {
        process_initialize(ctx, args, token_decimals)
    }

    pub fn update_field(ctx: Context<UpdateField>, args: UpdateFieldArgs) -> Result<()> {
        process_update_field(ctx, args)
    }

    pub fn remove_key(ctx: Context<RemoveKey>, key: String) -> Result<()> {
        process_remove_key(ctx, key)
    }

    pub fn emit(ctx: Context<Emit>) -> Result<()> {
        process_emit(ctx)
    }

    pub fn update_authority(ctx: Context<UpdateAuthority>) -> Result<()> {
        process_update_authority(ctx)
    }

    pub fn create_associated_token_account(ctx: Context<CreateAssociatedTokenAccount>) -> Result<()> {
       process_create_associated_token_account(ctx)
    }

    pub fn mint_token(ctx: Context<MintToken>, amount: u64) -> Result<()> {
       process_mint_token(ctx, amount)
    }

    pub fn close_mint(ctx: Context<CloseMint>) -> Result<()> {
        process_close_mint(ctx)
     }

     pub fn revoke_freeze_authority(ctx: Context<RevokeFreeze>) -> Result<()> {
        process_revoke_freeze_authority(ctx)
     }

 
}