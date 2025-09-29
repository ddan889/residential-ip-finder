// functions/api/proxies.js

export async function onRequest(context) {
  // 从环境变量中获取 KV 命名空间
  const { env } = context;
  const kv = env.PROXIES_KV;

  const { request } = context;
  const url = new URL(request.url);

  try {
    switch (request.method) {
      case 'GET': {
        // 尝试从 KV 中获取所有代理项
        const list = await kv.list();
        const proxies = [];
        for (const key of list.keys) {
          const value = await kv.get(key.name);
          if (value) {
            proxies.push(JSON.parse(value));
          }
        }
        return new Response(JSON.stringify(proxies), {
          headers: { 'Content-Type': 'application/json' },
        });
      }

      case 'POST': {
        const newProxy = await request.json();
        newProxy.id = crypto.randomUUID(); // 生成唯一 ID
        await kv.put(newProxy.id, JSON.stringify(newProxy));
        return new Response(JSON.stringify(newProxy), {
          status: 201,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      
      case 'PUT': {
        const updatedProxy = await request.json();
        const id = updatedProxy.id;
        if (!id) {
          return new Response('Missing proxy ID', { status: 400 });
        }
        await kv.put(id, JSON.stringify(updatedProxy));
        return new Response(JSON.stringify(updatedProxy), {
          headers: { 'Content-Type': 'application/json' },
        });
      }

      case 'DELETE': {
        const id = url.searchParams.get('id');
        if (!id) {
          return new Response('Missing proxy ID', { status: 400 });
        }
        await kv.delete(id);
        return new Response('Proxy deleted', { status: 200 });
      }

      default:
        return new Response('Method Not Allowed', { status: 405 });
    }
  } catch (error) {
    console.error('API Error:', error);
    return new Response('Internal Server Error: ' + error.message, { status: 500 });
  }
}