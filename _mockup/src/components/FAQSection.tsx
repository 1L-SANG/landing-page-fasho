import { useState } from 'react';
import { Plus } from 'lucide-react';

const faqs = [
  {
    question: '어떤 종류의 제품 사진을 업로드할 수 있나요?',
    answer:
      '의류라면 다 가능합니다. 바닥컷, 행거컷, 마네킹컷 등 어떤 형태든 괜찮습니다. 스마트폰으로 촬영한 사진도 충분합니다.',
  },
  {
    question: '한 번에 여러 장을 처리할 수 있나요?',
    answer:
      '네, 대량 업로드 기능을 제공합니다. Pro plan 이상에서 병렬처리가 가능하며, 10장까지 한 번에 처리가 가능합니다.',
  },
  {
    question: '기존 쇼핑몰 플랫폼과 연동되나요?',
    answer:
      '무신사, 지그재그, 에이블리 등 주요 플랫폼과의 연동을 지원하며, API를 통한 커스텀 연동도 지원합니다.',
  },
    {
    question: 'AI로 생성한 이미지의 저작권은 어떻게 되나요?',
    answer:
      'pro plan 이상이신분들이라면 생성하신 분께 귀속됩니다. 다만 타인의 저작물을 침해했거나 불법적인 용도로 쓰였다면 책임 또한 사용자에게 귀속됩니다. ',
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative py-24 md:py-32 px-6" style={{ backgroundColor: 'rgba(250, 250, 250, 0.6)', backdropFilter: 'blur(30px)' }}>
      <div className="max-w-[1200px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="text-[13px] font-semibold text-[#9E9E9E] tracking-[0.12em] uppercase mb-4">
            FAQ
          </div>
          <h2 className="text-[32px] md:text-[40px] lg:text-[48px] font-bold text-[#1A1A1A] mb-4">
            자주 묻는 질문
          </h2>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-[760px] mx-auto space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white border border-[#F0F0F0] rounded-2xl overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-7 py-6 flex items-center justify-between text-left hover:bg-[#FAFAFA] transition-colors"
              >
                <span className="text-[16px] md:text-[18px] font-semibold text-[#1A1A1A] pr-4">
                  {faq.question}
                </span>
                <Plus
                  size={24}
                  className={`text-[#1A1A1A] flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-45' : 'rotate-0'
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-7 pb-6 pt-0 border-t border-[#F0F0F0]">
                  <p className="text-[16px] text-[#6B6B6B] leading-[1.7] mt-4">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}