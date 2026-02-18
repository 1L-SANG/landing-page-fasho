import { useState, useCallback } from "react";

const STEPS = [
  {
    id: "email",
    type: "email",
    title: "이메일로 전달해드릴게요",
    desc: "누구보다 Wearless를 빠르게 체험하세요."
  },
  {
    id: "survey_invite",
    type: "survey-invite",
  },
  {
    id: "role",
    type: "select",
    label: "기본 정보",
    q: "현재 쇼핑몰 셀러이신가요?",
    options: [
      { text: "현재 셀러 활동중 (본업)" },
      { text: "현재 셀러 활동중 (부업)" },
      { text: "현재 셀러 준비중" },
      { text: "관심정도만 있음" },
    ],
  },
  {
    id: "volume",
    type: "select",
    label: "운영 현황",
    q: "일주일에 신상품을 몇 개 정도 업데이트하시나요?",
    condition: (a) => a.role <= 2,
    options: [
      { text: "1~3개" },
      { text: "4~7개" },
      { text: "8~15개" },
      { text: "16~30개" },
      { text: "31개~50개" },
    ],
  },
  {
    id: "model_role",
    type: "select",
    label: "운영 현황",
    q: "피팅모델은 누가 하나요?",
    condition: (a) => a.role <= 2,
    options: [
      { text: "직접 한다" },
      { text: "직접 하지만 얼굴노출을 최소화한다" },
      { text: "직원이 한다" },
      { text: "외주를 맡긴다" },
    ],
  },
  {
    id: "photo_edit_method",
    type: "split-select",
    label: "운영 현황",
    q: "촬영과 보정은 각각 누가 하나요?",
    condition: (a) => a.role <= 2,
    leftLabel: "촬영",
    rightLabel: "보정",
    options: [
      { text: "직접함" },
      { text: "직원" },
      { text: "외주" },
    ],
  },
  {
    id: "features",
    type: "multi-select",
    label: "니즈 파악",
    q: "가장 필요한 기능을 선택해주세요.",
    qHighlight: "(최대 2개)",
    sub: "학습한 내용은 다른사람이 사용불가합니다.",
    condition: (a) => a.role <= 2,
    maxSelect: 2,
    gridLayout: true,
    options: [
      { text: "레퍼런스 응용", sub: "레퍼런스 무드로 새 컷 생성" },
      { text: "쇼핑몰 정체성 유지", sub: "쇼핑몰 톤앤매너 반영한 이미지 생성" },
      { text: "체형 조절", sub: "설정한 체형 기준에 맞춰서 이미지 재생성" },
      { text: "이미지 다양화", sub: "포즈, 배경을 바꾸어 컷을 다양화" },
      { text: "인페인팅", sub: "특정 부분만을 선택하여 디테일하게 수정" },
      { text: "AI모델", sub: "AI모델, 기존모델의 얼굴감 자연스레 적용" },
    ],
  },
  {
    id: "cut_type",
    type: "image-select",
    label: "니즈 파악",
    q: "어떠한 의류컷 위주로 생성하실 거 같나요?",
    condition: (a) => a.role <= 2,
    options: [
      { text: "얼굴이 나오는 컷 위주", image: "face" },
      { text: "얼굴이 나오지 않는 컷 위주", image: "noface" },
    ],
  },
  {
    id: "usage_type",
    type: "select",
    label: "니즈 파악",
    q: "어떻게 주로 쓰실거 같나요?",
    condition: (a) => a.role <= 2,
    options: [
      { text: "기존 촬영컷 활용하여 생성" },
      { text: "의류사진 + 레퍼런스로 새롭게 생성" },
    ],
  },
  {
    id: "ai_exp",
    type: "select",
    label: "서비스 경험",
    q: "다른 AI 이미지 생성 서비스를 써보신 적 있나요?",
    condition: (a) => a.role <= 2,
    options: [
      { text: "네, 써봤습니다" },
      { text: "아니요, 처음입니다" },
    ],
  },
  {
    id: "ai_name",
    type: "input",
    label: "서비스 경험",
    q: "사용해 보신 서비스 이름을 알려주세요.",
    placeholder: "",
    btnText: "다음",
    skipText: "건너뛰기",
    optional: true,
    requireForNext: true,
    condition: (a) => a.role <= 2 && a.ai_exp === 0,
  },
  {
    id: "ai_pain",
    type: "multi-select",
    label: "서비스 경험",
    q: "기존 AI 서비스에서 불만족스러웠던 부분은?",
    qHighlight: "(최대 2개)",
    condition: (a) => a.role <= 2 && a.ai_exp === 0,
    maxSelect: 2,
    gridLayout: true,
    options: [
      { text: "인위적인 느낌이 강함", sub: "자연스러운 결과물이 나오지 않음" },
      { text: "제품의 디테일 표현이 안됨", sub: "세밀한 부분이 뭉개지거나 변형됨" },
      { text: "기존 업로드물들과 통일감이 없음", sub: "쇼핑몰에 올렸던 작업물들과 결이 다름" },
      { text: "원하는 모습 구현이 안됨", sub: "의도한 결과를 만들기 어려움" },
    ],
  },
  {
    id: "non_user_reason",
    type: "select",
    label: "서비스 경험",
    q: "아직 AI 서비스를 사용해보지 않은 이유는?",
    condition: (a) => a.role <= 2 && a.ai_exp === 1,
    options: [
      { text: "사용법이 어렵고 복잡할 것 같아서" },
      { text: "퀄리티가 별로일 것 같아서" },
      { text: "기존 촬영 방식이 익숙해서" },
      { text: "어떤 서비스가 있는지 몰라서" },
    ],
  },
  {
    id: "revenue",
    type: "select",
    label: "통계 조사",
    q: "월 평균 매출 규모는 어느 정도인가요?",
    condition: (a) => a.role <= 2,
    options: [
      { text: "100만원 미만" },
      { text: "100 ~ 500만원" },
      { text: "500 ~ 2,000만원" },
      { text: "2,000 ~ 5,000만원" },
      { text: "5,000만 ~ 1억원" },
      { text: "1억원 이상" },
    ],
  },
  {
    id: "link",
    type: "input",
    label: "추가 정보",
    q: "운영중인 쇼핑몰의 이름 또는 링크를 남겨주세요.",
    inputSub: "해당란을 작성해주시면 본인 확인 이후, 더 큰 혜택이 주어집니다!",
    placeholder: "",
    btnText: "완료",
    skipText: "건너뛰기",
    optional: true,
    requireForNext: true,
    condition: (a) => a.role <= 2,
  },
  {
    id: "done",
    type: "done",
  },
];

export default function WearlessSurveyGlass() {
  const [open, setOpen] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [email, setEmail] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [answers, setAnswers] = useState({});
  const [isCopied, setIsCopied] = useState(false);
  const [multiSelection, setMultiSelection] = useState([]);
  const [splitSelection, setSplitSelection] = useState({ left: null, right: null });
  const [cardBounce, setCardBounce] = useState(false);

  const currentStep = STEPS[stepIndex];
  const progress = Math.min((stepIndex / (STEPS.length - 1)) * 100, 100);

  const restoreStepState = (idx, currentAnswers) => {
    const step = STEPS[idx];
    const ans = currentAnswers || answers;
    if (step.type === "multi-select" && ans[step.id]) {
      setMultiSelection(ans[step.id]);
    } else {
      setMultiSelection([]);
    }
    if (step.type === "split-select" && ans[step.id]) {
      setSplitSelection(ans[step.id]);
    } else {
      setSplitSelection({ left: null, right: null });
    }
    if (step.type === "input" && ans[step.id] && ans[step.id] !== "skipped") {
      setInputValue(ans[step.id]);
    } else {
      setInputValue("");
    }
  };

  const goToNextStep = (newAnswers = answers) => {
    let nextIndex = stepIndex + 1;
    while (nextIndex < STEPS.length && STEPS[nextIndex].condition && !STEPS[nextIndex].condition(newAnswers)) {
      nextIndex++;
    }
    setStepIndex(nextIndex);
    restoreStepState(nextIndex, newAnswers);
  };

  const goBack = useCallback(() => {
    let prevIndex = stepIndex - 1;
    while (prevIndex >= 0 && STEPS[prevIndex].condition && !STEPS[prevIndex].condition(answers)) {
      prevIndex--;
    }
    if (prevIndex >= 0) {
      setStepIndex(prevIndex);
      restoreStepState(prevIndex, answers);
    }
  }, [stepIndex, answers]);

  const handleToggle = () => {
    if (open) {
      setOpen(false);
      setTimeout(() => {
        setStepIndex(0); setEmail(""); setAnswers({}); setInputValue("");
        setIsCopied(false); setMultiSelection([]); setSplitSelection({ left: null, right: null });
      }, 400);
    } else {
      setStepIndex(0); setOpen(true);
    }
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (email.trim() && email.includes("@")) {
      setCardBounce(true);
      setTimeout(() => {
        setCardBounce(false);
        goToNextStep();
      }, 350);
    }
  };

  const handleSelect = (id, idx) => {
    const na = { ...answers, [id]: idx };
    setAnswers(na);
    goToNextStep(na);
  };

  const handleInputSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const na = { ...answers, [currentStep.id]: inputValue.trim() };
    setAnswers(na);
    goToNextStep(na);
  };

  const handleInputSkip = () => {
    const na = { ...answers, [currentStep.id]: "skipped" };
    setAnswers(na);
    goToNextStep(na);
  };

  const toggleMultiSelect = (idx) => {
    if (multiSelection.includes(idx)) {
      setMultiSelection(multiSelection.filter(i => i !== idx));
    } else if (multiSelection.length < currentStep.maxSelect) {
      setMultiSelection([...multiSelection, idx]);
    }
  };

  const submitMultiSelect = () => {
    if (multiSelection.length === 0) return;
    const na = { ...answers, [currentStep.id]: multiSelection };
    setAnswers(na);
    goToNextStep(na);
  };

  const doSetSplit = (side, idx) => setSplitSelection(p => ({ ...p, [side]: idx }));

  const submitSplit = () => {
    const na = { ...answers, [currentStep.id]: splitSelection };
    setAnswers(na);
    goToNextStep(na);
  };

  const handleSurveyAccept = () => { goToNextStep(); };

  const handleSurveyDecline = () => {
    // Skip to done
    setStepIndex(STEPS.length - 1);
  };

  const getSelectGrid = (count) => {
    if (count === 2) return { gridTemplateColumns: "1fr 1fr" };
    if (count === 3) return { gridTemplateColumns: "1fr 1fr 1fr" };
    if (count === 5) return { gridTemplateColumns: "repeat(6, 1fr)" };
    if (count === 6) return { gridTemplateColumns: "1fr 1fr 1fr" };
    return { gridTemplateColumns: "1fr 1fr" };
  };

  const getOptionSpan = (count, index) => {
    if (count === 5 && index < 2) return { gridColumn: "span 3" };
    if (count === 5 && index >= 2) return { gridColumn: "span 2" };
    return {};
  };

  const glass = {
    background: "rgba(255,255,255,0.45)",
    backdropFilter: "blur(40px) saturate(1.6)",
    WebkitBackdropFilter: "blur(40px) saturate(1.6)",
    border: "1px solid rgba(255,255,255,0.5)",
    boxShadow: "0 24px 80px rgba(0,0,0,0.06), 0 1px 0 rgba(255,255,255,0.6) inset",
  };

  const isActiveStep = (t) => ["select","input","multi-select","split-select","image-select"].includes(t);

  // SVG for face-showing cut
  const FaceIcon = () => (
    <svg width="80" height="100" viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="0" width="64" height="100" rx="8" fill="#F5F5F5" stroke="#E0E0E0" strokeWidth="1"/>
      <circle cx="40" cy="26" r="12" fill="#D1D5DB"/>
      <ellipse cx="36" cy="24" rx="1.5" ry="2" fill="#9CA3AF"/>
      <ellipse cx="44" cy="24" rx="1.5" ry="2" fill="#9CA3AF"/>
      <path d="M37 29C37 29 38.5 31 40 31C41.5 31 43 29 43 29" stroke="#9CA3AF" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M30 16C30 16 33 10 40 10C47 10 50 16 50 16" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round"/>
      <rect x="22" y="42" width="36" height="52" rx="3" fill="#D1D5DB"/>
      <rect x="16" y="42" width="12" height="36" rx="3" fill="#D1D5DB"/>
      <rect x="52" y="42" width="12" height="36" rx="3" fill="#D1D5DB"/>
    </svg>
  );

  // SVG for no-face cut
  const NoFaceIcon = () => (
    <svg width="80" height="100" viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="0" width="64" height="100" rx="8" fill="#F5F5F5" stroke="#E0E0E0" strokeWidth="1"/>
      <circle cx="40" cy="10" r="8" fill="#D1D5DB" opacity="0.4"/>
      <line x1="8" y1="22" x2="72" y2="22" stroke="#E0E0E0" strokeWidth="1" strokeDasharray="3 3"/>
      <rect x="22" y="26" width="36" height="68" rx="3" fill="#D1D5DB"/>
      <rect x="16" y="26" width="12" height="46" rx="3" fill="#D1D5DB"/>
      <rect x="52" y="26" width="12" height="46" rx="3" fill="#D1D5DB"/>
    </svg>
  );

  return (
    <div style={{
      minHeight: "100vh", background: "#FAFAFA",
      fontFamily: "'Pretendard',-apple-system,BlinkMacSystemFont,sans-serif",
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden",
    }}>
      {/* Orbs */}
      <div style={{ position: "absolute", top: "42%", left: "50%", transform: "translate(-50%,-50%)", pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", width: 420, height: 420, borderRadius: "50%", background: "conic-gradient(from 0deg,#12ADE6,#4C63FC,#DC4CFC,#12ADE6)", filter: "blur(80px)", opacity: 0.16, top: "50%", left: "50%", animation: "orbA 14s ease-in-out infinite" }} />
        <div style={{ position: "absolute", width: 320, height: 320, borderRadius: "50%", background: "conic-gradient(from 120deg,#FF0080,#EE00FF,#4797FF,#FF0080)", filter: "blur(100px)", opacity: 0.11, top: "50%", left: "50%", animation: "orbB 18s ease-in-out infinite" }} />
        <div style={{ position: "absolute", width: 260, height: 260, borderRadius: "50%", background: "conic-gradient(from 240deg,#DC4CFC,#12B4E6,#fff,#DC4CFC)", filter: "blur(65px)", opacity: 0.13, top: "50%", left: "50%", animation: "orbA 12s ease-in-out infinite" }} />
        <div style={{ position: "absolute", width: 140, height: 140, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,255,255,0.85) 0%,transparent 70%)", filter: "blur(30px)", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
      </div>
      <div style={{ position: "fixed", inset: 0, opacity: 0.025, pointerEvents: "none", zIndex: 1, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />

      {/* Hero */}
      <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "40px 20px 60px", maxWidth: 600, width: "100%" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, ...glass, background: "rgba(255,255,255,0.5)", borderRadius: 9999, padding: "7px 16px 7px 12px", marginBottom: 32 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#1A1A1A", animation: "pulse 2s ease-in-out infinite", flexShrink: 0 }} />
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: "#555" }}>Private Beta Open</span>
        </div>
        <h1 style={{ fontSize: "clamp(30px,5vw,50px)", fontWeight: 800, color: "#111", lineHeight: 1.18, letterSpacing: "-0.035em", wordBreak: "keep-all" }}>
          제품 사진 하나로<br />쇼핑몰 촬영의 모든 것을<br />대체하다
        </h1>
        <p style={{ fontSize: 17, fontWeight: 400, color: "#888", marginTop: 20, lineHeight: 1.65, maxWidth: 400 }}>
          스튜디오, 모델, 조명 없이. 제품 사진만 올리면 완성됩니다.
        </p>

        <div style={{ marginTop: 36, display: "flex", flexDirection: "column", alignItems: "center", width: "100%", maxWidth: 500 }}>
          <div style={{ display: "grid", placeItems: "center", width: "100%" }}>
            {/* CTA Button */}
            <button onClick={handleToggle} style={{
              background: "#1A1A1A", color: "#fff", fontSize: 16, fontWeight: 600,
              padding: "16px 44px", borderRadius: 9999, border: "none", cursor: "pointer",
              boxShadow: "0 6px 24px rgba(0,0,0,0.15)", transition: "all 0.35s", fontFamily: "inherit",
              gridArea: "1/1", opacity: open ? 0 : 1, transform: open ? "scale(0.9)" : "scale(1)",
              pointerEvents: open ? "none" : "auto",
            }}>
              지금 시작하기 →
            </button>

            {/* Glass Card */}
            <div style={{
              width: "100%",
              background: "rgba(245,245,247,0.92)",
              backdropFilter: "blur(40px) saturate(1.6)",
              WebkitBackdropFilter: "blur(40px) saturate(1.6)",
              border: "1px solid rgba(0,0,0,0.12)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.08), 0 1px 0 rgba(255,255,255,0.5) inset",
              borderRadius: 22, overflow: "hidden", position: "relative",
              transition: "all 0.45s cubic-bezier(0.16,1,0.3,1)", willChange: "opacity, transform",
              gridArea: "1/1", opacity: open ? 1 : 0, transform: open ? (cardBounce ? "scale(0.96)" : "scale(1)") : "scale(0.96)",
              pointerEvents: open ? "auto" : "none",
            }}>
              {/* Progress */}
              <div style={{ height: 2, background: "rgba(0,0,0,0.04)" }}>
                <div style={{
                  height: "100%", background: "#1A1A1A", borderRadius: 2,
                  transition: "width 0.5s cubic-bezier(0.16,1,0.3,1)",
                  width: `${progress}%`,
                  opacity: isActiveStep(currentStep.type) ? 1 : 0,
                  ...(currentStep.type === "done" ? {
                    width: "100%",
                    background: "linear-gradient(90deg,#12ADE6,#4C63FC,#DC4CFC,#FF0080,#12B4E6)",
                    backgroundSize: "200% 100%",
                    animation: "progShimmer 2.5s linear infinite",
                  } : {}),
                }} />
              </div>

              {/* Close */}
              <button onClick={handleToggle} style={{
                position: "absolute", top: 14, right: 14, background: "transparent",
                border: "none", cursor: "pointer", padding: 6, borderRadius: 8,
                display: "flex", alignItems: "center", justifyContent: "center", zIndex: 5,
              }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 3L11 11M11 3L3 11" stroke="#999" strokeWidth="1.6" strokeLinecap="round" /></svg>
              </button>

              <div key={stepIndex} style={{ padding: "26px 26px 24px", overflow: "hidden" }}>

                {/* ── EMAIL ── */}
                {currentStep.type === "email" && (
                  <div style={{ textAlign: "center" }}>
                    <div style={{ width: 44, height: 44, borderRadius: 13, background: "#1A1A1A", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6M22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6M22 6L12 13L2 6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <p style={{ fontSize: 19, fontWeight: 700, color: "#111", marginBottom: 6, letterSpacing: "-0.02em", whiteSpace: "pre-line" }}>{currentStep.title}</p>
                    <p style={{ fontSize: 13.5, color: "#999", lineHeight: 1.6, marginBottom: 22, whiteSpace: "pre-line" }}>{currentStep.desc}</p>
                    <form onSubmit={handleEmailSubmit} style={{ width: "100%", marginTop: 24 }}>
                      <div style={{ display: "flex", gap: 6, background: "rgba(255,255,255,0.7)", border: "1.5px solid rgba(0,0,0,0.08)", borderRadius: 14, padding: 5 }}>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com"
                          style={{ flex: 1, padding: "11px 14px", border: "none", background: "transparent", fontSize: 15, outline: "none", color: "#1A1A1A", minWidth: 0, fontFamily: "inherit" }} autoFocus />
                        <button type="submit" style={{
                          padding: "11px 44px", background: "#1A1A1A", color: "#fff", border: "none",
                          borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer",
                          fontFamily: "inherit", whiteSpace: "nowrap", flexShrink: 0,
                          opacity: email.includes("@") ? 1 : 0.35, transition: "all 0.2s",
                        }}>완료</button>
                      </div>
                    </form>
                    <p style={{ fontSize: 11, color: "#bbb", marginTop: 14, textAlign: "center", lineHeight: 1.5 }}>
                      '완료' 버튼을 누르면 이후의 내용과 이메일 수집에 대해 동의함으로 간주됩니다.
                    </p>
                  </div>
                )}

                {/* ── SURVEY INVITE ── */}
                {currentStep.type === "survey-invite" && (
                  <div style={{ textAlign: "center", paddingTop: 14 }}>
                    <p style={{ fontSize: 20, fontWeight: 700, color: "#111", marginBottom: 28, letterSpacing: "-0.02em", lineHeight: 1.5 }}>
                      잠깐!{" "}
                      <span style={{
                        fontWeight: 900,
                        background: "linear-gradient(135deg, #8B7FD4, #6A9BE8, #9BB8F0)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}>Pro 플랜</span>
                      을{" "}
                      <span style={{
                        fontWeight: 900,
                        background: "linear-gradient(135deg, #8B7FD4, #6A9BE8, #9BB8F0)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}>무료</span>
                      로 써보시겠어요?
                    </p>


                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      <button onClick={handleSurveyAccept} style={{
                        width: "100%", padding: "14px 24px", background: "#1A1A1A", color: "#fff",
                        borderRadius: 14, fontSize: 15, fontWeight: 700, border: "none", cursor: "pointer",
                        fontFamily: "inherit", boxShadow: "0 4px 16px rgba(0,0,0,0.12)", transition: "all 0.2s",
                      }}>
                        1분 설문 참여하고 혜택 받기
                      </button>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 16, alignItems: "flex-start" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                        <span style={{ fontSize: 11, color: "#888", fontWeight: 500 }}>불성실한 답변은 AI 필터링으로 대상에서 제외됩니다.</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                        <span style={{ fontSize: 11, color: "#888", fontWeight: 500 }}>선착순 혜택으로, 인원이 마감되면 해당 이벤트창은 사라집니다.</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── SELECT ── */}
                {currentStep.type === "select" && (
                  <div>
                    <div style={{ marginBottom: 12 }}><span style={{ fontSize: 11, fontWeight: 700, color: "#bbb", letterSpacing: "0.12em" }}>{currentStep.label}</span></div>
                    <p style={{ fontSize: 17, fontWeight: 700, color: "#111", lineHeight: 1.4, marginBottom: 14, letterSpacing: "-0.015em", textAlign: "left" }}>{currentStep.q}</p>
                    <div style={{ display: "grid", ...getSelectGrid(currentStep.options.length), gap: 8 }}>
                      {currentStep.options.map((o, i) => (
                        <button key={i} onClick={() => handleSelect(currentStep.id, i)}
                          style={{
                            padding: "14px 10px", background: answers[currentStep.id] === i ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.55)",
                            border: answers[currentStep.id] === i ? "1.5px solid rgba(26,26,26,0.6)" : "1.5px solid rgba(0,0,0,0.06)",
                            borderRadius: 14, cursor: "pointer", transition: "all 0.2s",
                            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                            gap: 5, fontFamily: "inherit",
                            ...(answers[currentStep.id] === i ? { transform: "scale(0.97)", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" } : {}),
                            ...getOptionSpan(currentStep.options.length, i),
                          }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: "#333", lineHeight: 1.3 }}>{o.text}</span>
                        </button>
                      ))}
                    </div>
                    <button onClick={goBack} style={{ marginTop: 14, display: "inline-flex", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, color: "#bbb", fontFamily: "inherit", padding: "4px 0" }}>이전으로</button>
                  </div>
                )}

                {/* ── IMAGE SELECT ── */}
                {currentStep.type === "image-select" && (
                  <div>
                    <div style={{ marginBottom: 12 }}><span style={{ fontSize: 11, fontWeight: 700, color: "#bbb", letterSpacing: "0.12em" }}>{currentStep.label}</span></div>
                    <p style={{ fontSize: 17, fontWeight: 700, color: "#111", lineHeight: 1.4, marginBottom: 16, letterSpacing: "-0.015em", textAlign: "left" }}>{currentStep.q}</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      {currentStep.options.map((o, i) => {
                        const isSel = answers[currentStep.id] === i;
                        return (
                          <button key={i} onClick={() => handleSelect(currentStep.id, i)}
                            style={{
                              padding: "18px 10px 14px", display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
                              background: isSel ? "rgba(76,99,252,0.04)" : "rgba(255,255,255,0.55)",
                              border: isSel ? "1.5px solid #4C63FC" : "1.5px solid rgba(0,0,0,0.06)",
                              borderRadius: 16, cursor: "pointer", transition: "all 0.2s", fontFamily: "inherit",
                              ...(isSel ? { transform: "scale(0.97)", boxShadow: "0 2px 16px rgba(76,99,252,0.1)" } : {}),
                            }}>
                            <div style={{ width: 72, height: 90, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.7 }}>
                              {o.image === "face" ? <FaceIcon /> : <NoFaceIcon />}
                            </div>
                            <span style={{ fontSize: 13, fontWeight: 600, color: "#333", lineHeight: 1.3 }}>{o.text}</span>
                          </button>
                        );
                      })}
                    </div>
                    <button onClick={goBack} style={{ marginTop: 14, display: "inline-flex", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, color: "#bbb", fontFamily: "inherit", padding: "4px 0" }}>이전으로</button>
                  </div>
                )}

                {/* ── MULTI SELECT ── */}
                {currentStep.type === "multi-select" && (
                  <div>
                    <div style={{ marginBottom: 12 }}><span style={{ fontSize: 11, fontWeight: 700, color: "#bbb", letterSpacing: "0.12em" }}>{currentStep.label}</span></div>
                    <p style={{ fontSize: 17, fontWeight: 700, color: "#111", lineHeight: 1.4, marginBottom: 4, letterSpacing: "-0.015em", textAlign: "left" }}>
                      {currentStep.q}{" "}
                      {currentStep.qHighlight && (
                        <span style={{
                          background: "linear-gradient(90deg, #12ADE6, #4C63FC, #DC4CFC, #FF0080, #12ADE6)",
                          backgroundSize: "300% 100%",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                          animation: "gradText 8s linear infinite",
                          fontWeight: 600,
                        }}>{currentStep.qHighlight}</span>
                      )}
                    </p>
                    {currentStep.sub && <p style={{ fontSize: 12, color: "#666", marginBottom: 14, textAlign: "left", lineHeight: 1.5 }}>{currentStep.sub}</p>}
                    {!currentStep.sub && <div style={{ height: 10 }} />}

                    {currentStep.gridLayout ? (
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                        {currentStep.options.map((o, i) => {
                          const isSel = multiSelection.includes(i);
                          return (
                            <button key={i} onClick={() => toggleMultiSelect(i)}
                              style={{
                                padding: "14px 12px", textAlign: "center", display: "flex", flexDirection: "column", gap: 4, alignItems: "center",
                                background: isSel ? "rgba(76,99,252,0.04)" : "rgba(255,255,255,0.55)",
                                border: isSel ? "1.5px solid #4C63FC" : "1.5px solid rgba(0,0,0,0.06)",
                                borderRadius: 14, cursor: "pointer", transition: "all 0.2s", fontFamily: "inherit", position: "relative",
                              }}>
                              <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", width: "100%" }}>
                                <div style={{ fontSize: 14, fontWeight: 700, color: "#222", lineHeight: 1.35, textAlign: "center" }}>{o.text}</div>
                                <div style={{
                                  width: 20, height: 20, borderRadius: "50%",
                                  border: isSel ? "1.5px solid #4C63FC" : "1.5px solid #ddd",
                                  background: isSel ? "#4C63FC" : "transparent",
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                  fontSize: 12, color: "#fff", transition: "all 0.2s",
                                  position: "absolute", top: 12, right: 12, flexShrink: 0,
                                }}>{isSel && "✓"}</div>
                              </div>
                              <div style={{ fontSize: 11.5, color: "#555", lineHeight: 1.45, marginTop: 2, textAlign: "center" }}>{o.sub}</div>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {currentStep.options.map((o, i) => {
                          const isSel = multiSelection.includes(i);
                          return (
                            <button key={i} onClick={() => toggleMultiSelect(i)}
                              style={{
                                display: "flex", justifyContent: "space-between", alignItems: "center",
                                padding: "14px 16px",
                                background: isSel ? "rgba(76,99,252,0.04)" : "rgba(255,255,255,0.55)",
                                border: isSel ? "1.5px solid #4C63FC" : "1.5px solid rgba(0,0,0,0.06)",
                                borderRadius: 14, cursor: "pointer", transition: "all 0.2s", fontFamily: "inherit", textAlign: "left",
                              }}>
                              <div>
                                <div style={{ fontSize: 14, fontWeight: 700, color: "#222" }}>{o.text}</div>
                                {o.sub && <div style={{ fontSize: 12, color: "#666", marginTop: 3 }}>{o.sub}</div>}
                              </div>
                              <div style={{
                                width: 20, height: 20, borderRadius: "50%",
                                border: isSel ? "1.5px solid #4C63FC" : "1.5px solid #ddd",
                                background: isSel ? "#4C63FC" : "transparent",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 12, color: "#fff", transition: "all 0.2s", flexShrink: 0,
                              }}>{isSel && "✓"}</div>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20, alignItems: "center" }}>
                      <button onClick={goBack} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, color: "#bbb", fontFamily: "inherit", padding: "4px 0" }}>이전으로</button>
                      <button onClick={submitMultiSelect}
                        style={{
                          padding: "12px 24px", background: "#4C63FC", color: "#fff", borderRadius: 12,
                          fontSize: 15, fontWeight: 600, border: "none", cursor: "pointer",
                          boxShadow: "0 4px 12px rgba(76,99,252,0.2)", fontFamily: "inherit",
                          opacity: multiSelection.length > 0 ? 1 : 0.4, transition: "all 0.2s",
                        }}>
                        다음 ({multiSelection.length})
                      </button>
                    </div>
                  </div>
                )}

                {/* ── SPLIT SELECT (vertical layout) ── */}
                {currentStep.type === "split-select" && (
                  <div>
                    <div style={{ marginBottom: 12 }}><span style={{ fontSize: 11, fontWeight: 700, color: "#bbb", letterSpacing: "0.12em" }}>{currentStep.label}</span></div>
                    <p style={{ fontSize: 17, fontWeight: 700, color: "#111", lineHeight: 1.4, marginBottom: 14, letterSpacing: "-0.015em", textAlign: "left" }}>{currentStep.q}</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
                      <div style={{ background: "rgba(255,255,255,0.3)", padding: 10, borderRadius: 12 }}>
                        <div style={{ fontSize: 16, fontWeight: 700, color: "#111", textAlign: "center", marginBottom: 8 }}>{currentStep.leftLabel}</div>
                        <div style={{ display: "flex", gap: 8 }}>
                          {currentStep.options.map((o, i) => (
                            <button key={`l-${i}`} onClick={() => doSetSplit("left", i)}
                              style={{
                                flex: 1, padding: "10px 6px", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer",
                                transition: "all 0.2s", fontFamily: "inherit",
                                ...(splitSelection.left === i
                                  ? { background: "#1A1A1A", color: "#fff", border: "1px solid #1A1A1A" }
                                  : { background: "rgba(255,255,255,0.6)", color: "inherit", border: "1px solid transparent" }),
                              }}>
                              {o.text}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div style={{ background: "rgba(255,255,255,0.3)", padding: 10, borderRadius: 12 }}>
                        <div style={{ fontSize: 16, fontWeight: 700, color: "#111", textAlign: "center", marginBottom: 8 }}>{currentStep.rightLabel}</div>
                        <div style={{ display: "flex", gap: 8 }}>
                          {currentStep.options.map((o, i) => (
                            <button key={`r-${i}`} onClick={() => doSetSplit("right", i)}
                              style={{
                                flex: 1, padding: "10px 6px", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer",
                                transition: "all 0.2s", fontFamily: "inherit",
                                ...(splitSelection.right === i
                                  ? { background: "#1A1A1A", color: "#fff", border: "1px solid #1A1A1A" }
                                  : { background: "rgba(255,255,255,0.6)", color: "inherit", border: "1px solid transparent" }),
                              }}>
                              {o.text}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <button onClick={goBack} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, color: "#bbb", fontFamily: "inherit", padding: "4px 0" }}>이전으로</button>
                      <button onClick={submitSplit}
                        style={{
                          padding: "12px 24px", background: "#4C63FC", color: "#fff", borderRadius: 12,
                          fontSize: 15, fontWeight: 600, border: "none", cursor: "pointer",
                          boxShadow: "0 4px 12px rgba(76,99,252,0.2)", fontFamily: "inherit",
                          opacity: (splitSelection.left !== null && splitSelection.right !== null) ? 1 : 0.4, transition: "all 0.2s",
                        }}>
                        다음
                      </button>
                    </div>
                  </div>
                )}

                {/* ── INPUT ── */}
                {currentStep.type === "input" && (
                  <div>
                    <div style={{ marginBottom: 12 }}><span style={{ fontSize: 11, fontWeight: 700, color: "#bbb", letterSpacing: "0.12em" }}>{currentStep.label}</span></div>
                    <p style={{ fontSize: 17, fontWeight: 700, color: "#111", lineHeight: 1.4, marginBottom: 6, letterSpacing: "-0.015em", textAlign: "left" }}>{currentStep.q}</p>
                    {currentStep.inputSub && (
                      <p style={{ fontSize: 12, color: "#666", marginBottom: 14, textAlign: "left", lineHeight: 1.5 }}>{currentStep.inputSub}</p>
                    )}
                    {!currentStep.inputSub && <div style={{ height: 8 }} />}
                    <form onSubmit={handleInputSubmit}>
                      <div style={{ display: "flex", gap: 6, background: "rgba(255,255,255,0.7)", border: "1.5px solid rgba(0,0,0,0.08)", borderRadius: 14, padding: 5 }}>
                        <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)}
                          placeholder={currentStep.placeholder}
                          style={{ flex: 1, padding: "11px 14px", border: "none", background: "transparent", fontSize: 15, outline: "none", color: "#1A1A1A", minWidth: 0, fontFamily: "inherit" }} autoFocus />
                      </div>
                      {currentStep.noSkip ? (
                        /* No skip variant — single button, disabled when empty */
                        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                          <button type="submit"
                            disabled={!inputValue.trim()}
                            style={{
                              flex: 1, padding: "12px 24px",
                              background: inputValue.trim() ? "#4C63FC" : "rgba(76,99,252,0.15)",
                              color: inputValue.trim() ? "#fff" : "rgba(76,99,252,0.4)",
                              borderRadius: 12,
                              fontSize: 15, fontWeight: 600, border: "none",
                              cursor: inputValue.trim() ? "pointer" : "not-allowed",
                              boxShadow: inputValue.trim() ? "0 4px 12px rgba(76,99,252,0.2)" : "none",
                              fontFamily: "inherit", transition: "all 0.2s",
                            }}>{currentStep.btnText}</button>
                        </div>
                      ) : (
                        /* With skip — stacked vertically */
                        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
                          <button type="submit"
                            disabled={!inputValue.trim()}
                            style={{
                              width: "100%", padding: "12px 24px",
                              background: inputValue.trim() ? "#4C63FC" : "rgba(76,99,252,0.15)",
                              color: inputValue.trim() ? "#fff" : "rgba(76,99,252,0.4)",
                              borderRadius: 12,
                              fontSize: 15, fontWeight: 600, border: "none",
                              cursor: inputValue.trim() ? "pointer" : "not-allowed",
                              boxShadow: inputValue.trim() ? "0 4px 12px rgba(76,99,252,0.2)" : "none",
                              fontFamily: "inherit", transition: "all 0.2s",
                            }}>{currentStep.btnText}</button>
                          <button type="button" onClick={handleInputSkip} style={{
                            width: "100%", padding: "10px 24px", background: "transparent", color: "#ccc",
                            borderRadius: 12, fontSize: 13, fontWeight: 400, border: "none",
                            cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
                          }}>건너뛰기</button>
                        </div>
                      )}
                    </form>
                    <button onClick={goBack} style={{ marginTop: 14, display: "inline-flex", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, color: "#bbb", fontFamily: "inherit", padding: "4px 0" }}>이전으로</button>
                  </div>
                )}

                {/* ── DONE ── */}
                {currentStep.type === "done" && (
                  <div style={{ textAlign: "center" }}>
                    <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#1A1A1A", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 14, animation: "checkIn 0.5s cubic-bezier(0.16,1,0.3,1)" }}>
                      <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M8 14.5L12.5 19L20 10" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                    <p style={{ fontSize: 20, fontWeight: 800, color: "#111", marginBottom: 8, letterSpacing: "-0.02em" }}>참여해주셔서 감사합니다!</p>
                    <p style={{ fontSize: 14, color: "#888", lineHeight: 1.7, marginBottom: 28 }}>빠른 시일내로 이메일을 보내드리겠습니다.</p>
                    <div style={{
                      background: "rgba(255,255,255,0.6)", borderRadius: 16, padding: "22px 20px",
                      border: "1px solid rgba(0,0,0,0.04)", position: "relative", overflow: "hidden",
                    }}>
                      <div style={{
                        position: "absolute", top: 0, left: 0, right: 0, height: 3,
                        background: "linear-gradient(90deg, #4C63FC, #DC4CFC, #FF0080, #12ADE6)",
                        backgroundSize: "200% 100%",
                        animation: "progShimmer 3s linear infinite",
                      }} />
                      <p style={{ fontSize: 14, color: "#555", marginBottom: 12, fontWeight: 600, lineHeight: 1.5 }}>
                        <span style={{ fontSize: 18, fontWeight: 300, color: "#bbb", marginRight: 2 }}>"</span>
                        현업 패션 디자이너와 AI 엔지니어가 작정하고 만든 서비스
                        <span style={{ fontSize: 18, fontWeight: 300, color: "#bbb", marginLeft: 2 }}>"</span>
                      </p>
                      <p style={{
                        fontSize: 24, fontWeight: 800, letterSpacing: "-0.03em",
                        background: "linear-gradient(135deg, #1A1A1A 0%, #4C63FC 50%, #DC4CFC 100%)",
                        backgroundSize: "200% 100%",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        animation: "gradText 6s linear infinite",
                      }}>Wearless</p>
                    </div>
                    <p style={{ marginTop: 18, fontSize: 12, color: "#bbb" }}>
                      <strong style={{ color: "#999" }}>{email}</strong>으로 안내드릴게요.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        * { margin:0; padding:0; box-sizing:border-box; }
        @keyframes progShimmer { 0% { background-position:-200% 0; } 100% { background-position:200% 0; } }
        @keyframes orbA { 0%,100% { transform:translate(-50%,-50%) rotate(0deg) scale(1); } 50% { transform:translate(-50%,-50%) rotate(180deg) scale(1.1); } }
        @keyframes orbB { 0%,100% { transform:translate(-50%,-50%) rotate(360deg); } 50% { transform:translate(-50%,-50%) rotate(180deg); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.35} }
        @keyframes checkIn { 0% { transform:scale(0); opacity:0; } 60% { transform:scale(1.15); } 100% { transform:scale(1); opacity:1; } }
        @keyframes gradText { 0% { background-position:0% 50%; } 100% { background-position:300% 50%; } }
        input::placeholder { color:#bbb; }
        @media(max-width:480px){ h1 { font-size:28px!important; } }
      `}</style>
    </div>
  );
}
