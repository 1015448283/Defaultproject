export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
  }

  const { to, message } = await request.json();

  try {
    const response = await fetch('https://api.whatsapp.com/v1/messages', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.WHATSAPP_API_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, message, phone_number_id: process.env.WHATSAPP_PHONE_NUMBER_ID }),
    });

    const data = await response.json();
    return new Response(JSON.stringify({ success: true, data: { message_id: data.id } }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: { code: 'WHATSAPP_ERROR', message: error.message } }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
