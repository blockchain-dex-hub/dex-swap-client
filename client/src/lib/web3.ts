import { ethers } from "ethers";
import { tokenList } from "./tokenList";
import { TokenInfo } from "@/types";
import { bnwTokenList } from "./bnwTokenList";

// Network configurations
export const bscNetworkParams = {
  chainId: "0x38", // 56 in decimal
  chainName: "BNB Smart Chain",
  nativeCurrency: {
    name: "BNB",
    symbol: "BNB",
    decimals: 18
  },
  rpcUrls: ["https://bsc-dataseed.binance.org/"],
  blockExplorerUrls: ["https://bscscan.com/"]
};

export const bnwNetworkParams = {
  chainId: "0x2CA", // 714 in decimal
  chainName: "BNW Chain",
  nativeCurrency: {
    name: "BNW Token",
    symbol: "BNW",
    decimals: 18
  },
  rpcUrls: ["http://174.138.18.77:8545"],
  blockExplorerUrls: ["https://bnwscan.fiotech.org/"]
};

// ABI for ERC20 tokens
const erc20Abi = [
  // Read-only functions
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)",

  // Write functions
  "function transfer(address to, uint amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",

  // Events
  "event Transfer(address indexed from, address indexed to, uint amount)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)"
];

// Simplified PancakeSwap Router ABI
const routerAbi = [
  "function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)",
  "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
  "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)",
  "function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)"
];

// Router addresses
const PANCAKE_ROUTER_ADDRESS = "0x10ED43C718714eb63d5aA57B78B54704E256024E";
const WBNB_ADDRESS = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";

// Check if MetaMask is installed
export function isMetaMaskInstalled(): boolean {
  return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
}

// Get MetaMask download URL based on browser
export function getMetaMaskDownloadUrl(): string {
  const isFirefox = typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
  return isFirefox ? 'https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/' : 'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn';
}

// Helper function to connect to MetaMask
export async function connectToMetaMask(): Promise<ethers.BrowserProvider | null> {
  if (!isMetaMaskInstalled()) {
    throw new Error("WALLET_NOT_INSTALLED");
  }

  try {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const chainId = await window.ethereum.request({ method: "eth_chainId" });

    if (chainId !== bnwNetworkParams.chainId) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: bnwNetworkParams.chainId }],
        });
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [bnwNetworkParams],
          });
        } else {
          throw switchError;
        }
      }
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    return provider;
  } catch (error: any) {
    console.error("Error connecting to MetaMask:", error);
    if (error.code === 4001) {
      throw new Error("WALLET_REJECTED");
    }
    throw error;
  }
}

// Get token balances
export async function getTokenBalances(
  address: string,
  provider: ethers.BrowserProvider
): Promise<TokenInfo[]> {
  const updatedTokens = await Promise.all(
    tokenList.map(async (token) => {
      try {
        let balance;
        if (token.symbol === "BNB") {
          balance = await provider.getBalance(address);
          return {
            ...token,
            balance: parseFloat(ethers.formatEther(balance)),
          };
        } else {
          const tokenContract = new ethers.Contract(
            token.address,
            erc20Abi,
            provider
          );
          balance = await tokenContract.balanceOf(address);
          return {
            ...token,
            balance: parseFloat(ethers.formatUnits(balance, token.decimals)),
          };
        }
      } catch (error) {
        console.error(`Error getting balance for ${token.symbol}:`, error);
        return token;
      }
    })
  );
  return updatedTokens;
}

// Estimate the amount of tokens to receive in a swap
export async function getSwapEstimate(
  fromToken: TokenInfo,
  toToken: TokenInfo,
  amount: string,
  provider: ethers.BrowserProvider
): Promise<string> {
  if (!amount || parseFloat(amount) <= 0) return "0";

  try {
    const router = new ethers.Contract(
      PANCAKE_ROUTER_ADDRESS,
      routerAbi,
      provider
    );

    const path = [];
    if (fromToken.symbol === "BNB") {
      path.push(WBNB_ADDRESS);
    } else {
      path.push(fromToken.address);
    }

    if (fromToken.symbol !== "BNB" && toToken.symbol !== "BNB") {
      path.push(WBNB_ADDRESS);
    }

    if (toToken.symbol === "BNB") {
      path.push(WBNB_ADDRESS);
    } else {
      path.push(toToken.address);
    }

    const uniquePath = [...new Set(path)];
    const amountIn = ethers.parseUnits(amount, fromToken.decimals);
    const amounts = await router.getAmountsOut(amountIn, uniquePath);
    return ethers.formatUnits(amounts[amounts.length - 1], toToken.decimals);
  } catch (error) {
    console.error("Error estimating swap:", error);
    return "0";
  }
}

// Execute a token swap
export async function executeSwap(
  fromToken: TokenInfo,
  toToken: TokenInfo,
  amount: string,
  slippageTolerance: number,
  provider: ethers.BrowserProvider
): Promise<{ success: boolean; txHash?: string; error?: string }> {
  if (!amount || parseFloat(amount) <= 0) {
    return { success: false, error: "Invalid amount" };
  }

  try {
    const signer = await provider.getSigner();
    const router = new ethers.Contract(
      PANCAKE_ROUTER_ADDRESS,
      routerAbi,
      signer
    );

    // Define the path
    const path = [];

    if (fromToken.symbol === "BNB") {
      path.push(WBNB_ADDRESS);
    } else {
      path.push(fromToken.address);
    }

    // Add intermediary BNB if needed
    if (fromToken.symbol !== "BNB" && toToken.symbol !== "BNB") {
      path.push(WBNB_ADDRESS);
    }

    if (toToken.symbol === "BNB") {
      path.push(WBNB_ADDRESS);
    } else {
      path.push(toToken.address);
    }

    // Remove duplicates
    const uniquePath = [...new Set(path)];

    // Calculate deadline (20 minutes from now)
    const deadline = Math.floor(Date.now() / 1000) + 20 * 60;

    // Get estimated output amount
    const estimatedOutput = await getSwapEstimate(
      fromToken,
      toToken,
      amount,
      provider
    );

    // Calculate minimum output with slippage
    const minOutput = ethers.parseUnits(
      (parseFloat(estimatedOutput) * (1 - slippageTolerance / 100)).toFixed(toToken.decimals),
      toToken.decimals
    );

    const amountIn = ethers.parseUnits(
      amount,
      fromToken.decimals
    );

    let tx;

    // Execute the appropriate swap function
    if (fromToken.symbol === "BNB") {
      // Swap ETH for Tokens
      tx = await router.swapExactETHForTokens(
        minOutput,
        uniquePath,
        await signer.getAddress(),
        deadline,
        { value: amountIn }
      );
    } else if (toToken.symbol === "BNB") {
      // Swap Tokens for ETH

      // First, approve the router to spend tokens
      const tokenContract = new ethers.Contract(
        fromToken.address,
        erc20Abi,
        signer
      );

      const approveTx = await tokenContract.approve(
        PANCAKE_ROUTER_ADDRESS,
        amountIn
      );
      await approveTx.wait();

      // Then execute the swap
      tx = await router.swapExactTokensForETH(
        amountIn,
        minOutput,
        uniquePath,
        await signer.getAddress(),
        deadline
      );
    } else {
      // Swap Tokens for Tokens

      // First, approve the router to spend tokens
      const tokenContract = new ethers.Contract(
        fromToken.address,
        erc20Abi,
        signer
      );

      const approveTx = await tokenContract.approve(
        PANCAKE_ROUTER_ADDRESS,
        amountIn
      );
      await approveTx.wait();

      // Then execute the swap
      tx = await router.swapExactTokensForTokens(
        amountIn,
        minOutput,
        uniquePath,
        await signer.getAddress(),
        deadline
      );
    }

    // Wait for transaction to be mined
    const receipt = await tx.wait();

    return {
      success: true,
      txHash: receipt.hash,
    };
  } catch (error: any) {
    console.error("Error executing swap:", error);
    return {
      success: false,
      error: error.message || "Transaction failed",
    };
  }
}

// Helper to get estimated gas fee
export async function getEstimatedGasFee(provider: ethers.BrowserProvider): Promise<number> {
  try {
    const feeData = await provider.getFeeData();
    const gasPrice = feeData.gasPrice || ethers.parseUnits("5", "gwei");
    const estimatedGas = 100000;
    const gasFeeWei = gasPrice * BigInt(estimatedGas);
    const gasFeeETH = parseFloat(ethers.formatEther(gasFeeWei));
    return gasFeeETH;
  } catch (error) {
    console.error("Error estimating gas fee:", error);
    return 0.0005; // Default estimate
  }
}