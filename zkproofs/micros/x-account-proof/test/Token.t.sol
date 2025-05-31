// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {Token} from "../src/Token.sol";
import {TokenFactory} from "../src/TokenFactory.sol";
import {IERC20} from "openzeppelin-contracts/token/ERC20/IERC20.sol";

// Mainnet addresses
address constant MAINNET_USDC = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;
address constant UNISWAP_V2_ROUTER = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
address constant UNISWAP_FACTORY = 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f;
address constant USDC_Holder = 0x55FE002aefF02F77364de339a1292923A15844B8;

contract TokenTest is Test {
    TokenFactory public tokenFactory;
    uint256 public mainnetFork;
    Token public token;
    IERC20 public usdc;

    // Test accounts
    address public owner = address(1);
    address public user1 = address(2);
    address public user2 = address(3);
    address public treasury = address(4);

    uint256 public constant INITIAL_SUPPLY = 1_000_000 * 1e18; // 1M tokens
    uint256 public constant VESTING_DURATION = 30 days;

    string public MAINNET_RPC_URL = vm.envString("MAINNET_RPC_URL");

    function setUp() public {
        // Create a fork of Ethereum mainnet using the configured RPC URL
        mainnetFork = vm.createSelectFork(MAINNET_RPC_URL);

        usdc = IERC20(MAINNET_USDC);

        // Give the whale some ETH to pay for gas (Foundry resets balances)
        vm.deal(USDC_Holder, 1 ether);

        // Impersonate the whale
        vm.startPrank(USDC_Holder);

        // Transfer USDC to the test user
        usdc.transfer(user1, 1000e6); // 1000 USDC (6 decimals)

        vm.stopPrank();

        // Deploy the token factory and create a new token
        tokenFactory = new TokenFactory(MAINNET_USDC, UNISWAP_V2_ROUTER, UNISWAP_FACTORY, treasury);
    }

    function test_createToken() public {
        address tokenAddress = tokenFactory.createToken("Test Token", "TEST");
        token = Token(tokenAddress);
    }

    function test_useToken() public {
        address tokenAddress = tokenFactory.createToken("Test Token", "TEST");
        token = Token(tokenAddress);
        vm.startPrank(user1);
        usdc.approve(address(token), 10e6);
        token.buyTokens(10e6);
        vm.stopPrank();

        console.log("Current price: ", token.currentPrice());
    }
}
