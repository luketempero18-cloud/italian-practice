(() => {
  "use strict";

  const DATA = window.STUDY_DATA;
  const UNIT2 = window.UNIT2_DATA;
  const TEST = window.PRACTICE_TEST;
  const UNIT2_TEST = window.UNIT2_PRACTICE_TEST;
  const STORAGE_KEY = "italianPractice.v1";
  const SETTINGS_KEY = "italianPractice.settings.v1";
  const UNIT2_STORAGE_KEY = "italianPractice.unit2.v1";
  const UNIT2_SETTINGS_KEY = "italianPractice.settings.unit2.v1";
  const ACTIVE_UNIT_KEY = "italianPractice.activeUnit.v1";
  const UNIT2_TEST_ATTEMPTS_KEY = "italianPractice.unit2PracticeExam.v1";
  const CORE_CATEGORIES = [
    "Definite Articles", "Indefinite Articles", "Gender", "Singular → Plural",
    "Plural → Singular", "Full Transformation"
  ];
  const MIXED_NOUN_TOPIC = "Mixed Noun Grammar";
  const UNIT1_MATCHING_CATEGORIES = [
    "Singular → Plural", "Plural → Singular", "Full Transformation", "Vocabulary",
    "Subject Pronouns", "Essere", "Stare", "Greetings", "Months", "Days of the Week", "Numbers"
  ];
  const UNIT1_TOPIC_GROUPS = [
    {
      name: "Core noun grammar",
      topics: [
        ["Definite Articles", "il, lo, la, l’, i, gli, le"],
        ["Indefinite Articles", "un, uno, una, un’"],
        ["Gender", "Masculine vs feminine"],
        ["Singular → Plural", "Noun forms"],
        ["Plural → Singular", "Noun forms"],
        ["Full Transformation", "Change article + noun"],
        [MIXED_NOUN_TOPIC, "Mix all noun grammar"]
      ]
    },
    { name: "Vocabulary", topics: [["Vocabulary", "Italian ↔ English"]] },
    {
      name: "Course topics",
      topics: [
        ["Months", ""], ["Days of the Week", ""], ["Numbers", ""], ["Subject Pronouns", ""], ["Essere", ""],
        ["Stare", ""], ["Formal vs Informal", "Formal Lei vs informal tu"],
        ["Greetings", "Greetings / introductions"], ["C'è / Ci sono", ""], ["Negation", "Negation with non"],
        ["Dialogue Fill-in", "Contextual conversations"]
      ]
    }
  ];
  const UNIT1_ALL_TOPICS = UNIT1_TOPIC_GROUPS.flatMap((group) => group.topics.map(([topic]) => topic));
  const UNIT1_PRESETS = {
    articles: ["Definite Articles", "Indefinite Articles", "Gender"],
    plurals: ["Singular → Plural", "Plural → Singular", "Full Transformation"],
    nouns: [...CORE_CATEGORIES],
    verbs: ["Essere", "Stare"],
    everything: [...UNIT1_ALL_TOPICS]
  };
  const PRESET_LABELS = {
    unit1: { articles: "Articles + Gender", plurals: "Singular + Plural", nouns: "Noun Grammar", verbs: "Verbs", everything: "Everything" },
    unit2: UNIT2.presetLabels
  };
  const METHOD_LABELS = { mc: "Multiple Choice", typed: "Written", matching: "Matching", mixed: "Mixed", mistakes: "Mistakes Only" };
  const NOUN_CATEGORIES = [
    "Definite Articles", "Indefinite Articles", "Gender", "Singular → Plural",
    "Plural → Singular", "Full Transformation", "C'è / Ci sono"
  ];
  const ARTICLE_WEIGHTS = { "il": 1.35, "lo": 0.8, "l'": 1.05, "la": 1.3, "i": 1.2, "gli": 1, "le": 1.35 };
  const NUMBER_RANGES = {
    basic: [0, 99],
    hundreds: [100, 999],
    thousands: [1000, 5999]
  };

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const random = (array) => array[Math.floor(Math.random() * array.length)];
  const shuffle = (array) => {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };
  const todayKey = () => new Date().toLocaleDateString("en-CA");
  const articlePhrase = (article, noun) => article.endsWith("'") ? `${article}${noun}` : `${article} ${noun}`;
  const titleCase = (text) => text.charAt(0).toUpperCase() + text.slice(1);
  const escapeHtml = (value) => String(value).replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char]));

  function emptyProgress() {
    return { date: todayKey(), today: { answered: 0, correct: 0, almost: 0 }, categories: {}, items: {}, mistakes: {}, reviewQueue: [] };
  }

  function loadJSON(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; }
  }

  function progressKey(unit = activeUnit) {
    return unit === "unit2" ? UNIT2_STORAGE_KEY : STORAGE_KEY;
  }

  function settingsKey(unit = activeUnit) {
    return unit === "unit2" ? UNIT2_SETTINGS_KEY : SETTINGS_KEY;
  }

  function topicGroups(unit = activeUnit) {
    return unit === "unit2" ? UNIT2.topicGroups : UNIT1_TOPIC_GROUPS;
  }

  function allTopics(unit = activeUnit) {
    return unit === "unit2" ? UNIT2.topics : UNIT1_ALL_TOPICS;
  }

  function presets(unit = activeUnit) {
    return unit === "unit2" ? UNIT2.presets : UNIT1_PRESETS;
  }

  function currentCategories(unit = activeUnit) {
    return unit === "unit2" ? UNIT2.categories : DATA.categories;
  }

  function loadProgress(unit = activeUnit) {
    const stored = loadJSON(progressKey(unit), emptyProgress());
    const clean = { ...emptyProgress(), ...stored };
    clean.today = clean.date === todayKey() ? { answered: 0, correct: 0, almost: 0, ...clean.today } : { answered: 0, correct: 0, almost: 0 };
    clean.date = todayKey();
    clean.categories ||= {};
    clean.items ||= {};
    clean.mistakes ||= {};
    clean.reviewQueue ||= [];
    return clean;
  }

  let activeUnit = localStorage.getItem(ACTIVE_UNIT_KEY) === "unit2" ? "unit2" : "unit1";

  function defaultSettings(unit = activeUnit) {
    const topics = unit === "unit2" ? [...(UNIT2.defaultTopics || UNIT2.topics)] : [...DATA.categories];
    return { topics, categories: expandTopics(topics, unit), method: "mixed", emphasis: "balanced", count: "20", strictness: "normal", numberRange: "mixed" };
  }

  function loadSettings(unit = activeUnit) {
    const defaults = defaultSettings(unit);
    const stored = loadJSON(settingsKey(unit), {});
    const loaded = { ...defaults, ...stored };
    const savedTopics = Array.isArray(stored.topics) ? stored.topics : (Array.isArray(stored.categories) ? stored.categories : defaults.topics);
    loaded.topics = unit === "unit2" ? UNIT2.migrateTopics(savedTopics) : savedTopics.filter((topic) => allTopics(unit).includes(topic));
    loaded.categories = expandTopics(loaded.topics, unit);
    if (!METHOD_LABELS[loaded.method] || loaded.method === "mistakes") loaded.method = "mixed";
    if (![...Object.keys(NUMBER_RANGES), "mixed"].includes(loaded.numberRange)) loaded.numberRange = "mixed";
    return loaded;
  }

  let progress = loadProgress();
  let settings = loadSettings();
  let session = null;
  let practiceTestSession = null;
  let pictureSession = null;
  let lastPictureIds = [];
  let vocabularyFilter = "all";

  function saveProgress() {
    localStorage.setItem(progressKey(), JSON.stringify(progress));
  }

  function saveSettings() {
    localStorage.setItem(settingsKey(), JSON.stringify(settings));
  }

  function expandTopics(topics, unit = activeUnit) {
    if (unit === "unit2") return UNIT2.expandTopics(topics);
    const expanded = topics.flatMap((topic) => topic === MIXED_NOUN_TOPIC ? CORE_CATEGORIES : [topic]);
    return [...new Set(expanded)].filter((category) => DATA.categories.includes(category));
  }

  function initSettings() {
    const wrap = $("#topic-groups");
    wrap.innerHTML = topicGroups().map((group) => `<div class="topic-group"><h3>${escapeHtml(group.name)}</h3><div class="checkbox-grid">${group.topics.map(([topic, note, exam2]) => {
      const checked = settings.topics.includes(topic) ? "checked" : "";
      return `<label class="checkbox-option"><input type="checkbox" value="${escapeHtml(topic)}" ${checked}><span>${escapeHtml(topic)}${note ? `<small>${escapeHtml(note)}</small>` : ""}${exam2 ? '<small class="exam-badge">★ Exam 2</small>' : ""}</span></label>`;
    }).join("")}</div></div>`).join("");
    const labels = PRESET_LABELS[activeUnit];
    $("#preset-row").innerHTML = `<span>Quick picks</span>${Object.keys(presets()).map((key) => `<button type="button" class="preset-button ${key === "exam2" ? "exam-preset" : ""}" data-preset="${key}">${escapeHtml(labels[key])}</button>`).join("")}`;
    $("#emphasis").value = settings.emphasis;
    $("#question-count").value = settings.count;
    $("#strictness").value = settings.strictness;
    $("#number-range").value = settings.numberRange;
    selectMethod(settings.method, false);
    updateUnitInterface();
    updateTopicCount();
  }

  function syncSettings() {
    const selected = $$("#topic-groups input:checked").map((input) => input.value);
    settings = {
      ...settings,
      topics: selected,
      categories: expandTopics(selected),
      emphasis: $("#emphasis").value,
      count: $("#question-count").value,
      strictness: $("#strictness").value,
      numberRange: $("#number-range").value
    };
    saveSettings();
    updateTopicCount();
    clearBuilderMessage();
  }

  function selectMethod(method, persist = true) {
    settings.method = method;
    $$('[data-method]').forEach((button) => {
      const selected = button.dataset.method === method;
      button.classList.toggle("selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    if (persist) saveSettings();
    clearBuilderMessage();
  }

  function setTopics(topics) {
    const selected = new Set(topics);
    $$("#topic-groups input").forEach((input) => { input.checked = selected.has(input.value); });
    syncSettings();
  }

  function updateTopicCount() {
    const count = settings.topics.length;
    const allCategoriesSelected = currentCategories().every((category) => settings.categories.includes(category));
    $("#topic-count").textContent = allCategoriesSelected ? "All topics selected" : count ? `${count} ${count === 1 ? "topic" : "topics"} selected` : "No topics selected";
  }

  function updateUnitInterface() {
    const unitLabel = activeUnit === "unit2" ? "Unit 2" : "Unit 1";
    $$('[data-unit]').forEach((button) => {
      const selected = button.dataset.unit === activeUnit;
      button.classList.toggle("selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    $("#brand-unit-label").textContent = `${unitLabel} study lab`;
    $("#home-unit-label").textContent = unitLabel;
    $("#hero-copy").textContent = activeUnit === "unit2"
      ? "Focused Exam 2 and Unit 2 practice for course vocabulary, adjectives, avere, regular and irregular verbs, listening, and classroom usage."
      : "Fast, focused repetition for articles, gender, and plural forms—with your weak areas brought back at the right time.";
    $("#weak-areas-title").textContent = `${unitLabel} Weak Areas`;
    $("#vocabulary-unit-label").textContent = `${unitLabel} study reference`;
    $("#number-range-control").classList.toggle("hidden", activeUnit === "unit2");
    $("#emphasis-control").classList.toggle("hidden", activeUnit === "unit2");
    $("#open-classroom-picture").classList.toggle("hidden", activeUnit !== "unit2");
    const testButton = $("#open-practice-test");
    testButton.disabled = false;
    testButton.textContent = activeUnit === "unit2" ? "★ Practice Exam 2" : "Practice Test";
  }

  function switchUnit(nextUnit) {
    if (nextUnit === activeUnit || !["unit1", "unit2"].includes(nextUnit)) return;
    if ((session || practiceTestSession) && !window.confirm("Changing units will end the current study session. Continue?")) return;
    window.speechSynthesis?.cancel();
    saveSettings();
    activeUnit = nextUnit;
    localStorage.setItem(ACTIVE_UNIT_KEY, activeUnit);
    progress = loadProgress();
    settings = loadSettings();
    session = null;
    practiceTestSession = null;
    pictureSession = null;
    vocabularyFilter = "all";
    initSettings();
    renderHomeStats();
    showView("home");
  }

  function clearBuilderMessage() {
    const message = $("#topic-selection-message");
    message.textContent = "";
    message.classList.add("hidden");
  }

  function showBuilderMessage(text) {
    const message = $("#topic-selection-message");
    message.textContent = text;
    message.classList.remove("hidden");
  }

  function accuracy(stats) {
    return stats?.answered ? Math.round((stats.correct / stats.answered) * 100) : null;
  }

  function renderHomeStats() {
    const today = progress.today;
    $("#stat-answered").textContent = today.answered;
    $("#stat-correct").textContent = today.correct;
    $("#stat-accuracy").textContent = today.answered ? `${accuracy(today)}%` : "—";

    const mistakes = Object.values(progress.mistakes).reduce((total, item) => total + Math.max(1, item.misses || 1), 0);
    $("#mistake-count-label").textContent = mistakes ? `${mistakes} review ${mistakes === 1 ? "item" : "items"} ready` : "No mistakes waiting";

    const attempted = Object.entries(progress.categories)
      .filter(([, stats]) => stats.answered > 0)
      .map(([category, stats]) => ({ category, value: accuracy(stats) }))
      .sort((a, b) => a.value - b.value)
      .slice(0, 6);
    const wrap = $("#weak-areas");
    if (!attempted.length) {
      wrap.innerHTML = '<p class="empty-progress">Complete a few questions and your weakest topics will appear here.</p>';
      return;
    }
    wrap.innerHTML = attempted.map(({ category, value }) => `
      <div class="weak-item"><div><span>${escapeHtml(category)}</span><strong>${value}%</strong></div>
      <div class="mini-track"><span style="width:${value}%"></span></div></div>`).join("");
  }

  function showView(name) {
    ["home", "vocabulary", "practice-test", "picture", "study", "summary"].forEach((view) => $(`#${view}-view`).classList.toggle("hidden", view !== name));
    $("#study-home").classList.toggle("hidden", name === "home" || name === "vocabulary" || name === "practice-test" || name === "picture");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderPracticeTestField(question) {
    if (question.type === "select") {
      return `<select class="practice-test-answer" data-test-answer="${escapeHtml(question.id)}" aria-label="${escapeHtml(question.prompt)}"><option value="">Choose an answer</option>${question.options.map((option) => `<option value="${escapeHtml(option)}">${escapeHtml(option)}</option>`).join("")}</select>`;
    }
    if (question.type === "radio" || question.type === "checkbox") {
      return `<fieldset class="practice-test-options ${question.type === "checkbox" ? "multiple-answer" : ""}" data-test-answer-group="${escapeHtml(question.id)}"><legend class="sr-only">${escapeHtml(question.prompt)}</legend>${question.options.map((option) => `<label><input class="practice-test-answer" type="${question.type}" name="${escapeHtml(question.id)}" value="${escapeHtml(option)}" data-test-answer="${escapeHtml(question.id)}"><span>${escapeHtml(option)}</span></label>`).join("")}</fieldset>`;
    }
    return `<input class="practice-test-answer" data-test-answer="${escapeHtml(question.id)}" aria-label="${escapeHtml(question.prompt)}" autocomplete="off" autocapitalize="off" spellcheck="false" />`;
  }

  function practiceTestQuestionCount() {
    return practiceTestSession.module.allQuestions(practiceTestSession.test).length;
  }

  function renderPracticeTestSectionSupplement(section) {
    if (section.kind === "listening") {
      return `<div class="practice-listening" data-listening-text="${escapeHtml(section.script)}"><strong>${escapeHtml(section.listeningTitle || "Practice listening")}</strong><p>This original browser-generated recording is practice material, not professor or course audio.</p><div class="practice-listening-actions"><button class="secondary-button play-practice-listening" type="button">▶ Play practice transcript</button><button class="text-button stop-practice-listening" type="button">Stop</button><button class="text-button reveal-practice-transcript" type="button">Reveal transcript</button></div><div class="practice-transcript hidden"><p>${escapeHtml(section.script)}</p></div></div>`;
    }
    if (section.passage) return `<div class="reading-passage">${section.passageTitle ? `<strong>${escapeHtml(section.passageTitle)}</strong>\n\n` : ""}${escapeHtml(section.passage)}</div>`;
    return "";
  }

  function renderPracticeTest() {
    const test = practiceTestSession.test;
    const questionCount = practiceTestQuestionCount();
    $("#practice-test-unit-label").textContent = test.unit === "unit2" ? "Unit 2 · Exam simulation" : "Unit 1";
    $("#practice-test-title").textContent = test.title;
    $("#practice-test-total").textContent = `${test.totalPoints || questionCount} points total`;
    $("#submit-practice-test").textContent = test.unit === "unit2" ? "Submit Practice Exam" : "Submit Practice Test";
    $("#practice-test-nav").innerHTML = test.sections.map((section) => `<button type="button" data-test-section="${section.id}">${escapeHtml(section.title.replace(" with Definite Articles", ""))}</button>`).join("");
    $("#practice-test-form").innerHTML = test.sections.map((section) => {
      let number = 0;
      const groups = section.groups.map((group) => {
        if (group.questions.length === 1) {
          number += 1;
          const question = group.questions[0];
          return `<div class="practice-test-question"><label><span>${number}.</span><span class="practice-test-question-copy">${question.label ? `<small>${escapeHtml(question.label)}</small>` : ""}<strong>${escapeHtml(group.prompt)}</strong></span>${renderPracticeTestField(question)}</label></div>`;
        }
        const fields = group.questions.map((question) => {
          number += 1;
          return `<label class="practice-test-blank"><span>${question.prompt}</span>${renderPracticeTestField(question)}</label>`;
        }).join("");
        return `<div class="practice-test-question practice-test-block"><p>${escapeHtml(group.prompt)}</p><div>${fields}</div></div>`;
      }).join("");
      return `<section class="practice-test-section" id="practice-section-${section.id}"><div class="practice-test-section-heading"><div><p class="eyebrow">Section ${section.number}</p><h2>${escapeHtml(section.title)}</h2></div><strong>${section.points} points</strong></div><p class="practice-test-instructions">${escapeHtml(section.instructions)}</p>${renderPracticeTestSectionSupplement(section)}${groups}</section>`;
    }).join("");
    $("#practice-test-results").classList.add("hidden");
    $("#practice-test-results").innerHTML = "";
    $("#submit-practice-test").disabled = false;
    $("#submit-practice-test").classList.remove("hidden");
    updatePracticeTestProgress();
    $$(".practice-test-answer").forEach((control) => {
      control.addEventListener("input", updatePracticeTestProgress);
      control.addEventListener("change", updatePracticeTestProgress);
    });
    $$(".play-practice-listening").forEach((button) => button.addEventListener("click", () => {
      if (!("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(button.closest(".practice-listening").dataset.listeningText);
      utterance.lang = "it-IT";
      utterance.rate = 0.78;
      window.speechSynthesis.speak(utterance);
    }));
    $$(".stop-practice-listening").forEach((button) => button.addEventListener("click", () => window.speechSynthesis?.cancel()));
    $$(".reveal-practice-transcript").forEach((button) => button.addEventListener("click", () => {
      if (!window.confirm("Reveal the transcript? For the best listening practice, try answering from audio first.")) return;
      button.closest(".practice-listening").querySelector(".practice-transcript").classList.remove("hidden");
      button.classList.add("hidden");
    }));
    $$('[data-test-section]').forEach((button) => button.addEventListener("click", () => $(`#practice-section-${button.dataset.testSection}`)?.scrollIntoView({ behavior: "smooth", block: "start" })));
  }

  function updatePracticeTestProgress() {
    const questionIds = new Set($$(".practice-test-answer").map((control) => control.dataset.testAnswer));
    const answered = [...questionIds].filter((id) => {
      const controls = $$(`[data-test-answer="${CSS.escape(id)}"]`);
      return controls.some((control) => (control.type === "radio" || control.type === "checkbox") ? control.checked : control.value.trim());
    }).length;
    $("#practice-test-progress").textContent = `Progress: ${answered} / ${questionIds.size} answered`;
  }

  function startPracticeTest(previousSignature = "") {
    session = null;
    const module = activeUnit === "unit2" ? UNIT2_TEST : TEST;
    const test = activeUnit === "unit2" ? module.generateTest(UNIT2, previousSignature) : module.generateTest(DATA, previousSignature);
    practiceTestSession = { test, module, unit: activeUnit, submitted: false };
    renderPracticeTest();
    showView("practice-test");
  }

  function collectPracticeTestAnswers() {
    const answers = {};
    new Set($$(".practice-test-answer").map((control) => control.dataset.testAnswer)).forEach((id) => {
      const controls = $$(`[data-test-answer="${CSS.escape(id)}"]`);
      if (controls[0]?.type === "checkbox") answers[id] = controls.filter((control) => control.checked).map((control) => control.value);
      else if (controls[0]?.type === "radio") answers[id] = controls.find((control) => control.checked)?.value || "";
      else answers[id] = controls[0]?.value || "";
    });
    return answers;
  }

  function practiceAnswerIsEmpty(value) {
    return Array.isArray(value) ? value.length === 0 : !String(value).trim();
  }

  function saveUnit2PracticeAttempt(grade) {
    const attempts = loadJSON(UNIT2_TEST_ATTEMPTS_KEY, []);
    attempts.unshift({ createdAt: practiceTestSession.test.createdAt, submittedAt: Date.now(), signature: practiceTestSession.test.signature,
      score: grade.score, total: grade.total, percentage: grade.percentage,
      sections: Object.fromEntries(Object.entries(grade.sectionScores).map(([id, value]) => [id, { correct: value.correct, total: value.total }])) });
    localStorage.setItem(UNIT2_TEST_ATTEMPTS_KEY, JSON.stringify(attempts.slice(0, 30)));
  }

  function addUnit2ExamMistakes(grade) {
    grade.results.filter((result) => !result.correct && UNIT2.categories.includes(result.category)).forEach((result) => {
      const key = `${result.category}:${result.id}`;
      progress.mistakes[key] = { key, category: result.category, sourceId: result.id, label: result.label,
        misses: (progress.mistakes[key]?.misses || 0) + 1, streak: 0, lastMiss: Date.now(), fromPracticeExam: true };
    });
    saveProgress();
  }

  function submitPracticeTest() {
    if (!practiceTestSession || practiceTestSession.submitted) return;
    const controls = $$(".practice-test-answer");
    const answers = collectPracticeTestAnswers();
    const unanswered = Object.values(answers).filter(practiceAnswerIsEmpty).length;
    if (unanswered && !window.confirm(`You still have ${unanswered} unanswered ${unanswered === 1 ? "question" : "questions"}. Submit anyway?`)) return;
    const grade = practiceTestSession.module.gradeTest(practiceTestSession.test, answers);
    practiceTestSession.submitted = true;
    practiceTestSession.grade = grade;
    controls.forEach((control) => { control.disabled = true; });
    $("#submit-practice-test").disabled = true;
    $("#submit-practice-test").classList.add("hidden");
    const sectionScores = Object.entries(grade.sectionScores).map(([id, score]) => `<div><span>${escapeHtml(score.title)}</span><strong>${score.earned === undefined ? `${score.correct} / ${score.total}` : `${Number(score.earned.toFixed(1))} / ${score.points}`}</strong></div>`).join("");
    const missed = grade.results.filter((result) => !result.correct);
    const missedHtml = missed.length ? missed.map((result) => `<article><strong>${escapeHtml(result.sectionTitle)}</strong><p>${escapeHtml(result.label)}</p><span>Your answer: ${escapeHtml(result.studentAnswer || "Unanswered")}</span><span>Correct answer: ${escapeHtml(result.answer)}</span><small>${escapeHtml(result.explanation)}</small></article>`).join("") : '<p class="perfect-test">Perfect score—every answer is correct.</p>';
    const reviewTopics = grade.reviewTopics?.length ? `<div class="practice-test-topics"><h2>Topics to review</h2><div>${grade.reviewTopics.map((topic) => `<span>${escapeHtml(topic.title)} · ${Math.round(topic.percentage)}%</span>`).join("")}</div></div>` : "";
    const results = $("#practice-test-results");
    results.innerHTML = `<div class="practice-test-complete"><span class="summary-mark" aria-hidden="true">✓</span><p class="eyebrow">${practiceTestSession.unit === "unit2" ? "Practice Exam 2 Complete" : "Practice Test Complete"}</p><h2>Score: ${grade.score} / ${grade.total}</h2><strong>Percentage: ${grade.percentage.toFixed(1)}%</strong></div><div class="practice-test-section-scores">${sectionScores}</div>${reviewTopics}<div class="practice-test-review"><h2>${missed.length ? "Review missed questions" : "Ben fatto!"}</h2>${missedHtml}</div><div class="practice-test-result-actions"><button id="generate-new-test" class="primary-button" type="button">${practiceTestSession.unit === "unit2" ? "Retake With New Questions" : "Generate New Test"}</button><button id="practice-test-results-home" class="secondary-button" type="button">Back to home</button></div>`;
    if (practiceTestSession.unit === "unit2") {
      saveUnit2PracticeAttempt(grade);
      addUnit2ExamMistakes(grade);
      $$(".practice-transcript").forEach((transcript) => transcript.classList.remove("hidden"));
      window.speechSynthesis?.cancel();
    }
    results.classList.remove("hidden");
    $("#generate-new-test").addEventListener("click", () => startPracticeTest(practiceTestSession.test.signature));
    $("#practice-test-results-home").addEventListener("click", goHome);
    results.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function vocabularyEntries() {
    if (activeUnit === "unit2") return UNIT2.vocabulary.map((entry) => ({ ...entry, variants: [] }));
    const grouped = new Map();
    DATA.nouns.forEach((noun) => {
      const key = lexicalKey(noun.singular);
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key).push(noun);
    });
    const entries = [...grouped.values()].map((variants) => {
      const noun = variants.find((item) => item.vocabularyEligible !== false) || variants[0];
      return { id: noun.id, italian: noun.singular, english: noun.english, tag: noun.tag || "Nouns", register: noun.register, variants };
    });
    const seen = new Set(entries.map((entry) => lexicalKey(entry.italian)));
    [
      [DATA.greetings || [], "Greetings & Introductions", "greeting"],
      [DATA.expressions || [], "Useful Expressions", "expression"],
      [DATA.solarSystem || [], "Solar System", "solar"],
      [DATA.days || [], "Days of the Week", "day"]
    ].forEach(([items, fallbackTag, source]) => items.forEach((item) => {
      const key = lexicalKey(item.italian);
      if (seen.has(key)) return;
      seen.add(key);
      entries.push({ id: `${source}:${key}`, italian: item.italian, english: item.english, tag: item.tag || fallbackTag, register: item.register, variants: [] });
    }));
    return entries;
  }

  function lexicalKey(value) {
    return normalize(value).replace(/[.!?…]+$/g, "").trim();
  }

  function pickVocabularyItem(preferred) {
    const entries = vocabularyEntries();
    return entries.find((entry) => entry.id === preferred) || random(entries);
  }

  function renderVocabulary(expanded = null) {
    const query = normalize($("#vocabulary-search").value);
    const sortBy = $("#vocabulary-sort").value;
    const filters = $("#vocabulary-filters");
    filters.classList.toggle("hidden", activeUnit !== "unit2");
    if (activeUnit === "unit2") {
      filters.innerHTML = UNIT2.vocabularyFilters.map(([value, label]) => `<button type="button" class="preset-button ${vocabularyFilter === value ? "selected" : ""}" data-vocabulary-filter="${value}">${escapeHtml(label)}</button>`).join("");
    } else filters.innerHTML = "";
    const entries = vocabularyEntries()
      .filter((entry) => activeUnit !== "unit2" || vocabularyFilter === "all" || entry.groups?.includes(vocabularyFilter))
      .filter((entry) => !query || normalize(entry.italian).includes(query) || normalize(entry.english).includes(query))
      .sort((a, b) => (sortBy === "english" ? a.english.localeCompare(b.english, "en") : a.italian.localeCompare(b.italian, "it-IT")));
    $("#vocabulary-count").textContent = `${entries.length} ${entries.length === 1 ? "entry" : "entries"}`;
    $("#vocabulary-list").innerHTML = entries.map((entry) => {
      const { italian, english, tag, register, variants } = entry;
      const key = lexicalKey(italian);
      const isOpen = expanded === true || (expanded instanceof Set && expanded.has(key));
      const unique = (field) => [...new Set(variants.map((item) => item[field]))];
      let unit2Grammar = "";
      if (activeUnit === "unit2" && entry.forms && entry.family) {
        unit2Grammar = `<div class="vocabulary-grammar"><div><small>Adjective family</small><b>${escapeHtml(entry.family === "fourEnding" ? "Four-ending" : entry.family === "twoEnding" ? "Two-ending" : entry.family === "ista" ? "-ista" : "Invariant")}</b></div><div><small>Masculine</small><b>${escapeHtml(entry.forms.ms)} · ${escapeHtml(entry.forms.mp)}</b></div><div><small>Feminine</small><b>${escapeHtml(entry.forms.fs)} · ${escapeHtml(entry.forms.fp)}</b></div>${entry.opposites?.length ? `<div><small>Opposite</small><b>${escapeHtml(entry.opposites.join(" / "))}</b></div>` : ""}</div>`;
      } else if (activeUnit === "unit2" && entry.forms && entry.infinitive) {
        unit2Grammar = `<div class="vocabulary-grammar"><div><small>Singular subjects</small><b>${escapeHtml(`io ${entry.forms.io} · tu ${entry.forms.tu} · lui/lei ${entry.forms["lui/lei/Lei"]}`)}</b></div><div><small>Plural subjects</small><b>${escapeHtml(`noi ${entry.forms.noi} · voi ${entry.forms.voi} · loro ${entry.forms.loro}`)}</b></div></div>`;
      } else if (activeUnit === "unit2" && entry.gender) {
        unit2Grammar = `<div class="vocabulary-grammar"><div><small>Gender</small><b>${escapeHtml(titleCase(entry.gender))}</b></div><div><small>Singular → plural</small><b>${escapeHtml(`${entry.singular} → ${entry.plural}`)}</b></div><div><small>Definite articles</small><b>${escapeHtml(`${articlePhrase(entry.definiteSingular, entry.singular)} → ${articlePhrase(entry.definitePlural, entry.plural)}`)}</b></div><div><small>Indefinite article</small><b>${escapeHtml(articlePhrase(entry.indefinite, entry.singular))}</b></div></div>`;
      }
      const grammar = unit2Grammar || (variants.length ? `<div class="vocabulary-grammar"><div><small>Gender</small><b>${escapeHtml(unique("gender").map(titleCase).join(" / "))}</b></div><div><small>Singular → plural</small><b>${escapeHtml(unique("singular").join(" / "))} → ${escapeHtml(unique("plural").join(" / "))}</b></div><div><small>Definite articles</small><b>${escapeHtml([...new Set(variants.map((item) => `${articlePhrase(item.definiteSingular, item.singular)} → ${articlePhrase(item.definitePlural, item.plural)}`))].join("; "))}</b></div><div><small>Indefinite article</small><b>${escapeHtml([...new Set(variants.map((item) => articlePhrase(item.indefinite, item.singular)))].join(" / "))}</b></div></div>` : "");
      return `<article class="vocabulary-row" data-vocabulary-key="${escapeHtml(key)}"><button class="vocabulary-toggle" type="button" aria-expanded="${isOpen}"><strong>${escapeHtml(italian)}</strong><span>${isOpen ? "Hide" : "Show"}</span></button><div class="vocabulary-details ${isOpen ? "" : "hidden"}"><strong>${escapeHtml(english)}</strong><div class="vocabulary-meta"><span>${escapeHtml(tag)}</span>${entry.exam2 ? '<span>★ Exam 2</span>' : ""}${register ? `<span>${escapeHtml(titleCase(register))}</span>` : ""}</div>${grammar}</div></article>`;
    }).join("") || '<div class="empty-state"><h2>No words found</h2><p>Try a different Italian or English search.</p></div>';
    $$(".vocabulary-toggle").forEach((button) => button.addEventListener("click", () => {
      const details = button.nextElementSibling;
      const opening = details.classList.contains("hidden");
      details.classList.toggle("hidden", !opening);
      button.setAttribute("aria-expanded", String(opening));
      button.querySelector("span").textContent = opening ? "Hide" : "Show";
    }));
  }

  function openVocabulary() {
    session = null;
    vocabularyFilter = "all";
    $("#vocabulary-search").value = "";
    renderVocabulary(new Set());
    showView("vocabulary");
  }

  function choosePictureItems() {
    let selected = [];
    for (let attempt = 0; attempt < 12; attempt += 1) {
      const count = 8 + Math.floor(Math.random() * 5);
      selected = shuffle(UNIT2.pictureItems).slice(0, count);
      const signature = selected.map((item) => item.id).sort().join("|");
      if (signature !== [...lastPictureIds].sort().join("|")) break;
    }
    lastPictureIds = selected.map((item) => item.id);
    return selected;
  }

  function startPicturePractice() {
    if (activeUnit !== "unit2") return;
    session = null;
    practiceTestSession = null;
    const items = choosePictureItems();
    pictureSession = { items, checked: false };
    $("#classroom-picture").src = UNIT2.pictureAsset;
    const selectedNumbers = new Map(items.map((item, index) => [item.id, index + 1]));
    $("#classroom-markers").innerHTML = UNIT2.pictureItems.map((item) => {
      const number = selectedNumbers.get(item.id);
      return `<span class="picture-marker ${number ? "" : "cover"}" style="left:${item.x}%;top:${item.y}%">${number || ""}</span>`;
    }).join("");
    $("#picture-answer-form").innerHTML = items.map((item, index) => `<label class="picture-answer" data-picture-row="${escapeHtml(item.id)}"><strong>${index + 1}</strong><input data-picture-answer="${escapeHtml(item.id)}" aria-label="Italian label ${index + 1}" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Italian noun"><span class="picture-answer-feedback hidden"></span></label>`).join("");
    $("#picture-score").className = "picture-score hidden";
    $("#picture-score").textContent = "";
    $("#check-picture-answers").classList.remove("hidden");
    $("#new-picture-round").classList.add("hidden");
    showView("picture");
    $("[data-picture-answer]")?.focus();
  }

  function recordPictureResult(item, correct) {
    progress.today.answered += 1;
    if (correct) progress.today.correct += 1;
    const category = "Classroom Objects";
    const categoryStats = progress.categories[category] || { answered: 0, correct: 0 };
    categoryStats.answered += 1;
    if (correct) categoryStats.correct += 1;
    progress.categories[category] = categoryStats;
    const key = `${category}|${item.id}`;
    const stored = progress.items[key] || { attempts: 0, correct: 0, misses: 0, streak: 0 };
    stored.attempts += 1;
    stored.lastSeen = Date.now();
    if (correct) {
      stored.correct += 1;
      stored.streak += 1;
      if (progress.mistakes[key]) {
        progress.mistakes[key].streak = (progress.mistakes[key].streak || 0) + 1;
        if (progress.mistakes[key].streak >= 2) delete progress.mistakes[key];
      }
    } else {
      stored.misses += 1;
      stored.streak = 0;
      progress.mistakes[key] = { key, category, sourceId: item.id, label: item.singular, misses: (progress.mistakes[key]?.misses || 0) + 1, streak: 0, lastMiss: Date.now() };
      progress.reviewQueue.push({ category, sourceId: item.id, due: progress.today.answered + 4 });
      progress.reviewQueue = progress.reviewQueue.slice(-40);
    }
    progress.items[key] = stored;
  }

  function checkPictureAnswers() {
    if (!pictureSession || pictureSession.checked) return;
    const controls = $$('[data-picture-answer]');
    const empty = controls.find((control) => !control.value.trim());
    if (empty) {
      $("#picture-score").className = "picture-score error";
      $("#picture-score").textContent = "Complete every label before checking.";
      empty.focus();
      return;
    }
    pictureSession.checked = true;
    let score = 0;
    controls.forEach((control) => {
      const item = pictureSession.items.find((entry) => entry.id === control.dataset.pictureAnswer);
      const correct = item.accepted.some((answer) => normalize(control.value) === normalize(answer));
      if (correct) score += 1;
      recordPictureResult(item, correct);
      control.disabled = true;
      const row = control.closest(".picture-answer");
      row.classList.add(correct ? "correct" : "incorrect");
      const feedback = row.querySelector(".picture-answer-feedback");
      feedback.classList.remove("hidden");
      feedback.innerHTML = correct ? "✓ Correct" : `Your answer: <b>${escapeHtml(control.value)}</b> · Correct: <b>${escapeHtml(item.singular)}</b>`;
    });
    saveProgress();
    $("#picture-score").className = "picture-score";
    $("#picture-score").textContent = `Score: ${score} / ${pictureSession.items.length}`;
    $("#check-picture-answers").classList.add("hidden");
    $("#new-picture-round").classList.remove("hidden");
  }

  function matchingCategoryEligible(category, numberRange = settings.numberRange) {
    const matchingCategories = activeUnit === "unit2" ? UNIT2.matchingCategories : UNIT1_MATCHING_CATEGORIES;
    return matchingCategories.includes(category) && (category !== "Numbers" || numberRange === "basic");
  }

  function startSession(mode) {
    syncSettings();
    const selectedCategories = settings.categories.length ? [...settings.categories] : (mode === "mistakes" ? [...currentCategories()] : []);
    if (mode !== "mistakes" && !selectedCategories.length) {
      showBuilderMessage("Choose at least one topic before starting practice.");
      $("#topic-heading").scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const matchingCategories = selectedCategories.filter((category) => matchingCategoryEligible(category));
    if (mode === "matching" && !matchingCategories.length) {
      showBuilderMessage("Matching is not available for those topics. Choose another practice type or add a matching-friendly topic such as Vocabulary, Months, Verbs, or Singular / Plural.");
      return;
    }
    const mistakeEntries = Object.values(progress.mistakes).filter((item) => selectedCategories.includes(item.category) && mistakeIsEligible(item));
    if (mode === "mistakes" && !mistakeEntries.length) {
      showView("study");
      $("#session-topics").textContent = settings.topics.length ? topicSummary(settings.topics) : "All mistake topics";
      $("#session-mode").textContent = METHOD_LABELS.mistakes;
      $("#question-number").textContent = "Mistakes Only";
      $("#question-category").textContent = "";
      $("#study-score").textContent = "";
      $("#progress-bar").style.width = "0%";
      $("#question-content").innerHTML = '<div class="empty-state"><h2>Your mistake queue is clear.</h2><p>Start any study mode. Missed concepts will collect here for focused review.</p><button class="secondary-button" id="empty-home" type="button">Back home</button></div>';
      $("#answer-area").innerHTML = "";
      $("#feedback").className = "feedback hidden";
      $("#check-answer").classList.add("hidden");
      $("#next-question").classList.add("hidden");
      $("#keyboard-hint").classList.add("hidden");
      $("#empty-home").addEventListener("click", goHome);
      return;
    }
    session = {
      mode,
      topics: mode === "mistakes" && !settings.topics.length ? ["All mistake topics"] : [...settings.topics],
      categories: selectedCategories,
      limit: settings.count === "unlimited" ? Infinity : Number(settings.count),
      answered: 0,
      correct: 0,
      almost: 0,
      current: null,
      selectedChoice: null,
      feedbackShown: false,
      recentIds: [],
      recentSources: [],
      recentNouns: [],
      recentNumbers: [],
      numberRange: settings.numberRange,
      articleCounts: {},
      matchState: null,
      categoryCounts: {}
    };
    $("#session-topics").textContent = topicSummary(session.topics);
    $("#session-mode").textContent = METHOD_LABELS[mode];
    showView("study");
    nextQuestion();
  }

  function topicSummary(topics) {
    if (!topics.length) return "All topics";
    const labels = topics.map((topic) => topic === "Gender" ? "Gender" : topic === "Full Transformation" ? "Full Transformations" : topic);
    return labels.length <= 3 ? labels.join(" • ") : `${labels.slice(0, 3).join(" • ")} +${labels.length - 3}`;
  }

  function goHome() {
    window.speechSynthesis?.cancel();
    session = null;
    practiceTestSession = null;
    pictureSession = null;
    renderHomeStats();
    showView("home");
  }

  function weightedPick(entries) {
    const total = entries.reduce((sum, entry) => sum + entry.weight, 0);
    let cursor = Math.random() * total;
    for (const entry of entries) {
      cursor -= entry.weight;
      if (cursor <= 0) return entry.value;
    }
    return entries.at(-1).value;
  }

  function categoryWeight(category) {
    let weight = 1;
    const emphases = {
      articles: ["Definite Articles", "Indefinite Articles", "Full Transformation"],
      plurals: ["Singular → Plural", "Plural → Singular", "Full Transformation", "C'è / Ci sono"],
      gender: ["Gender"]
    };
    if (emphases[settings.emphasis]?.includes(category)) weight *= 2.8;
    const stats = progress.categories[category];
    const value = accuracy(stats);
    if (settings.emphasis === "weak" && value !== null) weight *= 1 + ((100 - value) / 35);
    if (activeUnit === "unit1" && CORE_CATEGORIES.includes(category)) weight *= 1.35;
    return weight;
  }

  function activeCategories() {
    return session?.categories?.length ? session.categories : settings.categories;
  }

  function mistakeIsEligible(item) {
    if (activeUnit === "unit2") return UNIT2.isSourceEligible(item.category, item.sourceId);
    return item.category !== "Gender" || eligibleNouns("Gender").some((noun) => noun.id === item.sourceId);
  }

  function pickCategory() {
    const categories = activeCategories();
    if (session.mode === "mistakes") {
      const available = Object.values(progress.mistakes).filter((item) => categories.includes(item.category) && mistakeIsEligible(item));
      return available.length ? weightedPick(available.map((item) => ({ value: item.category, weight: item.misses || 1 }))) : random(categories);
    }
    const due = progress.reviewQueue.find((item) => item.due <= progress.today.answered && categories.includes(item.category));
    if (due && Math.random() < 0.65) return due.category;
    const counts = categories.map((category) => session.categoryCounts[category] || 0);
    const lowestCount = Math.min(...counts);
    const balanced = categories.filter((category) => (session.categoryCounts[category] || 0) <= lowestCount + 1);
    return weightedPick(balanced.map((category) => ({ value: category, weight: categoryWeight(category) })));
  }

  function preferredSource(category) {
    if (session.mode === "mistakes") {
      const candidates = Object.values(progress.mistakes).filter((item) => item.category === category && activeCategories().includes(item.category) && mistakeIsEligible(item));
      return candidates.length ? weightedPick(candidates.map((item) => ({ value: item.sourceId, weight: item.misses || 1 }))) : null;
    }
    const dueIndex = progress.reviewQueue.findIndex((item) => item.category === category && item.due <= progress.today.answered);
    if (dueIndex >= 0 && Math.random() < 0.65) return progress.reviewQueue.splice(dueIndex, 1)[0].sourceId;
    return null;
  }

  function eligibleNouns(category) {
    if (category === "Gender") return DATA.nouns.filter((noun) => noun.genderQuestion !== false);
    if (category === "Vocabulary") return DATA.nouns.filter((noun) => noun.vocabularyEligible !== false);
    return DATA.nouns;
  }

  function hasAmbiguousArticleSurface(word) {
    const articles = new Set();
    DATA.nouns.forEach((candidate) => {
      if (candidate.singular === word) articles.add(candidate.definiteSingular);
      if (candidate.plural === word) articles.add(candidate.definitePlural);
    });
    return articles.size > 1;
  }

  function nounDisplay(noun, plural = false, clarifyNumber = false) {
    const word = plural ? noun.plural : noun.singular;
    const qualifiers = [];
    if (noun.singular === noun.plural || (clarifyNumber && hasAmbiguousArticleSurface(word))) qualifiers.push(plural ? "plural" : "singular");
    if (noun.context) qualifiers.push(noun.context);
    return qualifiers.length ? `${word} (${qualifiers.join(", ")})` : word;
  }

  function phraseDisplay(noun, plural = false, article = null) {
    const phrase = articlePhrase(article || (plural ? noun.definitePlural : noun.definiteSingular), plural ? noun.plural : noun.singular);
    return noun.context ? `${phrase} (${noun.context})` : phrase;
  }

  function withoutRecentNouns(pool) {
    if (!session?.recentNouns?.length || pool.length <= 10) return pool;
    const recent = new Set(session.recentNouns.slice(-10));
    const fresh = pool.filter((noun) => !recent.has(noun.singular.toLocaleLowerCase("it-IT")));
    return fresh.length ? fresh : pool;
  }

  function pickNoun(preferred, category) {
    const pool = eligibleNouns(category);
    const requested = pool.find((noun) => noun.id === preferred);
    if (requested) return requested;
    return random(withoutRecentNouns(pool));
  }

  function pickDefiniteTarget(preferred) {
    const pool = eligibleNouns("Definite Articles");
    const requested = pool.find((noun) => noun.id === preferred);
    if (requested) {
      const plural = Math.random() < 0.45;
      return { noun: requested, plural, article: plural ? requested.definitePlural : requested.definiteSingular };
    }
    const variedPool = withoutRecentNouns(pool);
    const targets = variedPool.flatMap((noun) => [
      { noun, plural: false, article: noun.definiteSingular },
      { noun, plural: true, article: noun.definitePlural }
    ]);
    const articles = [...new Set(targets.map((target) => target.article))];
    const article = weightedPick(articles.map((value) => ({
      value,
      weight: (ARTICLE_WEIGHTS[value] || 1) / (1 + ((session.articleCounts[value] || 0) * 0.7))
    })));
    return random(targets.filter((target) => target.article === article));
  }

  function rememberNounQuestion(question) {
    if (!question.nounKey) return;
    session.recentNouns = [...session.recentNouns.slice(-9), question.nounKey];
    if (question.articlePattern) session.articleCounts[question.articlePattern] = (session.articleCounts[question.articlePattern] || 0) + 1;
  }

  function nounRule(noun) {
    if (noun.singular === noun.plural) return "This noun keeps the same form in singular and plural; the article shows the number.";
    if (["problema", "programma"].includes(noun.singular)) return `${titleCase(noun.singular)} is masculine despite ending in -a.`;
    if (noun.singular.endsWith("ca")) return "Feminine nouns ending in -ca usually change to -che in the plural.";
    if (noun.singular.endsWith("ga")) return "Nouns ending in -ga usually keep the hard sound with -ghe in the plural.";
    if (noun.singular.endsWith("zione")) return "Words ending in -zione are commonly feminine and take -zioni in the plural.";
    if (noun.gender === "feminine" && noun.singular.endsWith("a")) return "Most feminine nouns ending in -a change to -e.";
    if (noun.gender === "masculine" && noun.singular.endsWith("o")) return "Most masculine nouns ending in -o change to -i.";
    if (noun.singular.endsWith("e")) return "Many nouns ending in -e change to -i in the plural.";
    return "The article and noun form must agree in gender and number.";
  }

  function articleRule(noun, kind, plural = false) {
    if (kind === "indefinite") {
      if (noun.indefinite === "uno") return `${titleCase(noun.singular)} is masculine and begins with s + consonant or z, so use uno.`;
      if (noun.indefinite === "un'") return `${titleCase(noun.singular)} is feminine and begins with a vowel, so use un'.`;
      if (noun.indefinite === "un") return noun.singular.match(/^[aeiouàèéìòóù]/i) ? "Masculine vowel words use un without an apostrophe." : "Most masculine nouns use un.";
      return "Feminine nouns beginning with a consonant use una.";
    }
    if (plural) {
      if (noun.definitePlural === "gli") return "Masculine lo and l' become gli in the plural.";
      if (noun.definitePlural === "le") return "Feminine la and l' become le in the plural.";
      return "Masculine il becomes i in the plural.";
    }
    if (noun.definiteSingular === "lo") return `${titleCase(noun.singular)} is masculine and begins with s + consonant or z, so use lo.`;
    if (noun.definiteSingular === "l'") return `${titleCase(noun.singular)} begins with a vowel, so the definite article contracts to l'.`;
    return noun.gender === "feminine" ? "Feminine singular nouns beginning with a consonant use la." : "Most masculine singular nouns use il.";
  }

  function questionBase(category, sourceId, id, kicker, display, answer, explanation, distractors = []) {
    return { category, sourceId, id, kicker, display, answer, accepted: [answer], explanation, distractors };
  }

  function nounFormDistractors(noun, toPlural) {
    const source = toPlural ? noun.singular : noun.plural;
    const stem = source.slice(0, -1);
    const endings = toPlural ? ["i", "e", "a", "o"] : ["o", "a", "e", "i"];
    return [source, ...endings.map((ending) => `${stem}${ending}`), toPlural ? `${noun.singular}s` : noun.plural]
      .filter((word) => normalize(word) !== normalize(toPlural ? noun.plural : noun.singular));
  }

  function translationAnswers(answer) {
    const options = [answer];
    if (answer.includes(" / ")) options.push(...answer.split(" / "));
    const withoutNote = answer.replace(/\s*\([^)]*\)\s*/g, "").trim();
    if (withoutNote && withoutNote !== answer) options.push(withoutNote);
    const withoutTerminalPunctuation = answer.replace(/[.!?…]+$/g, "").trim();
    if (withoutTerminalPunctuation && withoutTerminalPunctuation !== answer) options.push(withoutTerminalPunctuation);
    return [...new Set(options)];
  }

  function underOneHundred(value, compounded = false) {
    if (value <= 30) {
      if (value === 3 && compounded) return "tré";
      return DATA.numbers[value];
    }
    const tensWords = { 3: "trenta", 4: "quaranta", 5: "cinquanta", 6: "sessanta", 7: "settanta", 8: "ottanta", 9: "novanta" };
    const tens = Math.floor(value / 10);
    const unit = value % 10;
    let prefix = tensWords[tens];
    if (unit === 1 || unit === 8) prefix = prefix.slice(0, -1);
    if (!unit) return prefix;
    return `${prefix}${unit === 3 ? "tré" : DATA.numbers[unit]}`;
  }

  function underOneThousand(value, compounded = false) {
    if (value < 100) return underOneHundred(value, compounded);
    const hundreds = Math.floor(value / 100);
    const remainder = value % 100;
    let prefix = hundreds === 1 ? "cento" : `${underOneHundred(hundreds)}cento`;
    if (remainder >= 80 && remainder < 90) prefix = prefix.slice(0, -1);
    return remainder ? `${prefix}${underOneHundred(remainder, true)}` : prefix;
  }

  function numberToItalian(value) {
    if (value < 1000) return underOneThousand(value);
    const thousands = Math.floor(value / 1000);
    const remainder = value % 1000;
    const prefix = thousands === 1 ? "mille" : `${underOneThousand(thousands)}mila`;
    return remainder ? `${prefix}${underOneThousand(remainder, true)}` : prefix;
  }

  function numberBounds(range) {
    return range === "mixed" ? NUMBER_RANGES[random(Object.keys(NUMBER_RANGES))] : NUMBER_RANGES[range];
  }

  function pickNumber(preferred) {
    const requested = Number(preferred);
    if (preferred !== null && preferred !== "" && Number.isInteger(requested) && requested >= 0 && requested <= 5999) return requested;
    let value = 0;
    for (let attempt = 0; attempt < 30; attempt += 1) {
      const [minimum, maximum] = numberBounds(session.numberRange);
      value = minimum + Math.floor(Math.random() * (maximum - minimum + 1));
      if (!session.recentNumbers.includes(value)) break;
    }
    return value;
  }

  function formatNumber(value) {
    return value.toLocaleString("en-US");
  }

  function numberDistractors(value, toItalian) {
    const candidates = new Set();
    const add = (candidate) => {
      if (Number.isInteger(candidate) && candidate >= 0 && candidate <= 5999 && candidate !== value) candidates.add(candidate);
    };
    [-1, 1, -10, 10, -100, 100].forEach((offset) => add(value + offset));
    if (value >= 10) add(Number(String(value).slice(0, -2) + String(value).slice(-2).split("").reverse().join("")));
    for (let distance = 2; candidates.size < 5; distance += 1) {
      add(value - distance);
      add(value + distance);
    }
    return shuffle([...candidates]).map((candidate) => toItalian ? numberToItalian(candidate) : formatNumber(candidate));
  }

  function makeQuestion(category, sourceId = null) {
    if (activeUnit === "unit2") return UNIT2.makeQuestion(category, sourceId, DATA);
    let noun = NOUN_CATEGORIES.includes(category) && category !== "Definite Articles" ? pickNoun(sourceId, category) : null;
    let q;
    switch (category) {
      case "Definite Articles": { 
        const target = pickDefiniteTarget(sourceId);
        noun = target.noun;
        q = questionBase(category, noun.id, `def:${noun.id}:${target.plural ? "p" : "s"}`, "Choose the correct definite article", `___ ${nounDisplay(noun, target.plural, true)}`, target.article, articleRule(noun, "definite", target.plural), ["il", "lo", "la", "l'", "i", "gli", "le"]);
        q.articlePattern = target.article;
        break;
      }
      case "Indefinite Articles":
        q = questionBase(category, noun.id, `indef:${noun.id}`, "Add the correct indefinite article", `___ ${nounDisplay(noun)}`, noun.indefinite, articleRule(noun, "indefinite"), ["un", "uno", "una", "un'"]);
        break;
      case "Gender":
        q = questionBase(category, noun.id, `gender:${noun.id}`, "What gender is this noun?", noun.singular, noun.gender, noun.singular === "problema" ? "Problema is masculine despite ending in -a." : `${titleCase(noun.singular)} is ${noun.gender}.`, ["masculine", "feminine"]);
        break;
      case "Singular → Plural":
        q = questionBase(category, noun.id, `plural:${noun.id}`, "Change this noun to plural", nounDisplay(noun), noun.plural, nounRule(noun), nounFormDistractors(noun, true));
        break;
      case "Plural → Singular":
        q = questionBase(category, noun.id, `singular:${noun.id}`, "Change this noun to singular", nounDisplay(noun, true), noun.singular, nounRule(noun), nounFormDistractors(noun, false));
        break;
      case "Full Transformation": { 
        const toPlural = Math.random() < 0.65;
        if (toPlural) {
          const useIndefinite = Math.random() < 0.35;
          const start = phraseDisplay(noun, false, useIndefinite ? noun.indefinite : noun.definiteSingular);
          const answer = articlePhrase(noun.definitePlural, noun.plural);
          q = questionBase(category, noun.id, `full:p:${noun.id}:${useIndefinite ? "u" : "d"}`, "Convert the whole phrase to plural", start, answer, `${articleRule(noun, "definite", true)} ${nounRule(noun)}`, transformationDistractors(noun, true));
        } else {
          q = questionBase(category, noun.id, `full:s:${noun.id}`, "Convert the whole phrase to singular", phraseDisplay(noun, true), articlePhrase(noun.definiteSingular, noun.singular), `${articleRule(noun, "definite", false)} ${nounRule(noun)}`, transformationDistractors(noun, false));
        }
        break;
      }
      case "Vocabulary": { 
        const item = pickVocabularyItem(sourceId);
        const allVocabulary = vocabularyEntries();
        const forward = Math.random() < 0.55;
        const equivalentTranslations = allVocabulary.filter((entry) => normalize(entry.english) === normalize(item.english));
        const distractors = allVocabulary
          .filter((entry) => entry.id !== item.id && (forward || normalize(entry.english) !== normalize(item.english)))
          .map((entry) => forward ? entry.english : entry.italian);
        q = questionBase(category, item.id, `vocab:${item.id}:${forward ? "en" : "it"}`, forward ? "Translate into English" : "Translate into Italian", forward ? item.italian : item.english, forward ? item.english : item.italian, `${titleCase(item.italian)} means “${item.english}.”`, distractors);
        q.accepted = forward ? translationAnswers(q.answer) : [...new Set(equivalentTranslations.flatMap((entry) => translationAnswers(entry.italian)))];
        break;
      }
      case "Subject Pronouns": { 
        const item = DATA.pronouns.find((p) => p.italian.toLowerCase() === sourceId?.toLowerCase()) || random(DATA.pronouns);
        const forward = Math.random() < 0.5;
        q = questionBase(category, item.italian, `pronoun:${item.italian}:${forward}`, forward ? "Translate the subject pronoun" : "Give the Italian subject pronoun", forward ? item.italian : item.english, forward ? item.english : item.italian, `${item.italian} means “${item.english}.”`, DATA.pronouns.filter((p) => p !== item).map((p) => forward ? p.english : p.italian));
        break;
      }
      case "Essere":
        q = verbQuestion("essere", category, sourceId);
        break;
      case "Stare":
        q = verbQuestion("stare", category, sourceId);
        break;
      case "Formal vs Informal": { 
        const registerItems = [...DATA.greetings, ...DATA.expressions].filter((entry) => ["formal", "informal"].includes(entry.register));
        const item = registerItems.find((entry) => entry.italian === sourceId) || random(registerItems);
        q = questionBase(category, item.italian, `register:${item.italian}`, "Is this formal or informal?", item.italian, item.register, `${item.italian} is ${item.register}.`, ["formal", "informal"]);
        break;
      }
      case "Greetings": { 
        const item = DATA.greetings.find((entry) => entry.italian === sourceId) || random(DATA.greetings);
        const forward = Math.random() < 0.6;
        q = questionBase(category, item.italian, `greeting:${item.italian}:${forward}`, forward ? "Translate this greeting" : "Give the Italian greeting", forward ? item.italian : item.english, forward ? item.english : item.italian, `${titleCase(item.italian)} means “${item.english}.”`, DATA.greetings.filter((g) => g !== item).map((g) => forward ? g.english : g.italian));
        q.accepted = translationAnswers(q.answer);
        break;
      }
      case "Dialogue Fill-in": {
        const item = DATA.dialogues.find((dialogue) => dialogue.id === sourceId) || random(DATA.dialogues);
        q = questionBase(category, item.id, `dialogue:${item.id}`, "Complete the dialogue", item.lines.join("\n"), item.answer, item.explanation, item.distractors);
        q.accepted = item.acceptedAnswers || [item.answer];
        q.isDialogue = true;
        break;
      }
      case "C'è / Ci sono":
        q = ciQuestion(noun);
        break;
      case "Negation": { 
        const sentences = [
          ["Sono studente.", "Non sono studente."], ["Sto bene.", "Non sto bene."],
          ["È italiano.", "Non è italiano."], ["C'è una fontana.", "Non c'è una fontana."],
          ["Ci sono due negozi.", "Non ci sono due negozi."], ["Siamo a scuola.", "Non siamo a scuola."]
        ];
        const [positive, negative] = random(sentences);
        q = questionBase(category, positive, `negation:${positive}`, "Make this sentence negative", positive, negative, "Place non directly before the conjugated verb.", sentences.filter((s) => s[0] !== positive).map((s) => s[1]));
        break;
      }
      case "Months": { 
        const month = random(DATA.months);
        const toEnglish = Math.random() < 0.5;
        q = questionBase(category, month.italian, `month:${month.italian}:${toEnglish ? "en" : "it"}`, toEnglish ? "Translate into English" : "Translate into Italian", toEnglish ? month.italian : month.english, toEnglish ? month.english : month.italian, `${titleCase(month.italian)} means ${month.english}.`, DATA.months.filter((m) => m !== month).map((m) => toEnglish ? m.english : m.italian));
        break;
      }
      case "Days of the Week": {
        const day = DATA.days.find((item) => item.italian === sourceId) || random(DATA.days);
        const toEnglish = Math.random() < 0.5;
        q = questionBase(category, day.italian, `day:${day.italian}:${toEnglish ? "en" : "it"}`, toEnglish ? "Translate into English" : "Translate into Italian", toEnglish ? day.italian : day.english, toEnglish ? day.english : day.italian, `${titleCase(day.italian)} means ${day.english}.`, DATA.days.filter((item) => item !== day).map((item) => toEnglish ? item.english : item.italian));
        break;
      }
      case "Numbers": { 
        const value = pickNumber(sourceId);
        const italian = numberToItalian(value);
        const numeral = formatNumber(value);
        const toItalian = Math.random() < 0.5;
        q = questionBase(category, String(value), `number:${value}:${toItalian}`, toItalian ? "Write this number in Italian" : "Write this number in digits", toItalian ? numeral : italian, toItalian ? italian : numeral, `${numeral} in Italian is ${italian}.`, numberDistractors(value, toItalian));
        if (!toItalian) q.accepted = [numeral, String(value), String(value).replace(/(?=(\d{3})+$)/g, " ")];
        q.numberValue = value;
        break;
      }
      default:
        return makeQuestion("Full Transformation", sourceId);
    }
    if (noun) {
      q.nounId = noun.id;
      q.nounKey = noun.singular.toLocaleLowerCase("it-IT");
    }
    q.type = "typed";
    return q;
  }

  function transformationDistractors(noun, toPlural) {
    if (toPlural) return [
      articlePhrase(noun.definiteSingular, noun.plural), articlePhrase(noun.definitePlural, noun.singular),
      articlePhrase(noun.gender === "feminine" ? "i" : "le", noun.plural)
    ];
    return [
      articlePhrase(noun.definitePlural, noun.singular), articlePhrase(noun.definiteSingular, noun.plural),
      articlePhrase(noun.gender === "feminine" ? "il" : "la", noun.singular)
    ];
  }

  function verbQuestion(verb, category, sourceId) {
    const rows = DATA.verbs[verb];
    const row = rows.find((item) => `${verb}:${item.subject}` === sourceId) || random(rows);
    const reversible = row.form !== "sono";
    const reverse = reversible && Math.random() < 0.3;
    const answer = reverse ? row.subject : row.form;
    const q = questionBase(category, `${verb}:${row.subject}`, `${verb}:${row.subject}:${reverse}`, reverse ? `Which subject goes with ${verb}?` : `Conjugate ${verb}`, reverse ? row.form : `${row.subject} + ${verb}`, answer, `${row.subject} + ${verb} → ${row.form}.`, rows.filter((r) => r !== row).map((r) => reverse ? r.subject : r.form));
    if (answer.includes("/")) q.accepted = answer.split("/").map((part) => part === "Lei" ? "Lei" : part);
    return q;
  }

  function ciQuestion(noun) {
    if (Math.random() < 0.72) {
      const plural = Math.random() < 0.5;
      const count = random(["due", "tre", "quattro"]);
      const phrase = plural ? `${count} ${noun.plural}` : articlePhrase(noun.indefinite, noun.singular);
      return questionBase("C'è / Ci sono", noun.id, `ci:${noun.id}:${plural}`, "Complete the sentence", `___ ${phrase}.`, plural ? "ci sono" : "c'è", plural ? "Use ci sono when what follows is plural." : "Use c'è when what follows is singular.", ["c'è", "ci sono"]);
    }
    const start = `C'è ${articlePhrase(noun.indefinite, noun.singular)}.`;
    const answer = `Ci sono due ${noun.plural}.`;
    return questionBase("C'è / Ci sono", noun.id, `ci:transform:${noun.id}`, "Change the sentence to plural", start, answer, `C'è becomes ci sono, and the noun must also become plural. ${nounRule(noun)}`, [`Ci sono due ${noun.singular}.`, `C'è due ${noun.plural}.`, `Ci sono due ${noun.definitePlural} ${noun.plural}.`]);
  }

  function makeChoices(question) {
    const unique = [];
    [question.answer, ...shuffle(question.distractors || [])].forEach((choice) => {
      if (choice !== undefined && choice !== null && !unique.some((value) => normalize(value) === normalize(choice))) unique.push(String(choice));
    });
    const target = question.category === "Gender" || question.category === "Formal vs Informal" || question.category === "C'è / Ci sono" || (activeUnit === "unit2" && question.category === "Piacere") ? 2 : 4;
    const fallbacks = activeUnit === "unit2" ? [] : ["il", "lo", "la", "l'", "i", "gli", "le", "un", "uno", "una", "un'"];
    for (const fallback of fallbacks) {
      if (unique.length >= target) break;
      if (!unique.some((value) => normalize(value) === normalize(fallback))) unique.push(fallback);
    }
    return shuffle(unique.slice(0, target));
  }

  function chooseQuestionType() {
    if (session.mode === "mc") return "mc";
    if (session.mode === "typed" || session.mode === "mistakes") return "typed";
    if (session.mode === "matching") return "matching";
    const roll = Math.random();
    if (!activeCategories().some((category) => matchingCategoryEligible(category, session.numberRange))) return roll < 0.53 ? "typed" : "mc";
    return roll < 0.45 ? "typed" : roll < 0.85 ? "mc" : "matching";
  }

  function nextQuestion() {
    if (!session) return;
    if (session.answered >= session.limit) { showSummary(); return; }
    session.feedbackShown = false;
    session.selectedChoice = null;
    session.matchState = null;
    $("#feedback").className = "feedback hidden";
    $("#check-answer").classList.remove("hidden");
    $("#next-question").classList.add("hidden");
    $("#keyboard-hint").classList.remove("hidden");

    const type = chooseQuestionType();
    if (type === "matching") {
      const category = pickMatchingCategory();
      session.categoryCounts[category] = (session.categoryCounts[category] || 0) + 1;
      session.current = makeMatchingQuestion(category);
    } else {
      let question;
      let category;
      for (let attempt = 0; attempt < 12; attempt += 1) {
        category = pickCategory();
        question = makeQuestion(category, preferredSource(category));
        const recentlySeen = activeUnit === "unit2" ? session.recentSources.includes(question.sourceId) : session.recentIds.includes(question.id);
        if (session.mode === "mistakes" || !recentlySeen || attempt === 11) break;
      }
      session.categoryCounts[category] = (session.categoryCounts[category] || 0) + 1;
      question.type = type;
      if (type === "mc") question.choices = makeChoices(question);
      session.current = question;
      session.recentIds = [...session.recentIds.slice(-4), question.id];
      session.recentSources = [...session.recentSources.slice(-9), question.sourceId];
      rememberNounQuestion(question);
      if (Number.isInteger(question.numberValue)) session.recentNumbers = [...session.recentNumbers.slice(-19), question.numberValue];
    }
    renderQuestion();
  }

  function renderQuestion() {
    const q = session.current;
    $("#question-number").textContent = session.limit === Infinity ? `Question ${session.answered + 1}` : `Question ${session.answered + 1} of ${session.limit}`;
    $("#question-category").textContent = q.category;
    $("#study-score").textContent = `Score: ${session.correct} / ${session.answered}`;
    $("#progress-bar").style.width = session.limit === Infinity ? "8%" : `${Math.min(100, (session.answered / session.limit) * 100)}%`;
    const display = q.isDialogue ? escapeHtml(q.display).replace(/\n/g, "<br>") : escapeHtml(q.display);
    $("#question-content").innerHTML = `<p class="prompt-kicker">${escapeHtml(q.kicker)}</p><h1 class="${q.isDialogue ? "dialogue-prompt" : ""}"><em>${display}</em></h1>${q.audio ? `<audio class="question-audio" controls preload="metadata" src="${escapeHtml(q.audio)}">Your browser does not support audio playback.</audio>` : ""}${q.type === "matching" ? '<p class="question-subtext">Select one item from each column to make a pair.</p>' : ""}`;
    const area = $("#answer-area");
    if (q.type === "typed") {
      area.innerHTML = '<label class="sr-only" for="typed-answer">Your answer</label><input id="typed-answer" class="typed-input" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Type your answer…">';
      $("#typed-answer").focus();
      $("#keyboard-hint").textContent = "Press Enter to check your answer";
    } else if (q.type === "mc") {
      area.innerHTML = `<div class="choice-list">${q.choices.map((choice, index) => `<button class="choice" type="button" data-choice="${escapeHtml(choice)}"><span class="choice-key">${index + 1}</span><span>${escapeHtml(choice)}</span></button>`).join("")}</div>`;
      $$(".choice").forEach((button) => button.addEventListener("click", () => selectChoice(button.dataset.choice)));
      $("#keyboard-hint").textContent = "Use keys 1–4 to choose, then Enter to check";
    } else {
      renderMatching(area, q);
      $("#check-answer").classList.add("hidden");
      $("#keyboard-hint").textContent = "Match all five pairs to continue";
    }
  }

  function selectChoice(choice) {
    if (session.feedbackShown) return;
    session.selectedChoice = choice;
    $$(".choice").forEach((button) => button.classList.toggle("selected", button.dataset.choice === choice));
  }

  function normalize(value) {
    return String(value ?? "").normalize("NFC").trim().toLocaleLowerCase("it-IT").replace(/[’‘`´]/g, "'").replace(/\s*'\s*/g, "'").replace(/\s+/g, " ");
  }

  function almostNormalize(value) {
    return normalize(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[.,!?;:'“”"-]/g, "").replace(/\s+/g, " ").trim();
  }

  function evaluateTyped(input, question) {
    const accepted = question.accepted || [question.answer];
    const numericInput = String(input).trim();
    if (/^[\d,\s]+$/.test(numericInput) && accepted.some((answer) => /^[\d,\s]+$/.test(String(answer)) && numericInput.replace(/[,\s]/g, "") === String(answer).replace(/[,\s]/g, ""))) return "correct";
    if (accepted.some((answer) => normalize(input) === normalize(answer))) return "correct";
    if (accepted.some((answer) => almostNormalize(input) === almostNormalize(answer))) return "almost";
    return "incorrect";
  }

  function checkAnswer() {
    if (!session || session.feedbackShown || session.current.type === "matching") return;
    const q = session.current;
    const userAnswer = q.type === "typed" ? $("#typed-answer").value : session.selectedChoice;
    if (!userAnswer) {
      const control = q.type === "typed" ? $("#typed-answer") : $(".choice");
      control?.focus();
      return;
    }
    let result = q.type === "mc" ? (normalize(userAnswer) === normalize(q.answer) ? "correct" : "incorrect") : evaluateTyped(userAnswer, q);
    if (settings.strictness === "exam" && result === "almost") result = "incorrect";
    session.feedbackShown = true;
    if (q.type === "typed") $("#typed-answer").disabled = true;
    if (q.type === "mc") {
      $$(".choice").forEach((button) => {
        button.disabled = true;
        if (normalize(button.dataset.choice) === normalize(q.answer)) button.classList.add("correct-choice");
        if (button.dataset.choice === userAnswer && result !== "correct") button.classList.add("wrong-choice");
      });
    }
    recordResult(q, result);
    showFeedback(result, userAnswer, q);
  }

  function showFeedback(result, userAnswer, q) {
    const feedback = $("#feedback");
    feedback.className = `feedback ${result}`;
    if (result === "correct") {
      feedback.innerHTML = `<strong>✓ Correct</strong><span>${escapeHtml(q.explanation)}</span>`;
    } else if (result === "almost") {
      feedback.innerHTML = `<strong>Almost correct.</strong><span>Your answer: ${escapeHtml(userAnswer)} · Correct answer: ${escapeHtml(q.answer)}</span><span>${escapeHtml(accentHint(userAnswer, q.answer))}</span>`;
    } else {
      feedback.innerHTML = `<strong>✗ Incorrect</strong><span>Your answer: ${escapeHtml(userAnswer)} · Correct answer: ${escapeHtml(q.answer)}</span><span>${escapeHtml(q.explanation)}</span>`;
    }
    $("#check-answer").classList.add("hidden");
    $("#next-question").classList.remove("hidden");
    $("#keyboard-hint").textContent = "Press Enter for the next question";
    $("#study-score").textContent = `Score: ${session.correct} / ${session.answered}`;
  }

  function accentHint(input, answer) {
    const a = normalize(input);
    const b = normalize(answer);
    if (a.replace(/'/g, "") === b.replace(/'/g, "")) return "Check the apostrophe.";
    if (/[àèéìòóù]/.test(b)) return "Check the accent mark.";
    return "Check the punctuation and spelling.";
  }

  function recordResult(q, result) {
    session.answered += 1;
    progress.today.answered += 1;
    const exact = result === "correct";
    if (exact) { session.correct += 1; progress.today.correct += 1; }
    if (result === "almost") { session.almost += 1; progress.today.almost += 1; }
    const categoryStats = progress.categories[q.category] || { answered: 0, correct: 0 };
    categoryStats.answered += 1;
    if (exact) categoryStats.correct += 1;
    progress.categories[q.category] = categoryStats;
    const key = `${q.category}|${q.sourceId}`;
    const item = progress.items[key] || { attempts: 0, correct: 0, misses: 0, streak: 0 };
    item.attempts += 1;
    item.lastSeen = Date.now();
    if (exact) {
      item.correct += 1;
      item.streak += 1;
      if (progress.mistakes[key]) {
        progress.mistakes[key].streak = (progress.mistakes[key].streak || 0) + 1;
        if (progress.mistakes[key].streak >= 2) delete progress.mistakes[key];
      }
    } else {
      item.misses += 1;
      item.streak = 0;
      progress.mistakes[key] = {
        key, category: q.category, sourceId: q.sourceId, label: q.display,
        misses: (progress.mistakes[key]?.misses || 0) + 1, streak: 0, lastMiss: Date.now()
      };
      progress.reviewQueue.push({ category: q.category, sourceId: q.sourceId, due: progress.today.answered + 4 });
      progress.reviewQueue = progress.reviewQueue.slice(-40);
    }
    progress.items[key] = item;
    saveProgress();
  }

  function pickMatchingCategory() {
    const eligible = activeCategories().filter((category) => matchingCategoryEligible(category, session.numberRange));
    const lowestCount = Math.min(...eligible.map((category) => session.categoryCounts[category] || 0));
    return random(eligible.filter((category) => (session.categoryCounts[category] || 0) === lowestCount));
  }

  function makeMatchingQuestion(category) {
    if (activeUnit === "unit2") return UNIT2.makeMatchingQuestion(category);
    let pairs = [];
    if (["Singular → Plural", "Plural → Singular", "Full Transformation"].includes(category)) {
      pairs = shuffle(eligibleNouns(category)).slice(0, 5).map((noun) => category === "Plural → Singular"
        ? { left: phraseDisplay(noun, true), right: articlePhrase(noun.definiteSingular, noun.singular) }
        : { left: phraseDisplay(noun), right: articlePhrase(noun.definitePlural, noun.plural) });
    } else if (category === "Vocabulary") pairs = shuffle(vocabularyEntries()).slice(0, 5).map((item) => ({ left: item.italian, right: item.english }));
    else if (category === "Subject Pronouns") pairs = shuffle(DATA.pronouns).slice(0, 5).map((item) => ({ left: item.italian, right: item.english }));
    else if (category === "Essere" || category === "Stare") pairs = shuffle(DATA.verbs[category.toLowerCase()]).slice(0, 5).map((item) => ({ left: item.subject, right: item.form }));
    else if (category === "Greetings") pairs = shuffle(DATA.greetings).slice(0, 5).map((item) => ({ left: item.italian, right: item.english }));
    else if (category === "Months") pairs = shuffle(DATA.months).slice(0, 5).map((item) => ({ left: item.italian, right: item.english }));
    else if (category === "Days of the Week") pairs = shuffle(DATA.days).slice(0, 5).map((item) => ({ left: item.english, right: item.italian }));
    else {
      const values = new Set();
      while (values.size < 5) values.add(Math.floor(Math.random() * 100));
      pairs = [...values].map((value) => ({ left: String(value), right: numberToItalian(value) }));
    }
    return { type: "matching", category, sourceId: `matching:${category}`, id: `matching:${category}:${pairs.map((p) => p.left).join("-")}`, kicker: "Match the pairs", display: category, pairs, explanation: "Review each pair once more before continuing." };
  }

  function renderMatching(area, question) {
    const pairs = question.pairs.map((pair, index) => ({ ...pair, id: `pair-${index}` }));
    session.matchState = { selectedLeft: null, selectedRight: null, matched: new Set(), mismatches: 0, pairs };
    const right = shuffle(pairs);
    area.innerHTML = `<div class="matching-board"><div class="match-column"><small>From</small>${pairs.map((pair) => `<button class="match-item" data-side="left" data-id="${pair.id}" type="button">${escapeHtml(pair.left)}</button>`).join("")}</div><div class="match-column"><small>To</small>${right.map((pair) => `<button class="match-item" data-side="right" data-id="${pair.id}" type="button">${escapeHtml(pair.right)}</button>`).join("")}</div></div>`;
    $$(".match-item").forEach((button) => button.addEventListener("click", () => selectMatch(button)));
  }

  function selectMatch(button) {
    const match = session.matchState;
    if (!match || button.disabled) return;
    const side = button.dataset.side;
    const prior = match[side === "left" ? "selectedLeft" : "selectedRight"];
    if (prior) $(`.match-item[data-side="${side}"][data-id="${prior}"]`)?.classList.remove("selected");
    match[side === "left" ? "selectedLeft" : "selectedRight"] = button.dataset.id;
    button.classList.add("selected");
    if (!match.selectedLeft || !match.selectedRight) return;
    const leftButton = $(`.match-item[data-side="left"][data-id="${match.selectedLeft}"]`);
    const rightButton = $(`.match-item[data-side="right"][data-id="${match.selectedRight}"]`);
    if (match.selectedLeft === match.selectedRight) {
      [leftButton, rightButton].forEach((item) => { item.classList.remove("selected"); item.classList.add("matched"); item.disabled = true; });
      match.matched.add(match.selectedLeft);
    } else {
      match.mismatches += 1;
      [leftButton, rightButton].forEach((item) => { item.classList.remove("selected"); item.classList.add("shake"); setTimeout(() => item.classList.remove("shake"), 550); });
    }
    match.selectedLeft = null;
    match.selectedRight = null;
    if (match.matched.size === match.pairs.length) finishMatching();
  }

  function finishMatching() {
    const q = session.current;
    const result = session.matchState.mismatches === 0 ? "correct" : "incorrect";
    session.feedbackShown = true;
    recordResult(q, result);
    const feedback = $("#feedback");
    feedback.className = `feedback ${result}`;
    feedback.innerHTML = result === "correct"
      ? `<strong>✓ Perfect round</strong><span>All ${session.matchState.pairs.length} ${session.matchState.pairs.length === 1 ? "pair" : "pairs"} matched.</span>`
      : `<strong>Round complete</strong><span>You made ${session.matchState.mismatches} incorrect ${session.matchState.mismatches === 1 ? "match" : "matches"}. ${escapeHtml(q.explanation)}</span>`;
    $("#next-question").classList.remove("hidden");
    $("#keyboard-hint").textContent = "Press Enter for the next question";
    $("#study-score").textContent = `Score: ${session.correct} / ${session.answered}`;
  }

  function showSummary() {
    const percent = session.answered ? Math.round((session.correct / session.answered) * 100) : 0;
    $("#summary-score").textContent = `${session.correct} / ${session.answered}`;
    $("#summary-accuracy").textContent = `${percent}%`;
    $("#summary-copy").textContent = session.almost ? `You finished with ${session.almost} almost-correct ${session.almost === 1 ? "answer" : "answers"}. Keep the endings sharp.` : "You finished your practice session. A little repetition goes a long way.";
    showView("summary");
  }

  function bindEvents() {
    $$('[data-unit]').forEach((button) => button.addEventListener("click", () => switchUnit(button.dataset.unit)));
    $$("[data-mode]").forEach((button) => button.addEventListener("click", () => startSession(button.dataset.mode)));
    $$("[data-method]").forEach((button) => button.addEventListener("click", () => selectMethod(button.dataset.method)));
    $("#start-practice").addEventListener("click", () => startSession(settings.method));
    $("#check-answer").addEventListener("click", checkAnswer);
    $("#next-question").addEventListener("click", nextQuestion);
    $("#brand-home").addEventListener("click", goHome);
    $("#study-home").addEventListener("click", goHome);
    $("#summary-home").addEventListener("click", goHome);
    $("#practice-again").addEventListener("click", () => startSession(session?.mode || "mixed"));
    $("#open-practice-test").addEventListener("click", () => startPracticeTest());
    $("#open-classroom-picture").addEventListener("click", startPicturePractice);
    $("#picture-home").addEventListener("click", goHome);
    $("#check-picture-answers").addEventListener("click", checkPictureAnswers);
    $("#new-picture-round").addEventListener("click", startPicturePractice);
    $("#picture-answer-form").addEventListener("submit", (event) => event.preventDefault());
    $("#practice-test-home").addEventListener("click", goHome);
    $("#practice-test-form").addEventListener("submit", (event) => event.preventDefault());
    $("#submit-practice-test").addEventListener("click", submitPracticeTest);
    $("#view-vocabulary").addEventListener("click", openVocabulary);
    $("#vocabulary-home").addEventListener("click", goHome);
    $("#vocabulary-search").addEventListener("input", () => renderVocabulary(new Set()));
    $("#vocabulary-sort").addEventListener("change", () => renderVocabulary(new Set()));
    $("#vocabulary-filters").addEventListener("click", (event) => {
      const button = event.target.closest("[data-vocabulary-filter]");
      if (!button) return;
      vocabularyFilter = button.dataset.vocabularyFilter;
      renderVocabulary(new Set());
    });
    $("#show-all-vocabulary").addEventListener("click", () => renderVocabulary(true));
    $("#hide-all-vocabulary").addEventListener("click", () => renderVocabulary(new Set()));
    $("#clear-progress").addEventListener("click", () => {
      progress.today = { answered: 0, correct: 0, almost: 0 };
      saveProgress();
      renderHomeStats();
    });
    $("#clear-mistakes").addEventListener("click", () => {
      progress.mistakes = {};
      progress.reviewQueue = [];
      Object.values(progress.items).forEach((item) => { item.misses = 0; item.streak = 0; });
      saveProgress();
      renderHomeStats();
    });
    $("#select-all").addEventListener("click", () => setTopics(allTopics()));
    $("#clear-all").addEventListener("click", () => setTopics([]));
    $("#preset-row").addEventListener("click", (event) => {
      const button = event.target.closest("[data-preset]");
      if (button) setTopics(presets()[button.dataset.preset]);
    });
    $("#topic-groups").addEventListener("change", (event) => {
      if (!event.target.matches("input")) return;
      $$("#topic-groups input").filter((input) => input.value === event.target.value).forEach((input) => { input.checked = event.target.checked; });
      syncSettings();
    });
    $$("#emphasis, #question-count, #strictness, #number-range").forEach((control) => control.addEventListener("change", syncSettings));
    document.addEventListener("keydown", (event) => {
      if (!session || $("#study-view").classList.contains("hidden")) return;
      if (session.current?.type === "mc" && !session.feedbackShown && ["1", "2", "3", "4"].includes(event.key)) {
        const button = $$(".choice")[Number(event.key) - 1];
        if (button) { event.preventDefault(); selectChoice(button.dataset.choice); }
      }
      if (event.key === "Enter" && session.current?.type !== "matching") {
        event.preventDefault();
        session.feedbackShown ? nextQuestion() : checkAnswer();
      } else if (event.key === "Enter" && session.feedbackShown) {
        event.preventDefault(); nextQuestion();
      }
    });
  }

  initSettings();
  bindEvents();
  renderHomeStats();
  saveProgress();
})();
