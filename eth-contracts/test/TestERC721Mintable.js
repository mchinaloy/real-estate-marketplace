var ERC721MintableComplete = artifacts.require('ManshuToken');
var BigNumber = require('bignumber.js');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: account_one});

            for(let i = 0; i < 5; i++) {
                await this.contract.mint(account_one, i, "a_token_uri_" + i);
            }

            for(let i = 5; i < 10; i++) {
                await this.contract.mint(account_two, i, "b_token_uri_" + i);
            }
        })

        it('should return total supply', async function () { 
            // act
            let result = new BigNumber(await this.contract.totalSupply());

            // assert
            assert.equal(result.toString(), 10, "Total supply should be 10");
        })

        it('should get token balance', async function () { 
            // act
            let result = new BigNumber(await this.contract.balanceOf(account_one));

            // assert
            assert.equal(result.toString(), 5, "Token balance for account one should be 5");
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            // setup
            let expectedResult = "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/0";

            // act
            let result = await this.contract.tokenURI(0);

            // assert
            assert.equal(result, expectedResult, "Token should have expected tokenURI");
        })

        it('should transfer token from one owner to another', async function () { 
            // setup
            let existingOwner = await this.contract.ownerOf(0);
            assert.equal(existingOwner, account_one, "Account one should be the original owner");

            // act
            await this.contract.transferFrom(account_one, account_two, 0);

            // assert
            let result = await this.contract.ownerOf(0);
            assert.equal(result, account_two, "Account two should now be the owner");
        })

    });

    describe('have ownership properties', function () {

        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () { 
            // setup
            let mintFailed = false;

            // act
            try {
                await this.contract.mint(account_two, 11, "c_token_uri", {from: account_two});
            } catch(e) {
                mintFailed = true;
            }

            // assert
            assert.equal(mintFailed, true, "Mint should fail when caller is not contract owner");
        })

        it('should return contract owner', async function () { 
            // act
            let result = await this.contract.getOwner();

            // assert
            assert.equal(result, account_one, "Account one should be the owner");
        })

    });

})