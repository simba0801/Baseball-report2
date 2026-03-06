"""
Baseball Report - 야구 선수 기록 분석 시스템
"""

import streamlit as st
import pandas as pd
import json
from datetime import datetime
from pathlib import Path

# ====================================
# 📊 페이지 설정
# ====================================
st.set_page_config(
    page_title="Baseball Report",
    page_icon="⚾",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# ====================================
# 💾 데이터 저장소 설정
# ====================================
USERS_FILE = "users.json"
PLAYERS_FILE = "players.json"
RECORDS_FILE = "records.json"

def load_users():
    """사용자 정보 로드"""
    if Path(USERS_FILE).exists():
        with open(USERS_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {}

def save_users(users):
    """사용자 정보 저장"""
    with open(USERS_FILE, 'w', encoding='utf-8') as f:
        json.dump(users, f, ensure_ascii=False, indent=2)

def load_players():
    """선수 정보 로드"""
    if Path(PLAYERS_FILE).exists():
        with open(PLAYERS_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {}

def save_players(players):
    """선수 정보 저장"""
    with open(PLAYERS_FILE, 'w', encoding='utf-8') as f:
        json.dump(players, f, ensure_ascii=False, indent=2)

def load_records():
    """경기 기록 로드"""
    if Path(RECORDS_FILE).exists():
        with open(RECORDS_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {}

def save_records(records):
    """경기 기록 저장"""
    with open(RECORDS_FILE, 'w', encoding='utf-8') as f:
        json.dump(records, f, ensure_ascii=False, indent=2)

# ====================================
# 🔐 세션 상태 초기화
# ====================================
if "current_screen" not in st.session_state:
    st.session_state.current_screen = "home"

if "logged_in_user" not in st.session_state:
    st.session_state.logged_in_user = None

if "user_id" not in st.session_state:
    st.session_state.user_id = None

# ====================================
# 🎨 CSS 스타일 적용
# ====================================
st.markdown("""
    <style>
        .header {
            text-align: center;
            color: #1f77b4;
            font-size: 36px;
            font-weight: bold;
            margin-bottom: 20px;
        }
        .home-button {
            padding: 20px;
            background-color: #f0f2f6;
            border-radius: 10px;
            text-align: center;
            cursor: pointer;
            border: 2px solid #1f77b4;
            font-size: 18px;
            font-weight: bold;
            transition: background-color 0.3s;
        }
    </style>
""", unsafe_allow_html=True)

# ====================================
# 📱 화면 1: 홈 화면
# ====================================
def screen_home():
    st.markdown('<div class="header">⚾ Baseball Report</div>', unsafe_allow_html=True)
    st.markdown("---")
    
    # 로그인 상태 표시
    if st.session_state.logged_in_user:
        col1, col2, col3 = st.columns([2, 1, 1])
        with col3:
            if st.button("🚪 로그아웃", use_container_width=True):
                st.session_state.logged_in_user = None
                st.session_state.user_id = None
                st.rerun()
        with col1:
            st.success(f"✅ {st.session_state.logged_in_user}님이 로그인 중입니다")
    
    st.markdown("### 메인 메뉴")
    st.markdown("")
    
    # 4개의 버튼을 가로로 배치
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        if st.button("🔐 로그인", use_container_width=True, key="btn_login"):
            st.session_state.current_screen = "login"
            st.rerun()
    
    with col2:
        if st.button("📝 선수등록", use_container_width=True, key="btn_register"):
            st.session_state.current_screen = "signup"
            st.rerun()
    
    with col3:
        if st.button("📋 기록하기", use_container_width=True, key="btn_record"):
            if st.session_state.logged_in_user:
                st.session_state.current_screen = "record_input"
            else:
                st.session_state.current_screen = "signup"
            st.rerun()
    
    with col4:
        if st.button("📊 결과조회", use_container_width=True, key="btn_results"):
            if st.session_state.logged_in_user:
                st.session_state.current_screen = "results"
            else:
                st.session_state.current_screen = "signup"
            st.rerun()
    
    st.markdown("---")
    st.markdown("### 📌 사용 가능한 기능")
    st.markdown("""
    - **로그인**: 기존 사용자 로그인
    - **선수등록**: 이메일, ID, PW로 회원가입 후 선수 정보 입력
    - **기록하기**: 로그인 후 경기 기록 입력
    - **결과조회**: 로그인 후 입력된 기록 조회
    """)

# ====================================
# 📱 화면 2: 회원가입 화면
# ====================================
def screen_signup():
    st.markdown('<div class="header">📝 회원가입</div>', unsafe_allow_html=True)
    st.markdown("---")
    
    if st.button("← 뒤로가기", key="back_signup"):
        st.session_state.current_screen = "home"
        st.rerun()
    
    st.markdown("### 회원 정보 입력")
    
    col1, col2 = st.columns(2)
    
    with col1:
        email = st.text_input("📧 이메일", placeholder="example@email.com")
    
    with col2:
        user_id = st.text_input("👤 ID", placeholder="사용자 아이디")
    
    password = st.text_input("🔐 비밀번호", type="password", placeholder="비밀번호 입력")
    password_confirm = st.text_input("🔐 비밀번호 확인", type="password", placeholder="비밀번호 확인")
    
    st.markdown("---")
    
    if st.button("✅ 가입하기", use_container_width=True):
        if not email or not user_id or not password or not password_confirm:
            st.error("❌ 모든 필드를 입력해주세요!")
        elif password != password_confirm:
            st.error("❌ 비밀번호가 일치하지 않습니다!")
        else:
            users = load_users()
            if user_id in users:
                st.error(f"❌ '{user_id}'는 이미 사용 중인 ID입니다!")
            elif any(u["email"] == email for u in users.values()):
                st.error(f"❌ '{email}'는 이미 등록된 이메일입니다!")
            else:
                # 새 사용자 추가
                users[user_id] = {
                    "email": email,
                    "password": password,  # 실제 앱에서는 해시 처리 필요
                    "created_date": datetime.now().isoformat()
                }
                save_users(users)
                st.success("✅ 회원가입이 완료되었습니다!")
                st.session_state.logged_in_user = user_id
                st.session_state.user_id = user_id
                st.markdown("---")
                st.markdown("### 📋 선수 정보 입력")
                
                # 선수 정보 입력
                name = st.text_input("👤 이름", placeholder="선수 이름")
                
                col1, col2 = st.columns(2)
                with col1:
                    height = st.number_input("📏 키 (cm)", min_value=150, max_value=220, value=180)
                with col2:
                    weight = st.number_input("⚖️ 몸무게 (kg)", min_value=50, max_value=150, value=80)
                
                st.markdown("#### 📚 학력")
                
                col1, col2 = st.columns(2)
                with col1:
                    elementary_grad = st.number_input("초등학교 졸업연도", min_value=2000, max_value=2026, value=2012)
                with col2:
                    middle_grad = st.number_input("중학교 졸업연도", min_value=2000, max_value=2026, value=2015)
                
                col1, col2 = st.columns(2)
                with col1:
                    high_school = st.text_input("고등학교명", placeholder="고등학교명 입력")
                with col2:
                    high_grad = st.number_input("고등학교 졸업연도", min_value=2000, max_value=2026, value=2018)
                
                st.markdown("---")
                
                if st.button("💾 선수 정보 저장 및 홈으로", use_container_width=True):
                    if not name or not high_school:
                        st.error("❌ 이름과 고등학교명은 필수입니다!")
                    else:
                        players = load_players()
                        players[user_id] = {
                            "name": name,
                            "height": height,
                            "weight": weight,
                            "elementary_graduation": elementary_grad,
                            "middle_graduation": middle_grad,
                            "high_school": high_school,
                            "high_graduation": high_grad,
                            "created_date": datetime.now().isoformat()
                        }
                        save_players(players)
                        st.success("✅ 선수 정보가 저장되었습니다!")
                        st.balloons()
                        st.session_state.current_screen = "home"
                        st.rerun()

# ====================================
# 📱 화면 3: 로그인 화면
# ====================================
def screen_login():
    st.markdown('<div class="header">🔐 로그인</div>', unsafe_allow_html=True)
    st.markdown("---")
    
    if st.button("← 뒤로가기", key="back_login"):
        st.session_state.current_screen = "home"
        st.rerun()
    
    st.markdown("### 로그인 정보 입력")
    
    user_id = st.text_input("👤 ID", placeholder="사용자 아이디")
    password = st.text_input("🔐 비밀번호", type="password", placeholder="비밀번호 입력")
    
    st.markdown("---")
    
    col1, col2 = st.columns(2)
    
    with col1:
        if st.button("✅ 로그인", use_container_width=True):
            if not user_id or not password:
                st.error("❌ ID와 비밀번호를 입력해주세요!")
            else:
                users = load_users()
                if user_id not in users:
                    st.error("❌ 존재하지 않는 ID입니다!")
                elif users[user_id]["password"] != password:
                    st.error("❌ 비밀번호가 일치하지 않습니다!")
                else:
                    st.session_state.logged_in_user = user_id
                    st.session_state.user_id = user_id
                    st.success(f"✅ {user_id}님이 로그인했습니다!")
                    st.session_state.current_screen = "home"
                    st.rerun()
    
    with col2:
        if st.button("📝 회원가입", use_container_width=True):
            st.session_state.current_screen = "signup"
            st.rerun()

# ====================================
# 📱 화면 4: 기록하기 화면
# ====================================
def screen_record_input():
    st.markdown('<div class="header">📋 기록하기</div>', unsafe_allow_html=True)
    st.markdown("---")
    
    if st.button("← 뒤로가기", key="back_record"):
        st.session_state.current_screen = "home"
        st.rerun()
    
    st.markdown(f"### {st.session_state.logged_in_user}님의 경기 기록")
    
    col1, col2 = st.columns(2)
    
    with col1:
        game_date = st.date_input("📅 경기 날짜", value=datetime.now())
    with col2:
        opponent = st.text_input("🏟️ 상대팀", placeholder="예: 두산 베어스")
    
    col1, col2 = st.columns(2)
    with col1:
        inning = st.number_input("⏱️ 이닝", min_value=1, max_value=9, value=1)
    with col2:
        pitch_count = st.number_input("🔢 투구 수", min_value=1, max_value=50, value=1)
    
    st.markdown("###  투구 유형 및 결과")
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        pitch_type = st.selectbox(
            "공의 종류",
            ["직구", "커브", "슬라이더", "체인지업", "싱크", "기타"]
        )
    
    with col2:
        result = st.selectbox(
            "결과",
            ["스트라이크", "볼", "아웃", "안타", "기타"]
        )
    
    with col3:
        location = st.selectbox(
            "위치",
            ["중앙", "상단", "하단", "내측", "외측", "기타"]
        )
    
    col1, col2 = st.columns(2)
    with col1:
        speed = st.number_input("⚡ 투구 속도 (km/h)", min_value=80, max_value=160, value=130)
    with col2:
        notes = st.text_input("📝 메모", placeholder="기록 입력")
    
    st.markdown("---")
    
    if st.button("💾 기록 저장", use_container_width=True):
        if not opponent:
            st.error("❌ 상대팀을 입력해주세요!")
        else:
            records = load_records()
            
            if st.session_state.user_id not in records:
                records[st.session_state.user_id] = []
            
            record = {
                "date": str(game_date),
                "opponent": opponent,
                "inning": inning,
                "pitch_count": pitch_count,
                "pitch_type": pitch_type,
                "result": result,
                "location": location,
                "speed": speed,
                "notes": notes,
                "created_date": datetime.now().isoformat()
            }
            
            records[st.session_state.user_id].append(record)
            save_records(records)
            st.success("✅ 기록이 저장되었습니다!")
            st.balloons()

# ====================================
# 📱 화면 5: 결과조회 화면
# ====================================
def screen_results():
    st.markdown('<div class="header">📊 결과조회</div>', unsafe_allow_html=True)
    st.markdown("---")
    
    if st.button("← 뒤로가기", key="back_results"):
        st.session_state.current_screen = "home"
        st.rerun()
    
    records = load_records()
    players = load_players()
    
    user_id = st.session_state.user_id
    
    if user_id not in records or not records[user_id]:
        st.info("📭 저장된 기록이 없습니다. 기록하기에서 경기를 입력해주세요!")
    else:
        # 선수 정보 표시
        if user_id in players:
            player = players[user_id]
            st.markdown(f"### {player['name']} 선수 정보")
            
            col1, col2, col3, col4 = st.columns(4)
            with col1:
                st.metric("키", f"{player['height']}cm")
            with col2:
                st.metric("몸무게", f"{player['weight']}kg")
            with col3:
                st.metric("중학 졸업", player['middle_graduation'])
            with col4:
                st.metric("고등학 졸업", f"{player['high_graduation']} ({player['high_school']})")
            
            st.markdown("---")
        
        # 경기 기록 표시
        st.markdown("### 📋 경기 기록 목록")
        
        user_records = records[user_id]
        
        # 통계 계산
        total_records = len(user_records)
        total_pitches = sum([r["pitch_count"] for r in user_records])
        avg_speed = sum([r["speed"] for r in user_records]) / len(user_records) if user_records else 0
        
        col1, col2, col3 = st.columns(3)
        with col1:
            st.metric("⚾ 총 경기수", total_records)
        with col2:
            st.metric("📊 총 투구수", total_pitches)
        with col3:
            st.metric("⚡ 평균 속도", f"{avg_speed:.1f} km/h")
        
        st.markdown("---")
        
        # 경기별 상세 기록
        for i, record in enumerate(user_records, 1):
            with st.expander(f"경기 #{i} - {record['date']} vs {record['opponent']}", expanded=False):
                col1, col2, col3 = st.columns(3)
                
                with col1:
                    st.write(f"**날짜**: {record['date']}")
                    st.write(f"**상대팀**: {record['opponent']}")
                    st.write(f"**이닝**: {record['inning']}")
                
                with col2:
                    st.write(f"**공의 종류**: {record['pitch_type']}")
                    st.write(f"**결과**: {record['result']}")
                    st.write(f"**위치**: {record['location']}")
                
                with col3:
                    st.write(f"**투구 수**: {record['pitch_count']}")
                    st.write(f"**투구 속도**: {record['speed']} km/h")
                    if record['notes']:
                        st.write(f"**메모**: {record['notes']}")

# ====================================
# 🏠 메인 페이지
# ====================================
def main():
    """메인 네비게이션"""
    if st.session_state.current_screen == "home":
        screen_home()
    elif st.session_state.current_screen == "signup":
        screen_signup()
    elif st.session_state.current_screen == "login":
        screen_login()
    elif st.session_state.current_screen == "record_input":
        screen_record_input()
    elif st.session_state.current_screen == "results":
        screen_results()

if __name__ == "__main__":
    main()
