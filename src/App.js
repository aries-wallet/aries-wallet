import { useEffect, useState } from 'react';
import './App.css';
import { Login } from './pages/login';
import { Main } from './pages/main';
import { Register } from './pages/register';
import { initDb } from './utils/db';


function App() {
  const [unlock, setUnlock] = useState();
  useEffect(()=>{
    initDb().then(ret=>{
      if (ret === true) {
        setUnlock(false);
      } else {
        setUnlock(undefined);
      }
    }).catch(console.error).finally(()=>console.log('initDb finish'));
  }, []);
  console.log('unlock', unlock);
  return (
    <div className="App">
      <header className="App-header">
        {
          unlock === false && <Login setUnlock={setUnlock} />
        }
        {
          unlock === undefined && <Register setUnlock={setUnlock} />
        }
        {
          unlock === true && <Main />
        }
      </header>
    </div>
  );
}

export default App;
