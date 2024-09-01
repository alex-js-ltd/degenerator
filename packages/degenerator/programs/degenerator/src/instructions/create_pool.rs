use anchor_lang::{prelude::*, system_program::{Transfer, transfer}};
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token_interface::{Mint, TokenAccount, TokenInterface};

pub fn create_pool(ctx: Context<CreatePool>) -> Result<()> {
    ctx.accounts.pay_rent()?;
    Ok(())
}

#[derive(Accounts)]
pub struct CreatePool<'info> {
    /// The payer for the transaction
    #[account(mut)]
    pub payer: Signer<'info>,

    /// The PDA that will control the ATA
    #[account(mut,
        seeds = [b"pool", mint.key().as_ref()],
        bump,
    )]
    pub pool_authority: AccountInfo<'info>,

    /// The Mint for which the ATA is being created
    pub mint: Box<InterfaceAccount<'info, Mint>>,

    /// The ATA that will be created
    #[account(
        init,
        payer = payer,
        associated_token::mint = mint,
        associated_token::authority = pool_authority,
    )]
    pub token_account: Box<InterfaceAccount<'info, TokenAccount>>,

    /// System Program
    pub system_program: Program<'info, System>,

    /// Rent Sysvar
    pub rent: Sysvar<'info, Rent>,

    /// Token Program
    pub token_program: Interface<'info, TokenInterface>,

    /// Associated Token Program
    pub associated_token_program: Program<'info, AssociatedToken>,
}

impl<'info> CreatePool<'info> {
    fn pay_rent(&self) -> Result<()> {
        let pool_authority = self.pool_authority.to_account_info();

        // Calculate the minimum balance for rent exemption
        let rent_exemption_amount = self.rent.minimum_balance(pool_authority.data_len());

        // Check if pool authority is rent-exempt
        if pool_authority.lamports() < rent_exemption_amount {
            // Calculate the amount of lamports needed
            let lamports_needed = rent_exemption_amount - pool_authority.lamports();

            // Perform the transfer from the payer to the pool authority
            let cpi_accounts = Transfer {
                from: self.payer.to_account_info(),
                to: pool_authority.clone(),
            };
            let cpi_program = self.system_program.to_account_info();
            let cpi_context = CpiContext::new(cpi_program, cpi_accounts);

            // Transfer the necessary lamports
            transfer(cpi_context, lamports_needed)?;

            msg!("Transferred {} lamports to pool authority to make it rent-exempt.", lamports_needed);
        } else {
            msg!("Pool authority is already rent-exempt.");
        }
        Ok(())
    }
}
