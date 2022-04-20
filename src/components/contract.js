import { JsonForms } from "@jsonforms/react";
import { materialCells, materialRenderers } from "@jsonforms/material-renderers";
import { Collapse, Space } from "antd";
import { useEffect, useMemo, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Tooltip } from "@mui/material";
import { AddBox, ContentCopy, DeleteForever, FileCopy } from "@mui/icons-material";
import { MessageBox } from "./message";
import useContract from "../hooks/useContract";
import { clipboard, dialog } from "@tauri-apps/api";
import useLog from '../hooks/useLog';
import { ContractRead } from "./ContractRead";
import useRpc from "../hooks/useRpc";
import Web3 from "web3";


const schemaSCAddress = {
  type: "string",
  title: "Contract Address",
}

export function Contract() {
  const [successInfo, setSuccessInfo] = useState('');
  const [errorInfo, setErrorInfo] = useState('');
  const [showAddContract, setShowAddContract] = useState(false);
  const {addLog} = useLog();

  const {contract, setContract, addContract, contractList, deleteContract } = useContract();
  const [scAddr, setScAddr] = useState('0x');
  const {scName} = useMemo(()=>{
    if (contract && contract.name) {
      return { scName: contract.name };
    } else {
      return { scName: 'empty', scAddr: 'empty' };
    }
  },[contract]);

  useEffect(()=>{
    if (contract) {
      setScAddr(contract.contract);
    }
  }, [contract])

  const listLength = contractList.length;

  const schemaAbi = useMemo(()=>{
    if (contractList) {
      return {
        type: "string",
        title: "Contract ABI",
        enum: contractList.map(v=>v.name),
        listLength
      }
    }
  }, [contractList, listLength]);

  const [newContract, setNewContract] = useState({
    name: '',
    address: '0x',
    abi: ''
  });

  const [isRead, setIsRead] = useState(true);
  const [accessAddr, setAccessAddr] = useState('');
  const [accessAbi, setAccessAbi] = useState([]);

  const { rpc } = useRpc();

  const web3Reader = useMemo(()=>{
    if (rpc && rpc.rpcUrl) {
      return new Web3(new Web3.providers.HttpProvider(rpc.rpcUrl));
    }
  }, [rpc]);

  return <div style={{width:'100%', textAlign:'left'}}>
    <Space>
      <JsonForms
        renderers={materialRenderers}
        cells={materialCells}
        data={scName}
        onChange={v=>setContract(v.data)}
        schema={schemaAbi}
      />
      <JsonForms
        renderers={materialRenderers}
        cells={materialCells}
        data={scAddr}
        onChange={v=>setScAddr(v.data)}
        schema={schemaSCAddress}
      />
      <Divider orientation="vertical" flexItem />
      <Divider orientation="vertical" flexItem />
      <Button variant="contained" onClick={()=>{
        setAccessAddr(contract.contract);
        setAccessAbi(JSON.parse(contract.abi));
      }} >Access</Button>
      <Tooltip title="Copy ABI">
        <IconButton size="small" onClick={async ()=>{
          await clipboard.writeText(contract.abi);
          addLog('Copy Abi');
          setSuccessInfo("ABI copied");
        }}>
          <FileCopy />
        </IconButton>
      </Tooltip>
      <Tooltip title="Copy Contract Address">
        <IconButton size="small" onClick={async ()=>{
          await clipboard.writeText(contract.contract);
          addLog('Copy Contract Address');
          setSuccessInfo("Contract Address copied");
        }}>
          <ContentCopy />
        </IconButton>
      </Tooltip>
      <Tooltip title="Add Contract">
        <IconButton size="small" onClick={()=>{
          setShowAddContract(true);
        }}>
          <AddBox />
        </IconButton>
      </Tooltip>
      <Tooltip title="Remove Contract">
        <IconButton size="small" onClick={async ()=>{
          if (! await dialog.confirm("Are you sure to delete this Contract?")) {
            return;
          }
          let ret = await deleteContract(scName);
          if (ret) {
            setSuccessInfo("Contract Deleted");
          } else {
            setErrorInfo("Contract delete failed");
          }
        }} >
          <DeleteForever />
        </IconButton>
      </Tooltip>
      <Divider orientation="vertical" flexItem />
      <Divider orientation="vertical" flexItem />
      <Button variant={isRead ? "outlined" : "text"} onClick={()=>{
        setIsRead(true);
      }} >Read Contract</Button>
      <Button variant={!isRead ? "outlined" : "text"} onClick={()=>{
        setIsRead(false);
      }}>Write Contract</Button>
    </Space>
    {
      isRead && accessAddr && accessAbi.length > 0 && web3Reader && <ContractRead web3={web3Reader} scAddr={accessAddr} abi={accessAbi} />
    }
    <Dialog open={showAddContract} onClose={()=>setShowAddContract(false)} fullWidth>
      <DialogTitle color="white">Add Contract</DialogTitle>
      <DialogContent>
        <JsonForms
          renderers={materialRenderers}
          cells={materialCells}
          data={newContract}
          onChange={e=>setNewContract(e.data)}
          schema={{
            type: 'object',
            properties: {
              name: {
                type: 'string',
                title: 'Contract Name',
              },
              contract: {
                type: 'string',
                title: 'Contract Address'
              },
              abi: {
                type: 'string',
                title: 'Contract ABI',
              }
            }
          }}
          uischema={
            {
              type: 'VerticalLayout',
              elements: [
                {
                  type: "Control",
                  scope: "#/properties/name",
                },
                {
                  type: "Control",
                  scope: "#/properties/contract",
                },
                {
                  type: "Control",
                  scope: "#/properties/abi",
                  options: {
                    multi: true
                  }
                }
              ]
            }
          }
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={async ()=>{
          await addContract(newContract);
          setShowAddContract(false);
          await setContract(newContract.name);
        }}>Ok</Button>
        <Button onClick={()=>setShowAddContract(false)}>Cancel</Button>
      </DialogActions>
    </Dialog>
    <MessageBox successInfo={successInfo} errorInfo={errorInfo} setSuccessInfo={setSuccessInfo} setErrorInfo={setErrorInfo} />
  </div>
  
}