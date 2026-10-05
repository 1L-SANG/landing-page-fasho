import { Accordion } from '@/components/ui/accordion';
import type { AccordionItem, AccordionLink } from '@/components/ui/accordion';
import { Section } from '@/components/ui/section';
import { SectionHeader } from '@/components/ui/section-header';
import documents from '../../../content/legal/manifest.json';
import company from '../../../content/legal/company-info.json';

// 링크 라벨과 본문 속 문서 이름을 푸터와 같은 manifest 값으로 맞춘다.
const legalLink = (slug: string): AccordionLink => {
    const doc = documents.find((item) => item.slug === slug);
    if (!doc) throw new Error(`content/legal/manifest.json에 '${slug}' 문서가 없습니다.`);
    return { href: doc.path, label: doc.label };
};

const refundLink = legalLink('refund');
const termsLink = legalLink('terms-seller');
const modelLicenseLink = legalLink('seller-license-terms');

// 답변은 환불 정책(content/legal/refund.md)과 요금제 정본(pricing-section.tsx PLANS)에 적힌 사실만 쓴다. 정책이 바뀌면 함께 고친다.
// 가입 시 무료 크레딧 지급은 2026-10 운영 결정이다(지급량은 아직 표기하지 않는다).
// 질문·답변의 ' '(NBSP, U+00A0)은 '할 수 있나요?', '다음 결제일부터'처럼 의존명사·보조용언·꾸밈말과 그 뒤 말이 줄 끝에서
// 갈라지지 않게 묶는다. balance·pretty가 꺼지는 사파리와, balance가 앞 단어를 끌어내리는 크롬 모바일 모두에 듣는다.
const FAQ_ITEMS: AccordionItem[] = [
    {
        question: '결제 전에 써볼 수 있나요?',
        answer:
            '네. 가입하면 무료 크레딧을 드리므로, 결제하기 전에 직접 상세페이지를 만들어 볼 수 있습니다.',
    },
    {
        question: '언제든 해지할 수 있나요?',
        answer:
            '네. 서비스 내 구독 관리에서 언제든지 자동 갱신을 해지할 수 있으며, 해지하면 다음 결제일부터 요금이 청구되지 않습니다. 이미 결제한 이용기간은 종료일까지 그대로 이용할 수 있습니다.',
    },
    {
        question: '결제 후 환불받을 수 있나요?',
        answer: [
            '결제일로부터 7일 이내이고 그 결제로 받은 크레딧을 한 건도 사용하지 않았다면 전액 환불됩니다.',
            `크레딧을 일부 사용했다면 사용하지 않은 부분의 환불을 신청할 수 있으며, 환불 대상과 금액은 관계 법령에 따라 산정해 안내합니다. 환불은 고객센터 ${company.email}로 신청해 주세요.`,
        ],
        links: [refundLink],
    },
    {
        question: '남은 크레딧은 다음 달로 넘어가나요?',
        answer: [
            '네. 구독을 유지하는 동안 사용하지 않은 구독 크레딧은 다음 달로 이월됩니다.',
            '구독을 해지하면 이미 결제한 이용기간이 끝날 때까지 사용할 수 있고, 그 뒤에는 이월분을 포함한 남은 구독 크레딧이 모두 소멸합니다. 추가로 구매한 크레딧은 소멸하지 않습니다.',
        ],
    },
    {
        question: '결과물이 마음에 안 들면 수정할 수 있나요?',
        answer: [
            '마네킹컷은 Starter·Seller 요금제에서 1회, Pro 요금제에서 2회까지 무료로 수정할 수 있고, 모든 요금제에서 에디터 기능을 제공합니다.',
            '회사 측 사유로 생성이 실패한 경우에는 크레딧이 차감되지 않습니다.',
        ],
    },
    {
        question: '어떤 종류의 제품 사진을 업로드할 수 있나요?',
        answer:
            '의류라면 다 가능합니다. 바닥컷, 행거컷, 마네킹컷 등 어떤 형태든 괜찮습니다.\n스마트폰으로 촬영한 사진도 충분합니다.',
    },
    {
        question: '상품 사진을 여러 장 올릴 수 있나요?',
        answer:
            '네. 한 상품의 정면, 뒷면, 디테일 사진과 색상별 사진을 함께 올릴 수 있습니다. 사진 종류별 등록 가능 수는 업로드 화면에서 확인해 주세요.',
    },
    {
        question: 'AI로 만든 상세페이지의 저작권은 어떻게 되나요?',
        answer: [
            '요금제와 관계없이 생성물에 대한 권리는 회원에게 귀속되며, 상업적으로 이용할 수 있습니다.',
            `다만 FaceMarket 모델의 초상이 포함된 착용컷은 ${modelLicenseLink.label}에 따른 이용권만 부여됩니다. 타인의 권리를 침해하는 이용은 허용되지 않습니다.`,
        ],
        links: [termsLink, modelLicenseLink],
    },
];

const FAQSection = () => {
    return (
        <Section id="faq" size="compact" aria-labelledby="faq-title" className="border-t border-[rgba(34,42,53,0.08)] bg-[rgba(245,245,247,0.6)] backdrop-blur-[30px]">
            <div className="mx-auto w-full max-w-[760px]">
                <SectionHeader label="FAQ" title="자주 묻는 질문" titleId="faq-title" />
                <Accordion items={FAQ_ITEMS} />
            </div>
        </Section>
    );
};

export { FAQSection };
