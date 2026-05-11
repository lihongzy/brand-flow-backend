import mongoose from 'mongoose';
import { Redis } from 'ioredis';
import * as dotenv from 'dotenv';
import * as path from 'path';

// 使用 dotenv 加载环境变量
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function testConnections() {
  console.log('🚀 开始连接测试...');

  // 1. 测试 MongoDB (使用 Mongoose)
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/brand_flow';

  try {
    console.log(`\n[MongoDB] 正在连接: ${mongoUri}`);
    await mongoose.connect(mongoUri);
    console.log('✅ [MongoDB] 连接成功！');

    const TestModel = mongoose.model('TestConnection', new mongoose.Schema({ test: Boolean, timestamp: Date }));
    const testDoc = await TestModel.create({ test: true, timestamp: new Date() });
    console.log('✅ [MongoDB] 写入测试数据成功！');

    const result = await TestModel.findOne({ _id: testDoc._id });
    console.log('✅ [MongoDB] 读取测试数据成功:', result?._id);

    await TestModel.deleteOne({ _id: testDoc._id });
    console.log('✅ [MongoDB] 清理测试数据成功！');
  } catch (err) {
    console.error('❌ [MongoDB] 连接失败:', err.message);
  } finally {
    await mongoose.disconnect();
  }

  // 2. 测试 Redis (使用 ioredis, BullMQ 的依赖)
  const redisHost = process.env.REDIS_HOST || 'localhost';
  const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);

  const redisClient = new Redis({
    host: redisHost,
    port: redisPort,
    maxRetriesPerRequest: null // BullMQ 要求的配置
  });

  try {
    console.log(`\n[Redis] 正在连接: redis://${redisHost}:${redisPort}`);
    await redisClient.set('test_key', 'Connection Test');
    console.log('✅ [Redis] 写入测试数据成功！');

    const value = await redisClient.get('test_key');
    console.log('✅ [Redis] 读取测试数据成功:', value);

    await redisClient.del('test_key');
    console.log('✅ [Redis] 清理测试数据成功！');
    console.log('✅ [Redis] 连接测试成功！');
  } catch (err) {
    console.error('❌ [Redis] 连接失败:', err.message);
  } finally {
    redisClient.disconnect();
  }

  console.log('\n🏁 测试结束。');
}

testConnections();
