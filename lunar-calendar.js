/**
 * 음력 관련 계산을 위한 라이브러리
 */

// 간지 배열
const heavenlyStems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const earthlyBranches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const chineseYears = ['鼠', '牛', '虎', '兎', '龍', '蛇', '馬', '羊', '猴', '鷄', '犬', '猪'];

// 1901년부터 2099년까지의 음력 데이터
// 각 연도의 음력 정보를 16진수로 압축해서 저장
// 실제 구현에서는 더 정확한 데이터가 필요합니다
const lunarInfo = [
    0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
    0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
    0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
    0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
    0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
    0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5d0, 0x14573, 0x052d0, 0x0a9a8, 0x0e950, 0x06aa0,
    0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
    0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b5a0, 0x195a6,
    0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
    0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0,
    0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
    0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
    0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
    0x05aa0, 0x076a3, 0x096d0, 0x04bd7, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
    0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0,
    0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06aa0, 0x1a6c4, 0x0aae0,
    0x092e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4,
    0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0,
    0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160,
    0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252
];

// 해당 연도가 윤년인지 체크
function isLeapYear(year) {
    return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
}

// 1900년 1월 31일부터의 일수 계산
function getDaysSince1900(date) {
    const base = new Date(1900, 0, 31);
    const diff = date - base;
    return Math.floor(diff / (24 * 60 * 60 * 1000));
}

// 양력 날짜로부터 음력 날짜 계산
function getLunarDate(date) {
    try {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        
        // 유효한 연도 범위 체크 (1901-2099)
        if (year < 1901 || year > 2099) {
            console.warn('Year out of range (1901-2099):', year);
            return null;
        }
        
        // 1900년 1월 31일부터의 일수
        const offset = getDaysSince1900(date);
        let daysPassed = offset;
        
        // 음력 데이터 인덱스
        const dataIndex = year - 1901;
        if (dataIndex < 0 || dataIndex >= lunarInfo.length) {
            console.warn('Invalid lunar data index:', dataIndex);
            return null;
        }
        
        const lunarData = lunarInfo[dataIndex];
        
        // 음력 연도 시작일부터의 일수 계산
        let lunarYear = 1901;
        while (lunarYear < year) {
            const lunarDays = getLunarYearDays(lunarYear);
            daysPassed -= lunarDays;
            lunarYear++;
        }
        
        // 음력 월 계산
        let lunarMonth = 1;
        let isLeapMonth = false;
        
        // 해당 연도의 윤달 여부
        const leapMonth = getLeapMonth(year);
        
        // 각 월의 일수를 고려하여 월 계산
        while (daysPassed > 0) {
            // 현재 월의 일수
            let monthDays;
            if (isLeapMonth) {
                monthDays = getLeapMonthDays(year);
                isLeapMonth = false;
            } else {
                monthDays = getMonthDays(year, lunarMonth);
                
                if (lunarMonth === leapMonth) {
                    // 윤달이 있는 경우, 다음은 윤달
                    isLeapMonth = true;
                } else {
                    lunarMonth++;
                }
            }
            
            if (daysPassed <= monthDays) {
                break;
            }
            
            daysPassed -= monthDays;
            
            if (lunarMonth > 12) {
                lunarYear++;
                lunarMonth = 1;
            }
        }
        
        // 날짜 계산
        const lunarDay = daysPassed;
        
        return {
            year: lunarYear,
            month: lunarMonth,
            day: lunarDay,
            isLeap: isLeapMonth
        };
    } catch (e) {
        console.error('Error in getLunarDate:', e);
        return null;
    }
}

// 해당 연도의 윤달 월 반환 (0은 윤달 없음)
function getLeapMonth(year) {
    if (year < 1901 || year > 2099) return 0;
    return lunarInfo[year - 1901] & 0xf;
}

// 해당 연도의 총 일수 계산
function getLunarYearDays(year) {
    if (year < 1901 || year > 2099) return 365;
    
    let totalDays = 348;
    for (let i = 0x8000; i > 0x8; i >>= 1) {
        totalDays += ((lunarInfo[year - 1901] & i) ? 1 : 0);
    }
    
    return totalDays + getLeapMonthDays(year);
}

// 해당 연도, 월의 일수 계산
function getMonthDays(year, month) {
    if (year < 1901 || year > 2099) return 30;
    if (month < 1 || month > 12) return 30;
    
    return ((lunarInfo[year - 1901] & (0x10000 >> month)) ? 30 : 29);
}

// 해당 연도의 윤달 일수 계산
function getLeapMonthDays(year) {
    if (year < 1901 || year > 2099) return 0;
    
    if (getLeapMonth(year)) {
        return ((lunarInfo[year - 1901] & 0x10000) ? 30 : 29);
    }
    return 0;
}

// 간지 계산 함수
function getGanZhi(year, month, day) {
    try {
        // 기준일: 1900년 1월 31일 (금성콰)
        const baseDate = new Date(1900, 0, 31);
        const targetDate = new Date(year, month - 1, day);
        
        // 유효한 날짜인지 확인
        if (isNaN(targetDate.getTime())) {
            console.error('Invalid date:', year, month, day);
            return '정보 없음';
        }
        
        const dayDiff = Math.floor((targetDate - baseDate) / (1000 * 60 * 60 * 24));
        
        // 일간지 계산 (1900년 1월 31일은 '金성콰'로, 간지 배열의 시작 인덱스 조정)
        const dayIndex = (dayDiff + 6) % 60;
        const heavenlyStemIndex = dayIndex % 10;
        const earthlyBranchIndex = dayIndex % 12;
        
        return heavenlyStems[heavenlyStemIndex] + earthlyBranches[earthlyBranchIndex];
    } catch (e) {
        console.error('Error in getGanZhi:', e);
        return '정보 없음';
    }
}

// 연도의 간지 계산
function getYearGanZhi(year) {
    try {
        if (year < 1900 || year > 2099) {
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