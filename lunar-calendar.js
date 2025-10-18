/**
 * 음력 관련 계산을 위한 라이브러리
 * CSV 데이터베이스를 사용하여 정확한 음력 및 일진 정보 제공
 */

// 간지 배열 (참고용)
const heavenlyStems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const earthlyBranches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const chineseYears = ['鼠', '牛', '虎', '兎', '龍', '蛇', '馬', '羊', '猴', '鷄', '犬', '猪'];

// 한글 간지 배열 추가
const heavenlyStemsKorean = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
const earthlyBranchesKorean = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];

/**
 * 음력 데이터베이스
 * 날짜 형식: YYYY-MM-DD를 키로 사용
 * 값: 음력 날짜, 윤달 여부, 일진 정보 포함
 */
let lunarCalendarDB = {};
let isDataLoaded = false;

/**
 * CSV 파일에서 음력 데이터 로드
 * @returns {Promise} - 로드 완료 Promise
 */
async function loadLunarCalendarData() {
  try {
    console.log('음력 데이터 로드 시작...');
    const response = await fetch('lunar_solar_calendar.csv');
    if (!response.ok) {
      throw new Error(`Failed to load lunar calendar data: ${response.status}`);
    }
    
    const csvText = await response.text();
    const rows = csvText.trim().split('\n');
    
    // 첫 번째 행은 헤더이므로 건너뛰기
    for (let i = 1; i < rows.length; i++) {
      const line = rows[i].trim();
      if (!line) continue;
      
      const values = line.split(',');
      if (values.length < 7) continue; // 최소 필요 필드 검사
      
      // 양력 날짜
      const solarYear = parseInt(values[0]);
      const solarMonth = parseInt(values[1]);
      const solarDay = parseInt(values[2]);
      
      // 유효한 날짜인지 확인
      if (isNaN(solarYear) || isNaN(solarMonth) || isNaN(solarDay)) {
        continue;
      }
      
      // 날짜 키 생성
      const dateKey = `${solarYear}-${String(solarMonth).padStart(2, '0')}-${String(solarDay).padStart(2, '0')}`;
      
      // 음력 정보 구성
      lunarCalendarDB[dateKey] = {
        lunar: {
          year: parseInt(values[3]),
          month: parseInt(values[4]),
          day: parseInt(values[5]),
          isLeap: parseInt(values[6]) === 1
        },
        // 일진 정보 (8번째 필드가 있으면 사용, 없으면 null)
        ganzi: values.length > 7 && values[7] ? values[7].trim() : null
      };
    }
    
    console.log(`음력 데이터 로드 완료: ${Object.keys(lunarCalendarDB).length}개 항목`);
    isDataLoaded = true;
    return true;
  } catch (error) {
    console.error('음력 데이터 로드 실패:', error);
    isDataLoaded = false;
    return false;
  }
}

/**
 * 날짜를 문자열 키로 변환하는 함수
 * @param {Date} date - 날짜
 * @returns {string} - "YYYY-MM-DD" 형식 문자열
 */
function getDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 데이터베이스에서 음력 정보 검색
 * @param {Date} date - 양력 날짜
 * @returns {Object|null} - 음력 정보 객체 또는 null
 */
function getLunarData(date) {
  if (!isDataLoaded) {
    console.warn('음력 데이터가 아직 로드되지 않았습니다.');
    return null;
  }
  const dateKey = getDateKey(date);
  return lunarCalendarDB[dateKey] || null;
}

/**
 * 양력 날짜로부터 음력 날짜 계산
 * 데이터베이스에서 검색, 없으면 null 반환
 * @param {Date} date - 양력 날짜
 * @returns {Object|null} - 음력 날짜 정보
 */
function getLunarDate(date) {
  // 데이터베이스 범위 체크
  const year = date.getFullYear();
  if (year < 1900 || year > 2049) {
    console.warn('음력 데이터는 1900-2049년 범위만 지원합니다:', year);
    return null;
  }
  
  // 데이터베이스에서 직접 검색
  const lunarData = getLunarData(date);
  if (lunarData) {
    return lunarData.lunar;
  }
  
  console.warn('데이터베이스에서 정확한 음력 정보를 찾을 수 없습니다:', getDateKey(date));
  return null;
}

/**
 * 일진(간지) 계산 함수
 * 데이터베이스에서 검색, 없으면 계산
 * @param {number} year - 연도
 * @param {number} month - 월 (1-12)
 * @param {number} day - 일
 * @returns {string} - 일진 (예: '기해(己亥) 정축(丁丑) 갑술(甲戌)')
 */
function getGanZhi(year, month, day) {
  // 데이터베이스 범위 체크
  if (year < 1900 || year > 2049) {
    console.warn('일진 데이터는 1900-2049년 범위만 지원합니다:', year);
    return '정보 없음';
  }
  
  const date = new Date(year, month - 1, day);
  
  // 데이터베이스에서 직접 검색
  const lunarData = getLunarData(date);
  if (lunarData && lunarData.ganzi) {
    return lunarData.ganzi;
  }
  
  // 데이터베이스에 없는 경우 계산 (1900년 1월 1일은 '경자일')
  try {
    const baseDate = new Date(1900, 0, 1);
    const diffDays = Math.floor((date - baseDate) / (1000 * 60 * 60 * 24));
    
    if (diffDays >= 0) {
      const heavenlyStemIndex = (diffDays + 6) % 10; // 경(7번째)에서 시작하지만 배열은 0부터
      const earthlyBranchIndex = (diffDays + 0) % 12; // 자(1번째)에서 시작하지만 배열은 0부터
      
      // 한글 간지와 한자 간지 모두 반환
      const koreanGanzi = heavenlyStemsKorean[heavenlyStemIndex] + earthlyBranchesKorean[earthlyBranchIndex];
      const chineseGanzi = heavenlyStems[heavenlyStemIndex] + earthlyBranches[earthlyBranchIndex];
      
      return `${koreanGanzi}(${chineseGanzi})`;
    }
  } catch (e) {
    console.error('일진 계산 오류:', e);
  }
  
  return '정보 없음';
}

/**
 * 연도의 간지 계산
 * @param {number} year - 연도
 * @returns {string} - 연도 간지 (예: '乙巳')
 */
function getYearGanZhi(year) {
  try {
    // 데이터베이스 범위 체크
    if (year < 1900 || year > 2049) {
      console.warn('간지 데이터는 1900-2049년 범위만 지원합니다:', year);
      return '정보 없음';
    }
    
    // 계산식 사용 (1900년은 庚子년)
    const offset = (year - 1900) % 60;
    const heavenlyStemIndex = (offset + 6) % 10;  // 1900년은 庚(7번째) 시작이지만, 배열은 0부터 시작하므로 6
    const earthlyBranchIndex = (offset + 0) % 12; // 1900년은 子(1번째) 시작이지만, 배열은 0부터 시작하므로 0
    
    return heavenlyStems[heavenlyStemIndex] + earthlyBranches[earthlyBranchIndex];
  } catch (e) {
    console.error('연간지 계산 오류:', e);
    return '정보 없음';
  }
}

/**
 * 바이오리듬 계산
 * @param {Date} birthdate - 생년월일
 * @param {Date} targetDate - 대상 날짜
 * @returns {Object} - 바이오리듬 수치
 */
function calculateBiorhythm(birthdate, targetDate) {
  try {
    // 두 날짜가 유효한지 확인
    if (isNaN(birthdate.getTime()) || isNaN(targetDate.getTime())) {
      console.error('Invalid date in calculateBiorhythm');
      return { physical: 0, emotional: 0, intellectual: 0 };
    }
    
    // 생일부터 타겟 날짜까지의 일수
    const diffTime = targetDate - birthdate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // 각 주기별 바이오리듬 계산 (신체: 23일, 감성: 28일, 지성: 33일)
    const physical = Math.sin(2 * Math.PI * (diffDays / 23)) * 100;
    const emotional = Math.sin(2 * Math.PI * (diffDays / 28)) * 100;
    const intellectual = Math.sin(2 * Math.PI * (diffDays / 33)) * 100;
    
    return {
      physical: Math.round(physical * 10) / 10,
      emotional: Math.round(emotional * 10) / 10,
      intellectual: Math.round(intellectual * 10) / 10
    };
  } catch (e) {
    console.error('Error in calculateBiorhythm:', e);
    return { physical: 0, emotional: 0, intellectual: 0 };
  }
}

/**
 * 날짜 간의 차이 계산 (일 단위)
 * @param {Date} date1 - 첫번째 날짜
 * @param {Date} date2 - 두번째 날짜
 * @returns {number} - 일수 차이
 */
function getDaysDifference(date1, date2) {
  try {
    // 두 날짜가 유효한지 확인
    if (isNaN(date1.getTime()) || isNaN(date2.getTime())) {
      console.error('Invalid date in getDaysDifference');
      return 0;
    }
    
    const diffTime = date2 - date1;
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  } catch (e) {
    console.error('Error in getDaysDifference:', e);
    return 0;
  }
}

/**
 * 국경일/공휴일 체크
 * @param {number} year - 연도
 * @param {number} month - 월 (1-12)
 * @param {number} day - 일
 * @returns {boolean} - 공휴일 여부
 */
function isHoliday(year, month, day) {
  try {
    const date = new Date(year, month - 1, day);
    const dateKey = getDateKey(date);
    
    // 데이터베이스에서 휴일 정보 검색
    const holidayData = holidaysDB[dateKey];
    if (holidayData) {
      return holidayData.isHoliday;
    }
    
    // 데이터베이스에 없는 경우, 주요 공휴일 체크
    // 양력 기준 고정 휴일
    if (
      (month === 1 && day === 1) ||    // 신정
      (month === 3 && day === 1) ||    // 삼일절
      (month === 5 && day === 5) ||    // 어린이날
      (month === 6 && day === 6) ||    // 현충일
      (month === 8 && day === 15) ||   // 광복절
      (month === 10 && day === 3) ||   // 개천절
      (month === 10 && day === 9) ||   // 한글날
      (month === 12 && day === 25)     // 크리스마스
    ) {
      return true;
    }
    
    // 토요일과 일요일도 표시
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return true;
    }
    
    return false;
  } catch (e) {
    console.error('Error in isHoliday:', e);
    return false;
  }
}

/**
 * 국경일/명절 데이터 (2020-2030년)
 */
const holidaysDB = {
  // 2025년 주요 휴일
  "2025-01-01": { name: "신정", isHoliday: true },
  "2025-01-28": { name: "설날", isHoliday: true },
  "2025-01-29": { name: "설날", isHoliday: true },
  "2025-01-30": { name: "설날", isHoliday: true },
  "2025-03-01": { name: "삼일절", isHoliday: true },
  "2025-03-03": { name: "대체공휴일", isHoliday: true },
  "2025-05-05": { name: "어린이날", isHoliday: true },
  "2025-05-06": { name: "석가탄신일", isHoliday: true },
  "2025-06-06": { name: "현충일", isHoliday: true },
  "2025-08-15": { name: "광복절", isHoliday: true },
  "2025-10-03": { name: "개천절", isHoliday: true },
  "2025-10-05": { name: "추석", isHoliday: true },
  "2025-10-06": { name: "추석", isHoliday: true },
  "2025-10-07": { name: "추석", isHoliday: true },
  "2025-10-08": { name: "대체공휴일", isHoliday: true },
  "2025-10-09": { name: "한글날", isHoliday: true },
  "2025-12-25": { name: "크리스마스", isHoliday: true }
};

/**
 * 모듈 내보내기
 */
window.LunarCalendar = {
  initialize: loadLunarCalendarData,
  getLunarDate,
  getGanZhi,
  getYearGanZhi,
  calculateBiorhythm,
  getDaysDifference,
  isHoliday
};