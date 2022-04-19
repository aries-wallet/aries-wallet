import { JsonForms } from "@jsonforms/react";
import { materialCells, materialRenderers } from "@jsonforms/material-renderers";
import { Space } from "antd";
import { useMemo, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Snackbar, Tooltip } from "@mui/material";
import { AddCircle, CopyAll, DeleteForever } from "@mui/icons-material";
import { writeFile, Dir, createDir } from "@tauri-apps/api/fs";
import useRpc from "../hooks/useRpc";
import { clipboard, dialog } from "@tauri-apps/api";
import { MessageBox } from './message';


const schemaRpc = {
  type: "string",
  title: "Rpc URL",
}

const schemaRpcUI = {
  type: "Control",
  scope: "#",
  options: {
    readOnly: true
  }
}


export function Rpc() {
  const [successInfo, setSuccessInfo] = useState('');
  const [errorInfo, setErrorInfo] = useState('');
  const [showAddRpc, setShowAddRpc] = useState(false);

  const { rpc, setRpc, addRpc, rpcList, deleteRpc } = useRpc();
  const { rpcUrl, network } = useMemo(()=>{
    if (rpc) {
      return {rpcUrl: rpc.rpcUrl, network: rpc.name};
    } else {
      return {rpcUrl: 'waiting', network: 'waiting'};
    }
  }, [rpc]);

  const schemaNetwork = useMemo(()=>{
    return {
      type: "string",
      title: "Current Network",
      enum: rpcList.map(v=>v.name)
    }
  }, [rpcList, rpcList.length])

  console.log('schemaNetwork', schemaNetwork, rpcList);

  const [newRpc, setNewRpc] = useState({
    name:'',
    rpcUrl: '',
    explorer: ''
  });

  return <div>
    <Space >
      <JsonForms
        renderers={materialRenderers}
        cells={materialCells}
        data={network}
        onChange={v=>setRpc(v.data)}
        schema={schemaNetwork}
      />
      <JsonForms
        renderers={materialRenderers}
        cells={materialCells}
        data={rpcUrl}
        schema={schemaRpc}
        uischema={schemaRpcUI}
      />
      <Tooltip title="Copy Rpc URL">
        <IconButton size="small" onClick={async ()=>{
          clipboard.writeText(rpcUrl);
          setSuccessInfo("Success Copied Rpc Url");
        }}>
          <CopyAll />
        </IconButton>
      </Tooltip>
      <Tooltip title="Add Rpc">
        <IconButton size="small" onClick={()=>{
          setShowAddRpc(true);
        }}>
          <AddCircle />
        </IconButton>
      </Tooltip>
      <Tooltip title="Remove Rpc">
        <IconButton size="small" onClick={async ()=>{
          if (! await dialog.confirm("Are you sure to delete this RPC?")) {
            return;
          }
          let ret = await deleteRpc(rpcUrl);
          if (ret) {
            setSuccessInfo("Rpc Deleted");
          } else {
            setErrorInfo("Rpc delete failed");
          }
        }}>
          <DeleteForever />
        </IconButton>
      </Tooltip>
    </Space>
    <Dialog open={showAddRpc} onClose={()=>setShowAddRpc(false)}>
      <DialogTitle style={{color: 'white'}}>Add Rpc Network</DialogTitle>
      <DialogContent>
        <JsonForms
          renderers={materialRenderers}
          cells={materialCells}
          data={newRpc}
          onChange={e=>setNewRpc(e.data)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={async ()=>{
          await addRpc(newRpc);
          setShowAddRpc(false);
          await setRpc(newRpc.name);
        }}>Ok</Button>
        <Button onClick={()=>{
          setShowAddRpc(false);
        }}>Cancel</Button>
      </DialogActions>
    </Dialog>
    <MessageBox successInfo={successInfo} errorInfo={errorInfo} setSuccessInfo={setSuccessInfo} setErrorInfo={setErrorInfo} />
  </div>
    
}