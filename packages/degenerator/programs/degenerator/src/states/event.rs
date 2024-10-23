use anchor_lang::prelude::*;
use anchor_spl::token_interface::spl_token_2022;

// Need to do this so the enum shows up in the IDL
#[derive(AnchorSerialize, AnchorDeserialize, Debug, PartialEq, Eq)]
pub enum ActionType {
    Buy,
    Sell,
}

#[event]
#[cfg_attr(feature = "client", derive(Debug))]
pub struct SwapEvent {
    #[index]
    pub mint: Pubkey,
    pub block_timestamp: i64,
    pub amount: f64,
    pub price: f64,
    pub action: ActionType,
}

pub fn get_swap_event<'a>(
    mint: AccountInfo<'a>,
    decimals: u8,
    amount: u64,
    price: u64,
    action: ActionType,
) -> Result<SwapEvent> {
    let block_timestamp = Clock::get()?.unix_timestamp;
    let amount = spl_token_2022::amount_to_ui_amount(amount, decimals);
    let price = spl_token_2022::amount_to_ui_amount(price, 9);

    Ok(SwapEvent {
        mint: mint.key(),
        block_timestamp,
        amount,
        price,
        action,
    })
}
