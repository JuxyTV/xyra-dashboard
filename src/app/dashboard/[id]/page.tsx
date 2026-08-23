"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Save, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function GuildDashboardPage() {
  const { id } = useParams();
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/bot/guilds/${id}/config`)
      .then(async res => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`API Error (${res.status}): ${text}`);
        }
        return res.json();
      })
      .then(data => {
        if (data.error) throw new Error("Bot Error: " + data.error);
        setConfig(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const res = await fetch(`/api/bot/guilds/${id}/config`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config)
      });
      
      if (!res.ok) throw new Error("Failed to save.");
      
      // Flash success visual feedback here if wanted
    } catch (err: any) {
      alert("Error saving: " + err.message);
    }
    
    setSaving(false);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-32 text-brand">
      <Loader2 size={48} className="animate-spin mb-4" />
      <p className="text-gray-400">Loading Server Configuration...</p>
    </div>
  );

  if (error) return (
    <div className="text-center py-20 text-red-500 glass-panel rounded-xl">
      <h2 className="text-2xl font-bold mb-2">Error</h2>
      <p>{error}</p>
      <Link href="/dashboard" className="text-brand hover:underline mt-4 inline-block">Return to Dashboard</Link>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/dashboard" className="text-gray-400 hover:text-white flex items-center gap-2 mb-4 transition">
            <ArrowLeft size={16} /> Back to Servers
          </Link>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            Server Configuration
          </h1>
          <p className="text-gray-400 mt-1">Manage Xyra settings for your server in real-time.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="glass-panel p-8 rounded-xl space-y-6">
          <h2 className="text-xl font-bold text-white border-b border-white/10 pb-4">General Settings</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Command Prefix</label>
              <input 
                type="text" 
                value={config?.prefix || "?"} 
                onChange={(e) => setConfig({ ...config, prefix: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition"
                placeholder="?"
              />
              <p className="text-xs text-gray-500">The symbol used before bot commands.</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Language</label>
              <select 
                value={config?.lang || "fr"} 
                onChange={(e) => setConfig({ ...config, lang: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition appearance-none"
              >
                <option value="en">English (en)</option>
                <option value="fr">Français (fr)</option>
              </select>
              <p className="text-xs text-gray-500">The language the bot responds in.</p>
            </div>
          </div>
        </div>

        <div className="glass-panel p-8 rounded-xl space-y-6">
          <h2 className="text-xl font-bold text-white border-b border-white/10 pb-4">Welcome System</h2>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Welcome Channel ID</label>
              <input 
                type="text" 
                value={config?.welcome_channel || ""} 
                onChange={(e) => setConfig({ ...config, welcome_channel: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition font-mono"
                placeholder="e.g. 1540202326663364728"
              />
              <p className="text-xs text-gray-500">Leave blank to disable welcome messages.</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Auto-Role ID</label>
              <input 
                type="text" 
                value={config?.autorole || ""} 
                onChange={(e) => setConfig({ ...config, autorole: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition font-mono"
                placeholder="e.g. 1540202326663364729"
              />
              <p className="text-xs text-gray-500">Automatically assign this role to new members.</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            type="submit" 
            disabled={saving}
            className="flex items-center gap-2 bg-brand hover:bg-brand-hover text-white px-6 py-3 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand/20"
          >
            {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
            {saving ? "Saving..." : "Save Configuration"}
          </button>
        </div>
      </form>
    </div>
  );
}
