import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_SERVICE_ROLE_KEY || '');

export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
  }

  const sig = request.headers.get('stripe-signature');
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

  let event: any;
  try {
    const body = await request.text();
    event = stripe.webhooks.constructEvent(body, sig || '', endpointSecret);
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: { code: 'INVALID_SIGNATURE', message: err.message } }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const { data: pago } = await supabase.from('pagos').select('proyecto_id').eq('stripe_session_id', session.id).single();
        if (pago?.proyecto_id) {
          await supabase.from('pagos').update({ estado: 'completado', stripe_payment_id: session.payment_intent }).eq('stripe_session_id', session.id);
          await supabase.from('proyectos').update({ estado: 'en_progreso' }).eq('id', pago.proyecto_id).eq('estado', 'pendiente');
        }
        break;
      }
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        await supabase.from('pagos').update({ estado: 'fallido' }).eq('stripe_payment_id', paymentIntent.id);
        break;
      }
      case 'charge.refunded': {
        const charge = event.data.object;
        await supabase.from('pagos').update({ estado: 'reembolsado' }).eq('stripe_payment_id', charge.payment_intent);
        break;
      }
    }
    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: { code: 'WEBHOOK_ERROR', message: err.message } }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
