import { TextField } from "@mui/material";
import { useEffect } from "react";
import useLog from "../hooks/useLog";

export function Log() {
  const { logs, addLog } = useLog();

  useEffect(()=>{
    addLog('Wallet started.');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div style={{width:'100%', padding:'20px'}}>
    <TextField label="Logs" fullWidth multiline minRows={6} maxRows={6} disabled value={logs.join('\n')} />
  </div>
}
