(() => {
  "use strict";

  const random = (items) => items[Math.floor(Math.random() * items.length)];
  const shuffle = (items) => {
    const copy = [...items];
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const swap = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[swap]] = [copy[swap], copy[index]];
    }
    return copy;
  };
  const sample = (items, count) => shuffle(items).slice(0, count);
  const normalize = (value) => String(value ?? "").normalize("NFC").trim().toLocaleLowerCase("it-IT")
    .replace(/[’‘`´]/g, "'").replace(/\s*'\s*/g, "'").replace(/\s+/g, " ");
  const textQuestion = (id, prompt, answer, explanation, category, accepted = []) => ({ id, prompt, answer, accepted, explanation, category, type: "text" });
  const choiceQuestion = (id, prompt, answer, options, explanation, category, type = "radio") => ({
    id, prompt, answer, options: shuffle([...new Set(options)]), explanation, category, type
  });
  const group = (question) => ({ id: question.id, prompt: question.prompt, questions: [question] });
  const groups = (questions) => questions.map(group);
  const selectBalanced = (pool, requirements, count) => {
    const chosen = [];
    const used = new Set();
    requirements.forEach((test) => {
      const candidate = random(shuffle(pool).filter((item) => !used.has(item.id) && test(item)));
      if (candidate) { chosen.push(candidate); used.add(candidate.id); }
    });
    shuffle(pool).forEach((item) => {
      if (chosen.length < count && !used.has(item.id)) { chosen.push(item); used.add(item.id); }
    });
    return shuffle(chosen.slice(0, count));
  };

  const four = (lemma, english, special = {}) => {
    const stem = lemma.slice(0, -1);
    return { lemma, english, family: "four", forms: { ms: lemma, fs: `${stem}a`, mp: `${stem}i`, fp: `${stem}e`, ...special } };
  };
  const two = (lemma, english) => ({ lemma, english, family: "two", forms: { ms: lemma, fs: lemma, mp: `${lemma.slice(0, -1)}i`, fp: `${lemma.slice(0, -1)}i` } });
  const ista = (lemma, english) => ({ lemma, english, family: "ista", forms: { ms: lemma, fs: lemma, mp: `${lemma.slice(0, -1)}i`, fp: `${lemma.slice(0, -1)}e` } });
  const ADJECTIVES = [
    four("alto", "tall"), four("basso", "short"), four("magro", "thin"), four("grasso", "heavy"),
    four("biondo", "blond"), four("bruno", "dark-haired"), four("simpatico", "likeable"), four("antipatico", "unlikeable"),
    four("generoso", "generous"), four("tirchio", "stingy"), four("estroverso", "outgoing"), four("timido", "shy"),
    four("sportivo", "athletic"), four("pigro", "lazy"), four("bravo", "capable"), four("cattivo", "bad"),
    four("bello", "beautiful"), four("brutto", "ugly"), four("vecchio", "old", { mp: "vecchi" }), four("nuovo", "new"),
    four("italiano", "Italian"), four("americano", "American"), four("spagnolo", "Spanish"),
    four("tedesco", "German", { fs: "tedesca", mp: "tedeschi", fp: "tedesche" }),
    four("messicano", "Mexican"), four("ricco", "rich", { mp: "ricchi" }),
    two("facile", "easy"), two("difficile", "difficult"), two("interessante", "interesting"),
    two("divertente", "fun"), two("intelligente", "intelligent"), two("gentile", "kind"),
    two("grande", "large"), two("giovane", "young"), two("triste", "sad"), two("paziente", "patient"),
    two("impaziente", "impatient"), two("francese", "French"), two("inglese", "English"),
    two("cinese", "Chinese"), two("giapponese", "Japanese"),
    ista("ottimista", "optimistic"), ista("pessimista", "pessimistic"), ista("altruista", "selfless"), ista("egoista", "selfish")
  ];
  const SUBJECTS = {
    ms: ["Marco è", "Il professore è", "Lo studente è", "L'amico di Paolo è"],
    fs: ["Giulia è", "La professoressa è", "La studentessa è", "L'amica di Marta è"],
    mp: ["Marco e Paolo sono", "Gli studenti sono", "Anna e Luca sono", "I professori sono"],
    fp: ["Anna e Giulia sono", "Le studentesse sono", "Le lezioni sono", "Maria e Teresa sono"]
  };
  const commonStem = (forms) => {
    let stem = forms[0];
    forms.slice(1).forEach((form) => { while (!form.startsWith(stem)) stem = stem.slice(0, -1); });
    return stem;
  };
  function adjectiveEndingBank() {
    return ADJECTIVES.flatMap((adjective) => Object.keys(SUBJECTS).map((slot) => {
      const form = adjective.forms[slot];
      const stem = adjective.lemma === "vecchio" ? "vecch" : commonStem(Object.values(adjective.forms));
      return textQuestion(`adj-ending-${adjective.lemma}-${slot}`, `${random(SUBJECTS[slot])} ${stem}___.`, form.slice(stem.length),
        `${form} agrees with the ${slot === "ms" ? "masculine singular" : slot === "fs" ? "feminine singular" : slot === "mp" ? "masculine or mixed plural" : "feminine plural"} subject.`, "Adjective Agreement");
    }));
  }
  function makeAdjectiveEndings() {
    const bank = adjectiveEndingBank();
    const requirements = [
      (item) => item.id.includes("facile-") || item.id.includes("interessante-") || item.id.includes("paziente-"),
      (item) => item.id.includes("ottimista-") || item.id.includes("pessimista-") || item.id.includes("altruista-"),
      ...["fs", "mp", "fp", "mp", "fs", "fp"].map((slot) => (item) => item.id.endsWith(`-${slot}`))
    ];
    return groups(selectBalanced(bank, requirements, 10));
  }

  const PLURAL_SUBJECTS = {
    ms: [["l'uomo è", "gli uomini sono"], ["il ragazzo è", "i ragazzi sono"], ["lo studente è", "gli studenti sono"], ["il professore è", "i professori sono"]],
    fs: [["la ragazza è", "le ragazze sono"], ["l'amica è", "le amiche sono"], ["la studentessa è", "le studentesse sono"], ["la professoressa è", "le professoresse sono"]]
  };
  const INVARIANT_COLORS = ["blu", "viola", "rosa"];
  function pluralBank() {
    const normal = ADJECTIVES.flatMap((adjective) => ["ms", "fs"].map((slot) => {
      const [singular, plural] = random(PLURAL_SUBJECTS[slot]);
      const target = slot === "ms" ? "mp" : "fp";
      const answer = adjective.forms[target];
      return textQuestion(`adj-plural-${adjective.lemma}-${slot}`, `${singular} ${adjective.forms[slot]} → ${plural} ___`, answer,
        `${adjective.forms[slot]} becomes ${answer} with this plural subject.`, "Adjective Singular ↔ Plural");
    }));
    const colorSubjects = {
      ms: [["lo zaino è", "gli zaini sono"], ["il quaderno è", "i quaderni sono"]],
      fs: [["la cartellina è", "le cartelline sono"], ["la sedia è", "le sedie sono"]]
    };
    const colors = INVARIANT_COLORS.flatMap((color) => ["ms", "fs"].map((slot) => {
      const [singular, plural] = random(colorSubjects[slot]);
      return textQuestion(`adj-plural-${color}-${slot}`, `${singular} ${color} → ${plural} ___`, color,
        `${color} is invariable, so it does not change in the plural.`, "Adjective Singular ↔ Plural");
    }));
    return [...normal, ...colors];
  }
  function makePlurals() {
    const bank = pluralBank();
    return groups(selectBalanced(bank, [
      (item) => item.id.includes("vecchio-ms"), (item) => item.id.includes("ricco-ms"),
      (item) => INVARIANT_COLORS.some((color) => item.id.includes(color)),
      (item) => item.id.includes("ottimista-ms"), (item) => item.id.endsWith("-fs")
    ], 10));
  }

  const VOCAB_CONTEXTS = [
    ["color-flag", "La bandiera italiana è rossa, bianca e ___.", "verde", ["verde", "viola", "nera", "azzurra"], "colors"],
    ["color-sun", "Il sole è ___.", "giallo", ["giallo", "grigio", "marrone", "nero"], "colors"],
    ["color-sky", "Quando non ci sono nuvole, il cielo è ___.", "azzurro", ["azzurro", "rosa", "arancione", "marrone"], "colors"],
    ["color-coffee", "Il caffè è normalmente ___.", "marrone", ["marrone", "verde", "viola", "bianco"], "colors"],
    ["appearance-bald", "Paolo non ha i capelli: è ___.", "calvo", ["calvo", "biondo", "riccio", "giovane"], "appearance"],
    ["appearance-glasses", "Marta vede male e porta gli ___.", "occhiali", ["occhiali", "occhi", "baffi", "capelli"], "appearance"],
    ["appearance-beard", "Il professore ha molti peli sul mento: ha la ___.", "barba", ["barba", "gomma", "porta", "cattedra"], "appearance"],
    ["appearance-curly", "I capelli di Sara non sono lisci; sono ___.", "ricci", ["ricci", "corti", "chiari", "biondi"], "appearance"],
    ["personality-gives", "Luca aiuta tutti e offre sempre il caffè: è ___.", "generoso", ["generoso", "tirchio", "pigro", "timido"], "personality"],
    ["personality-shy", "Anna parla poco con persone nuove: è ___.", "timida", ["timida", "estroversa", "egoista", "allegra"], "personality"],
    ["personality-positive", "Gianni pensa che tutto andrà bene: è ___.", "ottimista", ["ottimista", "pessimista", "antipatico", "noioso"], "personality"],
    ["personality-lazy", "Marco non studia e non lavora mai: è ___.", "pigro", ["pigro", "sportivo", "responsabile", "bravo"], "personality"],
    ["nationality-germany", "Klara è nata e vive in Germania: è ___.", "tedesca", ["tedesca", "francese", "spagnola", "inglese"], "nationalities"],
    ["nationality-japan", "Kenji e Akira sono di Tokyo: sono ___.", "giapponesi", ["giapponesi", "cinesi", "americani", "arabi"], "nationalities"],
    ["nationality-mexico", "Ana e Luisa sono nate in Messico: sono ___.", "messicane", ["messicane", "spagnole", "italiane", "francesi"], "nationalities"],
    ["subject-algebra", "Studio l'algebra nel corso di ___.", "matematica", ["matematica", "letteratura", "psicologia", "storia"], "subjects"],
    ["subject-software", "Per studiare software e computer frequento ___.", "informatica", ["informatica", "economia", "biologia", "filosofia"], "subjects"],
    ["subject-law", "La Costituzione è importante nel corso di ___.", "giurisprudenza", ["giurisprudenza", "chimica", "giornalismo", "ingegneria"], "subjects"],
    ["subject-art", "Michelangelo e la Pop-art si studiano in ___.", "storia dell'arte", ["storia dell'arte", "scienze politiche", "psicologia", "economia"], "subjects"],
    ["subject-languages", "Spagnolo, francese e tedesco sono ___.", "lingue straniere", ["lingue straniere", "scienze", "letteratura", "matematica"], "subjects"],
    ["class-board", "La professoressa scrive sulla ___ con un pennarello.", "lavagna", ["lavagna", "cattedra", "finestra", "porta"], "classroom"],
    ["class-pencil", "Sul banco ho un libro, un quaderno e una ___.", "matita", ["matita", "sedia", "luce", "carta geografica"], "classroom"],
    ["class-erase", "Lo studente cancella una parola con una ___.", "gomma", ["gomma", "penna", "cartellina", "agendina"], "classroom"],
    ["class-project", "Il professore usa il ___ per mostrare le slide.", "proiettore", ["proiettore", "cestino", "orologio", "quaderno"], "classroom"],
    ["class-backpack", "Porto i libri a scuola nello ___.", "zaino", ["zaino", "schermo", "banco", "cancellino"], "classroom"],
    ["class-map", "Per vedere l'Italia guardiamo una ___.", "carta geografica", ["carta geografica", "cartellina", "agendina", "finestra"], "classroom"],
    ["culture-luck", "Prima di un esame, l'insegnante dice: ___.", "in bocca al lupo!", ["in bocca al lupo!", "buonanotte", "mi dispiace", "come stai?"], "culture"],
    ["culture-reply", "Alla frase «In bocca al lupo!» uno studente può rispondere: ___.", "crepi il lupo!", ["crepi il lupo!", "a domani", "non c'è male", "grazie, altrettanto"], "culture"]
  ].map(([id, prompt, answer, options, family]) => choiceQuestion(`vocab-${id}`, prompt, answer, options, `The context calls for ${answer}.`, family === "classroom" ? "Classroom Objects" : family === "subjects" ? "School Subjects" : family === "culture" ? "Culture / Reading" : family === "nationalities" ? "Nationalities" : family === "appearance" ? "Physical Appearance" : family === "personality" ? "Personality Adjectives" : "Colors"));

  function vocabularyBank(unit2) {
    const generated = [];
    const sets = [
      ["classroom", unit2.classroom, "In classe, quale parola italiana indica “{english}”?"],
      ["subjects", unit2.schoolSubjects, "All'università, quale materia significa “{english}”?" ]
    ];
    sets.forEach(([family, entries, template]) => entries.forEach((entry) => {
      const answer = entry.singular;
      const options = [answer, ...sample(entries.filter((other) => other.id !== entry.id), 3).map((other) => other.singular)];
      generated.push(choiceQuestion(`vocab-generated-${entry.id}`, template.replace("{english}", entry.english), answer, options,
        `${answer} means “${entry.english}.”`, family === "classroom" ? "Classroom Objects" : "School Subjects"));
    }));
    return [...VOCAB_CONTEXTS, ...generated];
  }
  function makeVocabulary(unit2) {
    const bank = vocabularyBank(unit2);
    const families = ["Colors", "Physical Appearance", "Personality Adjectives", "Nationalities", "School Subjects", "Classroom Objects", "Classroom Objects", "Classroom Objects", "Culture / Reading"];
    return groups(selectBalanced(bank, families.map((category) => (item) => item.category === category), 12));
  }

  const SUBJECT_ORDER = ["io", "tu", "lui/lei/Lei", "noi", "voi", "loro"];
  const SUBJECT_LABELS = { io: "io", tu: "tu", "lui/lei/Lei": "lei", noi: "noi", voi: "voi", loro: "loro" };
  const VERB_CONTEXT = {
    abitare: "a Ithaca", aiutare: "gli amici", arrivare: "in classe", ascoltare: "la musica", aspettare: "l'autobus",
    cercare: "il quaderno", cominciare: "la lezione", iniziare: "l'esame", comprare: "un libro", frequentare: "il corso d'italiano",
    giocare: "a calcio", guardare: "un film", lavorare: "in biblioteca", mangiare: "la pizza", ordinare: "un caffè",
    pagare: "il conto", parlare: "italiano", spiegare: "la grammatica", studiare: "la matematica", tornare: "a casa",
    visitare: "Roma", andare: "a scuola", dare: "una mano", fare: "attenzione", stare: "bene"
  };
  function verbBank(unit2) {
    const verbs = [...unit2.regularVerbs, ...Object.values(unit2.irregularVerbs).map((verb) => ({ ...verb, id: `irregular-${verb.infinitive}` }))];
    return verbs.flatMap((verb) => SUBJECT_ORDER.flatMap((target, targetIndex) => {
      const source = SUBJECT_ORDER[(targetIndex + 2) % SUBJECT_ORDER.length];
      const context = VERB_CONTEXT[verb.infinitive];
      return textQuestion(`verb-${verb.infinitive}-${source}-${target}`, `${SUBJECT_LABELS[source]} ${verb.forms[source]} ${context} — ${SUBJECT_LABELS[target]} ___ ${context}.`, verb.forms[target],
        `${verb.infinitive} with ${SUBJECT_LABELS[target]} is ${verb.forms[target]}.`, unit2.irregularVerbs[verb.infinitive[0].toUpperCase() + verb.infinitive.slice(1)] ? verb.infinitive[0].toUpperCase() + verb.infinitive.slice(1) : "Regular -ARE Verbs");
    }));
  }
  function makeVerbs(unit2) {
    const bank = verbBank(unit2);
    const required = ["giocare", "pagare", "cercare", "spiegare", "studiare", "andare", "dare", "fare", "stare"];
    return groups(selectBalanced(bank, required.map((verb) => (item) => item.id.startsWith(`verb-${verb}-`)), 15));
  }

  const EXPRESSION_BANK = [
    ["bene-io", "Oggi io ___ bene.", "sto"], ["bene-noi", "Dopo l'esame noi ___ bene.", "stiamo"],
    ["male-loro", "Paolo e Anna non ___ bene; stanno male.", "stanno"], ["accordo-loro", "Giorgio e Paolo ___ d'accordo.", "vanno"],
    ["accordo-noi", "Io e Marta ___ d'accordo.", "andiamo"], ["andare-bene", "Come ___ il corso? — Va molto bene.", "va"],
    ["andare-male", "Le lezioni non ___ bene oggi.", "vanno"], ["mano-tu", "Tu ___ una mano a Maria.", "dai"],
    ["mano-voi", "Voi ___ una mano al professore.", "date"], ["tu-noi", "Con gli amici noi ___ del tu.", "diamo"],
    ["lei-studenti", "Gli studenti ___ del Lei alla professoressa.", "danno"], ["attention-io", "Durante la lezione io ___ attenzione.", "faccio"],
    ["attention-voi", "Ragazzi, voi ___ attenzione.", "fate"], ["exam-noi", "Domani noi ___ un esame.", "facciamo"],
    ["walk-loro", "La domenica loro ___ una passeggiata.", "fanno"], ["trip-tu", "In estate tu ___ una gita in Puglia.", "fai"],
    ["tour-lei", "A Roma la professoressa ___ un giro in centro.", "fa"], ["attenta-io-f", "Quando guido, io ___ attenta.", "sto"],
    ["attenti-noi", "Noi ___ attenti quando il professore parla.", "stiamo"], ["attente-loro", "Anna e Giulia ___ attente in classe.", "stanno"],
    ["zitto-tu", "Durante l'esame tu ___ zitto.", "stai"], ["zitti-voi", "Ragazzi, voi ___ zitti in biblioteca.", "state"],
    ["bene-lei", "Come ___ la professoressa? — Bene.", "sta"], ["giro-noi", "Dopo la lezione noi ___ un giro.", "facciamo"],
    ["exam-loro", "Lunedì gli studenti ___ l'esame d'italiano.", "fanno"], ["mano-lei", "La professoressa ___ una mano agli studenti.", "dà"]
  ].map(([id, prompt, answer]) => textQuestion(`expression-${id}`, prompt, answer, `The expression requires ${answer}.`, "Irregular Verb Expressions"));
  function makeExpressions() { return groups(sample(EXPRESSION_BANK, 8)); }

  const AVERE_FORMS = { io: "ho", tu: "hai", lei: "ha", noi: "abbiamo", voi: "avete", loro: "hanno" };
  const AVERE_IDIOMS = [
    ["ghosts", "Carlo vede dei fantasmi. Carlo ha ___.", "paura"], ["no-food", "A mezzogiorno non mangiamo da ore. Abbiamo ___.", "fame"],
    ["wrong-math", "1+1=3? No, ragazzi! Avete ___.", "torto"], ["correct", "2+2=4. Tu hai ___.", "ragione"],
    ["winter", "A Ithaca in gennaio Maria ha ___.", "freddo"], ["summer", "In agosto a Napoli io ho ___.", "caldo"],
    ["water", "Dopo una lunga passeggiata loro hanno ___.", "sete"], ["bed", "È mezzanotte e Paolo ha ___.", "sonno"],
    ["late", "L'autobus parte fra due minuti: noi abbiamo ___.", "fretta"], ["homework", "Per l'esame ho ___ di studiare.", "bisogno"],
    ["pizza", "Stasera Marta ha ___ di mangiare una pizza.", "voglia"], ["wait", "Il professore dice: «Ragazzi, abbiate ___!»", "pazienza"],
    ["dogs", "Giulia ha ___ dei cani grandi.", "paura"], ["coffee", "La mattina voi avete ___ di un caffè.", "bisogno"],
    ["museum", "Domenica abbiamo ___ di visitare il museo.", "voglia"], ["exam-fear", "Prima dell'esame gli studenti hanno ___.", "paura"]
  ].map(([id, prompt, answer]) => textQuestion(`avere-idiom-${id}`, prompt, answer, `The situation uses avere ${answer}.`, "Avere Expressions"));
  function avereBank() {
    const conjugations = Object.entries(AVERE_FORMS).flatMap(([subject, answer]) => [
      textQuestion(`avere-form-${subject}`, `${subject} ___ un quaderno.`, answer, `The present-tense form of avere for ${subject} is ${answer}.`, "Avere"),
      textQuestion(`avere-age-${subject}`, `${subject} ___ diciotto anni.`, answer, `Italian age uses avere: ${subject} ${answer} diciotto anni.`, "Avere")
    ]);
    return [...conjugations, ...AVERE_IDIOMS];
  }
  function makeAvere() {
    const bank = avereBank();
    return groups(selectBalanced(bank, [
      (item) => item.id.startsWith("avere-form"), (item) => item.id.startsWith("avere-age"),
      (item) => item.id.includes("ghosts"), (item) => item.id.includes("no-food"), (item) => item.id.includes("wrong-math")
    ], 8));
  }

  const PREPOSITION_BANK = [
    ["city-rome", "Vado ___ Roma.", "a"], ["city-naples", "Maria abita ___ Napoli.", "a"], ["city-bologna", "Studio ___ Bologna.", "a"],
    ["city-venice", "Domani andiamo ___ Venezia.", "a"], ["city-ithaca", "Frequento l'università ___ Ithaca.", "a"],
    ["home", "Dopo la lezione torno ___ casa.", "a"], ["school", "Gli studenti sono ___ scuola.", "a"], ["theatre", "Sabato vado ___ teatro.", "a"],
    ["bed", "A mezzanotte vado ___ letto.", "a"], ["table", "La famiglia mangia ___ tavola.", "a"], ["foot", "Vado in centro ___ piedi.", "a"],
    ["country-italy", "Giulia vive ___ Italia.", "in"], ["region-campania", "Napoli è ___ Campania.", "in"], ["region-puglia", "Bari è ___ Puglia.", "in"],
    ["state", "Los Angeles è ___ California.", "in"], ["continent", "L'Italia è ___ Europa.", "in"],
    ["car", "Andiamo a scuola ___ macchina.", "in"], ["train", "Vado a Venezia ___ treno.", "in"], ["library", "Studio ___ biblioteca.", "in"],
    ["gym", "Gli studenti sportivi sono ___ palestra.", "in"], ["square", "Facciamo una passeggiata ___ piazza.", "in"],
    ["city", "Il sabato lavoro ___ città.", "in"], ["centre", "Ci sono molti negozi ___ centro.", "in"], ["tv", "Guardo la partita ___ televisione.", "in"],
    ["vacation", "A gennaio loro vanno ___ vacanza.", "in"], ["friends", "Parlo italiano ___ gli amici.", "con"],
    ["teacher", "Studio ___ la professoressa.", "con"], ["grades", "Studio molto ___ avere buoni voti.", "per"],
    ["purpose", "Vado in Italia ___ studiare.", "per"], ["gift", "Questo libro è ___ Maria.", "per"],
    ["between-cities", "Ithaca è ___ Syracuse e Binghamton.", "tra"], ["between-people", "Paolo è seduto ___ Anna e Luca.", "tra"],
    ["from", "Il professore è ___ Firenze.", "di"], ["source", "Torno ___ Roma domenica.", "da"], ["desk", "Il libro è ___ banco.", "su"],
    ["between-fra", "L'esame è ___ due giorni.", "fra"]
  ].map(([id, prompt, answer]) => textQuestion(`prep-${id}`, prompt, answer, `${answer} is the correct simple preposition in this context.`, "Prepositions"));
  function makePrepositions() {
    return groups(selectBalanced(PREPOSITION_BANK, ["a", "in", "con", "per", "tra"].map((answer) => (item) => item.answer === answer), 10));
  }

  const LIKED_THINGS = [
    ["la matematica", "piace"], ["il professore", "piace"], ["la pizza", "piace"], ["la storia dell'arte", "piace"],
    ["studiare in biblioteca", "piace"], ["mangiare la pizza", "piace"], ["giocare a calcio", "piace"], ["andare a Napoli", "piace"],
    ["le materie umanistiche", "piacciono"], ["le sedie della biblioteca", "piacciono"], ["i professori", "piacciono"],
    ["i corsi d'italiano", "piacciono"], ["le lezioni", "piacciono"], ["gli studenti", "piacciono"]
  ];
  const LIKERS = ["Mi", "Ti", "A Giulia", "A Marco", "A Giulia e a Teresa"];
  function piacereBank() {
    return LIKED_THINGS.flatMap(([thing, answer], thingIndex) => LIKERS.map((liker, likerIndex) => textQuestion(
      `piacere-${thingIndex}-${likerIndex}`, `${liker} ___ ${thing}.`, answer,
      `${answer} agrees with ${thing.includes(" ") ? `the thing liked (${thing})` : thing}, not with the person who likes it.`, "Piacere"
    )));
  }
  function makePiacere() {
    const bank = piacereBank();
    return groups(selectBalanced(bank, [
      (item) => item.answer === "piace" && /studiare|mangiare|giocare|andare/.test(item.prompt),
      (item) => item.answer === "piace" && !/studiare|mangiare|giocare|andare/.test(item.prompt),
      (item) => item.answer === "piacciono", (item) => item.prompt.startsWith("A Giulia e a Teresa")
    ], 7));
  }

  const BELLO_BUONO_BANK = [
    ["bella-piazza", "A Napoli c'è una ___ piazza.", "bella", "bello"], ["bello-zaino", "Marco compra un ___ zaino.", "bello", "bello"],
    ["bell-obelisco", "In piazza vediamo un ___ obelisco.", "bell'", "bello"], ["bel-ragazzo", "Luca è un ___ ragazzo.", "bel", "bello"],
    ["bei-ragazzi", "In classe ci sono due ___ ragazzi.", "bei", "bello"], ["begli-studenti", "Sono ___ studenti.", "begli", "bello"],
    ["begli-obelischi", "A Roma ci sono ___ obelischi.", "begli", "bello"], ["belle-auto", "In centro vediamo ___ automobili.", "belle", "bello"],
    ["belle-pizze", "Al ristorante ordinano due ___ pizze.", "belle", "bello"], ["bel-corso", "Frequento un ___ corso.", "bel", "bello"],
    ["buon-caffe", "La mattina bevo un ___ caffè.", "buon", "buono"], ["buono-zaino", "Questo è un ___ zaino.", "buono", "buono"],
    ["buon-amica", "Giulia è una ___ amica.", "buon'", "buono"], ["buona-pizza", "Mangiamo una ___ pizza.", "buona", "buono"],
    ["buoni-corsi", "All'università frequento ___ corsi.", "buoni", "buono"], ["buone-lezioni", "Le professoresse preparano ___ lezioni.", "buone", "buono"],
    ["buon-professore", "Il signor Bianchi è un ___ professore.", "buon", "buono"], ["buona-studentessa", "Marta è una ___ studentessa.", "buona", "buono"],
    ["belle-sedie", "La biblioteca ha ___ sedie nuove.", "belle", "bello"], ["bei-quaderni", "Compro due ___ quaderni.", "bei", "bello"]
  ].map(([id, prompt, answer, kind]) => textQuestion(`article-adj-${id}`, prompt, answer, `${answer} is the correct form of ${kind} before this noun.`, kind === "bello" ? "Bello Before a Noun" : "Buono Before a Noun"));
  function makeBelloBuono() { return groups(selectBalanced(BELLO_BUONO_BANK, [(item) => item.category.startsWith("Bello"), (item) => item.category.startsWith("Buono")], 6)); }

  const MOLTO_BANK = [
    ["adv-bello", "Il corso è ___ bello.", "molto", "adverb"], ["adv-grande", "La scuola è ___ grande.", "molto", "adverb"],
    ["adv-timida", "La studentessa è ___ timida.", "molto", "adverb"], ["adv-intelligenti", "Gli studenti sono ___ intelligenti.", "molto", "adverb"],
    ["adv-difficili", "Le lezioni sono ___ difficili.", "molto", "adverb"], ["adv-simpatico", "Il professore è ___ simpatico.", "molto", "adverb"],
    ["adv-interessante", "La storia è ___ interessante.", "molto", "adverb"], ["adv-sportive", "Le ragazze sono ___ sportive.", "molto", "adverb"],
    ["q-students", "Ci sono ___ studenti in biblioteca.", "molti", "quantifier"], ["q-lessons", "Ho ___ lezioni il lunedì.", "molte", "quantifier"],
    ["q-water", "Dopo la palestra bevo ___ acqua.", "molta", "quantifier"], ["q-friends", "Paolo ha ___ amici.", "molti", "quantifier"],
    ["q-homework", "Oggi ho ___ compiti.", "molti", "quantifier"], ["q-patience", "La professoressa ha ___ pazienza.", "molta", "quantifier"],
    ["q-time", "Non abbiamo ___ tempo.", "molto", "quantifier"], ["q-books", "Sul banco ci sono ___ libri.", "molti", "quantifier"],
    ["q-chairs", "In classe ci sono ___ sedie.", "molte", "quantifier"], ["q-fame", "Dopo l'esame ho ___ fame.", "molta", "quantifier"],
    ["q-courses", "Frequento ___ corsi.", "molti", "quantifier"], ["q-work", "Il professore ha ___ lavoro.", "molto", "quantifier"]
  ].map(([id, prompt, answer, use]) => textQuestion(`molto-${id}`, prompt, answer,
    use === "adverb" ? "Molto modifies an adjective, so it stays invariable." : "Molto modifies a noun, so it agrees in gender and number.", "Molto: Adjective vs Adverb"));
  function makeMolto() { return groups(selectBalanced(MOLTO_BANK, [(item) => item.id.includes("adv-"), (item) => item.id.includes("q-")], 6)); }

  const READING_SETS = [
    {
      id: "elena", title: "La settimana di Elena",
      passage: `Elena è una studentessa del primo anno all'Università di Bologna. Abita in centro con due amiche, Marta e Sofia. Dal lunedì al venerdì va all'università a piedi perché la loro casa è vicino alla scuola. Il lunedì e il mercoledì Elena frequenta matematica e informatica; il martedì e il giovedì studia letteratura e storia dell'arte. La sua materia preferita è informatica perché il professore, il signor Conti, è giovane, paziente e molto divertente. Ha i capelli corti e neri e porta gli occhiali. La professoressa di matematica, invece, è seria ma gentile. Elena pensa che matematica sia difficile, però studia molto in biblioteca con Marta.

Il venerdì Elena non ha lezioni la mattina. Lavora in un piccolo bar vicino a Piazza Maggiore e torna a casa alle tre. Nel pomeriggio prepara i compiti e guarda un film con Sofia. Elena è sportiva: il sabato gioca a pallacanestro in palestra. La domenica ha voglia di riposare, ma spesso fa una passeggiata con le amiche. A Elena piace molto Bologna e le piacciono i suoi corsi, anche se prima degli esami ha sempre un po' di paura.`,
      questions: [
        ["year", "Elena è al secondo anno.", "Falso", ["Vero", "Falso"]], ["home", "Elena abita fuori città.", "Falso", ["Vero", "Falso"]],
        ["days", "Quando frequenta informatica?", "il lunedì e il mercoledì", ["il lunedì e il mercoledì", "il martedì e il giovedì", "il venerdì", "la domenica"]],
        ["teacher", "Il professore d'informatica porta gli occhiali.", "Vero", ["Vero", "Falso"]],
        ["personality", "Il signor Conti è serio e impaziente.", "Falso", ["Vero", "Falso"]],
        ["work", "Elena lavora il venerdì mattina.", "Vero", ["Vero", "Falso"]],
        ["sport", "Che sport pratica Elena?", "pallacanestro", ["pallacanestro", "calcio", "tennis", "nuoto"]],
        ["likes", "A Elena non piacciono i corsi.", "Falso", ["Vero", "Falso"]],
        ["exam", "Come si sente prima degli esami?", "ha paura", ["ha paura", "ha fame", "ha sonno", "ha caldo"]]
      ]
    },
    {
      id: "davide", title: "La scuola di Davide",
      passage: `Davide frequenta un liceo (high school) grande a Torino. Nella scuola ci sono venti aule, due laboratori di scienze, una biblioteca e una palestra moderna. La sua classe è al secondo piano, vicino alla biblioteca. Nell'aula c'è una lavagna, un proiettore, una carta geografica e un grande orologio. Davide siede davanti alla finestra con il suo amico Amir. Amir è alto, magro e molto calmo; Davide invece è basso, biondo ed estroverso.

Il lunedì la prima lezione è chimica. Davide non ama la chimica perché è difficile, ma gli piace fare gli esperimenti (experiments) nel laboratorio. La sua materia preferita è storia dell'arte. La professoressa, la signora Riva, è giovane, creativa e gentile. Il mercoledì Davide ha anche inglese e matematica. Dopo le lezioni aspetta l'autobus con Amir e torna a casa alle quattro. Il giovedì i due ragazzi studiano insieme in biblioteca per avere buoni voti. Il venerdì non studiano: fanno un giro in centro e mangiano una pizza. Davide dice che la scuola è impegnativa (demanding), ma interessante.`,
      questions: [
        ["city", "La scuola di Davide è a Torino.", "Vero", ["Vero", "Falso"]], ["library", "La classe è lontana dalla biblioteca.", "Falso", ["Vero", "Falso"]],
        ["objects", "Quale oggetto NON è nominato nell'aula?", "un televisore", ["un televisore", "una lavagna", "un proiettore", "un orologio"]],
        ["amir", "Amir è alto e calmo.", "Vero", ["Vero", "Falso"]], ["davide", "Davide ha i capelli scuri.", "Falso", ["Vero", "Falso"]],
        ["favorite", "Qual è la materia preferita di Davide?", "storia dell'arte", ["storia dell'arte", "chimica", "matematica", "inglese"]],
        ["thursday", "Il giovedì studiano in biblioteca.", "Vero", ["Vero", "Falso"]], ["friday", "Il venerdì fanno un esame.", "Falso", ["Vero", "Falso"]],
        ["opinion", "Davide pensa che la scuola sia impegnativa ma interessante.", "Vero", ["Vero", "Falso"]]
      ]
    },
    {
      id: "lucia", title: "Lucia all'università",
      passage: `Lucia ha diciannove anni e studia all'Università di Napoli. Abita in un appartamento (apartment) con sua sorella Chiara, che lavora in un ristorante. Lucia va all'università in treno il lunedì, il martedì e il giovedì. Il mercoledì segue una lezione online a casa e il venerdì lavora con Chiara. Studia psicologia, biologia e lingue straniere. Le piace molto la psicologia, ma non le piacciono le scienze perché gli esami sono difficili.

La sua professoressa di psicologia si chiama Anna De Luca. È una donna alta con i capelli lunghi e ricci. È intelligente, allegra e paziente; quando gli studenti hanno bisogno di una mano, spiega tutto con calma. Lucia frequenta il corso con il suo amico Pietro, un ragazzo serio e responsabile. Il martedì studiano insieme in biblioteca. Sul banco hanno sempre due libri, un quaderno, una penna e un portatile. Dopo la lezione hanno fame e ordinano un panino al bar. Nel fine settimana Lucia torna a Salerno per visitare i genitori. La domenica fa una passeggiata sul mare e sta molto bene.`,
      questions: [
        ["age", "Lucia ha diciannove anni.", "Vero", ["Vero", "Falso"]], ["days", "Lucia va all'università tutti i giorni.", "Falso", ["Vero", "Falso"]],
        ["friday", "Che cosa fa il venerdì?", "lavora con Chiara", ["lavora con Chiara", "va a biologia", "studia con Pietro", "torna a Salerno"]],
        ["likes", "A Lucia piacciono molto le scienze.", "Falso", ["Vero", "Falso"]], ["teacher-look", "La professoressa ha i capelli lunghi e ricci.", "Vero", ["Vero", "Falso"]],
        ["teacher-personality", "Anna De Luca è impaziente.", "Falso", ["Vero", "Falso"]], ["objects", "Lucia e Pietro hanno un portatile sul banco.", "Vero", ["Vero", "Falso"]],
        ["hunger", "Dopo la lezione hanno ___.", "fame", ["fame", "freddo", "paura", "sonno"]], ["weekend", "Nel fine settimana Lucia va a Salerno.", "Vero", ["Vero", "Falso"]]
      ]
    }
  ];
  function makeReading() {
    const set = random(READING_SETS);
    const questions = sample(set.questions, 8).map(([id, prompt, answer, options]) => choiceQuestion(`reading-${set.id}-${id}`, prompt, answer, options,
      "The answer is stated or directly supported by the reading passage.", "Culture / Reading"));
    return { passage: set.passage, passageTitle: set.title, groups: groups(questions) };
  }

  const LISTENING_SETS = [
    {
      id: "maria", title: "Il messaggio di Maria",
      script: `Ciao! Mi chiamo Maria e sono una studentessa del primo anno all'Università di Bologna. Studio alla facoltà di Lettere. Questo semestre frequento quattro corsi: letteratura, filosofia, storia dell'arte e inglese. Le lezioni sono interessanti, ma filosofia è abbastanza difficile. Il professore di filosofia è tedesco, alto e calvo. È serio, però è molto paziente. La professoressa di storia è giovane, estroversa e ottimista. Il suo corso è facile e divertente. Vado all'università dal lunedì al venerdì, ma il mercoledì non ho lezioni e studio a casa. La mattina ascolto musica e preparo i compiti. Il pomeriggio lavoro in una piccola pizzeria. Non mi piacciono la chimica e la matematica, ma mi piace molto la pizza napoletana. La domenica io e i miei amici andiamo a Napoli, facciamo un giro in centro e mangiamo alla Pizzeria Sorbillo.`,
      questions: [
        ["year", "Maria è una studentessa del secondo anno.", "Falso", ["Vero", "Falso"], "radio"],
        ["city", "Dove studia Maria?", "a Bologna", ["a Bologna", "a Venezia", "a Napoli", "a Roma"], "radio"],
        ["courses", "I corsi di Maria includono...", ["letteratura", "filosofia", "storia dell'arte"], ["letteratura", "filosofia", "storia dell'arte", "chimica", "matematica"], "checkbox"],
        ["professor", "Il professore di filosofia è tedesco e calvo.", "Vero", ["Vero", "Falso"], "radio"],
        ["wednesday", "Il mercoledì Maria non ha lezioni.", "Vero", ["Vero", "Falso"], "radio"],
        ["dislikes", "A Maria non piacciono la chimica e la matematica.", "Vero", ["Vero", "Falso"], "radio"],
        ["work", "Dove lavora Maria?", "in una pizzeria", ["in una pizzeria", "in biblioteca", "in palestra", "in un museo"], "radio"],
        ["sunday", "La domenica Maria va a Napoli con gli amici.", "Vero", ["Vero", "Falso"], "radio"]
      ]
    },
    {
      id: "paolo", title: "Il messaggio di Paolo",
      script: `Buongiorno! Sono Paolo, ho vent'anni e studio informatica all'Università di Torino. Abito con due studenti, Davide e Karim, vicino al centro. Il lunedì e il giovedì abbiamo informatica e matematica. Il martedì frequento inglese e scienze politiche. Mi piace informatica perché il professore è intelligente e divertente. È un uomo basso con i capelli bianchi e gli occhiali. Matematica invece è molto difficile e prima dell'esame ho sempre paura. Il mercoledì lavoro in biblioteca dalle dieci alle due. Aspetto gli studenti, cerco i libri e do una mano alla bibliotecaria. Il venerdì non lavoro: studio a casa e faccio attenzione ai compiti. Nel fine settimana Davide gioca a calcio, ma io sono pigro. Preferisco fare una passeggiata in centro o guardare un film. La domenica ordiniamo una pizza e stiamo bene insieme.`,
      questions: [
        ["age", "Paolo ha vent'anni.", "Vero", ["Vero", "Falso"], "radio"], ["subject", "Paolo studia ___.", "informatica", ["informatica", "letteratura", "biologia", "giurisprudenza"], "radio"],
        ["days", "Il martedì frequenta inglese e scienze politiche.", "Vero", ["Vero", "Falso"], "radio"],
        ["teacher", "Il professore è alto e biondo.", "Falso", ["Vero", "Falso"], "radio"],
        ["fear", "Prima dell'esame di matematica Paolo ha paura.", "Vero", ["Vero", "Falso"], "radio"],
        ["library", "Che cosa fa Paolo in biblioteca?", ["cerca i libri", "aiuta la bibliotecaria"], ["cerca i libri", "aiuta la bibliotecaria", "gioca a calcio", "ordina la pizza"], "checkbox"],
        ["weekend", "Paolo gioca a calcio nel fine settimana.", "Falso", ["Vero", "Falso"], "radio"],
        ["sunday", "La domenica ordinano una pizza.", "Vero", ["Vero", "Falso"], "radio"]
      ]
    },
    {
      id: "sofia", title: "Il messaggio di Sofia",
      script: `Ciao, sono Sofia e vivo a Firenze. Sono una studentessa di biologia e chimica. Frequento l'università quattro giorni alla settimana. Il lunedì ho biologia, il martedì chimica e il giovedì due lezioni di scienze. Il venerdì frequento anche una lezione di francese perché mi piacciono le lingue straniere. La professoressa di francese è francese, giovane e molto allegra. Ha i capelli castani, lunghi e lisci. Parla lentamente e spiega bene, quindi il corso non è difficile. Il mercoledì non vado all'università. Lavoro al bar di mio padre e aiuto i clienti. A mezzogiorno ho sempre fame e mangio un panino. Dopo il lavoro studio in biblioteca con la mia amica Emma. Il sabato facciamo una gita in treno. A volte andiamo a Pisa, altre volte a Bologna. La domenica sto a casa perché ho bisogno di riposare.`,
      questions: [
        ["city", "Sofia vive a Firenze.", "Vero", ["Vero", "Falso"], "radio"], ["subjects", "Sofia studia...", ["biologia", "chimica"], ["biologia", "chimica", "letteratura", "economia"], "checkbox"],
        ["frequency", "Va all'università cinque giorni alla settimana.", "Falso", ["Vero", "Falso"], "radio"],
        ["french", "Perché il corso di francese non è difficile?", "la professoressa parla lentamente e spiega bene", ["la professoressa parla lentamente e spiega bene", "Sofia è francese", "non ci sono esami", "la classe è piccola"], "radio"],
        ["look", "La professoressa ha i capelli corti e ricci.", "Falso", ["Vero", "Falso"], "radio"],
        ["wednesday", "Il mercoledì Sofia lavora al bar.", "Vero", ["Vero", "Falso"], "radio"],
        ["hunger", "A mezzogiorno Sofia ha fame.", "Vero", ["Vero", "Falso"], "radio"],
        ["sunday", "La domenica Sofia fa una gita.", "Falso", ["Vero", "Falso"], "radio"]
      ]
    }
  ];
  function makeListening() {
    const set = random(LISTENING_SETS);
    const questions = set.questions.map(([id, prompt, answer, options, type]) => choiceQuestion(`listening-${set.id}-${id}`, prompt, answer, options,
      "The answer is stated directly in the practice listening transcript.", "Listening Comprehension", type));
    return { script: set.script, listeningTitle: set.title, groups: groups(questions) };
  }

  const SECTION_CONFIG = [
    ["adjective-endings", "Aggettivi: complete the ending", 10, "Type only the missing ending or letters. Pay attention to gender and number."],
    ["singular-plural", "Dal singolare al plurale", 10, "Write the complete plural adjective shown by the changed subject."],
    ["vocabulary", "Vocabolario", 12, "Choose the word that best completes each beginner-level context."],
    ["verbs", "Verbi in -ARE: regular and irregular", 15, "Use the shown form as context, then conjugate the same verb for the new subject."],
    ["verb-expressions", "Espressioni with andare, dare, fare, stare", 8, "Complete each common expression with the correctly conjugated verb."],
    ["avere", "Avere and idiomatic expressions", 8, "Complete the avere form or supply the noun required by the situation."],
    ["prepositions", "Preposizioni semplici", 10, "Complete each sentence with the correct simple preposition."],
    ["piacere", "Piace o piacciono?", 7, "Choose the form that agrees with the thing liked."],
    ["bello-buono", "Bello and buono before a noun", 4, "Write the correct form of bello or buono before the noun."],
    ["molto", "Molto: adjective or adverb", 4, "Decide whether molto stays invariant or agrees with a noun."],
    ["reading", "Reading comprehension", 6, "Read the passage, then answer each question. No feedback appears until submission."],
    ["listening", "Practice Listening — not course audio", 6, "Listen as many times as needed. The transcript stays hidden unless you reveal it or submit the exam."]
  ];

  function createSections(unit2) {
    const reading = makeReading();
    const listening = makeListening();
    const content = {
      "adjective-endings": { groups: makeAdjectiveEndings() }, "singular-plural": { groups: makePlurals() },
      vocabulary: { groups: makeVocabulary(unit2) }, verbs: { groups: makeVerbs(unit2) },
      "verb-expressions": { groups: makeExpressions() }, avere: { groups: makeAvere() },
      prepositions: { groups: makePrepositions() }, piacere: { groups: makePiacere() },
      "bello-buono": { groups: makeBelloBuono() }, molto: { groups: makeMolto() },
      reading: { ...reading }, listening: { ...listening, kind: "listening" }
    };
    return SECTION_CONFIG.map(([id, title, points, instructions], index) => ({
      id, title, points, instructions, number: index + 1, ...content[id]
    }));
  }

  function allQuestions(test) {
    return test.sections.flatMap((section) => section.groups.flatMap((itemGroup) => itemGroup.questions.map((question) => ({
      ...question, sectionId: section.id, sectionTitle: section.title, groupPrompt: itemGroup.prompt,
      label: itemGroup.questions.length === 1 ? itemGroup.prompt : `${itemGroup.prompt} — ${question.prompt}`
    }))));
  }
  const signature = (test) => allQuestions(test).map((question) => question.id).join("|");
  function generateTest(unit2, previousSignature = "") {
    let test;
    for (let attempt = 0; attempt < 10; attempt += 1) {
      test = { title: "★ Practice Exam 2", unit: "unit2", totalPoints: 100, sections: createSections(unit2), createdAt: Date.now() };
      test.signature = signature(test);
      if (test.signature !== previousSignature) break;
    }
    return test;
  }
  function answerIsCorrect(question, value) {
    if (question.type === "checkbox") {
      const actual = (Array.isArray(value) ? value : []).map(normalize).sort();
      const expected = question.answer.map(normalize).sort();
      return actual.length === expected.length && actual.every((item, index) => item === expected[index]);
    }
    const actual = normalize(value);
    return [question.answer, ...(question.accepted || [])].some((answer) => normalize(answer) === actual);
  }
  function gradeTest(test, answers) {
    const sectionScores = {};
    const results = allQuestions(test).map((question) => {
      const studentAnswer = answers[question.id] ?? (question.type === "checkbox" ? [] : "");
      const correct = answerIsCorrect(question, studentAnswer);
      sectionScores[question.sectionId] ||= { title: question.sectionTitle, correct: 0, total: 0 };
      sectionScores[question.sectionId].total += 1;
      if (correct) sectionScores[question.sectionId].correct += 1;
      return { ...question, studentAnswer: Array.isArray(studentAnswer) ? studentAnswer.join(", ") : studentAnswer, correct,
        answer: Array.isArray(question.answer) ? question.answer.join(", ") : question.answer };
    });
    const pointsBySection = Object.fromEntries(test.sections.map((section) => [section.id, section.points]));
    Object.entries(sectionScores).forEach(([id, section]) => {
      section.points = pointsBySection[id];
      section.earned = Number(((section.correct / section.total) * section.points).toFixed(2));
    });
    const score = Number(Object.values(sectionScores).reduce((total, section) => total + section.earned, 0).toFixed(1));
    const reviewTopics = Object.values(sectionScores).map((section) => ({ ...section, percentage: (section.correct / section.total) * 100 }))
      .filter((section) => section.percentage < 90).sort((a, b) => a.percentage - b.percentage).slice(0, 4);
    return { score, total: test.totalPoints, percentage: (score / test.totalPoints) * 100, sectionScores, results, reviewTopics };
  }

  window.UNIT2_PRACTICE_TEST = {
    config: SECTION_CONFIG.map(([id, title, points]) => ({ id, title, points })),
    counts: {
      adjectiveEndings: adjectiveEndingBank().length, singularPlural: pluralBank().length,
      vocabularyBase: VOCAB_CONTEXTS.length, verbsPerUnit2Verb: SUBJECT_ORDER.length,
      verbExpressions: EXPRESSION_BANK.length, avere: avereBank().length, prepositions: PREPOSITION_BANK.length,
      piacere: piacereBank().length, belloBuono: BELLO_BUONO_BANK.length, molto: MOLTO_BANK.length,
      readingPassages: READING_SETS.length, listeningScripts: LISTENING_SETS.length
    },
    generateTest, gradeTest, allQuestions
  };
})();
