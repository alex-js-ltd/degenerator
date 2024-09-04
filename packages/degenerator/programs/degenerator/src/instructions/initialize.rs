use anchor_lang::prelude::*;
use anchor_spl::token_interface::{
    token_metadata_initialize, Mint, Token2022, TokenMetadataInitialize,
};

use crate::utils::update_account_lamports_to_minimum_balance;

#[derive(Accounts)]
#[instruction(token_decimals: u8)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        init,
        payer = payer,
        mint::decimals = token_decimals,
        mint::authority = payer,
        mint::freeze_authority = payer,
        extensions::metadata_pointer::authority = payer,
        extensions::metadata_pointer::metadata_address = mint_account,
    )]
    pub mint_account: InterfaceAccount<'info, Mint>,
    pub token_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
}

pub fn initialize(
    ctx: Context<Initialize>,
    token_decimals: u8,
    args: TokenMetadataArgs,
) -> Result<()> {
    let TokenMetadataArgs { name, symbol, uri } = args;

    // Initialize token metadata
    token_metadata_initialize(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            TokenMetadataInitialize {
                token_program_id: ctx.accounts.token_program.to_account_info(),
                mint: ctx.accounts.mint_account.to_account_info(),
                metadata: ctx.accounts.mint_account.to_account_info(),
                mint_authority: ctx.accounts.payer.to_account_info(),
                update_authority: ctx.accounts.payer.to_account_info(),
            },
        ),
        name,
        symbol,
        uri,
    )?;

    ctx.accounts.mint_account.reload()?;

    update_account_lamports_to_minimum_balance(
        ctx.accounts.mint_account.to_account_info(),
        ctx.accounts.payer.to_account_info(),
        ctx.accounts.system_program.to_account_info(),
    )?;

    assert_eq!(ctx.accounts.mint_account.decimals, token_decimals);
    Ok(())
}

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct TokenMetadataArgs {
    pub name: String,
    pub symbol: String,
    pub uri: String,
}
