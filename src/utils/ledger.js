import { invoke } from '@tauri-apps/api/tauri';

export async function testLedger() {
  try {
    // await invoke('ledger_get_address', { index: 0, isMetaMask: false});
    let ret = await invoke('write_report');
    console.log('ret', ret);
  } catch (err) {
    console.error(err);
  } finally {
    console.log('finally');
  }
}

export async function getAddress(index) {

}