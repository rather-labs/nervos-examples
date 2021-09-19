import {useState, useEffect} from 'react';
import logo from './logo-nervos.png';
import './App.css';

import PWCore, {
  EthProvider,
  Address,
  Amount,
  AmountUnit,
  AddressType,
  IndexerCollector,
} from '@lay2/pw-core';

require('dotenv').config();

function App() {

  const [pwCore, setPwCore] = useState(undefined);
  const [balance, setBalance] = useState([]);
  const [ckbAddress, setCkbAddress] = useState("0x");
  const [toCkbAddress, setToCkbAddress] = useState("0x");
  const [ckbAmount, setCkbAmount] = useState(0);

  useEffect(() => {
    const getBalance = async(address) => {
    }

    const init = async () => {
      const nodeUrl = process.env.REACT_APP_CKB_NODE;
      const indexerUrl = process.env.REACT_APP_CKB_INDEXER;

      const pwcore = await new PWCore(nodeUrl).init(
        new EthProvider(), // a built-in Provider for Ethereum env.
        new IndexerCollector(indexerUrl)
      );

      const address_ = PWCore.provider.address;
	    const balance_ = await PWCore.defaultCollector.getBalance(address_)

      setBalance(balance_.amount)
      setCkbAddress(address_.toCKBAddress().toString())

      setPwCore(pwcore);
    }
    init();
  }, []);

  const send = async(e) => {
    e.preventDefault();
    const txHash = await pwCore.send(
      new Address(toCkbAddress, AddressType.ckb),
      new Amount(ckbAmount.toString())
    );
  }

  return (
    <div>
      <div className="row">
        <div className="column-left">
          <img src={logo} className="App-logo" alt="logo" />
        </div>
        <div className="column-right">
          <header className="App-header">
            <div className="mb-3">
              <p>Address: {ckbAddress} </p>
              <p>Balance: {new Amount(balance, AmountUnit.shannon).toString()} CKBs</p>
            </div>
            <div className="input-group mb-3">
              <span id="basic-addon1">Send CKB to:&nbsp;</span>
              <input type="text" placeholder="CKB Address" aria-label="Username" aria-describedby="basic-addon1" onChange={(e) => setToCkbAddress(e.target.value)} />
            </div>
            <div className="input-group mb-3">
              <span id="basic-addon1">Amount CKB:&nbsp;</span>
              <input type="text" placeholder="CKB Amount" aria-label="Username" aria-describedby="basic-addon1" onChange={(e) => setCkbAmount(e.target.value)} />
            </div>
            <button type="button" className="btn btn-primary btn-lg" onClick={send}>Send</button>
          </header>
        </div>
      </div>
    </div>
  );
}

export default App;
