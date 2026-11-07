(() => {
  "use strict";

  const BASE = window.UNIT4_DATA;
  const random = (items) => items[Math.floor(Math.random() * items.length)];
  const shuffle = (items) => {
    const copy = [...items];
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const swap = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[swap]] = [copy[swap], copy[index]];
    }
    return copy;
  };
  const splitAnswers = (value) => [...new Set([value, ...String(value).split(" / ").map((part) => part.trim())])];
  const question = (category, sourceId, display, answer, explanation, distractors = [], accepted = [answer]) => ({
    category, sourceId, id: `u4-core:${category}:${sourceId}`, kicker: category, display, answer, explanation, distractors, accepted
  });
  const vocab = (id, italian, english, groups, type = "core vocabulary", options = {}) => ({
    id: `u4-core-${id}`, italian, english, groups: Array.isArray(groups) ? groups : [groups], tag: options.tag || "Unit 4 Core",
    type, priority: "core", activeForCurrentStudy: true,
    acceptedItalian: options.acceptedItalian || splitAnswers(italian),
    acceptedEnglish: options.acceptedEnglish || splitAnswers(english), ...options
  });
  const baseWord = (italian, groups, type) => {
    const found = BASE.vocabulary.find((item) => item.italian === italian || item.infinitive === italian);
    if (!found) throw new Error(`Missing retained Unit 4 term: ${italian}`);
    return { ...found, id: `u4-core-retained-${found.id}`, groups: Array.isArray(groups) ? groups : [groups],
      type: type || found.type || found.tag, priority: "core", activeForCurrentStudy: true };
  };
  const directionToEnglish = (direction) => direction === "it-en" || (direction === "mixed" && Math.random() < 0.5);
  const vocabularyQuestion = (category, pool, sourceId, direction = "mixed") => {
    const item = pool.find((entry) => entry.id === String(sourceId || "").split("#")[0]) || random(pool);
    const toEnglish = directionToEnglish(direction);
    const answer = toEnglish ? item.english : item.italian;
    const q = question(category, item.id, toEnglish ? item.italian : item.english, answer,
      `${item.italian} means “${item.english}.”`, pool.filter((candidate) => candidate.id !== item.id).map((candidate) => toEnglish ? candidate.english : candidate.italian),
      toEnglish ? item.acceptedEnglish : item.acceptedItalian);
    q.kicker = toEnglish ? "Translate into English" : "Translate into Italian";
    q.isVocabularyTranslation = true;
    q.translationDirection = toEnglish ? "it-en" : "en-it";
    return q;
  };

  const REFLEXIVE_GROUP = "reflexive";
  const MODAL_GROUP = "modals";
  const TIME_GROUP = "time-duration";
  const TOWN_GROUP = "around-town";
  const WEATHER_GROUP = "weather-clothing";
  const RECIPROCAL_GROUP = "reciprocal";
  const SPORTS_GROUP = "sports";
  const CULTURE_GROUP = "culture";

  const CORE_REFLEXIVE_NAMES = ["svegliarsi", "alzarsi", "lavarsi", "prepararsi", "vestirsi", "mettersi", "addormentarsi", "riposarsi", "divertirsi"];
  const REFLEXIVE_VERBS = BASE.reflexiveVerbs.filter((verb) => CORE_REFLEXIVE_NAMES.includes(verb.infinitive))
    .map((verb) => ({ ...verb, id: `u4-core-${verb.id}`, groups: [REFLEXIVE_GROUP], priority: "core", activeForCurrentStudy: true }));
  const ROUTINE_WORDS = [
    ...REFLEXIVE_VERBS,
    vocab("shower", "fare la doccia / farsi la doccia", "to take a shower", REFLEXIVE_GROUP, "daily routine"),
    baseWord("lavarsi i denti", REFLEXIVE_GROUP), baseWord("lavarsi le mani", REFLEXIVE_GROUP),
    baseWord("fare colazione", [REFLEXIVE_GROUP, TIME_GROUP], "daily routine"),
    baseWord("restare a letto", [REFLEXIVE_GROUP, TIME_GROUP], "daily routine")
  ];
  const REFLEXIVE_PRONOUNS = { io: "mi", tu: "ti", "lui/lei/Lei": "si", noi: "ci", voi: "vi", loro: "si" };
  const SUBJECTS = [
    ["io", "io"], ["tu", "tu"], ["lui/lei/Lei", "lui/lei/Lei"], ["noi", "noi"], ["voi", "voi"], ["loro", "loro"],
    ["Marco e Anna", "loro"], ["Tu e Paolo", "voi"], ["Io e Giulia", "noi"]
  ];

  const MODALS = [
    { infinitive: "dovere", english: "must / have to", forms: { io: "devo", tu: "devi", "lui/lei/Lei": "deve", noi: "dobbiamo", voi: "dovete", loro: "devono" } },
    { infinitive: "potere", english: "can / be able to", forms: { io: "posso", tu: "puoi", "lui/lei/Lei": "può", noi: "possiamo", voi: "potete", loro: "possono" } },
    { infinitive: "volere", english: "want / want to", forms: { io: "voglio", tu: "vuoi", "lui/lei/Lei": "vuole", noi: "vogliamo", voi: "volete", loro: "vogliono" } }
  ].map((modal) => ({ ...modal, id: `u4-modal-${modal.infinitive}`, italian: modal.infinitive, groups: [MODAL_GROUP], type: "modal verb",
    priority: "core", activeForCurrentStudy: true, acceptedItalian: [modal.infinitive], acceptedEnglish: splitAnswers(modal.english), tag: "Modal Verbs" }));
  const MODAL_SECONDARY = [
    vocab("sapere-inf", "sapere + infinitive", "to know how to", MODAL_GROUP, "secondary modal pattern"),
    vocab("volere-noun", "volere + noun", "to want a thing", MODAL_GROUP, "secondary modal pattern"),
    vocab("dovere-noun", "dovere + noun", "to owe", MODAL_GROUP, "secondary modal pattern")
  ];

  const TIME_WORDS = [
    baseWord("l’ora", TIME_GROUP), baseWord("le ore", TIME_GROUP), baseWord("il minuto", TIME_GROUP), baseWord("i minuti", TIME_GROUP),
    baseWord("mezzogiorno", TIME_GROUP), baseWord("mezzanotte", TIME_GROUP), baseWord("un’ora", TIME_GROUP),
    baseWord("al giorno", TIME_GROUP), baseWord("alla settimana", TIME_GROUP), baseWord("ogni giorno", TIME_GROUP)
  ];

  const PLACES = [
    ["bank", "la banca", "bank"], ["atm", "il bancomat", "ATM"], ["bar", "il bar", "café / bar"], ["cinema", "il cinema", "movie theater"],
    ["newsstand", "l’edicola", "newsstand"], ["pharmacy", "la farmacia", "pharmacy"], ["supermarket", "il supermercato", "supermarket"],
    ["grocery", "il negozio di alimentari", "grocery store"], ["butcher", "la macelleria", "butcher shop"],
    ["gym", "la palestra", "gym"], ["pool", "la piscina", "swimming pool"], ["police", "la questura", "police station"],
    ["station", "la stazione dei treni", "train station"], ["post", "l’ufficio postale", "post office"],
    ["barber", "il barbiere", "barber"], ["hairdresser", "il parrucchiere", "hairdresser"], ["stadium", "lo stadio", "stadium"],
    ["bus-stop", "la fermata dell’autobus", "bus stop"]
  ].map(([id, italian, english]) => vocab(`town-${id}`, italian, english, TOWN_GROUP, "place"));
  const DIRECTIONS = [
    ["straight", "diritto / dritto", "straight"], ["back", "indietro", "back"], ["right", "a destra", "to the right"],
    ["left", "a sinistra", "to the left"], ["corner", "all’angolo", "at the corner"]
  ].map(([id, italian, english]) => vocab(`direction-${id}`, italian, english, TOWN_GROUP, "direction"));
  const LOCATIONS = [
    ["near", "vicino a", "near"], ["far", "lontano da", "far from"], ["next", "accanto a", "next to"],
    ["front", "davanti a", "in front of"], ["behind", "dietro", "behind"], ["opposite", "di fronte a", "across from / opposite"],
    ["above", "sopra", "above"], ["below", "sotto", "below"], ["inside", "dentro", "inside"], ["outside", "fuori da", "outside"]
  ].map(([id, italian, english]) => vocab(`location-${id}`, italian, english, TOWN_GROUP, "location word"));
  const TOWN_WORDS = [...PLACES, ...DIRECTIONS, ...LOCATIONS];

  const WEATHER_TERMS = ["fa caldo", "fa freddo", "fa fresco", "piove", "nevica", "c’è il sole", "c’è vento / tira vento", "c’è nebbia", "è sereno", "è nuvoloso", "fa bel tempo", "fa brutto tempo / fa brutto"];
  const SEASON_TERMS = ["l’inverno", "la primavera", "l’estate", "l’autunno"];
  const CLOTHING_TERMS = ["il cappello", "la maglietta", "il maglione", "la giacca", "la giacca a vento", "la felpa", "l’impermeabile", "i pantaloncini", "i guanti", "la sciarpa", "gli scarponi", "gli stivali da pioggia", "il costume da bagno", "i sandali", "gli occhiali da sole", "l’ombrello", "le scarpe da tennis", "gli sci", "indossare", "portare"];
  const WEATHER_WORDS = WEATHER_TERMS.map((term) => term === "fa brutto tempo / fa brutto"
    ? vocab("bad-weather", "fa brutto tempo", "the weather is bad", WEATHER_GROUP, "weather")
    : baseWord(term, WEATHER_GROUP, "weather"));
  const SEASON_WORDS = SEASON_TERMS.map((term) => baseWord(term, WEATHER_GROUP, "season"));
  const CLOTHING_WORDS = [vocab("pants", "i pantaloni", "pants", WEATHER_GROUP, "clothing"), ...CLOTHING_TERMS.map((term) => baseWord(term, WEATHER_GROUP, term === "gli sci" ? "equipment" : "clothing"))];

  const CORE_RECIPROCAL_NAMES = ["incontrarsi", "vedersi", "salutarsi", "riunirsi", "telefonarsi", "sposarsi"];
  const RECIPROCAL_VERBS = BASE.reciprocalVerbs.filter((verb) => CORE_RECIPROCAL_NAMES.includes(verb.infinitive))
    .map((verb) => ({ ...verb, id: `u4-core-${verb.id}`, groups: [RECIPROCAL_GROUP], priority: "core", activeForCurrentStudy: true }));

  const SPORTS_TERMS = ["nuotare", "il nuoto", "giocare a tennis", "giocare a calcio", "giocare a pallacanestro", "giocare a pallavolo", "sciare", "lo sci", "correre", "fare una corsa", "andare in bicicletta", "il ciclismo", "fare ginnastica", "fare alpinismo", "andare in barca", "la squadra", "la partita"];
  const SPORTS_WORDS = [
    ...SPORTS_TERMS.map((term) => baseWord(term, SPORTS_GROUP, "sports")),
    vocab("skate", "pattinare", "to skate", SPORTS_GROUP, "sports"), vocab("race", "la gara", "race / competition", SPORTS_GROUP, "sports noun"),
    baseWord("pattinare sul ghiaccio", SPORTS_GROUP, "sports expression"), baseWord("gli sci", SPORTS_GROUP, "equipment")
  ];

  const CULTURE_WORDS = ["il Piemonte", "Torino", "la Valle d’Aosta", "Monte Bianco", "Piazza Castello"].map((term) => baseWord(term, CULTURE_GROUP, "culture recognition"));

  function mergeCoreWords(items) {
    const byItalian = new Map();
    items.forEach((item) => {
      const existing = byItalian.get(item.italian);
      if (!existing) byItalian.set(item.italian, { ...item, groups: [...item.groups] });
      else existing.groups = [...new Set([...existing.groups, ...item.groups])];
    });
    return [...byItalian.values()];
  }
  const CORE_WORDS = mergeCoreWords([
    ...ROUTINE_WORDS, ...MODALS, ...MODAL_SECONDARY, ...TIME_WORDS, ...TOWN_WORDS, ...WEATHER_WORDS, ...SEASON_WORDS,
    ...CLOTHING_WORDS, ...RECIPROCAL_VERBS, ...SPORTS_WORDS, ...CULTURE_WORDS
  ]);
  const RETAINED_LATER_WORDS = BASE.vocabulary.map((item) => ({ ...item, priority: "later", activeForCurrentStudy: false }));

  const findReflexive = (sourceId) => REFLEXIVE_VERBS.find((verb) => verb.id === String(sourceId || "").split("#")[0]) || random(REFLEXIVE_VERBS);
  function reflexivePronounQuestion(sourceId) {
    const selected = SUBJECTS.find(([label]) => label === sourceId) || random(SUBJECTS);
    const answer = REFLEXIVE_PRONOUNS[selected[1]];
    return question("Reflexive Pronouns", selected[0], `${selected[0]} → ___`, answer,
      `${selected[0]} acts as ${selected[1].toUpperCase()}, which uses ${answer.toUpperCase()} before the conjugated verb.`, ["mi", "ti", "si", "ci", "vi"].filter((value) => value !== answer));
  }
  function reflexiveConjugationQuestion(sourceId) {
    const [id, requestedSubject] = String(sourceId || "").split("#");
    const verb = findReflexive(id);
    const selected = SUBJECTS.find(([label, key]) => label === requestedSubject || key === requestedSubject) || random(SUBJECTS);
    const answer = verb.forms[selected[1]];
    const negative = Math.random() < 0.22;
    const display = negative ? `${selected[0]} — non + ${verb.infinitive}` : `${selected[0]} — ${verb.infinitive}`;
    const finalAnswer = negative ? `non ${answer}` : answer;
    const q = question("Reflexive Conjugation", `${verb.id}#${selected[0]}`, display, finalAnswer,
      `${selected[0]} = ${selected[1]}. Use ${REFLEXIVE_PRONOUNS[selected[1]].toUpperCase()} before the conjugated verb${negative ? "; NON comes first" : ""}: ${finalAnswer}.`,
      Object.values(verb.forms).map((form) => negative ? `non ${form}` : form).filter((form) => form !== finalAnswer));
    q.reviewSourceId = `${verb.id}#${selected[0]}`;
    return q;
  }
  const REFLEXIVE_CONTRASTS = [
    ["wash-hands", "Io _____ le mani.", "mi lavo", ["lavo", "mi lavo"], "The subject washes their own hands, so the reflexive pronoun belongs."],
    ["wash-car", "Io _____ la macchina.", "lavo", ["lavo", "mi lavo"], "The action goes to the car, so use the ordinary verb."],
    ["wash-dishes", "La mamma _____ i piatti.", "lava", ["lava", "si lava"], "The mother washes the dishes, not herself."],
    ["put-jacket", "Sabrina _____ la giacca.", "si mette", ["mette", "si mette"], "Sabrina puts the jacket on herself."],
    ["pack-jacket", "Sabrina _____ la giacca in valigia.", "mette", ["mette", "si mette"], "The jacket goes into the suitcase; the action is not reflexive."],
    ["dress-self", "La mamma _____.", "si veste", ["veste", "si veste"], "The mother gets herself dressed."],
    ["dress-children", "La mamma _____ i bambini.", "veste", ["veste", "si veste"], "The mother dresses other people."]
  ];
  function reflexiveContrastQuestion(sourceId) {
    const item = REFLEXIVE_CONTRASTS.find(([id]) => id === sourceId) || random(REFLEXIVE_CONTRASTS);
    const q = question("Reflexive vs. Normal", item[0], item[1], item[2], item[4], item[3].filter((value) => value !== item[2]));
    q.forceChoice = true;
    return q;
  }
  const ROUTINE_SENTENCES = [
    ["wake", "Mi _____ alle sette. (svegliarsi)", "sveglio"], ["rise", "Mi _____ alle sette e venti. (alzarsi)", "alzo"],
    ["wash", "Mi _____. (lavarsi)", "lavo"], ["shower", "_____ la doccia.", "Faccio"], ["breakfast", "_____ colazione.", "Faccio"],
    ["ready", "Mi _____. (prepararsi)", "preparo"], ["dress", "Mi _____. (vestirsi)", "vesto"],
    ["sleep", "Mi _____ alle undici. (addormentarsi)", "addormento"]
  ];
  function routineQuestion(sourceId) {
    const item = ROUTINE_SENTENCES.find(([id]) => id === sourceId) || random(ROUTINE_SENTENCES);
    return question("Daily Routine", item[0], item[1], item[2], `This is the core daily-routine expression: ${item[1].replace("_____", item[2])}`,
      ROUTINE_SENTENCES.map((row) => row[2]).filter((value) => value !== item[2]));
  }

  function modalMeaningQuestion(sourceId, direction) { return vocabularyQuestion("Modal Meanings", MODALS, sourceId, direction); }
  function modalConjugationQuestion(sourceId) {
    const [id, requestedSubject] = String(sourceId || "").split("#");
    const modal = MODALS.find((item) => item.id === id || item.infinitive === id) || random(MODALS);
    const subject = Object.keys(modal.forms).includes(requestedSubject) ? requestedSubject : random(Object.keys(modal.forms));
    const answer = modal.forms[subject];
    return question("Modal Conjugations", `${modal.id}#${subject}`, `${subject} — ${modal.infinitive}`, answer,
      `${modal.infinitive.toUpperCase()} with ${subject.toUpperCase()} is ${answer}.`, Object.values(modal.forms).filter((value) => value !== answer));
  }
  const MODAL_CONTEXTS = [
    ["exam", "Sabrina ha un esame domani. Lei _____ studiare.", "deve", "She has to study."],
    ["can-go", "Io _____ uscire stasera: non ho compiti.", "posso", "I can go out."],
    ["want-eat", "Ho fame. Io _____ mangiare.", "voglio", "I want to eat."],
    ["must-go", "Noi _____ andare a lezione.", "dobbiamo", "We have to go."],
    ["want-film", "Loro _____ vedere un film.", "vogliono", "They want to see a movie."],
    ["can-swim", "Voi _____ nuotare oggi.", "potete", "You all can swim today."]
  ];
  function chooseModalQuestion(sourceId) {
    const item = MODAL_CONTEXTS.find(([id]) => id === sourceId) || random(MODAL_CONTEXTS);
    const q = question("Choose the Modal", item[0], item[1], item[2], `${item[3]} Conjugate the modal; the second verb stays in the infinitive.`,
      [...new Set(MODALS.flatMap((modal) => Object.values(modal.forms)))].filter((value) => value !== item[2]));
    q.forceChoice = true;
    return q;
  }
  function modalInfinitiveQuestion(sourceId) {
    const item = MODAL_CONTEXTS.find(([id]) => id === sourceId) || random(MODAL_CONTEXTS);
    const completed = item[1].replace("_____", item[2]);
    return question("Modal + Infinitive", item[0], item[3], completed.replace(/[.:]$/, ""),
      `Conjugate the modal and leave the second verb in the infinitive: ${completed}`, MODAL_CONTEXTS.map((row) => row[1].replace("_____", row[2])).filter((value) => value !== completed));
  }
  const MODAL_REFLEXIVES = [
    ["devo-alzare", "I have to get up.", "Mi devo alzare.", "Devo alzarmi."],
    ["puoi-riposare", "You can rest.", "Ti puoi riposare.", "Puoi riposarti."],
    ["possiamo-divertire", "We can have fun.", "Ci possiamo divertire.", "Possiamo divertirci."]
  ];
  function modalReflexiveQuestion(sourceId) {
    const item = MODAL_REFLEXIVES.find(([id]) => id === sourceId) || random(MODAL_REFLEXIVES);
    return question("Modal + Reflexive", item[0], item[1], item[2],
      `Both pronoun positions are valid: ${item[2]} = ${item[3]} When attaching the pronoun, drop the infinitive’s final -e.`,
      MODAL_REFLEXIVES.flatMap((row) => [row[2], row[3]]).filter((value) => value !== item[2] && value !== item[3]), [item[2], item[3]]);
  }

  const wrapBase = (category, baseCategory, sourceId) => ({ ...BASE.makeQuestion(baseCategory, sourceId), category });
  const DAILY_TIME = [
    ["wake", "A che ora ti svegli? (7:00)", "Mi sveglio alle sette."], ["rise", "A che ora ti alzi? (7:20)", "Mi alzo alle sette e venti."],
    ["breakfast", "A che ora fai colazione? (8:00)", "Faccio colazione alle otto."], ["sleep", "A che ora ti addormenti? (23:00)", "Mi addormento alle undici."]
  ];
  function atWhatTimeQuestion(sourceId) {
    const item = DAILY_TIME.find(([id]) => id === sourceId) || random(DAILY_TIME);
    return question("A che ora", item[0], item[1], item[2], `A che ora asks when an event happens. Use ALL’UNA for one and ALLE for other numbered hours.`, DAILY_TIME.map((row) => row[2]).filter((value) => value !== item[2]));
  }
  const DURATION_CONTEXTS = [
    ["clock", "A che ora studi? (3:00)", "Alle tre.", "This asks for clock time."],
    ["duration", "Quanto tempo studi?", "Tre ore.", "This asks for an amount of time."],
    ["quanto", "_____ tempo studi ogni giorno?", "Quanto", "TEMPO is masculine singular."],
    ["quante", "_____ ore studi alla settimana?", "Quante", "ORE is feminine plural."],
    ["molto", "Studio per _____ tempo.", "molto", "TEMPO is masculine singular."],
    ["molte", "Studio per _____ ore.", "molte", "ORE is feminine plural."]
  ];
  function durationQuestion(sourceId) {
    const item = DURATION_CONTEXTS.find(([id]) => id === sourceId) || random(DURATION_CONTEXTS);
    return question("Duration", item[0], item[1], item[2], item[3], DURATION_CONTEXTS.map((row) => row[2]).filter((value) => value !== item[2]));
  }

  const ERRANDS = [
    ["newspaper", "Dove compri un giornale?", "l’edicola"], ["medicine", "Dove compri le medicine?", "la farmacia"],
    ["swim", "Dove vai per nuotare?", "la piscina"], ["exercise", "Dove vai per fare ginnastica?", "la palestra"],
    ["package", "Dove spedisci un pacco?", "l’ufficio postale"], ["police", "Dove parli con la polizia?", "la questura"],
    ["movie", "Dove guardi un film?", "il cinema"], ["train", "Dove prendi il treno?", "la stazione dei treni"],
    ["cash", "Dove prendi i contanti?", "il bancomat"], ["groceries", "Dove compri gli alimentari?", "il supermercato", ["il negozio di alimentari"]],
    ["haircut", "Dove vai per un taglio di capelli?", "il barbiere", ["il parrucchiere"]], ["game", "Dove guardi una partita?", "lo stadio"]
  ];
  function errandQuestion(sourceId) {
    const item = ERRANDS.find(([id]) => id === sourceId) || random(ERRANDS);
    const accepted = [item[2], ...(item[3] || [])];
    return question("Errand → Place", item[0], item[1], item[2], `${accepted.join(" / ")} is the logical place for this errand.`,
      PLACES.map((place) => place.italian).filter((value) => !accepted.includes(value)), accepted);
  }
  const DIRECTION_OPPOSITES = [
    ["near", "What is the opposite of vicino?", "lontano"], ["front", "What is the opposite of davanti?", "dietro"],
    ["above", "What is the opposite of sopra?", "sotto"], ["inside", "What is the opposite of dentro?", "fuori"]
  ];
  function directionQuestion(sourceId) {
    if (sourceId?.startsWith("direction-") || Math.random() < 0.45) return vocabularyQuestion("Directions", DIRECTIONS, sourceId, "mixed");
    const item = DIRECTION_OPPOSITES.find(([id]) => id === sourceId) || random(DIRECTION_OPPOSITES);
    return question("Directions", item[0], item[1], item[2], `${item[2]} is the course opposite.`, LOCATIONS.map((entry) => entry.italian));
  }
  const TOWN_PREPOSITIONS = [
    ["newsstand", "vicino + a + l’edicola", "vicino all’edicola", "a + l’ becomes all’."],
    ["bar", "a destra + di + il bar", "a destra del bar", "di + il becomes del."],
    ["gym", "fuori + da + la palestra", "fuori dalla palestra", "da + la becomes dalla."],
    ["bank", "accanto + a + la banca", "accanto alla banca", "a + la becomes alla."]
  ];
  function townPrepositionQuestion(sourceId) {
    const item = TOWN_PREPOSITIONS.find(([id]) => id === sourceId) || random(TOWN_PREPOSITIONS);
    return question("Town Prepositions", item[0], item[1], item[2], `${item[3]} This uses the Unit 3 articulated-preposition rule in a direction.`, TOWN_PREPOSITIONS.map((row) => row[2]).filter((value) => value !== item[2]));
  }
  const MAP_CONTEXTS = [
    ["bank-bar", "La banca è next to il bar. Complete: La banca è _____ bar.", "accanto al", "ACCANTO A + IL becomes ACCANTO AL."],
    ["cinema-pharmacy", "Il cinema è across from la farmacia. Complete: Il cinema è _____ farmacia.", "di fronte alla", "DI FRONTE A + LA becomes DI FRONTE ALLA."],
    ["atm-bank", "Il bancomat è inside la banca. Complete: Il bancomat è _____ banca.", "dentro la", "DENTRO expresses inside."],
    ["bus-stadium", "La fermata è in front of lo stadio. Complete: La fermata è _____ stadio.", "davanti allo", "DAVANTI A + LO becomes DAVANTI ALLO."]
  ];
  function mapQuestion(sourceId) {
    const item = MAP_CONTEXTS.find(([id]) => id === sourceId) || random(MAP_CONTEXTS);
    return question("Map Practice", item[0], item[1], item[2], item[3], MAP_CONTEXTS.map((row) => row[2]).filter((value) => value !== item[2]));
  }

  const WEATHER_CONTEXTS = [
    ["cold", "Fa freddo e nevica. Che cosa è logico indossare?", "i guanti", ["la sciarpa", "il maglione", "gli scarponi"]],
    ["hot", "Fa caldo e c’è il sole. Che cosa è logico indossare?", "il costume da bagno", ["i sandali", "gli occhiali da sole", "i pantaloncini"]],
    ["rain", "Piove. Che cosa è logico portare?", "l’ombrello", ["l’impermeabile", "gli stivali da pioggia"]]
  ];
  function weatherClothingQuestion(sourceId) {
    const item = WEATHER_CONTEXTS.find(([id]) => id === sourceId) || random(WEATHER_CONTEXTS);
    const accepted = [item[2], ...item[3]];
    return question("Weather → Clothing", item[0], item[1], item[2], `${accepted.join(" / ")} are logical core-clothing answers for this weather.`,
      CLOTHING_WORDS.map((entry) => entry.italian).filter((value) => !accepted.includes(value)), accepted);
  }

  function reciprocalMeaningQuestion(sourceId, direction) { return vocabularyQuestion("Reciprocal Meanings", RECIPROCAL_VERBS, sourceId, direction); }
  function reciprocalPronounQuestion(sourceId) {
    const subjects = [["noi", "ci"], ["voi", "vi"], ["loro", "si"], ["Marco e Anna", "si"], ["Tu e Paolo", "vi"]];
    const item = subjects.find(([subject]) => subject === sourceId) || random(subjects);
    return question("Reciprocal Pronouns", item[0], `${item[0]} → ___`, item[1], `Reciprocal actions require a plural subject. ${item[0]} uses ${item[1].toUpperCase()}.`, ["ci", "vi", "si"].filter((value) => value !== item[1]));
  }
  function reciprocalConjugationQuestion(sourceId) {
    const [id, requestedSubject] = String(sourceId || "").split("#");
    const verb = RECIPROCAL_VERBS.find((item) => item.id === id || item.infinitive === id) || random(RECIPROCAL_VERBS);
    const subject = ["noi", "voi", "loro"].includes(requestedSubject) ? requestedSubject : random(["noi", "voi", "loro"]);
    const answer = verb.forms[subject];
    return question("Reciprocal Conjugation", `${verb.id}#${subject}`, `${subject} — ${verb.infinitive}`, answer,
      `Reciprocal means each other. ${subject.toUpperCase()} uses ${REFLEXIVE_PRONOUNS[subject].toUpperCase()}: ${answer}.`, Object.values(verb.forms).filter((value) => value !== answer));
  }
  const RECIPROCAL_CONTRASTS = [
    ["greet-one", "Roberto _____ Cristina.", "saluta", ["saluta", "si salutano"], "Roberto greets Cristina; this is ordinary."],
    ["greet-each", "Roberto e Cristina _____.", "si salutano", ["salutano", "si salutano"], "The plural subject members greet each other."],
    ["call-one", "Tu _____ a Claudia.", "telefoni", ["telefoni", "ti telefoni"], "You call Claudia; this is ordinary."],
    ["call-each", "Io e Claudia _____.", "ci telefoniamo", ["telefoniamo", "ci telefoniamo"], "Claudia and I call each other."]
  ];
  function reciprocalContrastQuestion(sourceId) {
    const item = RECIPROCAL_CONTRASTS.find(([id]) => id === sourceId) || random(RECIPROCAL_CONTRASTS);
    const q = question("Reciprocal vs. Ordinary", item[0], item[1], item[2], item[4], item[3].filter((value) => value !== item[2]));
    q.forceChoice = true;
    return q;
  }

  function sportsPrepositionQuestion(sourceId) {
    const items = [
      ["tennis", "giocare ___ tennis", "a"], ["soccer", "giocare ___ calcio", "a"], ["basketball", "giocare ___ pallacanestro", "a"],
      ["bike", "andare ___ bicicletta", "in"], ["boat", "andare ___ barca", "in"], ["ice", "pattinare ___ ghiaccio", "sul"]
    ];
    const item = items.find(([id]) => id === sourceId) || random(items);
    return question("Sports Prepositions", item[0], item[1], item[2], `${item[1].replace("___", item[2])} is the complete course expression.`, ["a", "in", "sul", "con"].filter((value) => value !== item[2]));
  }
  function skiDistinctionQuestion(sourceId) {
    const items = [
      ["verb", "Which form means “to ski”?", "sciare", "SCIARE is the verb."],
      ["sport", "Which form means “skiing,” the sport?", "lo sci", "LO SCI is the sport."],
      ["equipment", "Which form means “skis,” the equipment?", "gli sci", "GLI SCI is the equipment."]
    ];
    const item = items.find(([id]) => id === sourceId) || random(items);
    const q = question("Ski: Verb / Sport / Equipment", item[0], item[1], item[2], item[3], ["sciare", "lo sci", "gli sci"].filter((value) => value !== item[2]));
    q.forceChoice = true;
    return q;
  }

  const CULTURE_FACTS = [
    ["piemonte", "Piemonte means “foot of the mountain.”", "vero"], ["torino", "Torino is associated with Piemonte in the course reading.", "vero"],
    ["aosta", "Valle d’Aosta is described as Italy’s smallest region.", "vero"], ["monte", "Monte Bianco is described as Europe’s highest mountain.", "vero"],
    ["castello", "Piazza Castello is an important square in Torino.", "vero"], ["false", "Piazza Castello is in Valle d’Aosta, not Torino.", "falso"]
  ];
  function cultureQuestion(sourceId) {
    const item = CULTURE_FACTS.find(([id]) => id === sourceId) || random(CULTURE_FACTS);
    const q = question("Culture Quick Recognition", item[0], item[1], item[2], item[2] === "vero" ? "This matches the broad course fact." : "This contradicts the broad course fact.", ["vero", "falso"].filter((value) => value !== item[2]));
    q.forceChoice = true;
    return q;
  }

  const MIXERS = {
    "Mixed Reflexives": ["Reflexive Meanings", "Reflexive Pronouns", "Reflexive Conjugation", "Reflexive vs. Normal", "Daily Routine"],
    "Mixed Modals": ["Modal Meanings", "Modal Conjugations", "Choose the Modal", "Modal + Infinitive", "Modal + Reflexive"],
    "Mixed Time": ["Read the Time", "Write the Time", "A che ora", "24-Hour Conversion", "Duration"],
    "Mixed Town": ["Place Vocabulary", "Errand → Place", "Directions", "Location Words", "Town Prepositions", "Map Practice"],
    "Mixed Weather & Clothing": ["Weather Vocabulary", "Season Vocabulary", "Clothing Vocabulary", "Weather → Clothing"],
    "Mixed Reciprocals": ["Reciprocal Meanings", "Reciprocal Pronouns", "Reciprocal Conjugation", "Reciprocal vs. Ordinary"],
    "Mixed Sports": ["Sports Vocabulary", "Sports Prepositions", "Ski: Verb / Sport / Equipment"]
  };
  const STAR_MIXED = Object.keys(MIXERS);

  function makeQuestion(category, sourceId, unit1Data, direction = "mixed") {
    if (category === "Mixed Unit 4") return makeQuestion(random(STAR_MIXED), sourceId, unit1Data, direction);
    if (MIXERS[category]) return makeQuestion(random(MIXERS[category]), sourceId, unit1Data, direction);
    if (category === "Reflexive Meanings") return vocabularyQuestion(category, ROUTINE_WORDS, sourceId, direction);
    if (category === "Reflexive Pronouns") return reflexivePronounQuestion(sourceId);
    if (category === "Reflexive Conjugation") return reflexiveConjugationQuestion(sourceId);
    if (category === "Reflexive vs. Normal") return reflexiveContrastQuestion(sourceId);
    if (category === "Daily Routine") return routineQuestion(sourceId);
    if (category === "Modal Meanings") return modalMeaningQuestion(sourceId, direction);
    if (category === "Modal Conjugations") return modalConjugationQuestion(sourceId);
    if (category === "Choose the Modal") return chooseModalQuestion(sourceId);
    if (category === "Modal + Infinitive") return modalInfinitiveQuestion(sourceId);
    if (category === "Modal + Reflexive") return modalReflexiveQuestion(sourceId);
    if (category === "Read the Time" || category === "Write the Time") return wrapBase(category, "Telling Time", sourceId);
    if (category === "A che ora") return atWhatTimeQuestion(sourceId);
    if (category === "24-Hour Conversion") return wrapBase(category, "12-Hour ↔ 24-Hour Time", sourceId);
    if (category === "Duration") return durationQuestion(sourceId);
    if (category === "Place Vocabulary") return vocabularyQuestion(category, PLACES, sourceId, direction);
    if (category === "Errand → Place") return errandQuestion(sourceId);
    if (category === "Directions") return directionQuestion(sourceId);
    if (category === "Location Words") return vocabularyQuestion(category, LOCATIONS, sourceId, direction);
    if (category === "Town Prepositions") return townPrepositionQuestion(sourceId);
    if (category === "Map Practice") return mapQuestion(sourceId);
    if (category === "Weather Vocabulary") return vocabularyQuestion(category, WEATHER_WORDS, sourceId, direction);
    if (category === "Season Vocabulary") return vocabularyQuestion(category, SEASON_WORDS, sourceId, direction);
    if (category === "Clothing Vocabulary") return vocabularyQuestion(category, CLOTHING_WORDS, sourceId, direction);
    if (category === "Weather → Clothing") return weatherClothingQuestion(sourceId);
    if (category === "Reciprocal Meanings") return reciprocalMeaningQuestion(sourceId, direction);
    if (category === "Reciprocal Pronouns") return reciprocalPronounQuestion(sourceId);
    if (category === "Reciprocal Conjugation") return reciprocalConjugationQuestion(sourceId);
    if (category === "Reciprocal vs. Ordinary") return reciprocalContrastQuestion(sourceId);
    if (category === "Sports Vocabulary") return vocabularyQuestion(category, SPORTS_WORDS, sourceId, direction);
    if (category === "Sports Prepositions") return sportsPrepositionQuestion(sourceId);
    if (category === "Ski: Verb / Sport / Equipment") return skiDistinctionQuestion(sourceId);
    return cultureQuestion(sourceId);
  }

  const STUDY_TOPICS = [
    { id: "reflexive", title: "★ Reflexive Verbs & Daily Routine", shortTitle: "Reflexive Verbs", primary: true, vocabFilter: REFLEXIVE_GROUP, learnCard: "Reflexive Verbs & Daily Routine", skillKey: "reflexiveTopicAccuracy", summary: "Pronouns, core routine verbs, conjugation, negatives, and reflexive meaning.", whatToKnow: "Pronoun + conjugated verb; NON comes first; use articles with body parts.", categories: [...MIXERS["Mixed Reflexives"], "Mixed Reflexives"] },
    { id: "modals", title: "★ Modal Verbs", shortTitle: "Modal Verbs", primary: true, vocabFilter: MODAL_GROUP, learnCard: "Modal Verbs", skillKey: "modalTopicAccuracy", summary: "Dovere, potere, volere, modal + infinitive, and modal + reflexive.", whatToKnow: "Conjugate the modal and leave the second verb in the infinitive.", categories: [...MIXERS["Mixed Modals"], "Mixed Modals"] },
    { id: "time", title: "★ Time & Duration", shortTitle: "Time & Duration", primary: true, vocabFilter: TIME_GROUP, learnCard: "Time & Duration", skillKey: "timeTopicAccuracy", summary: "Clock time, A che ora, routine schedules, 24-hour time, and duration.", whatToKnow: "È l’una; Sono le…; ALL’UNA vs ALLE…; duration is an amount, not a clock time.", categories: [...MIXERS["Mixed Time"], "Mixed Time"] },
    { id: "town", title: "★ Around Town", shortTitle: "Around Town", primary: true, vocabFilter: TOWN_GROUP, learnCard: "Around Town", skillKey: "townTopicAccuracy", summary: "Core places, errands, directions, location words, and map-style use.", whatToKnow: "Learn a place with what you do there, then use direction words in context.", categories: [...MIXERS["Mixed Town"], "Mixed Town"] },
    { id: "weather", title: "★ Weather, Seasons & Clothing", shortTitle: "Weather / Clothing", primary: true, vocabFilter: WEATHER_GROUP, learnCard: "Weather, Seasons & Clothing", skillKey: "weatherTopicAccuracy", summary: "Core seasons, weather, clothing, and logical weather-to-clothing choices.", whatToKnow: "Connect weather and seasons to clothing instead of memorizing disconnected lists.", categories: [...MIXERS["Mixed Weather & Clothing"], "Mixed Weather & Clothing"] },
    { id: "reciprocal", title: "★ Reciprocal Actions", shortTitle: "Reciprocal Actions", primary: true, vocabFilter: RECIPROCAL_GROUP, learnCard: "Reciprocal Actions", skillKey: "reciprocalTopicAccuracy", summary: "Core each-other verbs, plural pronouns, conjugation, and meaning contrasts.", whatToKnow: "Reciprocal actions require plural subjects: noi CI, voi VI, loro SI.", categories: [...MIXERS["Mixed Reciprocals"], "Mixed Reciprocals"] },
    { id: "sports", title: "★ Sports", shortTitle: "Sports", primary: true, vocabFilter: SPORTS_GROUP, learnCard: "Sports", skillKey: "sportsTopicAccuracy", summary: "Core activities, sports nouns, prepositions, and the sciare / lo sci / gli sci contrast.", whatToKnow: "Giocare A, andare IN, and pattinare SUL ghiaccio.", categories: [...MIXERS["Mixed Sports"], "Mixed Sports"] },
    { id: "culture", title: "Culture — Quick Recognition", shortTitle: "Culture", primary: false, vocabFilter: CULTURE_GROUP, learnCard: "Culture — Quick Recognition", skillKey: "cultureTopicAccuracy", summary: "Five names and a handful of broad course facts—recognition only.", whatToKnow: "Recognize Piemonte, Torino, Valle d’Aosta, Monte Bianco, and Piazza Castello.", categories: ["Culture Quick Recognition"] }
  ];
  const TOPIC_BY_TITLE = Object.fromEntries(STUDY_TOPICS.map((topic) => [topic.title, topic]));
  const TOPICS = [...STUDY_TOPICS.map((topic) => topic.title), "Mixed Unit 4"];
  const CATEGORIES = [...new Set(STUDY_TOPICS.flatMap((topic) => topic.categories).concat("Mixed Unit 4"))];
  const CATEGORY_TO_TOPIC = Object.fromEntries(STUDY_TOPICS.flatMap((topic) => topic.categories.map((category) => [category, topic.id])));
  CATEGORY_TO_TOPIC["Mixed Unit 4"] = "mixed";
  const SKILL_MAP = Object.fromEntries(STUDY_TOPICS.flatMap((topic) => topic.categories.map((category) => [category, topic.skillKey])));
  SKILL_MAP["Mixed Unit 4"] = "mixedUnit4Accuracy";

  const LEARN_CARDS = {
    "Reflexive Verbs & Daily Routine": { title: "Reflexive Verbs & Daily Routine", rule: "Put MI, TI, SI, CI, VI, or SI before the conjugated verb. In a negative sentence, NON comes before the pronoun.", chart: [["io / tu / lui-lei", "mi / ti / si"], ["noi / voi / loro", "ci / vi / si"], ["negative", "non + pronoun + verb"], ["body parts", "mi lavo i denti · mi lavo le mani"]], examples: ["Io mi alzo.", "Tu non ti riposi.", "Noi ci prepariamo.", "Mi lavo i denti—not i miei denti."], mistake: "Use the sentence meaning: lavo la macchina, but mi lavo le mani.", tryOne: "Tu e Paolo — alzarsi →", tryAnswer: "vi alzate" },
    "Modal Verbs": { title: "Modal Verbs", rule: "Conjugate DOVERE, POTERE, or VOLERE. Leave the second verb in the infinitive.", chart: [["dovere", "devo · devi · deve · dobbiamo · dovete · devono"], ["potere", "posso · puoi · può · possiamo · potete · possono"], ["volere", "voglio · vuoi · vuole · vogliamo · volete · vogliono"], ["modal + reflexive", "Mi devo alzare = Devo alzarmi"]], examples: ["Devo studiare.", "Posso uscire.", "Voglio mangiare.", "Ci possiamo divertire = Possiamo divertirci."], mistake: "Do not conjugate both verbs: devo studiare, not devo studio.", tryOne: "noi — dovere →", tryAnswer: "dobbiamo" },
    "Time & Duration": { title: "Time & Duration", rule: "Use È l’una for 1:xx and Sono le… for other hours. A che ora asks WHEN; Quanto tempo asks HOW LONG.", chart: [["1:00", "È l’una · all’una"], ["2:00", "Sono le due · alle due"], ["noon / midnight", "mezzogiorno / mezzanotte"], ["clock vs duration", "Alle tre. / Tre ore."]], examples: ["2:15 = Sono le due e un quarto.", "4:45 = Sono le cinque meno un quarto.", "Mi alzo alle sette."], mistake: "A che ora needs a clock time; Quanto tempo needs an amount.", tryOne: "at 1:00 →", tryAnswer: "all’una" },
    "Around Town": { title: "Around Town", rule: "Learn each important place with its errand, then use direction and location words in a complete phrase.", chart: [["medicine", "farmacia"], ["cash", "bancomat"], ["movie", "cinema"], ["near the newsstand", "vicino all’edicola"]], examples: ["accanto alla banca", "a destra del bar", "fuori dalla palestra", "di fronte alla farmacia"], mistake: "Use the Unit 3 contraction inside the direction: a + la = alla; di + il = del.", tryOne: "accanto + a + la banca →", tryAnswer: "accanto alla banca" },
    "Weather, Seasons & Clothing": { title: "Weather, Seasons & Clothing", rule: "Connect the season and weather to logical clothing instead of memorizing three separate lists.", chart: [["freddo / caldo", "cold / hot"], ["sereno / nuvoloso", "clear / cloudy"], ["bel / brutto tempo", "nice / bad weather"], ["piove", "ombrello · impermeabile · stivali"]], examples: ["Fa freddo e nevica → guanti, sciarpa, maglione, scarponi.", "Fa caldo e c’è il sole → costume, sandali, occhiali, pantaloncini."], mistake: "Choose a logical core clothing item; do not use an unrelated word as the clue.", tryOne: "It is snowing →", tryAnswer: "nevica" },
    "Reciprocal Actions": { title: "Reciprocal Actions", rule: "Reciprocal means EACH OTHER and requires a plural subject: NOI → CI, VOI → VI, LORO → SI.", chart: [["noi", "ci incontriamo"], ["voi", "vi salutate"], ["loro", "si vedono"], ["riunirsi", "ci riuniamo · vi riunite · si riuniscono"]], examples: ["Roberto saluta Cristina (ordinary).", "Roberto e Cristina si salutano (each other)."], mistake: "Decide from meaning, not only from whether the infinitive ends in -si.", tryOne: "loro — vedersi →", tryAnswer: "si vedono" },
    "Sports": { title: "Sports", rule: "Memorize the complete sports expression and its preposition.", chart: [["giocare", "A tennis / calcio / pallacanestro"], ["andare", "IN bicicletta / barca"], ["pattinare", "SUL ghiaccio"], ["ski", "sciare · lo sci · gli sci"]], examples: ["giocare a tennis", "andare in bicicletta", "pattinare sul ghiaccio"], mistake: "SCIARE is the verb, LO SCI is the sport, and GLI SCI are the equipment.", tryOne: "andare ___ bicicletta", tryAnswer: "in" },
    "Culture — Quick Recognition": { title: "Culture — Quick Recognition", rule: "Recognize five major names and only the broad facts used in the course reading.", chart: [["Piemonte", "‘foot of the mountain’"], ["Torino", "city in Piemonte"], ["Valle d’Aosta", "smallest region in the reading"], ["Monte Bianco", "Europe’s highest mountain in the reading"], ["Piazza Castello", "important square in Torino"]], examples: ["Culture stays optional and low priority."], mistake: "Do not spend cram time on obscure Review It vocabulary.", tryOne: "Important square in Torino →", tryAnswer: "Piazza Castello" }
  };

  const VOCABULARY_FILTERS = [["all", "All Unit 4 Core Words"], ...STUDY_TOPICS.map((topic) => [topic.vocabFilter, topic.shortTitle])];
  const MATCHING_POOLS = {
    "Reflexive Meanings": ROUTINE_WORDS, "Modal Meanings": MODALS, "Place Vocabulary": PLACES, "Directions": DIRECTIONS,
    "Location Words": LOCATIONS, "Weather Vocabulary": WEATHER_WORDS, "Season Vocabulary": SEASON_WORDS,
    "Clothing Vocabulary": CLOTHING_WORDS, "Reciprocal Meanings": RECIPROCAL_VERBS, "Sports Vocabulary": SPORTS_WORDS
  };
  const MATCHING_CATEGORIES = [...Object.keys(MATCHING_POOLS), "Read the Time", "24-Hour Conversion"];
  function makeMatchingQuestion(category) {
    if (category === "Read the Time") return { ...BASE.makeMatchingQuestion("Telling Time"), category };
    if (category === "24-Hour Conversion") return { ...BASE.makeMatchingQuestion("12-Hour ↔ 24-Hour Time"), category };
    const pool = MATCHING_POOLS[category] || MATCHING_POOLS["Reflexive Meanings"];
    const pairs = shuffle(pool).slice(0, 5).map((item) => ({ left: item.italian || item.infinitive, right: item.english, sourceId: item.id }));
    return { type: "matching", category, sourceId: `matching:${category}`, id: `u4-core-matching:${category}:${pairs.map((pair) => pair.sourceId).join("-")}`,
      kicker: "Match the core pairs", display: category, pairs, explanation: "These pairs stay inside the selected Unit 4 topic." };
  }

  const PRIORITY_TOPICS = STUDY_TOPICS.filter((topic) => topic.primary).map((topic) => topic.title);
  window.UNIT4_DATA = {
    ...BASE,
    categories: CATEGORIES, topics: TOPICS, defaultTopics: PRIORITY_TOPICS,
    topicGroups: [{ name: "Unit 4 cram topics", topics: STUDY_TOPICS.map((topic) => [topic.title, topic.summary]) }, { name: "Mixed", topics: [["Mixed Unit 4", "Balanced practice across the seven ★ topics"]] }],
    presets: { priority: PRIORITY_TOPICS, reflexive: [STUDY_TOPICS[0].title], modals: [STUDY_TOPICS[1].title], time: [STUDY_TOPICS[2].title], everything: TOPICS },
    presetLabels: { priority: "All ★ Topics", reflexive: "Reflexives", modals: "Modals", time: "Time", everything: "All Core + Culture" },
    matchingCategories: MATCHING_CATEGORIES, vocabulary: [...CORE_WORDS, ...RETAINED_LATER_WORDS], vocabularyFilters: VOCABULARY_FILTERS,
    learnCards: LEARN_CARDS, skillMap: SKILL_MAP, studyTopics: STUDY_TOPICS, categoryToTopic: CATEGORY_TO_TOPIC,
    retainedLaterVocabulary: RETAINED_LATER_WORDS, coreVocabulary: CORE_WORDS, modalVerbs: MODALS,
    reflexivePronouns: REFLEXIVE_PRONOUNS, reflexiveVerbs: REFLEXIVE_VERBS, reciprocalVerbs: RECIPROCAL_VERBS,
    makeQuestion, makeMatchingQuestion,
    expandTopics(topics) {
      return [...new Set(topics.flatMap((topic) => topic === "Mixed Unit 4" ? ["Mixed Unit 4"] : (TOPIC_BY_TITLE[topic]?.categories || [])))];
    },
    migrateTopics(topics) {
      const direct = topics.filter((topic) => TOPICS.includes(topic));
      if (direct.length) return [...new Set(direct)];
      const hadCulture = topics.some((topic) => String(topic).includes("Culture"));
      return hadCulture ? [...PRIORITY_TOPICS, STUDY_TOPICS[7].title] : [...PRIORITY_TOPICS];
    },
    isSourceEligible(category) { return CATEGORIES.includes(category); },
    topicForCategory(category) { return CATEGORY_TO_TOPIC[category] || null; }
  };
})();
