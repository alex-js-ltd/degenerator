use anchor_lang::{prelude::*, solana_program::entrypoint::ProgramResult};
use anchor_lang::solana_program::rent::{
    DEFAULT_EXEMPTION_THRESHOLD, DEFAULT_LAMPORTS_PER_BYTE_YEAR,
};
use anchor_lang::system_program::{transfer, Transfer};
use anchor_spl::token_interface::{
    token_metadata_initialize, Mint, Token2022, TokenMetadataInitialize,
};

use spl_token_metadata_interface::state::TokenMetadata;
use spl_type_length_value::variable_len_pack::VariableLenPack;

#[derive(Accounts)]
#[instruction(_token_decimals: u8)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        init,
        payer = payer,
        mint::decimals = _token_decimals,
        mint::authority = payer,
        mint::freeze_authority = payer,
        extensions::metadata_pointer::authority = payer,
        extensions::metadata_pointer::metadata_address = mint_account,
    )]
    pub mint_account: InterfaceAccount<'info, Mint>,

    pub token_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
}

impl<'info> Initialize<'info> {
    /// Function to pay rent for storing additional metadata
    fn pay_rent(&self, args: &TokenMetadataArgs) -> ProgramResult {
        let TokenMetadataArgs { name, symbol, uri } = args;

        // Define token metadata
        let token_metadata = TokenMetadata {
            name: name.clone(),
            symbol: symbol.clone(),
            uri: uri.clone(),
            ..Default::default()
        };

        // Add 4 extra bytes for the size of MetadataExtension (2 bytes for type, 2 bytes for length)
        let data_len = 4 + token_metadata.get_packed_len()?;

        // Calculate lamports required for the additional metadata
        let lamports = data_len as u64 * DEFAULT_LAMPORTS_PER_BYTE_YEAR * DEFAULT_EXEMPTION_THRESHOLD as u64;

        let cpi_accounts = Transfer {
            from: self.payer.to_account_info(),
            to: self.mint_account.to_account_info().clone(),
        };

        let cpi_program = self.system_program.to_account_info();
        let cpi_context = CpiContext::new(cpi_program, cpi_accounts);
        transfer(cpi_context, lamports)?;

        Ok(())
    }

    /// Function to initialize token metadata
    fn initialize_metadata(&self, args: &TokenMetadataArgs) -> ProgramResult {
        let TokenMetadataArgs { name, symbol, uri } = args;

        // Create the TokenMetadataInitialize struct
        let token_metadata_initialize_accounts = TokenMetadataInitialize {
            token_program_id: self.token_program.to_account_info(),
            mint: self.mint_account.to_account_info(),
            metadata: self.mint_account.to_account_info(),
            mint_authority: self.payer.to_account_info(),
            update_authority: self.payer.to_account_info(),
        };

        // Create the CpiContext for the token_metadata_initialize call
        let cpi_context = CpiContext::new(self.token_program.to_account_info(), token_metadata_initialize_accounts);

        // Initialize token metadata using token_metadata_initialize function
        token_metadata_initialize(cpi_context, name.clone(), symbol.clone(), uri.clone())?;

        Ok(())
    }
}

pub fn initialize(ctx: Context<Initialize>, _token_decimals: u8, args: TokenMetadataArgs) -> Result<()> {
    // Pay rent for the token metadata
    ctx.accounts.pay_rent(&args)?;

    // Initialize token metadata
    ctx.accounts.initialize_metadata(&args)?;

    Ok(())
}

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct TokenMetadataArgs {
    pub name: String,
    pub symbol: String,
    pub uri: String,
}
