import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import { useEffect } from 'react';

function App() {
   const [Grant, setGrant] = useState([{}]);
  useEffect(() => {      
      async function fetchGrant() 
      {
         const url = "/NEH2020sGrant_Short.json";
         const response = await fetch(url);
         if (response.ok) {
            const result = await response.json();
            console.log(result.Grants.Grant);
            setGrant(result.Grants.Grant);
            }
        }
      fetchGrant();
   },[]);
   
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <tr>
            <td>
              {}
            </td>
        </tr>
      </header>
    </div>
  );
}


export default App;
