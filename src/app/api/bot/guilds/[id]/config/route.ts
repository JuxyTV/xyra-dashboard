import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import * as http from "http";

const API_URL = (process.env.API_URL || "http://46.247.108.191:30141").trim();
const API_SECRET_KEY = (process.env.API_SECRET_KEY || "").trim();

// Helper function to make native HTTP requests bypassing Next.js fetch
function makeHttpRequest(url: string, method: string, body?: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: {
        'Authorization': `Bearer ${API_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, data: { error: "Invalid JSON from bot" } });
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const session = await getServerSession(authOptions);
  // @ts-ignore
  if (!session || !session.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 1. Verify user is in this guild and has admin permissions
  // @ts-ignore
  const discordRes = await fetch("https://discord.com/api/users/@me/guilds", {
    // @ts-ignore
    headers: { Authorization: `Bearer ${session.accessToken}` },
  });
  
  if (!discordRes.ok) {
    return NextResponse.json({ error: "Failed to verify Discord permissions" }, { status: 403 });
  }

  const guilds = await discordRes.json();
  const targetGuild = guilds.find((g: any) => g.id === id);
  
  // Check Administrator (0x8) or Manage Server (0x20)
  if (!targetGuild || ((targetGuild.permissions & 8) !== 8 && (targetGuild.permissions & 32) !== 32)) {
    return NextResponse.json({ error: "Forbidden: You do not have permission to manage this server" }, { status: 403 });
  }

  // 2. Forward request to Bot API using native http
  try {
    const botRes = await makeHttpRequest(`${API_URL}/api/guilds/${id}/config`, 'GET');
    return NextResponse.json(botRes.data, { status: botRes.status });
  } catch (error: any) {
    return NextResponse.json({ error: `Bot API offline: ${error.message} (Cause: ${error.cause?.message || "N/A"}) (URL: ${API_URL})` }, { status: 502 });
  }
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const session = await getServerSession(authOptions);
  // @ts-ignore
  if (!session || !session.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // @ts-ignore
  const discordRes = await fetch("https://discord.com/api/users/@me/guilds", {
    // @ts-ignore
    headers: { Authorization: `Bearer ${session.accessToken}` },
  });
  
  if (!discordRes.ok) return NextResponse.json({ error: "Failed to verify permissions" }, { status: 403 });

  const guilds = await discordRes.json();
  const targetGuild = guilds.find((g: any) => g.id === id);
  
  if (!targetGuild || ((targetGuild.permissions & 8) !== 8 && (targetGuild.permissions & 32) !== 32)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Parse body
  const body = await request.json();

  // Forward to Bot API using native http
  try {
    const botRes = await makeHttpRequest(`${API_URL}/api/guilds/${id}/config`, 'POST', body);
    return NextResponse.json(botRes.data, { status: botRes.status });
  } catch (error: any) {
    return NextResponse.json({ error: `Bot API offline: ${error.message} (Cause: ${error.cause?.message || "N/A"}) (URL: ${API_URL})` }, { status: 502 });
  }
}
