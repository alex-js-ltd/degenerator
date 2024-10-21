use anchor_lang::prelude::*;

/// Emitted when swap
#[event]
#[cfg_attr(feature = "client", derive(Debug))]
pub struct SwapEvent {
    #[index]
    pub mint: Pubkey,
    /// pool vault sub trade fees
    pub current_supply: u64,
}
