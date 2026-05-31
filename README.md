# 知技 ZhiJi

知技是一个 AI 使用目的澄清与个性化提示词生成 demo。用户完成测评后，可以得到 Skill Passport、能力路径、Prompt 工作台产出的个性化 Prompt Pack/Skill Seed，以及可下载的分享图，用来把模糊目的改写成更清楚、更高效、可复用的 AI 提问方式。

## 本地预览

```bash
python3 -m http.server 4173
```

打开：

```text
http://127.0.0.1:4173
```

## Cloudflare Pages 快速上线

这个项目是纯静态站，不需要 Node、数据库或传统服务器。

1. 把本目录作为一个 GitHub 仓库推送。
2. 进入 Cloudflare Dashboard，选择 Pages。
3. 选择 Connect to Git，并连接这个仓库。
4. 构建配置：
   - Framework preset: None
   - Build command: 留空
   - Build output directory: `/`
5. 部署完成后，在 Pages 项目里添加 Custom domain。
6. 域名 DNS 使用 Cloudflare，不使用中国大陆服务器时通常不需要 ICP 备案。

## Vercel 快速上线

1. 把本目录推送到 GitHub。
2. 在 Vercel 导入仓库。
3. Framework Preset 选择 Other。
4. Build Command 留空。
5. Output Directory 留空或填写 `./`。
6. 部署后在 Domains 里绑定域名。

## 文件说明

- `index.html`: 页面结构
- `styles.css`: 视觉样式
- `app.js`: 测评逻辑、工作台生成、分享图导出
- `_headers`: Cloudflare Pages 响应头配置

## 上线前检查

- 页面能从首页、测评、Passport、Prompt 工作台、Library、Export 正常切换。
- 完成测评后结果不会丢失，刷新页面仍能看到上次结果。
- 分享图 PNG 可以下载。
- 手机宽度下没有文字重叠或按钮溢出。
