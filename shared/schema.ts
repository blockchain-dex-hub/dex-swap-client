import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model for wallet connections
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Transaction model for swap history
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  walletAddress: text("wallet_address").notNull(),
  fromToken: text("from_token").notNull(),
  toToken: text("to_token").notNull(),
  fromAmount: text("from_amount").notNull(),
  toAmount: text("to_amount").notNull(),
  txHash: text("tx_hash").notNull().unique(),
  status: text("status").notNull().default("completed"),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
});

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;

// Token price model
export const tokenPrices = pgTable("token_prices", {
  id: serial("id").primaryKey(),
  symbol: text("symbol").notNull().unique(),
  price: doublePrecision("price").notNull(),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
});

export const insertTokenPriceSchema = createInsertSchema(tokenPrices).omit({
  id: true,
  lastUpdated: true,
});

export type InsertTokenPrice = z.infer<typeof insertTokenPriceSchema>;
export type TokenPrice = typeof tokenPrices.$inferSelect;
