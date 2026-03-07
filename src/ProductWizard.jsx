import React, { useState, useEffect, useRef } from "react";
import "./ProductWizard.css";

/* =============================================================================
  STRUTTURA JSON PRODOTTI (v2)
  
  Ogni prodotto ha uno schema "scores" con punteggi per ogni risposta dell'utente.
  Il matching è a PUNTEGGIO: più alto = più rilevante. Nessun prodotto viene
  completamente escluso (salvo categoria diversa), ma vengono ordinati per score.
  
  Schema:
  {
    "id": "unique-id",
    "category": "foil" | "sup" | "pump",
    "title": "Nome Prodotto",
    "brand": "Brand",
    "image": "https://...",
    "price": 1299,
    "originalPrice": 1499,        // Opzionale, mostra sconto %
    "link": "https://...",
    "discount": "CODICE10",       // Opzionale
    "stock": "available" | "low" | "last",  // Urgenza stock
    "badge": "Bestseller" | "Nuovo" | "Top Rated", // Opzionale
    "ratings": { "lift": 4, "speed": 3, "control": 5 },
    "specs": { "Mast": "83cm", "Wing": "1350cm²" },
    "description_it": "...",
    "description_en": "...",
    "scores": {
      "sport_wing": 10,           // Chiave: {domanda}_{risposta} → punteggio 0-10
      "sport_pump": 2,
      "foil_level_beg": 8,
      "foil_level_int": 10,
      "wing_wind_light": 9,
      "wing_wind_all": 6
    }
  }
  =============================================================================
*/

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const LOGO_URL =
  "https://www.sportalcentro.it/wp-content/uploads/product-wizard/michele_profilo.jpg";
const WA_NUMBER = "393398307088";
const YOUTUBE_VIDEO_ID = "rV2LbWP9GS8";
const MIN_SCORE_THRESHOLD = 3; // Prodotti con score < N vengono nascosti
const MAX_RESULTS = 6;          // Massimo prodotti mostrati

// ─── PRODOTTI ─────────────────────────────────────────────────────────────────
const PRODUCTS = [
  // --- FOIL ---
  {
    id: "sab-leviathan-1550-73",
    category: "foil",
    title: "Sabfoil Leviathan 1550/73",
    brand: "Sabfoil",
    image: "https://www.sportalcentro.it/wp-content/uploads/product-wizard/sabfoil_lev_1350_1550_73.jpg",
    price: 1529,
    link: "https://sabfoil.com/it/products/KL_1550-663-370_73P",
    discount: "sac10",
    stock: "available",
    badge: "Bestseller",
    ratings: { lift: 5, speed: 2, control: 4 },
    specs: { "Mast": "73cm", "Wing": "1550 cm²", "Tipo": "Freeride" },
    description_it: "La massima portanza per chi inizia il pump foil o vuole volare con vento leggero.",
    description_en: "Maximum lift for pump foil beginners or light wind riding.",
    scores: {
      sport_pump: 10, sport_sup: 9,
      foil_level_beg: 10, foil_level_int: 8, foil_level_adv: 4,
      wing_wind_light: 7
    },
  },
  {
    id: "sab-leviathan-1350-73",
    category: "foil",
    title: "Sabfoil Leviathan 1350/73",
    brand: "Sabfoil",
    image: "https://www.sportalcentro.it/wp-content/uploads/product-wizard/sabfoil_lev_1350_1550_73.jpg",
    price: 1529,
    link: "https://sabfoil.com/it/products/KL_1350-663-370_73P",
    discount: "sac10",
    stock: "low",
    badge: "Top Rated",
    ratings: { lift: 5, speed: 3, control: 4 },
    specs: { "Mast": "73cm", "Wing": "1350 cm²", "Tipo": "Freeride" },
    description_it: "Il bilanciamento perfetto tra portanza e velocità per pump e SUP foil.",
    description_en: "Perfect balance of lift and speed for pump and SUP foil.",
    scores: {
      sport_pump: 9, sport_sup: 10,
      foil_level_beg: 8, foil_level_int: 10, foil_level_adv: 6,
    },
  },
  {
    id: "sab-leviathanPRO-1360-73",
    category: "foil",
    title: "Sabfoil Leviathan PRO 1360/73",
    brand: "Sabfoil",
    image: "https://www.sportalcentro.it/wp-content/uploads/product-wizard/sabfoil_lev_1360PRO_73.webp",
    price: 1549,
    link: "https://sabfoil.com/it/products/KLP_1360-663-370_73",
    discount: "sac10",
    stock: "available",
    badge: "Nuovo",
    ratings: { lift: 5, speed: 4, control: 5 },
    specs: { "Mast": "73cm", "Wing": "1360 cm²", "Tipo": "PRO" },
    description_it: "Versione PRO per sessioni di pump endurance ad alto livello.",
    description_en: "PRO version for high-level endurance pump sessions.",
    scores: {
      sport_pump: 10, sport_sup: 8,
      foil_level_int: 9, foil_level_adv: 10,
    },
  },
  {
    id: "sab-RazorBB_977_75",
    category: "foil",
    title: "Sabfoil Razor Blackbird 977/75",
    brand: "Sabfoil",
    image: "https://www.sportalcentro.it/wp-content/uploads/product-wizard/sabfoil_razorBB_977_1077_75.webp",
    price: 1889,
    link: "https://sabfoil.com/it/products/KR-977-375-75-BB",
    discount: "sac10",
    stock: "available",
    badge: "Top Rated",
    ratings: { lift: 4, speed: 5, control: 5 },
    specs: { "Mast": "75cm", "Wing": "977 cm²", "Tipo": "Blackbird" },
    description_it: "Velocità e controllo per il wing foil tutto-tondo e condizioni variabili.",
    description_en: "Speed and control for all-round wing foil and variable conditions.",
    scores: {
      sport_wing: 10,
      foil_level_int: 8, foil_level_adv: 10,
      wing_wind_light: 8, wing_wind_all: 10, wing_wind_free: 7,
    },
  },
  {
    id: "sab-RazorPRO_975_73",
    category: "foil",
    title: "Sabfoil Razor PRO 975/73",
    brand: "Sabfoil",
    image: "https://www.sportalcentro.it/wp-content/uploads/product-wizard/sabfoil_razorPRO_975_1075_83.webp",
    price: 1499,
    link: "https://sabfoil.com/it/products/KRP_975-653-370_83",
    discount: "sac10",
    stock: "available",
    ratings: { lift: 3, speed: 5, control: 4 },
    specs: { "Mast": "73cm", "Wing": "975 cm²", "Tipo": "PRO Race" },
    description_it: "Il riferimento PRO per il wing foil in condizioni di vento medio-forte.",
    description_en: "PRO benchmark for medium-strong wind wing foiling.",
    scores: {
      sport_wing: 9,
      foil_level_int: 7, foil_level_adv: 10,
      wing_wind_light: 6, wing_wind_all: 9, wing_wind_free: 8,
    },
  },
  {
    id: "sab-BalzPRO_909_83",
    category: "foil",
    title: "Sabfoil Balz PRO 909/83",
    brand: "Sabfoil",
    image: "https://www.sportalcentro.it/wp-content/uploads/product-wizard/sabfoil_balzPRO_909_808_83.jpg",
    price: 1569,
    link: "https://sabfoil.com/it/products/BALZ_909-370-663_83",
    discount: "sac10",
    stock: "low",
    badge: "Bestseller",
    ratings: { lift: 4, speed: 4, control: 5 },
    specs: { "Mast": "83cm", "Wing": "909 cm²", "Tipo": "Wave/Freestyle" },
    description_it: "Progettato con Balz Mueller per onde e freestyle. Risposta immediata.",
    description_en: "Designed with Balz Mueller for waves and freestyle. Instant response.",
    scores: {
      sport_wing: 10,
      foil_level_int: 8, foil_level_adv: 10,
      wing_wind_wave: 10, wing_wind_free: 9,
    },
  },
  {
    id: "sab-BalzPROBB_905_85",
    category: "foil",
    title: "Sabfoil Balz PRO Blackbird 905/85",
    brand: "Sabfoil",
    image: "https://www.sportalcentro.it/wp-content/uploads/product-wizard/sabfoil_balzBB_905_805_85.webp",
    price: 1879,
    link: "https://sabfoil.com/it/products/kit-blackbird-Balz-Pro-905-Mast-85",
    discount: "sac10",
    stock: "last",
    badge: "Limited",
    ratings: { lift: 4, speed: 5, control: 5 },
    specs: { "Mast": "85cm", "Wing": "905 cm²", "Tipo": "Blackbird Wave" },
    description_it: "La versione Blackbird del Balz PRO: più veloce, più stabile nelle onde.",
    description_en: "The Blackbird version of Balz PRO: faster, more stable in waves.",
    scores: {
      sport_wing: 10,
      foil_level_adv: 10, foil_level_int: 6,
      wing_wind_wave: 10, wing_wind_free: 8,
    },
  },
  {
    id: "sab-leviathanEasy-1150-83",
    category: "foil",
    title: "Sabfoil Leviathan EasyRiding 1150/83",
    brand: "Sabfoil",
    image: "https://www.sportalcentro.it/wp-content/uploads/product-wizard/sabfoil_lev_easy_73.jpg",
    price: 1449,
    link: "https://sabfoil.com/it/products/KL_1150-703-425_83",
    discount: "sac10",
    stock: "available",
    badge: "Consigliato Principianti",
    ratings: { lift: 5, speed: 2, control: 5 },
    specs: { "Mast": "83cm", "Wing": "1150 cm²", "Tipo": "EasyRiding" },
    description_it: "La scelta ideale per iniziare il wing foil: massima stabilità e perdono.",
    description_en: "Ideal choice to start wing foiling: maximum stability and forgiveness.",
    scores: {
      sport_wing: 8,
      foil_level_beg: 10, foil_level_int: 6,
      wing_wind_light: 9, wing_wind_all: 8,
    },
  },
  {
    id: "indiana-manta-xl",
    category: "foil",
    title: "Indiana Manta XL",
    brand: "Indiana",
    image: "https://www.sportalcentro.it/wp-content/uploads/product-wizard/indiana_mantaxl_alu.webp",
    price: 1689,
    link: "https://indiana-paddlesurf.com/en_eu/indiana-pump-foil-manta-xl-complete-3629sq.html",
    discount: "sac10",
    stock: "available",
    badge: "Top Rated",
    ratings: { lift: 5, speed: 3, control: 4 },
    specs: { "Mast": "75cm", "Wing": "Manta XL", "Tipo": "Pump Foil" },
    description_it: "Il foil pump di riferimento per tutti i livelli: stabilissimo e reattivo.",
    description_en: "The benchmark pump foil for all levels: stable and responsive.",
    scores: {
      sport_pump: 10, sport_sup: 7,
      foil_level_beg: 9, foil_level_int: 10, foil_level_adv: 8,
    },
  },
  {
    id: "indiana-barracuda-xl-85",
    category: "foil",
    title: "Indiana Barracuda XL / 85",
    brand: "Indiana",
    image: "https://www.sportalcentro.it/wp-content/uploads/product-wizard/indiana_barracuda.webp",
    price: 2269,
    originalPrice: 2499,
    link: "https://indiana-paddlesurf.com/en_eu/indiana-downwind-foil-barracuda-xl-complete-3623sq.html",
    discount: "sac10",
    stock: "low",
    badge: "Downwind",
    ratings: { lift: 5, speed: 4, control: 4 },
    specs: { "Mast": "85cm", "Wing": "XL", "Tipo": "Downwind" },
    description_it: "Per il downwind e il vento leggero: portanza enorme con mast lungo.",
    description_en: "For downwind and light wind: huge lift with long mast.",
    scores: {
      sport_wing: 7, sport_dw: 10, sport_sup: 6,
      foil_level_beg: 7, foil_level_int: 9, foil_level_adv: 8,
      wing_wind_light: 9,
    },
  },

  // --- SUP ---
  {
    id: "sup-allround",
    category: "sup",
    title: "Family Cruiser 10'6",
    brand: "Generic",
    image: "https://images.unsplash.com/photo-1612663957242-706f9d453625?auto=format&fit=crop&w=600&q=80",
    price: 399,
    link: "#",
    discount: "SPORTALCENTRO",
    stock: "available",
    badge: "Famiglia",
    ratings: { stability: 5, stiffness: 3, speed: 2 },
    specs: { "Lunghezza": "10'6\"", "Larghezza": "32\"", "Tipo": "All-round" },
    description_it: "La tavola tuttofare: stabile, facile, perfetta per famiglia e principianti.",
    description_en: "The do-it-all board: stable, easy, perfect for family and beginners.",
    scores: {
      sup_use_occasional: 10, sup_use_yoga: 9, sup_use_family: 10,
      sup_budget_b_low: 10, sup_budget_b_mid: 8,
      sup_level_beg: 10, sup_level_int: 7,
    },
  },

  // --- POMPE ---
  {
    id: "airbank-puffer-pro",
    category: "pump",
    title: "Airbank Puffer Pro",
    brand: "Airbank",
    image: "https://www.sportalcentro.it/wp-content/uploads/product-wizard/airbank_puffer_pro.png.webp",
    price: 110,
    link: "https://www.airbankpump.com/products/airbank-puffer-pro-rechargeable-pump",
    discount: "sportalcentro",
    stock: "available",
    badge: "Ultra Compatta",
    ratings: { compactness: 5, autonomy: 3, speed: 3 },
    specs: { "Peso": "380g", "Pressione": "20 PSI", "Batteria": "2000mAh" },
    description_it: "La pompa più compatta al mondo: entra in tasca, va ovunque.",
    description_en: "The world's most compact pump: pocket-sized, goes anywhere.",
    scores: {
      pump_prio_compact: 10, pump_prio_power: 3,
      pump_target_sup: 8, pump_target_wing: 9, pump_target_mat: 7,
    },
  },
  {
    id: "airbank-pulse-pro",
    category: "pump",
    title: "Airbank Pulse Pro",
    brand: "Airbank",
    image: "https://www.sportalcentro.it/wp-content/uploads/product-wizard/airbank_pulse_pro.png.webp",
    price: 125,
    link: "https://www.airbankpump.com/products/airbank-pulse-pro-rechargeable-pump",
    discount: "sportalcentro",
    stock: "available",
    badge: "Miglior Equilibrio",
    ratings: { compactness: 4, autonomy: 4, speed: 4 },
    specs: { "Peso": "580g", "Pressione": "25 PSI", "Batteria": "3000mAh" },
    description_it: "Il bilanciamento perfetto: compatta abbastanza, potente abbastanza.",
    description_en: "The perfect balance: compact enough, powerful enough.",
    scores: {
      pump_prio_compact: 8, pump_prio_power: 8,
      pump_target_sup: 9, pump_target_wing: 8, pump_target_kayak: 7,
    },
  },
  {
    id: "ride-engine-air-pump",
    category: "pump",
    title: "Ride Engine Air Pump",
    brand: "Ride Engine",
    image: "https://www.sportalcentro.it/wp-content/uploads/product-wizard/ridengine_air.jpg",
    price: 218,
    link: "https://www.kiteworldshop.com/it/wing-surf-pumps/11306-ride-engine-air-box-mini-electric-pump-840362193367.html?affp=27205",
    stock: "low",
    badge: "Pro",
    ratings: { compactness: 2, autonomy: 5, speed: 5 },
    specs: { "Peso": "1.2kg", "Pressione": "30 PSI", "Batteria": "5000mAh" },
    description_it: "Heavy duty per uso intensivo: gonfia tutto, dura tutto il giorno.",
    description_en: "Heavy duty for intensive use: inflates everything, lasts all day.",
    scores: {
      pump_prio_power: 10, pump_prio_compact: 2,
      pump_target_sup: 10, pump_target_kayak: 10, pump_target_wing: 9,
    },
  },
];

// ─── TRADUZIONI ───────────────────────────────────────────────────────────────
const T = {
  it: {
    welcome: {
      badge: "🔒 VERSIONE PRELIMINARE — NON CONDIVIDERE",
      title: "Non sprecare soldi sull'attrezzatura sbagliata.",
      subtitle: "Ho testato centinaia di prodotti su YouTube. Rispondi a 4 domande e trovi il tuo setup perfetto.",
      cta: "TROVA IL MIO SETUP →",
      trust: "Test indipendenti al 100%",
      reviews: "Oltre 200 recensioni video",
    },
    step: "Passo",
    back: "← Indietro",
    restart: "Ricomincia da capo",
    result_intro: "I migliori setup per te, ordinati per compatibilità:",
    no_results: "Nessun prodotto trovato. Contattami su WhatsApp!",
    price: "Prezzo",
    was: "Era",
    discount_label: "CODICE SCONTO",
    buy_btn: "Vedi offerta sul sito ufficiale",
    wa_btn: "Hai dubbi? Scrivimi",
    wa_msg: "Ciao Michele, ho fatto il test attrezzatura ma ho ancora dubbi...",
    sort: "Ordina:",
    sort_score: "Più rilevante",
    sort_price_asc: "Prezzo ↑",
    sort_price_desc: "Prezzo ↓",
    stock_low: "⚡ Ultimi pezzi",
    stock_last: "🔥 Ultimo disponibile",
    match_label: "Compatibilità",
    checkout_hint: "Inserisci il codice al checkout per lo sconto",
    questions: {
      category: "Cosa stai cercando?",
      sport: "Quale disciplina?",
      foil_level: "Qual è il tuo livello?",
      wing_wind: "Qual sarà il tuo utilizzo prevalente?",
      surf_wave: "Che tipo di onde surfi?",
      pump_goal: "Il tuo obiettivo nel Pump Foil?",
      dw_level: "La tua esperienza nel Downwind?",
      sup_level: "Esperienza col SUP?",
      sup_use: "Utilizzo principale?",
      sup_budget: "Il tuo budget?",
      pump_target: "Cosa devi gonfiare?",
      pump_prio: "La tua priorità?",
    },
    options: {
      foil: "🚀 Hydrofoil",
      sup: "🏄 SUP Gonfiabile",
      pump: "⚡ Pompe Elettriche",
      wing: "Wing Foil",
      surf: "Surf Foil",
      pump_sport: "Pump Foil",
      dw: "Downwind",
      sup_sport: "SUP Foil",
      beg: "Principiante",
      int: "Intermedio",
      adv: "Avanzato",
      light: "Vento leggero / Flat",
      wave: "Wave / Onde",
      free: "Freestyle",
      all: "All-round (un po' di tutto)",
      small: "Piccole / Lente",
      fast: "Veloci / Tubanti",
      learn: "Imparare (Dock Start)",
      endurance: "Resistenza / Distanza",
      freestyle: "Freestyle",
      beginner: "Sto imparando",
      expert: "Ho esperienza",
      s_beg: "Principiante",
      s_int: "Intermedio",
      s_adv: "Avanzato",
      occasional: "Utilizzo occasionale",
      excursion: "Escursioni",
      race: "Velocità / Gara",
      yoga: "Yoga / Fitness",
      b_low: "< 300 €",
      b_mid: "300–600 €",
      b_high: "> 600 €",
      t_sup: "SUP gonfiabile",
      t_kayak: "Kayak",
      t_wing: "Wing / Kite",
      t_mat: "Materassini",
      compact: "Minimo ingombro",
      power: "Autonomia e potenza",
    },
    labels: {
      lift: "Portanza", speed: "Velocità", control: "Controllo",
      stability: "Stabilità", stiffness: "Rigidità",
      compactness: "Compattezza", autonomy: "Autonomia", noise: "Silenziosità",
    },
  },
  en: {
    welcome: {
      badge: "🔒 PRELIMINARY VERSION — DO NOT SHARE",
      title: "Don't waste money on the wrong gear.",
      subtitle: "I tested hundreds of products on YouTube. Answer 4 questions and find your perfect setup.",
      cta: "FIND MY SETUP →",
      trust: "100% Independent Tests",
      reviews: "200+ video reviews",
    },
    step: "Step",
    back: "← Back",
    restart: "Start over",
    result_intro: "Best setups for you, ranked by compatibility:",
    no_results: "No products found. Contact me on WhatsApp!",
    price: "Price",
    was: "Was",
    discount_label: "DISCOUNT CODE",
    buy_btn: "View official offer",
    wa_btn: "Any questions? Message me",
    wa_msg: "Hi Michele, I took the gear quiz but I still have questions...",
    sort: "Sort:",
    sort_score: "Best match",
    sort_price_asc: "Price ↑",
    sort_price_desc: "Price ↓",
    stock_low: "⚡ Last units",
    stock_last: "🔥 Last one available",
    match_label: "Match",
    checkout_hint: "Enter code at checkout for discount",
    questions: {
      category: "What are you looking for?",
      sport: "Which discipline?",
      foil_level: "What's your skill level?",
      wing_wind: "What will be your main use?",
      surf_wave: "What wave type do you surf?",
      pump_goal: "Your Pump Foil goal?",
      dw_level: "Your Downwind experience?",
      sup_level: "SUP experience?",
      sup_use: "Main usage?",
      sup_budget: "Your budget?",
      pump_target: "What do you need to inflate?",
      pump_prio: "Your priority?",
    },
    options: {
      foil: "🚀 Hydrofoil",
      sup: "🏄 Inflatable SUP",
      pump: "⚡ Electric Pumps",
      wing: "Wing Foil",
      surf: "Surf Foil",
      pump_sport: "Pump Foil",
      dw: "Downwind",
      sup_sport: "SUP Foil",
      beg: "Beginner",
      int: "Intermediate",
      adv: "Advanced",
      light: "Light wind / Flat",
      wave: "Wave",
      free: "Freestyle",
      all: "All-round (a bit of everything)",
      small: "Small / Slow",
      fast: "Fast / Hollow",
      learn: "Learning (Dock Start)",
      endurance: "Endurance",
      freestyle: "Freestyle",
      beginner: "Still learning",
      expert: "Experienced",
      s_beg: "Beginner",
      s_int: "Intermediate",
      s_adv: "Advanced",
      occasional: "Occasional use",
      excursion: "Long excursions",
      race: "Speed / Race",
      yoga: "Yoga / Fitness",
      b_low: "< €300",
      b_mid: "€300–600",
      b_high: "> €600",
      t_sup: "Inflatable SUP",
      t_kayak: "Kayak",
      t_wing: "Wing / Kite",
      t_mat: "Mattresses",
      compact: "Minimum size",
      power: "Autonomy & Power",
    },
    labels: {
      lift: "Lift", speed: "Speed", control: "Control",
      stability: "Stability", stiffness: "Stiffness",
      compactness: "Compactness", autonomy: "Autonomy", noise: "Quietness",
    },
  },
};

// ─── DOMANDE ──────────────────────────────────────────────────────────────────
const buildQuestions = (answers, t) => {
  const o = t.options;
  const q = t.questions;

  const tree = {
    category: { text: q.category, opts: [
      { v: "foil", l: o.foil },
      { v: "sup",  l: o.sup },
      { v: "pump", l: o.pump },
    ]},
    sport: { text: q.sport, opts: [
      { v: "wing", l: o.wing },
      { v: "surf", l: o.surf },
      { v: "pump", l: o.pump_sport },
      { v: "dw",   l: o.dw },
      { v: "sup",  l: o.sup_sport },
    ]},
    foil_level: { text: q.foil_level, opts: [
      { v: "beg", l: o.beg },
      { v: "int", l: o.int },
      { v: "adv", l: o.adv },
    ]},
    wing_wind: { text: q.wing_wind, opts: [
      { v: "light", l: o.light },
      { v: "wave",  l: o.wave },
      { v: "free",  l: o.free },
      { v: "all",   l: o.all },
    ]},
    surf_wave: { text: q.surf_wave, opts: [
      { v: "small", l: o.small },
      { v: "fast",  l: o.fast },
    ]},
    pump_goal: { text: q.pump_goal, opts: [
      { v: "learn",     l: o.learn },
      { v: "endurance", l: o.endurance },
      { v: "freestyle", l: o.freestyle },
    ]},
    dw_level: { text: q.dw_level, opts: [
      { v: "beginner", l: o.beginner },
      { v: "expert",   l: o.expert },
    ]},
    sup_level: { text: q.sup_level, opts: [
      { v: "beg", l: o.s_beg },
      { v: "int", l: o.s_int },
      { v: "adv", l: o.s_adv },
    ]},
    sup_use: { text: q.sup_use, opts: [
      { v: "occasional", l: o.occasional },
      { v: "excursion",  l: o.excursion },
      { v: "race",       l: o.race },
      { v: "yoga",       l: o.yoga },
    ]},
    sup_budget: { text: q.sup_budget, opts: [
      { v: "b_low",  l: o.b_low },
      { v: "b_mid",  l: o.b_mid },
      { v: "b_high", l: o.b_high },
    ]},
    pump_target: { text: q.pump_target, opts: [
      { v: "sup",   l: o.t_sup },
      { v: "kayak", l: o.t_kayak },
      { v: "wing",  l: o.t_wing },
      { v: "mat",   l: o.t_mat },
    ]},
    pump_prio: { text: q.pump_prio, opts: [
      { v: "compact", l: o.compact },
      { v: "power",   l: o.power },
    ]},
  };

  // Sequenza basata sulle risposte
  const seq = ["category"];
  if (answers.category === "foil") {
    seq.push("sport");
    if (answers.sport === "wing") seq.push("foil_level", "wing_wind");
    else if (answers.sport === "surf") seq.push("foil_level", "surf_wave");
    else if (answers.sport === "pump") seq.push("foil_level", "pump_goal");
    else if (answers.sport === "dw")   seq.push("dw_level");
    else if (answers.sport === "sup")  seq.push("foil_level");
  } else if (answers.category === "sup") {
    seq.push("sup_level", "sup_use", "sup_budget");
  } else if (answers.category === "pump") {
    seq.push("pump_target", "pump_prio");
  }

  return { seq, tree };
};

// ─── SMART MATCHING ───────────────────────────────────────────────────────────
const scoreProduct = (product, answers) => {
  if (product.category !== answers.category) return -1;
  let total = 0;
  let count = 0;

  // Mappa risposte → chiavi score
  const keys = [];
  if (answers.sport)       keys.push(`sport_${answers.sport}`);
  if (answers.foil_level)  keys.push(`foil_level_${answers.foil_level}`);
  if (answers.wing_wind)   keys.push(`wing_wind_${answers.wing_wind}`);
  if (answers.surf_wave)   keys.push(`surf_wave_${answers.surf_wave}`);
  if (answers.pump_goal)   keys.push(`pump_goal_${answers.pump_goal}`);
  if (answers.dw_level)    keys.push(`dw_level_${answers.dw_level}`);
  if (answers.sup_level)   keys.push(`sup_level_${answers.sup_level}`);
  if (answers.sup_use)     keys.push(`sup_use_${answers.sup_use}`);
  if (answers.sup_budget)  keys.push(`sup_budget_${answers.sup_budget}`);
  if (answers.pump_target) keys.push(`pump_target_${answers.pump_target}`);
  if (answers.pump_prio)   keys.push(`pump_prio_${answers.pump_prio}`);

  keys.forEach(k => {
    if (product.scores[k] !== undefined) {
      total += product.scores[k];
      count++;
    }
  });

  return count > 0 ? total / count : 0;
};

// ─── COMPONENTI UI ────────────────────────────────────────────────────────────
const Stars = ({ value, max = 5 }) => (
  <div className="pw-stars" aria-label={`${value} su ${max}`}>
    {Array.from({ length: max }, (_, i) => (
      <span key={i} className={i < value ? "pw-star on" : "pw-star"}>★</span>
    ))}
  </div>
);

const MatchBar = ({ score, label }) => {
  const pct = Math.round((score / 10) * 100);
  const cls = pct >= 80 ? "excellent" : pct >= 60 ? "good" : "fair";
  return (
    <div className="pw-match">
      <span className="pw-match-label">{label}</span>
      <div className="pw-match-track">
        <div className={`pw-match-fill ${cls}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="pw-match-pct">{pct}%</span>
    </div>
  );
};

const StockBadge = ({ stock, t }) => {
  if (stock === "low")  return <div className="pw-stock low">{t.stock_low}</div>;
  if (stock === "last") return <div className="pw-stock last">{t.stock_last}</div>;
  return null;
};

// ─── APP PRINCIPALE ───────────────────────────────────────────────────────────
export default function ProductWizard() {
  const [lang, setLang] = useState("it");
  const [started, setStarted] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [sort, setSort] = useState("score");
  const bodyRef = useRef(null);

  const t = T[lang];

  const scrollTop = () => bodyRef.current?.scrollTo({ top: 0, behavior: "smooth" });

  const { seq, tree } = buildQuestions(answers, t);
  const currentKey = seq[stepIndex];
  const currentQ = currentKey ? tree[currentKey] : null;
  const progress = results ? 100 : Math.round((stepIndex / (seq.length)) * 100);
  const isLastStep = stepIndex === seq.length - 1;

  const handleSelect = (key, val) => {
    const next = { ...answers, [key]: val };
    setAnswers(next);

    // Ricalcola seq con le nuove risposte
    const { seq: nextSeq } = buildQuestions(next, t);
    const nextIndex = stepIndex + 1;

    if (nextIndex >= nextSeq.length) {
      // Fine wizard → calcola risultati
      computeResults(next);
    } else {
      setStepIndex(nextIndex);
      setTimeout(scrollTop, 50);
    }
  };

  const computeResults = (finalAnswers) => {
    const scored = PRODUCTS
      .map(p => ({ ...p, _score: scoreProduct(p, finalAnswers) }))
      .filter(p => p._score >= MIN_SCORE_THRESHOLD)
      .sort((a, b) => b._score - a._score)
      .slice(0, MAX_RESULTS);
    setResults(scored);
    setTimeout(scrollTop, 50);
  };

  const restart = () => {
    setStepIndex(0);
    setAnswers({});
    setResults(null);
    setStarted(false);
    setTimeout(scrollTop, 50);
  };

  const goBack = () => {
    if (stepIndex === 0) { setStarted(false); return; }
    setStepIndex(stepIndex - 1);
    setTimeout(scrollTop, 50);
  };

  // Ordinamento risultati
  const displayResults = results ? [...results].sort((a, b) => {
    if (sort === "price_asc")  return a.price - b.price;
    if (sort === "price_desc") return b.price - a.price;
    return b._score - a._score;
  }) : [];

  return (
    <div className="pw-root">
      {/* HEADER */}
      <header className="pw-header">
        <div className="pw-header-inner">
          <div className="pw-logo-row">
            <img src={LOGO_URL} alt="Michele" className="pw-avatar" />
            <div className="pw-logo-text">
              <span className="pw-logo-name">Michele</span>
              <span className="pw-logo-sub">Gear Wizard</span>
            </div>
          </div>
          <button className="pw-lang" onClick={() => setLang(lang === "it" ? "en" : "it")}>
            {lang === "it" ? "🇬🇧 EN" : "🇮🇹 IT"}
          </button>
        </div>
        {started && !results && (
          <div className="pw-progress-wrap">
            <div className="pw-progress-bar">
              <div className="pw-progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}
      </header>

      {/* BODY */}
      <main className="pw-body" ref={bodyRef}>

        {/* ── WELCOME ── */}
        {!started && (
          <div className="pw-welcome pw-fade">
            <div className="pw-beta-badge">{t.welcome.badge}</div>
            <div className="pw-hero-profile">
              <img src={LOGO_URL} alt="Michele" className="pw-hero-avatar" />
              <div className="pw-trust-pills">
                <span className="pw-pill">✅ {t.welcome.trust}</span>
                <span className="pw-pill">▶️ {t.welcome.reviews}</span>
              </div>
            </div>
            <h1 className="pw-hero-title">{t.welcome.title}</h1>
            <p className="pw-hero-sub">{t.welcome.subtitle}</p>

            <div className="pw-video-wrap">
              <iframe
                src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?rel=0&modestbranding=1`}
                title="YouTube"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <button className="pw-start-btn" onClick={() => setStarted(true)}>
              {t.welcome.cta}
            </button>
          </div>
        )}

        {/* ── WIZARD ── */}
        {started && !results && currentQ && (
          <div className="pw-quiz pw-fade" key={currentKey}>
            <div className="pw-step-label">{t.step} {stepIndex + 1} / {seq.length}</div>
            <h2 className="pw-question">{currentQ.text}</h2>
            <div className="pw-options">
              {currentQ.opts.map(o => (
                <button
                  key={o.v}
                  className="pw-option"
                  onClick={() => handleSelect(currentKey, o.v)}
                >
                  {o.l}
                </button>
              ))}
            </div>
            <button className="pw-back" onClick={goBack}>{t.back}</button>
          </div>
        )}

        {/* ── RISULTATI ── */}
        {results && (
          <div className="pw-results pw-fade">
            {displayResults.length === 0 ? (
              <div className="pw-no-results">
                <span className="pw-no-icon">🔍</span>
                <p>{t.no_results}</p>
                <button className="pw-restart" onClick={restart}>{t.restart}</button>
              </div>
            ) : (
              <>
                <p className="pw-result-intro">{t.result_intro}</p>

                {/* Sort controls */}
                <div className="pw-sort-bar">
                  <span className="pw-sort-label">{t.sort}</span>
                  {[
                    { v: "score",      l: t.sort_score },
                    { v: "price_asc",  l: t.sort_price_asc },
                    { v: "price_desc", l: t.sort_price_desc },
                  ].map(s => (
                    <button
                      key={s.v}
                      className={`pw-sort-btn${sort === s.v ? " active" : ""}`}
                      onClick={() => setSort(s.v)}
                    >{s.l}</button>
                  ))}
                </div>

                {/* Cards */}
                <div className="pw-cards">
                  {displayResults.map((p, i) => {
                    const discountPct = p.originalPrice
                      ? Math.round((1 - p.price / p.originalPrice) * 100)
                      : null;
                    return (
                      <article key={p.id} className="pw-card">
                        {/* Badge prodotto */}
                        {p.badge && <div className="pw-card-badge">{p.badge}</div>}
                        {i === 0 && sort === "score" && (
                          <div className="pw-card-top">🏆 Top match</div>
                        )}

                        {/* Immagine */}
                        <a href={p.link} target="_blank" rel="noreferrer" className="pw-card-img-wrap">
                          <img src={p.image} alt={p.title} className="pw-card-img" />
                          {discountPct && (
                            <div className="pw-discount-badge">−{discountPct}%</div>
                          )}
                        </a>

                        {/* Contenuto */}
                        <div className="pw-card-body">
                          <div className="pw-card-brand">{p.brand}</div>
                          <h3 className="pw-card-title">{p.title}</h3>
                          <p className="pw-card-desc">{p[`description_${lang}`] || p.description_it}</p>

                          {/* Match bar */}
                          <MatchBar score={p._score} label={t.match_label} />

                          {/* Ratings */}
                          {p.ratings && (
                            <div className="pw-ratings">
                              {Object.entries(p.ratings).map(([k, v]) => (
                                <div key={k} className="pw-rating-row">
                                  <span>{t.labels[k] || k}</span>
                                  <Stars value={v} />
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Specs */}
                          {p.specs && (
                            <div className="pw-specs">
                              {Object.entries(p.specs).map(([k, v]) => (
                                <div key={k} className="pw-spec-chip">
                                  <span className="pw-spec-key">{k}</span>
                                  <span className="pw-spec-val">{v}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Deal zone */}
                        <div className="pw-deal">
                          <StockBadge stock={p.stock} t={t} />

                          <div className="pw-price-row">
                            {p.originalPrice && (
                              <span className="pw-price-was">{t.was} €{p.originalPrice}</span>
                            )}
                            <span className="pw-price">€{p.price}</span>
                          </div>

                          {p.discount && (
                            <div className="pw-coupon">
                              <span className="pw-coupon-label">✂️ {t.discount_label}</span>
                              <span className="pw-coupon-code">{p.discount}</span>
                              <span className="pw-coupon-hint">{t.checkout_hint}</span>
                            </div>
                          )}

                          <a href={p.link} target="_blank" rel="noreferrer" className="pw-cta">
                            {t.buy_btn} ↗
                          </a>
                        </div>
                      </article>
                    );
                  })}
                </div>

                <button className="pw-restart" onClick={restart}>{t.restart}</button>
              </>
            )}
          </div>
        )}
      </main>

      {/* WhatsApp Float */}
      <a
        href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(t.wa_msg)}`}
        className="pw-wa"
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp"
      >
        <svg viewBox="0 0 448 512" className="pw-wa-icon">
          <path fill="currentColor" d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-4-10.5-6.7z"/>
        </svg>
        <span className="pw-wa-text">{t.wa_btn}</span>
      </a>
    </div>
  );
}
