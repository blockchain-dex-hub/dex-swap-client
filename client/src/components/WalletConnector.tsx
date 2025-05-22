import React, { useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { useChainSelector } from "@/hooks/useChainSelector";
import { bscNetworkParams, bnwNetworkParams } from "@/lib/web3";
import { Button } from "@/components/ui/button";
import { Wallet, Copy, Loader2, LogOut } from "lucide-react";
import { truncateAddress } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const WalletConnector: React.FC = () => {
  const { address, balance, connecting, connected, connect, disconnect } = useWallet();
  const { selectedChain } = useChainSelector();
  const { toast } = useToast();

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast({
        title: "Address copied",
        description: "Wallet address copied to clipboard",
        duration: 3000,
      });
    }
  };

  return (
    <>
      {/* Not connected state */}
      {!connected && !connecting && (
        <Button
          onClick={connect}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
        >
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </Button>
      )}

      {/* Connecting state */}
      {connecting && (
        <Button
          disabled
          className="bg-primary/70 text-primary-foreground font-medium cursor-not-allowed"
        >
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </Button>
      )}

      {/* Connected state */}
      {connected && address && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-card hover:bg-hover-bg border-neutral-400">
              <span className="inline-block w-2 h-2 rounded-full bg-positive mr-2"></span>
              <span className="hidden sm:inline text-neutral-200 mr-2">
                {truncateAddress(address)}
              </span>
              <span className="text-primary">
                {balance?.toFixed(3)} {selectedChain === 'BNW' ? bnwNetworkParams.nativeCurrency.symbol : bscNetworkParams.nativeCurrency.symbol}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-72 bg-card border-neutral-400">
            <div className="p-4 border-b border-neutral-400">
              <DropdownMenuLabel className="mb-2 px-0">Wallet</DropdownMenuLabel>
              <div className="flex items-center px-3 py-2 bg-dark-bg rounded-lg">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <Wallet className="text-primary h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center">
                    <p className="font-medium">{truncateAddress(address)}</p>
                    <button
                      onClick={handleCopyAddress}
                      className="ml-2 text-neutral-300 hover:text-primary"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="text-sm text-neutral-300">MetaMask</span>
                </div>
              </div>
            </div>

            <div className="p-4">
              <DropdownMenuLabel className="px-0 mb-3">Assets</DropdownMenuLabel>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="token-icon bg-primary mr-2">
                      <span className="text-primary-foreground">BNB</span>
                    </div>
                    <span>BNB</span>
                  </div>
                  <span>{balance?.toFixed(3) || "0"}</span>
                </div>

                {/* Additional token balances would be displayed here */}
              </div>

              <DropdownMenuSeparator className="my-4 bg-neutral-400" />

              <Button
                variant="outline"
                className="w-full bg-hover-bg hover:bg-muted border-none"
                onClick={disconnect}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Disconnect
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
};

export default WalletConnector;