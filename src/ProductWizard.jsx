import React, { useState, useEffect } from "react";
import "./ProductWizard.css";

const LOGO_URL =
  "https://www.sportalcentro.it/wp-content/uploads/2020/03/michi.png.webp";

// --- CONFIGURAZIONE WHATSAPP ---
// Inserisci qui il tuo numero col prefisso (es. 39 per l'Italia) senza spazi o +
const WA_NUMBER = "393331234567";

const INITIAL_DATA = [
  {
    id: "airbank-pulse",
    category: "pump",
    matcher: {
      pump_type: "travel", // Si attiva se l'utente sceglie "Viaggio/Leggerezza"
    },
    title: "Airbank Pulse Pro",
    image:
      "https://www.sportalcentro.it/wp-content/uploads/product-wizard/airbank_pulse.jpg", // Assicurati di avere l'immagine
    price: 169,
    link: "#",
    discount: "SPORTALCENTRO",
    specs: { Peso: "0.9 kg", Batteria: "4500 mAh", Max: "20 PSI" },
    description_it:
      "La più piccola e leggera. Sta nel palmo di una mano. Perfetta per chi viaggia.",
    description_en:
      "The smallest and lightest. Fits in your palm. Perfect for travel.",
    youtube_link: "https://www.youtube.com/watch?v=enwfgiMnPro", // Review in italiano trovata
  },
  {
    id: "airbank-puffer",
    category: "pump",
    matcher: {
      pump_type: "performance",
      pump_budget: "std", // Si attiva se cerca performance ma budget standard
    },
    title: "Airbank Puffer Pro",
    image:
      "https://www.sportalcentro.it/wp-content/uploads/product-wizard/airbank_puffer.jpg",
    price: 199,
    link: "#",
    discount: "SPORTALCENTRO",
    specs: { Peso: "1.26 kg", Batteria: "5200 mAh", Max: "20 PSI" },
    description_it:
      "Il mulo da lavoro. Batteria maggiorata per gonfiare più tavole/wing con una carica.",
    description_en:
      "The workhorse. Larger battery to inflate more boards/wings on a single charge.",
  },
  {
    id: "ride-engine-airbox",
    category: "pump",
    matcher: {
      pump_type: "performance",
      pump_budget: "pro", // Si attiva se cerca il top di gamma
    },
    title: "Ride Engine Air Box",
    image:
      "https://www.sportalcentro.it/wp-content/uploads/product-wizard/re_airbox.jpg",
    price: 339,
    link: "#",
    discount: "SPORTALCENTRO",
    specs: { Durabilità: "Heavy Duty", Grade: "Premium", Max: "20 PSI" },
    description_it:
      "Qualità costruttiva superiore. Testata per uso intensivo e scuole. Indistruttibile.",
    description_en:
      "Superior build quality. Tested for intensive use and schools. Indestructible.",
  },
  // ... (I TUOI DATI JSON SONO INVARIATI - TIENE QUELLI CHE AVEVI) ...
  // Per brevità qui metto solo un esempio, ma tu mantieni la tua lista completa INITIAL_DATA
  {
    id: "sab-leviathan-1350",
    category: "foil",
    matcher: {
      sport: ["wing", "surf", "pump"],
      foil_weight: ["med", "heavy"],
      wing_wind: ["light", "all"],
      pump_goal: ["learn", "endurance"],
    },
    title: "Sabfoil Leviathan 1350",
    image:
      "https://sabfoil.com/images/thumbs/0003502_kit-leviathan-83-1350_550.jpeg",
    price: 2350,
    link: "#",
    discount: "SPORTALCENTRO",
    specs: { Mast: "83cm", Wing: "1350 cm²" },
    description_it: "Il Re del Glide. Perfetto per Wing col vento leggero.",
    description_en: "The King of Glide. Perfect for Lightwind Wing.",
  },
  // ... Assicurati di avere tutti i tuoi prodotti qui ...
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
    result_msg: "Ecco i prodotti consigliati per te:",
    youtube_badge: "Testato su YouTube",
    price: "Prezzo",
    min_level: "Livello",
    discount_label: "CODICE SCONTO",
    buy_btn: "Vedi Offerta",
    contact_title: "Nessun Risultato",
    contact_desc:
      "Nessun prodotto corrisponde esattamente a TUTTI i criteri. Contattaci!",

    // NUOVO TESTO WHATSAPP
    wa_btn: "Hai dubbi? Scrivimi su WhatsApp",
    wa_msg:
      "Ciao Michele, ho fatto il test dell'attrezzatura ma ho ancora qualche dubbio...",

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
      // ...
      pump_type: "Qual è la tua priorità?",
      pump_bud: "Che fascia di prodotto cerchi?", // Riutilizziamo o ne creiamo una nuova
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
      car: "Auto 12V",
      bat: "Batteria",
      // ...
      // Nuove opzioni per le pompe
      travel: "Viaggio / Minimo ingombro",
      perf: "Autonomia & Potenza",
      std_qual: "Miglior Rapporto Qualità/Prezzo",
      pro_qual: "Top di Gamma (Heavy Duty)",
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
    contact_desc: "No products match ALL your criteria. Contact us!",

    // NUOVO TESTO WHATSAPP (EN)
    wa_btn: "Doubts? Chat on WhatsApp",
    wa_msg:
      "Hi Michele, I took the gear quiz but I still have some questions...",

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
      pump_type: "What is your priority?",
      pump_bud: "Which product tier?",
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
      car: "Car 12V",
      bat: "Battery",
      travel: "Travel / Ultra Compact",
      perf: "Battery Life & Power",
      std_qual: "Best Value",
      pro_qual: "Top of the Line (Heavy Duty)",
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

    // --- SUP ---
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

    // --- PUMP ---

    // --- PUMP ---
    if (answers.category === "pump") {
      // Step 1: Chiediamo la priorità (Compattezza vs Performance)
      if (step === 1)
        return {
          key: "pump_type",
          text: t.questions.pump_type,
          opts: [
            { v: "travel", l: t.options.travel, i: "🎒" }, // Porta a Pulse Pro
            { v: "performance", l: t.options.perf, i: "🔋" }, // Porta a Puffer o RE
          ],
        };

      // Step 2: Se ha scelto Performance, chiediamo il livello (Budget vs Pro)
      if (step === 2 && answers.pump_type === "performance") {
        return {
          key: "pump_budget",
          text: t.questions.pump_bud,
          opts: [
            { v: "std", l: t.options.std_qual }, // Porta a Puffer Pro
            { v: "pro", l: t.options.pro_qual }, // Porta a Ride Engine
          ],
        };
      }
    }

    return null;
  };

  const handleSelect = (key, val) => {
    const next = { ...answers, [key]: val };
    setAnswers(next);
    let done = false;

    if (next.category === "sup" && step === 5) done = true;
    // Logica di fine wizard per PUMP
    if (next.category === "pump") {
      // Se sceglie "travel" al passo 1, abbiamo finito (va alla Pulse Pro)
      if (step === 1 && next.pump_type === "travel") done = true;
      // Se sceglie "performance", va al passo 2 (budget), poi finisce
      if (step === 2) done = true;
    }
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

                      <div className="card-content">
                        <h2 className="prod-title">{result.title}</h2>
                        <p className="prod-desc">
                          {result[`description_${lang}`] ||
                            result.description_it}
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
