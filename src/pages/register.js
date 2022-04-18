import { materialCells, materialRenderers } from "@jsonforms/material-renderers";
import { JsonForms } from "@jsonforms/react";
import { Alert, Button } from "@mui/material";
import { Space } from "antd";
import { useState } from "react";
import { createAddress, registerPassword } from "../utils/crypto";

const schema = {
  type: "object",
  properties: {
    password: {
      type: "string",
      description: "Enter your new password.",
      minLength: 4,
    },
    password2: {
      type: "string",
      title: "Password",
      description: "Enter same password again.",
      minLength: 4,
    }
  },
  // required: ['password']
}

const uischema = {
  type: "VerticalLayout",
  elements: [
    {
      type: 'Control',
      scope: '#/properties/password',
      options: {
        format: 'password',
        showUnfocusedDescription: true,
      }
    },
    {
      type: 'Control',
      scope: '#/properties/password2',
      options: {
        format: 'password',
        showUnfocusedDescription: true,
      }
    },
  ]
}

export function Register(props) {
  const [data, setData] = useState({});
  const [alert, setAlert] = useState('');
  console.log('props', props);
  return <div>
    <Space align="center" direction="vertical" size="large" >
      <div>Sign Up</div>
      <JsonForms data={data} onChange={v=>{
        console.log('onchange', v);
        if (v.errors && v.errors.length > 0) {
          console.error(v.errors);
        } else {
          setData(v.data);
        }
      }} schema={schema} renderers={materialRenderers} cells={materialCells} uischema={uischema} />
    <Button variant="outlined" onClick={async ()=>{
      if (!data || !data.password || data.password !== data.password2) {
        console.log('1', data);
        setAlert('Password not correct');
      } else {
        console.log('2')
        setAlert('');
        await registerPassword(data.password);
        await createAddress('Account 1');
        props.setUnlock(true);
      }
    }} >Sign Up</Button>
    {
      alert !== '' && <Alert severity="error">{alert}</Alert>
    }
    </Space>
  </div>
}
