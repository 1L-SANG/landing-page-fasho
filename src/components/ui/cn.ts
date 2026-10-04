import { extendTailwindMerge, type ClassNameValue } from 'tailwind-merge';

// Tailwind v4 에서는 text-* 가 leading-* 를 덮지 않는다(leading 이 --tw-leading 으로 우선).
// 기본 설정은 v3 기준으로 뒤에 온 text-[17px] 이 앞의 leading-none 을 지우므로 이 충돌만 끈다.
const twMergeV4 = extendTailwindMerge({
    override: {
        conflictingClassGroups: {
            'font-size': [],
        },
    },
});

/** 클래스 병합: 뒤에 온 클래스가 같은 속성의 앞 클래스를 대체한다. */
const cn = (...classLists: ClassNameValue[]) => twMergeV4(...classLists);

export { cn };
