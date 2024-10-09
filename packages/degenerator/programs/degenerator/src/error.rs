/// Errors that may be returned by the TokenSwap program.
use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("Insufficient tokens in user's wallet")]
    InsufficientUserSupply,

    #[msg("Account is not rent-exempt.")]
    AccountNotRentExempt,
}
