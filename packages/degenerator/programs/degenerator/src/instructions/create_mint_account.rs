use anchor_lang::prelude::*;

use anchor_spl::{
    associated_token::AssociatedToken,
    token_2022::spl_token_2022::extension::metadata_pointer::MetadataPointer,
    token_interface::{
        get_mint_extension_data, spl_token_metadata_interface::state::TokenMetadata,
        token_metadata_initialize, Mint, Token2022, TokenMetadataInitialize,
    },
};
use spl_pod::optional_keys::OptionalNonZeroPubkey;

use crate::utils::token::{
    get_meta_list_size, get_mint_extensible_extension_data,
    update_account_lamports_to_minimum_balance,
};

use crate::utils::seed::META_LIST_ACCOUNT_SEED;

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct CreateMintAccountArgs {
    pub name: String,
    pub symbol: String,
    pub uri: String,
}

#[derive(Accounts)]
#[instruction(token_decimals: u8, args: CreateMintAccountArgs)]
pub struct CreateMintAccount<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        init,
        signer,
        payer = payer,
        mint::token_program = token_program,
        mint::decimals = token_decimals,
        mint::authority = payer,
        extensions::metadata_pointer::authority = payer,
        extensions::metadata_pointer::metadata_address = mint,

    )]
    pub mint: Box<InterfaceAccount<'info, Mint>>,

    /// CHECK: This account's data is a buffer of TLV data
    #[account(
        init,
        space = get_meta_list_size(None),
        seeds = [META_LIST_ACCOUNT_SEED.as_bytes(), mint.key().as_ref()],
        bump,
        payer = payer,
    )]
    pub extra_metas_account: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub token_program: Program<'info, Token2022>,
}

pub fn create_mint_account(
    ctx: Context<CreateMintAccount>,
    token_decimals: u8,
    args: CreateMintAccountArgs,
) -> Result<()> {
    token_metadata_initialize(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            TokenMetadataInitialize {
                token_program_id: ctx.accounts.token_program.to_account_info(),
                metadata: ctx.accounts.mint.to_account_info(),
                update_authority: ctx.accounts.payer.to_account_info(),
                mint_authority: ctx.accounts.payer.to_account_info(),
                mint: ctx.accounts.mint.to_account_info(),
            },
        ),
        args.name.clone(),
        args.symbol.clone(),
        args.uri.clone(),
    )?;

    ctx.accounts.mint.reload()?;
    let mint_data = &mut ctx.accounts.mint.to_account_info();
    let metadata = get_mint_extensible_extension_data::<TokenMetadata>(mint_data)?;
    assert_eq!(metadata.mint, ctx.accounts.mint.key());
    assert_eq!(metadata.name, args.name);
    assert_eq!(metadata.symbol, args.symbol);
    assert_eq!(metadata.uri, args.uri);
    assert_eq!(ctx.accounts.mint.decimals, token_decimals);

    let metadata_pointer = get_mint_extension_data::<MetadataPointer>(mint_data)?;
    let mint_key: Option<Pubkey> = Some(ctx.accounts.mint.key());
    let authority_key: Option<Pubkey> = Some(ctx.accounts.payer.key());
    assert_eq!(
        metadata_pointer.metadata_address,
        OptionalNonZeroPubkey::try_from(mint_key)?
    );
    assert_eq!(
        metadata_pointer.authority,
        OptionalNonZeroPubkey::try_from(authority_key)?
    );

    // transfer minimum rent to mint account
    update_account_lamports_to_minimum_balance(
        ctx.accounts.mint.to_account_info(),
        ctx.accounts.payer.to_account_info(),
        ctx.accounts.system_program.to_account_info(),
    )?;

    Ok(())
}
