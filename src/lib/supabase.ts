'use client';

/* =============================================================
   랜딩의 Supabase 클라이언트 — **인증 전용**이다.
   랜딩은 데이터를 읽지 않는다. 여기서 하는 일은 소셜 로그인 하나뿐이고, 로그인이 끝나면
   사용자는 스튜디오(ai.wearless.kr)로 넘어간다.

   앱(wearless_studio/src/lib/supabase.js)과 **같은 프로젝트·같은 storageKey·같은 저장소**를
   써야 한다. 셋 중 하나라도 어긋나면 세션이 갈라져 랜딩에서 로그인해도 앱은 로그아웃이다.
     · 프로젝트: NEXT_PUBLIC_SUPABASE_URL 이 앱의 VITE_SUPABASE_URL 과 같아야 한다.
     · storageKey: 지정하지 않는다 — supabase-js 가 프로젝트 ref 로 만들어 주는 기본값
       (`sb-<ref>-auth-token`)이 양쪽에서 자동으로 같아진다. **손대지 마라.**
     · 저장소: `.wearless.kr` 공유 쿠키(auth-cookie-storage).

   flowType 도 앱과 같은 pkce 다. detectSessionInUrl 은 여기서만 true 인데,
   OAuth 복귀 착지점이 랜딩이라 `?code=` 교환을 이 클라이언트가 직접 해야 하기 때문이다
   (앱은 AuthProvider 가 명시적으로 교환한다).
   ============================================================= */
import { createClient } from '@supabase/supabase-js';
import { cookieStorage } from './auth-cookie-storage';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** 환경변수가 없으면 로그인 UI 자체를 숨긴다 — 눌러도 아무 일이 없는 버튼을 내놓지 않는다. */
export const isSupabaseConfigured = Boolean(url && anonKey);

// 미설정 시 createClient 가 모듈 로드에서 throw 하면 랜딩 전체가 흰 화면이 된다.
// 형식상 유효한 placeholder 로 만들어 두고, 위 플래그로 UI 를 가린다.
export const supabase = createClient(
    url || 'https://placeholder.supabase.co',
    anonKey || 'placeholder-anon-key',
    {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
            flowType: 'pkce',
            storage: cookieStorage,
        },
    },
);
