export const translations = {
  fr: {
    // HEADER
    connexion: "Connexion",
    essaiGratuit: "Essai gratuit",
    monEspace: "Mon espace",
    soustitre: "Rédaction Immobilière",

    // HERO
    tagline: "L'art de la rédaction immobilière",
    heroTitre1: "Rédigez vos annonces",
    heroTitre2: "immobilières en",
    heroAccroche: "10 secondes",
    heroDesc: "L'IA génère pour vous annonces, posts LinkedIn, captions Instagram et emails clients.",
    commencerGratuitement: "Commencer gratuitement",
    sansCarteBank: "30 jours gratuits · Sans carte bancaire",

    // STATS
    parAnnonce: "Par annonce",
    deContenu: "De contenu",
    differents: "Différents",
    enFrancais: "En français",

    // FEATURES
    featuresTitre: "Tout ce dont vous avez besoin",
    featuresTag: "Fonctionnalités",
    features: [
      { title: "4 formats de contenu", desc: "Annonce, post LinkedIn, caption Instagram et email client générés en un clic" },
      { title: "3 tons différents", desc: "Professionnel, chaleureux ou prestige selon le bien et votre clientèle" },
      { title: "IA de dernière génération", desc: "Propulsé par une IA de pointe, la technologie la plus avancée pour la rédaction professionnelle" },
      { title: "Copier en un clic", desc: "Copiez directement votre contenu et publiez-le où vous voulez" },
      { title: "Illimité en Pro", desc: "Générez autant d'annonces que vous voulez, sans restriction" },
      { title: "100% en français", desc: "Conçu spécifiquement pour le marché immobilier français" }
    ],

    // APERÇU
    apercuTag: "Aperçu",
    apercuTitre: "Simple, rapide, efficace",

    // TÉMOIGNAGES
    temoignagesTag: "Témoignages",
    temoignagesTitre: "Ils nous font confiance",
    temoignages: [
      { name: "Sophie M.", role: "Agent immobilier — Paris 16e", text: "Je passais 30 minutes par annonce. Avec Copyimo, c'est 30 secondes. Un gain de temps incroyable !" },
      { name: "Jean-Pierre L.", role: "Directeur d'agence — Bordeaux", text: "La qualité des textes générés est bluffante. Mes clients me demandent souvent qui rédige mes annonces." },
      { name: "Marie C.", role: "Négociatrice indépendante — Lyon", text: "Enfin un outil fait pour nous ! Le ton prestige est parfait pour mes biens haut de gamme." }
    ],

    // PRICING
    pricingTag: "Tarifs",
    pricingTitre: "Simple et transparent",
    pricingMois: "par mois",
    recommande: "Recommandé",
    commencer: "Commencer",
    starterFeatures: ["30 générations/mois", "4 formats de contenu", "3 tons disponibles", "Support par email"],
    proFeatures: ["Générations illimitées", "4 formats de contenu", "3 tons disponibles", "Support prioritaire", "Nouvelles fonctionnalités en avant-première"],

    // FAQ
    faqTag: "FAQ",
    faqTitre: "Questions fréquentes",
    faqs: [
      { q: "Comment fonctionne l'essai gratuit ?", a: "Vous avez accès à toutes les fonctionnalités pendant 30 jours, sans carte bancaire. À la fin de l'essai, vous choisissez votre plan." },
      { q: "Puis-je annuler à tout moment ?", a: "Oui, sans engagement et sans frais. Vous pouvez annuler votre abonnement en un clic depuis votre espace client." },
      { q: "Les textes sont-ils vraiment uniques ?", a: "Oui, chaque génération est unique. L'IA crée un texte original basé sur les informations que vous fournissez." },
      { q: "Puis-je modifier les textes générés ?", a: "Absolument ! Les textes sont une base de travail que vous pouvez modifier librement avant de les publier." },
      { q: "Copyimo fonctionne-t-il sur mobile ?", a: "Oui, Copyimo est accessible sur tous les appareils : ordinateur, tablette et smartphone." }
    ],

    // CTA
    ctaTag: "Prêt à commencer ?",
    ctaTitre1: "Rejoignez les agents qui",
    ctaTitre2: "gagnent du temps",
    ctaDesc: "30 jours gratuits · Sans carte bancaire · Annulation à tout moment",

    // FOOTER
    footer: "Rédaction Immobilière par l'IA",

    // OUTIL
    detailsBien: "Détails du bien",
    votreContenu: "Votre contenu",
    format: "Format",
    typeBien: "Type de bien",
    ville: "Ville",
    surface: "Surface (m²)",
    prix: "Prix (€)",
    atouts: "Atouts du bien",
    registre: "Registre",
    generer: "Générer le contenu",
    redactionEnCours: "Rédaction...",
    pret: "Prêt",
    copier: "Copier",
    regenerer: "Regénérer",
    effacer: "Effacer",
    renseignez: "Renseignez les informations et générez votre contenu",
    redactionLoading: "Rédaction en cours",
    appartement: "Appartement",
    maison: "Maison",
    villa: "Villa",
    terrain: "Terrain",
    local: "Local commercial",
    annonce: "Annonce",
    linkedin: "LinkedIn",
    instagram: "Instagram",
    email: "Email",
    professionnel: "Professionnel",
    chaleureux: "Chaleureux",
    prestige: "Prestige",
    villePlaceholder: "Paris...",
    atoursPlaceholder: "Jardin, cuisine rénovée, lumineux...",
    promptTemplate: (typeContenu, ton, typeBien, ville, surface, prix, points) =>
      `Tu es un expert en immobilier français haut de gamme. Génère un ${typeContenu} avec un ton ${ton} pour ce bien : Type : ${typeBien}, Ville : ${ville}, Surface : ${surface} m², Prix : ${prix} €, Points forts : ${points}. Génère uniquement le contenu en FRANÇAIS, sans commentaires.`,
    remplirChamps: "Merci de remplir tous les champs !",
    vosAnnonces: "Vos annonces,",
    redigeesEnUnInstant: "rédigées en un instant",
  },

  en: {
    // HEADER
    connexion: "Sign in",
    essaiGratuit: "Free trial",
    monEspace: "My dashboard",
    soustitre: "Real Estate Copywriting",

    // HERO
    tagline: "The art of real estate copywriting",
    heroTitre1: "Write your property listings",
    heroTitre2: "in just",
    heroAccroche: "10 seconds",
    heroDesc: "AI generates your listings, LinkedIn posts, Instagram captions and client emails.",
    commencerGratuitement: "Start for free",
    sansCarteBank: "30-day free trial · No credit card required",

    // STATS
    parAnnonce: "Per listing",
    deContenu: "Content types",
    differents: "Different tones",
    enFrancais: "In your language",

    // FEATURES
    featuresTitre: "Everything you need",
    featuresTag: "Features",
    features: [
      { title: "4 content formats", desc: "Listing, LinkedIn post, Instagram caption and client email generated in one click" },
      { title: "3 different tones", desc: "Professional, warm or prestige depending on the property and your clientele" },
      { title: "Latest generation AI", desc: "Powered by cutting-edge AI, the most advanced technology for professional copywriting" },
      { title: "Copy in one click", desc: "Copy your content directly and publish it wherever you want" },
      { title: "Unlimited in Pro", desc: "Generate as many listings as you want, without any restriction" },
      { title: "Built for real estate", desc: "Specifically designed for the real estate market" }
    ],

    // APERÇU
    apercuTag: "Preview",
    apercuTitre: "Simple, fast, effective",

    // TÉMOIGNAGES
    temoignagesTag: "Testimonials",
    temoignagesTitre: "Trusted by agents",
    temoignages: [
      { name: "Sophie M.", role: "Real estate agent — Paris", text: "I used to spend 30 minutes per listing. With Copyimo, it takes 30 seconds. An incredible time saver!" },
      { name: "Jean-Pierre L.", role: "Agency director — Bordeaux", text: "The quality of the generated texts is stunning. My clients often ask who writes my listings." },
      { name: "Marie C.", role: "Independent negotiator — Lyon", text: "Finally a tool made for us! The prestige tone is perfect for my high-end properties." }
    ],

    // PRICING
    pricingTag: "Pricing",
    pricingTitre: "Simple and transparent",
    pricingMois: "per month",
    recommande: "Recommended",
    commencer: "Get started",
    starterFeatures: ["30 generations/month", "4 content formats", "3 tones available", "Email support"],
    proFeatures: ["Unlimited generations", "4 content formats", "3 tones available", "Priority support", "Early access to new features"],

    // FAQ
    faqTag: "FAQ",
    faqTitre: "Frequently asked questions",
    faqs: [
      { q: "How does the free trial work?", a: "You have access to all features for 30 days, no credit card required. At the end of the trial, you choose your plan." },
      { q: "Can I cancel at any time?", a: "Yes, with no commitment and no fees. You can cancel your subscription with one click from your account." },
      { q: "Are the texts really unique?", a: "Yes, each generation is unique. The AI creates original text based on the information you provide." },
      { q: "Can I edit the generated texts?", a: "Absolutely! The texts are a starting point that you can freely edit before publishing." },
      { q: "Does Copyimo work on mobile?", a: "Yes, Copyimo is accessible on all devices: computer, tablet and smartphone." }
    ],

    // CTA
    ctaTag: "Ready to start?",
    ctaTitre1: "Join the agents who",
    ctaTitre2: "save time",
    ctaDesc: "30-day free trial · No credit card · Cancel anytime",

    // FOOTER
    footer: "Real Estate Copywriting by AI",

    // OUTIL
    detailsBien: "Property details",
    votreContenu: "Your content",
    format: "Format",
    typeBien: "Property type",
    ville: "City",
    surface: "Area (m²)",
    prix: "Price (€)",
    atouts: "Property highlights",
    registre: "Tone",
    generer: "Generate content",
    redactionEnCours: "Generating...",
    pret: "Ready",
    copier: "Copy",
    regenerer: "Regenerate",
    effacer: "Clear",
    renseignez: "Fill in the property details and generate your content",
    redactionLoading: "Generating content",
    appartement: "Apartment",
    maison: "House",
    villa: "Villa",
    terrain: "Land",
    local: "Commercial property",
    annonce: "Listing",
    linkedin: "LinkedIn",
    instagram: "Instagram",
    email: "Email",
    professionnel: "Professional",
    chaleureux: "Warm",
    prestige: "Prestige",
    villePlaceholder: "London...",
    atoursPlaceholder: "Garden, renovated kitchen, bright...",
    promptTemplate: (typeContenu, ton, typeBien, ville, surface, prix, points) =>
      `You are a high-end real estate expert. Generate a ${typeContenu} with a ${ton} tone for this property: Type: ${typeBien}, City: ${ville}, Area: ${surface} m², Price: ${prix} €, Highlights: ${points}. Generate only the content in ENGLISH, no comments.`,
    remplirChamps: "Please fill in all fields!",
    vosAnnonces: "Your listings,",
    redigeesEnUnInstant: "written in an instant",
  }
}