#!/usr/bin/env python3
"""
GitHub CLI 자동 인증 및 리포지토리 설정 스크립트
"""

import subprocess
import sys
import os
from pathlib import Path

def run_command(cmd, input_text=None, cwd=None):
    """명령 실행"""
    try:
        result = subprocess.run(
            cmd,
            input=input_text,
            text=True,
            capture_output=True,
            shell=True,
            cwd=cwd or os.getcwd()
        )
        return result.returncode, result.stdout, result.stderr
    except Exception as e:
        print(f"❌ 오류: {e}")
        return 1, "", str(e)

print("=" * 70)
print("🚀 GitHub CLI 자동 설정 스크립트")
print("=" * 70)

# 1. 현재 인증 상태 확인
print("\n📋 1단계: 현재 인증 상태 확인")
print("-" * 70)
code, stdout, stderr = run_command("gh auth status")
if code == 0:
    print("✅ 이미 GitHub에 로그인되어 있습니다!")
    print(stdout)
else:
    print("❌ GitHub에 로그인되어 있지 않습니다. 인증을 시작합니다...")
    
    # 2. GitHub CLI 인증
    print("\n📝 2단계: GitHub CLI 인증")
    print("-" * 70)
    
    # 대화형 인증 (웹 기반)
    print("\n다음 명령을 실행합니다:")
    print("  gh auth login --git-protocol https")
    print("\n프롬프트에 다음과 같이 답변해주세요:")
    print("  1. 'Where do you use GitHub?' → GitHub.com")
    print("  2. 'Authenticate Git with your GitHub credentials?' → Y")
    print("  3. 브라우저에서 https://github.com/login/device 접속")
    print("  4. 제공된 코드 입력 및 로그인")
    print("\n" + "-" * 70)
    
    # 자동 입력으로 시도
    auth_process = subprocess.Popen(
        "gh auth login --git-protocol https",
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        shell=True
    )
    
    try:
        # 프롬프트 대기
        import time
        time.sleep(2)
        
        # Y 입력
        auth_process.stdin.write("Y\n")
        auth_process.stdin.flush()
        
        # 프로세스 종료 대기
        stdout, stderr = auth_process.communicate(timeout=10)
        
        # 출력 처리
        if "https://github.com/login/device" in stdout or "https://github.com/login/device" in stderr:
            print("\n✅ 브라우저 인증 URL이 생성되었습니다!")
            print("\n" + "=" * 70)
            print("🌐 브라우저에서 다음을 수행해주세요:")
            print("=" * 70)
            print("1. https://github.com/login/device 에 접속")
            print("2. GitHub 계정으로 로그인")
            print("3. 제공된 인증 코드 입력")
            print("4. 'Authorize GitHub CLI' 승인")
            print("=" * 70)
            
            # 인증 완료 대기
            print("\n⏳ 인증 완료 대기 중... (30초)")
            time.sleep(30)
            
            # 인증 상태 재확인
            code, stdout, stderr = run_command("gh auth status")
            if code == 0:
                print("✅ GitHub 인증 완료!")
                print(stdout)
            else:
                print("❌ 인증이 아직 완료되지 않았거나 실패했습니다.")
                print("⚠️  다음을 수동으로 실행해주세요:")
                print("    gh auth login --git-protocol https")
        
    except subprocess.TimeoutExpired:
        auth_process.kill()
        print("⚠️  타임아웃 발생. 수동으로 인증 진행 필요")

print("\n" + "=" * 70)
print("✅ 스크립트 완료!")
print("=" * 70)
