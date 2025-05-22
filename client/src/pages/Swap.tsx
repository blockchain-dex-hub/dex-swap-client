import React from "react";
import SwapCard from "@/components/SwapCard";
import { ArrowLeft, TrendingUp, Database, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";

const Swap: React.FC = () => {
  return (
    <div className="py-8 max-w-5xl mx-auto px-4">
      <div className="mb-6">
        <Link href="/">
          <a className="flex items-center text-gray-400 hover:text-primary transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </a>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column - Swap Card */}
        <div className="md:col-span-2">
          <div className="mb-4">
            <h1 className="text-2xl font-bold mb-1">Swap Tokens</h1>
            <p className="text-gray-400">Trade tokens in an instant with minimal slippage</p>
          </div>
          
          <SwapCard />
        </div>
        
        {/* Right Column - Stats & Info */}
        <div className="space-y-6">
          {/* Stats Cards */}
          <Card className="bg-dark-bg/60 border-primary/20 backdrop-blur-sm overflow-hidden">
            <div className="bg-gradient-to-r from-primary/20 to-blue-500/10 p-4 border-b border-primary/10">
              <h3 className="font-medium text-base">Trading Stats</h3>
            </div>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <TrendingUp className="text-primary mr-2 h-4 w-4" />
                  <span className="text-sm text-gray-300">24h Volume</span>
                </div>
                <span className="font-medium">$152M</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Database className="text-primary mr-2 h-4 w-4" />
                  <span className="text-sm text-gray-300">Liquidity</span>
                </div>
                <span className="font-medium">$1.23B</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Info className="text-primary mr-2 h-4 w-4" />
                  <span className="text-sm text-gray-300">Fees</span>
                </div>
                <span className="font-medium">0.25%</span>
              </div>
            </CardContent>
          </Card>
          
          {/* Trading Tips */}
          <Card className="bg-dark-bg/60 border-primary/20 backdrop-blur-sm overflow-hidden">
            <div className="bg-gradient-to-r from-primary/20 to-blue-500/10 p-4 border-b border-primary/10">
              <h3 className="font-medium text-base">Trading Tips</h3>
            </div>
            <CardContent className="p-4">
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex">
                  <span className="text-primary mr-2">•</span>
                  <span>Slippage tolerance: Set this based on market volatility</span>
                </li>
                <li className="flex">
                  <span className="text-primary mr-2">•</span>
                  <span>Gas fees: Lower during off-peak hours</span>
                </li>
                <li className="flex">
                  <span className="text-primary mr-2">•</span>
                  <span>Price impact: Watch for high impact on larger trades</span>
                </li>
              </ul>
              
              <Button variant="link" className="text-primary p-0 h-auto mt-3 text-sm">
                Learn more about trading
              </Button>
            </CardContent>
          </Card>
          
          {/* Price Chart Button */}
          <Button 
            variant="outline" 
            className="w-full border-primary/30 text-primary hover:bg-primary/10"
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            View Price Charts
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Swap;