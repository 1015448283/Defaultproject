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
    const { to, message } = await request.json();

    if (!to || !message) {
      return new Response(
        JSON.stringify({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Faltan parámetros to o message' } }),
        { status: 400, headers: corsHeaders }
      );
    }

    const token = process.env.WHATSAPP_API_TOKEN;
    const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    if (!token || !phoneId) {
      return new Response(
        JSON.stringify({
          success: false,
          error: { code: 'CONFIG_ERROR', message: 'Credenciales de WhatsApp Business no configuradas' },
        }),
        { status: 500, headers: corsHeaders }
      );
    }

    const response = await fetch(`https://graph.facebook.com/v17.0/${phoneId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body: message },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return new Response(
        JSON.stringify({ success: false, error: { code: 'WHATSAPP_API_ERROR', details: data } }),
        { status: response.status, headers: corsHeaders }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: { message_id: data.messages?.[0]?.id } }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: { code: 'WHATSAPP_ERROR', message: error.message } }),
      { status: 500, headers: corsHeaders }
    );
  }
}
