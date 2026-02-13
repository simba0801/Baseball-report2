#!/usr/bin/env python3
import os
import configparser

# Git 사용자 정보 설정
username = "simba0801"
email = "bjlee@dk.co.kr"

print("🔧 Git 사용자 정보 설정 중...")
print(f"사용자 이름: {username}")
print(f"이메일: {email}")

# .gitconfig 파일 경로
gitconfig_path = os.path.expanduser("~/.gitconfig")

try:
    # 기존 설정 읽기 (없으면 새로 생성)
    config = configparser.ConfigParser()
    if os.path.exists(gitconfig_path):
        config.read(gitconfig_path)
    
    # user 섹션이 없으면 생성
    if 'user' not in config:
        config['user'] = {}
    
    # 사용자 정보 설정
    config['user']['name'] = username
    config['user']['email'] = email
    
    # init 섹션 설정
    if 'init' not in config:
        config['init'] = {}
    config['init']['defaultBranch'] = 'main'
    
    # 파일에 쓰기
    with open(gitconfig_path, 'w') as configfile:
        config.write(configfile)
    
    print(f"✅ 사용자 이름 설정 완료: {username}")
    print(f"✅ 이메일 설정 완료: {email}")
    print(f"✅ 기본 브랜치명 설정 완료: main")
    print(f"\n✅ Git 설정 완료!")
    print(f"\n📁 설정 파일: {gitconfig_path}")
    
except Exception as e:
    print(f"❌ 오류 발생: {e}")
    import traceback
    traceback.print_exc()
