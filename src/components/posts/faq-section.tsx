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
        question: '상품 사진을 여러 장 올릴 수 있나요?',
        answer:
            '네. 한 상품의 정면, 뒷면, 디테일 사진과 색상별 사진을 함께 올릴 수 있습니다. 사진 종류별 등록 가능 수는 업로드 화면에서 확인해 주세요.',
    },
    {
        question: 'AI로 만든 상세페이지의 저작권은 어떻게 되나요?',
        answer:
            '요금제와 관계없이 생성물에 대한 권리는 회원에게 귀속되며, 상업적으로 이용할 수 있습니다. 다만 FaceMarket 모델의 초상이 포함된 착용컷은 셀러 라이선스 이용조건에 따른 이용권만 부여됩니다. 타인의 권리를 침해하는 이용은 허용되지 않으며, 자세한 내용은 이용약관과 셀러 라이선스 이용조건을 확인해 주세요.',
    },
];

const FAQSection = () => {
    return (
        <section
            id="faq"
            className="px-6 py-16 sm:py-24 md:py-32"
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
