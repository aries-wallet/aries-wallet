import { Divider } from "@mui/material";
import { Contract } from "../components/contract";
import { Rpc } from "../components/rpc";
import { Wallet } from "../components/wallet";

export function Main() {
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
    <div style={{width: '100%', height: '10vh'}} >logs</div>
  </div>
}
