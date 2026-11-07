(() => {
  "use strict";

  const normalize = (value) => String(value ?? "").normalize("NFC").trim().toLocaleLowerCase("it-IT")
    .replace(/[’‘`´]/g, "'").replace(/\s*'\s*/g, "'").replace(/[.!?]+$/g, "").replace(/\s+/g, " ");
  const shuffle = (items) => {
    const copy = [...items];
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const swap = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[swap]] = [copy[swap], copy[index]];
    }
    return copy;
  };
  const group = (question) => ({ id: question.id, prompt: question.prompt, questions: [question] });
  const text = (question, id) => ({ id, sourceId: question.sourceId, prompt: question.display, answer: question.answer,
    accepted: question.accepted || [], explanation: question.explanation, category: question.category, type: "text" });
  const choice = (question, id) => {
    const alternatives = [...new Set(question.distractors || [])].filter((value) => normalize(value) !== normalize(question.answer));
    const options = shuffle([question.answer, ...shuffle(alternatives).slice(0, question.choiceCount === 5 ? 4 : 3)]);
    return { id, sourceId: question.sourceId, prompt: question.display, answer: question.answer, accepted: question.accepted || [],
      options, explanation: question.explanation, category: question.category, type: "radio" };
  };

  const CONFIG = [
    ["clothing-weather", "Clothing, Weather & Seasons", 10, ["Clothing", "Weather", "Seasons"]],
    ["sports", "Sports", 8, ["Sports", "Sports Equipment", "Sports + Prepositions"]],
    ["reflexive", "Reflexive Verbs", 12, ["Reflexive Verb Vocabulary", "Reflexive Pronouns", "Reflexive Verb Conjugation"]],
    ["reflexive-contrast", "Reflexive vs. Ordinary", 5, ["Reflexive vs. Non-Reflexive"]],
    ["reciprocal", "Reciprocal Actions", 10, ["Reciprocal Verb Vocabulary", "Reciprocal Actions", "Reciprocal vs. Non-Reciprocal"]],
    ["time", "Time", 8, ["Time Vocabulary", "Telling Time", "At What Time?", "12-Hour ↔ 24-Hour Time"]],
    ["duration", "Duration", 5, ["Duration Vocabulary", "Duration: Quanto / Quante / Molto / Molte"]],
    ["culture", "Culture & Reading", 2, ["Culture — Piemonte & Valle d’Aosta"]]
  ];

  function createSection(unit4, id, title, count, categories, number) {
    const groups = [];
    const used = new Set();
    let guard = 0;
    while (groups.length < count && guard < 500) {
      guard += 1;
      const category = categories[groups.length % categories.length];
      const generated = unit4.makeQuestion(category, null, null, "mixed");
      const signature = `${category}|${generated.id}`;
      if (used.has(signature) && guard < 400) continue;
      used.add(signature);
      const useChoice = generated.forceChoice || groups.length % 3 === 2;
      const questionId = `u4-test-${id}-${groups.length}-${generated.sourceId}`;
      groups.push(group(useChoice ? choice(generated, questionId) : text(generated, questionId)));
    }
    return { id, title, number, points: count,
      instructions: "Complete each Unit 4 item. No feedback is shown until the whole test is submitted.", groups };
  }

  function allQuestions(test) {
    return test.sections.flatMap((section) => section.groups.flatMap((itemGroup) => itemGroup.questions.map((question) => ({
      ...question, sectionId: section.id, sectionTitle: section.title, groupPrompt: itemGroup.prompt,
      label: itemGroup.questions.length === 1 ? itemGroup.prompt : `${itemGroup.prompt} — ${question.prompt}`
    }))));
  }

  function generateTest(unit4, previousSignature = "") {
    let test;
    for (let attempt = 0; attempt < 10; attempt += 1) {
      test = { title: "Unit 4 Practice Test", unit: "unit4", totalPoints: 60, createdAt: Date.now(),
        sections: CONFIG.map(([id, title, count, categories], index) => createSection(unit4, id, title, count, categories, index + 1)) };
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
    return { score, total: 60, percentage: (score / 60) * 100, sectionScores, results, reviewTopics };
  }

  window.UNIT4_PRACTICE_TEST = { config: CONFIG, generateTest, gradeTest, allQuestions };
})();
