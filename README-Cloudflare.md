# 住宅IP代理查找器 - Cloudflare Pages 部署指南

## 🚀 快速部署到 Cloudflare Pages

### 方法一：通过 GitHub 自动部署（推荐）

1. **准备 GitHub 仓库**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/residential-ip-finder.git
   git push -u origin main
   ```

2. **连接 Cloudflare Pages**
   - 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - 进入 "Pages" 部分
   - 点击 "Create a project"
   - 选择 "Connect to Git"
   - 授权并选择你的 GitHub 仓库

3. **配置构建设置**
   - **Framework preset**: None
   - **Build command**: 留空
   - **Build output directory**: `/`
   - **Root directory**: `/`

4. **部署完成**
   - Cloudflare 会自动部署你的项目
   - 获得类似 `https://residential-ip-finder.pages.dev` 的域名

### 方法二：直接上传文件

1. **准备文件**
   - 确保所有文件都在项目根目录
   - 主要文件：`index.html`, `admin.html`, `_redirects`

2. **上传到 Cloudflare Pages**
   - 在 Cloudflare Dashboard 中选择 "Upload assets"
   - 拖拽整个项目文件夹
   - 等待部署完成

### 方法三：使用 Wrangler CLI

1. **安装 Wrangler**
   ```bash
   npm install -g wrangler
   ```

2. **登录 Cloudflare**
   ```bash
   wrangler login
   ```

3. **部署项目**
   ```bash
   wrangler pages project create residential-ip-finder
   wrangler pages deploy . --project-name=residential-ip-finder
   ```

## 📁 项目结构

```
residential-ip-finder/
├── index.html          # 主页面（原 residential-ip-finder.html）
├── admin.html          # 管理后台页面
├── _redirects          # Cloudflare Pages 重定向规则
├── wrangler.toml       # Cloudflare 配置文件
└── README-Cloudflare.md # 部署说明
```

## ✨ 功能特性

- ✅ **纯静态网站** - 无需服务器，完全兼容 Cloudflare Pages
- ✅ **20+ 代理服务商** - 包含详细的价格和功能对比
- ✅ **智能平台推荐** - 支持 TikTok、Facebook、Instagram 等平台搜索
- ✅ **代理类型分类** - 住宅代理、数据中心代理、动态代理、移动代理
- ✅ **多维度筛选** - 价格、位置、带宽、协议等多重过滤
- ✅ **响应式设计** - 完美适配桌面和移动设备
- ✅ **SEO 优化** - 搜索引擎友好的结构

## 🔧 自定义配置

### 修改域名
在 `wrangler.toml` 中修改：
```toml
[env.production]
route = "your-custom-domain.com"
```

### 添加自定义域名
1. 在 Cloudflare Pages 项目设置中
2. 点击 "Custom domains"
3. 添加你的域名并验证

### 环境变量
Cloudflare Pages 支持环境变量，可在项目设置中配置。

## 📊 性能优势

- **全球 CDN** - Cloudflare 的全球网络加速
- **自动 HTTPS** - 免费 SSL 证书
- **无限带宽** - 免费计划包含无限带宽
- **快速部署** - Git 推送后自动部署
- **版本控制** - 支持回滚到任意版本

## 🛠️ 故障排除

### 常见问题

1. **404 错误**
   - 检查 `_redirects` 文件是否正确
   - 确保 `index.html` 在根目录

2. **样式不显示**
   - 检查 CSS 路径是否正确
   - 确保所有资源都使用相对路径

3. **JavaScript 错误**
   - 检查浏览器控制台的错误信息
   - 确保所有 API 调用已移除

### 联系支持
如有问题，请查看 [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)

## 📈 后续优化建议

1. **添加 Web Analytics** - 使用 Cloudflare Web Analytics
2. **启用缓存优化** - 配置缓存规则
3. **添加 PWA 支持** - 离线访问功能
4. **集成 Cloudflare Workers** - 添加动态功能

---

🎉 **恭喜！你的住宅IP代理查找器现在已经部署在 Cloudflare Pages 上了！**