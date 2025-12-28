# 环境变量配置指南

本文档说明如何配置 Dawei AI Platform 的环境变量。

## 快速开始

1. 复制环境变量模板：
   ```bash
   cp .env.example .env.local
   ```

2. 编辑 `.env.local` 文件，填入您的实际配置值

3. 重启开发服务器使配置生效

## 环境变量说明

### 数据库配置

**DATABASE_URL**
- 类型：字符串
- 必需：是
- 说明：MySQL 或 TiDB 数据库连接字符串
- 示例：`mysql://user:password@localhost:3306/dawei_ai_platform`

### JWT 配置

**JWT_SECRET**
- 类型：字符串
- 必需：是
- 说明：JWT 签名密钥，用于生成和验证 Token
- 建议：使用至少 32 个字符的随机字符串
- 生成方法：`openssl rand -base64 32`

### OAuth 配置

**VITE_APP_ID**
- 类型：字符串
- 必需：是
- 说明：OAuth 应用 ID（从 Manus 平台获取）

**OAUTH_SERVER_URL**
- 类型：字符串
- 必需：是
- 说明：OAuth 服务器地址
- 示例：`https://api.manus.im`

**VITE_OAUTH_PORTAL_URL**
- 类型：字符串
- 必需：是
- 说明：OAuth 登录门户 URL
- 示例：`https://oauth.manus.im`

### 所有者信息

**OWNER_NAME**
- 类型：字符串
- 必需：否
- 说明：项目所有者的名称

**OWNER_OPEN_ID**
- 类型：字符串
- 必需：否
- 说明：项目所有者的 OpenID（用于权限控制）

### Forge API 配置（后端）

**BUILT_IN_FORGE_API_URL**
- 类型：字符串
- 必需：是
- 说明：Manus Forge API 服务地址
- 示例：`https://forge.manus.im`

**BUILT_IN_FORGE_API_KEY**
- 类型：字符串
- 必需：是
- 说明：Manus Forge API 密钥（后端使用）
- 注意：不要在客户端代码中使用

### Forge API 配置（前端）

**VITE_FRONTEND_FORGE_API_URL**
- 类型：字符串
- 必需：是
- 说明：Manus Forge API 服务地址（前端使用）
- 示例：`https://forge.manus.im`

**VITE_FRONTEND_FORGE_API_KEY**
- 类型：字符串
- 必需：是
- 说明：Manus Forge API 密钥（前端使用）

### 分析配置

**VITE_ANALYTICS_ENDPOINT**
- 类型：字符串
- 必需：否
- 说明：分析服务端点 URL

**VITE_ANALYTICS_WEBSITE_ID**
- 类型：字符串
- 必需：否
- 说明：分析网站 ID

### 应用配置

**VITE_APP_TITLE**
- 类型：字符串
- 必需：否
- 默认值：`Dawei AI Platform`
- 说明：应用标题（显示在浏览器标签和页面头部）

**VITE_APP_LOGO**
- 类型：字符串
- 必需：否
- 默认值：`/logo.svg`
- 说明：应用 Logo 路径（相对于 public 目录）

### 演示模式

**VITE_DEMO_MODE**
- 类型：布尔值（true/false）
- 必需：否
- 默认值：`false`
- 说明：启用免登录演示模式
- 用法：`VITE_DEMO_MODE=true pnpm dev`

## 环境变量优先级

环境变量的加载顺序如下（后面的覆盖前面的）：

1. `.env` - 通用配置（不提交到版本控制）
2. `.env.local` - 本地开发配置（不提交到版本控制）
3. `.env.demo` - 演示模式配置（可提交）
4. 系统环境变量 - 最高优先级

## 不同环境的配置

### 开发环境

```bash
# .env.local
DATABASE_URL=mysql://root:password@localhost:3306/dawei_ai_dev
JWT_SECRET=your-dev-secret-key-here
VITE_APP_ID=dev-app-id
OAUTH_SERVER_URL=https://api-dev.manus.im
# ... 其他配置
```

### 生产环境

```bash
# 通过系统环境变量或 .env 文件设置
DATABASE_URL=mysql://user:secure-password@prod-db.example.com:3306/dawei_ai
JWT_SECRET=your-prod-secret-key-very-secure
VITE_APP_ID=prod-app-id
OAUTH_SERVER_URL=https://api.manus.im
# ... 其他配置
```

### 演示环境

```bash
# .env.demo
VITE_DEMO_MODE=true
# 其他配置与开发环境相同
```

## 安全最佳实践

1. **不要提交敏感信息**
   - 不要将 `.env` 或 `.env.local` 提交到版本控制
   - 确保 `.gitignore` 包含这些文件

2. **使用强密钥**
   - JWT_SECRET 应该是随机的、足够长的字符串
   - 不要使用简单或容易猜测的密钥

3. **定期轮换密钥**
   - 定期更新 API 密钥和 JWT 密钥
   - 在发现泄露时立即轮换

4. **环境隔离**
   - 开发、测试、生产环境使用不同的配置
   - 不要在生产环境中启用调试模式

5. **访问控制**
   - 限制谁可以访问环境变量
   - 使用密钥管理服务（如 AWS Secrets Manager）

## 故障排除

### 问题：应用无法连接数据库

**解决方案**：
1. 检查 DATABASE_URL 是否正确
2. 确认数据库服务正在运行
3. 验证数据库用户名和密码
4. 检查防火墙和网络连接

### 问题：OAuth 登录失败

**解决方案**：
1. 检查 VITE_APP_ID 是否正确
2. 验证 OAUTH_SERVER_URL 是否可访问
3. 确认 OAuth 应用配置正确
4. 检查浏览器控制台的错误信息

### 问题：API 调用返回 401 Unauthorized

**解决方案**：
1. 检查 JWT_SECRET 是否正确
2. 验证 Token 是否过期
3. 确认 BUILT_IN_FORGE_API_KEY 是否正确
4. 检查请求头中的授权信息

### 问题：前端无法访问 API

**解决方案**：
1. 检查 VITE_FRONTEND_FORGE_API_URL 是否正确
2. 验证 CORS 配置
3. 确认前端和后端都在运行
4. 检查浏览器网络请求

## 更多帮助

- 查看 [README.md](README.md) 了解项目概述
- 查看 [DEMO_MODE.md](DEMO_MODE.md) 了解演示模式
- 查看 [GITHUB_UPLOAD.md](GITHUB_UPLOAD.md) 了解如何上传到 GitHub
