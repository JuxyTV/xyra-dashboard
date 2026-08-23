"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Save, Loader2, ArrowLeft, Globe, Shield, DoorOpen, Ticket, Star, MessageSquare, Mic, AlertCircle, ShoppingCart, Plus, Trash2, Edit } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "./locales";

// --- Components ---
const SelectChannel = ({ value, onChange, channels, t, className }: any) => (
  <select 
    value={value || ""} 
    onChange={(e) => onChange(e.target.value === "" ? null : e.target.value)}
    className={`bg-[#2b2d31] border border-[#1e1f22] text-gray-200 text-sm rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand ${className}`}
  >
    <option value="">{t("select_channel")}</option>
    {channels.map((c: any) => (
      <option key={c.id} value={c.id}># {c.name}</option>
    ))}
  </select>
);

const SelectRole = ({ value, onChange, roles, t, className }: any) => (
  <select 
    value={value || ""} 
    onChange={(e) => onChange(e.target.value === "" ? null : e.target.value)}
    className={`bg-[#2b2d31] border border-[#1e1f22] text-gray-200 text-sm rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand ${className}`}
  >
    <option value="">{t("select_role")}</option>
    {roles.map((r: any) => (
      <option key={r.id} value={r.id}>@{r.name}</option>
    ))}
  </select>
);

// --- Main Page ---
export default function GuildDashboardPage() {
  const { id } = useParams();
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("general");
  const [dashLang, setDashLang] = useState("fr");

  const t = useTranslation(dashLang);

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
        
        if (!data.welcome) data.welcome = {};
        if (!data.automod) data.automod = {};
        if (!data.tickets) data.tickets = {};
        if (!data.ticket_categories) data.ticket_categories = {};
        if (!data.voice_afk) data.voice_afk = {};
        if (!data.discord_roles) data.discord_roles = [];
        if (!data.discord_channels) data.discord_channels = [];
        
        setConfig(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    
    // Create payload and omit temporary discord lists
    const payload = { ...config };
    delete payload.discord_roles;
    delete payload.discord_channels;

    try {
      const res = await fetch(`/api/bot/guilds/${id}/config`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) throw new Error(await res.text());
      alert(t("success"));
    } catch (err: any) {
      alert(t("error") + " " + err.message);
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
      <p className="text-gray-400">Loading Discord data...</p>
    </div>
  );

  if (error) return (
    <div className="text-center py-20 text-red-500 glass-panel rounded-xl">
      <AlertCircle size={48} className="mx-auto mb-4" />
      <h2 className="text-2xl font-bold mb-2">Connection Error</h2>
      <p className="max-w-xl mx-auto break-words">{error}</p>
      <Link href="/dashboard" className="text-brand hover:underline mt-6 inline-block">Back</Link>
    </div>
  );

  const tabs = [
    { id: "general", name: t("tab_general"), icon: <Globe size={18} /> },
    { id: "welcome", name: t("tab_welcome"), icon: <DoorOpen size={18} /> },
    { id: "automod", name: t("tab_automod"), icon: <Shield size={18} /> },
    { id: "tickets", name: t("tab_tickets"), icon: <Ticket size={18} /> },
    { id: "supporter", name: t("tab_supporter"), icon: <Star size={18} /> },
    { id: "shop", name: t("tab_shop"), icon: <ShoppingCart size={18} /> },
    { id: "voice", name: t("tab_voice"), icon: <Mic size={18} /> },
    { id: "logs", name: t("tab_logs"), icon: <MessageSquare size={18} /> },
  ];

  return (
    <div className="max-w-[1400px] mx-auto animate-fade-in-up pb-20">
      
      {/* Top Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/dashboard" className="text-gray-400 hover:text-white flex items-center gap-2 mb-2 transition w-fit text-sm">
            <ArrowLeft size={16} /> {t("back")}
          </Link>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            {t("title")}
          </h1>
          <p className="text-gray-400 mt-1">{t("desc")}</p>
        </div>
        
        <div className="flex items-center gap-4">
          <select 
            value={dashLang} 
            onChange={e => setDashLang(e.target.value)}
            className="bg-[#2b2d31] border border-[#1e1f22] text-white text-sm rounded-lg px-3 py-2 cursor-pointer focus:outline-none"
          >
            <option value="fr">🇫🇷 FR</option>
            <option value="en">🇬🇧 EN</option>
          </select>

          <button 
            onClick={() => handleSave()}
            disabled={saving}
            className="hidden md:flex items-center gap-2 bg-brand hover:bg-brand-hover text-white px-6 py-2.5 rounded-lg font-bold transition disabled:opacity-50"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {saving ? t("saving") : t("save")}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:w-64 flex-shrink-0 flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium whitespace-nowrap text-left ${
                activeTab === tab.id 
                  ? "bg-brand/10 text-brand" 
                  : "text-gray-400 hover:bg-[#2b2d31] hover:text-gray-200"
              }`}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </div>

        {/* Content Area - Professional Dark Theme */}
        <div className="flex-grow bg-[#1e1f22] rounded-xl min-h-[600px] border border-[#2b2d31] overflow-hidden">
          
          {/* TAB: GENERAL */}
          {activeTab === "general" && (
            <div className="p-8 animate-fade-in">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-b border-[#2b2d31] pb-4">
                <Globe className="text-brand"/> {t("tab_general")}
              </h2>
              
              <div className="max-w-2xl bg-[#2b2d31] rounded-lg p-6 border border-white/5">
                <label className="block text-sm font-semibold text-gray-300 mb-2">Language / Langue</label>
                <select 
                  value={config?.language || "en"} 
                  onChange={(e) => updateConfig("language", e.target.value)}
                  className="w-full bg-[#1e1f22] border border-white/5 rounded-md px-4 py-3 text-white focus:outline-none focus:border-brand"
                >
                  <option value="en">🇬🇧 English</option>
                  <option value="fr">🇫🇷 Français</option>
                  <option value="es">🇪🇸 Español</option>
                  <option value="de">🇩🇪 Deutsch</option>
                  <option value="it">🇮🇹 Italiano</option>
                  <option value="pt">🇵🇹 Português</option>
                  <option value="ru">🇷🇺 Русский</option>
                  <option value="ja">🇯🇵 日本語</option>
                </select>
                <p className="text-xs text-gray-500 mt-2">The bot's response language in Discord.</p>
              </div>
            </div>
          )}

          {/* TAB: WELCOME */}
          {activeTab === "welcome" && (
            <div className="p-8 animate-fade-in flex flex-col xl:flex-row gap-8">
              <div className="flex-grow space-y-6">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-b border-[#2b2d31] pb-4">
                  <DoorOpen className="text-brand"/> {t("welcome_title")}
                </h2>
                
                <div className="bg-[#2b2d31] rounded-lg p-6 border border-white/5 space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">{t("welcome_channel")}</label>
                    <SelectChannel 
                      value={config?.welcome?.channel_id} 
                      onChange={(v: any) => updateNested("welcome", "channel_id", v ? parseInt(v) : null)} 
                      channels={config?.discord_channels} t={t} className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">{t("welcome_autorole")}</label>
                    <SelectRole 
                      value={config?.welcome?.auto_roles?.[0]} 
                      onChange={(v: any) => updateNested("welcome", "auto_roles", v ? [parseInt(v)] : [])} 
                      roles={config?.discord_roles} t={t} className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">{t("welcome_msg")}</label>
                    <textarea 
                      value={config?.welcome?.message || ""} 
                      onChange={(e) => updateNested("welcome", "message", e.target.value)}
                      rows={4}
                      className="w-full bg-[#1e1f22] border border-white/5 rounded-md px-4 py-3 text-white focus:outline-none focus:border-brand resize-none"
                    />
                    <p className="text-xs text-gray-500 mt-2">{t("welcome_vars")}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">{t("welcome_bg")}</label>
                    <input 
                      type="text" 
                      value={config?.welcome?.background_url || ""} 
                      onChange={(e) => updateNested("welcome", "background_url", e.target.value)}
                      className="w-full bg-[#1e1f22] border border-white/5 rounded-md px-4 py-3 text-white focus:outline-none focus:border-brand"
                      placeholder="https://i.imgur.com/..."
                    />
                  </div>
                </div>
              </div>
              
              {/* Discord Live Preview */}
              <div className="xl:w-[450px] flex-shrink-0">
                <h2 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-wider">{t("welcome_preview")}</h2>
                <div className="bg-[#313338] rounded-lg p-4 font-sans border border-[#1e1f22] shadow-xl">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-brand flex-shrink-0"></div>
                    <div>
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="font-medium text-white">Xyra Bot</span>
                        <span className="bg-[#5865F2] text-[10px] px-1 rounded text-white font-bold">BOT</span>
                        <span className="text-xs text-[#949ba4]">Today at 12:00 PM</span>
                      </div>
                      <div className="text-[#dbdee1] text-[15px] whitespace-pre-wrap leading-relaxed">
                        {(config?.welcome?.message || "Welcome to the server!").replace("{user}", "@JohnDoe").replace("{server}", "My Server")}
                      </div>
                      <div className="mt-3 rounded-lg overflow-hidden border border-[#1e1f22] bg-[#2b2d31] w-full aspect-[2/1] relative flex items-center justify-center">
                        {config?.welcome?.background_url ? (
                          <img src={config.welcome.background_url} alt="bg" className="w-full h-full object-cover opacity-50" />
                        ) : (
                          <span className="text-gray-500">Welcome Card Image</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: TICKETS */}
          {activeTab === "tickets" && (
            <div className="p-8 animate-fade-in space-y-8">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-b border-[#2b2d31] pb-4">
                <Ticket className="text-brand"/> {t("tickets_title")}
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-[#2b2d31] rounded-lg p-6 border border-white/5">
                  <label className="block text-sm font-semibold text-gray-300 mb-2">{t("tickets_panel")}</label>
                  <SelectChannel 
                    value={config?.tickets_panel_channel} 
                    onChange={(v: any) => updateConfig("tickets_panel_channel", v ? parseInt(v) : null)} 
                    channels={config?.discord_channels} t={t} className="w-full mb-2"
                  />
                  <p className="text-xs text-gray-500">Select the channel to send the Ticket Panel to.</p>
                </div>
                
                <div className="bg-[#2b2d31] rounded-lg p-6 border border-white/5">
                  <label className="block text-sm font-semibold text-gray-300 mb-2">{t("tickets_logs")}</label>
                  <SelectChannel 
                    value={config?.tickets_logs_channel} 
                    onChange={(v: any) => updateConfig("tickets_logs_channel", v ? parseInt(v) : null)} 
                    channels={config?.discord_channels} t={t} className="w-full mb-2"
                  />
                  <p className="text-xs text-gray-500">Transcripts will be saved here.</p>
                </div>
              </div>

              {/* Categories */}
              <div>
                <h3 className="text-lg font-bold text-gray-200 mb-4">{t("tickets_category")}</h3>
                
                <div className="space-y-4">
                  {Object.entries(config?.ticket_categories || {}).map(([catId, cat]: [string, any]) => (
                    <div key={catId} className="bg-[#2b2d31] border border-[#1e1f22] rounded-lg overflow-hidden">
                      <div className="bg-[#1e1f22]/50 p-4 border-b border-[#1e1f22] flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{cat.emoji || "🎫"}</span>
                          <input 
                            type="text"
                            value={cat.name}
                            onChange={e => {
                              const newCats = {...config.ticket_categories};
                              newCats[catId].name = e.target.value;
                              updateConfig("ticket_categories", newCats);
                            }}
                            className="bg-transparent border-none text-white font-bold focus:outline-none"
                          />
                        </div>
                        <button 
                          onClick={() => {
                            const newCats = {...config.ticket_categories};
                            delete newCats[catId];
                            updateConfig("ticket_categories", newCats);
                          }}
                          className="text-red-400 hover:text-red-300 p-2"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      
                      <div className="p-4 grid md:grid-cols-2 gap-4">
                         <div>
                           <label className="block text-xs text-gray-400 mb-1">{t("desc_label")}</label>
                           <input type="text" value={cat.description || ""} onChange={e => {
                              const newCats = {...config.ticket_categories};
                              newCats[catId].description = e.target.value;
                              updateConfig("ticket_categories", newCats);
                           }} className="w-full bg-[#1e1f22] border border-white/5 rounded px-3 py-2 text-white text-sm" />
                         </div>
                         <div>
                           <label className="block text-xs text-gray-400 mb-1">Support Role (Staff)</label>
                           <SelectRole 
                              value={cat.staff_roles?.[0]} 
                              onChange={(v: any) => {
                                const newCats = {...config.ticket_categories};
                                newCats[catId].staff_roles = v ? [parseInt(v)] : [];
                                updateConfig("ticket_categories", newCats);
                              }} 
                              roles={config?.discord_roles} t={t} className="w-full"
                            />
                         </div>
                         <div className="md:col-span-2 bg-[#1e1f22] p-3 rounded-lg border border-white/5">
                           <label className="block text-xs text-gray-400 mb-2 font-bold uppercase">Form Questions (Modals)</label>
                           {(cat.questions || []).map((q: any, i: number) => (
                             <div key={i} className="flex gap-2 mb-2">
                               <input type="text" placeholder="Question Label (e.g. In-game name)" value={q.label} onChange={e => {
                                 const newCats = {...config.ticket_categories};
                                 newCats[catId].questions[i].label = e.target.value;
                                 updateConfig("ticket_categories", newCats);
                               }} className="flex-grow bg-[#2b2d31] border border-[#1e1f22] rounded px-3 py-1.5 text-white text-sm" />
                               
                               <button onClick={() => {
                                  const newCats = {...config.ticket_categories};
                                  newCats[catId].questions.splice(i, 1);
                                  updateConfig("ticket_categories", newCats);
                               }} className="bg-red-500/10 text-red-400 px-3 rounded text-sm hover:bg-red-500/20">X</button>
                             </div>
                           ))}
                           <button onClick={() => {
                             const newCats = {...config.ticket_categories};
                             if(!newCats[catId].questions) newCats[catId].questions = [];
                             newCats[catId].questions.push({ label: "New Question", required: true });
                             updateConfig("ticket_categories", newCats);
                           }} className="text-brand text-sm mt-2 font-medium">+ Add Question</button>
                         </div>
                      </div>
                    </div>
                  ))}

                  <button 
                    onClick={() => {
                      const newId = "cat_" + Date.now();
                      updateConfig("ticket_categories", {
                        ...config.ticket_categories,
                        [newId]: { name: "New Category", description: "Desc", emoji: "🎫", staff_roles: [], questions: [] }
                      });
                    }}
                    className="w-full py-4 border-2 border-dashed border-[#2b2d31] rounded-lg text-gray-400 hover:text-brand hover:border-brand/50 transition font-medium"
                  >
                    {t("tickets_add_cat")}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: SHOP */}
          {activeTab === "shop" && (
            <div className="p-8 animate-fade-in">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-b border-[#2b2d31] pb-4">
                <ShoppingCart className="text-brand"/> {t("tab_shop")}
              </h2>
              
              <div className="space-y-4">
                {(config?.shop || []).map((item: any, index: number) => (
                  <div key={item.id} className="bg-[#2b2d31] border border-white/5 p-4 rounded-lg flex items-start gap-4">
                    <div className="flex-grow grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="col-span-2">
                        <label className="block text-xs text-gray-400 mb-1">Item Name</label>
                        <input type="text" value={item.name} onChange={(e) => {
                          const newShop = [...config.shop];
                          newShop[index].name = e.target.value;
                          updateConfig("shop", newShop);
                        }} className="w-full bg-[#1e1f22] border border-white/5 rounded px-3 py-2 text-white text-sm" />
                      </div>
                      
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Price</label>
                        <input type="number" value={item.price} onChange={(e) => {
                          const newShop = [...config.shop];
                          newShop[index].price = parseInt(e.target.value) || 0;
                          updateConfig("shop", newShop);
                        }} className="w-full bg-[#1e1f22] border border-white/5 rounded px-3 py-2 text-white text-sm" />
                      </div>

                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Stock</label>
                        <input type="number" value={item.stock} onChange={(e) => {
                          const newShop = [...config.shop];
                          newShop[index].stock = parseInt(e.target.value) || 0;
                          updateConfig("shop", newShop);
                        }} className="w-full bg-[#1e1f22] border border-white/5 rounded px-3 py-2 text-white text-sm" />
                      </div>

                      <div className="col-span-2">
                        <label className="block text-xs text-gray-400 mb-1">Description</label>
                        <input type="text" value={item.description} onChange={(e) => {
                          const newShop = [...config.shop];
                          newShop[index].description = e.target.value;
                          updateConfig("shop", newShop);
                        }} className="w-full bg-[#1e1f22] border border-white/5 rounded px-3 py-2 text-white text-sm" />
                      </div>

                      <div className="col-span-2">
                        <label className="block text-xs text-gray-400 mb-1">Role Given (Optional)</label>
                        <SelectRole 
                          value={item.roles?.[0]} 
                          onChange={(v: any) => {
                            const newShop = [...config.shop];
                            newShop[index].roles = v ? [parseInt(v)] : [];
                            updateConfig("shop", newShop);
                          }} 
                          roles={config?.discord_roles} t={t} className="w-full"
                        />
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        const newShop = config.shop.filter((_: any, i: number) => i !== index);
                        updateConfig("shop", newShop);
                      }}
                      className="bg-red-500/10 text-red-400 p-2 rounded hover:bg-red-500/20 transition mt-6"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}

                <button 
                  type="button"
                  onClick={() => {
                    const newShop = [...(config?.shop || []), { 
                      id: Math.random().toString(36).substring(7), 
                      name: "New Item", 
                      price: 100, 
                      stock: 999, 
                      description: "", 
                      roles: [] 
                    }];
                    updateConfig("shop", newShop);
                  }}
                  className="w-full py-4 border-2 border-dashed border-[#2b2d31] rounded-lg text-gray-400 hover:text-brand hover:border-brand/50 transition font-medium"
                >
                  + Add Item
                </button>
              </div>
            </div>
          )}
          
          {/* Default Fallback for other tabs (Automod, Supporter, Voice, Logs) */}
          {(activeTab === "automod" || activeTab === "supporter" || activeTab === "voice" || activeTab === "logs") && (
            <div className="p-8 animate-fade-in flex flex-col items-center justify-center min-h-[400px] text-gray-400 text-center">
              <Shield size={48} className="mb-4 text-[#2b2d31]" />
              <p>Module active. Configuration form is currently inheriting defaults.</p>
              <p className="text-sm">More advanced UI coming soon for this specific tab.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
