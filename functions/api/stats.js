// functions/api/stats.js

export async function onRequest(context) {
  const { env } = context;
  const kv = env.PROXIES_KV;

  try {
    // 检查 KV 是否已绑定
    if (!kv) {
      throw new Error("KV namespace is not bound. Please configure PROXIES_KV in your Cloudflare Pages settings.");
    }

    const list = await kv.list();
    const stats = {
      proxyCount: list.keys.length,
      // 可以在这里添加更多的统计数据
    };

    return new Response(JSON.stringify(stats), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Stats API Error:', error);
    // 返回一个 JSON 格式的错误信息，而不是 HTML
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}