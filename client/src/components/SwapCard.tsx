import React, { useState } from "react";
import { 
  ArrowDownUp, 
  History, 
  Settings,
  TrendingUp,
  Database,
  Wallet,
  Repeat
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/hooks/useWallet";
import TokenSelector from "./TokenSelector";
import SettingsModal from "./SettingsModal";
import { useSwap } from "@/hooks/useSwap";
import TransactionStatus from "./TransactionStatus";
import { TokenInfo } from "@/types";
import { tokenList } from "@/lib/tokenList";

const SwapCard: React.FC = () => {
  const { toast } = useToast();
  const { connected, connect } = useWallet();
  const { 
    fromToken, 
    toToken, 
    fromAmount, 
    toAmount, 
    slippageTolerance,
    swapping,
    estimatedGas,
    setFromToken, 
    setToToken, 
    setFromAmount, 
    setSlippageTolerance,
    executeSwap,
    calculateToAmount,
    swapTokens
  } = useSwap();
  
  const [showSettings, setShowSettings] = useState(false);
  const [showFromTokenSelect, setShowFromTokenSelect] = useState(false);
  const [showToTokenSelect, setShowToTokenSelect] = useState(false);

  const handleSelectFromToken = (token: TokenInfo) => {
    if (token.symbol === toToken?.symbol) {
      // Swap the tokens if the same token is selected
      setToToken(fromToken);
    }
    setFromToken(token);
    setShowFromTokenSelect(false);
  };

  const handleSelectToToken = (token: TokenInfo) => {
    if (token.symbol === fromToken?.symbol) {
      // Swap the tokens if the same token is selected
      setFromToken(toToken);
    }
    setToToken(token);
    setShowToTokenSelect(false);
  };

  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || !isNaN(parseFloat(value))) {
      setFromAmount(value);
      calculateToAmount(value);
    }
  };

  const handleMaxClick = () => {
    if (fromToken?.balance) {
      setFromAmount(fromToken.balance.toString());
      calculateToAmount(fromToken.balance.toString());
    }
  };

  const handleSwapClick = async () => {
    if (!connected) {
      connect();
      return;
    }
    
    if (!fromToken || !toToken || !fromAmount || parseFloat(fromAmount) <= 0) {
      toast({
        title: "Invalid input",
        description: "Please check your input values",
        variant: "destructive",
      });
      return;
    }
    
    if (parseFloat(fromAmount) > (fromToken.balance || 0)) {
      toast({
        title: "Insufficient balance",
        description: `You don't have enough ${fromToken.symbol}`,
        variant: "destructive",
      });
      return;
    }
    
    try {
      await executeSwap();
      toast({
        title: "Swap successful",
        description: `Swapped ${fromAmount} ${fromToken.symbol} to ${toAmount} ${toToken.symbol}`,
      });
    } catch (error) {
      toast({
        title: "Swap failed",
        description: (error as Error).message || "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Card className="bg-dark-bg/60 border-primary/20 rounded-xl overflow-hidden shadow-lg backdrop-blur-sm">
        <CardHeader className="p-4 border-b border-primary/10 flex justify-between items-center bg-gradient-to-r from-primary/20 to-blue-500/10">
          <h2 className="text-lg font-semibold text-gray-100 flex items-center">
            <Repeat className="h-5 w-5 text-primary mr-2" />
            Swap
          </h2>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-300 hover:text-primary hover:bg-dark-bg/50 rounded-full"
              title="Transaction History"
            >
              <History className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-300 hover:text-primary hover:bg-dark-bg/50 rounded-full"
              onClick={() => setShowSettings(true)}
              title="Settings"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-5">
          {/* From Token Selection */}
          <div className="bg-dark-bg/80 rounded-xl p-4 mb-1 border border-primary/10 hover:border-primary/30 transition-colors">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400 font-medium">From</span>
              <span className="text-sm text-gray-400 flex items-center">
                <Wallet className="h-3 w-3 mr-1 text-primary" />
                Balance: {fromToken?.balance?.toFixed(6) || "0"} {fromToken?.symbol}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <Input
                type="text"
                value={fromAmount}
                onChange={handleFromAmountChange}
                className="w-full bg-transparent text-2xl font-medium focus:outline-none border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
                placeholder="0.0"
              />
              
              <TokenSelector 
                token={fromToken} 
                onClick={() => setShowFromTokenSelect(true)} 
              />
            </div>
            
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-400">
                ~${fromToken && fromAmount ? 
                  (parseFloat(fromAmount) * (fromToken.price || 0)).toFixed(2) : 
                  "0.00"}
              </span>
              <div className="flex space-x-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs bg-primary/10 hover:bg-primary/20 text-primary font-medium rounded-md h-6 px-2 transition-colors"
                  onClick={() => {
                    if (fromToken?.balance) {
                      setFromAmount((fromToken.balance * 0.25).toString());
                      calculateToAmount((fromToken.balance * 0.25).toString());
                    }
                  }}
                >
                  25%
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs bg-primary/10 hover:bg-primary/20 text-primary font-medium rounded-md h-6 px-2 transition-colors"
                  onClick={() => {
                    if (fromToken?.balance) {
                      setFromAmount((fromToken.balance * 0.5).toString());
                      calculateToAmount((fromToken.balance * 0.5).toString());
                    }
                  }}
                >
                  50%
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs bg-primary/10 hover:bg-primary/20 text-primary font-medium rounded-md h-6 px-2 transition-colors"
                  onClick={() => {
                    if (fromToken?.balance) {
                      setFromAmount((fromToken.balance * 0.75).toString());
                      calculateToAmount((fromToken.balance * 0.75).toString());
                    }
                  }}
                >
                  75%
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs bg-primary/10 hover:bg-primary/20 text-primary font-medium rounded-md h-6 px-2 transition-colors"
                  onClick={handleMaxClick}
                >
                  MAX
                </Button>
              </div>
            </div>
          </div>
          
          {/* Swap Direction Button */}
          <div className="flex justify-center -my-3 relative z-10">
            <Button 
              variant="outline" 
              size="icon" 
              className="w-10 h-10 rounded-full border-2 border-primary bg-dark-bg hover:bg-primary/10 shadow-lg"
              onClick={swapTokens}
            >
              <ArrowDownUp className="h-4 w-4 text-primary" />
            </Button>
          </div>
          
          {/* To Token Selection */}
          <div className="bg-dark-bg/80 rounded-xl p-4 mt-1 border border-primary/10 hover:border-primary/30 transition-colors">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400 font-medium">To (estimated)</span>
              <span className="text-sm text-gray-400 flex items-center">
                <Wallet className="h-3 w-3 mr-1 text-primary" />
                Balance: {toToken?.balance?.toFixed(6) || "0"} {toToken?.symbol}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <Input
                type="text"
                value={toAmount}
                readOnly
                className="w-full bg-transparent text-2xl font-medium focus:outline-none border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
                placeholder="0.0"
              />
              
              <TokenSelector 
                token={toToken} 
                onClick={() => setShowToTokenSelect(true)} 
              />
            </div>
            
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-400">
                ~${toToken && toAmount ? 
                  (parseFloat(toAmount) * (toToken.price || 0)).toFixed(2) : 
                  "0.00"}
              </span>
            </div>
          </div>
          
          {/* Swap Info */}
          <div className="mt-5 p-4 bg-dark-bg/60 rounded-xl text-sm border border-primary/10">
            {fromToken && toToken && fromAmount && parseFloat(fromAmount) > 0 && (
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-400 flex items-center">
                  <TrendingUp className="h-4 w-4 text-primary mr-1.5" />
                  Price
                </span>
                <div className="flex items-center bg-dark-bg/40 py-1 px-2 rounded-lg">
                  <span>
                    1 {fromToken.symbol} = {(toToken.price / fromToken.price).toFixed(6)} {toToken.symbol}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="ml-2 text-gray-400 hover:text-primary h-6 w-6 p-0"
                    onClick={swapTokens}
                  >
                    <ArrowDownUp className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}
            
            <div className="flex justify-between items-center py-2 border-t border-gray-700/50">
              <span className="text-gray-400 flex items-center">
                <Settings className="h-4 w-4 text-primary mr-1.5" />
                Slippage Tolerance
              </span>
              <span className="bg-primary/10 text-primary py-0.5 px-2 rounded-md font-medium">
                {slippageTolerance}%
              </span>
            </div>
            
            <div className="flex justify-between items-center pt-2 border-t border-gray-700/50">
              <span className="text-gray-400 flex items-center">
                <Database className="h-4 w-4 text-primary mr-1.5" />
                Estimated Gas Fee
              </span>
              <div className="text-right">
                <span className="font-medium">
                  ~{estimatedGas} BNB 
                </span>
                <div className="text-gray-500 text-xs">
                  (${(estimatedGas * (tokenList[0].price || 0)).toFixed(2)})
                </div>
              </div>
            </div>
          </div>
          
          {/* Swap Button */}
          <div className="mt-5">
            {!connected ? (
              <Button 
                className="w-full py-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base rounded-xl shadow-md shadow-primary/30"
                onClick={connect}
              >
                <Wallet className="mr-2 h-5 w-5" />
                Connect Wallet
              </Button>
            ) : fromToken && parseFloat(fromAmount) > (fromToken.balance || 0) ? (
              <Button 
                disabled 
                className="w-full py-6 bg-red-500/70 text-white font-semibold text-base rounded-xl"
              >
                Insufficient {fromToken.symbol} Balance
              </Button>
            ) : (
              <Button 
                className="w-full py-6 bg-gradient-to-r from-primary to-blue-500 hover:opacity-90 text-white font-semibold text-base rounded-xl shadow-md shadow-primary/30 transition-all duration-300"
                onClick={handleSwapClick}
                disabled={swapping || !fromAmount || parseFloat(fromAmount) <= 0}
              >
                {swapping ? (
                  <>
                    <span className="loader mr-2"></span>
                    Swapping...
                  </>
                ) : "Swap Now"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Modals */}
      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
        slippageTolerance={slippageTolerance}
        onSlippageChange={setSlippageTolerance}
      />
      
      <TokenSelector.Modal 
        isOpen={showFromTokenSelect} 
        onClose={() => setShowFromTokenSelect(false)} 
        onSelect={handleSelectFromToken}
        selectedToken={fromToken}
      />
      
      <TokenSelector.Modal 
        isOpen={showToTokenSelect} 
        onClose={() => setShowToTokenSelect(false)}
        onSelect={handleSelectToToken}
        selectedToken={toToken}
      />
      
      {/* Transaction Status */}
      <TransactionStatus visible={swapping} fromAmount={fromAmount} fromToken={fromToken} toAmount={toAmount} toToken={toToken} />
    </>
  );
};

export default SwapCard;
