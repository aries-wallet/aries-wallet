import { TextField } from "@mui/material";

export function Log() {
  return <div style={{width:'100%', padding:'20px'}}>
    <TextField label="Logs" fullWidth multiline minRows={6} disabled/>
  </div>
}