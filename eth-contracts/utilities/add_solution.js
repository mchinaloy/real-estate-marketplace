#!/usr/bin/env node
'use strict';

const Web3 = require('web3');
const HDWalletProvider = require('truffle-hdwallet-provider');
const contractFile = require('./build/contracts/SolnSquareVerifier');
const squareProof = require("../../zokrates/code/square/proofs/9/proof.json");

const tokenId = 19;
const mnemonic = "xxx";
const infuraKey = "xxx";
const contractAddress = "0x2541C62B12C2F717c038ed352dD161f02522E3F2";

(async() => {
  const provider = await new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/v3/${infuraKey}`, 0);
  const web3 = await new Web3(provider);
  const accounts = await web3.eth.getAccounts();
  const contract = await new web3.eth.Contract(contractFile.abi, contractAddress, { gasLimit: "4500000" });

  console.log(`Adding solution:\n inputs: ${squareProof.inputs}\n tokenId: ${tokenId}\n address: ${accounts[0]}`);

  try {
    let result = await contract.methods.addSolution(squareProof.proof.a, squareProof.proof.b, squareProof.proof.c, squareProof.inputs, tokenId).send({ from: accounts[0], gas: 2500000});
    console.log(result)
  } catch(err) {
    throw (err);
  }

  process.exit(1);
})();