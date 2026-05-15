const workspace = document.querySelector(".workspace");
const nudgeBubble = document.querySelector("#nudgeBubble");
const pet = document.querySelector("#pet");
const copyTrigger = document.querySelector("#copyTrigger");
const inlineCopy = document.querySelector("#inlineCopy");
const inspectButton = document.querySelector("#inspectButton");
const ignoreButton = document.querySelector("#ignoreButton");
const closePanel = document.querySelector("#closePanel");
const resetDemo = document.querySelector("#resetDemo");
const delayOverlay = document.querySelector("#delayOverlay");
const countdownOverlay = document.querySelector("#countdownOverlay");
const countdownNumber = document.querySelector("#countdownNumber");
const petMoodText = document.querySelector("#petMoodText");
const petHint = document.querySelector("#petHint");
const interventionCount = document.querySelector("#interventionCount");
const checkedCount = document.querySelector("#checkedCount");
const ignoredCount = document.querySelector("#ignoredCount");
const levelButtons = document.querySelectorAll(".level-button");

const state = {
  level: 1,
  interventions: 0,
  checked: 0,
  ignored: 0,
  countdownTimer: null,
  lastCopyAt: 0,
};

function updateStats() {
  interventionCount.textContent = state.interventions;
  checkedCount.textContent = state.checked;
  ignoredCount.textContent = state.ignored;
}

function setPetMood(mood, title, hint) {
  pet.className = `pet ${mood}`;
  petMoodText.textContent = title;
  petHint.textContent = hint;
}

function hideNudge() {
  nudgeBubble.classList.remove("visible");
}

function showNudge() {
  nudgeBubble.classList.add("visible");
  setPetMood("pet-alert", "복붙 감지", "Hmm이 지금 딱 한 번 멈추게 만들고 있어요.");
}

function closeInsights() {
  workspace.classList.remove("panel-open");
}

function runLevelTwoIntro() {
  delayOverlay.classList.add("visible");
  setTimeout(() => {
    delayOverlay.classList.remove("visible");
    showNudge();
  }, 650);
}

function runLevelThreeIntro() {
  let current = 3;
  countdownNumber.textContent = current;
  countdownOverlay.classList.add("visible");

  clearInterval(state.countdownTimer);
  state.countdownTimer = setInterval(() => {
    current -= 1;
    countdownNumber.textContent = current;

    if (current === 0) {
      clearInterval(state.countdownTimer);
      countdownOverlay.classList.remove("visible");
      showNudge();
    }
  }, 700);
}

function triggerIntervention() {
  state.interventions += 1;
  updateStats();
  hideNudge();
  closeInsights();
  delayOverlay.classList.remove("visible");
  countdownOverlay.classList.remove("visible");

  if (state.level === 1) {
    showNudge();
  }

  if (state.level === 2) {
    runLevelTwoIntro();
  }

  if (state.level === 3) {
    runLevelThreeIntro();
  }
}

function triggerCopyIntervention() {
  const now = Date.now();

  if (now - state.lastCopyAt < 300) {
    return;
  }

  state.lastCopyAt = now;
  triggerIntervention();
}

function acceptInspection() {
  state.checked += 1;
  updateStats();
  hideNudge();
  workspace.classList.add("panel-open");
  setPetMood("pet-happy", "확인 수락", "좋아요. 판단은 사용자가 직접 하도록 옆에서 도와줍니다.");
}

function ignoreInspection() {
  state.ignored += 1;
  updateStats();
  hideNudge();
  closeInsights();

  if (state.ignored >= 3) {
    setPetMood("pet-sleep pet-sad", "오래 무시됨", "계속 무시하면 Hmm이 잠들어요.");
    return;
  }

  setPetMood("pet-sad", "다시 대기 중", "괜찮아요. 다음 복붙 순간에 다시 조용히 물어봅니다.");
}

function resetState() {
  clearInterval(state.countdownTimer);
  state.level = 1;
  state.interventions = 0;
  state.checked = 0;
  state.ignored = 0;
  updateStats();
  hideNudge();
  closeInsights();
  delayOverlay.classList.remove("visible");
  countdownOverlay.classList.remove("visible");
  setPetMood("pet-idle", "조용히 대기 중", "답변을 선택하고 Ctrl+C를 누르면 말을 겁니다.");
  levelButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.level === "1");
  });
}

levelButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.level = Number(button.dataset.level);
    levelButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    const labels = {
      1: ["LV1 선택됨", "작은 말풍선만 띄우는 가장 약한 개입입니다."],
      2: ["LV2 선택됨", "0.5초 흐름을 끊고 반대 관점이 있음을 알려줍니다."],
      3: ["LV3 선택됨", "3초 카운트다운으로 가장 강한 넛지를 보여줍니다."],
    };
    setPetMood("pet-idle", labels[state.level][0], labels[state.level][1]);
  });
});

document.addEventListener("copy", triggerCopyIntervention);
copyTrigger.addEventListener("click", triggerCopyIntervention);
inlineCopy.addEventListener("click", triggerCopyIntervention);
pet.addEventListener("click", triggerIntervention);
inspectButton.addEventListener("click", acceptInspection);
ignoreButton.addEventListener("click", ignoreInspection);
closePanel.addEventListener("click", closeInsights);
resetDemo.addEventListener("click", resetState);

updateStats();
