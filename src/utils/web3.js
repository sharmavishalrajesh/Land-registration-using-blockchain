import Web3 from 'web3';

// Check if MetaMask is available and initialize Web3
const getWeb3 = () => {
  return new Promise((resolve, reject) => {
    window.addEventListener("load", async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          await window.ethereum.enable(); // Request account access if needed
          resolve(web3);
        } catch (error) {
          reject(error);
        }
      } else if (window.web3) {
        resolve(window.web3);
      } else {
        reject("MetaMask not found. Please install it to use this app!");
      }
    });
  });
};

export default getWeb3;
