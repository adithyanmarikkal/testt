// src/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers'; // Import ethers library

function LoginPage() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [network, setNetwork] = useState(null);

  // Function to connect to MetaMask
  const connectWallet = async () => {
    if (window.ethereum) { // Check if MetaMask is installed
      try {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]); // Set the first connected account

        // Get network information
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const networkDetails = await provider.getNetwork();
        setNetwork(networkDetails.name);

        setErrorMessage(null); // Clear any previous errors

      } catch (error) {
        console.error("User rejected connection or other error:", error);
        setErrorMessage("Connection to MetaMask failed. Please make sure MetaMask is unlocked and you approve the connection.");
      }
    } else {
      setErrorMessage("MetaMask is not installed. Please install it to connect.");
    }
  };

  // Optional: Listen for account changes and network changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        } else {
          setWalletAddress(null);
          setErrorMessage("Disconnected from MetaMask.");
        }
      });

      window.ethereum.on('chainChanged', (chainId) => {
        // Reload if necessary or update network state
        window.location.reload(); // Simple way to handle network change
      });

      // Cleanup event listeners when component unmounts
      return () => {
        window.ethereum.removeListener('accountsChanged', () => {});
        window.ethereum.removeListener('chainChanged', () => {});
      };
    }
  }, []); // Run once on mount

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Decentralized Login</h1>
      {walletAddress ? (
        <div>
          <p>Connected Wallet: <strong>{walletAddress}</strong></p>
          <p>Network: <strong>{network}</strong></p>
          <p>You are logged in!</p>
          {/* Here you can add your dApp's main content or navigate to another page */}
        </div>
      ) : (
        <div>
          <button
            onClick={connectWallet}
            style={{
              padding: '10px 20px',
              fontSize: '18px',
              cursor: 'pointer',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px'
            }}
          >
            Login with MetaMask
          </button>
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          <p style={{ marginTop: '20px' }}>
            <small>Make sure you have MetaMask installed and unlocked.</small>
          </p>
        </div>
      )}
    </div>
  );
}

export default LoginPage;