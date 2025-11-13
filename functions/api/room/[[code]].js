// Cloudflare Pages Function - Get Room by Code
export async function onRequestGet(context) {
  const { request, env, params } = context;
  const roomCode = params.code;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (!roomCode || roomCode.length !== 4) {
    return new Response(JSON.stringify({ error: 'Invalid room code' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const roomData = await env.ROOM_KV.get(`room:${roomCode}`);

  if (!roomData) {
    return new Response(JSON.stringify({ error: 'Room not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  return new Response(roomData, {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

// Update room
export async function onRequestPut(context) {
  const { request, env, params } = context;
  const roomCode = params.code;
  const body = await request.json();

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (!roomCode || roomCode.length !== 4) {
    return new Response(JSON.stringify({ error: 'Invalid room code' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const existingRoom = await env.ROOM_KV.get(`room:${roomCode}`);
  if (!existingRoom) {
    return new Response(JSON.stringify({ error: 'Room not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const roomData = {
    roomCode,
    players: body.players || [],
    createdAt: JSON.parse(existingRoom).createdAt,
    lastUpdate: Date.now()
  };

  await env.ROOM_KV.put(
    `room:${roomCode}`,
    JSON.stringify(roomData),
    { expirationTtl: 86400 }
  );

  return new Response(JSON.stringify(roomData), {
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
