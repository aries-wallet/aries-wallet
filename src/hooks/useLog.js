import { useCallback, useState } from "react";
import { writeFile, Dir, createDir, readTextFile } from "@tauri-apps/api/fs";
import { createModel } from "hox";

function useLog() {
  const [logs, setLogs] = useState([]);
  const addLog = useCallback(()=>{
    return async (...log) => {
      let line = log.join(' ');
      line = (new Date()).toISOString() + ' ' + line;
      console.log(line);
      appendLogFile(line.toString()).then(()=>{});
      setLogs((pre)=>{
        return [line.toString(), ...pre];
      });
    }
  }, []);

  return { logs, addLog: addLog() };
}

async function appendLogFile(line) {
  try {
    await createDir('logs', { dir: Dir.App, recursive: true});
    let old = "";
    try {
      old = await readTextFile(`logs/log_${(new Date()).toISOString().split('T')[0]}.log`, { dir: Dir.App });
    } catch (error) {
      console.log(error);
      old = "";
    }

    await writeFile({
      path: `logs/log_${(new Date()).toISOString().split('T')[0]}.log`,
      contents: old + '\n' + line,
    }, { dir: Dir.App });
  } catch (error) {
    console.error('appendLogFile ERROR', error);
  }
}

export default createModel(useLog);
