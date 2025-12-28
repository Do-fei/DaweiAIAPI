import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import * as db from "./db";
import { eq } from "drizzle-orm";
import { apiKeys, conversations, messages, transactions, users } from "../drizzle/schema";
import { invokeLLM } from "./_core/llm";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ============ 用户管理 ============
  user: router({
    profile: protectedProcedure.query(({ ctx }) => ctx.user),
    
    balance: protectedProcedure.query(async ({ ctx }) => {
      const user = await db.getUserByOpenId(ctx.user.openId);
      if (!user) throw new TRPCError({ code: "NOT_FOUND" });
      return {
        balance: user.balance,
        totalSpent: user.totalSpent,
      };
    }),

    transactions: protectedProcedure
      .input(z.object({ limit: z.number().default(50), offset: z.number().default(0) }))
      .query(async ({ ctx, input }) => {
        const user = await db.getUserByOpenId(ctx.user.openId);
        if (!user) throw new TRPCError({ code: "NOT_FOUND" });
        return db.getTransactionsByUserId(user.id, input.limit, input.offset);
      }),
  }),

  // ============ API Key 管理 ============
  apiKey: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const user = await db.getUserByOpenId(ctx.user.openId);
      if (!user) throw new TRPCError({ code: "NOT_FOUND" });
      return db.getApiKeysByUserId(user.id);
    }),

    create: protectedProcedure
      .input(z.object({ keyName: z.string().min(1) }))
      .mutation(async ({ ctx, input }) => {
        const user = await db.getUserByOpenId(ctx.user.openId);
        if (!user) throw new TRPCError({ code: "NOT_FOUND" });
        
        const dbInstance = await db.getDb();
        if (!dbInstance) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        // 生成随机 API Key
        const keyValue = `sk_${Math.random().toString(36).substr(2, 32)}`;
        
        await dbInstance.insert(apiKeys).values({
          userId: user.id,
          keyName: input.keyName,
          keyValue, // 实际应该加密存储
          status: "active",
          remainingQuota: 0,
        });

        // 获取插入的 ID
        const insertedKey = await dbInstance.select().from(apiKeys).where(eq(apiKeys.userId, user.id)).orderBy(apiKeys.id);
        const newKey = insertedKey[insertedKey.length - 1];

        return { id: newKey?.id || 0, keyName: input.keyName };
      }),

    detail: protectedProcedure
      .input(z.object({ keyId: z.number() }))
      .query(async ({ ctx, input }) => {
        const user = await db.getUserByOpenId(ctx.user.openId);
        if (!user) throw new TRPCError({ code: "NOT_FOUND" });
        
        const key = await db.getApiKeyById(input.keyId);
        if (!key || key.userId !== user.id) throw new TRPCError({ code: "FORBIDDEN" });
        
        return key;
      }),

    delete: protectedProcedure
      .input(z.object({ keyId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const user = await db.getUserByOpenId(ctx.user.openId);
        if (!user) throw new TRPCError({ code: "NOT_FOUND" });
        
        const key = await db.getApiKeyById(input.keyId);
        if (!key || key.userId !== user.id) throw new TRPCError({ code: "FORBIDDEN" });

        const dbInstance = await db.getDb();
        if (!dbInstance) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        await dbInstance.delete(apiKeys).where(eq(apiKeys.id, input.keyId));
        return { success: true };
      }),
  }),

  // ============ 模型管理 ============
  model: router({
    list: protectedProcedure.query(async () => {
      return db.getAllModels();
    }),
  }),

  // ============ 聊天与对话 ============
  chat: router({
    createConversation: protectedProcedure
      .input(z.object({ title: z.string(), model: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const user = await db.getUserByOpenId(ctx.user.openId);
        if (!user) throw new TRPCError({ code: "NOT_FOUND" });

        const dbInstance = await db.getDb();
        if (!dbInstance) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        await dbInstance.insert(conversations).values({
          userId: user.id,
          title: input.title,
          model: input.model,
          status: "active",
        });

        // 获取最新插入的对话
        const convs = await dbInstance.select().from(conversations).where(eq(conversations.userId, user.id)).orderBy(conversations.id);
        const newConv = convs[convs.length - 1];

        return { id: newConv?.id || 0, title: input.title };
      }),

    history: protectedProcedure
      .input(z.object({ conversationId: z.number() }))
      .query(async ({ ctx, input }) => {
        const user = await db.getUserByOpenId(ctx.user.openId);
        if (!user) throw new TRPCError({ code: "NOT_FOUND" });

        const conversation = await db.getConversationById(input.conversationId);
        if (!conversation || conversation.userId !== user.id) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        return db.getMessagesByConversationId(input.conversationId);
      }),

    listConversations: protectedProcedure.query(async ({ ctx }) => {
      const user = await db.getUserByOpenId(ctx.user.openId);
      if (!user) throw new TRPCError({ code: "NOT_FOUND" });
      return db.getConversationsByUserId(user.id);
    }),

    deleteConversation: protectedProcedure
      .input(z.object({ conversationId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const user = await db.getUserByOpenId(ctx.user.openId);
        if (!user) throw new TRPCError({ code: "NOT_FOUND" });

        const conversation = await db.getConversationById(input.conversationId);
        if (!conversation || conversation.userId !== user.id) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        const dbInstance = await db.getDb();
        if (!dbInstance) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        await dbInstance.delete(conversations).where(eq(conversations.id, input.conversationId));
        return { success: true };
      }),

    // ============ 新增：发送消息并调用 LLM ============
    sendMessage: protectedProcedure
      .input(z.object({
        conversationId: z.number(),
        content: z.string().min(1),
        model: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const user = await db.getUserByOpenId(ctx.user.openId);
        if (!user) throw new TRPCError({ code: "NOT_FOUND" });

        const dbInstance = await db.getDb();
        if (!dbInstance) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        // 验证对话所有权
        const conversation = await db.getConversationById(input.conversationId);
        if (!conversation || conversation.userId !== user.id) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        // 检查余额
        if (user.balance < 100) { // 最少需要 1 元（100 分）
          throw new TRPCError({ code: "FORBIDDEN", message: "余额不足，请充值" });
        }

        // 保存用户消息
        await dbInstance.insert(messages).values({
          conversationId: input.conversationId,
          role: "user",
          content: input.content,
          model: input.model,
        });

        try {
          // 获取对话历史
          const history = await db.getMessagesByConversationId(input.conversationId);
          
          // 构建消息列表用于 LLM
          const llmMessages = history.map(msg => ({
            role: msg.role as "user" | "assistant" | "system",
            content: msg.content || "",
          }));

          // 调用 LLM API
          const response = await invokeLLM({
            messages: llmMessages,
          });

          const assistantContent = response.choices?.[0]?.message?.content || "抱歉，我无法处理你的请求。";
          const assistantContentStr = typeof assistantContent === "string" ? assistantContent : JSON.stringify(assistantContent);
          const usage = response.usage || { prompt_tokens: 0, completion_tokens: 0 };

          // 保存 AI 响应
          await dbInstance.insert(messages).values({
            conversationId: input.conversationId,
            role: "assistant",
            content: assistantContentStr,
            model: input.model,
            inputTokens: usage.prompt_tokens || 0,
            outputTokens: usage.completion_tokens || 0,
          });

          // 计算费用（简单示例：每 1000 tokens 收费 0.01 元）
          const totalTokens = (usage.prompt_tokens || 0) + (usage.completion_tokens || 0);
          const cost = Math.max(10, Math.ceil(totalTokens * 0.01)); // 最少 0.1 元

          // 创建交易记录
          await dbInstance.insert(transactions).values({
            userId: user.id,
            model: input.model,
            type: "charge",
            amount: cost,
            inputTokens: usage.prompt_tokens || 0,
            outputTokens: usage.completion_tokens || 0,
            status: "completed",
          });

          // 更新用户余额
          await dbInstance.update(users)
            .set({ balance: user.balance - cost })
            .where(eq(users.id, user.id));

          return {
            userMessage: input.content,
            assistantMessage: assistantContentStr,
            tokensUsed: totalTokens,
            costDeducted: cost,
          };
        } catch (error) {
          console.error("LLM API Error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "AI 服务暂时不可用，请稍后重试",
          });
        }
      }),

    // ============ 新增：获取对话消息（用于前端显示） ============
    getHistory: protectedProcedure
      .input(z.object({ conversationId: z.number() }))
      .query(async ({ ctx, input }) => {
        const user = await db.getUserByOpenId(ctx.user.openId);
        if (!user) throw new TRPCError({ code: "NOT_FOUND" });

        const conversation = await db.getConversationById(input.conversationId);
        if (!conversation || conversation.userId !== user.id) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        return db.getMessagesByConversationId(input.conversationId);
      }),
  }),

  // ============ 统计与分析 ============
  stats: router({
    usage: protectedProcedure
      .input(z.object({ days: z.number().default(30) }))
      .query(async ({ ctx, input }) => {
        const user = await db.getUserByOpenId(ctx.user.openId);
        if (!user) throw new TRPCError({ code: "NOT_FOUND" });

        const txns = await db.getTransactionsByUserId(user.id, 1000);
        const now = new Date();
        const cutoff = new Date(now.getTime() - input.days * 24 * 60 * 60 * 1000);

        const filtered = txns.filter(t => new Date(t.createdAt) >= cutoff);
        const totalTokens = filtered.reduce((sum, t) => sum + (t.inputTokens || 0) + (t.outputTokens || 0), 0);
        const totalCost = filtered.reduce((sum, t) => sum + t.amount, 0);

        return {
          totalTokens,
          totalCost,
          transactionCount: filtered.length,
        };
      }),

    trend: protectedProcedure
      .input(z.object({ days: z.number().default(30) }))
      .query(async ({ ctx, input }) => {
        const user = await db.getUserByOpenId(ctx.user.openId);
        if (!user) throw new TRPCError({ code: "NOT_FOUND" });

        const txns = await db.getTransactionsByUserId(user.id, 1000);
        const now = new Date();
        const cutoff = new Date(now.getTime() - input.days * 24 * 60 * 60 * 1000);

        const dailyData: Record<string, { tokens: number; cost: number }> = {};
        
        txns.forEach(t => {
          if (new Date(t.createdAt) >= cutoff) {
            const date = new Date(t.createdAt).toISOString().split("T")[0];
            if (!dailyData[date]) dailyData[date] = { tokens: 0, cost: 0 };
            dailyData[date].tokens += (t.inputTokens || 0) + (t.outputTokens || 0);
            dailyData[date].cost += t.amount;
          }
        });

        return Object.entries(dailyData).map(([date, data]) => ({
          date,
          ...data,
        }));
      }),

    breakdown: protectedProcedure.query(async ({ ctx }) => {
      const user = await db.getUserByOpenId(ctx.user.openId);
      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      const txns = await db.getTransactionsByUserId(user.id, 1000);
      const modelCosts: Record<string, number> = {};

      txns.forEach(t => {
        if (t.model) {
          modelCosts[t.model] = (modelCosts[t.model] || 0) + t.amount;
        }
      });

      return Object.entries(modelCosts).map(([model, cost]) => ({
        model,
        cost,
      }));
    }),
  }),
});

export type AppRouter = typeof appRouter;
