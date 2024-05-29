const { ethers } = require("ethers");
const Web3 = require("web3");
require('dotenv').config();

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
const privateKey = process.env.PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey, provider);

const web3 = new Web3(process.env.BRIDGE_RPC_URL);

async function bridgeVote(proposalId, voteOption) {
    const bridgeContract = new web3.eth.Contract(
        [
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "_proposalId",
                        "type": "uint256"
                    },
                    {
                        "name": "_voteOption",
                        "type": "uint8"
                    }
                ],
                "name": "bridgeVote",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            }
        ],
        process.env.BRIDGE_CONTRACT_ADDRESS
    );

    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    web3.eth.accounts.wallet.add(account);

    try {
        const tx = await bridgeContract.methods.bridgeVote(proposalId, voteOption).send({
            from: account.address,
            gas: 2000000
        });
        console.log(`Bridged vote on proposal ${proposalId} with option ${voteOption}`);
    } catch (error) {
        console.error(`Error bridging vote on proposal: ${error.message}`);
    }
}

const proposalId = process.argv[2];
const voteOption = process.argv[3];

bridgeVote(proposalId, voteOption);
