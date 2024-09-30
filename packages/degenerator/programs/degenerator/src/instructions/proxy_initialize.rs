use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::Token,
    token_interface::{Mint, TokenAccount, TokenInterface},
};

use solana_program::{
    instruction::{AccountMeta, Instruction}, // For handling Solana instructions
    program::invoke,
};

#[derive(Accounts)]
pub struct ProxyInitialize<'info> {
    /// CHECK: cp_swap_program
    pub cp_swap_program: UncheckedAccount<'info>,
    /// Address paying to create the pool. Can be anyone
    #[account(mut)]
    pub creator: Signer<'info>,

    /// CHECK: amm_config
    pub amm_config: UncheckedAccount<'info>,

    /// CHECK: pool vault and lp mint authority
    pub authority: UncheckedAccount<'info>,

    /// CHECK: Initialize an account to store the pool state, init by cp-swap
    pub pool_state: UncheckedAccount<'info>,

    /// Token_0 mint, the key must smaller then token_1 mint.
    #[account(
        constraint = token_0_mint.key() < token_1_mint.key(),
        mint::token_program = token_0_program,
    )]
    pub token_0_mint: Box<InterfaceAccount<'info, Mint>>,

    /// Token_1 mint, the key must grater then token_0 mint.
    #[account(
        mint::token_program = token_1_program,
    )]
    pub token_1_mint: Box<InterfaceAccount<'info, Mint>>,

    /// CHECK: pool lp mint, init by cp-swap
    pub lp_mint: UncheckedAccount<'info>,

    /// payer token0 account
    #[account(
        mut,
        token::mint = token_0_mint,
        token::authority = creator,
    )]
    pub creator_token_0: Box<InterfaceAccount<'info, TokenAccount>>,

    /// creator token1 account
    #[account(
        mut,
        token::mint = token_1_mint,
        token::authority = creator,
    )]
    pub creator_token_1: Box<InterfaceAccount<'info, TokenAccount>>,

    /// CHECK: creator lp ATA token account, init by cp-swap
    #[account(mut)]
    pub creator_lp_token: UncheckedAccount<'info>,

    /// CHECK: Token_0 vault for the pool, init by cp-swap
    pub token_0_vault: UncheckedAccount<'info>,

    /// CHECK: Token_1 vault for the pool, init by cp-swap
    pub token_1_vault: UncheckedAccount<'info>,

    /// create pool fee account
    #[account(
        mut,
        address= raydium_cp_swap::create_pool_fee_reveiver::id(),
    )]
    pub create_pool_fee: Box<InterfaceAccount<'info, TokenAccount>>,

    /// CHECK: an account to store oracle observations, init by cp-swap
    pub observation_state: UncheckedAccount<'info>,

    /// Program to create mint account and mint tokens
    pub token_program: Program<'info, Token>,
    /// Spl token program or token program 2022
    pub token_0_program: Interface<'info, TokenInterface>,
    /// Spl token program or token program 2022
    pub token_1_program: Interface<'info, TokenInterface>,
    /// Program to create an ATA for receiving position NFT
    pub associated_token_program: Program<'info, AssociatedToken>,
    /// To create a new program account
    pub system_program: Program<'info, System>,
    /// Sysvar for program account
    pub rent: Sysvar<'info, Rent>,
}

pub fn proxy_initialize(
    ctx: Context<ProxyInitialize>,
    init_amount_0: u64,
    init_amount_1: u64,
    open_time: u64,
) -> Result<()> {
    // Calculate the instruction discriminator for "initialize" instruction
    let instruction_discriminator: u32 = 2;

    // Convert accounts into a vector of `AccountMeta`
    let account_metas = vec![
        AccountMeta::new(ctx.accounts.creator.key(), true), // Creator is signer
        AccountMeta::new(ctx.accounts.amm_config.key(), false), // amm_config is not a signer
        AccountMeta::new(ctx.accounts.authority.key(), false),
        AccountMeta::new(ctx.accounts.pool_state.key(), false),
        AccountMeta::new(ctx.accounts.token_0_mint.key(), false),
        AccountMeta::new(ctx.accounts.token_1_mint.key(), false),
        AccountMeta::new(ctx.accounts.lp_mint.key(), false),
        AccountMeta::new(ctx.accounts.creator_token_0.key(), false),
        AccountMeta::new(ctx.accounts.creator_token_1.key(), false),
        AccountMeta::new(ctx.accounts.creator_lp_token.key(), false),
        AccountMeta::new(ctx.accounts.token_0_vault.key(), false),
        AccountMeta::new(ctx.accounts.token_1_vault.key(), false),
        AccountMeta::new(ctx.accounts.create_pool_fee.key(), false),
        AccountMeta::new(ctx.accounts.observation_state.key(), false),
        AccountMeta::new(ctx.accounts.token_program.key(), false),
        AccountMeta::new(ctx.accounts.token_0_program.key(), false),
        AccountMeta::new(ctx.accounts.token_1_program.key(), false),
        AccountMeta::new(ctx.accounts.associated_token_program.key(), false),
        AccountMeta::new(ctx.accounts.system_program.key(), false),
        AccountMeta::new(ctx.accounts.rent.key(), false),
    ];

    // Allocate enough capacity for the instruction data
    let mut instruction_data = Vec::with_capacity(32);
    instruction_data.extend_from_slice(&instruction_discriminator.to_le_bytes());
    instruction_data.extend_from_slice(&init_amount_0.to_le_bytes()); // 8 bytes
    instruction_data.extend_from_slice(&init_amount_1.to_le_bytes()); // 8 bytes
    instruction_data.extend_from_slice(&open_time.to_le_bytes()); // 8 bytes

    let instruction = Instruction {
        program_id: ctx.accounts.cp_swap_program.to_account_info().key(),
        accounts: account_metas,
        data: instruction_data,
    };

    // Invoke instruction
    invoke(
        &instruction,
        &[
            ctx.accounts.creator.to_account_info(),
            ctx.accounts.amm_config.to_account_info(),
            ctx.accounts.authority.to_account_info(),
            ctx.accounts.pool_state.to_account_info(),
            ctx.accounts.token_0_mint.to_account_info(),
            ctx.accounts.token_1_mint.to_account_info(),
            ctx.accounts.lp_mint.to_account_info(),
            ctx.accounts.creator_token_0.to_account_info(),
            ctx.accounts.creator_token_1.to_account_info(),
            ctx.accounts.creator_lp_token.to_account_info(),
            ctx.accounts.token_0_vault.to_account_info(),
            ctx.accounts.token_1_vault.to_account_info(),
            ctx.accounts.create_pool_fee.to_account_info(),
            ctx.accounts.observation_state.to_account_info(),
            ctx.accounts.token_program.to_account_info(),
            ctx.accounts.token_0_program.to_account_info(),
            ctx.accounts.token_1_program.to_account_info(),
            ctx.accounts.associated_token_program.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
            ctx.accounts.rent.to_account_info(),
        ],
    )?;

    Ok(())
}
