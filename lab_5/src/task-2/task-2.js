const ui = {
  body: document.body,
  root: document.documentElement,
  red: document.getElementById('bulbRed'),
  yellow: document.getElementById('bulbYellow'),
  green: document.getElementById('bulbGreen'),
  elName: document.getElementById('stateName'),
  elNext: document.getElementById('nextState'),
  elCycle: document.getElementById('cycleCount'),
  elBar: document.getElementById('timerBar'),
  elDigits: document.getElementById('timerDigits'),
  logBody: document.getElementById('logBody'),
  btnStart: document.getElementById('btnStart'),
  btnStop: document.getElementById('btnStop'),
  btnNext: document.getElementById('btnNext'),
  inRed: document.getElementById('durRed'),
  inYellow: document.getElementById('durYellow'),
  inGreen: document.getElementById('durGreen'),
  btnClearLog: document.getElementById('btnClearLog')
};

const state = {
  currentStateIdx: 0,
  running: false,
  mainTimer: null,
  tickInterval: null,
  stateStart: 0,
  stateDuration: 0,
  cycleNum: 0,
  STATES: ['red', 'yellow', 'green', 'blink-yellow'],
  LABELS: {
    'red': 'RED',
    'yellow': 'YELLOW',
    'green': 'GREEN',
    'blink-yellow': 'BLINK YELLOW',
  },
  NEXT_LABELS: {
    'red': 'Yellow',
    'yellow': 'Green',
    'green': 'Blink Yellow',
    'blink-yellow': 'Red',
  },
  COLOR_CLASS: {
    'red': 'red-c',
    'yellow': 'yellow-c',
    'green': 'green-c',
    'blink-yellow': 'yellow-c',
  },
  BAR_CLASS: {
    'red': 'red-b',
    'yellow': 'yellow-b',
    'green': 'green-b',
    'blink-yellow': 'yellow-b',
  },
  LOG_CLASS: { red: 'r', yellow: 'y', green: 'g', 'blink-yellow': 'y' }
};

function init() {
  ui.btnStart.addEventListener('click', start);
  ui.btnStop.addEventListener('click', stop);
  ui.btnNext.addEventListener('click', () => { 
    if (state.running) nextState(); 
  });
  ui.btnClearLog.addEventListener('click', () => { 
    ui.logBody.innerHTML = ''; 
  });

  render();
}

document.addEventListener('DOMContentLoaded', init);

function render() {
  const currentState = state.STATES[state.currentStateIdx];

  [ui.red, ui.yellow, ui.green].forEach(b => {
    if (b) b.classList.remove('on', 'blink');
  });

  if (state.running) {
    if (currentState === 'red') ui.red.classList.add('on');
    if (currentState === 'yellow') ui.yellow.classList.add('on');
    if (currentState === 'green') ui.green.classList.add('on');
    if (currentState === 'blink-yellow') ui.yellow.classList.add('blink');

    const cc = state.COLOR_CLASS[currentState] || '';
    ui.elName.className = `status-value big ${cc}`;
    ui.elName.textContent = state.LABELS[currentState];
    ui.elNext.textContent = state.NEXT_LABELS[currentState];
    ui.elCycle.textContent = state.cycleNum;

    ui.elBar.className = 'timer-bar ' + (state.BAR_CLASS[currentState] || '');
  } else {
    ui.elName.textContent = '—';
    ui.elName.className = 'status-value big';
    ui.elNext.textContent = '—';
    ui.elDigits.textContent = '—';
    ui.elBar.style.width = '0';
    ui.elBar.className = 'timer-bar';
  }

  [ui.inRed, ui.inYellow, ui.inGreen].forEach(input => {
    input.disabled = state.running;
  });
}

function getDurations() {
  return {
    red: Math.max(1, parseInt(ui.inRed.value) || 5) * 1000,
    yellow: Math.max(1, parseInt(ui.inYellow.value) || 3) * 1000,
    green: Math.max(1, parseInt(ui.inGreen.value) || 7) * 1000,
    'blink-yellow': 3000,
  };
}

function addLog(msg, cls = 'w') {
  const now = new Date();
  const time = now.toTimeString().split(' ')[0];
  const entry = document.createElement('div');
  entry.className = 'log-entry';
  entry.innerHTML = `<span class="log-time">${time}</span><span class="log-msg ${cls}">${msg}</span>`;
  ui.logBody.prepend(entry);
}

function updateTimerBar() {
  if (!state.running) return;
  const elapsed = Date.now() - state.stateStart;
  const remaining = Math.max(0, state.stateDuration - elapsed);
  const pct = state.stateDuration > 0 ? (remaining / state.stateDuration) * 100 : 0;

  ui.elBar.style.width = pct + '%';
  const secs = Math.ceil(remaining / 1000);
  ui.elDigits.textContent = secs + 's';
}

function startState(idx) {
  state.currentStateIdx = idx;
  const currentState = state.STATES[idx];
  const durations = getDurations();

  state.stateDuration = durations[currentState];
  state.stateStart = Date.now();

  if (idx === 0) {
    state.cycleNum++;
  }

  render();

  const cls = state.LOG_CLASS[currentState] || 'w';
  addLog(`▶ ${state.LABELS[currentState]} (${state.stateDuration / 1000}s)`, cls);

  clearInterval(state.tickInterval);
  state.tickInterval = setInterval(updateTimerBar, 50);

  clearTimeout(state.mainTimer);
  state.mainTimer = setTimeout(() => {
    if (state.running) nextState();
  }, state.stateDuration);
}

function nextState() {
  clearTimeout(state.mainTimer);
  clearInterval(state.tickInterval);
  if (!state.running) return;

  state.currentStateIdx = (state.currentStateIdx + 1) % state.STATES.length;
  startState(state.currentStateIdx);
}

function start() {
  if (state.running) return;
  state.running = true;
  state.cycleNum = 0;

  ui.btnStart.disabled = true;
  ui.btnStop.disabled = false;
  ui.btnNext.disabled = false;

  addLog('🚦 Started', 'w');
  startState(0);
}

function stop() {
  state.running = false;
  clearTimeout(state.mainTimer);
  clearInterval(state.tickInterval);

  ui.btnStart.disabled = false;
  ui.btnStop.disabled = true;
  ui.btnNext.disabled = true;

  addLog('■ Stopped', 'w');
  render();
}