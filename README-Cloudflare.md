# 住宅IP代理查找器 - Cloudflare Pages 部署指南

本文档提供了将“住宅IP代理查找器”项目正确部署到 Cloudflare Pages 的完整分步指南，包括前端、受密码保护的后端API以及与KV存储的集成。

## 1. Fork 并克隆仓库

1.  访问 `https://github.com/ddan889/residential-ip-finder`
2.  点击右上角的 **Fork** 按钮，将仓库复制到您自己的 GitHub 账户下。
3.  在本地克隆您 Fork 后的仓库。

## 2. Cloudflare Pages 项目设置

1.  登录 Cloudflare 控制台，进入 **Workers & Pages**。
2.  点击 **Create application** -> **Pages** -> **Connect to Git**。
3.  选择您 Fork 的 GitHub 仓库。
4.  在 **“构建和部署 (Build & deployments)”** 设置页面，进行以下关键配置：
    *   **生产分支 (Production branch)**: 选择 `deploy`。这是最重要的步骤，确保 Cloudflare 部署的是我们指定的分支。
    *   **框架预设 (Framework preset)**: 设置为 `None` (如果 `None` 选项不可用，请将其留空或选择 `Custom`)。
    *   **构建命令 (Build command)**: 设置为 `exit 0`。
    *   **构建输出目录 (Build output directory)**: 设置为 `/`。
    *   **根目录 (Root Directory)**: 设置为 `/`。
5.  点击 **“保存并部署 (Save and Deploy)”**。

## 3. 环境变量和 KV 命名空间绑定

首次部署会失败或功能不全，因为还需进行以下配置：

1.  进入新创建的 Pages 项目的 **Settings** -> **Environment variables**。
2.  在 **Production** 下，添加一个环境变量：
    *   **变量名称 (Variable name)**: `ADMIN_PASSWORD`
    *   **值 (Value)**: 设置一个您自己的强密码。
    *   **加密 (Encrypt)**: 强烈建议勾选加密。
3.  进入 **Settings** -> **Functions**。
4.  在 **KV namespace bindings** 部分，添加一个绑定：
    *   **变量名称 (Variable name)**: `PROXIES_KV`
    *   **KV 命名空间 (KV namespace)**: 选择您用于存储代理数据的 KV 命名空间（例如 `0Magnet`）。

## 4. 触发最终部署

完成以上所有配置后，您需要触发一次新的部署来应用这些设置。

1.  在本地对项目做一个微小的更改（例如，修改 `README.md` 文件）。
2.  将更改推送到 `deploy` 分支：
    ```bash
    git add .
    git commit -m "Trigger new deployment with full config"
    git push origin deploy
    ```
3.  Cloudflare 会自动拉取最新代码并使用所有正确的配置进行部署。

部署成功后，您的后台 `http://<your-project>.pages.dev/admin.html` 应该会弹出密码验证，并且所有功能都能正常工作。