import { useState, useEffect } from "react";
import { useWallet } from "./useWallet";
import { TokenInfo } from "@/types";
import { tokenList } from "@/lib/tokenList";
import { 
  getSwapEstimate, 
  executeSwap, 
  getEstimatedGasFee 
} from "@/lib/web3";

export const useSwap = () => {
  const { connected, provider, refreshBalances, tokens } = useWallet();
  
  const [fromToken, setFromToken] = useState<TokenInfo | undefined>(tokens[0]); // Default to BNB
  const [toToken, setToToken] = useState<TokenInfo | undefined>(tokens[1]); // Default to BUSD
  const [fromAmount, setFromAmount] = useState<string>("");
  const [toAmount, setToAmount] = useState<string>("");
  const [slippageTolerance, setSlippageTolerance] = useState<number>(0.5);
  const [swapping, setSwapping] = useState<boolean>(false);
  const [txHash, setTxHash] = useState<string | undefined>();
  const [estimatedGas, setEstimatedGas] = useState<number>(0.0005);
  
  // Update tokens with balances when wallet tokens change
  useEffect(() => {
    if (tokens.length > 0) {
      const bnb = tokens.find(t => t.symbol === "BNB");
      const busd = tokens.find(t => t.symbol === "BUSD");
      
      if (bnb && (!fromToken || fromToken.symbol === "BNB")) {
        setFromToken(bnb);
      }
      
      if (busd && (!toToken || toToken.symbol === "BUSD")) {
        setToToken(busd);
      }
    }
  }, [tokens]);
  
  // Get gas estimate when provider changes
  useEffect(() => {
    const updateGasEstimate = async () => {
      if (provider) {
        const gas = await getEstimatedGasFee(provider);
        setEstimatedGas(gas);
      }
    };
    
    updateGasEstimate();
  }, [provider]);
  
  // Calculate to amount when from amount changes
  useEffect(() => {
    if (fromToken && toToken && fromAmount && parseFloat(fromAmount) > 0 && provider) {
      calculateToAmount(fromAmount);
    } else {
      setToAmount("");
    }
  }, [fromToken, toToken, provider]);
  
  const calculateToAmount = async (amount: string) => {
    if (!fromToken || !toToken || !amount || parseFloat(amount) <= 0 || !provider) {
      setToAmount("");
      return;
    }
    
    try {
      const estimated = await getSwapEstimate(
        fromToken,
        toToken,
        amount,
        provider
      );
      setToAmount(estimated);
    } catch (error) {
      console.error("Error calculating swap amount:", error);
      setToAmount("");
    }
  };
  
  const swapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setFromAmount("");
    setToAmount("");
  };
  
  const executeSwapTransaction = async () => {
    if (!fromToken || !toToken || !fromAmount || parseFloat(fromAmount) <= 0 || !provider || !connected) {
      return { success: false, error: "Invalid swap parameters" };
    }
    
    setSwapping(true);
    setTxHash(undefined);
    
    try {
      const result = await executeSwap(
        fromToken,
        toToken,
        fromAmount,
        slippageTolerance,
        provider
      );
      
      if (result.success && result.txHash) {
        setTxHash(result.txHash);
        
        // Refresh balances after swap
        await refreshBalances();
        
        // Reset form
        setFromAmount("");
        setToAmount("");
        
        return { success: true, txHash: result.txHash };
      } else {
        throw new Error(result.error || "Swap failed");
      }
    } catch (error: any) {
      console.error("Swap execution error:", error);
      return { success: false, error: error.message };
    } finally {
      setSwapping(false);
    }
  };
  
  return {
    fromToken,
    toToken,
    fromAmount,
    toAmount,
    slippageTolerance,
    swapping,
    txHash,
    estimatedGas,
    setFromToken,
    setToToken,
    setFromAmount,
    setToAmount,
    setSlippageTolerance,
    calculateToAmount,
    swapTokens,
    executeSwap: executeSwapTransaction,
  };
};
