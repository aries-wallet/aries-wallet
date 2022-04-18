import { JsonForms } from "@jsonforms/react";
import { materialCells, materialRenderers } from "@jsonforms/material-renderers";
import { Space } from "antd";
import { useEffect, useMemo, useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Modal, TextField, Tooltip, Typography } from "@mui/material";
import { AddCard, ContentCopy, DeleteForever, Download, Explore, FileOpen, Key, LockOpen } from "@mui/icons-material";
import { getDb } from "../utils/db";
import { withThemeCreator } from "@mui/styles";
import useLog from "../hooks/useLog";
import { createAddress } from "../utils/crypto";

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
  const [schemaAddress, setSchemaAddress] = useState({
    type: "string",
    title: "Wallet Address"
  });
  const [showCreateAddress, setShowCreateAddress] = useState(false);
  const [accountName, setAccountName] = useState('');
  const {addLog} = useLog();
  const [reload, setReload] = useState(0);
  const [current, setCurrent] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(()=>{
    let list = getDb().data.walletList.map(v=>{
      return [v.name, '(', v.address.slice(0,6), '...', v.address.slice(-4), ')'].join('');
    });
    console.log('current', getDb().data.current);

    let currentInDb = getDb().data.current ? getDb().data.current.wallet : {};
    if ( currentInDb && currentInDb.address) {
      console.log('setCurrent 0');
      setCurrent(currentInDb);
    } else {
      console.log('setCurrent 1', currentInDb);
      setCurrent(getDb().data.walletList[0]);
    }
    setAccountName('Account ');
    setSchemaAddress({
      type: "string",
      title: "Wallet Address",
      enum: list
    });
  }, [reload]);

  const currentAddress = useMemo(()=>{
    if (current.address) {
      return [current.name, '(', current.address.slice(0,6), '...', current.address.slice(-4), ')'].join('');
    }
  }, [current]);

  const setCurrentInDb = async (newCurrent) => {
    if (!getDb().data.current) {
      getDb().data.current = {};
    }
    getDb().data.current.wallet = newCurrent;
    await getDb().write();
  }

  return <Space >
    <JsonForms
      renderers={materialRenderers}
      cells={materialCells}
      data={currentAddress}
      onChange={async (e)=>{
        console.log('onChange', e.data);
        let list = getDb().data.walletList.map(v=>{
          return [v.name, '(', v.address.slice(0,6), '...', v.address.slice(-4), ')'].join('');
        });
        let i = list.findIndex(v=>v===e.data);
        if (i >= 0) {
          console.log('select address index', i);
          await setCurrentInDb(getDb().data.walletList[i]);
          setReload(Date.now());
        }
      }}
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
      <IconButton size="small" onClick={()=>{
        addLog("Delete Address", current.address);
        setShowDeleteConfirm(true);
      }}>
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
        <Button variant="contained" onClick={async ()=>{
          await createAddress(accountName);
          await setCurrentInDb(getDb().data.walletList[getDb().data.walletList.length - 1]);
          addLog('create wallet...', getDb().data.current.wallet.address);
          setReload(Date.now());
          setShowCreateAddress(false);
        }}>Create</Button>
        <Button variant="outlined" onClick={e=>{
          setShowCreateAddress(false)
        }}>Cancel</Button>
        </Space>
        
      </Box>
    </Modal>
    <Dialog open={showDeleteConfirm} onClose={()=>setShowDeleteConfirm(false)} >
      <DialogTitle style={{color:'white'}}>
        {"Do you want to remove address?"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {current.address}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={()=>setShowDeleteConfirm(false)}>No</Button>
        <Button onClick={async ()=>{
          let list = getDb().data.walletList;
          let i = list.findIndex(v=>v.address===current.address);
          if (i >= 0) {
            console.log('delete address index', i);
            getDb().data.walletList.splice(i, 1);
            await getDb().write();
            await setCurrentInDb(getDb().data.walletList[getDb().data.walletList.length - 1]);
            setReload(Date.now());
            setShowDeleteConfirm(false)
          } else {
            addLog('Address not found');
          }
        }} autoFocus>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  </Space>
}
