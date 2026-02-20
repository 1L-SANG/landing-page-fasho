'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { SURVEY_STEPS, type SurveyStep } from '@/lib/survey-steps';
import { FaceIcon } from '@/components/survey/icons/face-icon';
import { NoFaceIcon } from '@/components/survey/icons/no-face-icon';

/* ────────────────────────────────────────────────────
 *  Types
 * ──────────────────────────────────────────────────── */

interface SurveyModalProps {
    open: boolean;
    onClose: () => void;
}

type Answers = Record<string, unknown>;
type SplitState = { left: number | null; right: number | null };

/* ────────────────────────────────────────────────────
 *  Helpers
 * ──────────────────────────────────────────────────── */

const ACTIVE_TYPES = ['select', 'input', 'multi-select', 'split-select', 'image-select'];
const INVITE_KEYWORD_GRADIENT_STYLE = {
    background: 'linear-gradient(135deg, #7465E0, #4F79E8, #87A8F3)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
};

const getSelectGrid = (count: number): string => {
    if (count === 2) return 'grid-cols-2';
    if (count === 3) return 'grid-cols-3';
    if (count === 5) return 'grid-cols-[repeat(6,1fr)]';
    if (count === 6) return 'grid-cols-3';
    return 'grid-cols-2';
};

const getOptionSpan = (count: number, index: number): string => {
    if (count === 5 && index < 2) return 'col-span-3';
    if (count === 5 && index >= 2) return 'col-span-2';
    return '';
};

/* ────────────────────────────────────────────────────
 *  Component
 * ──────────────────────────────────────────────────── */

const SurveyModal = ({ open, onClose }: SurveyModalProps) => {
    const [stepIndex, setStepIndex] = useState(0);
    const [email, setEmail] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [answers, setAnswers] = useState<Answers>({});
    const [multiSelection, setMultiSelection] = useState<number[]>([]);
    const [splitSelection, setSplitSelection] = useState<SplitState>({ left: null, right: null });
    const [cardBounce, setCardBounce] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const currentStep = SURVEY_STEPS[stepIndex] as SurveyStep;
    const progress = Math.min((stepIndex / (SURVEY_STEPS.length - 1)) * 100, 100);

    /* Visibility transition */
    useEffect(() => {
        if (open) {
            requestAnimationFrame(() => setIsVisible(true));
        } else {
            setIsVisible(false);
        }
    }, [open]);

    /* ESC key handler */
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (open) {
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [open, onClose]);

    /* Reset state when closing */
    useEffect(() => {
        if (!open) {
            const timer = setTimeout(() => {
                setStepIndex(0);
                setEmail('');
                setAnswers({});
                setInputValue('');
                setMultiSelection([]);
                setSplitSelection({ left: null, right: null });
            }, 400);
            return () => clearTimeout(timer);
        }
    }, [open]);

    /* ── Navigation Helpers ── */

    const restoreStepState = (idx: number, currentAnswers?: Answers) => {
        const step = SURVEY_STEPS[idx];
        const ans = currentAnswers || answers;

        if (step.type === 'multi-select' && ans[step.id]) {
            setMultiSelection(ans[step.id] as number[]);
        } else {
            setMultiSelection([]);
        }

        if (step.type === 'split-select' && ans[step.id]) {
            setSplitSelection(ans[step.id] as SplitState);
        } else {
            setSplitSelection({ left: null, right: null });
        }

        if (step.type === 'input' && ans[step.id] && ans[step.id] !== 'skipped') {
            setInputValue(ans[step.id] as string);
        } else {
            setInputValue('');
        }
    };

    const goToNextStep = (newAnswers: Answers = answers) => {
        let nextIndex = stepIndex + 1;
        while (
            nextIndex < SURVEY_STEPS.length &&
            SURVEY_STEPS[nextIndex].condition &&
            !SURVEY_STEPS[nextIndex].condition!(newAnswers)
        ) {
            nextIndex++;
        }

        // If we reached done step, log collected data
        if (SURVEY_STEPS[nextIndex]?.type === 'done') {
            // TODO: POST /api/survey { email, answers }
            console.log('Survey completed:', { email, answers: newAnswers });
        }

        setStepIndex(nextIndex);
        restoreStepState(nextIndex, newAnswers);
    };

    const goBack = useCallback(() => {
        let prevIndex = stepIndex - 1;
        while (
            prevIndex >= 0 &&
            SURVEY_STEPS[prevIndex].condition &&
            !SURVEY_STEPS[prevIndex].condition!(answers)
        ) {
            prevIndex--;
        }
        if (prevIndex >= 0) {
            setStepIndex(prevIndex);
            restoreStepState(prevIndex, answers);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stepIndex, answers]);

    /* ── Action Handlers ── */

    const handleEmailSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email.trim() && email.includes('@')) {
            setCardBounce(true);
            setTimeout(() => {
                setCardBounce(false);
                goToNextStep();
            }, 350);
        }
    };

    const handleSelect = (id: string, idx: number) => {
        const na = { ...answers, [id]: idx };
        setAnswers(na);
        goToNextStep(na);
    };

    const handleInputSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;
        const na = { ...answers, [currentStep.id]: inputValue.trim() };
        setAnswers(na);
        goToNextStep(na);
    };

    const handleInputSkip = () => {
        const na = { ...answers, [currentStep.id]: 'skipped' };
        setAnswers(na);
        goToNextStep(na);
    };

    const toggleMultiSelect = (idx: number) => {
        if (multiSelection.includes(idx)) {
            setMultiSelection(multiSelection.filter((i) => i !== idx));
        } else if (multiSelection.length < (currentStep.maxSelect ?? 2)) {
            setMultiSelection([...multiSelection, idx]);
        }
    };

    const submitMultiSelect = () => {
        if (multiSelection.length === 0) return;
        const na = { ...answers, [currentStep.id]: multiSelection };
        setAnswers(na);
        goToNextStep(na);
    };

    const handleSetSplit = (side: 'left' | 'right', idx: number) => {
        setSplitSelection((p) => ({ ...p, [side]: idx }));
    };

    const submitSplit = () => {
        const na = { ...answers, [currentStep.id]: splitSelection };
        setAnswers(na);
        goToNextStep(na);
    };

    const handleSurveyAccept = () => goToNextStep();

    const handleSurveyDecline = () => {
        setStepIndex(SURVEY_STEPS.length - 1);
    };

    /* ── Guard: don't render at all if never opened ── */
    if (!open && !isVisible) return null;

    /* ────────────────────────────────────────────────────
     *  Render
     * ──────────────────────────────────────────────────── */

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${isVisible ? 'bg-black/40 backdrop-blur-sm' : 'pointer-events-none bg-transparent'
                }`}
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label="설문조사"
        >
            {/* Glass Card */}
            <div
                className="relative w-full max-w-[500px] overflow-hidden rounded-[22px]"
                style={{
                    background: 'rgba(245,245,247,0.92)',
                    backdropFilter: 'blur(40px) saturate(1.6)',
                    WebkitBackdropFilter: 'blur(40px) saturate(1.6)',
                    border: '1px solid rgba(0,0,0,0.12)',
                    boxShadow: '0 24px 80px rgba(0,0,0,0.08), 0 1px 0 rgba(255,255,255,0.5) inset',
                    transition: 'all 0.45s cubic-bezier(0.16,1,0.3,1)',
                    willChange: 'opacity, transform',
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible
                        ? cardBounce
                            ? 'scale(0.96)'
                            : 'scale(1)'
                        : 'scale(0.96)',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Progress Bar */}
                <div className="h-[2px] bg-black/[0.04]">
                    <div
                        className="h-full rounded-sm"
                        style={{
                            background:
                                currentStep.type === 'done'
                                    ? 'linear-gradient(90deg,#12ADE6,#4C63FC,#DC4CFC,#FF0080,#12B4E6)'
                                    : '#1A1A1A',
                            backgroundSize: currentStep.type === 'done' ? '200% 100%' : undefined,
                            animation: currentStep.type === 'done' ? 'progShimmer 2.5s linear infinite' : undefined,
                            transition: 'width 0.5s cubic-bezier(0.16,1,0.3,1)',
                            width: currentStep.type === 'done' ? '100%' : `${progress}%`,
                            opacity: ACTIVE_TYPES.includes(currentStep.type) || currentStep.type === 'done' ? 1 : 0,
                        }}
                    />
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-3.5 top-3.5 z-10 flex items-center justify-center rounded-lg bg-transparent p-1.5 transition-colors hover:bg-black/5"
                    aria-label="설문 닫기"
                    tabIndex={0}
                >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M3 3L11 11M11 3L3 11" stroke="#999" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                </button>

                {/* Content */}
                <div key={stepIndex} className="overflow-hidden px-[26px] pb-6 pt-[26px]">
                    {/* ── EMAIL ── */}
                    {currentStep.type === 'email' && (
                        <div className="text-center">
                            <div className="mx-auto mb-3.5 inline-flex items-center justify-center">
                                <Image
                                    src="/logo.png"
                                    alt="Wearless Logo"
                                    width={44}
                                    height={44}
                                    className="object-contain"
                                />
                            </div>
                            <p className="mb-1.5 text-[19px] font-bold tracking-tight text-[#111]">{currentStep.title}</p>
                            <p className="mb-5 text-[13.5px] leading-relaxed text-[#999]">{currentStep.desc}</p>
                            <form onSubmit={handleEmailSubmit} className="mt-6 w-full">
                                <div className="flex gap-1.5 rounded-[14px] border-[1.5px] border-black/[0.08] bg-white/70 p-[5px]">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@company.com"
                                        className="min-w-0 flex-1 border-none bg-transparent px-3.5 py-[11px] text-[15px] text-[#1A1A1A] outline-none placeholder:text-[#bbb]"
                                        autoFocus
                                    />
                                    <button
                                        type="submit"
                                        className="flex-shrink-0 whitespace-nowrap rounded-[10px] bg-[#1A1A1A] px-11 py-[11px] text-[14px] font-semibold text-white transition-all duration-200"
                                        style={{ opacity: email.includes('@') ? 1 : 0.35 }}
                                    >
                                        완료
                                    </button>
                                </div>
                            </form>
                            <p className="mt-3.5 text-center text-[11px] leading-snug text-[#bbb]">
                                &apos;완료&apos; 버튼을 누르면 이후의 내용과 이메일 수집에 대해 동의함으로 간주됩니다.
                            </p>
                        </div>
                    )}

                    {/* ── SURVEY INVITE ── */}
                    {currentStep.type === 'survey-invite' && (
                        <div className="pt-3.5 text-center">
                            <p className="mb-7 text-[20px] font-bold leading-snug tracking-tight text-[#111]">
                                잠깐!
                                <br className="md:hidden" />
                                <span className="hidden md:inline">&nbsp;</span>
                                <span
                                    className="font-black"
                                    style={INVITE_KEYWORD_GRADIENT_STYLE}
                                >
                                    Pro 플랜
                                </span>
                                을{' '}
                                <span
                                    className="font-black"
                                    style={INVITE_KEYWORD_GRADIENT_STYLE}
                                >
                                    무료
                                </span>
                                로 써보시겠어요?
                            </p>

                            <div className="flex flex-col gap-2.5">
                                <button
                                    onClick={handleSurveyAccept}
                                    className="w-full rounded-[14px] bg-[#1A1A1A] px-6 py-3.5 text-[15px] font-bold text-white shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-all duration-200 hover:scale-[1.02]"
                                >
                                    1분 설문 참여하고 혜택 받기
                                </button>
                            </div>

                            <div className="mt-4 flex flex-col items-start gap-1">
                                {[
                                    '불성실한 답변은 AI 필터링으로 대상에서 제외됩니다.',
                                    '선착순 혜택으로, 인원이 마감되면 해당 이벤트창은 사라집니다.',
                                ].map((text, i) => (
                                    <div key={i} className="flex items-center gap-1.5">
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                                            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                                        </svg>
                                        <span className="text-[11px] font-medium text-[#888]">{text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── SELECT ── */}
                    {currentStep.type === 'select' && (
                        <div>
                            <div className="mb-3">
                                <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#bbb]">{currentStep.label}</span>
                            </div>
                            <p className="mb-3.5 text-left text-[17px] font-bold leading-snug tracking-tight text-[#111]">{currentStep.q}</p>
                            <div className={`grid ${getSelectGrid(currentStep.options?.length ?? 0)} gap-2`}>
                                {currentStep.options?.map((o, i) => {
                                    const isSel = answers[currentStep.id] === i;
                                    return (
                                        <button
                                            key={i}
                                            onClick={() => handleSelect(currentStep.id, i)}
                                            className={`flex flex-col items-center justify-center gap-1.5 rounded-[14px] px-2.5 py-3.5 text-center transition-all duration-200 ${getOptionSpan(currentStep.options?.length ?? 0, i)} ${isSel
                                                    ? 'scale-[0.97] border-[1.5px] border-[#1A1A1A]/60 bg-white/80 shadow-[0_2px_12px_rgba(0,0,0,0.06)]'
                                                    : 'border-[1.5px] border-black/[0.06] bg-white/55 hover:border-black/20'
                                                }`}
                                        >
                                            <span className="text-[13px] font-semibold leading-snug text-[#333]">{o.text}</span>
                                        </button>
                                    );
                                })}
                            </div>
                            <button
                                onClick={goBack}
                                className="mt-3.5 inline-flex border-none bg-transparent px-0 py-1 text-[13px] font-medium text-[#bbb] hover:text-[#888]"
                                tabIndex={0}
                                aria-label="이전 질문으로"
                            >
                                이전으로
                            </button>
                        </div>
                    )}

                    {/* ── IMAGE SELECT ── */}
                    {currentStep.type === 'image-select' && (
                        <div>
                            <div className="mb-3">
                                <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#bbb]">{currentStep.label}</span>
                            </div>
                            <p className="mb-4 text-left text-[17px] font-bold leading-snug tracking-tight text-[#111]">{currentStep.q}</p>
                            <div className="grid grid-cols-2 gap-2.5">
                                {currentStep.options?.map((o, i) => {
                                    const isSel = answers[currentStep.id] === i;
                                    return (
                                        <button
                                            key={i}
                                            onClick={() => handleSelect(currentStep.id, i)}
                                            className={`flex flex-col items-center gap-3 rounded-2xl px-2.5 pb-3.5 pt-[18px] transition-all duration-200 ${isSel
                                                    ? 'scale-[0.97] border-[1.5px] border-[#4C63FC] bg-[#4C63FC]/[0.04] shadow-[0_2px_16px_rgba(76,99,252,0.1)]'
                                                    : 'border-[1.5px] border-black/[0.06] bg-white/55 hover:border-black/20'
                                                }`}
                                        >
                                            <div className="flex h-[90px] w-[72px] items-center justify-center opacity-70">
                                                {o.image === 'face' ? <FaceIcon /> : <NoFaceIcon />}
                                            </div>
                                            <span className="text-[13px] font-semibold leading-snug text-[#333]">{o.text}</span>
                                        </button>
                                    );
                                })}
                            </div>
                            <button
                                onClick={goBack}
                                className="mt-3.5 inline-flex border-none bg-transparent px-0 py-1 text-[13px] font-medium text-[#bbb] hover:text-[#888]"
                                tabIndex={0}
                                aria-label="이전 질문으로"
                            >
                                이전으로
                            </button>
                        </div>
                    )}

                    {/* ── MULTI SELECT ── */}
                    {currentStep.type === 'multi-select' && (
                        <div>
                            <div className="mb-3">
                                <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#bbb]">{currentStep.label}</span>
                            </div>
                            <p className="mb-1 text-left text-[17px] font-bold leading-snug tracking-tight text-[#111]">
                                {currentStep.q}{' '}
                                {currentStep.qHighlight && (
                                    <span
                                        className="font-semibold"
                                        style={{
                                            background: 'linear-gradient(90deg, #12ADE6, #4C63FC, #DC4CFC, #FF0080, #12ADE6)',
                                            backgroundSize: '300% 100%',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            backgroundClip: 'text',
                                            animation: 'gradText 8s linear infinite',
                                        }}
                                    >
                                        {currentStep.qHighlight}
                                    </span>
                                )}
                            </p>
                            {currentStep.sub && <p className="mb-3.5 text-left text-[12px] leading-snug text-[#666]">{currentStep.sub}</p>}
                            {!currentStep.sub && <div className="h-2.5" />}

                            {currentStep.gridLayout ? (
                                <div className="grid grid-cols-2 gap-2">
                                    {currentStep.options?.map((o, i) => {
                                        const isSel = multiSelection.includes(i);
                                        return (
                                            <button
                                                key={i}
                                                onClick={() => toggleMultiSelect(i)}
                                                className={`relative flex flex-col items-center gap-1 rounded-[14px] px-3 py-3.5 text-center transition-all duration-200 ${isSel
                                                        ? 'border-[1.5px] border-[#4C63FC] bg-[#4C63FC]/[0.04]'
                                                        : 'border-[1.5px] border-black/[0.06] bg-white/55 hover:border-black/20'
                                                    }`}
                                            >
                                                <div className="flex w-full items-start justify-center">
                                                    <div className="text-center text-[14px] font-bold leading-snug text-[#222]">{o.text}</div>
                                                    <div
                                                        className={`absolute right-3 top-3 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[12px] text-white transition-all duration-200 ${isSel ? 'border-[1.5px] border-[#4C63FC] bg-[#4C63FC]' : 'border-[1.5px] border-[#ddd] bg-transparent'
                                                            }`}
                                                    >
                                                        {isSel && '✓'}
                                                    </div>
                                                </div>
                                                <div className="mt-0.5 text-center text-[11.5px] leading-snug text-[#555]">{o.sub}</div>
                                            </button>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    {currentStep.options?.map((o, i) => {
                                        const isSel = multiSelection.includes(i);
                                        return (
                                            <button
                                                key={i}
                                                onClick={() => toggleMultiSelect(i)}
                                                className={`flex items-center justify-between rounded-[14px] px-4 py-3.5 text-left transition-all duration-200 ${isSel
                                                        ? 'border-[1.5px] border-[#4C63FC] bg-[#4C63FC]/[0.04]'
                                                        : 'border-[1.5px] border-black/[0.06] bg-white/55 hover:border-black/20'
                                                    }`}
                                            >
                                                <div>
                                                    <div className="text-[14px] font-bold text-[#222]">{o.text}</div>
                                                    {o.sub && <div className="mt-0.5 text-[12px] text-[#666]">{o.sub}</div>}
                                                </div>
                                                <div
                                                    className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[12px] text-white transition-all duration-200 ${isSel ? 'border-[1.5px] border-[#4C63FC] bg-[#4C63FC]' : 'border-[1.5px] border-[#ddd] bg-transparent'
                                                        }`}
                                                >
                                                    {isSel && '✓'}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            <div className="mt-5 flex items-center justify-between">
                                <button
                                    onClick={goBack}
                                    className="border-none bg-transparent px-0 py-1 text-[13px] font-medium text-[#bbb] hover:text-[#888]"
                                    tabIndex={0}
                                    aria-label="이전 질문으로"
                                >
                                    이전으로
                                </button>
                                <button
                                    onClick={submitMultiSelect}
                                    className="rounded-xl bg-[#4C63FC] px-6 py-3 text-[15px] font-semibold text-white shadow-[0_4px_12px_rgba(76,99,252,0.2)] transition-all duration-200"
                                    style={{ opacity: multiSelection.length > 0 ? 1 : 0.4 }}
                                >
                                    다음 ({multiSelection.length})
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ── SPLIT SELECT ── */}
                    {currentStep.type === 'split-select' && (
                        <div>
                            <div className="mb-3">
                                <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#bbb]">{currentStep.label}</span>
                            </div>
                            <p className="mb-3.5 text-left text-[17px] font-bold leading-snug tracking-tight text-[#111]">{currentStep.q}</p>
                            <div className="mb-5 flex flex-col gap-3">
                                {(['left', 'right'] as const).map((side) => (
                                    <div key={side} className="rounded-xl bg-white/30 p-2.5">
                                        <div className="mb-2 text-center text-[16px] font-bold text-[#111]">
                                            {side === 'left' ? currentStep.leftLabel : currentStep.rightLabel}
                                        </div>
                                        <div className="flex gap-2">
                                            {currentStep.options?.map((o, i) => (
                                                <button
                                                    key={`${side}-${i}`}
                                                    onClick={() => handleSetSplit(side, i)}
                                                    className={`flex-1 rounded-lg px-1.5 py-2.5 text-[13px] font-medium transition-all duration-200 ${splitSelection[side] === i
                                                            ? 'border border-[#1A1A1A] bg-[#1A1A1A] text-white'
                                                            : 'border border-transparent bg-white/60 hover:bg-white/80'
                                                        }`}
                                                >
                                                    {o.text}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center justify-between">
                                <button
                                    onClick={goBack}
                                    className="border-none bg-transparent px-0 py-1 text-[13px] font-medium text-[#bbb] hover:text-[#888]"
                                    tabIndex={0}
                                    aria-label="이전 질문으로"
                                >
                                    이전으로
                                </button>
                                <button
                                    onClick={submitSplit}
                                    className="rounded-xl bg-[#4C63FC] px-6 py-3 text-[15px] font-semibold text-white shadow-[0_4px_12px_rgba(76,99,252,0.2)] transition-all duration-200"
                                    style={{ opacity: splitSelection.left !== null && splitSelection.right !== null ? 1 : 0.4 }}
                                >
                                    다음
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ── INPUT ── */}
                    {currentStep.type === 'input' && (
                        <div>
                            <div className="mb-3">
                                <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#bbb]">{currentStep.label}</span>
                            </div>
                            <p className="mb-1.5 text-left text-[17px] font-bold leading-snug tracking-tight text-[#111]">{currentStep.q}</p>
                            {currentStep.inputSub && (
                                <p className="mb-3.5 text-left text-[12px] leading-snug text-[#666]">{currentStep.inputSub}</p>
                            )}
                            {!currentStep.inputSub && <div className="h-2" />}
                            <form onSubmit={handleInputSubmit}>
                                <div className="flex gap-1.5 rounded-[14px] border-[1.5px] border-black/[0.08] bg-white/70 p-[5px]">
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder={currentStep.placeholder ?? ''}
                                        className="min-w-0 flex-1 border-none bg-transparent px-3.5 py-[11px] text-[15px] text-[#1A1A1A] outline-none placeholder:text-[#bbb]"
                                        autoFocus
                                    />
                                </div>
                                {currentStep.noSkip ? (
                                    <div className="mt-4 flex gap-2.5">
                                        <button
                                            type="submit"
                                            disabled={!inputValue.trim()}
                                            className="flex-1 rounded-xl px-6 py-3 text-[15px] font-semibold transition-all duration-200"
                                            style={{
                                                background: inputValue.trim() ? '#4C63FC' : 'rgba(76,99,252,0.15)',
                                                color: inputValue.trim() ? '#fff' : 'rgba(76,99,252,0.4)',
                                                boxShadow: inputValue.trim() ? '0 4px 12px rgba(76,99,252,0.2)' : 'none',
                                                cursor: inputValue.trim() ? 'pointer' : 'not-allowed',
                                            }}
                                        >
                                            {currentStep.btnText}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="mt-4 flex flex-col gap-2.5">
                                        <button
                                            type="submit"
                                            disabled={!inputValue.trim()}
                                            className="w-full rounded-xl px-6 py-3 text-[15px] font-semibold transition-all duration-200"
                                            style={{
                                                background: inputValue.trim() ? '#4C63FC' : 'rgba(76,99,252,0.15)',
                                                color: inputValue.trim() ? '#fff' : 'rgba(76,99,252,0.4)',
                                                boxShadow: inputValue.trim() ? '0 4px 12px rgba(76,99,252,0.2)' : 'none',
                                                cursor: inputValue.trim() ? 'pointer' : 'not-allowed',
                                            }}
                                        >
                                            {currentStep.btnText}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleInputSkip}
                                            className="w-full rounded-xl bg-transparent px-6 py-2.5 text-[13px] font-normal text-[#ccc] transition-all duration-200 hover:text-[#999]"
                                        >
                                            건너뛰기
                                        </button>
                                    </div>
                                )}
                            </form>
                            <button
                                onClick={goBack}
                                className="mt-3.5 inline-flex border-none bg-transparent px-0 py-1 text-[13px] font-medium text-[#bbb] hover:text-[#888]"
                                tabIndex={0}
                                aria-label="이전 질문으로"
                            >
                                이전으로
                            </button>
                        </div>
                    )}

                    {/* ── DONE ── */}
                    {currentStep.type === 'done' && (
                        <div className="text-center">
                            <div
                                className="mx-auto mb-3.5 inline-flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#1A1A1A]"
                                style={{ animation: 'checkIn 0.5s cubic-bezier(0.16,1,0.3,1)' }}
                            >
                                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                                    <path d="M8 14.5L12.5 19L20 10" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <p className="mb-2 text-[20px] font-extrabold tracking-tight text-[#111]">참여해주셔서 감사합니다!</p>
                            <p className="mb-7 text-[14px] leading-relaxed text-[#888]">빠른 시일내로 이메일을 보내드리겠습니다.</p>
                            <div
                                className="relative overflow-hidden rounded-2xl border border-black/[0.04] bg-white/60 px-5 py-[22px]"
                            >
                                <div
                                    className="absolute inset-x-0 top-0 h-[3px]"
                                    style={{
                                        background: 'linear-gradient(90deg, #4C63FC, #DC4CFC, #FF0080, #12ADE6)',
                                        backgroundSize: '200% 100%',
                                        animation: 'progShimmer 3s linear infinite',
                                    }}
                                />
                                <p className="mb-3 text-[14px] font-semibold leading-snug text-[#555]">
                                    <span className="mr-0.5 text-[18px] font-light text-[#bbb]">&ldquo;</span>
                                    현업 패션 디자이너와 AI 엔지니어가 작정하고 만든 서비스
                                    <span className="ml-0.5 text-[18px] font-light text-[#bbb]">&rdquo;</span>
                                </p>
                                <p
                                    className="text-[24px] font-extrabold tracking-tight"
                                    style={{
                                        background: 'linear-gradient(135deg, #1A1A1A 0%, #4C63FC 50%, #DC4CFC 100%)',
                                        backgroundSize: '200% 100%',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text',
                                        animation: 'gradText 6s linear infinite',
                                    }}
                                >
                                    Wearless
                                </p>
                            </div>
                            <p className="mt-[18px] text-[12px] text-[#bbb]">
                                <strong className="text-[#999]">{email}</strong>으로 안내드릴게요.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export { SurveyModal };
