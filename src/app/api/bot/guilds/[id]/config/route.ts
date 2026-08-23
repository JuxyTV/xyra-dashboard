import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const API_URL = process.env.API_URL || "http://46.247.108.191:30141";
const API_SECRET_KEY = process.env.API_SECRET_KEY;

export async function GET(request: Request, { params }: { params: { id: string } }) {
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
  const targetGuild = guilds.find((g: any) => g.id === params.id);
  
  // Check Administrator (0x8) or Manage Server (0x20)
  if (!targetGuild || ((targetGuild.permissions & 8) !== 8 && (targetGuild.permissions & 32) !== 32)) {
    return NextResponse.json({ error: "Forbidden: You do not have permission to manage this server" }, { status: 403 });
  }

  // 2. Forward request to Bot API
  try {
    const botRes = await fetch(`${API_URL}/api/guilds/${params.id}/config`, {
      headers: { Authorization: `Bearer ${API_SECRET_KEY}` }
    });
    const data = await botRes.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Bot API offline" }, { status: 502 });
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
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
  const targetGuild = guilds.find((g: any) => g.id === params.id);
  
  if (!targetGuild || ((targetGuild.permissions & 8) !== 8 && (targetGuild.permissions & 32) !== 32)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Parse body
  const body = await request.json();

  // Forward to Bot API
  try {
    const botRes = await fetch(`${API_URL}/api/guilds/${params.id}/config`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_SECRET_KEY}` 
      },
      body: JSON.stringify(body)
    });
    const data = await botRes.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Bot API offline" }, { status: 502 });
  }
}
