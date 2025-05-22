import React from "react";
import { Card } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { TokenInfo } from "@/types";

interface TransactionStatusProps {
  visible: boolean;
  fromAmount?: string;
  fromToken?: TokenInfo;
  toAmount?: string;
  toToken?: TokenInfo;
  txHash?: string;
}

const TransactionStatus: React.FC<TransactionStatusProps> = ({
  visible,
  fromAmount,
  fromToken,
  toAmount,
  toToken,
  txHash,
}) => {
  if (!visible) return null;

  return (
    <Card className="mt-4 bg-card rounded-xl border border-primary p-4">
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">
          <div className="loader"></div>
        </div>
        <div>
          <h3 className="font-medium">Transaction in Progress</h3>
          <p className="text-sm text-neutral-300 mt-1">
            {`Swapping ${fromAmount || '0'} ${fromToken?.symbol || 'Token'} for approximately ${toAmount || '0'} ${toToken?.symbol || 'Token'}`}
          </p>
          {txHash && (
            <div className="mt-2 text-sm">
              <a
                href={`https://bscscan.com/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline flex items-center"
              >
                View on BscScan
                <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default TransactionStatus;
