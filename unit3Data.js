(() => {
  "use strict";

  const SUBJECTS = ["io", "tu", "lui/lei/Lei", "noi", "voi", "loro"];
  const random = (items) => items[Math.floor(Math.random() * items.length)];
  const shuffle = (items) => {
    const copy = [...items];
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const swap = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[swap]] = [copy[swap], copy[index]];
    }
    return copy;
  };
  const splitMeanings = (value) => {
    const parts = value.split(" / ").map((part) => part.trim());
    const infinitiveParts = value.startsWith("to ") ? parts.map((part) => part.startsWith("to ") ? part : `to ${part}`) : [];
    return [...new Set([value, ...parts, ...infinitiveParts, ...parts.map((part) => part.replace(/^to\s+/, ""))])];
  };
  const baseQuestion = (category, sourceId, id, kicker, display, answer, explanation, distractors = [], accepted = [answer]) => ({
    category, sourceId, id, kicker, display, answer, accepted, explanation, distractors
  });
  const choose = (pool, sourceId) => pool.find((item) => item.id === sourceId) || random(pool);
  const directionToEnglish = (direction) => direction === "it-en" || (direction === "mixed" && Math.random() < 0.5);

  const family = (id, italian, english, gender, group, options = {}) => ({
    id, italian, base: options.base || italian.replace(/^(il|lo|la|i|le)\s+/, ""), english, gender, groups: [group], tag: options.tag || "Family",
    acceptedItalian: [...new Set([italian, ...(options.accepted || [])])],
    ambiguity: options.ambiguity || ""
  });

  const FAMILY_CORE = [
    family("family", "la famiglia", "family", "f", "family-core"),
    family("husband", "il marito", "husband", "m", "family-core"), family("wife", "la moglie", "wife", "f", "family-core"),
    family("brother", "il fratello", "brother", "m", "family-core"), family("sister", "la sorella", "sister", "f", "family-core"),
    family("father", "il padre", "father", "m", "family-core"), family("mother", "la madre", "mother", "f", "family-core"),
    family("son", "il figlio", "son", "m", "family-core"), family("daughter", "la figlia", "daughter", "f", "family-core"),
    family("parents", "i genitori", "parents", "mp", "family-core"), family("grandfather", "il nonno", "grandfather", "m", "family-core"),
    family("grandmother", "la nonna", "grandmother", "f", "family-core"),
    family("maternal-grandfather", "il nonno materno", "maternal grandfather", "m", "family-core"),
    family("maternal-grandmother", "la nonna materna", "maternal grandmother", "f", "family-core")
  ];
  const FAMILY_EXTENDED = [
    family("male-cousin", "il cugino", "male cousin", "m", "family-extended"), family("female-cousin", "la cugina", "female cousin", "f", "family-extended"),
    family("nephew-grandson", "il nipote", "nephew / grandson", "m", "family-extended", { ambiguity: "Nipote can mean nephew or grandson; context decides." }),
    family("niece-granddaughter", "la nipote", "niece / granddaughter", "f", "family-extended", { ambiguity: "Nipote can mean niece or granddaughter; context decides." }),
    family("male-relative", "il parente", "male relative", "m", "family-extended"), family("female-relative", "la parente", "female relative", "f", "family-extended"),
    family("uncle", "lo zio", "uncle", "m", "family-extended"), family("aunt", "la zia", "aunt", "f", "family-extended"),
    family("brother-in-law", "il cognato", "brother-in-law", "m", "family-extended"), family("sister-in-law", "la cognata", "sister-in-law", "f", "family-extended"),
    family("father-in-law", "il suocero", "father-in-law", "m", "family-extended"), family("mother-in-law", "la suocera", "mother-in-law", "f", "family-extended"),
    family("male-twin", "il gemello", "male twin", "m", "family-extended"), family("female-twin", "la gemella", "female twin", "f", "family-extended"),
    family("only-son", "il figlio unico", "only son / only child (male)", "m", "family-extended"),
    family("only-daughter", "la figlia unica", "only daughter / only child (female)", "f", "family-extended"),
    family("older", "maggiore", "older / elder", "x", "family-extended"), family("younger", "minore", "younger", "x", "family-extended")
  ];
  const FAMILY_RELATIONSHIPS = [
    family("married-m", "sposato", "married (masculine)", "m", "family-relationships", { accepted: ["sposato"] }),
    family("married-f", "sposata", "married (feminine)", "f", "family-relationships", { accepted: ["sposata"] }),
    family("engaged-m", "fidanzato", "engaged (masculine)", "m", "family-relationships"), family("engaged-f", "fidanzata", "engaged (feminine)", "f", "family-relationships"),
    family("separated-m", "separato", "separated (masculine)", "m", "family-relationships"), family("separated-f", "separata", "separated (feminine)", "f", "family-relationships"),
    family("divorced-m", "divorziato", "divorced (masculine)", "m", "family-relationships"), family("divorced-f", "divorziata", "divorced (feminine)", "f", "family-relationships"),
    family("single", "single", "single", "x", "family-relationships"),
    family("stepfather", "il patrigno", "stepfather", "m", "family-relationships"), family("stepmother", "la matrigna", "stepmother", "f", "family-relationships"),
    family("stepbrother", "il fratellastro", "stepbrother / half-brother", "m", "family-relationships"), family("stepsister", "la sorellastra", "stepsister / half-sister", "f", "family-relationships"),
    family("older-brother", "il fratello maggiore", "older brother", "m", "family-relationships"), family("older-sister", "la sorella maggiore", "older sister", "f", "family-relationships"),
    family("younger-brother", "il fratello minore", "younger brother", "m", "family-relationships"), family("younger-sister", "la sorella minore", "younger sister", "f", "family-relationships"),
    family("extended-family", "la famiglia estesa", "extended family", "f", "family-relationships", { accepted: ["la famiglia allargata", "famiglia estesa", "famiglia allargata"] }),
    family("family-unit", "il nucleo familiare", "immediate family / family unit", "m", "family-relationships")
  ];
  const FAMILY = [...FAMILY_CORE, ...FAMILY_EXTENDED, ...FAMILY_RELATIONSHIPS];

  const forms = (io, tu, luiLei, noi, voi, loro) => ({ io, tu, "lui/lei/Lei": luiLei, noi, voi, loro });
  const verb = (infinitive, english, type, conjugation) => ({ id: infinitive, infinitive, italian: infinitive, english, conjugationType: type, forms: conjugation, groups: [type, "verbs"], tag: "Verb" });
  const ERE = [
    verb("vivere", "to live", "ere", forms("vivo", "vivi", "vive", "viviamo", "vivete", "vivono")),
    verb("chiedere", "to ask for", "ere", forms("chiedo", "chiedi", "chiede", "chiediamo", "chiedete", "chiedono")),
    verb("conoscere", "to know / be acquainted with", "ere", forms("conosco", "conosci", "conosce", "conosciamo", "conoscete", "conoscono")),
    verb("leggere", "to read", "ere", forms("leggo", "leggi", "legge", "leggiamo", "leggete", "leggono")),
    verb("mettere", "to put", "ere", forms("metto", "metti", "mette", "mettiamo", "mettete", "mettono")),
    verb("perdere", "to lose", "ere", forms("perdo", "perdi", "perde", "perdiamo", "perdete", "perdono")),
    verb("prendere", "to take", "ere", forms("prendo", "prendi", "prende", "prendiamo", "prendete", "prendono")),
    verb("scrivere", "to write", "ere", forms("scrivo", "scrivi", "scrive", "scriviamo", "scrivete", "scrivono")),
    verb("spendere", "to spend", "ere", forms("spendo", "spendi", "spende", "spendiamo", "spendete", "spendono")),
    verb("vedere", "to see", "ere", forms("vedo", "vedi", "vede", "vediamo", "vedete", "vedono")),
    verb("vincere", "to win", "ere", forms("vinco", "vinci", "vince", "vinciamo", "vincete", "vincono"))
  ];
  const IRE = [
    verb("partire", "to leave", "ire-regular", forms("parto", "parti", "parte", "partiamo", "partite", "partono")),
    verb("aprire", "to open", "ire-regular", forms("apro", "apri", "apre", "apriamo", "aprite", "aprono")),
    verb("dormire", "to sleep", "ire-regular", forms("dormo", "dormi", "dorme", "dormiamo", "dormite", "dormono")),
    verb("offrire", "to offer", "ire-regular", forms("offro", "offri", "offre", "offriamo", "offrite", "offrono")),
    verb("seguire", "to follow / take a course", "ire-regular", forms("seguo", "segui", "segue", "seguiamo", "seguite", "seguono")),
    verb("sentire", "to hear", "ire-regular", forms("sento", "senti", "sente", "sentiamo", "sentite", "sentono")),
    verb("servire", "to serve", "ire-regular", forms("servo", "servi", "serve", "serviamo", "servite", "servono"))
  ];
  const ISC = [
    verb("finire", "to finish", "ire-isc", forms("finisco", "finisci", "finisce", "finiamo", "finite", "finiscono")),
    verb("capire", "to understand", "ire-isc", forms("capisco", "capisci", "capisce", "capiamo", "capite", "capiscono")),
    verb("preferire", "to prefer", "ire-isc", forms("preferisco", "preferisci", "preferisce", "preferiamo", "preferite", "preferiscono")),
    verb("pulire", "to clean", "ire-isc", forms("pulisco", "pulisci", "pulisce", "puliamo", "pulite", "puliscono")),
    verb("restituire", "to return / give back", "ire-isc", forms("restituisco", "restituisci", "restituisce", "restituiamo", "restituite", "restituiscono")),
    verb("spedire", "to send", "ire-isc", forms("spedisco", "spedisci", "spedisce", "spediamo", "spedite", "spediscono"))
  ];
  const VERBS = [...ERE, ...IRE, ...ISC];

  const CATEGORY_POOLS = {
    "Core Family Vocabulary": FAMILY_CORE,
    "Extended Family Vocabulary": FAMILY_EXTENDED,
    "Family Relationships / Status": FAMILY_RELATIONSHIPS,
    "-ERE Verb Vocabulary": ERE,
    "-IRE Verb Vocabulary": IRE,
    "-IRE + -ISC Verb Vocabulary": ISC
  };
  const CATEGORIES = [
    "Core Family Vocabulary", "Extended Family Vocabulary", "Family Relationships / Status", "Family Tree Practice",
    "-ERE Verb Vocabulary", "Regular -ERE Verbs", "-IRE Verb Vocabulary", "Regular -IRE Verbs", "-IRE + -ISC Verb Vocabulary", "-IRE Verbs with -ISC", "Mixed -ERE / -IRE Conjugation",
    "Possessive Adjectives", "Possessives with Family Members", "Possessive Pronouns", "Possessives with DI", "Mixed Possessives", "Culture & Recognition"
  ];
  const TOPIC_GROUPS = [
    { name: "Vocabulary", topics: [
      ["Core Family Vocabulary", "Immediate family"], ["Extended Family Vocabulary", "Relatives and in-laws"],
      ["Family Relationships / Status", "Status, stepfamily, older / younger"], ["Family Tree Practice", "Relationship reasoning"]
    ] },
    { name: "Verbs", topics: [
      ["-ERE Verb Vocabulary", "Learn what -ERE verbs mean"], ["Regular -ERE Verbs", "Learn to conjugate them"],
      ["-IRE Verb Vocabulary", "Learn what regular -IRE verbs mean"], ["Regular -IRE Verbs", "Learn to conjugate them"],
      ["-IRE + -ISC Verb Vocabulary", "Learn what -isc verbs mean · meanings only"], ["-IRE Verbs with -ISC", "Learn to conjugate them"],
      ["Mixed -ERE / -IRE Conjugation", "Choose the pattern first"]
    ] },
    { name: "Possessives", topics: [
      ["Possessive Adjectives", "Agreement with the thing possessed"], ["Possessives with Family Members", "Article or no article?"],
      ["Possessive Pronouns", "Replace the noun"], ["Possessives with DI", "Di chi è? / Di chi sono?"], ["Mixed Possessives", "Course-style mixed challenge"]
    ] },
    { name: "Optional course context", topics: [["Culture & Recognition", "Veneto, Venice, and Pane e Tulipani"]] }
  ];
  const TOPICS = TOPIC_GROUPS.flatMap((group) => group.topics.map(([topic]) => topic));
  const PRESETS = {
    family: ["Core Family Vocabulary", "Extended Family Vocabulary", "Family Relationships / Status", "Family Tree Practice"],
    verbs: ["-ERE Verb Vocabulary", "Regular -ERE Verbs", "-IRE Verb Vocabulary", "Regular -IRE Verbs", "-IRE + -ISC Verb Vocabulary", "-IRE Verbs with -ISC", "Mixed -ERE / -IRE Conjugation"],
    possessives: ["Possessive Adjectives", "Possessives with Family Members", "Possessive Pronouns", "Possessives with DI", "Mixed Possessives"],
    priority: TOPICS.filter((topic) => topic !== "Culture & Recognition"),
    everything: [...TOPICS]
  };
  const PRESET_LABELS = { family: "Family", verbs: "Verbs", possessives: "Possessives", priority: "Main 16", everything: "Everything" };
  const MATCHING_CATEGORIES = ["Core Family Vocabulary", "Extended Family Vocabulary", "Family Relationships / Status", "-ERE Verb Vocabulary", "-IRE Verb Vocabulary", "-IRE + -ISC Verb Vocabulary", "Regular -ERE Verbs", "Regular -IRE Verbs", "-IRE Verbs with -ISC"];

  const POSSESSIVES = {
    mio: { ms: "il mio", mp: "i miei", fs: "la mia", fp: "le mie" },
    tuo: { ms: "il tuo", mp: "i tuoi", fs: "la tua", fp: "le tue" },
    suo: { ms: "il suo", mp: "i suoi", fs: "la sua", fp: "le sue" },
    nostro: { ms: "il nostro", mp: "i nostri", fs: "la nostra", fp: "le nostre" },
    vostro: { ms: "il vostro", mp: "i vostri", fs: "la vostra", fp: "le vostre" },
    loro: { ms: "il loro", mp: "i loro", fs: "la loro", fp: "le loro" }
  };
  const POSSESSIVE_KEY_ORDER = ["ms", "fs", "mp", "fp"];
  const KEY_LABELS = { ms: "masculine singular", fs: "feminine singular", mp: "masculine plural", fp: "feminine plural" };
  const OWNER_LABELS = { mio: "io", tuo: "tu", suo: "lui/lei", nostro: "noi", vostro: "voi", loro: "loro" };
  const samePossessorForms = (possessor) => POSSESSIVE_KEY_ORDER.map((key) => POSSESSIVES[possessor][key]);
  const withoutArticle = (value) => value.replace(/^(il|la|i|le)\s+/, "");
  const possessedNouns = [
    { id: "libro", noun: "libro", key: "ms" }, { id: "amici", noun: "amici", key: "mp" }, { id: "sedia", noun: "sedia", key: "fs" },
    { id: "macchina", noun: "macchina", key: "fs" }, { id: "lezioni", noun: "lezioni", key: "fp" },
    { id: "automobili", noun: "automobili", key: "fp" }, { id: "mappa", noun: "mappa", key: "fs" }, { id: "lettere", noun: "lettere", key: "fp" },
    { id: "film", noun: "film", key: "ms" }, { id: "quaderni", noun: "quaderni", key: "mp" }, { id: "corsi", noun: "corsi", key: "mp" }
  ];
  const FAMILY_POSSESSIVE = [
    { id: "my-father", noun: "padre", key: "ms", possessor: "mio", prompt: "___ padre (io)", answer: "mio", rule: "singular" },
    { id: "my-mother", noun: "madre", key: "fs", possessor: "mio", prompt: "___ madre (io)", answer: "mia", rule: "singular" },
    { id: "your-brother", noun: "fratello", key: "ms", possessor: "tuo", prompt: "___ fratello (tu)", answer: "tuo", rule: "singular" },
    { id: "his-sister", noun: "sorella", key: "fs", possessor: "suo", prompt: "___ sorella (Marco)", answer: "sua", rule: "singular" },
    { id: "my-parents", noun: "genitori", key: "mp", possessor: "mio", prompt: "___ genitori (io)", answer: "i miei", rule: "plural" },
    { id: "my-sisters", noun: "sorelle", key: "fp", possessor: "mio", prompt: "___ sorelle (io)", answer: "le mie", rule: "plural" },
    { id: "your-parents", noun: "genitori", key: "mp", possessor: "tuo", prompt: "___ genitori (tu)", answer: "i tuoi", rule: "plural" },
    { id: "his-cousins", noun: "cugini", key: "mp", possessor: "suo", prompt: "___ cugini (Marco)", answer: "i suoi", rule: "plural" },
    { id: "my-younger-brother", noun: "fratello minore", key: "ms", possessor: "mio", prompt: "___ fratello minore (io)", answer: "il mio", rule: "modified" },
    { id: "their-nephew", noun: "nipote", key: "ms", possessor: "loro", prompt: "___ nipote (loro)", answer: "il loro", rule: "loro" },
    { id: "their-sisters", noun: "sorelle", key: "fp", possessor: "loro", prompt: "___ sorelle (loro)", answer: "le loro", rule: "plural" }
  ];
  const RELATION_CONTEXTS = [
    ["cognata", "Maria è la moglie di mio fratello. Lei è mia ___.", "cognata"], ["suocero", "Il padre di mia moglie è mio ___.", "suocero"],
    ["zia", "Mia madre ha una sorella. Lei è mia ___.", "zia"], ["cugino", "Il figlio di mio zio è mio ___.", "cugino"],
    ["nonno", "Il padre di mio padre è mio ___.", "nonno"], ["nipote-niece", "La figlia di mio fratello è mia ___.", "nipote"],
    ["nipote-granddaughter", "Io sono la ___ di mia nonna.", "nipote"]
  ].map(([id, prompt, answer]) => ({ id: `relationship-${id}`, prompt, answer }));
  const VERB_CONTEXTS = [
    ["vivere", "io", "Io ___ a Venezia."], ["leggere", "io", "Io ___ molti libri."], ["conoscere", "loro", "I tuoi genitori ___ bene il tuo fidanzato."],
    ["partire", "lui/lei/Lei", "A che ora ___ il treno?"], ["sentire", "io", "Io ___ mia madre al telefono."], ["offrire", "noi", "Noi ___ il caffè."],
    ["aprire", "voi", "La professoressa dice: “___ i libri!”"], ["dormire", "lui/lei/Lei", "Giuseppe ___ durante la lezione."],
    ["seguire", "lui/lei/Lei", "Lui ___ cinque corsi."], ["servire", "lui/lei/Lei", "Il barista ___ il caffè."],
    ["pulire", "io", "Ogni domenica io ___ la casa."], ["finire", "loro", "Le lezioni ___ alle sei."],
    ["spedire", "lui/lei/Lei", "La tua famiglia ___ molti regali."], ["capire", "noi", "Noi non ___ il problema."],
    ["preferire", "tu", "Tu ___ storia o letteratura?"], ["restituire", "voi", "Quando ___ voi i libri?"]
  ].map(([verbId, subject, prompt]) => ({ id: `context-${verbId}-${subject}`, verbId, subject, prompt }));

  const CULTURE = [
    ["region", "Veneto is a region in which part of Italy?", "northeastern Italy", ["northeastern Italy", "southern Italy", "Sicily", "Sardinia"]],
    ["cities", "Which city is in Veneto?", "Venezia", ["Venezia", "Napoli", "Bari", "Palermo"]],
    ["verona", "Which famous Roman arena is in Veneto?", "Arena di Verona", ["Arena di Verona", "Colosseo", "Teatro Massimo", "Pompei"]],
    ["rialto", "Ponte di Rialto is associated with which city?", "Venezia", ["Venezia", "Padova", "Verona", "Milano"]],
    ["san-marco", "Piazza San Marco is in which city?", "Venezia", ["Venezia", "Verona", "Padova", "Roma"]],
    ["carnevale", "Carnevale di Venezia is associated with which region?", "Veneto", ["Veneto", "Campania", "Puglia", "Toscana"]],
    ["vivaldi", "Which famous Venetian shown in the course was a composer?", "Antonio Vivaldi", ["Antonio Vivaldi", "Marco Polo", "Giacomo Casanova", "Dante Alighieri"]],
    ["pane", "Pane e Tulipani is included in Unit 3 as what kind of material?", "culture recognition", ["culture recognition", "advanced grammar", "a verb chart", "a family tree"]]
  ].map(([id, prompt, answer, options]) => ({ id: `culture-${id}`, prompt, answer, options }));

  const FAMILY_TREES = [
    { id: "rossi", text: "Pietro and Lucia are married. Their daughter is Elisa. Elisa has a son named Antonio.", questions: [
      ["What is Pietro to Antonio?", "nonno"], ["What is Lucia to Antonio?", "nonna"], ["What is Elisa to Antonio?", "madre"]
    ] },
    { id: "bianchi", text: "Marco and Anna are married. They have two children, Luca and Giulia. Luca has a daughter named Sofia.", questions: [
      ["What is Giulia to Sofia?", "zia"], ["What is Marco to Sofia?", "nonno"], ["What is Sofia to Luca?", "figlia"]
    ] },
    { id: "verdi", text: "Giorgio has two daughters, Paola and Francesca. Paola has a son, Matteo. Francesca has a daughter, Giulia.", questions: [
      ["What is Matteo to Giulia?", "cugino"], ["What is Francesca to Matteo?", "zia"], ["What is Giulia to Giorgio?", "nipote"]
    ] }
  ];

  function vocabularyQuestion(category, sourceId, direction) {
    const pool = CATEGORY_POOLS[category];
    const item = choose(pool, sourceId);
    const toEnglish = directionToEnglish(direction);
    const question = baseQuestion(category, item.id, `u3-vocab:${item.id}:${toEnglish ? "en" : "it"}`,
      toEnglish ? "Translate into English" : "Translate into Italian (include the article when shown in the course)",
      toEnglish ? item.italian : item.english, toEnglish ? item.english : item.italian,
      `${item.italian} means “${item.english}.”${item.ambiguity ? ` ${item.ambiguity}` : ""}`,
      pool.filter((candidate) => candidate.id !== item.id).map((candidate) => toEnglish ? candidate.english : candidate.italian),
      toEnglish ? splitMeanings(item.english) : item.acceptedItalian);
    question.isVocabularyTranslation = true;
    question.translationDirection = toEnglish ? "it-en" : "en-it";
    return question;
  }

  function relationshipQuestion(sourceId) {
    const contextual = sourceId?.startsWith("relationship-") || Math.random() < 0.72;
    if (!contextual) return vocabularyQuestion("Family Relationships / Status", sourceId, "mixed");
    const item = choose(RELATION_CONTEXTS, sourceId);
    return baseQuestion("Family Relationships / Status", item.id, `u3-${item.id}`, "Complete the family relationship", item.prompt, item.answer,
      `${item.answer} is the relationship described by the sentence.`, RELATION_CONTEXTS.filter((entry) => entry.id !== item.id).map((entry) => entry.answer));
  }

  function familyTreeQuestion(sourceId) {
    const requestedTree = FAMILY_TREES.find((tree) => sourceId?.startsWith(`tree-${tree.id}`));
    const tree = requestedTree || random(FAMILY_TREES);
    const index = Number(sourceId?.split(":").at(-1));
    const qIndex = Number.isInteger(index) && tree.questions[index] ? index : Math.floor(Math.random() * tree.questions.length);
    const [prompt, answer] = tree.questions[qIndex];
    const trueFalse = Math.random() < 0.25;
    if (trueFalse) {
      const statementAnswer = Math.random() < 0.5 ? answer : random(["zio", "padre", "fratello", "cugino", "nonno"].filter((value) => value !== answer));
      const correct = statementAnswer === answer ? "vero" : "falso";
      const names = prompt.match(/^What is (.+) to (.+)\?$/);
      const claim = names ? `${names[1]} is ${names[2]}'s ${statementAnswer}.` : `The relationship is ${statementAnswer}.`;
      const question = baseQuestion("Family Tree Practice", `tree-${tree.id}:${qIndex}`, `u3-tree:${tree.id}:${qIndex}:tf`, "Read the family tree and choose vero or falso",
        `${tree.text}\n\n${claim}`, correct,
        `The relationship is ${answer}, so the claim is ${correct}.`, ["vero", "falso"]);
      question.isDialogue = true;
      question.forceChoice = true;
      return question;
    }
    const question = baseQuestion("Family Tree Practice", `tree-${tree.id}:${qIndex}`, `u3-tree:${tree.id}:${qIndex}`, "Reason from the family tree",
      `${tree.text}\n\n${prompt}`, answer, `Follow the generations and connections: the answer is ${answer}.`,
      ["padre", "madre", "fratello", "sorella", "nonno", "nonna", "zio", "zia", "cugino", "nipote"].filter((value) => value !== answer));
    question.isDialogue = true;
    return question;
  }

  function verbVocabularyQuestion(category, sourceId, direction) {
    const pool = category === "-ERE Verb Vocabulary" ? ERE : category === "-IRE + -ISC Verb Vocabulary" ? ISC : IRE;
    const item = choose(pool, sourceId);
    const toEnglish = directionToEnglish(direction);
    const answer = toEnglish ? item.english : item.infinitive;
    const iscLookalikes = {
      finire: ["sentire", "partire", "capire"], capire: ["finire", "aprire", "partire"],
      preferire: ["servire", "offrire", "finire"], pulire: ["finire", "partire", "capire"],
      restituire: ["servire", "seguire", "sentire"], spedire: ["spendere", "partire", "servire"]
    };
    const distractorPool = category === "-IRE + -ISC Verb Vocabulary"
      ? (iscLookalikes[item.id] || []).map((id) => VERBS.find((entry) => entry.id === id)).filter(Boolean)
      : pool.filter((candidate) => candidate.id !== item.id);
    const question = baseQuestion(category, item.id, `u3-verb-vocab:${item.id}:${toEnglish ? "en" : "it"}`,
      toEnglish ? "Translate the infinitive into English" : "Give the Italian infinitive",
      toEnglish ? item.infinitive : item.english, answer, `${item.infinitive} means “${item.english}.” This topic tests meaning only.`,
      distractorPool.map((candidate) => toEnglish ? candidate.english : candidate.infinitive),
      toEnglish ? splitMeanings(item.english) : [item.infinitive]);
    question.isVocabularyTranslation = true;
    question.translationDirection = toEnglish ? "it-en" : "en-it";
    return question;
  }

  function conjugationQuestion(category, sourceId) {
    let pool = category === "Regular -ERE Verbs" ? ERE : category === "Regular -IRE Verbs" ? IRE : category === "-IRE Verbs with -ISC" ? ISC : VERBS;
    const sourceVerb = sourceId?.replace(/^context-/, "").split(":")[0];
    const item = pool.find((entry) => entry.id === sourceId || entry.id === sourceVerb) || random(pool);
    const relevantContexts = VERB_CONTEXTS.filter((context) => context.verbId === item.id);
    const useContext = relevantContexts.length && Math.random() < 0.62;
    const context = useContext ? random(relevantContexts) : null;
    const subject = context?.subject || random(SUBJECTS);
    const answer = item.forms[subject];
    const pattern = item.conjugationType === "ire-isc" ? "-IRE + -ISC" : item.conjugationType === "ire-regular" ? "regular -IRE" : "-ERE";
    const explanation = item.conjugationType === "ire-isc" && ["noi", "voi"].includes(subject)
      ? `${item.infinitive} is an -isc verb, but ${subject.toUpperCase()} does not use -isc: ${answer}.`
      : `${item.infinitive} follows the ${pattern} pattern: ${subject} → ${answer}.`;
    return baseQuestion(category, item.id, `u3-conjugation:${item.id}:${subject}:${useContext}`, context ? `Complete with ${item.infinitive}` : `Conjugate ${item.infinitive}`,
      context?.prompt || `${subject} + ${item.infinitive}`, answer, explanation,
      [...new Set([...Object.values(item.forms), ...pool.map((verbItem) => verbItem.forms[subject])])].filter((form) => form !== answer));
  }

  function possessiveAdjectiveQuestion(sourceId) {
    const possessor = POSSESSIVES[sourceId?.split(":")[0]] ? sourceId.split(":")[0] : random(Object.keys(POSSESSIVES));
    const noun = possessedNouns.find((item) => item.id === sourceId?.split(":")[1]) || random(possessedNouns);
    const answer = POSSESSIVES[possessor][noun.key];
    return baseQuestion("Possessive Adjectives", `${possessor}:${noun.id}`, `u3-poss-adj:${possessor}:${noun.id}`,
      "Choose the possessive that agrees with the thing possessed", `___ ${noun.noun} (${OWNER_LABELS[possessor]})`, answer,
      `“${OWNER_LABELS[possessor]}” tells you WHO owns it, but the article and ending agree with WHAT is owned. ${noun.noun} = ${KEY_LABELS[noun.key]}. Therefore: ${answer} ${noun.noun}.`,
      samePossessorForms(possessor).filter((value) => value !== answer));
  }

  function familyPossessiveQuestion(sourceId) {
    const item = choose(FAMILY_POSSESSIVE, sourceId);
    const fullForms = samePossessorForms(item.possessor);
    const genderMateKey = item.key.startsWith("m") ? item.key.replace("m", "f") : item.key.replace("f", "m");
    const distractors = item.rule === "singular"
      ? [withoutArticle(POSSESSIVES[item.possessor][genderMateKey]), POSSESSIVES[item.possessor][item.key], POSSESSIVES[item.possessor][genderMateKey]]
      : fullForms.filter((value) => value !== item.answer);
    const explanation = item.rule === "singular"
      ? `${item.noun} = ${KEY_LABELS[item.key]}, so use ${item.answer}. Because it is one unmodified family member, omit the definite article: ${item.answer} ${item.noun}.`
      : item.rule === "plural"
        ? `${item.noun} = ${KEY_LABELS[item.key]}. Plural family members keep the definite article, so use ${item.answer} ${item.noun}.`
        : item.rule === "loro"
          ? `${item.noun} = ${KEY_LABELS[item.key]}. With loro, keep the definite article: ${item.answer} ${item.noun}.`
          : `${item.noun} is modified, so it keeps the definite article: ${item.answer} ${item.noun}.`;
    return baseQuestion("Possessives with Family Members", item.id, `u3-family-poss:${item.id}`, "Complete the family possessive: article or no article?",
      item.prompt, item.answer, explanation, distractors);
  }

  function possessivePronounQuestion(sourceId) {
    const prompts = [
      ["our-invitation", "Tutti hanno un invito. Quando arriva ___?", "nostro", "ms", "invito is masculine singular"],
      ["formal-map", "Ecco la mia mappa. Signora, dov'è ___?", "suo", "fs", "mappa is feminine singular"],
      ["their-book", "Io ho il mio libro. Antonio e Isabella hanno ___.", "loro", "ms", "libro is masculine singular"],
      ["my-letters", "Queste non sono le tue lettere. Sono ___!", "mio", "fp", "lettere is feminine plural"]
    ].map(([id, prompt, possessor, key, reason]) => ({ id: `pronoun-${id}`, prompt, possessor, key, reason, answer: POSSESSIVES[possessor][key] }));
    const item = choose(prompts, sourceId);
    return baseQuestion("Possessive Pronouns", item.id, `u3-${item.id}`, "Replace the omitted noun with a possessive pronoun", item.prompt, item.answer,
      `The noun is omitted, but its gender and number remain: ${item.reason}, so use ${item.answer}.`,
      samePossessorForms(item.possessor).filter((value) => value !== item.answer));
  }

  function possessiveDiQuestion(sourceId) {
    const prompts = [
      ["agenda", "Di chi è l'agendina? È l'agendina ___ Valerio.", "di", "Use di before a person's name."],
      ["notebooks", "Di chi sono i quaderni? Sono i quaderni ___ Giuseppe.", "di", "Use di before a person's name."],
      ["teacher", "È il libro ___ professore.", "del", "di + il contracts to del."],
      ["girls", "Sono le lettere ___ ragazze.", "delle", "di + le contracts to delle."],
      ["whose-singular", "___ la mappa?", "Di chi è", "Use Di chi è? for one singular object."],
      ["whose-plural", "___ i quaderni?", "Di chi sono", "Use Di chi sono? for plural objects."]
    ].map(([id, prompt, answer, reason]) => ({ id: `di-${id}`, prompt, answer, reason }));
    const item = choose(prompts, sourceId);
    return baseQuestion("Possessives with DI", item.id, `u3-${item.id}`, "Complete the possessive with di", item.prompt, item.answer, item.reason,
      ["di", "del", "dello", "della", "dei", "degli", "delle", "Di chi è", "Di chi sono"].filter((value) => value !== item.answer));
  }

  function mixedPossessiveQuestion(sourceId) {
    const mixed = [
      ["whose-film", "Ciao Carlo! ___ il film?", "Di chi è", "Ask Di chi è? because film is singular."],
      ["director", "È il nuovo film ___ un regista italiano.", "di", "Use di before an indefinite noun phrase."],
      ["his-films", "___ film sono sempre divertenti. (his)", "I suoi", "Film is plural here, so use i suoi."],
      ["younger-brother", "Va bene se ___ fratello minore viene con noi? (my)", "il mio", "The modified family term keeps the article."],
      ["my-mother", "___ madre lavora stasera. (my)", "Mia", "A singular, unmodified family member omits the article."],
      ["your-brother", "Conosco bene ___ fratello. (your)", "tuo", "A singular, unmodified family member omits the article."],
      ["your-parents", "A proposito dei ___, come stanno? (yours, masculine plural)", "tuoi", "After dei, use the possessive form tuoi."],
      ["my-parents", "___ genitori? Molto bene. (my)", "I miei", "Plural family members use the article."]
    ].map(([id, prompt, answer, reason]) => ({ id: `mixed-${id}`, prompt, answer, reason }));
    const item = choose(mixed, sourceId);
    return baseQuestion("Mixed Possessives", item.id, `u3-${item.id}`, "Complete the mixed possessive", item.prompt, item.answer, item.reason,
      mixed.filter((entry) => entry.id !== item.id).map((entry) => entry.answer));
  }

  function cultureQuestion(sourceId) {
    const item = choose(CULTURE, sourceId);
    return baseQuestion("Culture & Recognition", item.id, `u3-${item.id}`, "Choose the course-supported culture fact", item.prompt, item.answer,
      "This is a small recognition item from the Unit 3 course context.", item.options.filter((option) => option !== item.answer));
  }

  function makeQuestion(category, sourceId, unit1Data, vocabularyDirection = "mixed") {
    if (["Core Family Vocabulary", "Extended Family Vocabulary"].includes(category)) return vocabularyQuestion(category, sourceId, vocabularyDirection);
    if (category === "Family Relationships / Status") return relationshipQuestion(sourceId);
    if (category === "Family Tree Practice") return familyTreeQuestion(sourceId);
    if (["-ERE Verb Vocabulary", "-IRE Verb Vocabulary", "-IRE + -ISC Verb Vocabulary"].includes(category)) return verbVocabularyQuestion(category, sourceId, vocabularyDirection);
    if (["Regular -ERE Verbs", "Regular -IRE Verbs", "-IRE Verbs with -ISC", "Mixed -ERE / -IRE Conjugation"].includes(category)) return conjugationQuestion(category, sourceId);
    if (category === "Possessive Adjectives") return possessiveAdjectiveQuestion(sourceId);
    if (category === "Possessives with Family Members") return familyPossessiveQuestion(sourceId);
    if (category === "Possessive Pronouns") return possessivePronounQuestion(sourceId);
    if (category === "Possessives with DI") return possessiveDiQuestion(sourceId);
    if (category === "Mixed Possessives") return mixedPossessiveQuestion(sourceId);
    return cultureQuestion(sourceId);
  }

  function makeMatchingQuestion(category) {
    let pairs;
    if (CATEGORY_POOLS[category]) pairs = shuffle(CATEGORY_POOLS[category]).slice(0, 5).map((item) => ({ left: item.italian, right: item.english }));
    else {
      const pool = category === "Regular -ERE Verbs" ? ERE : category === "Regular -IRE Verbs" ? IRE : ISC;
      pairs = shuffle(pool).slice(0, 5).map((item) => ({ left: item.infinitive, right: item.english }));
    }
    return { type: "matching", category, sourceId: `matching:${category}`, id: `u3-matching:${category}:${pairs.map((pair) => pair.left).join("-")}`,
      kicker: "Match the pairs", display: category, pairs, explanation: "Review each Unit 3 pair once more before continuing." };
  }

  const LEARN_CARDS = {
    "Regular -ERE Verbs": { title: "Regular -ERE", rule: "Remove -ere and add the ending that matches the subject.", chart: [["io", "-o · vivo"], ["tu", "-i · vivi"], ["lui/lei/Lei", "-e · vive"], ["noi", "-iamo · viviamo"], ["voi", "-ete · vivete"], ["loro", "-ono · vivono"]], examples: ["Io vivo a Venezia.", "Loro leggono molti libri.", "Noi scriviamo una lettera."], mistake: "Do not use the infinitive ending after the subject: noi viviamo, not noi vivere.", tryOne: "Voi ___ a Roma. (vivere)", tryAnswer: "vivete" },
    "Regular -IRE Verbs": { title: "Regular -IRE", rule: "Remove -ire and add -o, -i, -e, -iamo, -ite, -ono. Only the VOI ending differs from -ERE.", chart: [["io", "-o · parto"], ["tu", "-i · parti"], ["lui/lei/Lei", "-e · parte"], ["noi", "-iamo · partiamo"], ["voi", "-ite · partite"], ["loro", "-ono · partono"]], examples: ["A che ora parte il treno?", "Noi offriamo il caffè.", "Voi aprite i libri."], mistake: "Use voi partite, not partete. -IRE uses -ite for VOI.", tryOne: "Loro ___ alle otto. (partire)", tryAnswer: "partono" },
    "-IRE + -ISC Verb Vocabulary": { title: "-IRE + -ISC Verb Vocabulary", rule: "Learn what these six verbs mean first. These are -IRE verbs that use the -isc pattern when conjugated.", chart: [["finire", "to finish"], ["capire", "to understand"], ["preferire", "to prefer"], ["pulire", "to clean"], ["restituire", "to return / give back"], ["spedire", "to send"]], examples: ["finire → to finish", "to understand → capire", "spedire → to send"], mistake: "Do not conjugate here—the default vocabulary topic tests infinitive meanings only.", tryOne: "to clean →", tryAnswer: "pulire", action: { label: "Practice conjugations →", topic: "-IRE Verbs with -ISC" } },
    "-IRE Verbs with -ISC": { title: "-IRE Verbs with -ISC", rule: "Add -isc- with IO, TU, LUI/LEI/LEI FORMAL, and LORO. Do not add it with NOI or VOI.", chart: [["io ✓", "finisco"], ["tu ✓", "finisci"], ["lui/lei ✓", "finisce"], ["noi ✗", "finiamo"], ["voi ✗", "finite"], ["loro ✓", "finiscono"]], examples: ["Io capisco.", "Noi capiamo.", "Loro preferiscono la storia."], mistake: "❌ noi finisciamo  ✓ noi finiamo", tryOne: "Loro ___ alle sei. (finire)", tryAnswer: "finiscono", action: { label: "Review meanings →", topic: "-IRE + -ISC Verb Vocabulary" } },
    "Possessive Adjectives": { title: "Possessive Adjectives", rule: "The possessive agrees with the THING POSSESSED, not the owner.", chart: [["my", "il mio · la mia · i miei · le mie"], ["your", "il tuo · la tua · i tuoi · le tue"], ["his/her", "il suo · la sua · i suoi · le sue"], ["our", "il nostro · la nostra · i nostri · le nostre"], ["your plural", "il vostro · la vostra · i vostri · le vostre"], ["their", "il loro · la loro · i loro · le loro"]], examples: ["Marco: il suo libro", "Marco: la sua sedia", "Marco: le sue automobili"], mistake: "The owner's gender does not choose mio/mia or suo/sua; the possessed noun does.", tryOne: "Marco ha una sedia: ___ sedia", tryAnswer: "la sua" },
    "Possessives with Family Members": { title: "Possessives with Family", rule: "One singular, unmodified family member normally omits the article. Plural, modified, and loro family phrases keep it.", chart: [["singular", "mio padre · mia madre"], ["plural", "i miei genitori · le mie sorelle"], ["modified", "il mio fratello minore"], ["loro", "il loro nipote"]], examples: ["mia sorella", "i tuoi genitori", "il mio fratello minore", "il loro nipote"], mistake: "Do not remove the article from every family phrase. Check number, modifiers, and loro.", tryOne: "___ genitori stanno bene. (my)", tryAnswer: "i miei" },
    "Possessive Pronouns": { title: "Possessive Pronouns", rule: "A possessive adjective modifies a noun; a possessive pronoun replaces it. The omitted noun still controls gender and number.", chart: [["book", "il mio → mine"], ["map", "la mia → mine"], ["books", "i miei → mine"], ["letters", "le mie → mine"]], examples: ["Il mio libro è blu. Il tuo è rosso.", "Queste lettere sono le mie."], mistake: "Do not choose the form from the owner; use the omitted noun's gender and number.", tryOne: "La mia mappa è qui. Dov'è ___? (yours)", tryAnswer: "la tua" },
    "Possessives with DI": { title: "Possessives with DI", rule: "Use di for belonging. Ask Di chi è? for one thing and Di chi sono? for plural things.", chart: [["di + il", "del"], ["di + lo", "dello"], ["di + la", "della"], ["di + i", "dei"], ["di + gli", "degli"], ["di + le", "delle"]], examples: ["il libro di Antonio", "Di chi è l'agendina?", "Di chi sono i quaderni?"], mistake: "Use è with a singular object and sono with plural objects.", tryOne: "___ i quaderni?", tryAnswer: "Di chi sono" }
  };

  const VOCABULARY = [
    ...FAMILY,
    ...VERBS.map((item) => ({ ...item, italian: item.infinitive, groups: [item.conjugationType, "verbs"], verbType: item.conjugationType === "ere" ? "-ERE" : item.conjugationType === "ire-regular" ? "regular -IRE" : "-IRE + ISC" })),
    ...Object.entries(POSSESSIVES).map(([id, chart]) => ({ id: `possessive-${id}`, italian: Object.values(chart).join(" · "), english: `${id} possessive forms`, groups: ["possessives"], tag: "Possessives" }))
  ];

  window.UNIT3_DATA = {
    id: "unit3", label: "Unit 3", categories: CATEGORIES, topics: TOPICS, defaultTopics: PRESETS.priority,
    topicGroups: TOPIC_GROUPS, presets: PRESETS, presetLabels: PRESET_LABELS, matchingCategories: MATCHING_CATEGORIES,
    vocabulary: VOCABULARY, family: FAMILY, verbs: VERBS, ereVerbs: ERE, ireVerbs: IRE, iscVerbs: ISC,
    possessives: POSSESSIVES, learnCards: LEARN_CARDS, familyTrees: FAMILY_TREES,
    vocabularyFilters: [["all", "All Unit 3"], ["family-core", "Family — Core"], ["family-extended", "Family — Extended"],
      ["family-relationships", "Family — Relationships"], ["ere", "-ERE Verbs"], ["ire-regular", "Regular -IRE Verbs"],
      ["ire-isc", "-IRE + -ISC Verbs"], ["possessives", "Possessives"]],
    expandTopics(topics) { return [...new Set(topics)].filter((topic) => CATEGORIES.includes(topic)); },
    migrateTopics(topics) { return [...new Set(topics)].filter((topic) => TOPICS.includes(topic)); },
    makeQuestion, makeMatchingQuestion,
    isSourceEligible(category) { return CATEGORIES.includes(category); }
  };
})();
