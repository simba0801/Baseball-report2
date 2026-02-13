#!/usr/bin/env python3
"""
Git/GitHub 초기화 및 설정 스크립트
- 로컬 리포지토리 초기화
- GitHub 리포지토리 연결
- README.md 파일 생성
- 테스트 커밋 생성 및 푸시
"""

import os
import sys
from pathlib import Path
from git import Repo
from git.exc import InvalidGitRepositoryError

# 설정값
REPO_URL = "https://github.com/simba0801/Baseball-report2"
PROJECT_DIR = Path(__file__).parent
REPO_NAME = "Baseball-report2"

print("=" * 60)
print("🚀 Git/GitHub 초기화 시작")
print("=" * 60)

# 1. 로컬 리포지토리 초기화
print("\n📦 1단계: 로컬 리포지토리 초기화")
print("-" * 60)

try:
    # 이미 리포지토리인지 확인
    try:
        repo = Repo(str(PROJECT_DIR))
        print("✅ 이미 Git 리포지토리입니다")
    except InvalidGitRepositoryError:
        # 새로 초기화
        repo = Repo.init(str(PROJECT_DIR))
        print(f"✅ 리포지토리 초기화 완료: {PROJECT_DIR}")
except Exception as e:
    print(f"❌ 오류: {e}")
    sys.exit(1)

# 2. GitHub 리모트 연결
print("\n🔗 2단계: GitHub 리모트 연결")
print("-" * 60)

try:
    # 기존 리모트 확인
    if 'origin' in [r.name for r in repo.remotes]:
        print("✅ origin 리모트가 이미 존재합니다")
        origin = repo.remote('origin')
    else:
        origin = repo.create_remote('origin', REPO_URL)
        print(f"✅ origin 리모트 추가 완료")
    
    print(f"📍 리모트 URL: {REPO_URL}")
except Exception as e:
    print(f"❌ 오류: {e}")
    sys.exit(1)

# 3. .gitignore 파일 생성
print("\n📝 3단계: .gitignore 파일 생성")
print("-" * 60)

gitignore_content = """# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
venv/
.venv
*.egg-info/
dist/
build/

# Streamlit
.streamlit/
.cache/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Sensitive data
*.env
.env
.env.local
secrets.toml
config.local.json
"""

gitignore_path = PROJECT_DIR / ".gitignore"
try:
    if not gitignore_path.exists():
        with open(gitignore_path, 'w', encoding='utf-8') as f:
            f.write(gitignore_content)
        print(f"✅ .gitignore 파일 생성 완료")
    else:
        print(f"✅ .gitignore 파일이 이미 존재합니다")
except Exception as e:
    print(f"❌ 오류: {e}")

# 4. README.md 파일 생성
print("\n📄 4단계: README.md 파일 생성")
print("-" * 60)

readme_content = """# My Streamlit App

A Streamlit application for data analysis and visualization.

## Features
- Interactive data visualization
- User-friendly interface
- Real-time data processing

## Setup
1. Create virtual environment: `python -m venv venv`
2. Activate virtual environment: `source venv/bin/activate` (Linux/Mac) or `venv\\Scripts\\activate` (Windows)
3. Install dependencies: `pip install streamlit`
4. Run app: `streamlit run app.py`

## Technologies
- Python 3.12+
- Streamlit 1.54.0+

## Author
simba0801 (bjlee@dk.co.kr)
"""

readme_path = PROJECT_DIR / "README.md"
try:
    with open(readme_path, 'w', encoding='utf-8') as f:
        f.write(readme_content)
    print(f"✅ README.md 파일 생성 완료")
except Exception as e:
    print(f"❌ 오류: {e}")
    sys.exit(1)

# 5. Git add 수행
print("\n📌 5단계: Git add 수행")
print("-" * 60)

try:
    repo.index.add(['.gitignore', 'README.md', 'app.py', 'run_streamlit.bat'])
    print(f"✅ 파일 추가 완료")
    print(f"   - .gitignore")
    print(f"   - README.md")
    print(f"   - app.py")
    print(f"   - run_streamlit.bat")
except Exception as e:
    print(f"⚠️  경고: {e}")

# 6. 테스트 커밋 생성
print("\n💾 6단계: 테스트 커밋 생성")
print("-" * 60)

try:
    # 커밋할 파일이 있는지 확인
    if repo.index.diff("HEAD"):
        repo.index.commit("Initial commit")
        print(f"✅ 커밋 생성 완료: 'Initial commit'")
    else:
        print(f"ℹ️  커밋할 파일이 없습니다")
except Exception as e:
    print(f"⚠️  경고: {e}")

# 7. 현재 상태 표시
print("\n📊 7단계: 현재 상태 확인")
print("-" * 60)

try:
    print(f"✅ 현재 브랜치: {repo.active_branch}")
    print(f"✅ 리모트 URL: {repo.remote('origin').url}")
    print(f"✅ 작업 디렉토리: {PROJECT_DIR}")
except Exception as e:
    print(f"⚠️  경고: {e}")

print("\n" + "=" * 60)
print("✅ 초기화 준비 완료!")
print("=" * 60)
print("\n📝 다음 단계:")
print("1. GitHub에 로그인: https://github.com/login")
print("2. 리포지토리 생성: https://github.com/new")
print("   - 리포지토리명: Baseball-report2")
print("   - 공개 상태: Private")
print("3. 다음 명령 실행:")
print("   python push_to_github.py")
print("\n💡 팁: 푸시 시 브라우저에서 GitHub 로그인이 필요합니다")
print("=" * 60)
