use anchor_lang::prelude::*;
use anchor_spl::token_interface::{
    set_authority, spl_token_2022::instruction::AuthorityType, Mint, SetAuthority, Token2022,
};

pub fn revoke_freeze_authority(ctx: Context<Authority>) -> Result<()> {
    set_authority(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            SetAuthority {
                current_authority: ctx.accounts.current_authority.to_account_info(),
                account_or_mint: ctx.accounts.mint_account.to_account_info(),
            },
        ),
        AuthorityType::FreezeAccount,
        None,
    )?;
    Ok(())
}

pub fn revoke_mint_authority(ctx: Context<Authority>) -> Result<()> {
    set_authority(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            SetAuthority {
                current_authority: ctx.accounts.current_authority.to_account_info(),
                account_or_mint: ctx.accounts.mint_account.to_account_info(),
            },
        ),
        AuthorityType::MintTokens,
        None,
    )?;

    Ok(())
}
#[derive(Accounts)]
pub struct Authority<'info> {
    pub current_authority: Signer<'info>,
    #[account(
        mut,
        extensions::metadata_pointer::metadata_address = mint_account,
    )]
    pub mint_account: InterfaceAccount<'info, Mint>,
    pub token_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
}
