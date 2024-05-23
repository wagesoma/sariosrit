// Import dependencies
const Web3 = require('web3');
const fs = require('fs');
const readlineSync = require('readline-sync');

// Load Ethereum wallet private key and Infura API key from environment variables or .env file
require('dotenv').config();
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const INFURA_API_KEY = process.env.INFURA_API_KEY;

// Ethereum network endpoint (Infura)
const INFURA_ENDPOINT = `https://mainnet.infura.io/v3/${INFURA_API_KEY}`;

// Contract ABI (JSON representation of contract interface)
const CONTRACT_ABI = JSON.parse(fs.readFileSync('ContractABI.json'));

// Ethereum wallet address
const WALLET_ADDRESS = '0xYourWalletAddress';

// Ethereum voting contract address
const CONTRACT_ADDRESS = '0xVotingContractAddress';

// Initialize Web3 instance
const web3 = new Web3(new Web3.providers.HttpProvider(INFURA_ENDPOINT));

// Initialize Ethereum wallet
const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);

// Load contract instance
const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

// Function to vote on a proposal
async function vote(proposalId, voteType) {
    try {
        // Encode vote function call data
        const encodedData = contract.methods.vote(proposalId, voteType).encodeABI();

        // Create transaction object
        const tx = {
            from: WALLET_ADDRESS,
            to: CONTRACT_ADDRESS,
            gas: 2000000,
            data: encodedData
        };

        // Sign transaction
        const signedTx = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);

        // Send signed transaction
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

        console.log('Vote successful.');
        console.log('Transaction hash:', receipt.transactionHash);
    } catch (error) {
        console.error('Vote failed:', error);
    }
}

// Function to get current proposals
async function getProposals() {
    try {
        // Call contract method to retrieve proposals
        const proposals = await contract.methods.getProposals().call();

        console.log('Current proposals:');
        proposals.forEach((proposal, index) => {
            console.log(`Proposal ${index + 1}: ${proposal}`);
        });
    } catch (error) {
        console.error('Failed to fetch proposals:', error);
    }
}

// Main function
async function main() {
    console.log('Welcome to the DAO voting system.');

    // Display current proposals
    await getProposals();

    // Prompt user to select a proposal and vote type
    const proposalId = readlineSync.questionInt('Enter the ID of the proposal you want to vote on: ');
    const voteType = readlineSync.questionInt('Enter 1 for yes, 2 for no: ');

    // Perform vote
    await vote(proposalId, voteType);
}

// Execute main function
main();
