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
  const group = (item) => ({ id: item.id, prompt: item.prompt, questions: [item] });
  const text = (item, id) => ({ id, sourceId: item.sourceId, prompt: item.display, answer: item.answer,
    accepted: item.accepted || [], explanation: item.explanation, category: item.category, type: "text" });
  const choice = (item, id) => {
    const alternatives = [...new Set(item.distractors || [])].filter((value) => normalize(value) !== normalize(item.answer));
    const options = shuffle([item.answer, ...shuffle(alternatives).slice(0, 3)]);
    return { id, sourceId: item.sourceId, prompt: item.display, answer: item.answer, accepted: item.accepted || [],
      options, explanation: item.explanation, category: item.category, type: "radio" };
  };

  // 60 questions. Demonstratives receive 8 questions (13.3%); the existing
  // priority sections are reduced proportionally. Culture stays optional.
  const CONFIG = [
    ["reflexive", "Reflexive Verbs & Daily Routine", 13, ["Reflexive Meanings", "Reflexive Pronouns", "Reflexive Conjugation", "Reflexive vs. Normal", "Daily Routine"]],
    ["modals", "Modal Verbs", 11, ["Modal Meanings", "Modal Conjugations", "Choose the Modal", "Modal + Infinitive", "Modal + Reflexive"]],
    ["time", "Time & Duration", 8, ["Read the Time", "Write the Time", "A che ora", "24-Hour Conversion", "Duration"]],
    ["town", "Around Town", 8, ["Place Vocabulary", "Errand → Place", "Directions", "Location Words", "Town Prepositions", "Map Practice"]],
    ["weather", "Weather, Seasons & Clothing", 5, ["Weather Vocabulary", "Season Vocabulary", "Clothing Vocabulary", "Weather → Clothing"]],
    ["reciprocal", "Reciprocal Actions", 5, ["Reciprocal Meanings", "Reciprocal Pronouns", "Reciprocal Conjugation", "Reciprocal vs. Ordinary"]],
    ["sports", "Sports", 2, ["Sports Vocabulary", "Sports Prepositions", "Ski: Verb / Sport / Equipment"]],
    ["demonstratives", "Demonstratives", 8, ["Questo Agreement", "Quello + Articles", "This vs That", "Adjective vs Pronoun", "Replace the Noun", "Context / Distance"]]
  ];

  function createSection(unit4, id, title, count, categories, number) {
    const groups = [];
    const used = new Set();
    let guard = 0;
    while (groups.length < count && guard < 600) {
      guard += 1;
      const category = categories[groups.length % categories.length];
      const generated = unit4.makeQuestion(category, null, null, "mixed");
      const signature = `${category}|${generated.id}`;
      if (used.has(signature) && guard < 500) continue;
      used.add(signature);
      const useChoice = generated.forceChoice || groups.length % 3 === 2;
      const questionId = `u4-cram-test-${id}-${groups.length}-${generated.sourceId}`;
      groups.push(group(useChoice ? choice(generated, questionId) : text(generated, questionId)));
    }
    return { id, title, number, points: count,
      instructions: "Complete each high-priority Unit 4 item. No feedback is shown until the whole test is submitted.", groups };
  }

  function allQuestions(test) {
    return test.sections.flatMap((section) => section.groups.flatMap((itemGroup) => itemGroup.questions.map((item) => ({
      ...item, sectionId: section.id, sectionTitle: section.title, groupPrompt: itemGroup.prompt,
      label: itemGroup.questions.length === 1 ? itemGroup.prompt : `${itemGroup.prompt} — ${item.prompt}`
    }))));
  }

  function generateTest(unit4, previousSignature = "") {
    let test;
    for (let attempt = 0; attempt < 12; attempt += 1) {
      test = { title: "Unit 4 Cram Practice Test", unit: "unit4", totalPoints: 60, createdAt: Date.now(),
        sections: CONFIG.map(([id, title, count, categories], index) => createSection(unit4, id, title, count, categories, index + 1)) };
      test.signature = allQuestions(test).map((item) => item.id).join("|");
      if (test.signature !== previousSignature) break;
    }
    return test;
  }

  function answerIsCorrect(item, value) {
    return [item.answer, ...(item.accepted || [])].some((answer) => normalize(answer) === normalize(value));
  }

  function gradeTest(test, answers) {
    const sectionScores = {};
    const results = allQuestions(test).map((item) => {
      const studentAnswer = answers[item.id] ?? "";
      const correct = answerIsCorrect(item, studentAnswer);
      sectionScores[item.sectionId] ||= { title: item.sectionTitle, correct: 0, total: 0 };
      sectionScores[item.sectionId].total += 1;
      if (correct) sectionScores[item.sectionId].correct += 1;
      return { ...item, studentAnswer, correct };
    });
    Object.values(sectionScores).forEach((section) => { section.points = section.total; section.earned = section.correct; });
    const score = results.filter((result) => result.correct).length;
    const reviewTopics = Object.values(sectionScores).map((section) => ({ ...section, percentage: (section.correct / section.total) * 100 }))
      .filter((section) => section.percentage < 90).sort((a, b) => a.percentage - b.percentage).slice(0, 5);
    return { score, total: 60, percentage: (score / 60) * 100, sectionScores, results, reviewTopics };
  }

  window.UNIT4_PRACTICE_TEST = { config: CONFIG, generateTest, gradeTest, allQuestions };
})();
