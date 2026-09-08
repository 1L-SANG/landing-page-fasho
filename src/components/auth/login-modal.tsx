'use client';

/* =============================================================
   LoginModal — 스튜디오(ai.wearless.kr)의 LoginGate 와 **같은 화면**이다.
   원본: wearless_studio/src/features/auth/Login.jsx.
   마크업 구조·클래스 이름·문구·아이콘을 그대로 옮겼고, 스타일은 login-modal.module.css 가
   원본의 Login.module.css + app.css(.overlay/.modal) 를 값 그대로 복제한다.

   랜딩에서 로그인한 사람이 곧바로 보게 될 화면이 스튜디오라서, 여기서 다른 인상을 주면
   두 화면이 서로 다른 서비스처럼 보인다. **원본이 바뀌면 여기도 같이 바꿔라.**

   원본과 의도적으로 다른 곳은 두 군데다.
     · 부제: 원본 셀러 문구는 '마네킹컷 생성으로 이어가세요' 인데, 그건 분석 CTA 에서 모달을
       띄웠을 때의 다음 단계다. 랜딩에서는 그 맥락이 없어 '상세페이지 제작' 으로 바꿨다.
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

                    <p className={s.subtitle}>
                        소셜 계정으로 로그인하고<br />상세페이지 제작을 이어가세요.
                    </p>

                    <div className={s.buttons}>
                        <button
                            type="button"
                            className={`${s.btn} ${s.google}`}
                            onClick={() => handle('google')}
                            disabled={pending !== null}
                        >
                            <span className={s.icon}><GoogleIcon /></span>
                            {pending === 'google' ? '이동 중…' : 'Google로 계속하기'}
                        </button>
                        <button
                            type="button"
                            className={`${s.btn} ${s.kakao}`}
                            onClick={() => handle('kakao')}
                            disabled={pending !== null}
                        >
                            <span className={s.icon}><KakaoIcon /></span>
                            {pending === 'kakao' ? '이동 중…' : '카카오로 계속하기'}
                        </button>
                    </div>

                    {error && <p className={s.error} role="alert">{error}</p>}

                    {/* 원본과 같은 문구 — 같은 서비스의 같은 동의다. */}
                    <p className={s.hint}>계속하면 서비스 약관에 동의하는 것으로 간주됩니다.</p>
                </div>
            </div>
        </div>,
        document.body,
    );
};

export { LoginModal };
export type { Provider };
