import React, { useState, useEffect } from 'react';
import './App.css';
import { Routes, Route, useNavigate } from 'react-router-dom';
import emblem from './images/emblem.svg'; // Already imported
import svnit from './images/svnit.png'; // Import the new image
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import { loadContract } from './utils/loadContract';
import SuperAdmin from './components/SuperAdmin';
import Admin from './components/Admin';
import UserProfile from './components/UserProfile';

function App() {
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
    contract: null,
  });
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  let navigate = useNavigate();

  // Function to connect to MetaMask
  const connectToEthereum = async (event) => {
    event.preventDefault();

    try {
      let provider = await detectEthereumProvider();

      if (!provider) {
        console.warn('MetaMask not detected, using fallback provider.');
        provider = new Web3.providers.HttpProvider('http://localhost:8545'); // Local Ganache as fallback
      }

      // Listen for network change events
      provider.on('chainChanged', (_chainId) => window.location.reload());

      const web3 = new Web3(provider);
      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      
      // Fetch chain ID and ensure it's the correct one
      const chainId = await web3.eth.getChainId();
      console.log('Connected to Chain ID:', chainId);

      // Optional: Switch network if needed (for example, to Ganache)
      if (chainId !== 1337) { // Replace 1337 with the chain ID of your target network (Ganache default is 1337)
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: Web3.utils.toHex(1337) }],
        });
      }

      const contract = await loadContract('Registry', provider);

      setWeb3Api({
        web3,
        provider,
        contract,
      });
      setAccount(accounts[0]);
      setIsConnected(true);
      console.log('Connected to MetaMask:', accounts[0]);
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);

      if (error.code === 4001) {
        alert('Please connect to MetaMask.');
      } else if (error.code === -32002) {
        alert('MetaMask connection request is already pending. Please check MetaMask.');
      } else {
        alert('An unexpected error occurred. Please try again.');
      }
    }
  };

  useEffect(() => {
    const checkUserRole = async () => {
        const { contract } = web3Api;
        if (contract && account) {
            try {
                const superAdmin = await contract.methods.superAdmin().call();
                console.log('SuperAdmin:', superAdmin);

                // Check if the connected account is the super admin
                if (account.toLowerCase() === superAdmin.toLowerCase()) {
                    navigate('/superadmin');
                } else {
                    // Check if the account is an admin
                    const isAdmin = await contract.methods.isAdmin().call({ from: account });
                    console.log(`Account: ${account}, Is Admin: ${isAdmin}`);

                    // Redirect based on role
                    if (isAdmin) {
                        navigate('/admin');
                    } else {
                        // If neither super admin nor admin, redirect to user profile
                        navigate('/userprofile');
                    }
                }
            } catch (error) {
                console.error('Error checking user role:', error);
                alert('Error checking role: ' + error.message);
            }
        }
    };

    if (account) {
        checkUserRole();
    }
  }, [web3Api, account, navigate]);

  return (
    <Routes>
      <Route path="/superadmin" element={<SuperAdmin myWeb3Api={web3Api} account={account} />} />
      <Route path="/admin/*" element={<Admin myWeb3Api={web3Api} account={account} />} />
      <Route path="/userprofile/*" element={<UserProfile myWeb3Api={web3Api} account={account} />} />
      <Route
        path="/"
        element={
          <div className="App">
            <div className="container mainDiv">
              <div className="landingPage-heading-div">
                <img src={emblem} alt="emblem" className="emblem" />
                <h1>Decentralized Land Registration</h1>
              </div>
              <img src={svnit} alt="svnit" className="svnit" /> {/* New image added */}
              <p className="welcome-p">Welcome to online Land Registration and transfer of entitlement</p>
              <p className="welcome-d">submitted by Vishal Rajesh Sharma (p23cs004) under Dr.Dhiren patel</p>
              <button
                className="landingPage-btn"
                onClick={connectToEthereum}
                disabled={isConnected}
              >
                {isConnected ? 'Connected' : 'Connect to Ethereum'}
              </button>
              {account && <p>Connected Account: {account}</p>}
            </div>
          </div>
        }
      />
    </Routes>
  );
}

export default App;
