(() => {
  "use strict";

  const normalize = (value) => String(value ?? "").normalize("NFC").trim().toLocaleLowerCase("it-IT")
    .replace(/[’‘`´]/g, "'").replace(/\s*'\s*/g, "'").replace(/\s+/g, " ");
  const shuffle = (items) => {
    const copy = [...items];
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const swap = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[swap]] = [copy[swap], copy[index]];
    }
    return copy;
  };
  const group = (question) => ({ id: question.id, prompt: question.prompt, questions: [question] });
  const text = (question, id) => ({ id, sourceId: question.sourceId, prompt: question.display, answer: question.answer, accepted: question.accepted || [],
    explanation: question.explanation, category: question.category, type: "text" });
  const choice = (question, id) => ({ id, sourceId: question.sourceId, prompt: question.display, answer: question.answer,
    options: shuffle([question.answer, ...shuffle([...new Set(question.distractors || [])].filter((value) => normalize(value) !== normalize(question.answer))).slice(0, 3)]),
    explanation: question.explanation, category: question.category, type: "radio" });

  const CONFIG = [
    ["family", "Family Vocabulary", 7, ["Core Family Vocabulary", "Extended Family Vocabulary", "Family Relationships / Status", "Family Tree Practice"]],
    ["ere", "Regular -ERE Verbs", 5, ["Regular -ERE Verbs"]],
    ["irregular-ere", "Irregular -ERE Verbs", 3, ["Irregular -ERE Verb Vocabulary", "Irregular -ERE Conjugations"]],
    ["ire", "Regular -IRE Verbs", 4, ["Regular -IRE Verbs"]],
    ["isc", "-IRE Verbs with -ISC", 5, ["-IRE Verbs with -ISC"]],
    ["irregular-ire", "Irregular -IRE Verbs", 4, ["Irregular -IRE Verb Vocabulary", "Irregular -IRE Conjugations"]],
    ["poss-adj", "Possessive Adjectives", 5, ["Possessive Adjectives"]],
    ["poss-family", "Family Possessive Rules", 3, ["Possessives with Family Members"]],
    ["poss-pronoun", "Possessive Pronouns", 2, ["Possessive Pronouns"]],
    ["poss-di", "Possessives with DI", 2, ["Possessives with DI"]]
  ];

  function createSection(unit3, id, title, count, categories, number) {
    const groups = [];
    const used = new Set();
    let guard = 0;
    while (groups.length < count && guard < 300) {
      guard += 1;
      const category = categories[groups.length % categories.length];
      const generated = unit3.makeQuestion(category, null, null, "mixed");
      const signature = `${category}|${generated.id}`;
      if (used.has(signature) && guard < 240) continue;
      used.add(signature);
      const useChoice = groups.length % 3 === 2;
      const questionId = `u3-test-${id}-${groups.length}-${generated.sourceId}`;
      const question = useChoice ? choice(generated, questionId) : text(generated, questionId);
      groups.push(group(question));
    }
    return { id, title, number, points: count, instructions: "Complete each beginner Unit 3 item. Feedback appears only after submission.", groups };
  }

  function allQuestions(test) {
    return test.sections.flatMap((section) => section.groups.flatMap((itemGroup) => itemGroup.questions.map((question) => ({
      ...question, sectionId: section.id, sectionTitle: section.title, groupPrompt: itemGroup.prompt,
      label: itemGroup.questions.length === 1 ? itemGroup.prompt : `${itemGroup.prompt} — ${question.prompt}`
    }))));
  }

  function generateTest(unit3, previousSignature = "") {
    let test;
    for (let attempt = 0; attempt < 10; attempt += 1) {
      test = { title: "Unit 3 Practice Test", unit: "unit3", totalPoints: 40, createdAt: Date.now(),
        sections: CONFIG.map(([id, title, count, categories], index) => createSection(unit3, id, title, count, categories, index + 1)) };
      test.signature = allQuestions(test).map((question) => question.id).join("|");
      if (test.signature !== previousSignature) break;
    }
    return test;
  }

  function answerIsCorrect(question, value) {
    return [question.answer, ...(question.accepted || [])].some((answer) => normalize(answer) === normalize(value));
  }

  function gradeTest(test, answers) {
    const sectionScores = {};
    const results = allQuestions(test).map((question) => {
      const studentAnswer = answers[question.id] ?? "";
      const correct = answerIsCorrect(question, studentAnswer);
      sectionScores[question.sectionId] ||= { title: question.sectionTitle, correct: 0, total: 0 };
      sectionScores[question.sectionId].total += 1;
      if (correct) sectionScores[question.sectionId].correct += 1;
      return { ...question, studentAnswer, correct };
    });
    Object.values(sectionScores).forEach((section) => { section.points = section.total; section.earned = section.correct; });
    const score = results.filter((result) => result.correct).length;
    const reviewTopics = Object.values(sectionScores).map((section) => ({ ...section, percentage: (section.correct / section.total) * 100 }))
      .filter((section) => section.percentage < 90).sort((a, b) => a.percentage - b.percentage).slice(0, 5);
    return { score, total: 40, percentage: (score / 40) * 100, sectionScores, results, reviewTopics };
  }

  window.UNIT3_PRACTICE_TEST = { config: CONFIG, generateTest, gradeTest, allQuestions };
})();
