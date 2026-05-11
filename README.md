# Brand Flow Backend


## 目录结构

```text
src/
├── common/                        # 公共基础层
│   ├── config/                    # 配置管理 (环境变量校验与读取)
│   ├── filters/                   # 全局异常过滤器 (统一错误输出)
│   └── interceptors/              # 全局拦截器 (统一响应格式)
│
├── modules/                       # 业务逻辑层
│   ├── projects/                  # 项目模块 (核心：版本分支树、项目持久化)
│   │   ├── schemas/               # MongoDB 数据模型 (Project, Version)
│   │   ├── dto/                   # 输入校验对象
│   │   └── projects.service.ts    # 业务逻辑
│   ├── tasks/                     # 任务调度模块 (BullMQ 生产者与消费者)
│   │   ├── processors/            # 队列 Worker (调用外部 Agent 服务)
│   │   └── tasks.service.ts       # 任务入队与状态跟踪
│   ├── agent-bridge/              # Agent 通信桥接 (处理请求分发与回调)
│   ├── notification/              # 实时推送模块 (WebSocket 网关)
│   └── knowledge/                 # 品牌知识库模块 (品牌资产管理)
│
├── types/                         # 全局类型定义 (与 Agent 共享的状态类型)
├── app.module.ts                  # 根模块 (各业务模块组装)
└── main.ts                        # 入口文件 (全局配置)
```

### 环境准备

1. 运行docker: `docker-compose up -d`
2. 复制配置文件: `cp .env.example .env`

### 运行项目

```bash
# 安装依赖
pnpm install

# 启动
pnpm run start:dev
```

### 数据库测试

```bash
npx ts-node test/test-db.ts
```
