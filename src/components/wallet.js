import { JsonForms } from "@jsonforms/react";
import { materialCells, materialRenderers } from "@jsonforms/material-renderers";
import { Space } from "antd";
import { useEffect, useState } from "react";
import { Box, Button, IconButton, Modal, TextField, Tooltip, Typography } from "@mui/material";
import { AddCard, ContentCopy, DeleteForever, Download, Explore, FileOpen, Key, LockOpen } from "@mui/icons-material";
import { getDb } from "../utils/db";
import { withThemeCreator } from "@mui/styles";
import useLog from "../hooks/useLog";

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  borderRadius: '10px'
};

export function Wallet() {
  const [address, setAddress] = useState('');
  const [schemaAddress, setSchemaAddress] = useState({
    type: "string",
    title: "Wallet Address"
  });
  const [showCreateAddress, setShowCreateAddress] = useState(false);
  const [accountName, setAccountName] = useState('');
  const {addLog} = useLog();

  useEffect(()=>{
    let list = getDb().data.walletList.map(v=>{
      return [v.name, '(', v.address.slice(0,6), '...', v.address.slice(-4), ')'].join('');
    });
    setAddress(list[0]);
    setAccountName('Account');
    setSchemaAddress({
      type: "string",
      title: "Wallet Address",
      enum: list
    });
  }, []);



  return <Space >
    <JsonForms
      renderers={materialRenderers}
      cells={materialCells}
      data={address}
      onChange={v=>setAddress(v.data)}
      schema={schemaAddress}
    />
    <TextField label="Balance" size="small" value={123423423.134} disabled style={{width: '120px'}} />
    <Tooltip title="Copy Address">
      <IconButton size="small" onClick={()=>{
        addLog('copy address');
      }}>
        <ContentCopy size="small" />
      </IconButton>
    </Tooltip>
    <Tooltip title="View in Explorer">
      <IconButton size="small">
        <Explore />
      </IconButton>
    </Tooltip>
    <Tooltip title="Copy Private Key">
      <IconButton size="small">
        <LockOpen />
      </IconButton>
    </Tooltip>
    <Tooltip title="Create Address">
      <IconButton size="small" onClick={e=>{
        setShowCreateAddress(true);
      }}>
        <AddCard />
      </IconButton>
    </Tooltip>
    <Tooltip title="Delete Address">
      <IconButton size="small">
        <DeleteForever />
      </IconButton>
    </Tooltip>
    <Tooltip title="Import Private Key">
      <IconButton size="small">
        <Key />
      </IconButton>
    </Tooltip>
    <Tooltip title="Import Keystore File">
      <IconButton size="small">
        <FileOpen />
      </IconButton>
    </Tooltip>
    <Tooltip title="Export Keystore File">
      <IconButton size="small">
        <Download />
      </IconButton>
    </Tooltip>
    <Modal
      open={showCreateAddress}
      onClose={()=>{setShowCreateAddress(false)}}
    >
      <Box sx={modalStyle}>
        <JsonForms 
          data={accountName}
          onChange={v=>setAccountName(v.data)}
          schema={{
            type: 'string',
            title: 'Please Enter Address Name',
          }}
          renderers={materialRenderers}
          cells={materialCells}
        />
        <p></p>
        <Space style={{width: '100%', justifyContent: 'center'}}>
        <Button variant="contained" onClick={()=>{

        }}>Create</Button>
        <Button variant="outlined" onClick={e=>{
          setShowCreateAddress(false)
        }}>Cancel</Button>
        </Space>
        
      </Box>
    </Modal>
  </Space>
}
