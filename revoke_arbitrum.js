const { ethers } = require('ethers');
const axios = require('axios');
const fs = require('fs');

require('dotenv').config()

const ERC20_ABI = [
    'function allowance(address owner, address spender) public view returns (uint256)',
    'function decimals() view returns (uint8)'
  ];

  //1.Change RPC_MAINNET TO ANOTHER CHAIN
const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_ARB);
const address = process.env.ADDRESS;
//2.Change API_MAINNET TO ANOTHER CHAIN
const apiKey = process.env.API_ARB;
const privateKey = process.env.SECRET;


async function getAllowance(contractAddress, ownerAddress, spenderAddress) {
  const contract = new ethers.Contract(contractAddress, ERC20_ABI, provider);

  const allowance = await contract.allowance(ownerAddress, spenderAddress);
  return allowance;
}

async function checkApproveTransaction(txHash) {
  const tx = await provider.getTransaction(txHash);
  const input = tx.data;

  if (input.startsWith('0x095ea7b3')) { // Function signature for "approve" method
    const iface = new ethers.utils.Interface(['function approve(address spender, uint256 amount) public returns (bool)']);
    const args = iface.decodeFunctionData('approve', input);

    return [tx.to, args.spender];
  } else {
    return 0;
  }
}

async function listTransactions(address, apiKey) {
        //3.change 'api.etherscan' to another chain
    const apiUrl = `https://api.arbiscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`;
    try {
      const response = await axios.get(apiUrl);
      if (response.data.status === "1") {
        return response.data.result;
      } else {
        console.log(`Error retrieving transactions for address ${address}: ${response.data.message}`);
      }
    } catch (error) {
      console.log(`Error retrieving transactions for address ${address}: ${error.message}`);
    }
  }
  
  async function approveToken(spender, tokenAddress, privateKey, provider) {
    // Create a new provider and signer
    const signer = new ethers.Wallet(privateKey, provider);
  
    // Load the ERC20 token contract using the token address
    const tokenContract = new ethers.Contract(tokenAddress, [
      'function approve(address spender, uint256 amount) public returns (bool)'
    ], signer);
    // Call the approve function on the token contract
    const tx = await tokenContract.approve(spender, '0');
  
    // Wait for the transaction to be mined
    const receipt = await tx.wait();
  
    return receipt.transactionHash;
  }

  listTransactions(address, apiKey).then(async (transactions) => {
    console.log(`Found ${transactions.length} transactions for address ${address}:`);
    console.log(`==========================NEW LINES==========================`);
   
    for(let i=0;i<transactions.length;i++) {
        let approveData = await checkApproveTransaction(transactions[i].hash);
        if(approveData != 0) {
            console.log(`Interact with contract: ${approveData[0]}`);
            console.log(`Spender address is: ${approveData[1]}`);
            console.log(`==========================NEW LINES==========================`);
            let allowanceBalance = await getAllowance(approveData[0], address, approveData[1]);
            console.log(`approve amount is : ${allowanceBalance.toString()}`);
            if(allowanceBalance.toString() !== '0') {
                const spender = approveData[1];
                const contractAddress = approveData[0];
                let tx = await approveToken(spender, contractAddress, privateKey, provider);
                console.log('============ revoke process ============');
                console.log(`tx hash revoke: ${tx}`);
            }
        }
    }
  }).catch((error) => {
    console.log(`Error: ${error.message}`);
  });

