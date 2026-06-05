const KV_BINDING_NAME = "orders_kv";
const ADMIN_CODE = "体面老板";

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });
}

function getStore(context) {
  return context.env?.[KV_BINDING_NAME] || globalThis[KV_BINDING_NAME];
}

function normalizeOrder(data) {
  return {
    submittedAt: data.submittedAt || new Date().toISOString(),
    guestName: String(data.guestName || "").trim(),
    dietaryNotes: String(data.dietaryNotes || "").trim(),
    dishes: String(data.dishes || "").trim(),
    extraRequest: String(data.extraRequest || "").trim(),
  };
}

export async function onRequestPost(context) {
  const store = getStore(context);

  if (!store) {
    return json({ ok: false, message: "KV storage is not bound." }, 500);
  }

  let payload;

  try {
    payload = await context.request.json();
  } catch {
    return json({ ok: false, message: "Invalid JSON." }, 400);
  }

  const order = normalizeOrder(payload);

  if (!order.guestName) {
    return json({ ok: false, message: "Guest name is required." }, 400);
  }

  const random = Math.random().toString(36).slice(2, 8);
  const key = `order_${Date.now()}_${random}`;
  await store.put(key, JSON.stringify(order));

  return json({ ok: true, key });
}

export async function onRequestGet(context) {
  const store = getStore(context);
  const url = new URL(context.request.url);
  const code = url.searchParams.get("code");

  if (code !== ADMIN_CODE) {
    return json({ ok: false, message: "Unauthorized." }, 401);
  }

  if (!store) {
    return json({ ok: false, message: "KV storage is not bound." }, 500);
  }

  const result = await store.list({ prefix: "order_", limit: 256 });
  const orders = [];

  for (const item of result.keys || []) {
    const order = await store.get(item.key, { type: "json" });
    if (order) {
      orders.push({ id: item.key, ...order });
    }
  }

  orders.sort((a, b) => String(b.submittedAt).localeCompare(String(a.submittedAt)));

  return json({ ok: true, orders });
}
