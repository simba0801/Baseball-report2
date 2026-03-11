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
    st.session_state.logged_in_user = "admin"  # Admin 자동 로그인

if "user_id" not in st.session_state:
    st.session_state.user_id = "admin"  # Admin 자동 로그인

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
        /* 터치패드 스타일 */
        .strike-zone {
            background-color: #c7d9f7;
            border: 2px solid #6b8dd9;
        }
        .ball-zone-light {
            background-color: #ffe4a0;
            border: 2px solid #f0a000;
        }
        .ball-zone-blue {
            background-color: #a0d0ff;
            border: 2px solid #0070d0;
        }
        .ball-zone-pink {
            background-color: #ffb3d9;
            border: 2px solid #ff69b4;
        }
        .ball-zone-green {
            background-color: #b3f7a0;
            border: 2px solid #22bb44;
        }
        .zone-button {
            font-weight: bold;
            font-size: 16px;
            height: 60px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
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
            if st.session_state.logged_in_user != "admin":  # admin은 로그아웃 불가
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
            if st.session_state.logged_in_user:
                st.session_state.current_screen = "player_register"
            else:
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
                st.info("💡 이제 선수 정보를 입력해주세요. 계속 진행하려면 아래 버튼을 클릭하세요.")
                
                if st.button("➡️ 선수 정보 입력으로 이동", use_container_width=True):
                    st.session_state.current_screen = "player_register"
                    st.rerun()

# ====================================
# 📱 화면 2-1: 선수등록 화면 (로그인 후)
# ====================================
def screen_player_register():
    st.markdown('<div class="header">📝 선수등록</div>', unsafe_allow_html=True)
    st.markdown("---")
    
    if st.button("← 뒤로가기", key="back_player_register"):
        st.session_state.current_screen = "home"
        st.rerun()
    
    st.markdown("### 📋 선수 정보 입력")
    
    # 선수 정보 입력
    name = st.text_input("👤 이름", placeholder="선수 이름")
    
    col1, col2 = st.columns(2)
    with col1:
        height = st.number_input("📏 키 (cm)", min_value=150, max_value=220, value=180)
    with col2:
        weight = st.number_input("⚖️ 몸무게 (kg)", min_value=50, max_value=150, value=80)
    
    st.markdown("#### 📚 학력")
    
    # 초등학교
    st.markdown("**초등학교**")
    col1, col2 = st.columns(2)
    with col1:
        elementary_grad = st.number_input("초등학교 졸업연도", min_value=2000, max_value=2026, value=2012)
    with col2:
        elementary_team = st.text_input("초등학교팀", placeholder="팀명 입력")
    
    # 중학교
    st.markdown("**중학교**")
    col1, col2 = st.columns(2)
    with col1:
        middle_grad = st.number_input("중학교 졸업연도", min_value=2000, max_value=2026, value=2015)
    with col2:
        middle_team = st.text_input("중학교팀", placeholder="팀명 입력")
    
    # 고등학교
    st.markdown("**고등학교**")
    col1, col2, col3 = st.columns(3)
    with col1:
        high_school = st.text_input("고등학교명", placeholder="고등학교명 입력")
    with col2:
        high_grade = st.selectbox("학년", [1, 2, 3], index=2)
    with col3:
        high_grad = st.number_input("졸업연도", min_value=2000, max_value=2026, value=2018)
    
    st.markdown("---")
    
    if st.button("💾 선수 정보 저장", use_container_width=True):
        if not name or not high_school:
            st.error("❌ 이름과 고등학교명은 필수입니다!")
        else:
            players = load_players()
            players[st.session_state.user_id] = {
                "name": name,
                "height": height,
                "weight": weight,
                "elementary_graduation": elementary_grad,
                "elementary_team": elementary_team,
                "middle_graduation": middle_grad,
                "middle_team": middle_team,
                "high_school": high_school,
                "high_grade": high_grade,
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
# 📱 화면 4: 기록하기 화면 (입력 상세화)
# ====================================
def screen_record_input():
    st.markdown('<div class="header">📋 입력하기</div>', unsafe_allow_html=True)
    st.markdown("---")
    
    if st.button("← 뒤로가기", key="back_record"):
        st.session_state.current_screen = "home"
        st.rerun()
    
    st.markdown(f"### {st.session_state.logged_in_user}님의 경기 기록")
    
    # ========== 세션 상태 초기화 ==========
    if "game_session" not in st.session_state or not isinstance(st.session_state.game_session, dict):
        st.session_state.game_session = {
            "date": datetime.now(),
            "opponent": "",
            "position": "선발",
            "current_inning": 1,
            "current_batter_order": 1,
            "batter_hand": "우",
            "out_count": 0,
            "ball_count": 0,
            "strike_count": 0,
            "bases": {"1루": False, "2루": False, "3루": False},
            "runners_home": 0,
            "pitches": [],
            "runs": 0,
            "earned_runs": 0,
            "errors": 0
        }
    
    # ========== 1. 경기 정보 일반 입력 ==========
    st.markdown("### 📋 경기 정보")
    
    col1, col2 = st.columns(2)
    with col1:
        game_date = st.date_input("📅 경기 날짜")
        st.session_state.game_session["date"] = game_date
    with col2:
        opponent = st.text_input("🏟️ 상대팀", value=st.session_state.game_session["opponent"])
        st.session_state.game_session["opponent"] = opponent
    
    st.markdown("---")
    st.markdown("### 👤 등판 정보")
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        position = st.selectbox(
            "등판 구분",
            ["선발", "중간", "마무리"],
            index=["선발", "중간", "마무리"].index(st.session_state.game_session["position"])
        )
        st.session_state.game_session["position"] = position
    
    # 선발인 경우 아웃카운트와 잔루 자동 설정
    if position == "선발":
        col2_out = 0
        col2_bases = {"1루": False, "2루": False, "3루": False}
        with col2:
            st.write("**아웃카운트**: 노아웃 (자동)")
        with col3:
            st.write("**잔루**: 없음 (자동)")
    else:
        with col2:
            out_count = st.selectbox(
                "아웃카운트",
                [0, 1, 2],
                index=st.session_state.game_session["out_count"]
            )
            col2_out = out_count
        
        with col3:
            col3_1, col3_2, col3_3 = st.columns(3)
            with col3_1:
                base1 = st.checkbox("1루", value=st.session_state.game_session["bases"]["1루"], key="base1")
            with col3_2:
                base2 = st.checkbox("2루", value=st.session_state.game_session["bases"]["2루"], key="base2")
            with col3_3:
                base3 = st.checkbox("3루", value=st.session_state.game_session["bases"]["3루"], key="base3")
            col2_bases = {"1루": base1, "2루": base2, "3루": base3}
    
    st.session_state.game_session["out_count"] = col2_out
    st.session_state.game_session["bases"] = col2_bases
    
    st.markdown("---")
    st.markdown("### ⚾ 현재 상황")
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        inning = st.selectbox(
            "이닝",
            range(1, 10),
            index=st.session_state.game_session["current_inning"] - 1
        )
        st.session_state.game_session["current_inning"] = inning
    
    with col2:
        batter_order = st.selectbox(
            "타순",
            range(1, 10),
            index=st.session_state.game_session["current_batter_order"] - 1
        )
        st.session_state.game_session["current_batter_order"] = batter_order
    
    with col3:
        batter_hand = st.selectbox(
            "타자 좌/우",
            ["좌", "우"],
            index=0 if st.session_state.game_session["batter_hand"] == "좌" else 1
        )
        st.session_state.game_session["batter_hand"] = batter_hand
    
    st.markdown("---")
    
    # ========== 2. 상황판 표시 ==========
    st.markdown("### 📊 현재 볼카운트")
    
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric("Ball", st.session_state.game_session["ball_count"], delta=None)
    with col2:
        st.metric("Strike", st.session_state.game_session["strike_count"], delta=None)
    with col3:
        st.metric("Out", st.session_state.game_session["out_count"], delta=None)
    with col4:
        st.metric("Runs", f"{st.session_state.game_session['runs']} ({st.session_state.game_session['earned_runs']}E)", delta=None)
    
    # 잔루 표시
    col1, col2, col3 = st.columns(3)
    bases_display = []
    if st.session_state.game_session["bases"]["1루"]:
        bases_display.append("1루")
    if st.session_state.game_session["bases"]["2루"]:
        bases_display.append("2루")
    if st.session_state.game_session["bases"]["3루"]:
        bases_display.append("3루")
    
    st.write(f"**잔루**: {', '.join(bases_display) if bases_display else '없음'}")
    
    st.markdown("---")
    st.markdown("### 🎾 투구 정보 입력")
    
    col1, col2 = st.columns(2)
    
    with col1:
        pitch_type = st.selectbox(
            "구종",
            ["직구", "커브", "슬라이더", "체인지업", "싱크", "포크", "기타"]
        )
    
    st.markdown("#### 결과 선택 - 터치패드")
    st.write("**1~9번**: Strike (보라색) | **10~25번**: Ball (주변)")
    
    # 터치패드 색상 및 타입 정의
    zone_colors = {
        # Strike Zone (1-9) - 보라색 트바리언트
        1: ("1", "#a0a0ff"), 2: ("2", "#9090ff"), 3: ("3", "#a0a0ff"),
        4: ("4", "#9090ff"), 5: ("5", "#8080ff"), 6: ("6", "#9090ff"),
        7: ("7", "#a0a0ff"), 8: ("8", "#9090ff"), 9: ("9", "#a0a0ff"),
        # Ball Zone (10-25) - 다양한 색상
        10: ("10", "#ffe4a0"), 11: ("11", "#ffd080"), 12: ("12", "#ffcc66"), 
        13: ("13", "#ffd080"), 14: ("14", "#ffe4a0"),
        15: ("15", "#ffb3d9"), 16: ("16", "#a0d0ff"), 17: ("17", "#a0d0ff"), 
        18: ("18", "#a0d0ff"), 19: ("19", "#ffb3d9"),
        20: ("20", "#ffcc99"), 21: ("21", "#8b6914"), 22: ("22", "#ffffff"), 
        23: ("23", "#a0d9ff"), 24: ("24", "#a0d9ff"), 25: ("25", "#a0d9ff"),
    }
    
    # 5x5 그리드 레이아웃 - 이미지처럼 구성
    rows = [
        [10, 11, 12, 13, 14],
        [15, 1, 2, 3, 16],
        [17, 4, 5, 6, 18],
        [19, 7, 8, 9, 20],
        [21, 22, 23, 24, 25]
    ]
    
    for row_num, row in enumerate(rows):
        cols = st.columns(5)
        for col_num, zone_num in enumerate(row):
            with cols[col_num]:
                label, color = zone_colors[zone_num]
                if st.button(label, key=f"zone_{zone_num}", use_container_width=True):
                    st.session_state.selected_zone = zone_num
    
    
    st.markdown("---")
    
    # 선택된 zone 표시
    if "selected_zone" not in st.session_state:
        st.session_state.selected_zone = None
    
    if st.session_state.selected_zone:
        selected_zone = st.session_state.selected_zone
        result = "Strike" if 1 <= selected_zone <= 9 else "Ball"
        st.info(f"선택된 Zone: {selected_zone} ({result})")
        
        # 특수상황 선택
        st.markdown("#### 특수상황 (선택사항)")
        col1, col2, col3, col4 = st.columns(4)
        special_situation = None
        
        with col1:
            if st.button("폭투", use_container_width=True, key="wild_pitch"):
                special_situation = "폭투"
        with col2:
            if st.button("패스드볼", use_container_width=True, key="passed_ball"):
                special_situation = "패스드볼"
        with col3:
            if st.button("보크", use_container_width=True, key="balk"):
                special_situation = "보크"
        with col4:
            if st.button("견제", use_container_width=True, key="pickoff"):
                special_situation = "견제"
        
        if st.button("✅ 투구 완료", use_container_width=True, key="btn_pitch_complete"):
            # 볼카운트 업데이트
            if result == "Strike":
                if st.session_state.game_session["strike_count"] < 2:
                    st.session_state.game_session["strike_count"] += 1
            else:
                st.session_state.game_session["ball_count"] += 1
            
            # 투구 기록 저장
            pitch_record = {
                "pitch_num": len(st.session_state.game_session["pitches"]) + 1,
                "pitch_type": pitch_type,
                "result": result,
                "location": selected_zone,
                "special_situation": special_situation,
                "ball_count": st.session_state.game_session["ball_count"],
                "strike_count": st.session_state.game_session["strike_count"],
                "out_count": st.session_state.game_session["out_count"]
            }
            st.session_state.game_session["pitches"].append(pitch_record)
            st.session_state.selected_zone = None
            st.success(f"✅ 투구 #{len(st.session_state.game_session['pitches'])} 완료 - {result}")
            st.rerun()
    
    st.markdown("---")
    st.markdown("### 🏃 [타자]")
    
    # 타자 선택 옵션
    batter_action = st.radio(
        "타자 선택",
        ["스윙", "파울", "Hit"],
        horizontal=True
    )
    
    st.markdown("---")
    
    # 스윙 선택
    if batter_action == "스윙":
        st.markdown("#### 스윙 결과")
        
        if st.session_state.game_session["strike_count"] < 2:
            st.write("**현재 상황**: 2스트라이크 이하")
            if st.button("✅ 볼카운트 증가 (스윙 무)", use_container_width=True):
                st.session_state.game_session["strike_count"] += 1
                st.success(f"✅ 스트라이크 증가 - B{st.session_state.game_session['ball_count']} S{st.session_state.game_session['strike_count']}")
                st.rerun()
        else:
            st.write("**현재 상황**: 2스트라이크 이상 (삼진 위험)")
            col1, col2 = st.columns(2)
            
            with col1:
                if st.button("❌ 낫아웃", use_container_width=True):
                    st.session_state.game_session["out_count"] += 1
                    st.success(f"✅ 낫아웃 - 아웃카운트: {st.session_state.game_session['out_count']}")
                    st.rerun()
            
            with col2:
                if st.button("🔴 삼진", use_container_width=True):
                    st.session_state.game_session["out_count"] += 1
                    st.success(f"✅ 삼진! - 아웃카운트: {st.session_state.game_session['out_count']}")
                    st.rerun()
    
    # 파울 선택
    elif batter_action == "파울":
        st.markdown("#### 파울 결과")
        
        foul_type = st.radio(
            "파울 종류",
            ["파울 플라이", "파울 땅볼"],
            horizontal=True
        )
        
        if foul_type == "파울 플라이":
            col1, col2 = st.columns(2)
            
            with col1:
                if st.button("✅ 파울 플라이 (아웃)", use_container_width=True):
                    st.session_state.game_session["out_count"] += 1
                    st.success(f"✅ 파울 플라이 아웃! - 아웃카운트: {st.session_state.game_session['out_count']}")
                    st.rerun()
            
            with col2:
                if st.button("✅ 파울 플라이 (세이프)", use_container_width=True):
                    st.write("파울이 기록되었습니다.")
                    st.rerun()
        
        else:  # 파울 땅볼
            if st.button("✅ 파울 땅볼", use_container_width=True):
                st.write("파울 땅볼이 기록되었습니다.")
                st.rerun()
    
    # Hit 선택
    elif batter_action == "Hit":
        st.markdown("#### 안타 결과")
        
        hit_type = st.selectbox(
            "안타 종류",
            ["내야땅볼", "외야땅볼", "번트", "플라이", "라인드라이브", "홈런"],
            key="hit_type"
        )
        
        detail = None
        if hit_type != "안타 없음":
            detail_options = {
                "내야땅볼": ["1루지", "2루지", "3루지", "유격수", "2루수"],
                "외야땅볼": ["좌측", "중앙", "우측"],
                "번트": ["안전번트", "번트 플라이"],
                "플라이": ["좌측", "중앙", "우측"],
                "라인드라이브": ["좌측", "중앙", "우측"],
                "홈런": ["좌측 울타리", "중앙 울타리", "우측 울타리"]
            }
            detail = st.selectbox(
                "상세 내용",
                detail_options.get(hit_type, []),
                key="hit_detail"
            )
        
        st.markdown("---")
        error_flag = st.checkbox("에러 발생", key="hit_error")
        
        if st.button("✅ 타자결과 저장", use_container_width=True):
            # 홈을 누른 경우 실점 처리
            if hit_type == "홈런":
                st.session_state.game_session["runs"] += 1
                if not error_flag:
                    st.session_state.game_session["earned_runs"] += 1
                else:
                    st.session_state.game_session["errors"] += 1
            
            # 기타 주자 진루 처리
            if detail and error_flag:
                st.session_state.game_session["bases"]["1루"] = True
            
            st.success(f"✅ {hit_type} ({detail}) 저장됨")
            st.rerun()
    
    st.markdown("---")
    st.markdown("### 📝 투구 기록")
    
    if st.session_state.game_session["pitches"]:
        for pitch in st.session_state.game_session["pitches"]:
            special = f" | {pitch.get('special_situation', '')}" if pitch.get('special_situation') else ""
            st.write(f"**투구 #{pitch['pitch_num']}** | {pitch['pitch_type']} | {pitch['result']} (Zone {pitch['location']}) | B{pitch['ball_count']} S{pitch['strike_count']}{special}")
    else:
        st.info("투구 기록이 없습니다.")
    
    st.markdown("---")
    
    if st.button("💾 경기 기록 저장", use_container_width=True):
        if not opponent:
            st.error("❌ 상대팀을 입력해주세요!")
        elif len(st.session_state.game_session["pitches"]) == 0:
            st.error("❌ 최소 1개 이상의 투구 기록이 필요합니다!")
        else:
            records = load_records()
            
            if st.session_state.user_id not in records:
                records[st.session_state.user_id] = []
            
            game_record = {
                "date": str(st.session_state.game_session["date"]),
                "opponent": st.session_state.game_session["opponent"],
                "inning": st.session_state.game_session["current_inning"],
                "position": st.session_state.game_session["position"],
                "pitches": st.session_state.game_session["pitches"],
                "runs": st.session_state.game_session["runs"],
                "earned_runs": st.session_state.game_session["earned_runs"],
                "errors": st.session_state.game_session["errors"],
                "created_date": datetime.now().isoformat()
            }
            
            records[st.session_state.user_id].append(game_record)
            save_records(records)
            st.success("✅ 경기 기록이 저장되었습니다!")
            st.balloons()
            
            # 세션 초기화
            st.session_state.game_session = None
            st.rerun()

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
                st.metric("중학 졸업", f"{player['middle_graduation']} ({player.get('middle_team', '-')})")
            with col4:
                st.metric("고등학", f"{player['high_graduation']} {player['high_grade']}학년 ({player['high_school']})")
            
            st.markdown("---")
        
        # 경기 기록 표시
        st.markdown("### 📋 경기 기록 목록")
        
        user_records = records[user_id]
        
        # 통계 계산
        total_games = len(user_records)
        total_pitches = sum([len(r.get("pitches", [])) for r in user_records])
        total_runs = sum([r.get("runs", 0) for r in user_records])
        total_earned_runs = sum([r.get("earned_runs", 0) for r in user_records])
        total_errors = sum([r.get("errors", 0) for r in user_records])
        
        col1, col2, col3 = st.columns(3)
        with col1:
            st.metric("⚾ 총 경기수", total_games)
        with col2:
            st.metric("📊 총 투구수", total_pitches)
        with col3:
            st.metric("🏃 실점/자책점", f"{total_runs}/{total_earned_runs}")
        
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
                    st.write(f"**등판 구분**: {record.get('position', 'N/A')}")
                    st.write(f"**총 투구수**: {len(record.get('pitches', []))}")
                    st.write(f"**실점/자책점**: {record.get('runs', 0)}/{record.get('earned_runs', 0)}")
                
                with col3:
                    st.write(f"**에러**: {record.get('errors', 0)}")
                
                # 투구 상세 기록
                st.markdown("#### 투구 기록")
                pitches = record.get("pitches", [])
                
                if pitches:
                    for pitch in pitches:
                        st.write(
                            f"- **투구 #{pitch['pitch_num']}**: {pitch['pitch_type']} | "
                            f"{pitch['result']} (Zone {pitch['location']}) | "
                            f"B{pitch['ball_count']} S{pitch['strike_count']}"
                        )
                else:
                    st.info("투구 기록이 없습니다.")

# ====================================
# 🏠 메인 페이지
# ====================================
def main():
    """메인 네비게이션"""
    if st.session_state.current_screen == "home":
        screen_home()
    elif st.session_state.current_screen == "signup":
        screen_signup()
    elif st.session_state.current_screen == "player_register":
        screen_player_register()
    elif st.session_state.current_screen == "login":
        screen_login()
    elif st.session_state.current_screen == "record_input":
        screen_record_input()
    elif st.session_state.current_screen == "results":
        screen_results()

if __name__ == "__main__":
    main()
