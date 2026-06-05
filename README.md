# 王老板和蛋总请你来体面

这是一个私人饭局邀请点菜网页。朋友输入口令后，可以填写姓名、忌口、选择想吃的菜，并提交到国内部署的 EdgeOne Pages KV。

## 本地预览

直接打开 `index.html` 就能看页面。

## 国内部署方案

推荐使用 EdgeOne Pages：

1. 在 EdgeOne Pages 创建项目，导入 GitHub 仓库 `Pioneer-WYP/timian-dinner`。
2. 开通 Pages KV。
3. 创建一个 Namespace，例如 `timian_dinner_orders`。
4. 在项目的 KV Storage 设置里绑定 Namespace。
5. 变量名必须填写：`orders_kv`。
6. 重新部署项目。

朋友提交会写入 `/api/orders`，后台查看地址是：

```text
https://你的-edgeone-网址/admin.html
```

后台口令：

```text
体面老板
```

## 发布到 Vercel

Vercel 版本可保留作为境外备用；国内朋友建议使用 EdgeOne Pages 生成的网址。
