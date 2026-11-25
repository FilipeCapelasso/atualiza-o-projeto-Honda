// Aviso do Asaas (Pix Automático e cobranças).
// Só repassa o token do cabeçalho e os ids para public.asaas_webhook, que confere o token
// e consulta o próprio Asaas antes de mudar qualquer coisa. Nada do corpo recebido é confiado.
// Responde sempre 200: se o Asaas recebe erro, ele pausa a fila de avisos.
const URL_BASE = Deno.env.get('SUPABASE_URL')!;
const ANON = Deno.env.get('SUPABASE_ANON_KEY')!;
const ID = /^[A-Za-z0-9_-]{4,80}$/;
const so = (v: unknown) => (typeof v === 'string' && ID.test(v) ? v : null);

Deno.serve(async (req) => {
  try {
    const token = req.headers.get('asaas-access-token') || '';
    if (req.method === 'POST' && token.length >= 32 && token.length <= 255) {
      const b = await req.json().catch(() => null);
      if (b && typeof b === 'object') {
        const ev = String(b.event ?? '').slice(0, 80);
        const pay = b.payment ?? {};
        const aut = b.authorization ?? {};
        const ins = b.paymentInstruction ?? {};
        const auth = so(aut.id) || so(ins?.authorization?.id) || so(pay.pixAutomaticAuthorization) || so(pay.pixAutomaticAuthorizationId);
        const customer = so(pay.customer) || so(aut.customerId);
        const elegivel = typeof b?.eligibility?.status === 'string' ? b.eligibility.status.slice(0, 20) : null;
        await fetch(`${URL_BASE}/rest/v1/rpc/asaas_webhook`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', apikey: ANON, Authorization: `Bearer ${ANON}` },
          // asaas_webhook(p jsonb): o corpo leva o nome do parâmetro
          body: JSON.stringify({ p: { token, event: ev, id: so(b.id), auth, customer, elegivel } }),
        });
      }
    }
  } catch (_) { /* sempre 200 */ }
  return new Response(JSON.stringify({ received: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
});
