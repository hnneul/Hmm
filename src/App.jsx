import React, { useMemo, useState } from "react";

const initialScenarios = {
  copy: {
    label: "연속 복붙 감지",
    address: "chatgpt.com",
    totalUses: 5,
    copyCount: 3,
    acceptRate: 62,
    panelTitle: "비판적 탐색",
    prompt: "생성형 AI가 대학 과제에 미치는 영향을 레포트 문장으로 정리해줘.",
    title: "AI 활용은 학습 효율을 높인다",
    body:
      "생성형 AI는 자료 조사와 초안 작성을 빠르게 도와 대학생의 과제 수행 효율을 높인다. 따라서 대학은 AI 활용을 금지하기보다 학습 도구로 적극 받아들일 필요가 있다.",
    popupTitle: "지금까지 AI 답변을 3번 그대로 사용했어요.",
    popupBody: "비슷한 관점의 정보만 반복될 수 있어요. 다른 관점도 한 번 확인해볼까요?",
    acceptLabel: "다른 정보 찾아보기",
    dismissLabel: "계속 사용",
    guides: [
      ["트리거", "50분 이상 하나의 생성형 AI만 사용하고, AI 답변 복붙이 누적되면 자동으로 개입합니다."],
      ["가이드", "한 관점만 반복될 때 생길 수 있는 필터 버블과 반향실 효과를 짧게 알려줍니다."],
      ["질문", "이 답변의 반대 관점은 무엇이고, 근거는 어디에서 확인할 수 있을까요?"],
    ],
  },
  summary: {
    label: "논문 요약 검증",
    address: "chatgpt.com",
    totalUses: 2,
    copyCount: 1,
    acceptRate: 84,
    panelTitle: "출처 확인",
    prompt: "이 논문을 3줄로 요약해줘.",
    title: "논문 핵심 요약",
    body:
      "이 논문은 생성형 AI가 학습 효율을 높이고 글쓰기 품질을 개선한다고 설명한다. 대학 교육은 AI 활용 능력을 평가 기준에 포함해야 한다.",
    popupTitle: "논문을 AI가 요약했어요. 그런데 잠깐.",
    popupBody: "이 요약이 맞는지 어떻게 확인할 수 있을까요? 초록만 30초 읽어보면 빠진 내용이 있는지 확인할 수 있어요.",
    acceptLabel: "초록 확인해볼게요",
    dismissLabel: "그냥 사용",
    guides: [
      ["트리거", "논문, 기사, 보고서를 단순 요약해달라는 요청을 감지하면 개입합니다."],
      ["가이드", "AI가 논문 내용을 의도치 않게 바꾸거나 중요한 제한 조건을 빠뜨릴 수 있음을 알려줍니다."],
      ["질문", "초록, 결론, 표본 수, 연구 한계를 확인했나요?"],
    ],
  },
  report: {
    label: "제출 후 성장 리포트",
    address: "university-lms.ac.kr/submit",
    totalUses: 8,
    copyCount: 6,
    acceptRate: 72,
    panelTitle: "성장 리포트",
    prompt: "레포트 제출 완료",
    title: "AI 활용 투명성 리포트가 생성됐어요",
    body:
      "오늘의 사용 기록을 바탕으로 AI 답변 검증률, 프롬프트 개선 횟수, 복붙 수정 횟수를 정리했습니다. 과제 제출 시 AI 활용 투명성 자료로 첨부할 수 있어요.",
    popupTitle: "오늘 AI 활용 리포트가 준비됐어요.",
    popupBody: "복붙 시도 6회 중 4회를 수정했고, 출처 확인 1회를 완료했어요. 이 기록은 AI 리터러시 성장 지표가 됩니다.",
    acceptLabel: "리포트 보기",
    dismissLabel: "나중에 보기",
    guides: [
      ["트리거", "학교 과제 제출 사이트 도메인을 감지하면 세션 종료 리포트를 생성합니다."],
      ["가이드", "일회성 경고가 아니라 반복 개입 후 변화한 행동 데이터를 보여줍니다."],
      ["질문", "다음 과제에서는 어떤 순간에 AI 답변을 더 적극적으로 의심해볼 수 있을까요?"],
    ],
  },
};

const scenarioOrder = ["copy", "summary", "report"];

function getMoodStage(rate) {
  if (rate > 90) return [1, "극단 긍정"];
  if (rate > 70) return [2, "활짝 웃는 표정"];
  if (rate > 40) return [3, "은은한 미소"];
  if (rate > 20) return [4, "찡그린 표정"];
  return [5, "극단 슬픔"];
}

function CopyTrail({ count }) {
  return (
    <div className="copy-trail" aria-label="복사 기록">
      {Array.from({ length: 5 }, (_, index) => (
        <span key={index} className={index < Math.min(count, 5) ? "active" : ""} />
      ))}
    </div>
  );
}

function Pet({ stage, onClick }) {
  return (
    <button className={`pet pet-stage-${stage}`} type="button" aria-label="Hmm 캐릭터" onClick={onClick}>
      <span className="pet-face">
        <span className="eye left-eye" />
        <span className="eye right-eye" />
        <span className="mouth" />
      </span>
      <span className="pet-name">Hmm</span>
    </button>
  );
}

function ReportPanel() {
  return (
    <section className="report-panel visible" aria-label="성장 리포트">
      <h3>오늘 AI 활용 리포트</h3>
      <dl>
        <div>
          <dt>총 사용시간</dt>
          <dd>95분</dd>
        </div>
        <div>
          <dt>프롬프트 개선</dt>
          <dd>2회</dd>
        </div>
        <div>
          <dt>복붙 시도</dt>
          <dd>6회 → 수정 4회</dd>
        </div>
        <div>
          <dt>출처 확인</dt>
          <dd>1회</dd>
        </div>
      </dl>
      <div className="score-box">
        <span>리터러시 점수</span>
        <strong>+24점</strong>
        <em>Lv.2 비판적 탐색자</em>
      </div>
    </section>
  );
}

export default function App() {
  const [scenarios, setScenarios] = useState(initialScenarios);
  const [activeKey, setActiveKey] = useState("copy");
  const [popupVisible, setPopupVisible] = useState(false);
  const scenario = scenarios[activeKey];
  const [stage, moodLabel] = useMemo(() => getMoodStage(scenario.acceptRate), [scenario.acceptRate]);

  const updateActiveScenario = (updater) => {
    setScenarios((current) => ({
      ...current,
      [activeKey]: updater(current[activeKey]),
    }));
    setPopupVisible(true);
  };

  const handleAccept = () => {
    updateActiveScenario((current) => ({
      ...current,
      acceptRate: Math.min(current.acceptRate + 8, 98),
      copyCount: Math.max(current.copyCount - 1, 0),
    }));
  };

  const handleDismiss = () => {
    updateActiveScenario((current) => ({
      ...current,
      acceptRate: Math.max(current.acceptRate - 16, 8),
      copyCount: Math.min(current.copyCount + 1, 5),
    }));
  };

  const selectScenario = (key) => {
    setActiveKey(key);
    setPopupVisible(false);
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-block">
          <p className="eyebrow">Chrome Extension Prototype</p>
          <h1>Hmm</h1>
          <p>AI가 답을 주는 게 아니라, 사용자가 다시 생각하게 만드는 실시간 AI 리터러시 안내자.</p>
        </div>

        <div className="status-strip" aria-label="오늘 사용 요약">
          <div>
            <strong>{scenario.totalUses}</strong>
            <span>AI 사용</span>
          </div>
          <div>
            <strong>{scenario.copyCount}</strong>
            <span>복붙 감지</span>
          </div>
          <div>
            <strong>{scenario.acceptRate}%</strong>
            <span>확인 수락률</span>
          </div>
        </div>
      </header>

      <section className="scenario-tabs" aria-label="시나리오 선택">
        {scenarioOrder.map((key) => (
          <button
            className={`scenario-tab ${activeKey === key ? "active" : ""}`}
            key={key}
            type="button"
            onClick={() => selectScenario(key)}
          >
            {scenarios[key].label}
          </button>
        ))}
      </section>

      <section className="workspace" aria-label="프로토타입 데모">
        <section className="browser-window" aria-label="가상 브라우저 화면">
          <div className="browser-chrome">
            <div className="window-dots" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <div className="address-bar">{scenario.address}</div>
          </div>

          <div className="context-bar">
            <div>
              <span>사용자</span>
              <strong>김나라 · 대학교 1학년 · 첫 전공 레포트 작성 중</strong>
            </div>
            <button className="primary-action" type="button" onClick={() => setPopupVisible(true)}>
              시나리오 실행
            </button>
          </div>

          <div className="chat-page">
            <article className="prompt-card">
              <span className="role-label">나라의 요청</span>
              <p>{scenario.prompt}</p>
            </article>

            <article className="answer-card">
              <span className="role-label">AI 답변</span>
              <h2>{scenario.title}</h2>
              <p>{scenario.body}</p>
              <CopyTrail count={scenario.copyCount} />
            </article>

            <div className="input-row">
              <span>메시지 입력</span>
              <button type="button" aria-label="전송">↗</button>
            </div>
          </div>

          <div className={`nudge-popup ${popupVisible ? "visible" : ""}`} role="dialog" aria-live="polite">
            <div className="popup-pet" aria-hidden="true">
              <span className="pet-face-mini" />
            </div>
            <div className="popup-copy">
              <strong>{scenario.popupTitle}</strong>
              <p>{scenario.popupBody}</p>
              <div className="popup-actions">
                <button id="acceptButton" type="button" onClick={handleAccept}>{scenario.acceptLabel}</button>
                <button id="dismissButton" type="button" onClick={handleDismiss}>{scenario.dismissLabel}</button>
              </div>
            </div>
          </div>

          <Pet stage={stage} onClick={() => setPopupVisible(true)} />
        </section>

        <aside className="side-panel" aria-label="AI 리터러시 안내 패널">
          <div className="panel-header">
            <p className="eyebrow">AI Literacy Guide</p>
            <h2>{scenario.panelTitle}</h2>
          </div>

          <div className="pet-meter">
            <div>
              <span>{stage}단계 · {moodLabel}</span>
              <strong>수락률 {scenario.acceptRate}%</strong>
            </div>
            <div className="meter-track">
              <span style={{ width: `${scenario.acceptRate}%` }} />
            </div>
          </div>

          <div className="guide-list">
            {scenario.guides.map(([label, text]) => (
              <article key={label}>
                <span>{label}</span>
                <p>{text}</p>
              </article>
            ))}
          </div>

          {activeKey === "report" && <ReportPanel />}
        </aside>
      </section>
    </main>
  );
}
