// Test if a new solution can be added for contract - SolnSquareVerifier
// Test if an ERC721 token can be minted for contract - SolnSquareVerifier

var SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
var squareProof = require("../../zokrates/code/square/proof.json"); 

contract('TestSolnSquareVerifier', accounts => {

    describe('SolnSquareVerifier Test Suite', function() {

        const TOKEN_ID = 123;

        beforeEach(async function() {
            this.contract = await SolnSquareVerifier.new();
        });

        it('Should add new solutions', async function() {
            // act
            let result = await this.contract.addSolution(squareProof.proof.a, squareProof.proof.b, squareProof.proof.c, squareProof.inputs, TOKEN_ID, {from: accounts[0]});
            
            // assert
            let event = result.logs[0].event;
            assert.equal(event, "Verified", "Should emit a Verified event");
        });

        it('Should mint new tokens', async function(){
            // setup
            await this.contract.addSolution(squareProof.proof.a, squareProof.proof.b, squareProof.proof.c, squareProof.inputs, TOKEN_ID, {from: accounts[0]});

            // act
            let result = await this.contract.mint(accounts[0], 123);

            // assert
            let event = result.logs[0].event;
            assert.equal(event, "Transfer", "Should emit a Transfer event");
        });

    });

});
