import { useState } from "react"
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/clerk-react"

export default function App() {
  const [typeBien, setTypeBien] = useState("maison")
  const [ville, setVille] = useState("")
  const [surface, setSurface] = useState("")
  const [prix, setPrix] = useState("")
  const [points, setPoints] = useState("")
  const [typeContenu, setTypeContenu] = useState("annonce")
  const [ton, setTon] = useState("professionnel")
  const [resultat, setResultat] = useState("")
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState("home")

  const generer = async () => {
    if (!ville || !surface || !prix || !points) {
      alert("Merci de remplir tous les champs !")
      return
    }
    setLoading(true)
    setResultat("")
    const prompt = `Tu es un expert en immobilier français haut de gamme. Génère un ${typeContenu} avec un ton ${ton} pour ce bien : Type : ${typeBien}, Ville : ${ville}, Surface : ${surface} m², Prix : ${prix} €, Points forts : ${points}. Génère uniquement le contenu, sans commentaires.`
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_ANTHROPIC_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }]
        })
      })
      const data = await response.json()
      setResultat(data.content[0].text)
    } catch (e) {
      setResultat("Erreur : " + e.message)
    }
    setLoading(false)
  }

  const types = [
    { id: "annonce", label: "Annonce" },
    { id: "linkedin", label: "LinkedIn" },
    { id: "instagram", label: "Instagram" },
    { id: "email", label: "Email" }
  ]

  const tons = [
    { id: "professionnel", label: "Professionnel" },
    { id: "chaleureux", label: "Chaleureux" },
    { id: "luxe", label: "Prestige" }
  ]

  const features = [
    { icon: "◈", title: "4 formats de contenu", desc: "Annonce, post LinkedIn, caption Instagram et email client générés en un clic" },
    { icon: "◈", title: "3 tons différents", desc: "Professionnel, chaleureux ou prestige selon le bien et votre clientèle" },
    { icon: "◈", title: "IA de dernière génération", desc: "Propulsé par Claude, l'IA la plus avancée pour la rédaction professionnelle" },
    { icon: "◈", title: "Copier en un clic", desc: "Copiez directement votre contenu et publiez-le où vous voulez" },
    { icon: "◈", title: "Illimité en Pro", desc: "Générez autant d'annonces que vous voulez, sans restriction" },
    { icon: "◈", title: "100% en français", desc: "Conçu spécifiquement pour le marché immobilier français" }
  ]

  const testimonials = [
    { name: "Sophie M.", role: "Agent immobilier — Paris 16e", text: "Je passais 30 minutes par annonce. Avec copyimo, c'est 30 secondes. Un gain de temps incroyable !" },
    { name: "Jean-Pierre L.", role: "Directeur d'agence — Bordeaux", text: "La qualité des textes générés est bluffante. Mes clients me demandent souvent qui rédige mes annonces." },
    { name: "Marie C.", role: "Négociatrice indépendante — Lyon", text: "Enfin un outil fait pour nous ! Le ton prestige est parfait pour mes biens haut de gamme." }
  ]

  const faqs = [
    { q: "Comment fonctionne l'essai gratuit ?", a: "Vous avez accès à toutes les fonctionnalités pendant 14 jours, sans carte bancaire. À la fin de l'essai, vous choisissez votre plan." },
    { q: "Puis-je annuler à tout moment ?", a: "Oui, sans engagement et sans frais. Vous pouvez annuler votre abonnement en un clic depuis votre espace client." },
    { q: "Les textes sont-ils vraiment uniques ?", a: "Oui, chaque génération est unique. L'IA crée un texte original basé sur les informations que vous fournissez." },
    { q: "Puis-je modifier les textes générés ?", a: "Absolument ! Les textes sont une base de travail que vous pouvez modifier librement avant de les publier." },
    { q: "Copyimo fonctionne-t-il sur mobile ?", a: "Oui, Copyimo est accessible sur tous les appareils : ordinateur, tablette et smartphone." }
  ]

  const Header = () => (
    <header style={{
      background: "#2C2416", padding: "0 3rem", height: 70,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      boxShadow: "0 1px 0 rgba(212,189,150,0.2)", position: "sticky", top: 0, zIndex: 100
    }}>
      <div onClick={() => setPage("home")} style={{ display: "flex", alignItems: "center", gap: "1rem", cursor: "pointer" }}>
        <div style={{ width: 38, height: 38, border: "1px solid rgba(212,189,150,0.5)", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", color: "#D4BD96", fontSize: 18 }}>⌂</div>
        <div>
          <div style={{ color: "#D4BD96", fontSize: "1.15rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>Copyimo</div>
          <div style={{ color: "rgba(212,189,150,0.5)", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase" }}>Rédaction Immobilière</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <SignedOut>
          <SignInButton mode="modal">
            <button style={btnOutlineStyle}>Connexion</button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button style={btnGoldStyle}>Essai gratuit</button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <button onClick={() => setPage("app")} style={btnGoldStyle}>Mon espace</button>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    </header>
  )

  if (page === "app") return (
    <div style={{ minHeight: "100vh", background: "#FAF7F2", fontFamily: "Georgia, serif" }}>
      <Header />
      <div style={{ background: "linear-gradient(180deg, #2C2416 0%, #3D3020 50%, #FAF7F2 100%)", padding: "2.5rem 3rem 4rem", textAlign: "center" }}>
        <h1 style={{ color: "#FAF7F2", fontSize: "1.8rem", fontWeight: "normal", marginBottom: "0.5rem" }}>
          Vos annonces, <span style={{ color: "#D4BD96", fontStyle: "italic" }}>rédigées en un instant</span>
        </h1>
      </div>
      <div style={{ maxWidth: 1000, margin: "-2rem auto 0", padding: "0 2rem 4rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", position: "relative", zIndex: 1 }}>
        <div style={{ background: "#FFFDF9", borderRadius: 2, border: "1px solid #E8DFCF", boxShadow: "0 8px 40px rgba(44,36,22,0.12)", overflow: "hidden" }}>
          <div style={{ padding: "1.25rem 1.75rem", borderBottom: "1px solid #E8DFCF", background: "#F5F0E8" }}>
            <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#8B7355" }}>◈ &nbsp; Détails du bien</div>
          </div>
          <div style={{ padding: "1.75rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <div style={labelStyle}>Format</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "0.4rem", marginTop: 8 }}>
                {types.map(t => (
                  <button key={t.id} onClick={() => setTypeContenu(t.id)} style={{
                    padding: "0.55rem 0.25rem", border: typeContenu === t.id ? "1px solid #8B7355" : "1px solid #E8DFCF",
                    background: typeContenu === t.id ? "#2C2416" : "#FAF7F2",
                    color: typeContenu === t.id ? "#D4BD96" : "#8B7355",
                    borderRadius: 2, cursor: "pointer", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "inherit"
                  }}>{t.label}</button>
                ))}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div><div style={labelStyle}>Type de bien</div>
                <select value={typeBien} onChange={e => setTypeBien(e.target.value)} style={inputStyle}>
                  <option value="appartement">Appartement</option>
                  <option value="maison">Maison</option>
                  <option value="villa">Villa</option>
                  <option value="terrain">Terrain</option>
                  <option value="local">Local commercial</option>
                </select>
              </div>
              <div><div style={labelStyle}>Ville</div>
                <input value={ville} onChange={e => setVille(e.target.value)} placeholder="Paris, Bordeaux..." style={inputStyle} />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div><div style={labelStyle}>Surface (m²)</div>
                <input value={surface} onChange={e => setSurface(e.target.value)} placeholder="120" style={inputStyle} />
              </div>
              <div><div style={labelStyle}>Prix (€)</div>
                <input value={prix} onChange={e => setPrix(e.target.value)} placeholder="350 000" style={inputStyle} />
              </div>
            </div>
            <div><div style={labelStyle}>Atouts du bien</div>
              <textarea value={points} onChange={e => setPoints(e.target.value)} placeholder="Jardin, cuisine rénovée, lumineux..." style={{ ...inputStyle, height: 80, resize: "none" }} />
            </div>
            <div>
              <div style={labelStyle}>Registre</div>
              <div style={{ display: "flex", gap: "0.5rem", marginTop: 8 }}>
                {tons.map(t => (
                  <button key={t.id} onClick={() => setTon(t.id)} style={{
                    flex: 1, padding: "0.55rem", border: ton === t.id ? "1px solid #8B7355" : "1px solid #E8DFCF",
                    background: ton === t.id ? "#F5F0E8" : "#FAF7F2", color: ton === t.id ? "#2C2416" : "#A89070",
                    borderRadius: 2, cursor: "pointer", fontSize: 11, letterSpacing: "0.1em",
                    textTransform: "uppercase", fontFamily: "inherit", fontWeight: ton === t.id ? "bold" : "normal"
                  }}>{t.label}</button>
                ))}
              </div>
            </div>
            <button onClick={generer} disabled={loading} style={{
              width: "100%", padding: "1rem", background: loading ? "#8B7355" : "#2C2416",
              color: "#D4BD96", border: "none", borderRadius: 2, fontSize: 12,
              cursor: loading ? "not-allowed" : "pointer", letterSpacing: "0.2em",
              textTransform: "uppercase", fontFamily: "inherit",
              boxShadow: loading ? "none" : "0 4px 20px rgba(44,36,22,0.3)"
            }}>
              {loading ? "✦  Rédaction en cours..." : "✦  Générer le contenu"}
            </button>
          </div>
        </div>

        <div style={{ background: "#FFFDF9", borderRadius: 2, border: "1px solid #E8DFCF", boxShadow: "0 8px 40px rgba(44,36,22,0.12)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "1.25rem 1.75rem", borderBottom: "1px solid #E8DFCF", background: "#F5F0E8", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#8B7355" }}>◈ &nbsp; Votre contenu</div>
            {resultat && <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "#8B7355", border: "1px solid #C8B898", padding: "2px 10px", borderRadius: 20 }}>✓ Prêt</div>}
          </div>
          <div style={{ padding: "1.75rem", flex: 1, minHeight: 300, overflowY: "auto" }}>
            {!resultat && !loading && (
              <div style={{ height: "100%", minHeight: 260, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.25rem", textAlign: "center" }}>
                <div style={{ fontSize: "2.5rem", opacity: 0.15, color: "#2C2416" }}>⌂</div>
                <div style={{ color: "#B8A88A", fontSize: "0.85rem", lineHeight: 1.7, maxWidth: 200 }}>Renseignez les informations du bien et générez votre contenu</div>
              </div>
            )}
            {loading && (
              <div style={{ height: "100%", minHeight: 260, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.5rem" }}>
                <div style={{ display: "flex", gap: 10 }}>
                  {[0, 1, 2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#8B7355", animation: "fade 1.4s infinite", animationDelay: `${i * 0.3}s` }} />)}
                </div>
                <div style={{ color: "#A89070", fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>Rédaction en cours</div>
              </div>
            )}
            {resultat && (
              <div>
                <div style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#8B7355", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{ width: 24, height: 1, background: "#C8B898" }} />
                  {types.find(t => t.id === typeContenu)?.label}
                </div>
                <div style={{ fontSize: "0.88rem", lineHeight: 1.9, color: "#2C2416", whiteSpace: "pre-wrap" }}>{resultat}</div>
              </div>
            )}
          </div>
          {resultat && (
            <div style={{ padding: "1rem 1.75rem", borderTop: "1px solid #E8DFCF", display: "flex", gap: "0.75rem" }}>
              <button onClick={() => navigator.clipboard.writeText(resultat)} style={btnStyle}>Copier</button>
              <button onClick={generer} style={btnStyle}>Regénérer</button>
              <button onClick={() => setResultat("")} style={{ ...btnStyle, marginLeft: "auto", color: "#C08080" }}>Effacer</button>
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes fade { 0%,100%{opacity:.2;transform:scale(.8)} 50%{opacity:1;transform:scale(1.1)} }`}</style>
    </div>
  )

  return (
    <div style={{ minHeight: "100vh", background: "#FAF7F2", fontFamily: "Georgia, serif" }}>
      <Header />

      {/* HERO */}
      <div style={{ background: "linear-gradient(180deg, #2C2416 0%, #3D3020 65%, #FAF7F2 100%)", padding: "5rem 2rem 7rem", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ color: "rgba(212,189,150,0.5)", fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "1.5rem" }}>✦ &nbsp; L'art de la rédaction immobilière &nbsp; ✦</div>
        <h1 style={{ color: "#FAF7F2", fontSize: "3rem", fontWeight: "normal", lineHeight: 1.2, marginBottom: "1.5rem", maxWidth: 700, margin: "0 auto 1.5rem" }}>
          Rédigez vos annonces immobilières en <span style={{ color: "#D4BD96", fontStyle: "italic" }}>10 secondes</span>
        </h1>
        <p style={{ color: "rgba(250,247,242,0.6)", fontSize: "1.1rem", marginBottom: "2.5rem", maxWidth: 500, margin: "0 auto 2.5rem" }}>
          L'IA génère pour vous annonces, posts LinkedIn, captions Instagram et emails clients — adaptés à chaque bien.
        </p>
        <SignUpButton mode="modal">
          <button style={{ background: "#D4BD96", border: "none", color: "#2C2416", padding: "1.1rem 3rem", borderRadius: 2, fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "Georgia, serif", fontWeight: "bold", cursor: "pointer", boxShadow: "0 4px 20px rgba(212,189,150,0.3)" }}>
            ✦ &nbsp; Commencer gratuitement
          </button>
        </SignUpButton>
        <div style={{ color: "rgba(212,189,150,0.4)", fontSize: 12, marginTop: "1rem" }}>14 jours gratuits · Sans carte bancaire · Annulation à tout moment</div>

        {/* STATS */}
        <div style={{ display: "flex", justifyContent: "center", gap: "3rem", marginTop: "3rem" }}>
          {[["10 sec", "Par annonce"], ["4 formats", "De contenu"], ["3 tons", "Différents"], ["100%", "En français"]].map(([val, desc]) => (
            <div key={val} style={{ textAlign: "center" }}>
              <div style={{ color: "#D4BD96", fontSize: "1.3rem" }}>{val}</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 4 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FONCTIONNALITÉS */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "5rem 2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: "#8B7355", marginBottom: "1rem" }}>◆ &nbsp; Fonctionnalités</div>
          <h2 style={{ fontSize: "1.8rem", fontWeight: "normal", color: "#2C2416" }}>Tout ce dont vous avez besoin</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.5rem" }}>
          {features.map((f, i) => (
            <div key={i} style={{ background: "#FFFDF9", border: "1px solid #E8DFCF", borderRadius: 2, padding: "1.75rem", boxShadow: "0 2px 12px rgba(44,36,22,0.06)" }}>
              <div style={{ color: "#8B7355", fontSize: 20, marginBottom: "0.75rem" }}>{f.icon}</div>
              <div style={{ fontWeight: "bold", color: "#2C2416", fontSize: "0.95rem", marginBottom: "0.5rem", letterSpacing: "0.02em" }}>{f.title}</div>
              <div style={{ color: "#8B7355", fontSize: "0.85rem", lineHeight: 1.7 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* APERÇU DE L'OUTIL */}
      <div style={{ background: "#2C2416", padding: "5rem 2rem", textAlign: "center" }}>
        <div style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(212,189,150,0.5)", marginBottom: "1rem" }}>◆ &nbsp; Aperçu</div>
        <h2 style={{ fontSize: "1.8rem", fontWeight: "normal", color: "#FAF7F2", marginBottom: "3rem" }}>Simple, rapide, efficace</h2>
        <div style={{ maxWidth: 800, margin: "0 auto", background: "#FFFDF9", borderRadius: 4, border: "1px solid #E8DFCF", padding: "2rem", textAlign: "left", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            <div>
              <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#8B7355", marginBottom: "1rem", borderBottom: "1px solid #E8DFCF", paddingBottom: "0.75rem" }}>◈ &nbsp; Informations du bien</div>
              {[["Type de bien", "Maison"], ["Ville", "Bordeaux, Chartrons"], ["Surface", "120 m²"], ["Prix", "395 000 €"]].map(([label, val]) => (
                <div key={label} style={{ marginBottom: "0.75rem" }}>
                  <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "#8B7355" }}>{label}</div>
                  <div style={{ background: "#FAF7F2", border: "1px solid #E8DFCF", padding: "0.5rem 0.75rem", borderRadius: 2, fontSize: "0.85rem", color: "#2C2416", marginTop: 4 }}>{val}</div>
                </div>
              ))}
              <div style={{ background: "#2C2416", color: "#D4BD96", padding: "0.75rem", borderRadius: 2, textAlign: "center", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", marginTop: "1rem" }}>✦ &nbsp; Générer</div>
            </div>
            <div>
              <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#8B7355", marginBottom: "1rem", borderBottom: "1px solid #E8DFCF", paddingBottom: "0.75rem" }}>◈ &nbsp; Annonce générée</div>
              <div style={{ fontSize: "0.82rem", lineHeight: 1.8, color: "#2C2416" }}>
                <strong>Maison d'exception — Bordeaux Chartrons</strong><br /><br />
                Nichée au cœur du quartier des Chartrons, cette élégante maison de 120 m² vous séduira par son caractère unique et ses prestations soignées.<br /><br />
                Jardin privatif, cuisine entièrement rénovée, parquet ancien et luminosité exceptionnelle font de ce bien une opportunité rare.<br /><br />
                <strong>Prix : 395 000 €</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TÉMOIGNAGES */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "5rem 2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: "#8B7355", marginBottom: "1rem" }}>◆ &nbsp; Témoignages</div>
          <h2 style={{ fontSize: "1.8rem", fontWeight: "normal", color: "#2C2416" }}>Ils nous font confiance</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.5rem" }}>
          {testimonials.map((t, i) => (
            <div key={i} style={{ background: "#FFFDF9", border: "1px solid #E8DFCF", borderRadius: 2, padding: "1.75rem", boxShadow: "0 2px 12px rgba(44,36,22,0.06)" }}>
              <div style={{ color: "#D4BD96", fontSize: "1.5rem", marginBottom: "1rem" }}>❝</div>
              <div style={{ color: "#2C2416", fontSize: "0.88rem", lineHeight: 1.8, fontStyle: "italic", marginBottom: "1.25rem" }}>{t.text}</div>
              <div style={{ borderTop: "1px solid #E8DFCF", paddingTop: "1rem" }}>
                <div style={{ fontWeight: "bold", color: "#2C2416", fontSize: "0.85rem" }}>{t.name}</div>
                <div style={{ color: "#8B7355", fontSize: "0.78rem", marginTop: 2 }}>{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PRICING */}
      <div style={{ background: "#F5F0E8", padding: "5rem 2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: "#8B7355", marginBottom: "1rem" }}>◆ &nbsp; Tarifs</div>
          <h2 style={{ fontSize: "1.8rem", fontWeight: "normal", color: "#2C2416" }}>Simple et transparent</h2>
        </div>
        <div style={{ display: "flex", gap: "1.5rem", maxWidth: 700, margin: "0 auto", justifyContent: "center" }}>

          {/* STARTER */}
          <div style={{ flex: 1, background: "#FFFDF9", border: "1px solid #E8DFCF", borderRadius: 2, padding: "2rem", boxShadow: "0 2px 12px rgba(44,36,22,0.06)" }}>
            <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#8B7355", marginBottom: "1rem" }}>Starter</div>
            <div style={{ fontSize: "2.5rem", color: "#2C2416", marginBottom: "0.25rem" }}>19€</div>
            <div style={{ color: "#8B7355", fontSize: 12, marginBottom: "1.5rem" }}>par mois</div>
            {["30 générations/mois", "4 formats de contenu", "3 tons disponibles", "Support par email"].map(f => (
              <div key={f} style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.75rem", fontSize: "0.85rem", color: "#2C2416" }}>
                <span style={{ color: "#8B7355" }}>✓</span> {f}
              </div>
            ))}
            <SignUpButton mode="modal">
              <button style={{ width: "100%", padding: "0.85rem", background: "transparent", border: "1px solid #2C2416", color: "#2C2416", borderRadius: 2, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "Georgia, serif", cursor: "pointer", marginTop: "1rem" }}>
                Commencer
              </button>
            </SignUpButton>
          </div>

          {/* PRO */}
          <div style={{ flex: 1, background: "#2C2416", border: "1px solid #2C2416", borderRadius: 2, padding: "2rem", boxShadow: "0 8px 30px rgba(44,36,22,0.2)", position: "relative" }}>
            <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "#D4BD96", color: "#2C2416", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", padding: "3px 14px", borderRadius: 20, fontWeight: "bold" }}>Recommandé</div>
            <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(212,189,150,0.6)", marginBottom: "1rem" }}>Pro</div>
            <div style={{ fontSize: "2.5rem", color: "#D4BD96", marginBottom: "0.25rem" }}>29€</div>
            <div style={{ color: "rgba(212,189,150,0.5)", fontSize: 12, marginBottom: "1.5rem" }}>par mois</div>
            {["Générations illimitées", "4 formats de contenu", "3 tons disponibles", "Support prioritaire", "Nouvelles fonctionnalités en avant-première"].map(f => (
              <div key={f} style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.75rem", fontSize: "0.85rem", color: "rgba(250,247,242,0.8)" }}>
                <span style={{ color: "#D4BD96" }}>✓</span> {f}
              </div>
            ))}
            <SignUpButton mode="modal">
              <button style={{ width: "100%", padding: "0.85rem", background: "#D4BD96", border: "none", color: "#2C2416", borderRadius: 2, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "Georgia, serif", fontWeight: "bold", cursor: "pointer", marginTop: "1rem" }}>
                ✦ &nbsp; Commencer
              </button>
            </SignUpButton>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "5rem 2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: "#8B7355", marginBottom: "1rem" }}>◆ &nbsp; FAQ</div>
          <h2 style={{ fontSize: "1.8rem", fontWeight: "normal", color: "#2C2416" }}>Questions fréquentes</h2>
        </div>
        {faqs.map((f, i) => (
          <div key={i} style={{ borderBottom: "1px solid #E8DFCF", padding: "1.5rem 0" }}>
            <div style={{ fontWeight: "bold", color: "#2C2416", fontSize: "0.95rem", marginBottom: "0.75rem" }}>◈ &nbsp; {f.q}</div>
            <div style={{ color: "#8B7355", fontSize: "0.88rem", lineHeight: 1.8, paddingLeft: "1.25rem" }}>{f.a}</div>
          </div>
        ))}
      </div>

      {/* CTA FINAL */}
      <div style={{ background: "#2C2416", padding: "5rem 2rem", textAlign: "center" }}>
        <div style={{ color: "rgba(212,189,150,0.5)", fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "1.5rem" }}>✦ &nbsp; Prêt à commencer ? &nbsp; ✦</div>
        <h2 style={{ color: "#FAF7F2", fontSize: "2rem", fontWeight: "normal", marginBottom: "1rem" }}>
          Rejoignez les agents qui <span style={{ color: "#D4BD96", fontStyle: "italic" }}>gagnent du temps</span>
        </h2>
        <p style={{ color: "rgba(250,247,242,0.5)", marginBottom: "2rem", fontSize: "0.95rem" }}>14 jours gratuits · Sans carte bancaire · Annulation à tout moment</p>
        <SignUpButton mode="modal">
          <button style={{ background: "#D4BD96", border: "none", color: "#2C2416", padding: "1.1rem 3rem", borderRadius: 2, fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "Georgia, serif", fontWeight: "bold", cursor: "pointer" }}>
            ✦ &nbsp; Commencer gratuitement
          </button>
        </SignUpButton>
      </div>

      {/* FOOTER */}
      <div style={{ textAlign: "center", padding: "2rem", borderTop: "1px solid #E8DFCF", color: "#B8A88A", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase" }}>
        ◆ &nbsp; Copyimo &nbsp; ◆ &nbsp; Rédaction Immobilière par l'IA &nbsp; ◆ &nbsp; © 2026
      </div>
    </div>
  )
}

const labelStyle = { fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#8B7355", display: "block" }
const inputStyle = { width: "100%", padding: "0.65rem 0.9rem", marginTop: 7, border: "1px solid #E8DFCF", borderRadius: 2, fontFamily: "Georgia, serif", fontSize: "0.88rem", color: "#2C2416", background: "#FAF7F2", boxSizing: "border-box" }
const btnStyle = { padding: "0.55rem 1.25rem", border: "1px solid #E8DFCF", borderRadius: 2, background: "#FAF7F2", cursor: "pointer", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "#8B7355", fontFamily: "Georgia, serif" }
const btnOutlineStyle = { background: "transparent", border: "1px solid rgba(212,189,150,0.4)", color: "#D4BD96", padding: "0.5rem 1.25rem", borderRadius: 2, cursor: "pointer", fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "Georgia, serif" }
const btnGoldStyle = { background: "#D4BD96", border: "none", color: "#2C2416", padding: "0.5rem 1.25rem", borderRadius: 2, cursor: "pointer", fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "Georgia, serif", fontWeight: "bold" }
