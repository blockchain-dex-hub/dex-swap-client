import React, { useState } from "react";
import { Link } from "wouter";
import WalletConnector from "./WalletConnector";
import { 
  Menu, 
  ChevronDown, 
  Globe, 
  Repeat, 
  BarChart3, 
  Clock, 
  Droplets,
  Wallet,
  Sparkles,
  ArrowLeftRight
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useChainSelector, ChainType } from "../hooks/useChainSelector";
import { useLanguage, LanguageType } from "../hooks/useLanguage";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { selectedChain, setSelectedChain } = useChainSelector();
  const { selectedLanguage, setSelectedLanguage } = useLanguage();

  const handleChainSelect = (chain: ChainType) => {
    setSelectedChain(chain);
  };
  
  const handleLanguageSelect = (language: LanguageType) => {
    setSelectedLanguage(language);
  };

  return (
    <header className="bg-white border-b border-gray-200 py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo with Home Link */}
        <Link href="/">
          <div className="flex items-center cursor-pointer hover:opacity-90 transition-opacity">
            <div className="flex items-center justify-center bg-primary rounded-full w-8 h-8 mr-2">
              <Sparkles size={18} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-primary">BNWSwap</h1>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/swap">
            <span className="flex items-center text-gray-900 font-medium hover:text-primary transition-colors cursor-pointer">
              <Repeat size={18} className="mr-1.5" />
              Swap
            </span>
          </Link>
          <Link href="/bridge">
            <span className="flex items-center text-gray-900 font-medium hover:text-primary transition-colors cursor-pointer">
              <ArrowLeftRight size={18} className="mr-1.5" />
              Bridge
            </span>
          </Link>
          <span className="flex items-center text-gray-600 hover:text-primary transition-colors cursor-pointer">
            <Droplets size={18} className="mr-1.5" />
            Liquidity
          </span>
          <span className="flex items-center text-gray-600 hover:text-primary transition-colors cursor-pointer">
            <Clock size={18} className="mr-1.5" />
            History
          </span>
          <span className="flex items-center text-gray-600 hover:text-primary transition-colors cursor-pointer">
            <BarChart3 size={18} className="mr-1.5" />
            Analytics
          </span>
        </nav>

        {/* Wallet Connection */}
        <div className="flex items-center">
          {/* Language Selector Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center px-3 py-2 bg-dark-bg/30 backdrop-blur-sm text-gray-300 rounded font-medium hover:bg-dark-bg/50 transition-colors mr-3 border border-primary/20">
              <Globe size={16} className="mr-2 text-primary" />
              {selectedLanguage}
              <ChevronDown size={16} className="ml-2 text-gray-400" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-dark-bg border border-primary/20 text-gray-200 p-2 rounded-lg shadow-lg backdrop-blur-sm w-48">
              <div className="px-3 py-2 text-sm text-gray-400 border-b border-gray-700 mb-2">
                Select Language
              </div>
              <DropdownMenuItem 
                className={`${selectedLanguage === 'English' ? 'bg-primary/20 text-primary border-l-2 border-primary' : 'hover:bg-dark-bg/70'} cursor-pointer px-3 py-2 rounded-md mb-1 transition-all`}
                onClick={() => handleLanguageSelect('English')}
              >
                <span className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-600/20 mr-2">🇺🇸</span>
                English
              </DropdownMenuItem>
              <DropdownMenuItem 
                className={`${selectedLanguage === 'Chinese' ? 'bg-primary/20 text-primary border-l-2 border-primary' : 'hover:bg-dark-bg/70'} cursor-pointer px-3 py-2 rounded-md mb-1 transition-all`}
                onClick={() => handleLanguageSelect('Chinese')}
              >
                <span className="w-6 h-6 flex items-center justify-center rounded-full bg-red-600/20 mr-2">🇨🇳</span>
                Chinese
              </DropdownMenuItem>
              <DropdownMenuItem 
                className={`${selectedLanguage === 'Korean' ? 'bg-primary/20 text-primary border-l-2 border-primary' : 'hover:bg-dark-bg/70'} cursor-pointer px-3 py-2 rounded-md mb-1 transition-all`}
                onClick={() => handleLanguageSelect('Korean')}
              >
                <span className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-600/20 mr-2">🇰🇷</span>
                Korean
              </DropdownMenuItem>
              <DropdownMenuItem 
                className={`${selectedLanguage === 'Japanese' ? 'bg-primary/20 text-primary border-l-2 border-primary' : 'hover:bg-dark-bg/70'} cursor-pointer px-3 py-2 rounded-md mb-1 transition-all`}
                onClick={() => handleLanguageSelect('Japanese')}
              >
                <span className="w-6 h-6 flex items-center justify-center rounded-full bg-red-600/20 mr-2">🇯🇵</span>
                Japanese
              </DropdownMenuItem>
              <DropdownMenuItem 
                className={`${selectedLanguage === 'Vietnamese' ? 'bg-primary/20 text-primary border-l-2 border-primary' : 'hover:bg-dark-bg/70'} cursor-pointer px-3 py-2 rounded-md mb-1 transition-all`}
                onClick={() => handleLanguageSelect('Vietnamese')}
              >
                <span className="w-6 h-6 flex items-center justify-center rounded-full bg-red-600/20 mr-2">🇻🇳</span>
                Vietnamese
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Chain Selector Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center px-3 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded font-medium transition-colors mr-3">
              <div className="flex items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-white/80 mr-2"></span>
                {selectedChain}
                <ChevronDown size={16} className="ml-2" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-dark-bg border border-primary/20 text-gray-200 p-2 rounded-lg shadow-lg backdrop-blur-sm w-48">
              <div className="px-3 py-2 text-sm text-gray-400 border-b border-gray-700 mb-2">
                Select Network
              </div>
              <DropdownMenuItem 
                className={`${selectedChain === 'BSC' ? 'bg-primary/20 text-primary border-l-2 border-primary' : 'hover:bg-dark-bg/70'} cursor-pointer px-3 py-2 rounded-md mb-1 transition-all`}
                onClick={() => handleChainSelect('BSC')}
              >
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center mr-2" 
                  style={{ backgroundColor: "#F0B90B" }}
                >
                  <span className="text-white text-xs font-bold">B</span>
                </div>
                BSC
              </DropdownMenuItem>
              <DropdownMenuItem 
                className={`${selectedChain === 'BNW' ? 'bg-primary/20 text-primary border-l-2 border-primary' : 'hover:bg-dark-bg/70'} cursor-pointer px-3 py-2 rounded-md mb-1 transition-all`}
                onClick={() => handleChainSelect('BNW')}
              >
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center mr-2" 
                  style={{ backgroundColor: "#0066FF" }}
                >
                  <Sparkles size={12} className="text-white" />
                </div>
                BNW
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <WalletConnector />
          
          {/* Mobile menu toggle */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <button className="md:hidden text-gray-800 hover:text-primary transition-colors ml-4">
                <Menu size={24} />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-white border-gray-200 w-[250px] sm:w-[300px]">
              {/* Mobile Logo Link to Home */}
              <Link href="/">
                <div className="flex items-center cursor-pointer hover:opacity-90 transition-opacity mt-2 mb-4">
                  <div className="flex items-center justify-center bg-primary rounded-full w-8 h-8 mr-2">
                    <Sparkles size={18} className="text-white" />
                  </div>
                  <h1 className="text-xl font-bold text-primary">BNWSwap</h1>
                </div>
              </Link>
              {/* Mobile Chain Selection */}
              <div className="flex flex-col space-y-2 mt-6 mb-4 p-2">
                <div className="text-gray-500 text-sm font-medium mb-1">Select Network</div>
                <div className="flex space-x-2">
                  <button 
                    className={`px-3 py-2 rounded text-sm font-medium ${selectedChain === 'BSC' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    onClick={() => handleChainSelect('BSC')}
                  >
                    BSC
                  </button>
                  <button 
                    className={`px-3 py-2 rounded text-sm font-medium ${selectedChain === 'BNW' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    onClick={() => handleChainSelect('BNW')}
                  >
                    BNW
                  </button>
                </div>
              </div>
              
              {/* Mobile Language Selection */}
              <div className="flex flex-col space-y-2 mb-4 p-2">
                <div className="text-gray-500 text-sm font-medium mb-1">Select Language</div>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    className={`px-3 py-2 rounded text-sm font-medium ${selectedLanguage === 'English' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    onClick={() => handleLanguageSelect('English')}
                  >
                    English
                  </button>
                  <button 
                    className={`px-3 py-2 rounded text-sm font-medium ${selectedLanguage === 'Chinese' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    onClick={() => handleLanguageSelect('Chinese')}
                  >
                    Chinese
                  </button>
                  <button 
                    className={`px-3 py-2 rounded text-sm font-medium ${selectedLanguage === 'Korean' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    onClick={() => handleLanguageSelect('Korean')}
                  >
                    Korean
                  </button>
                  <button 
                    className={`px-3 py-2 rounded text-sm font-medium ${selectedLanguage === 'Japanese' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    onClick={() => handleLanguageSelect('Japanese')}
                  >
                    Japanese
                  </button>
                  <button 
                    className={`px-3 py-2 rounded text-sm font-medium ${selectedLanguage === 'Vietnamese' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    onClick={() => handleLanguageSelect('Vietnamese')}
                  >
                    Vietnamese
                  </button>
                </div>
              </div>
              
              <nav className="flex flex-col space-y-4 mt-4 border-t border-gray-200 pt-4">
                <Link href="/swap">
                  <span className="flex items-center text-gray-900 font-medium hover:text-primary transition-colors p-2 cursor-pointer">
                    <Repeat size={18} className="mr-2" />
                    Swap
                  </span>
                </Link>
                <Link href="/bridge">
                  <span className="flex items-center text-gray-900 font-medium hover:text-primary transition-colors p-2 cursor-pointer">
                    <ArrowLeftRight size={18} className="mr-2" />
                    Bridge
                  </span>
                </Link>
                <span className="flex items-center text-gray-600 hover:text-primary transition-colors p-2 cursor-pointer">
                  <Droplets size={18} className="mr-2" />
                  Liquidity
                </span>
                <span className="flex items-center text-gray-600 hover:text-primary transition-colors p-2 cursor-pointer">
                  <Clock size={18} className="mr-2" />
                  History
                </span>
                <span className="flex items-center text-gray-600 hover:text-primary transition-colors p-2 cursor-pointer">
                  <BarChart3 size={18} className="mr-2" />
                  Analytics
                </span>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
