/*
  FILE: ProductWizard.jsx
  
  LOGICA SUP AGGIORNATA:
  - Domanda Utilizzo: Occasionale, Escursioni, Gara, Yoga, Surf
  - Domanda Budget: <300, 300-600, >600
  
  Le altre domande (Livello, Altezza, Luogo) sono rimaste invariate.
*/

import React, { useState, useEffect } from "react";
import "./ProductWizard.css";

const LOGO_URL =
  "https://www.sportalcentro.it/wp-content/uploads/2020/03/michi.png.webp";

// --- DATI DI ESEMPIO AGGIORNATI CON NUOVE CHIAVI SUP ---
const INITIAL_DATA = [
  // --- SUP ECONOMICO (Occasionale / <300€) ---
  {
    id: "sup-occasional-low",
    category: "sup",
    matcher: {
      sup_use: "occasional",
      sup_budget: "b_low", // Meno di 300€
    },
    title: "Basic Cruiser 10'6",
    image:
      "https://images.unsplash.com/photo-1612663957242-706f9d453625?auto=format&fit=crop&w=600&q=80",
    price: 289,
    link: "#",
    discount: "SPORTALCENTRO",
    ratings: { stability: 4, speed: 2 },
    description_it:
      "Ideale per chi inizia o ne fa un uso saltuario in vacanza. Leggera e facile.",
    description_en:
      "Ideal for beginners or occasional holiday use. Light and easy.",
  },

  // --- SUP ESCURSIONE (Fascia Media 300-600€) ---
  {
    id: "sup-touring-mid",
    category: "sup",
    matcher: {
      sup_use: "excursion",
      sup_budget: "b_mid", // 300-600€
    },
    title: "Explorer Touring 12'6",
    image:
      "https://images.unsplash.com/photo-1596562095816-432d664562c5?auto=format&fit=crop&w=600&q=80",
    price: 499,
    link: "#",
    discount: "SPORTALCENTRO",
    ratings: { stability: 3, speed: 5 },
    description_it:
      "Perfetta per stare in acqua diverse ore. Scorre veloce e affatica meno.",
    description_en:
      "Perfect for spending hours on the water. Glides fast with less effort.",
  },

  // --- SUP GARA / TOP (Fascia Alta >600€) ---
  {
    id: "sup-race-pro",
    category: "sup",
    matcher: {
      sup_use: ["race", "excursion"],
      sup_budget: "b_high", // > 600€
    },
    title: "Carbon Race Pro 14'",
    image:
      "https://images.unsplash.com/photo-1547849495-9304a43b2f56?auto=format&fit=crop&w=600&q=80",
    price: 850,
    link: "#",
    discount: "SPORTALCENTRO",
    ratings: { stability: 2, speed: 5 },
    description_it:
      "Prestazioni pure. Rigida come una tavola in carbonio, veloce come un proiettile.",
    description_en: "Pure performance. Stiff as carbon, fast as a bullet.",
  },

  // --- YOGA (Fascia Media) ---
  {
    id: "sup-yoga",
    category: "sup",
    matcher: { sup_use: "yoga" },
    title: "Zen Lotus Yoga Board",
    image:
      "https://images.unsplash.com/photo-1544367563-12123d896889?auto=format&fit=crop&w=600&q=80",
    price: 399,
    link: "#",
    discount: "SPORTALCENTRO",
    ratings: { stability: 5, speed: 1 },
    description_it:
      "Piattaforma ultra stabile per le tue sessioni di yoga in acqua.",
    description_en: "Ultra stable platform for your water yoga sessions.",
  },

  // --- HYDROFOIL ESEMPIO (Invariato) ---
  {
    id: "sab-leviathan-1350",
    category: "foil",
    matcher: {
      sport: ["wing", "surf", "pump"],
      foil_weight: ["med", "heavy"],
    },
    title: "Sabfoil Leviathan 1350",
    image:
      "https://www.sportalcentro.it/wp-content/uploads/product-wizard/sab_medusa_pro.jpg",
    price: 2350,
    link: "#",
    discount: "SPORTALCENTRO",
    specs: { Mast: "83cm", Wing: "1350 cm²" },
    description_it:
      "Il Re del Glide. Perfetto per Wing col vento leggero e Pumping.",
    description_en:
      "The King of Glide. Perfect for Lightwind Wing and Pumping.",
  },

  {
    id: "sab-leviathan-1100",
    category: "foil",
    matcher: {
      sport: ["wing", "surf", "pump"],
      foil_weight: ["med", "heavy"],
    },
    title: "Sabfoil Leviathan 1100",
    image:
      "https://www.sportalcentro.it/wp-content/uploads/product-wizard/sab_razor_pro.jpg",
    price: 2350,
    link: "#",
    discount: "SPORTALCENTRO",
    specs: { Mast: "83cm", Wing: "1350 cm²" },
    description_it:
      "Il Re del Glide. Perfetto per Wing col vento leggero e Pumping.",
    description_en:
      "The King of Glide. Perfect for Lightwind Wing and Pumping.",
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
      "Nessun prodotto corrisponde esattamente a TUTTI i criteri selezionati. Prova a cambiare qualche risposta!",
    questions: {
      cat: "Cosa stai cercando?",
      sport: "Quale disciplina Hydrofoil?",
      f_weight: "Qual è il tuo peso?",
      f_level: "Qual è il tuo livello?",
      w_wind: "Vento prevalente nel tuo spot?",
      s_wave: "Che onde surfi principalmente?",
      p_goal: "Obiettivo nel Pumping?",
      dw_lvl: "Esperienza nel Downwind?",
      // SUP
      sup_lvl: "Esperienza col SUP?",
      sup_use: "Utilizzo principale?",
      sup_h: "Quanto sei alto/a?",
      sup_loc: "Dove lo userai?",
      sup_bud: "Il tuo budget?",
      // Pump
      pump_src: "Alimentazione?",
    },
    options: {
      foil: "Hydrofoil",
      sup: "SUP Gonfiabile",
      pump: "Pompe Elettriche",
      // Foil Options
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
      w_light: "Leggero (Lightwind)",
      w_all: "Medio / All-round",
      w_strong: "Forte / Wave",
      wav_small: "Piccole / Lente",
      wav_fast: "Veloci / Tubanti",
      g_learn: "Imparare (Dock Start)",
      g_enduro: "Resistenza / Distanza",
      g_free: "Freestyle",

      // SUP LEVELS
      s_beg: "Principiante",
      s_int: "Intermedio",
      s_adv: "Avanzato",

      // SUP USE (NUOVI)
      occasional: "Utilizzo occasionale",
      excursion: "Escursioni di varie ore",
      race: "Velocità / Gara",
      yoga: "Yoga",
      surf: "Surf",

      // SUP HEIGHT
      h_low: "< 160 cm",
      h_mid: "160-180 cm",
      h_high: "> 180 cm",

      // SUP LOCATION
      sea: "Mare Calmo",
      lake: "Lago",
      river: "Fiume / Acqua mossa",
      all: "Ovunque",

      // SUP BUDGET (NUOVI)
      b_low: "Meno di 300 €",
      b_mid: "Tra 300 e 600 €",
      b_high: "Più di 600 €",

      // Pump Options
      car: "Auto 12V",
      bat: "Batteria",
    },
    labels: { stability: "Stabilità", speed: "Velocità" },
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
    contact_desc:
      "No products match ALL your criteria. Try changing some answers!",
    questions: {
      cat: "What are you looking for?",
      sport: "Which Hydrofoil discipline?",
      f_weight: "Your Weight?",
      f_level: "Your Skill Level?",
      w_wind: "Prevailing wind condition?",
      s_wave: "Main wave type?",
      p_goal: "Pumping Goal?",
      dw_lvl: "Downwind Experience?",
      sup_lvl: "SUP Experience?",
      sup_use: "Main Usage?",
      sup_h: "Your Height?",
      sup_loc: "Location?",
      sup_bud: "Budget?",
      pump_src: "Power source?",
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
      w_light: "Lightwind",
      w_all: "Medium / All-round",
      w_strong: "Strong / Wave",
      wav_small: "Small / Slow",
      wav_fast: "Fast / Hollow",
      g_learn: "Learning (Dock Start)",
      g_enduro: "Endurance",
      g_free: "Freestyle",

      s_beg: "Beginner",
      s_int: "Intermediate",
      s_adv: "Advanced",

      // SUP USE (NEW)
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

      // SUP BUDGET (NEW)
      b_low: "Less than 300 €",
      b_mid: "300 - 600 €",
      b_high: "More than 600 €",

      car: "Car 12V",
      bat: "Battery",
    },
    labels: { stability: "Stability", speed: "Speed" },
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

  // --- NAVIGAZIONE DOMANDE ---
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
            { v: "pmp", l: t.options.pmp },
            { v: "dw", l: t.options.dw },
          ],
        };
      if (step === 2)
        return {
          key: "foil_weight",
          text: t.questions.f_weight,
          opts: [
            { v: "light", l: t.options.light },
            { v: "med", l: t.options.med },
            { v: "heavy", l: t.options.heavy },
          ],
        };

      if (answers.sport === "wing") {
        if (step === 3)
          return {
            key: "foil_level",
            text: t.questions.f_level,
            opts: [
              { v: "beg", l: t.options.beg },
              { v: "int", l: t.options.int },
              { v: "adv", l: t.options.adv },
            ],
          };
        if (step === 4)
          return {
            key: "wing_wind",
            text: t.questions.w_wind,
            opts: [
              { v: "light", l: t.options.w_light },
              { v: "all", l: t.options.w_all },
              { v: "strong", l: t.options.w_strong },
            ],
          };
      }
      if (answers.sport === "surf") {
        if (step === 3)
          return {
            key: "foil_level",
            text: t.questions.f_level,
            opts: [
              { v: "beg", l: t.options.beg },
              { v: "int", l: t.options.int },
              { v: "adv", l: t.options.adv },
            ],
          };
        if (step === 4)
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
        if (step === 3)
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
        if (step === 3)
          return {
            key: "dw_level",
            text: t.questions.dw_lvl,
            opts: [
              { v: "learn", l: t.options.learn },
              { v: "expert", l: t.options.exp },
            ],
          };
      }
    }

    // --- SUP (Logica Aggiornata) ---
    if (answers.category === "sup") {
      // 1. Livello
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

      // 2. Utilizzo (NUOVO SET)
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

      // 3. Altezza
      if (step === 3)
        return {
          key: "sup_height",
          text: t.questions.sup_h,
          opts: [
            { v: "short", l: t.options.h_low },
            { v: "avg", l: t.options.h_mid },
            { v: "tall", l: t.options.h_high },
          ],
        };

      // 4. Luogo
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

      // 5. Budget (NUOVO SET)
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

    // --- PUMP ---
    if (answers.category === "pump") {
      if (step === 1)
        return {
          key: "pump_src",
          text: t.questions.pump_src,
          opts: [
            { v: "car", l: t.options.car },
            { v: "bat", l: t.options.bat },
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
    if (next.category === "pump" && step === 1) done = true;
    if (next.category === "foil") {
      if (next.sport === "wing" && step === 4) done = true;
      if (next.sport === "surf" && step === 4) done = true;
      if (next.sport === "pump" && step === 3) done = true;
      if (next.sport === "dw" && step === 3) done = true;
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
  const maxSteps =
    answers.category === "sup"
      ? 5
      : answers.sport === "wing" || answers.sport === "surf"
      ? 4
      : 3;
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
                      <h2 className="prod-title">{result.title}</h2>
                      <p className="prod-desc">
                        {result[`description_${lang}`] || result.description_it}
                      </p>
                      <div className="specs-clean">
                        {result.ratings &&
                          Object.entries(result.ratings).map(([k, v]) => (
                            <div key={k} className="spec-row">
                              <span>{t.labels[k] || k}</span>
                              <StarRating value={v} />
                            </div>
                          ))}
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
                          {t.discount_label}: <strong>{result.discount}</strong>
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
    </div>
  );
};

export default ProductWizard;
