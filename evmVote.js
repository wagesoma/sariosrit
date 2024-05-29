const { ethers } = require("ethers");
require('dotenv').config();

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
const privateKey = process.env.PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey, provider);

async function vote(proposalId, voteOption) {
    const daoContract = new ethers.Contract(
        process.env.DAO_CONTRACT_ADDRESS,
        [
            "function vote(uint256 proposalId, uint8 voteOption) public"
        ],
        wallet
    );

    try {
        const tx = await daoContract.vote(proposalId, voteOption);
        await tx.wait();
        console.log(`Voted on proposal ${proposalId} with option ${voteOption}`);
    } catch (error) {
        console.error(`Error voting on proposal: ${error.message}`);
    }
}

const proposalId = process.argv[2];
const voteOption = process.argv[3];

vote(proposalId, voteOption);
