# Perfume Compare Frontend

향수 비교 웹사이트의 프론트엔드입니다. 향수 목록을 무한 스크롤로 둘러보고, 두 개의 향수를 골라 비교할 수 있습니다.

백엔드: [perfume-compare-backend](https://github.com/hangjea/perfume-compare-backend)

---

## ✨ 주요 기능

- 향수 목록 그리드 뷰 (반응형: 1 / 2 / 3 / 4열)
- 무한 스크롤로 다음 페이지 자동 로드
- 향수 카드에서 가격, 지속력, 발향력 확인
- 비교할 향수 선택 (최대 2개) 및 선택 현황 바 표시
- 향수 상세 페이지, 비교 페이지 (개발 예정)

---

## 🛠️ 기술 스택

| 항목 | 기술 |
| --- | --- |
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| 상태 관리 | Zustand |
| HTTP 클라이언트 | Axios |
| 무한 스크롤 | react-intersection-observer |
| 차트 | Recharts (향료 구성 시각화용, 상세 페이지에서 사용 예정) |

---

## 📁 프로젝트 구조

```
src/
├── app/
│   └── page.tsx               # 메인 페이지 (향수 목록, 무한 스크롤)
├── components/
│   └── PerfumeCard.tsx        # 향수 카드 (비교 선택 버튼 포함)
├── lib/
│   └── api.ts                 # 백엔드 API 호출 함수
├── store/
│   └── compareStore.ts        # 비교할 향수 선택 상태 (Zustand)
└── types/
    └── perfume.ts             # Perfume, Note, PurchaseLink 타입
```

---

## 🚀 실행 방법

### 사전 준비

- Node.js 18 이상
- 백엔드 서버 실행 중 (`http://localhost:3001`)
  - 실행 방법과 테스트 데이터 생성은 [백엔드 README](https://github.com/hangjea/perfume-compare-backend)를 참고하세요.

### 1. 설치

```bash
npm install
```

### 2. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 만듭니다.

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

설정하지 않으면 `http://localhost:3001`이 기본값으로 사용됩니다.

### 3. 개발 서버 실행

```bash
npm run dev
```

`http://localhost:3000`에서 확인할 수 있습니다.

### 빌드

```bash
npm run build
npm run start
```

---

## 🔌 사용하는 백엔드 API

| 함수 (`lib/api.ts`) | 요청 | 설명 |
| --- | --- | --- |
| `fetchPerfumes` | `GET /api/perfumes` | 향수 목록 (page, limit, search, brand) |
| `fetchPerfumeById` | `GET /api/perfumes/:id` | 향수 상세 |
| `comparePerfumes` | `GET /api/perfumes/compare?ids=id1,id2` | 두 향수 비교 |

백엔드는 CORS를 `http://localhost:3000`에서 오는 요청만 허용합니다. 포트를 바꿔서 실행하면 백엔드 설정도 함께 바꿔야 합니다.

---

## 🧩 동작 방식

- **무한 스크롤**: 목록 맨 아래의 감지 영역이 화면에 들어오면 다음 페이지를 불러옵니다. 마지막 페이지에 도달하면 로드를 멈추고 안내 문구를 보여줍니다.
- **향수 비교 선택**: Zustand 스토어(`compareStore`)가 선택한 향수 ID를 최대 2개까지 관리합니다. 2개가 선택되면 상단 바에 비교 페이지로 이동하는 버튼이 나타납니다.

---

## 🗺️ 개발 진행 현황

- [x] API 호출 함수, 타입 정의, Zustand 스토어
- [x] PerfumeCard 컴포넌트
- [x] 메인 페이지 (그리드, 무한 스크롤, 비교 선택 바)
- [ ] 상세 페이지 `/perfumes/[id]` (향료 노트 차트, 구매 링크)
- [ ] 비교 페이지 `/compare` (공통/고유 노트 하이라이트, 구매 링크)
- [ ] 검색 및 브랜드 필터 UI
- [ ] 로딩/에러 상태 개선
- [ ] 배포 (Vercel)

---

## 📝 알려진 제한사항

- 상세 페이지와 비교 페이지가 아직 없어서, 카드를 클릭하거나 비교 버튼을 눌러 이동하면 404 페이지가 표시됩니다.
- 검색과 브랜드 필터는 API에서만 지원되고, 화면에는 아직 입력 UI가 없습니다.
- 향수 이미지는 시드 데이터의 임시(placeholder) URL을 사용합니다.

---

## 🤖 AI 도구 활용 내역

| 도구 | 활용 방식 |
| --- | --- |
| Claude (Anthropic) | Next.js 컴포넌트 구조, Zustand 스토어, 무한 스크롤 구현 초안 작성 및 에러 디버깅 |
