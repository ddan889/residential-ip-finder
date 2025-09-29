// functions/_middleware.js

// 定义一个简单的 HTML 登录页面
const LoginPage = `
<!DOCTYPE html>
<html>
<head>
  <title>后台登录</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f0f2f5; }
    form { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    input { display: block; width: 100%; padding: 0.5rem; margin-bottom: 1rem; border: 1px solid #ccc; border-radius: 4px; }
    button { width: 100%; padding: 0.7rem; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
    .error { color: red; margin-bottom: 1rem; }
  </style>
</head>
<body>
  <form method="post">
    <h2>后台管理登录</h2>
    <p class="error">{{ERROR}}</p>
    <input type="password" name="password" placeholder="请输入密码" required>
    <button type="submit">登录</button>
  </form>
</body>
</html>
`;

// 检查 Cookie 的函数
function getCookie(request, name) {
  const cookie = request.headers.get('Cookie');
  if (cookie) {
    const pairs = cookie.split(';');
    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i].trim().split('=');
      if (pair[0] === name) {
        return pair[1];
      }
    }
  }
  return null;
}

export async function onRequest(context) {
  const { request, next, env } = context;
  const url = new URL(request.url);

  // 只保护 /admin.html 路径
  if (url.pathname.startsWith('/admin')) {
    const adminPassword = env.ADMIN_PASSWORD;
    const sessionCookie = getCookie(request, 'auth_session');

    // 如果没有设置密码，则直接放行
    if (!adminPassword) {
      return next();
    }

    // 检查会话 Cookie
    if (sessionCookie === adminPassword) {
      return next(); // 密码正确，继续访问
    }

    // 处理登录请求
    if (request.method === 'POST') {
      const formData = await request.formData();
      const password = formData.get('password');

      if (password === adminPassword) {
        const response = new Response(null, { status: 302, headers: { 'Location': url.pathname } });
        response.headers.append('Set-Cookie', `auth_session=${adminPassword}; Path=/; HttpOnly; Secure; SameSite=Strict`);
        return response; // 登录成功，重定向
      } else {
        return new Response(LoginPage.replace('{{ERROR}}', '密码错误！'), { status: 401, headers: { 'Content-Type': 'text/html' } });
      }
    }

    // 显示登录页面
    return new Response(LoginPage.replace('{{ERROR}}', ''), { status: 401, headers: { 'Content-Type': 'text/html' } });
  }

  // 对于其他所有路径，直接放行
  return next();
}