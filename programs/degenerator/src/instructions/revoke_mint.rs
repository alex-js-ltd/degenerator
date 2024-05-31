use anchor_lang::prelude::*;
use anchor_spl::token_interface::{
     SetAuthority, set_authority, Mint, TokenInterface, spl_token_2022::instruction::AuthorityType
};

pub fn process_revoke_mint_authority(ctx: Context<RevokeMint>) -> Result<()> {
    let cpi_context = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        SetAuthority {
            current_authority: ctx.accounts.mint_authority.to_account_info(),
            account_or_mint: ctx.accounts.mint.to_account_info(),
        },
    );
   set_authority(
        cpi_context,
        AuthorityType::MintTokens,
      None,
    )?;
    Ok(())
}

#[derive(Accounts)]
pub struct RevokeMint<'info> {
    #[account(mut, signer)]
    pub mint_authority: Signer<'info>,
    #[account(mut)]
    pub mint: InterfaceAccount<'info, Mint>,
    pub token_program: Interface<'info, TokenInterface>,
}