import Link from "next/link";
import { Bot, Shield, Zap, Globe, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center space-y-24 py-12">
      {/* Hero Section */}
      <section className="text-center space-y-8 max-w-4xl animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-sm font-medium text-brand mb-4">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-brand"></span>
          </span>
          Xyra V1 is now live!
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
          The Only <span className="gradient-text">Discord Bot</span><br />
          You Will Ever Need.
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Level up your community with premium aesthetics, advanced auto-moderation, comprehensive economy, and multilingual support out of the box.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button className="bg-[#5865F2] hover:bg-[#4752c4] text-white px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 flex items-center gap-2 shadow-[0_0_20px_rgba(88,101,242,0.4)]">
            Invite Xyra <ArrowRight size={20} />
          </button>
          <Link href="/leaderboard" className="glass-panel hover:bg-white/10 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all">
            View Leaderboards
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="w-full">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need</h2>
          <p className="text-gray-400">Carefully crafted features to manage and engage your server.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard 
            icon={<Shield className="text-[#00FFFF]" size={32} />}
            title="Auto-Moderation"
            desc="Keep your server safe with advanced anti-spam, anti-link, and caps limits."
          />
          <FeatureCard 
            icon={<Zap className="text-[#5865F2]" size={32} />}
            title="Economy & Levels"
            desc="Stunning glassmorphism cards for ranks and economy balances."
          />
          <FeatureCard 
            icon={<Globe className="text-[#00FFFF]" size={32} />}
            title="Multilingual"
            desc="Supports over 9 languages natively. Let your users choose their preference."
          />
          <FeatureCard 
            icon={<Bot className="text-[#5865F2]" size={32} />}
            title="Voice & Tickets"
            desc="Join-to-Create voice channels and a powerful ticket panel system."
          />
        </div>
      </section>

      {/* Stats Section (Mocked for now, will connect to API) */}
      <section className="w-full glass-panel rounded-3xl p-12 text-center">
        <h2 className="text-3xl font-bold mb-10">Trusted by Communities</h2>
        <div className="flex flex-wrap justify-center gap-12 md:gap-24">
          <StatItem value="150+" label="Servers" />
          <StatItem value="50,000+" label="Users" />
          <StatItem value="99.9%" label="Uptime" />
          <StatItem value="14ms" label="Latency" />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="glass-panel p-6 rounded-2xl hover:-translate-y-2 transition-transform duration-300">
      <div className="mb-4 bg-white/5 w-16 h-16 rounded-xl flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function StatItem({ value, label }: { value: string, label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-4xl md:text-5xl font-black gradient-text mb-2">{value}</span>
      <span className="text-gray-400 uppercase tracking-widest text-sm font-semibold">{label}</span>
    </div>
  );
}
