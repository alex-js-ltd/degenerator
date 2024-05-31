use anchor_lang::prelude::*;

use instructions::*;
mod instructions;

declare_id!("BDz95W1MNQV5w1nNH8parxd5Q14oUgXFCRjXYns19Asw");

#[program]
pub mod degenerator {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, args: TokenMetadataArgs) -> Result<()> {
        process_initialize(ctx, args)
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
        create_account(ctx)
    }

    pub fn mint_token(ctx: Context<MintToken>, amount: u64) -> Result<()> {
       mint(ctx, amount)
    }

 
}