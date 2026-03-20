# Baseball Report - Next.js 마이그레이션 프로젝트

Streamlit Python 애플리케이션을 Next.js 14 TypeScript로 완전히 마이그레이션한 프로젝트입니다.

## 🎯 프로젝트 개요

**원본**: Streamlit 기반 Python 야구 스카우팅 데이터 관리 시스템
**마이그레이션**: Next.js 14 + React 18 + TypeScript + Tailwind CSS

### 주요 기능

- ✅ 사용자 인증 (로그인/회원가입)
- ✅ 선수 정보 관리 (3-tier 학력 정보)
- ✅ **게임 기록 입력** (PitchPad 5x5 그리드)
- ✅ 투구 기록 및 특수 상황 관리
- ✅ 게임 결과 조회 및 통계
- ✅ 실시간 게임 상태 추적

## 📁 프로젝트 구조

```
baseball-report-nextjs/
├── app/                          # Next.js 14 App Router
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Home dashboard
│   ├── globals.css              # Global styles
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── player/
│   │   └── register/page.tsx
│   └── record/
│       ├── input/page.tsx        # ⭐ Main feature - Record input with PitchPad
│       └── results/page.tsx      # Game results & statistics
│
├── components/                   # React components
│   ├── Layout/
│   │   ├── Header.tsx
│   │   └── Sidebar.tsx
│   ├── Common/                  # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── StatCard.tsx
│   │   └── Toast.tsx
│   ├── Record/                  # Game recording components
│   │   ├── PitchPad.tsx         # 5x5 strike zone grid
│   │   ├── GameStatus.tsx       # Ball/Strike/Out display
│   │   └── BatterActionPanel.tsx
│   └── index.ts
│
├── types/
│   └── index.ts                 # TypeScript interfaces
│
├── hooks/                       # Custom React hooks
│   ├── useGameSession.ts        # Game state management
│   ├── useRecords.ts            # Game records & players
│   ├── useAuth.ts               # Authentication
│   ├── useToast.ts              # Toast notifications
│   └── index.ts
│
├── context/                     # React Context API
│   ├── AuthContext.tsx
│   ├── GameContext.tsx
│   ├── ToastContext.tsx
│   └── index.ts
│
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
├── postcss.config.js
└── README.md
```

## 🚀 설치 및 실행

### 필수 요구사항

- Node.js 18+ 
- npm 또는 yarn

### 설치

```bash
# 1. 프로젝트 폴더로 이동
cd baseball-report-nextjs

# 2. 의존성 설치
npm install

# 3. 개발 서버 실행
npm run dev

# 4. 브라우저에서 확인
# http://localhost:3000
```

### 빌드 및 배포

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# 타입 검사
npm run type-check
```

## 🔑 테스트 계정

```
ID: admin
Password: 1111
```

## 🎮 사용 방법

### 1. 로그인
- 테스트 계정으로 로그인

### 2. 선수 정보 등록
- Home → Player Registration으로 이동
- 선수명, 포지션, 신체 정보, 학력 정보 입력

### 3. 게임 기록 입력
- Home → Record Input으로 이동
- "새 게임 시작" 버튼으로 게임 시작
- **PitchPad**: 5x5 그리드에서 투구 구역 선택 (1-25)
  - 초록색: Strike Zone (중앙 3x3)
  - 파란색: Ball Zone (주변)
- **투구 결과**: Strike / Ball / Swinging Strike 선택
- **타자 행동**: Hit / Foul / K (Strikeout)
- **특수 상황**: Wild Pitch / Passed Ball / Balk 등
- "게임 저장" 버튼으로 저장

### 4. 결과 조회
- Home → Results View로 이동
- 경기별 상세 기록 및 통계 확인

## 📊 주요 컴포넌트

### PitchPad (투구 구역 선택)
- 5x5 그리드 (25개 구역)
- Strike Zone: 중앙 3x3 (구역 8, 9, 10, 13, 14, 15, 18, 19, 20)
- Ball Zone: 주변부
- 클릭으로 구역 선택

### GameStatus (게임 상태 표시)
- Ball Count (0-4)
- Strike Count (0-3)
- Out Count (0-3)
- 베이스 상태 (1루, 2루, 3루)
- 이닝 및 타자 순번

### BatterActionPanel (타자 행동 기록)
- 투구 결과: Strike / Ball / Swinging Strike
- 타자 행동: Hit / Foul / K
- 특수 상황: 6가지 상황

## 🏗️ 아키텍처

### 상태 관리

#### React Context API + useReducer
- **AuthContext**: 사용자 인증 상태
- **GameContext**: 진행 중인 게임 상태
- **ToastContext**: 알림 메시지

#### Custom Hooks
- **useGameSession**: 복잡한 게임 상태 로직
  - Ball/Strike/Out 카운트 관리
  - 베이스 상태 업데이트
  - 투구 기록 저장
  
- **useRecords**: 게임 기록 및 선수 정보
  - localStorage 기반 CRUD
  - 통계 계산
  - 필터링 및 검색

- **useAuth**: 사용자 인증
  - 로그인/회원가입
  - 토큰 관리
  - 사용자 정보 저장

- **useToast**: 알림 시스템
  - 성공/실패/정보/경고 메시지

### 데이터 저장

**localStorage 기반** (간단한 프로토타입용)
- `baseball_users`: 사용자 정보
- `baseball_players`: 선수 정보
- `baseball_records`: 게임 기록

**프로덕션 환경**: FastAPI 백엔드 연동 필요

## 🎨 UI/UX 특징

### Material Design System
- **색상**: Primary (#005e93), Secondary (#984800), Tertiary (#7f34af)
- **아이콘**: Material Symbols Outlined
- **폰트**: Inter

### Responsive Design
- Mobile: 1 column
- Tablet (md): 2-3 columns
- Desktop (lg): Sidebar + 3+ columns

### Accessibility
- 시맨틱 HTML
- ARIA 레이블
- 키보드 네비게이션
- 포커스 상태 시각화

## 📝 Streamlit 대비 개선사항

### 성능
- ✅ 클라이언트 사이드 렌더링 (빠른 UI 업데이트)
- ✅ 번들 최적화 (Tree shaking, Code splitting)
- ✅ 이미지 최적화

### 개발 경험
- ✅ Full TypeScript (type safety)
- ✅ React DevTools 지원
- ✅ Hot Module Replacement (HMR)

### 확장성
- ✅ Component-based architecture
- ✅ Custom hooks reusability
- ✅ Context API for global state
- ✅ 쉬운 백엔드 연동

## 🔄 Streamlit → React 마이그레이션 패턴

```python
# STREAMLIT
st.session_state.ball_count += 1
st.metric("Ball Count", st.session_state.ball_count)

# REACT
const [ballCount, setBallCount] = useState(0);
setBallCount(prev => prev + 1);
// Display in component
<div className="text-2xl">{ballCount}</div>
```

```python
# STREAMLIT
if st.button("Record Pitch"):
    # ... logic

# REACT
<button onClick={handleRecordPitch}>
  Record Pitch
</button>
```

## 🚧 향후 개선사항

1. **백엔드 API 연동**
   - FastAPI 서버 구성
   - JWT 인증
   - 데이터베이스 (PostgreSQL)

2. **고급 기능**
   - 투구 타입별 분석
   - 그래프/차트 분석
   - 선수별 상세 통계
   - 기간별 비교

3. **모바일 최적화**
   - 터치 인터페이스 개선
   - 오프라인 지원 (PWA)

4. **테스트**
   - Unit tests (Jest)
   - E2E tests (Cypress)
   - Integration tests

## 📚 참고 자료

- [Next.js 14 Documentation](https://nextjs.org/docs)
- [React 18 Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Material Design](https://material.io/design)

## 📄 라이선스

MIT License

## 👤 작성자

Baseball Report 마이그레이션 프로젝트
