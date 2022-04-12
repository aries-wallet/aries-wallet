import { Divider } from "@mui/material";
import { Rpc } from "../components/rpc";
import { Wallet } from "../components/wallet";

export function Main() {
  return<div style={{ width: '100%', height: '100vh'}}>
    <div style={{width: '100%', padding: '20px', height:"90px"}} >
      <span style={{float:"left"}}><Rpc /></span>
      <span style={{float:"right"}}><Wallet /></span>
    </div>
    <Divider />
    <div style={{width: '100%', height: '10vh'}} >contract</div>
    <Divider />
    <div style={{width: '100%', height: '10vh'}} >logs</div>
  </div>
}
