import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2023-10-16',
});

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const siteUrl = (process.env.URL || process.env.DEPLOY_PRIME_URL || '').replace(/\/$/, '');

const corsHeaders = {
  'Access-Control-Allow-Origin': siteUrl || '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

export default async function handler(request: Request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: corsHeaders,
    });
  }

  try {
    const { proyecto_id, monto, moneda = 'COP', descripcion } = await request.json();

    if (!monto || monto <= 0) {
      return new Response(
        JSON.stringify({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Monto inválido' } }),
        { status: 400, headers: corsHeaders }
      );
    }

    // 1. Insert pending payment record in Supabase
    const { data: pago, error: pagoError } = await supabase
      .from('pagos')
      .insert({
        proyecto_id: proyecto_id || null,
        monto,
        moneda: moneda.toUpperCase(),
        estado: 'pendiente',
      })
      .select()
      .single();

    if (pagoError) throw pagoError;

    // 2. Create Stripe Checkout Session (Supports cards, PSE, etc.)
    const origin = siteUrl || new URL(request.url).origin;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: moneda.toLowerCase(),
            product_data: {
              name: descripcion || 'Servicios Técnicos - Oliver Prada',
              description: proyecto_id ? `Proyecto Ref: ${proyecto_id}` : 'Servicio técnico especializado',
            },
            unit_amount: Math.round(monto),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/pago/exito?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pago/error`,
      metadata: {
        proyecto_id: proyecto_id || '',
        pago_id: pago.id,
      },
    });

    // 3. Update payment record with stripe session ID
    await supabase.from('pagos').update({ stripe_session_id: session.id }).eq('id', pago.id);

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          session_id: session.id,
          url: session.url,
          expires_at: session.expires_at ? new Date(session.expires_at * 1000).toISOString() : null,
        },
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        success: false,
        error: { code: 'CHECKOUT_ERROR', message: error.message || 'Error creating checkout session' },
      }),
      { status: 500, headers: corsHeaders }
    );
  }
}
