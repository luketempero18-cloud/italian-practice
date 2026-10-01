(() => {
  "use strict";

  const STORAGE_KEY = "italianPractice.lastMinuteStudy.v1";
  const CATEGORY_LABELS = {
    adjectives: "Adjectives",
    colors: "Colors",
    nationalities: "Nationalities",
    avere: "Avere Expressions",
    expressions: "Irregular Verb Expressions",
    school: "School Subjects",
    classroom: "Classroom Nouns"
  };
  const CATEGORY_ORDER = Object.keys(CATEGORY_LABELS);
  const shuffle = (items) => {
    const copy = [...items];
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const swap = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[swap]] = [copy[swap], copy[index]];
    }
    return copy;
  };
  const random = (items) => items[Math.floor(Math.random() * items.length)];
  const unique = (items) => [...new Set(items.filter(Boolean))];
  const splitMeanings = (value) => unique([value, ...value.split(" / ").map((part) => part.trim())]);
  const agreement = (id, italian, english, category, forms, contexts) => ({ id, italian, english, category, forms, contexts, starred: true });
  const simple = (id, italian, english, category, extra = {}) => ({ id, italian, english, category, starred: true, ...extra });

  const TERMS = [
    agreement("adj-anziano", "anziano", "old / elderly", "adjectives", { ms: "anziano", fs: "anziana", mp: "anziani", fp: "anziane" }, { ms: "Mio nonno è", fs: "Mia nonna è", mp: "I miei nonni sono", fp: "Le due signore sono" }),
    agreement("adj-magro", "magro", "thin", "adjectives", { ms: "magro", fs: "magra", mp: "magri", fp: "magre" }, { ms: "Marco è", fs: "Maria è", mp: "Marco e Luca sono", fp: "Maria e Anna sono" }),
    agreement("adj-grasso", "grasso", "fat", "adjectives", { ms: "grasso", fs: "grassa", mp: "grassi", fp: "grasse" }, { ms: "Il gatto è", fs: "La gatta è", mp: "I gatti sono", fp: "Le gatte sono" }),
    agreement("adj-cattivo", "cattivo", "bad / mean", "adjectives", { ms: "cattivo", fs: "cattiva", mp: "cattivi", fp: "cattive" }, { ms: "Quel ragazzo non è gentile; è", fs: "Quella ragazza non è gentile; è", mp: "Quei ragazzi non sono gentili; sono", fp: "Quelle ragazze non sono gentili; sono" }),
    agreement("adj-felice", "felice", "happy", "adjectives", { ms: "felice", fs: "felice", mp: "felici", fp: "felici" }, { ms: "Marco sorride perché è", fs: "Maria sorride perché è", mp: "Marco e Luca sorridono perché sono", fp: "Maria e Anna sorridono perché sono" }),
    agreement("adj-triste", "triste", "sad", "adjectives", { ms: "triste", fs: "triste", mp: "tristi", fp: "tristi" }, { ms: "Marco non sorride; è", fs: "Maria non sorride; è", mp: "I ragazzi non sorridono; sono", fp: "Le ragazze non sorridono; sono" }),
    agreement("adj-pigro", "pigro", "lazy", "adjectives", { ms: "pigro", fs: "pigra", mp: "pigri", fp: "pigre" }, { ms: "Marco non vuole lavorare; è", fs: "Maria non vuole lavorare; è", mp: "I ragazzi non vogliono lavorare; sono", fp: "Le ragazze non vogliono lavorare; sono" }),

    agreement("color-grigio", "grigio", "gray", "colors", { ms: "grigio", fs: "grigia", mp: "grigi", fp: "grigie" }, { ms: "Il quaderno è", fs: "La porta è", mp: "I quaderni sono", fp: "Le porte sono" }),
    agreement("color-giallo", "giallo", "yellow", "colors", { ms: "giallo", fs: "gialla", mp: "gialli", fp: "gialle" }, { ms: "Il libro è", fs: "La sedia è", mp: "I libri sono", fp: "Le sedie sono" }),
    agreement("color-marrone", "marrone", "brown", "colors", { ms: "marrone", fs: "marrone", mp: "marroni", fp: "marroni" }, { ms: "Il banco è", fs: "La porta è", mp: "I banchi sono", fp: "Le porte sono" }),
    agreement("color-arancione", "arancione", "orange", "colors", { ms: "arancione", fs: "arancione", mp: "arancioni", fp: "arancioni" }, { ms: "Il quaderno è", fs: "La sedia è", mp: "I quaderni sono", fp: "Le sedie sono" }),

    agreement("nationality-spagnolo", "spagnolo", "Spanish", "nationalities", { ms: "spagnolo", fs: "spagnola", mp: "spagnoli", fp: "spagnole" }, { ms: "Carlos è", fs: "Carmen è", mp: "Carlos e Diego sono", fp: "Carmen e Sofia sono" }),
    agreement("nationality-messicano", "messicano", "Mexican", "nationalities", { ms: "messicano", fs: "messicana", mp: "messicani", fp: "messicane" }, { ms: "José è", fs: "Ana è", mp: "José e Luis sono", fp: "Ana e Luisa sono" }),

    simple("avere-sete", "avere sete", "to be thirsty", "avere", { expression: "sete", contexts: ["vuole bere molta acqua", "voglio bere acqua"] }),
    simple("avere-sonno", "avere sonno", "to be sleepy", "avere", { expression: "sonno", contexts: ["è mezzanotte", "sono molto stanchi"] }),
    simple("avere-ragione", "avere ragione", "to be right", "avere", { expression: "ragione", contexts: ["dice la risposta corretta", "dicono che Roma è in Italia"] }),
    simple("avere-torto", "avere torto", "to be wrong", "avere", { expression: "torto", contexts: ["dice che due più due fa cinque", "dicono una cosa non vera"] }),

    simple("expression-passeggiata", "fare una passeggiata", "to take a walk", "expressions", { verb: "fare", complement: "una passeggiata" }),
    simple("expression-giro", "fare un giro", "to go around / take a walk", "expressions", { verb: "fare", complement: "un giro" }),
    simple("expression-gita", "fare una gita", "to take a trip / short trip", "expressions", { verb: "fare", complement: "una gita" }),
    simple("expression-zitto", "stare zitto", "to be quiet / silent", "expressions", { verb: "stare", complement: "zitto" }),

    simple("school-economia", "l'economia", "economics", "school", { clue: "mercati, prezzi e produzione" }),
    simple("school-giornalismo", "il giornalismo", "journalism", "school", { clue: "scrivere notizie per un giornale" }),
    simple("school-giurisprudenza", "la giurisprudenza", "law", "school", { clue: "le leggi e la Costituzione" }),
    simple("school-informatica", "l'informatica", "computer science", "school", { clue: "programmare e studiare i computer" }),
    simple("school-ingegneria", "l'ingegneria", "engineering", "school", { clue: "progettare ponti e macchine" }),
    simple("school-letteratura", "la letteratura", "literature", "school", { clue: "romanzi e poesie" }),
    simple("school-lingue", "le lingue straniere", "foreign languages", "school", { clue: "spagnolo, francese e tedesco" }),
    simple("school-scienze-politiche", "le scienze politiche", "political science", "school", { clue: "governi, elezioni e istituzioni" }),
    simple("school-storia", "la storia", "history", "school", { clue: "il passato e gli eventi importanti" }),
    simple("school-storia-arte", "la storia dell'arte", "art history", "school", { clue: "Michelangelo e Picasso" }),

    simple("classroom-banco", "il banco", "desk / student desk", "classroom", { noun: "banco", clue: "Lo studente mette il quaderno sul ___" }),
    simple("classroom-carta", "la carta geografica", "map", "classroom", { noun: "carta geografica", clue: "Per trovare Roma guardiamo la ___" }),
    simple("classroom-cattedra", "la cattedra", "teacher's desk", "classroom", { noun: "cattedra", clue: "La professoressa lascia il libro sulla ___" }),
    simple("classroom-cestino", "il cestino", "trash can", "classroom", { noun: "cestino", clue: "Butto il foglio nel ___" }),
    simple("classroom-finestra", "la finestra", "window", "classroom", { noun: "finestra", clue: "Fa caldo, quindi apro la ___" }),
    simple("classroom-lavagna", "la lavagna", "board", "classroom", { noun: "lavagna", clue: "La professoressa scrive sulla ___" }),
    simple("classroom-porta", "la porta", "door", "classroom", { noun: "porta", clue: "Entro in classe e chiudo la ___" }),
    simple("classroom-portatile", "il portatile", "laptop", "classroom", { noun: "portatile", clue: "Porto il ___ nello zaino per prendere appunti" }),
    simple("classroom-proiettore", "il proiettore", "projector", "classroom", { noun: "proiettore", clue: "Il professore mostra le slide con il ___" }),
    simple("classroom-sedia", "la sedia", "chair", "classroom", { noun: "sedia", clue: "Durante la lezione sono seduto sulla ___" })
  ];

  const TERM_BY_ID = Object.fromEntries(TERMS.map((term) => [term.id, term]));
  const termsForCategory = (category) => TERMS.filter((term) => term.category === category);
  const question = (term, kind, type, kicker, display, answer, accepted, explanation, choices = []) => ({
    id: `${term.id}:${kind}:${Math.random().toString(36).slice(2, 8)}`,
    termId: term.id, category: term.category, kind, type, kicker, display, answer,
    accepted: unique(accepted || [answer]), explanation, choices: type === "choice" ? shuffle(unique(choices)) : []
  });
  const categoryDistractors = (term, field) => {
    const sameCategory = shuffle(termsForCategory(term.category).filter((item) => item.id !== term.id));
    const otherStarred = shuffle(TERMS.filter((item) => item.id !== term.id && item.category !== term.category));
    return unique([...sameCategory, ...otherStarred].map((item) => item[field])).slice(0, 3);
  };

  function writtenEnglishToItalian(term) {
    return question(term, "written-en-it", "text", "Write the Italian term", term.english, term.italian, [term.italian], `${term.italian} means “${term.english}.”`);
  }
  function writtenItalianToEnglish(term) {
    return question(term, "written-it-en", "text", "Write the English meaning", term.italian, term.english, splitMeanings(term.english), `${term.italian} means “${term.english}.”`);
  }
  function multipleChoiceMeaning(term) {
    return question(term, "multiple-choice", "choice", "Choose the correct meaning", `What does “${term.italian}” mean?`, term.english,
      [term.english], `${term.italian} means “${term.english}.”`, [term.english, ...categoryDistractors(term, "english")]);
  }
  function agreementQuestion(term) {
    const slot = random(["ms", "fs", "mp", "fp"]);
    const answer = term.forms[slot];
    return question(term, `agreement-${slot}`, "text", `Make ${term.italian} agree`, `${term.contexts[slot]} ___.`, answer, [answer],
      `The correct ${slot === "ms" ? "masculine singular" : slot === "fs" ? "feminine singular" : slot === "mp" ? "masculine or mixed plural" : "feminine plural"} form is ${answer}.`);
  }

  const AVERE_FORMS = [
    ["Io", "ho"], ["Tu", "hai"], ["Maria", "ha"], ["Noi", "abbiamo"], ["Voi", "avete"], ["Marco e Luca", "hanno"]
  ];
  function avereContextQuestion(term) {
    const [subject, form] = random(AVERE_FORMS);
    const circumstance = term.id === "avere-sete" ? `${subject} vuole bere molta acqua.` : term.id === "avere-sonno" ? `È mezzanotte e ${subject.toLowerCase()} è stanco.` :
      term.id === "avere-ragione" ? `${subject} dice che Roma è in Italia.` : `${subject} dice che due più due fa cinque.`;
    const answer = `${form} ${term.expression}`;
    return question(term, `avere-context-${form}`, "text", "Complete with the correct avere expression", `${circumstance} ${subject} ___.`, answer, [answer],
      `${subject} takes ${form}: ${answer}.`);
  }

  const FARE_FORMS = [["Io", "faccio"], ["Tu", "fai"], ["Maria", "fa"], ["Noi", "facciamo"], ["Voi", "fate"], ["Marco e Luca", "fanno"]];
  const STARE_CONTEXTS = [["Io (masculine)", "sto zitto"], ["Tu (feminine)", "stai zitta"], ["Maria", "sta zitta"], ["Noi (mixed group)", "stiamo zitti"], ["Voi (feminine group)", "state zitte"], ["Marco e Luca", "stanno zitti"]];
  function expressionContextQuestion(term) {
    if (term.verb === "fare") {
      const [subject, form] = random(FARE_FORMS);
      return question(term, `expression-context-${form}`, "text", "Conjugate fare", `${subject} ___ ${term.complement}.`, form, [form],
        `${subject} takes ${form}: ${form} ${term.complement}.`);
    }
    const [subject, answer] = random(STARE_CONTEXTS);
    return question(term, `expression-context-${answer.replace(/\s/g, "-")}`, "text", "Use stare zitto with correct agreement", `${subject} ___ durante l'esame.`, answer, [answer],
      `${subject} requires ${answer}.`);
  }

  function schoolContextQuestion(term) {
    const choices = [term.italian, ...categoryDistractors(term, "italian")];
    return question(term, "school-context", "choice", "Choose the school subject", `${term.clue} → ___`, term.italian, [term.italian],
      `${term.clue} is associated with ${term.italian}.`, choices);
  }
  function classroomContextQuestion(term) {
    return question(term, "classroom-context", "text", "Complete with the classroom noun", `${term.clue}.`, term.noun, [term.noun],
      `The complete starred term is ${term.italian} (“${term.english}”).`);
  }

  function buildersFor(term) {
    const builders = [writtenEnglishToItalian, writtenItalianToEnglish, multipleChoiceMeaning];
    if (term.forms) builders.push(agreementQuestion);
    if (term.category === "avere") builders.push(avereContextQuestion, avereContextQuestion);
    if (term.category === "expressions") builders.push(expressionContextQuestion, expressionContextQuestion);
    if (term.category === "school") builders.push(schoolContextQuestion, schoolContextQuestion);
    if (term.category === "classroom") builders.push(classroomContextQuestion, classroomContextQuestion);
    return builders;
  }
  function generateQuestion(termId, avoidKind = "") {
    const term = TERM_BY_ID[termId];
    if (!term) throw new Error(`Unknown last-minute term: ${termId}`);
    const candidates = buildersFor(term).map((builder) => builder(term));
    return random(candidates.filter((item) => item.kind !== avoidKind).length ? candidates.filter((item) => item.kind !== avoidKind) : candidates);
  }

  function createQueue(termIds = null, target = 30) {
    const allowed = termIds?.length ? unique(termIds).map((id) => TERM_BY_ID[id]).filter(Boolean) : TERMS;
    if (termIds?.length) {
      const queue = [];
      while (queue.length < Math.max(allowed.length, Math.min(target, allowed.length * 3))) queue.push(...shuffle(allowed.map((term) => term.id)));
      return queue.slice(0, Math.max(allowed.length, Math.min(target, allowed.length * 3)));
    }
    const guaranteed = CATEGORY_ORDER.map((category) => random(allowed.filter((term) => term.category === category)));
    const guaranteedIds = new Set(guaranteed.map((term) => term.id));
    const remaining = shuffle(allowed.filter((term) => !guaranteedIds.has(term.id))).slice(0, target - guaranteed.length);
    return shuffle([...guaranteed, ...remaining].map((term) => term.id));
  }

  function emptyStats() { return { attempts: [], mastery: {}, missedTerms: [] }; }
  function loadStats() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
      return { ...emptyStats(), ...stored, attempts: Array.isArray(stored.attempts) ? stored.attempts : [], mastery: stored.mastery || {}, missedTerms: Array.isArray(stored.missedTerms) ? stored.missedTerms : [] };
    } catch { return emptyStats(); }
  }
  function saveAttempt(answerLog) {
    const stats = loadStats();
    const missed = unique(answerLog.filter((entry) => !entry.correct).map((entry) => entry.termId));
    answerLog.forEach((entry) => {
      const item = stats.mastery[entry.termId] || { attempts: 0, correct: 0, misses: 0, streak: 0 };
      item.attempts += 1;
      if (entry.correct) { item.correct += 1; item.streak += 1; }
      else { item.misses += 1; item.streak = 0; }
      item.accuracy = Math.round((item.correct / item.attempts) * 100);
      stats.mastery[entry.termId] = item;
    });
    const correct = answerLog.filter((entry) => entry.correct).length;
    stats.attempts.unshift({ date: Date.now(), correct, total: answerLog.length, percentage: answerLog.length ? Math.round((correct / answerLog.length) * 100) : 0, missed });
    stats.attempts = stats.attempts.slice(0, 30);
    stats.missedTerms = missed;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    return stats;
  }

  window.LAST_MINUTE_STUDY = {
    storageKey: STORAGE_KEY,
    terms: TERMS,
    categoryLabels: CATEGORY_LABELS,
    categoryOrder: CATEGORY_ORDER,
    counts: Object.fromEntries(CATEGORY_ORDER.map((category) => [category, termsForCategory(category).length])),
    createQueue, generateQuestion, loadStats, saveAttempt,
    term(id) { return TERM_BY_ID[id]; }
  };
})();
