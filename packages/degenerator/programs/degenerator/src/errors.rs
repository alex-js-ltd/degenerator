use anchor_lang::prelude::*;

#[error_code]
pub enum Errors {
    #[msg("Insufficient tokens in the pool.")]
    InsufficientTokens,
}