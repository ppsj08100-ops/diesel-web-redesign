# DIESEL Web Style Guide

디젤 개인작업 웹사이트의 시각 스타일과 구현 기준을 정리한 문서입니다.

## 1. 기준 디자인과 문서 범위

| 항목 | 기준 |
| --- | --- |
| 원본 | [디젤 개인작업 — 박서진 / BLACK](https://www.figma.com/design/6GPeNKxLjIVbw8NeE8h3xO/?node-id=923-2692) |
| Figma 페이지 | `10 5차` (`923:2691`) |
| 대상 프레임 | `BLACK` (`923:2692`) |
| 푸터 개정 기준 | Figma `923:2994`의 `1920 × 1078px` 규모 유지. [23° Monorigine](https://www.23gradicoffee.com/) 사진·타이포와 [Jesko Jets](https://jeskojets.com/) 검정 비대칭 구성 참고 — 2026-11-03 사용자 요청 개정 |
| 히어로 개정 기준 | [Hero1 (`1128:245`)](https://www.figma.com/design/6GPeNKxLjIVbw8NeE8h3xO/?node-id=1128-245) — 2026-11-03 최신 Figma의 영상 FILL 적용, 기존 내비게이션 아이콘 굵기 유지 |
| COMMITMENT 개정 기준 | [FUTURE MADE (`964:62`)](https://www.figma.com/design/6GPeNKxLjIVbw8NeE8h3xO/?node-id=964-62), [COMMITMENT (`964:55`)](https://www.figma.com/design/6GPeNKxLjIVbw8NeE8h3xO/?node-id=964-55), [DECAY & FORM (`964:72`)](https://www.figma.com/design/6GPeNKxLjIVbw8NeE8h3xO/?node-id=964-72) |
| MEDIA 개정 기준 | [Con8 (`1070:5430`)](https://www.figma.com/design/6GPeNKxLjIVbw8NeE8h3xO/?node-id=1070-5430) — MEDIA는 이 노드를 우선 적용 |
| 컬렉션 개정 기준 | [MEN (`923:2727`)](https://www.figma.com/design/6GPeNKxLjIVbw8NeE8h3xO/?node-id=923-2727), [WOMEN (`923:2979`)](https://www.figma.com/design/6GPeNKxLjIVbw8NeE8h3xO/?node-id=923-2979) — 2026-11-03 갱신, 인물 머리 크롭은 아래 사용자 요청 조정 적용 |
| 확인일 | 2026-11-03 |
| 화면 설계 기준 | 주요 섹션 `1920 × 1080px` |
| 바깥 프레임 크기 | `1924 × 18935px` — 개별 화면 크기 및 실제 콘텐츠 길이와 구분 |

**원본 확인값**은 대상 프레임의 레이어 속성과 렌더링을 확인한 값입니다. **구현 권장안**은 웹 환경에 맞춰 제안한 규칙이며, Figma에 정의된 값으로 취급하지 않습니다. 별도 표기가 없는 색상·타이포그래피·컴포넌트 수치는 원본 확인값입니다. 이 문서의 CSS 토큰 이름은 구현을 위해 제안한 이름입니다.

## 2. 시각 방향

- **흑백 중심:** 검정 배경과 흰색 텍스트를 기본으로 사용하고, 화이트 패션 이미지 섹션으로 리듬을 만듭니다.
- **타이포그래피 중심:** 가는 획의 대형 영문 제목, 좁은 자간, 선택적인 이탤릭으로 브랜드의 대담한 인상을 표현합니다.
- **에디토리얼 구성:** 큰 여백과 비대칭 정렬을 사용합니다. 제품, 영문 카피, 한국어 설명을 서로 다른 영역에 배치합니다.
- **이미지 중심:** 인물, 데님, 제품의 질감과 크롭을 강조합니다. 사진 안의 빨강·파랑 등은 이미지가 가진 색으로 활용합니다.
- **평면적인 UI:** 카드와 버튼은 직각을 기본으로 합니다. 원형 화살표 버튼만 둥글게 처리하며, 대상 프레임의 보이는 레이어에서 그림자·블러 효과는 확인되지 않았습니다.

## 3. 색상

Figma의 RGB 값을 8비트 HEX로 반올림해 표기했습니다. 투명도는 색상값과 별도로 유지합니다. 변수 정의 조회에서는 `Black: #000000`이 노출되었으며, 아래 표는 레이어에서 확인한 색상도 함께 정리한 것입니다.

### 기본 팔레트

| 제안 토큰 | 값 | 사용 위치 |
| --- | --- | --- |
| `--color-bg` | `#000000` | 기본 배경, 히어로, 제품 소개 |
| `--color-footer-bg` | `#000000` | 푸터 배경 — 사용자 요청 구현 |
| `--color-footer-text` | `#EFEEEA` | 푸터 워드마크·링크 — 사용자 요청 구현 |
| `--color-bg-inverse` | `#FFFFFF` | Con1 패션 이미지 시퀀스 |
| `--color-surface-men` | `#181818` | MEN 내부 패널 |
| `--color-surface-women` | `#181818` | WOMEN 내부 패널 |
| `--color-image-fallback` | `#454545` | 일부 이미지 프레임의 바탕 |
| `--color-text` | `#FFFFFF` | 기본 제목·본문·링크 |
| `--color-text-inverse` | `#000000` | 밝은 이미지 위 텍스트, Hero1 보조 카피 |
| `--color-label-muted` | `#9096A0` | PHILOSOPHY 라벨 |
| `--color-text-men` | `#CCCCCC` | MEN 영문 설명 |
| `--color-text-women` | `#D6D6D6` | WOMEN 영문 설명 |
| `--color-text-keyword` | `#C5C5C5` | WASTE / REBORN / RESPONSIBLE |
| `--color-accent-soft` | `#FFFFB3` | 선택 텍스트와 키보드 포커스 |

### 세부 색상과 투명도

| 위치 | 값 | 적용 기준 |
| --- | --- | --- |
| PHILOSOPHY 설명 | `#F5F5F5`, 일부 `#FFFFFF` | 텍스트 레이어 전체 `opacity: 0.9` |
| 선언문 보조 텍스트 | `#DDDDDD`, `#EFEFEF`, `#EDEDED` | 해당 텍스트 런의 색상 유지 |
| MEN 제목 | `#EEEEEE` | WOMEN 제목은 `#FFFFFF` |
| PHILOSOPHY CTA 사각 영역 | `rgba(31, 31, 31, 0.8)` | 원본에 같은 위치의 영역이 2개 겹쳐 있음 |
| PHILOSOPHY CTA 원형 영역 | `#1E1E1E` | 불투명 배경 |
| BADLANDS CTA | `rgba(31, 31, 31, 0.8)` / `#1E1E1E` | 사각 영역 / 원형 영역 |
| EXPLORE 배경 / 테두리 | `rgba(33, 33, 33, 0.5)` / `#1A1919` | 테두리 `1px` |
| 제품 이미지 프레임 바탕 | 투명, 섹션의 `#000000` 노출 | 반투명 이미지 가장자리의 밝은 선 방지 |
| 푸터 보조 텍스트 / 하단 구분선 | `#A3A3A0` / `#333333` | 사용자 요청 구현 |

빨강은 사진과 이미지 안의 로고에서 관찰됩니다. 대상 프레임에서 공통 UI용 빨간색 토큰은 확인되지 않았으므로, 버튼이나 배경의 기본 색으로 추가하지 않습니다.

## 4. 타이포그래피

### 서체와 굵기

| 서체 | 원본 스타일 | 역할 |
| --- | --- | --- |
| `Hagrid` | Light `300`, Light Italic `300`, Regular `400` | 영문 대형 제목, 제품명, 섹션명, 영문 카피 |
| `Hagrid Text` | Light `300`, Regular `400`, Medium `500` | 히어로 보조 카피, 소제목 |
| `Pretendard` | Thin `100`, Light `300`, Regular `400`, Medium `500` | 한국어 제목·본문, 일부 CTA, 푸터 |

Figma에서 사용하는 실제 패밀리 이름은 `Hagrid Text`입니다. 디자인 컨텍스트 코드에 보이는 `Hagrid_Text` 표기와 구분합니다. 구현 사이트는 `assets/fonts/`의 실제 Hagrid·Hagrid Text·Pretendard 파일을 사용하며, `styles/styles.css`에서 각 굵기와 이탤릭을 명시적으로 연결합니다. 대체 서체는 로딩 중 표시용으로 사용합니다.

### 원본 타입 스케일

| 용도 | 서체 / 굵기 | 크기 | 행간 | 자간 | 대표 노드 |
| --- | --- | --- | --- | --- | --- |
| FUTURE | Hagrid Light | `300px` | `100%` | `0` | `964:70` |
| MADE / COMMITMENT / DECAY & FORM | Hagrid Light, 일부 Light Italic | `300px` | `100%` | `-4%` | `964:71`, `964:57`, `964:75` |
| Hero1 DIESEL | Hagrid Light, D는 Light Italic | `300px` | Auto | `-2%` (`-6px`) | `1128:250` |
| FOR SUCCESSFUL LIVING | Hagrid Light, FOR는 Light Italic | `128px` | `130%` | `0` | `954:3386`–`954:3388` |
| MEDIA | Hagrid Light | `128px` | Auto | `0` | `1070:5431` |
| MEN / WOMEN | Hagrid Light | `128px` | Auto | `0` | `923:2729`, `923:2981` |
| 제품명 | Hagrid Light | `64px` | `130%` | `0` | `923:2849`, `923:2858`, `923:2880` |
| BADLANDS 제목 첫 줄 | Hagrid Light | `64px` | `100%` | `0` | `923:2888`, `1025:85`, `1025:104` |
| Worn 보조 제목 | Hagrid Light | `64px` | Auto | `-4%` | `923:2890` |
| 한국어 선언 문장 | Pretendard Regular | `48px` | `120%` | `0` | `923:2794` |
| 제품 영문 설명 | Hagrid Light | `36px` | `100%` | `0` | `923:2850`, `923:2859`, `923:2882` |
| 컬렉션 상단 문구 | Hagrid Light | `24px` | `130%` | `0` | `923:2731`, `923:2983` |
| WASTE / REBORN / RESPONSIBLE | Hagrid Light | `24px` | `130%` | `0` | `964:67`–`964:69` |
| MEN / WOMEN 영문 설명 | Hagrid Light | `24px` | `130%` | `0` | `923:2742`, `923:2993` |
| MEDIA 기사 제목 | Hagrid Light | `36px` | `100%` | `0` | `1070:5439`, `1070:5442`, `1070:5449`, `1070:5455` |
| PHILOSOPHY·선언문 라벨 | Hagrid Light / Regular | `24px` | `130%` | `0` | `923:2792`, `954:3383` |
| Hero1 영문 보조 카피 | Hagrid Text Regular | `24px` | `130%` | `0` | `1128:248` |
| Bags 카테고리 | Hagrid Regular | `24px`, D-Line은 `25px` | Auto | `0` | `923:2848`, `923:2857` |
| Waste, Reworked / Cut from Scraps / Rethink the Wash | Hagrid Text Regular | `20px` | `130%` | `0` | `964:65`, `1062:727`, `964:78` |
| 푸터 워드마크 | Hagrid Regular, D는 Light Italic | `32px` (모바일 `26px`) | `100%` | `-.025em` | 사용자 요청 구현 |
| 푸터 브랜드 문구 | Hagrid Light, For는 Light Italic | `clamp(48px, 5.2vw, 100px)` | `104%` | `-.055em` | 사용자 요청 구현 |
| 푸터 EXPLORE 메뉴 | Hagrid Text Light | `clamp(24px, 1.875vw, 36px)` | `120%` | `-.04em` | 사용자 요청 구현 |
| 푸터 디렉터리 링크 | Pretendard Regular | `14px` (모바일 `12px`) | `150%` | `-.01em` | 사용자 요청 구현 |
| 푸터 열 제목 | Pretendard Medium | `10px` | `150%` | `.07em` | 사용자 요청 구현 |
| 제품 한국어 설명 | Pretendard Regular / Light | `18px` | `150%` | `0` | `923:2851`, `923:2881` |
| PHILOSOPHY 설명 | Pretendard Light | `18px` | `160%` | `0` | `923:2793` |
| MEDIA 본문 | Pretendard Light / Regular | `16px` | `150%` | `0` | `1070:5438`, `1070:5447`, `1070:5453`, `1070:5459` |
| 지속가능성 한국어 설명 | Pretendard Thin | `16px` | `130%` | `0` | `964:64` |
| VIEW MORE | Pretendard Regular / Hagrid Light | `16px` | Auto | `0` | `923:2800`, `923:2897` |
| BADLANDS 분류 라벨 | Hagrid Regular | `16px` | `100%` | `0` | `923:2892`, `923:2893` |
| READ MORE | Hagrid Regular | `14px` | Auto | `0` | `I923:2852;281:152` |
| EXPLORE | Pretendard Regular | `12px` | Auto | `0` | `I923:2883;575:489` |

Figma의 `-4%` 자간은 CSS `-0.04em`, `-2%`는 `-0.02em`입니다. 예를 들어 `300px × -4% = -12px`입니다. Auto 행간은 CSS `normal`을 출발점으로 삼고 실제 웹폰트 렌더링을 확인합니다.

영문 제목은 대문자 중심이지만, 제품명·설명에는 소문자와 Title Case가 섞입니다. `text-transform: uppercase`를 전역으로 적용하지 않습니다. 한국어 본문은 별도 서체로 분리하고, 편집 의도가 있는 제목 줄바꿈을 유지합니다.

## 5. 레이아웃과 여백

### 화면 구성

다음 순서는 화면의 세로 위치를 기준으로 정리했습니다. 수치는 원본 섹션의 크기이며, 웹에서 모든 높이를 고정하라는 의미는 아닙니다. 푸터는 사용자 요청으로 재설계해 현재 구현의 내용에 맞춰 표기합니다.

| 순서 | 섹션 | 원본 크기 | 주요 구성 |
| --- | --- | --- | --- |
| 1 | Hero1 (`1128:245`) | `1920 × 1080px` | 컬러 인물 영상, 왼쪽 DIESEL 제목과 보조 카피, 7개 주 메뉴와 4개 아이콘, PAUSE/PLAY |
| 2 | Hero2 + 선언문 그룹 (`923:2780`, `954:3381`) | Hero2 `1920 × 1080px` | FOR SUCCESSFUL LIVING, 브랜드 선언 |
| 3 | Hero3 (`923:2790`) | `1920 × 1080px` | PHILOSOPHY, 중앙 한국어 카피, CTA |
| 4 | Con1 (`923:2820`) | `1920 × 1080px` | 흰 배경의 7장 패션 이미지 캐러셀 |
| 5 | Con2 (`923:2874`) | `1920 × 1080px` | Melissa 제품 소개, 별도 1DR / D-Line 화면 존재 |
| 6 | Con3 (`964:62`) | `1920 × 1080px` | FUTURE MADE |
| 7 | Con4 (`964:55`) | `1920 × 1080px` | COMMITMENT |
| 8 | Con5 (`964:72`) | `1920 × 1285px` | DECAY & FORM |
| 9 | Content_3 (`923:2885`) | `1920 × 1080px` | FW26 BADLANDS, 추가 가로 화면 존재 |
| 10 | Con8 (`1070:5430`) | `1920 × 1887px` | MEDIA 2열 구성, 기사 제목은 각 이미지 왼쪽 별도 컬럼 |
| 11 | Con9 (`923:2727`) | `1920 × 1400px` | MEN 컬렉션 |
| 12 | Con10 (`923:2979`) | `1920 × 1400px` | WOMEN 컬렉션 |
| 13 | Footer (`923:2994`, 사용자 요청 개정) | 기준 `1920 × 1078px`, 데스크톱 최소 `max(760px, 56.145833vw)` | 데님 질감과 대형 브랜드 문구, 우측 EXPLORE·고객 서비스·브랜드 링크, 하단 소셜·정책·공식 스토어 |

원본에는 가로로 확장된 추가 화면과 바깥 프레임의 빈 공간이 있습니다. 섹션의 `x` 위치에 있는 약 `-1~5px` 차이와 전체 프레임 높이를 공통 간격 규칙으로 사용하지 않습니다. 대상 바깥 프레임에는 레이아웃 그리드가 설정되어 있지 않아, 12열 그리드 등은 원본 규칙으로 정의하지 않습니다.

### 확인된 간격과 정렬

| 항목 | 원본 기준 |
| --- | --- |
| 기본 좌우 기준선 | 여러 섹션에서 `40px` |
| MEN / WOMEN 내부 패널 | 좌우 `40px`, 폭 `1840px`, 상단 `88px` |
| 제품 카테고리 ↔ 제품명 | 세 화면 모두 `4px` |
| MEDIA 이미지 ↔ 본문 | 세로 Auto Layout 간격 `26px` |
| MEDIA 제목 위치 | 섹션 기준 `x: 327px`, `y: 367.007px`; 텍스트 행 박스 높이 약 `145.591px` |
| MEDIA 기사 블록 | 폭 `875px`, 시작점 `40px` / `1005px`; 제목 컬럼 `287px` + 이미지·본문 컬럼 `588px` |
| MEDIA 실제 이미지·본문 폭 | `588px` |
| MEDIA 이미지 높이 | `232px` — 비율 약 `2.53:1` |
| MEDIA 실제 콘텐츠 왼쪽 위치 | 섹션 기준 `327px`, 두 번째 열 `1292px` |
| MEDIA 행 시작 위치 | 섹션 기준 `638px`, `1097px` |
| MEDIA 기사 제목 왼쪽 위치 | SCENT `164px`, MELISSA `1086px`, LOVE `171px`, MILAN `1085px` |
| MEDIA 기사 제목 세로 정렬 | 이미지 상단과 정렬, MILAN은 둘째 행에서 `8px` 아래인 `1105px` |
| MEN / WOMEN 이미지 가로 간격 | `56px` — 패널 내 6개 슬롯 시작점 `0`, `722`, `1444`, `2166`, `2888`, `3610px` |
| MEN 이미지 프레임 | `666 × 728px` |
| WOMEN 이미지 프레임 | 첫 두 장 `666 × 728px`, 뒤 네 슬롯 `666 × 766px` 안에 `666 × 728px` 이미지 |
| 푸터 보조 링크 높이 | 데스크톱 최소 `30px`, 모바일 `32px` — 사용자 요청 구현 |

**구현 권장안:** 섹션과 본문은 문서 흐름, Grid, Flex로 구성합니다. 대형 제목의 겹침과 이미지 내부 크롭에는 필요한 범위에서 절대 위치를 사용합니다. MEDIA의 실제 콘텐츠 시작점처럼 의도적인 들여쓰기는 기본 `40px` 기준선과 별도로 유지합니다.

## 6. 주요 컴포넌트

### 히어로 내비게이션과 카피 — 개정 기준

- 내비게이션 프레임 `1920 × 72px` (`923:2903`)은 히어로 기준 `x: 0px`, `y: -1px`입니다. 왼쪽 메뉴는 내부 기준 `x: 40px`, `y: 24px`, 항목 간격 `16px`입니다.
- 메뉴 순서: `BAGS / COMMITMENT / BADLANDS / FOOTAGE / PRESS / MEN / WOMEN`. Hagrid Regular `16px / 25px`, 자간 `-0.04em`. 7개 메뉴 글자는 최신 Figma와 같이 모두 검정색입니다.
- 메뉴 텍스트 프레임 폭은 순서대로 `44 / 113 / 87 / 73 / 55 / 38 / 65px`이며 오른쪽 정렬입니다. 오른쪽 내부 여백 `0.64px`로 마지막 글자의 자간 계산을 보정합니다.
- 오른쪽 아이콘은 내부 `x: 1736px`, `y: 24px`에서 시작하며 사람, 하트, 가방, 검색 순서입니다. 슬롯 `24 × 24px`, 간격 `16px`, 가방 벡터 `14.8062 × 18.96px`를 유지합니다. 사용자 요청으로 기존 사이트의 약 `1.5px` 두께 `*-nav.svg` 4개를 그대로 사용합니다. 사람·하트·검색은 채움 윤곽에 `0.5px` 스트로크를 더했고, 가방은 스트로크 `1.5px`와 잘림 방지 viewBox 여백 `0.3px`를 사용합니다. 새 시안의 얇은 아이콘으로 교체하지 않습니다.
- 영상은 Figma `1128:245`의 VIDEO FILL과 동일한 `assets/hero-1128.mp4`입니다. 원본은 `1232 × 736px`, 길이 약 `15.042초`이며 영상 SHA-1이 Figma의 `videoHash`인 `56c0fb70dc734c051cd947d820fcb5b6ab2a0297`과 일치합니다. 데스크톱 표시 프레임은 `x: 0px`, `y: 0px`, `1920 × 1080px`이며 `object-fit: cover; object-position: center`로 전체를 채웁니다. 로딩·재생 실패 시에는 Figma 원본 포스터 `imgHeroVideoPoster.png` (`1232 × 736px`)를 표시합니다.
- DIESEL 제목 (`1128:250`)은 `x: 74px`, `y: 570px`, Hagrid Light `300px`, 자간 `-6px`, 전체 흰색이며 D는 Light Italic입니다.
- 카피 (`1128:248`)는 `x: 87px`, `y: 826px`, Hagrid Text Regular `24px / 130%`, 전체 검정·대문자입니다. `Diesel turns rebellion into a language of modern luxury.`, `Driven by denim, attitude, and fearless self expression.`, `Breaking conventions since 1978.`의 3줄이며 첫 줄 앞의 공백 11개를 유지합니다.
- **데스크톱 배치:** `901px` 이상에서는 히어로를 `16:9` 비율로 표시하고 `1920 × 1080px` 좌표계의 영상·제목·카피·내비게이션을 같은 배율로 축소합니다. 별도 진입 효과나 추가 스크롤 높이를 사용하지 않습니다.
- **영상 재생:** `autoplay muted loop playsinline preload="metadata"`와 포스터를 사용합니다. 우측 하단 PAUSE/PLAY 버튼은 재생 상태를 표시하고 사용자가 재생·일시정지할 수 있습니다. 처음부터 동작 줄이기를 설정한 경우 자동 재생하지 않지만 수동 PLAY는 허용합니다. 화면 밖·비활성 탭에서는 정지하고, 사용자가 일시정지하지 않은 경우에만 복귀 시 이어 재생합니다. 자동 재생이 차단되면 PLAY 상태로 전환하고, 영상 오류 시 포스터를 유지합니다.
- **이전 사진 보정 대체:** 정적 사진 `imgHero1128.png`와 국소 명암 마스크 `hero-hair-tone-mask.svg`는 보관 에셋으로 남기되 현재 히어로에 적용하지 않습니다. 영상의 색감·머리카락·얼굴 형태를 새로 생성하지 않습니다.
- **모바일 구현 조정:** `900px` 이하에서는 기존 흰색 MENU 헤더와 화면을 채우는 영상을 사용하며, 제목과 카피를 하단 왼쪽에 배치합니다. 제목은 `25vw`, 카피는 `768~900px`에서 `16px`, `767px` 이하에서 `13px`이며 좁은 화면에서는 공백을 접어 자연스럽게 줄바꿈합니다.
- 이전 흑백 남성 사진과 얼굴 마스크는 보관 에셋이며 새 히어로에서는 사용하지 않습니다. 이전 얼굴 자동 전환, difference 블렌딩, sticky 로고 스크롤과 `hero-motion.js`는 제거합니다.

### FOOTAGE 이미지 캐러셀 — 개정 기준

[Con1 (`923:2820`)](https://www.figma.com/design/6GPeNKxLjIVbw8NeE8h3xO/?node-id=923-2820)의 사진 7장을 가로 순서대로 표시합니다. 각 화면의 기준 크기는 `1920 × 1080px`이며, 아래 위치와 크기는 해당 화면 왼쪽 위를 기준으로 한 표시 영역입니다.

| 순서 | 이미지 파일 | 원본 파일 해상도 | 위치 / 표시 크기 | 이미지 노드 |
| --- | --- | --- | --- | --- |
| 1 | `imgImage1638.png` | `1525 × 1031px` | 프레임 `323px, 109px / 1274 × 863px`, 이미지 `323px, 110px / 1274 × 862px` | `1090:372` |
| 2 | `imgImage1633.png` | `1385 × 1136px` | `485px, 151px / 950 × 779px` | `1073:5468` |
| 3 | `imgImage1634.png` | `1122 × 1402px` | `670px, 179px / 580 × 721px` | `1079:76` |
| 4 | `imgImage1637.png` | `1024 × 1536px` | `733px, 201px / 453 × 679px` | `1082:85` |
| 5 | `imgImage1626-footage923.png` | `1105 × 1423px` | 프레임 `680px, 180px / 560 × 727px`, 이미지 `730px, 248px / 460 × 592px` | `1062:3100` |
| 6 | `imgImage1505.png` | `1024 × 1536px` | `785px, 271px / 349 × 539px` | `923:2842` |
| 7 | `imgImage1308.png` | `1200 × 2400px` | `797px, 214px / 326 × 652px` | `923:2835` |

- 7개 파일 모두 Figma에 저장된 가장 큰 원본 해상도로 사용합니다. 새 파일 6개는 축소 미리보기 대신 원본 파일로 저장하고 기존 `imgImage1308.png`는 동일한 원본으로 재사용합니다. 변경된 1626은 `imgImage1626-footage923.png`로 저장해 이전 파일을 보존합니다.
- `768px` 이상에서는 화면·프레임·이미지를 같은 폭 기준으로 축소하며, 이전 `600px` 최소 높이를 적용하지 않습니다. 버튼·방향키·스와이프 탐색과 현재 위치 카운터는 기존 캐러셀 동작을 사용하며 총 7장을 표시합니다.
- **모바일 구현 조정:** `767px` 이하에서는 화면 높이 `80svh`, 최소 `550px`를 사용하고 사진 전체가 보이도록 `object-fit: contain`으로 표시합니다.

### COMMITMENT 3개 화면 — 개정 기준

`768px` 이상에서는 제목·본문·키워드와 섹션 높이를 모두 원본 폭 `1920px`에 비례해 조절합니다. FUTURE MADE와 COMMITMENT는 `1920 × 1080px`, DECAY & FORM은 `1920 × 1285px`입니다. 아래 좌표는 각 섹션 왼쪽 위를 기준으로 합니다.

| 화면 | 첫째 제목 위치 | 둘째 제목 위치 | 설명 블록 위치 / 소제목 |
| --- | --- | --- | --- |
| FUTURE MADE | FUTURE `330px, 255px` | MADE `720px, 525px` | `351px, 554px` / Waste, Reworked |
| COMMITMENT | COMMIT `352px, 255px` | MENT `352px, 525px` | `1327px, 540px` / Cut from Scraps |
| DECAY & FORM | DECAY `640px, 366px` | & FORM `324px, 636px` | `351px, 387px` / Rethink the Wash |

- 제목은 Hagrid Light `300px / 300px`, 자간 `-12px`이며 FUTURE만 자간 `0`입니다. MADE와 DECAY의 D는 Light Italic을 사용합니다.
- 상단 키워드 그룹은 `84px, 160px`에 배치합니다. WASTE / REBORN / RESPONSIBLE의 그룹 내부 가로 위치는 각각 `0 / 778 / 1579px`이며, Hagrid Light `24px / 31.2px`, `#C5C5C5`입니다.
- 설명 소제목은 Hagrid Text Regular `20px / 26px`, 한국어는 Pretendard Thin `16px / 20.8px`입니다. 본문은 소제목 상단에서 `36px` 아래에 시작하며 원본의 3줄을 유지합니다. 화면별로 재활용 소재, 남은 데님 조각, 물을 덜 쓰는 워싱 공정을 설명합니다. 브라우저와 Figma의 글자 기준선 차이는 키워드·한국어 본문에 원본 기준 `1px` 아래쪽 보정으로 맞춥니다.
- 제목의 등장 애니메이션은 적용하지 않습니다. 절대 배치된 단어의 좌표 기준이 애니메이션에 의해 바뀌지 않도록 제목 영역을 섹션 전체 크기로 유지합니다.
- DECAY의 READ MORE는 원본의 검정색을 유지하고 hover·키보드 포커스에서는 흰색, 모바일에서는 회색으로 표시합니다. 클릭하면 세 화면의 설명을 담은 상세 보기를 엽니다.
- **모바일 구현 조정:** `767px` 이하에서는 제목·설명·키워드를 세로 화면에 맞춰 재배치하고 본문 가독성을 유지합니다.

### BADLANDS 3개 화면 — 개정 기준

세 화면은 `1920 × 1080px` 기준이며, `768px` 이상에서는 모든 요소와 높이를 같은 비율로 축소합니다.

| 화면 | 사진 프레임 위치 / 크기 | 내부 이미지 위치 / 크기 | 제목 그룹 위치 | 본문 위치 |
| --- | --- | --- | --- | --- |
| Torn and Worn | `578, 240 / 765 × 600px` | `0, 0 / 775 × 608px` | `381, 478px` | `1437, 504px` |
| Ignited and Untamed | `577, 240 / 765 × 600px` | `-5, -9 / 775 × 775px` | `267, 478px` | `1505, 504px` |
| Slow Burn Ember | `578, 240 / 765 × 600px` | `0, 0 / 765 × 600px` | `347, 463px` | `1438, 504px` |

- 사진은 Figma 필터가 반영된 `imgImage1640-badlands.png`, `imgImage1603-badlands.png`, `imgImage1641-badlands.png`를 사용합니다. 부모와 이미지의 가로 반전은 서로 취소되므로 추가 반전·필터를 적용하지 않습니다.
- 제목은 Hagrid Light `64px`이며 And·Burn 구간만 검정색입니다. 둘째 줄은 자간 `-4%`, 첫 줄에서 각각 `60 / 60 / 64px` 아래에 놓입니다. 둘째·셋째 화면의 첫 줄은 그룹 왼쪽에서 `43 / 34px` 안쪽으로 들어갑니다.
- 상단 시즌은 `884, 94px`, 로고는 `1773, 179px / 63 × 52px`, VIEW MORE는 `864, 900px / 192 × 47px`입니다. 본문은 Pretendard Regular `16px / 24px`의 각기 다른 3줄을 유지합니다.
- BADLANDS 버튼은 Pretendard Regular `16px`, 라벨 내부 `30px, 14px` 위치입니다. 라벨 배경은 `rgba(31,31,31,0.8)`, 원형 영역은 `#1E1E1E`이며 최신 버튼 노드는 `1104:331`, `1104:342`, `1104:350`입니다.
- 탐색은 줄 표시 3개·방향키·스와이프로 구성하며 각 VIEW MORE는 해당 사진과 문구의 상세 보기를 엽니다. 모바일에서는 사진 슬롯의 `765:600` 비율을 유지하며 배치를 조정합니다.

### VIEW MORE CTA

- 전체 프레임 `192 × 47px`: 텍스트 영역 `148 × 47px` + 화살표 영역 `44 × 44px`.
- 화살표 영역의 Figma 반경은 `90px`이며, 실제 모양은 원형입니다. 웹에서는 `border-radius: 50%`로 표현할 수 있습니다.
- 화살표 아이콘 슬롯은 `24 × 24px`입니다. PHILOSOPHY 라벨은 Pretendard Regular `16px`, BADLANDS는 Pretendard Regular `16px`입니다.
- 위치: PHILOSOPHY `923:2795`, BADLANDS `1104:331`.
- 원본 PHILOSOPHY CTA는 같은 좌표에 텍스트 영역이 겹쳐 있습니다. **구현 권장안:** 클릭 대상과 라벨은 하나로 구성하고, 배경의 최종 농도는 원본 렌더링에 맞춥니다.

### READ MORE 링크

- 프레임 `98 × 26px`, Hagrid Regular `14px`.
- 밑줄은 별도 `91 × 1px` 레이어로 표현되어 있습니다.
- Con5에서는 검정색을 사용하며, 호버·포커스와 모바일에서는 식별할 수 있도록 표시합니다.
- 대표 노드: `964:73`. BAGS의 이전 READ MORE는 아래 VIEW MORE 버튼으로 교체됐습니다.

### BAGS VIEW MORE 버튼 — 개정 기준

- 세 화면 모두 `x: 1552px`, `y: 915px`, 크기 `192 × 47px`입니다.
- 라벨 영역은 `148 × 47px`, 배경 `rgba(31, 31, 31, 0.8)`, Pretendard Regular `16px`이며 텍스트는 위에서 `16px`에 놓입니다.
- 오른쪽 원은 `44 × 44px`, 배경 `#1E1E1E`이며 `24 × 24px` 원본 화살표를 원 내부 `12px, 6px`에 배치합니다.
- 대표 노드: Melissa `1095:69`, 1DR Dome `1098:134`, D-Line Bag `1098:142`. 각 제품의 상세 보기를 엽니다.

### MEDIA 콘텐츠 블록

- 개정 프레임은 `1920 × 1887px`이며, MEDIA 제목은 Hagrid Light `128px`입니다. 제목의 기준점은 `327px, 367.007px`이고 행 박스 높이는 `145.591px`입니다. 데스크톱에서는 스크롤바를 제외한 실제 콘텐츠 폭을 기준으로 글자·간격·이미지와 전체 높이를 함께 축소합니다. 본문 하단부터 섹션 끝까지는 `388px`입니다.
- 각 기사 블록은 `875px` 폭의 2컬럼 구성입니다. 왼쪽 `287px` 영역에 기사 제목을 배치하고, 오른쪽 `588px` 영역에 이미지와 본문을 세로로 배치합니다.
- 기사 제목은 이미지 밖의 왼쪽 컬럼에서 Hagrid Light `36px / 100%`, 흰색을 사용합니다. SCENT / FOR / GEN Z 등 원본의 3줄 구성을 유지합니다.
- 이미지 `588 × 232px`와 본문 사이 간격은 `26px`입니다. 별도의 카드 배경, 둥근 테두리, 그림자를 추가하지 않습니다.
- 본문은 Pretendard `16px / 150%`입니다. SCENT와 LOVE는 Light `300`, MELISSA와 MILAN은 Regular `400`을 사용합니다.
- 이미지 4개 모두 최신 Figma와 파일 해시가 같은 기존 원본을 재사용하며 상세 보기에도 같은 원본을 사용합니다. 협업 이미지는 `assets/imgImage1207-media1070.png` (`1024 × 405px`), 밀라노 이미지는 `assets/imgImage1388-media1070.png` (`1200 × 675px`)입니다. 문단의 따옴표·공백과 줄바꿈은 최신 시안대로 유지합니다.
- 대표 기사 블록: `1070:5434`, `1070:5441`, `1070:5448`, `1070:5454`.
- **구현 조정:** `768~1100px`에서는 기사 블록을 1열로 쌓고, 각 블록 안에 제목 `160px` + 간격 `24px` + 이미지·본문 영역을 배치합니다. `767px` 이하에서는 제목·이미지·본문을 순서대로 세로 배치하고, 제목 `28px`을 자연스럽게 줄바꿈합니다.

### MEN / WOMEN 컬렉션 — 개정 기준

두 화면의 바깥 크기는 `1920 × 1400px`, 내부 패널은 `40px, 88px`에서 시작하는 `1840 × 1312px`, 배경은 `#181818`입니다. 아래 위치는 패널 왼쪽 위를 기준으로 합니다.

상단 문구의 텍스트 프레임 폭은 MEN `50 / 35 / 87 / 35 / 159px`, WOMEN `50 / 82 / 35 / 160px`입니다. 끝 공백의 브라우저 계산 차이가 간격을 바꾸지 않도록 이 폭을 유지하고, 글자의 기준선은 원본 기준 `1px` 아래로 보정합니다.

| 항목 | MEN | WOMEN |
| --- | --- | --- |
| 제목 | `40px, 376px` | `40px, 378px` |
| 상단 문구 그룹 | `167px, 90px`, 항목 간격 `285px` | `142px, 90px`, 항목 간격 `410px` |
| 영문 설명 | `1444px, 411px` | `1444px, 413px` |
| 갤러리 시작 | `0, 544px` | `0, 546px` |

- 제목은 Hagrid Light `128px`, 기본 행간이며 MEN은 `#EEEEEE`, WOMEN은 흰색입니다. 상단 문구와 설명은 Hagrid Light `24px / 31.2px`로 원본 공백과 3줄 구성을 유지합니다.
- 갤러리는 폭 `666px`, 간격 `56px`의 서로 다른 이미지 슬롯 6개입니다. MEN은 선글라스·초록 재킷·데님·검정 숄더백·체크 재킷 남성·스니커즈, WOMEN은 데님·검정 상의·부츠·안경과 니트 여성·데님 가방·금색 반지 순서입니다. WOMEN의 뒤 네 슬롯은 높이 `766px` 안에 높이 `728px` 이미지를 배치합니다.
- 기존 Figma 원본 이미지 6개는 최신 다운로드와 SHA256이 같아 재사용합니다. 추가 원본 `imgCollectionMenBag.png`, `imgCollectionMenLook.png`, `imgCollectionMenSneakers.png`, `imgCollectionWomenKnit.png`, `imgCollectionWomenBag.png`, `imgCollectionWomenRing.png`는 모두 `894 × 1341px`로 보존합니다.
- **사용자 요청 크롭 조정:** WOMEN 첫 이미지는 원본 `imgImage1215.png`에 `object-position: center top`을 적용해 머리 전체를 표시합니다. MEN 다섯 번째와 WOMEN 네 번째는 원본 자체에서 정수리가 잘려 있어 참고 이미지 기반 생성 편집본 `imgCollectionMenLookFullHead.png`, `imgCollectionWomenKnitFullHead.png`를 사용합니다. 이 두 편집본은 Figma 원본과 구분하며 원본 파일을 덮어쓰지 않습니다.
- `768px` 이상에서는 패널·텍스트·이미지 위치와 크기를 원본 폭 `1920px`에 비례해 조절합니다. 태블릿에서도 같은 비율을 유지하고, `767px` 이하에서는 모바일 배치와 가로 스크롤을 사용합니다.
- 제목의 등장 애니메이션은 적용하지 않습니다. [SAKAZUKI](https://sakazuki.io/)의 연속 가로 띠를 참고해 MEN은 왼쪽, WOMEN은 오른쪽으로 초당 `40px`씩 이동합니다. 접근성 트리에서 제외한 복제 띠로 반복 경계를 연결하고 원본 6개 이미지 순서를 유지합니다. 마우스 오버·키보드 포커스·터치·휠 탐색 중에는 멈추며 PAUSE/PLAY 버튼으로 자동 이동을 제어합니다. 화면 밖·비활성 탭에서는 정지하고, `prefers-reduced-motion: reduce`에서는 자동 이동을 끈 상태로 시작합니다. 방향키·Home·End와 터치로 수동 탐색하며 `#men`, `#women` 내비게이션·검색 연결을 유지합니다.

### 푸터 — 사용자 요청 개정

- 사용자가 원래 푸터의 `1920 × 1078px` 규모를 유지하도록 요청했습니다. [23° Monorigine](https://www.23gradicoffee.com/)의 사진 위 타이포그래피와 [Jesko Jets](https://jeskojets.com/)의 검정 비대칭 구성을 참고합니다. 정보가 적고 높이가 낮은 Cove 방향은 사용자가 공백이 많다고 평가해 채택하지 않았습니다. [32개 레퍼런스 검토·생성 이미지 기록](docs/footer-design-notes.md)에 확인 범위와 선택 근거를 기록합니다.
- 배경은 `#000000`, 주요 텍스트는 `#EFEEEA`, 제목·크레디트는 `#A3A3A0`, 하단 구분선은 `#333333`입니다. 본문은 Pretendard Regular `400`입니다. 데스크톱 최소 높이는 `max(760px, 56.145833vw)`, 패딩은 위 `clamp(48px, 4.166667vw, 80px)`, 좌우 `clamp(24px, 4.166667vw, 80px)`, 아래 `28px`입니다. 1920px 폭에서 높이 `1078px`, 1440px 폭에서 `808.5px`를 유지합니다.
- `footer-black-denim.png` (`1672 × 941px`)는 인물·텍스트·로고 없이 생성한 검정 데님 매크로 이미지입니다. 전체 화면에 cover로 배치하고 불투명도 `.85`와 우측·상하 검정 그라디언트로 링크 가독성을 확보합니다. 생성 모드·전체 프롬프트는 별도 검토 기록을 참조합니다.
- 상단에는 Hagrid Regular `32px / 100%`의 작은 DIESEL 워드마크(D는 Light Italic), `SINCE 1978` 라벨 `10px`, 우측 Back to top을 배치합니다. 워드마크와 상단 이동 버튼은 첫 화면으로 이동합니다.
- 중앙은 동일 폭 2열, 간격 `8vw`, 위아래 `4vw` 패딩입니다. 왼쪽의 `For successful / living.`은 Hagrid Light `clamp(48px, 5.2vw, 100px)`, 행간 `1.04`, 자간 `-.055em`이며 For는 이탤릭입니다. 아래 `DENIM. ATTITUDE. / SELF EXPRESSION.`은 `11px / 160%`, 위 여백 `40px`입니다.
- 오른쪽 EXPLORE의 `Bags / Commitment / Badlands / Footage / Press / Men / Women`은 2열 대문자 링크입니다. Hagrid Text Light `clamp(24px, 1.875vw, 36px) / 120%`, 자간 `-.04em`, 최소 높이 `clamp(36px, 2.291667vw, 44px)`입니다. 그 아래 CLIENT SERVICE와 WORLD OF DIESEL을 2열로 정렬합니다. 보조 열 제목은 `10px / 150%`, 자간 `.07em`, 아래 여백 `22px`; 링크는 `14px / 150%`, 최소 높이 `30px`입니다.
- 기존 링크를 유지합니다. EXPLORE는 로컬 7개 섹션, CLIENT SERVICE는 공식 고객 서비스·배송·반품·문의, WORLD OF DIESEL은 브랜드·지속가능성·매장·OTB Foundation·채용으로 연결합니다. Privacy policy와 Terms of use는 이 사이트 안내 대화상자, Cookie policy는 공식 정책, South Korea / English는 한국 공식 스토어, Diesel is part of OTB는 공식 그룹 사이트로 연결합니다.
- 하단에는 구분선 위 여백 없이 `24px` 내부 패딩을 두고 소셜·정책·스토어를 `1fr auto 1fr`로 정렬합니다. 소셜은 **X → Instagram → YouTube** 순서의 `40 × 40px` 투명 원형 버튼, `1px solid #484848`, 간격 `12px`입니다. SVG는 원본 `28 × 28px`을 CSS `20 × 20px`로 표시합니다. 마우스 오버 시 윤곽선만 밝아집니다. 저작권 영역 대신 기존 OTB 링크와 디자인 스터디 크레디트를 `20px` 아래에 유지합니다.
- `768~1100px`에서는 중앙 열 비율 `.9fr 1.1fr`, 간격 `36px`, 위아래 패딩 `56px`을 사용합니다. 브랜드 문구는 `4.5vw`, EXPLORE는 `20px`, 보조 링크는 `12px`로 조정합니다. 하단은 2열로 정리하고 스토어 링크를 두 번째 열의 아래 줄에 둡니다.
- `767px` 이하에서는 최소 높이 `100svh`, 패딩 `32px 24px 22px`를 사용합니다. 배경 이미지는 높이 `560px`, 가로 위치 `22%`로 배치하고 아래쪽을 검정으로 연결합니다. 중앙은 1열·간격 `56px`, 패딩 `64px 0 40px`; 워드마크 `26px`, 브랜드 문구 `clamp(34px, 9.7vw, 64px)`, EXPLORE `clamp(18px, 5.1vw, 24px)`입니다. 보조 링크 2열은 유지하고 하단 소셜·정책·스토어·크레디트는 세로로 배치합니다. `359px` 이하에서는 EXPLORE 메뉴를 `17px`로 축소해 잘림을 방지합니다.

## 7. 이미지와 그래픽

- Hero1은 얼굴과 손을 크게 크롭한 컬러 인물 영상입니다. 왼쪽 하단의 흰색 DIESEL 제목과 검정 보조 카피를 사용하며, 재생 전과 오류 시에는 동일한 Figma 원본 포스터를 표시합니다.
- Con1은 흰색 바탕에 서로 다른 크기의 패션 사진을 배치합니다. 각 이미지의 비율과 여백을 보존합니다.
- 제품 소개는 중앙 세로 이미지와 양옆 텍스트로 구성합니다. Melissa 이미지 프레임은 `397 × 754px`, 1DR / D-Line 프레임은 `397 × 697px`입니다.
- MEN / WOMEN의 세 번째 이후 이미지는 내부 패널의 오른쪽 경계를 넘으며, 원본의 6개 슬롯을 가로 스크롤로 탐색합니다. 인물 머리의 잘림은 위 사용자 요청 크롭 조정을 우선 적용합니다.
- **구현 권장안:** 사진은 슬롯별로 `object-fit`과 `object-position`을 조정하고, 크롭 때문에 얼굴·제품의 중심이 바뀌지 않게 확인합니다. 제품 컷은 원본에서 보이는 제품의 크기와 잘림을 기준으로 `contain` 또는 `cover`를 선택합니다.
- 화살표와 로고는 원본 벡터·이미지 에셋을 사용합니다. 임시 Figma 다운로드 URL은 영구 에셋 경로로 사용하지 않습니다.

## 8. 반응형과 인터랙션 — 구현 권장안

아래 규칙은 대상 프레임에서 확인된 모바일 시안이나 상태별 명세가 아닌, 웹 구현을 위한 제안입니다.

| 범위 | 제안 기준 | 레이아웃 대응 |
| --- | --- | --- |
| 데스크톱 | `1024px` 이상, 원본 비교는 `1920px` | 넓은 여백과 비대칭 구성을 유지하고, 폭에 따라 대형 타이포를 축소 |
| 태블릿 | `768~1023px` | 좌우 여백 약 `24px`, 제품 설명 재배치; MEDIA는 아래의 별도 구현 기준 적용 |
| 모바일 | `767px` 이하 | 좌우 여백 `16~20px`, 제품·MEDIA는 1열, 컬렉션은 세로 구성 또는 조작 가능한 가로 목록 |

MEDIA의 구현 기준은 `1101px` 이상에서 원본의 2열, `768~1100px`에서 기사 1열·제목과 이미지의 좌우 배치, `767px` 이하에서 제목·이미지·본문의 세로 배치입니다. MEDIA 내부 좌우 여백은 태블릿 `32px`, 모바일 `24px`을 사용합니다. 이 반응형 배치는 원본 데스크톱 확인값과 구분합니다.

대형 제목은 `clamp()` 등으로 조절하되 본문 가독성을 별도로 유지합니다. 작은 화면에서 원본의 고정 섹션 높이를 해제하고 콘텐츠 길이에 따라 높이가 늘어나게 합니다. 편집용 가로 확장 화면이 문서 전체의 가로 스크롤을 만들지 않게 구성합니다.

확인한 CTA의 프로토타입 reaction은 `0`개였습니다. Hover·Focus·Active·Disabled 상태, 자동 재생, 스크롤 고정, 화면 전환 시간은 대상 프레임의 확정 명세로 취급하지 않습니다. 구현 시 링크와 버튼을 의미에 맞게 사용하고, 키보드 포커스를 표시하며, 화살표 전용 조작에는 접근 가능한 이름을 제공합니다. 장식 모션을 추가한다면 `prefers-reduced-motion`에 대응합니다.

## 9. CSS 토큰 시작점

아래 코드는 원본 확인값을 재사용하기 위한 **제안 토큰**입니다. 실제 사이트의 스타일과 웹폰트 설정은 `styles/styles.css`에 구현되어 있습니다. `--layout-reference-width`는 디자인 비교 기준이며 전체 페이지의 고정 폭을 뜻하지 않습니다.

```css
:root {
  --color-bg: #000000;
  --color-bg-inverse: #ffffff;
  --color-surface-men: #181818;
  --color-surface-women: #181818;
  --color-image-fallback: #454545;
  --color-text: #ffffff;
  --color-text-inverse: #000000;
  --color-label-muted: #9096a0;
  --color-text-men: #cccccc;
  --color-text-women: #d6d6d6;
  --color-text-keyword: #c5c5c5;
  --color-accent-soft: #ffffb3;
  --color-cta-panel: rgb(31 31 31 / 80%);
  --color-cta-circle: #1e1e1e;
  --color-cta-overlay: rgb(0 0 0 / 80%);
  --color-explore-bg: rgb(33 33 33 / 50%);
  --color-explore-border: #1a1919;

  --font-display: "Hagrid", sans-serif;
  --font-label: "Hagrid Text", "Hagrid", sans-serif;
  --font-body: "Pretendard", sans-serif;
  --weight-thin: 100;
  --weight-light: 300;
  --weight-regular: 400;
  --weight-medium: 500;

  --tracking-tight: -0.04em;
  --tracking-hero: -0.02em;
  --leading-display: 1;
  --leading-title: 1.3;
  --leading-body: 1.5;
  --leading-body-relaxed: 1.6;

  --layout-reference-width: 1920px;
  --layout-reference-height: 1080px;
  --gutter-desktop: 40px;
  --gap-product-heading: 4px;
  --gap-media-content: 26px;
  --gap-collection-images: 56px;
  --min-height-footer-link: 30px;
  --radius-default: 0;
  --radius-circle: 50%;
}

/* 원본 데스크톱 타입의 예시. 반응형 크기 조정은 별도로 적용합니다. */
.display-editorial {
  font-family: var(--font-display);
  font-size: 300px;
  font-weight: var(--weight-light);
  line-height: var(--leading-display);
  letter-spacing: var(--tracking-tight);
}

.media-body {
  font-family: var(--font-body);
  font-size: 16px;
  font-weight: var(--weight-regular);
  line-height: var(--leading-body);
  color: var(--color-text);
}
```

FUTURE의 자간은 `0`이므로 `.display-editorial`을 그대로 적용하지 않고 별도로 덮어씁니다. MEDIA의 Light 본문도 인스턴스에 맞게 `300`으로 지정합니다. 모든 제목과 본문을 하나의 공통 스타일로 합치지 않습니다.

## 10. 구현 시 확인 항목

- 1920px 기준으로 주요 제목의 크기·자간·이탤릭·줄바꿈을 원본과 비교합니다.
- MEDIA의 들여쓰기, 컬렉션 패널의 `40px` 여백과 이미지 `56px` 간격을 구분해 적용합니다.
- Hero1 영상과 포스터, 제품·컬렉션 이미지의 크롭을 각 슬롯에 맞춰 확인합니다. 영상 자동 재생·일시정지·반복, 동작 줄이기, 화면 밖·비활성 탭 정지와 포스터 대체를 확인합니다.
- 둥근 모서리는 원형 화살표에 적용하고, 원본에 없는 그림자를 추가하지 않습니다.
- 모바일에서는 본문과 CTA가 잘리지 않고, 섹션 높이가 콘텐츠에 맞게 늘어나는지 확인합니다.
- 푸터의 공식 외부 링크, 이 사이트의 정책 안내 대화상자, 공식 소셜 채널의 연결을 구분해 확인합니다.
- 가로 확장 화면의 전환 방식과 링크 목적지는 별도 동작 명세로 결정합니다.

