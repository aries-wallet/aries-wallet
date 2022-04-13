import { Divider } from "@mui/material";
import { useEffect } from "react";
import { Contract } from "../components/contract";
import { Log } from "../components/log";
import { Rpc } from "../components/rpc";
import { Wallet } from "../components/wallet";
import { initDb } from "../utils/db";

export function Main() {

  useEffect(()=>{
    initDb().then(console.log).catch(console.error).finally(()=>console.log('initDb finish'));
  }, []);

  return<div style={{ width: '100%', height: '100vh'}}>
    <div style={{width: '100%', padding: '20px', height:"90px"}} >
      <span style={{float:"left"}}><Rpc /></span>
      <span style={{float:"right"}}><Wallet /></span>
    </div>
    <Divider />
    <div style={{width: '100%', minHeight:'60vh', padding: "20px"}} >
      <Contract />
    </div>
    <Divider />
    <div style={{width: '100%', height: '10vh'}} >
      <Log />
    </div>
  </div>
}
