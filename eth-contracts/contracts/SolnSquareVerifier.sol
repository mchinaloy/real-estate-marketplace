pragma solidity >=0.4.21 <0.6.0;

import "./ERC721Mintable.sol";
import "./Verifier.sol";

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is MaoMaoToken, Verifier {

    // TODO define a solutions struct that can hold an index & an address
    struct Solution {
        bytes32 id;
        address sender;
        bool verified;
    }

    // TODO define an array of the above struct
    mapping(uint256 => Solution) uniqueSolutionsByTokenId;

    // TODO define a mapping to store unique solutions submitted
    mapping(bytes32 => Solution) uniqueSolutions;

    // TODO Create an event to emit when a solution is added
    event SolutionAdded(bytes32 id, address sender, uint256 tokenId);

    // TODO Create a function to add the solutions to the array and emit the event
    function addSolution(uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory input, uint256 tokenId) public {
        bytes32 id = keccak256(abi.encodePacked(a, b, c, input));

        require(uniqueSolutions[id].verified == false, "Solution already exists, please provide a new one");
        require(verifyTx(a, b, c, input) == true, "Provided proof is incorrect");

        Solution memory newSolution = Solution({
            id: id,
            sender: msg.sender,
            verified: true          
        });

        uniqueSolutions[id] = newSolution;
        uniqueSolutionsByTokenId[tokenId] = newSolution; 

        emit SolutionAdded(id, msg.sender, tokenId);
    }

    // TODO Create a function to mint new NFT only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSuplly
    function mint(address to, uint256 tokenId) public returns(bool) {
        require(uniqueSolutionsByTokenId[tokenId].verified == true, "A solution must be provided for this tokenId");
        super.mint(to, tokenId);
        return true;
    }

}

























