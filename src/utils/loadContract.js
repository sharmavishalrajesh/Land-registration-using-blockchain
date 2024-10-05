import Web3 from 'web3';
import RegistryABI from 'C:/Users/visha/OneDrive/Desktop/desktop/coding/land-registration-frontend/src/contracts/Registry.json';

export const loadContract = async (contractName, provider) => {
  const web3 = new Web3(provider);
  const networkId = await web3.eth.net.getId();
  console.log("Detected Network ID:", networkId); // Log the network ID

  // Ensure that you manually add the Sepolia contract address here
  let contractAddress = null;

  // Check if the network ID matches Sepolia's network ID
   if (networkId === 5777n) {  // Ganache Local Network
    contractAddress = '0x7bcdaa0369E14e2616d55f51390F3B08E6f49b22';  // Replace with your local Ganache contract address
} else {
    throw new Error('Contract not deployed to the detected network.');
}


  return new web3.eth.Contract(RegistryABI.abi, contractAddress);
};
