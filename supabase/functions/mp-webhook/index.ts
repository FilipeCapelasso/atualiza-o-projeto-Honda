// Aviso do Mercado Pago (notification_url curto).
// Só repassa o id (pagamento ou assinatura) para public.mp_webhook, que consulta o próprio
// Mercado Pago antes de mudar qualquer status. Nada do corpo recebido é confiado.
const URL_BASE = Deno.env.get('SUPABASE_URL')!;
const ANON = Deno.env.get('SUPABASE_ANON_KEY')!;

Deno.serve(async (req) => {
  try {
    const u = new URL(req.url);
    let id = u.searchParams.get('data.id') || u.searchParams.get('id') || '';
    let action = u.searchParams.get('action') || '';
    let type = u.searchParams.get('type') || u.searchParams.get('topic') || 'payment';
    if (req.method === 'POST') {
      try {
        const b = await req.json();
        id = String(b?.data?.id ?? b?.id ?? id);
        action = String(b?.action ?? action);
        type = String(b?.type ?? b?.topic ?? type);
      } catch (_) { /* corpo vazio */ }
    }
    // pagamento: só números; assinatura (preapproval): letras e números
    const ok = /^\d{4,20}$/.test(id) || (/^[A-Za-z0-9]{8,64}$/.test(id) && /^(subscription|preapproval)/.test(type));
    if (ok) {
      // mp_webhook(jsonb) tem um único parâmetro sem nome: o corpo inteiro vira o argumento
      await fetch(`${URL_BASE}/rest/v1/rpc/mp_webhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: ANON, Authorization: `Bearer ${ANON}` },
        body: JSON.stringify({ data: { id }, action: action.slice(0, 60), type: type.slice(0, 60) }),
      });
    }
  } catch (_) { /* sempre responde 200 para o Mercado Pago não insistir */ }
  return new Response('ok', { status: 200 });
});
