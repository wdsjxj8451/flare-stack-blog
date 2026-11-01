# 首页、文章列表与标签页：修改及审核说明

发布授权：用户已于 2026-11-01 审核通过，授权提交并推送 GitHub，由已连接的 Cloudflare Workers Builds 自动部署。下方“等待审核／未推送”是各轮验证时的历史状态；最终发布结果以本次提交及部署记录为准。

发布检查补充：Windows 的 Bun 无法直接执行 `./node_modules/typescript/bin/tsc` 这个无扩展名启动文件，推送钩子因此中断；`typecheck` 和 `check` 已改为通过 `node` 显式运行同一启动文件，没有替换编译器或跳过检查。真实 TypeScript 7 检查已通过。

本次沿用现有 React + TanStack Start + Tailwind CSS 4 + Cloudflare Workers。项目并非 Astro，因此不新增 `astro.config.mjs`，也不把已有内容迁移到文件式博客。这样可以保留后台、数据、文章地址和现有部署流程。

## 当前审核版本：随机二次元背景与个人手记首页

随机背景说明覆盖下方历史验证轮次中的每日选图规则；较早轮次的日期和 ID 描述仅作历史记录。

本节是最新设计说明，取代下方历史轮次中对旧首页、透明度和侧栏的描述。

- 背景按最新要求改为纯随机：浏览器完整打开或刷新页面后，向官方 `?type=url` 接口请求一个随机图片地址，不传图片 ID，不再依赖日期或图库数量。用同一个 Provider 将已验证能加载的地址共享给首页封面和全站亚克力背景。站内跳转保持当前图片；无跨天定时器。每次尝试最多 8 秒、最多 3 次，失败使用本地底图。模糊、遮罩与阅读页样式保持不变。
- 首页改为封面、站长介绍、文字签名卡、细线分隔和双列文章。没有复制参考图的柱子、终端窗口或布局细节；手机自动切为单列。
- 删除公开页的作者侧栏，站长介绍集中在首页；分类、标签仍可从原有页面和文章链接访问。
- 字标按最新要求改为 `Jin's Blog`，首页和顶栏统一使用本地 `Dancing Script` 400 连笔字体。参考截图给出的是 SVG 路径，无法从截图确定原字体名称，因此这里采用视觉接近的字体；没有复制参考站的 SVG。旧中文默认站名读取时兼容为新名称，其他自定义名称仍保留。
- 卡片、签名卡、导航和菜单共享 18px 主圆角、同组细边框、亚克力底色及高光变量；文章卡片统一日期、标题、摘要、标签和阅读链接层级。
- 文章保持居中连续阅读，标题与小标题改用同一衬线体系；正文使用 17px/2 倍行高，手机 16px，保留目录、纯文本元信息与进度环。
- 公开 Site Config 新增只读可选字段 `ownerAvatar`，由最早关联 GitHub 的 Admin 账号生成头像地址。读取只选择公开 GitHub 数字 ID，不读取邮箱或 OAuth Token；不新增数据库字段或迁移、不新增 API 路由。普通读者的 GitHub 账号不会成为站长头像来源。
- 未登录时顶部头像与首页签名卡使用站长头像；尚未关联 GitHub 时使用已配置头像（忽略原演示图片）或字母 j。当前账号登录时，右上账户入口继续显示该账号头像。GitHub 登录回调与权限规则沿用原项目。已有访客缓存按原有有效期更新，必要时刷新页面。
- 真实 GitHub OAuth 登录需要部署环境已配置自己的 GitHub OAuth App；本地占位配置无法完成真实登录。本次未要求用户提供凭据，也没有改动线上 OAuth 设置。

为什么这样做：将背景、文字、边框和间距收敛到一套可维护的设计规则；把站长身份作为公开只读信息，而不依赖某个访客的登录状态或在前端保存头像。

维护入口：主材质与排版变量在 `src/components/layout/public-theme.css`；站点名称和介绍继续从后台配置；功能文案在 `messages/zh.json`、`messages/en.json`。头像查询在 `src/features/auth/data/auth.data.ts`，由 `src/features/config/service/config.service.ts` 的现有公开配置接口返回。

## 上轮追加：连续阅读页与光标定位修复

本节记录上一轮的连续阅读改动；首页与材质以顶部最新审核版本为准。

- 删除品牌星光图标，顶栏由 72px 缩至 64px；右侧搜索、主题、语言和用户控件统一包进圆角工具区。
- 文章详情不显示作者侧栏和背景横幅。正文在视口正中，最大宽度 48rem；桌面左侧显示章节目录，两侧预留对称空间；手机使用可展开的目录。
- 正文、相邻文章及评论沿同一版心连续排列，取消外部卡片底色、圆角、阴影及卡片间隙，用留白和细线区分。文内摘要改为左侧细线引言。
- 字数、阅读时长、发布/更新日期、分类和标签全部使用纯文本，保留原来的筛选链接和管理员编辑入口。字数继续沿用原项目按阅读时长估算的逻辑。
- 文章小标题来自现有 Markdown/编辑器标题：Markdown 使用 `##`、`###`、`####`，无需手工维护目录。章节跳转保留原 URL hash 行为，当前章节自动高亮；没有小标题时不展示空目录。
- 右下返回顶部按钮加入进度环和百分比；按文章自身高度计算，文章末尾进入视口时为 100%，评论和页脚不计入；图片加载改变高度时重新测量。
- 修复光标点击时偏移：外层只负责视口坐标，内层形状负责缩放；按下时同步本次事件坐标。缩放不会再影响整段定位距离。

为什么这样做：正文使用稳定的阅读宽度和连续层次；目录承担定位功能；工具栏和指针保留统一互动风格，并减少阅读区域的装饰干扰。

## 上轮追加：光标、光晕与交互

- 桌面鼠标使用带细暗边的白色小圆点，便于在浅色玻璃上识别。普通正文和输入区域切换为白色 I 形细竖光标；链接保持圆点并扩大光圈，按下时轻微收缩。“树状小光标”按文本选择用的竖向 I 形理解。
- 光标经过玻璃时，在所在表面内部显示跟随位置的柔和光晕。只有当前所在表面更新 CSS 变量，用 `requestAnimationFrame` 合并鼠标事件，不在每次移动时触发 React 渲染。
- 导航悬停上浮 2px，标签及文章摘要卡片上浮 4px，配合边框和阴影；导航、标签点击时缩至 97%。使用独立的 `translate` 和 `scale`，避免覆盖已有页面入场动画。
- 浅色卡片和顶栏分别采用 62%、54% 的底色不透明度，深色分别为 66%、58%，背景模糊仍保留。数值集中在 `public-theme.css` 顶部，方便维护。
- 手机触控、减少动态效果和系统强制颜色模式保留原生光标；键盘 Tab、切出窗口或离开页面时隐藏自定义指针。下拉选择、滑块、禁用控件保留原生光标。原生文字拖选、输入插入符、路由和后台逻辑继续沿用浏览器行为。
- 透明效果依旧具备不支持背景模糊以及减少透明度时的实色回退。移动端不启用鼠标悬停动画。
- 新增 `src/components/layout/glass-pointer.tsx`，由 `public-layout.tsx` 挂载；样式仍统一放在 `public-theme.css`。文章卡片和标签链接只添加展示类名。
- 本轮继续等待用户审核，不提交、不推送、不部署。

为什么这样做：把互动效果限制在公开博客，并尊重输入设备与系统偏好，让视觉反馈不影响阅读、选字和键盘导航。

## 上轮追加：每日背景与玻璃外观

- 站点默认名称改为 **jin的博客**，默认作者为 **jin**。旧演示值「站点名称」「作者」和原默认背景会在读取时采用新默认值；已有自定义后台设置继续保留，不改写 D1 数据。
- 背景接入 [LoliAPI 电脑端接口文档](https://www.loliapi.com/docs/acg/pc.html)。官方接口支持图片 id，没有每日接口；按 UTC+8 日期固定当天候选图片，每天使用三个不重叠的候选 id，同一天不会主动随机切图。
- 页面保持打开时每分钟及恢复可见时检查日期。第三方图片 404 或加载超过 8 秒会换下一候选，最多三张，最后使用本地背景。加载期间本地背景立即作为底图显示。
- 图库候选数量采用文档当前公布的 699，形成 233 天的候选组循环；新增图片不必修改代码。第三方删图、CDN 状态或网络问题可能使页面显示后续候选或本地底图。
- 顶栏铺满整个浏览器内容宽度并紧贴顶部，不再受正文最大宽度限制；导航内容与正文对齐。
- 导航、菜单及正文卡片统一使用模糊、半透明、高光边框、柔和阴影与圆角。只作用于公开博客，后台继续使用原有实色界面；不支持模糊或启用减少透明度偏好时使用实色表面。
- 没有增加公开路由、API 路由、定时任务、数据库迁移或依赖。原有路由和上一轮新增的 /tags 均保留。

## 1. 目录结构

```text
flare-stack-blog/
├── package.json                         # 现有命令和依赖，保持原配置
├── bun.lock                             # 固定依赖，保留 cf 的补丁
├── vite.config.ts                       # Vite、Tailwind、TanStack、Workers
├── cloudflare.config.ts                 # Worker 和 D1/KV/R2/Queue 绑定
├── public/fonts/
│   ├── dancing-script-latin-400-normal.woff2 # 自托管字标字体
│   └── dancing-script-LICENSE.txt            # SIL OFL 1.1 许可
├── messages/
│   ├── zh.json                          # 中文文案
│   └── en.json                          # 英文文案
├── src/
│   ├── blog.config.ts                   # Jin's Blog 的站点默认值与 LoliAPI 入口
│   ├── components/layout/
│   │   ├── site-avatar.tsx              # 公开站长头像与加载失败回退
│   │   ├── site-wordmark.tsx            # 艺术字标，支持后台自定义名称
│   │   ├── site-social-links.tsx         # 首页社交入口
│   │   ├── glass-pointer.tsx            # 白点/I 形光标、表面光晕及事件清理
│   │   ├── background.ts               # 随机接口、请求去缓存与本地兜底
│   │   ├── random-background.tsx         # 共享随机图片、错误重试与超时回退
│   │   ├── preload-images.ts           # 随机加载前预加载本地底图
│   │   ├── public-theme.css            # 公开博客的统一玻璃外观
│   │   ├── navbar.tsx                  # 品牌标记和导航控件
│   │   ├── public-layout.tsx            # 无作者侧栏的公共布局和全站模糊背景
│   │   └── listing-heading.tsx          # 文章列表、标签共用标题区
│   ├── routes/__root.tsx               # 加载 Site Config，随机图片由浏览器获取
│   ├── routes/_public/
│   │   ├── index.tsx                    # /：沿用原加载逻辑、分页参数
│   │   ├── posts.tsx                    # /posts：沿用原筛选及无限加载
│   │   ├── post/$slug.tsx               # /post/:slug：保留
│   │   ├── tags.tsx                     # 新增 /tags
│   │   └── route.tsx                    # 公共导航增加标签入口
│   ├── features/posts/components/
│   │   ├── home-page.tsx                # 介绍区、卡片、空状态和分页
│   │   ├── post-card.tsx                # 日期、标题、摘要、标签、阅读信息
│   │   ├── posts-page.tsx               # 统一标题区、标签筛选、归档
│   │   └── archive/
│   │       ├── archive-panel.tsx        # 按年分组
│   │       ├── archive-year.tsx         # 年份和当前已加载篇数
│   │       └── archive-post.tsx         # 可换行的标题和标签
│   ├── features/tags/
│   │   ├── queries/index.ts            # 复用公开标签查询
│   │   └── components/tags-page.tsx    # 新增：标签及已发布文章篇数
│   ├── features/site-documents/service/
│   │   └── site-documents.service.ts   # 站点地图加入 /tags
│   └── routeTree.gen.ts                # 路由工具自动生成，勿手动编辑
└── docs/frontend-review.md              # 本文档
```

为什么这样组织：路由只负责加载数据、SEO 和入口；展示组件按业务归档；首页使用介绍与手记布局，文章列表、标签页共用标题区，继续使用现有 Fuwari 配色变量和 Tailwind，减少重复维护。

文章内容仍由现有 CMS 存入 D1；Markdown 通过原有编辑器粘贴或 HTTP API 的 `contentMarkdown` 写入。没有新增 `src/content/blog`，避免产生第二套内容来源。API 的转换规则见 `docs/adr/0032-api-exchanges-post-content-as-markdown.md`。

## 2. 按顺序运行命令

以下适用于当前 Windows PowerShell 工作区。Node 要求 24 或更高；当前已存在项目内 Bun 和已安装的依赖，不需要再次安装。

### 第一步：进入目录并启用项目内 Bun

```powershell
Set-Location 'D:\work\flare-stack-blog'
$env:PATH = "$PWD\.cache\tooling\node_modules\bun\bin;$env:PATH"
node --version
bun --version
```

为什么：`npm run build` 内部使用 Bun；Bun 还会应用锁文件中的 cf 补丁。保留原工具链比替换依赖管理方式稳定。

### 第二步：本地预览

当前工作区已有预览服务，直接访问 `http://127.0.0.1:3000`。只有没有服务时才执行：

```powershell
bun run dev --host 127.0.0.1 --strictPort
```

为什么：先检查页面及跳转；`--strictPort` 能明确报告端口冲突，避免误看旧服务。该命令持续运行，后续检查命令请在另一个终端执行，并重新执行第一步。

### 第三步：验证构建与代码

```powershell
npm run build
bun run typecheck
bun run lint
bun run i18n:verify
bun run i18n:prune-unused --check
bun run test:node
bun run test:node -- src/components/layout/background.test.ts src/components/layout/random-background.test.ts src/features/config/config.resolve.test.ts --maxWorkers=1
bun run test -- src/features/tags-search.integration.test.ts src/features/site-documents/site-documents.integration.test.ts
```

为什么：构建验证浏览器和 Worker 产物；类型和 lint 检查组件接口；多语言检查避免缺少文案；已有测试覆盖路由工具、筛选、公开标签和站点文档。

如果多语言编译因外网连接停滞，并且你确实在使用本机 7897 端口的代理，可在同一终端先运行：

```powershell
$env:HTTP_PROXY = 'http://127.0.0.1:7897'
$env:HTTPS_PROXY = 'http://127.0.0.1:7897'
npm run build
```

为什么：Paraglide 的项目设置从 jsDelivr 加载插件；这只设置当前终端及子进程的代理，不修改项目配置或生产部署变量。没有该代理时不要设置这个地址。

### 第四步：审核后发布

审核入口：`/`、`/posts`、`/tags`、已有文章详情和 `/friend-links`。还需检查手机宽度、深浅色模式、标签跳转及分页；本地没有线上文章时，空状态属于正常现象。

推送目标是 `https://github.com/wdsjxj8451/flare-stack-blog.git` 的 `main`。审核通过后才选择本次修改文件提交并推送，随后由现有 Cloudflare Workers Builds 自动构建部署。推送后的部署结果需以 Cloudflare 构建记录为准。本地不执行 `cf deploy`。

为什么：仓库现有部署流程监听 Fork 的生产分支；复用这一流程可避免重复发布。工作区原有的未跟踪文件 `dev.ps1` 和 `docs/local-development.md` 不属于本次界面改动，提交时需明确排除。

审核通过后，提交与推送的具体命令如下；目前尚未执行：

```powershell
git -c safe.directory=D:/work/flare-stack-blog add -- src/components/layout/glass-pointer.tsx docs/frontend-review.md messages/en.json messages/zh.json src/components/layout/listing-heading.tsx src/components/layout/public-layout.tsx src/features/posts/components/archive/archive-panel.tsx src/features/posts/components/archive/archive-post.tsx src/features/posts/components/archive/archive-year.tsx src/features/posts/components/home-page.tsx src/features/posts/components/post-card.tsx src/features/posts/components/posts-page.tsx src/features/site-documents/service/site-documents.service.ts src/features/tags/components/tags-page.tsx src/routeTree.gen.ts src/routes/_public/index.tsx src/routes/_public/route.tsx src/routes/_public/tags.tsx src/blog.config.ts src/components/layout/background.ts src/components/layout/background.test.ts src/components/layout/random-background.tsx src/components/layout/random-background.test.ts src/components/layout/preload-images.ts src/components/layout/public-theme.css src/components/layout/navbar.tsx src/features/config/config.resolve.ts src/features/config/config.resolve.test.ts src/routes/__root.tsx src/components/layout/back-to-top.tsx src/features/posts/components/post-page.tsx src/features/posts/components/post-page-skeleton.tsx src/features/posts/components/post-meta.tsx src/features/posts/components/table-of-contents.tsx src/features/posts/components/use-reading-progress.ts src/features/posts/utils/reading-progress.ts src/features/posts/utils/reading-progress.test.ts src/components/layout/site-avatar.tsx src/components/layout/site-wordmark.tsx src/components/layout/site-social-links.tsx src/features/posts/components/home-page-skeleton.tsx src/features/auth/data/auth.data.ts src/features/auth/data/auth.data.test.ts src/features/config/service/config.service.ts src/features/config/site-config.schema.ts src/lib/orpc/contract.generated.json public/fonts/dancing-script-latin-400-normal.woff2 public/fonts/dancing-script-LICENSE.txt
git -c safe.directory=D:/work/flare-stack-blog diff --cached --stat
git -c safe.directory=D:/work/flare-stack-blog commit -m "feat: add daily backgrounds and interactive glass blog layout"
git -c safe.directory=D:/work/flare-stack-blog push origin main
```

为什么：明确列出文件可以排除本地配置和其他工作；暂存差异用于最后核对；只有推送生产分支才会触发现有自动部署。

## 3. 关键文件完整内容

以下是本次实现的审阅快照；日后修改应以对应源文件为准。`package.json`、`vite.config.ts` 和 `cloudflare.config.ts` 展示现有完整配置，本次没有修改它们。

### `package.json`

```json
{
  "name": "flare-stack-blog",
  "version": "3.9.0",
  "private": true,
  "license": "GPL-3.0-only",
  "author": {
    "name": "akuang",
    "email": "kuangdadu@gmail.com",
    "url": "https://github.com/du2333"
  },
  "type": "module",
  "scripts": {
    "dev": "vite dev --port 3000",
    "build": "bun run orpc:contract && cf build && bun scripts/ssr-chunk-graph.ts .cloudflare/output/v0/workers/default/bundle",
    "deploy": "cf d1 migrations apply \"$D1_DATABASE_ID\" && cf deploy --prebuilt",
    "test": "vitest run",
    "test:node": "vitest run --config vitest.node.config.ts",
    "lint": "oxlint",
    "lint:fix": "oxlint --fix",
    "format": "oxfmt",
    "orpc:contract": "bun run i18n:compile && bun scripts/generate-orpc-contract.ts && oxfmt src/lib/orpc/contract.generated.json",
    "typecheck": "bun run orpc:contract && cf workers types && node ./node_modules/typescript/bin/tsc --noEmit",
    "check": "bun run orpc:contract && cf workers types && oxlint && oxfmt --check && node ./node_modules/typescript/bin/tsc --noEmit",
    "i18n:compile": "bun paraglide-js compile --project ./project.inlang --outdir ./src/paraglide",
    "i18n:verify": "bun scripts/verify-translations.ts",
    "i18n:prune-unused": "bun scripts/prune-unused-translations.ts",
    "wrangler:prepare": "bun scripts/wrangler-prepare-deprecated.ts",
    "db:studio": "drizzle-kit studio",
    "db:push": "drizzle-kit push",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "cf d1 migrations apply \"$D1_DATABASE_ID\"",
    "db:migrate:local": "bun scripts/migrate-local.ts",
    "auth:generate-schema": "bunx @better-auth/cli generate --yes --config auth-cli.ts --output src/lib/db/schema/auth.table.ts",
    "release": "export GITHUB_TOKEN=$(gh auth token) && release-it",
    "release:beta": "export GITHUB_TOKEN=$(gh auth token) && release-it --preRelease=beta",
    "postinstall": "bun run i18n:compile && cf workers types",
    "prepare": "husky"
  },
  "dependencies": {
    "@better-auth/api-key": "1.7.6",
    "@better-auth/core": "1.7.6",
    "@floating-ui/dom": "^1.8.0",
    "@fontsource-variable/jetbrains-mono": "^5.3.0",
    "@fontsource/roboto": "^5.3.0",
    "@hookform/resolvers": "^5.9.1",
    "@orpc/client": "^1.15.4",
    "@orpc/contract": "^1.15.4",
    "@orpc/json-schema": "^1.15.4",
    "@orpc/openapi": "^1.15.4",
    "@orpc/openapi-client": "^1.15.4",
    "@orpc/server": "^1.15.4",
    "@orpc/tanstack-query": "^1.15.4",
    "@orpc/zod": "^1.15.4",
    "@tailwindcss/typography": "^0.5.20",
    "@tanstack/react-devtools": "^0.10.13",
    "@tanstack/react-query": "^5.104.0",
    "@tanstack/react-query-devtools": "^5.104.0",
    "@tanstack/react-router": "^1.170.44",
    "@tanstack/react-router-devtools": "^1.167.2",
    "@tanstack/react-router-ssr-query": "^1.167.3",
    "@tanstack/react-start": "1.169.2",
    "@tanstack/router-plugin": "^1.168.46",
    "@tiptap/core": "^3.20.0",
    "@tiptap/extension-blockquote": "^3.20.0",
    "@tiptap/extension-code-block": "^3.20.0",
    "@tiptap/extension-file-handler": "^3.20.0",
    "@tiptap/extension-heading": "^3.20.0",
    "@tiptap/extension-image": "^3.20.0",
    "@tiptap/extension-mathematics": "^3.20.0",
    "@tiptap/extension-placeholder": "^3.20.0",
    "@tiptap/extension-table": "^3.20.0",
    "@tiptap/extension-table-cell": "^3.20.0",
    "@tiptap/extension-table-header": "^3.20.0",
    "@tiptap/extension-table-row": "^3.20.0",
    "@tiptap/markdown": "^3.31.4",
    "@tiptap/pm": "^3.20.0",
    "@tiptap/react": "^3.20.0",
    "@tiptap/starter-kit": "^3.20.0",
    "@tiptap/static-renderer": "^3.20.0",
    "@tiptap/suggestion": "^3.31.4",
    "better-auth": "1.7.6",
    "clsx": "^2.1.1",
    "drizzle-orm": "^0.45.3",
    "drizzle-zod": "^0.8.3",
    "feed": "^5.2.1",
    "katex": "^0.16.47",
    "lucide-react": "^1.48.0",
    "marked": "^17.0.6",
    "mermaid": "^12.1.0",
    "photoswipe": "^5.4.4",
    "react": "^19.3.0",
    "react-dom": "^19.3.0",
    "react-hook-form": "^7.89.0",
    "react-textarea-autosize": "^8.5.9",
    "shiki": "^4.4.3",
    "simple-icons": "^16.28.0",
    "sonner": "^2.0.8",
    "tailwind-merge": "^3.7.0",
    "tailwindcss": "^4.3.3",
    "tw-animate-css": "^1.3.6",
    "worker-mailer": "^1.2.1",
    "zod": "~4.6.5"
  },
  "devDependencies": {
    "@cloudflare/vite-plugin": "^1.62.0",
    "@cloudflare/vitest-plugin": "^1.3.1",
    "@inlang/paraglide-js": "^2.24.1",
    "@release-it/conventional-changelog": "^10.0.6",
    "@tailwindcss/vite": "^4.3.3",
    "@tanstack/devtools-vite": "^0.8.5",
    "@testing-library/dom": "^10.4.2",
    "@testing-library/react": "^16.3.3",
    "@types/node": "^24.19.0",
    "@types/react": "^19.3.0",
    "@types/react-dom": "^19.3.0",
    "@typescript/typescript6": "^6.0.2",
    "@vitejs/plugin-react": "^6.1.1",
    "@vitest/runner": "^4.1.11",
    "@vitest/snapshot": "^4.1.11",
    "cf": "1.0.0-beta.5",
    "drizzle-kit": "^0.31.11",
    "fallow": "^3.21.0",
    "husky": "^9.1.7",
    "jsdom": "^30.1.1",
    "oxfmt": "^0.71.0",
    "oxlint": "^1.79.0",
    "oxlint-tsgolint": "^7.0.2004",
    "release-it": "^19.2.4",
    "saxes": "^6.0.0",
    "tldts": "^7.4.11",
    "typescript": "^7.0.2",
    "vite": "^8.3.1",
    "vitest": "^4.1.11"
  },
  "engines": {
    "node": ">=24"
  },
  "patchedDependencies": {
    "cf@1.0.0-beta.5": "patches/cf@1.0.0-beta.5.patch"
  }
}
```

### `vite.config.ts`

```ts
import path from "node:path";
import { cloudflare } from "@cloudflare/vite-plugin";
import { paraglideVitePlugin } from "@inlang/paraglide-js";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import packageJson from "./package.json";
import { routedFirstSegmentsPlugin } from "./scripts/vite-routed-segments.ts";

const config = defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(packageJson.version),
    // Unique per build, so cached pages never outlive the assets they name.
    __BUILD_ID__: JSON.stringify(
      process.env.WORKERS_CI_BUILD_UUID || Date.now().toString(36),
    ),
  },
  resolve: {
    tsconfigPaths: true,
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [
    paraglideVitePlugin({
      project: "./project.inlang",
      outdir: "./src/paraglide",
      strategy: ["cookie", "preferredLanguage", "baseLocale"],
      cookieName: "LOCALE",
    }),
    cloudflare({
      viteEnvironment: {
        name: "ssr",
      },
      // Read the Worker from cloudflare.config.ts instead of wrangler.jsonc.
      experimental: { newConfig: true },
    }),
    routedFirstSegmentsPlugin(),
    tailwindcss(),
    devtools(),
    tanstackStart(),
    viteReact(),
  ],
});

export default config;
```

### `cloudflare.config.ts`

```ts
import { bindings, defineConfig, exports, triggers } from "cf/config";
import { getDomain } from "tldts";
import * as entrypoint from "./src/server" with { type: "cf-worker" };

// Loaded by Node >= 22.18 (Vite, Vitest and `cf`), never by Bun.
//
// Deployment values come from real environment variables, which Workers Builds
// exposes as build variables (`.env` is not read here). The placeholders keep
// `bun dev`, tests and CI working without any Cloudflare resources. The fixed
// UUID is what `bun db:migrate:local` targets, so it must stay a valid D1 id.
const env = process.env;
const workerName = env.WORKER_NAME?.trim() || "worker-name-placeholder";
const queueName = env.QUEUE_NAME?.trim() || "queue-name-placeholder";
const bucketName = env.BUCKET_NAME?.trim() || "bucket-name-placeholder";
const d1DatabaseId =
  env.D1_DATABASE_ID?.trim() || "00000000-0000-4000-8000-000000000000";
const kvNamespaceId =
  env.KV_NAMESPACE_ID?.trim() || "00000000000000000000000000000000";
const domain = env.DOMAIN?.trim();
const useRoutes = ["1", "true", "yes", "on"].includes(
  env.ROUTE?.trim().toLowerCase() ?? "",
);

export default defineConfig((ctx) => {
  // Tests only produce to the queue; a consumer would race their assertions.
  const isTest = ctx.mode === "test";

  return {
    worker: {
      name: workerName,
      compatibilityDate: "2026-02-17",
      compatibilityFlags: ["nodejs_compat", "global_fetch_strictly_public"],
      entrypoint,
      cache: { enabled: true },
      observability: { enabled: true },
      ...(domain && !useRoutes ? { domains: [domain] } : {}),
      triggers: [
        triggers.scheduled({ schedule: "15 0 * * *" }),
        ...(domain && useRoutes
          ? [
              triggers.fetch({
                pattern: `${domain}/*`,
                zone: env.ZONE_NAME?.trim() || getDomain(domain) || domain,
              }),
            ]
          : []),
        ...(isTest
          ? []
          : [
              triggers.queue({
                name: queueName,
                maxBatchSize: 10,
                maxBatchTimeout: 5,
                maxRetries: 3,
              }),
            ]),
      ],
      env: {
        DB: bindings.d1({ id: d1DatabaseId }),
        KV: bindings.kv({ id: kvNamespaceId }),
        R2: bindings.r2({ name: bucketName }),
        QUEUE: bindings.queue({ name: queueName }),
      },
      // Durable Objects are reached through `exports` from `cloudflare:workers`,
      // so they need no binding. Once deployed this way, rolling back to a
      // `migrations`-based wrangler config is rejected.
      exports: {
        default: exports.worker({ cache: { enabled: false } }),
        App: exports.worker({ cache: { enabled: true } }),
        RateLimiter: exports.durableObject({ storage: "sqlite" }),
        PostPublisher: exports.durableObject({ storage: "sqlite" }),
      },
    },
  };
});
```

### `src/blog.config.ts`

```ts
import type { SiteConfig } from "@/features/config/site-config.schema";

export const blogConfig = {
  title: "Jin's Blog",
  author: "jin",
  description:
    "这是我的个人网站和博客。在这里，我主要分享与技术和生活相关的内容。欢迎阅读！",
  social: [
    { platform: "github", url: "https://github.com/example" },
    { platform: "email", url: "mailto:example@email.com" },
    { platform: "rss", url: "/rss.xml" },
  ],
  navLinks: [],
  icons: {
    faviconSvg: "/favicon.svg",
    faviconIco: "/favicon.ico",
    favicon96: "/favicon-96x96.png",
    appleTouchIcon: "/apple-touch-icon.png",
    webApp192: "/web-app-manifest-192x192.png",
    webApp512: "/web-app-manifest-512x512.png",
  },
  theme: {
    fuwari: {
      homeBg: "https://www.loliapi.com/acg/pc/",
      avatar: "/images/avatar.png",
      primaryHue: 250,
    },
  },
} as const satisfies SiteConfig;
```

### `src/features/config/config.resolve.ts`

```ts
import { blogConfig } from "@/blog.config";
import type { SiteConfig, SystemConfig } from "@/features/config/config.schema";
import { DEFAULT_CONFIG } from "@/features/config/config.schema";
import { FullSiteConfigSchema } from "@/features/config/site-config.schema";
import { normalizeNavLinks } from "@/features/config/utils/nav-links";
import type { SocialLink } from "@/features/config/utils/social-platforms";
import type { WebhookEndpoint } from "@/features/webhook/webhook.schema";

const DEFAULT_SMTP_PORT = 465;
const RESEND_SMTP_HOST = "smtp.resend.com";
const RESEND_SMTP_USERNAME = "resend";

function resolveEmailConfig(config: SystemConfig | null | undefined) {
  const email = config?.email;
  const legacyApiKey = email?.apiKey?.trim() || "";
  const password = email?.password || legacyApiKey;
  const host = email?.host?.trim() || (legacyApiKey ? RESEND_SMTP_HOST : "");
  const username =
    email?.username?.trim() || (legacyApiKey ? RESEND_SMTP_USERNAME : "");

  return {
    host,
    port: email?.port ?? DEFAULT_SMTP_PORT,
    username,
    password,
    senderName: email?.senderName ?? "",
    senderAddress: email?.senderAddress ?? "",
  };
}

function migrateSocial(social: unknown): SocialLink[] {
  if (Array.isArray(social)) return social;

  if (social && typeof social === "object") {
    const old = social as { github?: string; email?: string };
    const migrated: SocialLink[] = [];
    if (old.github) migrated.push({ platform: "github", url: old.github });
    if (old.email)
      migrated.push({ platform: "email", url: `mailto:${old.email}` });
    return migrated;
  }

  return [...blogConfig.social];
}

export function resolveSiteConfig(
  config: SystemConfig | null | undefined,
): SiteConfig {
  // Adopt the new defaults for installations still using the original demo.
  // Explicit personal settings remain editable in the Admin.
  const title = config?.site?.title;
  const author = config?.site?.author;
  const homeBg = config?.site?.theme?.fuwari?.homeBg;
  return FullSiteConfigSchema.parse({
    title:
      title === "站点名称" || title === "jin的博客"
        ? blogConfig.title
        : (title ?? blogConfig.title),
    author:
      author === "作者" ? blogConfig.author : (author ?? blogConfig.author),
    description: config?.site?.description ?? blogConfig.description,
    social: migrateSocial(config?.site?.social),
    navLinks: normalizeNavLinks(config?.site?.navLinks),
    icons: {
      faviconSvg:
        config?.site?.icons?.faviconSvg || blogConfig.icons.faviconSvg,
      faviconIco:
        config?.site?.icons?.faviconIco || blogConfig.icons.faviconIco,
      favicon96: config?.site?.icons?.favicon96 || blogConfig.icons.favicon96,
      appleTouchIcon:
        config?.site?.icons?.appleTouchIcon || blogConfig.icons.appleTouchIcon,
      webApp192: config?.site?.icons?.webApp192 || blogConfig.icons.webApp192,
      webApp512: config?.site?.icons?.webApp512 || blogConfig.icons.webApp512,
    },
    theme: {
      fuwari: {
        homeBg:
          homeBg === "/images/home-bg.webp"
            ? blogConfig.theme.fuwari.homeBg
            : (homeBg ?? blogConfig.theme.fuwari.homeBg),
        avatar:
          config?.site?.theme?.fuwari?.avatar ?? blogConfig.theme.fuwari.avatar,
        primaryHue:
          config?.site?.theme?.fuwari?.primaryHue ??
          blogConfig.theme.fuwari.primaryHue,
      },
    },
  });
}

function resolveWebhookEndpoint(
  notification: SystemConfig["notification"] | null | undefined,
): WebhookEndpoint {
  const current = notification?.webhook;
  const currentUrl = current?.url?.trim() ?? "";
  const currentSecret = current?.secret ?? "";
  const provider = current?.provider ?? "generic";
  if (currentUrl || provider !== "generic") {
    return {
      ...(provider !== "generic" && { provider }),
      url: currentUrl,
      secret: currentSecret,
      ...(current?.chatId && { chatId: current.chatId }),
      ...(current?.template && { template: current.template }),
    };
  }

  const legacy = notification?.webhooks?.[0];
  if (legacy) {
    return {
      url: legacy.url?.trim() ?? "",
      secret: legacy.secret ?? currentSecret,
    };
  }

  return {
    url: "",
    secret: currentSecret,
  };
}

export function resolveSystemConfig(
  config: SystemConfig | null | undefined,
): SystemConfig {
  return {
    ...DEFAULT_CONFIG,
    ...config,
    email: resolveEmailConfig(config),
    notification: {
      admin: {
        channels: {
          email: config?.notification?.admin?.channels?.email ?? true,
        },
      },
      user: {
        emailEnabled: config?.notification?.user?.emailEnabled ?? true,
      },
      webhook: resolveWebhookEndpoint(config?.notification),
    },
    site: resolveSiteConfig(config),
  };
}
```

### `src/components/layout/background.ts`

```ts
import {
  getPublicImageSrc,
  PUBLIC_IMAGE_WIDTH,
} from "@/features/media/utils/media.utils";

export const BACKGROUND_FALLBACK = "/images/home-bg.webp";
export const BACKGROUND_MAX_ATTEMPTS = 3;
const LOLI_PC_ENDPOINT = "https://www.loliapi.com/acg/pc/";

export function isRandomBackground(source: string): boolean {
  return source.replace(/\/$/, "") === LOLI_PC_ENDPOINT.replace(/\/$/, "");
}

/** Let the API choose from its current image pool, never guess an image ID. */
export function getRandomBackgroundRequest(): string {
  const url = new URL(LOLI_PC_ENDPOINT);
  url.searchParams.set("type", "url");
  url.searchParams.set("_", crypto.randomUUID());
  return url.href;
}

/** SSR and hydration use a stable local image while the random one loads. */
export function getHomeBackgroundImage(source: string): string {
  if (!source || isRandomBackground(source)) return BACKGROUND_FALLBACK;
  return getPublicImageSrc(source, PUBLIC_IMAGE_WIDTH.banner);
}
```

### `src/components/layout/random-background.tsx`

```tsx
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  BACKGROUND_FALLBACK,
  BACKGROUND_MAX_ATTEMPTS,
  getHomeBackgroundImage,
  getRandomBackgroundRequest,
  isRandomBackground,
} from "./background";

const BackgroundContext = createContext({
  url: BACKGROUND_FALLBACK,
  onError: () => {},
});

/** Check the actual image too: a valid API response may point to a broken CDN. */
function preloadImage(url: string, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException("Image loading aborted", "AbortError"));
      return;
    }
    const image = new Image();
    const cleanup = () => {
      image.onload = null;
      image.onerror = null;
      signal.removeEventListener("abort", abort);
    };
    const abort = () => {
      cleanup();
      image.removeAttribute("src");
      reject(new DOMException("Image loading aborted", "AbortError"));
    };
    signal.addEventListener("abort", abort, { once: true });
    image.onload = () => {
      cleanup();
      resolve();
    };
    image.onerror = () => {
      cleanup();
      reject(new Error("Background image could not be loaded"));
    };
    image.referrerPolicy = "no-referrer";
    image.src = url;
  });
}

/** One request sequence per public layout, shared by the cover and acrylic. */
export function RandomBackgroundProvider({
  source,
  children,
}: {
  source: string;
  children: ReactNode;
}) {
  const [loaded, setLoaded] = useState<{ source: string; url: string }>();
  const url =
    loaded?.source === source ? loaded.url : getHomeBackgroundImage(source);
  const onError = useCallback(() => {
    setLoaded({ source, url: BACKGROUND_FALLBACK });
  }, [source]);

  useEffect(() => {
    const lifecycle = new AbortController();
    const random = isRandomBackground(source);
    const attempts = random ? BACKGROUND_MAX_ATTEMPTS : 1;

    void (async () => {
      // Strict Mode may immediately clean up its first effect in development.
      await Promise.resolve();
      if (lifecycle.signal.aborted) return;
      for (let attempt = 0; attempt < attempts; attempt++) {
        const controller = new AbortController();
        const abort = () => controller.abort();
        lifecycle.signal.addEventListener("abort", abort, { once: true });
        // Bound the entire attempt, including the API and the actual image.
        const timeout = window.setTimeout(abort, 8_000);
        try {
          let candidate = getHomeBackgroundImage(source);
          if (random) {
            const response = await fetch(getRandomBackgroundRequest(), {
              cache: "no-store",
              signal: controller.signal,
            });
            if (!response.ok) throw new Error("Background API request failed");
            const address = new URL((await response.text()).trim());
            if (address.protocol !== "https:")
              throw new Error("Background API returned an invalid image URL");
            candidate = address.href;
          }
          await preloadImage(candidate, controller.signal);
          if (!lifecycle.signal.aborted) setLoaded({ source, url: candidate });
          return;
        } catch {
          if (lifecycle.signal.aborted) return;
        } finally {
          window.clearTimeout(timeout);
          lifecycle.signal.removeEventListener("abort", abort);
        }
      }
      if (!lifecycle.signal.aborted)
        setLoaded({ source, url: BACKGROUND_FALLBACK });
    })();

    return () => lifecycle.abort();
  }, [source]);

  return (
    <BackgroundContext.Provider value={{ url, onError }}>
      {children}
    </BackgroundContext.Provider>
  );
}

export function BackgroundImage({ priority }: { priority: boolean }) {
  const { url, onError } = useContext(BackgroundContext);
  return (
    <img
      key={url}
      src={url}
      alt=""
      aria-hidden="true"
      referrerPolicy="no-referrer"
      fetchPriority={priority ? "high" : "auto"}
      onError={onError}
      className="fuwari-banner-image h-full w-full object-cover object-center"
    />
  );
}
```

### `src/components/layout/preload-images.ts`

```ts
import type { SiteConfig } from "@/features/config/site-config.schema";
import { getHomeBackgroundImage } from "./background";

export function getHomeBackgroundPreloadImages(
  siteConfig: SiteConfig,
): Array<string> {
  return siteConfig.theme.fuwari.homeBg
    ? [getHomeBackgroundImage(siteConfig.theme.fuwari.homeBg)]
    : [];
}
```

### `src/components/layout/glass-pointer.tsx`

```tsx
import { useEffect, useRef } from "react";

const SURFACE = ".fuwari-card-base, .public-navigation-panel";
const INTERACTIVE = 'a, button, [role="button"], summary';
const TEXT =
  'p, h1, h2, h3, h4, h5, h6, blockquote, pre, code, label, dt, dd, input, textarea, [contenteditable="true"], [data-cursor="text"]';
const NATIVE =
  'select, input[type="range"], input[type="color"], [disabled], [aria-disabled="true"], [data-cursor="native"]';

/** Progressive enhancement: native pointers remain until a mouse actually moves. */
export function GlassPointer() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const root = cursor?.closest<HTMLElement>(".public-site");
    if (!cursor || !root) return;

    const media = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) and (forced-colors: none)",
    );
    let surface: HTMLElement | null = null;
    let frame = 0;
    let x = 0;
    let y = 0;
    let hasPosition = false;

    const clearSurface = () => {
      if (!surface) return;
      delete surface.dataset.glassActive;
      surface.style.removeProperty("--glass-x");
      surface.style.removeProperty("--glass-y");
      surface = null;
    };
    const hide = () => {
      hasPosition = false;
      window.cancelAnimationFrame(frame);
      frame = 0;
      delete root.dataset.cursorActive;
      delete cursor.dataset.visible;
      delete cursor.dataset.pressed;
      clearSurface();
    };
    const paint = () => {
      frame = 0;
      if (!hasPosition || !media.matches) return;
      // Re-read on scroll too: the surface underneath a stationary mouse changes.
      const target = document.elementFromPoint(x, y);
      if (!target || !root.contains(target)) {
        hide();
        return;
      }
      const nextSurface = target.closest<HTMLElement>(SURFACE);
      if (surface !== nextSurface) {
        clearSurface();
        surface = nextSurface;
      }
      if (surface) {
        const bounds = surface.getBoundingClientRect();
        surface.style.setProperty("--glass-x", `${x - bounds.left}px`);
        surface.style.setProperty("--glass-y", `${y - bounds.top}px`);
        surface.dataset.glassActive = "true";
      }
      if (target.closest(NATIVE)) {
        delete root.dataset.cursorActive;
        delete cursor.dataset.visible;
        return;
      }
      const interactive = target.closest(INTERACTIVE);
      const text = !interactive && target.closest(TEXT);
      cursor.dataset.mode = text ? "text" : interactive ? "link" : "dot";
      cursor.style.setProperty("--pointer-x", `${x}px`);
      cursor.style.setProperty("--pointer-y", `${y}px`);
      cursor.dataset.visible = "true";
      root.dataset.cursorActive = "true";
    };
    const schedule = () => {
      if (hasPosition && !frame) frame = window.requestAnimationFrame(paint);
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !media.matches) {
        hide();
        return;
      }
      x = event.clientX;
      y = event.clientY;
      hasPosition = true;
      schedule();
    };
    const leave = (event: PointerEvent) => {
      if (!event.relatedTarget) hide();
    };
    const press = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && cursor.dataset.visible) {
        x = event.clientX;
        y = event.clientY;
        window.cancelAnimationFrame(frame);
        paint();
        cursor.dataset.pressed = "true";
      } else {
        hide();
      }
    };
    const release = () => delete cursor.dataset.pressed;
    const key = (event: KeyboardEvent) => {
      if (event.key === "Tab") hide();
    };
    const visibility = () => {
      if (document.hidden) hide();
    };

    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerout", leave, { passive: true });
    document.addEventListener("pointerdown", press, { passive: true });
    document.addEventListener("pointerup", release, { passive: true });
    document.addEventListener("pointercancel", hide, { passive: true });
    document.addEventListener("scroll", schedule, {
      passive: true,
      capture: true,
    });
    document.addEventListener("keydown", key);
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("blur", hide);
    window.addEventListener("resize", hide);
    media.addEventListener("change", hide);
    return () => {
      hide();
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerout", leave);
      document.removeEventListener("pointerdown", press);
      document.removeEventListener("pointerup", release);
      document.removeEventListener("pointercancel", hide);
      document.removeEventListener("scroll", schedule, true);
      document.removeEventListener("keydown", key);
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("blur", hide);
      window.removeEventListener("resize", hide);
      media.removeEventListener("change", hide);
    };
  }, []);

  return (
    <div ref={cursorRef} className="public-pointer" aria-hidden="true">
      <span className="public-pointer-shape" />
    </div>
  );
}
```

### `src/components/layout/public-theme.css`

```css
@font-face {
  font-family: "Dancing Script";
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("/fonts/dancing-script-latin-400-normal.woff2") format("woff2");
}

/* A single acrylic material and an editorial type scale for public pages. */
.public-site {
  --journal-serif:
    "Iowan Old Style", "Palatino Linotype", "Noto Serif CJK SC", "Songti SC",
    "SimSun", serif;
  --journal-surface: #faf9f6;
  --journal-accent: #9b7547;
  --fuwari-card-bg: var(--journal-surface);
  --fuwari-page-bg: #f1f0ed;
  --fuwari-radius-large: 18px;
  --public-acrylic-tint: rgb(244 244 241 / 0.78);
  --public-glass-border: rgb(97 105 125 / 0.16);
  --public-glass-shadow:
    0 12px 36px rgb(30 40 65 / 0.035), inset 0 1px 0 rgb(255 255 255 / 0.55);
  --public-glass-tint: color-mix(
    in srgb,
    var(--journal-surface) 66%,
    transparent
  );
  --public-nav-tint: color-mix(
    in srgb,
    var(--journal-surface) 72%,
    transparent
  );
  --public-glow: rgb(255 255 255 / 0.36);
  isolation: isolate;
  background: var(--fuwari-page-bg);
  color: var(--fuwari-fg);
}
.dark .public-site {
  --journal-surface: #171c27;
  --journal-accent: #ceb995;
  --fuwari-page-bg: #0d111b;
  --public-acrylic-tint: rgb(12 17 28 / 0.79);
  --public-glass-border: rgb(219 227 249 / 0.12);
  --public-glass-shadow:
    0 12px 36px rgb(0 0 0 / 0.1), inset 0 1px 0 rgb(255 255 255 / 0.035);
  --public-glass-tint: color-mix(
    in srgb,
    var(--journal-surface) 62%,
    transparent
  );
  --public-nav-tint: color-mix(
    in srgb,
    var(--journal-surface) 76%,
    transparent
  );
  --public-glow: rgb(200 216 255 / 0.12);
}
.public-ambient {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}
.public-ambient-photo {
  position: absolute;
  inset: -48px;
  filter: blur(28px) saturate(0.8);
  background: url("/images/home-bg.webp") center / cover no-repeat;
  transform: scale(1.04);
}
.public-ambient-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.public-acrylic {
  position: absolute;
  inset: 0;
  background: var(--public-acrylic-tint);
}
.public-acrylic::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    120deg,
    rgb(255 255 255 / 0.035),
    transparent 45%,
    rgb(147 160 212 / 0.035)
  );
}
.public-main-shell {
  padding-top: 32px;
}
.public-reading-site .public-main-shell {
  padding-top: 0;
}
.public-reading-site .public-acrylic {
  background: color-mix(in srgb, var(--fuwari-page-bg) 91%, transparent);
}
.public-site .fuwari-card-base {
  position: relative;
  border: 1px solid var(--public-glass-border);
  border-radius: 18px;
  box-shadow: var(--public-glass-shadow);
  background: var(--journal-surface);
}
.public-site .public-navbar {
  width: 100%;
  height: 64px;
  padding-inline: max(24px, calc((100% - 72rem) / 2 + 32px));
  border-width: 0 0 1px;
  border-radius: 0;
  box-shadow: inset 0 -1px 0 rgb(255 255 255 / 0.025);
}
.public-site .public-navigation-panel {
  right: max(20px, calc((100vw - 72rem) / 2 + 32px));
  border: 1px solid var(--public-glass-border);
  border-radius: 18px;
  background: var(--journal-surface);
  box-shadow: var(--public-glass-shadow);
}
@supports ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .public-site .fuwari-card-base,
  .public-site .public-navigation-panel {
    background: var(--public-glass-tint);
    -webkit-backdrop-filter: blur(20px) saturate(125%);
    backdrop-filter: blur(20px) saturate(125%);
  }
  .public-site .public-navbar {
    background: var(--public-nav-tint);
    -webkit-backdrop-filter: blur(24px) saturate(135%);
    backdrop-filter: blur(24px) saturate(135%);
  }
}
.public-site .public-brand {
  font-weight: 500;
  letter-spacing: 0;
  max-width: 200px;
}
.public-site .public-brand span {
  overflow: visible;
}
.site-wordmark {
  display: inline-flex;
  align-items: baseline;
  white-space: nowrap;
  font-family: var(--journal-serif);
  font-weight: 500;
  line-height: 1.05;
}
.site-wordmark-custom {
  white-space: normal;
  overflow-wrap: anywhere;
}
.wordmark-latin {
  font-family: "Dancing Script", "Segoe Script", cursive;
  font-size: 1em;
  font-style: normal;
  font-weight: 400;
  font-synthesis: none;
  letter-spacing: 0;
  line-height: 1.35;
}
.public-brand .site-wordmark {
  font-size: 30px;
  color: var(--fuwari-fg);
}
.public-brand .site-wordmark-custom {
  font-size: 18px;
}
.public-site .public-nav-link,
.public-site .public-nav-search,
.public-site .public-tool-button {
  border: 1px solid transparent;
  border-radius: 12px;
}
.public-site .public-nav-link {
  font-size: 13px;
  font-weight: 500;
  min-height: 38px;
  color: var(--fuwari-fg-75);
}
.public-site .public-nav-active {
  color: var(--fuwari-fg);
  border-color: var(--public-glass-border);
  background: color-mix(in srgb, var(--journal-surface) 32%, transparent);
}
.public-site .public-nav-tools {
  padding: 3px;
  border: 1px solid var(--public-glass-border);
  border-radius: 16px;
  background: color-mix(in srgb, var(--journal-surface) 25%, transparent);
}
.public-site .public-nav-search {
  height: 36px;
  margin-right: 2px;
  background: color-mix(in srgb, var(--journal-surface) 30%, transparent);
  border-color: var(--public-glass-border);
  font-size: 12px;
}
.public-site
  .public-nav-tools
  :is(.public-tool-button, .public-mobile-trigger) {
  height: 36px;
  min-height: 36px;
}
.site-avatar {
  position: relative;
  display: inline-grid;
  place-items: center;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 50%;
  border: 1px solid var(--public-glass-border);
  background: color-mix(
    in srgb,
    var(--journal-accent) 12%,
    var(--journal-surface)
  );
}
.site-avatar > span {
  font: italic 26px/1 var(--journal-serif);
  color: var(--journal-accent);
  transform: translate(-1px, -2px);
}
.public-site .site-avatar img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: inherit;
}
.public-site .public-account-trigger .site-avatar {
  width: 27px;
  height: 27px;
}
.public-site .public-account-trigger .site-avatar > span {
  font-size: 22px;
}
.public-site .listing-heading {
  padding: 28px 32px;
}
.public-site .listing-heading h1 {
  font-family: var(--journal-serif);
  font-size: 32px;
  font-weight: 500;
  letter-spacing: -0.025em;
}
.public-site .listing-heading p {
  line-height: 1.85;
}
.public-site a:focus-visible,
.public-site button:focus-visible {
  outline-color: var(--fuwari-primary);
}
.public-pointer {
  display: none;
}

/* The highlight sits on the surface and never intercepts clicks or selection. */
.public-site :is(.fuwari-card-base, .public-navigation-panel) {
  isolation: isolate;
}

.public-site :is(.fuwari-card-base, .public-navigation-panel)::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  pointer-events: none;
  opacity: 0;
  background: radial-gradient(
    240px circle at var(--glass-x, 50%) var(--glass-y, 50%),
    var(--public-glow),
    transparent 100%
  );
  transition: opacity 240ms ease;
}

.public-pointer {
  display: none;
}

@media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) and (forced-colors: none) {
  .public-site[data-cursor-active="true"],
  .public-site[data-cursor-active="true"] * {
    cursor: none;
  }

  .public-pointer {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10000;
    width: 0;
    height: 0;
    transform: translate3d(var(--pointer-x, -40px), var(--pointer-y, -40px), 0);
    pointer-events: none;
    opacity: 0;
  }

  .public-pointer-shape {
    position: absolute;
    top: 0;
    left: 0;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: white;
    pointer-events: none;
    box-shadow:
      0 0 2px 1px rgb(14 22 47 / 0.65),
      0 0 12px rgb(255 255 255 / 0.7);
    transform: translate(-50%, -50%) scale(var(--pointer-press, 1));
    transition:
      width 140ms ease,
      height 140ms ease,
      border-radius 140ms ease,
      transform 120ms ease;
  }

  .public-pointer[data-visible="true"] {
    opacity: 1;
  }

  .public-pointer[data-mode="link"] .public-pointer-shape {
    width: 10px;
    height: 10px;
    outline: 5px solid rgb(255 255 255 / 0.16);
  }

  .public-pointer[data-mode="text"] .public-pointer-shape {
    width: 2px;
    height: 18px;
    border-radius: 1px;
  }

  .public-pointer[data-mode="text"] .public-pointer-shape::before,
  .public-pointer[data-mode="text"] .public-pointer-shape::after {
    content: "";
    position: absolute;
    left: -3px;
    width: 8px;
    height: 2px;
    border-radius: 1px;
    background: white;
    box-shadow: 0 0 2px rgb(14 22 47 / 0.65);
  }

  .public-pointer[data-mode="text"] .public-pointer-shape::before {
    top: 0;
  }

  .public-pointer[data-mode="text"] .public-pointer-shape::after {
    bottom: 0;
  }

  .public-pointer[data-pressed="true"] {
    --pointer-press: 0.75;
  }

  .public-site [data-glass-active="true"]::after {
    opacity: 1;
  }

  .public-site
    :is(
      .public-nav-link,
      .public-nav-search,
      .public-tool-button,
      .public-tag-link,
      .public-post-card
    ) {
    transition:
      translate 220ms var(--fuwari-motion-ease),
      scale 180ms ease,
      box-shadow 220ms ease,
      border-color 220ms ease,
      background-color 220ms ease,
      color 180ms ease;
  }

  .public-site
    :is(.public-nav-link, .public-nav-search, .public-tool-button):hover {
    translate: 0 -2px;
    background-color: color-mix(
      in srgb,
      var(--fuwari-primary) 13%,
      transparent
    );
    box-shadow:
      inset 0 1px 0 rgb(255 255 255 / 0.35),
      0 6px 18px color-mix(in srgb, var(--fuwari-primary) 14%, transparent);
  }

  .public-site .public-tag-link:hover,
  .public-site .public-post-card:hover {
    translate: 0 -4px;
    border-color: color-mix(
      in srgb,
      var(--fuwari-primary) 35%,
      var(--public-glass-border)
    );
    box-shadow:
      var(--public-glass-shadow),
      0 12px 32px color-mix(in srgb, var(--fuwari-primary) 12%, transparent);
  }

  .public-site
    :is(
      .public-nav-link,
      .public-nav-search,
      .public-tool-button,
      .public-tag-link
    ):active {
    translate: 0 0;
    scale: 0.97;
  }
}

/* Reading pages use one continuous sheet, with a quiet outline beside it. */
.public-reading-site::before {
  display: none;
}
.post-reading-layout {
  width: 100%;
  padding-block: 44px 24px;
}
.post-reading-flow {
  width: 100%;
  max-width: 48rem;
  margin-inline: auto;
  min-width: 0;
}
.post-reading-article {
  color: var(--fuwari-fg);
}
.post-reading-article h1 {
  letter-spacing: -0.035em;
  line-height: 1.25;
  margin-bottom: 20px;
}
.post-reading-article h1::before {
  display: none;
}
.post-reading-article .prose {
  line-height: 1.95;
}
.post-reading-article .prose :is(h2, h3, h4) {
  scroll-margin-top: 80px;
}
.post-meta-text {
  line-height: 1.8;
}
.post-meta-text a:hover {
  color: var(--fuwari-primary);
}
.post-reading-comments {
  margin-top: 40px;
  padding-top: 32px;
  border-top: 1px solid var(--fuwari-meta-divider);
}
.post-reading-flow > .fuwari-onload-animation {
  margin-top: 32px;
}
.public-site .post-reading-flow > div > a > .fuwari-card-base {
  background: transparent;
  border: 0;
  border-radius: 0;
  box-shadow: none;
  backdrop-filter: none;
  padding-inline: 0;
}
.public-site .post-reading-flow > div > a > .fuwari-card-base::after {
  display: none;
}
.post-reading-article > .post-reading-summary {
  margin-block: 24px 36px;
  padding: 0 0 0 18px;
  border-left: 2px solid var(--fuwari-primary);
  color: var(--fuwari-fg-75);
  line-height: 1.85;
}
.post-toc {
  max-width: 48rem;
  margin: 0 auto 28px;
  color: var(--fuwari-fg-75);
}
.post-toc-desktop {
  display: none;
}
.post-toc nav {
  overflow-y: auto;
  max-height: calc(100dvh - 180px);
  overscroll-behavior: contain;
  scrollbar-width: thin;
}
.post-toc a {
  display: block;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.55;
  overflow-wrap: anywhere;
  color: var(--fuwari-fg-50);
  transition:
    color 160ms,
    background-color 160ms;
}
.post-toc a:hover,
.post-toc a[aria-current="location"] {
  color: var(--fuwari-fg);
  background: var(--fuwari-btn-plain-bg-hover);
}
.post-toc a[aria-current="location"] {
  box-shadow: inset 2px 0 var(--fuwari-primary);
}
.post-toc a:focus-visible {
  outline: 2px solid var(--fuwari-primary);
  outline-offset: -2px;
}
.post-toc-mobile {
  border-block: 1px solid var(--fuwari-meta-divider);
  padding-block: 12px;
}
.post-toc-mobile summary {
  font-size: 14px;
  font-weight: 600;
  padding: 4px 0;
}
.post-toc-mobile nav {
  max-height: 50vh;
  padding-top: 12px;
}
.public-site .reading-back-to-top {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  position: relative;
  background: var(--fuwari-page-bg);
}
.reading-progress-ring {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
  fill: none;
  stroke: var(--fuwari-primary);
  stroke-width: 1.6;
  stroke-linecap: round;
}
.reading-progress-ring .reading-progress-track {
  stroke: var(--fuwari-meta-divider);
  opacity: 0.35;
}
.reading-progress-arrow {
  position: absolute;
  top: 9px;
  width: 18px;
  height: 18px;
}
.reading-progress-value {
  position: absolute;
  bottom: 8px;
  font-size: 10px;
  font-variant-numeric: tabular-nums;
}
.public-reading-site .public-footer {
  max-width: 48rem;
  width: 100%;
  margin-inline: auto;
}
@media (min-width: 1280px) {
  .post-reading-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 48rem) minmax(0, 1fr);
    column-gap: 32px;
    align-items: start;
  }
  .post-reading-flow {
    grid-column: 2;
    grid-row: 1;
  }
  .post-toc {
    grid-column: 1;
    grid-row: 1;
    width: 100%;
    margin: 0;
    position: sticky;
    top: 88px;
    padding-top: 6px;
  }
  .post-toc-desktop {
    display: block;
  }
  .post-toc-desktop h2 {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 14px;
    padding-inline: 12px;
    color: var(--fuwari-fg);
  }
  .post-toc-mobile {
    display: none;
  }
}
@media (max-width: 639px) {
  .post-reading-layout {
    padding-top: 24px;
  }
  .public-site .public-nav-tools {
    padding: 2px;
    border-radius: 15px;
  }
}

/* Home: a photographic opening, a personal introduction, then the writing. */
.journal-home {
  position: relative;
}
.home-cover {
  position: relative;
  height: clamp(220px, 27vw, 340px);
  overflow: hidden;
  border: 1px solid var(--public-glass-border);
  border-radius: 20px;
  background: url("/images/home-bg.webp") center / cover;
}
.home-cover > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 42%;
}
.home-cover-shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgb(6 10 20 / 0.04) 20%,
    rgb(6 10 20 / 0.56)
  );
}
.home-cover-caption {
  position: absolute;
  left: 28px;
  right: 28px;
  bottom: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  color: rgb(255 255 255 / 0.94);
  font-size: 13px;
  letter-spacing: 0.07em;
}
.home-cover-scroll {
  margin-left: auto;
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border: 1px solid rgb(255 255 255 / 0.25);
  border-radius: 50%;
  opacity: 0.8;
}
.home-cover-scroll:hover {
  background: rgb(255 255 255 / 0.15);
  opacity: 1;
}
.home-cover-index {
  font-family: Georgia, serif;
  font-size: 20px;
  font-style: italic;
  padding-right: 20px;
  border-right: 1px solid rgb(255 255 255 / 0.35);
}
.home-introduction {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 290px;
  gap: 56px;
  align-items: center;
  padding-block: 40px 6px;
}
.journal-eyebrow {
  display: inline-block;
  color: var(--journal-accent);
  font-size: 10px;
  font-weight: 600;
  line-height: 1.6;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}
.home-introduction h1 {
  font-size: clamp(42px, 5vw, 64px);
  margin: 12px 0 22px;
  color: var(--fuwari-fg);
  line-height: 1.1;
}
.home-introduction h1 .wordmark-latin {
  font-size: 1.2em;
}
.home-description {
  max-width: 36rem;
  font-size: 14px;
  line-height: 1.9;
  color: var(--fuwari-fg-75);
}
.home-introduction-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 18px;
  margin-top: 24px;
}
.journal-primary-link {
  display: inline-flex;
  align-items: center;
  gap: 18px;
  min-height: 38px;
  padding: 8px 16px;
  border: 1px solid var(--public-glass-border);
  border-radius: 10px;
  background: color-mix(in srgb, var(--journal-surface) 56%, transparent);
  color: var(--fuwari-fg);
  font-size: 12px;
  transition: background-color 180ms;
}
.journal-primary-link:hover {
  background: var(--fuwari-btn-plain-bg-hover);
}
.journal-text-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--fuwari-fg-75);
  text-underline-offset: 5px;
}
.journal-text-link:hover {
  color: var(--fuwari-fg);
  text-decoration: underline;
}
.site-social-links {
  display: flex;
  align-items: center;
  gap: 8px;
}
.site-social-links a {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  min-width: 34px;
  height: 34px;
  padding-inline: 8px;
  border: 1px solid var(--public-glass-border);
  border-radius: 9px;
  color: var(--fuwari-fg-75);
  transition:
    color 180ms,
    background-color 180ms;
}
.site-social-links a:hover {
  color: var(--fuwari-primary);
  background: var(--fuwari-btn-plain-bg-hover);
}
.public-site .home-author-note {
  padding: 24px;
  border-radius: 18px;
}
.home-author-note > p {
  font-family: var(--journal-serif);
  font-size: 18px;
  line-height: 1.9;
  color: var(--fuwari-fg-75);
  margin-top: 18px;
}
.home-author-signature {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-top: 22px;
  padding-top: 16px;
  border-top: 1px solid var(--public-glass-border);
}
.home-author-signature > div {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 13px;
}
.home-author-signature small {
  font-size: 10px;
  color: var(--fuwari-fg-50);
}
.home-signature-flourish {
  margin-left: auto;
  font: italic 32px/1 var(--journal-serif);
  color: var(--journal-accent);
}
.journal-divider {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-block: 42px;
  color: var(--journal-accent);
  opacity: 0.6;
}
.journal-divider > span {
  height: 1px;
  flex: 1;
  background: linear-gradient(90deg, transparent, var(--public-glass-border));
}
.journal-divider > span:last-child {
  rotate: 180deg;
}
.journal-divider > i {
  width: 3px;
  height: 3px;
  background: currentColor;
  rotate: 45deg;
}
.journal-divider > i:nth-of-type(2) {
  width: 5px;
  height: 5px;
}
.home-section-heading {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 20px;
  margin-bottom: 22px;
}
.home-section-heading h2 {
  scroll-margin-top: 88px;
  font-family: var(--journal-serif);
  font-size: 27px;
  font-weight: 500;
  letter-spacing: 0.025em;
  margin-top: 6px;
  color: var(--fuwari-fg);
}
.home-section-heading > a {
  margin-bottom: 5px;
}
.home-post-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}
.public-site .public-post-card {
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 0;
  padding: 24px;
  height: 100%;
  border-radius: 18px;
}
.post-card-cover {
  display: block;
  aspect-ratio: 16 / 7;
  margin: -24px -24px 4px;
  overflow: hidden;
  border-bottom: 1px solid var(--public-glass-border);
}
.post-card-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.post-card-dateline {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 12px;
  color: var(--fuwari-fg-50);
  font-size: 11px;
  line-height: 1.5;
  font-variant-numeric: tabular-nums;
}
.post-card-dateline > time {
  margin-right: auto;
}
.post-card-status {
  color: var(--journal-accent);
}
.public-post-card h3 {
  font-family: var(--journal-serif);
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.015em;
  line-height: 1.5;
  overflow-wrap: anywhere;
  color: var(--fuwari-fg);
}
.public-post-card h3 a:hover {
  color: var(--fuwari-primary);
}
.post-card-summary {
  font-size: 13px;
  line-height: 1.95;
  color: var(--fuwari-fg-75);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  overflow-wrap: anywhere;
}
.post-card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-block: 1px 4px;
}
.post-card-tags li {
  min-width: 0;
  max-width: 100%;
}
.post-card-tags a {
  display: block;
  padding: 3px 7px;
  border: 1px solid var(--public-glass-border);
  border-radius: 6px;
  font-size: 10px;
  line-height: 1.5;
  color: var(--fuwari-fg-50);
  overflow-wrap: anywhere;
}
.post-card-tags a:hover {
  color: var(--fuwari-primary);
  border-color: var(--fuwari-primary);
}
.post-card-footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding-top: 15px;
  margin-top: auto;
  border-top: 1px solid var(--public-glass-border);
  color: var(--fuwari-fg-50);
  font-size: 10px;
}
.post-card-footer a {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: var(--fuwari-fg-75);
}
.post-card-footer a:hover {
  color: var(--fuwari-primary);
}
.public-post-card:focus-within {
  border-color: var(--fuwari-primary);
}
.home-empty-state {
  padding-block: 48px;
}
.home-writing-section > nav {
  margin-top: 24px;
}
/* Reading: same typography and borders, with a quieter background. */
.post-reading-article h1 {
  font-family: var(--journal-serif);
  font-weight: 600;
  font-size: clamp(30px, 3.4vw, 44px);
  line-height: 1.35;
  letter-spacing: -0.025em;
}
.post-reading-article > .flex:first-child {
  color: var(--fuwari-fg-50);
  letter-spacing: 0.03em;
}
.post-reading-article .prose {
  font-size: 17px;
  line-height: 2;
  letter-spacing: 0.012em;
}
.post-reading-article .prose :is(h2, h3, h4) {
  font-family: var(--journal-serif);
  font-weight: 600;
}
.post-reading-article .prose h2 {
  font-size: 28px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--public-glass-border);
}
.post-reading-article .prose h3 {
  font-size: 22px;
}
.post-reading-article .border-dashed {
  border-style: solid;
  border-color: var(--public-glass-border);
}
.post-toc-desktop {
  border-left: 1px solid var(--public-glass-border);
  padding-left: 12px;
}
.post-toc-desktop h2 {
  font-family: var(--journal-serif);
}
.public-site .public-footer {
  color: var(--fuwari-fg-50);
}
@media (max-width: 767px) {
  .public-main-shell {
    padding-top: 20px;
  }
  .home-cover {
    height: 240px;
    border-radius: 16px;
  }
  .home-cover-caption {
    left: 18px;
    right: 18px;
    bottom: 18px;
    gap: 12px;
    font-size: 11px;
  }
  .home-cover-index {
    font-size: 16px;
    padding-right: 12px;
  }
  .home-introduction {
    grid-template-columns: minmax(0, 1fr);
    gap: 28px;
    padding-top: 28px;
  }
  .home-introduction h1 {
    font-size: 48px;
  }
  .public-site .home-author-note {
    padding: 20px;
  }
  .home-author-note > p {
    font-size: 17px;
    margin-top: 12px;
  }
  .home-author-signature {
    margin-top: 16px;
    padding-top: 14px;
  }
  .home-post-grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 16px;
  }
  .journal-divider {
    margin-block: 32px;
  }
  .home-section-heading h2 {
    font-size: 24px;
  }
  .public-site .listing-heading {
    padding: 24px;
  }
  .post-reading-article .prose {
    font-size: 16px;
  }
}
@media (max-width: 639px) {
  .public-site .public-navbar {
    padding-inline: 20px;
  }
  .public-site .public-nav-tools {
    padding: 2px;
    border-radius: 14px;
  }
  .public-brand .site-wordmark {
    font-size: 26px;
  }
  .public-brand .site-wordmark-custom {
    font-size: 16px;
  }
}
@media (prefers-reduced-transparency: reduce) {
  .public-site .fuwari-card-base,
  .public-site .public-navigation-panel {
    background: var(--journal-surface);
    -webkit-backdrop-filter: none;
    backdrop-filter: none;
  }
  .public-site :is(.fuwari-card-base, .public-navigation-panel)::after {
    display: none;
  }
  .public-acrylic {
    background: var(--fuwari-page-bg);
  }
}
@media (prefers-reduced-motion: reduce) {
  .public-site .public-post-card,
  .public-site :is(.fuwari-card-base, .public-navigation-panel)::after {
    transition: none;
  }
}
```

### `src/components/layout/navbar.tsx`

```tsx
import { Link, useLocation, useRouteContext } from "@tanstack/react-router";
import { ChevronDown, Menu, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { IconButton } from "@/components/ui/icon-button";
import { Skeleton } from "@/components/ui/skeleton";
import type { NavOption, UserInfo } from "./layout-props";
import { MOTION, useMotionPresence } from "@/hooks/use-motion";
import { m } from "@/paraglide/messages";
import { LanguageSwitcher } from "./language-switcher";
import { PublicNavLink } from "./public-nav-link";
import { MobileMenu } from "./mobile-menu";
import "./navbar.css";
import { SiteAvatar } from "./site-avatar";
import { SiteWordmark } from "./site-wordmark";

interface NavbarProps {
  navOptions: Array<NavOption>;
  isLoading?: boolean;
  user?: UserInfo;
  logout: () => Promise<void>;
  bannerHeightVh: number;
}

export function Navbar({
  user,
  navOptions,
  isLoading,
  logout,
  bannerHeightVh,
}: NavbarProps) {
  const { siteConfig } = useRouteContext({ from: "__root__" });
  const pathname = useLocation({ select: (location) => location.pathname });
  const [isHidden, setIsHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [mobile, setMobile] = useState(false);
  const present = useMotionPresence(open, MOTION.popover);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    setOpen(false);
    setIsHidden(false);
  }, [pathname]);
  useEffect(() => {
    let previous = Math.max(0, window.scrollY);
    let travel = 0;
    const handleScroll = () => {
      const y = Math.max(0, window.scrollY);
      const delta = y - previous;
      previous = y;
      if (
        open ||
        (rootRef.current?.contains(document.activeElement) &&
          document.activeElement?.matches(":focus-visible")) ||
        rootRef.current?.querySelector('[aria-expanded="true"]')
      ) {
        travel = 0;
        setIsHidden(false);
        return;
      }
      const threshold = Math.max(
        72,
        (window.innerHeight * bannerHeightVh) / 100 - 144,
      );
      if (y < threshold) {
        travel = 0;
        setIsHidden(false);
        return;
      }
      if (Math.sign(delta) !== Math.sign(travel)) travel = 0;
      travel += delta;
      if (Math.abs(travel) >= 12) {
        setIsHidden(travel > 0);
        travel = 0;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [bannerHeightVh, open]);

  useEffect(() => {
    if (!open) return;
    panelRef.current
      ?.querySelector<HTMLElement>("a, button")
      ?.focus({ preventScroll: true });
    const pointer = (event: PointerEvent) => {
      const target = event.target as Node;
      if (
        !panelRef.current?.contains(target) &&
        !triggerRef.current?.contains(target)
      )
        setOpen(false);
    };
    const key = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus({ preventScroll: true });
    };
    const resize = () => setOpen(false);
    document.addEventListener("pointerdown", pointer);
    document.addEventListener("keydown", key);
    window.addEventListener("resize", resize);
    return () => {
      document.removeEventListener("pointerdown", pointer);
      document.removeEventListener("keydown", key);
      window.removeEventListener("resize", resize);
    };
  }, [open]);

  const toggle = (button: HTMLButtonElement, compact: boolean) => {
    triggerRef.current = button;
    setMobile(compact);
    setOpen((value) => !value);
    setIsHidden(false);
  };

  return (
    <div
      ref={rootRef}
      id="fuwari-navbar-wrapper"
      className="public-navbar-wrapper"
      data-hidden={isHidden && !open}
      onFocusCapture={() => setIsHidden(false)}
    >
      <div id="fuwari-navbar" className="public-navbar fuwari-card-base">
        <Link to="/" className="public-brand" title={siteConfig.title}>
          <SiteWordmark title={siteConfig.title} />
        </Link>
        <nav className="public-desktop-links">
          {navOptions.map((option) => (
            <PublicNavLink
              key={option.id}
              option={option}
              className="public-nav-link"
              activeClassName="public-nav-active"
            />
          ))}
        </nav>
        <div className="public-nav-tools">
          <Link
            to="/search"
            className="public-nav-search"
            aria-label={m.nav_search()}
          >
            <Search size={18} strokeWidth={1.5} />
            <span>{m.nav_search()}</span>
          </Link>
          <div className="public-desktop-tools">
            <ThemeToggle className="public-tool-button" />
            <LanguageSwitcher className="public-tool-button" />
            <IconButton
              size="lg"
              className="public-account-trigger"
              label={user ? m.profile_title() : m.nav_login_register()}
              aria-expanded={open && !mobile}
              aria-controls="public-navigation-panel"
              onClick={(event) => toggle(event.currentTarget, false)}
            >
              {isLoading ? (
                <Skeleton className="w-7 h-7 rounded-lg" />
              ) : (
                <SiteAvatar src={user?.image} />
              )}
              <ChevronDown size={12} />
            </IconButton>
          </div>
          <IconButton
            size="lg"
            className="public-mobile-trigger"
            label={open && mobile ? m.common_close() : m.common_open_menu()}
            aria-expanded={open && mobile}
            aria-controls="public-navigation-panel"
            onClick={(event) => toggle(event.currentTarget, true)}
          >
            {open && mobile ? (
              <X size={20} strokeWidth={1.5} />
            ) : (
              <Menu size={20} strokeWidth={1.5} />
            )}
          </IconButton>
        </div>
        {present && (
          <div
            ref={panelRef}
            id="public-navigation-panel"
            className="public-navigation-panel fuwari-popover-motion"
            data-state={open ? "open" : "closing"}
            inert={!open}
            aria-hidden={!open}
            onBlur={(event) => {
              if (
                event.relatedTarget &&
                !event.currentTarget.contains(event.relatedTarget as Node) &&
                event.relatedTarget !== triggerRef.current
              )
                setOpen(false);
            }}
          >
            <MobileMenu
              navOptions={navOptions}
              user={user}
              isLoading={isLoading}
              logout={logout}
              mobile={mobile}
              onClose={() => setOpen(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
```

### `src/components/layout/listing-heading.tsx`

```tsx
import type { ReactNode } from "react";

/** Shared heading for the home, posts and tags pages. */
export function ListingHeading({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <header className="listing-heading fuwari-card-base border border-(--fuwari-meta-divider) p-6 sm:p-8">
      <h1 className="fuwari-text-90 text-2xl font-semibold tracking-tight wrap-anywhere sm:text-3xl">
        {title}
      </h1>
      {description && (
        <p className="fuwari-text-75 mt-3 max-w-prose text-sm leading-7 wrap-anywhere sm:text-base">
          {description}
        </p>
      )}
      {children && <div className="mt-5">{children}</div>}
    </header>
  );
}
```

### `src/components/layout/public-layout.tsx`

```tsx
import {
  useLocation,
  useRouteContext,
  useRouterState,
} from "@tanstack/react-router";
import type { PublicLayoutProps } from "@/components/layout/layout-props";
import { cn } from "@/lib/utils";
import { BackToTop } from "./back-to-top";
import { BackgroundImage, RandomBackgroundProvider } from "./random-background";
import { FloatingActionsProvider } from "./floating-actions";
import { Footer } from "./footer";
import { GlassPointer } from "./glass-pointer";
import { Navbar } from "./navbar";
import { PageFade } from "./page-fade";
import "./public-theme.css";

export function PublicLayout({
  children,
  navOptions,
  user,
  isSessionLoading,
  logout,
}: PublicLayoutProps) {
  const { siteConfig } = useRouteContext({ from: "__root__" });
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isPostPage = useRouterState({
    select: (state) =>
      state.matches.some((match) => match.routeId === "/_public/post/$slug"),
  });
  return (
    <FloatingActionsProvider>
      <RandomBackgroundProvider source={siteConfig.theme.fuwari.homeBg}>
        <div
          className={cn(
            "public-site relative min-h-screen",
            isHomePage && "public-home-site",
            isPostPage && "public-reading-site",
          )}
        >
          <GlassPointer />
          <div className="public-ambient" aria-hidden="true">
            <div className="public-ambient-photo">
              <BackgroundImage priority={isHomePage} />
            </div>
            <div className="public-acrylic" />
          </div>
          <div className="sticky top-0 z-50 pointer-events-none">
            <div className="pointer-events-auto w-full">
              <Navbar
                navOptions={navOptions}
                logout={logout}
                user={user}
                isLoading={isSessionLoading}
                bannerHeightVh={isHomePage ? 44 : 16}
              />
            </div>
          </div>
          <div className="public-main-shell relative z-30">
            <div
              className="public-content-grid relative mx-auto px-5 pb-8 sm:px-8"
              style={{ maxWidth: isPostPage ? "84rem" : "72rem" }}
            >
              <main className="min-w-0">
                <PageFade includeSearch={location.pathname !== "/search"}>
                  {children}
                </PageFade>
              </main>
              <div className="public-footer">
                <Footer navOptions={navOptions} />
              </div>
              <BackToTop
                readingKey={isPostPage ? location.pathname : undefined}
              />
            </div>
          </div>
        </div>
      </RandomBackgroundProvider>
    </FloatingActionsProvider>
  );
}
```

### `src/routes/__root.tsx`

```tsx
import type { QueryClient } from "@tanstack/react-query";
import {
  ClientOnly,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
  useRouteContext,
} from "@tanstack/react-router";
import { createIsomorphicFn } from "@tanstack/react-start";
import { lazy, Suspense, type ComponentType } from "react";
import { ThemeProvider } from "@/components/common/theme-provider";
import { getFuwariThemeStyle } from "@/components/layout/document-style";
import { siteConfigQuery } from "@/features/config/queries";
import { getLocale } from "@/paraglide/runtime";
import appCss from "@/styles.css?url";

interface MyRouterContext {
  queryClient: QueryClient;
}

const loadDevtools = createIsomorphicFn()
  .client(() => import("@/integrations/tanstack-devtools"))
  .server(() =>
    Promise.resolve({
      default: function DevtoolsPlaceholder() {
        return null;
      },
    }),
  );

const AppDevtools = lazy(
  () => loadDevtools() as Promise<{ default: ComponentType }>,
);

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: async ({ context }) => {
    const siteConfig =
      await context.queryClient.ensureQueryData(siteConfigQuery);
    return { siteConfig };
  },
  loader: async ({ context }) => {
    return {
      siteConfig: context.siteConfig,
      currentYear: new Date().getUTCFullYear(),
    };
  },
  head: ({ loaderData }) => {
    return {
      meta: [
        {
          charSet: "utf-8",
        },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        {
          title: loaderData?.siteConfig?.title,
        },
        {
          name: "description",
          content: loaderData?.siteConfig?.description,
        },
      ],
      links: [
        {
          rel: "icon",
          type: "image/svg+xml",
          href: loaderData?.siteConfig?.icons.faviconSvg,
        },
        {
          rel: "icon",
          type: "image/png",
          href: loaderData?.siteConfig?.icons.favicon96,
          sizes: "96x96",
        },
        {
          rel: "shortcut icon",
          href: loaderData?.siteConfig?.icons.faviconIco,
        },
        {
          rel: "apple-touch-icon",
          type: "image/png",
          href: loaderData?.siteConfig?.icons.appleTouchIcon,
          sizes: "180x180",
        },
        {
          rel: "manifest",
          href: "/site.webmanifest",
        },
        {
          rel: "stylesheet",
          href: appCss,
        },
        {
          rel: "alternate",
          type: "application/rss+xml",
          title: "RSS Feed",
          href: "/rss.xml",
        },
        {
          rel: "alternate",
          type: "application/atom+xml",
          title: "Atom Feed",
          href: "/atom.xml",
        },
        {
          rel: "alternate",
          type: "application/feed+json",
          title: "JSON Feed",
          href: "/feed.json",
        },
      ],
    };
  },
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  const locale = getLocale();
  const { siteConfig } = useRouteContext({ from: "__root__" });

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      style={getFuwariThemeStyle(siteConfig)}
    >
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
        <ClientOnly>
          <Suspense fallback={null}>
            <AppDevtools />
          </Suspense>
        </ClientOnly>
        <Scripts />
      </body>
    </html>
  );
}
```

### `src/routes/_public/route.tsx`

```tsx
import {
  createFileRoute,
  Outlet,
  useNavigate,
  useRouteContext,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { PublicLayout as SitePublicLayout } from "@/components/layout/public-layout";
import { Toaster } from "@/components/layout/toaster";
import { NameGate } from "@/features/auth/components/name-gate";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { useSession } from "@/lib/auth/auth-client";
import { CACHE_CONTROL } from "@/lib/constants";
import { clientEnv } from "@/lib/env/client.env";
import { isExternalNavHref } from "@/features/config/utils/nav-links";
import { m } from "@/paraglide/messages";

export const Route = createFileRoute("/_public")({
  component: PublicLayout,
  headers: () => {
    return CACHE_CONTROL.html;
  },
  head: () => {
    const env = clientEnv();
    return {
      scripts: env.VITE_UMAMI_WEBSITE_ID
        ? [
            {
              src: "/stats.js",
              defer: true,
              "data-website-id": env.VITE_UMAMI_WEBSITE_ID,
            },
          ]
        : [],
    };
  },
});

function PublicLayout() {
  const navigate = useNavigate();
  const { siteConfig } = useRouteContext({ from: "__root__" });
  const { data: session, isPending: isSessionPending } = useSession();
  const { logout } = useLogout();

  const navOptions = [
    { id: "home", label: m.nav_home(), href: "/", external: false },
    { id: "posts", label: m.nav_posts(), href: "/posts", external: false },
    { id: "tags", label: m.tags_title(), href: "/tags", external: false },
    {
      id: "friend-links",
      label: m.nav_friend_links(),
      href: "/friend-links",
      external: false,
    },
    ...siteConfig.navLinks.map((link, index) => ({
      id: `custom-${index}`,
      label: link.label,
      href: link.href,
      external: isExternalNavHref(link.href),
    })),
  ];

  // Global shortcut: Cmd/Ctrl + K to navigate to search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isToggle = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
      if (isToggle) {
        e.preventDefault();
        void navigate({ to: "/search" });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);

  return (
    <>
      <SitePublicLayout
        navOptions={navOptions}
        user={session?.user}
        isSessionLoading={isSessionPending}
        logout={logout}
      >
        <Outlet />
      </SitePublicLayout>
      <NameGate user={session?.user} logout={logout} />
      <Toaster />
    </>
  );
}
```

### `src/routes/_public/index.tsx`

```tsx
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";
import { getHomeBackgroundPreloadImages } from "@/components/layout/preload-images";
import { siteDomainQuery } from "@/features/config/queries";
import {
  HomePage,
  POPULAR_POSTS_LIMIT,
} from "@/features/posts/components/home-page";
import { HomePageSkeleton } from "@/features/posts/components/home-page-skeleton";
import { popularPostsQuery, homePostsQuery } from "@/features/posts/queries";
import { buildCanonicalUrl, canonicalLink } from "@/lib/seo";

export const Route = createFileRoute("/_public/")({
  validateSearch: z.object({
    page: z.coerce
      .number()
      .int()
      .min(1)
      .max(1_000_000)
      .optional()
      .catch(undefined),
  }),
  loaderDeps: ({ search }) => ({ page: search.page ?? 1 }),
  loader: async ({ context, deps }) => {
    const [posts, domain] = await Promise.all([
      context.queryClient.ensureQueryData(homePostsQuery(deps.page)),
      context.queryClient.ensureQueryData(siteDomainQuery),
      context.queryClient.ensureQueryData(
        popularPostsQuery(POPULAR_POSTS_LIMIT),
      ),
    ]);

    if (posts.page !== deps.page) {
      throw redirect({
        to: "/",
        search: { page: posts.page === 1 ? undefined : posts.page },
        replace: true,
      });
    }
    return {
      canonicalHref: buildCanonicalUrl(domain, "/", {
        page: posts.page === 1 ? undefined : String(posts.page),
      }),
      preloadImages: getHomeBackgroundPreloadImages(context.siteConfig),
    };
  },
  head: ({ loaderData }) => ({
    links: [
      canonicalLink(loaderData?.canonicalHref ?? "/"),
      ...(loaderData?.preloadImages ?? []).map((href) => ({
        rel: "preload" as const,
        as: "image",
        href,
      })),
    ],
  }),
  pendingComponent: HomePageSkeleton,
  component: HomeRoute,
});

function HomeRoute() {
  const { siteConfig } = Route.useRouteContext();
  const { page = 1 } = Route.useSearch();
  const { data } = useSuspenseQuery(homePostsQuery(page));
  const { data: popularPosts } = useSuspenseQuery(
    popularPostsQuery(POPULAR_POSTS_LIMIT),
  );
  return (
    <HomePage
      title={siteConfig.title}
      description={siteConfig.description}
      posts={data.items}
      popularPosts={popularPosts}
      page={data.page}
      totalPages={data.totalPages}
    />
  );
}
```

### `src/routes/_public/posts.tsx`

```tsx
import {
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { z } from "zod";
import { siteConfigQuery, siteDomainQuery } from "@/features/config/queries";
import {
  POSTS_PER_PAGE,
  PostsPage,
} from "@/features/posts/components/posts-page";
import { PostsFilterNotFound } from "@/features/posts/components/posts-filter-not-found";
import { PostsPageSkeleton } from "@/features/posts/components/posts-page-skeleton";
import { categoriesQueryOptions } from "@/features/categories/queries";
import { postsInfiniteQueryOptions } from "@/features/posts/queries";
import {
  PostCategoryNameSchema,
  PostTagNameSchema,
} from "@/features/posts/schema/posts.schema";
import {
  findMissingPublicFilter,
  resolvePublicName,
  withTagFilter,
} from "@/features/posts/utils/post-public-search";
import { tagsQueryOptions } from "@/features/tags/queries";
import { buildCanonicalUrl, canonicalLink } from "@/lib/seo";
import { m } from "@/paraglide/messages";

export const Route = createFileRoute("/_public/posts")({
  validateSearch: z.object({
    tagName: PostTagNameSchema,
    categoryName: PostCategoryNameSchema,
    uncategorized: z
      .union([z.boolean(), z.literal("true"), z.literal("false")])
      .transform((value) => value === true || value === "true")
      .optional(),
  }),
  component: RouteComponent,
  notFoundComponent: PostsFilterNotFound,
  pendingComponent: PostsSkeleton,
  loaderDeps: ({ search }) => ({
    tagName: search.tagName,
    categoryName: search.categoryName,
    uncategorized: search.uncategorized,
  }),
  loader: async ({ context, deps }) => {
    const [tags, categories, domain, siteConfig] = await Promise.all([
      context.queryClient.ensureQueryData(tagsQueryOptions),
      context.queryClient.ensureQueryData(categoriesQueryOptions),
      context.queryClient.ensureQueryData(siteDomainQuery),
      context.queryClient.ensureQueryData(siteConfigQuery),
    ]);

    // A name is addressed in any case; one that is no Tag or Category of a
    // published post is a page that does not exist, not an empty list. The
    // not-found page names it.
    const tagName = resolvePublicName(
      tags.map((tag) => tag.name),
      deps.tagName,
    );
    const categoryName = deps.uncategorized
      ? undefined
      : resolvePublicName(
          categories.map((category) => category.name),
          deps.categoryName,
        );
    if (tagName === null || categoryName === null) {
      throw notFound({
        data: findMissingPublicFilter({ tagName, categoryName }, deps),
      });
    }

    await context.queryClient.prefetchInfiniteQuery(
      postsInfiniteQueryOptions({
        tagName,
        categoryName,
        uncategorized: deps.uncategorized,
        limit: POSTS_PER_PAGE,
      }),
    );

    return {
      tagName,
      categoryName,
      title: m.posts_title(),
      description: siteConfig.description,
      canonicalHref: buildCanonicalUrl(domain, "/posts", {
        tagName,
        categoryName,
        uncategorized: deps.uncategorized ? "true" : undefined,
      }),
    };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData?.title,
      },
      {
        name: "description",
        content: loaderData?.description,
      },
    ],
    links: [canonicalLink(loaderData?.canonicalHref ?? "/posts")],
  }),
});

function RouteComponent() {
  const search = Route.useSearch();
  const { tagName, categoryName } = Route.useLoaderData();
  const navigate = useNavigate({ from: Route.fullPath });

  const { data: tags } = useSuspenseQuery(tagsQueryOptions);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(
      postsInfiniteQueryOptions({
        tagName,
        categoryName,
        uncategorized: search.uncategorized,
        limit: POSTS_PER_PAGE,
      }),
    );

  const posts = useMemo(() => {
    return data.pages.flatMap((page) => page.items);
  }, [data]);

  const handleTagClick = (clickedTag?: string) => {
    void navigate({
      search: withTagFilter(clickedTag),
      replace: true,
    });
  };

  return (
    <PostsPage
      posts={posts}
      tags={tags}
      selectedTag={tagName}
      onTagClick={handleTagClick}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      fetchNextPage={fetchNextPage}
    />
  );
}

function PostsSkeleton() {
  return <PostsPageSkeleton />;
}
```

### `src/routes/_public/tags.tsx`

```tsx
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { siteDomainQuery } from "@/features/config/queries";
import { TagsPage } from "@/features/tags/components/tags-page";
import { tagsQueryOptions } from "@/features/tags/queries";
import { buildCanonicalUrl, canonicalLink } from "@/lib/seo";
import { m } from "@/paraglide/messages";

export const Route = createFileRoute("/_public/tags")({
  loader: async ({ context }) => {
    const [, domain] = await Promise.all([
      context.queryClient.ensureQueryData(tagsQueryOptions),
      context.queryClient.ensureQueryData(siteDomainQuery),
    ]);
    return {
      title: m.tags_title(),
      description: m.tags_description(),
      canonicalHref: buildCanonicalUrl(domain, "/tags"),
    };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData?.title },
      { name: "description", content: loaderData?.description },
    ],
    links: [canonicalLink(loaderData?.canonicalHref ?? "/tags")],
  }),
  component: TagsRoute,
});

function TagsRoute() {
  const { data: tags } = useSuspenseQuery(tagsQueryOptions);
  return <TagsPage tags={tags} />;
}
```

### `src/features/posts/components/home-page.tsx`

```tsx
import { Link, useRouteContext } from "@tanstack/react-router";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { BackgroundImage } from "@/components/layout/random-background";
import { SiteAvatar } from "@/components/layout/site-avatar";
import { SiteSocialLinks } from "@/components/layout/site-social-links";
import { SiteWordmark } from "@/components/layout/site-wordmark";
import { EmptyState } from "@/components/ui/empty-state";
import type { PostItem } from "@/features/posts/schema/posts.schema";
import { m } from "@/paraglide/messages";
import { HomePagination } from "./home-pagination";
import { PostCard } from "./post-card";

export const POPULAR_POSTS_LIMIT = 3;
interface HomePageProps {
  title: string;
  description: string;
  posts: Array<PostItem>;
  popularPosts?: Array<PostItem>;
  page: number;
  totalPages: number;
}

export function HomePage({
  title,
  description,
  posts,
  popularPosts,
  page,
  totalPages,
}: HomePageProps) {
  const { siteConfig } = useRouteContext({ from: "__root__" });
  const popularSlugs = new Set((popularPosts ?? []).map((post) => post.slug));
  return (
    <div className="journal-home">
      <section className="home-cover" aria-label={m.home_cover_label()}>
        <BackgroundImage priority />
        <div className="home-cover-shade" />
        <div className="home-cover-caption">
          <span className="home-cover-index" aria-hidden="true">
            J / 01
          </span>
          <span>{m.home_cover_caption()}</span>
          <a
            href="#home-writing-title"
            className="home-cover-scroll"
            aria-label={m.home_latest_posts()}
          >
            <ArrowDown size={16} aria-hidden="true" />
          </a>
        </div>
      </section>
      <section className="home-introduction">
        <div className="home-introduction-main">
          <span className="journal-eyebrow">{m.home_journal_eyebrow()}</span>
          <h1>
            <SiteWordmark title={title} />
          </h1>
          <p className="home-description">{description}</p>
          <div className="home-introduction-actions">
            <Link to="/posts" className="journal-primary-link">
              {m.posts_title()}
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
            <Link to="/tags" className="journal-text-link">
              {m.tags_title()}
            </Link>
            <SiteSocialLinks />
          </div>
        </div>
        <aside className="home-author-note fuwari-card-base">
          <span className="journal-eyebrow">{m.home_about_label()}</span>
          <p>{m.home_about_note()}</p>
          <div className="home-author-signature">
            <SiteAvatar />
            <div>
              <span>{siteConfig.author}</span>
              <small>{m.home_author_label()}</small>
            </div>
            <span className="home-signature-flourish" aria-hidden="true">
              j.
            </span>
          </div>
        </aside>
      </section>
      <div className="journal-divider" aria-hidden="true">
        <span />
        <i />
        <i />
        <i />
        <span />
      </div>
      <section
        className="home-writing-section"
        aria-labelledby="home-writing-title"
      >
        <header className="home-section-heading">
          <div>
            <span className="journal-eyebrow">{m.home_writing_eyebrow()}</span>
            <h2 id="home-writing-title">{m.home_latest_posts()}</h2>
          </div>
          <Link to="/posts" className="journal-text-link">
            {m.home_view_all()}
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </header>
        {posts.length ? (
          <div className="home-post-grid">
            {posts.map((post) => (
              <PostCard
                key={post.slug}
                post={post}
                pinned={Boolean(post.pinnedAt)}
                popular={!post.pinnedAt && popularSlugs.has(post.slug)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            className="fuwari-card-base home-empty-state"
            description={m.posts_no_posts()}
          />
        )}
        {totalPages > 1 && (
          <HomePagination page={page} totalPages={totalPages} />
        )}
      </section>
    </div>
  );
}
```

### `src/features/posts/components/post-card.tsx`

```tsx
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import {
  getPublicImageSrc,
  getPublicImageSrcSet,
  PUBLIC_IMAGE_WIDTH,
} from "@/features/media/utils/media.utils";
import {
  withCategoryFilter,
  withTagFilter,
} from "@/features/posts/utils/post-public-search";
import type { PostItem } from "@/features/posts/schema/posts.schema";
import { formatPublicPostDate } from "@/features/posts/utils/format-public-post-date";
import { m } from "@/paraglide/messages";

export function PostCard({
  post,
  pinned,
  popular,
}: {
  post: PostItem;
  pinned?: boolean;
  popular?: boolean;
}) {
  return (
    <article className="public-post-card fuwari-card-base">
      {post.cover && (
        <Link
          to="/post/$slug"
          params={{ slug: post.slug }}
          className="post-card-cover"
          aria-label={post.title}
        >
          <img
            src={getPublicImageSrc(post.cover.url, PUBLIC_IMAGE_WIDTH.cover)}
            srcSet={getPublicImageSrcSet(post.cover.url, [
              PUBLIC_IMAGE_WIDTH.cover,
              PUBLIC_IMAGE_WIDTH.cover * 2,
            ])}
            sizes="(min-width: 768px) 520px, 100vw"
            alt=""
            width={post.cover.width ?? undefined}
            height={post.cover.height ?? undefined}
            loading="lazy"
            decoding="async"
          />
        </Link>
      )}
      <div className="post-card-dateline">
        <time dateTime={post.publishedAt?.toISOString()}>
          {formatPublicPostDate(post.publishedAt)}
        </time>
        {(pinned || popular) && (
          <span className="post-card-status">
            {pinned ? m.home_pinned_posts() : m.home_popular_posts()}
          </span>
        )}
        {post.category && (
          <Link to="/posts" search={withCategoryFilter(post.category.name)}>
            {post.category.name}
          </Link>
        )}
      </div>
      <h3>
        <Link to="/post/$slug" params={{ slug: post.slug }}>
          {post.title}
        </Link>
      </h3>
      {post.summary && <p className="post-card-summary">{post.summary}</p>}
      {(post.tags ?? []).length > 0 && (
        <ul className="post-card-tags" aria-label={m.tags_title()}>
          {post.tags?.map((tag) => (
            <li key={tag.name}>
              <Link to="/posts" search={withTagFilter(tag.name)}>
                #{tag.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
      <div className="post-card-footer">
        <span>
          {m.read_time({ count: post.readTimeInMinutes })}
          {post.viewCount !== undefined && (
            <> · {m.post_views_count({ count: post.viewCount })}</>
          )}
        </span>
        <Link
          to="/post/$slug"
          params={{ slug: post.slug }}
          aria-label={`${m.home_read_post()} · ${post.title}`}
        >
          {m.home_read_post()}
          <ArrowUpRight size={15} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
```

### `src/features/posts/components/posts-page.tsx`

```tsx
import { useEffect, useRef } from "react";
import { ListingHeading } from "@/components/layout/listing-heading";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import type { PostItem } from "@/features/posts/schema/posts.schema";
import type { TagWithCount } from "@/features/tags/tags.schema";
import { m } from "@/paraglide/messages";
import { ArchivePanel } from "./archive/archive-panel";

export const POSTS_PER_PAGE = 24;

interface PostsPageProps {
  posts: Array<PostItem>;
  tags: Array<Omit<TagWithCount, "createdAt">>;
  selectedTag?: string;
  onTagClick: (tag?: string) => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

export function PostsPage({
  posts,
  tags,
  selectedTag,
  onTagClick,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: PostsPageProps) {
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1, rootMargin: "0px" },
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div
      className="fuwari-onload-animation flex flex-col gap-5 sm:gap-6"
      style={{ animationDelay: "var(--fuwari-content-delay)" }}
    >
      <ListingHeading
        title={m.posts_title()}
        description={m.posts_description()}
      >
        {tags.length > 0 && (
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label={m.tags_title()}
          >
            {[undefined, ...tags.map((tag) => tag.name)].map((name) => (
              <button
                key={name === undefined ? "all" : `tag-${name}`}
                type="button"
                aria-pressed={selectedTag === name}
                onClick={() => onTagClick(name)}
                className={`min-h-10 max-w-full rounded-lg border px-3 py-2 text-sm wrap-anywhere transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${selectedTag === name ? "border-(--fuwari-primary) bg-(--fuwari-btn-regular-bg) text-(--fuwari-btn-content)" : "border-(--fuwari-meta-divider) fuwari-text-75 hover:bg-(--fuwari-btn-regular-bg)"}`}
              >
                {name ? `#${name}` : m.posts_title()}
              </button>
            ))}
          </div>
        )}
      </ListingHeading>
      {posts.length > 0 && <ArchivePanel posts={posts} />}

      {/* Infinite Scroll trigger and loading indicator */}
      <div
        ref={observerRef}
        className="flex flex-col items-center justify-center pt-2 pb-8"
      >
        {isFetchingNextPage ? (
          <div className="fuwari-card-base w-full px-8 py-6 opacity-70">
            {/* Inline Mini Skeleton for appending items */}
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-10 w-full rounded-lg flex flex-row justify-start items-center"
              >
                <div className="w-[15%] md:w-[10%] flex justify-end pr-2">
                  <Skeleton className="h-4 w-10" />
                </div>
                <div className="w-[15%] md:w-[10%] relative h-full flex items-center before:absolute before:w-1 left-1/2 -ml-0.5 pointer-events-none before:border-l-2 before:border-dashed before:border-black/5 dark:before:border-white/5 before:-top-5 before:bottom-0 before:h-20 z-0">
                  <div className="mx-auto w-2 h-2 rounded-full bg-black/20 dark:bg-white/20 z-10" />
                </div>
                <div className="w-[70%] md:max-w-[65%] md:w-[65%] flex justify-start pl-2">
                  <Skeleton className="h-5 w-3/4 max-w-50" />
                </div>
              </div>
            ))}
          </div>
        ) : hasNextPage ? (
          <div className="h-px w-24 bg-black/10 dark:bg-white/10"></div>
        ) : posts.length > 0 ? (
          <div className="flex items-center gap-4 fuwari-text-50 mt-4">
            <span className="h-px w-12 bg-current" />
            <span className="text-sm">{m.posts_end()}</span>
            <span className="h-px w-12 bg-current" />
          </div>
        ) : (
          <EmptyState
            size="compact"
            className="fuwari-card-base w-full py-12"
            description={m.posts_no_posts()}
          />
        )}
      </div>
    </div>
  );
}
```

### `src/features/posts/components/archive/archive-panel.tsx`

```tsx
import type { PostItem } from "@/features/posts/schema/posts.schema";
import { ArchivePost } from "./archive-post";
import { ArchiveYear } from "./archive-year";

interface ArchivePanelProps {
  posts: Array<PostItem>;
}

export function ArchivePanel({ posts }: ArchivePanelProps) {
  const groupedPosts = posts.reduce(
    (acc, post) => {
      if (!post.publishedAt) {
        return acc;
      }

      const year = new Date(post.publishedAt).getUTCFullYear();
      acc[year] ??= [];
      acc[year].push(post);
      return acc;
    },
    {} as Record<number, Array<PostItem>>,
  );

  const years = Object.keys(groupedPosts)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className="fuwari-card-base border border-(--fuwari-meta-divider) px-6 py-2 sm:px-8">
      {years.map((year) => (
        <section
          key={year}
          aria-labelledby={`archive-${year}`}
          className="py-5 not-last:border-b not-last:border-(--fuwari-meta-divider)"
        >
          <ArchiveYear year={year} count={groupedPosts[year].length} />
          <ul className="mt-3">
            {groupedPosts[year].map((post) => (
              <li key={post.id}>
                <ArchivePost post={post} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
```

### `src/features/posts/components/archive/archive-year.tsx`

```tsx
import { m } from "@/paraglide/messages";

export function ArchiveYear({ year, count }: { year: number; count: number }) {
  return (
    <div className="flex items-baseline gap-3">
      <h2
        id={`archive-${year}`}
        className="fuwari-text-90 text-xl font-semibold tracking-tight"
      >
        {year}
      </h2>
      <span className="fuwari-text-50 text-xs tabular-nums">
        {m.posts_count({ count })}
      </span>
    </div>
  );
}
```

### `src/features/posts/components/archive/archive-post.tsx`

```tsx
import { Link } from "@tanstack/react-router";
import type { PostItem } from "@/features/posts/schema/posts.schema";
import { formatPublicPostDate } from "@/features/posts/utils/format-public-post-date";

export function ArchivePost({ post }: { post: PostItem }) {
  const date = post.publishedAt ? new Date(post.publishedAt) : null;
  return (
    <Link
      to="/post/$slug"
      params={{ slug: post.slug }}
      className="group grid min-h-14 grid-cols-[3.5rem_minmax(0,1fr)] items-start gap-x-4 rounded-lg px-2 py-3 transition-colors hover:bg-(--fuwari-btn-plain-bg-hover) focus-visible:outline-2 focus-visible:outline-offset-2 sm:grid-cols-[4rem_minmax(0,1fr)]"
    >
      <time
        dateTime={date?.toISOString()}
        className="fuwari-text-50 pt-0.5 text-xs leading-6 tabular-nums"
      >
        {formatPublicPostDate(date, { monthDay: true })}
      </time>
      <div className="min-w-0">
        <h3 className="fuwari-text-90 text-base font-medium leading-7 wrap-anywhere group-hover:text-(--fuwari-primary)">
          {post.title}
        </h3>
        {(post.tags ?? []).length > 0 && (
          <p className="fuwari-text-50 mt-1 text-xs leading-5 wrap-anywhere">
            {post.tags?.map((tag) => `#${tag.name}`).join("  ")}
          </p>
        )}
      </div>
    </Link>
  );
}
```

### `src/features/tags/components/tags-page.tsx`

```tsx
import { Link } from "@tanstack/react-router";
import { Hash } from "lucide-react";
import { ListingHeading } from "@/components/layout/listing-heading";
import { EmptyState } from "@/components/ui/empty-state";
import { withTagFilter } from "@/features/posts/utils/post-public-search";
import type { TagWithCount } from "@/features/tags/tags.schema";
import { m } from "@/paraglide/messages";

export function TagsPage({ tags }: { tags: Array<TagWithCount> }) {
  return (
    <div className="flex flex-col gap-5 sm:gap-6">
      <ListingHeading
        title={m.tags_title()}
        description={m.tags_description()}
      />
      <section
        className="fuwari-card-base border border-(--fuwari-meta-divider) p-6 sm:p-8"
        aria-label={m.tags_title()}
      >
        {tags.length === 0 ? (
          <EmptyState icon={Hash} description={m.tags_empty()} />
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {tags.map((tag) => (
              <li key={tag.id} className="min-w-0">
                <Link
                  to="/posts"
                  search={withTagFilter(tag.name)}
                  className="public-tag-link group flex h-full min-h-16 items-center gap-3 rounded-xl border border-(--fuwari-meta-divider) px-4 py-3 transition-colors hover:bg-(--fuwari-btn-regular-bg) focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  <Hash
                    size={18}
                    aria-hidden="true"
                    className="shrink-0 text-(--fuwari-primary)"
                  />
                  <span className="fuwari-text-90 min-w-0 flex-1 text-sm font-medium wrap-anywhere group-hover:text-(--fuwari-primary)">
                    {tag.name}
                  </span>
                  <span className="fuwari-text-50 shrink-0 text-xs tabular-nums">
                    {m.posts_count({ count: tag.postCount })}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
```

### `src/components/layout/back-to-top.tsx`

```tsx
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { m } from "@/paraglide/messages";
import { useReadingProgress } from "@/features/posts/components/use-reading-progress";
import {
  FLOATING_ACTION_BUTTON_CLASS,
  useFloatingActionsSlotRef,
} from "./floating-actions";

export function BackToTop({ readingKey }: { readingKey?: string }) {
  const progress = useReadingProgress(readingKey);
  const setSlot = useFloatingActionsSlotRef();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Same logic as original Fuwari: show after banner height
      // The current Fuwari banner logic sets banner to ~35vh or 65vh, let's use 35vh as base threshold
      const bannerHeight = window.innerHeight * 0.35;
      setIsVisible(window.scrollY > bannerHeight);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className={cn(
        "fuwari-floating-actions z-40 transition-all duration-300",
        isVisible || readingKey
          ? "opacity-100 scale-100"
          : "opacity-0 scale-90 pointer-events-none",
      )}
    >
      {/* Page actions, such as the post TOC, stack above. */}
      <div ref={setSlot} className="contents" />
      <button
        onClick={scrollToTop}
        aria-label={m.post_back_to_top()}
        title={
          readingKey
            ? m.post_reading_progress({ percent: progress })
            : m.post_back_to_top()
        }
        className={cn(
          FLOATING_ACTION_BUTTON_CLASS,
          readingKey && "reading-back-to-top",
        )}
      >
        {readingKey && (
          <svg
            className="reading-progress-ring"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <circle cx="24" cy="24" r="21" className="reading-progress-track" />
            <circle
              cx="24"
              cy="24"
              r="21"
              pathLength="100"
              strokeDasharray="100"
              strokeDashoffset={100 - progress}
            />
          </svg>
        )}
        <ArrowUp
          className={
            readingKey ? "reading-progress-arrow" : "w-6 h-6 lg:w-7 lg:h-7"
          }
          strokeWidth={2}
        />
        {readingKey && (
          <span
            className="reading-progress-value"
            role="progressbar"
            aria-label={m.post_reading_progress_label()}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
          >
            {progress}%
          </span>
        )}
      </button>
    </div>
  );
}
```

### `src/features/posts/components/post-page.tsx`

```tsx
import { ClientOnly, Link } from "@tanstack/react-router";
import { useRef } from "react";
import { PUBLIC_IMAGE_WIDTH } from "@/features/media/utils/media.utils";
import { CommentSection } from "@/features/comments/components/comment-section";
import { ContentRenderer } from "@/features/posts/components/content/content-renderer";
import type { PostWithToc } from "@/features/posts/schema/posts.schema";
import { useSession } from "@/lib/auth/auth-client";
import { m } from "@/paraglide/messages";
import { usePhotoSwipeGallery } from "./content/photo-swipe";
import { useHeadingAnchors } from "./content/use-heading-anchors";
import ZoomableImage from "./content/zoomable-image";
import { PostAdjacentNav } from "./post-adjacent-nav";
import { PostMeta } from "./post-meta";
import { PostOutdatedNotice } from "./post-outdated-notice";
import TableOfContents from "./table-of-contents";

interface PostPageProps {
  post: Exclude<PostWithToc, null>;
}

function enterDelay(extraMs: number) {
  return `calc(var(--fuwari-content-delay) + ${extraMs}ms * var(--fuwari-stagger, 1))`;
}

export function PostPage({ post }: PostPageProps) {
  const { data: session } = useSession();
  // The cover opens on its own; body images form one gallery.
  const coverRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  usePhotoSwipeGallery(coverRef, post.id);
  usePhotoSwipeGallery(contentRef, post.id);
  useHeadingAnchors(contentRef);
  // Approximate word count
  const wordCount = post.readTimeInMinutes * 300;

  return (
    <div className="post-reading-layout">
      <TableOfContents headers={post.toc} />
      <div className="post-reading-flow">
        {/* Main Post Container */}
        <article className="post-reading-article" data-reading-content>
          {/* Word count and reading time */}
          <div
            className="flex flex-row flex-wrap fuwari-text-30 gap-5 mb-3 transition fuwari-onload-animation"
            style={{ animationDelay: enterDelay(0) }}
          >
            <div className="flex flex-row items-center">
              <div className="text-sm">
                {m.post_word_count({ count: wordCount })}
              </div>
            </div>
            <div className="flex flex-row items-center">
              <div className="text-sm">
                {m.read_time({ count: post.readTimeInMinutes })}
              </div>
            </div>
            <ClientOnly>
              {session?.user.role === "admin" && (
                <Link
                  to="/admin/posts/edit/$id"
                  params={{ id: String(post.id) }}
                  className="flex flex-row items-center fuwari-text-30 hover:fuwari-text-90 transition animate-in fade-in duration-500"
                >
                  <div className="text-sm">{m.post_edit()}</div>
                </Link>
              )}
            </ClientOnly>
          </div>

          {/* Title */}
          <div
            className="relative fuwari-onload-animation"
            style={{ animationDelay: enterDelay(50) }}
          >
            <h1
              className="transition w-full block font-bold mb-3
              text-3xl md:text-[2.25rem]/[2.75rem]
              fuwari-text-90
              md:before:w-1 before:h-5 before:rounded-md before:bg-(--fuwari-primary)
              before:absolute before:top-3 before:-left-4.5"
              style={{ viewTransitionName: `post-title-${post.slug}` }}
            >
              {post.title}
            </h1>
          </div>

          {/* Metadata */}
          <div
            className="fuwari-onload-animation"
            style={{
              animationDelay: enterDelay(100),
            }}
          >
            <PostMeta post={post} className="mb-5" />
            {!post.cover && (
              <div className="border-(--fuwari-meta-divider) border-dashed border-b mb-5" />
            )}
          </div>

          {post.cover && (
            <div
              ref={coverRef}
              id="post-cover"
              className="mb-8 rounded-xl overflow-hidden fuwari-onload-animation"
              style={{
                animationDelay: enterDelay(175),
              }}
            >
              <ZoomableImage
                src={post.cover.url}
                displayWidth={PUBLIC_IMAGE_WIDTH.cover}
                alt={post.title}
                width={post.cover.width ?? undefined}
                height={post.cover.height ?? undefined}
                className="w-full h-auto object-cover"
                loading="eager"
                fetchPriority="high"
              />
            </div>
          )}

          {/* Summary */}
          {post.summary && (
            <p className="post-reading-summary">{post.summary}</p>
          )}

          {/* Markdown Content */}
          <div
            className="fuwari-onload-animation"
            style={{
              animationDelay: enterDelay(325),
            }}
          >
            <PostOutdatedNotice
              publishedAt={post.publishedAt}
              updatedAt={post.updatedAt}
            />
            <div
              ref={contentRef}
              className="mb-6 prose dark:prose-invert prose-base max-w-none! fuwari-custom-md"
            >
              <ContentRenderer content={post.contentJson} />
            </div>
            <div className="my-8 flex items-center justify-center w-full">
              <div className="h-px w-full bg-linear-to-r from-transparent via-(--fuwari-meta-divider) to-transparent opacity-20" />
              <span className="mx-4 text-sm font-mono tracking-widest text-(--fuwari-meta-divider) opacity-50 whitespace-nowrap">
                END
              </span>
              <div className="h-px w-full bg-linear-to-r from-(--fuwari-meta-divider) via-transparent to-transparent opacity-20" />
            </div>
          </div>
        </article>

        <PostAdjacentNav slug={post.slug} />

        {/* Comments Section */}
        <div
          className="post-reading-comments fuwari-onload-animation"
          style={{ animationDelay: enterDelay(450) }}
        >
          <CommentSection postId={post.id} />
        </div>
      </div>
    </div>
  );
}
```

### `src/features/posts/components/post-page-skeleton.tsx`

```tsx
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import {
  getPublicImageSrc,
  PUBLIC_IMAGE_WIDTH,
} from "@/features/media/utils/media.utils";
import { findCachedPublicPost } from "@/features/posts/utils/cached-public-post";
import { Skeleton } from "@/components/ui/skeleton";
import { m } from "@/paraglide/messages";
import { PostMeta } from "./post-meta";

export function PostPageSkeleton() {
  const { slug } = useParams({ strict: false });
  const queryClient = useQueryClient();
  const cached =
    typeof slug === "string"
      ? findCachedPublicPost(queryClient, slug)
      : undefined;
  return (
    <div className="post-reading-layout" aria-busy="true">
      <div className="post-reading-flow">
        <div className="post-reading-article">
          <div className="mb-3 flex flex-wrap gap-5 text-sm fuwari-text-50">
            {cached ? (
              <>
                <span>
                  {m.post_word_count({ count: cached.readTimeInMinutes * 300 })}
                </span>
                <span>{m.read_time({ count: cached.readTimeInMinutes })}</span>
              </>
            ) : (
              <Skeleton className="h-4 w-40" />
            )}
          </div>
          {cached ? (
            <h1 className="mb-5 text-3xl font-bold fuwari-text-90 md:text-4xl">
              {cached.title}
            </h1>
          ) : (
            <Skeleton className="mb-5 h-10 w-4/5" />
          )}
          {cached ? (
            <PostMeta post={cached} className="mb-8" />
          ) : (
            <Skeleton className="mb-8 h-4 w-3/5" />
          )}
          {cached?.cover && (
            <div className="mb-8 overflow-hidden rounded-xl">
              <img
                src={getPublicImageSrc(
                  cached.cover.url,
                  PUBLIC_IMAGE_WIDTH.cover,
                )}
                alt={cached.title}
                width={cached.cover.width ?? undefined}
                height={cached.cover.height ?? undefined}
                className="h-auto w-full"
              />
            </div>
          )}
          {cached?.summary && (
            <p className="post-reading-summary">{cached.summary}</p>
          )}
          <div className="space-y-8">
            {[0, 1, 2].map((section) => (
              <div key={section} className="space-y-4">
                <Skeleton className="mb-6 h-6 w-2/5" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            ))}
          </div>
        </div>
        <div className="post-reading-comments">
          <Skeleton className="mb-5 h-5 w-24" />
          <Skeleton className="h-16 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
```

### `src/features/posts/components/post-meta.tsx`

```tsx
import { Link } from "@tanstack/react-router";
import { formatPublicPostDate } from "@/features/posts/utils/format-public-post-date";
import {
  withCategoryFilter,
  withTagFilter,
  withUncategorizedFilter,
} from "@/features/posts/utils/post-public-search";
import type { PostItem } from "@/features/posts/schema/posts.schema";
import { cn } from "@/lib/utils";
import { m } from "@/paraglide/messages";

export function PostMeta({
  post,
  className,
}: {
  post: PostItem;
  className?: string;
}) {
  const published = post.publishedAt;
  const updated = post.updatedAt;
  const isUpdated = Boolean(
    published && updated && published.getTime() !== updated.getTime(),
  );
  return (
    <div
      className={cn(
        "post-meta-text flex flex-wrap items-center gap-x-4 gap-y-2 text-sm fuwari-text-50",
        className,
      )}
    >
      <span>
        {m.post_published_label()}{" "}
        <time dateTime={published?.toISOString()}>
          {formatPublicPostDate(published)}
        </time>
      </span>
      {isUpdated && (
        <span>
          {m.post_updated_label()}{" "}
          <time dateTime={updated?.toISOString()}>
            {formatPublicPostDate(updated)}
          </time>
        </span>
      )}
      <Link
        to="/posts"
        search={
          post.category
            ? withCategoryFilter(post.category.name)
            : withUncategorizedFilter()
        }
      >
        {post.category?.name ?? m.post_uncategorized()}
      </Link>
      {post.tags?.length ? (
        post.tags.map((tag) => (
          <Link key={tag.name} to="/posts" search={withTagFilter(tag.name)}>
            #{tag.name}
          </Link>
        ))
      ) : (
        <span>{m.post_no_tags()}</span>
      )}
    </div>
  );
}
```

### `src/features/posts/components/table-of-contents.tsx`

```tsx
import { useEffect, useRef, useState } from "react";
import { useJumpToHeading } from "./content/use-jump-to-heading";
import type { TableOfContentsItem } from "@/features/posts/utils/toc";
import { m } from "@/paraglide/messages";

export default function TableOfContents({
  headers,
}: {
  headers: Array<TableOfContentsItem>;
}) {
  const [active, setActive] = useState(headers[0]?.id ?? "");
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const jump = useJumpToHeading();
  const minLevel = Math.min(...headers.map((heading) => heading.level), 4);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      let current = headers[0]?.id ?? "";
      for (const header of headers) {
        const element = document.getElementById(header.id);
        if (element && element.getBoundingClientRect().top <= 120)
          current = header.id;
      }
      setActive(current);
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const content = document.querySelector("[data-reading-content]");
    const observer = new ResizeObserver(schedule);
    if (content) observer.observe(content);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      observer.disconnect();
    };
  }, [headers]);

  useEffect(() => {
    const nav = navRef.current;
    const link = nav?.querySelector<HTMLElement>('[aria-current="location"]');
    if (!nav || !link) return;
    const navRect = nav.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    if (linkRect.top < navRect.top || linkRect.bottom > navRect.bottom) {
      nav.scrollTo({
        top: nav.scrollTop + linkRect.top - navRect.top - navRect.height / 2,
        behavior: "instant",
      });
    }
  }, [active]);

  if (headers.length === 0) return null;
  const links = headers.map((heading) => (
    <a
      key={heading.id}
      href={`#${heading.id}`}
      aria-current={active === heading.id ? "location" : undefined}
      style={{
        paddingInlineStart: `${12 + (heading.level - minLevel) * 14}px`,
      }}
      onClick={(event) => {
        if (
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        )
          return;
        event.preventDefault();
        if (detailsRef.current) detailsRef.current.open = false;
        void jump(heading.id);
      }}
    >
      {heading.text}
    </a>
  ));

  return (
    <aside className="post-toc">
      <div className="post-toc-desktop">
        <h2>{m.post_toc()}</h2>
        <nav ref={navRef} aria-label={m.post_toc()}>
          {links}
        </nav>
      </div>
      <details ref={detailsRef} className="post-toc-mobile">
        <summary>{m.post_toc()}</summary>
        <nav aria-label={m.post_toc()}>{links}</nav>
      </details>
    </aside>
  );
}
```

### `src/features/posts/components/use-reading-progress.ts`

```ts
import { useEffect, useState } from "react";
import { readingProgress } from "../utils/reading-progress";

export function useReadingProgress(readingKey?: string) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    setProgress(0);
    if (!readingKey) return;
    let frame = 0;
    let content: Element | null = null;
    const update = () => {
      frame = 0;
      const next = document.querySelector("[data-reading-content]");
      if (next !== content) {
        resize.disconnect();
        content = next;
        if (content) resize.observe(content);
      }
      if (!content) return;
      const rect = content.getBoundingClientRect();
      setProgress(readingProgress(rect.top, rect.height, window.innerHeight));
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    const resize = new ResizeObserver(schedule);
    const mutations = new MutationObserver(schedule);
    const main = document.querySelector("main");
    if (main) mutations.observe(main, { childList: true, subtree: true });
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      resize.disconnect();
      mutations.disconnect();
    };
  }, [readingKey]);
  return progress;
}
```

### `src/features/posts/utils/reading-progress.ts`

```ts
/** Start when the post reaches the header; finish when its end enters view. */
export function readingProgress(
  top: number,
  height: number,
  viewport: number,
  offset = 80,
) {
  if (height <= 0 || viewport <= 0) return 0;
  const distance = height - viewport + offset;
  if (distance <= 0) return top <= offset ? 100 : 0;
  return Math.round(Math.min(1, Math.max(0, (offset - top) / distance)) * 100);
}
```

### `src/features/posts/utils/reading-progress.test.ts`

```ts
import { expect, it } from "vitest";
import { readingProgress } from "./reading-progress";

it("measures only the post, finishing when its end enters the viewport", () => {
  expect(readingProgress(200, 2000, 800)).toBe(0);
  expect(readingProgress(80, 2000, 800)).toBe(0);
  expect(readingProgress(-560, 2000, 800)).toBe(50);
  expect(readingProgress(-1200, 2000, 800)).toBe(100);
  expect(readingProgress(-1800, 2000, 800)).toBe(100);
});

it("handles short posts and content not yet measured", () => {
  expect(readingProgress(100, 200, 800)).toBe(0);
  expect(readingProgress(80, 200, 800)).toBe(100);
  expect(readingProgress(0, 0, 800)).toBe(0);
});
```

### `src/components/layout/site-avatar.tsx`

```tsx
import { useRouteContext } from "@tanstack/react-router";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function SiteAvatar({
  src,
  className,
}: {
  src?: string | null;
  className?: string;
}) {
  const { siteConfig } = useRouteContext({ from: "__root__" });
  const configured = siteConfig.theme.fuwari.avatar;
  const source =
    src ||
    siteConfig.ownerAvatar ||
    (configured !== "/images/avatar.png" ? configured : null);
  const [failed, setFailed] = useState<string | null>(null);
  return (
    <span className={cn("site-avatar", className)} aria-hidden="true">
      <span>j</span>
      {source && failed !== source && (
        <img
          src={source}
          alt=""
          width="48"
          height="48"
          referrerPolicy="no-referrer"
          onError={() => setFailed(source)}
        />
      )}
    </span>
  );
}
```

### `src/components/layout/site-wordmark.tsx`

```tsx
import { cn } from "@/lib/utils";

export function SiteWordmark({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  const isJin = title === "Jin's Blog" || title === "jin的博客";
  return (
    <span
      className={cn(
        "site-wordmark",
        !isJin && "site-wordmark-custom",
        className,
      )}
    >
      {isJin ? <span className="wordmark-latin">Jin's Blog</span> : title}
    </span>
  );
}
```

### `src/components/layout/site-social-links.tsx`

```tsx
import { useRouteContext } from "@tanstack/react-router";
import {
  resolveSocialHref,
  SOCIAL_PLATFORMS,
} from "@/features/config/utils/social-platforms";

export function SiteSocialLinks() {
  const { siteConfig } = useRouteContext({ from: "__root__" });
  return (
    <div className="site-social-links">
      {siteConfig.social
        .filter(
          (link) =>
            link.url &&
            ![
              "https://github.com/example",
              "mailto:example@email.com",
              "example@email.com",
            ].includes(link.url),
        )
        .map((link, index) => {
          const preset =
            link.platform !== "custom" ? SOCIAL_PLATFORMS[link.platform] : null;
          const Icon = preset?.icon;
          const label = preset?.label ?? link.label ?? link.platform;
          return (
            <a
              key={`${link.platform}-${index}`}
              href={resolveSocialHref(link.platform, link.url)}
              aria-label={label}
              title={label}
              target={link.platform === "email" ? undefined : "_blank"}
              rel="me noreferrer"
            >
              {Icon ? (
                <Icon size={17} strokeWidth={1.5} />
              ) : link.icon ? (
                <img src={link.icon} alt="" width="17" height="17" />
              ) : (
                <span>{label}</span>
              )}
            </a>
          );
        })}
    </div>
  );
}
```

### `src/features/posts/components/home-page-skeleton.tsx`

```tsx
import { Skeleton } from "@/components/ui/skeleton";

export function HomePageSkeleton() {
  return (
    <div className="journal-home" aria-busy="true">
      <div className="home-cover">
        <div className="home-cover-shade" />
      </div>
      <div className="home-introduction">
        <div>
          <Skeleton className="mb-5 h-3 w-40" />
          <Skeleton className="mb-6 h-16 w-60" />
          <Skeleton className="mb-3 h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
        <Skeleton className="h-52 w-full rounded-2xl" />
      </div>
      <div className="journal-divider" aria-hidden="true">
        <span />
        <i />
        <span />
      </div>
      <div className="home-post-grid">
        {[0, 1].map((key) => (
          <div key={key} className="fuwari-card-base p-6">
            <Skeleton className="mb-5 h-3 w-32" />
            <Skeleton className="mb-5 h-6 w-4/5" />
            <Skeleton className="mb-3 h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}
```

### `src/features/auth/data/auth.data.ts`

```ts
import { and, asc, eq } from "drizzle-orm";
import { account, user } from "@/lib/db/schema";

/** Public GitHub profile image only; never select provider tokens or email. */
export async function findOwnerGithubAvatar(db: DB) {
  const [owner] = await db
    .select({ githubId: account.accountId })
    .from(user)
    .innerJoin(account, eq(account.userId, user.id))
    .where(and(eq(user.role, "admin"), eq(account.providerId, "github")))
    .orderBy(asc(user.createdAt), asc(user.id))
    .limit(1);
  return owner && /^\d+$/.test(owner.githubId)
    ? `https://avatars.githubusercontent.com/u/${owner.githubId}?s=160&v=4`
    : null;
}

export async function findAdminEmail(db: DB) {
  const [admin] = await db
    .select({ email: user.email })
    .from(user)
    .where(eq(user.role, "admin"))
    .orderBy(asc(user.createdAt))
    .limit(1);
  return admin?.email ?? null;
}
```

### `src/features/auth/data/auth.data.test.ts`

```ts
import { DatabaseSync } from "node:sqlite";
import { drizzle } from "drizzle-orm/sqlite-proxy";
import { afterEach, expect, it } from "vitest";
import { findOwnerGithubAvatar } from "./auth.data";

const databases: DatabaseSync[] = [];
function setup() {
  const sqlite = new DatabaseSync(":memory:");
  databases.push(sqlite);
  // Intentionally no email or token columns: the public lookup needs neither.
  sqlite.exec(
    "CREATE TABLE user (id TEXT, role TEXT, created_at INTEGER); CREATE TABLE account (user_id TEXT, provider_id TEXT, account_id TEXT);",
  );
  const db = drizzle(async (sql, params) => ({
    rows: sqlite
      .prepare(sql)
      .all(...params)
      .map((row) => Object.values(row)),
  }));
  return { sqlite, db: db as unknown as DB };
}
afterEach(() => {
  databases.splice(0).forEach((db) => db.close());
});

it("returns no avatar before an Admin links GitHub", async () => {
  const { sqlite, db } = setup();
  sqlite.exec(
    "INSERT INTO user VALUES ('reader','user',1),('owner','admin',2); INSERT INTO account VALUES ('reader','github','9'),('owner','credential','owner');",
  );
  expect(await findOwnerGithubAvatar(db)).toBeNull();
});

it("uses the earliest GitHub Admin, excluding readers and other providers", async () => {
  const { sqlite, db } = setup();
  sqlite.exec(
    "INSERT INTO user VALUES ('reader','user',1),('email-admin','admin',2),('owner','admin',3),('other-admin','admin',4); INSERT INTO account VALUES ('reader','github','9'),('email-admin','credential','owner'),('owner','github','42'),('other-admin','github','43');",
  );
  expect(await findOwnerGithubAvatar(db)).toBe(
    "https://avatars.githubusercontent.com/u/42?s=160&v=4",
  );
});

it("rejects a malformed provider ID instead of making an arbitrary image URL", async () => {
  const { sqlite, db } = setup();
  sqlite.exec(
    "INSERT INTO user VALUES ('owner','admin',1); INSERT INTO account VALUES ('owner','github','../private');",
  );
  expect(await findOwnerGithubAvatar(db)).toBeNull();
});
```

## 4. 排错清单

| 常见情况 | 原因与解决办法 |
| --- | --- |
| `bun` 无法识别 | 重新执行第一步的 PATH 配置。当前项目内路径为 `.cache/tooling/node_modules/bun/bin`。不要直接改成 `npm install`，项目使用 Bun 锁文件和 cf 补丁。 |
| Node 版本不符、配置 TS 无法加载 | 使用 Node 24 或更高；`cloudflare.config.ts` 由 Node 加载，不用 Bun 直接执行它。 |
| 一直停在 `Compiling inlang project` | 检查 `project.inlang/settings.json` 中的 jsDelivr 地址是否可访问；有已运行代理时设置当前终端代理再重试。 |
| 找不到 `m.tags_description` 等文案函数 | 同步维护 `messages/zh.json` 和 `messages/en.json`，运行 `bun run i18n:compile`；不要手改 `src/paraglide`。 |
| `/tags` 路由类型未生成 | 运行开发服务或 `npm run build` 生成 `src/routeTree.gen.ts`，不要手工维护路由树。 |
| 标签页没有标签或新标签不显示 | 公开接口只返回已发布文章使用的标签。给文章设置标签后发布；仅保存草稿不会改变公开标签。 |
| 点击标签出现不存在提示 | 标签已删除、已改名，或者没有已发布文章使用它。返回 `/tags` 使用最新入口。 |
| 本地看不到线上文章和图片 | 本地 D1/R2 模拟器与生产隔离；本次不导入或修改生产内容。 |
| `Port 3000 is already in use` | 已有开发服务时直接访问该服务；不要反复启动。需要重启时先在原终端 Ctrl+C。 |
| Git 提示 `dubious ownership` | 确认目录属于当前项目后，单次使用 `git -c safe.directory=D:/work/flare-stack-blog status`；无需扩大对其他目录的信任。 |
| Vite 显示未来 `configLoader: native` 兼容提示 | 这是现有配置针对未来版本的提示，当前是否成功以退出码和 `Build complete` 为准；无需为本次样式改动升级工具链。 |
| 推送成功但网站未更新 | 在 Cloudflare Worker 的 Builds 检查连接仓库、生产分支 `main`、提交 SHA 和日志；构建和部署命令沿用 `bun run build`、`bun run deploy`。 |
| 部署提示 `Invalid environment variables` | 按 `docs/deployment.md` 核对构建变量和运行时 Secret；不要把本地占位值复制到生产。 |
| Windows 下 Agent Skill 测试的 frontmatter 正则失败 | 该测试要求 LF，但当前未修改的技能文件由 Git 检出为 CRLF。属于当前环境下的换行差异；不要为了本次页面改动修改或删除技能文件。 |
| 编辑器或评论测试报 `Test timed out in 5000ms` | 本轮全量及串行复核均观察到未改动模块的超时。可先减少测试并发定位性能和计时条件；本次未放宽超时、跳过测试或修改这些模块，完整测试尚未通过。 |
| 没有自定义白点或悬停光晕 | 手机触控、减少动态效果、系统强制颜色模式默认保留原生光标。桌面需要页面完成加载后移动鼠标；Tab 切换键盘操作会暂时隐藏白点，再移动鼠标即可恢复。 |
| 需要调整玻璃透明程度 | 修改 `src/components/layout/public-theme.css` 顶部的 `--public-glass-tint` 和 `--public-nav-tint`；底色百分比越小越透明。深色数值单独定义在 `.dark .public-site` 中。 |
| 希望某个特殊控件保留原生光标 | 给该控件加 `data-cursor="native"`，无需新增事件监听；原生选择框、滑块和禁用控件已有回退。 |
| 站长头像仍然显示字母 j | 管理员需要先通过已正确配置的 GitHub OAuth 关联 GitHub。公开页面只选取关联 GitHub 的 Admin；普通读者不会成为头像来源。刷新页面以更新原有配置缓存；图片失败时会保留占位。 |
| 需要调整全页亚克力模糊和遮罩 | 修改 `public-theme.css` 的 `.public-ambient-photo` 中 `blur(28px)`、`--public-acrylic-tint`，深色变量单独维护；阅读页的遮罩由 `.public-reading-site .public-acrylic` 控制。 |
| 后台自定义站名没有使用连笔字体 | 特殊字标用于 `Jin's Blog`（兼容旧名 `jin的博客`）；其他自定义站名按通用衬线标题显示。 |
| 连笔字体加载失败或暂时显示系统字体 | 字体本地文件为 `/fonts/dancing-script-latin-400-normal.woff2`，应随 Workers 静态资源一起部署；检查请求是否为 200、无缓存旧 CSS。使用 `font-display: swap`，初次加载会先显示系统后备字体，加载完成自动替换。 |
| 随机背景偶尔与上次相同 | 每次刷新都会向 API 重新随机请求，但随机抽取本身允许重复，不做“上一张排除”或图片 ID 推算。站内跳转保留图片，完整刷新才重新抽取。 |
| 随机接口返回地址，但图片 CDN 加载失败 | 组件会先验证实际图片能否加载，失败后重新随机，最多 3 次、每次包含接口和图片在内最多 8 秒。仍失败则显示本地底图；刷新页面可重新尝试，不会固定在当天坏 ID 上。 |
| 首页原演示社交链接不再显示 | 仅隐藏项目原来的示例 GitHub、邮箱等地址；在后台填写自己的实际链接即可显示，RSS 入口仍保留。 |

## 5. 实际验证记录

验证日期：2026-11-01。

- 最终代码的 `npm run build`：退出码 0，输出 `Build complete`；完整日志保存在本地忽略目录 `.cache/frontend-build.log`。
- Cloudflare 类型生成与 `bunx tsc --noEmit`：退出码 0。原 `bun run typecheck` 在重复多语言编译阶段等待较久，已终止；随后复用构建生成的文件，分别运行 `bunx cf workers types` 和 `bunx tsc --noEmit` 完成检查。
- `bun run lint`、本次 13 个 TS/TSX 文件的 `oxfmt --check`、翻译一致性和未使用文案检查：通过。
- 改动前后生成路由表对比：45 → 46，移除 0，唯一新增 `/tags`。
- 本地 HTTP 检查：`/`、`/posts`、`/tags`、`/friend-links` 均为 200；`/tags` 有正确的空状态和 canonical；`/sitemap.xml` 为 200 且包含 `/tags`。
- 标签公开数据及站点文档集成测试：2 个文件、19 项全部通过。
- 额外全量 Node 测试：125 个文件通过、5 个文件失败；1599 项通过、9 项失败。失败涉及未修改的编辑器、评论、分类选择、API 路由测试以及 CRLF/LF 敏感的 Agent Skill 测试，不能声称全量测试通过。
- 对其中 4 个失败文件串行复核：API 路由和分类选择通过；编辑器、评论仍有超时，共 30 项通过、4 项失败。失败集合有波动，尚未在干净基线复现，因此不把它们断言为与本次改动无关的已知问题。
- 第一轮未完成浏览器视觉检查；本轮已改用独立配置的无头 Chrome 生成桌面深浅色和手机页面截图，检查无横向溢出及顶栏铺满。详见下方本轮记录。
- 尚未提交、推送或触发生产部署。审核通过后再执行上述明确列出文件的发布命令，并核对 Cloudflare 构建提交 SHA。

## 6. 本轮最终验证

验证日期：2026-11-01。本节对应每日背景和玻璃外观的最终代码。

- `npm run build`：退出码 0，输出 `Build complete`，日志位于本地忽略目录 `.cache/frontend-glass-build.log`。
- 背景日期、预加载一致性、失败重试、8 秒超时、本地兜底及配置兼容测试：3 个文件、14 项全部通过。
- `bun run lint`、`bunx tsc --noEmit`、本轮 14 个 TS/TSX/CSS 文件的格式检查和 `git diff --check`：通过。
- 原有 45 条路由全部保留；唯一新增 `/tags`，目前共 46 条路由。
- 独立无头 Chrome 检查桌面首页浅色/深色、手机标签页和文章列表：无横向溢出，顶栏左侧为 0、宽度等于页面可用宽度，顶栏圆角为 0。等待页面水合后，手机菜单可正常打开，包含标签入口且没有超出屏幕。
- 浏览器检查未观察到控制台脚本错误或未捕获异常。桌面浅色截图确认 LoliAPI 图片实际加载成功；其他部分截图使用加载期间的本地背景。
- 第三方图片 CDN 偶尔返回失败或非图片响应，浏览器会阻止此类响应。已验证图片错误后的本地兜底，组件测试覆盖最多 3 个候选以及每次 8 秒的超时处理；外部服务的持续可用性不作保证。
- 审核截图保存在 `.cache/ui-review/`，包括 `home-desktop-light.png`、`home-desktop-dark.png`、`tags-mobile-dark.png`、`posts-mobile-light.png` 和 `mobile-menu.png`。这些本地检查产物不会加入 Git。
- 上节记录的额外全量测试失败仍未解决，不能将本轮定向检查通过表述为全量测试通过。
- 尚未提交、推送或部署。等待用户明确审核通过，再提交本次文件、推送 GitHub 并核对 Cloudflare 自动部署结果。

## 7. 光标与交互验证记录

验证日期：2026-11-01。

- 最终 `npm run build`：退出码 0，输出 `Build complete`；日志为 `.cache/frontend-pointer-build.log`。
- 本轮 TypeScript 文件的 `bun run lint`、`bunx tsc --noEmit`：退出码 0。5 个修改/新增 TSX 与 CSS 文件的格式检查通过。
- 路由对比仍为 45 → 46，没有移除路由，唯一新增为上一轮的 `/tags`。
- 真实鼠标事件验证：白点为 7px；链接悬停为 10px 并带外光圈，导航上浮 2px；文字区切换为 2px × 18px 的 I 形细竖光标。当前玻璃表面的光晕位置随鼠标更新。
- 真实拖拽选中正文成功；按压反馈、Tab 隐藏白点、减少动态效果恢复原生指针、强制颜色模式回退和减少透明度关闭光晕均已验证。
- 390px 手机触控菜单可打开，菜单边界为 94px～374px，未超出屏幕；没有自定义浮动光标或横向溢出。桌面内容宽度和顶栏宽度均为 1430px（1440px 视口扣除滚动条）。
- 浏览器成功检查中未捕获到脚本控制台错误或运行时异常；第三方图片 CDN 仍有偶发非图片响应被 ORB 阻止，继续由上一轮的候选与本地底图机制处理。
- 本地开发服务曾无响应，并发生浏览器导航超时，重启并等待加载后恢复；审核预览以构建结束后的开发服务为准。浏览器临时用户目录已放到系统临时目录，避免开发服务监听活跃的浏览器文件。
- 最新截图为 `.cache/ui-review/interaction-nav-glow.png`、`interaction-text-cursor.png` 和 `interaction-mobile-menu.png`；这些截图与检查脚本不加入 Git。
- 本轮没有再次运行全量测试；之前记录的全量失败仍保留。没有提交、推送或触发生产部署，等待用户审核。

## 8. 连续阅读页的最终验证

验证日期：2026-11-01。

- `npm run build`：退出码 0，输出 `Build complete`，日志为 `.cache/frontend-reading-build.log`。
- `bun run lint` 与 `bunx tsc --noEmit`：退出码 0。当前 12 个修改/新增 TSX、TS 和 CSS 文件格式检查通过。
- 阅读进度边界测试与原目录生成测试：2 个文件、7 项全部通过。
- 桌面 1440px 浏览器检查：顶栏高 64px，品牌无图标，工具区圆角 18px；作者侧栏和横幅均收起；正文宽 768px，中心 x=715，与页面可用宽度 1430px 的中心一致。正文透明且无边框，日期/分类/标签前无 SVG 图标。
- 光标回归检查：真实按下前、按下中、释放后的中心始终为 `(1180, 34)`，没有位置漂移。
- 真实目录跳转：示例中的 10 个章节条目正常呈现，跳转到“阅读与交互”后 URL hash 正确，当前章节高亮，进度为 54%；正文末尾进入视口后为 100%。
- 手机 390px 检查：仅显示可折叠目录，展开、选中章节后关闭均正常，无横向溢出。桌面深浅色截图及手机截图已经生成。
- 浏览器未捕获脚本错误或未处理异常；背景图 CDN 的偶发 ORB 拦截仍属于上一轮的第三方图片问题，文章阅读页不加载横幅。
- 长文示例仅注入独立测试浏览器的 React Query 内存缓存，未写入 D1、未发布文章，也未新增任何应用路由。检查结束已回到首页并关闭测试浏览器。
- 截图：`.cache/ui-review/reading-desktop-light.png`、`reading-desktop-dark.png`、`reading-desktop-progress.png`、`reading-mobile-outline.png`；报告为同目录 `reading-report.json`，均不纳入 Git。
- 全量测试未在本轮重跑，历史失败仍保留在第 5 节；本轮检查通过不代表全量测试通过。
- 代码留在本地，交由用户审核与提交；未创建提交、推送或触发 Cloudflare 生产部署。

## 9. 亚克力背景与个人手记首页：最终验证

验证日期：2026-11-01。本节对应顶部最新审核版本。

- 最终 `npm run build`：退出码 0，输出 `Build complete`；日志为 `.cache/frontend-journal-build.log`。沿用 `cf build`，未执行部署。
- 最终 `bun run lint`、`bunx tsc --noEmit`、41 个修改/新增源文件的 `oxfmt --check`：退出码 0；`git diff --check` 通过。
- 头像查询、每日背景、图片失败/超时回退、阅读进度、站点配置兼容：5 个文件、19 项定向测试通过。本轮未重跑全量测试，第 5 节的历史失败记录仍保留。
- 路由比较仍为 45 → 46，原有路由移除 0，唯一新增 `/tags`。
- 1440px 桌面浏览器：顶栏 64px，首页 6 张示例卡片呈两列（每列 534px），作者侧栏不存在，背景实际计算为 `blur(28px) saturate(0.8)`，浅色亚克力遮罩为 78%。390px 手机为单列，页面宽度与屏幕一致，无横向溢出。
- 头像查询测试使用真实 SQLite 查询，排除普通读者和其他登录方式。浏览器使用临时内存配置验证未登录入口能显示公开管理员头像，随后恢复。实际 `/api/site/config` 返回 200，当前本地 `ownerAvatar` 为 null，符合尚未关联真实 GitHub 的状态；未进行真实 OAuth 登录。
- 光标真实鼠标事件回归：按下前、按下中、释放后中心均为 `(1180, 34)`。阅读页正文宽 768px、居中、透明、无外框；元信息没有 SVG 图标；10 个章节正常生成和跳转，进度在正文末尾达到 100%，手机目录可展开并在跳转后收起。
- 最终独立浏览器检查无脚本控制台错误或运行时异常。第三方图片 CDN 有两次 ORB 拦截，仍由候选重试与本地底图处理；外部服务可用性不作保证。
- 最终截图位于 `.cache/ui-review/`：`journal-home-dark.png`、`journal-home-light.png`、`journal-home-mobile.png`、`journal-post-grid.png`、`journal-reading-dark.png`、`journal-reading-light.png`、`journal-reading-mobile.png`、`journal-reading-progress.png`；报告为 `journal-report.json`。截图中的示例文章只存在于独立浏览器内存，未写入数据库、未发布，检查结束已关闭该浏览器。
- 代码和审核文档留在本地；未提交、推送或部署。用户已有的 `dev.ps1` 与 `docs/local-development.md` 未作修改，也不包含在建议提交清单中。

## 10. Jin's Blog 连笔字标

按最新参考图，将顶栏和首页字标统一改为 `Jin's Blog`，使用 `Dancing Script` Regular 400。截图中的原字标为 SVG 路径，无法从截图确定字体名称，本次使用视觉接近的字体，没有复制原站的 SVG 轮廓。

为什么这样做：本地 WOFF2 文件只有 23,816 字节，字体随站点静态资源部署，避免用户访问页面时再请求外部字体服务；文字仍为真实可选文字。`font-display: swap` 保证字体加载期间仍能看到站名。顶栏使用 30px、手机 26px，首页沿用响应式标题尺寸，后台的其他自定义站名仍能正常显示。

- 字体来源：[Fontsource Dancing Script 5.3.0](https://www.npmjs.com/package/@fontsource/dancing-script/v/5.3.0)，由 Dancing Script Project Authors 制作，采用 SIL Open Font License 1.1。字体和完整许可位于 `public/fonts/`，没有新增 npm 依赖。
- 默认 Site Config 标题更新为 `Jin's Blog`；读取旧默认 `jin的博客` 时采用新名称，无数据库写入。自定义站名仍原样保留。
- `bun run test:node -- src/features/config/config.resolve.test.ts --maxWorkers=1`：7 项通过；`bun run lint`、本轮 5 个源码文件的格式化与 `git diff --check` 通过。
- 浏览器确认字体已加载，计算字体为 `Dancing Script`，顶栏和页面标题为 `Jin's Blog`；本地字体 HTTP 200、文件头为有效 `wOF2`。桌面与 390px 手机无横向溢出，导航高 64px，阅读目录、进度与光标定位回归检查通过，无运行时异常或脚本控制台错误。
- 本轮重跑独立 Chrome 检查后更新了 `journal-*.png`；局部字标截图为 `.cache/ui-review/wordmark-preview.png`。样例文章仍只在测试浏览器内存，未发布。外部背景 CDN 观察到一次 ORB 拦截，继续使用既有候选和本地回退。
- 开发服务在修改文件期间曾出现一次 React 热更新渲染错误；后续独立浏览器完整加载及回归检查通过，未改动 React 版本或依赖。
- 本轮保持本地修改，未提交、推送或部署，继续交由用户审核。
- 最终 `npm run build` 退出码 0，输出 `Build complete`；日志为 `.cache/frontend-wordmark-build.log`。

## 11. 随机背景替代每日图片 ID

按最新要求，完全移除日期、图库数量和 `id` 推算。使用官方文档提供的 `https://www.loliapi.com/acg/pc/?type=url` 取得随机图片源网址，再验证实际图片可以加载；图片地址仅保存在当前公共布局的内存状态中。

为什么这样做：图片是否存在由提供方的当前图库决定，博客无需猜测 ID 或维护 699 张图片的假设。同一次页面访问只获取一套随机结果，清晰封面和模糊背景共用该地址；站内跳转不重新随机，完整打开或刷新时再抽取。随机可能重复，不承诺每次都与上一张不同。

- 每次接口请求加入独立随机标记并使用 `cache: no-store`，避免重复使用缓存的随机选择。随机操作只在浏览器 effect 中执行；服务端与首次水合均先显示本地底图，避免 CDN HTML 缓存把同一选择分发给所有访客，也避免服务端/浏览器随机结果不一致。
- 删除跨天检查和每分钟定时器。`src/routes/__root.tsx` 不再生成 `backgroundDay`；首页预加载只加载稳定底图，不另发一次随机请求。
- `RandomBackgroundProvider` 统一处理请求、图片验证、取消和回退；开发环境 Strict Mode 的首次清理不会额外启动一次随机抽取。`BackgroundImage` 只消费共享地址。
- 每次尝试最多 8 秒，包含 API 和实际图片两阶段；最多随机尝试 3 次，再回退 `/images/home-bg.webp`。自定义背景仍保留，失败也有本地回退。所有定时器与未完成请求会在取消、卸载或配置更改时清理。
- 官方 `type=url` 返回纯文本图片地址，实际探测 HTTP 200、跨域允许 `*`。不新增 API 路由、Workers 代理、依赖或数据库迁移。
- 最终定向测试 3 个文件、20 项通过，包含 Strict Mode、共享地址、刷新抽取、无 ID 请求、缓存规避、坏图、坏响应、API/图片超时、配置更改取消及本地回退。`bun run lint`、`bunx tsc --noEmit`、10 个本轮文件的格式检查通过。
- 独立 Chrome 使用临时网络响应验证：首次只抽取一次；刷新后请求标记变化；封面与背景一致；访问 `/posts` 后返回首页不增加随机请求；API 三次失败与图片三次损坏均使用本地图片。测试响应未写入代码或数据库。
- 随后恢复真实 LoliAPI 网络检查：第一张 CDN 图片被 ORB 拦截后，第二次随机成功，两个区域均加载同一张 1920px 图片，无横向溢出、无运行时异常、无脚本控制台错误。第三方网络可用性仍可能波动。
- 报告与截图：`.cache/ui-review/random-background-report.json`、`.cache/ui-review/random-background-live.png`；浏览器日志 `.cache/frontend-random-browser.log`。这些检查产物均被 Git 忽略。
- 路由仍为 45 → 46，原有路由移除 0，唯一新增的仍是此前 `/tags`；本轮没有新增路由。全量测试未重跑，历史失败记录仍保留。
- 修改继续留在本地，未提交、推送或部署，等待用户审核。
- 最终 `npm run build` 退出码 0，输出 `Build complete`，日志为 `.cache/frontend-random-build.log`；`git diff --check` 通过。
