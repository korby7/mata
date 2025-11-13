// Cloudflare Pages Function - Create Room
export async function onRequestPost(context) {
  const { request, env } = context;
  const body = await request.json();

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Generate 4-letter room code
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let roomCode = '';
  for (let i = 0; i < 4; i++) {
    roomCode += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  const roomData = {
    roomCode,
    players: body.players || [],
    createdAt: Date.now(),
    lastUpdate: Date.now()
  };

  await env.ROOM_KV.put(
    `room:${roomCode}`,
    JSON.stringify(roomData),
    { expirationTtl: 86400 }
  );

  return new Response(JSON.stringify(roomData), {
    status: 201,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

// CORS preflight
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}
