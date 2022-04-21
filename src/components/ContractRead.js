import { JsonForms } from "@jsonforms/react";
import { materialCells, materialRenderers } from "@jsonforms/material-renderers";

import { Button, Paper, Stack } from "@mui/material";
import { Collapse } from "antd";
import { useEffect, useMemo, useState } from "react";
import useLog from "../hooks/useLog";

const { Panel } = Collapse;

function ReadPanel(props) {
  const subAbi = props.subAbi;
  const sc = props.sc;
  const [inputData, setInputData] = useState({});
  const [outputData, setOutputData] = useState([]);
  const [reload, setReload] = useState(0);
  const { addLog } = useLog();

  useEffect(()=>{
    try{
      if (subAbi.inputs.length === 0) {
        addLog('query sc function', subAbi.name, 'pending...');
        sc.methods[subAbi.name]().call().then(ret=>{
          addLog(`query sc function ${subAbi.name} return`, ret);
          setOutputData(ret);
        }).catch(err=>{
          console.error(err);
          addLog('ERROR:', err.message);
        });
      } else if (Object.values(inputData).length > 0) {
        addLog(`query sc function ${subAbi.name} with params ${Object.values(inputData)} pending...`);
        sc.methods[subAbi.name](...Object.values(inputData)).call().then(ret=>{
          console.log('ret', ret);
          addLog(`query sc function ${subAbi.name} with params ${Object.values(inputData)} return`, JSON.stringify(ret));
          setOutputData(ret);
        }).catch(err=>{
          console.error(err);
          addLog('ERROR:', err.message);
        });
      }
    } catch (err) {
      console.error(err);
      addLog('ERROR', err.message);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload, subAbi, inputData, sc]);

  return <div>
    <Stack spacing={1}>
      { subAbi.inputs && subAbi.inputs.length > 0 && <JsonForms 
          renderers={materialRenderers}
          cells={materialCells}
          data={inputData}
          onChange={e=>setInputData(e.data)}
          schema={abiToSchema(subAbi.inputs)}
          uischema={abiToUISchema(subAbi.inputs)}
        />
      }
      <Button style={{width: '120px'}} variant="outlined" size="small" onClick={()=>{
        setReload(Date.now());
      }} >Query</Button>
      {
        subAbi.outputs.length === 1 && <p>↳&nbsp;{outputData} &nbsp;&nbsp;<i style={{color:'gray'}}>{subAbi.outputs[0].type}</i></p>
      }
      {
        subAbi.outputs.length > 1 && subAbi.outputs.map((v,i)=>{
          return <p key={i}>↳&nbsp;<i style={{color:'gray'}}>{subAbi.outputs[i].name}:</i>&nbsp;&nbsp;{outputData[i] !== undefined && outputData[i].toString()} &nbsp;<i style={{color:'gray'}}>{subAbi.outputs[i].type}</i></p>
        })
      }
      
    </Stack>
  </div>
}

export function ContractRead(props) {
  const web3 = props.web3;
  const scAddr = props.scAddr;
  const abi = useMemo(()=>{
    return props.abi.filter(v=>!(v.type !== 'function' || v.stateMutability !== 'view'));
  }, [props.abi]);
  const sc = useMemo(()=>{
    return new web3.eth.Contract(abi, scAddr);
  }, [web3, scAddr, abi]);

  return <Paper style={{width: '100%', marginTop: "20px", padding: "10px", borderRadius: '10px'}} elevation={0} >
    <Collapse defaultActiveKey={['1']}>
      {
        abi.map((v, i)=>{
          return <Panel header={`${i+1}. ${v.name}`} key={`${i+1}`}>
            <ReadPanel subAbi={v} sc={sc} />
          </Panel>
        })
      }
    </Collapse>
  </Paper>
}

function abiToSchema(subAbi) {
  let props = {};
  subAbi.map((v,i)=>{
    props[v.name ? v.name : `param${i}`] = {
      type: 'string',
      title: v.name ? v.name : `param${i}`,
      description: v.type,
    };
    return props;
  })
  return {
    type: 'object',
    properties: props,
  }
}

function abiToUISchema(subAbi) {
  let elements = subAbi.map((v,i)=>{
    return {
      type: 'Control',
      scope: '#/properties/' + (v.name ? v.name : `param${i}`),
      options: {
        showUnfocusedDescription: true
      }
    };
  })

  return {
    type: 'VerticalLayout',
    elements,
  }
}