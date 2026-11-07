(() => {
  "use strict";

  const SUBJECTS = ["io", "tu", "lui/lei/Lei", "noi", "voi", "loro"];
  const REFLEXIVE_PRONOUNS = { io: "mi", tu: "ti", "lui/lei/Lei": "si", noi: "ci", voi: "vi", loro: "si" };
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
    const parts = String(value).split(" / ").map((part) => part.trim());
    const withTo = value.startsWith("to ") ? parts.map((part) => part.startsWith("to ") ? part : `to ${part}`) : [];
    return [...new Set([value, ...parts, ...withTo, ...parts.map((part) => part.replace(/^to\s+/, ""))])];
  };
  const baseQuestion = (category, sourceId, id, kicker, display, answer, explanation, distractors = [], accepted = [answer]) => ({
    category, sourceId, id, kicker, display, answer, explanation, distractors, accepted
  });
  const directionToEnglish = (direction) => direction === "it-en" || (direction === "mixed" && Math.random() < 0.5);
  const choose = (pool, sourceId) => pool.find((item) => item.id === String(sourceId || "").split("#")[0]) || random(pool);
  const entry = (id, italian, english, group, tag, options = {}) => ({
    id, italian, english, groups: [group], tag, acceptedItalian: options.acceptedItalian || [...new Set([italian, ...italian.split(" / ")])],
    acceptedEnglish: options.acceptedEnglish || splitMeanings(english), type: options.type || "", ...options
  });

  const CLOTHING = [
    ["clothing", "l’abbigliamento", "clothing"], ["suit-dress", "l’abito", "suit / dress / outfit"],
    ["dress-garment", "il vestito", "dress / suit / garment"], ["socks", "i calzini", "socks"],
    ["shirt", "la camicia", "shirt"], ["hat", "il cappello", "hat"], ["cap", "il berretto", "cap"],
    ["swimsuit", "il costume da bagno", "swimsuit"], ["sweatshirt", "la felpa", "sweatshirt"],
    ["jacket", "la giacca", "jacket"], ["windbreaker", "la giacca a vento", "windbreaker"],
    ["gloves", "i guanti", "gloves"], ["raincoat", "l’impermeabile", "raincoat"],
    ["top-jersey", "la maglia", "top / jersey"], ["tshirt", "la maglietta", "T-shirt"],
    ["sweater", "il maglione", "sweater"], ["sunglasses", "gli occhiali da sole", "sunglasses"],
    ["umbrella", "l’ombrello", "umbrella"], ["snow-pants", "i pantaloni da neve", "snow pants"],
    ["shorts", "i pantaloncini", "shorts"], ["sandals", "i sandali", "sandals"], ["scarf", "la sciarpa", "scarf"],
    ["scarves", "le sciarpe", "scarves"], ["sneakers", "le scarpe da ginnastica", "sneakers"],
    ["tennis-shoes", "le scarpe da tennis", "tennis shoes"], ["heavy-boots", "gli scarponi", "heavy boots / ski boots"],
    ["rain-boots", "gli stivali da pioggia", "rain boots"], ["boots", "gli stivali", "boots"],
    ["skis", "gli sci", "skis", "equipment"], ["tennis-racket", "la racchetta da tennis", "tennis racket", "equipment"],
    ["wear-carry", "portare", "to wear / carry"], ["wear", "indossare", "to wear"],
    ["put-on", "mettersi", "to put on"], ["put-on-command", "Metti…!", "Put on…!"], ["take-command", "Prendi…!", "Take…!"]
  ].map(([id, italian, english, subgroup = "clothing"]) => entry(`clothing-${id}`, italian, english, subgroup, subgroup === "equipment" ? "Sports Equipment" : "Clothing"));

  const WEATHER = [
    ["weather", "il tempo", "weather / time"], ["fog", "c’è nebbia", "it is foggy"], ["snow", "c’è neve", "there is snow"],
    ["clear", "è sereno", "it is clear"], ["muggy", "è afoso / c’è afa", "it is muggy / hot and humid"],
    ["cloudy", "è nuvoloso", "it is cloudy"], ["nice", "fa bel tempo", "nice weather"],
    ["bad", "fa brutto tempo / fa brutto", "bad weather"], ["cool", "fa fresco", "it is cool"],
    ["cold", "fa freddo", "it is cold"], ["hot", "fa caldo", "it is hot"], ["snowing", "nevica", "it is snowing"],
    ["raining", "piove", "it is raining"], ["windy", "c’è vento / tira vento", "it is windy"],
    ["very-windy", "Tira molto vento!", "it is very windy"], ["sunny", "c’è il sole", "it is sunny"],
    ["sunbathe", "prendere il sole", "to sunbathe"], ["beach", "la spiaggia", "beach"],
    ["flower", "il fiore / i fiori", "flower / flowers"], ["park", "il parco", "park"]
  ].map(([id, italian, english]) => entry(`weather-${id}`, italian, english, "weather", "Weather"));

  const SEASONS = [
    entry("season-season", "la stagione", "season", "seasons", "Seasons"),
    entry("season-winter", "l’inverno", "winter", "seasons", "Seasons"),
    entry("season-spring", "la primavera", "spring", "seasons", "Seasons"),
    entry("season-summer", "l’estate", "summer", "seasons", "Seasons"),
    entry("season-fall", "l’autunno", "fall / autumn", "seasons", "Seasons")
  ];

  const SPORTS = [
    ["sport", "lo sport", "sport"], ["boating", "andare in barca", "to go boating"], ["sailing", "andare in barca a vela", "to go sailing"],
    ["bike", "andare in bicicletta", "to ride a bicycle"], ["run", "correre", "to run"], ["go-run", "fare una corsa", "to go for a run"],
    ["mountaineer", "fare alpinismo", "to go mountaineering"], ["dip", "fare il bagno", "to go swimming / take a dip"],
    ["cycle", "fare ciclismo", "to cycle"], ["race", "fare una gara", "to compete / race"],
    ["gymnastics", "fare ginnastica", "to exercise / do gymnastics"], ["baseball", "giocare a baseball", "to play baseball"],
    ["soccer", "giocare a calcio", "to play soccer"], ["basketball", "giocare a pallacanestro", "to play basketball"],
    ["volleyball", "giocare a pallavolo", "to play volleyball"], ["tennis", "giocare a tennis", "to play tennis"],
    ["swim", "nuotare", "to swim"], ["ice-skate", "pattinare sul ghiaccio", "to ice-skate"],
    ["physical", "fare attività fisica", "to exercise"], ["ski", "sciare", "to ski"], ["fit", "tenersi in forma", "to keep fit"],
    ["practice-sport", "praticare uno sport", "to practice / play a sport"], ["match", "la partita", "match / game"],
    ["team", "la squadra", "team"], ["pool", "la piscina", "swimming pool"], ["ball", "il pallone", "ball", "equipment"],
    ["bicycle", "la bicicletta", "bicycle", "equipment"], ["swimming", "il nuoto", "swimming"], ["soccer-noun", "il calcio", "soccer"],
    ["cycling", "il ciclismo", "cycling"], ["tennis-noun", "il tennis", "tennis"], ["volleyball-noun", "la pallavolo", "volleyball"],
    ["basketball-noun", "la pallacanestro", "basketball"], ["baseball-noun", "il baseball", "baseball"],
    ["mountaineering", "l’alpinismo", "mountaineering"], ["sailing-noun", "la vela", "sailing"],
    ["skiing", "lo sci", "skiing"], ["ice", "il ghiaccio", "ice"], ["sea", "il mare", "sea"],
    ["player", "il calciatore", "soccer player"], ["cycling-race", "la gara di ciclismo", "cycling race"]
  ].map(([id, italian, english, subgroup = "sports"]) => entry(`sport-${id}`, italian, english, subgroup, subgroup === "equipment" ? "Sports Equipment" : "Sports"));
  const SPORTS_EQUIPMENT = [...CLOTHING, ...SPORTS].filter((item) => item.groups.includes("equipment"));

  const DAILY_ROUTINE = [
    ["toothbrush", "lo spazzolino", "toothbrush"], ["toothpaste", "il dentifricio", "toothpaste"],
    ["tooth-teeth", "il dente / i denti", "tooth / teeth"], ["hand-hands", "la mano / le mani", "hand / hands"],
    ["hair", "i capelli", "hair"], ["party", "la festa", "party"], ["tired", "stanco/a", "tired"],
    ["headache", "Ho mal di testa", "I have a headache"], ["go-home", "devo andare a casa", "I have to go home"],
    ["energy", "avere tanta energia", "to have lots of energy"], ["before", "prima di + infinitive", "before doing something"],
    ["after-class", "dopo le lezioni", "after classes"], ["week", "durante la settimana", "during the week"]
  ].map(([id, italian, english]) => entry(`routine-${id}`, italian, english, "daily-routine", "Daily Routine"));

  const forms = (io, tu, luiLei, noi, voi, loro) => ({ io, tu, "lui/lei/Lei": luiLei, noi, voi, loro });
  const reflexive = (id, infinitive, english, type, conjugation) => ({
    id: `reflexive-${id}`, infinitive, italian: infinitive, english, type, conjugationType: type, forms: conjugation,
    groups: ["reflexive"], tag: "Reflexive Verb", acceptedItalian: [infinitive], acceptedEnglish: splitMeanings(english)
  });
  const REFLEXIVE_VERBS = [
    reflexive("sleep", "addormentarsi", "to fall asleep", "reflexive", forms("mi addormento", "ti addormenti", "si addormenta", "ci addormentiamo", "vi addormentate", "si addormentano")),
    reflexive("wake", "svegliarsi", "to wake up", "reflexive", forms("mi sveglio", "ti svegli", "si sveglia", "ci svegliamo", "vi svegliate", "si svegliano")),
    reflexive("train", "allenarsi", "to train / practice a sport", "reflexive", forms("mi alleno", "ti alleni", "si allena", "ci alleniamo", "vi allenate", "si allenano")),
    reflexive("rise", "alzarsi", "to get up", "reflexive", forms("mi alzo", "ti alzi", "si alza", "ci alziamo", "vi alzate", "si alzano")),
    reflexive("sit", "sedersi", "to sit down", "irregular reflexive", forms("mi siedo", "ti siedi", "si siede", "ci sediamo", "vi sedete", "si siedono")),
    reflexive("bored", "annoiarsi", "to get bored", "reflexive", forms("mi annoio", "ti annoi", "si annoia", "ci annoiamo", "vi annoiate", "si annoiano")),
    reflexive("fun", "divertirsi", "to have fun / enjoy oneself", "reflexive", forms("mi diverto", "ti diverti", "si diverte", "ci divertiamo", "vi divertite", "si divertono")),
    reflexive("called", "chiamarsi", "to be called", "reflexive / reciprocal", forms("mi chiamo", "ti chiami", "si chiama", "ci chiamiamo", "vi chiamate", "si chiamano")),
    reflexive("feel-well", "sentirsi bene", "to feel well", "reflexive", forms("mi sento bene", "ti senti bene", "si sente bene", "ci sentiamo bene", "vi sentite bene", "si sentono bene")),
    reflexive("feel-ill", "sentirsi male", "to feel ill", "reflexive", forms("mi sento male", "ti senti male", "si sente male", "ci sentiamo male", "vi sentite male", "si sentono male")),
    reflexive("tired", "stancarsi", "to get tired", "reflexive", forms("mi stanco", "ti stanchi", "si stanca", "ci stanchiamo", "vi stancate", "si stancano")),
    reflexive("rest", "riposarsi", "to rest", "reflexive", forms("mi riposo", "ti riposi", "si riposa", "ci riposiamo", "vi riposate", "si riposano")),
    reflexive("dress", "vestirsi", "to get dressed", "reflexive", forms("mi vesto", "ti vesti", "si veste", "ci vestiamo", "vi vestite", "si vestono")),
    reflexive("undress-spogliare", "spogliarsi", "to get undressed", "reflexive", forms("mi spoglio", "ti spogli", "si spoglia", "ci spogliamo", "vi spogliate", "si spogliano")),
    reflexive("undress-svestire", "svestirsi", "to get undressed", "reflexive", forms("mi svesto", "ti svesti", "si sveste", "ci svestiamo", "vi svestite", "si svestono")),
    reflexive("put-on", "mettersi", "to put on / wear", "irregular reflexive", forms("mi metto", "ti metti", "si mette", "ci mettiamo", "vi mettete", "si mettono")),
    reflexive("wash", "lavarsi", "to wash oneself", "reflexive", forms("mi lavo", "ti lavi", "si lava", "ci laviamo", "vi lavate", "si lavano")),
    reflexive("teeth", "lavarsi i denti", "to brush one’s teeth", "reflexive + body part", forms("mi lavo i denti", "ti lavi i denti", "si lava i denti", "ci laviamo i denti", "vi lavate i denti", "si lavano i denti")),
    reflexive("hands", "lavarsi le mani", "to wash one’s hands", "reflexive + body part", forms("mi lavo le mani", "ti lavi le mani", "si lava le mani", "ci laviamo le mani", "vi lavate le mani", "si lavano le mani")),
    reflexive("comb", "pettinarsi", "to comb one’s hair", "reflexive", forms("mi pettino", "ti pettini", "si pettina", "ci pettiniamo", "vi pettinate", "si pettinano")),
    reflexive("ready", "prepararsi", "to get ready", "reflexive", forms("mi preparo", "ti prepari", "si prepara", "ci prepariamo", "vi preparate", "si preparano")),
    reflexive("angry", "arrabbiarsi", "to get angry", "reflexive", forms("mi arrabbio", "ti arrabbi", "si arrabbia", "ci arrabbiamo", "vi arrabbiate", "si arrabbiano"))
  ];
  const ORDINARY_VERBS = [
    entry("ordinary-lavare", "lavare", "to wash something / someone", "daily-routine", "Ordinary Verb", { type: "ordinary" }),
    entry("ordinary-mettere", "mettere", "to put", "daily-routine", "Ordinary Verb", { type: "ordinary" }),
    entry("ordinary-vestire", "vestire", "to dress someone", "daily-routine", "Ordinary Verb", { type: "ordinary" }),
    entry("ordinary-pettinare", "pettinare", "to comb someone’s hair", "daily-routine", "Ordinary Verb", { type: "ordinary" })
  ];

  const reciprocal = (id, infinitive, english, formsValue) => ({
    id: `reciprocal-${id}`, infinitive, italian: infinitive, english, type: "reciprocal", forms: formsValue,
    groups: ["reciprocal"], tag: "Reciprocal Verb", acceptedItalian: [infinitive], acceptedEnglish: splitMeanings(english)
  });
  const RECIPROCAL_VERBS = [
    reciprocal("hug", "abbracciarsi", "to hug each other", { noi: "ci abbracciamo", voi: "vi abbracciate", loro: "si abbracciano" }),
    reciprocal("help", "aiutarsi", "to help each other", { noi: "ci aiutiamo", voi: "vi aiutate", loro: "si aiutano" }),
    reciprocal("meet", "incontrarsi", "to meet each other", { noi: "ci incontriamo", voi: "vi incontrate", loro: "si incontrano" }),
    reciprocal("greet", "salutarsi", "to greet each other", { noi: "ci salutiamo", voi: "vi salutate", loro: "si salutano" }),
    reciprocal("see", "vedersi", "to see each other", { noi: "ci vediamo", voi: "vi vedete", loro: "si vedono" }),
    reciprocal("reunite", "riunirsi", "to meet up / reunite", { noi: "ci riuniamo", voi: "vi riunite", loro: "si riuniscono" }),
    reciprocal("call", "chiamarsi", "to call each other", { noi: "ci chiamiamo", voi: "vi chiamate", loro: "si chiamano" }),
    reciprocal("phone", "telefonarsi", "to telephone each other", { noi: "ci telefoniamo", voi: "vi telefonate", loro: "si telefonano" }),
    reciprocal("write", "scriversi", "to write to each other", { noi: "ci scriviamo", voi: "vi scrivete", loro: "si scrivono" }),
    reciprocal("speak", "parlarsi", "to speak to each other", { noi: "ci parliamo", voi: "vi parlate", loro: "si parlano" }),
    reciprocal("notes", "scambiarsi gli appunti", "to exchange notes", { noi: "ci scambiamo gli appunti", voi: "vi scambiate gli appunti", loro: "si scambiano gli appunti" }),
    reciprocal("engaged", "fidanzarsi", "to get engaged", { noi: "ci fidanziamo", voi: "vi fidanzate", loro: "si fidanzano" }),
    reciprocal("marry", "sposarsi", "to get married", { noi: "ci sposiamo", voi: "vi sposate", loro: "si sposano" }),
    reciprocal("organize", "organizzarsi", "to organize together", { noi: "ci organizziamo", voi: "vi organizzate", loro: "si organizzano" })
  ];
  const RECIPROCAL_COUNTERPARTS = [
    ["incontrare qualcuno", "to meet someone"], ["vedere qualcuno", "to see someone"], ["riunire", "to bring together"],
    ["salutare qualcuno", "to greet someone"], ["abbracciare qualcuno", "to hug someone"],
    ["telefonare a qualcuno", "to telephone someone"], ["sposare qualcuno", "to marry someone"]
  ].map(([italian, english], index) => entry(`counterpart-${index}`, italian, english, "reciprocal", "Ordinary Counterpart", { type: "ordinary" }));

  const TIME_VOCABULARY = [
    ["hour", "l’ora", "hour / time"], ["hours", "le ore", "hours"], ["minute", "il minuto", "minute"], ["minutes", "i minuti", "minutes"],
    ["noon", "mezzogiorno", "noon"], ["midnight", "mezzanotte", "midnight"], ["begin", "iniziare", "to begin"],
    ["finish", "finire", "to finish"], ["arrive", "arrivare", "to arrive"], ["leave", "partire", "to leave"],
    ["train", "il treno", "train"], ["last-train", "l’ultimo treno", "last train"], ["lunch", "il pranzo", "lunch"],
    ["dinner", "la cena", "dinner"], ["breakfast", "fare colazione", "to eat breakfast"], ["go-out", "uscire", "to go out"],
    ["while", "mentre", "while"], ["downtown", "andare in centro", "to go downtown"],
    ["shopping", "fare delle spese", "to go shopping"], ["groceries", "fare la spesa", "to grocery shop"],
    ["nightclub", "la discoteca", "nightclub"], ["morning", "di mattina", "in the morning"],
    ["afternoon", "di pomeriggio", "in the afternoon"], ["evening", "di sera", "in the evening"], ["night", "di notte", "at night"]
  ].map(([id, italian, english]) => entry(`time-${id}`, italian, english, "time", "Time"));
  const DURATION = [
    ["one-hour", "un’ora", "one hour"], ["per-day", "al giorno", "per day"], ["daily", "ogni giorno", "every day"],
    ["per-week", "alla settimana", "per week"], ["nightly", "ogni notte", "every night"],
    ["spend-doing", "passare tempo a + infinitive", "to spend time doing"],
    ["gym-time", "passare tempo in palestra", "to spend time at the gym"], ["bed", "restare a letto", "to stay in bed"],
    ["gym", "la palestra", "gym"], ["library", "la biblioteca", "library"], ["usually", "di solito", "usually"],
    ["ideally", "idealmente", "ideally"], ["not-much", "Non molto", "not much"],
    ["next-week", "la prossima settimana", "next week"], ["maybe", "magari", "maybe / perhaps"],
    ["sunshine", "un po’ di sole", "a bit of sunshine"]
  ].map(([id, italian, english]) => entry(`duration-${id}`, italian, english, "duration", "Duration"));

  const CULTURE_VOCABULARY = [
    ["piemonte", "il Piemonte", "Piedmont"], ["aosta", "la Valle d’Aosta", "Aosta Valley"], ["region", "la regione", "region"],
    ["torino", "Torino", "Turin"], ["monte-bianco", "Monte Bianco", "Mont Blanc"],
    ["venaria", "La Venaria Reale", "Venaria Reale royal palace"], ["piazza-castello", "Piazza Castello", "Castle Square"],
    ["piazza-chanoux", "Piazza Chanoux", "Chanoux Square"], ["savoy", "i Savoia", "the House of Savoy / Savoy family"],
    ["castle", "il castello", "castle"], ["tower", "la torre", "tower"], ["valley", "la valle", "valley"],
    ["mountain", "la montagna", "mountain"], ["palace", "il palazzo reale", "royal palace"], ["garden", "il giardino", "garden"],
    ["province", "la provincia", "province"], ["square", "la piazza", "square"], ["historic", "storico/a", "historic"],
    ["near", "vicino/a", "near"], ["cathedral", "il duomo", "cathedral"], ["shroud", "la Sacra Sindone", "Holy Shroud"],
    ["alps", "le Alpi", "Alps"], ["swiss-french-alps", "le Alpi svizzere e francesi", "the Swiss and French Alps"],
    ["place", "il luogo", "place"], ["event", "l’evento sportivo", "sporting event"],
    ["landscape", "il paesaggio", "landscape"], ["knight", "il cavaliere", "knight"], ["lady", "la dama", "lady"],
    ["fortress", "la fortezza", "fortress"], ["battle", "la battaglia", "battle"]
  ].map(([id, italian, english]) => entry(`culture-${id}`, italian, english, "culture", "Culture"));

  const CATEGORY_POOLS = {
    Clothing: CLOTHING.filter((item) => !item.groups.includes("equipment")), Weather: WEATHER, Seasons: SEASONS,
    Sports: SPORTS.filter((item) => !item.groups.includes("equipment")), "Sports Equipment": SPORTS_EQUIPMENT,
    "Reflexive Verb Vocabulary": REFLEXIVE_VERBS, "Reciprocal Verb Vocabulary": RECIPROCAL_VERBS,
    "Daily Routine Vocabulary": DAILY_ROUTINE, "Time Vocabulary": TIME_VOCABULARY, "Duration Vocabulary": DURATION,
    "Culture — Piemonte & Valle d’Aosta": CULTURE_VOCABULARY
  };

  const CATEGORIES = [
    "Clothing", "Weather", "Seasons", "Sports", "Sports Equipment", "Sports + Prepositions",
    "Reflexive Verb Vocabulary", "Reciprocal Verb Vocabulary", "Daily Routine Vocabulary", "Time Vocabulary", "Duration Vocabulary",
    "Culture — Piemonte & Valle d’Aosta", "Reflexive Pronouns", "Reflexive Verb Conjugation", "Reflexive vs. Non-Reflexive",
    "Reciprocal Actions", "Reciprocal vs. Non-Reciprocal", "Telling Time", "At What Time?", "12-Hour ↔ 24-Hour Time",
    "Duration: Quanto / Quante / Molto / Molte", "Mixed Unit 4 Practice"
  ];
  const TOPIC_GROUPS = [
    { name: "Vocabulary", topics: [
      ["Clothing", "Clothes, footwear, and useful commands"], ["Weather", "Weather expressions and opposites"], ["Seasons", "Weather, clothing, and seasonal clues"],
      ["Sports", "Activities, people, and sports nouns"], ["Sports Equipment", "Skis, racket, ball, bicycle"],
      ["Reflexive Verb Vocabulary", "Daily actions and meanings"], ["Reciprocal Verb Vocabulary", "Each other / one another"],
      ["Daily Routine Vocabulary", "Body parts and routine expressions"], ["Time Vocabulary", "Clock and schedule words"],
      ["Duration Vocabulary", "Frequency and amount-of-time expressions"], ["Culture — Piemonte & Valle d’Aosta", "Lower-priority reading and recognition"]
    ] },
    { name: "Grammar / Application", topics: [
      ["Sports + Prepositions", "giocare a · andare in · sul ghiaccio"], ["Reflexive Pronouns", "mi · ti · si · ci · vi · si"],
      ["Reflexive Verb Conjugation", "Pronoun + conjugated verb"], ["Reflexive vs. Non-Reflexive", "Meaning decides whether the action returns to the subject"],
      ["Reciprocal Actions", "Plural subjects acting on each other"], ["Reciprocal vs. Non-Reciprocal", "Meaning and sentence context"],
      ["Telling Time", "È l’una · Sono le… · mezzogiorno · mezzanotte"], ["At What Time?", "all’una · alle… · a mezzogiorno"],
      ["12-Hour ↔ 24-Hour Time", "Convert in both directions"], ["Duration: Quanto / Quante / Molto / Molte", "Amount of time and agreement"],
      ["Mixed Unit 4 Practice", "Balanced practice across Unit 4"]
    ] }
  ];
  const TOPICS = TOPIC_GROUPS.flatMap((group) => group.topics.map(([topic]) => topic));
  const PRESETS = {
    vocab: ["Clothing", "Weather", "Seasons", "Sports", "Sports Equipment", "Reflexive Verb Vocabulary", "Reciprocal Verb Vocabulary", "Daily Routine Vocabulary", "Time Vocabulary", "Duration Vocabulary"],
    reflexive: ["Reflexive Verb Vocabulary", "Reflexive Pronouns", "Reflexive Verb Conjugation", "Reflexive vs. Non-Reflexive"],
    reciprocal: ["Reciprocal Verb Vocabulary", "Reciprocal Actions", "Reciprocal vs. Non-Reciprocal"],
    time: ["Time Vocabulary", "Telling Time", "At What Time?", "12-Hour ↔ 24-Hour Time", "Duration Vocabulary", "Duration: Quanto / Quante / Molto / Molte"],
    everything: [...TOPICS]
  };
  const PRESET_LABELS = { vocab: "Vocabulary", reflexive: "Reflexive", reciprocal: "Reciprocal", time: "Time + Duration", everything: "Everything" };
  const MATCHING_CATEGORIES = [
    "Clothing", "Weather", "Seasons", "Sports", "Sports Equipment", "Reflexive Verb Vocabulary", "Reciprocal Verb Vocabulary",
    "Daily Routine Vocabulary", "Time Vocabulary", "Duration Vocabulary", "Culture — Piemonte & Valle d’Aosta", "Reflexive Pronouns",
    "Reflexive Verb Conjugation", "Reciprocal Actions", "Telling Time", "At What Time?", "12-Hour ↔ 24-Hour Time"
  ];

  const WEATHER_CLOTHING = [
    ["Fa freddo e nevica. Cosa metti?", "gli scarponi", ["i pantaloni da neve", "i guanti"]],
    ["Piove e tira vento. Cosa metti?", "l’impermeabile", ["gli stivali da pioggia", "la giacca a vento"]],
    ["Fa caldo e c’è il sole. Cosa porti?", "gli occhiali da sole", ["il costume da bagno", "i sandali"]]
  ];
  const SEASON_CONTEXTS = [
    ["Nevica spesso.", "l’inverno"], ["Costume da bagno + sandali.", "l’estate"],
    ["Fiori nel parco.", "la primavera"], ["Impermeabile + stivali da pioggia.", "l’autunno"]
  ];
  const SPORTS_PREPOSITIONS = [
    ["giocare ___ tennis", "a", "Use giocare A with a sport."], ["giocare ___ calcio", "a", "Use giocare A with a sport."],
    ["giocare ___ pallacanestro", "a", "Use giocare A with a sport."], ["giocare ___ pallavolo", "a", "Use giocare A with a sport."],
    ["andare ___ bicicletta", "in", "Use andare IN bicicletta."], ["andare ___ barca", "in", "Use andare IN barca."],
    ["pattinare ___ ghiaccio", "sul", "Use SUL ghiaccio (su + il)."]
  ].map(([prompt, answer, explanation], index) => ({ id: `sports-prep-${index}`, prompt, answer, explanation }));

  const REFLEXIVE_CONTEXTS = [
    ["alzarsi", "loro", "I ragazzi ______ presto."], ["alzarsi", "voi", "Tu e Paolo ______ alle sette."],
    ["svegliarsi", "io", "Io non ______ tardi."], ["lavarsi i denti", "io", "Ogni mattina ______."],
    ["lavarsi le mani", "noi", "Prima di cena ______."], ["mettersi", "lui/lei/Lei", "Sabrina ______ il maglione."],
    ["divertirsi", "noi", "Alla festa noi ______ molto."], ["sedersi", "loro", "Gli studenti ______ in classe."]
  ].map(([infinitive, subject, prompt], index) => ({ id: `reflexive-context-${index}`, infinitive, subject, prompt }));
  const REFLEXIVE_CONTRASTS = [
    ["wash-car", "Noi laviamo la macchina.", "non-reflexive", "We wash the car; the action goes to another object."],
    ["wash-hands", "Noi ci laviamo le mani.", "reflexive", "We wash our own hands; CI returns the action to NOI."],
    ["put-suitcase", "Sabrina mette la giacca in valigia.", "non-reflexive", "She puts the jacket somewhere; she is not putting it on."],
    ["put-sweater", "Sabrina si mette il maglione.", "reflexive", "She puts the sweater on herself."],
    ["dress-children", "La mamma veste i bambini.", "non-reflexive", "The mother dresses someone else."],
    ["dress-self", "La mamma si veste.", "reflexive", "The mother gets herself dressed."]
  ].map(([id, prompt, answer, explanation]) => ({ id: `reflexive-contrast-${id}`, prompt, answer, explanation }));
  const RECIPROCAL_CONTEXTS = [
    ["Tu e Roberto telefonate a Claudia.", "non-reciprocal", "The action goes to Claudia, not to each other."],
    ["Io e Cristina ci telefoniamo.", "reciprocal", "The plural subject members telephone each other."],
    ["Cristina sposa Alberto.", "non-reciprocal", "One subject marries another person; there is no reciprocal pronoun."],
    ["Cristina e Alberto si sposano.", "reciprocal", "The plural subject members marry each other."],
    ["Roberto e Sabrina salutano Cristina.", "non-reciprocal", "They greet Cristina, not each other."],
    ["Roberto e Sabrina si salutano.", "reciprocal", "They greet each other."],
    ["Tu vedi un film.", "non-reciprocal", "A singular subject sees a film."],
    ["Noi ci vediamo.", "reciprocal", "NOI + CI means we see each other."]
  ].map(([prompt, answer, explanation], index) => ({ id: `reciprocal-contrast-${index}`, prompt, answer, explanation }));

  const CULTURE_FACTS = [
    ["Piemonte means “foot of the mountain.”", "vero"], ["The course associates Piemonte with Fiat, Juventus, Torino, Nutella, and spumante.", "vero"],
    ["Valle d’Aosta is described as Italy’s largest region.", "falso"], ["The course reading says Valle d’Aosta has more than 100 castles.", "vero"],
    ["The course passage describes Monte Bianco as Europe’s highest mountain.", "vero"],
    ["La Venaria Reale is a royal palace with gardens near Torino.", "vero"], ["Piazza Castello is an important square in Torino.", "vero"],
    ["Piazza Chanoux is in Aosta and is used for sporting events.", "vero"]
  ].map(([prompt, answer], index) => ({ id: `culture-fact-${index}`, prompt, answer }));

  const twoDigits = (value) => String(value).padStart(2, "0");
  const HOUR_WORDS = { 1: "l’una", 2: "le due", 3: "le tre", 4: "le quattro", 5: "le cinque", 6: "le sei", 7: "le sette", 8: "le otto", 9: "le nove", 10: "le dieci", 11: "le undici", 12: "le dodici" };
  const MINUTE_WORDS = { 0: "", 5: "e cinque", 10: "e dieci", 15: "e un quarto", 20: "e venti", 25: "e venticinque", 30: "e mezzo", 35: "e trentacinque", 40: "e quaranta", 45: "e quarantacinque", 50: "e cinquanta", 55: "e cinquantacinque" };
  const timePrefix = (hour) => hour === 1 ? "È" : "Sono";
  function italianTime(hour, minute) {
    if (hour === 12 && minute === 0) return ["È mezzogiorno."];
    if (hour === 0 && minute === 0) return ["È mezzanotte."];
    const h12 = hour % 12 || 12;
    const standard = `${timePrefix(h12)} ${HOUR_WORDS[h12]}${minute ? ` ${MINUTE_WORDS[minute]}` : ""}.`;
    const answers = [standard];
    if (minute === 15) answers.push(`${timePrefix(h12)} ${HOUR_WORDS[h12]} e quindici.`);
    if (minute === 30) answers.push(`${timePrefix(h12)} ${HOUR_WORDS[h12]} e trenta.`);
    if ([40, 45, 50, 55].includes(minute)) {
      const next = (h12 % 12) + 1;
      const remaining = 60 - minute;
      const phrase = remaining === 15 ? "meno un quarto" : remaining === 10 ? "meno dieci" : remaining === 20 ? "meno venti" : "meno cinque";
      answers.push(`${timePrefix(next)} ${HOUR_WORDS[next]} ${phrase}.`);
    }
    return answers;
  }

  function vocabularyQuestion(category, sourceId, direction) {
    const pool = CATEGORY_POOLS[category];
    const item = choose(pool, sourceId);
    const toEnglish = directionToEnglish(direction);
    const answer = toEnglish ? item.english : item.italian;
    const question = baseQuestion(category, item.id, `u4-vocab:${item.id}:${toEnglish ? "en" : "it"}`,
      toEnglish ? "Translate into English" : "Translate into Italian", toEnglish ? item.italian : item.english, answer,
      `${item.italian} means “${item.english}.”`, pool.filter((candidate) => candidate.id !== item.id).map((candidate) => toEnglish ? candidate.english : candidate.italian),
      toEnglish ? item.acceptedEnglish : item.acceptedItalian);
    question.isVocabularyTranslation = true;
    question.translationDirection = toEnglish ? "it-en" : "en-it";
    return question;
  }

  function clothingQuestion(sourceId, direction) {
    if (!sourceId && Math.random() < 0.32) {
      const [prompt, answer, alternates] = random(WEATHER_CLOTHING);
      return baseQuestion("Clothing", `clothing-context-${answer}`, `u4-clothing-context:${answer}`, "Choose logical clothing for the weather", prompt, answer,
        `${answer} is logical for this weather. Other sensible course answers include ${alternates.join(" and ")}.`,
        CLOTHING.filter((item) => item.italian !== answer && !alternates.includes(item.italian)).map((item) => item.italian), [answer, ...alternates]);
    }
    return vocabularyQuestion("Clothing", sourceId, direction);
  }

  function weatherQuestion(sourceId, direction) {
    const opposites = { "weather-clear": "è nuvoloso", "weather-cloudy": "è sereno", "weather-hot": "fa freddo", "weather-cold": "fa caldo", "weather-nice": "fa brutto tempo", "weather-bad": "fa bel tempo" };
    const requested = WEATHER.find((item) => item.id === sourceId);
    const item = requested || random(WEATHER);
    if ((!sourceId || requested) && opposites[item.id] && Math.random() < 0.45) {
      return baseQuestion("Weather", item.id, `u4-weather-opposite:${item.id}`, "Choose the weather opposite", item.italian, opposites[item.id],
        `${opposites[item.id]} is the course opposite of ${item.italian}.`, WEATHER.map((weather) => weather.italian).filter((value) => value !== opposites[item.id]));
    }
    return vocabularyQuestion("Weather", item.id, direction);
  }

  function seasonQuestion(sourceId, direction) {
    if (!sourceId && Math.random() < 0.62) {
      const [prompt, answer] = random(SEASON_CONTEXTS);
      return baseQuestion("Seasons", `season-context-${answer}`, `u4-season-context:${answer}`, "Identify the season from the clue", prompt, answer,
        `The clue points to ${answer}.`, SEASONS.filter((item) => item.id !== "season-season" && item.italian !== answer).map((item) => item.italian));
    }
    return vocabularyQuestion("Seasons", sourceId, direction);
  }

  function sportsPrepositionQuestion(sourceId) {
    const item = choose(SPORTS_PREPOSITIONS, sourceId);
    return baseQuestion("Sports + Prepositions", item.id, `u4-${item.id}`, "Complete the sports expression", item.prompt, item.answer, item.explanation,
      ["a", "in", "sul", "con", "per"].filter((value) => value !== item.answer));
  }

  function reflexivePronounQuestion(sourceId) {
    const subject = SUBJECTS.includes(sourceId) ? sourceId : random(SUBJECTS);
    const answer = REFLEXIVE_PRONOUNS[subject];
    return baseQuestion("Reflexive Pronouns", subject, `u4-reflexive-pronoun:${subject}`, "Choose the matching reflexive pronoun", `${subject} → ___`, answer,
      `${subject.toUpperCase()} uses ${answer.toUpperCase()}. The pronoun comes before the conjugated verb.`, [...new Set(Object.values(REFLEXIVE_PRONOUNS))].filter((value) => value !== answer));
  }

  function reflexiveConjugationQuestion(sourceId) {
    const [requestedId, requestedSubject] = String(sourceId || "").split("#");
    const item = REFLEXIVE_VERBS.find((verb) => verb.id === requestedId || verb.infinitive === requestedId) || random(REFLEXIVE_VERBS);
    const subject = SUBJECTS.includes(requestedSubject) ? requestedSubject : random(SUBJECTS);
    const contexts = REFLEXIVE_CONTEXTS.filter((context) => context.infinitive === item.infinitive && context.subject === subject);
    const context = contexts.length && Math.random() < 0.62 ? random(contexts) : null;
    const answer = item.forms[subject];
    const pronoun = REFLEXIVE_PRONOUNS[subject];
    const negative = item.infinitive === "svegliarsi" && subject === "io" && context;
    const explanation = negative
      ? `NON comes before the reflexive pronoun: non + ${pronoun} + sveglio. Therefore: Non ${answer} tardi.`
      : `${subject.toUpperCase()} uses reflexive pronoun ${pronoun.toUpperCase()}. The verb form completes ${answer}. Therefore: ${answer}.`;
    const question = baseQuestion("Reflexive Verb Conjugation", item.id, `u4-reflexive-conjugation:${item.id}:${subject}:${context ? "context" : "direct"}`,
      context ? `Complete with ${item.infinitive}` : `Conjugate ${item.infinitive}`, context?.prompt || `${subject} — ${item.infinitive}`, answer, explanation,
      Object.values(item.forms).filter((value) => value !== answer));
    question.reviewSourceId = `${item.id}#${subject}`;
    return question;
  }

  function reflexiveContrastQuestion(sourceId) {
    const item = choose(REFLEXIVE_CONTRASTS, sourceId);
    return baseQuestion("Reflexive vs. Non-Reflexive", item.id, `u4-${item.id}`, "Decide from the sentence meaning", item.prompt, item.answer, item.explanation,
      item.answer === "reflexive" ? ["non-reflexive"] : ["reflexive"]);
  }

  function reciprocalActionQuestion(sourceId) {
    const [requestedId, requestedSubject] = String(sourceId || "").split("#");
    const item = RECIPROCAL_VERBS.find((verb) => verb.id === requestedId || verb.infinitive === requestedId) || random(RECIPROCAL_VERBS);
    const subject = ["noi", "voi", "loro"].includes(requestedSubject) ? requestedSubject : random(["noi", "voi", "loro"]);
    const answer = item.forms[subject];
    const explanation = item.infinitive === "riunirsi" && subject === "loro"
      ? `Reciprocal actions require a plural subject. LORO uses SI, and riunirsi uses -isc here: ${answer}.`
      : `Reciprocal actions mean “each other.” ${subject.toUpperCase()} uses ${REFLEXIVE_PRONOUNS[subject].toUpperCase()}: ${answer}.`;
    const question = baseQuestion("Reciprocal Actions", item.id, `u4-reciprocal:${item.id}:${subject}`, "Conjugate the reciprocal action", `${subject} — ${item.infinitive}`, answer, explanation,
      Object.values(item.forms).filter((value) => value !== answer));
    question.reviewSourceId = `${item.id}#${subject}`;
    return question;
  }

  function reciprocalContrastQuestion(sourceId) {
    const item = choose(RECIPROCAL_CONTEXTS, sourceId);
    return baseQuestion("Reciprocal vs. Non-Reciprocal", item.id, `u4-${item.id}`, "Does the sentence describe an each-other action?", item.prompt, item.answer,
      item.explanation, item.answer === "reciprocal" ? ["non-reciprocal"] : ["reciprocal"]);
  }

  function tellingTimeQuestion(sourceId) {
    let hour;
    let minute;
    if (sourceId?.startsWith("time-")) [, hour, minute] = sourceId.split("-").map(Number);
    hour = Number.isInteger(hour) ? hour : random([0, 1, 2, 4, 5, 9, 11, 12, 13, 16, 21, 23]);
    minute = Number.isInteger(minute) ? minute : random([0, 5, 10, 15, 20, 30, 40, 45, 50]);
    const accepted = italianTime(hour, minute);
    const answer = accepted[0];
    const display = `${twoDigits(hour)}:${twoDigits(minute)}`;
    const distractors = [
      italianTime((hour + 1) % 24, minute)[0], italianTime(hour, (minute + 15) % 60)[0],
      hour % 12 === 1 ? answer.replace("È", "Sono") : answer.replace("Sono", "È")
    ];
    return baseQuestion("Telling Time", `time-${hour}-${minute}`, `u4-time:${hour}:${minute}`, "Write or choose the time in Italian", display, answer,
      hour % 12 === 1 ? `For 1:xx use È l’una. ${answer}` : hour === 0 && minute === 0 ? "Midnight is È mezzanotte." : hour === 12 && minute === 0 ? "Noon is È mezzogiorno." : `For hours other than one, use Sono le…. ${answer}`,
      distractors, accepted);
  }

  function atWhatTimeQuestion(sourceId) {
    const hour = sourceId?.startsWith("at-") ? Number(sourceId.split("-")[1]) : random([0, 1, 2, 4, 7, 9, 12, 15, 21]);
    const answer = hour === 0 ? "a mezzanotte" : hour === 12 ? "a mezzogiorno" : hour % 12 === 1 ? "all’una" : `alle ${HOUR_WORDS[hour % 12 || 12].replace(/^le\s+/, "")}`;
    const event = random(["inizia la partita", "arriva il treno", "finisce la lezione", "partiamo"]);
    return baseQuestion("At What Time?", `at-${hour}`, `u4-at-time:${hour}`, "Answer A che ora…?", `A che ora ${event}? (${twoDigits(hour)}:00)`, answer,
      hour % 12 === 1 ? "Use ALL’UNA for one o’clock." : hour === 0 || hour === 12 ? `Use ${answer} for this special time.` : "Use ALLE before hours other than one.",
      ["all’una", "alle due", "alle nove", "a mezzogiorno", "a mezzanotte"].filter((value) => value !== answer));
  }

  function clock24Question(sourceId) {
    const parts = String(sourceId || "").match(/^clock-(\d+)-(\d+)-(forward|reverse)$/);
    const hour24 = parts ? Number(parts[1]) : random([0, 2, 9, 12, 14, 16, 21, 23]);
    const minute = parts ? Number(parts[2]) : random([0, 15, 30, 45, 50]);
    const reverse = parts ? parts[3] === "reverse" : Math.random() < 0.5;
    const hour12 = hour24 % 12 || 12;
    const period = hour24 >= 12 ? "PM" : "AM";
    const time12 = `${hour12}:${twoDigits(minute)} ${period}`;
    const time24 = `${twoDigits(hour24)}:${twoDigits(minute)}`;
    const answer = reverse ? time12 : time24;
    const display = reverse ? time24 : time12;
    const near = [((hour24 + 1) % 24), ((hour24 + 12) % 24), ((hour24 + 23) % 24)].map((hour) => reverse
      ? `${hour % 12 || 12}:${twoDigits(minute)} ${hour >= 12 ? "PM" : "AM"}` : `${twoDigits(hour)}:${twoDigits(minute)}`);
    const question = baseQuestion("12-Hour ↔ 24-Hour Time", `clock-${hour24}-${minute}`, `u4-clock:${hour24}:${minute}:${reverse}`, reverse ? "Convert to the 12-hour clock" : "Convert to the 24-hour clock", display, answer,
      reverse ? `${time24} is ${time12}.` : `${time12} is ${time24}.`, near);
    question.reviewSourceId = `clock-${hour24}-${minute}-${reverse ? "forward" : "reverse"}`;
    return question;
  }

  function durationGrammarQuestion(sourceId) {
    const prompts = [
      ["quanto", "___ tempo studi ogni giorno?", "Quanto", "TEMPO is masculine singular, so use quanto tempo."],
      ["quante", "___ ore studi alla settimana?", "Quante", "ORE is feminine plural, so use quante ore."],
      ["molto", "Passo ___ tempo in biblioteca.", "molto", "TEMPO is masculine singular, so use molto tempo."],
      ["molte", "Studio per ___ ore.", "molte", "ORE is feminine plural, so use molte ore."],
      ["amount", "Quanto tempo studi ogni giorno?", "tre ore", "Quanto tempo asks for an amount of time, not a location or clock time.", ["molto tempo", "molte ore", "Non molto"]]
    ].map(([id, prompt, answer, explanation, accepted]) => ({ id: `duration-grammar-${id}`, prompt, answer, explanation, accepted }));
    const item = choose(prompts, sourceId);
    const accepted = item.accepted ? [item.answer, ...item.accepted] : [item.answer];
    return baseQuestion("Duration: Quanto / Quante / Molto / Molte", item.id, `u4-${item.id}`, "Complete or answer the duration question", item.prompt, item.answer,
      item.explanation, ["Quanto", "Quante", "molto", "molte", "in biblioteca", "a mezzogiorno"].filter((value) => !accepted.includes(value)), accepted);
  }

  function cultureQuestion(sourceId) {
    if (sourceId?.startsWith("culture-fact-") || Math.random() < 0.68) {
      const item = choose(CULTURE_FACTS, sourceId);
      const question = baseQuestion("Culture — Piemonte & Valle d’Aosta", item.id, `u4-${item.id}`, "Read the course-supported statement", item.prompt, item.answer,
        item.answer === "vero" ? "This statement matches the Unit 4 course reading." : "This statement contradicts the Unit 4 course reading.", ["vero", "falso"]);
      question.forceChoice = true;
      return question;
    }
    return vocabularyQuestion("Culture — Piemonte & Valle d’Aosta", sourceId, "mixed");
  }

  const MIXED_CATEGORIES = CATEGORIES.filter((category) => !["Mixed Unit 4 Practice", "Culture — Piemonte & Valle d’Aosta"].includes(category));
  function makeQuestion(category, sourceId, unit1Data, vocabularyDirection = "mixed") {
    if (category === "Mixed Unit 4 Practice") return makeQuestion(random(MIXED_CATEGORIES), sourceId, unit1Data, vocabularyDirection);
    if (category === "Clothing") return clothingQuestion(sourceId, vocabularyDirection);
    if (category === "Weather") return weatherQuestion(sourceId, vocabularyDirection);
    if (category === "Seasons") return seasonQuestion(sourceId, vocabularyDirection);
    if (["Sports", "Sports Equipment", "Reflexive Verb Vocabulary", "Reciprocal Verb Vocabulary", "Daily Routine Vocabulary", "Time Vocabulary", "Duration Vocabulary"].includes(category)) return vocabularyQuestion(category, sourceId, vocabularyDirection);
    if (category === "Culture — Piemonte & Valle d’Aosta") return cultureQuestion(sourceId);
    if (category === "Sports + Prepositions") return sportsPrepositionQuestion(sourceId);
    if (category === "Reflexive Pronouns") return reflexivePronounQuestion(sourceId);
    if (category === "Reflexive Verb Conjugation") return reflexiveConjugationQuestion(sourceId);
    if (category === "Reflexive vs. Non-Reflexive") return reflexiveContrastQuestion(sourceId);
    if (category === "Reciprocal Actions") return reciprocalActionQuestion(sourceId);
    if (category === "Reciprocal vs. Non-Reciprocal") return reciprocalContrastQuestion(sourceId);
    if (category === "Telling Time") return tellingTimeQuestion(sourceId);
    if (category === "At What Time?") return atWhatTimeQuestion(sourceId);
    if (category === "12-Hour ↔ 24-Hour Time") return clock24Question(sourceId);
    return durationGrammarQuestion(sourceId);
  }

  function makeMatchingQuestion(category) {
    let pairs;
    if (CATEGORY_POOLS[category]) pairs = shuffle(CATEGORY_POOLS[category]).slice(0, 5).map((item) => ({ left: item.italian, right: item.english, sourceId: item.id }));
    else if (category === "Reflexive Pronouns") pairs = SUBJECTS.map((subject) => ({ left: subject, right: REFLEXIVE_PRONOUNS[subject], sourceId: subject })).slice(0, 5);
    else if (category === "Reflexive Verb Conjugation") pairs = shuffle(REFLEXIVE_VERBS.flatMap((item) => SUBJECTS.map((subject) => ({ left: `${item.infinitive} — ${subject}`, right: item.forms[subject], sourceId: item.id })))).slice(0, 5);
    else if (category === "Reciprocal Actions") pairs = shuffle(RECIPROCAL_VERBS.flatMap((item) => ["noi", "voi", "loro"].map((subject) => ({ left: `${item.infinitive} — ${subject}`, right: item.forms[subject], sourceId: item.id })))).slice(0, 5);
    else if (category === "Telling Time") pairs = shuffle([[1, 0], [2, 15], [4, 45], [9, 30], [12, 0], [0, 0]]).slice(0, 5).map(([hour, minute]) => ({ left: `${twoDigits(hour)}:${twoDigits(minute)}`, right: italianTime(hour, minute)[0], sourceId: `time-${hour}-${minute}` }));
    else if (category === "At What Time?") pairs = [[1, "all’una"], [2, "alle due"], [9, "alle nove"], [12, "a mezzogiorno"], [0, "a mezzanotte"]].map(([hour, right]) => ({ left: `${twoDigits(hour)}:00`, right, sourceId: `at-${hour}` }));
    else if (category === "12-Hour ↔ 24-Hour Time") pairs = [[4, 15, 16], [9, 50, 21], [2, 30, 14], [11, 0, 23], [12, 0, 12]].map(([hour, minute, hour24]) => ({ left: `${hour}:${twoDigits(minute)} PM`, right: `${twoDigits(hour24)}:${twoDigits(minute)}`, sourceId: `clock-${hour24}-${minute}` }));
    else pairs = shuffle(SPORTS_PREPOSITIONS).slice(0, 5).map((item) => ({ left: item.prompt, right: item.answer, sourceId: item.id }));
    return { type: "matching", category, sourceId: `matching:${category}`, id: `u4-matching:${category}:${pairs.map((pair) => pair.left).join("-")}`,
      kicker: "Match the pairs", display: category, pairs, explanation: "Review each Unit 4 pair before continuing." };
  }

  const LEARN_CARDS = {
    "Reflexive Pronouns": { title: "Reflexive Pronouns", rule: "A reflexive action returns to the subject. Put the reflexive pronoun BEFORE the conjugated verb.", chart: SUBJECTS.map((subject) => [subject, REFLEXIVE_PRONOUNS[subject]]), examples: ["Io mi lavo. — I wash myself.", "Noi ci prepariamo.", "Loro si vestono."], mistake: "The order is pronoun + verb: mi lavo, not lavo mi.", tryOne: "tu →", tryAnswer: "ti" },
    "Reflexive Conjugation": { title: "Reflexive Verb Conjugation", rule: "Conjugate the base verb normally, then add the matching reflexive pronoun before it.", chart: [["alzarsi", "mi alzo · ti alzi · si alza · ci alziamo · vi alzate · si alzano"], ["mettersi", "mi metto · ti metti · si mette · ci mettiamo · vi mettete · si mettono"], ["divertirsi", "mi diverto · ti diverti · si diverte · ci divertiamo · vi divertite · si divertono"], ["sedersi — irregular", "mi siedo · ti siedi · si siede · ci sediamo · vi sedete · si siedono"]], examples: ["Tu e Paolo = voi → vi alzate.", "I ragazzi si alzano presto."], mistake: "For negatives, NON comes first: Non mi sveglio tardi—not Mi non sveglio.", tryOne: "loro — alzarsi →", tryAnswer: "si alzano" },
    "Body Parts": { title: "Reflexive Actions + Body Parts", rule: "Use the definite article with body parts in this course pattern—not a possessive adjective.", chart: [["teeth", "Mi lavo i denti."], ["hands", "Ci laviamo le mani."], ["hair", "Mi pettino i capelli."]], examples: ["mi lavo i denti", "ci laviamo le mani"], mistake: "Use i denti / le mani, not i miei denti / le nostre mani in this construction.", tryOne: "Noi ___ le mani. (lavarsi)", tryAnswer: "ci laviamo" },
    "Reciprocal Actions": { title: "Azioni reciproche", rule: "Reciprocal actions mean EACH OTHER / ONE ANOTHER and require plural subjects: NOI → CI, VOI → VI, LORO → SI.", chart: [["incontrarsi", "ci incontriamo · vi incontrate · si incontrano"], ["vedersi", "ci vediamo · vi vedete · si vedono"], ["riunirsi", "ci riuniamo · vi riunite · si riuniscono"]], examples: ["Io e Cristina ci telefoniamo.", "Roberto e Sabrina si salutano."], mistake: "Riunirsi uses -isc with LORO only here: si riuniscono, but ci riuniamo and vi riunite.", tryOne: "loro — riunirsi →", tryAnswer: "si riuniscono" },
    "Telling Time": { title: "Telling Time", rule: "Use È l’una for 1:xx. Use Sono le… for other hours. Noon is È mezzogiorno; midnight is È mezzanotte.", chart: [["1:00", "È l’una."], ["2:00", "Sono le due."], ["12:00 noon", "È mezzogiorno."], ["00:00", "È mezzanotte."], [":15", "e un quarto / e quindici"], [":30", "e mezzo / e trenta"], [":45", "next hour meno un quarto"]], examples: ["4:45 = Sono le quattro e quarantacinque. / Sono le cinque meno un quarto."], mistake: "Do not say Sono l’una. One o’clock is singular: È l’una.", tryOne: "9:00 →", tryAnswer: "Sono le nove." },
    "At What Time?": { title: "A che ora…?", rule: "Che ora è? asks what time it is. A che ora…? asks when an event happens.", chart: [["1:00", "all’una"], ["2:00", "alle due"], ["12:00 noon", "a mezzogiorno"], ["00:00", "a mezzanotte"]], examples: ["A che ora inizia la partita? Inizia all’una.", "Arriva alle nove."], mistake: "Use ALL’UNA for one, but ALLE with other numbered hours.", tryOne: "at 3:00 →", tryAnswer: "alle tre" },
    "Duration": { title: "Quanto tempo?", rule: "Ask Quanto tempo? for an amount of time and Quante ore? for a number of hours. Match gender and number.", chart: [["quanto tempo", "how much time / how long"], ["molto tempo", "a lot of time"], ["quante ore", "how many hours"], ["molte ore", "many hours"]], examples: ["Quanto tempo studi? Molto tempo.", "Quante ore studi? Tre ore."], mistake: "A location or clock time does not answer Quanto tempo; give an amount of time.", tryOne: "___ ore studi?", tryAnswer: "Quante" },
    "Sports + Prepositions": { title: "Sports + Prepositions", rule: "Memorize each complete sports expression.", chart: [["giocare", "A tennis / calcio / pallacanestro / pallavolo"], ["andare", "IN bicicletta / barca"], ["pattinare", "SUL ghiaccio"]], examples: ["giocare a tennis", "andare in bicicletta", "pattinare sul ghiaccio"], mistake: "Keep sciare (verb), lo sci (sport), and gli sci (equipment) separate.", tryOne: "andare ___ bicicletta", tryAnswer: "in" }
  };

  const VOCABULARY = [
    ...CLOTHING, ...WEATHER, ...SEASONS, ...SPORTS, ...REFLEXIVE_VERBS, ...ORDINARY_VERBS,
    ...RECIPROCAL_VERBS, ...RECIPROCAL_COUNTERPARTS, ...DAILY_ROUTINE, ...TIME_VOCABULARY, ...DURATION, ...CULTURE_VOCABULARY
  ];
  const VOCABULARY_FILTERS = [
    ["all", "All Unit 4"], ["clothing", "Clothing"], ["weather", "Weather"], ["seasons", "Seasons"], ["sports", "Sports"],
    ["equipment", "Sports Equipment"], ["reflexive", "Reflexive Verbs"], ["reciprocal", "Reciprocal Verbs"],
    ["daily-routine", "Daily Routine"], ["time", "Time"], ["duration", "Duration"], ["culture", "Culture"]
  ];
  const SKILL_MAP = {
    Clothing: "clothingVocabularyAccuracy", Weather: "weatherAccuracy", Seasons: "weatherAccuracy",
    Sports: "sportsVocabularyAccuracy", "Sports Equipment": "sportsVocabularyAccuracy", "Sports + Prepositions": "sportsPrepositionAccuracy",
    "Reflexive Verb Vocabulary": "reflexiveVocabularyAccuracy", "Reflexive Pronouns": "reflexivePronounAccuracy",
    "Reflexive Verb Conjugation": "reflexiveConjugationAccuracy", "Reflexive vs. Non-Reflexive": "reflexiveMeaningAccuracy",
    "Reciprocal Verb Vocabulary": "reciprocalVocabularyAccuracy", "Reciprocal Actions": "reciprocalConjugationAccuracy",
    "Reciprocal vs. Non-Reciprocal": "reciprocalMeaningAccuracy", "Telling Time": "timeAccuracy", "Time Vocabulary": "timeAccuracy",
    "At What Time?": "atWhatTimeAccuracy", "12-Hour ↔ 24-Hour Time": "clock24Accuracy",
    "Duration Vocabulary": "durationAccuracy", "Duration: Quanto / Quante / Molto / Molte": "durationAccuracy",
    "Culture — Piemonte & Valle d’Aosta": "cultureAccuracy"
  };

  window.UNIT4_DATA = {
    id: "unit4", label: "Unit 4", categories: CATEGORIES, topics: TOPICS, defaultTopics: TOPICS.filter((topic) => topic !== "Culture — Piemonte & Valle d’Aosta"),
    topicGroups: TOPIC_GROUPS, presets: PRESETS, presetLabels: PRESET_LABELS, matchingCategories: MATCHING_CATEGORIES,
    vocabulary: VOCABULARY, vocabularyFilters: VOCABULARY_FILTERS, learnCards: LEARN_CARDS, skillMap: SKILL_MAP,
    clothing: CLOTHING, weather: WEATHER, seasons: SEASONS, sports: SPORTS, sportsEquipment: SPORTS_EQUIPMENT,
    reflexivePronouns: REFLEXIVE_PRONOUNS, reflexiveVerbs: REFLEXIVE_VERBS, reciprocalVerbs: RECIPROCAL_VERBS,
    timeVocabulary: TIME_VOCABULARY, durationVocabulary: DURATION, cultureVocabulary: CULTURE_VOCABULARY,
    makeQuestion, makeMatchingQuestion,
    expandTopics(topics) { return [...new Set(topics)].filter((topic) => CATEGORIES.includes(topic)); },
    migrateTopics(topics) { return [...new Set(topics)].filter((topic) => TOPICS.includes(topic)); },
    isSourceEligible(category) { return CATEGORIES.includes(category); }
  };
})();
