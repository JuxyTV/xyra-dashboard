import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Settings, Shield, Plus } from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  // @ts-ignore
  if (!session || !session.accessToken) {
    redirect("/");
  }

  // @ts-ignore
  const discordRes = await fetch("https://discord.com/api/users/@me/guilds", {
    // @ts-ignore
    headers: { Authorization: `Bearer ${session.accessToken}` },
  });
  
  if (!discordRes.ok) {
    return <div className="text-red-500 text-center py-20">Failed to load servers. Please log out and back in.</div>;
  }

  const allGuilds = await discordRes.json();
  
  // Filter for Manage Server (0x20) or Administrator (0x8)
  const adminGuilds = allGuilds.filter((g: any) => (g.permissions & 8) === 8 || (g.permissions & 32) === 32);

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Select a <span className="text-brand">Server</span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Choose a server to configure Xyra's settings, economy, and modules. Only servers where you have Administrator or Manage Server permissions are shown.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        {adminGuilds.map((guild: any) => (
          <Link href={`/dashboard/${guild.id}`} key={guild.id} className="glass-panel p-6 rounded-xl hover:-translate-y-1 transition duration-300 hover:shadow-lg hover:shadow-brand/20 group flex items-center justify-between">
            <div className="flex items-center gap-4">
              {guild.icon ? (
                <img src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`} alt={guild.name} className="w-16 h-16 rounded-full shadow-md" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-xl font-bold shadow-md">
                  {guild.name.charAt(0)}
                </div>
              )}
              <div>
                <h3 className="text-lg font-bold group-hover:text-brand transition line-clamp-1">{guild.name}</h3>
                <p className="text-sm text-gray-400 mt-1 flex items-center gap-1">
                  <Shield size={14} /> Configure Xyra
                </p>
              </div>
            </div>
            <div className="bg-white/5 p-3 rounded-lg group-hover:bg-brand/20 transition">
              <Settings size={20} className="text-gray-400 group-hover:text-brand transition" />
            </div>
          </Link>
        ))}
        {adminGuilds.length === 0 && (
          <div className="col-span-full text-center text-gray-400 py-12 glass-panel rounded-xl">
            <Shield size={48} className="mx-auto mb-4 text-gray-500" />
            <h3 className="text-xl font-bold text-white mb-2">No Manageable Servers</h3>
            <p>You don't have permission to manage any servers. Ask the owner for "Manage Server" permissions.</p>
          </div>
        )}
      </div>
      
      <div className="flex justify-center mt-12">
        <a href="https://discord.com/oauth2/authorize?client_id=1528885905043155344&permissions=8&integration_type=0&scope=bot" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-lg transition border border-white/10">
          <Plus size={18} /> Invite Xyra to a new server
        </a>
      </div>
    </div>
  );
}
