import { Divider, Stack } from "@mui/material";
import { Contract } from "../components/contract";
import { Log } from "../components/log";
import { Rpc } from "../components/rpc";
import { Wallet } from "../components/wallet";

export function Main() {
  return<div style={{ width: '100%', height: '100vh'}}>
    <div style={{width: '100%', padding: '20px'}} >
      <Stack 
        divider={<Divider orientation="vertical" flexItem />}
        direction={{ sm: 'column', md: 'row' }}
        spacing={2}
      >
        <Rpc />
        <Wallet />
      </Stack>
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
