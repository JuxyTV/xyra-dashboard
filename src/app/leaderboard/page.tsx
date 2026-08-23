import { Trophy, Coins, User } from "lucide-react";

// For Vercel deployment, we use the public IP of the Orihost server
const API_URL = "http://46.247.108.191:30141";

// Force dynamic rendering so it always fetches fresh data
export const dynamic = 'force-dynamic';

async function getLeaderboardData() {
  try {
    const res = await fetch(`${API_URL}/api/leaderboard`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.error("Failed to fetch leaderboard:", e);
    return null;
  }
}

export default async function LeaderboardPage() {
  const data = await getLeaderboardData();

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <h1 className="text-4xl font-bold mb-4">API Offline</h1>
        <p className="text-gray-400">The bot is currently unreachable. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-fade-in-up">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold">Global <span className="gradient-text">Leaderboards</span></h1>
        <p className="text-gray-400 max-w-2xl mx-auto">See who is dominating across all servers using Xyra.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Levels Leaderboard */}
        <div className="glass-panel p-6 md:p-8 rounded-3xl">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/10">
            <Trophy className="text-[#00FFFF]" size={28} />
            <h2 className="text-2xl font-bold">Top Levels</h2>
          </div>
          
          <div className="space-y-4">
            {data.levels?.length > 0 ? data.levels.map((user: any, index: number) => (
              <LeaderboardRow 
                key={index} 
                rank={index + 1} 
                username={user.username} 
                avatar={user.avatar} 
                value={`${user.level} Lvl`} 
                subValue={`${user.xp} XP`}
              />
            )) : (
              <p className="text-gray-400 text-center py-8">No data available yet.</p>
            )}
          </div>
        </div>

        {/* Economy Leaderboard */}
        <div className="glass-panel p-6 md:p-8 rounded-3xl">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/10">
            <Coins className="text-[#5865F2]" size={28} />
            <h2 className="text-2xl font-bold">Richest Users</h2>
          </div>
          
          <div className="space-y-4">
            {data.economy?.length > 0 ? data.economy.map((user: any, index: number) => (
              <LeaderboardRow 
                key={index} 
                rank={index + 1} 
                username={user.username} 
                avatar={user.avatar} 
                value={`${user.balance} $`} 
                subValue=""
              />
            )) : (
              <p className="text-gray-400 text-center py-8">No data available yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function LeaderboardRow({ rank, username, avatar, value, subValue }: { rank: number, username: string, avatar: string, value: string, subValue: string }) {
  // Styling for top 3
  let rankStyle = "bg-white/5 text-gray-400";
  if (rank === 1) rankStyle = "bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.2)]";
  if (rank === 2) rankStyle = "bg-gray-300/20 text-gray-300 border border-gray-300/30";
  if (rank === 3) rankStyle = "bg-amber-700/20 text-amber-500 border border-amber-700/30";

  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black ${rankStyle}`}>
          #{rank}
        </div>
        <div className="flex items-center gap-3">
          {avatar ? (
            <img src={avatar} alt={username} className="w-10 h-10 rounded-full bg-gray-800" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
              <User size={20} className="text-gray-400" />
            </div>
          )}
          <span className="font-semibold text-lg">{username}</span>
        </div>
      </div>
      <div className="text-right">
        <div className="font-bold text-lg text-white">{value}</div>
        {subValue && <div className="text-xs text-gray-400 font-medium">{subValue}</div>}
      </div>
    </div>
  );
}
