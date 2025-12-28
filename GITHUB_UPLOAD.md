# 上传项目到 GitHub 指南

本指南将帮助您将 Dawei AI Platform 项目上传到 GitHub。

## 前置条件

1. **GitHub 账户**：如果还没有，请访问 [github.com](https://github.com) 注册
2. **Git 已安装**：检查是否安装了 Git
   ```bash
   git --version
   ```
3. **GitHub CLI 已配置**（可选）：用于更方便地创建远程仓库

## 方式一：使用 GitHub Web 界面（推荐新手）

### 步骤 1：在 GitHub 创建新仓库

1. 登录 GitHub 账户
2. 点击右上角 `+` 图标，选择 "New repository"
3. 填写仓库信息：
   - **Repository name**：`tuzi-ai-platform` 或其他名称
   - **Description**：`Dawei AI Platform - AI 服务聚合平台`
   - **Public/Private**：选择公开或私有
   - **Initialize this repository with**：不勾选（因为我们已有本地代码）
4. 点击 "Create repository"

### 步骤 2：在本地初始化 Git 仓库

```bash
cd /home/ubuntu/tuzi-ai-platform

# 初始化 Git 仓库
git init

# 配置 Git 用户信息（如果还没配置）
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 添加所有文件
git add .

# 创建首次提交
git commit -m "Initial commit: Dawei AI Platform - 完整的 AI 服务聚合平台"
```

### 步骤 3：连接远程仓库并推送

```bash
# 添加远程仓库（将 YOUR_USERNAME 和 tuzi-ai-platform 替换为实际值）
git remote add origin https://github.com/YOUR_USERNAME/tuzi-ai-platform.git

# 重命名默认分支为 main（如果需要）
git branch -M main

# 推送代码到 GitHub
git push -u origin main
```

## 方式二：使用 GitHub CLI（推荐有经验的开发者）

### 步骤 1：安装 GitHub CLI

```bash
# 如果还没安装
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh
```

### 步骤 2：登录 GitHub

```bash
gh auth login
# 按照提示选择：
# - What is your preferred protocol for Git operations? HTTPS
# - Authenticate Git with your GitHub credentials? Yes
# - How would you like to authenticate GitHub CLI? Paste an authentication token
```

### 步骤 3：创建仓库并推送

```bash
cd /home/ubuntu/tuzi-ai-platform

# 初始化 Git 仓库
git init
git add .
git commit -m "Initial commit: Dawei AI Platform - 完整的 AI 服务聚合平台"

# 使用 GitHub CLI 创建远程仓库
gh repo create tuzi-ai-platform --source=. --remote=origin --push --public

# 或者创建私有仓库
gh repo create tuzi-ai-platform --source=. --remote=origin --push --private
```

## 方式三：使用 SSH 密钥（最安全）

### 步骤 1：生成 SSH 密钥

```bash
# 生成 SSH 密钥（如果还没有）
ssh-keygen -t ed25519 -C "your.email@example.com"

# 或者使用 RSA（兼容性更好）
ssh-keygen -t rsa -b 4096 -C "your.email@example.com"

# 启动 SSH 代理
eval "$(ssh-agent -s)"

# 添加私钥到代理
ssh-add ~/.ssh/id_ed25519  # 或 ~/.ssh/id_rsa
```

### 步骤 2：在 GitHub 添加公钥

1. 复制公钥内容：
   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```
2. 登录 GitHub，进入 Settings → SSH and GPG keys
3. 点击 "New SSH key"，粘贴公钥内容，保存

### 步骤 3：推送代码

```bash
cd /home/ubuntu/tuzi-ai-platform

git init
git add .
git commit -m "Initial commit: Dawei AI Platform"

# 使用 SSH 地址（从 GitHub 仓库页面复制）
git remote add origin git@github.com:YOUR_USERNAME/tuzi-ai-platform.git
git branch -M main
git push -u origin main
```

## 重要：配置 .gitignore

项目已包含 `.gitignore` 文件，确保以下文件不会被上传：

```
node_modules/
dist/
.env
.env.local
.env.demo
.DS_Store
*.log
.vscode/
.idea/
```

如果需要修改 `.gitignore`，编辑项目根目录的 `.gitignore` 文件。

## 环境变量处理

**重要**：不要上传包含敏感信息的 `.env` 文件！

### 创建 `.env.example` 模板

```bash
# 在项目根目录创建 .env.example
cp .env .env.example

# 编辑 .env.example，删除所有敏感值，只保留变量名
# 例如：
# DATABASE_URL=
# JWT_SECRET=
# VITE_APP_ID=
```

### 在 README 中说明

在 `README.md` 中添加：

```markdown
## 环境变量配置

1. 复制 `.env.example` 为 `.env.local`
2. 填入您的实际配置值
3. 不要提交 `.env` 文件到版本控制
```

## 推送后的验证

推送成功后，验证以下内容：

1. 访问 GitHub 仓库页面，确认代码已上传
2. 检查文件结构是否完整
3. 查看提交历史是否正确
4. 确认敏感文件（`.env`、`node_modules` 等）未被上传

## 常见问题

### Q: 推送时出现 "Permission denied" 错误

**A**: 检查以下几点：
- 确认已配置 GitHub 凭证（HTTPS 需要 Personal Access Token，SSH 需要密钥）
- 确认仓库 URL 正确
- 确认有推送权限

### Q: 如何更新已上传的代码？

**A**: 进行本地修改后，使用以下命令：
```bash
git add .
git commit -m "描述您的更改"
git push origin main
```

### Q: 如何删除已上传的敏感文件？

**A**: 使用 `git rm` 删除文件，然后推送：
```bash
git rm --cached .env
git commit -m "Remove .env file"
git push origin main
```

### Q: 如何克隆已上传的项目？

**A**: 在其他机器上使用：
```bash
git clone https://github.com/YOUR_USERNAME/tuzi-ai-platform.git
cd tuzi-ai-platform
npm install
```

## 推荐的 GitHub 配置

### 添加 README.md

创建详细的项目说明文档，包括：
- 项目描述
- 功能特性
- 技术栈
- 安装和运行步骤
- 环境变量配置
- 贡献指南

### 添加 LICENSE

选择合适的开源协议（如 MIT、Apache 2.0 等）

### 启用 GitHub Pages（可选）

如果需要部署项目文档或演示页面，可启用 GitHub Pages

## 后续维护

### 定期提交

```bash
# 查看修改状态
git status

# 查看修改内容
git diff

# 提交修改
git add .
git commit -m "描述修改内容"
git push origin main
```

### 创建分支进行开发

```bash
# 创建新分支
git checkout -b feature/new-feature

# 进行开发和提交
git add .
git commit -m "Add new feature"

# 推送分支
git push origin feature/new-feature

# 在 GitHub 上创建 Pull Request，合并到 main 分支
```

## 获取帮助

- GitHub 官方文档：https://docs.github.com
- Git 官方文档：https://git-scm.com/doc
- GitHub CLI 文档：https://cli.github.com/manual
