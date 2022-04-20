import { Button, Paper } from "@mui/material";
import { Collapse } from "antd";

const { Panel } = Collapse;


export function ContractWrite(props) {
  return <Paper style={{width: '100%', marginTop: "20px", padding: "10px", borderRadius: '10px'}} elevation={0} >
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
}
