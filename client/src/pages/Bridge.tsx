import React, { useState, useEffect } from "react";
import { useWallet } from "@/hooks/useWallet";
import { tokenList } from "@/lib/tokenList";
import { useChainSelector, ChainType } from "@/hooks/useChainSelector";
import { useToast } from "@/hooks/use-toast";
import { TokenInfo } from "@/types";
import { 
  ArrowDown,
  ExternalLink,
  HelpCircle,
  Wallet,
  ArrowLeftRight,
  ChevronDown,
  Repeat,
  ArrowRight,
  Settings,
  Info,
  ChevronRight,
  ShieldCheck,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Sparkles,
  MessageCircle,
  Twitter,
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface HistoryItem {
  id: string;
  token: string;
  amount: string;
  fromChain: string;
  toChain: string;
  status: 'pending' | 'completed' | 'failed';
  txHash: string;
  time: string;
}

const Bridge: React.FC = () => {
  const { toast } = useToast();
  const { connected, connect, address } = useWallet();
  const { selectedChain, setSelectedChain } = useChainSelector();
  
  // States for bridge form
  const [fromChain, setFromChain] = useState<ChainType>(selectedChain);
  const [toChain, setToChain] = useState<ChainType>(selectedChain === 'BSC' ? 'BNW' : 'BSC');
  const [token, setToken] = useState<TokenInfo | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [showTokenSelect, setShowTokenSelect] = useState(false);
  const [filteredTokens, setFilteredTokens] = useState<TokenInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'bridge' | 'history'>('bridge');
  const [bridgeFee, setBridgeFee] = useState<string>('0.001');
  const [estimatedGas, setEstimatedGas] = useState<string>('0.0025');
  
  // History data (mock data for UI)
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      id: '1',
      token: 'BNB',
      amount: '0.5',
      fromChain: 'BSC',
      toChain: 'BNW',
      status: 'completed',
      txHash: '0x1234...5678',
      time: '2h ago',
    },
    {
      id: '2',
      token: 'BTCB',
      amount: '0.01',
      fromChain: 'BNW',
      toChain: 'BSC',
      status: 'pending',
      txHash: '0xabcd...efgh',
      time: '5h ago',
    }
  ]);

  useEffect(() => {
    // Set available tokens based on selected chain
    setFilteredTokens(tokenList.filter(t => 
      (fromChain === 'BSC' && ['BNB', 'BUSD', 'BTCB', 'ETH', 'CAKE'].includes(t.symbol)) ||
      (fromChain === 'BNW' && ['BNB', 'BUSD', 'BTCB', 'ETH'].includes(t.symbol))
    ));
    
    // Pre-select first token
    if (!token && tokenList.length > 0) {
      setToken(tokenList.find(t => t.symbol === 'BNB') || tokenList[0]);
    }
  }, [fromChain, token]);

  const handleFromChainChange = (chain: ChainType) => {
    if (chain === toChain) {
      // Swap chains if same
      setToChain(fromChain);
    }
    setFromChain(chain);
  };

  const handleToChainChange = (chain: ChainType) => {
    if (chain === fromChain) {
      // Swap chains if same
      setFromChain(toChain);
    }
    setToChain(chain);
  };

  const handleSwapChains = () => {
    const temp = fromChain;
    setFromChain(toChain);
    setToChain(temp);
  };

  const handleTokenSelect = (selectedToken: TokenInfo) => {
    setToken(selectedToken);
    setShowTokenSelect(false);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || (!isNaN(parseFloat(value)) && /^\d*\.?\d*$/.test(value))) {
      setAmount(value);
    }
  };

  const handleMaxClick = () => {
    if (token?.balance) {
      setAmount(token.balance.toString());
    }
  };

  const handleBridgeClick = async () => {
    if (!connected) {
      connect();
      return;
    }
    
    if (!token || !amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid input",
        description: "Please check your input values",
        variant: "destructive",
      });
      return;
    }
    
    if (parseFloat(amount) > (token.balance || 0)) {
      toast({
        title: "Insufficient balance",
        description: `You don't have enough ${token.symbol}`,
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // Simulate bridge transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add to history
      const newTx: HistoryItem = {
        id: Date.now().toString(),
        token: token.symbol,
        amount,
        fromChain,
        toChain,
        status: 'pending',
        txHash: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
        time: 'just now',
      };
      
      setHistory(prev => [newTx, ...prev]);
      
      toast({
        title: "Bridge initiated",
        description: `Bridging ${amount} ${token.symbol} from ${fromChain} to ${toChain}`,
      });
      
      // Switch to history tab
      setActiveTab('history');
    } catch (error) {
      toast({
        title: "Bridge failed",
        description: (error as Error).message || "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-500';
      case 'pending':
        return 'text-yellow-500';
      case 'failed':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      {/* Hero section with gradient background */}
      <div className="relative mb-12 py-10 px-4 rounded-2xl overflow-hidden">
        {/* Background gradients */}
        <div className="absolute top-0 left-10 w-72 h-72 bg-primary opacity-20 rounded-full blur-[100px] -z-10"></div>
        <div className="absolute bottom-0 right-10 w-72 h-72 bg-blue-500 opacity-20 rounded-full blur-[100px] -z-10"></div>
        
        <div className="text-center relative z-10">
          <div className="inline-flex items-center justify-center bg-primary/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6 border border-primary/20">
            <Sparkles size={16} className="text-primary mr-2" />
            <span className="text-sm font-medium text-primary">Fast & Secure Cross-Chain Transfers</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-blue-400 to-primary text-transparent bg-clip-text">
            Cross-Chain Bridge
          </h1>
          
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-4">
            Bridge your tokens across Binance Smart Chain and BNW Chain securely with low fees
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            <div className="flex items-center bg-dark-bg/40 backdrop-blur-sm rounded-lg px-4 py-2 border border-primary/10">
              <CheckCircle size={18} className="text-primary mr-2" />
              <span>2-5 min transfer time</span>
            </div>
            <div className="flex items-center bg-dark-bg/40 backdrop-blur-sm rounded-lg px-4 py-2 border border-primary/10">
              <ShieldCheck size={18} className="text-primary mr-2" />
              <span>Secure protocol</span>
            </div>
            <div className="flex items-center bg-dark-bg/40 backdrop-blur-sm rounded-lg px-4 py-2 border border-primary/10">
              <Wallet size={18} className="text-primary mr-2" />
              <span>Low transaction fees</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Bridge Card */}
        <div className="lg:col-span-2">
          <div className="bg-dark-bg/60 shadow-lg rounded-xl overflow-hidden backdrop-blur-sm border border-primary/10">
            {/* Tabs */}
            <div className="flex border-b border-gray-800">
              <button
                className={`px-6 py-5 text-sm font-medium transition-colors ${
                  activeTab === 'bridge'
                    ? 'text-primary border-b-2 border-primary bg-primary/5'
                    : 'text-gray-400 hover:text-gray-300 hover:bg-dark-bg/70'
                }`}
                onClick={() => setActiveTab('bridge')}
              >
                <span className="flex items-center">
                  <ArrowLeftRight size={18} className="mr-2" />
                  Bridge
                </span>
              </button>
              <button
                className={`px-6 py-5 text-sm font-medium transition-colors ${
                  activeTab === 'history'
                    ? 'text-primary border-b-2 border-primary bg-primary/5'
                    : 'text-gray-400 hover:text-gray-300 hover:bg-dark-bg/70'
                }`}
                onClick={() => setActiveTab('history')}
              >
                <span className="flex items-center">
                  <Repeat size={18} className="mr-2" />
                  History
                </span>
              </button>
            </div>
            
            {activeTab === 'bridge' ? (
              <div className="p-6">
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      From
                    </label>
                    {connected && token && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                        <Wallet size={12} className="mr-1" />
                        Balance: {token.balance?.toFixed(6) || "0"} {token.symbol}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-4 mb-3">
                    <div className="flex-1">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="outline" 
                            className="w-full justify-between border border-primary/20 hover:border-primary/40 bg-dark-bg/40 backdrop-blur-sm hover:bg-dark-bg/60 transition-all h-12 pl-3 pr-4"
                          >
                            <div className="flex items-center">
                              {fromChain === 'BSC' ? (
                                <div 
                                  className="w-7 h-7 rounded-full flex items-center justify-center mr-3 shadow-md relative overflow-hidden" 
                                  style={{ background: "linear-gradient(135deg, #F0B90B, #F0B90BDD)" }}
                                >
                                  <div className="absolute inset-0 bg-white/10 opacity-50"></div>
                                  <span className="text-white text-xs font-bold relative">B</span>
                                </div>
                              ) : (
                                <div 
                                  className="w-7 h-7 rounded-full flex items-center justify-center mr-3 shadow-md relative overflow-hidden" 
                                  style={{ background: "linear-gradient(135deg, #0066FF, #0066FFDD)" }}
                                >
                                  <div className="absolute inset-0 bg-white/10 opacity-50"></div>
                                  <span className="text-white text-xs font-bold relative">B</span>
                                </div>
                              )}
                              <span className="font-medium">{fromChain} Chain</span>
                            </div>
                            <ChevronDown size={16} className="text-primary" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-full bg-dark-bg/95 backdrop-blur-sm border border-primary/20 p-1">
                          <DropdownMenuItem 
                            onClick={() => handleFromChainChange('BSC')}
                            className="rounded-lg hover:bg-dark-bg/60 focus:bg-dark-bg/60 py-2"
                          >
                            <div 
                              className="w-7 h-7 rounded-full flex items-center justify-center mr-3 shadow-md relative overflow-hidden" 
                              style={{ background: "linear-gradient(135deg, #F0B90B, #F0B90BDD)" }}
                            >
                              <div className="absolute inset-0 bg-white/10 opacity-50"></div>
                              <span className="text-white text-xs font-bold relative">B</span>
                            </div>
                            <span className="font-medium">BSC Chain</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleFromChainChange('BNW')}
                            className="rounded-lg hover:bg-dark-bg/60 focus:bg-dark-bg/60 py-2"
                          >
                            <div 
                              className="w-7 h-7 rounded-full flex items-center justify-center mr-3 shadow-md relative overflow-hidden" 
                              style={{ background: "linear-gradient(135deg, #0066FF, #0066FFDD)" }}
                            >
                              <div className="absolute inset-0 bg-white/10 opacity-50"></div>
                              <span className="text-white text-xs font-bold relative">B</span>
                            </div>
                            <span className="font-medium">BNW Chain</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  
                  <div className="bg-dark-bg/40 backdrop-blur-sm rounded-xl p-5 border border-primary/10 hover:border-primary/20 transition-all shadow-inner">
                    <div className="flex justify-between">
                      <Input
                        type="text"
                        value={amount}
                        onChange={handleAmountChange}
                        placeholder="0.0"
                        className="border-none flex-1 bg-transparent text-2xl font-medium focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
                      />
                      
                      <div className="flex items-center">
                        <div className="flex items-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="px-3 py-1 h-auto text-xs font-medium text-primary dark:text-primary mr-2"
                            onClick={handleMaxClick}
                          >
                            MAX
                          </Button>
                          
                          <Button
                            variant="outline"
                            className="flex items-center border border-primary/20 hover:border-primary/40 bg-dark-bg/40 backdrop-blur-sm hover:bg-dark-bg/60 transition-all h-12 pl-3 pr-4"
                            onClick={() => setShowTokenSelect(true)}
                          >
                            {token && (
                              <>
                                <div 
                                  className="w-7 h-7 rounded-full flex items-center justify-center mr-3 shadow-md relative overflow-hidden"
                                  style={{ background: `linear-gradient(135deg, ${token.color}, ${token.color}DD)` }}
                                >
                                  <div className="absolute inset-0 bg-white/10 opacity-50"></div>
                                  <span className="text-white text-xs font-bold relative">
                                    {token.symbol.substring(0, 1)}
                                  </span>
                                </div>
                                <span className="font-medium mr-2">{token.symbol}</span>
                              </>
                            )}
                            <ChevronDown size={16} className="text-primary" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Swap Direction Button */}
                <div className="flex justify-center -my-3 relative z-10">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="w-10 h-10 rounded-full border-2 border-primary bg-white dark:bg-dark-bg hover:bg-primary/10 shadow-lg"
                    onClick={handleSwapChains}
                  >
                    <ArrowDown className="h-4 w-4 text-primary" />
                  </Button>
                </div>
                
                <div className="my-6">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      To
                    </label>
                  </div>
                  
                  <div className="flex space-x-4 mb-3">
                    <div className="flex-1">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="outline" 
                            className="w-full justify-between border border-primary/20 hover:border-primary/40 bg-dark-bg/40 backdrop-blur-sm hover:bg-dark-bg/60 transition-all h-12 pl-3 pr-4"
                          >
                            <div className="flex items-center">
                              {toChain === 'BSC' ? (
                                <div 
                                  className="w-7 h-7 rounded-full flex items-center justify-center mr-3 shadow-md relative overflow-hidden" 
                                  style={{ background: "linear-gradient(135deg, #F0B90B, #F0B90BDD)" }}
                                >
                                  <div className="absolute inset-0 bg-white/10 opacity-50"></div>
                                  <span className="text-white text-xs font-bold relative">B</span>
                                </div>
                              ) : (
                                <div 
                                  className="w-7 h-7 rounded-full flex items-center justify-center mr-3 shadow-md relative overflow-hidden" 
                                  style={{ background: "linear-gradient(135deg, #0066FF, #0066FFDD)" }}
                                >
                                  <div className="absolute inset-0 bg-white/10 opacity-50"></div>
                                  <span className="text-white text-xs font-bold relative">B</span>
                                </div>
                              )}
                              <span className="font-medium">{toChain} Chain</span>
                            </div>
                            <ChevronDown size={16} className="text-primary" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-full bg-dark-bg/95 backdrop-blur-sm border border-primary/20 p-1">
                          <DropdownMenuItem 
                            onClick={() => handleToChainChange('BSC')}
                            className="rounded-lg hover:bg-dark-bg/60 focus:bg-dark-bg/60 py-2"
                          >
                            <div 
                              className="w-7 h-7 rounded-full flex items-center justify-center mr-3 shadow-md relative overflow-hidden" 
                              style={{ background: "linear-gradient(135deg, #F0B90B, #F0B90BDD)" }}
                            >
                              <div className="absolute inset-0 bg-white/10 opacity-50"></div>
                              <span className="text-white text-xs font-bold relative">B</span>
                            </div>
                            <span className="font-medium">BSC Chain</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleToChainChange('BNW')}
                            className="rounded-lg hover:bg-dark-bg/60 focus:bg-dark-bg/60 py-2"
                          >
                            <div 
                              className="w-7 h-7 rounded-full flex items-center justify-center mr-3 shadow-md relative overflow-hidden" 
                              style={{ background: "linear-gradient(135deg, #0066FF, #0066FFDD)" }}
                            >
                              <div className="absolute inset-0 bg-white/10 opacity-50"></div>
                              <span className="text-white text-xs font-bold relative">B</span>
                            </div>
                            <span className="font-medium">BNW Chain</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  
                  <div className="bg-dark-bg/40 backdrop-blur-sm rounded-xl p-5 border border-primary/10 hover:border-primary/20 transition-all shadow-inner">
                    <div className="flex justify-between">
                      <div className="text-2xl font-medium">
                        {amount ? parseFloat(amount) || "0.0" : "0.0"}
                      </div>
                      
                      <div className="flex items-center">
                        {token && (
                          <div className="flex items-center">
                            <div 
                              className="w-7 h-7 rounded-full flex items-center justify-center mr-3 shadow-md relative overflow-hidden"
                              style={{ background: `linear-gradient(135deg, ${token.color}, ${token.color}DD)` }}
                            >
                              <div className="absolute inset-0 bg-white/10 opacity-50"></div>
                              <span className="text-white text-xs font-bold relative">
                                {token.symbol.substring(0, 1)}
                              </span>
                            </div>
                            <span className="font-medium">{token.symbol}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Bridge Info */}
                <div className="bg-dark-bg/30 backdrop-blur-sm rounded-xl p-5 mb-6 border border-primary/5 shadow-inner">
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-sm text-gray-300 flex items-center">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center mr-2.5">
                        <ShieldCheck size={15} className="text-primary" />
                      </div>
                      Bridge Fee
                    </div>
                    <div className="text-sm font-medium text-gray-200">
                      {bridgeFee} {token?.symbol || 'BNB'}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-300 flex items-center">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center mr-2.5">
                        <Clock size={15} className="text-primary" />
                      </div>
                      Estimated Gas
                    </div>
                    <div className="text-sm font-medium text-gray-200">
                      ~{estimatedGas} {fromChain === 'BSC' ? 'BNB' : 'BNB'}
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="w-full py-6 bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-600 text-white font-medium text-lg rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden"
                  disabled={loading}
                  onClick={handleBridgeClick}
                >
                  {/* Inner glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-transparent opacity-70"></div>
                  
                  {/* Button content */}
                  <span className="relative flex items-center justify-center gap-2">
                    {!connected ? (
                      <>
                        <Wallet className="mr-1" size={20} />
                        Connect Wallet
                      </>
                    ) : loading ? (
                      <>
                        <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
                        Bridging...
                      </>
                    ) : (
                      <>
                        <ArrowLeftRight className="mr-1" size={20} />
                        Bridge Tokens
                      </>
                    )}
                  </span>
                </Button>
              </div>
            ) : (
              <div className="p-6">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Token</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Route</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Tx Hash</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {history.length > 0 ? (
                        history.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.token}</TableCell>
                            <TableCell>{item.amount}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <span>{item.fromChain}</span>
                                <ArrowRight size={14} className="mx-1" />
                                <span>{item.toChain}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className={`capitalize ${getStatusColor(item.status)}`}>
                                {item.status}
                              </span>
                            </TableCell>
                            <TableCell>{item.time}</TableCell>
                            <TableCell>
                              <a 
                                href="#" 
                                className="text-primary flex items-center"
                                onClick={(e) => e.preventDefault()}
                              >
                                {item.txHash} <ExternalLink size={14} className="ml-1" />
                              </a>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-10 text-gray-500 dark:text-gray-400">
                            No bridge history found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Info Cards */}
        <div className="lg:col-span-1">
          <div className="space-y-6">
            {/* Bridge Info Card */}
            <Card>
              <CardHeader className="border-b border-gray-800/50 pb-4 bg-gradient-to-r from-primary/20 to-blue-500/10 backdrop-blur-sm">
                <h3 className="text-lg font-medium flex items-center">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                    <Info size={14} className="text-primary" />
                  </div>
                  About Bridge
                </h3>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  The BNWSwap Bridge allows you to transfer tokens between Binance Smart Chain and BNW Chain with the following features:
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex">
                    <span className="text-primary mr-2">•</span>
                    <span>Low transaction fees</span>
                  </li>
                  <li className="flex">
                    <span className="text-primary mr-2">•</span>
                    <span>Fast cross-chain transfers (typically 2-5 min)</span>
                  </li>
                  <li className="flex">
                    <span className="text-primary mr-2">•</span>
                    <span>Secure and trustless bridging mechanism</span>
                  </li>
                  <li className="flex">
                    <span className="text-primary mr-2">•</span>
                    <span>Support for major tokens</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            {/* Supported Tokens Card */}
            <Card>
              <CardHeader className="border-b border-gray-800/50 pb-4 bg-gradient-to-r from-primary/20 to-blue-500/10 backdrop-blur-sm">
                <h3 className="text-lg font-medium flex items-center">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                    <Wallet size={14} className="text-primary" />
                  </div>
                  Supported Tokens
                </h3>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-3 gap-3">
                  {tokenList
                    .filter(t => ['BNB', 'BUSD', 'BTCB', 'ETH', 'CAKE'].includes(t.symbol))
                    .map(token => (
                      <div 
                        key={token.symbol} 
                        className="flex flex-col items-center justify-center p-3 bg-dark-bg/40 backdrop-blur-sm rounded-xl border border-primary/10 hover:border-primary/30 transition-all hover:shadow-md"
                      >
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center mb-2 shadow-md relative" 
                          style={{ background: `linear-gradient(135deg, ${token.color}, ${token.color}DD)` }}
                        >
                          <div className="absolute inset-0 rounded-full bg-white/10 opacity-50"></div>
                          <span className="relative text-white text-xs font-bold">
                            {token.symbol.substring(0, 1)}
                          </span>
                        </div>
                        <span className="text-xs font-medium">{token.symbol}</span>
                      </div>
                    ))
                  }
                </div>
              </CardContent>
            </Card>
            
            {/* FAQ Card */}
            <Card>
              <CardHeader className="border-b border-gray-800/50 pb-4 bg-gradient-to-r from-primary/20 to-blue-500/10 backdrop-blur-sm">
                <h3 className="text-lg font-medium flex items-center">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                    <HelpCircle size={14} className="text-primary" />
                  </div>
                  FAQ
                </h3>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">How long does bridging take?</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Typically 2-5 minutes, but can take longer during network congestion.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Is there a minimum amount?</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Yes, the minimum varies by token but is typically equivalent to $10 USD.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">What if my transaction is stuck?</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Contact support with your transaction hash for assistance.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Community Section with Text on Opacity Background */}
      <div className="py-20 relative overflow-hidden">
        {/* Background gradients */}
        <div className="absolute top-20 -left-20 w-80 h-80 bg-blue-500/20 rounded-full filter blur-[100px] z-0"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full filter blur-[120px] z-0"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-400 text-transparent bg-clip-text">
              Join Our Growing Community
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Be part of the BNWSwap ecosystem and stay updated with the latest developments, features, and community events.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Community Card 1 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-blue-600/20 rounded-xl opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="backdrop-blur-md bg-dark-bg/40 p-6 rounded-xl border border-white/10 shadow-xl relative z-10 h-full flex flex-col">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <MessageCircle size={24} className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-primary transition-colors">Discord Community</h3>
                <p className="text-gray-300 mb-4 flex-grow">
                  Join our Discord for real-time support, discussions, and to connect with other BNWSwap users.
                </p>
                <Button variant="ghost" className="border border-primary/40 hover:bg-primary/20 text-primary">
                  Join Discord
                </Button>
              </div>
            </div>
            
            {/* Community Card 2 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-purple-600/20 rounded-xl opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="backdrop-blur-md bg-dark-bg/40 p-6 rounded-xl border border-white/10 shadow-xl relative z-10 h-full flex flex-col">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <Twitter size={24} className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-primary transition-colors">Twitter Updates</h3>
                <p className="text-gray-300 mb-4 flex-grow">
                  Follow us on Twitter for the latest announcements, updates, and community highlights.
                </p>
                <Button variant="ghost" className="border border-primary/40 hover:bg-primary/20 text-primary">
                  Follow on Twitter
                </Button>
              </div>
            </div>
            
            {/* Community Card 3 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 to-pink-600/20 rounded-xl opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="backdrop-blur-md bg-dark-bg/40 p-6 rounded-xl border border-white/10 shadow-xl relative z-10 h-full flex flex-col">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <BookOpen size={24} className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-primary transition-colors">Documentation</h3>
                <p className="text-gray-300 mb-4 flex-grow">
                  Explore our comprehensive documentation to learn about BNWSwap's features and how to use them.
                </p>
                <Button variant="ghost" className="border border-primary/40 hover:bg-primary/20 text-primary">
                  View Documentation
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Token Select Modal */}
      {showTokenSelect && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-dark-bg/95 rounded-xl max-w-md w-full max-h-[90vh] overflow-auto border border-primary/20 shadow-xl backdrop-blur-sm">
            <div className="p-5 border-b border-gray-800/50 flex justify-between items-center bg-gradient-to-r from-primary/10 to-blue-500/5">
              <h3 className="font-medium text-lg flex items-center">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                  <Wallet size={14} className="text-primary" />
                </div>
                Select Token
              </h3>
              <button 
                className="w-8 h-8 rounded-full flex items-center justify-center bg-dark-bg/50 hover:bg-dark-bg/80 text-gray-400 hover:text-white transition-colors"
                onClick={() => setShowTokenSelect(false)}
              >
                &times;
              </button>
            </div>
            <div className="p-2">
              {filteredTokens.map(t => (
                <div 
                  key={t.symbol}
                  className="flex items-center p-3 hover:bg-dark-bg/60 rounded-xl cursor-pointer border border-transparent hover:border-primary/20 transition-all my-1"
                  onClick={() => handleTokenSelect(t)}
                >
                  <div 
                    className="w-8 h-8 rounded-full mr-3 flex items-center justify-center shadow-md relative" 
                    style={{ background: `linear-gradient(135deg, ${t.color}, ${t.color}DD)` }}
                  >
                    <div className="absolute inset-0 rounded-full bg-white/10 opacity-50"></div>
                    <span className="relative text-white text-xs font-bold">
                      {t.symbol.substring(0, 1)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{t.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{t.symbol}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{t.balance?.toFixed(4) || "0"}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      ${t.price ? (t.balance || 0) * t.price : 0}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bridge;