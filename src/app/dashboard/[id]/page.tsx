"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import {
  Loader2, ArrowLeft, Globe, Shield, DoorOpen, Ticket, Star,
  MessageSquare, Mic, AlertCircle, ShoppingCart, Trash2, X,
  Check, Search, Plus, ChevronDown, Hash, Info, Gift,
  Clock, Users, Trophy, StopCircle, GripVertical
} from "lucide-react";
import Link from "next/link";
import { useTranslation } from "./locales";

/* ─── Toggle ─── */
const Toggle = ({ value, onChange, label, description }: { value: boolean; onChange: (v: boolean) => void; label: string; description?: string }) => (
  <div className="flex items-center justify-between gap-6 py-4 group">
    <div className="min-w-0">
      <p className="text-[15px] font-medium text-gray-200">{label}</p>
      {description && <p className="text-sm text-gray-500 mt-0.5">{description}</p>}
    </div>
    <div className={`toggle-switch ${value ? 'active' : ''}`} onClick={() => onChange(!value)} />
  </div>
);

/* ─── Searchable Select ─── */
const SearchableSelect = ({ options, value, onChange, placeholder, isRole = false, t }: any) => {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h);
  }, []);
  const flat = options.flatMap((g: any) => g.items || [g]);
  const selected = flat.find((o: any) => String(o.id) === String(value));
  const filtered = q === "" ? options : options.map((g: any) => {
    if (g.items) return { ...g, items: g.items.filter((i: any) => i.name.toLowerCase().includes(q.toLowerCase())) };
    return g.name?.toLowerCase().includes(q.toLowerCase()) ? g : null;
  }).filter((g: any) => g && (!g.items || g.items.length > 0));

  return (
    <div className="relative w-full" ref={ref}>
      <button type="button" onClick={() => { setOpen(!open); setQ(""); }}
        className="w-full bg-[#1e1f22] border border-[#3f4147] hover:border-[#5865F2] rounded-[4px] px-3 py-[10px] text-sm cursor-pointer flex items-center justify-between transition-colors text-left">
        <span className="flex items-center gap-2 truncate">
          {selected ? (<>
            {isRole && <span className="w-3 h-3 rounded-full flex-shrink-0 inline-block" style={{ background: selected.color !== "#000000" ? selected.color : "#99aab5" }} />}
            {!isRole && <Hash size={14} className="text-gray-500 flex-shrink-0" />}
            <span className="text-gray-200">{selected.name}</span>
          </>) : <span className="text-gray-500">{placeholder}</span>}
        </span>
        <ChevronDown size={16} className={`text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute z-50 w-full mt-1 bg-[#111214] border border-[#1e1f22] rounded-[4px] shadow-2xl max-h-64 flex flex-col animate-fade-in">
          <div className="p-2 border-b border-[#1e1f22]">
            <div className="flex items-center gap-2 bg-[#1e1f22] rounded-[3px] px-2">
              <Search size={14} className="text-gray-500 flex-shrink-0" />
              <input autoFocus type="text" value={q} onChange={e => setQ(e.target.value)} placeholder={t("search")}
                className="w-full bg-transparent text-sm text-gray-200 py-2 focus:outline-none" />
            </div>
          </div>
          <div className="overflow-y-auto custom-scrollbar p-1">
            <button type="button" onClick={() => { onChange(null); setOpen(false); }}
              className="w-full text-left px-2 py-[6px] rounded-[3px] text-sm text-gray-500 hover:bg-[#4e505833] hover:text-red-400 transition-colors">
              {t("select_none")}
            </button>
            {filtered.map((group: any, gi: number) => (
              <div key={gi}>
                {group.items ? (<>
                  <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider px-2 pt-3 pb-1">{group.category}</div>
                  {group.items.map((item: any) => (
                    <button type="button" key={item.id} onClick={() => { onChange(item.id); setOpen(false); }}
                      className={`w-full text-left px-2 py-[6px] rounded-[3px] flex items-center gap-2 text-sm transition-colors ${String(value) === String(item.id) ? 'bg-[#5865F2]/20 text-white' : 'text-gray-300 hover:bg-[#4e505833] hover:text-white'}`}>
                      <Hash size={14} className="text-gray-500 flex-shrink-0" /> {item.name}
                    </button>
                  ))}
                </>) : (
                  <button type="button" key={group.id} onClick={() => { onChange(group.id); setOpen(false); }}
                    className={`w-full text-left px-2 py-[6px] rounded-[3px] flex items-center gap-2 text-sm transition-colors ${String(value) === String(group.id) ? 'bg-[#5865F2]/20 text-white' : 'text-gray-300 hover:bg-[#4e505833] hover:text-white'}`}>
                    <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: group.color !== "#000000" ? group.color : "#99aab5" }} />
                    {group.name}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── Multi-Role Select ─── */
const MultiRoleSelect = ({ options, value = [], onChange, placeholder, t }: any) => {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h);
  }, []);
  const selectedRoles = options.filter((r: any) => value.includes(r.id));
  const filtered = q === "" ? options : options.filter((r: any) => r.name.toLowerCase().includes(q.toLowerCase()));
  const toggle = (id: string) => {
    onChange(value.includes(id) ? value.filter((v: string) => v !== id) : [...value, id]);
  };
  return (
    <div className="relative w-full" ref={ref}>
      <button type="button" onClick={() => { setOpen(!open); setQ(""); }}
        className="w-full bg-[#1e1f22] border border-[#3f4147] hover:border-[#5865F2] rounded-[4px] px-3 py-[10px] text-sm cursor-pointer flex items-center justify-between transition-colors text-left min-h-[42px]">
        <span className="flex items-center gap-1.5 flex-wrap">
          {selectedRoles.length > 0 ? selectedRoles.map((r: any) => (
            <span key={r.id} className="bg-[#313338] text-gray-200 text-xs px-2 py-0.5 rounded flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ background: r.color !== "#000000" ? r.color : "#99aab5" }} />
              {r.name}
            </span>
          )) : <span className="text-gray-500">{placeholder}</span>}
        </span>
        <ChevronDown size={16} className={`text-gray-500 transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute z-50 w-full mt-1 bg-[#111214] border border-[#1e1f22] rounded-[4px] shadow-2xl max-h-56 flex flex-col animate-fade-in">
          <div className="p-2 border-b border-[#1e1f22]">
            <div className="flex items-center gap-2 bg-[#1e1f22] rounded-[3px] px-2">
              <Search size={14} className="text-gray-500" />
              <input autoFocus type="text" value={q} onChange={e => setQ(e.target.value)} placeholder={t("search")}
                className="w-full bg-transparent text-sm text-gray-200 py-2 focus:outline-none" />
            </div>
          </div>
          <div className="overflow-y-auto custom-scrollbar p-1">
            {filtered.map((r: any) => (
              <button type="button" key={r.id} onClick={() => toggle(r.id)}
                className={`w-full text-left px-2 py-[6px] rounded-[3px] flex items-center gap-2 text-sm transition-colors ${value.includes(r.id) ? 'bg-[#5865F2]/20 text-white' : 'text-gray-300 hover:bg-[#4e505833] hover:text-white'}`}>
                <span className={`w-4 h-4 rounded-[3px] border flex items-center justify-center flex-shrink-0 ${value.includes(r.id) ? 'bg-[#5865F2] border-[#5865F2]' : 'border-[#4e5058]'}`}>
                  {value.includes(r.id) && <Check size={10} className="text-white" />}
                </span>
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: r.color !== "#000000" ? r.color : "#99aab5" }} />
                {r.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── Modal ─── */
const Modal = ({ isOpen, onClose, title, children, onSave, saveLabel, wide }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70" />
      <div className={`bg-[#313338] border border-[#1e1f22] rounded-lg shadow-2xl w-full ${wide ? 'max-w-2xl' : 'max-w-xl'} max-h-[85vh] flex flex-col relative animate-scale-up`} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e1f22]">
          <h2 className="text-base font-semibold text-white">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition p-1"><X size={20} /></button>
        </div>
        <div className="px-4 py-4 overflow-y-auto flex-grow custom-scrollbar space-y-4">{children}</div>
        {onSave && (
          <div className="px-4 py-3 bg-[#2b2d31] border-t border-[#1e1f22] flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-[6px] text-sm text-gray-300 hover:underline">Annuler</button>
            <button onClick={onSave} className="bg-[#5865F2] hover:bg-[#4752C4] text-white px-4 py-[6px] rounded-[3px] text-sm font-medium transition">{saveLabel || "Enregistrer"}</button>
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── Primitives ─── */
const Card = ({ children, className = "", onClick }: any) => (
  <div className={`bg-[#2b2d31] rounded-lg border border-[#1e1f22] ${className}`} onClick={onClick}>{children}</div>
);
const Field = ({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>
    {description && <p className="text-xs text-gray-500 mb-2">{description}</p>}
    {children}
  </div>
);
const Input = ({ value, onChange, placeholder, type = "text", className: cx, ...rest }: any) => (
  <input type={type} value={value ?? ""} onChange={e => onChange(type === "number" ? parseInt(e.target.value) || 0 : e.target.value)} placeholder={placeholder}
    className={`w-full bg-[#1e1f22] border border-[#3f4147] hover:border-[#5865F2] focus:border-[#5865F2] rounded-[4px] px-3 py-[10px] text-sm text-white focus:outline-none transition-colors ${cx || ''}`} {...rest} />
);
const Textarea = ({ value, onChange, placeholder, rows = 4 }: any) => (
  <textarea value={value ?? ""} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
    className="w-full bg-[#1e1f22] border border-[#3f4147] hover:border-[#5865F2] focus:border-[#5865F2] rounded-[4px] px-3 py-[10px] text-sm text-white focus:outline-none transition-colors resize-none" />
);


/* ═══════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════ */
export default function GuildDashboardPage() {
  const { id } = useParams();
  const [config, setConfig] = useState<any>(null);
  const [original, setOriginal] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState("welcome");
  const [lang, setLang] = useState("fr");
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);
  const t = useTranslation(lang);

  // Modals
  const [editTicket, setEditTicket] = useState<any>(null);
  const [editQuestion, setEditQuestion] = useState<{ catState: any; index: number } | null>(null);
  const [editShop, setEditShop] = useState<any>(null);

  // Giveaways
  const [giveaways, setGiveaways] = useState<any[]>([]);
  const [gwLoading, setGwLoading] = useState(false);
  const [editGw, setEditGw] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/bot/guilds/${id}/config`)
      .then(async r => { if (!r.ok) throw new Error(`API Error (${r.status}): ${await r.text()}`); return r.json(); })
      .then(d => {
        if (d.error) throw new Error(d.error);
        ["welcome", "automod", "voice_afk"].forEach(k => { if (!d[k]) d[k] = {}; });
        if (!d.ticket_categories) d.ticket_categories = {};
        ["shop", "discord_roles", "discord_channels"].forEach(k => { if (!d[k]) d[k] = []; });
        setConfig(d); setOriginal(JSON.stringify(d)); setLoading(false);
      })
      .catch(e => { setError(e.message); setLoading(false); });
  }, [id]);

  const fetchGiveaways = () => {
    setGwLoading(true);
    fetch(`/api/bot/guilds/${id}/giveaways`)
      .then(r => r.json()).then(d => { setGiveaways(d.giveaways || []); setGwLoading(false); })
      .catch(() => setGwLoading(false));
  };
  useEffect(() => { if (tab === "giveaways") fetchGiveaways(); }, [tab]);

  const dirty = original && JSON.stringify(config) !== original;
  const showToast = (type: "ok" | "err", msg: string) => { setToast({ type, msg }); setTimeout(() => setToast(null), 4000); };

  const save = async () => {
    setSaving(true);
    const payload = { ...config }; delete payload.discord_roles; delete payload.discord_channels;
    try {
      const r = await fetch(`/api/bot/guilds/${id}/config`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!r.ok) throw new Error(await r.text());
      setOriginal(JSON.stringify(config)); showToast("ok", t("success"));
    } catch (e: any) { showToast("err", t("error") + " " + e.message); }
    setSaving(false);
  };

  const set = (k: string, v: any) => setConfig({ ...config, [k]: v });
  const setN = (mod: string, k: string, v: any) => setConfig({ ...config, [mod]: { ...config[mod], [k]: v } });

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-40">
      <Loader2 size={40} className="animate-spin text-[#5865F2] mb-4" />
      <p className="text-gray-500 text-sm">Loading…</p>
    </div>
  );
  if (error) return (
    <div className="max-w-lg mx-auto mt-20 text-center bg-[#2b2d31] rounded-lg border border-red-500/20 p-10">
      <AlertCircle size={48} className="mx-auto mb-4 text-red-400" />
      <h2 className="text-xl font-bold text-white mb-2">Connection Error</h2>
      <p className="text-gray-400 text-sm break-all">{error}</p>
      <Link href="/dashboard" className="text-[#5865F2] hover:underline mt-6 inline-block text-sm">← Back</Link>
    </div>
  );

  const groupedChannels = (config.discord_channels || []).reduce((a: any[], c: any) => {
    const cat = c.category || "—";
    let g = a.find((x: any) => x.category === cat);
    if (!g) { g = { category: cat, items: [] }; a.push(g); }
    g.items.push(c); return a;
  }, [] as any[]);

  const tabs = [
    { section: t("section_config"), items: [
      { id: "general", label: t("tab_general"), icon: <Globe size={18} /> },
      { id: "welcome", label: t("tab_welcome"), icon: <DoorOpen size={18} /> },
    ]},
    { section: t("section_modules"), items: [
      { id: "automod", label: t("tab_automod"), icon: <Shield size={18} /> },
      { id: "tickets", label: t("tab_tickets"), icon: <Ticket size={18} /> },
      { id: "supporter", label: t("tab_supporter"), icon: <Star size={18} /> },
      { id: "shop", label: t("tab_shop"), icon: <ShoppingCart size={18} /> },
      { id: "giveaways", label: t("tab_giveaways"), icon: <Gift size={18} /> },
    ]},
    { section: t("section_utils"), items: [
      { id: "voice", label: t("tab_voice"), icon: <Mic size={18} /> },
      { id: "logs", label: t("tab_logs"), icon: <MessageSquare size={18} /> },
    ]},
  ];

  return (
    <div className="max-w-[1300px] mx-auto animate-fade-in-up pb-28">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/dashboard" className="text-gray-500 hover:text-gray-300 flex items-center gap-1.5 text-sm transition mb-1"><ArrowLeft size={14} /> {t("back")}</Link>
          <h1 className="text-2xl font-bold text-white">{t("title")}</h1>
          <p className="text-gray-500 text-sm mt-0.5">{t("desc")}</p>
        </div>
        <select value={lang} onChange={e => setLang(e.target.value)}
          className="bg-[#1e1f22] border border-[#3f4147] text-white text-sm rounded-[4px] px-3 py-2 cursor-pointer focus:outline-none hover:border-[#5865F2] transition-colors">
          <option value="fr">🇫🇷 Français</option><option value="en">🇬🇧 English</option>
        </select>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <nav className="w-56 flex-shrink-0 hidden lg:block space-y-5">
          {tabs.map(sec => (
            <div key={sec.section}>
              <p className="text-[11px] font-bold text-gray-600 uppercase tracking-wider px-3 mb-1">{sec.section}</p>
              {sec.items.map(item => (
                <button key={item.id} onClick={() => setTab(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-[4px] text-sm font-medium transition-colors ${tab === item.id ? 'bg-[#43444b] text-white' : 'text-gray-400 hover:bg-[#35363c] hover:text-gray-200'}`}>
                  {item.icon} {item.label}
                </button>
              ))}
            </div>
          ))}
        </nav>

        {/* Content */}
        <div className="flex-1 min-w-0">

          {/* ═══ GENERAL ═══ */}
          {tab === "general" && (
            <div className="animate-fade-in space-y-6">
              <h2 className="text-lg font-semibold text-white">{t("tab_general")}</h2>
              <Card className="p-5 max-w-xl">
                <Field label={t("general_lang")} description={t("general_lang_desc")}>
                  <select value={config.language || "en"} onChange={e => set("language", e.target.value)}
                    className="w-full bg-[#1e1f22] border border-[#3f4147] hover:border-[#5865F2] rounded-[4px] px-3 py-[10px] text-sm text-white focus:outline-none transition-colors">
                    {[["en","🇬🇧 English"],["fr","🇫🇷 Français"],["es","🇪🇸 Español"],["de","🇩🇪 Deutsch"],["it","🇮🇹 Italiano"],["pt","🇵🇹 Português"],["ru","🇷🇺 Русский"],["ja","🇯🇵 日本語"]].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </Field>
              </Card>
            </div>
          )}

          {/* ═══ WELCOME ═══ */}
          {tab === "welcome" && (
            <div className="animate-fade-in space-y-6">
              <div><h2 className="text-lg font-semibold text-white">{t("welcome_title")}</h2><p className="text-sm text-gray-500 mt-0.5">{t("welcome_desc")}</p></div>
              <div className="flex flex-col xl:flex-row gap-6">
                <Card className="p-5 flex-1 space-y-5">
                  <Field label={t("welcome_channel")}><SearchableSelect value={config.welcome?.channel_id} onChange={(v: any) => setN("welcome", "channel_id", v)} options={groupedChannels} t={t} placeholder={t("select_channel")} /></Field>
                  <Field label={t("welcome_autorole")}><SearchableSelect value={config.welcome?.auto_roles?.[0]} onChange={(v: any) => setN("welcome", "auto_roles", v ? [v] : [])} options={config.discord_roles} isRole t={t} placeholder={t("select_role")} /></Field>
                  <Field label={t("welcome_msg")} description={t("welcome_vars")}><Textarea value={config.welcome?.message} onChange={(v: any) => setN("welcome", "message", v)} rows={4} /></Field>
                  <Field label={t("welcome_bg")}><Input value={config.welcome?.background_url} onChange={(v: any) => setN("welcome", "background_url", v)} placeholder="https://i.imgur.com/..." /></Field>
                </Card>
                <div className="xl:w-[400px] flex-shrink-0">
                  <p className="text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-2">{t("welcome_preview")}</p>
                  <div className="bg-[#313338] rounded-lg p-4 border border-[#1e1f22]">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#5865F2] flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">X</div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-sm font-medium text-white">Xyra</span>
                          <span className="bg-[#5865F2] text-[9px] px-1 py-px rounded text-white font-bold flex items-center gap-0.5"><Check size={8} />BOT</span>
                          <span className="text-[11px] text-[#949ba4]">Today at 12:00</span>
                        </div>
                        <p className="text-[#dbdee1] text-[15px] whitespace-pre-wrap break-words leading-[1.375rem]">
                          {(config.welcome?.message || "Welcome!").replace(/\{user\}/g, "@NewMember").replace(/\{server\}/g, "My Server").replace(/\{username\}/g, "NewMember").replace(/\{count\}/g, "42")}
                        </p>
                        {config.welcome?.background_url && (
                          <div className="mt-2 rounded overflow-hidden border border-[#1e1f22] max-w-[360px]">
                            <img src={config.welcome.background_url} alt="" className="w-full h-auto object-cover" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══ AUTOMOD ═══ */}
          {tab === "automod" && (
            <div className="animate-fade-in space-y-6">
              <div><h2 className="text-lg font-semibold text-white">{t("automod_title")}</h2><p className="text-sm text-gray-500 mt-0.5">{t("automod_desc")}</p></div>
              <Card className="p-5 max-w-2xl divide-y divide-[#1e1f22]">
                <Toggle value={config.automod?.enabled || false} onChange={v => setN("automod", "enabled", v)} label={t("automod_shield")} description={t("automod_shield_desc")} />
                <Toggle value={config.automod?.anti_invites || false} onChange={v => setN("automod", "anti_invites", v)} label={t("automod_invites")} description={t("automod_invites_desc")} />
                <Toggle value={config.automod?.anti_links || false} onChange={v => setN("automod", "anti_links", v)} label={t("automod_links")} description={t("automod_links_desc")} />
                <Toggle value={config.automod?.anti_caps || false} onChange={v => setN("automod", "anti_caps", v)} label={t("automod_caps")} description={t("automod_caps_desc")} />
              </Card>
              <Card className="p-5 max-w-2xl space-y-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Advanced</p>
                <div className="grid grid-cols-3 gap-4">
                  <Field label={t("automod_caps_threshold")}><Input type="number" value={config.automod?.caps_threshold ?? 70} onChange={(v: any) => setN("automod", "caps_threshold", v)} /></Field>
                  <Field label={t("automod_caps_minlen")}><Input type="number" value={config.automod?.caps_min_length ?? 8} onChange={(v: any) => setN("automod", "caps_min_length", v)} /></Field>
                  <Field label={t("automod_max_mentions")}><Input type="number" value={config.automod?.max_mentions ?? 5} onChange={(v: any) => setN("automod", "max_mentions", v)} /></Field>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <Field label={t("automod_allowed_links")}><SearchableSelect value={config.automod?.allowed_links_roles?.[0]} onChange={(v: any) => setN("automod", "allowed_links_roles", v ? [v] : [])} options={config.discord_roles} isRole t={t} placeholder={t("select_role")} /></Field>
                  <Field label={t("automod_allowed_invites")}><SearchableSelect value={config.automod?.allowed_invites_roles?.[0]} onChange={(v: any) => setN("automod", "allowed_invites_roles", v ? [v] : [])} options={config.discord_roles} isRole t={t} placeholder={t("select_role")} /></Field>
                </div>
              </Card>
            </div>
          )}

          {/* ═══ TICKETS ═══ */}
          {tab === "tickets" && (
            <div className="animate-fade-in space-y-6">
              <div><h2 className="text-lg font-semibold text-white">{t("tickets_title")}</h2><p className="text-sm text-gray-500 mt-0.5">{t("tickets_desc")}</p></div>
              <div className="grid md:grid-cols-2 gap-4 max-w-2xl">
                <Card className="p-5"><Field label={t("tickets_panel")} description={t("tickets_panel_desc")}><SearchableSelect value={config.tickets_panel_channel} onChange={(v: any) => set("tickets_panel_channel", v)} options={groupedChannels} t={t} placeholder={t("select_channel")} /></Field></Card>
                <Card className="p-5"><Field label={t("tickets_logs")} description={t("tickets_logs_desc")}><SearchableSelect value={config.tickets_logs_channel} onChange={(v: any) => set("tickets_logs_channel", v)} options={groupedChannels} t={t} placeholder={t("select_channel")} /></Field></Card>
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-300">{t("tickets_category")}</h3>
                <button onClick={() => setEditTicket({ id: "cat_" + Date.now(), name: "", description: "", emoji: "🎫", staff_roles: [], questions: [], open_message: "Welcome {user}, a staff member will assist you shortly.", max_tickets: 1 })}
                  className="bg-[#5865F2] hover:bg-[#4752C4] text-white px-3 py-1.5 rounded-[4px] text-sm font-medium transition flex items-center gap-1.5"><Plus size={14} /> {t("tickets_add_cat")}</button>
              </div>
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
                {Object.entries(config.ticket_categories || {}).map(([cid, cat]: [string, any]) => (
                  <Card key={cid} className="p-4 hover:border-[#5865F2] transition-colors cursor-pointer group relative" onClick={() => setEditTicket({ id: cid, ...cat })}>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{cat.emoji || "🎫"}</span>
                      <div className="min-w-0"><p className="font-medium text-white truncate">{cat.name || "Untitled"}</p><p className="text-xs text-gray-500 truncate">{cat.description || "—"}</p></div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <span className="bg-[#1e1f22] text-[11px] text-gray-400 px-2 py-0.5 rounded">{cat.questions?.length || 0} Q</span>
                      <span className="bg-[#1e1f22] text-[11px] text-gray-400 px-2 py-0.5 rounded">{cat.staff_roles?.length || 0} Staff</span>
                    </div>
                    <button onClick={e => { e.stopPropagation(); const n = { ...config.ticket_categories }; delete n[cid]; set("ticket_categories", n); }}
                      className="absolute top-3 right-3 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition"><Trash2 size={14} /></button>
                  </Card>
                ))}
                {Object.keys(config.ticket_categories || {}).length === 0 && (
                  <div className="col-span-full py-12 text-center text-gray-600 border-2 border-dashed border-[#2b2d31] rounded-lg text-sm">No ticket categories yet.</div>
                )}
              </div>
            </div>
          )}

          {/* ═══ SUPPORTER ═══ */}
          {tab === "supporter" && (
            <div className="animate-fade-in space-y-6">
              <div><h2 className="text-lg font-semibold text-white">{t("supporter_title")}</h2><p className="text-sm text-gray-500 mt-0.5">{t("supporter_desc")}</p></div>
              <Card className="p-5 max-w-xl space-y-5">
                <Field label={t("supporter_role")} description={t("supporter_role_desc")}><SearchableSelect value={config.supporter_role_id} onChange={(v: any) => set("supporter_role_id", v)} options={config.discord_roles} isRole t={t} placeholder={t("select_role")} /></Field>
                <Field label={t("supporter_keyword")} description={t("supporter_keyword_desc")}><Input value={config.supporter_keyword} onChange={(v: any) => set("supporter_keyword", v)} placeholder={t("supporter_keyword_ph")} /></Field>
              </Card>
            </div>
          )}

          {/* ═══ SHOP ═══ */}
          {tab === "shop" && (
            <div className="animate-fade-in space-y-6">
              <div className="flex items-center justify-between">
                <div><h2 className="text-lg font-semibold text-white">{t("shop_title")}</h2><p className="text-sm text-gray-500 mt-0.5">{t("shop_desc")}</p></div>
                <button onClick={() => setEditShop({ id: Math.random().toString(36).substring(7), name: "", price: 100, stock: -1, description: "", roles: [] })}
                  className="bg-[#5865F2] hover:bg-[#4752C4] text-white px-3 py-1.5 rounded-[4px] text-sm font-medium transition flex items-center gap-1.5"><Plus size={14} /> {t("shop_add")}</button>
              </div>
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
                {(config.shop || []).map((item: any, idx: number) => (
                  <Card key={item.id || idx} className="overflow-hidden hover:border-[#5865F2] transition-colors cursor-pointer" onClick={() => setEditShop({ ...item, _index: idx })}>
                    <div className="px-4 py-3 bg-[#1e1f22] flex items-center justify-between border-b border-[#1e1f22]"><p className="font-medium text-white truncate text-sm">{item.name || "Untitled"}</p><span className="text-[#5865F2] text-xs font-bold whitespace-nowrap">{item.price} 🪙</span></div>
                    <div className="px-4 py-3"><p className="text-xs text-gray-500 line-clamp-2 mb-2">{item.description || "—"}</p>
                      <div className="flex items-center gap-2 text-[11px]"><span className="text-gray-500">Stock: <span className="text-gray-300">{item.stock === -1 ? "∞" : item.stock}</span></span>{item.roles?.length > 0 && <span className="bg-green-500/10 text-green-400 px-1.5 py-0.5 rounded">+{item.roles.length} role</span>}</div>
                    </div>
                  </Card>
                ))}
                {(config.shop?.length || 0) === 0 && <div className="col-span-full py-12 text-center text-gray-600 border-2 border-dashed border-[#2b2d31] rounded-lg text-sm">{t("shop_empty")}</div>}
              </div>
            </div>
          )}

          {/* ═══ GIVEAWAYS ═══ */}
          {tab === "giveaways" && (
            <div className="animate-fade-in space-y-6">
              <div className="flex items-center justify-between">
                <div><h2 className="text-lg font-semibold text-white">{t("gw_title")}</h2><p className="text-sm text-gray-500 mt-0.5">{t("gw_desc")}</p></div>
                <div className="flex gap-2">
                  <button onClick={fetchGiveaways} className="text-gray-400 hover:text-white text-sm px-3 py-1.5 border border-[#3f4147] rounded-[4px] transition">↻ Refresh</button>
                  <button onClick={() => setEditGw({ prize: "", minutes: 60, winners: 1, channel_id: null, description: "", required_role_id: null, required_level: null })}
                    className="bg-[#5865F2] hover:bg-[#4752C4] text-white px-3 py-1.5 rounded-[4px] text-sm font-medium transition flex items-center gap-1.5"><Plus size={14} /> {t("gw_create")}</button>
                </div>
              </div>
              {gwLoading ? (
                <div className="py-12 text-center text-gray-500"><Loader2 size={24} className="animate-spin mx-auto mb-2" />Loading…</div>
              ) : giveaways.length === 0 ? (
                <div className="py-12 text-center text-gray-600 border-2 border-dashed border-[#2b2d31] rounded-lg text-sm">{t("gw_empty")}</div>
              ) : (
                <div className="space-y-3">
                  {giveaways.map((gw: any) => {
                    const isActive = !gw.ended && gw.end_time * 1000 > Date.now();
                    const endDate = new Date(gw.end_time * 1000);
                    return (
                      <Card key={gw.id} className="p-4 flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${isActive ? 'bg-[#5865F2]/20 text-[#5865F2]' : 'bg-[#1e1f22] text-gray-500'}`}>
                          <Gift size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-white truncate">{gw.prize}</p>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${isActive ? 'bg-green-500/20 text-green-400' : 'bg-[#1e1f22] text-gray-500'}`}>{isActive ? "ACTIVE" : "ENDED"}</span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                            <span className="flex items-center gap-1"><Hash size={10} />{gw.channel_name}</span>
                            <span className="flex items-center gap-1"><Users size={10} />{gw.participants_count} entries</span>
                            <span className="flex items-center gap-1"><Trophy size={10} />{gw.winners_count} winner{gw.winners_count > 1 ? 's' : ''}</span>
                            <span className="flex items-center gap-1"><Clock size={10} />{endDate.toLocaleDateString()} {endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                        {isActive && (
                          <button onClick={async () => {
                            if (!confirm(`End giveaway "${gw.prize}" now?`)) return;
                            await fetch(`/api/bot/guilds/${id}/giveaways`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "end", giveaway_id: gw.id }) });
                            fetchGiveaways(); showToast("ok", "Giveaway ended!");
                          }} className="text-red-400 hover:bg-red-500/10 p-2 rounded transition" title="End now"><StopCircle size={18} /></button>
                        )}
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ═══ VOICE ═══ */}
          {tab === "voice" && (
            <div className="animate-fade-in space-y-6">
              <div><h2 className="text-lg font-semibold text-white">{t("voice_title")}</h2><p className="text-sm text-gray-500 mt-0.5">{t("voice_desc")}</p></div>
              <Card className="p-5 max-w-xl">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">{t("voice_afk")}</p>
                <p className="text-sm text-gray-400 mb-4">{t("voice_afk_desc")}</p>
                <Toggle value={config.voice_afk?.enabled || false} onChange={v => setN("voice_afk", "enabled", v)} label={t("voice_afk_enabled")} />
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <Field label={t("voice_afk_timeout")}><Input type="number" value={config.voice_afk?.timeout_minutes ?? 15} onChange={(v: any) => setN("voice_afk", "timeout_minutes", v)} /></Field>
                  <Field label={t("voice_afk_channel")}><SearchableSelect value={config.voice_afk?.afk_channel_id} onChange={(v: any) => setN("voice_afk", "afk_channel_id", v)} options={groupedChannels} t={t} placeholder={t("select_channel")} /></Field>
                </div>
              </Card>
              <Card className="p-5 max-w-xl">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">{t("voice_hub")}</p>
                <p className="text-sm text-gray-400 mb-4">{t("voice_hub_desc")}</p>
                <Field label={t("voice_hub_channel")}><SearchableSelect value={config.voice_hub_channel} onChange={(v: any) => set("voice_hub_channel", v)} options={groupedChannels} t={t} placeholder={t("select_channel")} /></Field>
              </Card>
            </div>
          )}

          {/* ═══ LOGS ═══ */}
          {tab === "logs" && (
            <div className="animate-fade-in space-y-6">
              <div><h2 className="text-lg font-semibold text-white">{t("logs_title")}</h2><p className="text-sm text-gray-500 mt-0.5">{t("logs_desc")}</p></div>
              <div className="bg-[#2d2000] border border-[#5a4000] rounded-lg px-4 py-3 max-w-xl flex items-start gap-3"><Info size={18} className="text-yellow-500 flex-shrink-0 mt-0.5" /><p className="text-sm text-yellow-200/80">{t("logs_warn")}</p></div>
              <Card className="p-5 max-w-xl"><Field label={t("logs_channel")} description={t("logs_channel_desc")}><SearchableSelect value={config.logs_channel} onChange={(v: any) => set("logs_channel", v)} options={groupedChannels} t={t} placeholder={t("select_channel")} /></Field></Card>
            </div>
          )}

        </div>
      </div>

      {/* ── Floating Save Bar ── */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none transition-all duration-300 ${dirty ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
        <div className="bg-[#111214] text-white px-5 py-3 rounded-lg shadow-[0_-4px_32px_rgba(0,0,0,0.6)] flex items-center justify-between w-full max-w-xl mx-4 mb-5 border border-[#1e1f22] pointer-events-auto">
          <span className="text-sm font-medium flex items-center gap-2"><AlertCircle size={16} className="text-yellow-500" />{t("unsaved")}</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setConfig(JSON.parse(original))} className="text-sm text-gray-400 hover:text-white px-3 py-1 transition">{t("reset")}</button>
            <button onClick={save} disabled={saving} className="bg-[#23A559] hover:bg-[#1f934f] text-white px-4 py-1.5 rounded-[4px] text-sm font-medium transition disabled:opacity-50 flex items-center gap-1.5">
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}{saving ? t("saving") : t("save")}
            </button>
          </div>
        </div>
      </div>

      {/* ── Toast ── */}
      {toast && (
        <div className={`fixed bottom-20 right-6 z-[60] px-4 py-3 rounded-lg shadow-xl text-sm font-medium flex items-center gap-2 toast-enter ${toast.type === "ok" ? 'bg-[#23A559] text-white' : 'bg-[#ED4245] text-white'}`}>
          {toast.type === "ok" ? <Check size={16} /> : <AlertCircle size={16} />}{toast.msg}
        </div>
      )}

      {/* ══ MODAL: TICKET CATEGORY ══ */}
      <Modal isOpen={!!editTicket} onClose={() => setEditTicket(null)} title={editTicket?.name ? `Edit — ${editTicket.name}` : t("tickets_add_cat")} wide
        onSave={() => {
          const n = { ...(config.ticket_categories || {}) };
          const { id: catId, ...catData } = editTicket;
          n[catId] = catData;
          set("ticket_categories", n); setEditTicket(null);
        }}>
        {editTicket && (<>
          <div className="flex gap-3">
            <div className="w-16"><Field label={t("tickets_cat_emoji")}><Input value={editTicket.emoji} onChange={(v: any) => setEditTicket({ ...editTicket, emoji: v })} className="text-center text-xl" /></Field></div>
            <div className="flex-1"><Field label={t("tickets_cat_name")}><Input value={editTicket.name} onChange={(v: any) => setEditTicket({ ...editTicket, name: v })} /></Field></div>
          </div>
          <Field label={t("tickets_cat_desc")}><Input value={editTicket.description} onChange={(v: any) => setEditTicket({ ...editTicket, description: v })} /></Field>
          <Field label={t("tickets_cat_staff")} description="Select multiple staff roles who can view and manage tickets.">
            <MultiRoleSelect value={editTicket.staff_roles || []} onChange={(v: string[]) => setEditTicket({ ...editTicket, staff_roles: v })} options={config.discord_roles} t={t} placeholder={t("select_role")} />
          </Field>
          <Field label={t("tickets_cat_msg")}><Textarea value={editTicket.open_message} onChange={(v: any) => setEditTicket({ ...editTicket, open_message: v })} rows={3} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Max tickets per member"><Input type="number" value={editTicket.max_tickets ?? 1} onChange={(v: any) => setEditTicket({ ...editTicket, max_tickets: v })} /></Field>
            <Field label={t("tickets_cat_discord")}><SearchableSelect value={editTicket.discord_category_id} onChange={(v: any) => setEditTicket({ ...editTicket, discord_category_id: v })} options={groupedChannels} t={t} placeholder={t("select_channel")} /></Field>
          </div>

          {/* Questions */}
          <div className="border-t border-[#1e1f22] pt-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t("tickets_cat_questions")} ({(editTicket.questions || []).length}/5)</p>
              {(editTicket.questions || []).length < 5 && (
                <button onClick={() => setEditQuestion({ catState: editTicket, index: (editTicket.questions || []).length })}
                  className="text-[#5865F2] text-xs font-medium hover:underline flex items-center gap-1"><Plus size={12} /> {t("tickets_add_question")}</button>
              )}
            </div>
            {(editTicket.questions || []).length === 0 && <p className="text-xs text-gray-600 italic">{t("tickets_cat_questions_hint")}</p>}
            <div className="space-y-2">
              {(editTicket.questions || []).map((q: any, i: number) => (
                <div key={i} className="bg-[#1e1f22] rounded-[4px] border border-[#3f4147] p-3 group">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 min-w-0">
                      <GripVertical size={16} className="text-gray-600 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm text-white font-medium truncate">{q.label || "Untitled"}</p>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          {q.style === "long" ? "📝 Paragraph" : "📋 Short"} · {q.required !== false ? "Required" : "Optional"}
                          {q.placeholder && <span className="ml-1 text-gray-600">· "{q.placeholder}"</span>}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button onClick={() => setEditQuestion({ catState: editTicket, index: i })} className="text-gray-400 hover:text-[#5865F2] p-1 transition" title="Edit"><MessageSquare size={13} /></button>
                      <button onClick={() => { const nq = [...editTicket.questions]; nq.splice(i, 1); setEditTicket({ ...editTicket, questions: nq }); }}
                        className="text-gray-400 hover:text-red-400 p-1 transition" title="Delete"><Trash2 size={13} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>)}
      </Modal>

      {/* ══ MODAL: EDIT QUESTION ══ */}
      <Modal isOpen={!!editQuestion} onClose={() => setEditQuestion(null)} title="Edit Question"
        onSave={() => {
          if (!editQuestion) return;
          const catState = editQuestion.catState;
          const questions = [...(catState.questions || [])];
          const q = questions[editQuestion.index] || {};
          questions[editQuestion.index] = q;
          setEditTicket({ ...catState, questions });
          setEditQuestion(null);
        }}>
        {editQuestion && (() => {
          const q = (editQuestion.catState.questions || [])[editQuestion.index] || { label: "", placeholder: "", description: "", required: true, style: "short" };
          const updateQ = (field: string, val: any) => {
            const catState = { ...editQuestion.catState };
            const questions = [...(catState.questions || [])];
            if (!questions[editQuestion.index]) questions[editQuestion.index] = { label: "", placeholder: "", description: "", required: true, style: "short" };
            questions[editQuestion.index] = { ...questions[editQuestion.index], [field]: val };
            catState.questions = questions;
            setEditQuestion({ ...editQuestion, catState });
          };
          return (<>
            <Field label="Label *" description="The question title shown to the user.">
              <Input value={q.label} onChange={(v: any) => updateQ("label", v)} placeholder="e.g. What is your issue?" />
            </Field>
            <Field label="Style">
              <select value={q.style || "short"} onChange={e => updateQ("style", e.target.value)}
                className="w-full bg-[#1e1f22] border border-[#3f4147] hover:border-[#5865F2] rounded-[4px] px-3 py-[10px] text-sm text-white focus:outline-none transition-colors">
                <option value="short">📋 Short (single line)</option>
                <option value="long">📝 Paragraph (multi-line)</option>
              </select>
            </Field>
            <Field label="Description" description="Explanation text shown above the input field.">
              <Input value={q.description} onChange={(v: any) => updateQ("description", v)} placeholder="Tell us exactly what you want to give." />
            </Field>
            <Field label="Placeholder" description="Greyed-out hint text inside the input.">
              <Input value={q.placeholder} onChange={(v: any) => updateQ("placeholder", v)} placeholder="Enter your answer here..." />
            </Field>
            <div className="flex items-center gap-3 pt-2">
              <div className={`toggle-switch ${q.required !== false ? 'active' : ''}`} onClick={() => updateQ("required", q.required === false)} />
              <span className="text-sm text-gray-300">Required</span>
            </div>
          </>);
        })()}
      </Modal>

      {/* ══ MODAL: SHOP ITEM ══ */}
      <Modal isOpen={!!editShop} onClose={() => setEditShop(null)} title={editShop?._index !== undefined ? t("modify") : t("shop_add")}
        onSave={() => { const ns = [...(config.shop || [])]; const item = { id: editShop.id, name: editShop.name, description: editShop.description, price: editShop.price, stock: editShop.stock, roles: editShop.roles }; if (editShop._index !== undefined) ns[editShop._index] = item; else ns.push(item); set("shop", ns); setEditShop(null); }}>
        {editShop && (<>
          <Field label={t("shop_item_name")}><Input value={editShop.name} onChange={(v: any) => setEditShop({ ...editShop, name: v })} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label={t("shop_item_price")}><Input type="number" value={editShop.price} onChange={(v: any) => setEditShop({ ...editShop, price: v })} /></Field>
            <Field label={t("shop_item_stock")}><Input type="number" value={editShop.stock} onChange={(v: any) => setEditShop({ ...editShop, stock: v })} /></Field>
          </div>
          <Field label={t("shop_item_desc")}><Textarea value={editShop.description} onChange={(v: any) => setEditShop({ ...editShop, description: v })} rows={3} /></Field>
          <Field label={t("shop_item_role")} description={t("shop_item_role_hint")}><SearchableSelect value={editShop.roles?.[0]} onChange={(v: any) => setEditShop({ ...editShop, roles: v ? [v] : [] })} options={config.discord_roles} isRole t={t} placeholder={t("select_role")} /></Field>
          {editShop._index !== undefined && (
            <div className="pt-3 border-t border-[#1e1f22]"><button onClick={() => { const ns = [...config.shop]; ns.splice(editShop._index, 1); set("shop", ns); setEditShop(null); }} className="text-red-400 hover:underline text-xs">{t("shop_delete")}</button></div>
          )}
        </>)}
      </Modal>

      {/* ══ MODAL: CREATE GIVEAWAY ══ */}
      <Modal isOpen={!!editGw} onClose={() => setEditGw(null)} title={t("gw_create")}
        onSave={async () => {
          if (!editGw.prize || !editGw.channel_id) { showToast("err", "Prize and channel are required."); return; }
          try {
            const r = await fetch(`/api/bot/guilds/${id}/giveaways`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "create", ...editGw }) });
            const d = await r.json();
            if (d.success) { showToast("ok", `Giveaway #${d.giveaway_id} created!`); setEditGw(null); fetchGiveaways(); }
            else showToast("err", d.error || "Failed");
          } catch (e: any) { showToast("err", e.message); }
        }} saveLabel={t("gw_launch")}>
        {editGw && (<>
          <Field label={t("gw_prize")}><Input value={editGw.prize} onChange={(v: any) => setEditGw({ ...editGw, prize: v })} placeholder="e.g. Nitro, VIP Role..." /></Field>
          <Field label={t("gw_description")}><Textarea value={editGw.description} onChange={(v: any) => setEditGw({ ...editGw, description: v })} rows={2} placeholder="Optional details about the giveaway." /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label={t("gw_duration")}><Input type="number" value={editGw.minutes} onChange={(v: any) => setEditGw({ ...editGw, minutes: v })} /></Field>
            <Field label={t("gw_winners")}><Input type="number" value={editGw.winners} onChange={(v: any) => setEditGw({ ...editGw, winners: v })} /></Field>
          </div>
          <Field label={t("gw_channel")}><SearchableSelect value={editGw.channel_id} onChange={(v: any) => setEditGw({ ...editGw, channel_id: v })} options={groupedChannels} t={t} placeholder={t("select_channel")} /></Field>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider pt-2">Conditions (optional)</p>
          <div className="grid grid-cols-2 gap-3">
            <Field label={t("gw_req_role")}><SearchableSelect value={editGw.required_role_id} onChange={(v: any) => setEditGw({ ...editGw, required_role_id: v })} options={config.discord_roles} isRole t={t} placeholder={t("select_role")} /></Field>
            <Field label={t("gw_req_level")}><Input type="number" value={editGw.required_level} onChange={(v: any) => setEditGw({ ...editGw, required_level: v || null })} placeholder="0" /></Field>
          </div>
        </>)}
      </Modal>

    </div>
  );
}
