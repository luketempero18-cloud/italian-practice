(() => {
  "use strict";

  const four = (id, english, groups, opposites = []) => ({
    id, italian: id, english, groups, family: "fourEnding", opposites,
    forms: { ms: id, fs: `${id.slice(0, -1)}a`, mp: `${id.slice(0, -1)}i`, fp: `${id.slice(0, -1)}e` }
  });
  const two = (id, english, groups, opposites = []) => ({
    id, italian: id, english, groups, family: "twoEnding", opposites,
    forms: { ms: id, fs: id, mp: `${id.slice(0, -1)}i`, fp: `${id.slice(0, -1)}i` }
  });
  const ista = (id, english, groups, opposites = []) => ({
    id, italian: id, english, groups, family: "ista", opposites,
    forms: { ms: id, fs: id, mp: `${id.slice(0, -1)}i`, fp: `${id.slice(0, -1)}e` }
  });
  const invariant = (id, english, groups) => ({
    id, italian: id, english, groups, family: "invariant",
    forms: { ms: id, fs: id, mp: id, fp: id }
  });

  const PERSONALITY = [
    four("simpatico", "nice / likeable", ["personality"], ["antipatico"]),
    four("antipatico", "unpleasant / unlikeable", ["personality"], ["simpatico"]),
    two("divertente", "fun / funny / entertaining", ["personality"], ["serio"]),
    four("serio", "serious", ["personality"], ["divertente"]),
    four("generoso", "generous", ["personality"], ["tirchio"]),
    four("tirchio", "stingy", ["personality"], ["generoso"]),
    two("paziente", "patient", ["personality"], ["impaziente"]),
    two("impaziente", "impatient", ["personality"], ["paziente"]),
    four("estroverso", "outgoing / extroverted", ["personality"], ["timido"]),
    four("timido", "shy", ["personality"], ["estroverso"]),
    ista("ottimista", "optimistic", ["personality"], ["pessimista"]),
    ista("pessimista", "pessimistic", ["personality"], ["ottimista"]),
    ista("altruista", "altruistic / selfless", ["personality"], ["egoista"]),
    ista("egoista", "selfish", ["personality"], ["altruista"]),
    four("sportivo", "athletic / sporty", ["personality"], ["pigro"]),
    four("pigro", "lazy", ["personality"], ["sportivo"]),
    four("bravo", "good / capable", ["personality"], ["cattivo"]),
    four("cattivo", "bad", ["personality"], ["bravo"]),
    four("bello", "beautiful / handsome / nice", ["personality", "appearance"], ["brutto"]),
    four("brutto", "ugly / bad-looking", ["personality", "appearance"], ["bello"]),
    two("felice", "happy", ["personality"], ["triste"]),
    four("allegro", "cheerful", ["personality"], ["triste"]),
    two("triste", "sad", ["personality"], ["felice", "allegro"]),
    two("intelligente", "intelligent", ["personality"], ["stupido"]),
    four("stupido", "stupid", ["personality"], ["intelligente"]),
    two("facile", "easy", ["personality"], ["difficile"]),
    two("difficile", "difficult", ["personality"], ["facile"]),
    two("interessante", "interesting", ["personality"], ["noioso"]),
    four("noioso", "boring", ["personality"], ["interessante"]),
    two("gentile", "kind / polite", ["personality"]),
    two("sensibile", "sensitive", ["personality"]),
    two("responsabile", "responsible", ["personality"]),
    two("elegante", "elegant", ["personality"]),
    four("creativo", "creative", ["personality"]),
    ista("realista", "realistic / realist", ["personality"])
  ];

  const APPEARANCE = [
    four("alto", "tall", ["appearance"], ["basso"]),
    four("basso", "short", ["appearance"], ["alto"]),
    four("magro", "thin", ["appearance"], ["grasso"]),
    four("grasso", "fat", ["appearance"], ["magro"]),
    two("grande", "big / large", ["appearance"], ["piccolo"]),
    four("piccolo", "small", ["appearance"], ["grande"]),
    two("giovane", "young", ["appearance"], ["anziano"]),
    four("anziano", "elderly / old", ["appearance"], ["giovane"]),
    four("carino", "cute", ["appearance"]),
    four("biondo", "blond", ["appearance"]),
    four("bruno", "dark-haired / brunette", ["appearance"]),
    four("castano", "brown-haired / brown", ["appearance"]),
    four("calvo", "bald", ["appearance"])
  ];

  const AGREEMENT_ONLY = [
    four("nuovo", "new", ["agreement"]), four("vecchio", "old", ["agreement"]),
    two("veloce", "fast", ["agreement"])
  ];

  const COLORS = [
    four("rosso", "red", ["colors"]),
    { ...four("bianco", "white", ["colors"]), forms: { ms: "bianco", fs: "bianca", mp: "bianchi", fp: "bianche" } },
    two("verde", "green", ["colors"]), four("giallo", "yellow", ["colors"]),
    four("nero", "black", ["colors"]), invariant("blu", "blue", ["colors"]),
    invariant("viola", "purple", ["colors"]), two("arancione", "orange", ["colors"]),
    invariant("rosa", "pink", ["colors"]), four("azzurro", "light blue / blue", ["colors"])
  ];

  const NATIONALITIES = [
    four("italiano", "Italian", ["nationalities"]),
    two("inglese", "English", ["nationalities"]),
    four("spagnolo", "Spanish", ["nationalities"]),
    two("cinese", "Chinese", ["nationalities"]),
    two("giapponese", "Japanese", ["nationalities"]),
    { ...four("tedesco", "German", ["nationalities"]), forms: { ms: "tedesco", fs: "tedesca", mp: "tedeschi", fp: "tedesche" } },
    four("messicano", "Mexican", ["nationalities"]),
    two("francese", "French", ["nationalities"]),
    four("americano", "American", ["nationalities"]),
    four("arabo", "Arab / Arabian", ["nationalities"]),
    four("straniero", "foreign / foreigner", ["nationalities"])
  ];

  const PHRASES = [
    ["i-capelli", "i capelli", "hair", "appearance"],
    ["capelli-corti", "capelli corti", "short hair", "appearance"],
    ["capelli-lunghi", "capelli lunghi", "long hair", "appearance"],
    ["capelli-lisci", "capelli lisci", "straight hair", "appearance"],
    ["capelli-ricci", "capelli ricci", "curly hair", "appearance"],
    ["ha-capelli-corti", "ha i capelli corti", "has short hair", "appearance"],
    ["ha-capelli-lunghi", "ha i capelli lunghi", "has long hair", "appearance"],
    ["ha-capelli-lisci", "ha i capelli lisci", "has straight hair", "appearance"],
    ["ha-capelli-ricci", "ha i capelli ricci", "has curly hair", "appearance"],
    ["ha-barba", "ha la barba", "has a beard", "appearance"],
    ["ha-baffi", "ha i baffi", "has a mustache", "appearance"],
    ["gli-occhi", "gli occhi", "eyes", "appearance"],
    ["occhi-azzurri", "occhi azzurri", "blue eyes", "appearance"],
    ["come-capelli", "Come ha i capelli?", "What is his/her hair like?", "appearance"],
    ["come-occhi", "Come ha gli occhi?", "What are his/her eyes like?", "appearance"],
    ["di-che-colore", "Di che colore sono...?", "What color are...?", "appearance"]
  ].map(([id, italian, english, group]) => ({ id, italian, english, groups: [group] }));

  const SCHOOL = [
    ["classe", "class / classroom"], ["lezione", "lesson / class"], ["università", "university"],
    ["studente", "student"], ["studentessa", "female student"], ["professore", "professor"],
    ["professoressa", "female professor"], ["esame", "exam"], ["libro", "book"], ["letteratura", "literature"]
  ].map(([italian, english]) => ({ id: `school-${italian}`, italian, english, groups: ["school"] }));

  const AVERE_EXPRESSIONS = [
    ["avere-fame", "avere fame", "to be hungry"], ["avere-sete", "avere sete", "to be thirsty"],
    ["avere-freddo", "avere freddo", "to be cold"], ["avere-sonno", "avere sonno", "to be sleepy"],
    ["avere-fretta", "avere fretta", "to be in a hurry"], ["avere-paura", "avere paura", "to be afraid"],
    ["avere-paura-di", "avere paura di", "to be afraid of"], ["avere-bisogno", "avere bisogno di", "to need"],
    ["avere-ragione", "avere ragione", "to be right"], ["avere-torto", "avere torto", "to be wrong"],
    ["avere-pazienza", "avere pazienza", "to be patient"], ["avere-anni", "avere ___ anni", "to be ___ years old"]
  ].map(([id, italian, english]) => ({ id, italian, english, groups: ["avere"] }));

  const ADJECTIVES = [...PERSONALITY, ...APPEARANCE, ...AGREEMENT_ONLY, ...COLORS, ...NATIONALITIES]
    .filter((item, index, array) => array.findIndex((candidate) => candidate.id === item.id) === index)
    .map((item) => {
      const mergedGroups = [...PERSONALITY, ...APPEARANCE, ...AGREEMENT_ONLY, ...COLORS, ...NATIONALITIES]
        .filter((candidate) => candidate.id === item.id).flatMap((candidate) => candidate.groups);
      return { ...item, groups: [...new Set(mergedGroups)] };
    });

  const VOCABULARY = [...ADJECTIVES, ...PHRASES, ...SCHOOL, ...AVERE_EXPRESSIONS].map((item) => ({
    ...item,
    tag: item.groups.includes("personality") ? "Personality" : item.groups.includes("appearance") ? "Physical Appearance" :
      item.groups.includes("colors") ? "Colors" : item.groups.includes("nationalities") ? "Nationalities" :
        item.groups.includes("school") ? "School / Class" : item.groups.includes("avere") ? "Avere Expressions" : "Adjective Agreement"
  }));

  const CATEGORIES = [
    "Personality Adjectives", "Physical Appearance", "Colors", "Nationalities", "School / Class Vocabulary", "Avere Expressions",
    "Adjective Opposites", "Adjective Agreement", "Bello & Buono", "-issimo", "Piacere", "Avere", "Avere Idioms", "Culture / Reading"
  ];
  const TOPIC_GROUPS = [
    { name: "Vocabulary", topics: [
      ["Personality Adjectives", "Traits and descriptions"], ["Physical Appearance", "Appearance and hair"],
      ["Colors", "Color vocabulary"], ["Nationalities", "Vocabulary + agreement"],
      ["School / Class Vocabulary", "Course words"], ["Avere Expressions", "Common expressions"]
    ] },
    { name: "Grammar / usage", topics: [
      ["Adjective Opposites", "Supported opposite pairs"], ["Adjective Agreement", "Four-ending, two-ending, -ista"],
      ["Bello & Buono", "Forms before nouns"], ["-issimo", "Very / extremely"],
      ["Piacere", "Piace vs piacciono"], ["Avere", "Conjugation"], ["Avere Idioms", "Contextual expressions"]
    ] },
    { name: "Optional course material", topics: [["Culture / Reading", "Puglia and Campania"]] }
  ];
  const PRESETS = {
    vocabulary: CATEGORIES.slice(0, 6),
    adjectives: ["Personality Adjectives", "Physical Appearance", "Colors", "Nationalities", "Adjective Opposites", "Adjective Agreement"],
    grammar: ["Adjective Agreement", "Bello & Buono", "-issimo", "Piacere", "Avere", "Avere Idioms"],
    everything: [...CATEGORIES]
  };
  const MATCHING_CATEGORIES = [
    "Personality Adjectives", "Physical Appearance", "Colors", "Nationalities", "School / Class Vocabulary",
    "Avere Expressions", "Adjective Opposites", "Avere"
  ];

  const CATEGORY_GROUP = {
    "Personality Adjectives": "personality", "Physical Appearance": "appearance", Colors: "colors",
    Nationalities: "nationalities", "School / Class Vocabulary": "school", "Avere Expressions": "avere"
  };
  const FORM_LABELS = { ms: "masculine singular", fs: "feminine singular", mp: "masculine plural", fp: "feminine plural" };
  const random = (items) => items[Math.floor(Math.random() * items.length)];
  const shuffle = (items) => {
    const copy = [...items];
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const swap = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[swap]] = [copy[swap], copy[index]];
    }
    return copy;
  };
  const translations = (value) => [value, ...value.split(" / ")];
  const baseQuestion = (category, sourceId, id, kicker, display, answer, explanation, distractors) => ({
    category, sourceId, id, kicker, display, answer, accepted: [answer], explanation, distractors
  });
  const itemForSource = (pool, sourceId) => pool.find((item) => item.id === sourceId) || random(pool);
  const vocabularyForCategory = (category) => VOCABULARY.filter((item) => item.groups.includes(CATEGORY_GROUP[category]));

  function vocabularyQuestion(category, sourceId) {
    const pool = vocabularyForCategory(category);
    const item = itemForSource(pool, sourceId);
    if (["Physical Appearance", "Colors", "Nationalities"].includes(category) && item.forms && Math.random() < 0.35) {
      const target = random(["ms", "fs", "mp", "fp"]);
      const contexts = category === "Colors"
        ? { ms: "uno zaino ___", fs: "un'automobile ___", mp: "gli zaini ___", fp: "le automobili ___" }
        : { ms: "Il ragazzo è ___", fs: "La ragazza è ___", mp: "I ragazzi sono ___", fp: "Le ragazze sono ___" };
      const answer = item.forms[target];
      const distractors = [...new Set([...Object.values(item.forms), ...shuffle(pool.filter((candidate) => candidate.forms && candidate.id !== item.id).map((candidate) => candidate.forms[target])).slice(0, 4)].filter((form) => form !== answer))];
      const question = baseQuestion(category, item.id, `u2-vocab-agreement:${item.id}:${target}`, "Make the adjective agree",
        `${contexts[target]} (${item.italian})`, answer, `${answer} is the ${FORM_LABELS[target]} form of ${item.italian}.`, distractors);
      question.nounKey = item.id;
      return question;
    }
    const toEnglish = Math.random() < 0.5;
    const distractors = pool.filter((candidate) => candidate.id !== item.id).map((candidate) => toEnglish ? candidate.english : candidate.italian);
    const question = baseQuestion(category, item.id, `u2-vocab:${item.id}:${toEnglish ? "en" : "it"}`,
      toEnglish ? "Translate into English" : "Translate into Italian", toEnglish ? item.italian : item.english,
      toEnglish ? item.english : item.italian, `${item.italian} means “${item.english}.”`, distractors);
    question.accepted = toEnglish ? translations(item.english) : [item.italian];
    question.nounKey = item.id;
    return question;
  }

  function oppositePairs() {
    const pairs = [];
    const seen = new Set();
    ADJECTIVES.forEach((item) => (item.opposites || []).forEach((opposite) => {
      const other = ADJECTIVES.find((candidate) => candidate.id === opposite);
      const key = [item.id, opposite].sort().join("|");
      if (other && !seen.has(key)) { seen.add(key); pairs.push({ left: item, right: other }); }
    }));
    return pairs;
  }

  function oppositeQuestion(sourceId) {
    const pool = ADJECTIVES.filter((item) => item.opposites?.length);
    const item = itemForSource(pool, sourceId);
    const answer = random(item.opposites);
    const contextual = Math.random() < 0.45;
    const display = contextual ? `Paolo è ${item.forms.ms}. Dolores says the opposite: Paolo è ___.` : item.italian;
    const question = baseQuestion("Adjective Opposites", item.id, `u2-opposite:${item.id}:${contextual}`,
      contextual ? "Complete with the opposite adjective" : "Give the Italian opposite", display, answer,
      `${answer} is the course-supported opposite of ${item.italian}.`, pool.filter((candidate) => ![item.id, answer].includes(candidate.id)).map((candidate) => candidate.italian));
    question.nounKey = item.id;
    return question;
  }

  function agreementQuestion(sourceId) {
    const pool = ADJECTIVES.filter((item) => item.forms && item.family !== "invariant");
    const adjective = itemForSource(pool, sourceId);
    const target = random(["ms", "fs", "mp", "fp"]);
    const context = {
      ms: "Paolo è un ragazzo ___", fs: "Marta è una ragazza ___", mp: "Paolo e Marco sono ___", fp: "Marta e Dolores sono ___"
    }[target];
    const mixedGroup = target === "mp" && Math.random() < 0.25;
    const contextual = Math.random() < 0.55;
    const display = mixedGroup ? `Aldo e Maria sono ___ (${adjective.italian})` : contextual ? `${context} (${adjective.italian})` : `${adjective.forms.ms} → ${FORM_LABELS[target]}`;
    const answer = adjective.forms[target];
    const otherForms = ADJECTIVES.filter((item) => item.id !== adjective.id && item.forms).map((item) => item.forms[target]);
    const question = baseQuestion("Adjective Agreement", adjective.id, `u2-agreement:${adjective.id}:${target}:${contextual}:${mixedGroup}`,
      mixedGroup ? "Use the mixed-gender group rule" : contextual ? "Make the adjective agree" : "Transform the adjective",
      display, answer, `${adjective.italian} is a ${adjective.family === "fourEnding" ? "four-ending" : adjective.family === "ista" ? "-ista" : "two-ending"} adjective; ${FORM_LABELS[target]} is ${answer}.`,
      [...new Set([...Object.values(adjective.forms), ...shuffle(otherForms).slice(0, 4)].filter((form) => form !== answer))]);
    question.nounKey = adjective.id;
    return question;
  }

  function belloForm(noun, plural) {
    if (noun.gender === "feminine") return plural ? "belle" : noun.definiteSingular === "l'" ? "bell'" : "bella";
    if (plural) return noun.definitePlural === "gli" ? "begli" : "bei";
    return noun.definiteSingular === "lo" ? "bello" : noun.definiteSingular === "l'" ? "bell'" : "bel";
  }

  function buonoForm(noun, plural) {
    if (noun.gender === "feminine") return plural ? "buone" : noun.definiteSingular === "l'" ? "buon'" : "buona";
    return plural ? "buoni" : noun.indefinite === "uno" ? "buono" : "buon";
  }

  function belloBuonoQuestion(sourceId, unit1Data) {
    const nouns = unit1Data.nouns.filter((noun) => !noun.context);
    const requestedNounId = sourceId?.split(":")[1];
    const noun = nouns.find((item) => item.id === requestedNounId) || random(nouns);
    const kind = sourceId?.startsWith("buono:") ? "buono" : sourceId?.startsWith("bello:") ? "bello" : Math.random() < 0.5 ? "bello" : "buono";
    const plural = Math.random() < 0.45;
    const word = plural ? noun.plural : noun.singular;
    const answer = kind === "bello" ? belloForm(noun, plural) : buonoForm(noun, plural);
    const blank = answer.endsWith("'") ? `___${word}` : `___ ${word}`;
    const display = kind === "bello" ? `Che ${blank}!` : blank;
    const options = kind === "bello" ? ["bel", "bello", "bell'", "bella", "bei", "begli", "belle"] : ["buono", "buon", "buon'", "buona", "buoni", "buone"];
    return baseQuestion("Bello & Buono", `${kind}:${noun.id}`, `u2-${kind}:${noun.id}:${plural}`, `Complete with the correct form of ${kind}`,
      display, answer, `${answer} agrees with ${word} in gender, number, and initial-sound pattern.`, options.filter((option) => option !== answer));
  }

  const ISSIMO = [
    ["bellissimo", "molto bello"], ["difficilissimo", "molto difficile"], ["bravissimi", "molto bravi"],
    ["generosissime", "molto generose"], ["pigrissimo", "molto pigro"], ["severissime", "molto severe"]
  ].map(([intensive, molto]) => ({ id: intensive, intensive, molto }));

  function issimoQuestion(sourceId) {
    const item = itemForSource(ISSIMO, sourceId);
    const expand = Math.random() < 0.5;
    return baseQuestion("-issimo", item.id, `u2-issimo:${item.id}:${expand}`, expand ? "Rewrite using molto" : "Rewrite using -issimo",
      expand ? item.intensive : item.molto, expand ? item.molto : item.intensive,
      `${item.intensive} and ${item.molto} are equivalent, with matching gender and number.`,
      ISSIMO.filter((candidate) => candidate.id !== item.id).map((candidate) => expand ? candidate.molto : candidate.intensive));
  }

  const PIACERE_PHRASES = [
    ["gelato", "il gelato", false], ["zaini", "gli zaini blu", true], ["universita", "un'università grande", false],
    ["citta", "le piccole città", true], ["motociclette", "le motociclette", true], ["capelli", "i capelli biondi", true],
    ["letteratura", "la letteratura", false], ["libri", "i libri interessanti", true]
  ].map(([id, phrase, plural]) => ({ id, phrase, plural }));

  function piacereQuestion(sourceId) {
    const item = itemForSource(PIACERE_PHRASES, sourceId);
    const lead = random(["Mi", "Ti", "Non mi", "Non ti"]);
    const answer = item.plural ? "piacciono" : "piace";
    return baseQuestion("Piacere", item.id, `u2-piacere:${item.id}:${lead}`, "Choose piace or piacciono",
      `${lead} ___ ${item.phrase}.`, answer, `${answer} is used because ${item.phrase} is ${item.plural ? "plural" : "singular"}.`, ["piace", "piacciono"]);
  }

  const AVERE = [
    ["io", "ho"], ["tu", "hai"], ["lui/lei/Lei", "ha"], ["noi", "abbiamo"], ["voi", "avete"], ["loro", "hanno"]
  ].map(([subject, form]) => ({ id: subject, subject, form }));
  const AVERE_CONTEXTS = {
    io: "Io ___ fame.", tu: "Tu ___ bisogno di un caffè.", "lui/lei/Lei": "Dolores ___ un'automobile rossa.",
    noi: "Noi ___ amici intelligenti.", voi: "Voi ___ uno zaino verde.", loro: "Loro ___ lezione oggi."
  };

  function avereQuestion(sourceId) {
    const row = itemForSource(AVERE, sourceId);
    const contextual = Math.random() < 0.65;
    return baseQuestion("Avere", row.id, `u2-avere:${row.id}:${contextual}`, contextual ? "Complete with the correct form of avere" : "Conjugate avere",
      contextual ? AVERE_CONTEXTS[row.subject] : `${row.subject} + avere`, row.form, `${row.subject} takes ${row.form}.`,
      AVERE.filter((candidate) => candidate.id !== row.id).map((candidate) => candidate.form));
  }

  const IDIOMS = [
    ["freddo", "Brrr! Noi ___.", "abbiamo freddo"], ["sete", "Desideri un bicchiere d'acqua? Sì, io ___.", "ho sete"],
    ["paura", "Oggi c'è l'esame di italiano e gli studenti ___.", "hanno paura"],
    ["torto", "Voi dite che oggi è sabato, ma oggi è domenica. Voi ___.", "avete torto"],
    ["fame", "Marco desidera un panino perché ___.", "ha fame"], ["sonno", "È mezzanotte. Io ___.", "ho sonno"],
    ["fretta", "La lezione comincia fra un minuto. Tu ___.", "hai fretta"], ["ragione", "Loro dicono che Roma è in Italia. Loro ___.", "hanno ragione"],
    ["pazienza", "La professoressa aspetta gli studenti: lei ___.", "ha pazienza"], ["anni", "Marta, quanti anni hai? Io ___.", "ho 21 anni"]
  ].map(([id, prompt, answer]) => ({ id, prompt, answer }));

  function idiomQuestion(sourceId) {
    const item = itemForSource(IDIOMS, sourceId);
    return baseQuestion("Avere Idioms", item.id, `u2-idiom:${item.id}`, "Complete the situation with an avere expression",
      item.prompt, item.answer, `${item.answer} is the expression that fits this context.`, IDIOMS.filter((candidate) => candidate.id !== item.id).map((candidate) => candidate.answer));
  }

  const CULTURE = [
    ["pompei", "What destroyed Pompeii?", "the eruption of Vesuvius", ["the eruption of Vesuvius", "the Trulli of Alberobello", "the city of Bari", "the region of Puglia"]],
    ["trulli", "What are the Trulli of Alberobello?", "houses", ["houses", "volcanoes", "universities", "trains"]],
    ["napoli", "Napoli is in which region?", "Campania", ["Campania", "Puglia", "Lombardia", "Sardegna"]],
    ["bari", "What is the capital city of Puglia?", "Bari", ["Bari", "Napoli", "Pompei", "Milano"]]
  ].map(([id, prompt, answer, options]) => ({ id, prompt, answer, options }));

  function cultureQuestion(sourceId) {
    const item = itemForSource(CULTURE, sourceId);
    return baseQuestion("Culture / Reading", item.id, `u2-culture:${item.id}`, "Choose the course-supported fact", item.prompt,
      item.answer, "This fact comes directly from the stored Unit 2 culture material.", item.options.filter((option) => option !== item.answer));
  }

  function makeQuestion(category, sourceId, unit1Data) {
    if (CATEGORY_GROUP[category]) return vocabularyQuestion(category, sourceId);
    if (category === "Adjective Opposites") return oppositeQuestion(sourceId);
    if (category === "Adjective Agreement") return agreementQuestion(sourceId);
    if (category === "Bello & Buono") return belloBuonoQuestion(sourceId, unit1Data);
    if (category === "-issimo") return issimoQuestion(sourceId);
    if (category === "Piacere") return piacereQuestion(sourceId);
    if (category === "Avere") return avereQuestion(sourceId);
    if (category === "Avere Idioms") return idiomQuestion(sourceId);
    return cultureQuestion(sourceId);
  }

  function makeMatchingQuestion(category) {
    let pairs;
    if (CATEGORY_GROUP[category]) {
      pairs = shuffle(vocabularyForCategory(category)).slice(0, 5).map((item) => ({ left: item.italian, right: item.english }));
    } else if (category === "Adjective Opposites") {
      const selected = [];
      const usedLeft = new Set();
      const usedRight = new Set();
      for (const pair of shuffle(oppositePairs())) {
        if (selected.length >= 5) break;
        if (!usedLeft.has(pair.left.id) && !usedRight.has(pair.right.id)) {
          selected.push(pair);
          usedLeft.add(pair.left.id);
          usedRight.add(pair.right.id);
        }
      }
      pairs = selected.map((pair) => ({ left: pair.left.italian, right: pair.right.italian }));
    } else {
      pairs = shuffle(AVERE).slice(0, 5).map((row) => ({ left: row.subject, right: row.form }));
    }
    return { type: "matching", category, sourceId: `matching:${category}`, id: `u2-matching:${category}:${pairs.map((pair) => pair.left).join("-")}`, kicker: "Match the pairs", display: category, pairs, explanation: "Review each Unit 2 pair once more before continuing." };
  }

  window.UNIT2_DATA = {
    id: "unit2", label: "Unit 2", categories: CATEGORIES, topicGroups: TOPIC_GROUPS, presets: PRESETS,
    matchingCategories: MATCHING_CATEGORIES, vocabulary: VOCABULARY, adjectives: ADJECTIVES,
    vocabularyFilters: [
      ["all", "All"], ["personality", "Personality"], ["appearance", "Physical Appearance"], ["colors", "Colors"],
      ["nationalities", "Nationalities"], ["school", "School / Class"], ["avere", "Avere Expressions"]
    ],
    counts: { vocabulary: VOCABULARY.length, adjectives: ADJECTIVES.length, personality: PERSONALITY.length, opposites: oppositePairs().length, cultureFacts: CULTURE.length },
    makeQuestion, makeMatchingQuestion,
    isSourceEligible(category) { return CATEGORIES.includes(category); }
  };
})();
