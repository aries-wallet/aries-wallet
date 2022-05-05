import { invoke } from '@tauri-apps/api/tauri';

export async function getLedgerAddress(index, isMetaMask) {
  try {
    console.log('getLedgerAddress', index, isMetaMask);
    return await invoke('get_ledger_address', {index, isMetaMask});
  } catch (err) {
    console.error(err);
  }
}

export async function sendTx(index, rpcUrl, to, value, data, isMetaMask) {
  try {
    console.log('sendTx', index, rpcUrl, to, value, data, isMetaMask);
    console.log('data length', data.length);
    let txHash = await invoke('send_tx', {index: Number(index), isMetaMask, rpcUrl, to, value: value.toString(), data });
    return '0x' + txHash;
  } catch (err) {
    console.error(err);
  }
}
