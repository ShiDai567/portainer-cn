# 汉化任务清单

状态：`[ ]` 待处理，`[x]` 已完成（翻译及验证均完成），`[~]` 进行中，`[!]` 存在问题，`[-]` 已核实不适用。每一行是一个可统计的页面组任务；勾选前必须进一步逐页拆分并记录覆盖范围及测试。带条件的 CE/BE、资源类型和权限只说明源码存在，实际可用性待验证；未确认不存在的项目不标 N/A。

当前资源：`translations/{en,zh-CN}/translation.json` 各 248 个字符串叶子；大部分业务页面仍硬编码。除下方明确记录的接入外，其他条目仍仅完成初步路径定位，待逐页盘点、翻译和验证。真实环境验收完成 0/46，代码接入和测试进度另见各条说明；进行中 5/46。真实环境未验收的页面组不勾选。

## 全局与登录
- [~] 导航、侧栏、面包屑、页标题、用户菜单：`app/react/sidebar/`、`app/react/components/PageHeader/`、`app/portainer/views/main/`。
  - 已接入 `navigation.*` 共 78 个 key：`Sidebar.tsx`、`DockerSidebar.tsx`、`KubernetesSidebar/{KubernetesSidebar,KubectlShellButton}.tsx`、`AzureSidebar/AzureSidebar.tsx`、`EdgeComputeSidebar.tsx`、`AppDeliverySidebar.tsx`、`SettingsSidebar.tsx`、`EnvironmentSidebar.tsx`、`items/DashboardLink.tsx`。包含条件菜单，保留原权限和特性条件，不代表 CE 全部可达。
  - 设置、Azure、kubectl 原有导航测试和设置导航即时切换测试已接入；剩余范围须逐项覆盖：`app/react/sidebar/Footer/`（版本提示、版本信息弹窗、CE/BE 版别文案）、`app/react/sidebar/UpgradeBEBanner/`（升级入口、许可申请/上传/校验/升级各弹窗）、`PageHeader/AskAILink.tsx`、`PageHeader/PageHeader.tsx`（刷新提示）、`PageHeader/SidebarToggleButton.tsx`、Header 品牌说明、面包屑调用方及运行验收。外部 HubSpot 表单内容按第三方内容单独核验。
  - `PageHeader/UserMenu.tsx` 已接入 `header.userMenu.*` 4 个 key；本轮补充主题选项、通知菜单/相对时间及文档入口文案，通知内容原始标题/详情保留。`Breadcrumbs.tsx` 仅渲染调用方提供的动态标签，没有可安全翻译的固定文案，仍需检查各调用方传入的标签。
- [~] 登录、内部认证、注销：`app/react/auth/`、`app/portainer/views/auth/`、`app/portainer/views/logout/`，路由 `portainer.auth/logout`。
  - `auth.html` 和 `authController.js` 已接入 `auth.*` 共 21 个 key；包括 OAuth provider 插值、占位符、密码显示提示、进度和内部错误。内部错误随语言切换更新，外部错误和登出原因保留原文。
  - 控制器返回地址回归、内部错误切换/监听清理/外部诊断保留，以及 AngularJS 模板插值和语言选择器测试已补充。剩余注销及上游错误来源、真实内部/OAuth 登录流程回归待做。
- [~] 初始化管理员、Edge 和许可：`app/react/portainer/init/`、`app/portainer/views/init/`，路由 `portainer.init.*`。
  - `InitAdminView/initAdmin.html` 管理员创建及本地/S3 备份恢复模板已接入；`InitEdgeView.tsx` 已接入 `init.edge.*` 14 个 key。本轮补充管理员初始化错误/结果/超时提示、S3/文件选项及 setup token FAQ；许可初始化入口与实际初始化流程验收仍待核对。
- [ ] 首页环境概览与空状态：`app/react/portainer/HomeView/`，路由 `portainer.home`。
- [ ] 通知中心、Toast、后端错误：`app/react/portainer/notifications/`、`app/portainer/services/notifications.ts`、`pkg/libhttp/error/`。
- [ ] 全局按钮、表格、搜索、筛选、分页、加载/空状态：`app/react/components/{buttons,datatables,PaginationControls,ViewLoading}/`。
- [ ] 弹窗、表单、Tooltip、日期/文件/代码编辑器：`app/react/components/{modals,form-components,CodeEditor}/`、`app/portainer/components/`。
- [ ] 错误和超时页面：`app/timeout.ejs`、`app/index.html`；403/404/500 是否有独立页面待逐路由核实。

## 环境
- [ ] 环境列表、详情、连接与权限：`app/react/portainer/environments/{ListView,ItemView}/`、`app/portainer/views/endpoints/`，`portainer.endpoints.*`。
- [ ] 添加 Docker、Kubernetes、Edge、Podman 等环境向导：`app/react/portainer/environments/wizard/`、`app/portainer/react/views/wizard.ts`。
- [ ] 环境组、标签、更新计划及 Edge 脚本：`app/react/portainer/environments/{environment-groups,TagsView,update-schedules,EdgeAutoCreateScriptView}/`。

## Docker 和 Swarm
- [ ] 仪表盘、主机、浏览和事件：`app/react/docker/{DashboardView,host,events}/`、`app/docker/views/host/`。
- [ ] 容器列表、创建、详情及生命周期：`app/react/docker/containers/{ListView,CreateView,ItemView}/`、`app/docker/react/views/containers.ts`。
- [ ] 容器日志、控制台、检查与统计：`app/react/docker/containers/{LogView,ConsoleAttachView,ConsoleExecView,InspectView,StatsView}/`、`app/docker/views/containers/`。
- [ ] 镜像列表、详情、拉取/推送/删除、构建和导入：`app/react/docker/images/`、`app/docker/views/images/`。
- [ ] 存储卷列表、创建、详情和浏览：`app/react/docker/volumes/`、`app/docker/views/volumes/`。
- [ ] 网络列表、创建、详情和驱动/IPAM：`app/react/docker/networks/`、`app/docker/views/networks/`。
- [ ] 堆栈列表、创建、详情、Compose、Git、部署/删除：`app/react/docker/stacks/`、`app/portainer/views/stacks/`。
- [ ] Swarm、节点、任务与服务（含日志）：`app/react/docker/{swarm,tasks,services}/`、`app/docker/views/{swarm,nodes,tasks,services}/`。
- [ ] Docker 配置、密钥、环境仓库访问和功能设置：`app/react/docker/{configs,secrets,setup}/`、`app/docker/views/{configs,secrets,registries,docker-features-configuration}/`。

## Kubernetes
- [ ] 仪表盘、集群、节点、kubectl、设置及安全约束：`app/react/kubernetes/{dashboard,cluster}/`、`app/kubernetes/views/cluster/`。
- [ ] 应用列表、创建、详情、编辑、日志、终端及统计：`app/react/kubernetes/applications/`、`app/kubernetes/views/applications/`；Pod/Deployment/StatefulSet/DaemonSet 相关界面需逐项核对。
- [ ] Kubernetes 堆栈和 YAML 部署：`app/kubernetes/views/{stacks,deploy}/`、`app/react/kubernetes/DeployView/`。
- [ ] 命名空间与访问、配额：`app/react/kubernetes/namespaces/`，`kubernetes.resourcePools.*`。
- [ ] 服务和 Ingress 列表、创建、编辑、详情：`app/react/kubernetes/{services,ingresses}/`。
- [ ] ConfigMap、Secret：`app/react/kubernetes/configs/`、`app/kubernetes/views/configurations/`。
- [ ] 持久卷、持久卷声明、存储类：`app/react/kubernetes/volumes/`、`app/kubernetes/views/volumes/`。
- [ ] Helm 安装、应用、模板和仓库访问：`app/react/kubernetes/helm/`、`app/kubernetes/helm/`、`app/kubernetes/registries/`。
- [ ] Jobs、CronJobs、ServiceAccounts、Roles、ClusterRoles 和绑定：`app/react/kubernetes/more-resources/`、`app/kubernetes/__module.js`。
- [ ] Kubernetes 事件与资源细节：`app/react/kubernetes/components/EventsDatatable/`、`app/kubernetes/models/event/`。

## 身份、权限与设置
- [ ] 用户、团队、角色、资源访问控制：`app/react/portainer/{users,access-control}/`、`app/portainer/rbac/`；角色功能按版本核实。
- [~] 账户、访问令牌、Git 凭据和 Helm 仓库：`app/react/portainer/account/`、`app/portainer/views/account/`、`app/portainer/components/theme/`。
  - 已接入账户标题/面包屑、密码表单与内部通知/确认弹窗、主题选择及通知、应用缓存设置、访问令牌列表/创建/验证/展示/删除、Helm 仓库列表/删除文案。Git 凭据、共享密码提示、Helm 仓库创建/编辑（`helm-repositories/CreateHelmRepositoryView/`、`helm-repositories/components/HelmRepositoryForm.tsx`）等仍待逐项清查；账户路由由 `app/portainer/__module.js` 注册，页面组尚未完成运行验收。
- [ ] 常规、身份验证、LDAP、OAuth、SSO 与安全设置：`app/react/portainer/settings/`、`app/portainer/settings/`、`app/portainer/oauth/`。
- [ ] Edge、云、备份、SSL、系统信息、许可证和更新提示：`app/react/portainer/{settings,licenses,system}/`、`app/portainer/license-management/`；各子功能需核验入口。
- [ ] 仓库列表、添加、详情、仓库内容和环境访问：`app/react/portainer/registries/`、`app/portainer/registry-management/`。
- [ ] 认证日志、活动审计、通知：`app/portainer/user-activity/`（认证日志及 AngularJS 注册）、`app/react/portainer/notifications/`（通知中心 React 视图）；权限与版本条件待核验。

## Edge、Azure 与交付
- [ ] Edge 设备及候选设备、连接状态：`app/react/edge/edge-devices/`、`app/react/edge/components/`。
- [ ] Edge 组、任务、堆栈及模板：`app/react/edge/{edge-groups,edge-jobs,edge-stacks}/`、`app/edge/__module.js`。
- [ ] Azure 仪表盘及容器实例：`app/azure/index.ts`、`app/react/azure/`。
- [ ] 应用模板、自定义模板（Docker/Kubernetes/Edge）：`app/react/portainer/{templates,custom-templates}/`、`app/kubernetes/custom-templates/`。
- [ ] GitOps 源、工作流、Webhook：`app/react/portainer/{gitops,webhooks}/`、`app/portainer/__module.js`。

## 横向覆盖
- [ ] 各模块动态状态、插值、复数、HTML、链接和权限条件；从上述具体页面追踪。
- [ ] 第三方控件、日期时间、编辑器、终端及表单校验：`package.json`、`app/react/components/`；逐依赖核实语言配置和原文边界。
- [~] 语言选择、资源加载、持久化、英文回退及 AngularJS/React 切换：`app/i18n.ts`、`translations/`、`webpack/webpack.common.js`。
  - 共享 i18next 同步加载打包资源，浏览器检测、`i18nextLng` 持久化、禁用存储容错、英文回退、HTML `lang`；登录页 AngularJS 选择器和展开侧栏 React 选择器；`app/portainer/components/i18n.js` 提供 stateful filter 和 digest 同步。
  - 测试入口：`app/i18n.test.ts`、`app/i18n-resources.test.ts`、`app/portainer/components/i18n.test.js`、`app/react/components/LanguageSelector.test.tsx`。资源 key、插值和标签一致性已验证；剩余真实部署、子路径、浏览器持久化与混合页面交互验收待做。
- [ ] 路由注册逐项与嵌套页面盘点、缺漏补录：注册文件清单见 `I18N_PLAN.md`；对隐含入口和模块条件进行核对。
- [ ] 全页面、构建、浏览器兼容性与 Docker/Kubernetes 运行回归；记录环境和结果。
