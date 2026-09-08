'use client';

/* =============================================================
   LoginModal — 스튜디오(ai.wearless.kr)의 LoginGate 와 **같은 화면**이다.
   원본: wearless_studio/src/features/auth/Login.jsx.
   마크업 구조·클래스 이름·문구·아이콘을 그대로 옮겼고, 스타일은 login-modal.module.css 가
   원본의 Login.module.css + app.css(.overlay/.modal) 를 값 그대로 복제한다.

   랜딩에서 로그인한 사람이 곧바로 보게 될 화면이 스튜디오라서, 여기서 다른 인상을 주면
   두 화면이 서로 다른 서비스처럼 보인다. **원본이 바뀌면 여기도 같이 바꿔라.**

   ▶ 회원가입 탭의 동의는 **여기서 서버에 기록되지 않는다.** 원본도 마찬가지다 — 동의는
     소셜 버튼을 누르기 전에 받지만 그 시점엔 계정이 없어서, 앱은 sessionStorage 표시만
     남기고 OAuth 복귀 후 SignupCompletion 이 서버에 기록한다(signupConsent.js).
     sessionStorage 는 origin 별로 갈라지므로 랜딩이 남긴 표시를 앱은 읽지 못한다.
     그래서 랜딩에서 가입한 신규는 스튜디오에서 가입 완료 화면을 한 번 더 본다 —
     앱이 '회원가입 탭을 지나지 않고 들어온 신규' 를 위해 이미 갖고 있는 경로다.
     **동의의 법적 기록은 언제나 앱이 남긴다.** 이 화면은 같은 문장을 같은 자리에서 보여줄 뿐이다.

   원본과 의도적으로 다른 곳은 하나다.
     · 로컬 QA 용 이메일 폼: 랜딩에는 옮기지 않았다(운영은 소셜만 쓴다).
   ============================================================= */
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import s from './login-modal.module.css';

type Provider = 'google' | 'kakao';

/* 브랜드 로고 — Lucide(단색 스트로크) 세트와 성격이 달라 인라인 SVG 로 둔다. */
const GoogleIcon = () => (
    <svg className={s.brandIco} viewBox="0 0 48 48" aria-hidden="true">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
);

const KakaoIcon = () => (
    <svg className={s.brandIco} viewBox="0 0 24 24" fill="rgba(0,0,0,0.85)" aria-hidden="true">
        <path d="M12 3C6.48 3 2 6.58 2 10.99c0 2.86 1.9 5.37 4.76 6.78-.21.78-.76 2.82-.87 3.26-.14.55.2.54.42.39.17-.11 2.71-1.84 3.81-2.59.6.09 1.22.13 1.88.13 5.52 0 10-3.58 10-7.99S17.52 3 12 3z" />
    </svg>
);

interface LoginModalProps {
    onClose: () => void;
    onSignIn: (provider: Provider) => Promise<{ error: string | null }>;
}

const LoginModal = ({ onClose, onSignIn }: LoginModalProps) => {
    const [pending, setPending] = useState<Provider | null>(null);
    const [error, setError] = useState('');
    const [mode, setMode] = useState<'login' | 'signup'>('login');
    const [consent, setConsent] = useState(false);

    const isSignup = mode === 'signup';
    // 동의 없이는 가입 버튼이 눌리지 않는다 — 원본과 같은 규칙이다.
    const blocked = isSignup && !consent;

    // 원본 Modal 은 document.body 로 포탈한다. 랜딩에도 같은 이유가 있다 —
    // 오버레이의 inset:0 이 transform 을 건 조상(섹션 애니메이션)에 갇히면 화면 일부만 덮는다.
    // SSR 가드는 두지 않는다: 이 컴포넌트는 AuthProvider 가 open(사용자 클릭)일 때만 그리므로
    // 서버 렌더를 지나가지 않는다 — document 는 항상 있다.

    // 원본 Modal 과 같은 Escape 처리. 진행 중인 로그인이 있으면 취소가 아니다 —
    // 프로바이더로 넘어가는 중의 Esc 를 취소로 처리하면 이동만 남고 UI 는 되돌아가 어긋난다.
    useEffect(() => {
        const h = (e: KeyboardEvent) => { if (e.key === 'Escape' && pending === null) onClose(); };
        window.addEventListener('keydown', h);
        return () => window.removeEventListener('keydown', h);
    }, [onClose, pending]);

    const handle = async (provider: Provider) => {
        if (blocked || pending !== null) return;
        setPending(provider);
        setError('');
        const { error: err } = await onSignIn(provider);
        // 성공하면 페이지가 통째로 프로바이더로 넘어가 언마운트된다 — 아래는 실패에서만 돈다.
        if (err) { setError(err); setPending(null); }
    };

    return createPortal(
        <div className={s.overlay} onClick={() => { if (pending === null) onClose(); }}>
            <div
                className={s.modal}
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-label="로그인"
            >
                <div className={s.gate}>
                    <div className={s.brand}>
                        {/* 자산은 **스튜디오와 같은 파일**이다 — wearless_studio/public/assets/brand 에서
                            그대로 복사해 같은 경로(/assets/brand/…)에 두었다. 랜딩 루트의
                            /logo.svg·/wordmark.svg 는 다른 파일이라(해시가 다르다) 그걸 쓰면
                            로그인 창만 다른 브랜드처럼 보인다. 헤더·푸터가 쓰는 랜딩 자산과
                            섞지 마라. */}
                        {/* eslint-disable-next-line @next/next/no-img-element -- 원본과 같은 높이 기준
                            락업이다. next/image 는 width/height 를 요구해 종횡비를 고정해야 하는데,
                            그러면 원본(height 만 지정)과 어긋난다. */}
                        <img className={s.logo} src="/assets/brand/logo.svg" alt="" />
                        <div className={s.mark}>
                            {/* eslint-disable-next-line @next/next/no-img-element -- 위와 같은 이유 */}
                            <img className={s.wordmark} src="/assets/brand/wordmark.png" alt="Wearless" />
                            <p className={s.suffix}>Studio</p>
                        </div>
                    </div>

                    <div className={s.tabs} role="tablist" aria-label="로그인 또는 회원가입">
                        <button
                            type="button"
                            role="tab"
                            aria-selected={mode === 'login'}
                            className={mode === 'login' ? s.tabOn : undefined}
                            onClick={() => setMode('login')}
                            disabled={pending !== null}
                        >
                            로그인
                        </button>
                        <button
                            type="button"
                            role="tab"
                            aria-selected={mode === 'signup'}
                            className={mode === 'signup' ? s.tabOn : undefined}
                            onClick={() => setMode('signup')}
                            disabled={pending !== null}
                        >
                            회원가입
                        </button>
                    </div>

                    {/* 두 탭이 같은 한 줄을 쓴다(2026-09-08 오너) — 로그인하러 온 사람에게도
                        같은 약속을 보여준다. 탭마다 다른 말을 걸면 창이 두 제품처럼 읽힌다. */}
                    <p className={s.subtitle}>
                        완성형 AI 상세페이지 서비스,<br />팔리는 상세페이지를 만드세요.
                    </p>

                    {isSignup && (
                        <label className={s.consent}>
                            <input
                                type="checkbox"
                                checked={consent}
                                onChange={(event) => setConsent(event.target.checked)}
                            />
                            <span>
                                만 19세 이상이며 <a href="/terms" target="_blank" rel="noreferrer">이용약관</a>과{' '}
                                <a href="/privacy" target="_blank" rel="noreferrer">개인정보 처리방침</a>에 동의합니다.
                            </span>
                        </label>
                    )}

                    <div className={s.buttons}>
                        <button
                            type="button"
                            className={`${s.btn} ${s.google}`}
                            onClick={() => handle('google')}
                            disabled={pending !== null || blocked}
                        >
                            <span className={s.icon}><GoogleIcon /></span>
                            {pending === 'google' ? '이동 중…' : isSignup ? 'Google로 가입하기' : 'Google로 계속하기'}
                        </button>
                        <button
                            type="button"
                            className={`${s.btn} ${s.kakao}`}
                            onClick={() => handle('kakao')}
                            disabled={pending !== null || blocked}
                        >
                            <span className={s.icon}><KakaoIcon /></span>
                            {pending === 'kakao' ? '이동 중…' : isSignup ? '카카오로 가입하기' : '카카오로 계속하기'}
                        </button>
                    </div>

                    {error && <p className={s.error} role="alert">{error}</p>}

                    {mode === 'login' && (
                        <p className={s.notice}>
                            Wearless가 처음이라면?{' '}
                            <button type="button" className={s.linkBtn} onClick={() => setMode('signup')}>
                                회원가입
                            </button>
                        </p>
                    )}
                </div>
            </div>
        </div>,
        document.body,
    );
};

export { LoginModal };
export type { Provider };
