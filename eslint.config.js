import { useState } from "react"

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

  const generer = async () => {
    if (!ville || !surface || !prix || !points) {
      alert("Merci de remplir tous les champs !")
      return
    }

    setLoading(true)
    setResultat("")

    const prompt = `Tu es un expert en immobilier français. Génère un ${typeContenu} avec un ton ${ton} pour ce bien :
- Type : ${typeBien}
- Ville : ${ville}
- Surface : ${surface} m²
- Prix : ${prix} €
- Points forts : ${points}

Génère uniquement le contenu, sans commentaires.`

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }]
      })
    })

    const data = await response.json()
    setResultat(data.content[0].text)
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem", fontFamily: "sans-serif" }}>
      <h1 style={{ color: "#1A1612" }}>🏠 ImmoRédac</h1>
      <p style={{ color: "#7A7268" }}>Générateur de contenu pour agents immobiliers</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "2rem" }}>
        <div>
          <label>Type de bien</label>
          <select value={typeBien} onChange={e => setTypeBien(e.target.value)} style={inputStyle}>
            <option value="appartement">Appartement</option>
            <option value="maison">Maison</option>
            <option value="villa">Villa</option>
            <option value="terrain">Terrain</option>
          </select>
        </div>

        <div>
          <label>Ville</label>
          <input value={ville} onChange={e => setVille(e.target.value)} placeholder="ex : Bordeaux" style={inputStyle} />
        </div>

        <div>
          <label>Surface (m²)</label>
          <input value={surface} onChange={e => setSurface(e.target.value)} placeholder="ex : 120" style={inputStyle} />
        </div>

        <div>
          <label>Prix (€)</label>
          <input value={prix} onChange={e => setPrix(e.target.value)} placeholder="ex : 350000" style={inputStyle} />
        </div>
      </div>

      <div style={{ marginTop: "1rem" }}>
        <label>Points forts</label>
        <textarea value={points} onChange={e => setPoints(e.target.value)} placeholder="ex : jardin, cuisine rénovée, lumineux..." style={{ ...inputStyle, height: 80 }} />
      </div>

      <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem", flexWrap: "wrap" }}>
        {["annonce", "linkedin", "instagram", "email"].map(t => (
          <button key={t} onClick={() => setTypeContenu(t)} style={typeContenu === t ? activeTabStyle : tabStyle}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
        {["professionnel", "chaleureux", "luxe"].map(t => (
          <button key={t} onClick={() => setTon(t)} style={ton === t ? activeTabStyle : tabStyle}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <button onClick={generer} disabled={loading} style={btnStyle}>
        {loading ? "Génération en cours..." : "✨ Générer le contenu"}
      </button>

      {resultat && (
        <div style={{ marginTop: "2rem", padding: "1.5rem", background: "#F8F4EE", borderRadius: 12, whiteSpace: "pre-wrap", lineHeight: 1.7 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
            <strong>Contenu généré</strong>
            <button onClick={() => navigator.clipboard.writeText(resultat)} style={tabStyle}>📋 Copier</button>
          </div>
          {resultat}
        </div>
      )}
    </div>
  )
}

const inputStyle = {
  width: "100%", padding: "0.6rem", borderRadius: 8,
  border: "1px solid #E2D9CC", fontFamily: "sans-serif",
  fontSize: "0.9rem", marginTop: 4, boxSizing: "border-box"
}
const tabStyle = {
  padding: "0.4rem 1rem", borderRadius: 20, border: "1px solid #E2D9CC",
  background: "#F8F4EE", cursor: "pointer", fontSize: 13
}
const activeTabStyle = {
  ...tabStyle, background: "#1A1612", color: "white", border: "1px solid #1A1612"
}
const btnStyle = {
  width: "100%", padding: "0.85rem", background: "#1A1612", color: "white",
  border: "none", borderRadius: 10, fontSize: "1rem", cursor: "pointer", marginTop: "1rem"
}