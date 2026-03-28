import { useState } from "react"
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/clerk-react"
import { translations } from "./translations"

export default function App() {
  const [lang, setLang] = useState("fr")
  const t = translations[lang]

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
      alert(t.remplirChamps)
      return
    }
    setLoading(true)
    setResultat("")
    const prompt = t.promptTemplate(typeContenu, ton, typeBien, ville, surface, prix, points)
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
    { id: "annonce", label: t.annonce },
    { id: "linkedin", label: t.linkedin },
    { id: "instagram", label: t.instagram },
    { id: "email", label: t.email }
  ]

  const tons = [
    { id: "professionnel", label: t.professionnel },
    { id: "chaleureux", label: t.chaleureux },
    { id: "luxe", label: t.prestige }
  ]

  const LangSwitcher = () => (
    <div style={{ display: "flex", gap: "0.25rem" }}>
      {["fr", "en"].map(l => (
        <button key={l} onClick={() => setLang(l)} style={{
          padding: "0.3rem 0.6rem", borderRadius: 2,
          border: lang === l ? "1px solid #D4BD96" : "1px solid rgba(212,189,150,0.3)",
          background: lang === l ? "rgba(212,189,150,0.15)" : "transparent",
          color: lang === l ? "#D4BD96" : "rgba(212,189,150,0.5)",
          cursor: "pointer", fontSize: 10, fontWeight: "bold",
          letterSpacing: "0.1em", fontFamily: "Georgia, serif",
          textTransform: "uppercase"
        }}>
          {l === "fr" ? "🇫🇷 FR" : "🇬🇧 EN"}
        </button>
      ))}
    </div>
  )

  const Header = () => (
    <header style={{
      background: "#2C2416", padding: "0 1.5rem", height: 70,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      boxShadow: "0 1px 0 rgba(212,189,150,0.2)", position: "sticky", top: 0, zIndex: 100
    }}>
      <div onClick={() => setPage("home")} style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }}>
        <div style={{ width: 34, height: 34, border: "1px solid rgba(212,189,150,0.5)", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", color: "#D4BD96", fontSize: 16 }}>⌂</div>
        <div>
          <div style={{ color: "#D4BD96", fontSize: "1rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>Copyimo</div>
          <div style={{ color: "rgba(212,189,150,0.4)", fontSize: 8, letterSpacing: "0.2em", textTransform: "uppercase" }}>{t.soustitre}</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <LangSwitcher />
        <SignedOut>
          <SignInButton mode="modal">
            <button style={{ background: "transparent", border: "1px solid rgba(212,189,150,0.4)", color: "#D4BD96", padding: "0.45rem 0.9rem", borderRadius: 2, cursor: "pointer", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "Georgia, serif" }}>
              {t.connexion}
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button style={{ background: "#D4BD96", border: "none", color: "#2C2416", padding: "0.45rem 0.9rem", borderRadius: 2, cursor: "pointer", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "Georgia, serif", fontWeight: "bold" }}>
              {t.essaiGratuit}
            </button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <button onClick={() => setPage("app")} style={{ background: "#D4BD96", border: "none", color: "#2C2416", padding: "0.45rem 0.9rem", borderRadius: 2, cursor: "pointer", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "Georgia, serif", fontWeight: "bold" }}>
            {t.monEspace}
          </button>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    </header>
  )

  if (page === "app") return (
    <div style={{ minHeight: "100vh", background: "#FAF7F2", fontFamily: "Georgia, serif" }}>
      <Header />
      <div style={{ background: "linear-gradient(180deg, #2C2416 0%, #3D3020 50%, #FAF7F2 100%)", padding: "2rem 1.5rem 3rem", textAlign: "center" }}>
        <h1 style={{ color: "#FAF7F2", fontSize: "1.5rem", fontWeight: "normal", marginBottom: "0.5rem" }}>
          {t.vosAnnonces} <span style={{ color: "#D4BD96", fontStyle: "italic" }}>{t.redigeesEnUnInstant}</span>
        </h1>
      </div>
      <div style={{ maxWidth: 1000, margin: "-1.5rem auto 0", padding: "0 1rem 3rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem", position: "relative", zIndex: 1 }}>
        <div style={{ background: "#FFFDF9", borderRadius: 2, border: "1px solid #E8DFCF", boxShadow: "0 4px 20px rgba(44,36,22,0.1)", overflow: "hidden" }}>
          <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid #E8DFCF", background: "#F5F0E8" }}>
            <div style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#8B7355" }}>◈ &nbsp; {t.detailsBien}</div>
          </div>
          <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <div style={labelStyle}>{t.format}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "0.35rem", marginTop: 6 }}>
                {types.map(tp => (
                  <button key={tp.id} onClick={() => setTypeContenu(tp.id)} style={{
                    padding: "0.5rem 0.1rem", border: typeContenu === tp.id ? "1px solid #8B7355" : "1px solid #E8DFCF",
                    background: typeContenu === tp.id ? "#2C2416" : "#FAF7F2",
                    color: typeContenu === tp.id ? "#D4BD96" : "#8B7355",
                    borderRadius: 2, cursor: "pointer", fontSize: 10,
                    textTransform: "uppercase", fontFamily: "inherit"
                  }}>{tp.label}</button>
                ))}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <div>
                <div style={labelStyle}>{t.typeBien}</div>
                <select value={typeBien} onChange={e => setTypeBien(e.target.value)} style={inputStyle}>
                  <option value="appartement">{t.appartement}</option>
                  <option value="maison">{t.maison}</option>
                  <option value="villa">{t.villa}</option>
                  <option value="terrain">{t.terrain}</option>
                  <option value="local">{t.local}</option>
                </select>
              </div>
              <div>
                <div style={labelStyle}>{t.ville}</div>
                <input value={ville} onChange={e => setVille(e.target.value)} placeholder={t.villePlaceholder} style={inputStyle} />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <div>
                <div style={labelStyle}>{t.surface}</div>
                <input value={surface} onChange={e => setSurface(e.target.value)} placeholder="120" style={inputStyle} />
              </div>
              <div>
                <div style={labelStyle}>{t.prix}</div>
                <input value={prix} onChange={e => setPrix(e.target.value)} placeholder="350 000" style={inputStyle} />
              </div>
            </div>
            <div>
              <div style={labelStyle}>{t.atouts}</div>
              <textarea value={points} onChange={e => setPoints(e.target.value)} placeholder={t.atoursPlaceholder} style={{ ...inputStyle, height: 70, resize: "none" }} />
            </div>
            <div>
              <div style={labelStyle}>{t.registre}</div>
              <div style={{ display: "flex", gap: "0.4rem", marginTop: 6 }}>
                {tons.map(tn => (
                  <button key={tn.id} onClick={() => setTon(tn.id)} style={{
                    flex: 1, padding: "0.5rem 0.1rem",
                    border: ton === tn.id ? "1px solid #8B7355" : "1px solid #E8DFCF",
                    background: ton === tn.id ? "#F5F0E8" : "#FAF7F2",
                    color: ton === tn.id ? "#2C2416" : "#A89070",
                    borderRadius: 2, cursor: "pointer", fontSize: 10,
                    textTransform: "uppercase", fontFamily: "inherit",
                    fontWeight: ton === tn.id ? "bold" : "normal"
                  }}>{tn.label}</button>
                ))}
              </div>
            </div>
            <button onClick={generer} disabled={loading} style={{
              width: "100%", padding: "0.9rem",
              background: loading ? "#8B7355" : "#2C2416",
              color: "#D4BD96", border: "none", borderRadius: 2,
              fontSize: 11, cursor: loading ? "not-allowed" : "pointer",
              letterSpacing: "0.2em", textTransform: "uppercase",
              fontFamily: "inherit", boxShadow: loading ? "none" : "0 4px 20px rgba(44,36,22,0.3)"
            }}>
              {loading ? `✦  ${t.redactionEnCours}` : `✦  ${t.generer}`}
            </button>
          </div>
        </div>

        <div style={{ background: "#FFFDF9", borderRadius: 2, border: "1px solid #E8DFCF", boxShadow: "0 4px 20px rgba(44,36,22,0.1)", display: "flex", flexDirection: "column", overflow: "hidden", minHeight: 300 }}>
          <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid #E8DFCF", background: "#F5F0E8", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#8B7355" }}>◈ &nbsp; {t.votreContenu}</div>
            {resultat && <div style={{ fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", color: "#8B7355", border: "1px solid #C8B898", padding: "2px 8px", borderRadius: 20 }}>✓ {t.pret}</div>}
          </div>
          <div style={{ padding: "1.25rem", flex: 1, overflowY: "auto" }}>
            {!resultat && !loading && (
              <div style={{ minHeight: 200, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem", textAlign: "center" }}>
                <div style={{ fontSize: "2rem", opacity: 0.15 }}>⌂</div>
                <div style={{ color: "#B8A88A", fontSize: "0.82rem", lineHeight: 1.7, maxWidth: 180 }}>{t.renseignez}</div>
              </div>
            )}
            {loading && (
              <div style={{ minHeight: 200, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
                <div style={{ display: "flex", gap: 8 }}>
                  {[0, 1, 2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#8B7355", animation: "fade 1.4s infinite", animationDelay: `${i * 0.3}s` }} />)}
                </div>
                <div style={{ color: "#A89070", fontSize: "0.8rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>{t.redactionLoading}</div>
              </div>
            )}
            {resultat && (
              <div>
                <div style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "#8B7355", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <div style={{ width: 20, height: 1, background: "#C8B898" }} />
                  {types.find(tp => tp.id === typeContenu)?.label}
                </div>
                <div style={{ fontSize: "0.85rem", lineHeight: 1.9, color: "#2C2416", whiteSpace: "pre-wrap" }}>{resultat}</div>
              </div>
            )}
          </div>
          {resultat && (
            <div style={{ padding: "0.75rem 1.25rem", borderTop: "1px solid #E8DFCF", display: "flex", gap: "0.5rem" }}>
              <button onClick={() => navigator.clipboard.writeText(resultat)} style={btnStyle}>{t.copier}</button>
              <button onClick={generer} style={btnStyle}>{t.regenerer}</button>
              <button onClick={() => setResultat("")} style={{ ...btnStyle, marginLeft: "auto", color: "#C08080" }}>{t.effacer}</button>
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
      <div style={{ background: "linear-gradient(180deg, #2C2416 0%, #3D3020 65%, #FAF7F2 100%)", padding: "3.5rem 1.5rem 5rem", textAlign: "center" }}>
        <div style={{ color: "rgba(212,189,150,0.5)", fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "1.25rem" }}>✦ &nbsp; {t.tagline} &nbsp; ✦</div>
        <h1 style={{ color: "#FAF7F2", fontSize: "clamp(1.6rem, 5vw, 2.8rem)", fontWeight: "normal", lineHeight: 1.2, marginBottom: "1.25rem" }}>
          {t.heroTitre1}<br />{t.heroTitre2}{" "}
          <span style={{ color: "#D4BD96", fontStyle: "italic" }}>{t.heroAccroche}</span>
        </h1>
        <p style={{ color: "rgba(250,247,242,0.6)", fontSize: "clamp(0.85rem, 2.5vw, 1rem)", marginBottom: "2rem", maxWidth: 500, margin: "0 auto 2rem" }}>
          {t.heroDesc}
        </p>
        <SignUpButton mode="modal">
          <button style={{ background: "#D4BD96", border: "none", color: "#2C2416", padding: "1rem 2rem", borderRadius: 2, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "Georgia, serif", fontWeight: "bold", cursor: "pointer", boxShadow: "0 4px 20px rgba(212,189,150,0.3)" }}>
            ✦ &nbsp; {t.commencerGratuitement}
          </button>
        </SignUpButton>
        <div style={{ color: "rgba(212,189,150,0.4)", fontSize: 11, marginTop: "1rem" }}>{t.sansCarteBank}</div>
        <div style={{ display: "flex", justifyContent: "center", gap: "clamp(1rem, 4vw, 3rem)", marginTop: "2.5rem", flexWrap: "wrap" }}>
          {[["10 sec", t.parAnnonce], ["4 formats", t.deContenu], ["3 tons", t.differents], ["100%", t.enFrancais]].map(([val, desc]) => (
            <div key={val} style={{ textAlign: "center" }}>
              <div style={{ color: "#D4BD96", fontSize: "clamp(1rem, 3vw, 1.3rem)" }}>{val}</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 3 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "3.5rem 1.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "#8B7355", marginBottom: "0.75rem" }}>◆ &nbsp; {t.featuresTag}</div>
          <h2 style={{ fontSize: "clamp(1.3rem, 4vw, 1.8rem)", fontWeight: "normal", color: "#2C2416" }}>{t.featuresTitre}</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
          {t.features.map((f, i) => (
            <div key={i} style={{ background: "#FFFDF9", border: "1px solid #E8DFCF", borderRadius: 2, padding: "1.5rem", boxShadow: "0 2px 12px rgba(44,36,22,0.06)" }}>
              <div style={{ color: "#8B7355", fontSize: 18, marginBottom: "0.6rem" }}>◈</div>
              <div style={{ fontWeight: "bold", color: "#2C2416", fontSize: "0.9rem", marginBottom: "0.4rem" }}>{f.title}</div>
              <div style={{ color: "#8B7355", fontSize: "0.82rem", lineHeight: 1.7 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* APERÇU */}
      <div style={{ background: "#2C2416", padding: "3.5rem 1.5rem", textAlign: "center" }}>
        <div style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(212,189,150,0.5)", marginBottom: "0.75rem" }}>◆ &nbsp; {t.apercuTag}</div>
        <h2 style={{ fontSize: "clamp(1.3rem, 4vw, 1.8rem)", fontWeight: "normal", color: "#FAF7F2", marginBottom: "2.5rem" }}>{t.apercuTitre}</h2>
        <div style={{ maxWidth: 700, margin: "0 auto", background: "#FFFDF9", borderRadius: 4, border: "1px solid #E8DFCF", padding: "1.5rem", textAlign: "left", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem" }}>
            <div>
              <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "#8B7355", marginBottom: "1rem", borderBottom: "1px solid #E8DFCF", paddingBottom: "0.5rem" }}>◈ &nbsp; {t.detailsBien}</div>
              {[[t.typeBien, t.maison], [t.ville, "Bordeaux"], [t.surface, "120 m²"], [t.prix, "395 000 €"]].map(([label, val]) => (
                <div key={label} style={{ marginBottom: "0.6rem" }}>
                  <div style={{ fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", color: "#8B7355" }}>{label}</div>
                  <div style={{ background: "#FAF7F2", border: "1px solid #E8DFCF", padding: "0.4rem 0.6rem", borderRadius: 2, fontSize: "0.82rem", color: "#2C2416", marginTop: 3 }}>{val}</div>
                </div>
              ))}
              <div style={{ background: "#2C2416", color: "#D4BD96", padding: "0.6rem", borderRadius: 2, textAlign: "center", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", marginTop: "0.75rem" }}>✦ &nbsp; {t.generer}</div>
            </div>
            <div>
              <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "#8B7355", marginBottom: "1rem", borderBottom: "1px solid #E8DFCF", paddingBottom: "0.5rem" }}>◈ &nbsp; {t.votreContenu}</div>
              <div style={{ fontSize: "0.8rem", lineHeight: 1.8, color: "#2C2416" }}>
                <strong>{lang === "fr" ? "Maison d'exception — Bordeaux Chartrons" : "Exceptional House — Bordeaux Chartrons"}</strong><br /><br />
                {lang === "fr"
                  ? "Nichée au cœur des Chartrons, cette élégante maison de 120 m² vous séduira par son caractère unique."
                  : "Nestled in the heart of Chartrons, this elegant 120 m² house will captivate you with its unique character."
                }<br /><br />
                {lang === "fr"
                  ? "Jardin privatif, cuisine rénovée, parquet ancien et luminosité exceptionnelle."
                  : "Private garden, renovated kitchen, original parquet flooring and exceptional brightness."
                }<br /><br />
                <strong>{lang === "fr" ? "Prix : 395 000 €" : "Price: €395,000"}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TÉMOIGNAGES */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "3.5rem 1.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "#8B7355", marginBottom: "0.75rem" }}>◆ &nbsp; {t.temoignagesTag}</div>
          <h2 style={{ fontSize: "clamp(1.3rem, 4vw, 1.8rem)", fontWeight: "normal", color: "#2C2416" }}>{t.temoignagesTitre}</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem" }}>
          {t.temoignages.map((tm, i) => (
            <div key={i} style={{ background: "#FFFDF9", border: "1px solid #E8DFCF", borderRadius: 2, padding: "1.5rem", boxShadow: "0 2px 12px rgba(44,36,22,0.06)" }}>
              <div style={{ color: "#D4BD96", fontSize: "1.3rem", marginBottom: "0.75rem" }}>❝</div>
              <div style={{ color: "#2C2416", fontSize: "0.85rem", lineHeight: 1.8, fontStyle: "italic", marginBottom: "1rem" }}>{tm.text}</div>
              <div style={{ borderTop: "1px solid #E8DFCF", paddingTop: "0.75rem" }}>
                <div style={{ fontWeight: "bold", color: "#2C2416", fontSize: "0.82rem" }}>{tm.name}</div>
                <div style={{ color: "#8B7355", fontSize: "0.75rem", marginTop: 2 }}>{tm.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PRICING */}
      <div style={{ background: "#F5F0E8", padding: "3.5rem 1.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "#8B7355", marginBottom: "0.75rem" }}>◆ &nbsp; {t.pricingTag}</div>
          <h2 style={{ fontSize: "clamp(1.3rem, 4vw, 1.8rem)", fontWeight: "normal", color: "#2C2416" }}>{t.pricingTitre}</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem", maxWidth: 700, margin: "0 auto" }}>
          <div style={{ background: "#FFFDF9", border: "1px solid #E8DFCF", borderRadius: 2, padding: "1.75rem", boxShadow: "0 2px 12px rgba(44,36,22,0.06)" }}>
            <div style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#8B7355", marginBottom: "0.75rem" }}>Starter</div>
            <div style={{ fontSize: "2.2rem", color: "#2C2416", marginBottom: "0.2rem" }}>19€</div>
            <div style={{ color: "#8B7355", fontSize: 11, marginBottom: "1.25rem" }}>{t.pricingMois}</div>
            {t.starterFeatures.map(f => (
              <div key={f} style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start", marginBottom: "0.6rem", fontSize: "0.82rem", color: "#2C2416" }}>
                <span style={{ color: "#8B7355", flexShrink: 0 }}>✓</span> {f}
              </div>
            ))}
            <SignUpButton mode="modal">
              <button style={{ width: "100%", padding: "0.75rem", background: "transparent", border: "1px solid #2C2416", color: "#2C2416", borderRadius: 2, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "Georgia, serif", cursor: "pointer", marginTop: "1rem" }}>
                {t.commencer}
              </button>
            </SignUpButton>
          </div>
          <div style={{ background: "#2C2416", border: "1px solid #2C2416", borderRadius: 2, padding: "1.75rem", boxShadow: "0 8px 30px rgba(44,36,22,0.2)", position: "relative" }}>
            <div style={{ position: "absolute", top: -11, left: "50%", transform: "translateX(-50%)", background: "#D4BD96", color: "#2C2416", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", padding: "3px 12px", borderRadius: 20, fontWeight: "bold", whiteSpace: "nowrap" }}>{t.recommande}</div>
            <div style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(212,189,150,0.6)", marginBottom: "0.75rem" }}>Pro</div>
            <div style={{ fontSize: "2.2rem", color: "#D4BD96", marginBottom: "0.2rem" }}>29€</div>
            <div style={{ color: "rgba(212,189,150,0.5)", fontSize: 11, marginBottom: "1.25rem" }}>{t.pricingMois}</div>
            {t.proFeatures.map(f => (
              <div key={f} style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start", marginBottom: "0.6rem", fontSize: "0.82rem", color: "rgba(250,247,242,0.8)" }}>
                <span style={{ color: "#D4BD96", flexShrink: 0 }}>✓</span> {f}
              </div>
            ))}
            <SignUpButton mode="modal">
              <button style={{ width: "100%", padding: "0.75rem", background: "#D4BD96", border: "none", color: "#2C2416", borderRadius: 2, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "Georgia, serif", fontWeight: "bold", cursor: "pointer", marginTop: "1rem" }}>
                ✦ &nbsp; {t.commencer}
              </button>
            </SignUpButton>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "3.5rem 1.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "#8B7355", marginBottom: "0.75rem" }}>◆ &nbsp; {t.faqTag}</div>
          <h2 style={{ fontSize: "clamp(1.3rem, 4vw, 1.8rem)", fontWeight: "normal", color: "#2C2416" }}>{t.faqTitre}</h2>
        </div>
        {t.faqs.map((f, i) => (
          <div key={i} style={{ borderBottom: "1px solid #E8DFCF", padding: "1.25rem 0" }}>
            <div style={{ fontWeight: "bold", color: "#2C2416", fontSize: "0.9rem", marginBottom: "0.6rem" }}>◈ &nbsp; {f.q}</div>
            <div style={{ color: "#8B7355", fontSize: "0.85rem", lineHeight: 1.8, paddingLeft: "1.1rem" }}>{f.a}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ background: "#2C2416", padding: "3.5rem 1.5rem", textAlign: "center" }}>
        <div style={{ color: "rgba(212,189,150,0.5)", fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "1.25rem" }}>✦ &nbsp; {t.ctaTag} &nbsp; ✦</div>
        <h2 style={{ color: "#FAF7F2", fontSize: "clamp(1.3rem, 4vw, 2rem)", fontWeight: "normal", marginBottom: "0.75rem" }}>
          {t.ctaTitre1} <span style={{ color: "#D4BD96", fontStyle: "italic" }}>{t.ctaTitre2}</span>
        </h2>
        <p style={{ color: "rgba(250,247,242,0.5)", marginBottom: "1.75rem", fontSize: "0.88rem" }}>{t.ctaDesc}</p>
        <SignUpButton mode="modal">
          <button style={{ background: "#D4BD96", border: "none", color: "#2C2416", padding: "1rem 2rem", borderRadius: 2, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "Georgia, serif", fontWeight: "bold", cursor: "pointer" }}>
            ✦ &nbsp; {t.commencerGratuitement}
          </button>
        </SignUpButton>
      </div>

      {/* FOOTER */}
      <div style={{ textAlign: "center", padding: "1.5rem", borderTop: "1px solid #E8DFCF", color: "#B8A88A", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase" }}>
        ◆ &nbsp; Copyimo &nbsp; ◆ &nbsp; {t.footer} &nbsp; ◆ &nbsp; © 2026
      </div>
    </div>
  )
}

const labelStyle = { fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "#8B7355", display: "block" }
const inputStyle = { width: "100%", padding: "0.6rem 0.75rem", marginTop: 5, border: "1px solid #E8DFCF", borderRadius: 2, fontFamily: "Georgia, serif", fontSize: "0.85rem", color: "#2C2416", background: "#FAF7F2", boxSizing: "border-box" }
const btnStyle = { padding: "0.5rem 0.9rem", border: "1px solid #E8DFCF", borderRadius: 2, background: "#FAF7F2", cursor: "pointer", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#8B7355", fontFamily: "Georgia, serif" }
