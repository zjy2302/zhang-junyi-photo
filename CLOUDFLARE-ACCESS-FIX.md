# Cloudflare `workers.dev` 别人打不开：排查与修复

你的地址：

```text
https://zhang-junyi-site.15732733901.workers.dev/
```

## 检查结果

- 海外节点访问时返回 `HTTP 200 OK`。
- 海外 DNS 解析到 Cloudflare 地址，例如 `188.114.96.1`、`188.114.97.1`。
- 中国大陆网络解析到了非 Cloudflare 地址，连接超时。
- 页面代码和静态资源没有发现明显故障。

结论：

**问题大概率不是网站代码，而是 `workers.dev` 在中国大陆网络中的 DNS 污染、阻断或访问不稳定。**

`workers.dev` 不是为大陆地区稳定访问设计的公共域名。即使你自己能打开，其他人也可能因为运营商、DNS 和地区不同而无法访问。

---

# 最有效的修复方法：绑定自定义域名

推荐使用：

```text
www.你的域名.com
```

不要继续分享 `workers.dev` 地址。

## 第一步：准备域名

可以在以下平台购买：

- Cloudflare Registrar
- Namecheap
- 阿里云
- 腾讯云
- 其他域名服务商

如果主要访问者在中国大陆，域名最好由你自己掌握，后续方便配置备案和国内 CDN。

## 第二步：把域名接入 Cloudflare

1. 登录 Cloudflare。
2. 点击 `Add a site`。
3. 输入你的根域名，例如：

```text
example.com
```

4. 选择 Free 计划即可。
5. Cloudflare 会给出两个 Nameserver，例如：

```text
ada.ns.cloudflare.com
bob.ns.cloudflare.com
```

6. 到域名注册商后台，把原 Nameserver 替换成 Cloudflare 提供的两个地址。
7. 等待 Cloudflare 显示域名状态为 `Active`。

通常需要几分钟到 24 小时。

## 第三步：给 Worker 添加自定义域名

当前部署的是一个 Worker，不是 Pages 项目，因此操作位置在 Worker 设置里。

1. 打开 Cloudflare 控制台。
2. 进入 `Workers & Pages`。
3. 找到当前 Worker：

```text
zhang-junyi-site
```

4. 打开 Worker 详情。
5. 进入 `Settings`。
6. 找到 `Domains & Routes`。
7. 点击 `Add`。
8. 选择 `Custom Domain`。
9. 填写：

```text
www.example.com
```

10. 点击确认。

如果域名已经托管在 Cloudflare，DNS 记录通常会自动创建。

## 第四步：检查 DNS

进入：

```text
Cloudflare Dashboard → 你的域名 → DNS → Records
```

应当能看到类似：

```text
Type: CNAME
Name: www
Target: zhang-junyi-site.15732733901.workers.dev
Proxy status: Proxied
```

以 Cloudflare 实际生成的记录为准，不要随意删除。

## 第五步：设置 HTTPS

进入：

```text
SSL/TLS → Overview
```

建议设置为：

```text
Full (strict)
```

然后检查：

```text
SSL/TLS → Edge Certificates
```

确认：

- Always Use HTTPS 已开启
- Automatic HTTPS Rewrites 已开启
- 证书状态为 Active

## 第六步：验证

等待 DNS 生效后，访问：

```text
https://www.example.com
```

最好用以下方式检查：

- 手机 4G/5G 网络
- 不同运营商的网络
- 无痕浏览器
- 让不同地区的朋友测试

---

# 如果你使用的是 Cloudflare Pages

Pages 项目的默认域名是：

```text
xxxxx.pages.dev
```

添加自定义域名的位置是：

```text
Pages 项目 → Custom domains → Set up a custom domain
```

填写域名后，Cloudflare 会自动配置 DNS。

注意：`pages.dev` 和 `workers.dev` 在中国大陆同样可能不稳定，因此正式分享前仍然建议绑定自定义域名。

---

# 检查 Cloudflare Access 是否拦截了访客

如果自定义域名之后仍然只有你能访问，需要检查 Zero Trust。

进入：

```text
Cloudflare Dashboard → Zero Trust → Access → Applications
```

查看是否存在覆盖以下域名或路径的 Access 应用：

```text
zhang-junyi-site.15732733901.workers.dev
*.workers.dev
你的自定义域名
```

如果存在：

1. 这不是公开网站的登录系统，除非你确实希望访客登录。
2. 对公开作品集网站，应当删除对应 Access 策略。
3. 或者把应用设置为允许所有人访问。
4. 不要开启 One-time PIN、Google 登录或 Service Token 限制，除非你确定只希望特定用户访问。

如果访客看到 Cloudflare 登录页或邮箱验证页，基本可以确定是 Access 策略问题。

---

# 检查 Worker 的 workers.dev 开关

进入：

```text
Workers & Pages → zhang-junyi-site → Settings → Domains & Routes
```

确认：

- `workers.dev` 路由处于开启状态
- 没有错误的 Route 规则覆盖当前地址
- 自定义域名已经显示为 `Active`

如果 `workers.dev` 关闭，只有绑定自定义域名后才能公开访问。

---

# 不要只依赖 workers.dev

即使是全球其他地区，也建议使用自定义域名，因为：

- `workers.dev` 容易被地区网络拦截
- 不同运营商 DNS 结果可能不同
- 分享地址不专业
- 以后更换部署平台时，分享链接会变化
- 自定义域名可以保持长期不变

推荐最终分享：

```text
https://www.example.com
```

而不是：

```text
https://zhang-junyi-site.15732733901.workers.dev
```

---

# 中国大陆访问的额外说明

Cloudflare 免费套餐并不保证中国大陆访问质量。即使绑定自定义域名，也可能出现：

- 某些运营商无法访问
- 首次打开较慢
- 图片加载不完整
- DNS 解析不稳定

如果网站主要给中国大陆用户访问，长期方案应考虑：

1. 使用腾讯云 EdgeOne 等面向国内网络优化的产品。
2. 使用阿里云 OSS、腾讯云 COS 等对象存储托管静态文件。
3. 绑定国内 CDN 和备案域名。
4. 保留 Cloudflare 作为海外访问节点。

如果只是个人作品集，建议先绑定自定义域名测试；如果大陆用户仍然普遍打不开，再迁移到国内静态托管。

---

# 最快的排查顺序

1. 确认海外访问是否返回 200。
2. 确认是否启用了 Cloudflare Access。
3. 确认 Worker 的 `workers.dev` 路由是否开启。
4. 绑定 `www.你的域名.com` 自定义域名。
5. 等待 DNS 和 HTTPS 生效。
6. 用手机 4G/5G 和无痕窗口测试。
7. 如果大陆仍然普遍不可用，迁移到国内静态托管。
