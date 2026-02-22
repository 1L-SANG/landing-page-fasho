import { SURVEY_STEPS, type StepType } from '@/lib/survey-steps';

type Answers = Record<string, unknown>;

const PROGRESSABLE_STEP_TYPES = new Set<StepType>([
    'select',
    'input',
    'multi-select',
    'split-select',
    'image-select',
]);

const resolveProgressPathByAnswers = (answers: Answers): string[] => {
    return SURVEY_STEPS
        .filter((step) => {
            if (!PROGRESSABLE_STEP_TYPES.has(step.type)) return false;
            if (!step.condition) return true;
            return step.condition(answers);
        })
        .map((step) => step.id);
};

const SELLER_WITH_AI_PATH = resolveProgressPathByAnswers({ role: 0, ai_exp: 0 });
const SELLER_WITHOUT_AI_PATH = resolveProgressPathByAnswers({ role: 0, ai_exp: 1 });
const PREP_WITH_AI_PATH = resolveProgressPathByAnswers({ role: 2, prep_ai_exp: 0 });
const PREP_WITHOUT_AI_PATH = resolveProgressPathByAnswers({ role: 2, prep_ai_exp: 1 });

const getLongerPath = (a: string[], b: string[]): string[] => (a.length >= b.length ? a : b);

const SELLER_DEFAULT_PATH = getLongerPath(SELLER_WITH_AI_PATH, SELLER_WITHOUT_AI_PATH);
const PREP_DEFAULT_PATH = getLongerPath(PREP_WITH_AI_PATH, PREP_WITHOUT_AI_PATH);
const DEFAULT_PATH = getLongerPath(SELLER_DEFAULT_PATH, PREP_DEFAULT_PATH);

const isNumber = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);

const getExpectedPath = (answers: Answers): string[] => {
    const role = answers.role;
    if (!isNumber(role)) {
        return DEFAULT_PATH;
    }

    if (role <= 1) {
        const aiExp = answers.ai_exp;
        if (aiExp === 0) return SELLER_WITH_AI_PATH;
        if (aiExp === 1) return SELLER_WITHOUT_AI_PATH;
        return SELLER_DEFAULT_PATH;
    }

    const prepAiExp = answers.prep_ai_exp;
    if (prepAiExp === 0) return PREP_WITH_AI_PATH;
    if (prepAiExp === 1) return PREP_WITHOUT_AI_PATH;
    return PREP_DEFAULT_PATH;
};

export const getSurveyProgressPercent = (stepId: string, answers: Answers): number => {
    const path = getExpectedPath(answers);
    if (path.length === 0) return 0;

    const index = path.indexOf(stepId);
    if (index === -1) return 0;

    return ((index + 1) / path.length) * 100;
};
