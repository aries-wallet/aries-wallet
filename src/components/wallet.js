import { JsonForms } from "@jsonforms/react";
import { materialCells, materialRenderers } from "@jsonforms/material-renderers";
import { Space } from "antd";
import { useState } from "react";
import { IconButton, Tooltip } from "@mui/material";
import { AddBox, AddCard, ContentCopy, DeleteForever, Download, Explore, FileOpen, Key, LockOpen } from "@mui/icons-material";

const schemaAddress = {
  type: "string",
  title: "Wallet Address",
  enum: [
    'Account 1 (0x7521...5188)',
    'Account 2 (0x4Cf0...7D9e)',
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


export function Wallet() {
  const [network, setNetwork] = useState('Account 1 (0x7521...5188)');
  return <Space >
    <JsonForms
      renderers={materialRenderers}
      cells={materialCells}
      data={network}
      onChange={v=>setNetwork(v.data)}
      schema={schemaAddress}
    />
    <Tooltip title="Copy Address">
      <IconButton>
        <ContentCopy />
      </IconButton>
    </Tooltip>
    <Tooltip title="View in Explorer">
      <IconButton>
        <Explore />
      </IconButton>
    </Tooltip>
    <Tooltip title="Copy Private Key">
      <IconButton>
        <LockOpen />
      </IconButton>
    </Tooltip>
    <Tooltip title="Create Address">
      <IconButton>
        <AddCard />
      </IconButton>
    </Tooltip>
    <Tooltip title="Delete Address">
      <IconButton>
        <DeleteForever />
      </IconButton>
    </Tooltip>
    <Tooltip title="Import Private Key">
      <IconButton>
        <Key />
      </IconButton>
    </Tooltip>
    <Tooltip title="Import Keystore File">
      <IconButton>
        <FileOpen />
      </IconButton>
    </Tooltip>
    <Tooltip title="Export Keystore File">
      <IconButton>
        <Download />
      </IconButton>
    </Tooltip>
    
  </Space>
}
