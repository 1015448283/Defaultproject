import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2023-10-16',
});

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const sig = request.headers.get('stripe-signature');
  let event: Stripe.Event;

  try {
    const rawBody = await request.text();
    event = stripe.webhooks.constructEvent(rawBody, sig || '', endpointSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return new Response(
      JSON.stringify({ success: false, error: { code: 'INVALID_SIGNATURE', message: err.message } }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const paymentIntentId = typeof session.payment_intent === 'string' ? session.payment_intent : null;

        // Update payment status
        const { data: pago, error: updateError } = await supabase
          .from('pagos')
          .update({
            estado: 'completado',
            stripe_payment_id: paymentIntentId,
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_session_id', session.id)
          .select('proyecto_id')
          .single();

        if (updateError) {
          console.error('Error updating payment in Supabase:', updateError);
        }

        // If associated with a project, update project status to 'en_progreso'
        if (pago?.proyecto_id) {
          await supabase
            .from('proyectos')
            .update({ estado: 'en_progreso', updated_at: new Date().toISOString() })
            .eq('id', pago.proyecto_id)
            .eq('estado', 'pendiente');
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await supabase
          .from('pagos')
          .update({ estado: 'fallido', updated_at: new Date().toISOString() })
          .eq('stripe_payment_id', paymentIntent.id);
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        const paymentIntentId = typeof charge.payment_intent === 'string' ? charge.payment_intent : null;
        if (paymentIntentId) {
          await supabase
            .from('pagos')
            .update({ estado: 'reembolsado', updated_at: new Date().toISOString() })
            .eq('stripe_payment_id', paymentIntentId);
        }
        break;
      }

      default:
        console.log(`Unhandled Stripe event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('Error processing webhook:', err);
    return new Response(
      JSON.stringify({ success: false, error: { code: 'WEBHOOK_ERROR', message: err.message } }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
