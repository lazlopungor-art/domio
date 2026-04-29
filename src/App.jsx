import { useState } from "react"
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/clerk-react"
import { translations } from "./translations"
import Legal from "./Legal"
import CRM from "./CRM"

const STRIPE_STARTER = import.meta.env.VITE_STRIPE_STARTER
const STRIPE_PRO = import.meta.env.VITE_STRIPE_PRO
const STRIPE_BUSINESS = import.meta.env.VITE_STRIPE_BUSINESS

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
  const [showLegal, setShowLegal] = useState(false)

  const generer = async () => {
    if (!ville || !surface || !prix || !points) {
      alert(t.remplirChamps)
      return
    }
    setLoading(true)
    setResultat("")
    const prompt = t.promptTemplate(typeContenu, ton, typeBien, ville, surface, prix, points)
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      })
      const data = await response.json()
      setResultat(data.result)
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

  const TopBanner = () => (
    <div style={{
      background: "linear-gradient(135deg, #D4BD96, #B8986A)",
      padding: "0.5rem 1.5rem",
      textAlign: "center",
      fontSize: 11,
      letterSpacing: "0.15em",
      textTransform: "uppercase",
      color: "#1C160E",
      fontFamily: "Georgia, serif",
      fontWeight: "bold"
    }}>
      ✦ &nbsp; {lang === "fr"
        ? "Rédigez vos annonces immobilières en 10 secondes — 30 jours gratuits"
        : "Write your real estate listings in 10 seconds — 30 days free"
      } &nbsp; ✦
    </div>
  )

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
        <button onClick={() => setPage("crm")} style={{ background: "transparent", border: "1px solid rgba(212,189,150,0.3)", color: "rgba(212,189,150,0.6)", padding: "0.45rem 0.9rem", borderRadius: 2, cursor: "pointer", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "Georgia, serif" }}>
          CRM
        </button>
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

  if (page === "crm") return <CRM onBack={() => setPage("home")} lang={lang} />

  if (page === "app") return (
    <div style={{ minHeight: "100vh", background: "#FAF7F2", fontFamily: "Georgia, serif" }}>
      <TopBanner />
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
      <TopBanner />
      <Header />

      {/* HERO */}
      <div style={{ position: "relative" }}>
        <div style={{
          backgroundImage: "linear-gradient(rgba(44,36,22,0.6), rgba(44,36,22,0.6)), url('/villa.jpg')",
          backgroundSize: "cover", backgroundPosition: "center",
          padding: "3.5rem 1.5rem 5rem", textAlign: "center"
        }}>
          <div style={{ color: "rgba(212,189,150,0.9)", fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "1.25rem" }}>✦ &nbsp; {t.tagline} &nbsp; ✦</div>
          <h1 style={{ color: "#FAF7F2", fontSize: "clamp(1.6rem, 5vw, 2.8rem)", fontWeight: "normal", lineHeight: 1.2, marginBottom: "1.25rem", textShadow: "0 2px 15px rgba(0,0,0,0.5)" }}>
            {t.heroTitre1}<br />{t.heroTitre2}{" "}
            <span style={{ color: "#D4BD96", fontStyle: "italic" }}>{t.heroAccroche}</span>
            <br />
            <span style={{ fontSize: "clamp(0.9rem, 2.5vw, 1.3rem)", color: "rgba(212,189,150,0.6)", fontStyle: "normal", letterSpacing: "0.08em" }}>
              {lang === "fr" ? "✦ Générateur IA · CRM immobilier intégré" : "✦ AI Generator · Integrated Real Estate CRM"}
            </span>
          </h1>
          <p style={{ color: "rgba(250,247,242,0.9)", fontSize: "clamp(0.85rem, 2.5vw, 1rem)", marginBottom: "2rem", maxWidth: 500, margin: "0 auto 2rem", textShadow: "0 1px 8px rgba(0,0,0,0.4)" }}>
            {t.heroDesc}
          </p>
          <SignedOut>
            <SignUpButton mode="modal">
              <button style={{ background: "#D4BD96", border: "none", color: "#2C2416", padding: "1rem 2rem", borderRadius: 2, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "Georgia, serif", fontWeight: "bold", cursor: "pointer", boxShadow: "0 4px 20px rgba(212,189,150,0.4)" }}>
                ✦ &nbsp; {t.commencerGratuitement}
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <button onClick={() => setPage("app")} style={{ background: "#D4BD96", border: "none", color: "#2C2416", padding: "1rem 2rem", borderRadius: 2, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "Georgia, serif", fontWeight: "bold", cursor: "pointer", boxShadow: "0 4px 20px rgba(212,189,150,0.4)" }}>
              ✦ &nbsp; {t.monEspace}
            </button>
          </SignedIn>
          <div style={{ color: "rgba(212,189,150,0.7)", fontSize: 11, marginTop: "1rem" }}>{t.sansCarteBank}</div>
          <div style={{ display: "flex", justifyContent: "center", gap: "clamp(1rem, 4vw, 3rem)", marginTop: "2.5rem", flexWrap: "wrap" }}>
            {[["10 sec", t.parAnnonce], ["4 formats", t.deContenu], ["3 tons", t.differents], ["100%", t.enFrancais]].map(([val, desc]) => (
              <div key={val} style={{ textAlign: "center" }}>
                <div style={{ color: "#D4BD96", fontSize: "clamp(1rem, 3vw, 1.3rem)", textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}>{val}</div>
                <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 3 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "40px", background: "linear-gradient(to bottom, transparent, #FAF7F2)", pointerEvents: "none" }} />
      </div>

      {/* STORYTELLING */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "4rem 1.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "#8B7355", marginBottom: "0.75rem" }}>◆ &nbsp; {lang === "fr" ? "Une histoire familière" : "A familiar story"}</div>
          <h2 style={{ fontSize: "clamp(1.3rem, 4vw, 1.8rem)", fontWeight: "normal", color: "#2C2416" }}>
            {lang === "fr" ? "Vous reconnaissez-vous ?" : "Does this sound familiar?"}
          </h2>
        </div>
        <div style={{ background: "#FFFDF9", border: "1px solid #E8DFCF", borderRadius: 2, padding: "2.5rem", boxShadow: "0 4px 20px rgba(44,36,22,0.08)", position: "relative" }}>
          <div style={{ position: "absolute", top: "1.5rem", left: "1.5rem", color: "#D4BD96", fontSize: "3rem", opacity: 0.25, fontFamily: "Georgia, serif", lineHeight: 1 }}>❝</div>
          <div style={{ fontSize: "1rem", lineHeight: 2, color: "#2C2416", fontStyle: "italic", paddingLeft: "1rem" }}>
            {lang === "fr" ? (
              <>
                Il est <strong style={{ fontStyle: "normal" }}>22h</strong>. Vous venez de rentrer d'une longue journée de visites. Sur votre bureau, <strong style={{ fontStyle: "normal" }}>3 nouveaux mandats</strong> vous attendent.<br /><br />
                Chacun nécessite une annonce pour SeLoger, un post LinkedIn, un email pour vos clients en recherche...<br /><br />
                Vous ouvrez votre ordinateur. La page blanche vous fixe. Vous cherchez vos mots. <strong style={{ fontStyle: "normal" }}>Une heure passe.</strong><br /><br />
                Et si tout cela pouvait prendre <strong style={{ fontStyle: "normal" }}>30 secondes</strong> ?
              </>
            ) : (
              <>
                It's <strong style={{ fontStyle: "normal" }}>10pm</strong>. You've just returned from a long day of property visits. On your desk, <strong style={{ fontStyle: "normal" }}>3 new mandates</strong> are waiting.<br /><br />
                Each one needs a listing for the portals, a LinkedIn post, an email for your searching clients...<br /><br />
                You open your computer. The blank page stares back at you. You search for words. <strong style={{ fontStyle: "normal" }}>An hour passes.</strong><br /><br />
                What if all of this could take <strong style={{ fontStyle: "normal" }}>30 seconds</strong>?
              </>
            )}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem", marginTop: "2rem" }}>
          {(lang === "fr" ? [
            { icon: "⌂", text: "Vous rentrez chez vous" },
            { icon: "✦", text: "Vous ouvrez Copyimo" },
            { icon: "◈", text: "30 secondes" },
            { icon: "❝", text: "Tout est rédigé" }
          ] : [
            { icon: "⌂", text: "You get home" },
            { icon: "✦", text: "You open Copyimo" },
            { icon: "◈", text: "30 seconds" },
            { icon: "❝", text: "Everything is written" }
          ]).map((step, i) => (
            <div key={i} style={{ background: "#FFFDF9", border: "1px solid #E8DFCF", borderRadius: 2, padding: "1.25rem", textAlign: "center", boxShadow: "0 2px 8px rgba(44,36,22,0.04)" }}>
              <div style={{ color: "#D4BD96", fontSize: "1.5rem", marginBottom: "0.5rem" }}>{step.icon}</div>
              <div style={{ color: "#2C2416", fontSize: "0.82rem", fontStyle: "italic" }}>{step.text}</div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
          <SignedOut>
            <SignUpButton mode="modal">
              <button style={{ background: "#2C2416", border: "none", color: "#D4BD96", padding: "1rem 2rem", borderRadius: 2, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "Georgia, serif", fontWeight: "bold", cursor: "pointer" }}>
                ✦ &nbsp; {t.commencerGratuitement}
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <button onClick={() => setPage("app")} style={{ background: "#2C2416", border: "none", color: "#D4BD96", padding: "1rem 2rem", borderRadius: 2, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "Georgia, serif", fontWeight: "bold", cursor: "pointer" }}>
              ✦ &nbsp; {t.monEspace}
            </button>
          </SignedIn>
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

      {/* APERÇU GÉNÉRATEUR */}
      <div style={{ background: "#2C2416", padding: "3.5rem 1.5rem", textAlign: "center" }}>
        <div style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(212,189,150,0.5)", marginBottom: "0.75rem" }}>◆ &nbsp; {t.apercuTag}</div>
        <h2 style={{ fontSize: "clamp(1.3rem, 4vw, 1.8rem)", fontWeight: "normal", color: "#FAF7F2", marginBottom: "2.5rem" }}>{t.apercuTitre}</h2>
        <div style={{ maxWidth: 800, margin: "0 auto", background: "#FFFDF9", borderRadius: 4, border: "1px solid #E8DFCF", padding: "1.5rem", textAlign: "left", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem" }}>
            <div>
              <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "#8B7355", marginBottom: "1rem", borderBottom: "1px solid #E8DFCF", paddingBottom: "0.5rem" }}>◈ &nbsp; {t.detailsBien}</div>
              {[
                [t.typeBien, "Villa"],
                [t.ville, lang === "fr" ? "Saint-Tropez, Var" : "Saint-Tropez, French Riviera"],
                [t.surface, "280 m²"],
                [t.prix, "2 850 000 €"]
              ].map(([label, val]) => (
                <div key={label} style={{ marginBottom: "0.6rem" }}>
                  <div style={{ fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", color: "#8B7355" }}>{label}</div>
                  <div style={{ background: "#FAF7F2", border: "1px solid #E8DFCF", padding: "0.4rem 0.6rem", borderRadius: 2, fontSize: "0.82rem", color: "#2C2416", marginTop: 3 }}>{val}</div>
                </div>
              ))}
              <div style={{ background: "#2C2416", color: "#D4BD96", padding: "0.6rem", borderRadius: 2, textAlign: "center", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", marginTop: "0.75rem" }}>✦ &nbsp; {t.generer}</div>
            </div>
            <div>
              <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "#8B7355", marginBottom: "1rem", borderBottom: "1px solid #E8DFCF", paddingBottom: "0.5rem" }}>◈ &nbsp; {lang === "fr" ? "Email généré" : "Generated email"}</div>
              <div style={{ fontSize: "0.78rem", lineHeight: 1.9, color: "#2C2416" }}>
                {lang === "fr" ? (
                  <>
                    <span style={{ color: "#8B7355", fontSize: "0.72rem" }}>Objet : Une villa d'exception vous attend à Saint-Tropez</span>
                    <br /><br />
                    Madame, Monsieur,<br /><br />
                    J'ai le privilège de vous présenter une propriété rare sur la Côte d'Azur : une villa contemporaine de <strong>280 m²</strong>, nichée dans un écrin de verdure à deux pas des plages de Saint-Tropez.<br /><br />
                    Depuis ses terrasses ensoleillées, vous profiterez d'une <strong>vue panoramique sur la mer</strong>.<br /><br />
                    Cette propriété est proposée à <strong>2 850 000 €</strong>.<br /><br />
                    <span style={{ color: "#8B7355", fontStyle: "italic" }}>[Votre nom], Agent immobilier</span>
                  </>
                ) : (
                  <>
                    <span style={{ color: "#8B7355", fontSize: "0.72rem" }}>Subject: An exceptional villa awaits you in Saint-Tropez</span>
                    <br /><br />
                    Dear Sir/Madam,<br /><br />
                    I have the privilege of presenting a rare property on the French Riviera: a contemporary villa of <strong>280 m²</strong>, nestled in lush greenery just steps from the beaches of Saint-Tropez.<br /><br />
                    From its terraces, you will enjoy a breathtaking <strong>panoramic sea view</strong>.<br /><br />
                    This property is offered at <strong>€2,850,000</strong>.<br /><br />
                    <span style={{ color: "#8B7355", fontStyle: "italic" }}>[Your name], Real Estate Agent</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <div style={{ color: "rgba(212,189,150,0.4)", fontSize: 10, marginTop: "1.5rem", letterSpacing: "0.1em" }}>
          ✦ &nbsp; {lang === "fr" ? "Propulsé par l'IA" : "Powered by AI"} &nbsp; ✦
        </div>
      </div>

      {/* SECTION CRM */}
      <div style={{ background: "linear-gradient(180deg, #2C2416 0%, #1C160E 8%)", padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(212,189,150,0.5)", marginBottom: "0.75rem" }}>◆ &nbsp; {lang === "fr" ? "Nouveau — Plan Business" : "New — Business Plan"}</div>
            <h2 style={{ fontSize: "clamp(1.3rem, 4vw, 2rem)", fontWeight: "normal", color: "#FAF7F2", marginBottom: "1rem" }}>
              {lang === "fr" ? "Gérez toute votre activité" : "Manage your entire activity"}{" "}
              <span style={{ color: "#D4BD96", fontStyle: "italic" }}>{lang === "fr" ? "depuis un seul endroit" : "from one place"}</span>
            </h2>
            <p style={{ color: "rgba(250,247,242,0.5)", fontSize: "0.95rem", maxWidth: 500, margin: "0 auto" }}>
              {lang === "fr"
                ? "Le CRM Copyimo centralise vos contacts, vos biens et votre pipeline de vente. Générez vos annonces directement depuis vos fiches biens."
                : "Copyimo CRM centralizes your contacts, properties and sales pipeline. Generate listings directly from your property files."
              }
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", marginBottom: "3rem" }}>
            {(lang === "fr" ? [
              { icon: "👥", titre: "Gestion des contacts", desc: "Centralisez acheteurs et vendeurs avec leurs budgets, préférences et historique." },
              { icon: "🏠", titre: "Portefeuille de biens", desc: "Suivez vos mandats, statuts et générez vos annonces en 1 clic depuis la fiche bien." },
              { icon: "◆", titre: "Pipeline de vente", desc: "Visualisez vos affaires en cours par étape. Glissez-déposez pour mettre à jour." },
              { icon: "◈", titre: "Dashboard en temps réel", desc: "Valeur du portefeuille, biens disponibles, contacts actifs — tout en un coup d'œil." },
            ] : [
              { icon: "👥", titre: "Contact management", desc: "Centralize buyers and sellers with their budgets, preferences and history." },
              { icon: "🏠", titre: "Property portfolio", desc: "Track your mandates, statuses and generate listings in 1 click from the property file." },
              { icon: "◆", titre: "Sales pipeline", desc: "Visualize your ongoing deals by stage. Drag and drop to update." },
              { icon: "◈", titre: "Real-time dashboard", desc: "Portfolio value, available properties, active contacts — everything at a glance." },
            ]).map((f, i) => (
              <div key={i} style={{ background: "rgba(255,253,249,0.05)", border: "1px solid rgba(212,189,150,0.15)", borderRadius: 2, padding: "1.5rem" }}>
                <div style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>{f.icon}</div>
                <div style={{ color: "#D4BD96", fontSize: "0.88rem", fontWeight: "bold", marginBottom: "0.5rem" }}>{f.titre}</div>
                <div style={{ color: "rgba(250,247,242,0.45)", fontSize: "0.8rem", lineHeight: 1.7 }}>{f.desc}</div>
              </div>
            ))}
          </div>

          <div style={{ background: "rgba(255,253,249,0.04)", border: "1px solid rgba(212,189,150,0.15)", borderRadius: 4, padding: "1.5rem", marginBottom: "2.5rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
              {[
                { label: lang === "fr" ? "Contacts" : "Contacts", value: "3", icon: "👥" },
                { label: lang === "fr" ? "Biens" : "Properties", value: "3", icon: "🏠" },
                { label: lang === "fr" ? "Disponibles" : "Available", value: "2", icon: "✅" },
                { label: lang === "fr" ? "Valeur" : "Value", value: "4.28M€", icon: "💰" },
              ].map((s, i) => (
                <div key={i} style={{ background: "rgba(255,253,249,0.06)", borderRadius: 2, padding: "1rem", textAlign: "center", border: "1px solid rgba(212,189,150,0.1)" }}>
                  <div style={{ fontSize: "1.2rem", marginBottom: "0.4rem" }}>{s.icon}</div>
                  <div style={{ fontSize: "1.3rem", color: "#D4BD96" }}>{s.value}</div>
                  <div style={{ fontSize: 9, color: "rgba(212,189,150,0.4)", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "0.5rem" }}>
              {(lang === "fr" ? ["Prospect", "Visite", "Offre", "Négociation", "Signé"] : ["Prospect", "Visit", "Offer", "Negotiation", "Signed"]).map((stage, i) => (
                <div key={i} style={{ background: "rgba(255,253,249,0.04)", border: "1px solid rgba(212,189,150,0.1)", borderRadius: 2, padding: "0.75rem", textAlign: "center" }}>
                  <div style={{ fontSize: 9, color: "rgba(212,189,150,0.5)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.5rem" }}>{stage}</div>
                  <div style={{ fontSize: 16, color: "rgba(212,189,150,0.3)" }}>⌂</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <button onClick={() => setPage("crm")} style={{ background: "linear-gradient(135deg, #D4BD96, #B8986A)", border: "none", color: "#1C160E", padding: "1rem 2.5rem", borderRadius: 2, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "Georgia, serif", fontWeight: "bold", cursor: "pointer", marginBottom: "1rem" }}>
              ✦ &nbsp; {lang === "fr" ? "Découvrir le CRM" : "Discover the CRM"}
            </button>
            <div style={{ color: "rgba(212,189,150,0.3)", fontSize: 10, letterSpacing: "0.1em" }}>
              {lang === "fr" ? "Inclus dans le plan Business à 59€/mois" : "Included in the Business plan at €59/month"}
            </div>
          </div>
        </div>
      </div>

      {/* BANDE BLANCHE */}
      <div style={{ height: "30px", background: "#FAF7F2" }} />

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
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem", maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ background: "#FFFDF9", border: "1px solid #E8DFCF", borderRadius: 2, padding: "1.75rem", boxShadow: "0 2px 12px rgba(44,36,22,0.06)" }}>
            <div style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#8B7355", marginBottom: "0.75rem" }}>Starter</div>
            <div style={{ fontSize: "2.2rem", color: "#2C2416", marginBottom: "0.2rem" }}>19€</div>
            <div style={{ color: "#8B7355", fontSize: 11, marginBottom: "1.25rem" }}>{t.pricingMois}</div>
            {t.starterFeatures.map(f => (
              <div key={f} style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start", marginBottom: "0.6rem", fontSize: "0.82rem", color: "#2C2416" }}>
                <span style={{ color: "#8B7355", flexShrink: 0 }}>✓</span> {f}
              </div>
            ))}
            <button onClick={() => window.open(STRIPE_STARTER, '_blank')} style={{ width: "100%", padding: "0.75rem", background: "transparent", border: "1px solid #2C2416", color: "#2C2416", borderRadius: 2, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "Georgia, serif", cursor: "pointer", marginTop: "1rem" }}>
              {t.commencer}
            </button>
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
            <button onClick={() => window.open(STRIPE_PRO, '_blank')} style={{ width: "100%", padding: "0.75rem", background: "#D4BD96", border: "none", color: "#2C2416", borderRadius: 2, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "Georgia, serif", fontWeight: "bold", cursor: "pointer", marginTop: "1rem" }}>
              ✦ &nbsp; {t.commencer}
            </button>
          </div>
          <div style={{ background: "#1A1510", border: "1px solid #D4BD96", borderRadius: 2, padding: "1.75rem", boxShadow: "0 8px 30px rgba(44,36,22,0.3)", position: "relative" }}>
            <div style={{ position: "absolute", top: -11, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg, #D4BD96, #B8986A)", color: "#1A1510", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", padding: "3px 12px", borderRadius: 20, fontWeight: "bold", whiteSpace: "nowrap" }}>✦ Premium</div>
            <div style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(212,189,150,0.6)", marginBottom: "0.75rem" }}>Business</div>
            <div style={{ fontSize: "2.2rem", color: "#D4BD96", marginBottom: "0.2rem" }}>59€</div>
            <div style={{ color: "rgba(212,189,150,0.5)", fontSize: 11, marginBottom: "1.25rem" }}>{t.pricingMois}</div>
            {t.businessFeatures.map(f => (
              <div key={f} style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start", marginBottom: "0.6rem", fontSize: "0.82rem", color: "rgba(250,247,242,0.8)" }}>
                <span style={{ color: "#D4BD96", flexShrink: 0 }}>✦</span> {f}
              </div>
            ))}
            <button onClick={() => window.open(STRIPE_BUSINESS, '_blank')} style={{ width: "100%", padding: "0.75rem", background: "linear-gradient(135deg, #D4BD96, #B8986A)", border: "none", color: "#1A1510", borderRadius: 2, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "Georgia, serif", fontWeight: "bold", cursor: "pointer", marginTop: "1rem" }}>
              ✦ &nbsp; {t.commencer}
            </button>
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
        <SignedOut>
          <SignUpButton mode="modal">
            <button style={{ background: "linear-gradient(135deg, #D4BD96, #B8986A)", border: "none", color: "#1A1510", padding: "1rem 2rem", borderRadius: 2, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "Georgia, serif", fontWeight: "bold", cursor: "pointer" }}>
              ✦ &nbsp; {t.commencerGratuitement}
            </button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <button onClick={() => setPage("app")} style={{ background: "linear-gradient(135deg, #D4BD96, #B8986A)", border: "none", color: "#1A1510", padding: "1rem 2rem", borderRadius: 2, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "Georgia, serif", fontWeight: "bold", cursor: "pointer" }}>
            ✦ &nbsp; {t.monEspace}
          </button>
        </SignedIn>
      </div>

      {/* QUI SOMMES NOUS */}
      <div style={{ background: "#FAF7F2", padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "#8B7355", marginBottom: "0.75rem" }}>◆ &nbsp; {lang === "fr" ? "Notre histoire" : "Our story"}</div>
            <h2 style={{ fontSize: "clamp(1.3rem, 4vw, 1.8rem)", fontWeight: "normal", color: "#2C2416" }}>
              {lang === "fr" ? "Qui sommes-nous ?" : "Who are we?"}
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem", alignItems: "center" }}>
            <div>
              <div style={{ width: 80, height: 80, background: "#2C2416", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
                <span style={{ color: "#D4BD96", fontSize: "2rem" }}>⌂</span>
              </div>
              <p style={{ fontSize: "0.95rem", lineHeight: 2, color: "#2C2416", marginBottom: "1rem" }}>
                {lang === "fr" ? "Copyimo est né d'une double passion : la technologie et l'immobilier. En observant le quotidien des professionnels de l'immobilier, nous avons réalisé qu'une tâche revenait sans cesse : rédiger." : "Copyimo was born from a dual passion: technology and real estate. By observing the daily lives of real estate professionals, we realized that one task kept coming up: writing."}
              </p>
              <p style={{ fontSize: "0.95rem", lineHeight: 2, color: "#2C2416", marginBottom: "1rem" }}>
                {lang === "fr" ? "Des annonces, des posts, des emails... Des heures précieuses perdues chaque semaine sur des tâches répétitives, au détriment de ce qui compte vraiment : accompagner vos clients et développer votre activité." : "Listings, posts, emails... Precious hours lost each week on repetitive tasks, at the expense of what really matters: accompanying your clients and growing your business."}
              </p>
              <p style={{ fontSize: "0.95rem", lineHeight: 2, color: "#2C2416" }}>
                {lang === "fr" ? "Nous avons créé Copyimo pour vous rendre ce temps. Simple, rapide, élégant — à l'image des professionnels qui l'utilisent." : "We created Copyimo to give you back this time. Simple, fast, elegant — just like the professionals who use it."}
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {(lang === "fr" ? [
                { icon: "◈", titre: "Notre mission", desc: "Libérer les agents immobiliers des tâches rédactionnelles pour qu'ils se concentrent sur leur cœur de métier." },
                { icon: "◈", titre: "Notre technologie", desc: "Les IA les plus avancées au service de la rédaction immobilière professionnelle en français." },
                { icon: "◈", titre: "Notre engagement", desc: "Un outil qui évolue avec vos besoins. Vos retours construisent Copyimo de demain." }
              ] : [
                { icon: "◈", titre: "Our mission", desc: "Free real estate agents from writing tasks so they can focus on their core business." },
                { icon: "◈", titre: "Our technology", desc: "The most advanced AI for professional real estate writing." },
                { icon: "◈", titre: "Our commitment", desc: "A tool that evolves with your needs. Your feedback builds tomorrow's Copyimo." }
              ]).map((item, i) => (
                <div key={i} style={{ background: "#FFFDF9", border: "1px solid #E8DFCF", borderRadius: 2, padding: "1.25rem", boxShadow: "0 2px 8px rgba(44,36,22,0.04)" }}>
                  <div style={{ color: "#8B7355", fontSize: 14, marginBottom: "0.4rem" }}>{item.icon} &nbsp; <strong style={{ color: "#2C2416", fontSize: "0.88rem" }}>{item.titre}</strong></div>
                  <div style={{ color: "#8B7355", fontSize: "0.82rem", lineHeight: 1.7 }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ textAlign: "center", padding: "1.5rem", borderTop: "1px solid #E8DFCF", color: "#B8A88A", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase" }}>
        ◆ &nbsp; Copyimo &nbsp; ◆ &nbsp; {t.footer} &nbsp; ◆ &nbsp; © 2026 &nbsp;
        <span onClick={() => setShowLegal(true)} style={{ cursor: "pointer", textDecoration: "underline", marginLeft: "0.5rem" }}>
          {lang === "fr" ? "Mentions légales" : "Legal notice"}
        </span>
        &nbsp; ◆ &nbsp;
        <a href="mailto:contact@copyimo.com" style={{ color: "#B8A88A", textDecoration: "underline" }}>
          {lang === "fr" ? "Nous contacter" : "Contact us"}
        </a>
      </div>

      {showLegal && <Legal lang={lang} onClose={() => setShowLegal(false)} />}
    </div>
  )
}

const labelStyle = { fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "#8B7355", display: "block" }
const inputStyle = { width: "100%", padding: "0.6rem 0.75rem", marginTop: 5, border: "1px solid #E8DFCF", borderRadius: 2, fontFamily: "Georgia, serif", fontSize: "0.85rem", color: "#2C2416", background: "#FAF7F2", boxSizing: "border-box" }
const btnStyle = { padding: "0.5rem 0.9rem", border: "1px solid #E8DFCF", borderRadius: 2, background: "#FAF7F2", cursor: "pointer", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#8B7355", fontFamily: "Georgia, serif" }