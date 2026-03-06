# Baseball-report2

야구 선수의 경기 기록을 관리하고 분석하는 Streamlit 기반 웹 애플리케이션입니다.

## 🚀 빠른 시작

### 애플리케이션 실행
```bash
streamlit run app.py
```

또는
```bash
./run_streamlit.bat
```

---

## 📝 개발 워크플로우

### 0️⃣ 세션 시작 시 확인 사항

매번 세션을 시작할 때 다음을 확인하세요:

```bash
# 1. 현재 브랜치 확인
git branch

# 2. 변경사항 조회
git status

# 3. 변경 내용 확인
git diff
```

---

### 1️⃣ 변경사항이 있을 때 (자동 처리 프로세스)

#### Step 1: 변경사항 확인
```bash
git status          # 변경된 파일 확인
git diff            # 변경 내용 상세 확인
```

#### Step 2: 커밋
```bash
git add .
git commit -m "설명적인 커밋 메시지"
```

**커밋 메시지 작성 가이드:**
- ✨ 새 기능: `feat: 기능 설명`
- 🐛 버그 수정: `fix: 버그 설명`
- 📝 문서 수정: `docs: 문서 설명`
- 🔧 설정 변경: `chore: 변경 내용`
- 🎨 코드 스타일: `style: 스타일 변경`
- ♻️ 리팩토링: `refactor: 리팩토링 내용`

#### Step 3: Push
```bash
git push origin main
```

#### Step 4: 커밋 리비전 확인
```bash
git log --oneline -5    # 최근 5개 커밋 확인
```

**출력 예시:**
```
ee93529 Implement detailed baseball game recording screen
0701da5 Add 5-screen baseball player management system
4b47dd8 Initial commit
...
```

---

### 2️⃣ 한 번에 처리하는 자동 스크립트

```bash
# 모든 변경사항을 자동으로 커밋하고 푸시
git add . && git commit -m "작업 내용" && git push origin main

# 최신 커밋 해시 확인
git rev-parse --short HEAD
```

---

### 3️⃣ 변경사항 없을 때
```
On branch main
Your branch is up to date with 'origin/main'.
nothing to commit, working tree clean
```

이 메시지가 나타나면 이미 모든 변경사항이 푸시된 상태입니다. ✅

---

## 📊 프로젝트 구조

```
c:\System_0213\
├── app.py                 # 메인 애플리케이션 (5개 화면)
├── users.json             # 사용자 계정 정보
├── players.json           # 선수 정보
├── records.json           # 경기 기록
├── requirements.txt       # Python 의존성
├── run_streamlit.bat      # 실행 스크립트
└── README.md              # 이 파일
```

---

## 🎯 애플리케이션 기능

### 화면 1: 홈 화면
- 로그인, 선수등록, 기록하기, 결과조회 버튼

### 화면 2: 회원가입/선수등록
- 이메일, ID, PW 입력
- 이름, 키, 몸무게, 학력 정보 입력

### 화면 3: 로그인
- 기존 사용자 로그인

### 화면 4: 입력하기 (상세)
- 경기 정보 입력
- 등판 구분 (선발/중간/마무리)
- 투구 기록 (Zone 선택 또는 수동 선택)
- 타격 결과 및 에러 처리
- 실점/자책점 자동 계산

### 화면 5: 결과조회
- 선수 정보 및 경기 통계 조회
- 투구별 상세 기록 확인

---

## 🔄 Git 커밋 히스토리

| 커밋 | 설명 |
|------|------|
| ee93529 | Implement detailed baseball game recording screen with pitch tracking and zone mapping |
| 0701da5 | Add 5-screen baseball player management system with authentication and record tracking |

커밋 상세 확인: `git log --oneline`

---

## 📚 기술 스택

- **Frontend**: Streamlit
- **Backend**: Python
- **Data Storage**: JSON
- **Version Control**: Git

---

## ⚙️ 설정

### 필수 설치
```bash
pip install -r requirements.txt
```

### 환경 확인
```bash
python --version
pip list | grep streamlit
```

---

## 🐛 트러블슈팅

### Streamlit 실행 오류
```bash
# 캐시 삭제
streamlit cache clear

# 다시 실행
streamlit run app.py
```

### Git 오류

#### "working tree dirty" 오류
```bash
git add .
git commit -m "설정된 내용"
```

#### "Your branch is ahead" 오류
```bash
git push origin main
```

---

## 📞 지원

문제 발생 시 `git status`를 먼저 실행하고, `git log --oneline -3`으로 최근 커밋을 확인하세요.

---

## 📅 마지막 업데이트

**날짜**: 2026-03-06  
**최신 커밋**: `ee93529`  
**상태**: ✅ 모든 변경사항 푸시 완료