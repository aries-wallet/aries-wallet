import { JsonForms } from "@jsonforms/react";
import { materialCells, materialRenderers } from "@jsonforms/material-renderers";
import { Space } from "antd";
import { useState } from "react";
import { IconButton, Tooltip } from "@mui/material";
import { AddCircle, CopyAll, Delete, DeleteForever, RemoveCircle } from "@mui/icons-material";

const schemaNetwork = {
  type: "string",
  title: "Current Network",
  enum: [
    'Wanchain Mainnet',
    'Wanchain Testnet',
  ]
}

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
  const [network, setNetwork] = useState('Wanchain Mainnet');
  const [rpcUrl, setRpcUrl] = useState('https://gwan-ssl.wandevs.org:46891');
  return <Space >
    <JsonForms
      renderers={materialRenderers}
      cells={materialCells}
      data={network}
      onChange={v=>setNetwork(v.data)}
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
      <IconButton>
        <CopyAll />
      </IconButton>
    </Tooltip>
    <Tooltip title="Add Rpc">
      <IconButton>
        <AddCircle />
      </IconButton>
    </Tooltip>
    <Tooltip title="Remove Rpc">
      <IconButton>
        <DeleteForever />
      </IconButton>
    </Tooltip>
  </Space>
}