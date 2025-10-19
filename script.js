// 전역 변수
let username = 'yskim';
let birthdate = '571111';
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth() + 1;
let currentDate = new Date();
let selectedDate = new Date();

// DOM 요소
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

async function initializeApp() {
    // 음력 데이터 초기화 - 추가된 부분
    if (window.LunarCalendar && typeof window.LunarCalendar.initialize === 'function') {
        try {
            await window.LunarCalendar.initialize();
            console.log('음력 데이터 초기화 완료');
        } catch (e) {
            console.error('음력 데이터 초기화 오류:', e);
        }
    }
    
    // 사용자 정보 화면 이벤트 리스너
    document.querySelectorAll('input[name="user-type"]').forEach(radio => {
        radio.addEventListener('change', toggleUserInfoForm);
    });
    
    document.getElementById('start-btn').addEventListener('click', startCalendar);
    
    // 년월 선택 옵션 생성
    populateYearMonthOptions();
    
    // 달력 화면 이벤트 리스너
    document.getElementById('prev-month').addEventListener('click', () => navigateMonth(-1));
    document.getElementById('next-month').addEventListener('click', () => navigateMonth(1));
    document.getElementById('calendar-title').addEventListener('click', toggleYearMonthSelect);
    document.getElementById('go-to-date').addEventListener('click', goToSelectedDate);
    
    // 디테일 화면 이벤트 리스너
    document.getElementById('back-to-calendar').addEventListener('click', () => {
        document.getElementById('date-detail-screen').style.display = 'none';
        document.getElementById('calendar-screen').style.display = 'block';
    });
    
    // 스와이프 제스처 설정
    setupSwipeGesture();
}

// 사용자 정보 폼 토글
function toggleUserInfoForm() {
    const customForm = document.getElementById('custom-user-info');
    customForm.style.display = document.querySelector('input[name="user-type"][value="custom"]').checked ? 'block' : 'none';
}

// 달력 화면 시작
function startCalendar() {
    // 사용자 입력값 가져오기
    if (document.querySelector('input[name="user-type"][value="custom"]').checked) {
        username = document.getElementById('username').value || 'yskim';
        birthdate = document.getElementById('birthdate').value || '571111';
    } else {
        username = 'yskim';
        birthdate = '571111';
    }
    
    // 올바른 생년월일 형식 확인 (YYMMDD)
    if (!/^\d{6}$/.test(birthdate)) {
        alert('생년월일은 YYMMDD 형식으로 입력해 주세요.');
        return;
    }
    
    // 화면 전환
    document.getElementById('user-info-screen').style.display = 'none';
    document.getElementById('calendar-screen').style.display = 'block';
    
    // 초기 달력 표시
    renderCalendar(currentYear, currentMonth);
}

// 년월 선택 옵션 생성
function populateYearMonthOptions() {
    const yearSelect = document.getElementById('year-select');
    const monthSelect = document.getElementById('month-select');
    
    // 연도 옵션 (1900-2049)
    for (let y = 1900; y <= 2049; y++) {
        const option = document.createElement('option');
        option.value = y;
        option.textContent = `${y}년`;
        if (y === currentYear) option.selected = true;
        yearSelect.appendChild(option);
    }
    
    // 월 옵션
    for (let m = 1; m <= 12; m++) {
        const option = document.createElement('option');
        option.value = m;
        option.textContent = `${m}월`;
        if (m === currentMonth) option.selected = true;
        monthSelect.appendChild(option);
    }
}

// 연월 선택 토글
function toggleYearMonthSelect() {
    const yearMonthSelect = document.querySelector('.year-month-select');
    yearMonthSelect.style.display = yearMonthSelect.style.display === 'none' ? 'flex' : 'none';
}

// 선택한 날짜로 이동
function goToSelectedDate() {
    const year = parseInt(document.getElementById('year-select').value);
    const month = parseInt(document.getElementById('month-select').value);
    
    currentYear = year;
    currentMonth = month;
    
    renderCalendar(year, month);
    toggleYearMonthSelect();
}

// 월 이동 (prev/next)
function navigateMonth(step) {
    currentMonth += step;
    
    if (currentMonth > 12) {
        currentMonth = 1;
        currentYear++;
    } else if (currentMonth < 1) {
        currentMonth = 12;
        currentYear--;
    }
    
    // 유효 범위 체크 (1900-2049)
    if (currentYear < 1900) currentYear = 1900;
    if (currentYear > 2049) currentYear = 2049;
    
    renderCalendar(currentYear, currentMonth);
}

// 달력 렌더링
function renderCalendar(year, month) {
    const calendarDays = document.getElementById('calendar-days');
    calendarDays.innerHTML = '';
    
    // 연월 타이틀 업데이트
    const yearGanZhi = window.LunarCalendar.getYearGanZhi(year);
    document.getElementById('calendar-title').textContent = `${year}년(${yearGanZhi}) ${month}월`;
    
    // 선택된 연월의 첫째 날과 마지막 날
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    
    // 첫째 날의 요일 (0: 일요일, 6: 토요일)
    const firstDayOfWeek = firstDay.getDay();
    
    // 이전 달의 마지막 날
    const prevLastDay = new Date(year, month - 1, 0);
    
    // 달력 그리드에 날짜 채우기
    
    // 이전 달 날짜
    for (let i = firstDayOfWeek; i > 0; i--) {
        const day = prevLastDay.getDate() - i + 1;
        const date = new Date(year, month - 2, day);
        const dayElement = createDayElement(date, 'prev-month-day');
        calendarDays.appendChild(dayElement);
    }
    
    // 현재 달 날짜
    for (let i = 1; i <= lastDay.getDate(); i++) {
        const date = new Date(year, month - 1, i);
        const dayElement = createDayElement(date, 'current-month-day');
        calendarDays.appendChild(dayElement);
    }
    
    // 다음 달 날짜 (필요한 경우)
    const remainingCells = 42 - (firstDayOfWeek + lastDay.getDate());
    for (let i = 1; i <= remainingCells; i++) {
        const date = new Date(year, month, i);
        const dayElement = createDayElement(date, 'next-month-day');
        calendarDays.appendChild(dayElement);
    }
    
    // 년월 선택 드롭다운 업데이트
    document.getElementById('year-select').value = year;
    document.getElementById('month-select').value = month;
}

// 일자 요소 생성
function createDayElement(date, className) {
    const dayElement = document.createElement('div');
    dayElement.classList.add('day', className);
    
    // 날짜 텍스트
    dayElement.textContent = date.getDate();
    
    // 오늘 날짜 표시
    if (
        date.getFullYear() === currentDate.getFullYear() &&
        date.getMonth() === currentDate.getMonth() &&
        date.getDate() === currentDate.getDate()
    ) {
        dayElement.classList.add('current');
    }
    
    // 일요일만 빨간색으로 표시 (0: 일요일)
    if (date.getDay() === 0) {
        dayElement.classList.add('sunday');
    }
    
    // 국경일/공휴일 표시
    try {
        if (window.LunarCalendar && window.LunarCalendar.isHoliday(date.getFullYear(), date.getMonth() + 1, date.getDate())) {
            dayElement.classList.add('holiday');
        }
    } catch (e) {
        console.error('Holiday check error:', e);
    }
    
    // 음력 정보 표시 (작은 글씨로)
    try {
        if (window.LunarCalendar) {
            const lunarDate = window.LunarCalendar.getLunarDate(date);
            if (lunarDate) {
                const lunarDay = document.createElement('div');
                lunarDay.classList.add('lunar-day');
                lunarDay.textContent = lunarDate.day;
                dayElement.appendChild(lunarDay);
            }
        }
    } catch (e) {
        console.error('Lunar date error:', e);
    }
    
    // 클릭 이벤트 리스너 추가
    dayElement.addEventListener('click', () => {
        selectedDate = date;
        showDateDetail(date);
    });
    
    return dayElement;
}

// 날짜 세부 정보 표시
function showDateDetail(date) {
    document.getElementById('calendar-screen').style.display = 'none';
    document.getElementById('date-detail-screen').style.display = 'block';
    
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    // 상세 화면 제목 업데이트
    document.getElementById('detail-title').textContent = `${year}년 ${month}월 ${day}일 정보`;
    
    // 양력 정보 표시
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    document.getElementById('solar-date-value').textContent = `${year}년 ${month}월 ${day}일 (${weekdays[date.getDay()]}요일)`;
    
    try {
        // 음력 정보 계산 및 표시
        if (window.LunarCalendar && typeof window.LunarCalendar.getLunarDate === 'function') {
            const lunarDate = window.LunarCalendar.getLunarDate(date);
            if (lunarDate) {
                const lunarText = `${lunarDate.year}년 ${lunarDate.isLeap ? '윤' : ''}${lunarDate.month}월 ${lunarDate.day}일`;
                document.getElementById('lunar-date-value').textContent = lunarText;
            } else {
                document.getElementById('lunar-date-value').textContent = '정보 없음';
            }
            
            // 간지(일진) 표시
            if (typeof window.LunarCalendar.getGanZhi === 'function') {
                const ganZhi = window.LunarCalendar.getGanZhi(year, month, day);
                document.getElementById('day-gan-ji-value').textContent = ganZhi;
            } else {
                document.getElementById('day-gan-ji-value').textContent = '정보 없음';
            }
            
            // 오늘과의 날짜 차이 계산
            if (typeof window.LunarCalendar.getDaysDifference === 'function') {
                const now = new Date();
                const daysDiff = window.LunarCalendar.getDaysDifference(date, now);
                const daysText = daysDiff === 0 
                    ? '오늘' 
                    : daysDiff > 0 
                        ? `${daysDiff}일 전` 
                        : `${Math.abs(daysDiff)}일 후`;
                document.getElementById('days-diff-value').textContent = daysText;
            } else {
                document.getElementById('days-diff-value').textContent = '정보 없음';
            }
            
            // 바이오리듬 계산 및 표시
            if (birthdate && typeof window.LunarCalendar.calculateBiorhythm === 'function') {
                // 생년월일 파싱
                let birthYear;
                if (birthdate.length === 6) {
                    const yearPrefix = parseInt(birthdate.substring(0, 2)) < 50 ? '20' : '19';
                    birthYear = parseInt(yearPrefix + birthdate.substring(0, 2));
                } else {
                    birthYear = 1957;
                }
                const birthMonth = parseInt(birthdate.substring(2, 4));
                const birthDay = parseInt(birthdate.substring(4, 6));
                
                if (!isNaN(birthYear) && !isNaN(birthMonth) && !isNaN(birthDay)) {
                    const birthDate = new Date(birthYear, birthMonth - 1, birthDay);
                    
                    if (!isNaN(birthDate.getTime())) {
                        // 생일 이전 날짜인지 확인
                        if (date < birthDate) {
                            // 생일 이전이면 모든 바이오리듬을 0으로 설정
                            setDefaultBiorhythm();
                        } else {
                            const biorhythm = window.LunarCalendar.calculateBiorhythm(birthDate, date);
                            
                            // 바이오리듬 표시
                            updateBiorhythmBar('physical', biorhythm.physical);
                            updateBiorhythmBar('emotional', biorhythm.emotional);
                            updateBiorhythmBar('intellectual', biorhythm.intellectual);
                            
                            document.getElementById('physical-value').textContent = `${biorhythm.physical.toFixed(1)}%`;
                            document.getElementById('emotional-value').textContent = `${biorhythm.emotional.toFixed(1)}%`;
                            document.getElementById('intellectual-value').textContent = `${biorhythm.intellectual.toFixed(1)}%`;
                        }
                    } else {
                        console.error('Invalid birth date');
                        setDefaultBiorhythm();
                    }
                } else {
                    console.error('Invalid birth date format');
                    setDefaultBiorhythm();
                }
            } else {
                setDefaultBiorhythm();
            }
        } else {
            document.getElementById('lunar-date-value').textContent = '정보 없음';
            document.getElementById('day-gan-ji-value').textContent = '정보 없음';
            document.getElementById('days-diff-value').textContent = '정보 없음';
            setDefaultBiorhythm();
        }
    } catch (e) {
        console.error('Error in showDateDetail:', e);
        document.getElementById('lunar-date-value').textContent = '정보 없음';
        document.getElementById('day-gan-ji-value').textContent = '정보 없음';
        document.getElementById('days-diff-value').textContent = '정보 없음';
        setDefaultBiorhythm();
    }
}

// 기본 바이오리듬 값 설정 (오류 발생 시 또는 생일 이전)
function setDefaultBiorhythm() {
    updateBiorhythmBar('physical', 0);
    updateBiorhythmBar('emotional', 0);
    updateBiorhythmBar('intellectual', 0);
    
    document.getElementById('physical-value').textContent = '0.0%';
    document.getElementById('emotional-value').textContent = '0.0%';
    document.getElementById('intellectual-value').textContent = '0.0%';
}

// 바이오리듬 바 업데이트 (수정됨)
function updateBiorhythmBar(type, value) {
    const bar = document.getElementById(`${type}-bar`);
    
    // -100 ~ +100 범위를 0 ~ 100 범위로 정규화
    const normalizedValue = Math.abs(value); // 절대값으로 막대 길이 결정
    bar.style.width = `${normalizedValue}%`;
    
    // 양수/음수에 따라 스타일 클래스 변경
    bar.classList.remove('positive', 'negative');
    if (value >= 0) {
        bar.classList.add('positive'); // 색상 채우기
    } else {
        bar.classList.add('negative'); // 윤곽선만
    }
}

// 스와이프 제스처 설정
function setupSwipeGesture() {
    const calendarElement = document.getElementById('calendar-screen');
    const hammer = new Hammer(calendarElement);
    
    hammer.on('swipeleft', () => {
        navigateMonth(1);
    });
    
    hammer.on('swiperight', () => {
        navigateMonth(-1);
    });
}