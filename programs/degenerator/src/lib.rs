use anchor_lang::prelude::*;

use instructions::*;
mod instructions;

declare_id!("FFqTLU5eu66PWDJsXx1EdTvFrQ77R7X6VDVJMc1KSqiv");

#[program]
pub mod degenerator {
  
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, args: TokenMetadataArgs,  _token_decimals: u8) -> Result<()> {
        process_initialize(ctx, args, _token_decimals)
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

    pub fn revoke_mint_authority(ctx: Context<RevokeMint>) -> Result<()> {
        process_revoke_mint_authority(ctx)
     }

 
}