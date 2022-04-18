import { materialCells, materialRenderers } from "@jsonforms/material-renderers";
import { JsonForms } from "@jsonforms/react";
import { Alert, Button } from "@mui/material";
import { Space } from "antd";
import { useCallback, useMemo, useState } from "react";
import { verifyPassword } from "../utils/crypto";

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

export function Login(props) {
  const [data, setData] = useState({});
  const [alert, setAlert] = useState('');

  const handleLogin = useCallback(() => {
    if(verifyPassword(data.password)) {
      props.setUnlock(true);
      setAlert('');
    } else {
      setAlert('Password is not correct.');
    }
  }, [data]);

  return <div>
    <Space align="center">
      <JsonForms data={data} onChange={v=>{
        if (v.errors.length > 0) {
          console.error(v.errors);
        } else {
          setData(v.data);
        }
      }}
       schema={schema} renderers={materialRenderers} cells={materialCells} uischema={uischema} />
      <Button variant="outlined" onClick={handleLogin} >Login</Button>
    </Space>
    {
      alert !== '' && <Alert severity="error">{alert}</Alert>
    }
  </div>
}
