/*
 * Add new course material here. The question engine in app.js automatically
 * turns each noun into article, gender, plural, transformation, and vocabulary
 * questions.
 */
window.STUDY_DATA = {
  categories: [
    "Definite Articles", "Indefinite Articles", "Gender", "Singular → Plural",
    "Plural → Singular", "Full Transformation", "Vocabulary", "Subject Pronouns",
    "Essere", "Stare", "Formal vs Informal", "Greetings", "C'è / Ci sono",
    "Negation", "Months", "Days of the Week", "Numbers", "Dialogue Fill-in"
  ],

  nouns: [
    ["libro", "libri", "masculine", "il", "i", "un", "book"],
    ["quaderno", "quaderni", "masculine", "il", "i", "un", "notebook"],
    ["ragazzo", "ragazzi", "masculine", "il", "i", "un", "boy / guy"],
    ["ragazza", "ragazze", "feminine", "la", "le", "una", "girl"],
    ["studente", "studenti", "masculine", "lo", "gli", "uno", "student"],
    ["studentessa", "studentesse", "feminine", "la", "le", "una", "female student"],
    ["professore", "professori", "masculine", "il", "i", "un", "male professor / teacher"],
    ["professoressa", "professoresse", "feminine", "la", "le", "una", "female professor / teacher"],
    ["amico", "amici", "masculine", "l'", "gli", "un", "male friend"],
    ["amica", "amiche", "feminine", "l'", "le", "un'", "female friend"],
    ["uomo", "uomini", "masculine", "l'", "gli", "un", "man"],
    ["donna", "donne", "feminine", "la", "le", "una", "woman"],
    ["signore", "signori", "masculine", "il", "i", "un", "gentleman / Mr."],
    ["signora", "signore", "feminine", "la", "le", "una", "woman / Mrs. / ma'am"],
    ["insegnante", "insegnanti", "masculine", "l'", "gli", "un", "teacher", { context: "male", genderQuestion: false }],
    ["insegnante", "insegnanti", "feminine", "l'", "le", "un'", "teacher", { id: "insegnante-feminine", context: "female", genderQuestion: false, vocabularyEligible: false }],
    ["piazza", "piazze", "feminine", "la", "le", "una", "square"],
    ["fontana", "fontane", "feminine", "la", "le", "una", "fountain"],
    ["statua", "statue", "feminine", "la", "le", "una", "statue"],
    ["obelisco", "obelischi", "masculine", "l'", "gli", "un", "obelisk"],
    ["lampione", "lampioni", "masculine", "il", "i", "un", "streetlamp / lamp post"],
    ["negozio", "negozi", "masculine", "il", "i", "un", "store / shop"],
    ["vetrina", "vetrine", "feminine", "la", "le", "una", "shop / display window"],
    ["banca", "banche", "feminine", "la", "le", "una", "bank"],
    ["stazione", "stazioni", "feminine", "la", "le", "una", "station"],
    ["lezione", "lezioni", "feminine", "la", "le", "una", "lesson / class"],
    ["edicola", "edicole", "feminine", "l'", "le", "un'", "newsstand"],
    ["università", "università", "feminine", "l'", "le", "un'", "university"],
    ["città", "città", "feminine", "la", "le", "una", "city"],
    ["caffè", "caffè", "masculine", "il", "i", "un", "coffee / café"],
    ["computer", "computer", "masculine", "il", "i", "un", "computer"],
    ["bar", "bar", "masculine", "il", "i", "un", "café / bar"],
    ["moto", "moto", "feminine", "la", "le", "una", "motorcycle / motorbike"],
    ["motocicletta", "motociclette", "feminine", "la", "le", "una", "motorcycle"],
    ["auto", "auto", "feminine", "l'", "le", "un'", "car"],
    ["automobile", "automobili", "feminine", "l'", "le", "un'", "automobile / car"],
    ["erba", "erbe", "feminine", "l'", "le", "un'", "grass"],
    ["tabaccheria", "tabaccherie", "feminine", "la", "le", "una", "tobacco shop / tobacconist"],
    ["Vespa", "Vespe", "feminine", "la", "le", "una", "Vespa / scooter"],
    ["problema", "problemi", "masculine", "il", "i", "un", "problem"],
    ["esame", "esami", "masculine", "l'", "gli", "un", "exam"],
    ["zaino", "zaini", "masculine", "lo", "gli", "uno", "backpack"],
    ["hotel", "hotel", "masculine", "l'", "gli", "un", "hotel"],
    ["gelato", "gelati", "masculine", "il", "i", "un", "ice cream"],
    ["cane", "cani", "masculine", "il", "i", "un", "dog"],
    ["cinema", "cinema", "masculine", "il", "i", "un", "cinema / movie theater"],
    ["museo", "musei", "masculine", "il", "i", "un", "museum"],
    ["ristorante", "ristoranti", "masculine", "il", "i", "un", "restaurant"],
    ["gelateria", "gelaterie", "feminine", "la", "le", "una", "gelato shop"],
    ["scuola", "scuole", "feminine", "la", "le", "una", "school"],
    ["chiesa", "chiese", "feminine", "la", "le", "una", "church"],
    ["panchina", "panchine", "feminine", "la", "le", "una", "bench"],
    ["regione", "regioni", "feminine", "la", "le", "una", "region"],
    ["dottore", "dottori", "masculine", "il", "i", "un", "male doctor"],
    ["dottoressa", "dottoresse", "feminine", "la", "le", "una", "female doctor"],
    ["monumento", "monumenti", "masculine", "il", "i", "un", "monument"],
    ["espresso", "espressi", "masculine", "l'", "gli", "un", "espresso"],
    ["film", "film", "masculine", "il", "i", "un", "film / movie"],
    ["programma", "programmi", "masculine", "il", "i", "un", "program"],
    ["turista", "turisti", "masculine", "il", "i", "un", "tourist", { context: "male", genderQuestion: false }],
    ["turista", "turiste", "feminine", "la", "le", "una", "tourist", { id: "turista-feminine", context: "female", genderQuestion: false, vocabularyEligible: false }],
    ["Sole", "Soli", "masculine", "il", "i", "un", "Sun", { tag: "Solar System" }],
    ["Luna", "Lune", "feminine", "la", "le", "una", "Moon", { tag: "Solar System" }],
    ["pianeta", "pianeti", "masculine", "il", "i", "un", "planet", { tag: "Solar System" }]
  ].map(([singular, plural, gender, definiteSingular, definitePlural, indefinite, english, options = {}]) => ({
    id: singular, singular, plural, gender, definiteSingular, definitePlural, indefinite, english, ...options
  })),

  pronouns: [
    { italian: "io", english: "I" }, { italian: "tu", english: "you (informal singular)" },
    { italian: "lui", english: "he" }, { italian: "lei", english: "she" },
    { italian: "Lei", english: "you (formal singular)" }, { italian: "noi", english: "we" },
    { italian: "voi", english: "you (plural)" }, { italian: "loro", english: "they" }
  ],

  verbs: {
    essere: [
      { subject: "io", form: "sono" }, { subject: "tu", form: "sei" },
      { subject: "lui/lei/Lei", form: "è" }, { subject: "noi", form: "siamo" },
      { subject: "voi", form: "siete" }, { subject: "loro", form: "sono" }
    ],
    stare: [
      { subject: "io", form: "sto" }, { subject: "tu", form: "stai" },
      { subject: "lui/lei/Lei", form: "sta" }, { subject: "noi", form: "stiamo" },
      { subject: "voi", form: "state" }, { subject: "loro", form: "stanno" }
    ]
  },

  greetings: [
    { italian: "Ciao!", english: "Hi! / Bye!", register: "informal" },
    { italian: "Salve!", english: "Hi!", register: "neutral" },
    { italian: "Buongiorno!", english: "Good morning!" },
    { italian: "Buonasera!", english: "Good evening!" },
    { italian: "Buonanotte!", english: "Good night!" },
    { italian: "Ti presento...", english: "I introduce you to... / Let me introduce you to...", register: "informal" },
    { italian: "Le presento...", english: "I introduce you to... / Let me introduce you to...", register: "formal" },
    { italian: "A dopo!", english: "See you later!" },
    { italian: "Ci vediamo dopo!", english: "See you later!" },
    { italian: "A più tardi!", english: "See you later!" },
    { italian: "Arrivederci!", english: "Goodbye! / See you later!" },
    { italian: "ArrivederLa!", english: "Goodbye!", register: "formal" },
    { italian: "A presto!", english: "See you soon!" },
    { italian: "A domani!", english: "See you tomorrow!" },
    { italian: "Come ti chiami?", english: "What is your name?", register: "informal" },
    { italian: "Come si chiama?", english: "What is your name?", register: "formal" },
    { italian: "Mi chiamo...", english: "My name is..." },
    { italian: "Piacere!", english: "Nice to meet you!" },
    { italian: "Piacere di conoscerti!", english: "Nice to meet you!", register: "informal" },
    { italian: "Piacere di conoscerLa!", english: "Nice to meet you!", register: "formal" },
    { italian: "Il piacere è mio!", english: "My pleasure!" },
    { italian: "Grazie!", english: "Thank you!" },
    { italian: "Prego!", english: "You're welcome!" }
  ],

  expressions: [
    { italian: "Scusa!", english: "Excuse me! / Sorry!", register: "informal", tag: "Useful Expressions" },
    { italian: "Scusami!", english: "Excuse me! / Sorry!", register: "informal", tag: "Useful Expressions" },
    { italian: "Scusi!", english: "Excuse me! / Sorry!", register: "formal", tag: "Useful Expressions" },
    { italian: "Mi scusi!", english: "Excuse me! / Sorry!", register: "formal", tag: "Useful Expressions" },
    { italian: "Scusate!", english: "Excuse me! / Sorry!", register: "voi / plural", tag: "Useful Expressions" },
    { italian: "Mi dispiace!", english: "I am sorry!", tag: "Useful Expressions" },
    { italian: "Sono in ritardo.", english: "I am late.", tag: "Useful Expressions" },
    { italian: "Come stai?", english: "How are you?", register: "informal", tag: "Useful Expressions" },
    { italian: "Come sta?", english: "How are you?", register: "formal", tag: "Useful Expressions" },
    { italian: "Come va?", english: "How's it going?", tag: "Useful Expressions" },
    { italian: "bene", english: "well / fine", tag: "Useful Expressions" },
    { italian: "male", english: "badly / not well", tag: "Useful Expressions" },
    { italian: "così così", english: "so-so", tag: "Useful Expressions" },
    { italian: "Di dov'è (Lei)?", english: "Where are you from?", register: "formal", tag: "Useful Expressions" },
    { italian: "Di dove sei (tu)?", english: "Where are you from?", register: "informal", tag: "Useful Expressions" },
    { italian: "Di dove siete (voi)?", english: "Where are you all from?", tag: "Useful Expressions" },
    { italian: "Io sono...", english: "I am...", tag: "Useful Expressions" },
    { italian: "Io sono di...", english: "I am from...", tag: "Useful Expressions" },
    { italian: "Noi siamo di...", english: "We are from...", tag: "Useful Expressions" },
    { italian: "Per favore", english: "please", tag: "Useful Expressions" },
    { italian: "Per piacere", english: "please", tag: "Useful Expressions" },
    { italian: "Apri il libro!", english: "Open your book!", register: "informal", tag: "Classroom Expressions" },
    { italian: "Aprite il libro!", english: "Open your book!", register: "voi / plural", tag: "Classroom Expressions" },
    { italian: "Come si dice ... in italiano?", english: "How do you say ... in Italian?", tag: "Classroom Expressions" },
    { italian: "Ho una domanda.", english: "I have a question.", tag: "Classroom Expressions" },
    { italian: "Leggi!", english: "Read!", register: "informal", tag: "Classroom Expressions" },
    { italian: "Leggete!", english: "Read!", register: "voi / plural", tag: "Classroom Expressions" },
    { italian: "Non capisco.", english: "I don't understand.", tag: "Classroom Expressions" },
    { italian: "Lo so.", english: "I know.", tag: "Classroom Expressions" },
    { italian: "Non lo so.", english: "I don't know.", tag: "Classroom Expressions" },
    { italian: "Ripeta!", english: "Repeat!", register: "formal", tag: "Classroom Expressions" },
    { italian: "Ripeti!", english: "Repeat!", register: "informal", tag: "Classroom Expressions" },
    { italian: "Ripetete!", english: "Repeat!", register: "voi / plural", tag: "Classroom Expressions" },
    { italian: "Scriva!", english: "Write!", register: "formal", tag: "Classroom Expressions" },
    { italian: "Scrivi!", english: "Write!", register: "informal", tag: "Classroom Expressions" },
    { italian: "Scrivete!", english: "Write!", register: "voi / plural", tag: "Classroom Expressions" }
  ],

  solarSystem: [
    { italian: "Mercurio", english: "Mercury", tag: "Solar System" },
    { italian: "Venere", english: "Venus", tag: "Solar System" },
    { italian: "Terra", english: "Earth", tag: "Solar System" },
    { italian: "Marte", english: "Mars", tag: "Solar System" },
    { italian: "Giove", english: "Jupiter", tag: "Solar System" },
    { italian: "Saturno", english: "Saturn", tag: "Solar System" },
    { italian: "Urano", english: "Uranus", tag: "Solar System" },
    { italian: "Nettuno", english: "Neptune", tag: "Solar System" },
    { italian: "sistema solare", english: "solar system", tag: "Solar System" }
  ],

  dialogues: [
    { id: "stare-tu-marco", subcategory: "stare", register: "informal", lines: ["Marco: Ciao! Come ___?"], answer: "stai", explanation: "Marco is speaking informally to one person, so stare uses stai.", distractors: ["sta", "state", "stanno"] },
    { id: "stare-lei-rossi", subcategory: "stare", register: "formal", lines: ["Signora Rossi: Buonasera a Lei! Come ___?"], answer: "sta", explanation: "Formal Lei uses the third-person singular form sta.", distractors: ["stai", "state", "stanno"] },
    { id: "stare-lei-professoressa", subcategory: "stare", register: "formal", lines: ["Studente: Buongiorno, professoressa. Come ___?"], answer: "sta", explanation: "A student addresses the professor formally with sta.", distractors: ["stai", "stiamo", "stanno"] },
    { id: "stare-noi", subcategory: "stare", lines: ["Federica e Marco: Noi ___ bene."], answer: "stiamo", explanation: "Noi takes stiamo.", distractors: ["sto", "state", "stanno"] },
    { id: "stare-loro", subcategory: "stare", lines: ["Come ___ Daniele e Teresa?"], answer: "stanno", explanation: "Daniele e Teresa are plural, so stare uses stanno.", distractors: ["sta", "stiamo", "state"] },
    { id: "stare-voi", subcategory: "stare", lines: ["Professoressa: Ragazzi, come ___?"], answer: "state", explanation: "Ragazzi is plural voi, so stare uses state.", distractors: ["stai", "sta", "stanno"] },
    { id: "stare-io", subcategory: "stare", lines: ["Paolo: Oggi io ___ bene."], answer: "sto", explanation: "Io takes sto.", distractors: ["stai", "sta", "stiamo"] },
    { id: "come-va", subcategory: "stare", register: "informal", lines: ["Lucia: Ciao, Marco! Come ___?"], answer: "va", explanation: "The fixed greeting is Come va?", distractors: ["vai", "sta", "stai"] },

    { id: "essere-voi", subcategory: "essere", lines: ["Paolo: E voi, di dove ___?"], answer: "siete", explanation: "Voi takes siete.", distractors: ["sei", "siamo", "sono"] },
    { id: "essere-io", subcategory: "essere", lines: ["Teresa: Io ___ di Roma."], answer: "sono", explanation: "Io takes sono.", distractors: ["sei", "è", "siamo"] },
    { id: "essere-tu", subcategory: "essere", register: "informal", lines: ["Marco: Di dove ___ tu?"], answer: "sei", explanation: "Informal tu takes sei.", distractors: ["è", "siete", "sono"] },
    { id: "essere-lei-formal", subcategory: "essere", register: "formal", lines: ["Signora Viola: Di dov'___ Lei?"], answer: "è", explanation: "Formal Lei takes è.", distractors: ["sei", "sono", "siete"] },
    { id: "essere-noi", subcategory: "essere", lines: ["Anna e io: Noi ___ di Napoli."], answer: "siamo", explanation: "Noi takes siamo.", distractors: ["sono", "siete", "sei"] },
    { id: "essere-loro", subcategory: "essere", lines: ["Marco e Teresa ___ italiani."], answer: "sono", explanation: "A plural third-person subject takes sono.", distractors: ["è", "siamo", "siete"] },
    { id: "essere-lui", subcategory: "essere", lines: ["Lui ___ Paolo."], answer: "è", explanation: "Lui takes è.", distractors: ["sei", "sono", "siamo"] },
    { id: "essere-lei", subcategory: "essere", lines: ["Lei ___ Federica."], answer: "è", explanation: "Lei meaning she takes è.", distractors: ["sei", "sono", "siete"] },

    { id: "intro-ti-chiami", subcategory: "introductions", register: "informal", lines: ["Daniele: Ciao, io sono Daniele. E tu, come ___?"], answer: "ti chiami", explanation: "Use ti chiami when asking one person informally.", distractors: ["si chiama", "mi chiamo", "ti presenti"] },
    { id: "intro-si-chiama", subcategory: "introductions", register: "formal", lines: ["Studente: Buongiorno, professoressa. Come ___?"], answer: "si chiama", explanation: "Use si chiama for formal Lei.", distractors: ["ti chiami", "mi chiamo", "si chiamano"] },
    { id: "intro-mi-chiamo", subcategory: "introductions", lines: ["Teresa: Ciao! Io ___ Teresa."], answer: "mi chiamo", explanation: "Mi chiamo means my name is.", distractors: ["ti chiami", "si chiama", "presento"] },
    { id: "intro-conoscerti", subcategory: "introductions", register: "informal", lines: ["Teresa: Mi chiamo Teresa. Piacere di ___."], answer: "conoscerti", explanation: "Use conoscerti when speaking informally to one person.", distractors: ["conoscerLa", "presentarti", "chiamarti"] },
    { id: "intro-conoscerla", subcategory: "introductions", register: "formal", lines: ["Studente: Piacere di ___, signora Rossi."], answer: "conoscerLa", acceptedAnswers: ["conoscerLa", "conoscerla"], explanation: "Formal Lei uses conoscerLa.", distractors: ["conoscerti", "presentarti", "chiamarla"] },
    { id: "intro-ti-presento", subcategory: "introductions", register: "informal", lines: ["Federica: Marco, ti ___ Stephanie."], answer: "presento", explanation: "Ti presento introduces someone informally.", distractors: ["presenti", "presenta", "presentiamo"] },
    { id: "intro-le-presento", subcategory: "introductions", register: "formal", lines: ["Prof. Mancini: Le ___ la Professoressa Pace."], answer: "presento", explanation: "Le presento introduces someone formally.", distractors: ["presenti", "presenta", "presentate"] },
    { id: "intro-piacere-mio", subcategory: "introductions", lines: ["Paolo: Piacere di conoscerti!", "Teresa: Il piacere è ___."], answer: "mio", explanation: "The expression is Il piacere è mio.", distractors: ["tuo", "suo", "nostro"] },

    { id: "greeting-ci-vediamo", subcategory: "greetings", register: "informal", lines: ["Marco is leaving his friends.", "Marco: Ci ___ dopo!"], answer: "vediamo", explanation: "Ci vediamo dopo means see you later.", distractors: ["vedo", "vedete", "vedono"] },
    { id: "greeting-prego", subcategory: "greetings", lines: ["Studente: Grazie!", "Professore: ___!"], answer: "Prego", acceptedAnswers: ["Prego", "prego"], explanation: "Prego is the usual response to grazie.", distractors: ["Scusa", "Piacere", "Ciao"] },
    { id: "greeting-morning", subcategory: "greetings", lines: ["It is morning when Marco enters class.", "Marco: ___, professoressa!"], answer: "Buongiorno", explanation: "Buongiorno is the morning greeting.", distractors: ["Buonasera", "Buonanotte", "Arrivederci"] },
    { id: "greeting-evening", subcategory: "greetings", lines: ["It is evening when Anna meets Paolo.", "Anna: ___, Paolo!"], answer: "Buonasera", explanation: "Buonasera is the evening greeting.", distractors: ["Buongiorno", "Buonanotte", "A presto"] },
    { id: "greeting-night", subcategory: "greetings", lines: ["Teresa is going to bed.", "Teresa: ___!"], answer: "Buonanotte", explanation: "Buonanotte is said when wishing someone good night.", distractors: ["Buongiorno", "Buonasera", "Salve"] },

    { id: "apology-informal", subcategory: "apologies", register: "informal", lines: ["Marco bumps into his friend Paolo.", "Marco: ___, Paolo!"], answer: "Scusa", explanation: "Scusa is used with one person informally.", distractors: ["Scusi", "Scusate", "Prego"] },
    { id: "apology-formal", subcategory: "apologies", register: "formal", lines: ["A student interrupts the professor.", "Studente: Mi ___, professoressa."], answer: "scusi", explanation: "Mi scusi is the formal apology.", distractors: ["scusa", "scusate", "dispiace"] },

    { id: "class-apri", subcategory: "classroom", register: "informal", lines: ["Teresa speaks to one classmate.", "Teresa: ___ il libro!"], answer: "Apri", explanation: "Apri addresses one person informally.", distractors: ["Aprite", "Apra", "Leggi"] },
    { id: "class-aprite", subcategory: "classroom", register: "voi / plural", lines: ["The teacher speaks to the whole class.", "Professoressa: ___ il libro!"], answer: "Aprite", explanation: "Aprite addresses plural voi.", distractors: ["Apri", "Apro", "Apre"] },
    { id: "class-leggi", subcategory: "classroom", register: "informal", lines: ["Marco asks one friend to read.", "Marco: ___!"], answer: "Leggi", explanation: "Leggi addresses one person informally.", distractors: ["Leggete", "Legge", "Leggo"] },
    { id: "class-leggete", subcategory: "classroom", register: "voi / plural", lines: ["The teacher asks all the students to read.", "Professoressa: ___!"], answer: "Leggete", explanation: "Leggete addresses plural voi.", distractors: ["Leggi", "Legge", "Leggiamo"] },
    { id: "class-ripeta", subcategory: "classroom", register: "formal", lines: ["A student addresses the professor formally.", "Studente: ___, per favore!"], answer: "Ripeta", explanation: "Ripeta is the formal command.", distractors: ["Ripeti", "Ripetete", "Ripeto"] },
    { id: "class-ripeti", subcategory: "classroom", register: "informal", lines: ["Teresa asks one friend to repeat.", "Teresa: ___, per favore!"], answer: "Ripeti", explanation: "Ripeti addresses one person informally.", distractors: ["Ripeta", "Ripetete", "Ripeto"] },
    { id: "class-ripetete", subcategory: "classroom", register: "voi / plural", lines: ["The teacher asks the whole class to repeat.", "Professoressa: ___!"], answer: "Ripetete", explanation: "Ripetete addresses plural voi.", distractors: ["Ripeti", "Ripeta", "Ripetiamo"] },
    { id: "class-scriva", subcategory: "classroom", register: "formal", lines: ["The professor addresses Signora Bianchi formally.", "Professore: ___, per favore!"], answer: "Scriva", explanation: "Scriva is the formal command.", distractors: ["Scrivi", "Scrivete", "Scrivo"] },
    { id: "class-scrivi", subcategory: "classroom", register: "informal", lines: ["Marco asks one friend to write.", "Marco: ___!"], answer: "Scrivi", explanation: "Scrivi addresses one person informally.", distractors: ["Scriva", "Scrivete", "Scrivo"] },
    { id: "class-scrivete", subcategory: "classroom", register: "voi / plural", lines: ["The teacher asks all the students to write.", "Professoressa: ___!"], answer: "Scrivete", explanation: "Scrivete addresses plural voi.", distractors: ["Scrivi", "Scriva", "Scriviamo"] },
    { id: "class-non-capisco", subcategory: "classroom", lines: ["Studente: Professoressa, non ___."], answer: "capisco", explanation: "Non capisco means I don't understand.", distractors: ["capisci", "capisce", "capiamo"] },
    { id: "class-non-lo-so", subcategory: "classroom", lines: ["Professoressa: Come si dice “book” in italiano?", "Studente: Non lo ___."], answer: "so", explanation: "Non lo so means I don't know.", distractors: ["sai", "sa", "sanno"] },

    { id: "ci-singular", subcategory: "c'è / ci sono", lines: ["Marco: In piazza ___ una fontana."], answer: "c'è", explanation: "Use c'è before one fountain.", distractors: ["ci sono", "sono", "è"] },
    { id: "ci-plural", subcategory: "c'è / ci sono", lines: ["Teresa: In piazza ___ due statue."], answer: "ci sono", explanation: "Use ci sono before plural statue.", distractors: ["c'è", "sono", "è"] },
    { id: "negation-non", subcategory: "negation", lines: ["Paolo: Io ___ sono di Roma; sono di Napoli."], answer: "non", explanation: "Place non directly before sono to negate the sentence.", distractors: ["no", "lo", "ci"] }
  ],

  months: [
    ["gennaio", "January"], ["febbraio", "February"], ["marzo", "March"],
    ["aprile", "April"], ["maggio", "May"], ["giugno", "June"],
    ["luglio", "July"], ["agosto", "August"], ["settembre", "September"],
    ["ottobre", "October"], ["novembre", "November"], ["dicembre", "December"]
  ].map(([italian, english], index) => ({ italian, english, number: index + 1 })),

  days: [
    ["lunedì", "Monday"], ["martedì", "Tuesday"], ["mercoledì", "Wednesday"],
    ["giovedì", "Thursday"], ["venerdì", "Friday"], ["sabato", "Saturday"],
    ["domenica", "Sunday"]
  ].map(([italian, english]) => ({ italian, english, tag: "Days of the Week" })),

  numbers: [
    "zero", "uno", "due", "tre", "quattro", "cinque", "sei", "sette", "otto", "nove",
    "dieci", "undici", "dodici", "tredici", "quattordici", "quindici", "sedici",
    "diciassette", "diciotto", "diciannove", "venti", "ventuno", "ventidue", "ventitré",
    "ventiquattro", "venticinque", "ventisei", "ventisette", "ventotto", "ventinove", "trenta"
  ],

  pronunciationVocabulary: [
    { italian: "bruschetta", english: "toasted bread", note: "The ch sounds like k." },
    { italian: "gelato", english: "ice cream", note: "The soft g sounds like j." },
    { italian: "famiglia", english: "family", note: "The gli sound blends together." },
    { italian: "gnocchi", english: "gnocchi", note: "The gn sound is similar to ny." }
  ]
};
