# Cloudflare Pages 部署指南

本文档用于把当前个人网站部署到 Cloudflare Pages：

```text
C:\Users\1\Documents\Codex\2026-09-10\ni\outputs\personal-site-v2
```

该项目是纯静态网站，不需要安装框架依赖，也不需要执行构建命令。

---

# 方案一：直接上传部署（最快）

适合先快速上线，之后可以再迁移到 Git 自动部署。

## 第一步：确认网站结构

确保以下文件位于 `personal-site-v2` 文件夹的第一层：

```text
personal-site-v2/
├─ index.html
├─ styles.css
├─ fonts.css
├─ app.js
└─ assets/
```

注意：`index.html` 必须位于上传目录的根层，不要上传成：

```text
personal-site-v2/personal-site-v2/index.html
```

## 第二步：注册 Cloudflare

访问：

```text
https://dash.cloudflare.com/sign-up
```

注册并登录 Cloudflare。

## 第三步：创建 Pages 项目

1. 登录 Cloudflare 控制台。
2. 打开 `Workers & Pages` 或 `Compute (Workers & Pages)`。
3. 点击 `Create application`。
4. 选择 `Pages`。
5. 选择 `Upload assets` 或 `Direct Upload`。
6. 项目名称填写：

```text
zhang-junyi-site
```

7. 生产分支可以填写：

```text
main
```

## 第四步：上传网站文件

将整个文件夹拖入上传区域：

```text
C:\Users\1\Documents\Codex\2026-09-10\ni\outputs\personal-site-v2
```

也可以先把该文件夹压缩成 ZIP，再上传 ZIP。

不要上传上级目录 `outputs`，否则网站根目录会不正确。

## 第五步：发布

点击 `Deploy` 或 `Create deployment`。

部署完成后，Cloudflare 会生成一个网址，例如：

```text
https://zhang-junyi-site.pages.dev
```

打开网址检查：

- 首页是否正常显示
- 摄影图片是否加载
- 字体是否加载
- 作品灯箱是否正常
- 随笔文章是否正常
- 手机端布局是否正常

## 第六步：以后修改

修改本地文件后：

1. 进入 Cloudflare 控制台。
2. 打开对应 Pages 项目。
3. 进入 `Deployments`。
4. 点击 `Create new deployment` 或重新上传。
5. 上传修改后的整个 `personal-site-v2` 文件夹。

Cloudflare 会保留旧版本，如果新版有问题，可以进入历史部署并执行回滚。

---

# 方案二：连接 GitHub 自动部署（推荐长期使用）

适合以后持续修改内容。每次推送代码，Cloudflare 会自动重新部署。

## 第一步：准备 GitHub

需要：

1. GitHub 账号
2. 已安装 Git
3. 已创建 GitHub 仓库

检查 Git：

```powershell
git --version
```

## 第二步：创建 GitHub 仓库

1. 登录 GitHub。
2. 点击 `New repository`。
3. 仓库名建议：

```text
zhang-junyi-site
```

4. 建议选择 `Public`。
5. 不要勾选初始化 README。
6. 创建仓库。

## 第三步：初始化并推送网站

进入网站目录：

```powershell
cd "C:\Users\1\Documents\Codex\2026-09-10\ni\outputs\personal-site-v2"
```

首次使用 Git 时配置身份：

```powershell
git config --global user.name "张军毅"
git config --global user.email "你的GitHub邮箱"
```

初始化仓库：

```powershell
git init
git branch -M main
git add .
git commit -m "Initial personal website"
```

连接远程仓库：

```powershell
git remote add origin https://github.com/你的用户名/zhang-junyi-site.git
git push -u origin main
```

## 第四步：连接 Cloudflare Pages

1. 登录 Cloudflare 控制台。
2. 打开 `Workers & Pages` 或 `Compute (Workers & Pages)`。
3. 点击 `Create application`。
4. 选择 `Pages`。
5. 选择 `Connect to Git`。
6. 授权 Cloudflare 访问 GitHub。
7. 选择 `zhang-junyi-site` 仓库。
8. 点击开始设置。

## 第五步：填写构建设置

对于当前纯静态网站，推荐填写：

```text
Project name: zhang-junyi-site
Production branch: main
Framework preset: None
Build command: 留空
Build output directory: /
Root directory: 留空
```

如果 Cloudflare 不接受 `/`，可以将 `Build output directory` 改为：

```text
.
```

不需要填写 `npm run build`，因为这个网站没有构建步骤。

## 第六步：部署

点击：

```text
Save and Deploy
```

等待几十秒到几分钟。

部署完成后，Cloudflare 会提供：

```text
https://zhang-junyi-site.pages.dev
```

打开网址检查网站。

## 第七步：以后修改并自动发布

修改本地文件后，执行：

```powershell
cd "C:\Users\1\Documents\Codex\2026-09-10\ni\outputs\personal-site-v2"
git add .
git commit -m "Update website content"
git push
```

Cloudflare Pages 会自动检测 GitHub 更新并重新部署。

通常几十秒到几分钟后生效。浏览器如果仍有缓存，按：

```text
Ctrl + F5
```

---

# 常用修改位置

## 修改姓名、简介、邮箱

编辑：

```text
index.html
```

搜索：

```text
张军毅
ZHANG JUNYI
hello@example.com
Instagram
小红书
微信公众号
```

## 替换摄影图片

图片目录：

```text
assets/photos/
```

最简单的方式是保留原文件名并直接覆盖：

```text
photo-01.jpg
photo-02.jpg
photo-03.jpg
photo-04.jpg
photo-05.jpg
photo-06.jpg
photo-07.jpg
photo-08.jpg
photo-09.jpg
```

如果使用新文件名，同时修改 `index.html` 中的 `src` 和 `data-src`。

## 修改作品标题和说明

在 `index.html` 中找到作品卡片：

```html
data-src="assets/photos/photo-01.jpg"
data-title="雾中的山脊"
data-meta="四川 · Film · 2025"
data-description="作品说明"
```

修改对应的标题、地点、年份和作品说明。

## 修改随笔

打开：

```text
app.js
```

搜索：

```js
const posts = {
```

每篇文章包含：

```js
title: "文章标题",
meta: "文章分类和日期",
body: `正文内容`
```

---

# 绑定自定义域名

## 第一步：购买域名

可以从 Cloudflare Registrar、Namecheap、阿里云、腾讯云等平台购买。

## 第二步：添加域名

1. 打开 Cloudflare Pages 项目。
2. 进入 `Custom domains`。
3. 点击 `Set up a custom domain`。
4. 输入你的域名，例如：

```text
www.zhangjunyi.com
```

5. 按照页面提示完成配置。

## 如果域名已经托管在 Cloudflare

Cloudflare 通常会自动添加所需的 DNS 记录。

## 如果域名不在 Cloudflare

Cloudflare 会提供一条 CNAME 记录，通常指向：

```text
zhang-junyi-site.pages.dev
```

把 Cloudflare 提示的 DNS 记录添加到你的域名服务商。

等待 DNS 生效后，Cloudflare 会自动签发 HTTPS 证书。

---

# 回滚旧版本

如果更新后页面出现问题：

1. 进入 Cloudflare Pages 项目。
2. 打开 `Deployments`。
3. 找到之前正常工作的部署。
4. 点击菜单。
5. 选择 `Rollback to this deployment`。

Cloudflare 会恢复旧版本。

---

# 常见问题

## 打开网址出现 404

检查：

- 上传目录根层是否有 `index.html`
- Build output directory 是否为 `/` 或 `.`
- 是否误把 `personal-site-v2` 文件夹嵌套了一层
- Pages 项目是否部署成功

## 图片或字体加载失败

检查：

- `assets/` 是否完整上传
- 文件名大小写是否一致
- `index.html` 中的路径是否正确
- 图片是否真正位于 `assets/photos/`

## 部署日志提示找不到构建命令

检查：

- `Framework preset` 是否选择 `None`
- `Build command` 是否留空
- `Build output directory` 是否为 `/` 或 `.`

当前网站是纯静态文件，不需要构建过程。

## 修改后没有更新

如果是 Git 自动部署：

```powershell
git status
git add .
git commit -m "Update website"
git push
```

然后检查 Cloudflare Pages 的 `Deployments` 页面。

如果部署已经成功，按 `Ctrl + F5` 强制刷新浏览器。

## 自定义域名显示 SSL 错误

通常是 DNS 尚未完全生效，或域名服务商记录配置错误。等待一段时间后重新检查 Cloudflare 的 Custom domains 页面。

---

# 推荐流程

第一次上线：

1. 注册 Cloudflare。
2. 创建 Pages 项目。
3. 直接上传 `personal-site-v2`。
4. 访问 `pages.dev` 网址检查。
5. 注册 GitHub 并连接仓库。
6. 以后每次修改通过 `git push` 自动发布。
7. 满意后再绑定自定义域名。

如果只想快速看效果，可以直接使用方案一。如果想长期维护，建议直接使用方案二。
