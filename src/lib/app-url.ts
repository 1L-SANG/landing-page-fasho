// Wearless 상세페이지 스튜디오 (실서비스) 진입 URL
// NEXT_PUBLIC_APP_URL 로 덮어쓸 수 있다 — 앱을 로컬(vite dev)로 띄워 놓고 랜딩에서
// 실제로 눌러 보려면 이 값을 바꿔야 한다. 안 주면 실서비스로 간다.
export const APP_URL = (process.env.NEXT_PUBLIC_APP_URL || 'https://ai.wearless.kr').replace(/\/$/, '');

/**
 * 요금제 — 실서비스 라우트는 `/pricing` 이다 (`/price` 는 별칭일 뿐).
 * 이 화면은 로그인 없이도 열린다(앱 App.jsx 에서 RequireAuth 밖). 가격을 보러 온 사람이
 * 가격을 보고, 결제 버튼을 누를 때 비로소 로그인 모달이 뜬다.
 */
export const APP_PRICING_URL = `${APP_URL}/pricing`;

/**
 * 로그인 — `?login=1` 은 앱 밖에서 로그인 모달을 여는 **유일한** 수단이다.
 * 앱의 로그인 모달(LoginGate)은 openLogin() 호출로만 열려서, 링크만으로는 띄울 수 없다.
 * 앱의 LoginQueryGate 가 이 쿼리를 한 번 소비하고 주소창에서 지운다.
 * 이미 로그인된 사람에게는 모달 없이 앱이 그대로 열린다.
 *
 * 루트(`/?login=1`)로 보내지 마라. 앱의 `/` 는 RootRedirect 가 주인이고, 그건 로그인
 * 복귀 목표(wl_postLogin)를 소비해 이동하는 화면이다 — 거기에 로그인 게이트를 겹치면
 * 복귀 목표로 `/` 가 심겨 자기 자신으로 돌아오는 경로가 된다.
 * `/create/input` 은 앱 상단바의 '로그인' 이 쓰는 복귀 목표와 같은 값이다(shell.jsx).
 */
export const APP_LOGIN_URL = `${APP_URL}/create/input?login=1`;

export const goToApp = () => {
    window.location.href = APP_URL;
};

/** 로그인 → 실서비스에서 로그인 모달을 띄운 채로 진입 */
export const goToLogin = () => {
    window.location.href = APP_LOGIN_URL;
};

/** 요금제 선택 → 실서비스 요금제 페이지로 이동 */
export const goToPricing = () => {
    window.location.href = APP_PRICING_URL;
};
