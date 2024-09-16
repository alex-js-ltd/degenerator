use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token_interface::{Mint, TokenAccount, TokenInterface};

use crate::utils::{
    calculate_buy_price, calculate_progress, calculate_sell_price, set_pool_state, token_mint_to,
    update_account_lamports_to_minimum_balance, PoolState, POOL_STATE_SEED, POOL_VAULT_SEED,
    RAYDIUM_VAULT_SEED,
};

pub fn create_pool(ctx: Context<CreatePool>, amount: u64) -> Result<()> {
    // transfer minimum rent to pool account
    update_account_lamports_to_minimum_balance(
        ctx.accounts.pool_vault.to_account_info(),
        ctx.accounts.payer.to_account_info(),
        ctx.accounts.system_program.to_account_info(),
    )?;

    update_account_lamports_to_minimum_balance(
        ctx.accounts.raydium_vault.to_account_info(),
        ctx.accounts.payer.to_account_info(),
        ctx.accounts.system_program.to_account_info(),
    )?;

    let eighty_percent = amount.saturating_mul(80).saturating_div(100);
    let twenty_percent = amount.saturating_mul(20).saturating_div(100);

    msg!("Pool amount (80%): {}", eighty_percent);
    msg!("Raydium amount (20%): {}", twenty_percent);

    token_mint_to(
        ctx.accounts.payer.to_account_info(),
        ctx.accounts.token_program.to_account_info(),
        ctx.accounts.mint.to_account_info(),
        ctx.accounts.pool_ata.to_account_info(),
        eighty_percent,
        ctx.accounts.mint.decimals,
    )?;

    token_mint_to(
        ctx.accounts.payer.to_account_info(),
        ctx.accounts.token_program.to_account_info(),
        ctx.accounts.mint.to_account_info(),
        ctx.accounts.raydium_ata.to_account_info(),
        twenty_percent,
        ctx.accounts.mint.decimals,
    )?;

    ctx.accounts.pool_ata.reload()?;
    ctx.accounts.raydium_ata.reload()?;

    let buy_price = calculate_buy_price(
        ctx.accounts.pool_ata.amount as u128,
        eighty_percent as u128,
        1 as u128,
    );

    let sell_price = calculate_sell_price(
        ctx.accounts.pool_ata.amount as u128,
        eighty_percent as u128,
        1 as u128,
    );

    let progress = calculate_progress(ctx.accounts.pool_ata.amount as u128, eighty_percent as u128);

    set_pool_state(
        &mut ctx.accounts.pool_state,
        buy_price,
        sell_price,
        ctx.accounts.pool_ata.amount,
        ctx.accounts.pool_ata.amount,
        progress,
    );

    Ok(())
}

#[derive(Accounts)]
pub struct CreatePool<'info> {
    /// The payer for the transaction
    #[account(mut)]
    pub payer: Signer<'info>,

    /// CHECK: pda to control pool_ata & store lamports
    #[account(mut,
        seeds = [POOL_VAULT_SEED.as_bytes(), mint.key().as_ref()],
        bump,
    )]
    pub pool_vault: AccountInfo<'info>,

    /// CHECK: pda to control pool_ata & store lamports
    #[account(mut,
            seeds = [RAYDIUM_VAULT_SEED.as_bytes(), mint.key().as_ref()],
            bump,
        )]
    pub raydium_vault: AccountInfo<'info>,

    /// The Mint for which the ATA is being created
    pub mint: Box<InterfaceAccount<'info, Mint>>,

    /// The ATA that will be created
    #[account(
        init,
        payer = payer,
        associated_token::mint = mint,
        associated_token::authority = pool_vault,
    )]
    pub pool_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    /// The ATA that will be created
    #[account(
            init,
            payer = payer,
            associated_token::mint = mint,
            associated_token::authority = raydium_vault,
        )]
    pub raydium_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    /// pda to store current price
    #[account(init,
        seeds = [POOL_STATE_SEED.as_bytes(), mint.key().as_ref()],
        bump,
        payer = payer,
        space = PoolState::LEN
    )]
    pub pool_state: Account<'info, PoolState>,

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
