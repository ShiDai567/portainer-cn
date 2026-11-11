# 汉化调查与实施计划

## 调查基线（2026-11-11）

- Git 分支 `i18n/zh-CN-localization`，调查 HEAD `72a6e99d70842c07e4a850cd9379b66d54320673`。`package.json` 标识 CE 2.45.3；`git describe` 的 `2.23.0-1291-g72a6e99d70` 是最近可达标签的描述，不是本次产品版本。
- 前端为 React 17、TypeScript、AngularJS 1.8、UI-Router hybrid、Webpack；`app/react/` 与 `app/{portainer,docker,kubernetes,edge,azure}/` 共存，`app/react-tools/` 提供桥接。`app/react/components/`、`app/portainer/components/` 是公共组件；`app/react/sidebar/` 为侧栏。
- 后端主要在 `api/`、`pkg/`：`api/http/handler/` 与 `api/http/middlewares/` 处理 HTTP，Docker、Kubernetes、Edge 等各有目录。`pkg/libhttp/error/error.go` 响应含 `message` 和 `details`；`app/portainer/services/notifications.ts` 从多个错误字段择优并通过 toastr 展示，存在 `Invalid JWT token` 特判。不要修改后端错误协议或翻译该比较值。
- `app/index.js` 加载 `app/i18n.ts`；它初始化 i18next HTTP backend、浏览器语言检测器、react-i18next，`fallbackLng: 'en'`，没有显式 `lng` 或语言检测/缓存配置。语言检测顺序、缓存行为和相对路径在安装版本及实际部署下须测试，不能假设已有设置入口或语言持久化体验。静态代码检索未发现生产代码使用 `useTranslation`、`Trans` 或直接导入 i18next 的页面，也未发现语言切换界面。AngularJS 模板如何响应语言切换尚未建立方案。
- `translations/en/translation.json` 是唯一资源，10 个字符串叶子、2 个顶层分组，含示例；它不是全站文案目录。Webpack `webpack/webpack.common.js` 将 `translations` 复制到 `locales`。无中文资源或其他语言包。页面、JS/TS 模板及通知中大量英文硬编码。
- UI-Router 注册分散：`app/portainer/__module.js`、`app/docker/__module.js`、`app/docker/react/views/containers.ts`、`app/kubernetes/__module.js`、`app/kubernetes/custom-templates/index.js`、`app/edge/__module.js`、`app/azure/index.ts`、`app/portainer/{rbac,registry-management,user-activity}/index.js`、`app/portainer/react/views/{teams,update-schedules,wizard}.ts`。状态有父子、抽象、条件注册及选项卡，并非每个状态都有独立 URL 或页面。清单按功能/页面组追踪；**尚未完成对每个注册项、嵌套视图和运行时可达性的逐项核对**。
- 三方文案至少涉及 `react-select`、CodeMirror、xterm、日期选择器、Formik/Yup/Zod、toastr、Angular UI Bootstrap、Moment/date-fns；具体语言支持及现有本地化配置待逐一核实。Webpack 忽略 Moment locale，不能假设改语言即可显示中文。
- 工具链声明 Node `^22.22.1`、pnpm 10.26.2，Go 1.26.1（CLAUDE.md）；此环境 Node 22.23.4、Go 1.26.10，`pnpm` 不在 PATH 且没有 `node_modules`。`CLAUDE.md` 链接的外部 guidelines 在当前工作区不可用。

## 分阶段

1. **Phase 0 调查中**：文档、页面组和路由注册入口已建立；逐项核对各路由、嵌套视图、条件功能和用户可见字符串，补充可重复的清单与统计。不得将初步目录调查当成全量盘点。
2. **Phase 1 基础设施待处理**：先写可验证的设计和测试，复用现有 i18next，明确 `zh-CN` 资源加载、默认语言政策、语言切换入口、持久化、英文回退、路径前缀及 React/AngularJS 语言变化同步。默认语言尚待确定，不因浏览器检测插件存在而假定已实现。严格保留英文资源。
3. **Phase 2 核心页面待处理**：按公共区域、登录、环境、Docker 仪表盘/容器/镜像/卷/网络/堆栈逐页接入；同时覆盖提示和验证，不批量替换。
4. **Phase 3 高级功能待处理**：Kubernetes、Edge、Azure、仓库、用户权限与设置，核验 CE/BE 及环境类型的可用性。
5. **Phase 4 深度覆盖待处理**：共享控件、动态状态、后端提示及第三方组件；保留外部原始诊断详情。对消息 ID、插值、复数及 HTML 制定自动检查，避免直接匹配任意错误文本。
6. **Phase 5/6 待处理**：跨页面回归、构建、浏览器及 Docker/Kubernetes 部署验证，随后准备中文说明与发布。

## 验证与维护

每项任务按代码路径检查、翻译、测试及页面交互验证；记录命令、环境、结果和未执行原因。优先使用 `pnpm typecheck`、`pnpm lint:ci`（`pnpm lint` 带 `--fix`）、`pnpm test`、`pnpm build`，按需选择测试范围；不用擅自升级依赖。资源检查覆盖 JSON 格式、重复 key、缺失 key、插值/标签一致性；现有仓库未确认提供专用检查脚本，需先设计轻量方案。真实 Docker/Kubernetes 接口测试必须准备环境，不能用静态检查冒充。

新会话先读六份工程文档、检查 `git status` 和当前分支，对照源码复核进行中任务，输出恢复报告，再继续；收尾更新进度、清单、变更记录及新增术语。用户已有更改一律保留。
