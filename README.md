# 王老板和蛋总请你来体面

这是一个私人饭局邀请点菜网页。朋友输入口令后，可以填写姓名、忌口、选择想吃的菜，并提交到 Google 表格。

## 本地预览

直接打开 `index.html` 就能看页面。

## 连接 Google 表格

1. 打开 Google 表格，新建一个空表格。
2. 在菜单里选择“扩展程序” -> “Apps 脚本”。如果界面是英文，就是“Extensions” -> “Apps Script”。
3. 删除编辑器里的默认内容。
4. 复制 `google-sheets/apps-script.js` 的全部内容，粘贴进去。
5. 保存项目。
6. 点击“部署” -> “新建部署”。
7. 类型选择“网页应用”。
8. 执行身份选择“我”。
9. 访问权限选择“任何人”。
10. 部署后复制生成的网页应用网址。
11. 打开 `script.js`，把网址填到这一行的引号里：

```js
const GOOGLE_SCRIPT_URL = "";
```

填好后类似：

```js
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/你的地址/exec";
```

## 发布到 Vercel

把这个文件夹上传到 GitHub 仓库后，在 Vercel 里导入该仓库。项目是纯静态网页，不需要额外构建命令。
