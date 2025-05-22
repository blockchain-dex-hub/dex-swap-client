import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowLeftRight, XCircle } from "lucide-react";
import { Transaction } from "@/types";

interface TransactionHistoryProps {
  transactions: Transaction[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
  return (
    <Card className="mt-6 bg-card border-neutral-400 rounded-xl overflow-hidden">
      <CardHeader className="p-4 border-b border-neutral-400">
        <h2 className="text-lg font-semibold">Recent Transactions</h2>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="space-y-4">
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <div 
                key={transaction.id} 
                className="flex items-center justify-between bg-dark-bg p-3 rounded-lg"
              >
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full ${
                    transaction.status === 'completed' 
                      ? 'bg-positive/10' 
                      : 'bg-negative/10'
                  } flex items-center justify-center mr-3`}>
                    {transaction.status === 'completed' ? (
                      <ArrowLeftRight className={`text-positive h-5 w-5`} />
                    ) : (
                      <XCircle className={`text-negative h-5 w-5`} />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">
                      {transaction.status === 'completed' ? 'Swap' : 'Swap Failed'}
                    </p>
                    <p className="text-sm text-neutral-300">
                      {transaction.fromAmount} {transaction.fromToken} to {transaction.toAmount} {transaction.toToken}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`${transaction.status === 'completed' ? 'text-positive' : 'text-negative'}`}>
                    {transaction.status === 'completed' ? 'Completed' : 'Failed'}
                  </p>
                  <p className="text-sm text-neutral-300">{transaction.timeAgo}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-neutral-300">
              <p>No transactions yet</p>
            </div>
          )}
        </div>
        
        {transactions.length > 0 && (
          <div className="mt-4 text-center">
            <a href="#" className="text-primary hover:underline text-sm">View All Transactions</a>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionHistory;
