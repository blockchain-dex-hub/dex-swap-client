import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { X } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  slippageTolerance: number;
  onSlippageChange: (value: number) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  slippageTolerance,
  onSlippageChange,
}) => {
  const [customSlippage, setCustomSlippage] = useState("");
  const [transactionDeadline, setTransactionDeadline] = useState("20");
  const [autoRouterApi, setAutoRouterApi] = useState(true);
  const [expertMode, setExpertMode] = useState(false);

  const handleSlippageSelect = (value: number) => {
    onSlippageChange(value);
    setCustomSlippage("");
  };

  const handleCustomSlippageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || (!isNaN(parseFloat(value)) && parseFloat(value) >= 0 && parseFloat(value) <= 100)) {
      setCustomSlippage(value);
      if (value !== "" && parseFloat(value) > 0) {
        onSlippageChange(parseFloat(value));
      }
    }
  };

  const handleApplySettings = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-neutral-400 sm:max-w-md">
        <DialogHeader className="flex items-center justify-between p-4 border-b border-neutral-400">
          <DialogTitle className="text-lg font-semibold">Settings</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-neutral-300 hover:text-neutral-100">
            <X className="h-5 w-5" />
          </Button>
        </DialogHeader>
        
        <div className="p-4">
          <div className="mb-4">
            <h4 className="font-medium mb-2">Slippage Tolerance</h4>
            <div className="flex space-x-2 mb-2">
              <Button
                variant={slippageTolerance === 0.1 && !customSlippage ? "secondary" : "outline"}
                className={slippageTolerance === 0.1 && !customSlippage 
                  ? "bg-primary/10 text-primary hover:bg-primary/20" 
                  : "bg-hover-bg text-neutral-300 hover:text-neutral-100"}
                onClick={() => handleSlippageSelect(0.1)}
              >
                Auto
              </Button>
              <Button
                variant={slippageTolerance === 0.5 && !customSlippage ? "secondary" : "outline"}
                className={slippageTolerance === 0.5 && !customSlippage 
                  ? "bg-primary/10 text-primary hover:bg-primary/20" 
                  : "bg-hover-bg text-neutral-300 hover:text-neutral-100"}
                onClick={() => handleSlippageSelect(0.5)}
              >
                0.5%
              </Button>
              <Button
                variant={slippageTolerance === 1 && !customSlippage ? "secondary" : "outline"}
                className={slippageTolerance === 1 && !customSlippage 
                  ? "bg-primary/10 text-primary hover:bg-primary/20" 
                  : "bg-hover-bg text-neutral-300 hover:text-neutral-100"}
                onClick={() => handleSlippageSelect(1)}
              >
                1%
              </Button>
              <Button
                variant={slippageTolerance === 3 && !customSlippage ? "secondary" : "outline"}
                className={slippageTolerance === 3 && !customSlippage 
                  ? "bg-primary/10 text-primary hover:bg-primary/20" 
                  : "bg-hover-bg text-neutral-300 hover:text-neutral-100"}
                onClick={() => handleSlippageSelect(3)}
              >
                3%
              </Button>
            </div>
            <div className="flex items-center">
              <Input
                type="text"
                placeholder="Custom"
                className="bg-dark-bg border-neutral-400 rounded-lg py-2 px-3 w-full focus-visible:ring-primary"
                value={customSlippage}
                onChange={handleCustomSlippageChange}
              />
              <span className="ml-2">%</span>
            </div>
          </div>
          
          <div className="mb-4">
            <h4 className="font-medium mb-2">Transaction Deadline</h4>
            <div className="flex items-center">
              <Input
                type="number"
                className="bg-dark-bg border-neutral-400 rounded-lg py-2 px-3 w-24 focus-visible:ring-primary"
                value={transactionDeadline}
                onChange={(e) => setTransactionDeadline(e.target.value)}
                min="1"
              />
              <span className="ml-2">minutes</span>
            </div>
          </div>
          
          <div className="mb-4">
            <h4 className="font-medium mb-2">Interface Settings</h4>
            <div className="flex justify-between items-center mb-3">
              <Label htmlFor="auto-router">Auto Router API</Label>
              <Switch
                id="auto-router"
                checked={autoRouterApi}
                onCheckedChange={setAutoRouterApi}
              />
            </div>
            
            <div className="flex justify-between items-center">
              <Label htmlFor="expert-mode">Expert Mode</Label>
              <Switch
                id="expert-mode"
                checked={expertMode}
                onCheckedChange={setExpertMode}
              />
            </div>
          </div>
          
          <Button 
            className="w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
            onClick={handleApplySettings}
          >
            Apply Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
