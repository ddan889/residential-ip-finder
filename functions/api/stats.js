// functions/api/stats.js
export async function onRequest(context) {
    const { env } = context;
    const kv = env.PROXIES_KV;

    try {
        if (!kv) {
            throw new Error("KV namespace is not bound. Please configure PROXIES_KV in your Cloudflare Pages settings.");
        }

        const list = await kv.list();
        if (list.keys.length === 0) {
            return new Response(JSON.stringify({
                proxyCount: 0,
                totalTrafficGB: 0,
                avgPricePerGB: 0,
                minPrice: 0,
                maxPrice: 0,
                countryStats: {}
            }), {
                headers: { 'Content-Type': 'application/json' },
            });
        }

        let totalTrafficGB = 0;
        let minPrice = Infinity;
        let maxPrice = -Infinity;
        const countryCounts = {};

        for (const key of list.keys) {
            const value = await kv.get(key.name, { type: 'json' });
            if (value && typeof value.price_per_gb === 'number') {
                totalTrafficGB += value.traffic_gb || 0;
                minPrice = Math.min(minPrice, value.price_per_gb);
                maxPrice = Math.max(maxPrice, value.price_per_gb);

                if (value.countries) {
                    value.countries.forEach(country => {
                        countryCounts[country] = (countryCounts[country] || 0) + 1;
                    });
                }
            }
        }
        
        minPrice = minPrice === Infinity ? 0 : minPrice;
        maxPrice = maxPrice === -Infinity ? 0 : maxPrice;

        const avgPricePerGB = list.keys.length > 0 ? (minPrice + maxPrice) / 2 : 0;

        const stats = {
            proxyCount: list.keys.length,
            totalTrafficGB: totalTrafficGB,
            avgPricePerGB: avgPricePerGB.toFixed(2),
            minPrice: minPrice.toFixed(2),
            maxPrice: maxPrice.toFixed(2),
            countryStats: countryCounts
        };

        return new Response(JSON.stringify(stats), {
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Stats API Error:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}