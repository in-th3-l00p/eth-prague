// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import {WebProofProver} from "./WebProofProver.sol";

import {Token} from "./Token.sol";
import {Ownable} from "openzeppelin-contracts/access/Ownable.sol";

import {Proof} from "vlayer-0.1.0/Proof.sol";
import {Verifier} from "vlayer-0.1.0/Verifier.sol";

import {IERC20} from "openzeppelin-contracts/token/ERC20/IERC20.sol";

// token factory at the same time
contract WebProofVerifier is Verifier, Ownable {
    address public prover;

    uint256 public constant TOTAL_SUPPLY_TOKEN = 1_000_000 * 1e18; // 1M tokens with 18 decimals

    // External contract addresses
    address public immutable usdc;
    address public immutable uniswapRouter;
    address public immutable uniswapFactory;

    // Treasury address for collecting fees
    address public immutable treasury;

    struct Influencer {
        bool isEligibleToLaunch;
        uint256 createdAt;
    }

    mapping(address => Influencer) public influencers;

    // Array to keep track of all deployed tokens
    address[] public deployedTokens;
    mapping(address => bool) public isTokenDeployed;

    // Event emitted when a new token is created
    event TokenCreated(
        address indexed tokenAddress, string name, string symbol, address indexed owner, uint256 initialSupply
    );

    /**
     * @dev Constructor that sets up the factory
     * @param _usdc Address of the USDC token
     * @param _uniswapRouter Address of the Uniswap V2 Router
     * @param _uniswapFactory Address of the Uniswap V2 Factory
     * @param _treasury Address where fees will be sent
     */
    constructor(
        address _prover, 
        address _usdc, 
        address _uniswapRouter, 
        address _uniswapFactory, 
        address _treasury
    )
        Ownable(msg.sender)
    {
        require(
            _usdc != address(0) && _uniswapRouter != address(0) && _uniswapFactory != address(0)
                && _treasury != address(0),
            "Invalid address"
        );

        prover = _prover;

        usdc = _usdc;
        uniswapRouter = _uniswapRouter;
        uniswapFactory = _uniswapFactory;
        treasury = _treasury;
    }

    /**
     * @notice Registers a influencer as eligible to launch a token
     * @dev Verifies the proof of X handle and registers the influencer as eligible to launch a token
     * @param _p Proof of X handle
     */
    function registerTokenLaunch(Proof calldata _p, string memory username, address account)
        public
        onlyVerified(prover, WebProofProver.accountProof.selector)
    {
        influencers[account] = Influencer({isEligibleToLaunch: true, createdAt: 0});
    }

    /**
     * @notice Create a new token with bonding curve functionality
     * @dev Creates a new ERC20 token with bonding curve mechanics
     * @param name Name of the token
     * @param symbol Symbol of the token
     * @return The address of the newly created token
     */
    function createToken(
        Proof calldata _p,
        int256 followersCount,
        address account,
        string memory name,
        string memory symbol
    ) public onlyVerified(prover, WebProofProver.followersProof.selector) returns (address) {
        require(influencers[msg.sender].isEligibleToLaunch, "Influencer is not eligible to launch a token");
        require(influencers[msg.sender].createdAt == 0, "Influencer has already launched a token");
        // Create a new token
        Token newToken = new Token(
            name,
            symbol,
            msg.sender, // Owner
            usdc, // Payment token (USDC)
            uniswapFactory,
            address(this), // Factory as the treasury for remaining tokens
            block.timestamp + 365 days
        );

        influencers[msg.sender].createdAt = block.timestamp;

        address tokenAddress = address(newToken);

        // Track the deployed token
        deployedTokens.push(tokenAddress);
        isTokenDeployed[tokenAddress] = true;

        emit TokenCreated(tokenAddress, name, symbol, msg.sender, TOTAL_SUPPLY_TOKEN);
        return tokenAddress;
    }

    /**
     * @dev Returns the number of tokens created by this factory
     * @return The number of tokens created
     */
    function getTokenCount() external view returns (uint256) {
        return deployedTokens.length;
    }

    /**
     * @dev Returns the address of a token at a specific index
     * @param index The index of the token
     * @return The address of the token
     */
    function getToken(uint256 index) external view returns (address) {
        require(index < deployedTokens.length, "Index out of bounds");
        return deployedTokens[index];
    }

    /**
     * @dev Withdraw any ERC20 tokens sent to this contract by mistake
     * @param token Address of the token to withdraw
     * @param to Address to send the tokens to
     * @param amount Amount to withdraw
     */
    function withdrawTokens(address token, address to, uint256 amount) external onlyOwner {
        require(!isTokenDeployed[token], "Cannot withdraw deployed tokens");
        IERC20(token).transfer(to, amount);
    }
}
