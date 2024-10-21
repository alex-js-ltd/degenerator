use anchor_lang::prelude::*;

/// Emitted when swap
#[event]
#[cfg_attr(feature = "client", derive(Debug))]
pub struct MintEvent {
    #[index]
    pub mint: Pubkey,

    pub progress: f64,
}
