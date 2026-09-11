# 艾欧泽亚因果信笺

## 项目概览

这是一个使用 React 19、TypeScript、Vite 和 Zustand 开发的纯前端叙事游戏。玩家通过调整信件段落顺序改变因果关系，内容、规则和存档逻辑全部在浏览器中运行，没有 API、数据库或服务端运行时。

## 目录约定

- `src/content/`：章节、信件、角色、术语和结局等游戏内容；新增剧情优先遵循现有章节和信件结构。
- `src/engine/`：因果、连续性、错位和角色追踪等纯函数规则，尽量保持无 DOM、无副作用。
- `src/game/`：游玩流程、进度、结局、音频和存档行为。
- `src/store/`：Zustand 游戏状态及自动存档接入。
- `src/ui/`：React 页面和交互组件；全局样式在 `src/styles.css`。
- `src/__tests__/continuity/`：剧情连续性和规则校验测试。
- `docs/`：产品需求、故事圣经、信件规格和连续性约束。

## 常用命令

```bash
npm install
npm run dev       # 本地开发服务器
npm run build     # TypeScript 检查并生成 dist/
npm test          # 全部 Vitest 测试
npm run validate  # 连续性测试
```

## Docker 部署

根目录的 `Dockerfile` 使用 Node 构建 Vite 静态产物，再使用 Nginx 提供 `dist/`。`docker-compose.yml` 将容器 80 端口映射到主机 80 端口，适用于通过服务器公网 IP 访问：

```bash
docker compose up -d --build
# 浏览器访问 http://<服务器公网IP>/
docker compose logs -f web
docker compose down
```

需要确保云主机安全组、防火墙允许入站 TCP 80；公网 DNS、HTTPS 和 TLS 终止不包含在当前配置中。Nginx 已为 `/assets/` 配置长期缓存，并将未知路径回退到 `index.html`，支持前端路由刷新。

## 修改指南

新增或修改剧情后运行 `npm run validate`，涉及 UI 或构建时再运行 `npm run build`。不要手动编辑 `dist/`，它是构建产物且被 Git 忽略。存档使用浏览器 `localStorage`，修改存档结构时需要考虑旧存档读取失败时的降级行为。
