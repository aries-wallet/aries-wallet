use ethers_signers::{Ledger, HDPath};
use std::convert::TryInto;
extern crate hex;

#[allow(dead_code)]
pub async fn get_ledger_address(index: u32, is_meta_mask: bool) -> Result<String, String> {
  if is_meta_mask {
    let ledger = Ledger::new(HDPath::LedgerLive(index.try_into().unwrap()), Some(1)).await;
    if ledger.is_ok() {
      match ledger.ok() {
        Some(wallet) => {
          println!("get_address {:?}", "0x".to_string() + &hex::encode(wallet.address.as_bytes()).to_string());
          return Ok("0x".to_string() + &hex::encode(wallet.address.as_bytes()).to_string());
        },
        None => {
          println!("Open Ledger Failed");
          return Err("".to_string())
        },
      }
    } else {
      return Err("".to_string())
    }
  } else {
    return Err("".to_string())
  }
}
