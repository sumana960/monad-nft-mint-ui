import React, { useState } from "react";
import { ethers } from "ethers";
import abi from "./abi/MonandNFT.json";

const CONTRACT_ADDRESS = "0x11B65CcDd2a2102dB11e976b64a99b799710F5d7";

function App() {
  const [account, setAccount] = useState(null);
  const [txHash, setTxHash] = useState("");

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Installe MetaMask");
      return;
    }
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setAccount(accounts[0]);
  };

  const mintNFT = async () => {
    if (!window.ethereum) return;

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      abi,
      signer
    );

    const tx = await contract.mint();
    setTxHash(tx.hash);
    await tx.wait();
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Monad NFT Mint UI</h1>

      {!account ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <p>Connected: {account}</p>
      )}

      <br /><br />

      <button onClick={mintNFT}>Mint NFT</button>

      {txHash && (
        <p>
          Transaction hash:
          <br />
          {txHash}
        </p>
      )}
    </div>
  );
}

export default App;
