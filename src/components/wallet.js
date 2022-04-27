import { JsonForms } from "@jsonforms/react";
import { materialCells, materialRenderers } from "@jsonforms/material-renderers";
import { message, Space } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, IconButton, InputLabel, List, ListItem, ListItemButton, ListItemIcon, ListItemText, MenuItem, Paper, Select, Stack, TextField, Tooltip } from "@mui/material";
import { AddCard, Cable, CheckBox, ContentCopy, DeleteForever, Download, Explore, FileOpen, Key, LockOpen } from "@mui/icons-material";
import { getDb } from "../utils/db";
import useLog from "../hooks/useLog";
import { createAddress, decryptWithPwd, encrypt, importAccount } from "../utils/crypto";
import { clipboard, dialog, fs, path, shell } from "@tauri-apps/api";
import { MessageBox } from './message';
import useRpc from '../hooks/useRpc';
import Web3 from 'web3';
import { getLedgerAddress } from "../utils/ledger";
import { LoadingButton } from "@mui/lab";

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
  const [pwd2, setPwd2] = useState();
  const { rpc } = useRpc();
  const [balance, setBalance] = useState('0.0');
  const [showImportPK, setShowImportPK] = useState(false);
  const [pk, setPk] = useState('');
  const [showImportKeystore, setShowImportKeystore] = useState(false);
  const [showSaveKeystore, setShowSaveKeystore] = useState(false);
  const [keystorePath, setKeystorePath] = useState('');
  const [showLedger, setShowLedger] = useState(false);
  const [pathRule, setPathRule] = useState('metamask');

  useEffect(()=>{
    let list = getDb().data.walletList.map(v=>{
      return [v.name, '(', v.address.slice(0,6), '...', v.address.slice(-4), ')'].join('');
    });

    let currentInDb = getDb().data.current ? getDb().data.current.wallet : {};
    if ( currentInDb && currentInDb.address) {
      setCurrent(currentInDb);
    } else {
      setCurrent(getDb().data.walletList[0]);
    }
    
    setSchemaAddress({
      type: "string",
      title: "Wallet Address",
      enum: list
    });
  }, [reload]);

  useEffect(()=>{
    let web3 = new Web3(new Web3.providers.HttpProvider(rpc.rpcUrl));
    const func = async () => {
      try {
        if (web3.utils.isAddress(current.address, 1)) {
          let balance = await web3.eth.getBalance(current.address);
          setBalance(web3.utils.fromWei(balance));
        }
      } catch (error) {
        console.error(error);
      }
    }

    func();
    let timer = setInterval(func, 12000);
    return () => {
      clearInterval(timer);
    }
    
  }, [rpc, current, setBalance]);

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

  const [ledgerAddrList, setLedgerAddrList] = useState([]);
  const [loadingLedger, setLoadingLedger] = useState(false);
  const addLedgerAddr = useCallback(()=>{
    return (addr)=>{
      setLedgerAddrList((pre)=>{
        return [...pre, addr];
      })
    }
  }, [setLedgerAddrList]);

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
      value={balance}
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
      <IconButton size="small" onClick={()=>{
        shell.open(`${rpc.explorer}/address/${current.address}`);
      }}>
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
        setAccountName(`Account ${getDb().data.walletList.length}`);
        setShowCreateAddress(true);
      }}>
        <AddCard />
      </IconButton>
    </Tooltip>
    <Tooltip title="Connect to Ledger (Hardware Wallet)">
      <IconButton size="small" onClick={e=>{
        setShowLedger(true);
      }}>
        <Cable />
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
      <IconButton size="small" onClick={()=>{
        setAccountName(`Imported ${getDb().data.walletList.length}`);
        setShowImportPK(true);
      }}>
        <Key />
      </IconButton>
    </Tooltip>
    <Tooltip title="Import Keystore File">
      <IconButton size="small" onClick={()=>{
        setAccountName(`Keystore ${getDb().data.walletList.length}`);
        setShowImportKeystore(true);
      }}>
        <FileOpen />
      </IconButton>
    </Tooltip>
    <Tooltip title="Export Keystore File">
      <IconButton size="small" onClick={()=>{
        setShowSaveKeystore(true);
      }}>
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
    {showImportPK && <Dialog open={showImportPK} onClose={()=>setShowImportPK(false)}>
      <DialogTitle style={{color:'white'}}>Import Private Key</DialogTitle>
      <DialogContent>
        <DialogContentText>Your private key will be encrypted and stored locally.</DialogContentText>
        <Stack spacing={1}>
          <TextField label="Account Name" variant="standard" value={accountName} onChange={e=>setAccountName(e.target.value)} />
          <TextField label="Private Key" type={'password'} variant="standard" value={pk} onChange={e=>setPk(e.target.value)} />
        </Stack>
        
      </DialogContent>
      <DialogActions>
        <Button onClick={async ()=>{
          try {
            let web3 = new Web3();
            let obj = web3.eth.accounts.privateKeyToAccount(pk);
            let account = {
              name: accountName,
              address: obj.address,
              pk: encrypt(pk)
            }
            await importAccount(account);
            await setCurrentInDb(getDb().data.walletList[getDb().data.walletList.length - 1]);
            addLog('import wallet...', getDb().data.current.wallet.address);
            setReload(Date.now());
            setShowImportPK(false);
          } catch (error) {
            addLog('ERROR', error.message);
          }
        }}>Ok</Button>
        <Button onClick={()=>setShowImportPK(false)}>Cancel</Button>
      </DialogActions>
    </Dialog>}
    {
      showImportKeystore && <Dialog open={showImportKeystore} onClose={()=>setShowImportKeystore(false)}>
        <DialogTitle style={{color:'white'}}>Import Keystore</DialogTitle>
        <DialogContent>
          <Stack spacing={1}>
            <TextField label="Account Name" variant="standard" value={accountName} onChange={e=>setAccountName(e.target.value)} />
            <TextField label="Password of keystore" type={'password'} variant="standard" value={pwd} onChange={e=>setPwd(e.target.value)} />
            <TextField label="Keystore Path" variant="standard" value={keystorePath} disabled />
            <Button
              variant="contained"
              component="label"
              onClick={async ()=>{
                let ret = await dialog.open();
                console.log('ret', ret);
                setKeystorePath(ret);
              }}
            >
              Upload File
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={async ()=>{
            if (!keystorePath || !pwd) {
              return;
            }

            try {
              let file = await fs.readTextFile(keystorePath);
              let web3 = new Web3();
              let key = web3.eth.accounts.decrypt(file, pwd);
              let account = {
                name: accountName,
                address: key.address,
                pk: encrypt(key.privateKey),
              }
              await importAccount(account);
              await setCurrentInDb(getDb().data.walletList[getDb().data.walletList.length - 1]);
              addLog('import keystore...', getDb().data.current.wallet.address);
              setReload(Date.now());
              setShowImportKeystore(false);
            } catch (error) {
              console.error(error);
              setErrorInfo(error.message);
            }

          }}>Ok</Button>
          <Button onClick={()=>setShowImportKeystore(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    }
    {
      showSaveKeystore && <Dialog open={showSaveKeystore} onClose={()=>setShowSaveKeystore(false)}>
        <DialogTitle color="white">Save Account to Keystore</DialogTitle>
        <DialogContent>
          <TextField 
            label="Wallet password"
            variant="standard"
            value={pwd2}
            type="password"
            fullWidth
            onChange={e=>setPwd2(e.target.value)}
          />
          <TextField 
            label="Keystore password"
            variant="standard"
            value={pwd}
            type="password"
            fullWidth
            onChange={e=>setPwd(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={async ()=>{
            try {
              let pk = decryptWithPwd(current.pk, pwd2);
              if (!pk || pk === '') {
                throw new Error('Wallet password not correct');
              }
              let savePath = await dialog.save({defaultPath:`${path.desktopDir}/UTC--${(new Date()).toISOString().replaceAll(':','-')}--${current.address}`});
              addLog("Save keystore to:", savePath);
              let web3 = new Web3();
              let keyJson = web3.eth.accounts.encrypt(pk, pwd);
              console.log('keyJson', keyJson, pk);
              await fs.writeFile({
                contents: JSON.stringify(keyJson),
                path: savePath,
              });
              setShowSaveKeystore(false);
            } catch (error) {
              console.error(error);
              setErrorInfo(error.message);
            }
          }}>Save As...</Button>
          <Button onClick={()=>setShowSaveKeystore(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    }
    {
      showLedger && <Dialog open={showLedger} onClose={e=>setShowLedger(false)} fullWidth >
        <DialogTitle color="white">Connect to Ledger</DialogTitle>
        <DialogContent style={{padding:"30px"}}>
          <Stack spacing={2}>
            <Stack spacing={2} direction="row">
            <FormControl fullWidth variant="standard">
              <InputLabel id="select-label">Derivation Path</InputLabel>
              <Select labelId="select-label" value={pathRule} onChange={e=>setPathRule(e.target.value)}>
                <MenuItem value={'metamask'}>MetaMask(m/44’/60’/0’/0)</MenuItem>
                <MenuItem value={'wanmask'}>WanMask(m/44'/5718350'/0')</MenuItem>
              </Select>
            </FormControl>
            <LoadingButton loading={loadingLedger} variant="outlined" onClick={async ()=>{
              // await testLedger();
              setLedgerAddrList([]);
              setLoadingLedger(true);
              addLedgerAddr()(await getLedgerAddress(0));
              addLedgerAddr()(await getLedgerAddress(1));
              addLedgerAddr()(await getLedgerAddress(2));
              addLedgerAddr()(await getLedgerAddress(3));
              addLedgerAddr()(await getLedgerAddress(4));
              setLoadingLedger(false);
            }} >Connect</LoadingButton>
            </Stack>
            <Paper style={{maxHeight:'300px', overflow:'auto'}}>
            <List dense>
              {
                ledgerAddrList.map((v, i)=>{
                  const labelId = `checkbox-list-label-${v}`;
                  return <ListItem key={labelId}>
                    <ListItemButton dense>
                      <ListItemIcon>
                        <CheckBox />
                      </ListItemIcon>
                      <ListItemText primary={`${i}. ${v}`} />
                    </ListItemButton>
                  </ListItem>
                })
              }
            </List>
            {
              ledgerAddrList.length > 0 && <LoadingButton loading={loadingLedger} fullWidth onClick={async ()=>{
                let length = ledgerAddrList.length;
                setLoadingLedger(true);
                addLedgerAddr()(await getLedgerAddress(length));
                addLedgerAddr()(await getLedgerAddress(length + 1));
                addLedgerAddr()(await getLedgerAddress(length + 2));
                addLedgerAddr()(await getLedgerAddress(length + 3));
                addLedgerAddr()(await getLedgerAddress(length + 4));
                setLoadingLedger(false);
              }}>Load More</LoadingButton>
            }
            </Paper>
          </Stack>
          
        </DialogContent>
        <DialogActions style={{padding:"0 30px 30px 30px"}}>
          <Stack spacing={2} direction="row">
            <Button onClick={e=>setShowLedger(false)} disabled >Ok</Button>
            <Button onClick={e=>setShowLedger(false)} >Cancel</Button>
          </Stack>
        </DialogActions>
      </Dialog>
    }
    
    <MessageBox successInfo={successInfo} errorInfo={errorInfo} setSuccessInfo={setSuccessInfo} setErrorInfo={setErrorInfo} />
  </Space>
}
