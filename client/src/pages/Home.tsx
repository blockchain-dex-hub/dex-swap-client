import React, { useEffect, useState } from "react";
import { Link } from "wouter";
import SwapCard from "@/components/SwapCard";
import TransactionHistory from "@/components/TransactionHistory";
import { TokenInfo, Transaction } from "@/types";
import { useWallet } from "@/hooks/useWallet";
import { 
  ArrowRight, 
  TrendingUp, 
  Database, 
  ShieldCheck, 
  Globe, 
  Zap, 
  BarChart3, 
  Wallet,
  ChevronRight,
  ArrowUpRight,
  Check,
  CircleDollarSign,
  LucideIcon,
  Star,
  Repeat,
  Circle,
  Activity,
  Radar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { tokenList } from "@/lib/tokenList";
import { fetchTokenPrices } from "@/lib/binance";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  change?: string;
  isPositive?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, change, isPositive = true }) => {
  return (
    <Card className="bg-dark-bg/60 border-primary/20 backdrop-blur-sm overflow-hidden">
      <div className="bg-gradient-to-r from-primary/20 to-blue-500/10 px-4 py-3 border-b border-primary/10">
        <h3 className="text-sm font-medium text-gray-300 flex items-center">
          <Icon className="text-primary mr-2 h-4 w-4" />
          {title}
        </h3>
      </div>
      <CardContent className="p-4">
        <p className="text-2xl md:text-3xl font-bold">{value}</p>
        {change && (
          <p className={`text-xs mt-1 ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
            {isPositive ? '↑' : '↓'} {change} (24h)
          </p>
        )}
      </CardContent>
    </Card>
  );
};

const Home: React.FC = () => {
  const { connected, connect } = useWallet();
  const [tvl, setTvl] = useState("$1.23B");
  const [volume24h, setVolume24h] = useState("$152M");
  const [transactions24h, setTransactions24h] = useState("1.2M");
  const [topTokens, setTopTokens] = useState<TokenInfo[]>(tokenList.slice(0, 8));
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Auto connect wallet if previously connected
    const autoConnect = async () => {
      if (localStorage.getItem('walletConnected') === 'true') {
        try {
          await connect();
        } catch (error) {
          console.error("Auto connect failed:", error);
        }
      }
    };
    
    autoConnect();
    
    // Fetch token prices from Binance
    const fetchPrices = async () => {
      setIsLoading(true);
      try {
        const updatedTokens = await fetchTokenPrices();
        setTopTokens(updatedTokens.slice(0, 8));
      } catch (error) {
        console.error("Failed to fetch token prices:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPrices();
    
    // Refresh prices every 30 seconds
    const intervalId = setInterval(fetchPrices, 30000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [connect]);

  // Sample transaction history
  const transactions: Transaction[] = [
    {
      id: "tx1",
      fromAmount: "0.05",
      fromToken: "BNB",
      toAmount: "13.12",
      toToken: "BUSD",
      status: "completed",
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      timeAgo: "1 hour ago",
      hash: "0x123456789abcdef",
    },
    {
      id: "tx2",
      fromAmount: "50",
      fromToken: "BUSD",
      toAmount: "0.00025",
      toToken: "BTCB",
      status: "completed",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      timeAgo: "3 hours ago",
      hash: "0xabcdef123456789",
    },
    {
      id: "tx3",
      fromAmount: "0.1",
      fromToken: "BNB",
      toAmount: "0",
      toToken: "CAKE",
      status: "failed",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      timeAgo: "5 hours ago",
      hash: "0x987654321abcdef",
    },
  ];

  // Random price changes (would normally come from API)
  const getPriceChange = (symbol: string) => {
    const changes = {
      'BNB': 2.5,
      'BUSD': 0.1,
      'BTCB': 1.8,
      'ETH': 3.2,
      'CAKE': -1.5,
      'USDT': 0.05,
      'USDC': 0.02,
      'DOT': -2.3,
      'LINK': 4.7,
      'ADA': 1.2,
    };
    
    return changes[symbol as keyof typeof changes] || 0;
  };

  return (
    <div className="pb-20">
      {/* Hero Section with BG Gradient */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Background gradient elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary opacity-20 rounded-full blur-[120px] -z-10"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 opacity-20 rounded-full blur-[120px] -z-10"></div>
        
        {/* Hexagon background shape */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] -z-5 opacity-20">
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path fill="none" stroke="#0066FF" strokeWidth="0.5" d="M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z" />
          </svg>
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          {/* Hero Content */}
          <div className="text-center mb-16">
            <div className="mx-auto max-w-3xl mb-20">
              <h1 className="text-5xl md:text-7xl font-bold mb-3 text-gray-400/90">
                Next-Generation DEX Technology
              </h1>
              <p className="text-xl md:text-2xl text-gray-500/90">
                Trade with Confidence on BNW Chain
              </p>
            </div>
            
            <div className="relative bg-dark-bg/60 backdrop-blur-lg p-10 rounded-2xl border border-primary/20 mx-auto max-w-3xl mb-12">
              <div className="absolute inset-0 overflow-hidden rounded-2xl">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] opacity-20">
                  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <path fill="none" stroke="#0066FF" strokeWidth="1" d="M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z" />
                  </svg>
                </div>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-[0_0_8px_rgba(0,102,255,0.5)]">
                The Most Powerful DEX on BNW Chain
              </h2>
              <p className="text-lg md:text-xl text-gray-300 mb-8">
                Trade with Confidence on the Next-Generation Blockchain
              </p>
              
              {/* Buttons removed as requested */}
            </div>
            
            <div className="inline-block px-4 py-1 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
              Welcome to the Future of Decentralized Finance
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Link href="/swap">
                <Button size="lg" className="bg-gradient-to-r from-primary to-blue-500 hover:opacity-90 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-md shadow-primary/30">
                  <Repeat className="mr-2 h-5 w-5" />
                  Start Trading
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="bg-dark-bg/40 backdrop-blur-sm border-primary/30 text-primary hover:bg-primary/10 px-8 py-6 text-lg">
                <Wallet className="mr-2 h-5 w-5" />
                Connect Wallet
              </Button>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <StatCard 
                title="Total Value Locked" 
                value={tvl} 
                icon={Database}
                change="5.2%"
              />
              
              <StatCard 
                title="24h Trading Volume" 
                value={volume24h} 
                icon={BarChart3}
                change="8.7%"
              />
              
              <StatCard 
                title="Transactions (24h)" 
                value={transactions24h} 
                icon={Zap}
                change="12.3%"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Section */}
      <section className="py-20 px-4 bg-black/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-white drop-shadow-[0_0_8px_rgba(0,102,255,0.3)]">Featured on BNWSwap</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              The most trusted and secure decentralized exchange on Binance Smart Chain and BNW Chain
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {[
              { 
                name: 'Binance', 
                icon: <Circle className="text-[#F0B90B] h-7 w-7 fill-[#F0B90B]" />,
                bgColor: 'rgba(240, 185, 11, 0.1)',
                shadowColor: 'rgba(240, 185, 11, 0.3)'
              },
              { 
                name: 'CoinMarketCap', 
                icon: <BarChart3 className="text-[#3861FB] h-7 w-7" />,
                bgColor: 'rgba(56, 97, 251, 0.1)',
                shadowColor: 'rgba(56, 97, 251, 0.3)'
              },
              { 
                name: 'CoinGecko', 
                icon: <Activity className="text-[#8DC63F] h-7 w-7" />,
                bgColor: 'rgba(141, 198, 63, 0.1)',
                shadowColor: 'rgba(141, 198, 63, 0.3)'
              },
              { 
                name: 'DappRadar', 
                icon: <Radar className="text-[#02B1A5] h-7 w-7" />,
                bgColor: 'rgba(2, 177, 165, 0.1)',
                shadowColor: 'rgba(2, 177, 165, 0.3)'
              }
            ].map((partner) => (
              <div key={partner.name} className="flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-xl p-8 border border-primary/20 transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_15px_rgba(0,102,255,0.2)]">
                <div className="text-center">
                  <div 
                    className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" 
                    style={{ 
                      backgroundColor: partner.bgColor,
                      boxShadow: `0 0 10px ${partner.shadowColor}`
                    }}
                  >
                    {partner.icon}
                  </div>
                  <div className="font-medium text-white text-lg">{partner.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Swap Card & Market Overview Section */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Swap Card */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="sticky top-24">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">Swap Tokens</h2>
                  <p className="text-gray-400">Trade tokens instantly with the best rates</p>
                </div>
                <SwapCard />
              </div>
            </div>
            
            {/* Market Overview */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Market Overview</h2>
                  <Link href="/markets">
                    <Button variant="ghost" className="text-primary flex items-center">
                      View all markets <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                
                <Tabs defaultValue="top" className="mb-10">
                  <TabsList className="bg-dark-bg/60 border border-primary/20">
                    <TabsTrigger value="top">Top Tokens</TabsTrigger>
                    <TabsTrigger value="gainers">Top Gainers</TabsTrigger>
                    <TabsTrigger value="trending">Trending</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="top" className="mt-4">
                    <Card className="bg-dark-bg/60 border-primary/20 backdrop-blur-sm overflow-hidden shadow-lg">
                      <div className="bg-gradient-to-r from-primary/20 to-blue-500/10 px-4 py-3 border-b border-primary/10">
                        <h3 className="font-medium text-gray-300 flex items-center">
                          <CircleDollarSign className="text-primary mr-2 h-4 w-4" />
                          Live Token Prices from Binance
                        </h3>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="border-b border-gray-800">
                              <th className="py-3 px-4">#</th>
                              <th className="py-3 px-4">Token</th>
                              <th className="py-3 px-4">Price</th>
                              <th className="py-3 px-4">24h Change</th>
                              <th className="py-3 px-4">Market Cap</th>
                              <th className="py-3 px-4"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {isLoading ? (
                              <tr>
                                <td colSpan={6} className="py-8 text-center text-gray-400">
                                  Loading latest prices...
                                </td>
                              </tr>
                            ) : (
                              topTokens.map((token, index) => {
                                const priceChange = getPriceChange(token.symbol);
                                const isPositive = priceChange >= 0;
                                
                                return (
                                  <tr key={token.symbol} className="border-b border-gray-800/50 hover:bg-dark-bg/30">
                                    <td className="py-4 px-4">{index + 1}</td>
                                    <td className="py-4 px-4">
                                      <div className="flex items-center">
                                        <div 
                                          className="w-8 h-8 rounded-full mr-3 flex items-center justify-center" 
                                          style={{ backgroundColor: token.color }}
                                        >
                                          <span className="text-white text-xs font-bold">
                                            {token.symbol.substring(0, 1)}
                                          </span>
                                        </div>
                                        <div>
                                          <div className="font-medium">{token.name}</div>
                                          <div className="text-sm text-gray-400">{token.symbol}</div>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="py-4 px-4 font-medium">
                                      ${token.price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </td>
                                    <td className="py-4 px-4">
                                      <span className={`${isPositive ? 'text-emerald-500' : 'text-red-500'} flex items-center`}>
                                        {isPositive ? '↑' : '↓'} {Math.abs(priceChange).toFixed(2)}%
                                      </span>
                                    </td>
                                    <td className="py-4 px-4">
                                      ${(token.price ? token.price * 100_000_000 : 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                    </td>
                                    <td className="py-4 px-4">
                                      <Link href="/swap">
                                        <Button size="sm" className="bg-primary/10 hover:bg-primary/30 text-primary rounded-lg">
                                          Trade
                                        </Button>
                                      </Link>
                                    </td>
                                  </tr>
                                );
                              })
                            )}
                          </tbody>
                        </table>
                      </div>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="gainers" className="mt-4">
                    <Card className="bg-dark-bg/60 border-primary/20 backdrop-blur-sm p-8 text-center">
                      <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                      <h3 className="text-xl font-bold mb-2">Top Gainers</h3>
                      <p className="text-gray-400">
                        Coming soon! Track the best performing tokens in real-time.
                      </p>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="trending" className="mt-4">
                    <Card className="bg-dark-bg/60 border-primary/20 backdrop-blur-sm p-8 text-center">
                      <BarChart3 className="h-12 w-12 text-primary mx-auto mb-4" />
                      <h3 className="text-xl font-bold mb-2">Trending Tokens</h3>
                      <p className="text-gray-400">
                        Coming soon! Discover the most trending tokens on BNWSwap.
                      </p>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Why Choose Us Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-black/80 to-primary/5 backdrop-blur-md">
        <div className="max-w-6xl mx-auto relative">
          {/* Background decoration elements */}
          <div className="absolute top-10 left-0 w-80 h-80 bg-primary/5 rounded-full blur-[100px] -z-10"></div>
          <div className="absolute bottom-10 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-[100px] -z-10"></div>
          
          <div className="text-center mb-20">
            <div className="inline-block px-5 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6 border border-primary/20 shadow-lg shadow-primary/10">
              ADVANTAGES OF BNWSWAP
            </div>
            <h2 className="text-4xl font-bold mb-6 text-white drop-shadow-[0_0_8px_rgba(0,102,255,0.3)]">
              Why Choose BNWSwap?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Designed with users in mind, BNWSwap offers the best decentralized trading experience on Binance Smart Chain and BNW Chain
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-dark-bg/30 border border-primary/20 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl transition-all duration-300 hover:translate-y-[-8px] hover:shadow-[0_10px_30px_rgba(0,102,255,0.2)]">
              <div className="h-2 bg-gradient-to-r from-primary to-blue-500"></div>
              <div className="p-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-blue-500/10 flex items-center justify-center mb-6 shadow-lg shadow-primary/10">
                  <ShieldCheck className="text-primary h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Secure & Reliable</h3>
                <ul className="space-y-4 text-gray-300">
                  <li className="flex items-start">
                    <div className="p-1 rounded-full bg-primary/10 mr-3 flex-shrink-0 mt-0.5">
                      <Check className="text-primary h-4 w-4" />
                    </div>
                    <span className="text-lg">Audited smart contracts</span>
                  </li>
                  <li className="flex items-start">
                    <div className="p-1 rounded-full bg-primary/10 mr-3 flex-shrink-0 mt-0.5">
                      <Check className="text-primary h-4 w-4" />
                    </div>
                    <span className="text-lg">Non-custodial trading</span>
                  </li>
                  <li className="flex items-start">
                    <div className="p-1 rounded-full bg-primary/10 mr-3 flex-shrink-0 mt-0.5">
                      <Check className="text-primary h-4 w-4" />
                    </div>
                    <span className="text-lg">Your keys, your crypto</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="bg-dark-bg/30 border border-primary/20 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl transition-all duration-300 hover:translate-y-[-8px] hover:shadow-[0_10px_30px_rgba(0,102,255,0.2)]">
              <div className="h-2 bg-gradient-to-r from-primary to-blue-500"></div>
              <div className="p-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-blue-500/10 flex items-center justify-center mb-6 shadow-lg shadow-primary/10">
                  <TrendingUp className="text-primary h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Low Fees</h3>
                <ul className="space-y-4 text-gray-300">
                  <li className="flex items-start">
                    <div className="p-1 rounded-full bg-primary/10 mr-3 flex-shrink-0 mt-0.5">
                      <Check className="text-primary h-4 w-4" />
                    </div>
                    <span className="text-lg">0.25% swap fee</span>
                  </li>
                  <li className="flex items-start">
                    <div className="p-1 rounded-full bg-primary/10 mr-3 flex-shrink-0 mt-0.5">
                      <Check className="text-primary h-4 w-4" />
                    </div>
                    <span className="text-lg">Optimized for low gas costs</span>
                  </li>
                  <li className="flex items-start">
                    <div className="p-1 rounded-full bg-primary/10 mr-3 flex-shrink-0 mt-0.5">
                      <Check className="text-primary h-4 w-4" />
                    </div>
                    <span className="text-lg">More savings on every swap</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="bg-dark-bg/30 border border-primary/20 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl transition-all duration-300 hover:translate-y-[-8px] hover:shadow-[0_10px_30px_rgba(0,102,255,0.2)]">
              <div className="h-2 bg-gradient-to-r from-primary to-blue-500"></div>
              <div className="p-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-blue-500/10 flex items-center justify-center mb-6 shadow-lg shadow-primary/10">
                  <Globe className="text-primary h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Global Community</h3>
                <ul className="space-y-4 text-gray-300">
                  <li className="flex items-start">
                    <div className="p-1 rounded-full bg-primary/10 mr-3 flex-shrink-0 mt-0.5">
                      <Check className="text-primary h-4 w-4" />
                    </div>
                    <span className="text-lg">Active in 150+ countries</span>
                  </li>
                  <li className="flex items-start">
                    <div className="p-1 rounded-full bg-primary/10 mr-3 flex-shrink-0 mt-0.5">
                      <Check className="text-primary h-4 w-4" />
                    </div>
                    <span className="text-lg">Multi-language support</span>
                  </li>
                  <li className="flex items-start">
                    <div className="p-1 rounded-full bg-primary/10 mr-3 flex-shrink-0 mt-0.5">
                      <Check className="text-primary h-4 w-4" />
                    </div>
                    <span className="text-lg">24/7 community support</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with Opacity Backgrounds */}
      <section className="py-24 relative overflow-hidden">
        {/* Background gradients */}
        <div className="absolute top-20 -left-20 w-96 h-96 bg-blue-600/20 rounded-full filter blur-[120px] z-0"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/20 rounded-full filter blur-[120px] z-0"></div>
        
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-400 text-transparent bg-clip-text">
              Why Choose BNWSwap?
            </h2>
            <p className="text-gray-300 max-w-3xl mx-auto text-lg">
              Experience the next generation of decentralized trading with features designed for both beginners and advanced traders
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-blue-600/20 rounded-xl opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="backdrop-blur-md bg-dark-bg/40 p-8 rounded-xl border border-white/10 shadow-xl relative z-10 h-full">
                <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mb-6">
                  <Globe size={28} className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white group-hover:text-primary transition-colors">Cross-Chain Swapping</h3>
                <p className="text-gray-300">
                  Seamlessly swap tokens across Binance Smart Chain and BNW Chain with minimal fees and maximum security.
                </p>
              </div>
            </div>
            
            {/* Feature Card 2 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-purple-600/20 rounded-xl opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="backdrop-blur-md bg-dark-bg/40 p-8 rounded-xl border border-white/10 shadow-xl relative z-10 h-full">
                <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mb-6">
                  <ShieldCheck size={28} className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white group-hover:text-primary transition-colors">Security First</h3>
                <p className="text-gray-300">
                  Your security is our priority with audited smart contracts, non-custodial trading, and advanced security measures.
                </p>
              </div>
            </div>
            
            {/* Feature Card 3 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 to-primary/20 rounded-xl opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="backdrop-blur-md bg-dark-bg/40 p-8 rounded-xl border border-white/10 shadow-xl relative z-10 h-full">
                <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mb-6">
                  <Zap size={28} className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white group-hover:text-primary transition-colors">Lightning Fast Swaps</h3>
                <p className="text-gray-300">
                  Execute trades in seconds with our optimized smart contracts and efficient routing algorithms.
                </p>
              </div>
            </div>
            
            {/* Feature Card 4 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-green-600/20 rounded-xl opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="backdrop-blur-md bg-dark-bg/40 p-8 rounded-xl border border-white/10 shadow-xl relative z-10 h-full">
                <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mb-6">
                  <BarChart3 size={28} className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white group-hover:text-primary transition-colors">Advanced Analytics</h3>
                <p className="text-gray-300">
                  Track your portfolio, monitor market trends, and gain insights with our comprehensive analytics tools.
                </p>
              </div>
            </div>
            
            {/* Feature Card 5 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-green-600/30 to-yellow-600/20 rounded-xl opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="backdrop-blur-md bg-dark-bg/40 p-8 rounded-xl border border-white/10 shadow-xl relative z-10 h-full">
                <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mb-6">
                  <Wallet size={28} className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white group-hover:text-primary transition-colors">Multi-Wallet Support</h3>
                <p className="text-gray-300">
                  Connect seamlessly with MetaMask, Trust Wallet, and other popular wallets for a smooth trading experience.
                </p>
              </div>
            </div>
            
            {/* Feature Card 6 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/30 to-orange-600/20 rounded-xl opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="backdrop-blur-md bg-dark-bg/40 p-8 rounded-xl border border-white/10 shadow-xl relative z-10 h-full">
                <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mb-6">
                  <Database size={28} className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white group-hover:text-primary transition-colors">Deep Liquidity</h3>
                <p className="text-gray-300">
                  Access deep liquidity pools ensuring minimal slippage and optimal execution for trades of any size.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Trading?</h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Connect your wallet now and experience the future of decentralized trading
          </p>
          
          <Link href="/swap">
            <Button size="lg" className="bg-gradient-to-r from-primary to-blue-500 hover:opacity-90 text-white px-10 py-6 text-lg font-semibold rounded-xl shadow-md shadow-primary/30">
              Launch Exchange <ArrowUpRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Recent Transactions */}
      <section className="py-16 px-4 bg-dark-bg/30 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Recent Transactions</h2>
            <Button variant="ghost" className="text-primary">
              View all <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          <TransactionHistory transactions={transactions} />
        </div>
      </section>
    </div>
  );
};

export default Home;
