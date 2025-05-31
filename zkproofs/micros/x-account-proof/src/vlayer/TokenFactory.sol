// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Token} from "./Token.sol";
import {Ownable} from "openzeppelin-contracts/access/Ownable.sol";
import {IERC20} from "openzeppelin-contracts/token/ERC20/IERC20.sol";

/**
 * @title TokenFactory
 * @dev A factory contract that deploys ERC20 tokens with bonding curve functionality
 */
contract TokenFactory is Ownable {
    uint256 public constant TOTAL_SUPPLY_TOKEN = 1_000_000 * 1e18; // 1M tokens with 18 decimals

    // External contract addresses
    address public immutable usdc;
    address public immutable uniswapRouter;
    address public immutable uniswapFactory;

    // Treasury address for collecting fees
    address public immutable treasury;

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
    constructor(address _usdc, address _uniswapRouter, address _uniswapFactory, address _treasury)
        Ownable(msg.sender)
    {
        require(
            _usdc != address(0) && _uniswapRouter != address(0) && _uniswapFactory != address(0)
                && _treasury != address(0),
            "Invalid address"
        );

        usdc = _usdc;
        uniswapRouter = _uniswapRouter;
        uniswapFactory = _uniswapFactory;
        treasury = _treasury;
    }

    /**
     * @notice Create a new token with bonding curve functionality
     * @dev Creates a new ERC20 token with bonding curve mechanics
     * @param name Name of the token
     * @param symbol Symbol of the token
     * @return The address of the newly created token
     */
    function createToken(string memory name, string memory symbol) external returns (address) {
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