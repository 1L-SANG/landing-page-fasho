// lib/submit-survey.ts
'use client';

import { SURVEY_STEPS } from '@/lib/survey-steps';

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby5WO4ipAey2x97nHbhn1KuMI2vIuITUoAkbfrNhycy6pnv_Ze5NBnK75Jr-ZvrrxUKtw/exec';

type Answers = Record<string, unknown>;

/* ── 세션 관리 ── */

let currentSessionId: string | null = null;

export const startSurveySession = () => {
    currentSessionId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    return currentSessionId;
};

/* ── 인덱스 → 텍스트 변환 ── */

const resolveAnswer = (stepId: string, value: unknown): unknown => {
    if (value === 'skipped' || value === undefined || value === null) return '';

    const step = SURVEY_STEPS.find((s) => s.id === stepId);
    if (!step?.options) return value;

    if (typeof value === 'number') {
        const opt = step.options[value];
        return opt ? opt.text.replace(/\n/g, ' ').replace(/\{\{mbr\}\}/g, ' ') : value;
    }

    if (Array.isArray(value)) {
        return value.map((v) => {
            if (typeof v === 'number' && step.options?.[v]) {
                return step.options[v].text.replace(/\n/g, ' ').replace(/\{\{mbr\}\}/g, ' ');
            }
            return v;
        });
    }

    if (typeof value === 'object' && value !== null && 'left' in value && 'right' in value) {
        const obj = value as { left: number | null; right: number | null };
        const leftText =
            obj.left !== null && step.options?.[obj.left] ? step.options[obj.left].text : '';
        const rightText =
            obj.right !== null && step.options?.[obj.right] ? step.options[obj.right].text : '';
        return `${step.leftLabel || '좌'}: ${leftText} / ${step.rightLabel || '우'}: ${rightText}`;
    }

    return value;
};

/* ── 전송 로직 (디바운스) ── */

let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let pendingPayload: Record<string, unknown> | null = null;

const sendToSheet = async (payload: Record<string, unknown>) => {
    try {
        await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify(payload),
        });
    } catch (err) {
        console.error('Survey submission failed:', err);
    }
};

/** 매 스텝 진행 시 호출 */
export const submitSurveyStep = (
    email: string,
    rawAnswers: Answers,
    lastStepId: string,
    isComplete: boolean = false
) => {
    const answers: Answers = {};
    for (const [key, val] of Object.entries(rawAnswers)) {
        answers[key] = resolveAnswer(key, val);
    }

    const payload = {
        session_id: currentSessionId,
        email,
        answers,
        last_step: lastStepId,
        is_complete: isComplete,
    };

    if (isComplete) {
        if (debounceTimer) {
            clearTimeout(debounceTimer);
            debounceTimer = null;
        }
        pendingPayload = null;
        sendToSheet(payload);
        return;
    }

    pendingPayload = payload;
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        if (pendingPayload) {
            sendToSheet(pendingPayload);
            pendingPayload = null;
        }
    }, 800);
};

/** 설문 닫힐 때 호출 — 미전송 데이터 즉시 전송 */
export const flushSurveyData = () => {
    if (debounceTimer) {
        clearTimeout(debounceTimer);
        debounceTimer = null;
    }
    if (pendingPayload) {
        if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
            navigator.sendBeacon(GOOGLE_SCRIPT_URL, JSON.stringify(pendingPayload));
        } else {
            sendToSheet(pendingPayload);
        }
        pendingPayload = null;
    }
};