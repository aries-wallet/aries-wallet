import { invoke } from '@tauri-apps/api/tauri';

export async function testLedger() {
  try {
    // await invoke('ledger_get_address', { index: 0, isMetaMask: false});
    let ret = await invoke('get_ledger_address', {index: 0, isMetaMask: true});
    console.log('ret', ret);
    ret = await invoke('get_ledger_address', {index: 1, isMetaMask: true});
    console.log('ret', ret);
    ret = await invoke('get_ledger_address', {index: 2, isMetaMask: true});
    console.log('ret', ret);
    ret = await invoke('get_ledger_address', {index: 3, isMetaMask: true});
    console.log('ret', ret);
    ret = await invoke('get_ledger_address', {index: 4, isMetaMask: true});
    console.log('ret', ret);
  } catch (err) {
    console.error(err);
  } finally {
    console.log('finally');
  }
}

export async function getLedgerAddress(index) {
  try {
    return await invoke('get_ledger_address', {index, isMetaMask: true});
  } catch (err) {
    console.error(err);
  }
}
