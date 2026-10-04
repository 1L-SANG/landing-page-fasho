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

   토스 심사용 이메일 로그인도 원본과 같이 옮겼다(2026-09-22 오너: 두 사이트가 달라선 안 된다).
   '이메일로 로그인하기' 링크 문구를 누르면 그 자리에 폼이 펼쳐진다. 원본과 다른 점은 하나다.
     · 로컬 QA 자동 펼침(원본의 IS_LOCAL_SUPABASE): 랜딩에는 없다. 항상 접힌 채로 시작한다.

   ▶ 2026-10 접근성 보강(닫기 버튼·첫 버튼 포커스·Tab 가두기·배경 inert·스크롤 잠금·탭 ARIA,
     작은 화면 오버레이 스크롤, 보조문 14px)은 **랜딩이 먼저 반영했다.** 스튜디오 Login.jsx /
     Login.module.css / app.css(.overlay·.modal)에도 같은 값으로 옮겨야 두 화면이 다시 같아진다.
   ============================================================= */
import { useEffect, useId, useRef, useState } from 'react';
import type { FormEvent, KeyboardEvent as ReactKeyboardEvent, MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import s from './login-modal.module.css';

type Provider = 'google' | 'kakao';
type Mode = 'login' | 'signup';

// 토스 심사용 임시 이메일 로그인. 심사 종료 후 false로 바꾸고 재배포한다. 앱(wearless_studio
// src/lib/tossKeys.js 의 PG_REVIEW_LOGIN_ENABLED)과 같은 값으로 켜고 끈다.
const PG_REVIEW_LOGIN_ENABLED = true;

// Tab 순환 대상. 선택되지 않은 탭(tabIndex -1)은 방향키로만 닿으므로 뺀다.
const FOCUSABLE = 'button:not(:disabled):not([tabindex="-1"]), a[href], input:not(:disabled)';

// 자격 증명 오류일 때만 입력칸을 invalid 로 표시한다 — 연결 오류는 입력 탓이 아니다.
const EMAIL_ERROR_CREDENTIALS = '로그인하지 못했어요. 이메일과 비밀번호를 확인해 주세요.';
const EMAIL_ERROR_NETWORK = '연결하지 못했어요. 잠시 후 다시 시도해 주세요.';

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
    onSignInWithPassword: (credentials: { email: string; password: string }) => Promise<{ error: string | null }>;
}

const LoginModal = ({ onClose, onSignIn, onSignInWithPassword }: LoginModalProps) => {
    const [pending, setPending] = useState<Provider | 'email' | null>(null);
    const [error, setError] = useState('');
    const [mode, setMode] = useState<Mode>('login');
    const [consent, setConsent] = useState(false);
    const [emailOpen, setEmailOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');

    const overlayRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const googleRef = useRef<HTMLButtonElement>(null);
    const loginTabRef = useRef<HTMLButtonElement>(null);
    const signupTabRef = useRef<HTMLButtonElement>(null);
    const emailInputRef = useRef<HTMLInputElement>(null);
    const pressedBackdrop = useRef(false);

    const uid = useId();
    const loginTabId = `${uid}-tab-login`;
    const signupTabId = `${uid}-tab-signup`;
    const panelId = `${uid}-panel`;
    const emailErrorId = `${uid}-email-error`;

    const isSignup = mode === 'signup';
    // 동의 없이는 가입 버튼이 눌리지 않는다 — 원본과 같은 규칙이다.
    const blocked = isSignup && !consent;
    const credentialsInvalid = emailError === EMAIL_ERROR_CREDENTIALS;

    // 원본 Modal 은 document.body 로 포탈한다. 랜딩에도 같은 이유가 있다 —
    // 오버레이의 inset:0 이 transform 을 건 조상(섹션 애니메이션)에 갇히면 화면 일부만 덮는다.
    // SSR 가드는 두지 않는다: 이 컴포넌트는 AuthProvider 가 open(사용자 클릭)일 때만 그리므로
    // 서버 렌더를 지나가지 않는다 — document 는 항상 있다.

    // 열려 있는 동안 대화상자 밖을 잠근다: 배경 inert, 페이지 스크롤 잠금, 첫 CTA(Google)에 포커스.
    // 닫힐 때는 거꾸로 풀고 연 자리로 포커스를 돌려준다.
    useEffect(() => {
        const prev = document.activeElement as HTMLElement | null;
        const bg = Array.from(document.body.children).filter(
            (el) => el !== overlayRef.current && !el.hasAttribute('inert'),
        );
        bg.forEach((el) => el.setAttribute('inert', ''));

        const html = document.documentElement;
        const prevOverflow = html.style.overflow;
        const prevGutter = html.style.scrollbarGutter;
        html.style.overflow = 'hidden';
        // 스크롤바가 사라진 폭만큼 뒤 페이지가 옆으로 밀리지 않게 자리를 남긴다.
        html.style.scrollbarGutter = 'stable';

        (googleRef.current ?? modalRef.current)?.focus({ preventScroll: true });

        return () => {
            html.style.overflow = prevOverflow;
            html.style.scrollbarGutter = prevGutter;
            // inert 를 먼저 풀어야 포커스가 들어간다. 연 버튼이 사라졌거나(모바일 메뉴 등) 화면 폭이 1024 를
            // 넘나들어 display:none 이 됐으면(헤더 데스크톱 버튼 ↔ 햄버거) focus() 가 먹지 않으므로 지금 보이는 헤더 버튼으로.
            bg.forEach((el) => el.removeAttribute('inert'));
            const canFocus = (el: HTMLElement | null | undefined): el is HTMLElement =>
                !!el && el !== document.body && el.isConnected && el.getClientRects().length > 0;
            const target = canFocus(prev)
                ? prev
                : Array.from(
                    document.querySelectorAll<HTMLElement>(
                        'header button[aria-label="로그인 또는 회원가입"], header button[aria-expanded]',
                    ),
                ).find(canFocus);
            target?.focus();
        };
    }, []);

    // 원본 Modal 과 같은 Escape 처리. 진행 중인 로그인이 있으면 취소가 아니다 —
    // 프로바이더로 넘어가는 중의 Esc 를 취소로 처리하면 이동만 남고 UI 는 되돌아가 어긋난다.
    // Tab 은 대화상자 안에서만 돈다(배경은 inert 라 밖으로 나가면 브라우저 주소창으로 빠진다).
    useEffect(() => {
        const h = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (pending === null) onClose();
                return;
            }
            if (e.key !== 'Tab') return;
            const modal = modalRef.current;
            if (!modal) return;
            const items = Array.from(modal.querySelectorAll<HTMLElement>(FOCUSABLE));
            if (items.length === 0) {
                e.preventDefault();
                modal.focus();
                return;
            }
            const first = items[0];
            const last = items[items.length - 1];
            const active = document.activeElement;
            const outside = !modal.contains(active);
            if (e.shiftKey && (active === first || active === modal || outside)) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && (active === last || outside)) {
                e.preventDefault();
                first.focus();
            }
        };
        window.addEventListener('keydown', h);
        return () => window.removeEventListener('keydown', h);
    }, [onClose, pending]);

    // '이메일로 로그인하기' 버튼은 폼이 펼쳐지면 사라진다 — 포커스가 body 로 떨어지지 않게 첫 입력으로 옮긴다.
    useEffect(() => {
        if (emailOpen) emailInputRef.current?.focus();
    }, [emailOpen]);

    const selectTab = (next: Mode) => {
        setMode(next);
        (next === 'login' ? loginTabRef : signupTabRef).current?.focus();
    };

    // WAI-ARIA 탭 패턴: 좌우 방향키는 두 탭을 오가고, Home/End 는 처음/끝 탭. 진행 중에는 바꾸지 않는다.
    const onTabsKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
        if (pending !== null) return;
        let next: Mode | null = null;
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') next = mode === 'login' ? 'signup' : 'login';
        else if (e.key === 'Home') next = 'login';
        else if (e.key === 'End') next = 'signup';
        if (!next) return;
        e.preventDefault();
        selectTab(next);
    };

    // 배경에서 시작한 누름만 닫기로 센다 — 입력칸에서 글자를 끌어 선택하다 배경에서 놓거나,
    // 짧은 화면에서 오버레이 스크롤바를 잡았을 때 창이 닫히지 않게 한다.
    const onBackdropPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
        pressedBackdrop.current = e.target === e.currentTarget && e.clientX < e.currentTarget.clientWidth;
    };
    const onBackdropClick = (e: ReactMouseEvent<HTMLDivElement>) => {
        const fromBackdrop = pressedBackdrop.current && e.target === e.currentTarget;
        pressedBackdrop.current = false;
        if (fromBackdrop && pending === null) onClose();
    };

    const handle = async (provider: Provider) => {
        if (blocked || pending !== null) return;
        setPending(provider);
        setError('');
        const { error: err } = await onSignIn(provider);
        // 성공하면 페이지가 통째로 프로바이더로 넘어가 언마운트된다 — 아래는 실패에서만 돈다.
        if (err) { setError(err); setPending(null); }
    };

    const handleEmail = async (e: FormEvent) => {
        e.preventDefault();
        if (!PG_REVIEW_LOGIN_ENABLED || mode !== 'login' || pending !== null) return;
        setPending('email');
        setEmailError('');
        try {
            const { error: err } = await onSignInWithPassword({ email: email.trim(), password });
            if (err) {
                setEmailError(EMAIL_ERROR_CREDENTIALS);
                setPending(null);
                return;
            }
            // 성공 — 세션이 생기면 AuthProvider 가 이 모달을 그리지 않고 앱으로 보낸다.
            setPassword('');
        } catch {
            setEmailError(EMAIL_ERROR_NETWORK);
            setPending(null);
        }
    };

    return createPortal(
        <div ref={overlayRef} className={s.overlay} onPointerDown={onBackdropPointerDown} onClick={onBackdropClick}>
            <div
                ref={modalRef}
                className={s.modal}
                role="dialog"
                aria-modal="true"
                aria-label="로그인 또는 회원가입"
                tabIndex={-1}
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

                    <div className={s.tabs} role="tablist" aria-label="로그인 또는 회원가입" onKeyDown={onTabsKeyDown}>
                        <button
                            ref={loginTabRef}
                            id={loginTabId}
                            type="button"
                            role="tab"
                            aria-selected={mode === 'login'}
                            aria-controls={panelId}
                            tabIndex={mode === 'login' ? 0 : -1}
                            className={mode === 'login' ? s.tabOn : undefined}
                            onClick={() => setMode('login')}
                            disabled={pending !== null}
                        >
                            로그인
                        </button>
                        <button
                            ref={signupTabRef}
                            id={signupTabId}
                            type="button"
                            role="tab"
                            aria-selected={mode === 'signup'}
                            aria-controls={panelId}
                            tabIndex={mode === 'signup' ? 0 : -1}
                            className={mode === 'signup' ? s.tabOn : undefined}
                            onClick={() => setMode('signup')}
                            disabled={pending !== null}
                        >
                            회원가입
                        </button>
                    </div>

                    <div
                        id={panelId}
                        role="tabpanel"
                        aria-labelledby={mode === 'login' ? loginTabId : signupTabId}
                        className={s.panel}
                    >
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
                                ref={googleRef}
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
                                {/* 누르면 이 버튼이 사라지므로 포커스는 회원가입 탭으로 옮긴다. */}
                                <button
                                    type="button"
                                    className={s.linkBtn}
                                    onClick={() => selectTab('signup')}
                                    disabled={pending !== null}
                                >
                                    회원가입
                                </button>
                            </p>
                        )}

                        {PG_REVIEW_LOGIN_ENABLED && mode === 'login' && !emailOpen && (
                            <p className={s.notice}>
                                이메일로 로그인하고 싶다면?{' '}
                                <button
                                    type="button"
                                    className={s.linkBtn}
                                    onClick={() => setEmailOpen(true)}
                                    disabled={pending !== null}
                                >
                                    이메일로 로그인하기
                                </button>
                            </p>
                        )}

                        {PG_REVIEW_LOGIN_ENABLED && mode === 'login' && emailOpen && (
                            <div className={s.emailLogin}>
                                <form className={s.emailForm} onSubmit={handleEmail} aria-label="이메일 로그인" aria-busy={pending === 'email'}>
                                    <label>
                                        이메일
                                        <input ref={emailInputRef} type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                            autoComplete="username" autoCapitalize="none" spellCheck={false} required disabled={pending !== null}
                                            aria-invalid={credentialsInvalid || undefined}
                                            aria-describedby={emailError ? emailErrorId : undefined} />
                                    </label>
                                    <label>
                                        비밀번호
                                        <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)}
                                            autoComplete="current-password" required disabled={pending !== null}
                                            aria-invalid={credentialsInvalid || undefined}
                                            aria-describedby={emailError ? emailErrorId : undefined} />
                                    </label>
                                    {emailError && <p id={emailErrorId} className={s.emailError} role="alert">{emailError}</p>}
                                    <button type="submit" className={`${s.btn} ${s.emailSubmit}`} disabled={pending !== null}>
                                        {pending === 'email' ? '로그인 중…' : '이메일로 로그인'}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>

                {/* 닫기는 Esc·배경 클릭에 더해 눈에 보이는 수단이 필요하다(터치·스크린리더). 이동 중에는 취소가 아니라 잠근다. */}
                <button
                    type="button"
                    className={s.close}
                    aria-label="닫기"
                    onClick={onClose}
                    disabled={pending !== null}
                >
                    <X size={18} strokeWidth={1.75} aria-hidden="true" />
                </button>
            </div>
        </div>,
        document.body,
    );
};

export { LoginModal };
export type { Provider };
