/*
  ISTRUZIONI PER IL FILE JSON (MULTIPLE MATCHES):
  -----------------------------------------------
  Ora puoi assegnare più valori allo stesso criterio usando le parentesi quadre [ ].
  
  Esempio: Un Foil che va bene sia per Wing che per Surf:
  "matcher": {
     "sport": ["wing", "surf"], 
     "foil_level": ["int", "adv"]
  }
  
  Questo prodotto apparirà SE l'utente sceglie Wing OPPURE Surf, 
  e SE l'utente è Intermedio OPPURE Avanzato.
*/

import React, { useState, useEffect } from "react";
import "./ProductWizard.css";

const LOGO_URL =
  "https://www.sportalcentro.it/wp-content/uploads/2020/03/michi.png.webp";

// --- DATI DI ESEMPIO CON LOGICA MULTIPLA ---
const INITIAL_DATA = [
  // 1. IL MULTI-SPORT (Wing + Surf + Pump)
  {
    id: "sab-leviathan-1350",
    category: "foil",
    matcher: {
      // Questo prodotto appare per Wing, Surf E Pump!
      sport: ["wing", "surf", "pump"],
      // Appare per pesi Medi e Pesanti
      foil_weight: ["med", "heavy"],
      // Per il Wing, appare se cerchi lightwind
      wing_wind: ["light", "all"],
      // Per il Pump, va bene per imparare o endurance
      pump_goal: ["learn", "endurance"],
    },
    title: "Sabfoil Leviathan 1350",
    image:
      "https://sabfoil.com/images/thumbs/0003502_kit-leviathan-83-1350_550.jpeg",
    price: 2350,
    link: "#",
    discount: "SPORTALCENTRO",
    specs: { Mast: "83cm", Wing: "1350 cm²" },
    description_it:
      "Il Re del Glide. Perfetto per Wing col vento leggero, per il Pumping infinito e per Surf su onde piccole.",
    description_en:
      "The King of Glide. Perfect for Lightwind Wing, endless Pumping, and small Wave Surf.",
  },

  // 2. LO SPECIFICO RADICALE (Solo Surf e Wing Wave)
  {
    id: "sab-razor-820",
    category: "foil",
    matcher: {
      sport: ["wing", "surf"],
      foil_level: ["adv", "exp"], // Solo per esperti
      wing_wind: "strong",
      surf_wave: "fast",
    },
    title: "Sabfoil Razor Pro 820",
    image:
      "https://sabfoil.com/images/thumbs/0004123_kit-razor-pro-82-820_550.jpeg",
    price: 2400,
    link: "#",
    discount: "SPORTALCENTRO",
    specs: { Mast: "93cm", Wing: "820 cm²" },
    description_it: "Velocità pura e curve radicali. Solo per chi sa domarlo.",
    description_en:
      "Pure speed and radical turns. Only for those who can tame it.",
  },

  // 3. IL PRINCIPIANTE ASSOLUTO (Solo Wing)
  {
    id: "sab-tortuga-1250",
    category: "foil",
    matcher: {
      sport: "wing",
      foil_level: "beg",
      // Se non specifico foil_weight, va bene per tutti i pesi
    },
    title: "Sabfoil Tortuga 1250",
    image:
      "https://sabfoil.com/images/thumbs/0002871_kit-tortuga-79-1100_550.jpeg",
    price: 1750,
    link: "#",
    discount: "SPORTALCENTRO",
    specs: { Mast: "73cm", Wing: "1250 cm²" },
    description_it: "Stabilità totale per imparare senza stress.",
    description_en: "Total stability to learn without stress.",
  },

  // 4. SUP (Esempio Multi-uso)
  {
    id: "sup-allround",
    category: "sup",
    matcher: {
      sup_use: ["relax", "family", "yoga"], // Va bene per 3 cose diverse
      sup_level: ["beg", "int"],
    },
    title: "Family Cruiser 10'6",
    image:
      "https://images.unsplash.com/photo-1612663957242-706f9d453625?auto=format&fit=crop&w=600&q=80",
    price: 399,
    link: "#",
    discount: "SPORTALCENTRO",
    ratings: { stability: 5, speed: 2 },
    description_it: "La tavola tuttofare per eccellenza.",
    description_en: "The ultimate do-it-all board.",
  },
];

const translations = {
  it: {
    app_title: "I migliori provati da Michele",
    subtitle: "Rispondi a poche domande e trova il setup perfetto",
    step: "Passo",
    back: "Indietro",
    restart: "Ricomincia",
    result_msg: "Ecco i prodotti consigliati per te:", // Plurale
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
      sup_lvl: "Esperienza col SUP?",
      sup_use: "Utilizzo principale?",
      sup_h: "Quanto sei alto/a?",
      sup_loc: "Dove lo userai?",
      sup_bud: "Il tuo budget?",
      pump_src: "Alimentazione?",
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
      w_light: "Leggero (Lightwind)",
      w_all: "Medio / All-round",
      w_strong: "Forte / Wave",
      wav_small: "Piccole / Lente",
      wav_fast: "Veloci / Tubanti",
      g_learn: "Imparare (Dock Start)",
      g_enduro: "Resistenza / Distanza",
      g_free: "Freestyle",
      s_beg: "Principiante",
      s_int: "Intermedio",
      s_adv: "Avanzato",
      relax: "Relax",
      tour: "Touring",
      yoga: "Yoga",
      family: "Famiglia",
      wave: "Surf",
      h_low: "< 160 cm",
      h_mid: "160-180 cm",
      h_high: "> 180 cm",
      sea: "Mare",
      lake: "Lago",
      river: "Fiume",
      all: "Ovunque",
      b200: "< 200€",
      b300: "200-300€",
      b500: "300-500€",
      b_plus: "> 500€",
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
      exp: "Expert",
      learn: "Learning",
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
      relax: "Relax",
      tour: "Touring",
      yoga: "Yoga",
      family: "Family",
      wave: "Surf",
      h_low: "< 160 cm",
      h_mid: "160-180 cm",
      h_high: "> 180 cm",
      sea: "Sea",
      lake: "Lake",
      river: "River",
      all: "Anywhere",
      b200: "< 200€",
      b300: "200-300€",
      b500: "300-500€",
      b_plus: "> 500€",
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
  const [results, setResults] = useState(null); // Nota: ora è 'results' (plurale)
  const [products, setProducts] = useState([]);
  const t = translations[lang];

  useEffect(() => {
    setProducts(INITIAL_DATA);
  }, []);

  // --- NAVIGAZIONE (Invariata) ---
  const getQuestion = () => {
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
            { v: "relax", l: t.options.relax },
            { v: "tour", l: t.options.tour },
            { v: "yoga", l: t.options.yoga },
            { v: "family", l: t.options.family },
            { v: "wave", l: t.options.wave },
          ],
        };
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
            { v: "b200", l: t.options.b200 },
            { v: "b300", l: t.options.b300 },
            { v: "b500", l: t.options.b500 },
            { v: "b_plus", l: t.options.b_plus },
          ],
        };
    }
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
      findProducts(next); // Ora chiama findProducts (plurale)
    } else {
      setStep(step + 1);
    }
  };

  // --- NUOVA LOGICA: TROVA MULTIPLI E GESTISCI ARRAY ---
  const findProducts = (finalAnswers) => {
    const matches = products.filter((p) => {
      // .filter invece di .find
      // 1. Categoria
      if (p.category !== finalAnswers.category) return false;

      // 2. Controllo Matcher (Flessibile)
      if (p.matcher) {
        for (const [key, requirement] of Object.entries(p.matcher)) {
          const userVal = finalAnswers[key];

          // Se l'utente non ha risposto a questa domanda (es. domanda di un'altra disciplina), ignora
          if (!userVal) continue;

          // CASO A: Il requisito nel prodotto è un ARRAY ["wing", "surf"]
          if (Array.isArray(requirement)) {
            if (!requirement.includes(userVal)) return false; // Se la scelta dell'utente non è nell'array -> Scarta
          }
          // CASO B: Il requisito è un valore singolo "wing"
          else {
            if (requirement !== userVal) return false;
          }
        }
      }
      return true;
    });

    setResults(matches.length > 0 ? matches : []); // Salva array di risultati
  };

  const restart = () => {
    setStep(0);
    setAnswers({});
    setResults(null);
  };
  const q = results ? null : getQuestion(); // Se ci sono risultati, q è null
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
                // --- VISTA LISTA RISULTATI ---
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
