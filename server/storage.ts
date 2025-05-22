import { users, type User, type InsertUser, type Transaction, type InsertTransaction } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  saveTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getTransactionsByWallet(walletAddress: string): Promise<Transaction[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private transactions: Map<number, Transaction>;
  currentId: number;
  transactionId: number;

  constructor() {
    this.users = new Map();
    this.transactions = new Map();
    this.currentId = 1;
    this.transactionId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async saveTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const id = this.transactionId++;
    const newTransaction: Transaction = { 
      ...transaction, 
      id,
      // Ensure required fields are present
      status: transaction.status || 'completed',
      timestamp: transaction.timestamp || new Date()
    };
    this.transactions.set(id, newTransaction);
    return newTransaction;
  }
  
  async getTransactionsByWallet(walletAddress: string): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      (tx) => tx.walletAddress === walletAddress
    );
  }
}

export const storage = new MemStorage();
