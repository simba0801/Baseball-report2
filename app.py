"""
Baseball Report - 투수 성적 분석 시스템
야구경기에서 투수가 던진 공을 기록하고 경기별 성적을 분석하는 Streamlit 앱
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
    initial_sidebar_state="expanded"
)

# ====================================
# 💾 데이터 저장소 설정
# ====================================
DATA_FILE = "game_records.json"
REFERENCE_FILE = "reference_data.json"

def load_data():
    """게임 데이터 로드"""
    if Path(DATA_FILE).exists():
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {"games": []}

def save_data(data):
    """게임 데이터 저장"""
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def load_reference_data():
    """기준정보 데이터 로드"""
    if Path(REFERENCE_FILE).exists():
        with open(REFERENCE_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {"reference_info": []}

def save_reference_data(data):
    """기준정보 데이터 저장"""
    with open(REFERENCE_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

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
        .stat-box {
            background-color: #f0f2f6;
            padding: 15px;
            border-radius: 8px;
            margin: 10px 0;
            border-left: 4px solid #1f77b4;
        }
        .strike {
            color: #d62728;
            font-weight: bold;
        }
        .ball {
            color: #2ca02c;
            font-weight: bold;
        }
    </style>
""", unsafe_allow_html=True)

# ====================================
# 🏠 메인 페이지
# ====================================
def main():
    st.markdown('<div class="header">⚾ Baseball Report</div>', unsafe_allow_html=True)
    st.markdown("투수 성적 분석 및 기록 시스템")
    
    # 탭 생성
    tab1, tab2, tab3, tab4 = st.tabs(["📝 new_game", "📊 View Stats", "📈 Analysis", "⚙️ 기준정보"])
    
    # ====================================
    # TAB 1: 경기 기록
    # ====================================
    with tab1:
        st.subheader("🎮 새로운 경기 기록")
        
        col1, col2 = st.columns(2)
        
        with col1:
            game_date = st.date_input("📅 경기 날짜", value=datetime.now())
        with col2:
            pitcher_name = st.text_input("👤 투수 이름", placeholder="예: 박찬호")
        
        col3, col4 = st.columns(2)
        with col3:
            opponent = st.text_input("🏟️ 상대팀", placeholder="예: 두산 베어스")
        with col4:
            inning = st.number_input("⏱️ 이닝", min_value=1, max_value=9, value=1)
        
        st.markdown("---")
        
        # 투구 기록 입력
        st.subheader("📊 투구 기록")
        
        # 기준정보 로드
        ref_data = load_reference_data()
        
        # 고정 기본값 및 기준정보 조합
        pitch_types = ["Fast Ball", "Curveball", "Slider", "Changeup", "Sinker", "기타"]
        results = ["⚾ Strike", "⚾ Ball", "🎯 Strike Out", "🏃 Hit", "기타"]
        locations = ["🎯 Center", "⬆️ High", "⬇️ Low", "⬅️ Inside", "➡️ Outside",
                    "↖️ High-Inside", "↗️ High-Outside", "↙️ Low-Inside", "↘️ Low-Outside", "기타"]
        
        # 기준정보가 있으면 추가
        for ref in ref_data["reference_info"]:
            if ref["category"] == "공의 종류" and ref["code"] not in pitch_types:
                pitch_types.insert(-1, ref["code"])
            elif ref["category"] == "타격 결과" and ref["code"] not in results:
                results.insert(-1, ref["code"])
            elif ref["category"] == "위치" and ref["code"] not in locations:
                locations.insert(-1, ref["code"])
        
        col5, col6, col7 = st.columns(3)
        
        with col5:
            pitch_type = st.selectbox(
                "공의 종류",
                pitch_types
            )
        
        with col6:
            result = st.selectbox(
                "결과",
                results
            )
        
        with col7:
            location = st.selectbox(
                "위치 (Zone)",
                locations
            )
        
        # 추가 정보
        col8, col9 = st.columns(2)
        with col8:
            speed = st.number_input("⚡ 투구 속도 (km/h)", min_value=80, max_value=160, value=130)
        with col9:
            notes = st.text_input("📝 메모", placeholder="예: 좋은 컨트롤")
        
        st.markdown("---")
        
        # 저장 버튼
        if st.button("💾 투구 기록 저장", use_container_width=True):
            data = load_data()
            
            # 기존 게임 확인
            game_key = f"{pitcher_name}_{game_date}"
            game = None
            for g in data["games"]:
                if g["game_key"] == game_key:
                    game = g
                    break
            
            # 새 게임 생성
            if game is None:
                game = {
                    "game_key": game_key,
                    "date": str(game_date),
                    "pitcher": pitcher_name,
                    "opponent": opponent,
                    "pitches": []
                }
                data["games"].append(game)
            
            # 투구 추가
            pitch = {
                "inning": inning,
                "type": pitch_type,
                "result": result,
                "location": location,
                "speed": speed,
                "notes": notes,
                "timestamp": datetime.now().isoformat()
            }
            game["pitches"].append(pitch)
            
            save_data(data)
            st.success("✅ 투구 기록이 저장되었습니다!")
            st.balloons()
    
    # ====================================
    # TAB 2: 성적 조회
    # ====================================
    with tab2:
        st.subheader("📊 경기별 성적")
        
        data = load_data()
        
        if not data["games"]:
            st.info("📭 저장된 경기 기록이 없습니다. 새로운 경기를 기록해주세요!")
        else:
            # 경기 선택
            game_names = [f"{g['pitcher']} vs {g['opponent']} ({g['date']})" for g in data["games"]]
            selected_game_idx = st.selectbox("경기 선택", range(len(game_names)), format_func=lambda i: game_names[i])
            
            game = data["games"][selected_game_idx]
            
            st.markdown(f"""
            ### {game['pitcher']} vs {game['opponent']}
            📅 {game['date']}
            """)
            
            # 통계 계산
            pitches = game["pitches"]
            total_pitches = len(pitches)
            strikes = len([p for p in pitches if "Strike" in p["result"]])
            balls = len([p for p in pitches if "Ball" in p["result"]])
            
            # 통계 표시
            col1, col2, col3, col4 = st.columns(4)
            
            with col1:
                st.metric("⚾ 총 투구수", total_pitches)
            with col2:
                st.metric("✅ 스트라이크", strikes)
            with col3:
                st.metric("❌ 볼", balls)
            with col4:
                strike_rate = (strikes / total_pitches * 100) if total_pitches > 0 else 0
                st.metric("📊 스트라이크율", f"{strike_rate:.1f}%")
            
            st.markdown("---")
            
            # 투구 상세 기록
            st.subheader("📋 투구 상세 기록")
            
            for i, pitch in enumerate(pitches, 1):
                with st.expander(f"투구 #{i} - {pitch['result']} ({pitch['type']})", expanded=False):
                    col1, col2, col3 = st.columns(3)
                    
                    with col1:
                        st.write(f"**이닝**: {pitch['inning']}")
                        st.write(f"**공의 종류**: {pitch['type']}")
                    with col2:
                        st.write(f"**결과**: {pitch['result']}")
                        st.write(f"**위치**: {pitch['location']}")
                    with col3:
                        st.write(f"**투구 속도**: {pitch['speed']} km/h")
                        if pitch['notes']:
                            st.write(f"**메모**: {pitch['notes']}")
            
            # 투구 삭제
            st.markdown("---")
            if st.button("🗑️ 이 경기 기록 삭제", use_container_width=True):
                data["games"].pop(selected_game_idx)
                save_data(data)
                st.warning("⚠️ 경기 기록이 삭제되었습니다!")
                st.rerun()
    
    # ====================================
    # TAB 3: 분석
    # ====================================
    with tab3:
        st.subheader("📈 투수 성적 분석")
        
        data = load_data()
        
        if not data["games"]:
            st.info("📭 분석할 데이터가 없습니다.")
        else:
            # 투수별 통계
            pitcher_stats = {}
            
            for game in data["games"]:
                pitcher = game["pitcher"]
                if pitcher not in pitcher_stats:
                    pitcher_stats[pitcher] = {
                        "games": 0,
                        "total_pitches": 0,
                        "strikes": 0,
                        "balls": 0,
                        "avg_speed": [],
                        "pitch_types": {},
                        "locations": {}
                    }
                
                stats = pitcher_stats[pitcher]
                stats["games"] += 1
                
                pitches = game["pitches"]
                stats["total_pitches"] += len(pitches)
                
                for pitch in pitches:
                    if "Strike" in pitch["result"]:
                        stats["strikes"] += 1
                    elif "Ball" in pitch["result"]:
                        stats["balls"] += 1
                    
                    stats["avg_speed"].append(pitch["speed"])
                    
                    # 공의 종류 집계
                    pitch_type = pitch["type"]
                    stats["pitch_types"][pitch_type] = stats["pitch_types"].get(pitch_type, 0) + 1
                    
                    # 위치 집계
                    location = pitch["location"]
                    stats["locations"][location] = stats["locations"].get(location, 0) + 1
            
            # 투수별 통계 표시
            for pitcher, stats in pitcher_stats.items():
                st.subheader(f"🎯 {pitcher}")
                
                col1, col2, col3, col4, col5 = st.columns(5)
                
                with col1:
                    st.metric("경기수", stats["games"])
                with col2:
                    st.metric("총 투구", stats["total_pitches"])
                with col3:
                    st.metric("스트라이크", stats["strikes"])
                with col4:
                    st.metric("볼", stats["balls"])
                with col5:
                    avg_speed = sum(stats["avg_speed"]) / len(stats["avg_speed"]) if stats["avg_speed"] else 0
                    st.metric("평균 속도", f"{avg_speed:.1f}")
                
                # 공의 종류 분포
                col1, col2 = st.columns(2)
                
                with col1:
                    st.write("**공의 종류 분포**")
                    pitch_df = pd.DataFrame(list(stats["pitch_types"].items()), columns=["공의 종류", "횟수"])
                    st.bar_chart(pitch_df.set_index("공의 종류"))
                
                with col2:
                    st.write("**위치 분포**")
                    location_df = pd.DataFrame(list(stats["locations"].items()), columns=["위치", "횟수"])
                    st.bar_chart(location_df.set_index("위치"))
                
                st.markdown("---")
    
    # ====================================
    # TAB 4: 기준정보
    # ====================================
    with tab4:
        st.subheader("⚙️ 기준정보 관리")
        st.info("투수 기록 시 사용할 기준정보(마스터 데이터)를 추가하고 수정할 수 있습니다.")
        
        ref_data = load_reference_data()
        
        # 기준정보 추가 및 수정 폼
        col1, col2 = st.columns([2, 1])
        
        with col1:
            st.markdown("### 📋 기준정보 추가/수정")
        
        with col2:
            view_mode = st.radio("보기 모드", ["추가", "조회"], horizontal=True)
        
        st.markdown("---")
        
        if view_mode == "추가":
            st.subheader("➕ 새로운 기준정보 추가")
            
            col1, col2 = st.columns(2)
            
            with col1:
                category = st.selectbox(
                    "분류",
                    ["공의 종류", "타격 결과", "위치", "경기 유형", "투수 역할"]
                )
            
            with col2:
                code_value = st.text_input("코드", placeholder="예: FF, CB, SL")
            
            col3, col4 = st.columns(2)
            
            with col3:
                description = st.text_input("설명", placeholder="예: Fast Ball (직구), Curveball (커브)")
            
            with col4:
                detail_info = st.text_input("상세 정보", placeholder="예: 평균 140km/h")
            
            note = st.text_area("비고", placeholder="추가 설명 입력", height=80)
            
            st.markdown("---")
            
            if st.button("💾 기준정보 저장", use_container_width=True):
                if not code_value or not description:
                    st.error("❌ 코드와 설명은 필수입니다!")
                else:
                    new_info = {
                        "id": len(ref_data["reference_info"]) + 1,
                        "category": category,
                        "code": code_value,
                        "description": description,
                        "detail_info": detail_info,
                        "note": note,
                        "created_date": datetime.now().isoformat()
                    }
                    
                    ref_data["reference_info"].append(new_info)
                    save_reference_data(ref_data)
                    st.success(f"✅ '{code_value}' 기준정보가 저장되었습니다!")
                    st.rerun()
        
        else:  # 조회 모드
            st.subheader("📖 기준정보 조회 및 관리")
            
            if not ref_data["reference_info"]:
                st.info("📭 저장된 기준정보가 없습니다.")
            else:
                # 분류별 필터
                categories = list(set([r["category"] for r in ref_data["reference_info"]]))
                selected_category = st.multiselect("분류 선택", categories, default=categories)
                
                # 필터링된 데이터
                filtered_data = [r for r in ref_data["reference_info"] if r["category"] in selected_category]
                
                if not filtered_data:
                    st.info("선택한 분류의 기준정보가 없습니다.")
                else:
                    # 테이블 형식으로 표시
                    st.markdown("### 📊 기준정보 목록")
                    
                    for idx, info in enumerate(filtered_data):
                        with st.expander(f"🏷️ {info['category']} - {info['code']} ({info['description']})", expanded=False):
                            col1, col2, col3 = st.columns([2, 2, 1])
                            
                            with col1:
                                st.write(f"**분류**: {info['category']}")
                                st.write(f"**코드**: {info['code']}")
                                st.write(f"**설명**: {info['description']}")
                            
                            with col2:
                                st.write(f"**상세 정보**: {info['detail_info']}")
                                st.write(f"**비고**: {info['note']}")
                            
                            with col3:
                                st.write(f"**ID**: {info['id']}")
                                created = datetime.fromisoformat(info['created_date']).strftime("%Y-%m-%d %H:%M")
                                st.write(f"**생성일**: {created}")
                            
                            # 수정/삭제 버튼
                            col_edit, col_del = st.columns(2)
                            
                            with col_edit:
                                if st.button(f"✏️ 수정", key=f"edit_{info['id']}"):
                                    st.session_state[f"edit_{info['id']}"] = True
                            
                            with col_del:
                                if st.button(f"🗑️ 삭제", key=f"delete_{info['id']}"):
                                    ref_data["reference_info"] = [r for r in ref_data["reference_info"] if r['id'] != info['id']]
                                    save_reference_data(ref_data)
                                    st.success("✅ 기준정보가 삭제되었습니다!")
                                    st.rerun()
                            
                            # 수정 폼
                            if st.session_state.get(f"edit_{info['id']}", False):
                                st.markdown("---")
                                st.write("**수정 정보**")
                                
                                col1, col2 = st.columns(2)
                                
                                with col1:
                                    new_code = st.text_input("코드", value=info['code'], key=f"code_{info['id']}")
                                    new_description = st.text_input("설명", value=info['description'], key=f"desc_{info['id']}")
                                
                                with col2:
                                    new_detail = st.text_input("상세 정보", value=info['detail_info'], key=f"detail_{info['id']}")
                                    new_note = st.text_input("비고", value=info['note'], key=f"note_{info['id']}")
                                
                                col_save, col_cancel = st.columns(2)
                                
                                with col_save:
                                    if st.button("💾 수정 저장", key=f"save_{info['id']}"):
                                        for r in ref_data["reference_info"]:
                                            if r['id'] == info['id']:
                                                r['code'] = new_code
                                                r['description'] = new_description
                                                r['detail_info'] = new_detail
                                                r['note'] = new_note
                                                break
                                        save_reference_data(ref_data)
                                        st.success("✅ 기준정보가 수정되었습니다!")
                                        st.session_state[f"edit_{info['id']}"] = False
                                        st.rerun()
                                
                                with col_cancel:
                                    if st.button("❌ 취소", key=f"cancel_{info['id']}"):
                                        st.session_state[f"edit_{info['id']}"] = False
                                        st.rerun()
                    
                    # 통계
                    st.markdown("---")
                    st.subheader("📊 기준정보 통계")
                    
                    stat_col1, stat_col2, stat_col3 = st.columns(3)
                    
                    with stat_col1:
                        st.metric("총 기준정보 수", len(ref_data["reference_info"]))
                    
                    with stat_col2:
                        st.metric("분류 종류", len(categories))
                    
                    with stat_col3:
                        category_counts = {}
                        for r in ref_data["reference_info"]:
                            cat = r["category"]
                            category_counts[cat] = category_counts.get(cat, 0) + 1
                        max_category = max(category_counts.values()) if category_counts else 0
                        st.metric("최다 분류", max(category_counts, key=category_counts.get) if category_counts else "N/A")

if __name__ == "__main__":
    main()
