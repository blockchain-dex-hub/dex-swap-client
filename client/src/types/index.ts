// Token information
export interface TokenInfo {
  name: string;
  symbol: string;
  address: string;
  decimals: number;
  color: string;
  textColor?: string;
  logo: string;
  price?: number;
  balance?: number;
}

// Transaction status and information
export interface Transaction {
  id: string;
  fromAmount: string;
  fromToken: string;
  toAmount: string;
  toToken: string;
  status: 'completed' | 'pending' | 'failed';
  timestamp: Date;
  timeAgo: string;
  hash: string;
}

// Extend Window interface to include ethereum
declare global {
  interface Window {
    ethereum: any;
  }
}
