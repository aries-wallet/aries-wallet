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
      description: "Enter your password to unlock wallet",
    }
  },
  // required: ['password']
}

const uischema = {
  type: 'Control',
  scope: '#/properties/password',
  options: {
    format: 'password',
    showUnfocusedDescription: true,
    // hideRequiredAsterisk: true,
  }
}

export function Login() {
  const [data, setData] = useState({});
  return <div>
    <Space align="center">
      <JsonForms data={data} onChange={v=>{
        if (v.errors) {
          console.error(v.errors);
        } else {
          setData(v.data);
        }
      }} schema={schema} renderers={materialRenderers} cells={materialCells} uischema={uischema} />
    <Button variant="outlined" >Login</Button>
    </Space>
  </div>
}
