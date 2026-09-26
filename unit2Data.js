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
  const articlePhrase = (article, word) => article.endsWith("'") ? `${article}${word}` : `${article} ${word}`;
  const noun = (id, singular, plural, english, gender, definiteSingular, definitePlural, indefinite, groups, options = {}) => ({
    id, singular, plural, english, gender, definiteSingular, definitePlural, indefinite, groups,
    italian: options.display || articlePhrase(options.displayArticle || definiteSingular, options.displayWord || singular),
    acceptedItalian: [...new Set([singular, articlePhrase(definiteSingular, singular), articlePhrase(indefinite, singular), ...(options.accepted || [])])],
    tag: options.tag || "Vocabulary", exam2: Boolean(options.exam2)
  });

  const PERSONALITY = [
    four("simpatico", "nice / likeable", ["personality", "exam2"], ["antipatico"]),
    four("antipatico", "unpleasant / unlikeable", ["personality", "exam2"], ["simpatico"]),
    two("divertente", "fun / funny / entertaining", ["personality", "exam2"], ["serio"]),
    four("serio", "serious", ["personality", "exam2"], ["divertente"]),
    four("generoso", "generous", ["personality", "exam2"], ["tirchio"]),
    four("tirchio", "stingy", ["personality", "exam2"], ["generoso"]),
    two("paziente", "patient", ["personality", "exam2"], ["impaziente"]),
    two("impaziente", "impatient", ["personality", "exam2"], ["paziente"]),
    four("estroverso", "outgoing / extroverted", ["personality", "exam2"], ["timido"]),
    four("timido", "shy", ["personality", "exam2"], ["estroverso"]),
    ista("ottimista", "optimistic", ["personality", "exam2"], ["pessimista"]),
    ista("pessimista", "pessimistic", ["personality", "exam2"], ["ottimista"]),
    ista("altruista", "altruistic / selfless", ["personality", "exam2"], ["egoista"]),
    ista("egoista", "selfish", ["personality", "exam2"], ["altruista"]),
    four("sportivo", "athletic / sporty", ["personality", "exam2"], ["pigro"]),
    four("pigro", "lazy", ["personality", "exam2"], ["sportivo"]),
    four("bravo", "good / capable", ["personality", "exam2"], ["cattivo"]),
    four("cattivo", "bad", ["personality", "exam2"], ["bravo"]),
    four("bello", "beautiful / handsome / nice", ["personality", "appearance", "exam2"], ["brutto"]),
    four("brutto", "ugly / bad-looking", ["personality", "appearance", "exam2"], ["bello"]),
    two("felice", "happy", ["personality", "exam2"], ["triste"]),
    four("allegro", "cheerful", ["personality", "exam2"], ["triste"]),
    two("triste", "sad", ["personality", "exam2"], ["felice", "allegro"]),
    two("intelligente", "intelligent", ["personality", "exam2"], ["stupido"]),
    four("stupido", "stupid", ["personality", "exam2"], ["intelligente"]),
    two("facile", "easy", ["personality", "exam2"], ["difficile"]),
    two("difficile", "difficult", ["personality", "exam2"], ["facile"]),
    two("interessante", "interesting", ["personality", "exam2"], ["noioso"]),
    four("noioso", "boring", ["personality", "exam2"], ["interessante"]),
    two("gentile", "kind / polite", ["personality", "exam2"]),
    two("sensibile", "sensitive", ["personality", "exam2"]),
    two("responsabile", "responsible", ["personality", "exam2"]),
    two("elegante", "elegant", ["personality", "exam2"]),
    four("creativo", "creative", ["personality", "exam2"]),
    ista("realista", "realistic / realist", ["personality", "exam2"]),
    four("calmo", "calm", ["personality", "exam2"]),
    two("solare", "sunny / cheerful", ["personality", "exam2"]),
    four("spiritoso", "witty / funny", ["personality", "exam2"]),
    four("disordinato", "messy / disorganized", ["personality", "exam2"]),
    four("distratto", "distracted / absent-minded", ["personality", "exam2"]),
    four("positivo", "positive", ["personality", "exam2"]),
    four("solitario", "solitary / reserved", ["personality", "exam2"]),
    four("spontaneo", "spontaneous", ["personality", "exam2"]),
    two("semplice", "simple / down-to-earth", ["personality", "exam2"]),
    two("socievole", "sociable", ["personality", "exam2"])
  ];

  const APPEARANCE = [
    four("alto", "tall", ["appearance", "exam2"], ["basso"]),
    four("basso", "short", ["appearance", "exam2"], ["alto"]),
    four("magro", "thin", ["appearance", "exam2"], ["grasso"]),
    four("grasso", "fat", ["appearance", "exam2"], ["magro"]),
    two("grande", "big / large", ["appearance", "exam2"], ["piccolo"]),
    four("piccolo", "small", ["appearance", "exam2"], ["grande"]),
    two("giovane", "young", ["appearance", "exam2"], ["anziano"]),
    four("anziano", "elderly / old", ["appearance", "exam2"], ["giovane"]),
    four("carino", "cute", ["appearance", "exam2"]),
    four("biondo", "blond", ["appearance", "exam2"]),
    four("bruno", "dark-haired / brunette", ["appearance", "exam2"]),
    four("castano", "brown-haired / brown", ["appearance", "exam2"]),
    four("calvo", "bald", ["appearance", "exam2"])
  ];

  const AGREEMENT_ONLY = [
    four("nuovo", "new", ["agreement", "exam2"]), four("vecchio", "old", ["agreement", "exam2"]),
    two("veloce", "fast", ["agreement", "exam2"])
  ];
  const COLORS = [
    four("rosso", "red", ["colors"]),
    { ...four("bianco", "white", ["colors"]), forms: { ms: "bianco", fs: "bianca", mp: "bianchi", fp: "bianche" } },
    two("verde", "green", ["colors"]), four("giallo", "yellow", ["colors"]), four("nero", "black", ["colors"]),
    invariant("blu", "blue", ["colors"]), invariant("viola", "purple", ["colors"]), two("arancione", "orange", ["colors"]),
    invariant("rosa", "pink", ["colors"]), four("azzurro", "light blue / blue", ["colors"])
  ];
  const NATIONALITIES = [
    four("italiano", "Italian", ["nationalities"]), two("inglese", "English", ["nationalities"]),
    four("spagnolo", "Spanish", ["nationalities"]), two("cinese", "Chinese", ["nationalities"]),
    two("giapponese", "Japanese", ["nationalities"]),
    { ...four("tedesco", "German", ["nationalities"]), forms: { ms: "tedesco", fs: "tedesca", mp: "tedeschi", fp: "tedesche" } },
    four("messicano", "Mexican", ["nationalities"]), two("francese", "French", ["nationalities"]),
    four("americano", "American", ["nationalities"]), four("arabo", "Arab / Arabian", ["nationalities"]),
    four("straniero", "foreign / foreigner", ["nationalities"])
  ];

  const PHRASES = [
    ["i-capelli", "i capelli", "hair"], ["capelli-corti", "capelli corti", "short hair"],
    ["capelli-lunghi", "capelli lunghi", "long hair"], ["capelli-lisci", "capelli lisci", "straight hair"],
    ["capelli-ricci", "capelli ricci", "curly hair"], ["ha-capelli-corti", "ha i capelli corti", "has short hair"],
    ["ha-capelli-lunghi", "ha i capelli lunghi", "has long hair"], ["ha-capelli-lisci", "ha i capelli lisci", "has straight hair"],
    ["ha-capelli-ricci", "ha i capelli ricci", "has curly hair"], ["barba", "la barba", "beard"],
    ["ha-barba", "ha la barba", "has a beard"], ["baffi", "i baffi", "mustache"], ["ha-baffi", "ha i baffi", "has a mustache"],
    ["gli-occhi", "gli occhi", "eyes"], ["occhi-chiari", "occhi chiari", "light eyes"],
    ["occhi-scuri", "occhi scuri", "dark eyes"], ["occhi-azzurri", "occhi azzurri", "blue eyes"],
    ["occhi-marroni", "occhi marroni", "brown eyes"], ["come-capelli", "Come ha i capelli?", "What is his/her hair like?"],
    ["come-occhi", "Come ha gli occhi?", "What are his/her eyes like?"], ["di-che-colore", "Di che colore sono...?", "What color are...?" ]
  ].map(([id, italian, english]) => ({ id, italian, english, groups: ["appearance", "exam2"], tag: "Physical Appearance", exam2: true }));

  const SCHOOL_SUBJECTS = [
    noun("subject-biologia", "biologia", "biologie", "biology", "feminine", "la", "le", "una", ["school-subjects", "exam2"], { tag: "School Subjects", exam2: true }),
    noun("subject-chimica", "chimica", "chimiche", "chemistry", "feminine", "la", "le", "una", ["school-subjects", "exam2"], { tag: "School Subjects", exam2: true }),
    noun("subject-economia", "economia", "economie", "economics", "feminine", "l'", "le", "un'", ["school-subjects", "exam2"], { tag: "School Subjects", exam2: true }),
    noun("subject-giornalismo", "giornalismo", "giornalismi", "journalism", "masculine", "il", "i", "un", ["school-subjects", "exam2"], { tag: "School Subjects", exam2: true }),
    noun("subject-giurisprudenza", "giurisprudenza", "giurisprudenze", "law / jurisprudence", "feminine", "la", "le", "una", ["school-subjects", "exam2"], { tag: "School Subjects", exam2: true }),
    noun("subject-informatica", "informatica", "informatiche", "computer science / information technology", "feminine", "l'", "le", "un'", ["school-subjects", "exam2"], { tag: "School Subjects", exam2: true }),
    noun("subject-ingegneria", "ingegneria", "ingegnerie", "engineering", "feminine", "l'", "le", "un'", ["school-subjects", "exam2"], { tag: "School Subjects", exam2: true }),
    noun("subject-letteratura", "letteratura", "letterature", "literature", "feminine", "la", "le", "una", ["school-subjects", "exam2"], { tag: "School Subjects", exam2: true }),
    noun("subject-lingue-straniere", "lingua straniera", "lingue straniere", "foreign languages", "feminine", "la", "le", "una", ["school-subjects", "exam2"], { display: "le lingue straniere", accepted: ["lingue straniere"], tag: "School Subjects", exam2: true }),
    noun("subject-matematica", "matematica", "matematiche", "mathematics", "feminine", "la", "le", "una", ["school-subjects", "exam2"], { tag: "School Subjects", exam2: true }),
    noun("subject-psicologia", "psicologia", "psicologie", "psychology", "feminine", "la", "le", "una", ["school-subjects", "exam2"], { tag: "School Subjects", exam2: true }),
    noun("subject-scienze", "scienza", "scienze", "sciences", "feminine", "la", "le", "una", ["school-subjects", "exam2"], { display: "le scienze", accepted: ["scienze"], tag: "School Subjects", exam2: true }),
    noun("subject-scienze-politiche", "scienza politica", "scienze politiche", "political science", "feminine", "la", "le", "una", ["school-subjects", "exam2"], { display: "le scienze politiche", accepted: ["scienze politiche"], tag: "School Subjects", exam2: true }),
    noun("subject-storia", "storia", "storie", "history", "feminine", "la", "le", "una", ["school-subjects", "exam2"], { tag: "School Subjects", exam2: true }),
    noun("subject-storia-arte", "storia dell'arte", "storie dell'arte", "art history", "feminine", "la", "le", "una", ["school-subjects", "exam2"], { tag: "School Subjects", exam2: true }),
    noun("subject-filosofia", "filosofia", "filosofie", "philosophy", "feminine", "la", "le", "una", ["school-subjects", "exam2"], { tag: "School Subjects", exam2: true }),
    noun("subject-architettura", "architettura", "architetture", "architecture", "feminine", "l'", "le", "un'", ["school-subjects", "exam2"], { tag: "School Subjects", exam2: true }),
    noun("subject-finanza", "finanza", "finanze", "finance", "feminine", "la", "le", "una", ["school-subjects", "exam2"], { tag: "School Subjects", exam2: true })
  ];

  const CLASSROOM = [
    noun("class-agendina", "agendina", "agendine", "small agenda / planner", "feminine", "l'", "le", "un'", ["classroom"], { displayArticle: "un'", tag: "Classroom Objects" }),
    noun("class-banco", "banco", "banchi", "student desk", "masculine", "il", "i", "un", ["classroom"], { displayArticle: "un", tag: "Classroom Objects" }),
    noun("class-cancellino", "cancellino", "cancellini", "eraser / board eraser", "masculine", "il", "i", "un", ["classroom"], { displayArticle: "un", tag: "Classroom Objects" }),
    noun("class-cestino", "cestino", "cestini", "wastebasket / trash can", "masculine", "il", "i", "un", ["classroom"], { displayArticle: "un", tag: "Classroom Objects" }),
    noun("class-gomma", "gomma", "gomme", "eraser", "feminine", "la", "le", "una", ["classroom"], { displayArticle: "una", tag: "Classroom Objects" }),
    noun("class-lavagna", "lavagna", "lavagne", "board / chalkboard", "feminine", "la", "le", "una", ["classroom"], { displayArticle: "una", tag: "Classroom Objects" }),
    noun("class-libro", "libro", "libri", "book", "masculine", "il", "i", "un", ["classroom"], { displayArticle: "un", tag: "Classroom Objects" }),
    noun("class-luce", "luce", "luci", "light", "feminine", "la", "le", "una", ["classroom"], { displayArticle: "una", tag: "Classroom Objects" }),
    noun("class-matita", "matita", "matite", "pencil", "feminine", "la", "le", "una", ["classroom"], { displayArticle: "una", tag: "Classroom Objects" }),
    noun("class-orologio", "orologio", "orologi", "clock", "masculine", "l'", "gli", "un", ["classroom"], { displayArticle: "un", tag: "Classroom Objects" }),
    noun("class-pennarello", "pennarello", "pennarelli", "marker", "masculine", "il", "i", "un", ["classroom"], { displayArticle: "un", tag: "Classroom Objects" }),
    noun("class-portatile", "portatile", "portatili", "laptop", "masculine", "il", "i", "un", ["classroom"], { displayArticle: "un", tag: "Classroom Objects" }),
    noun("class-proiettore", "proiettore", "proiettori", "projector", "masculine", "il", "i", "un", ["classroom"], { displayArticle: "un", tag: "Classroom Objects" }),
    noun("class-quaderno", "quaderno", "quaderni", "notebook", "masculine", "il", "i", "un", ["classroom"], { displayArticle: "un", tag: "Classroom Objects" }),
    noun("class-schermo", "schermo", "schermi", "screen", "masculine", "lo", "gli", "uno", ["classroom"], { displayArticle: "uno", tag: "Classroom Objects" }),
    noun("class-zaino", "zaino", "zaini", "backpack", "masculine", "lo", "gli", "uno", ["classroom"], { displayArticle: "uno", tag: "Classroom Objects" }),
    noun("class-carta-geografica", "carta geografica", "carte geografiche", "map", "feminine", "la", "le", "una", ["classroom"], { displayArticle: "una", tag: "Classroom Objects" }),
    noun("class-cattedra", "cattedra", "cattedre", "teacher's desk", "feminine", "la", "le", "una", ["classroom"], { displayArticle: "una", tag: "Classroom Objects" }),
    noun("class-computer", "computer", "computer", "computer", "masculine", "il", "i", "un", ["classroom"], { displayArticle: "un", tag: "Classroom Objects" }),
    noun("class-finestra", "finestra", "finestre", "window", "feminine", "la", "le", "una", ["classroom"], { displayArticle: "una", tag: "Classroom Objects" }),
    noun("class-porta", "porta", "porte", "door", "feminine", "la", "le", "una", ["classroom"], { displayArticle: "una", tag: "Classroom Objects" }),
    noun("class-sedia", "sedia", "sedie", "chair", "feminine", "la", "le", "una", ["classroom"], { displayArticle: "una", tag: "Classroom Objects" }),
    noun("class-televisore", "televisore", "televisori", "television", "masculine", "il", "i", "un", ["classroom"], { displayArticle: "un", tag: "Classroom Objects" }),
    noun("class-penna", "penna", "penne", "pen", "feminine", "la", "le", "una", ["classroom"], { displayArticle: "una", tag: "Classroom Objects" }),
    noun("class-cartellina", "cartellina", "cartelline", "folder", "feminine", "la", "le", "una", ["classroom"], { displayArticle: "una", tag: "Classroom Objects" }),
    noun("class-professoressa", "professoressa", "professoresse", "female professor / teacher", "feminine", "la", "le", "una", ["classroom"], { displayArticle: "una", tag: "Classroom Objects" }),
    noun("class-professore", "professore", "professori", "male professor / teacher", "masculine", "il", "i", "un", ["classroom"], { displayArticle: "un", tag: "Classroom Objects" }),
    noun("class-studentessa", "studentessa", "studentesse", "female student", "feminine", "la", "le", "una", ["classroom"], { displayArticle: "una", tag: "Classroom Objects" }),
    noun("class-studente", "studente", "studenti", "male student", "masculine", "lo", "gli", "uno", ["classroom"], { displayArticle: "uno", tag: "Classroom Objects" })
  ];

  const AVERE_EXPRESSIONS = [
    ["avere-caldo", "avere caldo", "to be hot"], ["avere-freddo", "avere freddo", "to be cold"],
    ["avere-fame", "avere fame", "to be hungry"], ["avere-sete", "avere sete", "to be thirsty"],
    ["avere-sonno", "avere sonno", "to be sleepy"], ["avere-anni", "avere ... anni", "to be ... years old"],
    ["avere-ragione", "avere ragione", "to be right"], ["avere-torto", "avere torto", "to be wrong"],
    ["avere-fretta", "avere fretta", "to be in a hurry"], ["avere-paura", "avere paura", "to be afraid"],
    ["avere-paura-di", "avere paura di", "to be afraid of"], ["avere-bisogno", "avere bisogno di", "to need"],
    ["avere-voglia", "avere voglia di", "to feel like / want to"], ["avere-pazienza", "avere pazienza", "to have patience / be patient"]
  ].map(([id, italian, english]) => ({ id, italian, english, groups: ["avere-expressions", "exam2"], tag: "Avere Expressions", exam2: true }));

  function regularForms(infinitive) {
    const stem = infinitive.slice(0, -3);
    const careGare = /[cg]$/.test(stem);
    const iare = stem.endsWith("i");
    return {
      io: `${stem}o`, tu: careGare ? `${stem}hi` : iare ? stem : `${stem}i`, "lui/lei/Lei": `${stem}a`,
      noi: careGare ? `${stem}hiamo` : iare ? `${stem}amo` : `${stem}iamo`, voi: `${stem}ate`, loro: `${stem}ano`
    };
  }
  const REGULAR_VERBS = [
    ["abitare", "to live"], ["aiutare", "to help"], ["arrivare", "to arrive"], ["ascoltare", "to listen to"],
    ["aspettare", "to wait for"], ["cercare", "to look for"], ["cominciare", "to begin / start"], ["iniziare", "to begin / start"],
    ["comprare", "to buy"], ["frequentare", "to attend / take a course"], ["giocare", "to play"],
    ["guardare", "to watch / look at"], ["lavorare", "to work"], ["mangiare", "to eat"], ["ordinare", "to order"],
    ["pagare", "to pay"], ["parlare", "to speak / talk"], ["spiegare", "to explain"], ["studiare", "to study"],
    ["tornare", "to return / go back"], ["visitare", "to visit"]
  ].map(([infinitive, english]) => ({ id: `regular-${infinitive}`, infinitive, italian: infinitive, english, forms: regularForms(infinitive), groups: ["regular-verbs", "verb-vocabulary", "exam2"], tag: "Regular Verbs", exam2: true }));

  const IRREGULAR_VERBS = {
    Andare: { infinitive: "andare", english: "to go", forms: { io: "vado", tu: "vai", "lui/lei/Lei": "va", noi: "andiamo", voi: "andate", loro: "vanno" } },
    Dare: { infinitive: "dare", english: "to give", forms: { io: "do", tu: "dai", "lui/lei/Lei": "dà", noi: "diamo", voi: "date", loro: "danno" } },
    Fare: { infinitive: "fare", english: "to do / make", forms: { io: "faccio", tu: "fai", "lui/lei/Lei": "fa", noi: "facciamo", voi: "fate", loro: "fanno" } },
    Stare: { infinitive: "stare", english: "to be / stay", forms: { io: "sto", tu: "stai", "lui/lei/Lei": "sta", noi: "stiamo", voi: "state", loro: "stanno" } }
  };
  const IRREGULAR_VOCAB = Object.entries(IRREGULAR_VERBS).map(([category, verb]) => ({
    id: `irregular-${verb.infinitive}`, italian: verb.infinitive, english: verb.english, groups: ["irregular-verbs", "verb-vocabulary", "exam2"],
    tag: "Irregular Verbs", exam2: true, category, infinitive: verb.infinitive, forms: verb.forms
  }));
  const AVERE_FORMS = { io: "ho", tu: "hai", "lui/lei/Lei": "ha", noi: "abbiamo", voi: "avete", loro: "hanno" };
  const AVERE_VOCAB = {
    id: "irregular-avere", italian: "avere", infinitive: "avere", english: "to have", forms: AVERE_FORMS,
    groups: ["avere-verb", "verb-vocabulary", "exam2"], tag: "Avere", exam2: true
  };
  const VERB_VOCABULARY = [...REGULAR_VERBS, ...IRREGULAR_VOCAB, AVERE_VOCAB];

  const VERB_EXPRESSIONS = [
    ["andare-bene", "andare bene", "to go well", "Andare"], ["andare-male", "andare male", "to go badly", "Andare"],
    ["andare-accordo", "andare d'accordo", "to get along", "Andare"], ["dare-mano", "dare una mano", "to give a hand / help", "Dare"],
    ["dare-tu", "dare del tu", "to address someone informally", "Dare"], ["dare-lei", "dare del Lei", "to address someone formally", "Dare"],
    ["fare-attenzione", "fare attenzione", "to pay attention", "Fare"], ["fare-esame", "fare un esame / fare l'esame", "to take an exam", "Fare"],
    ["fare-passeggiata", "fare una passeggiata", "to take a walk", "Fare"], ["fare-giro", "fare un giro", "to take a walk / go around", "Fare"],
    ["fare-gita", "fare una gita", "to take a short trip", "Fare"], ["stare-attento", "stare attento / attenta / attenti / attente", "to pay attention / be attentive", "Stare"],
    ["stare-zitto", "stare zitto / zitta / zitti / zitte", "to be quiet / silent", "Stare"], ["stare-bene", "stare bene", "to be well", "Stare"],
    ["stare-male", "stare male", "to be unwell", "Stare"]
  ].map(([id, italian, english, verb]) => ({ id, italian, english, verb, groups: ["verb-expressions", "exam2"], tag: "Verb Expressions", exam2: true }));

  const PREPOSITIONS = [["di", "of / from"], ["a", "at / in / to"], ["da", "from / by"], ["in", "at / in / to"],
    ["con", "with"], ["su", "on / about"], ["per", "for / in order to"], ["tra", "among / between / in"], ["fra", "among / between / in"]]
    .map(([italian, english]) => ({ id: `prep-${italian}`, italian, english, groups: ["prepositions"], tag: "Prepositions" }));
  const DAYS = [["lunedì", "Monday"], ["martedì", "Tuesday"], ["mercoledì", "Wednesday"], ["giovedì", "Thursday"],
    ["venerdì", "Friday"], ["sabato", "Saturday"], ["domenica", "Sunday"], ["l'agenda", "agenda / schedule"],
    ["la lezione", "lesson / class"], ["il corso", "course"], ["l'esame", "exam"]]
    .map(([italian, english], index) => ({ id: `agenda-${index}`, italian, english, groups: ["agenda"], tag: "Days / Agenda" }));

  const ADJECTIVES = [...PERSONALITY, ...APPEARANCE, ...AGREEMENT_ONLY, ...COLORS, ...NATIONALITIES]
    .filter((item, index, array) => array.findIndex((candidate) => candidate.id === item.id) === index)
    .map((item) => ({ ...item, groups: [...new Set([...PERSONALITY, ...APPEARANCE, ...AGREEMENT_ONLY, ...COLORS, ...NATIONALITIES]
      .filter((candidate) => candidate.id === item.id).flatMap((candidate) => candidate.groups))] }));

  const VOCABULARY = [...ADJECTIVES, ...PHRASES, ...SCHOOL_SUBJECTS, ...CLASSROOM, ...AVERE_EXPRESSIONS,
    ...REGULAR_VERBS, ...IRREGULAR_VOCAB, AVERE_VOCAB, ...VERB_EXPRESSIONS, ...PREPOSITIONS, ...DAYS].map((item) => ({
    ...item,
    tag: item.tag || (item.groups.includes("personality") ? "Personality" : item.groups.includes("appearance") ? "Physical Appearance" :
      item.groups.includes("colors") ? "Colors" : item.groups.includes("nationalities") ? "Nationalities" : "Adjective Agreement"),
    exam2: item.exam2 || item.groups.includes("exam2")
  }));

  const CATEGORIES = [
    "Personality Adjectives", "Physical Appearance", "Colors", "Nationalities", "School Subjects", "Classroom Objects",
    "Avere Expressions", "Adjective Opposites", "Adjective Agreement", "Adjective Singular ↔ Plural",
    "Bello Before a Noun", "Buono Before a Noun", "-issimo", "Molto: Adjective vs Adverb", "Piacere", "Avere", "Avere Idioms",
    "Verb Vocabulary", "Verb Vocabulary: Regular -ARE", "Verb Vocabulary: Irregular", "Verb Vocabulary: Avere",
    "Regular -ARE Verbs", "Andare", "Dare", "Fare", "Stare", "Irregular Verb Expressions", "Listening Comprehension",
    "Prepositions", "Days / Agenda Vocabulary", "Culture / Reading"
  ];
  const EXAM_TOPICS = ["School Subjects", "Describing People", "Avere", "Avere Expressions", "Verb Vocabulary", "Regular -ARE Verbs", "Andare", "Dare", "Fare", "Stare",
    "Irregular Verb Expressions", "Adjective Agreement", "Adjective Singular ↔ Plural", "Bello Before a Noun", "Buono Before a Noun",
    "Molto: Adjective vs Adverb", "Listening Comprehension"];
  const TOPIC_GROUPS = [
    { name: "Exam 2 — High Priority", topics: EXAM_TOPICS.flatMap((topic) => {
      const row = [topic, topic === "Listening Comprehension" ? "Authentic course audio" : "", true];
      return topic === "Stare" ? [row, ["All Irregular Verbs", "Andare, dare, fare, and stare", true]] : [row];
    }) },
    { name: "Vocabulary", topics: [
      ["Personality Adjectives", "Traits and descriptions", true], ["Physical Appearance", "Appearance, hair, and eyes", true],
      ["School Subjects", "Le materie scolastiche", true], ["Classroom Objects", "La classe"], ["Colors", "Color vocabulary"],
      ["Nationalities", "Vocabulary + agreement"], ["Avere Expressions", "Common expressions", true],
      ["All Verb Vocabulary", "Meanings only · all 26 verbs", true],
      ["Verb Vocabulary: Regular -ARE", "Meanings only · 21 regular verbs", true],
      ["Verb Vocabulary: Irregular", "Meanings only · andare, dare, fare, stare", true],
      ["Verb Vocabulary: Avere", "Meaning only · avere", true]
    ] },
    { name: "Other Unit 2", topics: [
      ["Adjective Opposites", "Supported opposite pairs"], ["Piacere", "Piace vs piacciono"], ["-issimo", "Very / extremely"],
      ["Prepositions", "di, a, da, in, con, su, per, tra/fra"], ["Days / Agenda Vocabulary", "Days, courses, and scheduling"],
      ["Culture / Reading", "Puglia and Campania"]
    ] }
  ];
  const TOPICS = [...new Set(TOPIC_GROUPS.flatMap((group) => group.topics.map(([topic]) => topic)))];
  const TOPIC_EXPANSIONS = {
    "Describing People": ["Personality Adjectives", "Physical Appearance"],
    "Avere Expressions": ["Avere Expressions", "Avere Idioms"],
    "All Irregular Verbs": ["Andare", "Dare", "Fare", "Stare"],
    "All Verb Vocabulary": ["Verb Vocabulary"],
    "School / Class Vocabulary": ["School Subjects", "Classroom Objects"],
    "Bello & Buono": ["Bello Before a Noun", "Buono Before a Noun"]
  };
  const PRESETS = {
    exam2: [...EXAM_TOPICS],
    vocabulary: ["Personality Adjectives", "Physical Appearance", "School Subjects", "Classroom Objects", "Colors", "Nationalities", "Avere Expressions", "Verb Vocabulary"],
    adjectives: ["Personality Adjectives", "Physical Appearance", "Colors", "Nationalities", "Adjective Opposites", "Adjective Agreement", "Adjective Singular ↔ Plural"],
    verbs: ["Verb Vocabulary", "Avere", "Avere Expressions", "Regular -ARE Verbs", "Andare", "Dare", "Fare", "Stare", "Irregular Verb Expressions"],
    everything: TOPICS.filter((topic) => topic !== "All Verb Vocabulary" && !topic.startsWith("Verb Vocabulary:"))
  };
  const DEFAULT_TOPICS = [...PRESETS.everything];
  const PRESET_LABELS = { exam2: "★ EXAM 2", vocabulary: "All Vocabulary", adjectives: "Adjectives", verbs: "Verbs", everything: "Everything" };
  const MATCHING_CATEGORIES = ["Personality Adjectives", "Physical Appearance", "Colors", "Nationalities", "School Subjects", "Classroom Objects",
    "Avere Expressions", "Adjective Opposites", "Avere", "Verb Vocabulary", "Verb Vocabulary: Regular -ARE", "Verb Vocabulary: Irregular", "Verb Vocabulary: Avere",
    "Regular -ARE Verbs", "Andare", "Dare", "Fare", "Stare", "Irregular Verb Expressions",
    "Prepositions", "Days / Agenda Vocabulary"];
  const CATEGORY_GROUP = {
    "Personality Adjectives": "personality", "Physical Appearance": "appearance", Colors: "colors", Nationalities: "nationalities",
    "School Subjects": "school-subjects", "Classroom Objects": "classroom", "Avere Expressions": "avere-expressions",
    Prepositions: "prepositions", "Days / Agenda Vocabulary": "agenda"
  };
  const FORM_LABELS = { ms: "masculine singular", fs: "feminine singular", mp: "masculine plural", fp: "feminine plural" };
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
  const translations = (value) => [value, ...value.split(" / ")];
  const verbEnglishVariants = (value) => {
    const hasTo = value.startsWith("to ");
    const parts = value.split(" / ").map((part) => part.trim());
    const variants = parts.flatMap((part) => {
      const withTo = hasTo && !part.startsWith("to ") ? `to ${part}` : part;
      return [withTo, withTo.replace(/^to\s+/, "")];
    });
    return [...new Set([value, ...variants])];
  };
  const baseQuestion = (category, sourceId, id, kicker, display, answer, explanation, distractors = []) => ({
    category, sourceId, id, kicker, display, answer, accepted: [answer], explanation, distractors
  });
  const itemForSource = (pool, sourceId, prefix = "") => pool.find((item) => item.id === sourceId || `${prefix}${item.id}` === sourceId) || random(pool);
  const vocabularyForCategory = (category) => VOCABULARY.filter((item) => item.groups.includes(CATEGORY_GROUP[category]));

  function verbVocabularyPool(category) {
    if (category === "Verb Vocabulary: Regular -ARE") return REGULAR_VERBS;
    if (category === "Verb Vocabulary: Irregular") return IRREGULAR_VOCAB;
    if (category === "Verb Vocabulary: Avere") return [AVERE_VOCAB];
    return VERB_VOCABULARY;
  }

  function verbVocabularyQuestion(category, sourceId) {
    const pool = verbVocabularyPool(category);
    const item = pool.find((verb) => verb.id === sourceId) || random(pool);
    const toEnglish = Math.random() < 0.5;
    const answer = toEnglish ? item.english : item.infinitive;
    const distractors = VERB_VOCABULARY.filter((verb) => verb.id !== item.id)
      .map((verb) => toEnglish ? verb.english : verb.infinitive);
    const question = baseQuestion(category, item.id, `u2-verb-vocab:${item.id}:${toEnglish ? "en" : "it"}`,
      toEnglish ? "Translate the infinitive into English" : "Which Italian infinitive has this meaning?",
      toEnglish ? item.infinitive : item.english, answer,
      `${item.infinitive} means “${item.english}.” This topic practices meaning only, not conjugation.`, distractors);
    question.accepted = toEnglish ? verbEnglishVariants(item.english) : [item.infinitive];
    return question;
  }

  function vocabularyQuestion(category, sourceId) {
    const pool = vocabularyForCategory(category);
    const item = itemForSource(pool, sourceId);
    const toEnglish = Math.random() < 0.5;
    const italianAnswer = item.singular || item.italian;
    const displayItalian = item.italian;
    const question = baseQuestion(category, item.id, `u2-vocab:${item.id}:${toEnglish ? "en" : "it"}`,
      toEnglish ? "Translate into English" : "Translate into Italian", toEnglish ? displayItalian : item.english,
      toEnglish ? item.english : italianAnswer, `${displayItalian} means “${item.english}.”`,
      pool.filter((candidate) => candidate.id !== item.id).map((candidate) => toEnglish ? candidate.english : (candidate.singular || candidate.italian)));
    question.accepted = toEnglish ? translations(item.english) : (item.acceptedItalian || [item.italian]);
    question.nounKey = item.id;
    return question;
  }

  const SCHOOL_CONTEXTS = [
    ["algebra", "Algebra → ______", "matematica"], ["costituzione", "La Costituzione italiana → ______", "giurisprudenza"],
    ["pop-art", "La Pop-art → ______", "storia dell'arte"], ["relazioni", "Relazioni internazionali → ______", "scienze politiche"],
    ["languages", "Spanish / French / German → ______", "lingue straniere"]
  ].map(([id, prompt, answer]) => ({ id: `school-context-${id}`, prompt, answer }));
  function schoolQuestion(sourceId) {
    if ((sourceId?.startsWith("school-context-") || Math.random() < 0.3)) {
      const item = itemForSource(SCHOOL_CONTEXTS, sourceId);
      const question = baseQuestion("School Subjects", item.id, `u2-${item.id}`, "Choose the course-supported subject", item.prompt, item.answer,
        `${item.answer} is the subject associated with this course example.`, SCHOOL_SUBJECTS.map((subject) => subject.singular).filter((value) => value !== item.answer));
      const subject = SCHOOL_SUBJECTS.find((entry) => entry.singular === item.answer || entry.plural === item.answer);
      question.accepted = subject ? subject.acceptedItalian : [item.answer];
      return question;
    }
    return vocabularyQuestion("School Subjects", sourceId);
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
    return baseQuestion("Adjective Opposites", item.id, `u2-opposite:${item.id}:${contextual}`,
      contextual ? "Complete with the opposite adjective" : "Give the Italian opposite",
      contextual ? `Paolo è ${item.forms.ms}. Dolores says the opposite: Paolo è ___.` : item.italian, answer,
      `${answer} is the course-supported opposite of ${item.italian}.`, pool.filter((candidate) => ![item.id, answer].includes(candidate.id)).map((candidate) => candidate.italian));
  }
  function agreementQuestion(sourceId) {
    const pool = ADJECTIVES.filter((item) => item.forms && item.family !== "invariant");
    const adjective = itemForSource(pool, sourceId);
    const target = random(["ms", "fs", "mp", "fp"]);
    const context = { ms: "Paolo è un ragazzo ___", fs: "Marta è una ragazza ___", mp: "Paolo e Marco sono ___", fp: "Marta e Dolores sono ___" }[target];
    const answer = adjective.forms[target];
    return baseQuestion("Adjective Agreement", adjective.id, `u2-agreement:${adjective.id}:${target}`, "Make the adjective agree",
      `${context} (${adjective.forms.ms})`, answer,
      `${FORM_LABELS[target]} of ${adjective.italian} is ${answer}.`, [...new Set(Object.values(adjective.forms).filter((form) => form !== answer))]);
  }
  function adjectiveNumberQuestion(sourceId) {
    const pool = ADJECTIVES.filter((item) => item.forms && item.family !== "invariant");
    const adjective = itemForSource(pool, sourceId);
    const feminine = Math.random() < 0.45;
    const toPlural = Math.random() < 0.5;
    const sourceKey = feminine ? (toPlural ? "fs" : "fp") : (toPlural ? "ms" : "mp");
    const targetKey = feminine ? (toPlural ? "fp" : "fs") : (toPlural ? "mp" : "ms");
    const source = adjective.forms[sourceKey];
    const answer = adjective.forms[targetKey];
    const context = toPlural
      ? `${feminine ? "La ragazza è" : "Il ragazzo è"} ${source}. → ${feminine ? "Le ragazze sono" : "I ragazzi sono"} ___`
      : `${feminine ? "Le ragazze sono" : "I ragazzi sono"} ${source}. → ${feminine ? "La ragazza è" : "Il ragazzo è"} ___`;
    return baseQuestion("Adjective Singular ↔ Plural", adjective.id, `u2-adj-number:${adjective.id}:${sourceKey}:${targetKey}`,
      toPlural ? "Change the adjective to plural" : "Change the adjective to singular", context, answer,
      `${source} becomes ${answer} with the same gender and the new number.`, [...new Set(Object.values(adjective.forms).filter((form) => form !== answer))]);
  }

  function belloForm(nounItem, plural) {
    if (nounItem.gender === "feminine") return plural ? "belle" : nounItem.definiteSingular === "l'" ? "bell'" : "bella";
    if (plural) return nounItem.definitePlural === "gli" ? "begli" : "bei";
    return nounItem.definiteSingular === "lo" ? "bello" : nounItem.definiteSingular === "l'" ? "bell'" : "bel";
  }
  function buonoForm(nounItem, plural) {
    if (nounItem.gender === "feminine") return plural ? "buone" : nounItem.definiteSingular === "l'" ? "buon'" : "buona";
    return plural ? "buoni" : nounItem.indefinite === "uno" ? "buono" : "buon";
  }
  function belloBuonoQuestion(category, sourceId, unit1Data) {
    const nouns = [...unit1Data.nouns.filter((item) => !item.context), ...SCHOOL_SUBJECTS, ...CLASSROOM];
    const kind = category.startsWith("Bello") ? "bello" : "buono";
    const requested = sourceId?.split(":").at(-1);
    const nounItem = nouns.find((item) => item.id === requested) || random(nouns);
    const plural = Math.random() < 0.45;
    const word = plural ? nounItem.plural : nounItem.singular;
    const answer = kind === "bello" ? belloForm(nounItem, plural) : buonoForm(nounItem, plural);
    const blank = answer.endsWith("'") ? `___${word}` : `___ ${word}`;
    const options = kind === "bello" ? ["bel", "bello", "bell'", "bella", "bei", "begli", "belle"] : ["buono", "buon", "buon'", "buona", "buoni", "buone"];
    return baseQuestion(category, `${kind}:${nounItem.id}`, `u2-${kind}:${nounItem.id}:${plural}`, `Complete with the correct form of ${kind}`,
      kind === "bello" ? `Che ${blank}!` : blank, answer,
      `${answer} agrees with ${word}; ${kind} follows its own before-the-noun pattern.`, options.filter((option) => option !== answer));
  }

  const ISSIMO = [["bellissimo", "molto bello"], ["difficilissimo", "molto difficile"], ["bravissimi", "molto bravi"],
    ["generosissime", "molto generose"], ["pigrissimo", "molto pigro"], ["severissime", "molto severe"]]
    .map(([intensive, molto]) => ({ id: intensive, intensive, molto }));
  function issimoQuestion(sourceId) {
    const item = itemForSource(ISSIMO, sourceId);
    const expand = Math.random() < 0.5;
    return baseQuestion("-issimo", item.id, `u2-issimo:${item.id}:${expand}`, expand ? "Rewrite using molto" : "Rewrite using -issimo",
      expand ? item.intensive : item.molto, expand ? item.molto : item.intensive,
      `${item.intensive} and ${item.molto} are equivalent, with matching gender and number.`,
      ISSIMO.filter((candidate) => candidate.id !== item.id).map((candidate) => expand ? candidate.molto : candidate.intensive));
  }

  const PIACERE_PHRASES = [["gelato", "il gelato", false], ["zaini", "gli zaini blu", true], ["universita", "un'università grande", false],
    ["citta", "le piccole città", true], ["motociclette", "le motociclette", true], ["capelli", "i capelli biondi", true],
    ["letteratura", "la letteratura", false], ["libri", "i libri interessanti", true]]
    .map(([id, phrase, plural]) => ({ id, phrase, plural }));
  function piacereQuestion(sourceId) {
    const item = itemForSource(PIACERE_PHRASES, sourceId);
    const lead = random(["Mi", "Ti", "Non mi", "Non ti"]);
    const answer = item.plural ? "piacciono" : "piace";
    return baseQuestion("Piacere", item.id, `u2-piacere:${item.id}:${lead}`, "Choose piace or piacciono", `${lead} ___ ${item.phrase}.`, answer,
      `${answer} is used because ${item.phrase} is ${item.plural ? "plural" : "singular"}.`, ["piace", "piacciono"]);
  }

  const AVERE = AVERE_FORMS;
  const AVERE_CONTEXTS = { io: "Io ___ fame.", tu: "Tu ___ bisogno di un caffè.", "lui/lei/Lei": "Dolores ___ un'automobile rossa.",
    noi: "Noi ___ amici intelligenti.", voi: "Voi ___ uno zaino verde.", loro: "Loro ___ lezione oggi." };
  function avereQuestion(sourceId) {
    const subject = SUBJECTS.find((item) => `avere:${item}` === sourceId || item === sourceId) || random(SUBJECTS);
    const contextual = Math.random() < 0.65;
    return baseQuestion("Avere", `avere:${subject}`, `u2-avere:${subject}:${contextual}`, contextual ? "Complete with the correct form of avere" : "Conjugate avere",
      contextual ? AVERE_CONTEXTS[subject] : `${subject} + avere`, AVERE[subject], `${subject} takes ${AVERE[subject]}.`, Object.values(AVERE).filter((form) => form !== AVERE[subject]));
  }
  const IDIOMS = [
    ["caldo", "Oggi ci sono 40 gradi. Noi ___.", "abbiamo caldo"], ["freddo", "Brrr! Noi ___.", "abbiamo freddo"],
    ["fame", "È ora di pranzo. Loro ___.", "hanno fame"], ["sete", "Desideri un bicchiere d'acqua? Sì, io ___.", "ho sete"],
    ["sonno", "È mezzanotte. Io ___.", "ho sonno"], ["anni", "Marta, quanti anni hai? Io ___.", "ho 21 anni"],
    ["ragione", "Loro dicono che Roma è in Italia. Loro ___.", "hanno ragione"], ["torto", "2 + 2 = 5. Tu ___.", "hai torto"],
    ["fretta", "Voi siete in ritardo per la lezione. Voi ___.", "avete fretta"], ["paura", "C'è un film dell'orrore. Dolores ___.", "ha paura"],
    ["paura-di", "Gli studenti ___ un esame difficile.", "hanno paura di"], ["bisogno", "Per l'esame noi ___ studiare.", "abbiamo bisogno di"],
    ["voglia", "Paolo desidera un gelato: lui ___.", "ha voglia di un gelato"], ["pazienza", "La professoressa aspetta gli studenti: lei ___.", "ha pazienza"]
  ].map(([id, prompt, answer]) => ({ id: `idiom-${id}`, prompt, answer }));
  function idiomQuestion(sourceId) {
    const item = itemForSource(IDIOMS, sourceId);
    return baseQuestion("Avere Idioms", item.id, `u2-${item.id}`, "Complete the situation with an avere expression", item.prompt, item.answer,
      `${item.answer} is the course expression that fits this context.`, IDIOMS.filter((candidate) => candidate.id !== item.id).map((candidate) => candidate.answer));
  }

  const REGULAR_CONTEXTS = [
    ["studiare", "Io ______ letteratura perché ho un esame.", "io"], ["giocare", "Tu ______ a tennis.", "tu"],
    ["pagare", "Noi ______ il conto.", "noi"], ["mangiare", "Al ristorante noi ______ gli spaghetti.", "noi"],
    ["frequentare", "Stefania ______ quattro corsi.", "lui/lei/Lei"], ["lavorare", "Gli amici di Stefania ______ molto.", "loro"],
    ["guardare", "Domenica voi ______ un film con noi?", "voi"], ["abitare", "Io ______ a Napoli.", "io"]
  ].map(([verb, prompt, subject]) => ({ id: `regular-context-${verb}-${subject}`, verb, prompt, subject }));
  function regularVerbQuestion(sourceId) {
    if (sourceId?.startsWith("regular-context-") || Math.random() < 0.35) {
      const context = itemForSource(REGULAR_CONTEXTS, sourceId);
      const verb = REGULAR_VERBS.find((item) => item.infinitive === context.verb);
      const answer = verb.forms[context.subject];
      return baseQuestion("Regular -ARE Verbs", context.id, `u2-${context.id}`, `Complete with ${verb.infinitive}`, context.prompt, answer,
        `${context.subject} + ${verb.infinitive} → ${answer}.`, REGULAR_VERBS.map((item) => item.forms[context.subject]).filter((form) => form !== answer));
    }
    const parts = sourceId?.split(":") || [];
    const verb = REGULAR_VERBS.find((item) => item.infinitive === parts[1]) || random(REGULAR_VERBS);
    const subject = SUBJECTS.includes(parts.slice(2).join(":")) ? parts.slice(2).join(":") : random(SUBJECTS);
    const answer = verb.forms[subject];
    return baseQuestion("Regular -ARE Verbs", `regular:${verb.infinitive}:${subject}`, `u2-regular:${verb.infinitive}:${subject}`, "Conjugate the regular -ARE verb",
      `${subject} + ${verb.infinitive}`, answer, `${subject} + ${verb.infinitive} → ${answer}.`, Object.values(verb.forms).filter((form) => form !== answer));
  }
  function irregularQuestion(category, sourceId) {
    const verb = IRREGULAR_VERBS[category];
    const requested = sourceId?.replace(`${verb.infinitive}:`, "");
    const subject = SUBJECTS.includes(requested) ? requested : random(SUBJECTS);
    const answer = verb.forms[subject];
    return baseQuestion(category, `${verb.infinitive}:${subject}`, `u2-${verb.infinitive}:${subject}`, `Conjugate ${verb.infinitive} (${verb.english})`,
      `${subject} + ${verb.infinitive}`, answer, `${subject} + ${verb.infinitive} → ${answer}.`, Object.values(verb.forms).filter((form) => form !== answer));
  }

  const EXPRESSION_CONTEXTS = [
    ["andare-accordo", "Paolo, ______ d'accordo con gli altri studenti?", "vai"], ["andare-bene", "Come va l'esame? ______ bene.", "va"],
    ["andare-male", "Oggi gli esami ______ male.", "vanno"], ["dare-mano", "Tu ______ una mano a Federica.", "dai"],
    ["dare-tu", "Con gli amici noi ______ del tu.", "diamo"], ["dare-lei", "Paolo ______ del Lei al professore.", "dà"],
    ["fare-attenzione", "Gli studenti ______ attenzione in classe.", "fanno"], ["fare-esame", "Gli studenti hanno paura quando ______ un esame.", "fanno"],
    ["fare-passeggiata", "Marta e Paolo ______ una passeggiata in centro.", "fanno"], ["fare-giro", "Io ______ un giro in centro.", "faccio"],
    ["fare-gita", "Domani noi ______ una gita.", "facciamo"], ["stare-attento", "Noi ______ attenti quando il professore parla.", "stiamo"],
    ["stare-zitto", "Le ragazze ______ zitte durante il film.", "stanno"], ["stare-bene", "Ciao, come ______?", "stai"],
    ["stare-male", "Paolo non viene a lezione perché ______ male.", "sta"]
  ].map(([id, prompt, answer]) => ({ id, prompt, answer }));
  function expressionQuestion(sourceId) {
    const item = itemForSource(EXPRESSION_CONTEXTS, sourceId);
    const expression = VERB_EXPRESSIONS.find((entry) => entry.id === item.id);
    return baseQuestion("Irregular Verb Expressions", item.id, `u2-expression:${item.id}`, `Complete the ${expression.verb.toLowerCase()} expression`, item.prompt,
      item.answer, `${expression.italian} means “${expression.english}”; the subject requires ${item.answer}.`, EXPRESSION_CONTEXTS.filter((candidate) => candidate.id !== item.id).map((candidate) => candidate.answer));
  }

  const MOLTO_CONTEXTS = [
    ["adv-intelligenti", "Gli studenti sono ___ intelligenti.", "molto", "adverb"], ["adv-simpatiche", "Le ragazze sono ___ simpatiche.", "molto", "adverb"],
    ["adv-grande", "L'università è ___ grande.", "molto", "adverb"], ["adv-generose", "Le professoresse sono ___ generose.", "molto", "adverb"],
    ["noun-studenti", "Ci sono ___ studenti.", "molti", "quantifier"], ["noun-amici", "Paolo ha ___ amici.", "molti", "quantifier"],
    ["noun-lezioni", "Ci sono ___ lezioni.", "molte", "quantifier"], ["noun-automobili", "Vedo ___ automobili.", "molte", "quantifier"],
    ["noun-acqua", "Marta beve ___ acqua.", "molta", "quantifier"], ["noun-tempo", "Oggi ho ___ tempo.", "molto", "quantifier"]
  ].map(([id, prompt, answer, use]) => ({ id: `molto-${id}`, prompt, answer, use }));
  function moltoQuestion(sourceId) {
    const item = itemForSource(MOLTO_CONTEXTS, sourceId);
    return baseQuestion("Molto: Adjective vs Adverb", item.id, `u2-${item.id}`, "Choose the correct form of molto", item.prompt, item.answer,
      item.use === "adverb" ? "Molto modifies an adjective here, so it is invariable." : "Molto modifies a noun here, so it agrees in gender and number.",
      ["molto", "molta", "molti", "molte"].filter((form) => form !== item.answer));
  }

  const LISTENING = [
    ["courses", "Quanti corsi frequenta Stefania?", "quattro", ["4", "quattro corsi"]],
    ["three-courses", "Perché Paolo e Marta frequentano solo tre corsi?", "perché sono difficili", ["sono difficili"]],
    ["friends", "Perché gli amici di Marta frequentano solo due corsi?", "perché lavorano", ["lavorano"]],
    ["exam-day", "Quando Marta ha il suo esame scritto?", "martedì", ["di martedì"]],
    ["feeling", "Come si sente Marta per l'esame scritto?", "ha paura", ["Marta ha paura"]],
    ["stefania-facolta", "Quale facoltà frequenta Stefania?", "lingue", ["le lingue"]],
    ["marta-facolta", "Quale facoltà frequenta Marta?", "lettere e filosofia", []],
    ["paolo-facolta", "Quale facoltà frequenta Paolo?", "giurisprudenza", ["la giurisprudenza"]]
  ].map(([id, prompt, answer, accepted]) => ({ id: `listening-${id}`, prompt, answer, accepted }));
  function listeningQuestion(sourceId) {
    const item = itemForSource(LISTENING, sourceId);
    const question = baseQuestion("Listening Comprehension", item.id, `u2-${item.id}`, "Play the authentic course audio, then answer", item.prompt, item.answer,
      `The course-supported answer is ${item.answer}. Replay the audio and listen for the key detail.`, LISTENING.filter((entry) => entry.id !== item.id).map((entry) => entry.answer));
    question.accepted = [item.answer, ...item.accepted];
    question.audio = "./assets/unit2-listening-materie.mp3";
    return question;
  }

  const PREPOSITION_CONTEXTS = [["city", "Abito ___ Napoli.", "a"], ["country", "Abito ___ Italia.", "in"], ["friends", "Parliamo ___ le amiche.", "con"],
    ["school", "Tu studi ___ scuola.", "a"], ["tv", "Loro guardano un film ___ televisione.", "in"], ["maria", "Lui mangia le ciambelle ___ Maria.", "di"]]
    .map(([id, prompt, answer]) => ({ id: `prep-context-${id}`, prompt, answer }));
  function prepositionQuestion(sourceId) {
    if (sourceId?.startsWith("prep-context-") || Math.random() < 0.55) {
      const item = itemForSource(PREPOSITION_CONTEXTS, sourceId);
      return baseQuestion("Prepositions", item.id, `u2-${item.id}`, "Complete with a simple preposition", item.prompt, item.answer,
        `${item.answer} is the course-supported preposition in this expression.`, PREPOSITIONS.map((entry) => entry.italian).filter((value) => value !== item.answer));
    }
    return vocabularyQuestion("Prepositions", sourceId);
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
    if (category.startsWith("Verb Vocabulary")) return verbVocabularyQuestion(category, sourceId);
    if (category === "School Subjects") return schoolQuestion(sourceId);
    if (CATEGORY_GROUP[category] && category === "Prepositions") return prepositionQuestion(sourceId);
    if (CATEGORY_GROUP[category]) return vocabularyQuestion(category, sourceId);
    if (category === "Adjective Opposites") return oppositeQuestion(sourceId);
    if (category === "Adjective Agreement") return agreementQuestion(sourceId);
    if (category === "Adjective Singular ↔ Plural") return adjectiveNumberQuestion(sourceId);
    if (["Bello Before a Noun", "Buono Before a Noun"].includes(category)) return belloBuonoQuestion(category, sourceId, unit1Data);
    if (category === "-issimo") return issimoQuestion(sourceId);
    if (category === "Molto: Adjective vs Adverb") return moltoQuestion(sourceId);
    if (category === "Piacere") return piacereQuestion(sourceId);
    if (category === "Avere") return avereQuestion(sourceId);
    if (category === "Avere Idioms") return idiomQuestion(sourceId);
    if (category === "Regular -ARE Verbs") return regularVerbQuestion(sourceId);
    if (IRREGULAR_VERBS[category]) return irregularQuestion(category, sourceId);
    if (category === "Irregular Verb Expressions") return expressionQuestion(sourceId);
    if (category === "Listening Comprehension") return listeningQuestion(sourceId);
    return cultureQuestion(sourceId);
  }

  function makeMatchingQuestion(category) {
    let pairs;
    if (category.startsWith("Verb Vocabulary")) {
      pairs = shuffle(verbVocabularyPool(category)).slice(0, 5).map((verb) => ({ left: verb.infinitive, right: verb.english }));
    } else if (CATEGORY_GROUP[category]) {
      pairs = shuffle(vocabularyForCategory(category)).slice(0, 5).map((item) => ({ left: item.singular || item.italian, right: item.english }));
    } else if (category === "Adjective Opposites") {
      pairs = shuffle(oppositePairs()).slice(0, 5).map((pair) => ({ left: pair.left.italian, right: pair.right.italian }));
    } else if (category === "Avere") {
      pairs = shuffle(SUBJECTS).slice(0, 5).map((subject) => ({ left: subject, right: AVERE[subject] }));
    } else if (category === "Regular -ARE Verbs") {
      pairs = shuffle(REGULAR_VERBS).slice(0, 5).map((verb) => ({ left: verb.infinitive, right: verb.english }));
    } else if (IRREGULAR_VERBS[category]) {
      const verb = IRREGULAR_VERBS[category];
      pairs = shuffle(SUBJECTS).slice(0, 5).map((subject) => ({ left: subject, right: verb.forms[subject] }));
    } else {
      pairs = shuffle(VERB_EXPRESSIONS).slice(0, 5).map((item) => ({ left: item.italian.split(" / ")[0], right: item.english }));
    }
    return { type: "matching", category, sourceId: `matching:${category}`, id: `u2-matching:${category}:${pairs.map((pair) => pair.left).join("-")}`,
      kicker: "Match the pairs", display: category, pairs, explanation: "Review each Unit 2 pair once more before continuing." };
  }

  const PICTURE_ITEMS = [
    ["class-banco", 62.4, 77.2], ["class-carta-geografica", 37.8, 27.0], ["class-cattedra", 63.4, 62.1], ["class-cestino", 88.0, 78.5],
    ["class-computer", 79.7, 58.8], ["class-finestra", 5.0, 24.0], ["class-lavagna", 45.7, 39.9], ["class-porta", 93.7, 46.6],
    ["class-portatile", 24.6, 66.9], ["class-proiettore", 41.9, 9.3], ["class-professoressa", 51.3, 50.5], ["class-quaderno", 12.9, 82.0],
    ["class-sedia", 39.2, 85.9], ["class-studente", 2.3, 59.2], ["class-televisore", 25.6, 31.5], ["class-zaino", 30.6, 92.3]
  ].map(([id, x, y], originalIndex) => {
    const item = CLASSROOM.find((entry) => entry.id === id);
    return { ...item, x, y, originalIndex: originalIndex + 1, answer: item.singular, accepted: item.acceptedItalian };
  });

  function expandTopics(topics) {
    return [...new Set(topics.flatMap((topic) => TOPIC_EXPANSIONS[topic] || [topic]))].filter((category) => CATEGORIES.includes(category));
  }
  function migrateTopics(topics) {
    return [...new Set(topics.flatMap((topic) => {
      if (topic === "School / Class Vocabulary") return ["School Subjects", "Classroom Objects"];
      if (topic === "Bello & Buono") return ["Bello Before a Noun", "Buono Before a Noun"];
      if (topic === "Avere Idioms") return ["Avere Expressions"];
      return [topic];
    }))].filter((topic) => TOPICS.includes(topic));
  }

  window.UNIT2_DATA = {
    id: "unit2", label: "Unit 2", categories: CATEGORIES, topics: TOPICS, defaultTopics: DEFAULT_TOPICS, topicGroups: TOPIC_GROUPS, examTopics: EXAM_TOPICS,
    presets: PRESETS, presetLabels: PRESET_LABELS, matchingCategories: MATCHING_CATEGORIES, vocabulary: VOCABULARY,
    adjectives: ADJECTIVES, schoolSubjects: SCHOOL_SUBJECTS, classroom: CLASSROOM, regularVerbs: REGULAR_VERBS,
    irregularVerbs: IRREGULAR_VERBS, verbVocabulary: VERB_VOCABULARY, verbExpressions: VERB_EXPRESSIONS, pictureItems: PICTURE_ITEMS,
    pictureAsset: "./assets/unit2-classroom.png", listeningAsset: "./assets/unit2-listening-materie.mp3",
    vocabularyFilters: [
      ["all", "All"], ["exam2", "★ Exam 2"], ["personality", "Personality"], ["appearance", "Physical Appearance"],
      ["school-subjects", "School Subjects"], ["classroom", "Classroom Objects"], ["colors", "Colors"], ["nationalities", "Nationalities"],
      ["verb-vocabulary", "★ Verb Vocabulary"],
      ["avere-expressions", "Avere Expressions"], ["regular-verbs", "Regular Verbs"], ["irregular-verbs", "Irregular Verbs"],
      ["verb-expressions", "Verb Expressions"]
    ],
    counts: { vocabulary: VOCABULARY.length, adjectives: ADJECTIVES.length, personality: PERSONALITY.length, opposites: oppositePairs().length,
      schoolSubjects: SCHOOL_SUBJECTS.length, classroom: CLASSROOM.length, regularVerbs: REGULAR_VERBS.length,
      verbVocabulary: VERB_VOCABULARY.length, cultureFacts: CULTURE.length },
    expandTopics, migrateTopics, makeQuestion, makeMatchingQuestion,
    isSourceEligible(category) { return CATEGORIES.includes(category); }
  };
})();
