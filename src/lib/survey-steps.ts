export interface SurveyOption {
    text: string;
    sub?: string;
    image?: 'face' | 'noface';
}

export type StepType =
    | 'email'
    | 'survey-invite'
    | 'select'
    | 'multi-select'
    | 'split-select'
    | 'image-select'
    | 'input'
    | 'done';

export interface SurveyStep {
    id: string;
    type: StepType;
    title?: string;
    desc?: string;
    label?: string;
    q?: string;
    qHighlight?: string;
    sub?: string;
    inputSub?: string;
    placeholder?: string;
    btnText?: string;
    skipText?: string;
    optional?: boolean;
    requireForNext?: boolean;
    noSkip?: boolean;
    maxSelect?: number;
    gridLayout?: boolean;
    leftLabel?: string;
    rightLabel?: string;
    options?: SurveyOption[];
    condition?: (answers: Record<string, unknown>) => boolean;
}

/* ────────────────────────────────────────────────────
 *  Shared option sets (reused across both flows)
 * ──────────────────────────────────────────────────── */

const FEATURES_OPTIONS: SurveyOption[] = [
    { text: '레퍼런스 응용', sub: `레퍼런스 무드로 새 컷을 생성` },
    { text: '쇼핑몰 정체성 유지', sub: '쇼핑몰 톤앤매너 반영한 이미지 생성' },
    { text: '체형 조절', sub: '설정한 체형 기준으로{{mbr}}이미지 재생성' },
    { text: '이미지 다양화', sub: `포즈, 배경을 바꾸어 컷을 다양화` },
    { text: 'AI 모델', sub: `자연스런 AI모델 얼굴을\nAI컷에 반영하여 생성` },
    { text: '기존 모델 반영', sub: `기존 쇼핑몰 모델 얼굴을\nAI컷에 반영하여 생성` },
];

const AI_PAIN_OPTIONS: SurveyOption[] = [
    { text: '기존 업로드물들과 통일감이 없음', sub: '쇼핑몰에 올렸던 작업물들과 결이 다름' },
    { text: '제품의 디테일 표현이 안됨', sub: '세밀한 부분이 뭉개지고 변형됨' },
    { text: `원하는 모습\n구현이 안됨`, sub: `의도한 결과를 만들기\n어려움` },
    { text: `인위적인 느낌이\n강함`, sub: `자연스러운 결과물이\n나오지 않음` },
];

const NON_USER_REASON_OPTIONS: SurveyOption[] = [
    { text: `사용법이 어렵고\n복잡할 것 같아서` },
    { text: `퀄리티가 별로일 것\n같아서` },
    { text: `기존 촬영 방식이\n익숙해서` },
    { text: '어떤 서비스가 있는지 몰라서' },
];

/* ────────────────────────────────────────────────────
 *  Survey Steps
 * ──────────────────────────────────────────────────── */

export const SURVEY_STEPS: SurveyStep[] = [
    /* ── Common ── */
    {
        id: 'email',
        type: 'email',
        title: '이메일로 전달해드릴게요',
        desc: '누구보다 Wearless를 빠르게 체험해보세요.',
    },
    {
        id: 'survey_invite',
        type: 'survey-invite',
    },
    {
        id: 'role',
        type: 'select',
        label: '기본 정보',
        q: '현재 쇼핑몰 셀러이신가요?',
        options: [
            { text: `현재 셀러 활동중\n(본업)` },
            { text: `현재 셀러 활동중\n(부업)` },
            { text: '현재 셀러 준비중' },
            { text: '관심정도만 있음' },
        ],
    },

    /* ══════════════════════════════════════════════════
     *  Branch A: Active Sellers (role 0, 1)
     * ══════════════════════════════════════════════════ */
    {
        id: 'volume',
        type: 'select',
        label: '운영 현황',
        q: '일주일에 신상품을 몇 개 업로드하시나요?',
        condition: (a) => (a.role as number) <= 1,
        options: [
            { text: '1~3개' },
            { text: '4~7개' },
            { text: '8~15개' },
            { text: '16~30개' },
            { text: '31개~50개' },
        ],
    },
    {
        id: 'model_role',
        type: 'select',
        label: '운영 현황',
        q: '피팅모델은 누가 하나요?',
        condition: (a) => (a.role as number) <= 1,
        options: [
            { text: '직접 한다' },
            { text: '직접 하지만 얼굴노출을 최소화한다' },
            { text: '직원이 한다' },
            { text: '외주를 맡긴다' },
        ],
    },
    {
        id: 'photo_edit_method',
        type: 'split-select',
        label: '운영 현황',
        q: '촬영과 보정은 각각 누가 하나요?',
        condition: (a) => (a.role as number) <= 1,
        leftLabel: '촬영',
        rightLabel: '보정',
        options: [
            { text: '직접함' },
            { text: '직원' },
            { text: '외주' },
        ],
    },
    {
        id: 'features',
        type: 'multi-select',
        label: '니즈 파악',
        q: '가장 필요한 기능을 선택해주세요.',
        qHighlight: '(최대 2개)',
        condition: (a) => (a.role as number) <= 1,
        maxSelect: 2,
        gridLayout: true,
        options: FEATURES_OPTIONS,
    },
    {
        id: 'cut_type',
        type: 'image-select',
        label: '니즈 파악',
        q: '어떠한 의류컷 위주로 생성하실 거 같나요?',
        condition: (a) => (a.role as number) <= 1,
        options: [
            { text: '얼굴이 나오는 컷 위주', image: 'face' },
            { text: '얼굴이 나오지 않는 컷 위주', image: 'noface' },
        ],
    },
    {
        id: 'usage_type',
        type: 'select',
        label: '니즈 파악',
        q: '어떻게 주로 쓰실거 같나요?',
        condition: (a) => (a.role as number) <= 1,
        options: [
            { text: '기존 촬영컷 활용하여 생성' },
            { text: '의류사진 + 레퍼런스로 새롭게 생성' },
        ],
    },
    {
        id: 'ai_exp',
        type: 'select',
        label: '서비스 경험',
        q: '쇼핑몰을 위한 타 AI 서비스를 써보신 적 있나요?',
        condition: (a) => (a.role as number) <= 1,
        options: [
            { text: '네, 써봤습니다' },
            { text: '아니요, 처음입니다' },
        ],
    },
    {
        id: 'ai_name',
        type: 'input',
        label: '서비스 경험',
        q: '사용해 보신 서비스 이름을 알려주세요.',
        placeholder: '',
        btnText: '다음',
        skipText: '건너뛰기',
        optional: true,
        requireForNext: true,
        condition: (a) => (a.role as number) <= 1 && (a.ai_exp as number) === 0,
    },
    {
        id: 'ai_pain',
        type: 'multi-select',
        label: '서비스 경험',
        q: '기존 AI 서비스에서 불만족스러웠던 부분은?',
        qHighlight: '(최대 2개)',
        condition: (a) => (a.role as number) <= 1 && (a.ai_exp as number) === 0,
        maxSelect: 2,
        gridLayout: true,
        options: AI_PAIN_OPTIONS,
    },
    {
        id: 'non_user_reason',
        type: 'select',
        label: '서비스 경험',
        q: '아직 AI 서비스를 사용해보지 않은 이유는?',
        condition: (a) => (a.role as number) <= 1 && (a.ai_exp as number) === 1,
        options: NON_USER_REASON_OPTIONS,
    },
    {
        id: 'revenue',
        type: 'select',
        label: '통계 조사',
        q: '월 평균 매출 규모는 어느 정도인가요?',
        condition: (a) => (a.role as number) <= 1,
        options: [
            { text: '100만원 ↓' },
            { text: '100 ~ 500만원' },
            { text: '500 ~ 2,000만원' },
            { text: '2,000 ~ 5,000만원' },
            { text: '5,000만 ~ 1억원' },
            { text: '1억원 ↑' },
        ],
    },
    {
        id: 'seller_main_pain',
        type: 'input',
        label: '추가 정보',
        q: 'Q. 쇼핑몰을 운영하면서 겪는 가장 큰 고충이 무엇인가요?',
        inputSub: '(재고 리스크, cs 등등..)',
        placeholder: '',
        btnText: '다음',
        skipText: '건너뛰기',
        optional: true,
        requireForNext: true,
        condition: (a) => (a.role as number) <= 1,
    },
    {
        id: 'link',
        type: 'input',
        label: '추가 정보',
        q: '운영중인 쇼핑몰의 이름을 알려주세요.',
        inputSub: `작성해주신 대표님에 한해, 더 큰 혜택을 드립니다.\n신뢰성을 위한 지표일뿐, 어떠한 활용도 하지 않습니다.`,
        placeholder: '',
        btnText: '완료',
        skipText: '건너뛰기',
        optional: true,
        requireForNext: true,
        condition: (a) => (a.role as number) <= 1,
    },

    /* ══════════════════════════════════════════════════
     *  Branch B: Preparation / Interest (role 2, 3)
     * ══════════════════════════════════════════════════ */
    {
        id: 'prep_stage',
        type: 'select',
        label: '준비 현황',
        q: '현재 어느 단계에서 막히시나요?',
        condition: (a) => (a.role as number) >= 2,
        options: [
            { text: '사입 방법' },
            { text: '쇼핑몰 세팅' },
            { text: '막연한 상태' },
            { text: '의류컷 촬영 및 보정' },
            { text: `쇼핑몰 무드 및\n브랜딩 설정` },
        ],
    },
    {
        id: 'prep_method',
        type: 'select',
        label: '준비 현황',
        q: '어떤 방식을 위주로 운영하려하시나요?',
        condition: (a) => (a.role as number) >= 2,
        options: [
            { text: '사입' },
            { text: '샘플 제작' },
        ],
    },
    {
        id: 'prep_model',
        type: 'select',
        label: '준비 현황',
        q: '피팅모델은 누가 하나요?',
        condition: (a) => (a.role as number) >= 2,
        options: [
            { text: '직접 한다' },
            { text: '직접 하지만 얼굴노출을 최소화한다' },
            { text: '직원 or 외주를{{mbr}}맡길 생각이다' },
        ],
    },
    {
        id: 'prep_reason',
        type: 'select',
        label: '준비 현황',
        q: '아직 쇼핑몰을 안하는 이유는 무엇인가요?',
        condition: (a) => (a.role as number) >= 2,
        options: [
            { text: '뭐부터 해야할지{{mbr}}모르겠다' },
            { text: '시간이 부족하다' },
            { text: '상세페이지 제작이 막막하다' },
            { text: '비용이 부담된다' },
        ],
    },
    {
        id: 'prep_features',
        type: 'multi-select',
        label: '니즈 파악',
        q: '어떤 기능이 가장 도움이 될 거 같나요?',
        qHighlight: '(최대 2개)',
        condition: (a) => (a.role as number) >= 2,
        maxSelect: 2,
        gridLayout: true,
        options: FEATURES_OPTIONS,
    },
    {
        id: 'prep_usage',
        type: 'select',
        label: '니즈 파악',
        q: '어떻게 주로 쓰실거 같나요?',
        condition: (a) => (a.role as number) >= 2,
        options: [
            { text: '기존 촬영컷 활용하여 생성' },
            { text: '의류사진 + 레퍼런스로 새롭게 생성' },
        ],
    },
    {
        id: 'prep_ai_exp',
        type: 'select',
        label: '서비스 경험',
        q: '쇼핑몰을 위한 타 AI 서비스를 써보신 적 있나요?',
        condition: (a) => (a.role as number) >= 2,
        options: [
            { text: '네, 써봤습니다' },
            { text: '아니요, 처음입니다' },
        ],
    },
    {
        id: 'prep_ai_name',
        type: 'input',
        label: '서비스 경험',
        q: '사용해 보신 서비스 이름을 알려주세요.',
        placeholder: '',
        btnText: '다음',
        skipText: '건너뛰기',
        optional: true,
        requireForNext: true,
        condition: (a) => (a.role as number) >= 2 && (a.prep_ai_exp as number) === 0,
    },
    {
        id: 'prep_ai_pain',
        type: 'multi-select',
        label: '서비스 경험',
        q: '기존 AI 서비스에서 불만족스러웠던 부분은?',
        qHighlight: '(최대 2개)',
        condition: (a) => (a.role as number) >= 2 && (a.prep_ai_exp as number) === 0,
        maxSelect: 2,
        gridLayout: true,
        options: AI_PAIN_OPTIONS,
    },
    {
        id: 'prep_non_user',
        type: 'select',
        label: '서비스 경험',
        q: '아직 AI 서비스를 사용해보지 않은 이유는?',
        condition: (a) => (a.role as number) >= 2 && (a.prep_ai_exp as number) === 1,
        options: NON_USER_REASON_OPTIONS,
    },
    {
        id: 'prep_barrier',
        type: 'input',
        label: '추가 정보',
        q: `준비 과정에서 "이것만 해결되면 바로 시작할 수 있다" 싶은 부분은 무엇인가요?`,
        placeholder: '',
        btnText: '완료',
        skipText: '건너뛰기',
        optional: true,
        requireForNext: true,
        condition: (a) => (a.role as number) >= 2,
    },

    /* ── Done ── */
    {
        id: 'done',
        type: 'done',
    },
];
