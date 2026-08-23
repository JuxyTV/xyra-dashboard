import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import * as http from "http";

const API_URL = (process.env.API_URL || "http://46.247.108.191:30141").trim();
const API_SECRET_KEY = (process.env.API_SECRET_KEY || "").trim();

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
        try { resolve({ status: res.statusCode, data: JSON.parse(data) }); }
        catch (e) { resolve({ status: res.statusCode, data: { error: "Invalid JSON from bot" } }); }
      });
    });
    req.on('error', (e) => { reject(e); });
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function checkGuildAccess(session: any, guildId: string) {
  // @ts-ignore
  const discordRes = await fetch("https://discord.com/api/users/@me/guilds", {
    // @ts-ignore
    headers: { Authorization: `Bearer ${session.accessToken}` },
  });
  if (!discordRes.ok) return false;
  const guilds = await discordRes.json();
  const g = guilds.find((x: any) => x.id === guildId);
  return g && ((g.permissions & 8) === 8 || (g.permissions & 32) === 32);
}

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const session = await getServerSession(authOptions);
  // @ts-ignore
  if (!session?.accessToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await checkGuildAccess(session, id))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const r = await makeHttpRequest(`${API_URL}/api/guilds/${id}/giveaways`, 'GET');
    return NextResponse.json(r.data, { status: r.status });
  } catch (e: any) {
    return NextResponse.json({ error: `Bot API offline: ${e.message}` }, { status: 502 });
  }
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const session = await getServerSession(authOptions);
  // @ts-ignore
  if (!session?.accessToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await checkGuildAccess(session, id))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await request.json();
  try {
    const r = await makeHttpRequest(`${API_URL}/api/guilds/${id}/giveaways`, 'POST', body);
    return NextResponse.json(r.data, { status: r.status });
  } catch (e: any) {
    return NextResponse.json({ error: `Bot API offline: ${e.message}` }, { status: 502 });
  }
}
