import { getDb } from './db';
import Web3 from 'web3';

var CryptoJS = require("crypto-js");

let password;

export function encrypt(text) {
  // Encrypt
  let ciphertext = CryptoJS.AES.encrypt(text, password).toString();
  return ciphertext;
}

export function decrypt(text) {
  // Decrypt
  let bytes = CryptoJS.AES.decrypt(text, password);
  let originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
}

export function decryptWithPwd(text, pwd) {
  // Decrypt
  let bytes = CryptoJS.AES.decrypt(text, pwd);
  let originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
}

export function verifyPassword(pwd) {
  try {
    let bytes = CryptoJS.AES.decrypt(getDb().data.unlock, pwd);
    let originalText = bytes.toString(CryptoJS.enc.Utf8);
    if (originalText === 'tauri-wallet') {
      password = pwd;
      return true;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function registerPassword(pwd) {
  let str = CryptoJS.AES.encrypt('tauri-wallet', pwd).toString();
  getDb().data.unlock = str;
  await getDb().write();
  password = pwd;
  console.log('password saved');
}

export async function createAddress(name) {
  const web3 = new Web3();
  let newAccount = web3.eth.accounts.create();
  let pk = encrypt(newAccount.privateKey);
  getDb().data.walletList.push({
    name,
    address: newAccount.address,
    pk
  });
  await getDb().write();
}

export async function importAccount(account) {
  getDb().data.walletList.push(account);
  await getDb().write();
  
}