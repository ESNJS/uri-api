'use strict';
const express = require('express');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const Web3 = require('web3-eth');

const router = express.Router();

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

router.get('/:chainID/:contractAddress/:tokenID', async (req, res) => {
    let apr = await getClassProperties(req.params.chainID, req.params.contractAddress, req.params.tokenID)
    res.send(apr)
});

app.use(
    cors({
        //credentials: true,
        origin: '*'
    })
);
app.options('*', cors());
app.use(bodyParser.json());
app.use('/.netlify/functions/server', router);  // path must route to lambda

module.exports = app;
module.exports.handler = serverless(app);
