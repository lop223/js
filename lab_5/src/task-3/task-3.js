const ui = {
    clockHH: document.getElementById('clockHH'),
    clockMM: document.getElementById('clockMM'),
    clockSS: document.getElementById('clockSS'),
    clockSep: document.getElementById('clockSep'),
    clockDate: document.getElementById('clockDate'),

    cdTarget: document.getElementById('countdownTarget'),
    cdStart: document.getElementById('cdStart'),
    cdStop: document.getElementById('cdStop'),
    cdDays: document.getElementById('cdDays'),
    cdHours: document.getElementById('cdHours'),
    cdMins: document.getElementById('cdMins'),
    cdSecs: document.getElementById('cdSecs'),
    cdMsg: document.getElementById('cdMsg'),

    calPrev: document.getElementById('calPrev'),
    calNext: document.getElementById('calNext'),
    calPicker: document.getElementById('calMonthPicker'),
    calGrid: document.getElementById('calGrid'),

    bdayInput: document.getElementById('bdayInput'),
    bdayCalc: document.getElementById('bdayCalc'),
    bdayResult: document.getElementById('bdayResult'),
    bdayMonths: document.getElementById('bdayMonths'),
    bdayDays: document.getElementById('bdayDays'),
    bdayHours: document.getElementById('bdayHours'),
    bdayMins: document.getElementById('bdayMins'),
    bdaySecs: document.getElementById('bdaySecs'),
    bdayDate: document.getElementById('bdayDate'),
};

// ═══════════════════════════════════════════════════════════════
//  STATE
// ═══════════════════════════════════════════════════════════════

const state = {
    clockInterval: null,
    lastSecond: -1,

    cdInterval: null,
    cdRunning: false,
    cdTargetTs: 0,

    calYear: new Date().getFullYear(),
    calMonth: new Date().getMonth(),   // 0-indexed

    bdayInterval: null,
    bdayTargetTs: 0,

    WEEKDAYS_UA: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'],
    MONTHS_UA: [
        'Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень',
        'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'
    ],
    MONTHS_GEN_UA: [
        'січня', 'лютого', 'березня', 'квітня', 'травня', 'червня',
        'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'
    ],
};

function pad2(n) {
    return String(n).padStart(2, '0');
}

function decompose(ms) {
    const total = Math.floor(ms / 1000);
    const secs = total % 60;
    const mins = Math.floor(total / 60) % 60;
    const hours = Math.floor(total / 3600) % 24;
    const days = Math.floor(total / 86400);
    return { days, hours, mins, secs };
}

function nextBirthday(birthdayDate) {
    const now = new Date();
    const month = birthdayDate.getMonth();
    const day = birthdayDate.getDate();

    let candidate = new Date(now.getFullYear(), month, day, 0, 0, 0, 0);
    if (candidate <= now) {
        candidate = new Date(now.getFullYear() + 1, month, day, 0, 0, 0, 0);
    }
    return candidate;
}

// Months + days between two dates (from → to), where to > from.
function monthsDaysBetween(from, to) {
    let months = (to.getFullYear() - from.getFullYear()) * 12
        + (to.getMonth() - from.getMonth());
    let remainder = new Date(from);
    remainder.setMonth(remainder.getMonth() + months);

    if (remainder > to) { months--; remainder.setMonth(remainder.getMonth() - 1); }

    const days = Math.floor((to - remainder) / 86400000);
    return { months, days };
}

function tickClock() {
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes();
    const s = now.getSeconds();

    ui.clockHH.textContent = pad2(h);
    ui.clockMM.textContent = pad2(m);
    ui.clockSS.textContent = pad2(s);

    const dow = ['Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П\'ятниця', 'Субота'][now.getDay()];
    const mon = state.MONTHS_GEN_UA[now.getMonth()];
    ui.clockDate.textContent = `${dow}, ${now.getDate()} ${mon} ${now.getFullYear()}`;
}

function startClock() {
    tickClock();
    state.clockInterval = setInterval(tickClock, 500);
}

function renderCountdown() {
    const ms = state.cdTargetTs - Date.now();

    if (ms <= 0) {
        stopCountdown();
        setCountdownDisplay(0, 0, 0, 0);
        ui.cdMsg.textContent = '✔ Час вийшов!';
        return;
    }

    ui.cdMsg.textContent = '';
    const { days, hours, mins, secs } = decompose(ms);
    setCountdownDisplay(days, hours, mins, secs);
}

function setCountdownDisplay(d, h, m, s) {
    ui.cdDays.textContent = pad2(d);
    ui.cdHours.textContent = pad2(h);
    ui.cdMins.textContent = pad2(m);
    ui.cdSecs.textContent = pad2(s);
}

function startCountdown() {
    const val = ui.cdTarget.value;
    if (!val) { ui.cdMsg.textContent = '⚠ Оберіть дату та час'; return; }

    const target = new Date(val).getTime();
    if (target <= Date.now()) { ui.cdMsg.textContent = '⚠ Дата вже минула'; return; }

    state.cdTargetTs = target;
    state.cdRunning = true;

    ui.cdStart.disabled = true;
    ui.cdStop.disabled = false;
    ui.cdTarget.disabled = true;

    renderCountdown();
    state.cdInterval = setInterval(renderCountdown, 1000);
}

function stopCountdown() {
    clearInterval(state.cdInterval);
    state.cdRunning = false;

    ui.cdStart.disabled = false;
    ui.cdStop.disabled = true;
    ui.cdTarget.disabled = false;
}

function renderCalendar() {
    const { calYear: year, calMonth: month } = state;

    ui.calPicker.value = `${year}-${pad2(month + 1)}`;

    const grid = ui.calGrid;
    while (grid.children.length > 7) grid.removeChild(grid.lastChild);

    const firstDow = (new Date(year, month, 1).getDay() + 6) % 7;

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const today = new Date();
    const isCurrentMonth = (year === today.getFullYear() && month === today.getMonth());

    for (let i = 0; i < firstDow; i++) {
        const cell = buildDayCell(daysInPrevMonth - firstDow + 1 + i, ['other-month']);
        grid.appendChild(cell);
    }

    for (let d = 1; d <= daysInMonth; d++) {
        const dow = (new Date(year, month, d).getDay() + 6) % 7; // Mon=0
        const mods = [];
        if (dow >= 5) mods.push('weekend');
        if (isCurrentMonth && d === today.getDate()) mods.push('today');
        grid.appendChild(buildDayCell(d, mods));
    }

    const total = firstDow + daysInMonth;
    const trailing = total % 7 === 0 ? 0 : 7 - (total % 7);
    for (let d = 1; d <= trailing; d++) {
        grid.appendChild(buildDayCell(d, ['other-month']));
    }
}

function buildDayCell(day, modifiers = []) {
    const cell = document.createElement('div');
    const classes = ['calendar__day', ...modifiers.map(m => `calendar__day--${m}`)];
    cell.className = classes.join(' ');
    cell.textContent = day;
    return cell;
}

function changeCalMonth(delta) {
    state.calMonth += delta;
    if (state.calMonth > 11) { state.calMonth = 0; state.calYear++; }
    if (state.calMonth < 0) { state.calMonth = 11; state.calYear--; }
    renderCalendar();
}

function renderBirthday() {
    const now = Date.now();
    const ms = state.bdayTargetTs - now;

    if (ms <= 0) {
        clearInterval(state.bdayInterval);
        ui.bdayMonths.textContent = '0';
        ui.bdayDays.textContent = '0';
        ui.bdayHours.textContent = '0';
        ui.bdayMins.textContent = '0';
        ui.bdaySecs.textContent = '0';
        ui.bdayDate.textContent = '🎉 Today is your Birthday!';
        return;
    }

    const fromDate = new Date();
    const toDate = new Date(state.bdayTargetTs);
    const { months, days } = monthsDaysBetween(fromDate, toDate);

    const remainderMs = ms - days * 86400000 - months * 0; // months handled separately
    const { hours, mins, secs } = decompose(ms % 86400000);

    ui.bdayMonths.textContent = pad2(months);
    ui.bdayDays.textContent = pad2(days);
    ui.bdayHours.textContent = pad2(hours);
    ui.bdayMins.textContent = pad2(mins);
    ui.bdaySecs.textContent = pad2(secs);
}

function calcBirthday() {
    const val = ui.bdayInput.value;
    if (!val) return;

    const bday = new Date(val);
    const next = nextBirthday(bday);

    state.bdayTargetTs = next.getTime();

    const mon = state.MONTHS_GEN_UA[next.getMonth()];
    ui.bdayDate.textContent = `Наступний день народження: ${next.getDate()} ${mon} ${next.getFullYear()}`;
    ui.bdayResult.hidden = false;

    clearInterval(state.bdayInterval);
    renderBirthday();
    state.bdayInterval = setInterval(renderBirthday, 1000);
}

function init() {
    startClock();

    ui.cdStart.addEventListener('click', startCountdown);
    ui.cdStop.addEventListener('click', stopCountdown);

    renderCalendar();
    ui.calPrev.addEventListener('click', () => changeCalMonth(-1));
    ui.calNext.addEventListener('click', () => changeCalMonth(+1));
    ui.calPicker.addEventListener('change', () => {
        const [y, m] = ui.calPicker.value.split('-').map(Number);
        state.calYear = y;
        state.calMonth = m - 1;
        renderCalendar();
    });

    ui.bdayCalc.addEventListener('click', calcBirthday);
}

document.addEventListener('DOMContentLoaded', init);