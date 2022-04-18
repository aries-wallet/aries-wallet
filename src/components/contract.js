import { JsonForms } from "@jsonforms/react";
import { materialCells, materialRenderers } from "@jsonforms/material-renderers";
import { Collapse, Space } from "antd";
import { useState } from "react";
import { Button, IconButton, Paper, Tooltip } from "@mui/material";
import { AddBox, ContentCopy, DeleteForever, FileCopy } from "@mui/icons-material";
const { Panel } = Collapse;

const schemaAbi = {
  type: "string",
  title: "Contract ABI",
  enum: [
    'ZooKeeper',
    'WanLend',
  ]
}

const schemaSCAddress = {
  type: "string",
  title: "Contract Address",
}



export function Contract() {
  const [abi, setAbi] = useState('ZooKeeper');
  const [scAddr, setScAddr] = useState('0x4Cf0A877E906DEaD748A41aE7DA8c220E4247D9e');
  return <div style={{width:'100%', textAlign:'left'}}>
    <Space >
      <JsonForms
        renderers={materialRenderers}
        cells={materialCells}
        data={abi}
        onChange={v=>setAbi(v.data)}
        schema={schemaAbi}
      />
      <JsonForms
        renderers={materialRenderers}
        cells={materialCells}
        data={scAddr}
        onChange={v=>setScAddr(v.data)}
        schema={schemaSCAddress}
      />
      <Button variant="contained" >Access</Button>
      <Tooltip title="Copy ABI">
        <IconButton size="small">
          <FileCopy />
        </IconButton>
      </Tooltip>
      <Tooltip title="Copy Contract Address">
        <IconButton size="small">
          <ContentCopy />
        </IconButton>
      </Tooltip>
      <Tooltip title="Add Contract">
        <IconButton size="small">
          <AddBox />
        </IconButton>
      </Tooltip>
      <Tooltip title="Remove Contract">
        <IconButton size="small">
          <DeleteForever />
        </IconButton>
      </Tooltip>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <Button variant="outlined" >Read Contract</Button>
      <Button>Write Contract</Button>
    </Space>
    <Paper style={{width: '100%', marginTop: "20px", padding: "10px", borderRadius: '10px'}} elevation={0} >
    <Collapse defaultActiveKey={['1']}>
      <Panel header="1. symbol" key="1">
        <p>Hello</p>
        <Button variant="outlined">Read</Button>
      </Panel>
      <Panel header="2. decimals" key="2">
        <p>Hello</p>
        <Button variant="outlined">Read</Button>
      </Panel>
      <Panel header="3. name" key="3">
        <p>Hello</p>
        <Button variant="outlined">Read</Button>
      </Panel>
    </Collapse>
    </Paper>
  </div>
  
}