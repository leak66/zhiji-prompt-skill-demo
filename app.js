const dimensionLabels = {
  task_decomposition: "任务拆解",
  need_expression: "需求表达",
  prompt_structuring: "提示组织",
  verification: "结果验证",
  tool_orchestration: "工具组合",
  workflow_accumulation: "流程沉淀"
};

const divideDefinitions = {
  access: {
    label: "工具接入",
    keys: ["tool_orchestration", "need_expression"],
    description: "能不能顺利使用 AI 工具，并把真实需求放进合适的工作环境。"
  },
  knowledge: {
    label: "理解表达",
    keys: ["need_expression", "prompt_structuring"],
    description: "能不能把想法说清楚，用结构、样例和限制减少 AI 误解。"
  },
  application: {
    label: "落地应用",
    keys: ["task_decomposition", "verification", "workflow_accumulation"],
    description: "能不能把 AI 输出变成真实结果，并验证、复用和迭代。"
  }
};

const questions = [
  {
    id: "q1",
    dimension: "task_decomposition",
    stem: "你拿到一个模糊目标时，通常怎么开始让 AI 帮忙？",
    help: "例如：想写东西、做方案、学习新知识、整理资料或完成一个复杂任务。",
    options: [
      ["a", "直接让 AI 给完整答案，之后再看能不能用。", 28],
      ["b", "先描述背景，再让 AI 给几个方向。", 56],
      ["c", "先拆任务、约束和交付物，再让 AI 补方案。", 86],
      ["d", "先定义验收标准，再让 AI 反推路径和资源。", 96]
    ]
  },
  {
    id: "q2",
    dimension: "need_expression",
    stem: "你写提示词时，最常提供哪些信息？",
    help: "选最接近你真实习惯的一项。",
    options: [
      ["a", "只写我要什么。", 25],
      ["b", "会写目标和背景。", 58],
      ["c", "会补充受众、语气、格式和限制。", 82],
      ["d", "会提供样例、反例、评价标准和迭代要求。", 96]
    ]
  },
  {
    id: "q3",
    dimension: "prompt_structuring",
    stem: "当 AI 第一次输出不理想时，你通常怎么调整？",
    help: "这题关注你是否能把交互变成稳定结构。",
    options: [
      ["a", "换一种问法，直到它答得差不多。", 34],
      ["b", "指出哪里不对，让它重写。", 60],
      ["c", "补充缺失信息，并要求它按固定结构重写。", 82],
      ["d", "把失败原因整理成模板，下次直接复用。", 94]
    ]
  },
  {
    id: "q4",
    dimension: "verification",
    stem: "你如何判断 AI 输出可以交付？",
    help: "重点不是是否相信 AI，而是你有没有检查体系。",
    options: [
      ["a", "读起来顺就先用。", 22],
      ["b", "自己快速看一遍明显错误。", 52],
      ["c", "对照目标、事实来源和格式逐项检查。", 82],
      ["d", "建立检查清单，并让 AI 和自己分别复核。", 96]
    ]
  },
  {
    id: "q5",
    dimension: "tool_orchestration",
    stem: "遇到复杂任务时，你会如何组合 AI 与其他工具？",
    help: "例如搜索资料、整理表格、做大纲、写文案、做展示或检查结果。",
    options: [
      ["a", "主要在一个聊天窗口完成。", 30],
      ["b", "需要时会把结果复制到其他工具。", 55],
      ["c", "会按阶段选择搜索、表格、页面生成或设计工具。", 80],
      ["d", "会设计一条工作路线，并记录每个环节的输入输出。", 95]
    ]
  },
  {
    id: "q6",
    dimension: "workflow_accumulation",
    stem: "一个任务做完后，你会怎么处理有效方法？",
    help: "这题决定知技是否应该给你更强的 Library 建议。",
    options: [
      ["a", "基本不保存，下次重新问。", 24],
      ["b", "偶尔保存好用的提示词。", 54],
      ["c", "会整理成模板或 checklist。", 82],
      ["d", "会沉淀为可复用提示词模板，并持续版本更新。", 96]
    ]
  },
  {
    id: "q7",
    dimension: "verification",
    stem: "如果你要靠 AI 连续推进一个任务，最担心什么？",
    help: "这里会影响后续提示词里的检查、追问和迭代提醒。",
    options: [
      ["a", "不知道从哪里开始。", 42],
      ["b", "怕 AI 给我一堆看起来有用但用不上的内容。", 58],
      ["c", "怕第一版还行，但后续不知道怎么改。", 84],
      ["d", "怕没有清楚的步骤、追问方式和验收标准。", 92]
    ]
  },
  {
    id: "q8",
    dimension: "workflow_accumulation",
    stem: "你希望 AI 最终帮你沉淀成什么？",
    help: "这会作为 Prompt 工作台的默认输出偏好。",
    options: [
      ["a", "一段可直接复制的答案。", 38],
      ["b", "一份清晰的大纲。", 58],
      ["c", "一套带步骤和检查项的提示词方案。", 84],
      ["d", "一张可复用 Skill Card 和 Prompt Pack。", 96]
    ]
  }
];

const defaults = {
  route: "home",
  questionIndex: 0,
  answers: {},
  openAnswers: {},
  passport: null,
  sop: null,
  skill: null,
  library: []
};

const state = loadState();
normalizeLegacyState(state);
saveState();

function loadState() {
  try {
    return { ...defaults, ...JSON.parse(localStorage.getItem("zhiji-state") || "{}") };
  } catch {
    return { ...defaults };
  }
}

function normalizeLegacyState(currentState) {
  const scenarioMap = {
    "Vibecoding App": "澄清一个模糊想法",
    "功能原型": "生成第一版内容",
    "代码修复": "检查和优化结果",
    "UI 打磨": "检查和优化结果",
    "自动化脚本": "沉淀成个人模板",
    "从想法做成 App": "澄清一个模糊想法",
    "给现有页面加功能": "拆解一个复杂任务",
    "修复报错或 Bug": "检查和优化结果",
    "做一个自动化流程": "沉淀成个人模板",
    "把选题做成小工具": "澄清一个模糊想法",
    "整理资料和案例": "拆解一个复杂任务",
    "做一个展示页面": "生成第一版内容",
    "设计问卷或测评": "生成第一版内容",
    "做写作与运营助手": "设计追问和迭代",
    "整理成可复用 SOP": "沉淀成个人模板"
  };
  if (currentState.sop?.scenario && scenarioMap[currentState.sop.scenario]) {
    currentState.sop.scenario = scenarioMap[currentState.sop.scenario];
    currentState.sop.title = `${currentState.sop.scenario} 提示词方案`;
  }
  if (currentState.skill?.scenario && scenarioMap[currentState.skill.scenario]) {
    const oldScenario = currentState.skill.scenario;
    currentState.skill.scenario = scenarioMap[currentState.skill.scenario];
    currentState.skill.title = `${currentState.skill.scenario}：${trimText(currentState.skill.title.split("：").pop() || currentState.sop?.goal || "AI 使用目标", 18)}`;
    currentState.skill.recommendedPrompt = currentState.skill.recommendedPrompt?.replaceAll(oldScenario, currentState.skill.scenario);
    currentState.skill.tags = currentState.skill.tags?.map((tag) => scenarioMap[tag] || tag) || [];
  }
  if (currentState.skill?.recommendedPrompt) {
    currentState.skill.recommendedPrompt = replaceLegacyScenarioText(currentState.skill.recommendedPrompt, scenarioMap);
  }
  if (Array.isArray(currentState.library)) {
    currentState.library = currentState.library.map((item) => {
      if (!scenarioMap[item.scenario]) {
        return {
          ...item,
          recommendedPrompt: replaceLegacyScenarioText(item.recommendedPrompt, scenarioMap),
          tags: item.tags?.map((tag) => scenarioMap[tag] || tag) || []
        };
      }
      const oldScenario = item.scenario;
      const scenario = scenarioMap[item.scenario];
      return {
        ...item,
        scenario,
        title: `${scenario}：${trimText(item.title.split("：").pop() || currentState.sop?.goal || "AI 使用目标", 18)}`,
        recommendedPrompt: item.recommendedPrompt?.replaceAll(oldScenario, scenario),
        tags: item.tags?.map((tag) => scenarioMap[tag] || tag) || []
      };
    });
  }
}

function replaceLegacyScenarioText(text, scenarioMap) {
  return Object.entries(scenarioMap).reduce((result, [oldText, nextText]) => {
    return result?.replaceAll(oldText, nextText);
  }, text);
}

function saveState() {
  localStorage.setItem("zhiji-state", JSON.stringify(state));
}

function $(selector) {
  return document.querySelector(selector);
}

function $all(selector) {
  return [...document.querySelectorAll(selector)];
}

function toast(message) {
  const el = $("#toast");
  el.textContent = message;
  el.classList.add("show");
  window.clearTimeout(toast.timer);
  toast.timer = window.setTimeout(() => el.classList.remove("show"), 2600);
}

function setRoute(route) {
  state.route = route || "home";
  saveState();
  $all(".view").forEach((view) => view.classList.remove("active"));
  const view = $(`#${state.route}View`) || $("#homeView");
  view.classList.add("active");
  $("#pageTitle").textContent = view.dataset.title;
  $all("[data-route]").forEach((link) => link.classList.toggle("active", link.dataset.route === state.route));
  if (state.route === "test") renderQuestion();
  if (state.route === "passport") renderPassport();
  if (state.route === "workbench") renderWorkbench();
  if (state.route === "library") renderLibrary();
  if (state.route === "export") renderExport();
  updateNav();
}

function updateNav() {
  const passport = state.passport;
  $("#navPersona").textContent = passport ? passport.name : "未测评";
  $("#navScore").textContent = passport ? Math.round(passport.average) : "--";
  $("#homePersona").textContent = passport ? passport.name : "需求表达者";
}

function renderQuestion() {
  const q = questions[state.questionIndex];
  $("#questionProgress").textContent = `${state.questionIndex + 1}/${questions.length}`;
  $("#progressBar").style.width = `${((state.questionIndex + 1) / questions.length) * 100}%`;
  $("#questionDimension").textContent = dimensionLabels[q.dimension];
  $("#questionStem").textContent = q.stem;
  $("#questionHelp").textContent = q.help;
  $("#dimensionHint").textContent = `本题关注：${dimensionLabels[q.dimension]}。没有标准答案，选最像你平时做法的一项。`;
  $("#openAnswer").value = state.openAnswers[q.id] || "";
  $("#prevQuestion").disabled = state.questionIndex === 0;
  $("#nextQuestion").textContent = state.questionIndex === questions.length - 1 ? "提交并生成 Passport" : "下一题";
  $("#optionList").innerHTML = q.options.map(([id, label], index) => `
    <button class="option-card ${state.answers[q.id] === id ? "selected" : ""}" type="button" data-option="${id}">
      <i>${String.fromCharCode(65 + index)}</i>
      <span>${label}</span>
    </button>
  `).join("");
}

function selectOption(optionId) {
  const q = questions[state.questionIndex];
  state.answers[q.id] = optionId;
  saveState();
  renderQuestion();
}

function nextQuestion() {
  const q = questions[state.questionIndex];
  state.openAnswers[q.id] = $("#openAnswer").value.trim();
  if (!state.answers[q.id]) {
    toast("先选择一个最接近你的选项。");
    return;
  }
  if (state.questionIndex < questions.length - 1) {
    state.questionIndex += 1;
    saveState();
    renderQuestion();
    return;
  }
  state.passport = scorePassport();
  saveState();
  setRoute("passport");
  location.hash = "passport";
}

function scorePassport() {
  const scores = {};
  const counts = {};
  Object.keys(dimensionLabels).forEach((key) => {
    scores[key] = 0;
    counts[key] = 0;
  });
  questions.forEach((q) => {
    const selected = q.options.find(([id]) => id === state.answers[q.id]);
    const value = selected ? selected[2] : 40;
    scores[q.dimension] += value;
    counts[q.dimension] += 1;
  });
  Object.keys(scores).forEach((key) => {
    scores[key] = Math.round(scores[key] / Math.max(1, counts[key]));
  });
  const average = Object.values(scores).reduce((sum, value) => sum + value, 0) / Object.values(scores).length;
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const weak = [...sorted].reverse();
  const persona = average >= 86 ? "AI 共创者" : average >= 74 ? "流程组织者" : average >= 62 ? "需求表达者" : average >= 48 ? "提示词练习者" : "Vibecoding 入门者";
  const summaryMap = {
    "AI 共创者": "你已经能把 AI 用进真实任务，下一步是把有效问法固化成可复用模板。",
    "流程组织者": "你已经能组织目标和过程，下一步是让提示词更稳定、更容易复用。",
    "需求表达者": "你能表达想法，但提示组织、结果检查和流程沉淀还需要更明确的结构。",
    "提示词练习者": "你已经开始有效使用 AI，但容易停留在一次性问答，需要先建立表达、结构和检查习惯。",
    "Vibecoding 入门者": "你适合从低压力任务开始，先练习工具接入、目标表达和基础验收。"
  };
  const divideScores = calculateDivideScores(scores);
  const weakestDivide = Object.entries(divideScores).sort((a, b) => a[1] - b[1])[0][0];
  return {
    id: `passport-${Date.now()}`,
    name: persona,
    average,
    scores,
    divideScores,
    weakestDivide,
    summary: summaryMap[persona],
    strengths: sorted.slice(0, 2).map(([key]) => `${dimensionLabels[key]}相对稳定，可以作为你进入工作台的起点。`),
    gaps: weak.slice(0, 2).map(([key]) => `${dimensionLabels[key]}还偏弱，建议先加入明确检查项和复用规则。`),
    actions: [
      `优先补强「${divideDefinitions[weakestDivide].label}」里的 ${dimensionLabels[weak[0][0]]}。`,
      "把下一次任务写成可复用提示词模板，而不是只保存一段答案。",
      "每次交付前用验收清单检查事实、格式和可复现性。"
    ],
    createdAt: new Date().toISOString()
  };
}

function renderPassport() {
  if (!state.passport) {
    $("#passportPersona").textContent = "还没有画像";
    $("#passportSummary").textContent = "完成测评后，这里会展示你的能力画像、优势短板和下一步建议。";
    fillList("#strengthList", ["先完成 8 题测评。"]);
    fillList("#gapList", ["当前没有可分析数据。"]);
    fillList("#actionList", ["进入能力测试，生成第一份 Passport。"]);
    renderDivideList(null);
    drawRadar(defaultScores());
    drawShareCard(null);
    return;
  }
  if (!state.passport.divideScores) {
    state.passport.divideScores = calculateDivideScores(state.passport.scores);
    state.passport.weakestDivide = Object.entries(state.passport.divideScores).sort((a, b) => a[1] - b[1])[0][0];
    saveState();
  }
  $("#passportPersona").textContent = state.passport.name;
  $("#passportSummary").textContent = state.passport.summary;
  $("#personalPrompt").textContent = buildPersonalPrompt(state.passport);
  fillList("#strengthList", state.passport.strengths);
  fillList("#gapList", state.passport.gaps);
  fillList("#actionList", state.passport.actions);
  renderDivideList(state.passport);
  drawRadar(state.passport.scores);
  drawShareCard(state.passport);
}

function defaultScores() {
  return Object.fromEntries(Object.keys(dimensionLabels).map((key) => [key, 40]));
}

function calculateDivideScores(scores) {
  return Object.fromEntries(Object.entries(divideDefinitions).map(([key, definition]) => {
    const total = definition.keys.reduce((sum, dimension) => sum + (scores[dimension] || 0), 0);
    return [key, Math.round(total / definition.keys.length)];
  }));
}

function renderDivideList(passport) {
  const scores = passport?.divideScores || {};
  $("#divideList").innerHTML = Object.entries(divideDefinitions).map(([key, definition]) => {
    const score = scores[key] ?? 0;
    const status = score >= 76 ? "稳定" : score >= 58 ? "可提升" : "先补这里";
    return `
      <article class="divide-item">
        <strong>${definition.label}</strong>
        <div class="divide-bar"><i style="width: ${score}%"></i></div>
        <span>${score || "--"}</span>
        <p>${status} · ${definition.description}</p>
      </article>
    `;
  }).join("");
}

function buildPersonalPrompt(passport) {
  if (!passport) return "完成测评后，这里会生成你的个性化提问模板。";
  const weak = passport.weakestDivide || Object.entries(passport.divideScores || {}).sort((a, b) => a[1] - b[1])[0]?.[0] || "knowledge";
  const focus = divideDefinitions[weak]?.label || "理解表达";
  const extra = weak === "access"
    ? "请先帮我判断这个目标适合用哪些 AI 能力完成，并告诉我每一步应该提供什么材料。"
    : weak === "knowledge"
      ? "请先追问我 3 个关键信息，再把我的目标改写成更清楚、可执行的提示词。"
      : "请把输出拆成行动步骤，并附上检查清单，告诉我怎样判断结果是否可用。";
  return `我现在的 AI 使用画像是「${passport.name}」，最需要补强的是「${focus}」。我的目标是：[写下你想让 AI 帮你完成的事]。${extra} 请按「目标澄清 / 需要补充的信息 / 推荐提示词 / 下一步追问 / 验收标准」输出。`;
}

function fillList(selector, items) {
  $(selector).innerHTML = items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
}

function drawRadar(scores) {
  const canvas = $("#radarCanvas");
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const center = width / 2;
  const radius = 150;
  const keys = Object.keys(dimensionLabels);
  ctx.clearRect(0, 0, width, height);
  ctx.font = "14px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let ring = 1; ring <= 4; ring += 1) {
    drawPolygon(ctx, keys.length, center, center, radius * ring / 4, "rgba(162,168,182,.22)", false);
  }
  keys.forEach((key, index) => {
    const angle = -Math.PI / 2 + (index * Math.PI * 2 / keys.length);
    const x = center + Math.cos(angle) * (radius + 46);
    const y = center + Math.sin(angle) * (radius + 46);
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--muted");
    ctx.fillText(dimensionLabels[key], x, y);
  });
  ctx.beginPath();
  keys.forEach((key, index) => {
    const angle = -Math.PI / 2 + (index * Math.PI * 2 / keys.length);
    const value = Math.max(0, Math.min(100, scores[key] || 0)) / 100;
    const x = center + Math.cos(angle) * radius * value;
    const y = center + Math.sin(angle) * radius * value;
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fillStyle = "rgba(102,209,184,.28)";
  ctx.strokeStyle = "#66d1b8";
  ctx.lineWidth = 3;
  ctx.fill();
  ctx.stroke();
}

function drawPolygon(ctx, sides, x, y, radius, strokeStyle, fill) {
  ctx.beginPath();
  for (let index = 0; index < sides; index += 1) {
    const angle = -Math.PI / 2 + (index * Math.PI * 2 / sides);
    const px = x + Math.cos(angle) * radius;
    const py = y + Math.sin(angle) * radius;
    if (index === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = 1;
  if (fill) ctx.fill();
  ctx.stroke();
}

function drawShareCard(passport) {
  const canvas = $("#shareCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#f4f4f1";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "#20211e";
  ctx.fillRect(0, 0, width, 190);
  ctx.fillStyle = "#f1c9b8";
  roundRect(ctx, 64, 54, 82, 82, 16, true);
  ctx.fillStyle = "#20211e";
  ctx.font = "700 40px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("知", 105, 108);
  ctx.textAlign = "left";
  ctx.fillStyle = "#fffefa";
  ctx.font = "700 44px sans-serif";
  ctx.fillText("知己 - 知技 Prompt Skill", 176, 90);
  ctx.fillStyle = "#b8b2a7";
  ctx.font = "26px sans-serif";
  ctx.fillText("AI 使用目的 · 个性化提问方式总结", 176, 132);

  if (!passport) {
    ctx.fillStyle = "#20211e";
    ctx.font = "650 72px Georgia, serif";
    wrapCanvasText(ctx, "完成测评后，这里会生成你的分享图。", 80, 360, 980, 86);
    ctx.fillStyle = "#6d6d66";
    ctx.font = "30px sans-serif";
    wrapCanvasText(ctx, "它会包含工具接入、理解表达、落地应用和下一步建议。", 82, 560, 920, 44);
    return;
  }

  const average = Math.round(passport.average);
  const divideScores = passport.divideScores || calculateDivideScores(passport.scores);
  ctx.fillStyle = "#20211e";
  ctx.font = "650 88px Georgia, serif";
  wrapCanvasText(ctx, passport.name, 72, 310, 700, 100);
  ctx.fillStyle = "#c96442";
  ctx.font = "800 150px sans-serif";
  ctx.textAlign = "right";
  ctx.fillText(String(average), 1088, 390);
  ctx.font = "30px sans-serif";
  ctx.fillText("/100", 1088, 438);
  ctx.textAlign = "left";
  ctx.fillStyle = "#444740";
  ctx.font = "32px sans-serif";
  wrapCanvasTextLines(ctx, passport.summary, 76, 500, 980, 48, 2);

  ctx.fillStyle = "#20211e";
  ctx.font = "650 40px Georgia, serif";
  ctx.fillText("你现在卡在哪里", 76, 660);
  Object.entries(divideDefinitions).forEach(([key, definition], index) => {
    const y = 730 + index * 86;
    const value = divideScores[key] || 0;
    ctx.fillStyle = "#20211e";
    ctx.font = "30px sans-serif";
    ctx.fillText(definition.label, 80, y);
    ctx.fillStyle = "#d9d6cd";
    roundRect(ctx, 280, y - 26, 720, 30, 15, true);
    ctx.fillStyle = index === 0 ? "#c96442" : index === 1 ? "#2f6f68" : "#20211e";
    roundRect(ctx, 280, y - 26, 720 * value / 100, 30, 15, true);
    ctx.fillStyle = "#444740";
    ctx.font = "26px sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(String(value), 1088, y);
    ctx.textAlign = "left";
  });

  ctx.fillStyle = "#20211e";
  ctx.font = "650 34px Georgia, serif";
  ctx.fillText("六维细分", 76, 990);
  const barStartY = 1050;
  Object.entries(dimensionLabels).forEach(([key, label], index) => {
    const y = barStartY + index * 38;
    const value = passport.scores[key] || 0;
    ctx.fillStyle = "#20211e";
    ctx.font = "22px sans-serif";
    ctx.fillText(label, 78, y);
    ctx.fillStyle = "#d9d6cd";
    roundRect(ctx, 250, y - 20, 650, 18, 9, true);
    ctx.fillStyle = index % 2 ? "#2f6f68" : "#c96442";
    roundRect(ctx, 250, y - 20, 650 * value / 100, 18, 9, true);
    ctx.fillStyle = "#444740";
    ctx.font = "20px sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(String(value), 970, y);
    ctx.textAlign = "left";
  });

  drawShareSection(ctx, "优势", passport.strengths, 76, 1320);
  drawShareSection(ctx, "下一步", passport.actions, 620, 1320);
  ctx.fillStyle = "#6d6d66";
  ctx.font = "24px sans-serif";
  ctx.fillText("zhiji prompt skill · 让每一次提问更清楚、更省时间、更可复用", 76, 1558);
}

function drawShareSection(ctx, title, items, x, y) {
  ctx.fillStyle = "#20211e";
  ctx.font = "650 38px Georgia, serif";
  ctx.fillText(title, x, y);
  ctx.fillStyle = "#444740";
  ctx.font = "26px sans-serif";
  (items || []).slice(0, 2).forEach((item, index) => {
    wrapCanvasTextLines(ctx, `${index + 1}. ${item}`, x, y + 52 + index * 82, 470, 32, 2);
  });
}

function roundRect(ctx, x, y, width, height, radius, fill) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
  if (fill) ctx.fill();
  else ctx.stroke();
}

function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight) {
  const chars = String(text).split("");
  let line = "";
  let currentY = y;
  chars.forEach((char) => {
    const testLine = line + char;
    if (ctx.measureText(testLine).width > maxWidth && line) {
      ctx.fillText(line, x, currentY);
      line = char;
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  });
  if (line) ctx.fillText(line, x, currentY);
  return currentY;
}

function wrapCanvasTextLines(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
  const chars = String(text).split("");
  const lines = [];
  let line = "";
  chars.forEach((char) => {
    const testLine = line + char;
    if (ctx.measureText(testLine).width > maxWidth && line) {
      lines.push(line);
      line = char;
    } else {
      line = testLine;
    }
  });
  if (line) lines.push(line);
  const visible = lines.slice(0, maxLines);
  if (lines.length > maxLines && visible.length) {
    const last = visible.length - 1;
    while (visible[last] && ctx.measureText(`${visible[last]}...`).width > maxWidth) {
      visible[last] = visible[last].slice(0, -1);
    }
    visible[last] = `${visible[last]}...`;
  }
  visible.forEach((item, index) => ctx.fillText(item, x, y + index * lineHeight));
  return y + Math.max(0, visible.length - 1) * lineHeight;
}

function renderWorkbench() {
  if (!$("#goalInput").value) {
    $("#goalInput").value = state.sop?.goal || "我想让 AI 帮我把一个模糊想法整理成可执行方案。";
  }
  if (state.sop?.scenario) {
    $("#scenarioInput").value = state.sop.scenario;
  }
  if (state.sop?.context && !$("#contextInput").value) {
    $("#contextInput").value = state.sop.context;
  }
  if (state.sop?.format) {
    $("#formatInput").value = state.sop.format;
  }
  renderSop();
}

function generateSop() {
  const goal = $("#goalInput").value.trim();
  if (!goal) {
    toast("先写一个目标。");
    return;
  }
  const scenario = $("#scenarioInput").value;
  const format = $("#formatInput").value.trim() || "结构化交付物";
  const weak = state.passport ? weakestDimension(state.passport.scores) : "verification";
  const steps = [
    {
      title: "澄清真实目的",
      action: `把「${goal}」改写成一句清楚的 AI 使用目的：我要解决什么问题、为什么现在要做、最终要拿到什么。`,
      output: `一段 ${scenario} 目的说明`,
      checklist: ["任务对象明确", "想要的结果明确", "限制条件明确"]
    },
    {
      title: "补齐提示词要素",
      action: "把背景、受众、语气、格式、样例、限制和评价标准补齐，避免 AI 猜你的意思。",
      output: "提示词输入材料清单",
      checklist: ["背景足够", "输出格式具体", "评价标准可检查"]
    },
    {
      title: "生成最高效问法",
      action: `围绕 ${format} 生成一段可以直接复制给 AI 的完整提示词。`,
      output: "个性化主提示词",
      checklist: ["开头角色清楚", "任务步骤明确", "输出结构固定"]
    },
    {
      title: "设计追问方式",
      action: `重点补强「${dimensionLabels[weak]}」，生成 3 句追问，让 AI 继续收窄、改写或检查结果。`,
      output: "下一轮追问提示词",
      checklist: ["能继续推进", "能指出问题", "能要求替代方案"]
    },
    {
      title: "沉淀个人模板",
      action: "把本次有效问法提炼成输入材料、固定结构、检查清单和下次复用方法。",
      output: "可保存到 Library 的 Skill Card",
      checklist: ["下次可复用", "能替换变量", "有失败修正建议"]
    }
  ];
  state.sop = {
    id: `sop-${Date.now()}`,
    title: `${scenario} 提示词方案`,
    goal,
    scenario,
    format,
    context: $("#contextInput").value.trim(),
    steps,
    createdAt: new Date().toISOString()
  };
  state.skill = buildSkillFromSop(state.sop);
  saveState();
  renderSop();
  toast("个性化提示词、追问方式和 Skill Seed 已生成。");
}

function weakestDimension(scores) {
  return Object.entries(scores).sort((a, b) => a[1] - b[1])[0][0];
}

function buildSkillFromSop(sop) {
  return {
    id: `skill-${Date.now()}`,
    title: `${sop.scenario}：${trimText(sop.goal, 18)}`,
    level: state.passport?.average > 76 ? "intermediate" : "starter",
    scenario: sop.scenario,
    suitableFor: [state.passport?.name || "未测评用户", sop.format],
    steps: sop.steps.map((step) => step.title),
    recommendedPrompt: `你是我的 AI 提问教练。请基于目标「${sop.goal}」、当前目的「${sop.scenario}」和期望输出「${sop.format}」，先澄清缺失信息，再生成一段最高效的主提示词、3 句下一轮追问和一份验收清单。`,
    checklist: sop.steps.flatMap((step) => step.checklist).slice(0, 8),
    upgradePath: ["加入真实案例样例", "把检查项变成评分表", "记录失败版本并更新提示词"],
    tags: [sop.scenario, state.passport?.name || "未测评", sop.format],
    createdAt: new Date().toISOString()
  };
}

function renderSop() {
  if (!state.sop) {
    $("#sopTitle").textContent = "等待生成";
    $("#stepList").innerHTML = `<div class="step-card"><h3>先输入目的</h3><p>生成后这里会出现目的澄清、主提示词、追问方式和验收清单。</p></div>`;
    $("#promptPack").innerHTML = `<p>生成后自动得到个性化 Prompt Pack。</p>`;
    $("#skillSeed").innerHTML = `<p>生成后自动得到 Skill Seed。</p>`;
    return;
  }
  $("#sopTitle").textContent = state.sop.title;
  $("#stepList").innerHTML = state.sop.steps.map((step, index) => `
    <article class="step-card">
      <h3>${index + 1}. ${escapeHtml(step.title)}</h3>
      <p>${escapeHtml(step.action)}</p>
      <footer>
        <span class="tag">产物：${escapeHtml(step.output)}</span>
        ${step.checklist.map((item) => `<span class="tag">${escapeHtml(item)}</span>`).join("")}
      </footer>
    </article>
  `).join("");
  $("#promptPack").innerHTML = [
    state.skill.recommendedPrompt,
    "请先不要直接回答，先问我 3 个会显著影响结果质量的问题。",
    "请对你的输出做一次自检：指出最可能不准、不完整或不适合我的地方，并给出修改版。"
  ].map((prompt) => `<div class="prompt-item">${escapeHtml(prompt)}</div>`).join("");
  $("#skillSeed").innerHTML = `
    <p><strong>${escapeHtml(state.skill.title)}</strong></p>
    <p>等级：${escapeHtml(state.skill.level)} · 场景：${escapeHtml(state.skill.scenario)}</p>
    <div class="tag-row">${state.skill.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>
  `;
}

function saveSkill() {
  if (!state.skill) {
    toast("先生成一张 Skill Card。");
    return;
  }
  const item = { ...state.skill, savedAt: new Date().toISOString(), uses: 0 };
  state.library = [item, ...state.library.filter((saved) => saved.id !== item.id)];
  saveState();
  toast("已保存到 Skill Library。");
}

function renderLibrary() {
  const query = $("#librarySearch").value.trim().toLowerCase();
  const items = state.library.filter((item) => JSON.stringify(item).toLowerCase().includes(query));
  if (!items.length) {
    $("#libraryGrid").innerHTML = `
      <article class="empty-state">
        <div>
          <h3>你还没有保存的 Skill</h3>
          <p>先去 Prompt 工作台生成第一张 Skill Card，把一次有效问法沉淀成下次可复用的方法。</p>
          <a class="button primary" href="#workbench">去 Prompt 工作台生成</a>
        </div>
      </article>`;
    return;
  }
  $("#libraryGrid").innerHTML = items.map((item) => `
    <article>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.recommendedPrompt)}</p>
      <div class="tag-row">${item.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>
      <button class="button secondary full" type="button" data-load-skill="${item.id}">打开到工作台</button>
    </article>
  `).join("");
}

function loadSkill(id) {
  const item = state.library.find((saved) => saved.id === id);
  if (!item) return;
  $("#goalInput").value = item.title;
  $("#scenarioInput").value = item.scenario;
  state.skill = item;
  saveState();
  setRoute("workbench");
  location.hash = "workbench";
}

function renderExport() {
  $("#exportPreview").textContent = buildMarkdown();
}

function buildBundle() {
  return {
    passport: state.passport,
    digitalDivide: state.passport ? buildDivideExport(state.passport) : null,
    sop: state.sop,
    skill: state.skill,
    prompts: state.skill ? [
      state.skill.recommendedPrompt,
      "请把当前提示词方案压缩成 5 个可执行动作。",
      "请基于验收清单对输出打分，并给出修改建议。"
    ] : []
  };
}

function buildDivideExport(passport) {
  const divideScores = passport.divideScores || calculateDivideScores(passport.scores);
  return Object.entries(divideDefinitions).map(([key, definition]) => ({
    key,
    label: definition.label,
    score: divideScores[key],
    description: definition.description,
    dimensions: definition.keys.map((dimension) => dimensionLabels[dimension])
  }));
}

function buildMarkdown() {
  const bundle = buildBundle();
  const enabled = Object.fromEntries($all("[data-export]").map((input) => [input.dataset.export, input.checked]));
  const lines = [`# ${$("#bundleName").value || "zhiji-skill-bundle"}`, ""];
  if (enabled.passport && bundle.passport) {
    lines.push("## Skill Passport", "", `- 画像：${bundle.passport.name}`, `- 均分：${Math.round(bundle.passport.average)}`, `- 摘要：${bundle.passport.summary}`, "");
    if (bundle.digitalDivide) {
      lines.push("## 能力路径", "");
      bundle.digitalDivide.forEach((item) => {
        lines.push(`- ${item.label}：${item.score} / 100`, `  ${item.description}`);
      });
      lines.push("");
    }
  }
  if (enabled.sop && bundle.sop) {
    lines.push("## Prompt Plan", "", `目标：${bundle.sop.goal}`, "");
    bundle.sop.steps.forEach((step, index) => {
      lines.push(`### ${index + 1}. ${step.title}`, step.action, "", `产物：${step.output}`, "", "检查项：", ...step.checklist.map((item) => `- ${item}`), "");
    });
  }
  if (enabled.skill && bundle.skill) {
    lines.push("## Skill Card", "", `标题：${bundle.skill.title}`, `场景：${bundle.skill.scenario}`, `等级：${bundle.skill.level}`, "", "步骤：", ...bundle.skill.steps.map((item) => `- ${item}`), "");
  }
  if (enabled.prompt && bundle.prompts.length) {
    lines.push("## Prompt Pack", "", ...bundle.prompts.map((prompt, index) => `${index + 1}. ${prompt}`), "");
  }
  if (lines.length <= 2) {
    lines.push("还没有可导出的内容。请先完成测评并在 Prompt 工作台生成个性化提示词。");
  }
  return lines.join("\n");
}

function downloadMarkdown() {
  const name = ($("#bundleName").value || "zhiji-skill-bundle").replace(/[^\w-]+/g, "-");
  const blob = new Blob([buildMarkdown()], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${name}.md`;
  link.click();
  URL.revokeObjectURL(url);
}

function downloadShareImage() {
  if (!state.passport) {
    toast("先完成测评，再下载分享图。");
    return;
  }
  drawShareCard(state.passport);
  const link = document.createElement("a");
  link.href = $("#shareCanvas").toDataURL("image/png");
  link.download = `zhiji-passport-${Date.now()}.png`;
  link.click();
}

function resetTestProgress() {
  state.questionIndex = 0;
  state.answers = {};
  state.openAnswers = {};
  state.passport = null;
  saveState();
  setRoute("test");
  location.hash = "test";
  toast("测评进度已重新初始化。");
}

async function copyText(text, message) {
  await navigator.clipboard.writeText(text);
  toast(message);
}

function loadSample(targetRoute = "passport") {
  state.answers = Object.fromEntries(questions.map((q, index) => [q.id, q.options[Math.min(3, Math.max(1, index % 4))][0]]));
  state.openAnswers = { q8: "希望一键生成适合我目的和表达习惯的提示词、追问方式和检查清单。" };
  state.passport = scorePassport();
  state.sop = {
    id: `sop-${Date.now()}`,
    title: "澄清一个模糊想法 提示词方案",
    goal: "我想让 AI 帮我把一个模糊想法整理成可执行方案",
    scenario: "澄清一个模糊想法",
    format: "结构化方案 + 下一步行动 + 检查清单",
    context: "用户知道自己想用 AI 提升效率，但还说不清目标、背景、限制和输出标准。",
    steps: [
      { title: "澄清真实目的", action: "先把我想解决的问题、当前困惑、期望结果和限制条件问清楚。", output: "目的说明", checklist: ["目标明确", "背景明确", "限制明确"] },
      { title: "补齐提示词要素", action: "把受众、语气、格式、样例、反例和评价标准补齐。", output: "输入材料清单", checklist: ["格式具体", "标准可检查", "不让 AI 猜"] },
      { title: "生成最高效问法", action: "生成一段可直接复制的主提示词，要求 AI 先澄清、再输出、最后自检。", output: "主提示词", checklist: ["步骤明确", "输出固定", "能继续迭代"] },
      { title: "设计追问方式", action: "准备三句追问：收窄目标、改写版本、检查漏洞。", output: "追问提示词", checklist: ["能推进", "能纠错", "能复用"] }
    ],
    createdAt: new Date().toISOString()
  };
  state.skill = buildSkillFromSop(state.sop);
  state.library = [{ ...state.skill, savedAt: new Date().toISOString(), uses: 0 }];
  saveState();
  renderPassport();
  renderWorkbench();
  renderLibrary();
  renderExport();
  updateNav();
  if (targetRoute) {
    setRoute(targetRoute);
    location.hash = targetRoute;
  }
  toast("演示样例已载入，可以从结果页开始讲。");
}

function trimText(text, size) {
  return text.length > size ? `${text.slice(0, size)}...` : text;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

window.addEventListener("hashchange", () => setRoute(location.hash.replace("#", "") || "home"));
document.addEventListener("click", (event) => {
  const option = event.target.closest("[data-option]");
  if (option) selectOption(option.dataset.option);
  const load = event.target.closest("[data-load-skill]");
  if (load) loadSkill(load.dataset.loadSkill);
});

$("#prevQuestion").addEventListener("click", () => {
  if (state.questionIndex > 0) {
    state.questionIndex -= 1;
    saveState();
    renderQuestion();
  }
});
$("#nextQuestion").addEventListener("click", nextQuestion);
$("#openAnswer").addEventListener("input", () => {
  state.openAnswers[questions[state.questionIndex].id] = $("#openAnswer").value.trim();
  saveState();
});
$("#generateButton").addEventListener("click", generateSop);
$("#saveSkillButton").addEventListener("click", saveSkill);
$("#copySopButton").addEventListener("click", () => copyText(buildMarkdown(), "提示词方案已复制。"));
$("#librarySearch").addEventListener("input", renderLibrary);
$("#refreshExport").addEventListener("click", renderExport);
$all("[data-export]").forEach((input) => input.addEventListener("change", renderExport));
$("#bundleName").addEventListener("input", renderExport);
$("#downloadMarkdown").addEventListener("click", downloadMarkdown);
$("#downloadShareImage").addEventListener("click", downloadShareImage);
$("#copyJson").addEventListener("click", () => copyText(JSON.stringify(buildBundle(), null, 2), "结构化 JSON 已复制。"));
$("#copyPersonalPrompt").addEventListener("click", () => copyText(buildPersonalPrompt(state.passport), "个性化提示词已复制。"));
$("#sampleButton").addEventListener("click", () => loadSample("passport"));
$("#demoStartButton").addEventListener("click", () => loadSample("passport"));
$("#resetTestButton").addEventListener("click", resetTestProgress);
$("#themeToggle").addEventListener("click", () => {
  document.documentElement.classList.toggle("light");
  $("#themeToggle").textContent = document.documentElement.classList.contains("light") ? "○" : "●";
});

setRoute(location.hash.replace("#", "") || state.route || "home");
