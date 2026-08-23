"use client";

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { LogOut } from "lucide-react";

export function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="glass-panel sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link href="/" className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <span className="text-brand text-3xl">X</span>yra
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300">
          <Link href="/" className="hover:text-white transition">Home</Link>
          <Link href="/leaderboard" className="hover:text-white transition">Leaderboard</Link>
          {session && (
            <Link href="/dashboard" className="hover:text-white text-brand transition">Dashboard</Link>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4">
        {status === "loading" ? (
          <div className="h-9 w-24 bg-white/10 animate-pulse rounded-lg"></div>
        ) : session ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <img 
                src={session.user?.image || ""} 
                alt="Profile" 
                className="w-9 h-9 rounded-full border border-white/20 shadow-md"
              />
              <span className="text-sm font-semibold hidden sm:block">{session.user?.name}</span>
            </div>
            <button 
              onClick={() => signOut()}
              className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <button 
            onClick={() => signIn("discord")}
            className="bg-[#5865F2] hover:bg-[#4752c4] text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-lg shadow-brand/20"
          >
            Login with Discord
          </button>
        )}
      </div>
    </nav>
  );
}
