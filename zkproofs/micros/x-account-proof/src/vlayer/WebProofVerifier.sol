// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import {WebProofProver} from "./WebProofProver.sol";

import {Proof} from "vlayer-0.1.0/Proof.sol";
import {Verifier} from "vlayer-0.1.0/Verifier.sol";

contract WebProofVerifier is Verifier {
    address public prover;

    mapping(address => string) public addressToScreenName;

    constructor(address _prover) {
        prover = _prover;
    }

    function verify(Proof calldata, string memory screenName, address account)
        public
        onlyVerified(prover, WebProofProver.main.selector)
    {
        require(addressToScreenName[account] == "", "Account already verified");
        addressToScreenName[account] = screenName;
    }

    function getScreenName(address account) public view returns (string memory) {
        return addressToScreenName[account];
    }
}
