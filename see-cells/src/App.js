import logo from './logo.png';
import './App.css';
import {useState, useEffect} from 'react';
import Cell from './Cell';

require('dotenv').config();

const CKB = require('@nervosnetwork/ckb-sdk-core').default;
const ckbSdkUtils = require("@nervosnetwork/ckb-sdk-utils");
const axios = require('axios').default;

const indexerUrl = process.env.REACT_APP_CKB_INDEXER;

function App() {

  const [address, setAddress] = useState("0x")
  const [cells, setCells] = useState([])

  const collectCells = () => {

    let lockScript = ckbSdkUtils.addressToScript(address);
    let post_data = {
      id: Date.now(),
      jsonrpc: "2.0",
      method: "get_cells",
      params: [
        {
          "script": {
            "code_hash": lockScript.codeHash,
            "hash_type": lockScript.hashType,
            "args": lockScript.args
          },
          "script_type": "lock"
        },
        "asc",
        "0x100"
      ],
    };

    let post_options = { headers: { 'Content-Type': 'application/json' } };
    axios.post(indexerUrl, post_data, post_options)
      .then((response) => setCells(response.data.result.objects))
      .catch((error) => console.log(error))
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submit for", address)
    if (address !== "0x") {
      collectCells();
    }
  }

  return (
    <div>
      <div className="row">
      <div className="column-left">
        <img src={logo} className="App-logo" alt="logo" />
      </div>
      <div className="column-right">
      <header className="App-header">
        <br></br>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="CKB address" onChange={(e) => setAddress(e.target.value)} value={address}/>
          <button type="submit" >Check Cells</button>
        </form>
        <br></br>
        <p>
          Address: {address} | Number of cells: {cells.length}
        </p>
        {
          cells.map((cell, id) => {
            return (
            cell !== undefined ?
              <div key={id}><Cell cell={cell} /><br></br></div> :
              <div></div>
            )

          })
        }
      </header>
      </div> 
      </div> 
    </div>
  );
}

export default App;
