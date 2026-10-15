import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const css = readFileSync(new URL('../src/app/globals.css', import.meta.url), 'utf8');

test('hero lift applies only at desktop widths and returns to center with scroll', () => {
    assert.match(css, /\.orb-hero-lift\s*\{\s*translate:\s*0 calc\(var\(--orb-lift, 0px\) \* \(1 - var\(--hero-progress, 0\)\)\);\s*\}/);
    assert.match(css, /@media\s*\(min-width:\s*768px\)\s*\{\s*\.orb-hero-lift\s*\{\s*--orb-lift:\s*min\(0px, calc\(430px - 50vh\)\);\s*\}\s*\}/);
});

test('reduced motion keeps the hero lift centered', () => {
    assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{\s*\.orb-hero-lift\s*\{\s*translate:\s*none;\s*\}\s*\}/);
});

test('leaving removes the hero lift within the existing handoff travel', () => {
    assert.match(css, /html\[data-handoff="leaving"\] \.orb-hero-lift\s*\{\s*translate:\s*0 0;\s*transition:\s*translate var\(--wl-handoff-travel\) var\(--wl-handoff-ease\);\s*\}/);
});
