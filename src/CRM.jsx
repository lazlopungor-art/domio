import { useState, useEffect } from "react"
import { useUser } from "@clerk/clerk-react"
import { supabase } from "./supabase"

const PIPELINE_STAGES_FR = ["Prospect", "Visite", "Offre", "Négociation", "Signé"]
const PIPELINE_STAGES_EN = ["Prospect", "Visit", "Offer", "Negotiation", "Signed"]

const STAGE_COLORS = {
  "Prospect": "#8B7355", "Visite": "#6B8CA1", "Visit": "#6B8CA1",
  "Offre": "#A17B4B", "Offer": "#A17B4B",
  "Négociation": "#7B6BA1", "Negotiation": "#7B6BA1",
  "Signé": "#4B8C6B", "Signed": "#4B8C6B"
}

export default function CRM({ onBack, lang = "fr" }) {
  const isFr = lang === "fr"
  const PIPELINE_STAGES = isFr ? PIPELINE_STAGES_FR : PIPELINE_STAGES_EN
  const { user, isLoaded } = useUser()
const userId = user?.id

if (!isLoaded) return (
  <div style={{ minHeight: "100vh", background: "#F7F4EF", fontFamily: "Georgia, serif", display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div style={{ color: "#8B7355", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase" }}>
      {isFr ? "Chargement..." : "Loading..."}
    </div>
  </div>
)

  const [activeTab, setActiveTab] = useState("dashboard")
  const [contacts, setContacts] = useState([])
  const [biens, setBiens] = useState([])
  const [loadingData, setLoadingData] = useState(true)
  const [showAddContact, setShowAddContact] = useState(false)
  const [showAddBien, setShowAddBien] = useState(false)
  const [newContact, setNewContact] = useState({ nom: "", type: isFr ? "Acheteur" : "Buyer", email: "", tel: "", budget: "", note: "" })
  const [newBien, setNewBien] = useState({ titre: "", type: isFr ? "Maison" : "House", ville: "", surface: "", prix: "", statut: isFr ? "Disponible" : "Available", stage: "Prospect" })
  const [dragBien, setDragBien] = useState(null)

  // CHARGER LES DONNÉES
  useEffect(() => {
    if (!userId) return
    loadData()
  }, [userId])

  const loadData = async () => {
    setLoadingData(true)
    try {
      const { data: contactsData } = await supabase
        .from("contacts")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      const { data: biensData } = await supabase
        .from("biens")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      setContacts(contactsData || [])
      setBiens(biensData || [])
    } catch (e) {
      console.error("Erreur chargement:", e)
    }
    setLoadingData(false)
  }

  const addContact = async () => {
    if (!newContact.nom) return
    const { data, error } = await supabase
      .from("contacts")
      .insert([{ ...newContact, user_id: userId }])
      .select()
    if (!error && data) {
      setContacts([data[0], ...contacts])
      setNewContact({ nom: "", type: isFr ? "Acheteur" : "Buyer", email: "", tel: "", budget: "", note: "" })
      setShowAddContact(false)
    }
  }

  const addBien = async () => {
    if (!newBien.titre) return
    const { data, error } = await supabase
      .from("biens")
      .insert([{ ...newBien, user_id: userId }])
      .select()
    if (!error && data) {
      setBiens([data[0], ...biens])
      setNewBien({ titre: "", type: isFr ? "Maison" : "House", ville: "", surface: "", prix: "", statut: isFr ? "Disponible" : "Available", stage: "Prospect" })
      setShowAddBien(false)
    }
  }

  const deleteContact = async (id) => {
    await supabase.from("contacts").delete().eq("id", id)
    setContacts(contacts.filter(c => c.id !== id))
  }

  const deleteBien = async (id) => {
    await supabase.from("biens").delete().eq("id", id)
    setBiens(biens.filter(b => b.id !== id))
  }

  const moveBien = async (stage) => {
    if (!dragBien) return
    await supabase.from("biens").update({ stage }).eq("id", dragBien)
    setBiens(biens.map(b => b.id === dragBien ? { ...b, stage } : b))
    setDragBien(null)
  }

  const valeurTotale = biens.reduce((sum, b) => sum + parseInt(b.prix?.replace(/\s/g, "") || 0), 0)
  const stats = {
    contacts: contacts.length,
    biens: biens.length,
    disponibles: biens.filter(b => b.statut === "Disponible" || b.statut === "Available").length,
    signes: biens.filter(b => b.stage === "Signé" || b.stage === "Signed").length,
    valeur: valeurTotale.toLocaleString("fr-FR")
  }

  const TABS = [
    { id: "dashboard", label: isFr ? "Tableau de bord" : "Dashboard", icon: "◈" },
    { id: "contacts", label: "Contacts", icon: "👥" },
    { id: "biens", label: isFr ? "Biens" : "Properties", icon: "🏠" },
    { id: "pipeline", label: "Pipeline", icon: "◆" },
  ]
  if (!userId) return (
    <div style={{ minHeight: "100vh", background: "#F7F4EF", fontFamily: "Georgia, serif", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1rem" }}>
      <div style={{ color: "#8B7355", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase" }}>{isFr ? "Connectez-vous pour accéder au CRM" : "Sign in to access the CRM"}</div>
      <button onClick={onBack} style={{ background: "#1C160E", border: "none", color: "#D4BD96", padding: "0.7rem 1.25rem", borderRadius: 2, cursor: "pointer", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "Georgia, serif" }}>
        ← {isFr ? "Retour" : "Back"}
      </button>
    </div>
  )
  if (loadingData) return (
    <div style={{ minHeight: "100vh", background: "#F7F4EF", fontFamily: "Georgia, serif", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "flex", gap: 8 }}>
        {[0, 1, 2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "#8B7355", animation: "fade 1.4s infinite", animationDelay: `${i * 0.3}s` }} />)}
      </div>
      <div style={{ color: "#8B7355", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase" }}>{isFr ? "Chargement..." : "Loading..."}</div>
      <style>{`@keyframes fade { 0%,100%{opacity:.2;transform:scale(.8)} 50%{opacity:1;transform:scale(1.1)} }`}</style>
    </div>
  )

  return (
    <div style={{ minHeight: "100vh", background: "#F7F4EF", fontFamily: "Georgia, serif", boxSizing: "border-box", overflowX: "hidden" }}>

      {/* HEADER */}
      <header style={{ background: "#1C160E", padding: "0 1.5rem", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, borderBottom: "1px solid rgba(212,189,150,0.15)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", cursor: "pointer" }} onClick={onBack}>
            <div style={{ width: 30, height: 30, border: "1px solid rgba(212,189,150,0.4)", borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", color: "#D4BD96", fontSize: 14 }}>⌂</div>
            <span style={{ color: "#D4BD96", fontSize: "0.85rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>Copyimo CRM</span>
          </div>
          <div style={{ width: 1, height: 24, background: "rgba(212,189,150,0.2)" }} />
          <nav style={{ display: "flex" }}>
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                padding: "0.4rem 0.8rem", cursor: "pointer", fontSize: 10,
                letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "Georgia, serif",
                border: "none", background: "transparent",
                color: activeTab === tab.id ? "#D4BD96" : "rgba(212,189,150,0.35)",
                borderBottom: activeTab === tab.id ? "2px solid #D4BD96" : "2px solid transparent",
                marginBottom: -1
              }}>
                {tab.icon} &nbsp; {tab.label}
              </button>
            ))}
          </nav>
        </div>
        <button onClick={onBack} style={{ background: "transparent", border: "1px solid rgba(212,189,150,0.25)", color: "rgba(212,189,150,0.5)", padding: "0.35rem 0.8rem", borderRadius: 2, cursor: "pointer", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "Georgia, serif" }}>
          ← {isFr ? "Retour" : "Back"}
        </button>
      </header>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1.5rem", boxSizing: "border-box", width: "100%" }}>

        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <div>
            <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "0.5rem" }}>
              <div>
                <div style={{ fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", color: "#8B7355", marginBottom: "0.4rem" }}>✦ &nbsp; {isFr ? "Tableau de bord" : "Dashboard"}</div>
                <h1 style={{ fontSize: "clamp(1.3rem, 3vw, 1.8rem)", fontWeight: "normal", color: "#1C160E", margin: 0 }}>
                  {isFr ? "Bonjour —" : "Welcome —"} <span style={{ color: "#8B7355", fontStyle: "italic" }}>{isFr ? "votre activité du jour" : "your activity today"}</span>
                </h1>
              </div>
              <div style={{ fontSize: "0.75rem", color: "#B8A88A", letterSpacing: "0.08em" }}>
                {new Date().toLocaleDateString(isFr ? "fr-FR" : "en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
              {[
                { label: isFr ? "Contacts" : "Contacts", value: stats.contacts, icon: "👥", accent: "#6B8CA1" },
                { label: isFr ? "Biens" : "Properties", value: stats.biens, icon: "🏠", accent: "#8B7355" },
                { label: isFr ? "Disponibles" : "Available", value: stats.disponibles, icon: "✅", accent: "#4B8C6B" },
                { label: isFr ? "Signés" : "Signed", value: stats.signes, icon: "🎉", accent: "#7B6BA1" },
              ].map((s, i) => (
                <div key={i} style={{ background: "#FFFDF9", borderRadius: 2, padding: "1.25rem", border: "1px solid #EAE2D6", boxShadow: "0 1px 6px rgba(44,36,22,0.05)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                    <div style={{ fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "#B8A88A" }}>{s.label}</div>
                    <span style={{ fontSize: "1rem" }}>{s.icon}</span>
                  </div>
                  <div style={{ fontSize: "2rem", color: "#1C160E", lineHeight: 1, marginBottom: "0.75rem" }}>{s.value}</div>
                  <div style={{ height: 2, background: "#EAE2D6", borderRadius: 1 }}>
                    <div style={{ height: "100%", width: `${Math.min((parseInt(s.value) / 5) * 100, 100)}%`, background: s.accent, borderRadius: 1 }} />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: "#1C160E", borderRadius: 2, padding: "1.5rem 2rem", marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <div style={{ fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(212,189,150,0.5)", marginBottom: "0.4rem" }}>◆ &nbsp; {isFr ? "Valeur totale du portefeuille" : "Total portfolio value"}</div>
                <div style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)", color: "#D4BD96" }}>{stats.valeur} €</div>
              </div>
              <div style={{ display: "flex", gap: "2rem" }}>
                {[
                  { label: isFr ? "Biens actifs" : "Active", value: stats.biens },
                  { label: isFr ? "En cours" : "In progress", value: biens.filter(b => b.stage !== "Signé" && b.stage !== "Signed").length },
                ].map((s, i) => (
                  <div key={i} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "1.5rem", color: "#D4BD96" }}>{s.value}</div>
                    <div style={{ fontSize: 9, color: "rgba(212,189,150,0.4)", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
              <div style={{ background: "#FFFDF9", borderRadius: 2, border: "1px solid #EAE2D6", overflow: "hidden", boxShadow: "0 1px 6px rgba(44,36,22,0.05)" }}>
                <div style={{ padding: "1rem 1.25rem", background: "#F5F0E8", borderBottom: "1px solid #EAE2D6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "#8B7355" }}>👥 &nbsp; {isFr ? "Contacts récents" : "Recent contacts"}</div>
                  <button onClick={() => setActiveTab("contacts")} style={{ background: "none", border: "none", color: "#8B7355", cursor: "pointer", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "Georgia, serif" }}>{isFr ? "Voir tous →" : "View all →"}</button>
                </div>
                {contacts.length === 0 ? (
                  <div style={{ padding: "2rem", textAlign: "center", color: "#B8A88A", fontSize: "0.8rem", fontStyle: "italic" }}>
                    {isFr ? "Aucun contact pour l'instant" : "No contacts yet"}
                  </div>
                ) : contacts.slice(0, 3).map((c, i) => (
                  <div key={c.id} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1.25rem", borderBottom: i < 2 ? "1px solid #F7F4EF" : "none" }}>
                    <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#EEF8F2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", fontWeight: "bold", color: "#4B8C6B", flexShrink: 0 }}>
                      {c.nom.charAt(0)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "0.82rem", fontWeight: "bold", color: "#1C160E", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.nom}</div>
                      <div style={{ fontSize: "0.72rem", color: "#B8A88A", marginTop: 1 }}>{c.budget ? `${c.budget} €` : ""} · {c.type}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background: "#FFFDF9", borderRadius: 2, border: "1px solid #EAE2D6", overflow: "hidden", boxShadow: "0 1px 6px rgba(44,36,22,0.05)" }}>
                <div style={{ padding: "1rem 1.25rem", background: "#F5F0E8", borderBottom: "1px solid #EAE2D6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "#8B7355" }}>🏠 &nbsp; {isFr ? "Biens récents" : "Recent properties"}</div>
                  <button onClick={() => setActiveTab("biens")} style={{ background: "none", border: "none", color: "#8B7355", cursor: "pointer", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "Georgia, serif" }}>{isFr ? "Voir tous →" : "View all →"}</button>
                </div>
                {biens.length === 0 ? (
                  <div style={{ padding: "2rem", textAlign: "center", color: "#B8A88A", fontSize: "0.8rem", fontStyle: "italic" }}>
                    {isFr ? "Aucun bien pour l'instant" : "No properties yet"}
                  </div>
                ) : biens.slice(0, 3).map((b, i) => (
                  <div key={b.id} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1.25rem", borderBottom: i < 2 ? "1px solid #F7F4EF" : "none" }}>
                    <div style={{ width: 34, height: 34, borderRadius: 3, background: "#F5F0E8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", flexShrink: 0 }}>⌂</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "0.82rem", fontWeight: "bold", color: "#1C160E", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.titre}</div>
                      <div style={{ fontSize: "0.72rem", color: "#B8A88A", marginTop: 1 }}>{b.ville} · {b.surface} m²</div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontSize: "0.78rem", fontWeight: "bold", color: "#1C160E" }}>{b.prix} €</div>
                      <div style={{ fontSize: 8, padding: "1px 6px", borderRadius: 10, background: "#EEF8F2", color: "#4B8C6B", marginTop: 2 }}>{b.statut}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CONTACTS */}
        {activeTab === "contacts" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem", flexWrap: "wrap", gap: "0.5rem" }}>
              <div>
                <div style={{ fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", color: "#8B7355", marginBottom: "0.4rem" }}>✦ &nbsp; Contacts</div>
                <h1 style={{ fontSize: "clamp(1.3rem, 3vw, 1.8rem)", fontWeight: "normal", color: "#1C160E", margin: 0 }}>{contacts.length} {isFr ? "contacts" : "contacts"}</h1>
              </div>
              <button onClick={() => setShowAddContact(!showAddContact)} style={{ background: "#1C160E", border: "none", color: "#D4BD96", padding: "0.7rem 1.25rem", borderRadius: 2, cursor: "pointer", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "Georgia, serif" }}>
                ✦ &nbsp; {isFr ? "Nouveau" : "New"}
              </button>
            </div>

            {showAddContact && (
              <div style={{ background: "#FFFDF9", border: "1px solid #D4BD96", borderRadius: 2, padding: "1.5rem", marginBottom: "1.5rem", boxShadow: "0 4px 20px rgba(44,36,22,0.08)" }}>
                <div style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "#8B7355", marginBottom: "1rem", paddingBottom: "0.75rem", borderBottom: "1px solid #EAE2D6" }}>◈ &nbsp; {isFr ? "Nouveau contact" : "New contact"}</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.75rem", marginBottom: "1rem" }}>
                  {[
                    { key: "nom", label: isFr ? "Nom complet" : "Full name", placeholder: "Martin Sophie" },
                    { key: "email", label: "Email", placeholder: "email@exemple.com" },
                    { key: "tel", label: isFr ? "Téléphone" : "Phone", placeholder: "06 12 34 56 78" },
                    { key: "budget", label: "Budget €", placeholder: "350 000" },
                  ].map(f => (
                    <div key={f.key}>
                      <div style={labelStyle}>{f.label}</div>
                      <input value={newContact[f.key]} onChange={e => setNewContact({ ...newContact, [f.key]: e.target.value })} placeholder={f.placeholder} style={inputStyle} />
                    </div>
                  ))}
                  <div>
                    <div style={labelStyle}>Type</div>
                    <select value={newContact.type} onChange={e => setNewContact({ ...newContact, type: e.target.value })} style={inputStyle}>
                      {isFr ? <><option>Acheteur</option><option>Vendeur</option><option>Les deux</option></> : <><option>Buyer</option><option>Seller</option><option>Both</option></>}
                    </select>
                  </div>
                  <div>
                    <div style={labelStyle}>Note</div>
                    <input value={newContact.note} onChange={e => setNewContact({ ...newContact, note: e.target.value })} placeholder={isFr ? "Recherche..." : "Looking for..."} style={inputStyle} />
                  </div>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button onClick={addContact} style={{ background: "#1C160E", border: "none", color: "#D4BD96", padding: "0.7rem 1.25rem", borderRadius: 2, cursor: "pointer", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "Georgia, serif" }}>✦ {isFr ? "Sauvegarder" : "Save"}</button>
                  <button onClick={() => setShowAddContact(false)} style={{ background: "transparent", border: "1px solid #EAE2D6", color: "#8B7355", padding: "0.7rem 1rem", borderRadius: 2, cursor: "pointer", fontSize: 10, fontFamily: "Georgia, serif" }}>{isFr ? "Annuler" : "Cancel"}</button>
                </div>
              </div>
            )}

            <div style={{ background: "#FFFDF9", border: "1px solid #EAE2D6", borderRadius: 2, overflow: "hidden", boxShadow: "0 1px 6px rgba(44,36,22,0.05)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1.5fr 1fr auto", gap: "1rem", padding: "0.75rem 1.25rem", background: "#F5F0E8", borderBottom: "1px solid #EAE2D6" }}>
                {[isFr ? "Nom" : "Name", "Type", "Email", "Budget", ""].map((h, i) => (
                  <div key={i} style={{ fontSize: 8, letterSpacing: "0.2em", textTransform: "uppercase", color: "#B8A88A" }}>{h}</div>
                ))}
              </div>
              {contacts.length === 0 ? (
                <div style={{ padding: "3rem", textAlign: "center", color: "#B8A88A", fontSize: "0.85rem", fontStyle: "italic" }}>
                  {isFr ? "Aucun contact — ajoutez votre premier contact !" : "No contacts — add your first contact!"}
                </div>
              ) : contacts.map((c, i) => (
                <div key={c.id} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1.5fr 1fr auto", gap: "1rem", padding: "1rem 1.25rem", borderBottom: i < contacts.length - 1 ? "1px solid #F7F4EF" : "none", alignItems: "center", background: i % 2 === 0 ? "#FFFDF9" : "#FDFAF6" }}>
                  <div>
                    <div style={{ fontSize: "0.85rem", fontWeight: "bold", color: "#1C160E" }}>{c.nom}</div>
                    {c.note && <div style={{ fontSize: "0.7rem", color: "#B8A88A", fontStyle: "italic", marginTop: 2 }}>{c.note}</div>}
                  </div>
                  <div style={{ fontSize: 8, padding: "3px 8px", borderRadius: 20, background: "#EEF8F2", color: "#4B8C6B", display: "inline-block" }}>{c.type}</div>
                  <div style={{ fontSize: "0.78rem", color: "#8B7355", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.email}</div>
                  <div style={{ fontSize: "0.82rem", color: "#1C160E", fontWeight: "bold" }}>{c.budget} €</div>
                  <button onClick={() => deleteContact(c.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#C08080", fontSize: 16, lineHeight: 1, padding: 0 }}>×</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BIENS */}
        {activeTab === "biens" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem", flexWrap: "wrap", gap: "0.5rem" }}>
              <div>
                <div style={{ fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", color: "#8B7355", marginBottom: "0.4rem" }}>✦ &nbsp; {isFr ? "Biens" : "Properties"}</div>
                <h1 style={{ fontSize: "clamp(1.3rem, 3vw, 1.8rem)", fontWeight: "normal", color: "#1C160E", margin: 0 }}>{biens.length} {isFr ? "biens en portefeuille" : "properties"}</h1>
              </div>
              <button onClick={() => setShowAddBien(!showAddBien)} style={{ background: "#1C160E", border: "none", color: "#D4BD96", padding: "0.7rem 1.25rem", borderRadius: 2, cursor: "pointer", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "Georgia, serif" }}>
                ✦ &nbsp; {isFr ? "Nouveau" : "New"}
              </button>
            </div>

            {showAddBien && (
              <div style={{ background: "#FFFDF9", border: "1px solid #D4BD96", borderRadius: 2, padding: "1.5rem", marginBottom: "1.5rem", boxShadow: "0 4px 20px rgba(44,36,22,0.08)" }}>
                <div style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "#8B7355", marginBottom: "1rem", paddingBottom: "0.75rem", borderBottom: "1px solid #EAE2D6" }}>◈ &nbsp; {isFr ? "Nouveau bien" : "New property"}</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.75rem", marginBottom: "1rem" }}>
                  {[
                    { key: "titre", label: isFr ? "Titre" : "Title", placeholder: isFr ? "Villa avec piscine" : "Villa with pool" },
                    { key: "ville", label: isFr ? "Ville" : "City", placeholder: "Paris" },
                    { key: "surface", label: "m²", placeholder: "120" },
                    { key: "prix", label: "Prix €", placeholder: "350 000" },
                  ].map(f => (
                    <div key={f.key}>
                      <div style={labelStyle}>{f.label}</div>
                      <input value={newBien[f.key]} onChange={e => setNewBien({ ...newBien, [f.key]: e.target.value })} placeholder={f.placeholder} style={inputStyle} />
                    </div>
                  ))}
                  <div>
                    <div style={labelStyle}>Type</div>
                    <select value={newBien.type} onChange={e => setNewBien({ ...newBien, type: e.target.value })} style={inputStyle}>
                      {isFr ? ["Maison", "Appartement", "Villa", "Terrain", "Local"].map(t => <option key={t}>{t}</option>) : ["House", "Apartment", "Villa", "Land", "Commercial"].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <div style={labelStyle}>Statut</div>
                    <select value={newBien.statut} onChange={e => setNewBien({ ...newBien, statut: e.target.value })} style={inputStyle}>
                      {isFr ? ["Disponible", "En négociation", "Vendu", "Retiré"].map(s => <option key={s}>{s}</option>) : ["Available", "In negotiation", "Sold", "Withdrawn"].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button onClick={addBien} style={{ background: "#1C160E", border: "none", color: "#D4BD96", padding: "0.7rem 1.25rem", borderRadius: 2, cursor: "pointer", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "Georgia, serif" }}>✦ {isFr ? "Sauvegarder" : "Save"}</button>
                  <button onClick={() => setShowAddBien(false)} style={{ background: "transparent", border: "1px solid #EAE2D6", color: "#8B7355", padding: "0.7rem 1rem", borderRadius: 2, cursor: "pointer", fontSize: 10, fontFamily: "Georgia, serif" }}>{isFr ? "Annuler" : "Cancel"}</button>
                </div>
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
              {biens.length === 0 ? (
                <div style={{ padding: "3rem", textAlign: "center", color: "#B8A88A", fontSize: "0.85rem", fontStyle: "italic", background: "#FFFDF9", border: "1px solid #EAE2D6", borderRadius: 2 }}>
                  {isFr ? "Aucun bien — ajoutez votre premier bien !" : "No properties — add your first property!"}
                </div>
              ) : biens.map(b => (
                <div key={b.id} style={{ background: "#FFFDF9", border: "1px solid #EAE2D6", borderRadius: 2, overflow: "hidden", boxShadow: "0 1px 6px rgba(44,36,22,0.05)" }}>
                  <div style={{ background: "#1C160E", padding: "1rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ color: "#D4BD96", fontSize: "0.88rem", fontWeight: "bold", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.titre}</div>
                      <div style={{ color: "rgba(212,189,150,0.45)", fontSize: "0.72rem", marginTop: 3 }}>{b.type} · {b.ville}</div>
                    </div>
                    <button onClick={() => deleteBien(b.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(212,189,150,0.3)", fontSize: 16, marginLeft: "0.5rem", flexShrink: 0 }}>×</button>
                  </div>
                  <div style={{ padding: "1.25rem" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1rem" }}>
                      <div style={{ background: "#F7F4EF", padding: "0.6rem 0.75rem", borderRadius: 2 }}>
                        <div style={{ fontSize: 8, letterSpacing: "0.15em", textTransform: "uppercase", color: "#B8A88A" }}>{isFr ? "Surface" : "Area"}</div>
                        <div style={{ fontSize: "0.9rem", color: "#1C160E", fontWeight: "bold", marginTop: 3 }}>{b.surface} m²</div>
                      </div>
                      <div style={{ background: "#F7F4EF", padding: "0.6rem 0.75rem", borderRadius: 2 }}>
                        <div style={{ fontSize: 8, letterSpacing: "0.15em", textTransform: "uppercase", color: "#B8A88A" }}>{isFr ? "Prix" : "Price"}</div>
                        <div style={{ fontSize: "0.9rem", color: "#1C160E", fontWeight: "bold", marginTop: 3 }}>{b.prix} €</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
                      <div style={{ fontSize: 8, padding: "3px 8px", borderRadius: 10, background: "#EEF8F2", color: "#4B8C6B" }}>{b.statut}</div>
                      <div style={{ fontSize: 8, padding: "3px 8px", borderRadius: 10, background: "#F5F0E8", color: STAGE_COLORS[b.stage] || "#8B7355" }}>{b.stage}</div>
                    </div>
                    <button style={{ width: "100%", padding: "0.6rem", background: "#F5F0E8", border: "1px solid #EAE2D6", color: "#8B7355", borderRadius: 2, cursor: "pointer", fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "Georgia, serif" }}>
                      ✦ {isFr ? "Générer annonce" : "Generate listing"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PIPELINE */}
        {activeTab === "pipeline" && (
          <div>
            <div style={{ marginBottom: "2rem" }}>
              <div style={{ fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", color: "#8B7355", marginBottom: "0.4rem" }}>✦ &nbsp; Pipeline</div>
              <h1 style={{ fontSize: "clamp(1.3rem, 3vw, 1.8rem)", fontWeight: "normal", color: "#1C160E", margin: 0 }}>{isFr ? "Suivi des ventes" : "Sales tracking"}</h1>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: `repeat(${PIPELINE_STAGES.length}, minmax(160px, 1fr))`, gap: "0.75rem", overflowX: "auto", paddingBottom: "0.5rem" }}>
              {PIPELINE_STAGES.map(stage => (
                <div
                  key={stage}
                  onDragOver={e => e.preventDefault()}
                  onDrop={() => moveBien(stage)}
                  style={{ background: "#FFFDF9", border: "1px solid #EAE2D6", borderRadius: 2, overflow: "hidden", minHeight: 280, boxShadow: "0 1px 6px rgba(44,36,22,0.05)" }}
                >
                  <div style={{ padding: "0.75rem 1rem", background: "#F5F0E8", borderBottom: `2px solid ${STAGE_COLORS[stage] || "#8B7355"}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", color: STAGE_COLORS[stage] || "#8B7355", fontWeight: "bold" }}>{stage}</div>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", background: STAGE_COLORS[stage] || "#8B7355", color: "white", fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {biens.filter(b => b.stage === stage).length}
                    </div>
                  </div>
                  <div style={{ padding: "0.75rem" }}>
                    {biens.filter(b => b.stage === stage).map(b => (
                      <div
                        key={b.id}
                        draggable
                        onDragStart={() => setDragBien(b.id)}
                        style={{ background: "#FAF7F2", border: "1px solid #EAE2D6", borderLeft: `3px solid ${STAGE_COLORS[stage] || "#8B7355"}`, borderRadius: 2, padding: "0.65rem 0.75rem", marginBottom: "0.5rem", cursor: "grab" }}
                      >
                        <div style={{ fontSize: "0.78rem", fontWeight: "bold", color: "#1C160E", marginBottom: "0.2rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.titre}</div>
                        <div style={{ fontSize: "0.68rem", color: "#8B7355" }}>📍 {b.ville}</div>
                        <div style={{ fontSize: "0.72rem", color: "#1C160E", fontWeight: "bold", marginTop: "0.3rem" }}>{b.prix} €</div>
                      </div>
                    ))}
                    {biens.filter(b => b.stage === stage).length === 0 && (
                      <div style={{ padding: "1.5rem 0.5rem", textAlign: "center", color: "#D4C9B8", fontSize: "0.7rem", fontStyle: "italic", borderRadius: 2, border: "1px dashed #EAE2D6", marginTop: "0.25rem" }}>
                        {isFr ? "Glissez ici" : "Drop here"}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
      <style>{`@keyframes fade { 0%,100%{opacity:.2;transform:scale(.8)} 50%{opacity:1;transform:scale(1.1)} }`}</style>
    </div>
  )
}

const labelStyle = { fontSize: 8, letterSpacing: "0.18em", textTransform: "uppercase", color: "#8B7355", display: "block", marginBottom: 4 }
const inputStyle = { width: "100%", padding: "0.55rem 0.75rem", border: "1px solid #EAE2D6", borderRadius: 2, fontFamily: "Georgia, serif", fontSize: "0.82rem", color: "#1C160E", background: "#FAF7F2", boxSizing: "border-box" }