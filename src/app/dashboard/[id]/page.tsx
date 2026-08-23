"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { Save, Loader2, ArrowLeft, Globe, Shield, DoorOpen, Ticket, Star, MessageSquare, Mic, AlertCircle, ShoppingCart, Trash2, Search, X, Check, SearchIcon, Plus } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "./locales";

// --- Components ---

// Searchable Combobox for Discord Channels & Roles
const SearchableDropdown = ({ options, value, onChange, placeholder, isRole = false }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const flatOptions = options.flatMap((g: any) => g.items || [g]);
  const selected = flatOptions.find((o: any) => o.id === value);

  const filteredOptions = search === "" ? options : options.map((group: any) => {
    if (group.items) {
      return { ...group, items: group.items.filter((i: any) => i.name.toLowerCase().includes(search.toLowerCase())) };
    }
    return group.name.toLowerCase().includes(search.toLowerCase()) ? group : null;
  }).filter((g: any) => g && (!g.items || g.items.length > 0));

  return (
    <div className="relative w-full" ref={ref}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[#1e1f22] border border-[#313338] hover:border-[#5865F2] rounded-md px-4 py-2.5 text-gray-200 text-sm cursor-pointer flex items-center justify-between transition-colors"
      >
        <div className="flex items-center gap-2 truncate">
          {selected ? (
            <>
              {isRole && <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: selected.color !== "#000000" ? selected.color : "#99aab5" }} />}
              <span className={isRole ? "font-medium" : ""}>{isRole ? `@${selected.name}` : `# ${selected.name}`}</span>
            </>
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
        </div>
        <SearchIcon size={14} className="text-gray-500" />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-[#2b2d31] border border-[#1e1f22] rounded-md shadow-2xl max-h-60 overflow-y-auto animate-fade-in">
          <div className="p-2 sticky top-0 bg-[#2b2d31] border-b border-[#1e1f22] z-10">
            <input
              autoFocus
              type="text"
              className="w-full bg-[#1e1f22] text-sm text-gray-200 px-3 py-2 rounded focus:outline-none"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="p-2 space-y-1">
            <div 
              onClick={() => { onChange(null); setIsOpen(false); }}
              className={`px-3 py-2 rounded hover:bg-red-500/10 hover:text-red-400 text-sm cursor-pointer text-gray-400 transition-colors`}
            >
              Aucun / Désactiver
            </div>

            {filteredOptions.map((group: any, i: number) => (
              <div key={i}>
                {group.items ? (
                  // Category Group
                  <div className="mb-2">
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider px-3 py-1 mt-2">
                      {group.category}
                    </div>
                    {group.items.map((item: any) => (
                      <div 
                        key={item.id}
                        onClick={() => { onChange(item.id); setIsOpen(false); }}
                        className={`px-3 py-2 rounded flex items-center gap-2 text-sm cursor-pointer transition-colors ${value === item.id ? 'bg-[#5865F2] text-white' : 'hover:bg-[#1e1f22] text-gray-300'}`}
                      >
                        <span className="text-gray-500">#</span> {item.name}
                      </div>
                    ))}
                  </div>
                ) : (
                  // Flat Role Item
                  <div 
                    key={group.id}
                    onClick={() => { onChange(group.id); setIsOpen(false); }}
                    className={`px-3 py-2 rounded flex items-center gap-2 text-sm cursor-pointer transition-colors ${value === group.id ? 'bg-[#5865F2] text-white' : 'hover:bg-[#1e1f22] text-gray-300'}`}
                  >
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: group.color !== "#000000" ? group.color : "#99aab5" }} />
                    <span className="font-medium">@{group.name}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Modal Component
const Modal = ({ isOpen, onClose, title, children, onSave }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#313338] border border-[#1e1f22] rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-up">
        <div className="flex items-center justify-between p-6 border-b border-[#1e1f22]">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition"><X size={24} /></button>
        </div>
        <div className="p-6 overflow-y-auto flex-grow custom-scrollbar">
          {children}
        </div>
        <div className="p-6 bg-[#2b2d31] border-t border-[#1e1f22] flex justify-end gap-4">
          <button onClick={onClose} className="px-5 py-2 rounded text-white hover:underline">Annuler</button>
          <button onClick={onSave} className="bg-[#5865F2] hover:bg-[#4752C4] text-white px-8 py-2 rounded font-medium transition">Enregistrer</button>
        </div>
      </div>
    </div>
  );
};


// --- Main Page ---
export default function GuildDashboardPage() {
  const { id } = useParams();
  const [config, setConfig] = useState<any>(null);
  const [originalConfig, setOriginalConfig] = useState<any>(null);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [activeTab, setActiveTab] = useState("general");
  const [dashLang, setDashLang] = useState("fr");
  const t = useTranslation(dashLang);

  // Modals state
  const [editingTicketCat, setEditingTicketCat] = useState<any>(null);
  const [editingShopItem, setEditingShopItem] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/bot/guilds/${id}/config`)
      .then(async res => {
        if (!res.ok) throw new Error(`API Error (${res.status}): ${await res.text()}`);
        return res.json();
      })
      .then(data => {
        if (data.error) throw new Error("Bot Error: " + data.error);
        
        if (!data.welcome) data.welcome = {};
        if (!data.automod) data.automod = {};
        if (!data.tickets) data.tickets = {};
        if (!data.ticket_categories) data.ticket_categories = {};
        if (!data.voice_afk) data.voice_afk = {};
        if (!data.shop) data.shop = [];
        if (!data.discord_roles) data.discord_roles = [];
        if (!data.discord_channels) data.discord_channels = [];
        
        setConfig(data);
        setOriginalConfig(JSON.stringify(data)); // For dirty checking
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const hasUnsavedChanges = originalConfig && JSON.stringify(config) !== originalConfig;

  const handleSave = async () => {
    setSaving(true);
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
      setOriginalConfig(JSON.stringify(config));
      // Toast notification would go here in a real app, keeping it alert for simplicity
    } catch (err: any) {
      alert(t("error") + " " + err.message);
    }
    setSaving(false);
  };

  const updateConfig = (key: string, value: any) => {
    setConfig({ ...config, [key]: value });
  };
  const updateNested = (module: string, key: string, value: any) => {
    setConfig({ ...config, [module]: { ...config[module], [key]: value } });
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-40 text-[#5865F2]">
      <Loader2 size={48} className="animate-spin mb-4" />
      <p className="text-gray-400 font-medium">Chargement de la configuration Discord...</p>
    </div>
  );

  if (error) return (
    <div className="text-center py-20 text-red-400 bg-[#2b2d31] rounded-xl border border-red-500/20 shadow-2xl max-w-2xl mx-auto mt-20">
      <AlertCircle size={64} className="mx-auto mb-6 opacity-80" />
      <h2 className="text-2xl font-bold mb-2 text-white">Erreur de Connexion API</h2>
      <p className="max-w-xl mx-auto break-words px-8">{error}</p>
      <Link href="/dashboard" className="text-[#5865F2] hover:underline mt-8 inline-block font-medium">Retour aux serveurs</Link>
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

  // Group channels by category for the SearchableDropdown
  const groupedChannels = config.discord_channels.reduce((acc: any, c: any) => {
    const cat = c.category || "Sans Catégorie";
    let group = acc.find((g: any) => g.category === cat);
    if (!group) { group = { category: cat, items: [] }; acc.push(group); }
    group.items.push(c);
    return acc;
  }, []);

  return (
    <div className="max-w-[1400px] mx-auto animate-fade-in-up pb-32">
      
      {/* Top Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/dashboard" className="text-gray-400 hover:text-white flex items-center gap-2 mb-2 transition w-fit text-sm font-medium">
            <ArrowLeft size={16} /> {t("back")}
          </Link>
          <h1 className="text-4xl font-extrabold text-white flex items-center gap-3 tracking-tight">
            {t("title")}
          </h1>
          <p className="text-gray-400 mt-2 font-medium">{t("desc")}</p>
        </div>
        
        <div className="flex items-center gap-4">
          <select 
            value={dashLang} 
            onChange={e => setDashLang(e.target.value)}
            className="bg-[#1e1f22] border border-[#313338] text-white text-sm rounded-lg px-4 py-2.5 cursor-pointer focus:outline-none hover:border-[#5865F2] transition-colors"
          >
            <option value="fr">🇫🇷 FR</option>
            <option value="en">🇬🇧 EN</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:w-64 flex-shrink-0 flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide">
          <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 ml-2 hidden lg:block">MENU PRINCIPAL</div>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium whitespace-nowrap text-left ${
                activeTab === tab.id 
                  ? "bg-[#5865F2] text-white shadow-lg shadow-[#5865F2]/20" 
                  : "text-gray-400 hover:bg-[#2b2d31] hover:text-gray-200"
              }`}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </div>

        {/* Content Area - Professional Dark Theme */}
        <div className="flex-grow bg-[#313338] rounded-2xl min-h-[600px] border border-[#1e1f22] overflow-hidden shadow-2xl">
          
          {/* TAB: GENERAL */}
          {activeTab === "general" && (
            <div className="p-8 lg:p-10 animate-fade-in">
              <h2 className="text-2xl font-bold text-white mb-8 border-b border-[#1e1f22] pb-6">
                {t("tab_general")}
              </h2>
              
              <div className="max-w-2xl bg-[#2b2d31] rounded-xl p-8 border border-[#1e1f22]">
                <label className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-wide">Langue du Bot</label>
                <select 
                  value={config?.language || "en"} 
                  onChange={(e) => updateConfig("language", e.target.value)}
                  className="w-full bg-[#1e1f22] border border-[#313338] hover:border-[#5865F2] rounded-lg px-4 py-3 text-white focus:outline-none transition-colors"
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
                <p className="text-sm text-gray-400 mt-3">Cette langue sera utilisée par Xyra pour répondre aux commandes Slash sur ton serveur Discord.</p>
              </div>
            </div>
          )}

          {/* TAB: WELCOME */}
          {activeTab === "welcome" && (
            <div className="p-8 lg:p-10 animate-fade-in flex flex-col xl:flex-row gap-10">
              <div className="flex-grow space-y-8">
                <h2 className="text-2xl font-bold text-white mb-2">{t("welcome_title")}</h2>
                <p className="text-gray-400 text-sm mb-8">Configure les messages d'arrivée et les rôles automatiques.</p>
                
                <div className="bg-[#2b2d31] rounded-xl p-8 border border-[#1e1f22] space-y-8">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t("welcome_channel")}</label>
                    <SearchableDropdown 
                      value={config?.welcome?.channel_id} 
                      onChange={(v: string|null) => updateNested("welcome", "channel_id", v)} 
                      options={groupedChannels} t={t} placeholder={t("select_channel")}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t("welcome_autorole")}</label>
                    <SearchableDropdown 
                      value={config?.welcome?.auto_roles?.[0]} 
                      onChange={(v: string|null) => updateNested("welcome", "auto_roles", v ? [v] : [])} 
                      options={config?.discord_roles} isRole t={t} placeholder={t("select_role")}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t("welcome_msg")}</label>
                    <textarea 
                      value={config?.welcome?.message || ""} 
                      onChange={(e) => updateNested("welcome", "message", e.target.value)}
                      rows={5}
                      className="w-full bg-[#1e1f22] border border-[#313338] hover:border-[#5865F2] rounded-lg px-4 py-3 text-white focus:outline-none transition-colors resize-none"
                    />
                    <p className="text-xs text-[#5865F2] mt-2 font-medium bg-[#5865F2]/10 inline-block px-2 py-1 rounded">{t("welcome_vars")}</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t("welcome_bg")}</label>
                    <input 
                      type="text" 
                      value={config?.welcome?.background_url || ""} 
                      onChange={(e) => updateNested("welcome", "background_url", e.target.value)}
                      className="w-full bg-[#1e1f22] border border-[#313338] hover:border-[#5865F2] rounded-lg px-4 py-3 text-white focus:outline-none transition-colors"
                      placeholder="https://i.imgur.com/..."
                    />
                  </div>
                </div>
              </div>
              
              {/* Discord Live Preview */}
              <div className="xl:w-[450px] flex-shrink-0">
                <div className="sticky top-8">
                  <h2 className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-wider">{t("welcome_preview")}</h2>
                  <div className="bg-[#313338] rounded-xl p-5 font-sans border border-[#1e1f22] shadow-2xl">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-brand flex-shrink-0 mt-1"></div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="font-medium text-white hover:underline cursor-pointer">Xyra Bot</span>
                          <span className="bg-[#5865F2] text-[10px] px-1.5 py-0.5 rounded text-white font-bold flex items-center gap-1">
                            <Check size={10} /> BOT
                          </span>
                          <span className="text-xs text-[#949ba4]">Aujourd'hui à 12:00</span>
                        </div>
                        <div className="text-[#dbdee1] text-[15px] whitespace-pre-wrap leading-relaxed break-words">
                          {(config?.welcome?.message || "Welcome to the server!").replace("{user}", "@NouveauMembre").replace("{server}", "Ton Serveur Discord")}
                        </div>
                        <div className="mt-4 rounded-xl overflow-hidden border border-[#1e1f22] bg-[#2b2d31] w-full max-w-[400px] aspect-[2/1] relative flex items-center justify-center group">
                          {config?.welcome?.background_url ? (
                            <img src={config.welcome.background_url} alt="bg" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-gray-500 font-medium text-sm">Welcome Card Image</span>
                          )}
                          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                            <span className="text-2xl font-bold">WELCOME</span>
                            <span className="text-sm">@NouveauMembre</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: TICKETS */}
          {activeTab === "tickets" && (
            <div className="p-8 lg:p-10 animate-fade-in space-y-8">
              <h2 className="text-2xl font-bold text-white mb-8 border-b border-[#1e1f22] pb-6">
                {t("tickets_title")}
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-[#2b2d31] rounded-xl p-8 border border-[#1e1f22]">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t("tickets_panel")}</label>
                  <SearchableDropdown 
                    value={config?.tickets_panel_channel} 
                    onChange={(v: string|null) => updateConfig("tickets_panel_channel", v)} 
                    options={groupedChannels} t={t} placeholder={t("select_channel")}
                  />
                  <p className="text-xs text-gray-500 mt-3">Salon où le bouton "Créer un ticket" sera envoyé.</p>
                </div>
                
                <div className="bg-[#2b2d31] rounded-xl p-8 border border-[#1e1f22]">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t("tickets_logs")}</label>
                  <SearchableDropdown 
                    value={config?.tickets_logs_channel} 
                    onChange={(v: string|null) => updateConfig("tickets_logs_channel", v)} 
                    options={groupedChannels} t={t} placeholder={t("select_channel")}
                  />
                  <p className="text-xs text-gray-500 mt-3">Les transcripts (historiques) seront envoyés ici.</p>
                </div>
              </div>

              {/* Categories Cards */}
              <div className="mt-12">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-white">{t("tickets_category")}</h3>
                  <button 
                    onClick={() => {
                      const newId = "cat_" + Date.now();
                      setEditingTicketCat({ id: newId, name: "Nouveau Ticket", description: "Ouvrir un ticket", emoji: "🎫", staff_roles: [], questions: [] });
                    }}
                    className="bg-[#5865F2] hover:bg-[#4752C4] text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2"
                  >
                    <Plus size={16} /> Ajouter une Catégorie
                  </button>
                </div>
                
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {Object.entries(config?.ticket_categories || {}).map(([catId, cat]: [string, any]) => (
                    <div key={catId} className="bg-[#2b2d31] border border-[#1e1f22] hover:border-[#5865F2] rounded-xl p-5 transition-colors group relative cursor-pointer" onClick={() => setEditingTicketCat({id: catId, ...cat})}>
                      <div className="flex items-center gap-4 mb-2">
                        <span className="text-3xl bg-[#1e1f22] p-3 rounded-xl">{cat.emoji || "🎫"}</span>
                        <div>
                          <h4 className="text-lg font-bold text-white truncate max-w-[150px]">{cat.name}</h4>
                          <p className="text-xs text-gray-400 truncate max-w-[150px]">{cat.description || "Aucune description"}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="bg-[#1e1f22] text-xs text-gray-400 px-2 py-1 rounded border border-[#313338]">{cat.questions?.length || 0} Questions</span>
                        <span className="bg-[#1e1f22] text-xs text-gray-400 px-2 py-1 rounded border border-[#313338]">{cat.staff_roles?.length || 0} Rôles Staff</span>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          const newCats = {...config.ticket_categories};
                          delete newCats[catId];
                          updateConfig("ticket_categories", newCats);
                        }}
                        className="absolute top-4 right-4 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition p-2 bg-[#1e1f22] rounded-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  {Object.keys(config?.ticket_categories || {}).length === 0 && (
                     <div className="col-span-full py-10 text-center text-gray-500 border-2 border-dashed border-[#2b2d31] rounded-xl">
                       Aucune catégorie de ticket. Créez-en une pour commencer !
                     </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB: SHOP */}
          {activeTab === "shop" && (
            <div className="p-8 lg:p-10 animate-fade-in space-y-8">
              <div className="flex items-center justify-between border-b border-[#1e1f22] pb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <ShoppingCart className="text-brand"/> Boutique de Rôle (Shop)
                </h2>
                <button 
                  onClick={() => {
                    setEditingShopItem({ id: Math.random().toString(36).substring(7), name: "Nouvel Article", price: 100, stock: 999, description: "", roles: [] });
                  }}
                  className="bg-[#5865F2] hover:bg-[#4752C4] text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2"
                >
                  <Plus size={16} /> Créer un Article
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {(config?.shop || []).map((item: any, index: number) => (
                  <div key={item.id} className="bg-[#2b2d31] border border-[#1e1f22] rounded-xl overflow-hidden hover:border-[#5865F2] transition cursor-pointer" onClick={() => setEditingShopItem({...item, _index: index})}>
                    <div className="bg-[#1e1f22] p-5 border-b border-[#1e1f22] flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-lg text-white mb-1 truncate max-w-[180px]">{item.name}</h4>
                        <span className="bg-[#5865F2]/10 text-[#5865F2] text-xs px-2 py-1 rounded font-bold">{item.price} Coins</span>
                      </div>
                    </div>
                    <div className="p-5 space-y-3">
                      <p className="text-sm text-gray-400 line-clamp-2">{item.description || "Aucune description"}</p>
                      <div className="flex justify-between items-center text-xs border-t border-[#1e1f22] pt-4 mt-4">
                        <span className="text-gray-500 font-medium">Stock: <span className="text-white">{item.stock}</span></span>
                        {item.roles?.length > 0 && <span className="bg-green-500/10 text-green-400 px-2 py-1 rounded">Donne {item.roles.length} rôle(s)</span>}
                      </div>
                    </div>
                  </div>
                ))}
                {(config?.shop?.length || 0) === 0 && (
                   <div className="col-span-full py-20 text-center text-gray-500 border-2 border-dashed border-[#2b2d31] rounded-xl">
                     La boutique est vide.
                   </div>
                )}
              </div>
            </div>
          )}

          {/* Fallback */}
          {(activeTab === "automod" || activeTab === "supporter" || activeTab === "voice" || activeTab === "logs") && (
            <div className="p-8 lg:p-10 animate-fade-in flex flex-col items-center justify-center min-h-[400px] text-gray-400 text-center">
              <Shield size={64} className="mb-6 text-[#2b2d31]" />
              <h2 className="text-xl font-bold text-white mb-2">Module Actif</h2>
              <p className="max-w-md">L'interface Pro pour ce module est en cours de développement. Les paramètres globaux sont conservés !</p>
            </div>
          )}

        </div>
      </div>

      {/* FLOATING SAVE BAR */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 flex justify-center transition-transform duration-500 ease-out ${hasUnsavedChanges ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="bg-[#111214] border border-[#1e1f22] text-white px-6 py-4 rounded-t-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] flex items-center justify-between w-full max-w-4xl mb-4 rounded-b-2xl">
          <div className="flex items-center gap-3">
            <AlertCircle size={20} className="text-yellow-500" />
            <span className="font-medium text-sm md:text-base">Tu as des modifications non enregistrées !</span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => { setConfig(JSON.parse(originalConfig)); }} 
              className="text-white hover:underline text-sm font-medium px-4 py-2"
            >
              Réinitialiser
            </button>
            <button 
              onClick={() => handleSave()}
              disabled={saving}
              className="bg-[#23A559] hover:bg-[#1f934f] text-white px-6 py-2 rounded font-bold transition disabled:opacity-50 text-sm shadow-lg shadow-[#23A559]/20 flex items-center gap-2"
            >
              {saving && <Loader2 size={16} className="animate-spin" />}
              {saving ? "Enregistrement..." : "Enregistrer les modifications"}
            </button>
          </div>
        </div>
      </div>

      {/* MODAL: TICKET CATEGORY */}
      <Modal 
        isOpen={!!editingTicketCat} 
        onClose={() => setEditingTicketCat(null)} 
        title="Modifier la Catégorie de Ticket"
        onSave={() => {
          const newCats = {...(config.ticket_categories || {})};
          newCats[editingTicketCat.id] = {
            name: editingTicketCat.name,
            description: editingTicketCat.description,
            emoji: editingTicketCat.emoji,
            staff_roles: editingTicketCat.staff_roles,
            questions: editingTicketCat.questions
          };
          updateConfig("ticket_categories", newCats);
          setEditingTicketCat(null);
        }}
      >
        {editingTicketCat && (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-1">
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Emoji</label>
                <input type="text" value={editingTicketCat.emoji} onChange={e => setEditingTicketCat({...editingTicketCat, emoji: e.target.value})} className="w-full bg-[#1e1f22] border border-[#313338] rounded-md px-3 py-2 text-white text-center text-xl" />
              </div>
              <div className="col-span-3">
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Nom de la catégorie</label>
                <input type="text" value={editingTicketCat.name} onChange={e => setEditingTicketCat({...editingTicketCat, name: e.target.value})} className="w-full bg-[#1e1f22] border border-[#313338] rounded-md px-3 py-2 text-white" />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Description</label>
              <textarea value={editingTicketCat.description} onChange={e => setEditingTicketCat({...editingTicketCat, description: e.target.value})} rows={2} className="w-full bg-[#1e1f22] border border-[#313338] rounded-md px-3 py-2 text-white resize-none" />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Rôle Staff (Support)</label>
              <SearchableDropdown 
                value={editingTicketCat.staff_roles?.[0]} 
                onChange={(v: string|null) => setEditingTicketCat({...editingTicketCat, staff_roles: v ? [v] : []})} 
                options={config?.discord_roles} isRole t={t} placeholder={t("select_role")}
              />
            </div>

            <div className="border-t border-[#1e1f22] pt-6 mt-6">
              <div className="flex items-center justify-between mb-4">
                <label className="block text-xs font-bold text-gray-400 uppercase">Formulaire (Questions Modals)</label>
                <button onClick={() => setEditingTicketCat({...editingTicketCat, questions: [...(editingTicketCat.questions||[]), {label: "Nouvelle Question", required: true}]})} className="text-[#5865F2] hover:underline text-sm font-medium">+ Ajouter</button>
              </div>
              
              <div className="space-y-3">
                {(editingTicketCat.questions || []).map((q: any, i: number) => (
                  <div key={i} className="flex gap-3 items-center bg-[#1e1f22] p-3 rounded-lg border border-[#313338]">
                    <div className="flex-grow">
                      <input type="text" value={q.label} onChange={e => {
                        const newQ = [...editingTicketCat.questions];
                        newQ[i].label = e.target.value;
                        setEditingTicketCat({...editingTicketCat, questions: newQ});
                      }} className="w-full bg-[#2b2d31] border-none rounded px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#5865F2]" placeholder="Titre de la question" />
                    </div>
                    <button onClick={() => {
                        const newQ = [...editingTicketCat.questions];
                        newQ.splice(i, 1);
                        setEditingTicketCat({...editingTicketCat, questions: newQ});
                    }} className="text-red-400 hover:bg-red-500/20 p-2 rounded transition"><Trash2 size={16}/></button>
                  </div>
                ))}
                {(editingTicketCat.questions?.length || 0) === 0 && <p className="text-xs text-gray-500 italic">Aucune question configurée. Le ticket s'ouvrira directement en 1 clic.</p>}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* MODAL: SHOP ITEM */}
      <Modal 
        isOpen={!!editingShopItem} 
        onClose={() => setEditingShopItem(null)} 
        title={editingShopItem?._index !== undefined ? "Modifier l'article" : "Créer un article"}
        onSave={() => {
          const newShop = [...(config.shop || [])];
          const item = {
            id: editingShopItem.id,
            name: editingShopItem.name,
            description: editingShopItem.description,
            price: editingShopItem.price,
            stock: editingShopItem.stock,
            roles: editingShopItem.roles
          };
          
          if (editingShopItem._index !== undefined) {
            newShop[editingShopItem._index] = item;
          } else {
            newShop.push(item);
          }
          
          updateConfig("shop", newShop);
          setEditingShopItem(null);
        }}
      >
        {editingShopItem && (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Nom de l'article</label>
              <input type="text" value={editingShopItem.name} onChange={e => setEditingShopItem({...editingShopItem, name: e.target.value})} className="w-full bg-[#1e1f22] border border-[#313338] rounded-md px-3 py-2 text-white" />
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Prix (Coins)</label>
                <input type="number" value={editingShopItem.price} onChange={e => setEditingShopItem({...editingShopItem, price: parseInt(e.target.value)||0})} className="w-full bg-[#1e1f22] border border-[#313338] rounded-md px-3 py-2 text-white" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Stock disponible</label>
                <input type="number" value={editingShopItem.stock} onChange={e => setEditingShopItem({...editingShopItem, stock: parseInt(e.target.value)||0})} className="w-full bg-[#1e1f22] border border-[#313338] rounded-md px-3 py-2 text-white" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Description</label>
              <textarea value={editingShopItem.description} onChange={e => setEditingShopItem({...editingShopItem, description: e.target.value})} rows={3} className="w-full bg-[#1e1f22] border border-[#313338] rounded-md px-3 py-2 text-white resize-none" />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Récompense : Rôle donné à l'achat</label>
              <SearchableDropdown 
                value={editingShopItem.roles?.[0]} 
                onChange={(v: string|null) => setEditingShopItem({...editingShopItem, roles: v ? [v] : []})} 
                options={config?.discord_roles} isRole t={t} placeholder={t("select_role")}
              />
              <p className="text-xs text-gray-500 mt-2">Le bot donnera automatiquement ce rôle au membre qui achète l'article.</p>
            </div>
            
            {editingShopItem._index !== undefined && (
              <div className="pt-4 border-t border-[#1e1f22] text-right">
                <button 
                  onClick={() => {
                    const newShop = [...config.shop];
                    newShop.splice(editingShopItem._index, 1);
                    updateConfig("shop", newShop);
                    setEditingShopItem(null);
                  }} 
                  className="text-red-400 hover:underline text-sm font-medium"
                >
                  Supprimer définitivement cet article
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>

    </div>
  );
}
