import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoint to get token price data
  app.get('/api/prices', async (_req, res) => {
    try {
      const prices = {
        BNB: 263.42,
        BUSD: 1.0,
        BTCB: 41231.58,
        ETH: 2238.76,
        CAKE: 2.42,
        USDT: 1.0,
        USDC: 1.0,
        DOT: 6.32,
        LINK: 13.76,
        ADA: 0.45
      };
      
      res.json(prices);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch token prices" });
    }
  });

  // API endpoint to store transaction history
  app.post('/api/transactions', async (req, res) => {
    try {
      const { walletAddress, fromToken, toToken, fromAmount, toAmount, txHash } = req.body;
      
      if (!walletAddress || !fromToken || !toToken || !fromAmount || !toAmount || !txHash) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      
      const transaction = await storage.saveTransaction({
        walletAddress,
        fromToken,
        toToken,
        fromAmount,
        toAmount,
        txHash,
        status: 'completed',
        timestamp: new Date()
      });
      
      res.status(201).json(transaction);
    } catch (error) {
      res.status(500).json({ error: "Failed to save transaction" });
    }
  });

  // API endpoint to get transaction history for a wallet
  app.get('/api/transactions/:walletAddress', async (req, res) => {
    try {
      const { walletAddress } = req.params;
      
      if (!walletAddress) {
        return res.status(400).json({ error: "Wallet address is required" });
      }
      
      const transactions = await storage.getTransactionsByWallet(walletAddress);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
