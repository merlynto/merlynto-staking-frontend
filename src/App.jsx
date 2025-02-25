import "./styles.css";
import { useState, useEffect } from "react";
import { ethers } from "ethers";

const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
const abi = [
  "function stake(uint256 amount) external",
  "function withdraw(uint256 amount) external",
  "function getStake(address user) external view returns (uint256)"
];

export default function StakingApp() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [stakeAmount, setStakeAmount] = useState("");
  const [userStake, setUserStake] = useState(0);
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const _provider = new ethers.BrowserProvider(window.ethereum);
        const _signer = await _provider.getSigner();
        const _contract = new ethers.Contract(contractAddress, abi, _signer);
        setProvider(_provider);
        setSigner(_signer);
        setContract(_contract);
        setAccount(await _signer.getAddress());
        fetchUserStake(_contract, _signer);
      }
    };
    init();
  }, []);

  const fetchUserStake = async (_contract, _signer) => {
    const stake = await _contract.getStake(await _signer.getAddress());
    setUserStake(ethers.formatUnits(stake, 18));
  };

  const handleStake = async () => {
    if (contract && signer && stakeAmount) {
      setLoading(true);
      try {
        const tx = await contract.stake(ethers.parseUnits(stakeAmount, 18));
        setModalMessage("Transaction Pending...");
        setShowModal(true);
        await tx.wait();
        setModalMessage("Stake Successful! ✅");
        fetchUserStake(contract, signer);
        setStakeAmount("");
      } catch (error) {
        setModalMessage("Transaction Failed ❌");
        console.error("Staking error:", error);
      }
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (contract && signer) {
      setLoading(true);
      try {
        const tx = await contract.withdraw(ethers.parseUnits(userStake, 18));
        setModalMessage("Transaction Pending...");
        setShowModal(true);
        await tx.wait();
        setModalMessage("Withdraw Successful! ✅");
        fetchUserStake(contract, signer);
      } catch (error) {
        setModalMessage("Transaction Failed ❌");
        console.error("Withdrawal error:", error);
      }
      setLoading(false);
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setAccount(accounts[0]);
      } catch (error) {
        console.error("Wallet connection error:", error);
      }
    } else {
      alert("MetaMask is not installed!");
    }
  };

  return (
    <div className="container">
      <h2>Merlynto Staking</h2>

      {account ? (
        <p>Connected as: {account.slice(0, 6)}...{account.slice(-4)}</p>
      ) : (
        <button className="connect-btn" onClick={connectWallet}>
          Connect Wallet
        </button>
      )}

      <p>Your Staked Tokens: {userStake}</p>

      <input 
        type="number" 
        placeholder="Amount to stake" 
        value={stakeAmount} 
        onChange={(e) => setStakeAmount(e.target.value)}
      />

      <button className="stake-btn" onClick={handleStake} disabled={loading}>
        {loading ? <span className="loader"></span> : "Stake Tokens"}
      </button>

      <button className="withdraw-btn" onClick={handleWithdraw} disabled={loading}>
        {loading ? <span className="loader"></span> : "Withdraw Tokens"}
      </button>

      {showModal && (
        <div className="modal">
          <p>{modalMessage}</p>
          <button onClick={() => setShowModal(false)}>Close</button>
        </div>
      )}
    </div>
  );
}
