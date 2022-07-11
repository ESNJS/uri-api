const express = require('express');
const cors = require('cors');
const Web3 = require('web3-eth');


const app = express();

const providerRPC = {
    '820': 'https://rpc.callisto.network/',
    '20729': 'https://testnet-rpc.callisto.network'
};

//Contract
const getClassForTokenIDABI = {"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"getClassForTokenID","inputs":[{"type":"uint256","name":"_tokenID","internalType":"uint256"}]}
const getClassPropertiesABI = {"type":"function","stateMutability":"view","outputs":[{"type":"string[]","name":"","internalType":"string[]"}],"name":"getClassProperties","inputs":[{"type":"uint256","name":"_classID","internalType":"uint256"}]}


async function getClassProperties(chainID, contractAddress, tokenID) {
    let web3 = new Web3(providerRPC[chainID]);
    let contract = new web3.Contract([getClassForTokenIDABI, getClassPropertiesABI], contractAddress)
    let classID = await contract.methods.getClassForTokenID(tokenID).call()
    return JSON.parse("["+await contract.methods.getClassProperties(classID).call()+"]")
}

app.use(
    cors({
        credentials: true,
        origin: true
    })
);
app.options('*', cors());

app.get('/:chainID/:contractAddress/:tokenID', async (req, res) => {
    //console.log(req.params.chainID)
    //console.log(req.params.contractAddress)
    //console.log(req.params.tokenID)
    let apr = await getClassProperties(req.params.chainID, req.params.contractAddress, req.params.tokenID)
    res.send(apr)
});

app.listen(process.env.PORT || 3000, function() {
    console.log('server running on port https://localhost:3000', '');
});