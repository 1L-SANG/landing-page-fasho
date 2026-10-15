import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const source = new URL('../src/lib/landing-handoff.ts', import.meta.url);
const load = ({ reduced = false, failAnimation = false, hasOrb = true, pathname = '/' } = {}) => {
    const attributes = new Map();
    const ctaAttributes = new Map();
    const timers = new Map();
    const listeners = new Map();
    const navigations = [];
    let now = 0;
    let id = 0;
    const root = {
        getAttribute: (name) => attributes.get(name) ?? null,
        setAttribute: (name, value) => {
            if (failAnimation && value === 'leaving') throw new Error('animation unavailable');
            attributes.set(name, value);
        },
        removeAttribute: (name) => attributes.delete(name),
    };
    const cta = {
        matches: () => false,
        setAttribute: (name, value) => ctaAttributes.set(name, value),
        removeAttribute: (name) => ctaAttributes.delete(name),
    };
    const fire = (type, event = {}) => {
        for (const listener of listeners.get(type) ?? []) listener(event);
    };
    const window = {
        matchMedia: () => ({ matches: reduced }),
        location: { assign: (href) => navigations.push(href) },
        addEventListener: (name, listener) => {
            const set = listeners.get(name) ?? new Set();
            set.add(listener);
            listeners.set(name, set);
        },
        removeEventListener: (name, listener) => listeners.get(name)?.delete(listener),
        dispatchEvent: (event) => { fire(event.type, event); },
        setTimeout: (callback, delay) => { timers.set(++id, { callback, time: now + delay }); return id; },
        clearTimeout: (key) => timers.delete(key),
        requestAnimationFrame: (callback) => window.setTimeout(callback, 16),
        cancelAnimationFrame: (key) => timers.delete(key),
    };
    const exports = {};
    const context = vm.createContext({
        exports, window,
        document: { documentElement: root, body: { offsetHeight: 900 }, querySelector: () => hasOrb ? {} : null },
        Event: class { constructor(type) { this.type = type; } },
    });
    vm.runInContext(ts.transpileModule(readFileSync(source, 'utf8'), {
        compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    }).outputText, context);
    // 홈을 렌더하지 않아도 공통 헤더의 실제 effect가 이동 복구를 설치하는지 확인한다.
    const mountHeader = () => {
        const effects = [];
        const headerExports = {};
        vm.runInNewContext(ts.transpileModule(readFileSync(new URL('../src/components/common/Header.tsx', import.meta.url), 'utf8'), {
            compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
        }).outputText, {
            exports: headerExports,
            window,
            document: { ...context.document, getElementById: () => null },
            require: (name) => {
                switch (name) {
                    case 'react': return {
                        useEffect: (effect) => effects.push(effect),
                        useState: (initial) => [initial, () => {}],
                        useRef: () => ({ current: null }),
                        useSyncExternalStore: (_subscribe, _snapshot, serverSnapshot) => serverSnapshot(),
                    };
                    case 'react/jsx-runtime': return { jsx: () => null, jsxs: () => null };
                    case 'next/navigation': return { usePathname: () => pathname };
                    case '@/lib/landing-handoff': return exports;
                    case '@/components/auth/auth-provider': return { useAuth: () => ({
                        session: null, loading: false, isConfigured: false,
                        openLogin() {}, closeLogin() {}, signOut() {},
                    }) };
                    case '@/components/ui/cn': return { cn: () => '' };
                    default: return {};
                }
            },
        });
        headerExports.Header();
        const cleanups = effects.map((effect) => effect());
        return () => cleanups.forEach((cleanup) => cleanup?.());
    };
    const tick = (milliseconds) => {
        now += milliseconds;
        for (const [key, timer] of [...timers]) {
            if (timer.time > now) continue;
            timers.delete(key);
            timer.callback();
        }
    };
    const click = (overrides = {}) => {
        const event = {
            button: 0, metaKey: false, ctrlKey: false, shiftKey: false, altKey: false,
            defaultPrevented: false,
            currentTarget: { ...cta, href: 'https://ai.wearless.kr/pricing?plan=seller&from=landing', target: '', hasAttribute: () => false },
            preventDefault() { this.defaultPrevented = true; },
            ...overrides,
        };
        // HTMLElement.click()은 React의 onClick 경로를 다시 탄다.
        event.currentTarget.click = () => exports.handleAppLinkClick(click({ currentTarget: event.currentTarget }));
        return event;
    };
    return { api: exports, root, cta, ctaAttributes, navigations, fire, tick, click, mountHeader };
};

test('waits 420ms and ignores repeated starts even from another CTA', () => {
    const h = load();
    h.api.startAppHandoff('https://ai.wearless.kr/?from=landing', h.cta);
    h.api.startAppHandoff('https://ai.wearless.kr/pricing?plan=pro&from=landing');
    assert.equal(h.ctaAttributes.has('data-handoff-pressed'), true);
    assert.equal(h.root.getAttribute('data-handoff'), 'leaving');
    h.tick(419);
    assert.equal(h.navigations.length, 0);
    h.tick(1);
    h.tick(1000);
    assert.deepEqual(h.navigations, ['https://ai.wearless.kr/?from=landing']);
});

test('reduced motion navigates immediately without leaving state', () => {
    const h = load({ reduced: true });
    h.api.startAppHandoff('/?from=landing', h.cta);
    assert.deepEqual(h.navigations, ['/?from=landing']);
    assert.equal(h.root.getAttribute('data-handoff'), null);
});

test('an animation setup failure still navigates once', () => {
    const h = load({ failAnimation: true });
    h.api.startAppHandoff('/?from=landing', h.cta);
    h.tick(1000);
    assert.deepEqual(h.navigations, ['/?from=landing']);
});

test('legal pages without an orb navigate immediately', () => {
    const h = load({ hasOrb: false });
    h.api.startAppHandoff('/?from=landing', h.cta);
    assert.deepEqual(h.navigations, ['/?from=landing']);
});

test('legal-page header permits app navigation again after a bfcache return', () => {
    for (const pathname of ['/terms', '/privacy', '/refund', '/model-license-terms']) {
        const h = load({ hasOrb: false, pathname });
        const unmount = h.mountHeader();
        try {
            h.api.startAppHandoff('/?from=landing', h.cta);
            h.fire('pagehide');
            h.fire('pageshow', { persisted: true });
            h.api.startAppHandoff('/?from=landing', h.cta);
            assert.deepEqual(h.navigations, ['/?from=landing', '/?from=landing'], pathname);
        } finally {
            unmount();
        }
    }
});

test('pricing click uses its href including plan and from parameters', () => {
    const h = load();
    const event = h.click();
    h.api.handleAppLinkClick(event);
    assert.equal(event.defaultPrevented, true);
    h.tick(420);
    assert.deepEqual(h.navigations, ['https://ai.wearless.kr/pricing?plan=seller&from=landing']);
});

test('modifier, middle, prevented, download and new-tab link clicks keep native behavior', () => {
    for (const overrides of [{ ctrlKey: true }, { metaKey: true }, { shiftKey: true }, { altKey: true }, { button: 1 }, { defaultPrevented: true }]) {
        const h = load();
        const event = h.click(overrides);
        h.api.handleAppLinkClick(event);
        h.tick(1000);
        assert.equal(event.defaultPrevented, Boolean(overrides.defaultPrevented));
        assert.equal(h.navigations.length, 0);
    }
    for (const target of ['_blank', 'other-window']) {
        const h = load();
        const event = h.click();
        event.currentTarget.target = target;
        h.api.handleAppLinkClick(event);
        assert.equal(event.defaultPrevented, false);
    }
    const h = load();
    const event = h.click();
    event.currentTarget.hasAttribute = () => true;
    h.api.handleAppLinkClick(event);
    assert.equal(event.defaultPrevented, false);
});

test('Space activates a pricing link once; repeated and modified keys do not', () => {
    const h = load();
    const event = h.click({ key: ' ', repeat: false });
    h.api.handleAppLinkKeyDown(event);
    assert.equal(event.defaultPrevented, true);
    h.api.handleAppLinkKeyDown(h.click({ key: ' ', repeat: true }));
    h.tick(420);
    assert.equal(h.navigations.length, 1);
    const other = load();
    const modified = other.click({ key: ' ', ctrlKey: true });
    other.api.handleAppLinkKeyDown(modified);
    other.api.handleAppLinkKeyDown(other.click({ key: 'Enter' }));
    other.tick(420);
    assert.equal(modified.defaultPrevented, false);
    assert.equal(other.navigations.length, 0); // Enter uses the native click path.
});

test('bfcache return cancels pending navigation, restores immediately and permits a fresh start', () => {
    const h = load();
    const cleanup = h.api.installHandoffLifecycle();
    // Scroll fade listens to this same event, once now and again after scroll restoration.
    h.api.startAppHandoff('/first', h.cta);
    h.fire('pagehide');
    h.fire('pageshow', { persisted: true });
    assert.equal(h.root.getAttribute('data-handoff'), null);
    assert.equal(h.ctaAttributes.has('data-handoff-pressed'), false);
    h.tick(1000);
    assert.equal(h.navigations.length, 0);
    h.api.startAppHandoff('/second', h.cta);
    h.tick(420);
    assert.deepEqual(h.navigations, ['/second']);
    cleanup();
});
