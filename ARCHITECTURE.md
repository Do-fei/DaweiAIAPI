# Dawei AI Platform - 架构设计文档

## 数据库 Schema 设计

### 核心表结构

#### 1. users 表（用户信息）
- `id`: 主键
- `openId`: OAuth 标识符
- `name`: 用户名
- `email`: 邮箱
- `balance`: 账户余额（单位：分）
- `totalSpent`: 总消费金额
- `role`: 用户角色（user/admin）
- `createdAt`: 创建时间
- `updatedAt`: 更新时间

#### 2. apiKeys 表（API Key 管理）
- `id`: 主键
- `userId`: 用户 ID（外键）
- `keyName`: Key 名称
- `keyValue`: 加密的 Key 值
- `status`: 状态（active/inactive）
- `callCount`: 调用次数
- `tokensUsed`: 已使用 Token 数
- `remainingQuota`: 剩余额度（单位：分）
- `lastUsedAt`: 最后使用时间
- `createdAt`: 创建时间
- `updatedAt`: 更新时间

#### 3. models 表（AI 模型配置）
- `id`: 主键
- `modelName`: 模型名称（如 gpt-4, gpt-3.5-turbo）
- `modelType`: 模型类型（chat/image/audio）
- `inputTokenPrice`: 输入 Token 价格（单位：分/1K tokens）
- `outputTokenPrice`: 输出 Token 价格（单位：分/1K tokens）
- `imagePrice`: 图像生成价格（单位：分/张）
- `status`: 状态（active/inactive）
- `createdAt`: 创建时间
- `updatedAt`: 更新时间

#### 4. transactions 表（交易记录）
- `id`: 主键
- `userId`: 用户 ID（外键）
- `apiKeyId`: API Key ID（外键）
- `type`: 交易类型（charge/refund/recharge）
- `model`: 使用的模型
- `inputTokens`: 输入 Token 数
- `outputTokens`: 输出 Token 数
- `amount`: 交易金额（单位：分）
- `status`: 状态（pending/completed/failed）
- `createdAt`: 创建时间

#### 5. conversations 表（对话历史）
- `id`: 主键
- `userId`: 用户 ID（外键）
- `title`: 对话标题
- `model`: 使用的模型
- `status`: 状态（active/archived）
- `createdAt`: 创建时间
- `updatedAt`: 更新时间

#### 6. messages 表（对话消息）
- `id`: 主键
- `conversationId`: 对话 ID（外键）
- `role`: 消息角色（user/assistant/system）
- `content`: 消息内容
- `inputTokens`: 输入 Token 数
- `outputTokens`: 输出 Token 数
- `model`: 使用的模型
- `createdAt`: 创建时间

## 后端 API 设计

### 认证与授权
- Bearer Token 认证（基于 API Key）
- 用户身份验证（基于 OAuth Session）

### 核心 API 端点

#### 用户管理
- `GET /api/trpc/user.profile` - 获取用户信息
- `PUT /api/trpc/user.updateProfile` - 更新用户信息
- `GET /api/trpc/user.balance` - 查询余额
- `GET /api/trpc/user.transactions` - 获取交易记录

#### API Key 管理
- `POST /api/trpc/apiKey.create` - 创建 API Key
- `GET /api/trpc/apiKey.list` - 获取 Key 列表
- `GET /api/trpc/apiKey.detail` - 获取 Key 详情
- `PUT /api/trpc/apiKey.update` - 更新 Key
- `DELETE /api/trpc/apiKey.delete` - 删除 Key
- `POST /api/trpc/apiKey.reset` - 重置 Key

#### 模型与价格
- `GET /api/trpc/model.list` - 获取模型列表
- `GET /api/trpc/model.pricing` - 获取定价信息

#### 聊天与对话
- `POST /api/trpc/chat.send` - 发送聊天消息（支持流式）
- `GET /api/trpc/chat.history` - 获取对话历史
- `POST /api/trpc/chat.create` - 创建新对话
- `DELETE /api/trpc/chat.delete` - 删除对话

#### 统计与分析
- `GET /api/trpc/stats.usage` - 获取使用统计
- `GET /api/trpc/stats.trend` - 获取趋势数据
- `GET /api/trpc/stats.breakdown` - 获取费用分布

## 前端架构

### 页面结构
```
App
├── DashboardLayout
│   ├── Sidebar Navigation
│   │   ├── Chat Assistant
│   │   ├── API Keys
│   │   ├── Usage Statistics
│   │   ├── Model Pricing
│   │   ├── Documentation
│   │   └── Profile
│   ├── TopBar (User Info)
│   └── Content Area
│       ├── ChatPage (AIChatBox)
│       ├── ApiKeysPage
│       ├── StatsPage
│       ├── PricingPage
│       ├── DocsPage
│       └── ProfilePage
```

### 关键组件
- `DashboardLayout`: 主布局容器
- `AIChatBox`: 聊天界面
- `ApiKeyCard`: API Key 卡片
- `StatsChart`: 统计图表
- `PricingTable`: 价格表格

## 计费系统设计

### Token 计费逻辑
1. 用户调用 API 时，记录输入/输出 Token 数
2. 根据模型配置计算费用
3. 实时从用户余额扣费
4. 记录交易明细

### 价格计算公式
```
费用 = (inputTokens / 1000 * inputPrice) + (outputTokens / 1000 * outputPrice)
```

## 安全性考虑

1. API Key 加密存储
2. 请求签名验证
3. 速率限制
4. IP 白名单支持
5. 审计日志记录
