import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const code = ts.transpileModule(readFileSync(new URL('../src/components/posts/luminous-orb-background.tsx', import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
}).outputText;

const load = ({ peak = '1', reduced = false, animations = [] } = {}) => {
    const listeners = new Map();
    const effects = [];
    const frames = new Map();
    let frameId = 0;
    let handoff = null;
    let clock = 4500;
    const style = { opacity: '' };
    const element = { style, querySelectorAll: () => [{ getAnimations: () => animations }] };
    const exports = {};
    const window = {
        scrollY: 0, innerHeight: 1000,
        matchMedia: (query) => ({
            get matches() { return query.includes('prefers-reduced-motion') ? reduced : true; },
            addEventListener: (name, listener) => window.addEventListener(`${query}:${name}`, listener),
            removeEventListener: (name, listener) => window.removeEventListener(`${query}:${name}`, listener),
        }),
        addEventListener(name, listener) {
            const set = listeners.get(name) ?? new Set();
            set.add(listener);
            listeners.set(name, set);
        },
        removeEventListener: (name, listener) => listeners.get(name)?.delete(listener),
    };
    vm.runInNewContext(code, {
        exports,
        require: (name) => name === 'react' ? {
            useEffect: (effect) => effects.push(effect),
            useLayoutEffect: (effect) => effects.push(effect),
        } : {},
        window,
        document: { documentElement: { getAttribute: () => handoff } },
        getComputedStyle: () => ({ getPropertyValue: () => peak }),
        performance: { timeOrigin: 1000 },
        Date: { now: () => clock },
        requestAnimationFrame: (callback) => { frames.set(++frameId, callback); return frameId; },
        cancelAnimationFrame: (id) => frames.delete(id),
    });
    const fire = (name, event = {}) => {
        for (const listener of listeners.get(name) ?? []) listener(event);
    };
    const flush = () => {
        const pending = [...frames.values()];
        frames.clear();
        pending.forEach((callback) => callback());
    };
    return { api: exports, ref: { current: element }, style, window, fire, flush,
        runEffects: () => effects.map((effect) => effect()),
        setHandoff: (value) => { handoff = value; },
        setClock: (value) => { clock = value; },
        setReduced: (value) => { reduced = value; },
    };
};

// 잘못된 peak 대입·꼬리 기울기·경계 처리를 잡는다. 기대값은 지시서 식으로 손계산했다.
test('scroll fade honors the configurable peak at hero, peak and tail boundaries', () => {
    const { api } = load();
    const fade = { heroFloor: 0.4, tailFloor: 0.7 };
    for (const [y, peak, want] of [
        [0, 1, 0.4], [500, 1, 0.7], [1000, 1, 1], [1300, 1, 0.85], [5000, 1, 0.7],
        [0, 0.8, 0.4], [500, 0.8, 0.6], [1000, 0.8, 0.8], [1100, 0.8, 0.75], [1500, 0.8, 0.7],
        [-100, 0.8, 0.4],
    ]) {
        assert.ok(Math.abs(api.getScrollFadeOpacity(y, 1000, fade, peak) - want) < 1e-10, `${y}, ${peak}`);
    }
});

test('scroll updates pause while leaving, then restore the saved position on reset', () => {
    const h = load({ peak: '0.8' });
    h.api.useScrollFade(h.ref, { heroFloor: 0.4, tailFloor: 0.7, peakProperty: '--wl-landing-orb-peak' });
    const cleanups = h.runEffects();
    assert.equal(h.style.opacity, '0.4');
    h.window.scrollY = 500;
    h.fire('scroll');
    h.flush();
    assert.ok(Math.abs(Number(h.style.opacity) - 0.6) < 1e-10);
    h.setHandoff('leaving');
    h.window.scrollY = 1000;
    h.fire('scroll');
    h.fire('resize');
    h.flush();
    assert.ok(Math.abs(Number(h.style.opacity) - 0.6) < 1e-10);
    h.setHandoff('resetting');
    h.fire('wl-handoff-reset');
    assert.equal(h.style.opacity, '0.8');
    cleanups.forEach((cleanup) => cleanup());
});

test('invalid peak falls back to 1 and restored overscroll keeps the hero floor', () => {
    const h = load({ peak: 'invalid' });
    h.window.scrollY = 1000;
    h.api.useScrollFade(h.ref, { heroFloor: 0.4, tailFloor: 0.7, peakProperty: '--wl-landing-orb-peak' });
    h.runEffects();
    assert.equal(h.style.opacity, '1');
    h.window.scrollY = -50;
    h.fire('wl-handoff-reset');
    assert.equal(h.style.opacity, '0.4');
});

test('wall-clock phase catches up at mount and after a bfcache restore', () => {
    const animations = [{ currentTime: 0 }, { currentTime: 0 }];
    const h = load({ animations });
    h.api.useWallClockPhase(h.ref);
    const cleanups = h.runEffects();
    assert.deepEqual(animations.map((animation) => animation.currentTime), [3500, 3500]);
    h.setClock(9200);
    h.fire('pageshow', { persisted: false });
    assert.equal(animations[0].currentTime, 3500);
    h.fire('pageshow', { persisted: true });
    assert.deepEqual(animations.map((animation) => animation.currentTime), [8200, 8200]);
    cleanups.forEach((cleanup) => cleanup());
});

test('reduced motion does not advance animation time', () => {
    const animations = [{ currentTime: 0 }];
    const h = load({ animations, reduced: true });
    h.api.useWallClockPhase(h.ref);
    h.runEffects();
    h.fire('pageshow', { persisted: true });
    assert.equal(animations[0].currentTime, 0);
});

// display:none과 reduced-motion에서 애니메이션이 다시 생성될 때 문서 경과 시간이 사라지는 결함을 잡는다.
test('ribbons revealed at the desktop breakpoint catch up to wall-clock phase', () => {
    const animations = [];
    const h = load({ animations });
    h.api.useWallClockPhase(h.ref);
    h.runEffects();
    animations.push({ currentTime: 0 });
    h.setClock(9200);
    h.fire('(min-width: 768px):change');
    h.flush();
    assert.equal(animations[0].currentTime, 8200);
});

test('turning off reduced motion synchronizes newly started animations', () => {
    const animations = [{ currentTime: 0 }];
    const h = load({ animations, reduced: true });
    h.api.useWallClockPhase(h.ref);
    h.runEffects();
    h.setClock(9200);
    h.setReduced(false);
    h.fire('(prefers-reduced-motion: reduce):change');
    h.flush();
    assert.equal(animations[0].currentTime, 8200);
});
