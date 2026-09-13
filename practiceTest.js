(() => {
  "use strict";

  const CONFIG = [
    ["indefinite", "Indefinite Articles", 10],
    ["definite", "Definite Articles", 10],
    ["days", "Days of the Week from Dates", 7],
    ["months", "Months / Dates / Holidays", 4],
    ["plurals", "Singular → Plural with Definite Articles", 12],
    ["essere", "Essere in Context", 10],
    ["stare", "Stare in Context", 8],
    ["reading", "Reading Comprehension", 5]
  ];

  const READING_PASSAGE = `Ciao! Mi chiamo Gabriele, sono di Cagliari, ma vivo con Stefania in Lombardia, a Bergamo. Vivo qui da cinque anni e ormai Bergamo è casa mia. Ritorno in Sardegna in dicembre, per le vacanze di Natale (Christmas) per una settimana. E anche in agosto, per due settimane. In Sardegna c'è un bellissimo mare e tanti turisti in estate! Nella foto qui sopra io sono con Stefania, nella città di Stintino, dove ci sono bellissime spiagge (beaches). È una città piccola dove non c'è la metropolitana. In città c'è una piazza con una fontana, due negozi, una tabaccheria e tre panchine. Non c'è un museo, ma c'è una torre con un orologio. Non c'è un teatro, ma ci sono due cinema. Stefania è nata il quindici giugno 2004 e io sono nato il diciannove dicembre 2000. Siamo studenti di letteratura all'Università di Milano. Milano è il luogo d'incontro di persone da tutto il mondo: è una città molto interessante. È famosa per la moda, per il design, ed è la metropoli del nord Italia. È necessario prendere il treno da Bergamo per Milano. E poi è necessario prendere la metropolitana per Piazza del Duomo, dove ci sono negozi con vetrine bellissime, statue, fontane e lampioni. Ci sono persone in motocicletta, automobili e vespe... c'è molta confusione!

Un saluto e a presto!

Gabriele`;

  const HOLIDAYS = [
    { id: "natale", label: "Natale", prompt: "È il 25 ______", answer: "dicembre" },
    { id: "independence", label: "Independence Day", prompt: "È il 4 ______", answer: "luglio" },
    { id: "halloween", label: "Halloween", prompt: "È il 31 ______", answer: "ottobre" },
    { id: "labor", label: "Labor Day 2026", prompt: "È il 7 ______", answer: "settembre" },
    { id: "veterans", label: "Veterans Day", prompt: "È l'11 ______", answer: "novembre" },
    { id: "presidents", label: "Presidents' Day 2026", prompt: "È il 16 ______", answer: "febbraio" },
    { id: "thanksgiving", label: "Thanksgiving 2026", prompt: "È il 26 ______", answer: "novembre" },
    { id: "mothers", label: "Mother's Day 2027", prompt: "È il 9 ______", answer: "maggio" }
  ];

  const ESSERE_BLOCK_POOLS = [
    [
      ["Oggi (1) ___ il dodici settembre e Marco (2) ___ in classe.", ["è", "è"]],
      ["Oggi (1) ___ il venti marzo e la professoressa (2) ___ a scuola.", ["è", "è"]],
      ["Oggi (1) ___ il sette maggio e Paolo (2) ___ in piazza.", ["è", "è"]]
    ],
    [
      ["Scusa, dove (1) ___ Paolo e Maria? — (2) ___ in piazza.", ["sono", "sono"]],
      ["Dove (1) ___ Marco e Teresa? — (2) ___ a scuola.", ["sono", "sono"]],
      ["Dove (1) ___ Anna e Luca? — (2) ___ al bar.", ["sono", "sono"]]
    ],
    [
      ["Ciao, Anna. Tu (1) ___ di Roma? — No, io (2) ___ di Viterbo.", ["sei", "sono"]],
      ["Paolo, tu (1) ___ studente? — Sì, io (2) ___ studente.", ["sei", "sono"]],
      ["Tu (1) ___ di Milano? — No, io (2) ___ di Napoli.", ["sei", "sono"]]
    ],
    [
      ["Ragazzi, voi (1) ___ studenti? — Sì, noi (2) ___ studenti.", ["siete", "siamo"]],
      ["Voi (1) ___ di Roma? — No, noi (2) ___ di Firenze.", ["siete", "siamo"]],
      ["Voi (1) ___ in classe? — Sì, noi (2) ___ a scuola.", ["siete", "siamo"]]
    ],
    [
      ["Laura e Paolo (1) ___ professori? — No, (2) ___ studenti.", ["sono", "sono"]],
      ["La signora Rossi (1) ___ professoressa? — Sì, (2) ___ professoressa.", ["è", "è"]],
      ["Marco e Federica (1) ___ di Napoli? — No, (2) ___ di Roma.", ["sono", "sono"]]
    ]
  ];

  const STARE_BLOCK_POOLS = [
    [
      ["Buongiorno, professoressa. Come (1) ___? — Sto bene, ragazzi! E voi come (2) ___?", ["sta", "state"]],
      ["Signor Rossi, come (1) ___? — Bene, grazie. E voi ragazzi, come (2) ___?", ["sta", "state"]],
      ["Professoressa, come (1) ___ oggi? — Benissimo. E voi come (2) ___?", ["sta", "state"]]
    ],
    [
      ["Come (1) ___ Marco e Laura? — Non (2) ___ bene.", ["stanno", "stanno"]],
      ["Come (1) ___ Paolo e Teresa? — (2) ___ così così.", ["stanno", "stanno"]],
      ["Come (1) ___ gli studenti? — (2) ___ benissimo.", ["stanno", "stanno"]]
    ],
    [
      ["Io (1) ___ abbastanza bene. E tu, come (2) ___?", ["sto", "stai"]],
      ["Oggi io (1) ___ male. E tu, come (2) ___?", ["sto", "stai"]],
      ["Io (1) ___ benissimo, grazie. Tu come (2) ___?", ["sto", "stai"]]
    ],
    [
      ["A Roma io e Alessandro (1) ___ benissimo. Anna e Marco (2) ___ così così.", ["stiamo", "stanno"]],
      ["Noi studenti (1) ___ bene. La professoressa e il dottore (2) ___ benissimo.", ["stiamo", "stanno"]],
      ["Io e Teresa (1) ___ a Roma. Marco e Anna (2) ___ a Milano.", ["stiamo", "stanno"]]
    ]
  ];

  const READING_QUESTIONS = [
    ["cagliari", "Gabriele è di Cagliari.", "Vero", ["Vero", "Falso"]],
    ["bergamo", "Gabriele vive a Bergamo con Stefania.", "Vero", ["Vero", "Falso"]],
    ["return-months", "Gabriele ritorna in Sardegna in quali mesi?", "dicembre e agosto", ["dicembre e agosto", "giugno e dicembre", "agosto e settembre", "maggio e luglio"]],
    ["tourists", "In estate in Sardegna ci sono molti turisti.", "Vero", ["Vero", "Falso"]],
    ["stintino-size", "Stintino è una città grande.", "Falso", ["Vero", "Falso"]],
    ["metro-stintino", "A Stintino c'è la metropolitana.", "Falso", ["Vero", "Falso"]],
    ["piazza", "Cosa c'è nella piazza?", "una fontana", ["una fontana", "una metropolitana", "un museo", "un teatro"]],
    ["benches", "Quante panchine ci sono?", "tre", ["una", "due", "tre", "quattro"]],
    ["museum", "A Stintino c'è un museo.", "Falso", ["Vero", "Falso"]],
    ["tower", "Cosa c'è sulla torre?", "un orologio", ["una statua", "un orologio", "una fontana", "un lampione"]],
    ["cinemas", "Quanti cinema ci sono?", "due", ["uno", "due", "tre", "quattro"]],
    ["stefania-birth", "Stefania è nata:", "il quindici giugno 2004", ["il quindici giugno 2004", "il diciannove dicembre 2000", "il quindici dicembre 2004", "il diciannove giugno 2000"]],
    ["gabriele-birth", "Gabriele è nato:", "il diciannove dicembre 2000", ["il quindici giugno 2004", "il diciannove dicembre 2000", "il diciannove giugno 2000", "il quindici dicembre 2000"]],
    ["subject", "Gabriele e Stefania studiano:", "letteratura", ["letteratura", "moda", "design", "italiano"]],
    ["university", "Dove studiano Gabriele e Stefania?", "all'Università di Milano", ["all'Università di Milano", "a Cagliari", "a Stintino", "in Piazza del Duomo"]],
    ["north", "Milano è nel nord Italia.", "Vero", ["Vero", "Falso"]],
    ["famous", "Milano è famosa per:", "la moda e il design", ["la moda e il design", "il mare e le spiagge", "la fontana e la torre", "le statue e i lampioni"]],
    ["train", "Per andare da Bergamo a Milano è necessario prendere:", "il treno", ["il treno", "la motocicletta", "l'automobile", "la Vespa"]],
    ["metro-milan", "Per andare a Piazza del Duomo dopo Milano è necessario prendere:", "la metropolitana", ["la metropolitana", "il treno", "la motocicletta", "l'automobile"]],
    ["duomo", "In Piazza del Duomo ci sono:", "negozi, statue, fontane e lampioni", ["negozi, statue, fontane e lampioni", "spiagge e mare", "una torre e tre panchine", "un museo e un teatro"]]
  ].map(([id, prompt, answer, options]) => ({ id, prompt, answer, options }));

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
  const phrase = (article, noun) => article.endsWith("'") ? `${article}${noun}` : `${article} ${noun}`;
  const normalize = (value) => String(value ?? "").normalize("NFC").trim().toLocaleLowerCase("it-IT").replace(/[’‘`´]/g, "'").replace(/\s*'\s*/g, "'").replace(/\s+/g, " ");

  function groupsFromQuestions(questions) {
    return questions.map((question) => ({ id: question.id, prompt: question.prompt, questions: [question] }));
  }

  function chooseDistinctBySelectors(pool, selectors, total) {
    const chosen = [];
    const used = new Set();
    selectors.forEach((selector) => {
      const candidate = random(shuffle(pool).filter((item) => !used.has(item.id) && selector(item)));
      if (candidate) { chosen.push(candidate); used.add(candidate.id); }
    });
    for (const item of shuffle(pool)) {
      if (chosen.length >= total) break;
      if (!used.has(item.id)) { chosen.push(item); used.add(item.id); }
    }
    return shuffle(chosen.slice(0, total));
  }

  function makeIndefinite(data) {
    const nouns = data.nouns.filter((noun) => !noun.context && noun.indefinite);
    const selected = chooseDistinctBySelectors(nouns, ["un", "uno", "una", "un'"].map((article) => (noun) => noun.indefinite === article), 10);
    return groupsFromQuestions(selected.map((noun, index) => ({
      id: `indefinite-${index}-${noun.id}`, prompt: `___ ${noun.singular}`, answer: noun.indefinite, type: "text",
      explanation: `The correct indefinite phrase is ${phrase(noun.indefinite, noun.singular)}.`
    })));
  }

  function makeDefinite(data) {
    const nouns = data.nouns.filter((noun) => !noun.context);
    const targets = nouns.flatMap((noun) => [
      { id: `${noun.id}-s`, nounId: noun.id, word: noun.singular, answer: noun.definiteSingular },
      { id: `${noun.id}-p`, nounId: noun.id, word: noun.plural, answer: noun.definitePlural }
    ]);
    const chosen = [];
    const usedNouns = new Set();
    ["il", "lo", "la", "l'", "i", "gli", "le"].forEach((article) => {
      const target = random(shuffle(targets).filter((item) => item.answer === article && !usedNouns.has(item.nounId)));
      if (target) { chosen.push(target); usedNouns.add(target.nounId); }
    });
    for (const target of shuffle(targets)) {
      if (chosen.length >= 10) break;
      if (!usedNouns.has(target.nounId)) { chosen.push(target); usedNouns.add(target.nounId); }
    }
    return groupsFromQuestions(shuffle(chosen).map((target, index) => ({
      id: `definite-${index}-${target.id}`, prompt: `___ ${target.word}`, answer: target.answer, type: "text",
      explanation: `The complete phrase is ${phrase(target.answer, target.word)}.`
    })));
  }

  function makeDays(data) {
    const dates = Array.from({ length: 12 }, (_, month) => {
      const lastDay = new Date(2026, month + 1, 0, 12).getDate();
      return Array.from({ length: lastDay }, (_, offset) => new Date(2026, month, offset + 1, 12));
    }).flat();
    const groups = data.days.map((day, index) => {
      const jsWeekday = index === 6 ? 0 : index + 1;
      const date = random(dates.filter((candidate) => candidate.getDay() === jsWeekday));
      const month = data.months[date.getMonth()].italian;
      return { id: `date-${date.getMonth() + 1}-${date.getDate()}`, prompt: `Il ${date.getDate()} ${month} è ___`, answer: day.italian, type: "text", explanation: `That date falls on ${day.italian}.`, date: { year: 2026, month: date.getMonth(), day: date.getDate(), weekday: date.getDay() } };
    });
    return groupsFromQuestions(shuffle(groups));
  }

  function makeMonths() {
    return groupsFromQuestions(sample(HOLIDAYS, 4).map((holiday) => ({
      id: `holiday-${holiday.id}`, label: holiday.label, prompt: holiday.prompt, answer: holiday.answer, type: "text",
      explanation: `The month is ${holiday.answer}.`
    })));
  }

  function makePlurals(data) {
    const nouns = data.nouns.filter((noun) => !noun.context);
    const selected = chooseDistinctBySelectors(nouns, [
      (noun) => noun.singular === "banca",
      (noun) => noun.singular === "amica",
      (noun) => noun.singular === "uomo",
      (noun) => noun.singular === noun.plural,
      (noun) => noun.definiteSingular === "lo",
      (noun) => noun.definiteSingular === "l'" && noun.gender === "masculine",
      (noun) => noun.definiteSingular === "l'" && noun.gender === "feminine",
      (noun) => noun.gender === "masculine" && noun.singular.endsWith("o") && noun.plural.endsWith("i"),
      (noun) => noun.gender === "feminine" && noun.singular.endsWith("a") && noun.plural.endsWith("e"),
      (noun) => noun.singular.endsWith("e") && noun.plural.endsWith("i")
    ], 12);
    return groupsFromQuestions(selected.map((noun, index) => ({
      id: `plural-${index}-${noun.id}`, prompt: phrase(noun.definiteSingular, noun.singular),
      answer: phrase(noun.definitePlural, noun.plural), type: "text",
      explanation: `${phrase(noun.definiteSingular, noun.singular)} becomes ${phrase(noun.definitePlural, noun.plural)}.`
    })));
  }

  function makeVerbGroups(pools, verb, options) {
    return shuffle(pools.map((pool, groupIndex) => {
      const selected = random(pool);
      const [prompt, answers] = selected;
      return {
        id: `${verb}-block-${groupIndex}-${pool.indexOf(selected)}`,
        prompt,
        questions: answers.map((answer, answerIndex) => ({
          id: `${verb}-${groupIndex}-${answerIndex}`, prompt: `Blank ${answerIndex + 1}`, answer, type: "select", options,
          explanation: `${answer} agrees with the subject in blank ${answerIndex + 1}.`
        }))
      };
    }));
  }

  function makeReading() {
    return sample(READING_QUESTIONS, 5).map((item) => ({
      id: `reading-${item.id}`, prompt: item.prompt,
      questions: [{ id: `reading-answer-${item.id}`, prompt: "Answer", answer: item.answer, type: "select", options: shuffle(item.options), explanation: "The answer is stated directly in the passage." }]
    }));
  }

  function createSections(data) {
    const generated = {
      indefinite: makeIndefinite(data),
      definite: makeDefinite(data),
      days: makeDays(data),
      months: makeMonths(),
      plurals: makePlurals(data),
      essere: makeVerbGroups(ESSERE_BLOCK_POOLS, "essere", ["sono", "sei", "è", "siamo", "siete"]),
      stare: makeVerbGroups(STARE_BLOCK_POOLS, "stare", ["sto", "stai", "sta", "stiamo", "state", "stanno"]),
      reading: makeReading()
    };
    const instructions = {
      indefinite: "What is the correct indefinite article? Type un, uno, una, or un'.",
      definite: "What is the correct definite article? Type il, lo, la, l', i, gli, or le.",
      days: "Use the 2026 date to write the correct Italian day of the week.",
      months: "Write only the Italian month.",
      plurals: "Write the complete plural phrase: definite article + noun.",
      essere: "Choose the correct form of essere for each numbered blank.",
      stare: "Choose the correct form of stare for each numbered blank.",
      reading: "Read the unchanged passage, then answer five questions."
    };
    return CONFIG.map(([id, title, points], index) => ({ id, title, points, number: index + 1, instructions: instructions[id], groups: generated[id], passage: id === "reading" ? READING_PASSAGE : null }));
  }

  function allQuestions(test) {
    return test.sections.flatMap((section) => section.groups.flatMap((group) => group.questions.map((question) => ({ ...question, sectionId: section.id, sectionTitle: section.title, groupPrompt: group.prompt, label: group.questions.length === 1 ? group.prompt : `${group.prompt} — ${question.prompt}` }))));
  }

  function signature(test) {
    return allQuestions(test).map((question) => `${question.id}:${question.label}`).join("|");
  }

  function generateTest(data, previousSignature = "") {
    let test;
    for (let attempt = 0; attempt < 8; attempt += 1) {
      test = { title: "Practice Test — Unit 1", sections: createSections(data), createdAt: Date.now() };
      test.signature = signature(test);
      if (test.signature !== previousSignature) break;
    }
    return test;
  }

  function gradeTest(test, answers) {
    const sectionScores = {};
    const results = allQuestions(test).map((question) => {
      const studentAnswer = answers[question.id] || "";
      const correct = normalize(studentAnswer) === normalize(question.answer);
      sectionScores[question.sectionId] ||= { title: question.sectionTitle, correct: 0, total: 0 };
      sectionScores[question.sectionId].total += 1;
      if (correct) sectionScores[question.sectionId].correct += 1;
      return { ...question, studentAnswer, correct };
    });
    const score = results.filter((result) => result.correct).length;
    return { score, total: results.length, percentage: (score / results.length) * 100, sectionScores, results };
  }

  window.PRACTICE_TEST = {
    config: CONFIG.map(([id, title, count]) => ({ id, title, count })),
    passage: READING_PASSAGE,
    holidayPoolSize: HOLIDAYS.length,
    essereTemplateCount: ESSERE_BLOCK_POOLS.reduce((total, pool) => total + pool.length, 0),
    stareTemplateCount: STARE_BLOCK_POOLS.reduce((total, pool) => total + pool.length, 0),
    readingPoolSize: READING_QUESTIONS.length,
    generateTest,
    gradeTest,
    allQuestions
  };
})();
