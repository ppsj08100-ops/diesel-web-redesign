# DIESEL 푸터 디자인 검토 기록

확인일: 2026-11-03

## 최종 방향

사용자는 푸터가 비어 보이는 구성을 거절하고, [기존 Figma 푸터 `923:2994`](https://www.figma.com/design/6GPeNKxLjIVbw8NeE8h3xO/?node-id=923-2994)의 **1920 × 1078px 규모를 유지하면서 세련되고 풍부하게 정돈된 화면**을 요청했습니다. Cove의 낮고 간결한 푸터는 최종 방향으로 채택하지 않았습니다.

주요 참고는 [23° Monorigine](https://www.23gradicoffee.com/)의 사진 위 타이포그래피와 [Jesko Jets](https://jeskojets.com/)의 어두운 전체 화면·비대칭 정보 배치입니다. 원본 사진이나 로고, 지구 그래픽, 메뉴 문구를 복제하지 않고 DIESEL의 데님 소재와 기존 서체에 맞게 구성했습니다.

구현한 화면은 왼쪽의 검정 데님 매크로 사진과 `For successful / living.` 문구, 오른쪽의 7개 EXPLORE 메뉴와 CLIENT SERVICE·WORLD OF DIESEL 링크로 구성됩니다. 상단의 작은 DIESEL·SINCE 1978, 우측 Back to top, 하단 정책·한국 공식 스토어·OTB·크레디트를 유지합니다. 소셜은 X → Instagram → YouTube 순서의 40px 원형 윤곽 버튼입니다.

데스크톱 최소 높이는 `max(760px, 56.145833vw)`입니다. 1920px 폭에서 1078px, 1440px 폭에서 808.5px이며 좁은 화면에서는 콘텐츠에 맞춰 늘어납니다. 모바일은 최소 `100svh`와 세로 흐름을 사용합니다. 확대된 로고를 반복하는 대신 소재 사진·브랜드 문구·주 메뉴·보조 링크의 크기 차이로 화면을 채웁니다.

## 32개 레퍼런스 확인 범위

사용자가 지정한 레퍼런스 Figma의 `7:2`·`7:3`에서 중복을 제거한 **32개 URL 모두 접속을 시도했고, 브라우저에서는 HTTP 200 응답을 확인했습니다.** 접속 성공과 실제 푸터 화면 검증은 구분합니다. 표의 ‘화면 확인’은 수집된 하단 스크린샷과 구조 자료에 근거하며, 팝업·로더·커스텀 스크롤로 제한된 항목을 별도 표기했습니다. 32곳의 모든 푸터를 완전하게 시각 확인했다는 의미는 아닙니다.

| # | 레퍼런스 | 확인 범위 | 푸터 검토와 반영 판단 |
| --- | --- | --- | --- |
| 1 | [Conversation Design](https://convodesign101.xyz/) | 200, 하단 화면·구조 확인 | 한 화면의 질문·개인 프로젝트 설명으로 마무리하는 연락 CTA. 많은 컬렉션·서비스 링크를 담는 이번 푸터의 구조로는 제한적입니다. |
| 2 | [The Future in Black](https://www.thefutureinblack.com/) | 200, 하단 화면·구조 확인 | 굵은 대형 CTA, 작은 브랜드·소셜·연락처, 얇은 구분선. 정보의 계층은 명확하지만 굵은 압축 서체의 성격을 그대로 가져오지 않았습니다. |
| 3 | [23° Monorigine](https://www.23gradicoffee.com/) | 200, 하단 화면·구조 확인 | **주요 참고.** 화면을 채운 사진을 어둡게 처리하고 큰 가는 제목·작은 연락처·하단 정책을 겹칩니다. 소재 사진과 타이포그래피가 함께 화면을 채우는 방식을 반영했습니다. |
| 4 | [Jesko Jets](https://jeskojets.com/) | 200, 하단 화면·구조 확인 | **주요 참고.** 검정으로 이어지는 전체 화면, 좌우로 나뉜 작은 정보, 중앙의 큰 그래픽과 CTA가 비대칭 균형을 만듭니다. 어두운 공간과 정보 배치를 반영하고 원본의 지구 그래픽·큰 배경 글자는 사용하지 않았습니다. |
| 5 | [Capsul’in Aluminium](https://aluminium.capsul-in-pro.com/) | 200, 원문·연락 구조 확인; 로딩막으로 하단 화면 제한 | 번호가 붙은 섹션 메뉴와 CONTACT US·문의 양식 구조를 확인했습니다. 실제 푸터의 최종 배치·여백은 완전하게 검증하지 못해 시각 근거로 채택하지 않았습니다. |
| 6 | [Dyo Tanya](https://dyotanya.com/en) | 200, 하단 화면 확인 | 큰 원형 연락 아이콘과 인물 사진, 손그림 선이 있는 밝은 패널. 개인 포트폴리오의 친근한 표현이라 검정 패션 사이트의 방향과 거리가 있습니다. |
| 7 | [MindMarket](https://mindmarket.com/) | 200, 하단 화면·구조 확인 | 한 화면 규모의 강한 노랑 바탕, 연락 CTA와 메뉴·주소 열. 전체 화면을 정보로 채우는 방식은 참고할 수 있으나 색상은 채택하지 않았습니다. |
| 8 | [Pictoric](https://pictoric.com.ua/) | 200, 푸터 메뉴·정책·저작권 DOM 확인; 로딩·전환 마스크로 화면 제한 | 메뉴·정책·저작권 구조는 확인했지만 실제 푸터의 시각 평가를 확정하지 않았습니다. 최종 방향의 근거로 사용하지 않았습니다. |
| 9 | [Atlason](https://atlason.com/) | 200, 로딩 완료 후 패널형 연락처·소셜 화면 확인 | 3개 패널로 구성된 화면이며, 왼쪽 패널 아래에 Visit·Connect·Follow를 작고 촘촘하게 정렬합니다. 일반적인 세로 푸터와 달라 그대로 적용하지 않았습니다. |
| 10 | [Norma](https://nor.ma/) | 200, 하단 화면·구조 확인 | [원본 Siteinspire 링크](https://www.siteinspire.com/website/13555-norma)에서 실제 사이트로 이동했습니다. 밝은 바탕의 브랜드·Explore·Product·Company·Contact 정보열과 낮은 정책 줄. 정보 분류가 실용적이지만 이번 요청의 풀사이즈 사진 화면과 다릅니다. |
| 11 | [Capricorn 01 Zagato](https://car.capricorngroup.net/) | 200, 하단 연락 구조·스타일 확인 | GENERAL·SALES·PR과 문의 양식 중심의 큰 연락 영역. 역할별 정보 분류는 명확하지만 상품 문의용 구조를 그대로 옮기지 않았습니다. |
| 12 | [Heure Bleue](https://heurebleue.studio/) | 200, 하단 화면·구조 확인 | 파란색 한 화면에 연락·소셜·법적 정보를 아래쪽으로 정렬합니다. 전체 화면의 여백 제어는 참고되지만 이번 검정·데님 소재 방향에는 색상을 적용하지 않았습니다. |
| 13 | [Mara](https://marasrl.it/en/) | 200, 쿠키 안내를 닫은 뒤 실제 하단 화면 확인 | Contacts·Follow us·Legal·Newsletter 정보 묶음 아래에 약 297px 높이의 대형 워드마크가 있습니다. 정보 정렬은 참고할 수 있으나 대형 로고 반복은 채택하지 않았습니다. |
| 14 | [Ulysses de Santi](https://ulyssesdesanti.com/) | 200, 하단 구조·스타일 확인 | 짧은 브랜드 문장·도시·소셜·크레디트가 낮은 가로 줄로 정렬됩니다. 조용한 마무리에는 적합하지만 요청한 큰 푸터의 주 참고로 쓰지 않았습니다. |
| 15 | [HUTS](https://huts.com/) | 200, 하단 화면·구조 확인 | 밝은 CTA와 어두운 다열 디렉터리로 약 한 화면 규모를 구성합니다. 많은 링크를 명확히 정렬하는 구조는 유용하지만 주택 브랜드의 색상·분류는 가져오지 않았습니다. |
| 16 | [Studio Bruch](https://studiobruch.com/) | 200, 하단 구조·스타일 확인 | 뉴스레터와 Mail·Instagram·LinkedIn·정책·언어를 짧게 정리합니다. 간결한 정보 줄은 참고 대상이나 화면 규모가 이번 요청보다 작습니다. |
| 17 | [Pinnacle Black](https://pinnacle.co/) | 200, 하단 화면 확인 | 야경 사진 위 큰 브랜드 글자, Back to top과 작은 정책을 둡니다. 사진이 화면을 채우는 접근은 관련 있지만 반복되는 대형 로고를 피했습니다. |
| 18 | [ClearLife Reset](https://www.clearlifereset.com/) | 200, 하단 화면·구조 확인 | 영상 CTA 다음의 흰 화면에 굵은 링크와 뉴스레터를 둡니다. 굵은 글자와 프로모션 중심 표현은 채택하지 않았습니다. |
| 19 | [Inkwell](https://inkwell.tech/) | 200, 하단 화면·구조 확인 | 매우 큰 워드마크와 양끝의 작은 정책 링크. 대형 브랜드 글자 반복은 사용자 선호와 맞지 않아 채택하지 않았습니다. |
| 20 | [Face Formula](https://www.faceformula.com/en-no) | 200, 하단 구조·스타일 확인; 지역 선택 팝업이 화면 일부 가림 | 작은 대문자 링크열의 간격과 정렬은 정교하지만 열 수가 많고 하단 워드마크가 큽니다. 팝업 뒤 정보 구조까지만 시각 확인했습니다. |
| 21 | [Euveka](https://www.euveka.com/) | 200, 하단 화면·구조 확인 | 제품 사진과 가는 큰 세리프 CTA가 한 화면을 구성합니다. 소재·타이포 조합은 관련 있지만 고객 서비스·컬렉션 정보를 담는 구조가 부족합니다. |
| 22 | [PVG](https://pvg.co/) | 200, 하단 화면·구조 확인 | 사진 위 좌측 로고와 우측 뉴스레터, 아래 작은 정책. 사진 위 정보 배치는 관련 있으나 입력창 중심 구성과 대비는 그대로 사용하지 않았습니다. |
| 23 | [Jordan Gilroy](https://www.jordangilroy.com/) | 200, 연락·번호 소셜·폰트 확인; 전환 패널로 화면 일부 가림 | 왼쪽의 가는 세리프 연락처와 오른쪽 번호 소셜이 확인됩니다. 최종 화면이 일부 가려져 완전한 시각 확인으로 분류하지 않았습니다. |
| 24 | [Plain Sight Ventures](https://www.plainsightventures.co/) | 200, 하단 화면·구조 확인 | 4열 링크, 점선, 큰 브랜드 문구와 구름 그래픽. 정보 간격은 좋지만 장식적 표현과 대형 로고는 채택하지 않았습니다. |
| 25 | [Quote Velocity](https://quotevelocity.com/) | 200, 하단 화면·구조 확인 | 좌측 연락 CTA, 우측 작은 메뉴·소셜, 중앙 신발 일러스트와 큰 배경 글자. 정보 분리 방식은 참고되지만 시각 요소가 많습니다. |
| 26 | [UZIK](https://www.uzik.com/) | 200, 하단 화면·구조 확인 | 얇은 구분선과 좌측 정책·우측 텍스트 소셜의 정렬이 명료합니다. 중앙 큰 CTA를 그대로 옮기지 않고 정보 계층만 비교했습니다. |
| 27 | [Cove](https://cove.co/) | 200, 하단 화면·구조 확인 | 검정 바탕의 작은 로고·링크·뉴스레터와 넓은 여백. **사용자가 너무 비어 보인다고 평가해 최종 주 참고에서 제외했습니다.** |
| 28 | [MOHEIM](https://moheim.com/) | 브라우저 200; 웹 가져오기 시간 초과, 로딩 잠금으로 하단 화면 확인 불가 | 스토어·뉴스레터·사이트맵·회사·정책 원문을 확인했습니다. 실제 하단 화면은 확인하지 못해 시각 평가를 확정하지 않았습니다. |
| 29 | [Awwwards — Sites of the Day](https://www.awwwards.com/websites/sites_of_the_day/) | 200, 인덱스 페이지 하단 화면 확인; 쿠키 안내가 일부 소셜 영역 가림 | 디자인 포털 자체의 하단 정보 영역을 확인한 것입니다. 이 페이지에 등록된 모든 수상 사이트를 방문했다는 의미는 아닙니다. 정보가 많은 포털 구성을 패션 푸터의 주 참고로 사용하지 않았습니다. |
| 30 | [Videinfra — AI in Banking UX Design](https://ai-in-banking-ux-design.videinfra.com/) | 200, 웹 하단 문구·정책 구조 확인; 커스텀 스크롤로 최종 화면 제한 | ‘The Future is Coming’과 정책 구조를 확인했습니다. 수집된 브라우저 화면이 초기 캔버스에 머물러 완전한 푸터 시각 검증으로 기록하지 않습니다. |
| 31 | [Terminal Industries](https://terminal-industries.com/) | 200, 웹 하단 Technology·Company·Reach Us·법적 정보 확인; 로더로 최종 화면 제한 | 서비스·회사·연락처 분류를 확인했지만 애니메이션 로더가 화면을 가려 최종 레이아웃·여백 평가는 제한했습니다. |
| 32 | [Priestess — Live](https://www.priestess.ca/live) | 200, Live 하단 인용문·연락 구조와 웹 크레디트 확인; 전체 크레디트 푸터 화면 제한 | 실제 확인한 하단 콘텐츠와 웹에서 확인한 크레디트를 구분합니다. 전체 푸터가 한 화면에 드러난 것으로 간주하지 않았습니다. |

브라우저 캡처와 DOM·스타일 데이터는 조사 당시의 접근 상태를 기록한 것입니다. 로딩·지역 설정·쿠키·네트워크 상태에 따라 보이는 결과가 달라질 수 있습니다. 이 검토는 푸터의 사진 사용·타이포그래피·배치·정보 밀도에 대한 참고이며, 외부 사이트의 코드를 가져오거나 화면을 그대로 복제한 작업은 아닙니다.

## 생성 이미지 기록

- 사용 파일: [`assets/footer-black-denim.png`](../assets/footer-black-denim.png)
- 생성 도구: 내장 `image_gen`
- 생성 모드: 신규 생성(`generate`), 불투명 배경, 참조 이미지 없음, 1회 호출
- 실제 출력 크기: **1672 × 941px**
- 파일 크기: **1,524,166 bytes**
- SHA-256: `ac13d4514fe23de48074b68d0a821d070149caa790880958dbe193ecf7834c3c`
- 용도: 별도 HTML 타이포그래피와 메뉴 아래에 배치하는 장식용 검정 데님 사진. 생성 이미지 안에는 인물·로고·문자·UI가 없습니다.
- 검수 결과: 왼쪽 아래와 중앙에 접힌 데님 조직·봉제선이 있고, 상단 왼쪽과 오른쪽에는 어두운 여백이 있습니다. 코드에서 검정 그라디언트를 추가해 텍스트 대비를 조정합니다. 프롬프트의 희망 해상도와 실제 출력 크기는 구분합니다.

사용한 전체 프롬프트:

```text
Use case: photorealistic-natural
Asset type: original photographic background asset for a black fashion editorial footer, to be combined later with separate HTML typography. Generate the photograph only.
Primary request: a sophisticated sculptural arrangement of authentic black and charcoal denim fabric, photographed close-up as a fashion still life. Large, deliberate folds and one understated stitched seam create graphic presence. Real diagonal cotton twill, subtle worn fibers and a few restrained frayed edges must remain clearly visible.
Composition/framing: wide 16:9 landscape, preferably 2048 x 1152 or similar high resolution. Fabric folds occupy the left 50–55 percent, concentrated across the lower left and center-left. Keep the upper-left quarter visually quiet and dark enough for large white HTML lettering. Let the right 45 percent fall naturally into uninterrupted deep black negative space for HTML menus. Frame the cloth boldly; avoid a tiny isolated object or a uniform black blob.
Lighting/mood: photographic raking soft silver light from upper left, revealing the fold ridges and believable fabric volume while the valleys remain dark. Restrained, elegant, tactile, contemporary luxury fashion editorial; subtle cool-neutral highlights, true blacks, no blue cast or neon. Natural lens rendering and realistic fine texture.
Scene/backdrop: seamless near-black studio backdrop; the right side should be almost pure black through natural light falloff.
Constraints: original new image, no existing reference image. No people, faces, hands, garments being worn, bags, identifiable products, buttons, zippers, glitter, metal objects, text, lettering, logos, watermarks, UI, website mockups, or frames. Opaque background, no transparency.
```
