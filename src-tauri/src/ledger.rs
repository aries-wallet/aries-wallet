use ethers::{prelude::*, utils::parse_ether};
use std::convert::TryInto;
extern crate hex;

#[allow(dead_code)]
pub async fn get_ledger_address(index: u32, is_meta_mask: bool) -> Result<String, String> {
  if is_meta_mask {
    let ledger = Ledger::new(HDPath::LedgerLive(index.try_into().unwrap()), 1).await;
    if ledger.is_ok() {
      match ledger.ok() {
        Some(wallet) => {
          println!("get_address {:?}", "0x".to_string() + &hex::encode(wallet.address().as_bytes()).to_string());
          return Ok("0x".to_string() + &hex::encode(wallet.address().as_bytes()).to_string());
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

// send_tx, value in ether.
#[allow(dead_code)]
pub async fn send_tx(index: u32, is_meta_mask: bool, rpc_url: String, to: String, value: String, data: String) -> Result<String, Box<dyn std::error::Error>> {
  let provider = Provider::<Http>::try_from(rpc_url).unwrap();
  let chain_id = provider.get_chainid().await?;
  println!("chain_id: {:?}", chain_id);
  if is_meta_mask {
    let ledger = Ledger::new(HDPath::LedgerLive(index.try_into().unwrap()), chain_id.try_into().unwrap()).await?;
    println!("from addr: {:?}", ledger.address());
    let client = ethers::middleware::SignerMiddleware::new(provider, ledger);

    let mut tx = TransactionRequest::new()
        .to(to.parse::<Address>().unwrap())
        .value(parse_ether(&value)?);
    
    if data.len() > 0 {
      // with no 0x prefix
      let tx_data = hex::decode(data).unwrap();

      tx = TransactionRequest::new()
        .to(to.parse::<Address>().unwrap())
        .data(tx_data)
        .value(parse_ether(&value)?);
    }

    println!("tx {:?}", &tx);

    let pending_tx = client.send_transaction(tx, None).await?;

    let _receipt = pending_tx.confirmations(1).await?;

    println!("_receipt: {:?}", _receipt);

    match _receipt {
      Some(receipt) => Ok(hex::encode(receipt.transaction_hash)),
      None => Ok("".to_string())
    }
  } else {
    Err(Box::new(LedgerError::UnsupportedAppVersion("metamask".to_string())))
  }
}