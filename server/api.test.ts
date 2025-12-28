import { describe, expect, it, beforeEach, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock user context
function createMockContext(userId: number = 1): TrpcContext {
  return {
    user: {
      id: userId,
      openId: `user-${userId}`,
      email: `user${userId}@example.com`,
      name: `Test User ${userId}`,
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("API Router Tests", () => {
  describe("User API", () => {
    it("should get user balance", async () => {
      const ctx = createMockContext();
      const caller = appRouter.createCaller(ctx);

      // This would normally call the database
      // For now, we're testing that the procedure exists and is callable
      expect(caller.user.balance).toBeDefined();
    });

    it("should get user transactions", async () => {
      const ctx = createMockContext();
      const caller = appRouter.createCaller(ctx);

      expect(caller.user.transactions).toBeDefined();
    });
  });

  describe("API Key Management", () => {
    it("should have apiKey router", async () => {
      const ctx = createMockContext();
      const caller = appRouter.createCaller(ctx);

      expect(caller.apiKey).toBeDefined();
      expect(caller.apiKey.list).toBeDefined();
      expect(caller.apiKey.create).toBeDefined();
      expect(caller.apiKey.delete).toBeDefined();
    });
  });

  describe("Statistics API", () => {
    it("should have stats router", async () => {
      const ctx = createMockContext();
      const caller = appRouter.createCaller(ctx);

      expect(caller.stats).toBeDefined();
      expect(caller.stats.usage).toBeDefined();
      expect(caller.stats.trend).toBeDefined();
      expect(caller.stats.breakdown).toBeDefined();
    });
  });

  describe("Model API", () => {
    it("should have model router", async () => {
      const ctx = createMockContext();
      const caller = appRouter.createCaller(ctx);

      expect(caller.model).toBeDefined();
      expect(caller.model.list).toBeDefined();
    });
  });

  describe("Chat API", () => {
    it("should have chat router", async () => {
      const ctx = createMockContext();
      const caller = appRouter.createCaller(ctx);

      expect(caller.chat).toBeDefined();
      expect(caller.chat.sendMessage).toBeDefined();
      expect(caller.chat.getHistory).toBeDefined();
    });
  });

  describe("Auth API", () => {
    it("should get current user", async () => {
      const ctx = createMockContext();
      const caller = appRouter.createCaller(ctx);

      const user = await caller.auth.me();
      expect(user).toBeDefined();
      expect(user?.id).toBe(1);
      expect(user?.name).toBe("Test User 1");
    });

    it("should logout", async () => {
      const ctx = createMockContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.auth.logout();
      expect(result).toEqual({ success: true });
    });
  });
});
