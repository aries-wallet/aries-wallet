import './App.css';
import { Rpc } from './components/rpc';
import { Login } from './pages/login';
import { Main } from './pages/main';
import { Register } from './pages/register';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <Login /> */}
        {/* <Register /> */}
        <Main />
        {/* <Rpc /> */}
      </header>
    </div>
  );
}

export default App;
