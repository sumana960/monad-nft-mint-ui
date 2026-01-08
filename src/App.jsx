import { useState } from "react";
import { ethers } from "ethers";
import abi from "./abi/MonandNFT.json";

const CONTRACT_ADDRESS = "0x11B65CcDd2a2102dB11e976b64a99b799710F5d7";

function App() {
  const [account, setAccount] = useState(null);
  const [txHash, setTxHash] = useState("");
  const [loading, setLoading] = useState(false);

  async function connectWallet() {
    if (!window.ethereum) {
      alert("Please install MetaMask");
      return;
    }

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    setAccount(accounts[0]);
  }

  async function mintNFT() {
    try {
      setLoading(true);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        abi,
        signer
      );

      const tx = await contract.mint();
      await tx.wait();

      setTxHash(tx.hash);
    } catch (error) {
      console.error(error);
      alert("Mint failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Monad NFT Mint UI</h1>

      {!account ? (
        <button onClick={connectWallet}>
          Connect Wallet
        </button>
      ) : (
        <>
          <p><strong>Connected:</strong> {account}</p>
          <button onClick={mintNFT} disabled={loading}>
            {loading ? "Minting..." : "Mint NFT"}
          </button>
        </>
      )}

      {txHash && (
        <p>
          <strong>Transaction Hash:</strong><br />
          {txHash}
        </p>
      )}
    </div>
  );
}

export default App;
