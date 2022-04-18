import { JsonForms } from "@jsonforms/react";
import { materialCells, materialRenderers } from "@jsonforms/material-renderers";
import { message, Space } from "antd";
import { useEffect, useMemo, useState } from "react";
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Modal, Snackbar, TextField, Tooltip, Typography } from "@mui/material";
import { AddCard, ContentCopy, DeleteForever, Download, Explore, FileOpen, Key, LockOpen } from "@mui/icons-material";
import { getDb } from "../utils/db";
import { withThemeCreator } from "@mui/styles";
import useLog from "../hooks/useLog";
import { createAddress, decrypt, decryptWithPwd } from "../utils/crypto";
import { clipboard, dialog } from "@tauri-apps/api";

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
  const [showCopyPK, setShowCopyPK] = useState(false);
  const [successInfo, setSuccessInfo] = useState('');
  const [errorInfo, setErrorInfo] = useState('');
  const [pwd, setPwd] = useState();

  useEffect(()=>{
    let list = getDb().data.walletList.map(v=>{
      return [v.name, '(', v.address.slice(0,6), '...', v.address.slice(-4), ')'].join('');
    });
    console.log('current', getDb().data.current);

    let currentInDb = getDb().data.current ? getDb().data.current.wallet : {};
    if ( currentInDb && currentInDb.address) {
      setCurrent(currentInDb);
    } else {
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
    <TextField 
      label="Balance" 
      value={12342.134} 
      disabled 
      variant="standard"
      style={{margin: '0 0 6px'}}
    />
    <Tooltip title="Copy Address">
      <IconButton size="small" onClick={()=>{
        addLog('copy address', current.address);
        clipboard.writeText(current.address);
        setSuccessInfo('Success Copied');
      }}>
        <ContentCopy size="small" />
      </IconButton>
    </Tooltip>
    <Tooltip title="View in Explorer">
      <IconButton size="small" disabled>
        <Explore />
      </IconButton>
    </Tooltip>
    <Tooltip title="Copy Private Key">
      <IconButton size="small" onClick={()=>{
        setShowCopyPK(true);
      }}>
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
        addLog("Deleting Address", current.address);
        if (getDb().data.walletList.length > 1) {
          setShowDeleteConfirm(true);
        } else {
          message.info("You should leave at lease one address");
        }
      }}>
        <DeleteForever />
      </IconButton>
    </Tooltip>
    <Tooltip title="Import Private Key">
      <IconButton size="small" disabled>
        <Key />
      </IconButton>
    </Tooltip>
    <Tooltip title="Import Keystore File">
      <IconButton size="small" disabled>
        <FileOpen />
      </IconButton>
    </Tooltip>
    <Tooltip title="Export Keystore File">
      <IconButton size="small" disabled>
        <Download />
      </IconButton>
    </Tooltip>
    <Dialog
      open={showCreateAddress}
      onClose={()=>{setShowCreateAddress(false)}}
    >
      <DialogTitle style={{color: 'white'}}>Create Address</DialogTitle>
      <DialogContent 
      >
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
        <DialogActions style={{width: '100%', justifyContent: 'center'}}>
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
        </DialogActions>
      </DialogContent>
    </Dialog>
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
    {
      showCopyPK && <Dialog
        open={showCopyPK}
        onClose={()=>{
          setPwd('');
          setShowCopyPK(false)
        }}
      >
        <DialogTitle style={{color: 'white'}}>Copy Private Key</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please input your password to unlock your private key
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="pwd"
            label="Password"
            type="password"
            fullWidth
            variant="standard"
            value={pwd}
            onChange={e=>{
              setPwd(e.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={async ()=>{
            try {
              let pk = decryptWithPwd(current.pk, pwd);
              if (!pk || pk === '') {
                throw new Error('unlock failed');
              }
              await clipboard.writeText(pk);
              setSuccessInfo('Success Copied');
              setPwd('');
              setShowCopyPK(false)
            } catch (error) {
              setErrorInfo('Unlock Failed');
            }
          }}>Ok</Button>
          <Button onClick={()=>{
            setPwd('');
            setShowCopyPK(false)
          }}>Cancel</Button>
        </DialogActions>
      </Dialog>
    }
    
    {
      successInfo !== '' && <Snackbar open={successInfo !== ''} autoHideDuration={6000} onClose={()=>setSuccessInfo('')}>
        <Alert onClose={()=>setSuccessInfo('')} severity="success" sx={{ width: '100%' }}>
          {successInfo}
        </Alert>
      </Snackbar>
    }
    {
      errorInfo !== '' && <Snackbar open={errorInfo !== ''} autoHideDuration={6000} onClose={()=>setErrorInfo('')}>
        <Alert onClose={()=>setErrorInfo('')} severity="error" sx={{ width: '100%' }}>
          {errorInfo}
        </Alert>
      </Snackbar>
    }
  </Space>
}
