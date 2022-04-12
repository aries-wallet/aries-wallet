import { materialCells, materialRenderers } from "@jsonforms/material-renderers";
import { JsonForms } from "@jsonforms/react";
import { Button } from "@mui/material";
import { Space } from "antd";
import { useState } from "react";

const schema = {
  type: "object",
  properties: {
    password: {
      type: "string",
      description: "Enter your new password.",
    },
    password2: {
      type: "string",
      title: "Password Again",
      description: "Enter your password again.",
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
      title: 'Password again',
      type: 'Control',
      scope: '#/properties/password2',
      options: {
        format: 'password',
        showUnfocusedDescription: true,
      }
    },
  ]
  
}

export function Register() {
  const [data, setData] = useState({});
  return <div>
    <Space align="center" direction="vertical" size="large" >
      <div>Sign Up</div>
      <JsonForms data={data} onChange={v=>{
        if (v.errors) {
          console.error(v.errors);
        } else {
          setData(v.data);
        }
      }} schema={schema} renderers={materialRenderers} cells={materialCells} uischema={uischema} />
    <Button variant="outlined" >Sign Up</Button>
    </Space>
  </div>
}
