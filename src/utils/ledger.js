import { invoke } from '@tauri-apps/api/tauri';

export async function getLedgerAddress(index) {
  try {
    return await invoke('get_ledger_address', {index, isMetaMask: true});
  } catch (err) {
    console.error(err);
  }
}
