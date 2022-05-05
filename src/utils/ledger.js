import { invoke } from '@tauri-apps/api/tauri';

export async function getLedgerAddress(index) {
  try {
    return await invoke('get_ledger_address', {index, isMetaMask: true});
  } catch (err) {
    console.error(err);
  }
}

export async function sendTx(index, rpcUrl, to, value, data) {
  try {
    let txHash = await invoke('send_tx', {index: Number(index), isMetaMask: true, rpcUrl, to, value: value.toString(), data });
    return '0x' + txHash;
  } catch (err) {
    console.error(err);
  }
}
