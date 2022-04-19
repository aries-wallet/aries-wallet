
import { createModel } from "hox";
import { useEffect, useState } from "react";
import { getDb } from "../utils/db";

function useRpc() {
  const [rpc, setRpc] = useState({});
  const [rpcList, setRpcList] = useState([]);
  useEffect(()=>{
    setTimeout(()=>{
      if (getDb().data.current && getDb().data.current.rpc && getDb().data.current.rpc.name) {
        setRpc(getDb().data.current.rpc)
      } else {
        setRpc(getDb().data.rpcList[0]);
      }
  
      setRpcList(getDb().data.rpcList);
    }, 1000);
  },[])

  const addRpc = async (rpc) => {
    getDb().data.rpcList.push(rpc);
    await getDb().write();
    setRpcList(getDb().data.rpcList);
  }

  const setCurrentRpc = async (rpcName) => {
    let found = getDb().data.rpcList.find(v=>v.name === rpcName);
    getDb().data.current.rpc = found;
    await getDb().write();
    setRpc(found);
  }

  const deleteRpc = async (rpcUrl) => {
    if (!getDb().data || !getDb().data.rpcList || getDb().data.rpcList.length <= 1) {
      console.log("You should left one rpc")
      return false;
    }
    let index = getDb().data.rpcList.findIndex(v=>v.rpcUrl === rpcUrl);
    getDb().data.rpcList.splice(index, 1);
    getDb().write();
    setRpcList(getDb().data.rpcList);
    setRpc(getDb().data.rpcList[0]);
    return true;
  }

  return {rpc, setRpc: setCurrentRpc, rpcList, addRpc, deleteRpc};
}

export default createModel(useRpc);
