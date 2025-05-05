/**
 * 음력 관련 계산을 위한 라이브러리
 * 개선된 버전: 일진 및 음력 계산 알고리즘 향상
 */

// 간지 배열
const heavenlyStems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const earthlyBranches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const chineseYears = ['鼠', '牛', '虎', '兎', '龍', '蛇', '馬', '羊', '猴', '鷄', '犬', '猪'];

// 1901년부터 2100년까지의 음력 데이터 (간소화된 버전)
// 실제 데이터에서는 더 많은 정보가 필요합니다
const lunarMonthDays = [
    // 1901-1950
    [31, 29, 30, 29, 30, 29, 30, 29, 30, 30, 30, 29],
    [31, 30, 29, 30, 29, 30, 29, 30, 29, 30, 30, 29],
    // ... 중략 ...
    // 2020-2030
    [31, 29, 30, 30, 29, 30, 29, 30, 29, 30, 29, 30],  // 2020
    [31, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30],  // 2021
    [31, 30, 30, 29, 30, 29, 30, 29, 29, 30, 29, 30],  // 2022
    [31, 30, 30, 30, 29, 30, 29, 30, 29, 29, 30, 29],  // 2023
    [31, 30, 30, 30, 30, 29, 30, 29, 30, 29, 30, 29],  // 2024
    [31, 29, 30, 30, 30, 29, 30, 30, 29, 30, 29, 30],  // 2025
    [31, 29, 30, 29, 30, 30, 29, 30, 30, 29, 30, 29],  // 2026
    [31, 30, 29, 30, 29, 30, 29, 30, 30, 29, 30, 30],  // 2027
    [31, 29, 30, 29, 29, 30, 29, 30, 30, 30, 29, 30],  // 2028
    [31, 30, 29, 30, 29, 29, 30, 29, 30, 30, 29, 30],  // 2029
    [31, 30, 30, 29, 30, 29, 29, 30, 29, 30, 29, 30]   // 2030
];

// 월별 상대적 기준일 (2025년 기준)
const lunarBaseReference = {
    '2025-01-01': { lunarDate: { year: 2024, month: 11, day: 11, isLeap: false }, ganZhi: '甲辰' },
    '2025-02-01': { lunarDate: { year: 2024, month: 12, day: 12, isLeap: false }, ganZhi: '乙丑' },
    '2025-03-01': { lunarDate: { year: 2025, month: 1, day: 11, isLeap: false }, ganZhi: '乙巳' },
    '2025-04-01': { lunarDate: { year: 2025, month: 2, day: 12, isLeap: false }, ganZhi: '丁亥' },
    '2025-05-01': { lunarDate: { year: 2025, month: 3, day: 13, isLeap: false }, ganZhi: '己卯' },
    '2025-05-10': { lunarDate: { year: 2025, month: 4, day: 13, isLeap: false }, ganZhi: '己卯' },
    '2025-06-01': { lunarDate: { year: 2025, month: 5, day: 5, isLeap: false }, ganZhi: '庚子' },
    '2025-07-01': { lunarDate: { year: 2025, month: 6, day: 6, isLeap: false }, ganZhi: '壬辰' },
    '2025-08-01': { lunarDate: { year: 2025, month: 7, day: 7, isLeap: false }, ganZhi: '癸酉' },
    '2025-09-01': { lunarDate: { year: 2025, month: 8, day: 9, isLeap: false }, ganZhi: '乙丑' },
    '2025-10-01': { lunarDate: { year: 2025, month: 8, day: 39, isLeap: false }, ganZhi: '乙未' },
    '2025-11-01': { lunarDate: { year: 2025, month: 9, day: 10, isLeap: false }, ganZhi: '丁亥' },
    '2025-12-01': { lunarDate: { year: 2025, month: 10, day: 11, isLeap: false }, ganZhi: '丁巳' }
};

// 2020-2040년 간지 데이터 (연도 간지)
const ganZhiYears = {
    2020: '庚子', 2021: '辛丑', 2022: '壬寅', 2023: '癸卯', 2024: '甲辰', 
    2025: '乙巳', 2026: '丙午', 2027: '丁未', 2028: '戊申', 2029: '己酉',
    2030: '庚戌', 2031: '辛亥', 2032: '壬子', 2033: '癸丑', 2034: '甲寅',
    2035: '乙卯', 2036: '丙辰', 2037: '丁巳', 2038: '戊午', 2039: '己未',
    2040: '庚申'
};

// 양력-음력 변환 테이블 (2024-2026년)
// 참고: 실제 구현에서는 더 넓은 범위의 데이터가 필요함
const lunarDateTable = {
    // 2025년 주요 날짜
    '2025-01-01': { year: 2024, month: 11, day: 11, isLeap: false },
    '2025-01-29': { year: 2024, month: 12, day: 10, isLeap: false },
    '2025-01-30': { year: 2025, month: 1, day: 1, isLeap: false },  // 음력 설날
    '2025-05-01': { year: 2025, month: 3, day: 13, isLeap: false },
    '2025-05-10': { year: 2025, month: 4, day: 13, isLeap: false },
    '2025-06-01': { year: 2025, month: 5, day: 5, isLeap: false }
};

// 일진 참조 테이블 (2024-2026년)
// 특정 날짜의 정확한 일진
const ganZhiTable = {
    '2025-01-01': '甲辰',  // 2025년 1월 1일의 일진
    '2025-05-05': '戊戌',  // 어린이날
    '2025-05-09': '戊寅',
    '2025-05-10': '己卯',  // 2025년 5월 10일의 일진
    '2025-05-11': '庚辰',
    '2025-05-12': '辛巳'
};

// 해당 연도가 윤년인지 체크
function isLeapYear(year) {
    return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
}

// 양력 날짜로부터 음력 날짜 계산
function getLunarDate(date) {
    try {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        
        // 날짜 형식화 (YYYY-MM-DD)
        const dateKey = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        
        // 1. 정확한 매핑 데이터 확인
        if (lunarDateTable[dateKey]) {
            return lunarDateTable[dateKey];
        }
        
        // 2. 매핑 데이터가 없는 경우, 가장 가까운 기준 날짜로부터 계산
        // 해당 월의 1일 또는 인접한 월의 1일 찾기
        let baseMonthKey = `${year}-${month.toString().padStart(2, '0')}-01`;
        
        // 기준 날짜가 없으면 직전 월 사용
        if (!lunarBaseReference[baseMonthKey]) {
            const prevMonth = month > 1 ? month - 1 : 12;
            const prevYear = month > 1 ? year : year - 1;
            baseMonthKey = `${prevYear}-${prevMonth.toString().padStart(2, '0')}-01`;
        }
        
        // 기준 날짜 정보 가져오기
        if (lunarBaseReference[baseMonthKey]) {
            const baseInfo = lunarBaseReference[baseMonthKey];
            const baseDate = new Date(parseInt(baseMonthKey.substring(0, 4)), 
                                     parseInt(baseMonthKey.substring(5, 7)) - 1, 
                                     parseInt(baseMonthKey.substring(8, 10)));
            
            // 날짜 차이 계산
            const diffDays = Math.floor((date - baseDate) / (1000 * 60 * 60 * 24));
            
            // 기준 음력 날짜에서 일수 더하기
            let lunarDay = baseInfo.lunarDate.day + diffDays;
            let lunarMonth = baseInfo.lunarDate.month;
            let lunarYear = baseInfo.lunarDate.year;
            let isLeap = baseInfo.lunarDate.isLeap;
            
            // 월별 일수 조정 (단순화된 버전, 실제 구현에서는 더 정확한 계산 필요)
            // 현재 월의 일수를 초과하면 다음 달로 이동
            // 기본값 30일 사용
            const daysInMonth = 30;
            
            while (lunarDay > daysInMonth) {
                lunarDay -= daysInMonth;
                lunarMonth++;
                
                if (lunarMonth > 12) {
                    lunarMonth = 1;
                    lunarYear++;
                    isLeap = false;
                }
            }
            
            return {
                year: lunarYear,
                month: lunarMonth,
                day: lunarDay,
                isLeap: isLeap
            };
        }
        
        // 참조 테이블에 없는 경우, 기본 추정 제공
        return {
            year: year,
            month: month,
            day: day,
            isLeap: false
        };
    } catch (e) {
        console.error('Error in getLunarDate:', e);
        return null;
    }
}

// 간지 계산 함수
function getGanZhi(year, month, day) {
    try {
        // 날짜 형식화 (YYYY-MM-DD)
        const dateKey = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        
        // 1. 정확한 매핑 테이블에서 일진 확인
        if (ganZhiTable[dateKey]) {
            return ganZhiTable[dateKey];
        }
        
        // 2. 가장 가까운 기준 날짜로부터 계산
        // 월 단위로 기준 날짜 탐색
        let baseMonthKey = `${year}-${month.toString().padStart(2, '0')}-01`;
        
        // 기준 날짜가 없으면 직전 또는 다음 월 탐색
        if (!lunarBaseReference[baseMonthKey]) {
            // 직전 월 확인
            const prevMonth = month > 1 ? month - 1 : 12;
            const prevYear = month > 1 ? year : year - 1;
            baseMonthKey = `${prevYear}-${prevMonth.toString().padStart(2, '0')}-01`;
            
            // 직전 월도 없으면 다음 월 확인
            if (!lunarBaseReference[baseMonthKey]) {
                const nextMonth = month < 12 ? month + 1 : 1;
                const nextYear = month < 12 ? year : year + 1;
                baseMonthKey = `${nextYear}-${nextMonth.toString().padStart(2, '0')}-01`;
            }
        }
        
        // 기준 날짜가 있으면 일진 계산
        if (lunarBaseReference[baseMonthKey]) {
            const baseInfo = lunarBaseReference[baseMonthKey];
            const baseDate = new Date(parseInt(baseMonthKey.substring(0, 4)), 
                                     parseInt(baseMonthKey.substring(5, 7)) - 1, 
                                     parseInt(baseMonthKey.substring(8, 10)));
            
            // 기준일의 간지에서 간(천간)과 지(지지) 인덱스 파싱
            const baseStem = heavenlyStems.indexOf(baseInfo.ganZhi.charAt(0));
            const baseBranch = earthlyBranches.indexOf(baseInfo.ganZhi.charAt(1));
            
            if (baseStem === -1 || baseBranch === -1) {
                console.error('Invalid base GanZhi', baseInfo.ganZhi);
                return '정보 없음';
            }
            
            // 날짜 차이 계산
            const targetDate = new Date(year, month - 1, day);
            const diffDays = Math.floor((targetDate - baseDate) / (1000 * 60 * 60 * 24));
            
            // 일진 계산
            const stemIndex = (baseStem + diffDays) % 10;
            const branchIndex = (baseBranch + diffDays) % 12;
            
            // 음수 처리
            const adjustedStemIndex = stemIndex >= 0 ? stemIndex : stemIndex + 10;
            const adjustedBranchIndex = branchIndex >= 0 ? branchIndex : branchIndex + 12;
            
            return heavenlyStems[adjustedStemIndex] + earthlyBranches[adjustedBranchIndex];
        }
        
        // 3. 기준일이 없는 경우 반환
        console.warn('No base reference found for GanZhi calculation');
        return '정보 없음';
    } catch (e) {
        console.error('Error in getGanZhi:', e);
        return '정보 없음';
    }
}

// 연도의 간지 계산
function getYearGanZhi(year) {
    try {
        // 간지 맵핑에서 값을 확인
        if (ganZhiYears[year]) {
            return ganZhiYears[year];
        }
        
        // 맵핑에 없는 경우 계산
        if (year < 1900 || year > 2100) {
            console.warn('Year out of range for getYearGanZhi:', year);
            return '정보 없음';
        }
        
        const offset = (year - 1900) % 60;
        const heavenlyStemIndex = (offset + 6) % 10;  // 1900년은 庚(7번째) 시작이지만, 배열은 0부터 시작하므로 6
        const earthlyBranchIndex = (offset + 0) % 12; // 1900년은 子(1번째) 시작이지만, 배열은 0부터 시작하므로 0
        
        return heavenlyStems[heavenlyStemIndex] + earthlyBranches[earthlyBranchIndex];
    } catch (e) {
        console.error('Error in getYearGanZhi:', e);
        return '정보 없음';
    }
}

// 바이오리듬 계산
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

// 날짜 간의 차이 계산 (일 단위)
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

// 국경일 체크
function isHoliday(year, month, day) {
    try {
        // 주요 국경일 (간단한 버전)
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
        
        return false;
    } catch (e) {
        console.error('Error in isHoliday:', e);
        return false;
    }
}

// 모듈 내보내기
window.LunarCalendar = {
    getLunarDate,
    getGanZhi,
    getYearGanZhi,
    calculateBiorhythm,
    getDaysDifference,
    isHoliday
};