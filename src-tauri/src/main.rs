#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use tauri::{Submenu, Menu, MenuItem};
mod my_ledger;
use tauri::async_runtime::block_on;

fn main() {
  let my_app_menu = Menu::new()
    .add_native_item(MenuItem::Copy)
    .add_native_item(MenuItem::Paste)
    .add_native_item(MenuItem::SelectAll)
    .add_native_item(MenuItem::Cut)
    .add_native_item(MenuItem::Undo)
    .add_native_item(MenuItem::Redo);
    
  let menu = Menu::new()
     .add_submenu(Submenu::new("Edit", my_app_menu));

  tauri::Builder::default()
    .menu(menu)
    // .invoke_handler(tauri::generate_handler![ledger_get_address])
    .invoke_handler(tauri::generate_handler![get_ledger_address])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

#[tauri::command]
fn get_ledger_address(index: u32, is_meta_mask: bool) -> Result<String, String> {
  let future = my_ledger::get_ledger_address(index, is_meta_mask);
  return block_on(future);
}
