use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token_interface::{Mint, TokenAccount, TokenInterface};

use crate::utils::{
    get_price_per_token, set_price_per_token, transfer_from_user_to_pool_vault,
    update_account_lamports_to_minimum_balance, Price, DISCRIMINATOR, POOL_VAULT_SEED, POOL_PRICE_SEED
};

pub fn create_pool(ctx: Context<CreatePool>, amount: u64) -> Result<()> {
    // transfer minimum rent to pool account
    update_account_lamports_to_minimum_balance(
        ctx.accounts.pool_authority.to_account_info(),
        ctx.accounts.payer.to_account_info(),
        ctx.accounts.system_program.to_account_info(),
    )?;

    transfer_from_user_to_pool_vault(
        ctx.accounts.payer.to_account_info(),
        ctx.accounts.payer_ata.to_account_info(),
        ctx.accounts.pool_ata.to_account_info(),
        ctx.accounts.mint.to_account_info(),
        ctx.accounts.token_program.to_account_info(),
        amount,
        ctx.accounts.mint.decimals,
    )?;

    let price_per_token = get_price_per_token(
        ctx.accounts.payer_ata.amount as u128,
        ctx.accounts.mint.supply as u128,
    );

    set_price_per_token(&mut ctx.accounts.current_price, price_per_token);

    Ok(())
}

#[derive(Accounts)]
pub struct CreatePool<'info> {
    /// The payer for the transaction
    #[account(mut)]
    pub payer: Signer<'info>,

    /// CHECK: pool vault
    #[account(mut,
        seeds = [POOL_VAULT_SEED.as_bytes(), mint.key().as_ref()],
        bump,
   
  
    )]
    pub pool_authority: AccountInfo<'info>,

    #[account(init,
        seeds = [POOL_PRICE_SEED.as_bytes(), mint.key().as_ref()],
        bump,
        payer = payer,
        space = DISCRIMINATOR + Price::INIT_SPACE
    )]
    pub current_price: Account<'info, Price>,

    /// The Mint for which the ATA is being created
    pub mint: Box<InterfaceAccount<'info, Mint>>,

    /// The ATA that will be created
    #[account(
        init,
        payer = payer,
        associated_token::mint = mint,
        associated_token::authority = pool_authority,
    )]
    pub pool_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(mut)]
    pub payer_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    /// Spl token program or token program 2022
    pub token_program: Interface<'info, TokenInterface>,

    /// Associated Token Program
    pub associated_token_program: Program<'info, AssociatedToken>,

    /// System Program
    pub system_program: Program<'info, System>,

    /// Sysvar for program account
    pub rent: Sysvar<'info, Rent>,
}
