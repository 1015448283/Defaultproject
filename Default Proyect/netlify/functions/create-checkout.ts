import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_SERVICE_ROLE_KEY || '');

export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const { proyecto_id, monto, moneda = 'COP', descripcion } = await request.json();

    const { data: pago, error: pagoError } = await supabase
      .from('pagos')
      .insert({ proyecto_id, monto, moneda, estado: 'pendiente' })
      .select()
      .single();

    if (pagoError) throw pagoError;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'pse', 'nequi'],
      line_items: [{
        price_data: {
          currency: moneda.toLowerCase(),
          product_data: { name: descripcion || 'Servicios de Desarrollo', description: `Proyecto: ${proyecto_id}` },
          unit_amount: monto,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${new URL(request.url).origin}/pago/exito?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${new URL(request.url).origin}/pago/cancelado`,
      metadata: { proyecto_id, pago_id: pago.id },
    });

    await supabase.from('pagos').update({ stripe_session_id: session.id }).eq('id', pago.id);

    return new Response(JSON.stringify({ success: true, data: { session_id: session.id, url: session.url, expires_at: new Date(session.expires_at * 1000).toISOString() } }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: { code: 'CHECKOUT_ERROR', message: error.message } }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
