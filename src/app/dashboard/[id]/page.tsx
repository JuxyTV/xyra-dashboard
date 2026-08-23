"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Save, Loader2, ArrowLeft, Globe, Shield, DoorOpen, Ticket, Star, MessageSquare, Mic, AlertCircle, ShoppingCart } from "lucide-react";
import Link from "next/link";

export default function GuildDashboardPage() {
  const { id } = useParams();
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("general");

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
        
        // Ensure nested objects exist to avoid undefined errors during editing
        if (!data.welcome) data.welcome = {};
        if (!data.automod) data.automod = {};
        if (!data.tickets) data.tickets = {};
        if (!data.voice_afk) data.voice_afk = {};
        
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
      
      if (!res.ok) {
         const text = await res.text();
         throw new Error(text);
      }
      alert("✅ Configuration enregistrée avec succès ! (Le bot prendra en compte ces changements instantanément)");
    } catch (err: any) {
      alert("❌ Erreur lors de la sauvegarde : " + err.message);
    }
    
    setSaving(false);
  };

  const updateConfig = (key: string, value: any) => {
    setConfig({ ...config, [key]: value });
  };

  const updateNested = (module: string, key: string, value: any) => {
    setConfig({ 
      ...config, 
      [module]: { 
        ...config[module], 
        [key]: value 
      } 
    });
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-32 text-brand">
      <Loader2 size={48} className="animate-spin mb-4" />
      <p className="text-gray-400">Synchronisation avec le bot en cours...</p>
    </div>
  );

  if (error) return (
    <div className="text-center py-20 text-red-500 glass-panel rounded-xl">
      <AlertCircle size={48} className="mx-auto mb-4" />
      <h2 className="text-2xl font-bold mb-2">Erreur de connexion</h2>
      <p className="max-w-xl mx-auto break-words">{error}</p>
      <Link href="/dashboard" className="text-brand hover:underline mt-6 inline-block">Retour aux serveurs</Link>
    </div>
  );

  const tabs = [
    { id: "general", name: "Général", icon: <Globe size={18} /> },
    { id: "welcome", name: "Accueil", icon: <DoorOpen size={18} /> },
    { id: "automod", name: "Auto-Mod", icon: <Shield size={18} /> },
    { id: "tickets", name: "Tickets", icon: <Ticket size={18} /> },
    { id: "supporter", name: "Supporter", icon: <Star size={18} /> },
    { id: "shop", name: "Boutique", icon: <ShoppingCart size={18} /> },
    { id: "voice", name: "Vocal AFK", icon: <Mic size={18} /> },
    { id: "logs", name: "Logs", icon: <MessageSquare size={18} /> },
  ];

  return (
    <div className="max-w-6xl mx-auto animate-fade-in-up">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/dashboard" className="text-gray-400 hover:text-white flex items-center gap-2 mb-4 transition w-fit">
            <ArrowLeft size={16} /> Retour aux Serveurs
          </Link>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            Tour de Contrôle
          </h1>
          <p className="text-gray-400 mt-1">Configure le comportement de Xyra en temps réel.</p>
        </div>
        
        <button 
          onClick={handleSave}
          disabled={saving}
          className="hidden md:flex items-center gap-2 bg-brand hover:bg-brand-hover text-white px-6 py-3 rounded-xl font-bold transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand/20"
        >
          {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
          {saving ? "Sauvegarde..." : "Sauvegarder"}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:w-64 flex-shrink-0 flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium whitespace-nowrap ${
                activeTab === tab.id 
                  ? "bg-brand/20 text-brand border border-brand/30" 
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-grow glass-panel p-6 md:p-8 rounded-2xl min-h-[500px]">
          <form onSubmit={handleSave} className="space-y-8">
            
            {/* TAB: GENERAL */}
            {activeTab === "general" && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-bold border-b border-white/10 pb-4 flex items-center gap-2"><Globe className="text-brand"/> Général & Langues</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Langue du Bot</label>
                    <select 
                      value={config?.language || "en"} 
                      onChange={(e) => updateConfig("language", e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition appearance-none"
                    >
                      <option value="en">🇬🇧 English (en)</option>
                      <option value="fr">🇫🇷 Français (fr)</option>
                      <option value="es">🇪🇸 Español (es)</option>
                      <option value="de">🇩🇪 Deutsch (de)</option>
                      <option value="it">🇮🇹 Italiano (it)</option>
                      <option value="pt">🇵🇹 Português (pt)</option>
                      <option value="ru">🇷🇺 Русский (ru)</option>
                      <option value="ja">🇯🇵 日本語 (ja)</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">La langue utilisée par le bot pour les messages et commandes.</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: WELCOME */}
            {activeTab === "welcome" && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-bold border-b border-white/10 pb-4 flex items-center gap-2"><DoorOpen className="text-brand"/> Message de Bienvenue</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">ID du Salon Bienvenue</label>
                    <input 
                      type="text" 
                      value={config?.welcome?.channel_id || ""} 
                      onChange={(e) => updateNested("welcome", "channel_id", e.target.value ? parseInt(e.target.value) : null)}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition font-mono"
                      placeholder="Ex: 1540202326663364728"
                    />
                    <p className="text-xs text-gray-500">Laisse vide pour désactiver le système.</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Image de fond (URL)</label>
                    <input 
                      type="text" 
                      value={config?.welcome?.background_url || ""} 
                      onChange={(e) => updateNested("welcome", "background_url", e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition"
                      placeholder="https://i.imgur.com/...png"
                    />
                    <p className="text-xs text-gray-500">Image de fond de la carte de bienvenue (optionnel).</p>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-300">Message personnalisé</label>
                    <textarea 
                      value={config?.welcome?.message || ""} 
                      onChange={(e) => updateNested("welcome", "message", e.target.value)}
                      rows={3}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition resize-none"
                      placeholder="Bienvenue {user} sur le serveur !"
                    />
                    <p className="text-xs text-gray-500">Variables dispo: `{user}`, `{server}`.</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: AUTOMOD */}
            {activeTab === "automod" && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-bold border-b border-white/10 pb-4 flex items-center gap-2"><Shield className="text-brand"/> Auto-Modération</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Seuil de Majuscules (%)</label>
                    <input 
                      type="number" 
                      value={config?.automod?.caps_threshold || 70} 
                      onChange={(e) => updateNested("automod", "caps_threshold", parseInt(e.target.value))}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition"
                    />
                    <p className="text-xs text-gray-500">Pourcentage de majuscules toléré par message.</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Longueur minimum (Majuscules)</label>
                    <input 
                      type="number" 
                      value={config?.automod?.caps_min_length || 8} 
                      onChange={(e) => updateNested("automod", "caps_min_length", parseInt(e.target.value))}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition"
                    />
                    <p className="text-xs text-gray-500">Le filtre majuscule s'active seulement au-dessus de cette longueur.</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Mentions maximales par message</label>
                    <input 
                      type="number" 
                      value={config?.automod?.max_mentions || 5} 
                      onChange={(e) => updateNested("automod", "max_mentions", parseInt(e.target.value))}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition"
                    />
                    <p className="text-xs text-gray-500">0 pour désactiver.</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: TICKETS */}
            {activeTab === "tickets" && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-bold border-b border-white/10 pb-4 flex items-center gap-2"><Ticket className="text-brand"/> Système de Tickets</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">ID de la Catégorie (Où créer les tickets)</label>
                    <input 
                      type="text" 
                      value={config?.tickets?.category_id || ""} 
                      onChange={(e) => updateNested("tickets", "category_id", e.target.value ? parseInt(e.target.value) : null)}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand font-mono transition"
                      placeholder="Ex: 111122223333444455"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">ID du Rôle Support</label>
                    <input 
                      type="text" 
                      value={config?.tickets?.support_role_id || ""} 
                      onChange={(e) => updateNested("tickets", "support_role_id", e.target.value ? parseInt(e.target.value) : null)}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand font-mono transition"
                      placeholder="Ex: 999988887777666655"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">ID du Salon Logs Tickets</label>
                    <input 
                      type="text" 
                      value={config?.tickets?.log_channel_id || ""} 
                      onChange={(e) => updateNested("tickets", "log_channel_id", e.target.value ? parseInt(e.target.value) : null)}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand font-mono transition"
                      placeholder="Ex: 123456789012345678"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB: SUPPORTER */}
            {activeTab === "supporter" && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-bold border-b border-white/10 pb-4 flex items-center gap-2"><Star className="text-brand"/> Programme Supporter</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Mot-clé requis dans le statut (Bio)</label>
                    <input 
                      type="text" 
                      value={config?.supporter_keyword || ""} 
                      onChange={(e) => updateConfig("supporter_keyword", e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand transition"
                      placeholder="Ex: discord.gg/monserveur"
                    />
                    <p className="text-xs text-gray-500">Si un membre a ce texte dans son statut personnalisé, il reçoit le rôle automatiquement.</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: SHOP */}
            {activeTab === "shop" && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-bold border-b border-white/10 pb-4 flex items-center gap-2"><ShoppingCart className="text-brand"/> Boutique du Serveur</h2>
                
                <div className="bg-brand/10 border border-brand/20 p-4 rounded-xl text-brand text-sm mb-6">
                  💡 <b>Nouveau :</b> Tu peux maintenant ajouter et gérer les articles de ta boutique directement depuis le web !
                </div>

                <div className="space-y-4">
                  {(config?.shop || []).map((item: any, index: number) => (
                    <div key={item.id} className="bg-black/30 border border-white/10 p-4 rounded-lg flex items-start gap-4">
                      <div className="flex-grow grid grid-cols-2 gap-4">
                        <input 
                          type="text" 
                          value={item.name} 
                          onChange={(e) => {
                            const newShop = [...config.shop];
                            newShop[index].name = e.target.value;
                            updateConfig("shop", newShop);
                          }}
                          className="bg-black/40 border border-white/10 rounded px-3 py-2 text-white w-full text-sm"
                          placeholder="Nom de l'article"
                        />
                        <input 
                          type="number" 
                          value={item.price} 
                          onChange={(e) => {
                            const newShop = [...config.shop];
                            newShop[index].price = parseInt(e.target.value);
                            updateConfig("shop", newShop);
                          }}
                          className="bg-black/40 border border-white/10 rounded px-3 py-2 text-white w-full text-sm"
                          placeholder="Prix (Coins)"
                        />
                        <input 
                          type="text" 
                          value={item.description} 
                          onChange={(e) => {
                            const newShop = [...config.shop];
                            newShop[index].description = e.target.value;
                            updateConfig("shop", newShop);
                          }}
                          className="bg-black/40 border border-white/10 rounded px-3 py-2 text-white w-full text-sm col-span-2"
                          placeholder="Description"
                        />
                      </div>
                      <button 
                        type="button"
                        onClick={() => {
                          const newShop = config.shop.filter((_: any, i: number) => i !== index);
                          updateConfig("shop", newShop);
                        }}
                        className="bg-red-500/20 text-red-400 p-2 rounded hover:bg-red-500/30 transition"
                      >
                        X
                      </button>
                    </div>
                  ))}

                  <button 
                    type="button"
                    onClick={() => {
                      const newShop = [...(config?.shop || []), { 
                        id: Math.random().toString(36).substring(7), 
                        name: "Nouvel Article", 
                        price: 100, 
                        stock: 999, 
                        description: "", 
                        roles: [] 
                      }];
                      updateConfig("shop", newShop);
                    }}
                    className="w-full border-2 border-dashed border-white/20 hover:border-brand hover:text-brand text-gray-400 py-3 rounded-xl transition font-medium"
                  >
                    + Ajouter un article
                  </button>
                </div>
              </div>
            )}

            {/* TAB: LOGS */}
            {activeTab === "logs" && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-bold border-b border-white/10 pb-4 flex items-center gap-2"><MessageSquare className="text-brand"/> Logs du Serveur</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">ID du Salon des Logs (Global)</label>
                    <input 
                      type="text" 
                      value={config?.log_channel_id || ""} 
                      onChange={(e) => updateConfig("log_channel_id", e.target.value ? parseInt(e.target.value) : null)}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand font-mono transition"
                      placeholder="Ex: 112233445566778899"
                    />
                    <p className="text-xs text-gray-500">Salon où le bot enverra les logs de modération, d'erreurs, etc.</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: VOICE */}
            {activeTab === "voice" && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-bold border-b border-white/10 pb-4 flex items-center gap-2"><Mic className="text-brand"/> Vocal AFK</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Délai d'inactivité avant déconnexion (Minutes)</label>
                    <input 
                      type="number" 
                      value={config?.voice_afk?.timeout_minutes || 15} 
                      onChange={(e) => updateNested("voice_afk", "timeout_minutes", parseInt(e.target.value))}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand transition"
                    />
                    <p className="text-xs text-gray-500">Durée avant qu'un membre muet ne soit déconnecté du vocal. (Minimum 1).</p>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Save Button */}
            <div className="md:hidden mt-8 pt-6 border-t border-white/10">
              <button 
                type="submit" 
                disabled={saving}
                className="w-full flex justify-center items-center gap-2 bg-brand hover:bg-brand-hover text-white px-6 py-4 rounded-xl font-bold transition disabled:opacity-50"
              >
                {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                {saving ? "Sauvegarde en cours..." : "Sauvegarder les modifications"}
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
}
