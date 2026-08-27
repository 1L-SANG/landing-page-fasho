import { SectionHeader } from '@/components/ui/section-header';
import { Accordion } from '@/components/ui/accordion';
import type { AccordionItem } from '@/components/ui/accordion';

const FAQ_ITEMS: AccordionItem[] = [
    {
        question: '어떤 종류의 제품 사진을 업로드할 수 있나요?',
        answer:
            '의류라면 다 가능합니다. 바닥컷, 행거컷, 마네킹컷 등 어떤 형태든 괜찮습니다.\n스마트폰으로 촬영한 사진도 충분합니다.',
    },
    {
        question: '한 번에 여러 장을 처리할 수 있나요?',
        answer:
            '네, 가능합니다. Pro plan 이상에서 병렬처리가 가능하며, 10장까지 한 번에 처리가 가능합니다.',
    },
    {
        question: '기존 쇼핑몰 플랫폼과 연동되나요?',
        answer:
            '무신사, 지그재그, 에이블리 등 주요 플랫폼과의 연동을 지원하며, API를 통한 커스텀 연동도 지원합니다.',
    },
    {
        question: 'AI로 생성한 이미지의 저작권은 어떻게 되나요?',
        answer:
            'pro plan 이상이신분들이라면 생성하신 분께 귀속됩니다. 다만 타인의 저작물을 침해했거나 불법적인 용도로 쓰였다면 책임 또한 사용자에게 귀속됩니다.',
    },
];

const FAQSection = () => {
    return (
        <section
            className="px-6 py-24 md:py-32"
            style={{
                backgroundColor: 'rgba(250, 250, 250, 0.6)',
                backdropFilter: 'blur(30px)',
            }}
        >
            <div className="mx-auto max-w-[760px]">
                <SectionHeader label="FAQ" title="자주 묻는 질문" />
                <Accordion items={FAQ_ITEMS} />
            </div>
        </section>
    );
};

export { FAQSection };
