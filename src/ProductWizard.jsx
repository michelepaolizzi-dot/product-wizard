import React, { useState, useEffect } from "react";
import "./ProductWizard.css";

/* =============================================================================
  GUIDA CONFIGURAZIONE JSON PRODOTTI
  =============================================================================
  Se carichi i prodotti da un file JSON esterno, ogni oggetto nell'array deve 
  rispettare questa struttura.
  
  Esempio di Sintassi:
  [
    {
      "id": "univoco-prodotto-01",        // (String) ID univoco
      "category": "foil",                 // (String) 'foil', 'sup' o 'pump'
      "matcher": {                        // (Object) Logica di abbinamento
        "sport": ["wing", "surf"],        // Chiave domanda: [Valori accettati]
        "foil_level": ["beg", "int"],     // Se l'utente risponde "beg" o "int", questo prodotto è valido
        "wing_wind": "light"              // Può essere anche una stringa singola
      },
      "title": "Nome del Prodotto",       // (String) Titolo visibile
      "image": "https://url-immagine...", // (String) URL immagine
      "price": 1200,                      // (Number) Prezzo
      "link": "https://shop-link...",     // (String) Link all'acquisto
      "discount": "CODICE_SCONTO",        // (String, Opzionale) Codice sconto
      "specs": {                          // (Object, Opzionale) Specifiche tecniche
        "Mast": "85cm",
        "Front Wing": "1000cm2"
      },
      "ratings": {                        // (Object, Opzionale) Valori da 1 a 5 per le stelle
        "stability": 5,
        "speed": 3,
        "compactness": 4
      },
      "description_it": "Testo Italiano", // (String) Descrizione IT
      "description_en": "English Text"    // (String) Descrizione EN
    }
  ]
  =============================================================================
*/

const LOGO_URL =
  "https://www.sportalcentro.it/wp-content/uploads/product-wizard/michele_profilo.jpg";

// --- CONFIGURAZIONE WHATSAPP ---
// Inserisci qui il tuo numero col prefisso (es. 39 per l'Italia) senza spazi o +
const WA_NUMBER = "393331234567";

const INITIAL_DATA = [
  // --- HYDROFOIL (Criteria: Lift, Speed, Control) ---
  /* {
    id: "sab-leviathan-1350",
    category: "foil",
    matcher: { sport: ["wing", "surf", "pump"] },
    title: "Sabfoil Leviathan 1350",
    image:
      "https://www.sportalcentro.it/wp-content/uploads/product-wizard/sab_razor_pro.jpg",
    price: 2350,
    link: "#",
    discount: "SPORTALCENTRO",
    specs: { Mast: "83cm", Wing: "1350 cm²" },
    ratings: { lift: 5, speed: 3, control: 4 },
    description_it: "Il Re del Glide. Perfetto per Wing col vento leggero.",
    description_en: "The King of Glide. Perfect for Lightwind Wing.",
  },
  {
    id: "sab-medusa",
    category: "foil",
    matcher: { sport: ["wing", "surf", "pump"] },
    title: "Sabfoil Medusa Pro",
    image:
      "https://www.sportalcentro.it/wp-content/uploads/product-wizard/sab_medusa_pro.jpg",
    price: 2350,
    link: "#",
    discount: "SPORTALCENTRO",
    specs: { Mast: "83cm", Wing: "1350 cm²" },
    ratings: { lift: 3, speed: 5, control: 5 },
    description_it: "Versatile e veloce.",
    description_en: "Versatile and fast.",
  },*/
  {
    id: "sab-leviathan-1550-73",
    category: "foil",
    matcher: {
      foil_level: ["beg", "int", "adv"],
      sport: ["pump", "sup"],
    },
    title: "Sabfoil Leviathan 1550/73",
    image:
      "https://www.sportalcentro.it/wp-content/uploads/product-wizard/sabfoil_lev_1350_1550_73.jpg",
    price: 1529,
    link: "https://sabfoil.com/it/products/KL_1550-663-370_73P",
    discount: "sac10",
    specs: { Mast: "83cm", Wing: "1350 cm²" },
    ratings: { lift: 5, speed: 3, control: 4 },
    description_it: "Il Re del Glide. Perfetto per Wing col vento leggero.",
    description_en: "The King of Glide. Perfect for Lightwind Wing.",
  },
  {
    id: "sab-leviathan-1350-73",
    category: "foil",
    matcher: {
      foil_level: ["beg", "int", "adv"],
      sport: ["pump", "sup"],
    },
    title: "Sabfoil Leviathan 1350/73",
    image:
      "https://www.sportalcentro.it/wp-content/uploads/product-wizard/sabfoil_lev_1350_1550_73.jpg",
    price: 1529,
    link: "https://sabfoil.com/it/products/KL_1550-663-370_73P",
    discount: "sac10",
    specs: { Mast: "83cm", Wing: "1350 cm²" },
    ratings: { lift: 5, speed: 3, control: 4 },
    description_it: "Il Re del Glide. Perfetto per Wing col vento leggero.",
    description_en: "The King of Glide. Perfect for Lightwind Wing.",
  },
  {
    id: "sab-leviathanPRO-1360-73",
    category: "foil",
    matcher: {
      foil_level: ["int", "adv"],
      sport: ["pump", "sup"],
    },
    title: "Sabfoil Leviathan PRO 1360/73",
    image:
      "https://www.sportalcentro.it/wp-content/uploads/product-wizard/sabfoil_lev_1360PRO_73.webp",
    price: 1549,
    link: "https://sabfoil.com/it/products/KLP_1360-663-370_73",
    discount: "sac10",
    specs: { Mast: "83cm", Wing: "1350 cm²" },
    ratings: { lift: 5, speed: 3, control: 4 },
    description_it: "Il Re del Glide. Perfetto per Wing col vento leggero.",
    description_en: "The King of Glide. Perfect for Lightwind Wing.",
  },
  {
    id: "sab-RazorBB_1077_75",
    category: "foil",
    matcher: {
      foil_level: ["int", "adv"],
      sport: ["pump", "sup", "wing"],
      wing_wind: ["light"],
    },
    title: "Sabfoil Razor Blackbird 1077/75",
    image:
      "https://www.sportalcentro.it/wp-content/uploads/product-wizard/sabfoil_razorBB_977_1077_75.webp",
    price: 1899,
    link: "https://sabfoil.com/it/products/KR-1077-375-75-BB",
    discount: "sac10",
    specs: { Mast: "83cm", Wing: "1350 cm²" },
    ratings: { lift: 5, speed: 3, control: 4 },
    description_it: "Il Re del Glide. Perfetto per Wing col vento leggero.",
    description_en: "The King of Glide. Perfect for Lightwind Wing.",
  },
  {
    id: "sab-RazorBB_977_75",
    category: "foil",
    matcher: {
      foil_level: ["int", "adv"],
      sport: ["wing"],
      wing_wind: ["light", "all"],
    },
    title: "Sabfoil Razor Blackbird 977/75",
    image:
      "https://www.sportalcentro.it/wp-content/uploads/product-wizard/sabfoil_razorBB_977_1077_75.webp",
    price: 1889,
    link: "https://sabfoil.com/it/products/KR-977-375-75-BB",
    discount: "sac10",
    specs: { Mast: "83cm", Wing: "1350 cm²" },
    ratings: { lift: 5, speed: 3, control: 4 },
    description_it: "Il Re del Glide. Perfetto per Wing col vento leggero.",
    description_en: "The King of Glide. Perfect for Lightwind Wing.",
  },
  {
    id: "sab-RazorPRO_975_73",
    category: "foil",
    matcher: {
      foil_level: ["int", "adv"],
      sport: ["wing"],
      wing_wind: ["light", "all"],
    },
    title: "Sabfoil Razor PRO 975/73",
    image:
      "https://www.sportalcentro.it/wp-content/uploads/product-wizard/sabfoil_razorPRO_975_1075_83.webp",
    price: 1499,
    link: "https://sabfoil.com/it/products/KRP_975-653-370_83",
    discount: "sac10",
    specs: { Mast: "83cm", Wing: "1350 cm²" },
    ratings: { lift: 5, speed: 3, control: 4 },
    description_it: "Il Re del Glide. Perfetto per Wing col vento leggero.",
    description_en: "The King of Glide. Perfect for Lightwind Wing.",
  },

  {
    id: "sab-RazorPRO_1075_73",
    category: "foil",
    matcher: {
      foil_level: ["int", "adv"],
      sport: ["wing"],
      wing_wind: ["light"],
    },
    title: "Sabfoil Razor PRO 1075/73",
    image:
      "https://www.sportalcentro.it/wp-content/uploads/product-wizard/sabfoil_razorPRO_975_1075_83.webp",
    price: 1519,
    link: "https://sabfoil.com/it/products/KRP_1075-653-370_83",
    discount: "sac10",
    specs: { Mast: "83cm", Wing: "1350 cm²" },
    ratings: { lift: 5, speed: 3, control: 4 },
    description_it: "Il Re del Glide. Perfetto per Wing col vento leggero.",
    description_en: "The King of Glide. Perfect for Lightwind Wing.",
  },
  {
    id: "sab-BalzPRO_909_83",
    category: "foil",
    matcher: {
      foil_level: ["int", "adv"],
      sport: ["wing"],
      wing_wind: ["wave", "free"],
    },
    title: "Sabfoil Balz PRO 909/73",
    image:
      "https://www.sportalcentro.it/wp-content/uploads/product-wizard/sabfoil_balzPRO_909_808_83.jpg",
    price: 1569,
    link: "https://sabfoil.com/it/products/BALZ_909-370-663_83",
    discount: "sac10",
    specs: { Mast: "83cm", Wing: "1350 cm²" },
    ratings: { lift: 5, speed: 3, control: 4 },
    description_it: "Il Re del Glide. Perfetto per Wing col vento leggero.",
    description_en: "The King of Glide. Perfect for Lightwind Wing.",
  },
  {
    id: "sab-BalzPRO_808_83",
    category: "foil",
    matcher: {
      foil_level: ["int", "adv"],
      sport: ["wing"],
      wing_wind: ["wave", "free"],
    },
    title: "Sabfoil Balz PRO 808/73",
    image:
      "https://www.sportalcentro.it/wp-content/uploads/product-wizard/sabfoil_balzPRO_909_808_83.jpg",
    price: 1549,
    link: "https://sabfoil.com/it/products/BALZ_808-370-663_83",
    discount: "sac10",
    specs: { Mast: "83cm", Wing: "1350 cm²" },
    ratings: { lift: 5, speed: 3, control: 4 },
    description_it: "Il Re del Glide. Perfetto per Wing col vento leggero.",
    description_en: "The King of Glide. Perfect for Lightwind Wing.",
  },
  {
    id: "sab-BalzPROBB_905_85",
    category: "foil",
    matcher: {
      foil_level: ["int", "adv"],
      sport: ["wing"],
      wing_wind: ["wave", "free"],
    },
    title: "Sabfoil Balz PRO Blackbird 905/85",
    image:
      "https://www.sportalcentro.it/wp-content/uploads/product-wizard/sabfoil_balzBB_905_805_85.webp",
    price: 1879,
    link: "https://sabfoil.com/it/products/kit-blackbird-Balz-Pro-905-Mast-85",
    discount: "sac10",
    specs: { Mast: "83cm", Wing: "1350 cm²" },
    ratings: { lift: 5, speed: 3, control: 4 },
    description_it: "Il Re del Glide. Perfetto per Wing col vento leggero.",
    description_en: "The King of Glide. Perfect for Lightwind Wing.",
  },
  {
    id: "sab-BalzPROBB_805_85",
    category: "foil",
    matcher: {
      foil_level: ["int", "adv"],
      sport: ["wing"],
      wing_wind: ["wave", "free"],
    },
    title: "Sabfoil Balz PRO Blackbird 805/85",
    image:
      "https://www.sportalcentro.it/wp-content/uploads/product-wizard/sabfoil_balzBB_905_805_85.webp",
    price: 1869,
    link: "https://sabfoil.com/it/products/KBZ-805-365-85-BB",
    discount: "sac10",
    specs: { Mast: "83cm", Wing: "1350 cm²" },
    ratings: { lift: 5, speed: 3, control: 4 },
    description_it: "Il Re del Glide. Perfetto per Wing col vento leggero.",
    description_en: "The King of Glide. Perfect for Lightwind Wing.",
  },
  {
    id: "sab-leviathanEasyRiding950_83",
    category: "foil",
    matcher: {
      foil_level: ["beg"],
      sport: ["wing"],
      wing_wind: ["all"],
    },
    title: "Sabfoil Leviathan EasyRiding 950/83",
    image:
      "https://www.sportalcentro.it/wp-content/uploads/product-wizard/sabfoil_lev_easy_73.jpg",
    price: 1419,
    link: "https://sabfoil.com/it/products/KL_950-703-425_83",
    discount: "sac10",
    specs: { Mast: "83cm", Wing: "1350 cm²" },
    ratings: { lift: 5, speed: 3, control: 4 },
    description_it: "Il Re del Glide. Perfetto per Wing col vento leggero.",
    description_en: "The King of Glide. Perfect for Lightwind Wing.",
  },
  {
    id: "sab-leviathanEasyRiding1150_83",
    category: "foil",
    matcher: {
      foil_level: ["beg"],
      sport: ["wing"],
      wing_wind: ["all", "light"],
    },
    title: "Sabfoil Leviathan EasyRiding 1150/83",
    image:
      "https://www.sportalcentro.it/wp-content/uploads/product-wizard/sabfoil_lev_easy_73.jpg",
    price: 1449,
    link: "https://sabfoil.com/it/products/KL_1150-703-425_83",
    discount: "sac10",
    specs: { Mast: "83cm", Wing: "1350 cm²" },
    ratings: { lift: 5, speed: 3, control: 4 },
    description_it: "Il Re del Glide. Perfetto per Wing col vento leggero.",
    description_en: "The King of Glide. Perfect for Lightwind Wing.",
  },
  {
    id: "indiana-manta-xl-75",
    category: "foil",
    matcher: {
      foil_level: ["beg", "int", "adv"],
      sport: ["pump"],
    },
    title: "Indiana Manta XL",
    image:
      "https://www.sportalcentro.it/wp-content/uploads/product-wizard/indiana_mantaxl_alu.webp",
    price: 1689,
    link: "https://indiana-paddlesurf.com/en_eu/indiana-pump-foil-manta-xl-complete-3629sq.html",
    discount: "sac10",
    specs: { Mast: "83cm", Wing: "1350 cm²" },
    ratings: { lift: 5, speed: 3, control: 4 },
    description_it: "Il Re del Glide. Perfetto per Wing col vento leggero.",
    description_en: "The King of Glide. Perfect for Lightwind Wing.",
  },
  {
    id: "indiana-condor-xl-75",
    category: "foil",
    matcher: {
      foil_level: ["int", "adv"],
      sport: ["pump"],
    },
    title: "Indiana Condor XL",
    image:
      "https://www.sportalcentro.it/wp-content/uploads/product-wizard/indiana_condorxl_alu.webp",
    price: 1749,
    link: "https://indiana-paddlesurf.com/en_eu/3615sq-3615sq.html",
    discount: "sac10",
    specs: { Mast: "83cm", Wing: "1350 cm²" },
    ratings: { lift: 5, speed: 3, control: 4 },
    description_it: "Il Re del Glide. Perfetto per Wing col vento leggero.",
    description_en: "The King of Glide. Perfect for Lightwind Wing.",
  },
  {
    id: "indiana-barracuda-xl-75",
    category: "foil",
    matcher: {
      foil_level: ["beg", "int", "adv"],
      sport: ["pump", "sup"],
    },
    title: "Indiana Barracuda XL / 75",
    image:
      "https://www.sportalcentro.it/wp-content/uploads/product-wizard/indiana_barracuda.webp",
    price: 2239,
    link: "https://indiana-paddlesurf.com/en_eu/indiana-pump-foil-barracuda-xl-complete-3624sq.html",
    discount: "sac10",
    specs: { Mast: "83cm", Wing: "1350 cm²" },
    ratings: { lift: 5, speed: 3, control: 4 },
    description_it: "Il Re del Glide. Perfetto per Wing col vento leggero.",
    description_en: "The King of Glide. Perfect for Lightwind Wing.",
  },
  {
    id: "indiana-barracuda-xl-85",
    category: "foil",
    matcher: {
      foil_level: ["beg", "int", "adv"],
      sport: ["wing"],
      wing_wind: ["light"],
    },
    title: "Indiana Barracuda XL / 85",
    image:
      "https://www.sportalcentro.it/wp-content/uploads/product-wizard/indiana_barracuda.webp",
    price: 2269,
    link: "https://indiana-paddlesurf.com/en_eu/indiana-downwind-foil-barracuda-xl-complete-3623sq.html",
    discount: "sac10",
    specs: { Mast: "83cm", Wing: "1350 cm²" },
    ratings: { lift: 5, speed: 3, control: 4 },
    description_it: "Il Re del Glide. Perfetto per Wing col vento leggero.",
    description_en: "The King of Glide. Perfect for Lightwind Wing.",
  },

  // --- SUP GONFIABILI (Criteria: Stability, Stiffness, Speed) ---
  {
    id: "sup-allround",
    category: "sup",
    matcher: {
      sup_use: ["occasional", "family", "yoga"],
      sup_budget: ["b_low", "b_mid"],
    },
    title: "Family Cruiser 10'6",
    image:
      "https://images.unsplash.com/photo-1612663957242-706f9d453625?auto=format&fit=crop&w=600&q=80",
    price: 399,
    link: "#",
    discount: "SPORTALCENTRO",
    ratings: { stability: 5, stiffness: 3, speed: 2 },
    description_it: "La tavola tuttofare per eccellenza.",
    description_en: "The ultimate do-it-all board.",
  },

  // --- POMPE ELETTRICHE (Criteria: Compactness, Autonomy, Noise/Speed) ---
  {
    id: "airbank-puffer-pro",
    category: "pump",
    matcher: { pump_prio: ["compact"] },
    title: "Airbank Puffer Pro",
    image:
      "https://www.sportalcentro.it/wp-content/uploads/product-wizard/airbank_puffer_pro.png.webp",
    price: 110,
    link: "https://www.airbankpump.com/products/airbank-puffer-pro-rechargeable-pump",
    discount: "sportalcentro",
    ratings: { compactness: 5, autonomy: 3, noise: 4 },
    description_it: "La pompa più compatta al mondo.",
    description_en: "The world's most compact pump.",
  },
  {
    id: "airbank-pulse-pro",
    category: "pump",
    matcher: { pump_prio: ["power", "compact"] },
    title: "Airbank Pulse Pro",
    image:
      "https://www.sportalcentro.it/wp-content/uploads/product-wizard/airbank_pulse_pro.png.webp",
    price: 125,
    link: "https://www.airbankpump.com/products/airbank-pulse-pro-rechargeable-pump",
    discount: "sportalcentro",
    ratings: { compactness: 4, autonomy: 4, speed: 4 },
    description_it: "Il bilanciamento perfetto.",
    description_en: "The perfect balance.",
  },
  {
    id: "ride-engine-air-pump",
    category: "pump",
    matcher: { pump_prio: ["power"] },
    title: "Ride Engine Air Pump",
    image:
      "https://www.sportalcentro.it/wp-content/uploads/product-wizard/ridengine_air.jpg",
    price: 218,
    link: "https://www.kiteworldshop.com/it/wing-surf-pumps/11306-ride-engine-air-box-mini-electric-pump-840362193367.html?affp=27205",
    discount: "",
    ratings: { compactness: 2, autonomy: 5, speed: 5 },
    description_it: "Heavy duty per uso intensivo.",
    description_en: "Heavy duty for intensive use.",
  },
];

const translations = {
  it: {
    app_title: "I migliori provati da Michele",
    subtitle: "Rispondi a poche domande e trova il setup perfetto",
    step: "Passo",
    back: "Indietro",
    restart: "Ricomincia",
    result_msg: "Ecco i prodotti consigliati per te:",
    youtube_badge: "Testato su YouTube",
    price: "Prezzo",
    min_level: "Livello",
    discount_label: "CODICE SCONTO",
    buy_btn: "Vedi Offerta",
    contact_title: "Nessun Risultato",
    contact_desc:
      "Nessun prodotto corrisponde esattamente a TUTTI i criteri. Contattaci!",

    wa_btn: "Hai dubbi? Scrivimi su WhatsApp",
    wa_msg:
      "Ciao Michele, ho fatto il test dell'attrezzatura ma ho ancora qualche dubbio...",

    questions: {
      cat: "Cosa stai cercando?",
      sport: "Quale disciplina Hydrofoil?",
      f_weight: "Qual è il tuo peso?",
      f_level: "Qual è il tuo livello?",
      w_wind: "Quale sarà l'utilizzo prevalente?", // MODIFICATO
      s_wave: "Che onde surfi principalmente?",
      p_goal: "Obiettivo nel Pumping?",
      dw_lvl: "Esperienza nel Downwind?",
      sup_lvl: "Esperienza col SUP?",
      sup_use: "Utilizzo principale?",
      sup_h: "Quanto sei alto/a?",
      sup_loc: "Dove lo userai?",
      sup_bud: "Il tuo budget?",
      pump_target: "Cosa devi gonfiare?",
      pump_prio: "Qual è la tua priorità?",
    },
    options: {
      foil: "Hydrofoil",
      sup: "SUP Gonfiabile",
      pump: "Pompe Elettriche",
      wing: "Wing Foil",
      surf: "Surf Foil",
      pmp: "Pump Foil",
      dw: "Downwind",
      light: "Leggero (< 70kg)",
      med: "Medio (70-85kg)",
      heavy: "Pesante (> 85kg)",
      beg: "Principiante",
      int: "Intermedio",
      adv: "Avanzato",
      exp: "Esperto",
      learn: "Sto imparando",

      // --- OPZIONI WING AGGIORNATE ---
      w_light: "Vento leggero",
      w_wave: "Wave / Onde",
      w_free: "Freestyle",
      w_all: "All-round / Un po' di tutto",
      // -------------------------------

      w_strong: "Forte / Wave", // (Mantenuto per compatibilità, ma non usato nel nuovo menu)
      wav_small: "Piccole / Lente",
      wav_fast: "Veloci / Tubanti",
      g_learn: "Imparare (Dock Start)",
      g_enduro: "Resistenza / Distanza",
      g_free: "Freestyle",
      s_beg: "Principiante",
      s_int: "Intermedio",
      s_adv: "Avanzato",
      occasional: "Utilizzo occasionale",
      excursion: "Escursioni",
      race: "Velocità / Gara",
      yoga: "Yoga",
      surf: "Surf",
      h_low: "< 160 cm",
      h_mid: "160-180 cm",
      h_high: "> 180 cm",
      sea: "Mare Calmo",
      lake: "Lago",
      river: "Fiume / Mosso",
      all: "Ovunque",
      b_low: "Meno di 300 €",
      b_mid: "300 - 600 €",
      b_high: "Più di 600 €",
      t_sup: "SUP",
      t_kayak: "Kayak",
      t_wing: "Wing / Kite",
      t_mat: "Materassini",
      p_compact: "Minimo ingombro",
      p_power: "Autonomia e potenza",
    },
    labels: {
      speed: "Velocità",
      lift: "Portanza",
      control: "Controllo",
      stability: "Stabilità",
      stiffness: "Rigidità",
      compactness: "Compattezza",
      autonomy: "Autonomia",
      noise: "Silenziosità",
    },
  },
  en: {
    app_title: "The best tested by Michele",
    subtitle: "Answer a few questions to find your setup",
    step: "Step",
    back: "Back",
    restart: "Start Over",
    result_msg: "Here are the recommended products for you:",
    youtube_badge: "Tested on YouTube",
    price: "Price",
    min_level: "Level",
    discount_label: "DISCOUNT CODE",
    buy_btn: "View Offer",
    contact_title: "No Results",
    contact_desc: "No products match ALL your criteria. Contact us!",

    wa_btn: "Doubts? Chat on WhatsApp",
    wa_msg:
      "Hi Michele, I took the gear quiz but I still have some questions...",

    questions: {
      cat: "What are you looking for?",
      sport: "Which Hydrofoil discipline?",
      f_weight: "Your Weight?",
      f_level: "Your Skill Level?",
      w_wind: "What will be your main use?", // UPDATED
      s_wave: "Main wave type?",
      p_goal: "Pumping Goal?",
      dw_lvl: "Downwind Experience?",
      sup_lvl: "SUP Experience?",
      sup_use: "Main Usage?",
      sup_h: "Your Height?",
      sup_loc: "Location?",
      sup_bud: "Budget?",
      pump_target: "What do you need to inflate?",
      pump_prio: "What is your priority?",
    },
    options: {
      foil: "Hydrofoil",
      sup: "Inflatable SUP",
      pump: "Electric Pumps",
      wing: "Wing Foil",
      surf: "Surf Foil",
      pmp: "Pump Foil",
      dw: "Downwind",
      light: "Light (< 70kg)",
      med: "Medium (70-85kg)",
      heavy: "Heavy (> 85kg)",
      beg: "Beginner",
      int: "Intermediate",
      adv: "Advanced",
      exp: "Expert",
      learn: "Learning",

      // --- UPDATED WING OPTIONS ---
      w_light: "Light wind",
      w_wave: "Wave",
      w_free: "Freestyle",
      w_all: "All-round / Mix",
      // ----------------------------

      w_strong: "Strong / Wave",
      wav_small: "Small / Slow",
      wav_fast: "Fast / Hollow",
      g_learn: "Learning (Dock Start)",
      g_enduro: "Endurance",
      g_free: "Freestyle",
      s_beg: "Beginner",
      s_int: "Intermediate",
      s_adv: "Advanced",
      occasional: "Occasional use",
      excursion: "Long excursions",
      race: "Speed / Race",
      yoga: "Yoga",
      surf: "Surf",
      h_low: "< 160 cm",
      h_mid: "160-180 cm",
      h_high: "> 180 cm",
      sea: "Calm Sea",
      lake: "Lake",
      river: "River / Rough",
      all: "Anywhere",
      b_low: "< 300 €",
      b_mid: "300 - 600 €",
      b_high: "> 600 €",
      t_sup: "SUP",
      t_kayak: "Kayak",
      t_wing: "Wing / Kite",
      t_mat: "Mattresses",
      p_compact: "Minimum size",
      p_power: "Autonomy & Power",
    },
    labels: {
      speed: "Speed",
      lift: "Lift",
      control: "Control",
      stability: "Stability",
      stiffness: "Stiffness",
      compactness: "Compactness",
      autonomy: "Autonomy",
      noise: "Quietness",
    },
  },
};

const StarRating = ({ value }) => (
  <div className="star-rating">
    {[1, 2, 3, 4, 5].map((star) => (
      <span key={star} className={star <= value ? "star filled" : "star"}>
        ★
      </span>
    ))}
  </div>
);

const ProductWizard = () => {
  const [lang, setLang] = useState("it");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [products, setProducts] = useState([]);
  const t = translations[lang];

  useEffect(() => {
    setProducts(INITIAL_DATA);
  }, []);

  const getQuestion = () => {
    // 0. CATEGORIA
    if (step === 0)
      return {
        key: "category",
        text: t.questions.cat,
        opts: [
          { v: "foil", l: t.options.foil, i: "🚀" },
          { v: "sup", l: t.options.sup, i: "🌊" },
          { v: "pump", l: t.options.pump, i: "⚡" },
        ],
      };

    // --- HYDROFOIL ---
    if (answers.category === "foil") {
      if (step === 1)
        return {
          key: "sport",
          text: t.questions.sport,
          opts: [
            { v: "wing", l: t.options.wing },
            { v: "surf", l: t.options.surf },
            { v: "pump", l: t.options.pmp },
            { v: "dw", l: t.options.dw },
            { v: "sup", l: t.options.t_sup },
          ],
        };

      // Step 2 (Peso) rimosso.

      if (answers.sport === "wing") {
        if (step === 2)
          return {
            key: "foil_level",
            text: t.questions.f_level,
            opts: [
              { v: "beg", l: t.options.beg },
              { v: "int", l: t.options.int },
              { v: "adv", l: t.options.adv },
            ],
          };
        // STEP 3: Domanda Modificata (Utilizzo / Vento)
        if (step === 3)
          return {
            key: "wing_wind",
            text: t.questions.w_wind,
            opts: [
              { v: "light", l: t.options.w_light }, // Vento leggero
              { v: "wave", l: t.options.w_wave }, // Wave / Onde
              { v: "free", l: t.options.w_free }, // Freestyle
              { v: "all", l: t.options.w_all }, // All-round
            ],
          };
      }
      if (answers.sport === "surf") {
        if (step === 2)
          return {
            key: "foil_level",
            text: t.questions.f_level,
            opts: [
              { v: "beg", l: t.options.beg },
              { v: "int", l: t.options.int },
              { v: "adv", l: t.options.adv },
            ],
          };
        if (step === 3)
          return {
            key: "surf_wave",
            text: t.questions.s_wave,
            opts: [
              { v: "small", l: t.options.wav_small },
              { v: "fast", l: t.options.wav_fast },
            ],
          };
      }
      if (answers.sport === "pump") {
        if (step === 2)
          return {
            key: "pump_goal",
            text: t.questions.p_goal,
            opts: [
              { v: "learn", l: t.options.g_learn },
              { v: "endurance", l: t.options.g_enduro },
              { v: "freestyle", l: t.options.g_free },
            ],
          };
      }
      if (answers.sport === "dw") {
        if (step === 2)
          return {
            key: "dw_level",
            text: t.questions.dw_lvl,
            opts: [
              { v: "learn", l: t.options.learn },
              { v: "expert", l: t.options.exp },
            ],
          };
      }
      if (answers.sport === "sup") {
        if (step === 2)
          return {
            key: "foil_level",
            text: t.questions.f_level,
            opts: [
              { v: "beg", l: t.options.beg },
              { v: "int", l: t.options.int },
              { v: "adv", l: t.options.adv },
            ],
          };
      }
    }

    // --- SUP (Categoria Principale) ---
    if (answers.category === "sup") {
      if (step === 1)
        return {
          key: "sup_level",
          text: t.questions.sup_lvl,
          opts: [
            { v: "beg", l: t.options.s_beg },
            { v: "int", l: t.options.s_int },
            { v: "adv", l: t.options.s_adv },
          ],
        };
      if (step === 2)
        return {
          key: "sup_use",
          text: t.questions.sup_use,
          opts: [
            { v: "occasional", l: t.options.occasional },
            { v: "excursion", l: t.options.excursion },
            { v: "race", l: t.options.race },
            { v: "yoga", l: t.options.yoga },
            { v: "surf", l: t.options.surf },
          ],
        };
      if (step === 3)
        return {
          key: "sup_height",
          text: t.questions.sup_h,
          opts: [
            { v: "h_low", l: t.options.h_low },
            { v: "h_mid", l: t.options.h_mid },
            { v: "h_high", l: t.options.h_high },
          ],
        };
      if (step === 4)
        return {
          key: "sup_location",
          text: t.questions.sup_loc,
          opts: [
            { v: "sea", l: t.options.sea },
            { v: "lake", l: t.options.lake },
            { v: "river", l: t.options.river },
            { v: "all", l: t.options.all },
          ],
        };
      if (step === 5)
        return {
          key: "sup_budget",
          text: t.questions.sup_bud,
          opts: [
            { v: "b_low", l: t.options.b_low },
            { v: "b_mid", l: t.options.b_mid },
            { v: "b_high", l: t.options.b_high },
          ],
        };
    }

    // --- PUMP (Categoria Elettrica) ---
    if (answers.category === "pump") {
      if (step === 1)
        return {
          key: "pump_target",
          text: t.questions.pump_target,
          opts: [
            { v: "sup", l: t.options.t_sup },
            { v: "kayak", l: t.options.t_kayak },
            { v: "wing", l: t.options.t_wing },
            { v: "mat", l: t.options.t_mat },
          ],
        };
      if (step === 2)
        return {
          key: "pump_prio",
          text: t.questions.pump_prio,
          opts: [
            { v: "compact", l: t.options.p_compact },
            { v: "power", l: t.options.p_power },
          ],
        };
    }

    return null;
  };

  const handleSelect = (key, val) => {
    const next = { ...answers, [key]: val };
    setAnswers(next);
    let done = false;

    if (next.category === "sup" && step === 5) done = true;
    if (next.category === "pump" && step === 2) done = true;

    if (next.category === "foil") {
      // Step di fine aggiornati
      if (next.sport === "wing" && step === 3) done = true;
      if (next.sport === "surf" && step === 3) done = true;
      if (next.sport === "pump" && step === 2) done = true;
      if (next.sport === "dw" && step === 2) done = true;
      if (next.sport === "sup" && step === 2) done = true;
    }

    if (done) {
      findProducts(next);
    } else {
      setStep(step + 1);
    }
  };

  const findProducts = (finalAnswers) => {
    const matches = products.filter((p) => {
      if (p.category !== finalAnswers.category) return false;
      if (p.matcher) {
        for (const [key, requirement] of Object.entries(p.matcher)) {
          const userVal = finalAnswers[key];
          if (!userVal) continue;
          if (Array.isArray(requirement)) {
            if (!requirement.includes(userVal)) return false;
          } else {
            if (requirement !== userVal) return false;
          }
        }
      }
      return true;
    });
    setResults(matches.length > 0 ? matches : []);
  };

  const restart = () => {
    setStep(0);
    setAnswers({});
    setResults(null);
  };
  const q = results ? null : getQuestion();

  // Calcolo progresso
  let maxSteps = 3;
  if (answers.category === "sup") maxSteps = 5;
  else if (answers.category === "pump") maxSteps = 2;
  else if (answers.sport === "wing" || answers.sport === "surf") maxSteps = 3;
  else if (answers.sport === "pump" || answers.sport === "dw") maxSteps = 2;
  else if (answers.sport === "sup") maxSteps = 2;

  const progress = Math.min((step / maxSteps) * 100, 100);

  return (
    <div className="wizard-card">
      <div className="wizard-header">
        <div className="profile-container">
          <img src={LOGO_URL} alt="Sport Al Centro" className="profile-pic" />
        </div>
        <div className="header-row">
          <div>
            <h2>{t.app_title}</h2>
            <span className="subtitle">{t.subtitle}</span>
          </div>
          <button
            className="lang-btn"
            onClick={() => setLang(lang === "it" ? "en" : "it")}
          >
            {lang === "it" ? "🇬🇧" : "🇮🇹"}
          </button>
        </div>
      </div>

      <div className="wizard-body">
        {!results && q ? (
          <div className="fade-in">
            <div className="progress-bar">
              <div style={{ width: `${progress}%` }}></div>
            </div>
            <h3 className="question">{q.text}</h3>
            <div className="options-grid">
              {q.opts.map((o) => (
                <button
                  key={o.v}
                  className="option-btn"
                  onClick={() => handleSelect(q.key, o.v)}
                >
                  {o.i && <span className="opt-icon">{o.i}</span>} {o.l}
                </button>
              ))}
            </div>
            {step > 0 && (
              <button className="back-link" onClick={() => setStep(step - 1)}>
                {t.back}
              </button>
            )}
          </div>
        ) : (
          results && (
            <div className="fade-in">
              {results.length === 0 ? (
                <div className="fallback-msg">
                  <h3>{t.contact_title}</h3>
                  <p>{t.contact_desc}</p>
                  <button className="restart-link" onClick={restart}>
                    {t.restart}
                  </button>
                </div>
              ) : (
                <div className="result-list-container">
                  <p className="result-intro">{t.result_msg}</p>

                  {results.map((result) => (
                    <div key={result.id} className="result-item">
                      <div className="image-container">
                        {result.youtube_link && (
                          <a
                            href={result.youtube_link}
                            target="_blank"
                            rel="noreferrer"
                            className="yt-badge"
                            title={t.youtube_badge}
                          >
                            <svg viewBox="0 0 576 512" className="yt-svg">
                              <path
                                fill="currentColor"
                                d="M549.7 124.1c-6.3-23.7-24.8-42.3-48.3-48.6C458.8 64 288 64 288 64S117.2 64 74.6 75.5c-23.5 6.3-42 24.9-48.3 48.6-11.4 42.9-11.4 132.3-11.4 132.3s0 89.4 11.4 132.3c6.3 23.7 24.8 41.5 48.3 47.8C117.2 448 288 448 288 448s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zm-317.5 213.5V175.2l142.7 81.2-142.7 81.2z"
                              />
                            </svg>
                            {t.youtube_badge}
                          </a>
                        )}
                        <img src={result.image} alt={result.title} />
                      </div>

                      <div className="card-content">
                        <h2 className="prod-title">{result.title}</h2>
                        <p className="prod-desc">
                          {result[`description_${lang}`] ||
                            result.description_it}
                        </p>

                        <div className="specs-clean">
                          {/* Visualizza i Rating (Stelle) se presenti */}
                          {result.ratings &&
                            Object.entries(result.ratings).map(([k, v]) => (
                              <div key={k} className="spec-row">
                                <span>{t.labels[k] || k}</span>
                                <StarRating value={v} />
                              </div>
                            ))}
                          {/* Visualizza le Specs testuali se presenti */}
                          {result.specs &&
                            Object.entries(result.specs).map(([k, v]) => (
                              <div key={k} className="spec-row">
                                <span>{k}</span>
                                <strong>{v}</strong>
                              </div>
                            ))}
                          <div className="spec-row highlight">
                            <span>{t.price}</span>
                            <strong>€{result.price}</strong>
                          </div>
                        </div>

                        {result.discount && (
                          <div className="discount-clean">
                            {t.discount_label}:{" "}
                            <strong>{result.discount}</strong>
                          </div>
                        )}

                        <a
                          href={result.link}
                          target="_blank"
                          rel="noreferrer"
                          className="main-cta"
                        >
                          {t.buy_btn}
                        </a>
                      </div>
                    </div>
                  ))}

                  <button
                    className="restart-link sticky-bottom"
                    onClick={restart}
                  >
                    {t.restart}
                  </button>
                </div>
              )}
            </div>
          )
        )}
      </div>

      {/* --- BOTTONE WHATSAPP FLOTTANTE --- */}
      <a
        href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(t.wa_msg)}`}
        className="whatsapp-float"
        target="_blank"
        rel="noreferrer"
      >
        <svg viewBox="0 0 448 512" className="wa-icon">
          <path
            fill="currentColor"
            d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-4-10.5-6.7z"
          />
        </svg>
        <span>{t.wa_btn}</span>
      </a>
    </div>
  );
};

export default ProductWizard;
