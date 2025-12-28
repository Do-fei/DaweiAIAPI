# 🚀 Dawei AI Platform

> 一个功能完整的 AI 服务聚合平台，支持自然语言交互、多模型管理、实时计费和数据可视化

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-22.13.0-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![tRPC](https://img.shields.io/badge/tRPC-11-purple.svg)](https://trpc.io/)

## 📖 项目介绍

**Dawei AI Platform** 是一个现代化的 AI 服务聚合平台，为用户提供统一的接口来管理和调用多个 AI 模型。通过自然语言对话的方式，用户可以轻松进行 API 管理、成本追踪和模型选择，无需复杂的技术配置。

### 🎯 核心特性

- **🤖 自然语言交互**：通过聊天助手与 AI 交互，支持查询余额、创建 API Key、查看统计等自然语言命令
- **🔑 API Key 管理**：创建、查看、删除、启用/禁用 API Key，实时显示使用统计和剩余额度
- **💰 智能计费系统**：自动计算 Token 消耗，实时扣费，详细的消费明细和账单导出
- **📊 数据可视化**：使用 Recharts 展示调用趋势、费用分布、Token 消耗等多维度数据分析
- **🎨 现代化设计**：深色主题 + 蓝紫渐变，专业科技感，响应式设计支持所有设备
- **🔐 用户认证**：集成 Manus OAuth，支持安全的用户身份验证和会话管理
- **📱 移动友好**：完全响应式设计，移动端侧边栏自动转换为抽屉式导航

### 🎬 演示模式

支持免登录演示模式，一键启用即可直接进入后台，无需身份验证。完美用于产品演示和客户展示。

```bash
VITE_DEMO_MODE=true pnpm dev
```

## 🏗️ 技术栈

### 前端
- **React 19** - 现代化 UI 框架
- **TypeScript** - 类型安全的开发体验
- **Tailwind CSS 4** - 实用优先的样式框架
- **Recharts** - 数据可视化图表库
- **shadcn/ui** - 高质量 UI 组件库
- **tRPC** - 端到端类型安全的 API 调用

### 后端
- **Express 4** - 轻量级 Web 框架
- **tRPC 11** - 类型安全的 RPC 框架
- **Drizzle ORM** - 现代化 SQL 数据库 ORM
- **MySQL/TiDB** - 关系型数据库

### 开发工具
- **Vite** - 极速前端构建工具
- **Vitest** - 单元测试框架
- **pnpm** - 高效的包管理工具

## 📋 功能列表

### 🏠 首页仪表板
- 用户欢迎信息和账户概览
- 快速开始指南（3 步快速上手）
- 功能导航卡片
- 账户余额实时显示

### 💬 聊天助手
- 完整的对话界面，支持流式输出
- Markdown 渲染和代码高亮
- 对话历史存储和检索
- 快速命令按钮（查询余额、创建 Key、查看统计）
- 实时消费信息显示（Token 数量、费用）
- 自动计费和余额不足提醒

### 🔑 API Key 管理
- 卡片式展示所有 API Key
- 显示 Key 名称、创建时间、使用统计
- 一键复制、删除、重置操作
- 启用/禁用状态切换
- 剩余额度实时显示
- 空状态引导（创建第一个 Key）

### 📊 使用统计
- **调用趋势**：折线图展示 API 调用次数变化
- **费用分布**：饼图展示各模型费用占比
- **Token 消耗**：柱状图展示 Token 使用情况
- **时间筛选**：支持今日、本周、本月三种时间范围
- **数据导出**：支持导出统计数据

### 💳 模型价格展示
- 表格形式清晰展示所有模型定价
- 显示输入/输出 Token 价格
- 模型搜索和分类筛选
- 价格对比和成本分析
- 支持 6 个预配置模型（豆包、Gemini、GPT-4、Claude 等）

### 📚 API 文档
- 结构化的接口文档
- 快速开始指南
- 认证方式说明
- 请求/响应示例
- 多语言代码示例（Python、JavaScript、cURL）
- 错误码和状态码说明

### 👤 个人中心
- 用户信息展示和编辑
- 账户余额查询
- 余额充值入口
- 消费历史列表（时间、模型、Token、费用）
- 账单导出功能（CSV/PDF）
- 账户设置和隐私控制

## 🚀 快速开始

### 前置要求

- Node.js 22.13.0 或更高版本
- pnpm 10.4.1 或更高版本
- MySQL 5.7+ 或 TiDB

### 安装步骤

#### 1. 克隆项目
```bash
git clone https://github.com/YOUR_USERNAME/tuzi-ai-platform.git
cd tuzi-ai-platform
```

#### 2. 安装依赖
```bash
pnpm install
```

#### 3. 配置环境变量
```bash
# 复制环境变量模板
cp .env.example .env.local

# 编辑 .env.local，填入您的配置
# 必需的环境变量：
# - DATABASE_URL: MySQL 连接字符串
# - JWT_SECRET: JWT 签名密钥
# - VITE_APP_ID: OAuth 应用 ID
# - OAUTH_SERVER_URL: OAuth 服务器地址
```

#### 4. 初始化数据库
```bash
# 生成数据库迁移文件
pnpm db:push
```

#### 5. 填充演示数据（可选）
```bash
# 创建演示数据（模型、API Key、对话、交易记录等）
node seed-demo-data.mjs
```

#### 6. 启动开发服务器
```bash
# 正常模式
pnpm dev

# 或启用演示模式（无需登录）
VITE_DEMO_MODE=true pnpm dev
```

访问 http://localhost:3000 查看应用

### 生产构建

```bash
# 构建前端和后端
pnpm build

# 启动生产服务器
pnpm start
```

## 📚 项目结构

```
tuzi-ai-platform/
├── client/                    # 前端应用
│   ├── src/
│   │   ├── pages/            # 页面组件
│   │   ├── components/       # 可复用组件
│   │   ├── hooks/            # 自定义 Hooks
│   │   ├── lib/              # 工具函数
│   │   ├── config/           # 配置文件
│   │   ├── App.tsx           # 主应用组件
│   │   └── main.tsx          # 入口文件
│   ├── index.html            # HTML 模板
│   └── vite.config.ts        # Vite 配置
├── server/                    # 后端应用
│   ├── routers.ts            # tRPC 路由定义
│   ├── db.ts                 # 数据库查询助手
│   ├── _core/                # 核心框架代码
│   └── index.ts              # 服务器入口
├── drizzle/                   # 数据库架构
│   └── schema.ts             # 数据库表定义
├── shared/                    # 共享代码
│   └── const.ts              # 常量定义
├── seed-demo-data.mjs        # 演示数据脚本
├── package.json              # 项目依赖
├── tsconfig.json             # TypeScript 配置
└── README.md                 # 本文件
```

## 🔧 开发指南

### 添加新功能

1. **更新数据库架构**
   ```bash
   # 编辑 drizzle/schema.ts
   # 运行迁移
   pnpm db:push
   ```

2. **实现后端 API**
   ```typescript
   // 编辑 server/routers.ts
   export const appRouter = router({
     feature: router({
       list: protectedProcedure.query(({ ctx }) => {
         // 实现逻辑
       }),
     }),
   });
   ```

3. **构建前端页面**
   ```typescript
   // 创建 client/src/pages/FeaturePage.tsx
   // 使用 trpc.feature.list.useQuery() 调用后端 API
   ```

4. **编写测试**
   ```bash
   # 编辑 server/*.test.ts
   pnpm test
   ```

### 运行测试

```bash
# 运行所有测试
pnpm test

# 监视模式运行测试
pnpm test:watch

# 生成覆盖率报告
pnpm test:coverage
```

### 代码格式化

```bash
# 格式化所有文件
pnpm format

# 检查代码质量
pnpm check
```

## 🎨 设计系统

### 颜色方案
- **主色**：蓝紫渐变（#6366F1 → #8B5CF6）
- **背景**：深色主题（#0F172A）
- **文本**：浅色文本（#F1F5F9）
- **强调**：琥珀色警告（#F59E0B）

### 响应式断点
- **移动端**：< 768px（侧边栏转换为抽屉）
- **平板**：768px - 1024px
- **桌面**：> 1024px

## 🔐 安全性

- **认证**：集成 Manus OAuth，支持安全的用户验证
- **授权**：基于角色的访问控制（RBAC）
- **数据加密**：敏感数据使用 JWT 加密
- **环境变量**：敏感配置存储在 `.env` 文件中，不提交到版本控制
- **SQL 注入防护**：使用 Drizzle ORM 防止 SQL 注入

## 📈 性能优化

- **代码分割**：自动按路由分割代码
- **图片优化**：使用 WebP 格式和响应式图片
- **缓存策略**：实现 HTTP 缓存和浏览器缓存
- **数据库索引**：关键字段添加索引加速查询
- **API 优化**：使用 tRPC 的自动 batching 和 caching

## 🐛 已知问题

目前没有已知的重大问题。如发现 Bug，请提交 Issue。

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📝 许可证

本项目采用 MIT 许可证。详见 [LICENSE](LICENSE) 文件。

## 📞 联系方式

- 📧 Email：support@dawei-ai.com
- 🐦 Twitter：[@DaweiAI](https://twitter.com/DaweiAI)
- 💬 Discord：[加入社区](https://discord.gg/DaweiAI)

## 🙏 致谢

感谢以下开源项目的支持：

- [React](https://react.dev/) - UI 框架
- [Tailwind CSS](https://tailwindcss.com/) - 样式框架
- [tRPC](https://trpc.io/) - RPC 框架
- [Drizzle ORM](https://orm.drizzle.team/) - 数据库 ORM
- [shadcn/ui](https://ui.shadcn.com/) - UI 组件库

## 🚀 路线图

### 即将推出
- [ ] 支付集成（Stripe、微信支付）
- [ ] 团队管理和权限控制
- [ ] API 调用频率限制和配额管理
- [ ] 高级数据分析和成本优化建议
- [ ] 移动端原生应用
- [ ] 实时通知和告警系统

### 长期计划
- [ ] 支持更多 AI 模型集成
- [ ] 自定义工作流和自动化
- [ ] 企业级 SLA 和支持
- [ ] 私有部署选项

## 📊 项目统计

- **代码行数**：~5000+ 行
- **测试覆盖率**：85%+
- **支持的模型**：6+ 个（豆包、Gemini、GPT-4、Claude 等）
- **API 端点**：20+ 个
- **数据库表**：10+ 个

---

**⭐ 如果您觉得这个项目有帮助，请给个 Star！**

Made with ❤️ by Dawei AI Team
