import { Low } from './low';
import { writeFile, Dir, createDir, readTextFile } from "@tauri-apps/api/fs";

class TauriAdapter {
  async read() {
    await createDir('db', { dir: Dir.App, recursive: true});
    let str = await readTextFile('db/db.json', { dir: Dir.App });
    return JSON.parse(str);
  }

  async write(obj) {
    await createDir('db', { dir: Dir.App, recursive: true});
    await writeFile({
      path: 'db/db.json',
      contents: JSON.stringify(obj),
    }, { dir: Dir.App });
    await writeFile({
      path: 'db/db_auto_backup.dat',
      contents: JSON.stringify(obj),
    }, { dir: Dir.App });
  }
}

let db;

export const initDb = async () => {
  try {
    console.log('initDb');
    if (!db) {
      let adapter = new TauriAdapter();
      db = new Low(adapter);
    }
    await db.read();
    console.log('db', db);
  } catch (error) {
    console.error(error);
  }
}

export const getDb = ()=>{
  return db;
}
