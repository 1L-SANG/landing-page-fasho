'use client';

/* =============================================================
   AuthProvider — 랜딩의 인증 상태 하나뿐인 주인.

   랜딩이 인증으로 하는 일은 둘이다.
     1) 로그인 모달을 띄우고 소셜 OAuth 를 시작한다.
     2) OAuth 복귀를 받아 세션이 생기면 스튜디오(ai.wearless.kr)로 보낸다.

   ▶ 복귀 판정에 `wl_landing_login` 플래그(sessionStorage)를 쓴다. 세션 유무만 보고 보내면,
     이미 로그인한 사람이 랜딩을 **읽으러** 와도 첫 렌더에 앱으로 튕긴다 — 랜딩은 마케팅
     페이지라 그건 명백한 사고다. 이 탭에서 실제로 로그인을 시작했을 때만 이동한다.

   ▶ 세션은 `.wearless.kr` 공유 쿠키에 있으므로(lib/supabase) 스튜디오로 넘어가면 이미
     로그인 상태다. 여기서 토큰을 URL 로 넘기지 않는다 — 넘길 필요도 없고, 넘기면 주소창·
     리퍼러·로그에 액세스 토큰이 남는다.
   ============================================================= */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { APP_URL } from '@/lib/app-url';
import { LoginModal } from './login-modal';
import type { Provider } from './login-modal';

const PENDING_KEY = 'wl_landing_login';

/** sessionStorage 는 쿠키·사이트 데이터를 막은 브라우저에서 **접근만으로** throw 한다. */
const safeSession = {
    set() { try { sessionStorage.setItem(PENDING_KEY, '1'); } catch { /* 무시 */ } },
    get() { try { return sessionStorage.getItem(PENDING_KEY) === '1'; } catch { return false; } },
    clear() { try { sessionStorage.removeItem(PENDING_KEY); } catch { /* 무시 */ } },
};

interface AuthValue {
    session: Session | null;
    loading: boolean;
    isConfigured: boolean;
    openLogin: () => void;
    closeLogin: () => void;
    signOut: () => Promise<void>;
}

const AuthCtx = createContext<AuthValue | null>(null);

export const useAuth = (): AuthValue => {
    const ctx = useContext(AuthCtx);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null);
    // 환경변수가 없으면 부트스트랩할 세션도 없다 — 처음부터 loading=false 로 둔다.
    // (effect 안에서 setLoading(false) 로 내리면 첫 렌더 직후 불필요한 리렌더가 한 번 더 돈다.)
    const [loading, setLoading] = useState(isSupabaseConfigured);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!isSupabaseConfigured) return;
        let alive = true;
        // detectSessionInUrl:true 라 supabase-js 가 `?code=` 교환을 스스로 끝낸 뒤 세션을 준다.
        supabase.auth.getSession().then(({ data }) => {
            if (!alive) return;
            setSession(data.session);
            setLoading(false);
        }).catch(() => { if (alive) setLoading(false); });

        const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
            if (alive) setSession(next);
        });
        return () => { alive = false; sub.subscription.unsubscribe(); };
    }, []);

    // 이 탭에서 시작한 로그인이 끝났으면 스튜디오로 넘긴다.
    useEffect(() => {
        if (loading || !session || !safeSession.get()) return;
        safeSession.clear();
        window.location.href = APP_URL;
    }, [loading, session]);


    const openLogin = useCallback(() => setOpen(true), []);
    const closeLogin = useCallback(() => {
        // 취소했으면 대기 플래그도 버린다 — 남기면 다음에 세션이 생기는 순간(다른 탭 로그인 등)
        // 랜딩을 읽던 사람이 이유 없이 앱으로 튕긴다.
        safeSession.clear();
        setOpen(false);
    }, []);

    const signIn = useCallback(async (provider: Provider) => {
        safeSession.set();
        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            // 복귀 착지점은 **랜딩 자신**이다. PKCE 의 code verifier 는 시작한 곳에서만 읽을 수
            // 있으므로 여기로 돌아와야 교환이 된다. 앱으로 바로 보내면 교환이 실패한다.
            // (세션은 공유 쿠키라 교환만 끝나면 앱이 그대로 이어받는다.)
            options: { redirectTo: window.location.origin },
        });
        if (error) safeSession.clear();
        return { error: error?.message ?? null };
    }, []);

    const signOut = useCallback(async () => {
        safeSession.clear();
        await supabase.auth.signOut();
    }, []);

    const value = useMemo(
        () => ({ session, loading, isConfigured: isSupabaseConfigured, openLogin, closeLogin, signOut }),
        [session, loading, openLogin, closeLogin, signOut],
    );

    return (
        <AuthCtx.Provider value={value}>
            {children}
            {/* 세션이 있으면 열려 있어도 그리지 않는다 — 이미 로그인한 사람에게 로그인 창은
                잡음이다. 부트스트랩이 끝나기 전에 버튼을 누른 경우와 다른 탭에서 로그인한
                경우가 여기 걸린다. effect 로 닫지 않고 렌더에서 거르는 이유는, 상태를 두
                군데(세션·open)에서 관리하면 어긋나기 때문이다. */}
            {open && !session && <LoginModal onClose={closeLogin} onSignIn={signIn} />}
        </AuthCtx.Provider>
    );
};
