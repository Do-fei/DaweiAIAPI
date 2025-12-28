import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

try {
  console.log('🌱 开始填充演示数据...\n');

  // 1. 获取演示用户（假设已存在）
  const [users] = await connection.query('SELECT id, openId, name FROM users LIMIT 1');
  if (users.length === 0) {
    console.log('❌ 未找到用户，请先登录创建用户');
    process.exit(1);
  }

  const demoUserId = users[0].id;
  const demoUserName = users[0].name;
  console.log(`✓ 使用演示用户: ${demoUserName} (ID: ${demoUserId})\n`);

  // 2. 创建模型配置
  console.log('📦 创建模型配置...');
  const models = [
    {
      modelName: 'Doubao-pro',
      modelType: 'chat',
      inputTokenPrice: 0.0005,
      outputTokenPrice: 0.0015,
      description: '字节跳动豆包大模型 Pro 版本'
    },
    {
      modelName: 'Doubao-lite',
      modelType: 'chat',
      inputTokenPrice: 0.0001,
      outputTokenPrice: 0.0003,
      description: '字节跳动豆包大模型 Lite 版本'
    },
    {
      modelName: 'Gemini-1.5-pro',
      modelType: 'chat',
      inputTokenPrice: 0.00075,
      outputTokenPrice: 0.003,
      description: 'Google Gemini 1.5 Pro'
    },
    {
      modelName: 'Gemini-1.5-flash',
      modelType: 'chat',
      inputTokenPrice: 0.000075,
      outputTokenPrice: 0.0003,
      description: 'Google Gemini 1.5 Flash'
    },
    {
      modelName: 'GPT-4-turbo',
      modelType: 'chat',
      inputTokenPrice: 0.01,
      outputTokenPrice: 0.03,
      description: 'OpenAI GPT-4 Turbo'
    },
    {
      modelName: 'Claude-3-opus',
      modelType: 'chat',
      inputTokenPrice: 0.015,
      outputTokenPrice: 0.075,
      description: 'Anthropic Claude 3 Opus'
    }
  ];

  for (const model of models) {
    await connection.query(
      'INSERT IGNORE INTO models (modelName, modelType, inputTokenPrice, outputTokenPrice, status) VALUES (?, ?, ?, ?, ?)',
      [model.modelName, model.modelType, model.inputTokenPrice, model.outputTokenPrice, 'active']
    );
  }
  console.log(`✓ 创建了 ${models.length} 个模型配置\n`);

  // 3. 创建 API Keys
  console.log('🔑 创建 API Keys...');
  const apiKeys = [
    { keyName: '生产环境 - 豆包', model: 'Doubao-pro' },
    { keyName: '测试环境 - Gemini', model: 'Gemini-1.5-pro' },
    { keyName: '备用 Key - GPT-4', model: 'GPT-4-turbo' }
  ];

  for (const key of apiKeys) {
    const keyValue = `sk_${Math.random().toString(36).substr(2, 32)}`;
    await connection.query(
      'INSERT INTO apiKeys (userId, keyName, keyValue, status, remainingQuota) VALUES (?, ?, ?, ?, ?)',
      [demoUserId, key.keyName, keyValue, 'active', 0]
    );
  }
  console.log(`✓ 创建了 ${apiKeys.length} 个 API Key\n`);

  // 4. 创建对话
  console.log('💬 创建对话历史...');
  const conversations = [
    { title: '豆包模型性能测试', model: 'Doubao-pro' },
    { title: 'Gemini 多模态能力探索', model: 'Gemini-1.5-pro' },
    { title: 'API 集成方案讨论', model: 'GPT-4-turbo' }
  ];

  const conversationIds = [];
  for (const conv of conversations) {
    const [result] = await connection.query(
      'INSERT INTO conversations (userId, title, model, status) VALUES (?, ?, ?, ?)',
      [demoUserId, conv.title, conv.model, 'active']
    );
    conversationIds.push(result.insertId);
  }
  console.log(`✓ 创建了 ${conversations.length} 个对话\n`);

  // 5. 创建消息记录
  console.log('📝 创建消息记录...');
  const messageData = [
    {
      convIndex: 0,
      messages: [
        { role: 'user', content: '豆包模型在处理中文文本时的性能如何？' },
        { role: 'assistant', content: '豆包模型在中文文本处理方面表现出色，具有以下优势：\n\n1. **中文理解能力强**：针对中文语境进行了深度优化\n2. **低延迟**：平均响应时间在 200ms 以内\n3. **成本效益高**：相比其他模型，价格更具竞争力\n4. **多任务支持**：支持文本生成、摘要、翻译等多种任务\n\n建议在生产环境中使用 Doubao-pro 版本以获得最佳效果。' },
        { role: 'user', content: '能否提供具体的 API 调用示例？' },
        { role: 'assistant', content: '当然可以！以下是 Python 中的调用示例：\n\n```python\nimport requests\n\nheaders = {\n    "Authorization": "Bearer YOUR_API_KEY",\n    "Content-Type": "application/json"\n}\n\ndata = {\n    "model": "Doubao-pro",\n    "messages": [\n        {"role": "user", "content": "你好，请介绍一下自己"}\n    ]\n}\n\nresponse = requests.post(\n    "https://api.dawei-ai.com/v1/chat/completions",\n    headers=headers,\n    json=data\n)\n\nprint(response.json())\n```\n\n响应格式为标准的 OpenAI 兼容格式，便于集成。' }
      ]
    },
    {
      convIndex: 1,
      messages: [
        { role: 'user', content: 'Gemini 1.5 Pro 的多模态能力包括哪些？' },
        { role: 'assistant', content: 'Gemini 1.5 Pro 提供强大的多模态能力：\n\n**支持的输入类型：**\n- 📄 文本\n- 🖼️ 图像（JPEG、PNG、GIF、WebP）\n- 🎥 视频（MP4、MPEG、MOV、AVI）\n- 🎵 音频（MP3、WAV、AIFF、AAC）\n- 📊 PDF 文档\n\n**应用场景：**\n- 图像分析和OCR\n- 视频内容理解\n- 文档智能处理\n- 多媒体内容生成\n\n这使得 Gemini 成为处理复杂多媒体任务的理想选择。' },
        { role: 'user', content: '价格和配额限制是多少？' },
        { role: 'assistant', content: '**Gemini 1.5 Pro 定价：**\n\n- 输入 Token：$0.00075 / 1K tokens\n- 输出 Token：$0.003 / 1K tokens\n\n**配额限制：**\n- 免费层：每分钟 60 请求\n- 付费层：根据订阅等级调整\n- 单个请求最大 Token：100,000\n\n**建议：**\n对于企业级应用，建议选择付费计划以获得更高的配额和优先支持。' }
      ]
    },
    {
      convIndex: 2,
      messages: [
        { role: 'user', content: '如何在现有系统中集成多个 AI 模型？' },
        { role: 'assistant', content: '集成多个 AI 模型的最佳实践：\n\n**1. 统一接口设计**\n```\nGET /api/models - 获取可用模型列表\nPOST /api/chat - 发送聊天请求\nGET /api/usage - 查询使用统计\n```\n\n**2. 模型路由策略**\n- 基于成本优化\n- 基于性能优化\n- 基于功能需求\n- 基于地域优化\n\n**3. 错误处理和降级**\n- 实现模型故障转移\n- 设置超时重试机制\n- 记录详细的错误日志\n\n**4. 监控和分析**\n- 实时追踪 Token 消耗\n- 成本分析和优化\n- 性能基准测试\n\n这样可以最大化系统的灵活性和成本效益。' }
      ]
    }
  ];

  let totalMessages = 0;
  for (const data of messageData) {
    const convId = conversationIds[data.convIndex];
    for (const msg of data.messages) {
      await connection.query(
        'INSERT INTO messages (conversationId, role, content, model) VALUES (?, ?, ?, ?)',
        [convId, msg.role, msg.content, conversations[data.convIndex].model]
      );
      totalMessages++;
    }
  }
  console.log(`✓ 创建了 ${totalMessages} 条消息记录\n`);

  // 6. 创建交易记录（模拟使用数据）
  console.log('💰 创建交易记录...');
  const transactions = [
    { model: 'Doubao-pro', inputTokens: 150, outputTokens: 450, amount: 95 },
    { model: 'Doubao-lite', inputTokens: 200, outputTokens: 600, amount: 25 },
    { model: 'Gemini-1.5-pro', inputTokens: 300, outputTokens: 800, amount: 285 },
    { model: 'GPT-4-turbo', inputTokens: 100, outputTokens: 250, amount: 1200 },
    { model: 'Doubao-pro', inputTokens: 180, outputTokens: 520, amount: 110 },
    { model: 'Gemini-1.5-flash', inputTokens: 250, outputTokens: 700, amount: 30 },
    { model: 'Claude-3-opus', inputTokens: 120, outputTokens: 380, amount: 3150 },
    { model: 'Doubao-pro', inputTokens: 160, outputTokens: 480, amount: 100 },
  ];

  for (const txn of transactions) {
    await connection.query(
      'INSERT INTO transactions (userId, model, type, amount, inputTokens, outputTokens, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [demoUserId, txn.model, 'charge', txn.amount, txn.inputTokens, txn.outputTokens, 'completed']
    );
  }
  console.log(`✓ 创建了 ${transactions.length} 条交易记录\n`);

  // 7. 更新用户余额和消费统计
  console.log('📊 更新用户统计...');
  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
  const initialBalance = 50000; // 500 元初始余额
  const currentBalance = initialBalance - totalSpent;

  await connection.query(
    'UPDATE users SET balance = ?, totalSpent = ? WHERE id = ?',
    [currentBalance, totalSpent, demoUserId]
  );
  console.log(`✓ 用户初始余额: ¥${(initialBalance / 100).toFixed(2)}`);
  console.log(`✓ 已消费: ¥${(totalSpent / 100).toFixed(2)}`);
  console.log(`✓ 剩余余额: ¥${(currentBalance / 100).toFixed(2)}\n`);

  console.log('✅ 演示数据填充完成！\n');
  console.log('📈 数据统计：');
  console.log(`  - 模型数量: ${models.length}`);
  console.log(`  - API Key 数量: ${apiKeys.length}`);
  console.log(`  - 对话数量: ${conversations.length}`);
  console.log(`  - 消息数量: ${totalMessages}`);
  console.log(`  - 交易记录: ${transactions.length}`);
  console.log('\n🎉 现在可以开始演示了！');

} catch (error) {
  console.error('❌ 错误:', error.message);
  process.exit(1);
} finally {
  await connection.end();
}
