# 张军毅 / Visual Diary V2

这是第二版个人摄影与文字作品集，视觉方向更接近高端数字画廊：电影感暗色、编辑杂志排版、自托管字体、横向滚动作品廊、自定义光标和精细动效。

## 直接预览

双击 `index.html`，或在当前目录运行：

```powershell
python -m http.server 8080
```

然后访问 `http://localhost:8080`。

## 页面亮点

- 数字加载动画和分屏揭幕
- 超大杂志标题和固定网格排版
- 桌面端纵向滚动驱动横向作品廊
- 移动端自动切换为滑动卡片
- 作品灯箱、键盘前后切换
- 随笔全屏阅读层
- 鼠标跟随预览和自定义 VIEW 光标
- 明暗两套完整视觉方案
- 自托管 Bodoni Moda + Manrope 字体
- 无外部运行依赖，离线可打开

## 需要替换的内容

### 姓名、简介、邮箱

在 `index.html` 中搜索：

- `张军毅`
- `ZHANG JUNYI`
- `hello@example.com`
- `Instagram`
- `小红书`
- `微信公众号`

### 摄影作品

样例图片位于 `assets/photos/photo-01.jpg` 到 `photo-09.jpg`。

替换图片后，可以直接使用同名文件，或同时修改 `index.html` 中的：

```html
data-src="assets/photos/photo-01.jpg"
src="assets/photos/photo-01.jpg"
data-title="雾中的山脊"
data-meta="四川 · Film · 2025"
data-description="作品说明"
```

作品标题、年份、地点和说明都保存在这些 `data-*` 属性里。

### 随笔内容

在 `app.js` 中搜索：

```js
const posts = {
```

每篇文章包含 `title`、`meta` 和 `body`，正文支持普通 HTML 段落与 `blockquote`。

### 明暗主题

默认使用暗色主题。在 `index.html` 根节点修改：

```html
<html lang="zh-CN" data-theme="dark">
```

改成 `light` 可默认使用明亮主题。用户手动选择后会保存在浏览器本地存储中。

## 文件结构

```text
personal-site-v2/
├─ index.html
├─ styles.css
├─ fonts.css
├─ app.js
├─ README.md
└─ assets/
   ├─ favicon.svg
   ├─ fonts/
   └─ photos/
```

## 部署

上传整个 `personal-site-v2` 文件夹到 Cloudflare Pages 即可，无需构建命令。完整流程见 `DEPLOY-CLOUDFLARE.md`。

## 图片说明

当前照片仅用于演示版式和光影效果，来源信息见 `assets/photos/SOURCES.md`。正式发布前建议全部替换为你的原创作品。


