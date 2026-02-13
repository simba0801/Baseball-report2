import streamlit as st
import datetime

st.set_page_config(page_title="✨ Streamlit 데모 앱", layout="centered")

st.title("🎉 Streamlit 데모 앱")
st.write("환영합니다! Streamlit이 정상적으로 작동하고 있습니다.")

st.divider()

# 입력 컴포넌트
st.subheader("📝 사용자 입력")
name = st.text_input("이름을 입력하세요:", placeholder="예: 홍길동")
age = st.slider("나이를 선택하세요:", 0, 100, 25)

if name:
    st.success(f"안녕하세요! {name}님 (만 {age}세)")

st.divider()

# 데이터 출력
st.subheader("📊 현재 정보")
col1, col2, col3 = st.columns(3)
with col1:
    st.metric("현재 시간", datetime.datetime.now().strftime("%H:%M:%S"))
with col2:
    st.metric("현재 날짜", datetime.datetime.now().strftime("%Y-%m-%d"))
with col3:
    st.metric("Streamlit 상태", "✅ 정상")

st.divider()

# 버튼
if st.button("클릭해보세요!", use_container_width=True):
    st.balloon()
    st.success("Streamlit이 잘 작동하고 있습니다! 🚀")
