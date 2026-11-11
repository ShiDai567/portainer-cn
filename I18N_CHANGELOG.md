# 汉化工程变更记录

## 2026-11-11

- 模块：Header 用户菜单与初始化管理员/Edge 页面。
- 内容：用户菜单及管理员创建、本地/S3 备份恢复、Edge 首次配置接入 i18next；AngularJS 模板复用 `portainerTranslate`。核查通用面包屑组件仅消费动态标签，无固定文案可翻译。
- 文件：`app/react/components/PageHeader/UserMenu.tsx`、`app/react/portainer/init/InitEdgeView/InitEdgeView.tsx`、`app/portainer/views/init/admin/initAdmin.html`、`translations/en/translation.json`、`translations/zh-CN/translation.json`、`I18N_CHECKLIST.md`、`I18N_PROGRESS.md`、`I18N_CHANGELOG.md`。
- 新增翻译：中英文各 48 条；真实验收完成页面组仍为 0，进行中 4/46。
- 测试：待执行。

## 2026-11-11

### 首批导航、登录和语言基础设施

- 10 个子 agent 按文件并行实施，统一使用 i18next key，保留英文资源及组件英文默认值。
- 新增 `translations/zh-CN/translation.json`，中文 110 条；英文由 10 条扩展至 110 条。分类为导航 78、登录 21、语言选择 1、既有访问令牌/示例资源 10。资源数量不等于全产品覆盖率，访问令牌页面本身尚未接入翻译。
- `app/i18n.ts` 改为中英文资源静态打包、同步初始化；优先记忆语言选择，然后按浏览器语言偏好检测，非中英文回退英文；保存 `i18nextLng`，存储禁用时容错；同步 HTML `lang`。
- `app/portainer/components/i18n.js` 增加 `portainerTranslate` stateful filter、语言变化 digest 桥接和登录页语言选择组件；`app/react/components/LanguageSelector.tsx` 在展开侧栏提供同一语言实例的选择入口。
- 导航接入：`app/react/sidebar/{Sidebar,DockerSidebar,EdgeComputeSidebar,AppDeliverySidebar,SettingsSidebar,EnvironmentSidebar}.tsx`、`KubernetesSidebar/{KubernetesSidebar,KubectlShellButton}.tsx`、`AzureSidebar/AzureSidebar.tsx`、`items/DashboardLink.tsx`。保留原有权限、CE/BE 条件、路由、参数和 data-cy；用户环境名保持原文。
- 登录接入：`app/portainer/views/auth/{auth.html,authController.js}`，覆盖登录方式、provider 插值、表单、提示、进度和内部错误；内部错误随语言改变重新翻译并在销毁时取消监听，外部错误和原始诊断保留。
- 依赖：使用项目锁定的 pnpm 10.26.2，`corepack pnpm install --frozen-lockfile --ignore-pnpmfile` 成功；普通 frozen 安装因既有 pnpm 插件 checksum 不匹配失败。未修改 `package.json` 或 `pnpm-lock.yaml`。
- 验证：8 个相关测试文件共 160 项通过；新增设置导航中英文切换断言后，该文件 23 项再次通过，相关唯一测试累计 161 项。覆盖语言检测/选择/刷新持久化/禁用存储/英文回退、资源 key/插值/标签一致性、React 和 AngularJS 实时更新、控制器返回地址及诊断保留、设置/Azure/kubectl 导航回归。`corepack pnpm typecheck`、`corepack pnpm build`、改动文件 Prettier 和 `git diff --check` 通过；改动 JS/TS/TSX 的 ESLint 0 errors，3 条警告来自环境导航原有动态组件代码。
- 构建提示：缺少可选 `.env`、Browserslist 数据过期、既有 lodash Babel 插件使用已弃用 API；Webpack 最终编译成功。未升级依赖或修改这些无关配置。
- 未执行：真实浏览器/子路径部署、内部及 OAuth 登录、Docker/Kubernetes 后端交互回归。0/46 页面组完成验收，3/46 进行中；完整路由/文案清查和其他业务页面尚未完成。

### 初始调查

- 模块：Phase 0 工程调查与进度管理。
- 内容：调查版本、源码结构、i18next、英文资源、路由入口和错误处理；建立 PRD、计划、进度、检查清单、术语表和本记录。清单是页面组初步基线，不声称全路由/字符串盘点已完成。
- 文件：`PRD.md`、`I18N_PLAN.md`、`I18N_PROGRESS.md`、`I18N_CHECKLIST.md`、`I18N_GLOSSARY.md`、`I18N_CHANGELOG.md`。
- 新增中文翻译条目：0；业务代码问题修复：0。
- 测试：英文 JSON 解析及字符串叶子计数通过（10）；路由注册入口和 i18n 引用静态检索完成。构建、类型检查、ESLint、单测及运行时回归未执行：未安装前端依赖，pnpm 不在 PATH，且本次只修改文档。完整路由及文案盘点未完成。
