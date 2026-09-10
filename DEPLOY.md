# 个人网站部署与后续修改指南

本指南适用于当前目录：

```text
C:\Users\1\Documents\Codex\2026-09-10\ni\outputs\personal-site-v2
```

这个网站是纯静态 HTML/CSS/JavaScript 项目，不需要安装依赖，也不需要执行构建命令。

---

## 方案一：GitHub Pages（推荐）

适合需要长期修改、保留版本记录、自动重新发布的场景。

### 第一步：准备账号和软件

需要准备：

1. GitHub 账号：https://github.com
2. Git：https://git-scm.com/download/win

安装 Git 后，打开 PowerShell，确认安装成功：

```powershell
git --version
```

如果能看到版本号，说明安装完成。

### 第二步：本地确认网站正常

在 PowerShell 中进入网站目录：

```powershell
cd "C:\Users\1\Documents\Codex\2026-09-10\ni\outputs\personal-site-v2"
```

直接打开网站：

```powershell
Start-Process ".\index.html"
```

确认以下内容正常：

- 首页图片和字体正常加载
- 作品横向浏览正常
- 点击作品能打开灯箱
- 点击随笔能打开文章
- 明暗主题切换正常
- 手机尺寸下布局没有横向溢出

### 第三步：创建 GitHub 仓库

1. 登录 GitHub。
2. 点击右上角的 `+`，选择 `New repository`。
3. 仓库名称建议填写：`zhang-junyi-site`。
4. 描述可以填写：`Personal photography and writing portfolio`。
5. 可见性建议先选择 `Public`。
6. 不要勾选 `Add a README file`。
7. 点击 `Create repository`。

创建后，页面会显示仓库地址，例如：

```text
https://github.com/你的用户名/zhang-junyi-site.git
```

### 第四步：首次配置 Git

如果这台电脑第一次使用 Git，需要先配置姓名和邮箱：

```powershell
git config --global user.name "张军毅"
git config --global user.email "你的GitHub邮箱"
```

这里的邮箱建议与 GitHub 账号邮箱一致。

### 第五步：初始化本地仓库

进入网站目录：

```powershell
cd "C:\Users\1\Documents\Codex\2026-09-10\ni\outputs\personal-site-v2"
```

初始化仓库：

```powershell
git init
git branch -M main
```

把网站文件加入版本管理：

```powershell
git add .
```

创建第一次提交：

```powershell
git commit -m "Initial personal website"
```

### 第六步：连接 GitHub 仓库

将下面命令中的用户名和仓库名替换成你自己的：

```powershell
git remote add origin https://github.com/你的用户名/zhang-junyi-site.git
```

例如：

```powershell
git remote add origin https://github.com/zhangjunyi/zhang-junyi-site.git
```

推送到 GitHub：

```powershell
git push -u origin main
```

第一次推送时，Git 通常会打开浏览器要求登录 GitHub。按照提示完成授权即可。

如果终端要求密码，不要输入 GitHub 登录密码。应当使用 Git Credential Manager，或者创建 Personal Access Token。

### 第七步：开启 GitHub Pages

1. 打开刚创建的 GitHub 仓库。
2. 点击 `Settings`。
3. 在左侧找到 `Pages`。
4. 在 `Build and deployment` 中，把 `Source` 设为 `Deploy from a branch`。
5. `Branch` 选择 `main`。
6. 文件夹选择 `/(root)`。
7. 点击 `Save`。

等待约 1 到 5 分钟，GitHub 会生成网站地址，通常为：

```text
https://你的用户名.github.io/zhang-junyi-site/
```

打开这个地址检查网站。

### 第八步：以后如何修改并重新发布

每次修改后，在 PowerShell 中执行：

```powershell
cd "C:\Users\1\Documents\Codex\2026-09-10\ni\outputs\personal-site-v2"
git status
git add .
git commit -m "Update website content"
git push
```

等待 GitHub Pages 自动重新发布。通常需要几十秒到几分钟。

更新后如果浏览器仍显示旧内容，按：

```text
Ctrl + F5
```

或者使用无痕窗口打开。

---

## 日常修改位置

### 修改姓名、简介和联系方式

编辑：

```text
index.html
```

搜索这些内容：

```text
张军毅
ZHANG JUNYI
hello@example.com
Instagram
小红书
微信公众号
```

### 替换摄影作品

图片位于：

```text
assets/photos/
```

最省事的方法是保留原文件名，直接覆盖：

```text
photo-01.jpg
photo-02.jpg
photo-03.jpg
...
photo-09.jpg
```

如果使用新的文件名，需要同时修改 `index.html` 中对应的：

```html
src="assets/photos/photo-01.jpg"
data-src="assets/photos/photo-01.jpg"
```

同时更新：

```html
data-title="作品标题"
data-meta="地点 · 类型 · 年份"
data-description="作品说明"
```

### 修改随笔内容

打开：

```text
app.js
```

搜索：

```js
const posts = {
```

每篇文章包括：

```js
title: "文章标题",
meta: "文章分类和日期",
body: `正文内容`
```

正文支持：

```html
<p>普通段落</p>
<blockquote>引用段落</blockquote>
```

### 修改默认明暗主题

打开：

```text
index.html
```

找到：

```html
<html lang="zh-CN" data-theme="dark">
```

改成明亮主题：

```html
<html lang="zh-CN" data-theme="light">
```

---

## 方案二：Netlify Drop（最简单）

如果暂时不想学习 Git，可以使用 Netlify。

### 第一步：打开 Netlify Drop

访问：

```text
https://app.netlify.com/drop
```

### 第二步：拖入文件夹

将整个文件夹拖到网页中：

```text
C:\Users\1\Documents\Codex\2026-09-10\ni\outputs\personal-site-v2
```

Netlify 会自动生成一个网址，例如：

```text
https://random-name.netlify.app
```

### 第三步：注册并保存网站

注册或登录 Netlify，认领刚才创建的网站，防止部署被删除。

### 第四步：以后修改

修改本地文件后，再次进入 Netlify 的 `Deploys` 页面，把更新后的整个 `personal-site-v2` 文件夹重新拖进去。

如果想自动部署，可以在 Netlify 中连接 GitHub 仓库。连接后，每次 `git push` 都会自动更新网站。

---

## 绑定自己的域名

无论使用 GitHub Pages 还是 Netlify，都可以绑定自己的域名。

例如购买：

```text
zhangjunyi.com
www.zhangjunyi.com
```

大致流程：

1. 在域名服务商购买域名。
2. 在 GitHub Pages 或 Netlify 中添加域名。
3. 按照平台提示配置 DNS。
4. 等待 DNS 生效。
5. 开启 HTTPS。
6. 将网站中的邮箱和社交链接替换成真实信息。

不同域名服务商的 DNS 界面不同，以平台给出的配置值为准。

---

## 常见问题

### 网站显示 404

检查：

- GitHub Pages 是否已经开启
- 分支是否选择 `main`
- 文件夹是否选择 `/(root)`
- 首页文件名是否为 `index.html`
- 是否已经执行 `git push`

### 图片或字体加载失败

检查：

- 文件名大小写是否一致
- 图片是否真的位于 `assets/photos/`
- `index.html` 中的路径是否修改正确
- GitHub 上的文件是否已经推送成功

### 修改后网站没有变化

依次检查：

```powershell
git status
git add .
git commit -m "Update website"
git push
```

然后按 `Ctrl + F5` 强制刷新浏览器。

### Git 推送失败

常见原因：

- GitHub 账号未登录
- 使用密码而不是 Personal Access Token
- 远程仓库地址填写错误
- 本地仓库中没有提交内容

先检查远程地址：

```powershell
git remote -v
```

再检查提交状态：

```powershell
git status
```

---

## 推荐操作顺序

第一次部署：

1. 本地打开 `index.html` 检查
2. 创建 GitHub 仓库
3. 初始化 Git 并提交
4. 推送到 GitHub
5. 开启 GitHub Pages
6. 访问生成的网址
7. 后续通过 `git add`、`git commit`、`git push` 更新

如果只想先上线看效果，可以先用 Netlify Drop；等确认视觉满意后，再迁移到 GitHub Pages。
