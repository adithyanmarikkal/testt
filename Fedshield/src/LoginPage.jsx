import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './LoginPage.css'; // Import the new, clean stylesheet

// A simple placeholder for the shield icon.
const ShieldIcon = () => (
  <svg className="logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L3 5V11C3 16.5 7.1 21.6 12 23C16.9 21.6 21 16.5 21 11V5L12 2Z" fill="#0d6efd"/>
  </svg>
);

function LoginPage() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [network, setNetwork] = useState(null);

  // Function to connect to MetaMask
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        setErrorMessage(null); // Clear previous errors
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const networkDetails = await provider.getNetwork();
        setNetwork(networkDetails.name);
      } catch (error) {
        console.error("Connection error:", error);
        setErrorMessage("Connection failed. Please approve the request in MetaMask.");
      }
    } else {
      setErrorMessage("MetaMask is not installed. Please install it to connect.");
    }
  };

  // Listen for account and network changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        } else {
          setWalletAddress(null);
        }
      };

      const handleChainChanged = () => {
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      // Cleanup listeners on component unmount
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  return (
    <div className="login-page-container">
      <div className="login-card">
        <div className="logo-container">
          <ShieldIcon />
          <span>FedShield</span>
        </div>

        {/* Conditionally render content based on connection status */}
        {walletAddress ? (
          // --- CONNECTED STATE ---
          <div>
            <div className="welcome-header">
              <h2>Connection Successful</h2>
              <p>You are now securely connected to the network.</p>
            </div>
            <div className="connected-info">
              <h3>✅ Connected</h3>
              <p><strong>Wallet:</strong> {`${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`}</p>
              <p><strong>Network:</strong> {network}</p>
            </div>
          </div>
        ) : (
          // --- NOT CONNECTED STATE ---
          <div>
            <div className="welcome-header">
              <h2>Welcome Back</h2>
              <p>Sign in to access the secure network</p>
            </div>
            
            <button onClick={connectWallet} className="login-button">
              Login with MetaMask
            </button>
            
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginPage;