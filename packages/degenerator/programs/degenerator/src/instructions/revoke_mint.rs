use anchor_lang::prelude::*;
use anchor_spl::token_interface::{
    set_authority, spl_token_2022::instruction::AuthorityType, Mint, SetAuthority, Token2022,
};

pub fn revoke_mint(ctx: Context<CloseMint>) -> Result<()> {
    let cpi_accounts = SetAuthority {
        current_authority: ctx.accounts.current_authority.to_account_info().clone(),
        account_or_mint: ctx.accounts.mint_account.to_account_info().clone(),
    };

    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_context = CpiContext::new(cpi_program, cpi_accounts);

    set_authority(cpi_context, AuthorityType::MintTokens, None)?;

    Ok(())
}

#[derive(Accounts)]
pub struct CloseMint<'info> {
    pub current_authority: Signer<'info>,
    #[account(
        mut,
        extensions::metadata_pointer::metadata_address = mint_account,
    )]
    pub mint_account: InterfaceAccount<'info, Mint>,
    pub token_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
}
