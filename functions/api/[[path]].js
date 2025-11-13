// Cloudflare Pages Functions - API for Room Management
// This will be deployed automatically with Cloudflare Pages

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname.replace('/api/', '');

  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // GET /api/room/:roomCode - Get room data
    if (request.method === 'GET' && path.startsWith('room/')) {
      const roomCode = path.split('/')[1];

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

    // POST /api/room - Create new room
    if (request.method === 'POST' && path === 'room') {
      const body = await request.json();

      // Generate 4-letter room code
      const roomCode = generateRoomCode();

      const roomData = {
        roomCode,
        players: body.players || [],
        createdAt: Date.now(),
        lastUpdate: Date.now()
      };

      // Store in KV with 24 hour expiration
      await env.ROOM_KV.put(
        `room:${roomCode}`,
        JSON.stringify(roomData),
        { expirationTtl: 86400 } // 24 hours
      );

      return new Response(JSON.stringify(roomData), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // PUT /api/room/:roomCode - Update room data
    if (request.method === 'PUT' && path.startsWith('room/')) {
      const roomCode = path.split('/')[1];
      const body = await request.json();

      if (!roomCode || roomCode.length !== 4) {
        return new Response(JSON.stringify({ error: 'Invalid room code' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Check if room exists
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

      // Update in KV with 24 hour expiration
      await env.ROOM_KV.put(
        `room:${roomCode}`,
        JSON.stringify(roomData),
        { expirationTtl: 86400 } // 24 hours
      );

      return new Response(JSON.stringify(roomData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

function generateRoomCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
