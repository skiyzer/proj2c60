import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import Table from './components/table';

function App() {
  const [grants, setGrants] = useState([]);

  useEffect(() => {
    async function fetchGrant() {
      const url = '/NEH2020sGrant_Short.json';
      const response = await fetch(url);
      if (response.ok) {
        const result = await response.json();
        setGrants(result.Grants.Grant);
      }
    }

    fetchGrant();
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <Table grants={grants} />
      </header>
    </div>
  );
}


export default App;
