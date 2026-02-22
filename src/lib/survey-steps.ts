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

export const SURVEY_STEPS: SurveyStep[] = [
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
    {
        id: 'volume',
        type: 'select',
        label: '운영 현황',
        q: '일주일에 신상품을 몇개 정도 업로드하시나요?',
        condition: (a) => (a.role as number) <= 2,
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
        condition: (a) => (a.role as number) <= 2,
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
        condition: (a) => (a.role as number) <= 2,
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
        condition: (a) => (a.role as number) <= 2,
        maxSelect: 2,
        gridLayout: true,
        options: [
            { text: '레퍼런스 응용', sub: `레퍼런스 무드로 새 컷 생성` },
            { text: '쇼핑몰 정체성 유지', sub: '쇼핑몰 톤앤매너 반영한 이미지 생성' },
            { text: '체형 조절', sub: '설정한 체형 기준에 맞춰서 이미지 재생성' },
            { text: '이미지 다양화', sub: `포즈, 배경을 바꾸어 컷을 다양화` },
            { text: 'AI 모델', sub: '이질감없는 AI모델의\n 얼굴을 AI컷에 반영하여 생성' },
            { text: '기존 모델 반영', sub: '기존에 촬영하던 모델의\n 얼굴을 AI컷에 반영하여 생성' },
        ],
    },
    {
        id: 'cut_type',
        type: 'image-select',
        label: '니즈 파악',
        q: '어떠한 의류컷 위주로 생성하실 거 같나요?',
        condition: (a) => (a.role as number) <= 2,
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
        condition: (a) => (a.role as number) <= 2,
        options: [
            { text: '기존 촬영컷 활용하여 생성' },
            { text: '의류사진 + 레퍼런스로 새롭게 생성' },
        ],
    },
    {
        id: 'ai_exp',
        type: 'select',
        label: '서비스 경험',
        q: '다른 AI 이미지 생성 서비스를 써보신 적 있나요?',
        condition: (a) => (a.role as number) <= 2,
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
        condition: (a) => (a.role as number) <= 2 && (a.ai_exp as number) === 0,
    },
    {
        id: 'ai_pain',
        type: 'multi-select',
        label: '서비스 경험',
        q: '기존 AI 서비스에서 불만족스러웠던 부분은?',
        qHighlight: '(최대 2개)',
        condition: (a) => (a.role as number) <= 2 && (a.ai_exp as number) === 0,
        maxSelect: 2,
        gridLayout: true,
        options: [
            { text: `인위적인 느낌이\n강함`, sub: `자연스러운 결과물이\n나오지 않음` },
            { text: '제품의 디테일 표현이 안됨', sub: '세밀한 부분이 뭉개지고 변형됨' },
            { text: '기존 업로드물들과 통일감이 없음', sub: '쇼핑몰에 올렸던 작업물들과 결이 다름' },
            { text: '원하는 모습 구현이 안됨', sub: `의도한 결과를 만들기\n어려움` },
        ],
    },
    {
        id: 'non_user_reason',
        type: 'select',
        label: '서비스 경험',
        q: '아직 AI 서비스를 사용해보지 않은 이유는?',
        condition: (a) => (a.role as number) <= 2 && (a.ai_exp as number) === 1,
        options: [
            { text: '사용법이 어렵고 복잡할 것 같아서' },
            { text: '퀄리티가 별로일 것 같아서' },
            { text: '기존 촬영 방식이 익숙해서' },
            { text: '어떤 서비스가 있는지 몰라서' },
        ],
    },
    {
        id: 'revenue',
        type: 'select',
        label: '통계 조사',
        q: '월 평균 매출 규모는 어느 정도인가요?',
        condition: (a) => (a.role as number) <= 2,
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
        condition: (a) => (a.role as number) <= 2,
    },
    {
        id: 'done',
        type: 'done',
    },
];
