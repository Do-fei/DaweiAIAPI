import { bigint, int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  balance: bigint("balance", { mode: "number" }).default(0).notNull(), // 单位：分
  totalSpent: bigint("totalSpent", { mode: "number" }).default(0).notNull(), // 单位：分
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export const usersRelations = relations(users, ({ many }) => ({
  apiKeys: many(apiKeys),
  transactions: many(transactions),
  conversations: many(conversations),
}));

// AI 模型配置表
export const models = mysqlTable("models", {
  id: int("id").autoincrement().primaryKey(),
  modelName: varchar("modelName", { length: 128 }).notNull().unique(),
  modelType: mysqlEnum("modelType", ["chat", "image", "audio"]).notNull(),
  inputTokenPrice: decimal("inputTokenPrice", { precision: 10, scale: 6 }).notNull(), // 单位：分/1K tokens
  outputTokenPrice: decimal("outputTokenPrice", { precision: 10, scale: 6 }).notNull(),
  imagePrice: decimal("imagePrice", { precision: 10, scale: 2 }), // 单位：分/张
  status: mysqlEnum("status", ["active", "inactive"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Model = typeof models.$inferSelect;
export type InsertModel = typeof models.$inferInsert;

// API Key 管理表
export const apiKeys = mysqlTable("apiKeys", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  keyName: varchar("keyName", { length: 255 }).notNull(),
  keyValue: text("keyValue").notNull(), // 加密存储
  status: mysqlEnum("status", ["active", "inactive"]).default("active").notNull(),
  callCount: bigint("callCount", { mode: "number" }).default(0).notNull(),
  tokensUsed: bigint("tokensUsed", { mode: "number" }).default(0).notNull(),
  remainingQuota: bigint("remainingQuota", { mode: "number" }).default(0).notNull(), // 单位：分
  lastUsedAt: timestamp("lastUsedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ApiKey = typeof apiKeys.$inferSelect;
export type InsertApiKey = typeof apiKeys.$inferInsert;
export const apiKeysRelations = relations(apiKeys, ({ one, many }) => ({
  user: one(users, { fields: [apiKeys.userId], references: [users.id] }),
  transactions: many(transactions),
}));

// 交易记录表
export const transactions = mysqlTable("transactions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  apiKeyId: int("apiKeyId"),
  type: mysqlEnum("type", ["charge", "refund", "recharge"]).notNull(),
  model: varchar("model", { length: 128 }),
  inputTokens: bigint("inputTokens", { mode: "number" }).default(0),
  outputTokens: bigint("outputTokens", { mode: "number" }).default(0),
  amount: bigint("amount", { mode: "number" }).notNull(), // 单位：分
  status: mysqlEnum("status", ["pending", "completed", "failed"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = typeof transactions.$inferInsert;
export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, { fields: [transactions.userId], references: [users.id] }),
  apiKey: one(apiKeys, { fields: [transactions.apiKeyId], references: [apiKeys.id] }),
}));

// 对话记录表
export const conversations = mysqlTable("conversations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  model: varchar("model", { length: 128 }).notNull(),
  status: mysqlEnum("status", ["active", "archived"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = typeof conversations.$inferInsert;
export const conversationsRelations = relations(conversations, ({ one, many }) => ({
  user: one(users, { fields: [conversations.userId], references: [users.id] }),
  messages: many(messages),
}));

// 消息表
export const messages = mysqlTable("messages", {
  id: int("id").autoincrement().primaryKey(),
  conversationId: int("conversationId").notNull(),
  role: mysqlEnum("role", ["user", "assistant", "system"]).notNull(),
  content: text("content").notNull(),
  inputTokens: bigint("inputTokens", { mode: "number" }).default(0),
  outputTokens: bigint("outputTokens", { mode: "number" }).default(0),
  model: varchar("model", { length: 128 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;
export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, { fields: [messages.conversationId], references: [conversations.id] }),
}));
