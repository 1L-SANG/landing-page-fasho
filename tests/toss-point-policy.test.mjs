import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('landing publishes the Toss point top-up limits consistently', () => {
  const terms = read('content/legal/terms-seller.md');
  const refund = read('content/legal/refund.md');
  const faq = read('src/components/posts/faq-section.tsx');

  for (const text of [terms, refund]) {
    assert.match(text, /충전된 포인트의 이용기간과 환불가능기간은 결제시점으로부터 1년 이내로 제한됩니다/);
    assert.match(text, /구독 이용기간[^\n]*종료[^\n]*소멸/);
    assert.match(text, /환불[^\n]*원 결제수단|원 결제수단[^\n]*환불/);
  }
  assert.doesNotMatch(faq, /추가로[^\n]*구매한[^\n]*크레딧은 소멸하지/);
  assert.match(faq, /2026년 11월 23일 이후 추가로 구매한 크레딧/);
  assert.match(faq, /그 전에 구매한 무기한 크레딧은 기존 조건을 유지/);
  assert.match(faq, /구독 이용기간[^\n]*종료[^\n]*구매일부터 1년/);
});
