import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, X } from "lucide-react";
import { tokenList } from "@/lib/tokenList";
import { TokenInfo } from "@/types";

interface TokenSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (token: TokenInfo) => void;
  selectedToken?: TokenInfo;
}

const TokenSelectModal: React.FC<TokenSelectModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  selectedToken,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTokens = tokenList.filter((token) => {
    const query = searchQuery.toLowerCase();
    return (
      token.name.toLowerCase().includes(query) ||
      token.symbol.toLowerCase().includes(query) ||
      token.address.toLowerCase().includes(query)
    );
  });

  const commonTokens = tokenList.slice(0, 4);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-neutral-400 sm:max-w-md p-0">
        <DialogHeader className="p-4 border-b border-neutral-400 flex items-center justify-between">
          <DialogTitle className="text-lg font-semibold">Select a Token</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-neutral-300 hover:text-neutral-100">
            <X className="h-5 w-5" />
          </Button>
        </DialogHeader>
        
        <div className="p-4 border-b border-neutral-400">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search name or paste address"
              className="bg-dark-bg border-neutral-400 rounded-lg py-3 px-4 w-full focus-visible:ring-primary pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-3 text-neutral-300 h-5 w-5" />
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2">
            {commonTokens.map((token) => (
              <Button
                key={token.symbol}
                variant="outline"
                className="flex items-center bg-hover-bg hover:bg-opacity-70 rounded-lg py-1.5 px-3 h-8"
                onClick={() => onSelect(token)}
              >
                <div 
                  className="w-5 h-5 rounded-full flex items-center justify-center mr-1.5"
                  style={{ backgroundColor: token.color }}
                >
                  <span className={`text-${token.textColor || 'white'} font-medium text-xs`}>
                    {token.symbol.substring(0, 1)}
                  </span>
                </div>
                <span className="font-medium">{token.symbol}</span>
              </Button>
            ))}
          </div>
        </div>
        
        <ScrollArea className="token-list max-h-[300px]">
          {filteredTokens.map((token) => (
            <Button
              key={token.address}
              variant="ghost"
              className={`w-full px-4 py-3 hover:bg-hover-bg transition-colors flex items-center justify-between h-auto rounded-none ${
                selectedToken?.address === token.address ? "bg-hover-bg" : ""
              }`}
              onClick={() => onSelect(token)}
            >
              <div className="flex items-center">
                <div 
                  className="token-icon mr-3"
                  style={{ backgroundColor: token.color }}
                >
                  <span className={`text-${token.textColor || 'white'} font-medium text-xs`}>
                    {token.symbol.substring(0, token.symbol.length > 4 ? 4 : token.symbol.length)}
                  </span>
                </div>
                <div className="text-left">
                  <p className="font-medium">{token.symbol}</p>
                  <p className="text-sm text-neutral-300">{token.name}</p>
                </div>
              </div>
              <span>{token.balance?.toFixed(4) || "0"}</span>
            </Button>
          ))}
          
          {filteredTokens.length === 0 && (
            <div className="p-8 text-center text-neutral-300">
              <p>No tokens found</p>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default TokenSelectModal;
