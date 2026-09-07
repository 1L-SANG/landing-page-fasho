# 생성된 Wearless 공개 약관

이 폴더의 Markdown·JSON은 `wearless_studio` 저장소에서 내보낸 공개본이다. 직접 문구를 고치지 않는다.

- 문서 원본: `wearless_studio/documents/legal/*.md`
- 사업자 정보 원본: `wearless_studio/src/lib/companyInfo.json`
- 공개 주소: `https://wearless.kr/terms`, `/privacy`, `/refund`, `/model-license-terms`

원본을 수정한 뒤 스튜디오 저장소 루트에서 다음 명령을 실행한다.

```sh
python3 tools/legal_publish.py --landing-root /path/to/landing_page_fasho
```

내보낸 변경을 이 저장소에서도 검토·커밋하고 빌드한다. 약관은 빌드 시 정적 페이지로 생성되며 `ai.wearless.kr`의 가용성이나 로그인에 의존하지 않는다.

최초 도메인 이전 시에는 이 랜딩 페이지를 먼저 배포한 뒤 앱의 링크·리다이렉트 변경을 배포한다.
