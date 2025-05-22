import React, { createContext, useState, useContext, ReactNode } from 'react';
import { toast } from '@/hooks/use-toast';
import { bscNetworkParams, bnwNetworkParams } from '@/lib/web3';

// Define the possible chain types
export type ChainType = 'BSC' | 'BNW';

// Define the context interface
interface ChainContextType {
  selectedChain: ChainType;
  setSelectedChain: (chain: ChainType) => void;
}

// Create context with default values
const ChainContext = createContext<ChainContextType>({
  selectedChain: 'BSC',
  setSelectedChain: () => {},
});

// Chain details for UI display
const chainDetails = {
  BSC: {
    name: "BSC Chain",
    icon: "🟡",
    subtitle: "BNB Smart Chain Network",
    networkParams: bscNetworkParams
  },
  BNW: {
    name: "BNW Chain",
    icon: "🔷",
    subtitle: "Next-generation blockchain for BNWSwap",
    networkParams: bnwNetworkParams
  }
};

// Provider component
export const ChainProvider = ({ children }: { children: ReactNode }) => {
  const [selectedChain, setSelectedChain] = useState<ChainType>('BSC');

  // Handle chain selection
  const handleChainSelect = (chain: ChainType) => {
    if (chain !== selectedChain) {
      setSelectedChain(chain);
      
      // Show a toast notification when chain is changed
      toast({
        title: `Network Changed`,
        description: (
          <div className="flex items-start">
            <span className="mr-2 text-lg">{chainDetails[chain].icon}</span>
            <div>
              <p className="font-medium">{`You are now on ${chainDetails[chain].name}`}</p>
              <p className="text-sm text-gray-400">{chainDetails[chain].subtitle}</p>
            </div>
          </div>
        ),
        duration: 3000
      });
      
      // Here you would also handle any additional logic when changing chains
      // Such as updating the web3 provider, connector, etc.
      console.log(`Switched to ${chain} chain`);
    }
  };

  const value = {
    selectedChain,
    setSelectedChain: handleChainSelect,
  };

  return <ChainContext.Provider value={value}>{children}</ChainContext.Provider>;
};

// Custom hook to use the chain context
export const useChainSelector = () => useContext(ChainContext);