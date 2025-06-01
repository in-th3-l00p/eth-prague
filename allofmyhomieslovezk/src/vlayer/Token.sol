// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "openzeppelin-contracts/token/ERC20/ERC20.sol";
import "openzeppelin-contracts/token/ERC20/utils/SafeERC20.sol";
import "openzeppelin-contracts/access/Ownable.sol";
import "openzeppelin-contracts/utils/ReentrancyGuard.sol";
import "openzeppelin-contracts/utils/math/Math.sol";
import {IUniswapV2Factory} from "../uniswap/IUniswapV2Factory.sol";
import {IUniswapV2Router02} from "../uniswap/IUniswapV2Router02.sol";

/**
 * @title BondingCurveToken
 * @dev ERC20 token with a bonding curve for price determination using USDC
 */
contract Token is ERC20, Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // Price curve parameters (1e6 for USDC decimals)
    uint256 public constant USDC_SCALE = 1e6; // 1 USDC per token at initial supply
    uint256 public constant SLOPE = 4082; // 0.0000004082 * 1e10 for 18 decimal precision
    uint256 public constant SCALE = 1e18; // For decimal precision

    uint256 public constant FEE_RATE = 10; // 0.1% fee (10/10000 = 0.001 = 0.1%)
    uint256 public constant FEE_DENOMINATOR = 10000;

    // Token parameters
    IERC20 public immutable paymentToken; // USDC address
    address public immutable factory;
    address public immutable treasury;

    // Track total USDC collected from token sales
    uint256 public totalCollected;

    // Graduation parameters
    bool public isGraduated;
    address public uniswapPair;
    uint256 public graduationPrice;
    uint256 public constant GRADUATION_THRESHOLD = 70; // 70% of supply
    uint256 public constant MAX_SUPPLY = 1_000_000 * 1e18;
    uint256 public constant OWNER_WITHDRAW_PERCENT = 70; // 70% of USDC to owner
    uint256 public constant LIQUIDITY_TOKEN_PERCENT = 10; // 10% of tokens to liquidity
    uint256 public constant TOKEN_AMOUNT_FOR_GRADUATION_POOL = 40_000 * 10 ** 18; // 40,000 tokens for Uniswap pool at graduation
    uint256 public constant USDC_FOR_GRADUATION_POOL = 20_000 * 10 ** 6; // 20,000 USDC for Uniswap pool at graduation

    uint256 public endVestingTime;

    event TokensPurchased(address indexed buyer, uint256 usdcAmount, uint256 tokenAmount, uint256 fee);
    event TokensSold(address indexed seller, uint256 tokenAmount, uint256 usdcAmount, uint256 fee);
    event Graduated(address indexed pair, uint256 liquidity, uint256 liquidityUsdc);
    event MintedForContribution(address indexed to, uint256 amount);

    IUniswapV2Router02 public constant UNISWAP_ROUTER = IUniswapV2Router02(0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D);
    IUniswapV2Factory public constant UNISWAP_FACTORY = IUniswapV2Factory(0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f);

    modifier whenNotGraduated() {
        require(!isGraduated, "Token has already graduated");
        _;
    }

    modifier whenVestingIsOver() {
        require(block.timestamp > endVestingTime, "Vesting is not over yet");
        _;
    }

    /**
     * @dev Constructor that sets up the token
     * @param name Name of the token
     * @param symbol Symbol of the token
     * @param owner Address that will receive the initial supply and own the contract
     * @param _paymentToken Address of the payment token (USDC)
     * @param _factory Address of the factory contract
     * @param _treasury Address where fees will be sent
     */
    constructor(
        string memory name,
        string memory symbol,
        address owner,
        address _paymentToken,
        address _factory,
        address _treasury,
        uint256 _endVestingTime
    ) ERC20(name, symbol) Ownable(owner) {
        require(_paymentToken != address(0) && _factory != address(0) && _treasury != address(0), "Invalid address");
        paymentToken = IERC20(_paymentToken);
        factory = _factory;
        treasury = _treasury;
        endVestingTime = _endVestingTime;
    }

    /**
     * @dev Buy tokens with USDC
     * @param usdcAmount Amount of USDC to spend (6 decimals)
     */
    function buyTokens(uint256 usdcAmount) external nonReentrant whenNotGraduated {
        require(usdcAmount > 0, "Must send USDC to buy tokens");

        uint256 fee = calculateFee(usdcAmount);
        uint256 amountAfterFee = usdcAmount - fee;

        // Transfer USDC from user to this contract
        paymentToken.safeTransferFrom(msg.sender, address(this), usdcAmount);

        // Calculate tokens to mint
        uint256 tokensToMint = calculatePurchaseAmount(amountAfterFee);
        require(tokensToMint > 0, "Insufficient USDC amount");
        require(MAX_SUPPLY > totalSupply() + tokensToMint, "Exceeds Max supply");

        // Mint tokens to buyer
        _mint(msg.sender, tokensToMint);
        totalCollected += amountAfterFee;

        // Transfer fee to treasury
        if (fee > 0) {
            paymentToken.safeTransfer(treasury, fee);
        }

        // Check if we've reached graduation threshold (70% of supply sold)
        uint256 circulatingSupply = totalSupply();
        if (circulatingSupply * 100 / MAX_SUPPLY >= GRADUATION_THRESHOLD) {
            _graduate();
        }

        emit TokensPurchased(msg.sender, usdcAmount, tokensToMint, fee);
    }

    /**
     * @dev Sell tokens back to the contract for USDC
     * @param tokenAmount Amount of tokens to sell
     */
    function sellTokens(uint256 tokenAmount) external nonReentrant whenNotGraduated {
        require(tokenAmount > 0, "Must sell at least 1 token");
        require(balanceOf(msg.sender) >= tokenAmount, "Insufficient balance");

        uint256 usdcAmount = calculateSaleAmount(tokenAmount);
        require(usdcAmount > 0, "No USDC to send");

        uint256 fee = calculateFee(usdcAmount);
        uint256 amountAfterFee = usdcAmount - fee;

        // Burn tokens from seller
        _burn(msg.sender, tokenAmount);

        // Transfer USDC to seller
        paymentToken.safeTransfer(msg.sender, amountAfterFee);

        // Transfer fee to treasury
        if (fee > 0) {
            paymentToken.safeTransfer(treasury, fee);
        }

        emit TokensSold(msg.sender, tokenAmount, usdcAmount, fee);
    }

    // todo: make this only callable with proof of contribution
    function mintForContribution(address to, uint256 amount) external onlyOwner {
        require(MAX_SUPPLY > totalSupply() + amount, "Exceeds Max supply");
        _mint(to, amount);
        emit MintedForContribution(to, amount);
    }

    /**
     * @dev Calculate the current price to buy 1 token
     * @return price The current price in USDC (6 decimals) for 1 token
     */
    function currentPrice() public view returns (uint256) {
        // price = slope * totalSupply
        // 0.0000004082 * totalSupply
        return (totalSupply() * SLOPE) / 1e10;
    }

    /**
     * @dev Calculate the amount of tokens that can be bought with a given USDC amount
     * @param usdcAmount Amount of USDC to spend (6 decimals)
     * @return tokens The amount of tokens that can be bought
     */
    function calculatePurchaseAmount(uint256 usdcAmount) public view returns (uint256) {
        require(usdcAmount > 0, "Must send USDC to buy tokens");

        // Using the integral of the linear price function: tokens = sqrt(2 * usdcAmount / PRICE_MULTIPLIER + (totalSupply^2)) - totalSupply
        uint256 totalSupply = totalSupply();
        uint256 usdcScaled = (usdcAmount * SCALE) / (USDC_SCALE);
        uint256 buyingPower = usdcScaled * 1e10 / SLOPE;
        uint256 square = (totalSupply * totalSupply) + (2 * buyingPower);
        uint256 root = sqrt(square * (10 ** 18));

        return (root / (10 ** 9)) - totalSupply;
    }

    /**
     * @dev Calculate the amount of USDC received for selling tokens
     * @param tokenAmount Amount of tokens to sell
     * @return usdcAmount The amount of USDC that would be received (6 decimals)
     */
    function calculateSaleAmount(uint256 tokenAmount) public view returns (uint256) {
        require(tokenAmount > 0, "Must sell more than 0 tokens");
        require(balanceOf(msg.sender) >= tokenAmount, "Insufficient balance");

        uint256 totalSupply = totalSupply();
        uint256 newSupply = totalSupply - tokenAmount;

        // Using the integral of the price function: usdc = (totalSupply^2 - newSupply^2) * PRICE_MULTIPLIER / (2 * SCALE)
        uint256 supplyDiff = (totalSupply * totalSupply) - (newSupply * newSupply);
        return (supplyDiff * SLOPE) / (2 * 1e10);
    }

    /**
     * @dev Calculate the fee amount for a transaction
     * @param amount The amount to calculate fee for
     * @return fee The fee amount
     */
    function calculateFee(uint256 amount) public pure returns (uint256) {
        return (amount * FEE_RATE) / FEE_DENOMINATOR;
    }

    /**
     * @dev Graduate the token by creating a Uniswap pool and distributing funds
     */
    function _graduate() internal {
        require(!isGraduated, "Already graduated");

        isGraduated = true;
        graduationPrice = currentPrice();

        // Calculate token amount for liquidity (10% of total supply)
        _mint(address(this), TOKEN_AMOUNT_FOR_GRADUATION_POOL);

        // Approve Uniswap to spend tokens
        _approve(address(this), address(UNISWAP_ROUTER), TOKEN_AMOUNT_FOR_GRADUATION_POOL);
        paymentToken.approve(address(UNISWAP_ROUTER), USDC_FOR_GRADUATION_POOL);

        // Create Uniswap pair and add liquidity
        uniswapPair = UNISWAP_FACTORY.createPair(address(this), address(paymentToken));
        UNISWAP_ROUTER.addLiquidity(
            address(this),
            address(paymentToken),
            TOKEN_AMOUNT_FOR_GRADUATION_POOL,
            USDC_FOR_GRADUATION_POOL,
            TOKEN_AMOUNT_FOR_GRADUATION_POOL,
            USDC_FOR_GRADUATION_POOL,
            address(this),
            block.timestamp + 1 hours
        );

        // Mint remaining 20% of tokens to factory
        uint256 remainingTokens = (totalSupply() * 20) / 100;
        _mint(factory, remainingTokens);

        emit Graduated(uniswapPair, TOKEN_AMOUNT_FOR_GRADUATION_POOL, USDC_FOR_GRADUATION_POOL);
    }

    function withdrawOwnerShare() external onlyOwner whenVestingIsOver {
        uint256 totalUsdc = totalCollected;
        uint256 ownerWithdraw = (totalUsdc * OWNER_WITHDRAW_PERCENT) / 100;
        // Transfer owner's share of USDC
        if (ownerWithdraw > 0) {
            paymentToken.safeTransfer(owner(), ownerWithdraw);
        }
    }

    /**
     * @dev Square root function using Babylonian method
     */
    function sqrt(uint256 x) internal pure returns (uint256 y) {
        uint256 z = (x + 1) / 2;
        y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
    }
}
