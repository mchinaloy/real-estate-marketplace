// define a variable to import the <Verifier> or <renamedVerifier> solidity contract generated by Zokrates

// Test verification with correct proof
// - use the contents from proof.json generated from zokrates steps

// Test verification with incorrect proof

let SquareVerifier = artifacts.require('verifier');
let squareProof = require("../../zokrates/code/square/proof.json");

contract("TestSquareVerifier", accounts => {

    describe('Verifier Test Suite', function(){

        beforeEach(async function(){
            this.contract = await SquareVerifier.new();
        });

        it("Should verify with correct proof", async function() {
            // act
            let result = await this.contract.verifyTx.call(squareProof.proof.a, squareProof.proof.b, squareProof.proof.c, squareProof.inputs, {from: accounts[0]});

            // assert
            assert.equal(true, result, "Should verify the proof as correct");
        });

        it("Should not verify with incorrect proof", async function() {
            // setup
            let badInputs = ["0","0"];

            // act
            let result = await this.contract.verifyTx.call(squareProof.proof.a, squareProof.proof.b, squareProof.proof.c, badInputs, {from: accounts[0]});

            // assert
            assert.equal(false, result, "Should not verify proof as correct");
        });

    });

});
