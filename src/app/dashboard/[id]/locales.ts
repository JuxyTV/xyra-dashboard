export const dict: Record<string, Record<string, string>> = {
  en: {
    back: "Back to Servers",
    title: "Control Panel",
    desc: "Configure Xyra's behavior in real-time.",
    save: "Save Changes",
    saving: "Saving...",
    success: "✅ Configuration saved successfully!",
    error: "❌ Error while saving:",
    tab_general: "General",
    tab_welcome: "Welcome",
    tab_automod: "Auto-Mod",
    tab_tickets: "Tickets",
    tab_supporter: "Supporter",
    tab_shop: "Shop",
    tab_voice: "Voice AFK",
    tab_logs: "Logs",
    
    // Welcome
    welcome_title: "Welcome System",
    welcome_preview: "Discord Preview",
    welcome_channel: "Welcome Channel",
    welcome_bg: "Background Image (URL)",
    welcome_msg: "Custom Message",
    welcome_autorole: "Auto-Role (given on join)",
    welcome_vars: "Available variables: {user}, {server}",
    
    // Selects
    select_channel: "-- Select a channel --",
    select_role: "-- Select a role --",
    no_roles: "No roles available",
    no_channels: "No channels available",

    // Tickets
    tickets_title: "Ticket System",
    tickets_category: "Ticket Categories",
    tickets_add_cat: "+ Add a category",
    tickets_panel: "Panel Channel",
    tickets_logs: "Logs Channel",
    
    // Common
    name: "Name",
    desc_label: "Description",
    emoji: "Emoji",
    required: "Required",
    delete: "Delete",
    add: "Add"
  },
  fr: {
    back: "Retour aux Serveurs",
    title: "Tour de Contrôle",
    desc: "Configure le comportement de Xyra en temps réel.",
    save: "Sauvegarder",
    saving: "Sauvegarde...",
    success: "✅ Configuration enregistrée avec succès !",
    error: "❌ Erreur de sauvegarde :",
    tab_general: "Général",
    tab_welcome: "Accueil",
    tab_automod: "Auto-Mod",
    tab_tickets: "Tickets",
    tab_supporter: "Supporter",
    tab_shop: "Boutique",
    tab_voice: "Vocal AFK",
    tab_logs: "Logs",

    // Welcome
    welcome_title: "Système de Bienvenue",
    welcome_preview: "Aperçu Discord",
    welcome_channel: "Salon de Bienvenue",
    welcome_bg: "Image de fond (URL)",
    welcome_msg: "Message personnalisé",
    welcome_autorole: "Auto-Rôle (donné à l'arrivée)",
    welcome_vars: "Variables dispo: {user}, {server}",
    
    // Selects
    select_channel: "-- Sélectionner un salon --",
    select_role: "-- Sélectionner un rôle --",
    no_roles: "Aucun rôle disponible",
    no_channels: "Aucun salon disponible",

    // Tickets
    tickets_title: "Système de Tickets",
    tickets_category: "Catégories de Tickets",
    tickets_add_cat: "+ Ajouter une catégorie",
    tickets_panel: "Salon d'envoi du Panel",
    tickets_logs: "Salon des Logs",

    // Common
    name: "Nom",
    desc_label: "Description",
    emoji: "Emoji",
    required: "Obligatoire",
    delete: "Supprimer",
    add: "Ajouter"
  }
};

export function useTranslation(lang: string) {
  return (key: string) => dict[lang]?.[key] || dict["en"][key] || key;
}
