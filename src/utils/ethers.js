import { ethers } from 'ethers';

// Connect to Ethereum using ethers.js
export const connectBlockchain = async () => {
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    
    await provider.send("eth_requestAccounts", []); // Prompt user to connect wallet
    return { provider, signer };
  } else {
    console.error('MetaMask not installed!');
    throw new Error('MetaMask not installed!');
  }
};

// Export function to get contract instance
export const getContract = async (signer, contractABI, contractAddress) => {
  const contract = new ethers.Contract(contractAddress, contractABI, signer);
  return contract;
};
