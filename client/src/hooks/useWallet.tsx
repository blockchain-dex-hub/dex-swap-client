import { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  ReactNode 
} from "react";
import { ethers } from "ethers";
import { connectToMetaMask, getTokenBalances, isMetaMaskInstalled, getMetaMaskDownloadUrl } from "@/lib/web3";
import { tokenList } from "@/lib/tokenList";
import { TokenInfo } from "@/types";
import { toast } from "@/hooks/use-toast";

interface WalletContextProps {
  address: string | null;
  balance: number | null;
  connected: boolean;
  connecting: boolean;
  error: string | null;
  tokens: TokenInfo[];
  connect: () => Promise<void>;
  disconnect: () => void;
  refreshBalances: () => Promise<void>;
  provider: ethers.BrowserProvider | null;
}

const WalletContext = createContext<WalletContextProps>({
  address: null,
  balance: null,
  connected: false,
  connecting: false,
  error: null,
  tokens: [],
  connect: async () => {},
  disconnect: () => {},
  refreshBalances: async () => {},
  provider: null,
});

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokens, setTokens] = useState<TokenInfo[]>(tokenList);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);

  const connect = async () => {
    setConnecting(true);
    setError(null);

    try {
      // Check if MetaMask is installed
      if (!isMetaMaskInstalled()) {
        const downloadUrl = getMetaMaskDownloadUrl();

        // Show toast alert with link to download MetaMask
        toast({
          title: "MetaMask Not Installed",
          description: (
            <div className="flex flex-col gap-2">
              <p>Please install the MetaMask browser extension to connect your wallet.</p>
              <a 
                href={downloadUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline inline-flex items-center"
              >
                Click here to install MetaMask
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 h-4 w-4">
                  <path d="M7 7h10v10"></path>
                  <path d="M7 17 17 7"></path>
                </svg>
              </a>
            </div>
          ),
          variant: "destructive",
          duration: 10000 // Show for 10 seconds
        });

        throw new Error("WALLET_NOT_INSTALLED");
      }

      const web3Provider = await connectToMetaMask();

      if (!web3Provider) {
        throw new Error("Failed to connect to MetaMask");
      }

      const accounts = await web3Provider.listAccounts();

      if (accounts.length === 0) {
        throw new Error("No accounts found");
      }

      const account = accounts[0];
      const accountAddress = account.address;
      const bnbBalance = await web3Provider.getBalance(accountAddress);
      const formattedBalance = parseFloat(ethers.formatEther(bnbBalance));

      setAddress(accountAddress);
      setBalance(formattedBalance);
      setConnected(true);
      setProvider(web3Provider);

      // Store connection state
      localStorage.setItem('walletConnected', 'true');

      // Get all token balances
      const updatedTokens = await getTokenBalances(accountAddress, web3Provider);
      setTokens(updatedTokens);

      // Setup event listeners
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
      window.ethereum.on("disconnect", handleDisconnect);

      // Show success toast
      toast({
        title: "Wallet Connected",
        description: `Connected to wallet ${accountAddress.substring(0, 6)}...${accountAddress.substring(accountAddress.length - 4)}`,
        duration: 3000
      });
    } catch (err: any) {
      console.error("Wallet connection error:", err);
      setError(err.message || "Failed to connect wallet");

      // Don't show error toast for wallet not installed (already shown) or user rejection
      if (err.message !== "WALLET_NOT_INSTALLED" && err.message !== "WALLET_REJECTED") {
        toast({
          title: "Connection Failed",
          description: "Failed to connect to your wallet. Please try again.",
          variant: "destructive",
          duration: 5000
        });
      }
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = () => {
    setAddress(null);
    setBalance(null);
    setConnected(false);
    setProvider(null);
    localStorage.removeItem('walletConnected');

    // Remove event listeners
    if (window.ethereum) {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
      window.ethereum.removeListener("disconnect", handleDisconnect);
    }
  };

  const refreshBalances = async () => {
    if (!connected || !address || !provider) return;

    try {
      // Get BNB balance
      const bnbBalance = await provider.getBalance(address);
      const formattedBalance = parseFloat(ethers.formatEther(bnbBalance));
      setBalance(formattedBalance);

      // Get all token balances
      const updatedTokens = await getTokenBalances(address, provider);
      setTokens(updatedTokens);
    } catch (err) {
      console.error("Error refreshing balances:", err);
    }
  };

  const handleAccountsChanged = async (accounts: string[]) => {
    if (accounts.length === 0) {
      // User disconnected their wallet
      disconnect();
    } else if (accounts[0] !== address) {
      // User switched accounts
      setAddress(accounts[0]);
      await refreshBalances();
    }
  };

  const handleChainChanged = () => {
    // Reload the page when the chain changes
    window.location.reload();
  };

  const handleDisconnect = () => {
    disconnect();
  };

  // Effect to periodically refresh balances
  useEffect(() => {
    if (connected) {
      const interval = setInterval(refreshBalances, 30000); // Every 30 seconds
      return () => clearInterval(interval);
    }
  }, [connected, address, provider]);

  const contextValue: WalletContextProps = {
    address,
    balance,
    connected,
    connecting,
    error,
    tokens,
    connect,
    disconnect,
    refreshBalances,
    provider
  };

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);