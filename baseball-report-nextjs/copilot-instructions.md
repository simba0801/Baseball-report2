---
title: "Baseball Report: Streamlit → Next.js 14 마이그레이션"
description: |
  Streamlit Python 야구 스카우팅 시스템을 Next.js 14 TypeScript로 마이그레이션하는 프로젝트.
  
  Use this when:
  - React Hook과 Context API 상태 관리 구현
  - PitchPad (5x5 터치패드) 같은 복잡한 UI 컴포넌트 개발
  - Streamlit Python 로직을 React로 변환
  - Tailwind + Material Design System 스타일링
  - TypeScript 타입 안전성 우선 개발
  
  Use rules: lazy-load-context, type-first, component-driven, stream-to-react-patterns
---

# Baseball Report - Next.js Migration
## 프로젝트 세션 시작 문서

---

## 🎯 프로젝트 개요

| 항목 | 내용 |
|------|------|
| **프로젝트명** | Baseball Report (야구 스카우팅 데이터 관리) |
| **원본** | Streamlit Python (900줄) |
| **대상** | Next.js 14 + React 18 + TypeScript |
| **상태** | 📋 설계 완료 → 🛠️ 구현 중 (Week 1 기초 레이아웃 완료) |
| **주요 기능** | 게임 기록 입력 (PitchPad 5x5 그리드), 선수 정보 관리, 결과 조회 통계 |

---

## 📁 프로젝트 구조 (활성)

```
c:\System_0213\
├── baseball-report-nextjs/        # ← 현재 작업 폴더
│   ├── app/
│   │   ├── page.tsx               # Home Dashboard
│   │   ├── layout.tsx             # Root + Providers
│   │   ├── auth/ (login, signup)
│   │   ├── player/register/
│   │   └── record/ (input ⭐, results)
│   ├── components/
│   │   ├── Layout/ (Header, Sidebar)
│   │   ├── Common/ (Button, Card, Input, Toast)
│   │   └── Record/ (PitchPad ⭐, GameStatus, BatterActionPanel)
│   ├── hooks/ (useGameSession ⭐, useRecords, useAuth, useToast)
│   ├── context/ (AuthContext, GameContext, ToastContext)
│   ├── types/index.ts (12개 인터페이스)
│   └── package.json
│
├── 설계 문서 (완료)
│   ├── [문서1]_기술기능_설계서.md (3500+ 줄)
│   └── [문서2]_디자인마이그레이션_설계서.md (1542 줄)
│
└── Stitch UI 컴포넌트 (참조)
    └── C:\Users\simba\Desktop\00_이범준\02_시스템구축\stitch/
        ├── home_dashboard/ (Header + Sidebar)
        ├── match_record_pitchpad/ (5x5 그리드)
        └── results_view/ (Results 레이아웃)
```

---

## 🔑 핵심 개념 & 패턴

### 1️⃣ Streamlit → React 변환 패턴

**가장 자주 변환되는 패턴:**

| Streamlit | React Equivalent | 파일 |
|-----------|-----------------|------|
| `st.session_state` | `useState` + `useReducer` | `hooks/useGameSession.ts` |
| `st.metric()` | `<StatCard>` | `components/Common/StatCard.tsx` |
| `st.button()` | `<Button>` | `components/Common/Button.tsx` |
| `st.columns()` | Tailwind `grid` | `app/record/input/page.tsx` |
| `st.expander()` | Accordion (커스텀) | `app/record/results/page.tsx` |
| `st.error/success/warning` | `<ToastNotification>` | `context/ToastContext.tsx` |

**중요**: Streamlit의 stateless rerun() 모델과 달리, React는 상태 변경 시 해당 컴포넌트만 리렌더링됨.

### 2️⃣ 복잡한 상태 관리 (게임 세션)

**useGameSession Hook이 관리하는 것:**
```typescript
GameSession = {
  date, opponent, position,
  inning, batter_order, batter_hand,
  out_count, ball_count, strike_count,
  bases: { first, second, third },
  pitches: Pitch[],  // ← 핵심: 배열 추가/업데이트
  runs, earned_runs, errors
}
```

**상태 업데이트 시 주의사항:**
- ❌ `gameSession.ball_count++` (직접 수정)
- ✅ `setBallCount(prev => Math.min(prev + 1, 4))` (불변성)
- Array update: `setGameSession(prev => ({ ...prev, pitches: [...prev.pitches, newPitch] }))`

### 3️⃣ PitchPad 컴포넌트 (⭐ 가장 복잡)

**구역 배치 (5x5 그리드):**
```
   10 11 12 13 14
   15  1  2  3 16
   17  4  5  6 18
   19  7  8  9 20
   21 22 23 24 25

1-9: Strike Zone (보라/초록)
10-25: Ball Zone (주황/파란)
```

**클릭 시 동작:**
1. `selectedZone` 상태 업데이트
2. UI feedback: ring-4, shadow-xl
3. 부모에 `onZoneSelect(zone)` 콜백 실행
4. parent에서 Pitch 레코드 생성 → 저장

---

## 📋 개발 가이드라인

### A. 타입 안전성 (Priority 1)

**모든 컴포넌트는 먼저 타입 정의부터:**
```typescript
// ❌ 나쁜 예
export function GameStatus(props: any) { ... }

// ✅ 좋은 예
interface GameStatusProps {
  ballCount: number;
  strikeCount: number;
  outCount: number;
  bases: GameSession["bases"];
}
export function GameStatus(props: GameStatusProps) { ... }
```

**실행 규칙:**
- `types/index.ts`에서 인터페이스 정의
- 모든 함수에 반환 타입 명시: `const fn = (): string => { }`
- Zod 스키마로 런타임 검증 (폼 입력)

### B. 컴포넌트 설계

**원칙 1: Single Responsibility**
```typescript
// ❌ 하나 컴포넌트에 너무 많은 책임
<RecordInputPage>  // 폼 입력 + 투구 기록 + 게임 상태판 + 저장 로직

// ✅ 책임 분리
<RecordInputPage>
  ├── <GameInfoForm> (경기 정보)
  ├── <PitchPad> (구역 선택)
  ├── <GameStatus> (상태 표시)
  ├── <BatterActionPanel> (행동 기록)
  └── <PitchHistory> (기록 목록)
```

**원칙 2: Props는 최소한으로**
- 필요한 데이터만 props로 전달
- 복잡한 상태는 Context 또는 Hook 사용

**원칙 3: 콜백보다 상태 업데이트**
```typescript
// ❌ 과도한 콜백
<PitchPad 
  onZoneSelect={onZoneSelect}
  onHover={onHover}
  onError={onError}
/>

// ✅ 상태로 관리
const { gameSession, recordPitch } = useGameSession();
<PitchPad selectedZone={gameSession.selectedZone} onZoneSelect={recordPitch} />
```

### C. Hook 사용 규칙

**Custom Hook 네이밍:**
- `useGameSession()` - 게임 상태 + CRUD
- `useRecords()` - 기록 저장/로드/검색
- `useAuth()` - 인증 상태 관리
- `useToast()` - 알림 메시지

**Hook 규칙:**
- Hook은 컴포넌트 최상단에서만 호출
- 조건부 호출 금지: `if (condition) { useHook() }` ❌
- Hook 내부에서만 다른 Hook 호출 가능

### D. 상태 관리 레벨

| 레벨 | 사용처 | 예시 |
|------|-------|------|
| **Local** | 단일 컴포넌트 | `const [expanded, setExpanded] = useState(false)` |
| **Hook** | 여러 컴포넌트 공유 | `useGameSession()` (게임 로직) |
| **Context** | 전역 상태 | `AuthContext` (로그인 사용자) |
| **localStorage** | 영속 저장 | 게임 기록, 선수 정보 |

**선택 기준:**
```
Local State? → 이 컴포넌트에서만 필요한가?
Hook? → 여러 컴포넌트가 공유하는 도메인 로직인가?
Context? → 모든 페이지에서 필요한가? (auth, theme)
localStorage? → 페이지 새로고침 후에도 유지되어야 하는가?
```

---

## 🚀 구현 우선순위 (다음 단계)

### Week 1: ✅ Foundation (완료)
- [x] Project structure
- [x] TypeScript types (types/index.ts)
- [x] Context API (Auth, Game, Toast)
- [x] Custom Hooks (useGameSession, useRecords, useAuth)
- [x] Common components (Button, Card, Input, Toast)
- [x] Layout components (Header, Sidebar)

### Week 2: ✅ Complete
- [x] Page implementations
  - [x] Home dashboard (basic stats display)
  - [x] Auth pages (login, signup)
  - [x] Player register (3-step form)
  - [x] Record input (⭐ PRIORITY) with PitchPad
  - [x] Results page (accordion + stats)
- [x] All components fully typed and styled
- [x] localStorage integration for data persistence
- [x] Toast notification system
- [x] Game session state machine

### Week 3: 🔄 In Progress (Polish & Testing)
- [ ] Form validation (React Hook Form + Zod)
- [ ] Error handling & edge cases
- [ ] Responsive design testing (mobile/tablet/desktop)
- [ ] Performance optimization
- [ ] Accessibility (a11y) review
- [ ] Component storybook documentation (optional)

### Week 4+: 🎯 Future Phases
- [ ] Backend integration (FastAPI API)
- [ ] Database connection (PostgreSQL)
- [ ] Advanced analytics features
- [ ] PWA support (offline mode)
- [ ] E2E testing (Cypress/Playwright)
- [ ] GitHub Rules customization
- [ ] Skills & best practices documentation

---

## 📚 주요 파일 및 역할

| 파일 | 역할 | 우선순위 |
|------|------|---------|
| `types/index.ts` | 모든 데이터 타입 정의 | ✅ 완료 |
| `hooks/useGameSession.ts` | 복잡한 게임 상태 로직 | ✅ 완료 |
| `components/Record/PitchPad.tsx` | 5x5 터치패드 | 🔴 높음 |
| `components/Record/GameStatus.tsx` | B/S/O 카운트 표시 | 🔴 높음 |
| `app/record/input/page.tsx` | 게임 기록 입력 페이지 | 🔴 높음 |
| `app/record/results/page.tsx` | 결과 조회 페이지 | 🟡 중간 |
| `hooks/useRecords.ts` | CRUD + 통계 | 🔴 높음 |

---

## 🎮 테스트 계정

```
ID: admin
Password: 1111
```

**테스트 시나리오:**
1. 로그인 → 홈 대시보드 확인
2. Player Register → 3단계 폼 작성 → 저장
3. Record Input ⭐
   - 경기 정보 입력
   - PitchPad에서 구역 선택
   - 투구 결과 기록
   - 게임 저장
4. Results → 경기 기록 조회 & 통계 확인

---

## 🔗 관련 문서

- **[문서1] 기술기능_설계서**: AS-IS 분석, TO-BE 아키텍처, API 스펙, TypeScript 타입 정의
- **[문서2] 디자인마이그레이션_설계서**: UI/UX 상세 설계, 컴포넌트 명세, 레이아웃, 색상 시스템
- **README.md** (프로젝트 루트): 설치 & 실행 가이드

---

## ⚙️ 개발 환경

```bash
# 1. 원본 Python 환경 (참조용)
c:\System_0213\venv\Scripts\Activate.ps1
python app.py

# 2. Next.js 개발 환경
cd c:\System_0213\baseball-report-nextjs
npm install
npm run dev
# http://localhost:3000
```

**주요 의존성:**
- Next.js 14
- React 18
- TypeScript 5
- Tailwind CSS 3.3
- React Hook Form (폼 검증)

---

## 🎨 색상 시스템 (Material Design)

| 색상 | 코드 | 용도 |
|------|------|------|
| Primary | `#005e93` | 주요 버튼, 선택된 상태 |
| Secondary | `#984800` | 두 번째 행동, 경고 |
| Tertiary | `#7f34af` | 강조, 스페셜 |
| Success | `#2ca02c` | 성공, 확인 |
| Error | `#ba1a1a` | 에러, 위험 |
| Success/Info | Material Design 팔레트 | 토스트 메시지 |

---

## 🚫 하지 말아야 할 것

❌ **절대 금지:**
- localStorage 직접 조작 (hook 사용)
- 컴포넌트에서 직접 API 호출 (hook으로 추상화)
- Props drilling 3개 레벨 이상 (Context 또는 Hook 사용)
- 타입 any 사용 (항상 구체적인 타입)
- Streamlit 스타일의 전체 페이지 리렌더링 노리즘

✅ **권장:**
- Hook으로 로직 추상화
- Context로 전역 상태 관리
- 타입 먼저 개발
- 컴포넌트는 UI 표시에만 집중
- 테스트 가능한 구조

---

## 💡 문제 해결

### Q: Ball/Strike 카운트가 제대로 업데이트 안 됨
**A:** `setGameSession` 사용 시 불변성 유지 확인
```typescript
// ❌ 잘못된 예
gameSession.ball_count++

// ✅ 올바른 예
setGameSession(prev => ({ ...prev, ball_count: prev.ball_count + 1 }))
```

### Q: PitchPad에서 선택한 구역이 보이지 않음
**A:** CSS 선택자 확인 (Tailwind ring-4, shadow-xl 등)
```typescript
{selectedZone === zone ? 'ring-4 ring-primary shadow-xl' : ''}
```

### Q: 투구 기록이 저장 안 됨
**A:** localStorage 확인, recordPitch Hook 반환값 확인
```typescript
const { recordPitch } = useGameSession();
// recordPitch 함수에서 배열 업데이트 로직 확인
```

---

## 📞 지원 요청

agent 호출 시 사용할 명령:
```
@Baseball Report 마이그레이션 - PitchPad 컴포넌트 개선
@Baseball Report 마이그레이션 - 게임 상태 관리 troubleshoot
```

---

**마지막 업데이트:** 2026-03-20 (Week 2 완료)  
**상태:** ✅ Week 1-2 Complete - Ready for Week 3 Testing & Refinement
