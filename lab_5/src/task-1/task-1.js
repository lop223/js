const ui = {
    body: document.body,
    root: document.documentElement,
    bulb: document.getElementById('bulbWrap'),
    toggleBtn: document.getElementById('toggleBtn'),
    toggleLabel: document.getElementById('toggleLabel'),
    brightnessSlider: document.getElementById('brightnessSlider'),
    brightnessVal: document.getElementById('brightnessVal'),
    typeButtons: document.querySelectorAll('.type-btn'),
    timerBtn: document.getElementById('timerBtn'),
    timerInfo: document.getElementById('timerInfo'),
};

const state = {
    isOn: false,
    type: 'normal',
    brightness: 100,
    timerActive: false,
    timerSeconds: 10,
    lastActivity: Date.now(),
    inactivityInterval: null
};

const typeColors = {
    normal: { color: '#f5f0d8', glow: 'rgba(245,240,216,0.4)', glowStrong: 'rgba(245,240,216,0.12)' },
    yellow: { color: '#ffcc00', glow: 'rgba(255,204,0,0.45)', glowStrong: 'rgba(255,204,0,0.12)' },
    blue: { color: '#4db8ff', glow: 'rgba(77,184,255,0.45)', glowStrong: 'rgba(77,184,255,0.12)' },
    green: { color: '#44ff99', glow: 'rgba(68,255,153,0.45)', glowStrong: 'rgba(68,255,153,0.12)' },
};

function init() {
    ui.bulb.addEventListener('click', toggleBulb);
    ui.toggleBtn.addEventListener('click', toggleBulb);
    ui.brightnessSlider.addEventListener('input', (e) => setBrightness(e.target.value));
    
    ui.typeButtons.forEach(btn => {
        btn.addEventListener('click', () => setType(btn.dataset.type));
    });

    ui.timerBtn.addEventListener('click', toggleTimer);

    ['mousemove', 'keydown', 'click', 'touchstart'].forEach(ev => {
        document.addEventListener(ev, () => {
            state.lastActivity = Date.now();
        }, { passive: true });
    });

    document.addEventListener('keydown', e => {
        if (e.key.toLowerCase() === 'b') {
            const val = prompt('Enter brightness (10-100):');
            if (val !== null && !isNaN(val)) setBrightness(val);
        }
    });

    render();
}

document.addEventListener('DOMContentLoaded', init);

function render() {
    ui.body.classList.toggle('on', state.isOn);
    ui.toggleLabel.textContent = state.isOn ? 'TURN OFF' : 'TURN ON';

    ui.brightnessVal.textContent = `${state.brightness}%`;
    ui.brightnessSlider.value = state.brightness;
    ui.root.style.setProperty('--brightness', state.brightness / 100);

    const c = typeColors[state.type];
    ui.root.style.setProperty('--lamp-color', c.color);
    ui.root.style.setProperty('--lamp-glow', c.glow);
    ui.root.style.setProperty('--lamp-glow-strong', c.glowStrong);

    ui.timerBtn.textContent = state.timerActive ? 'DISABLE TIMER' : 'ENABLE TIMER';
    ui.timerBtn.classList.toggle('active', state.timerActive);
    
    if (!state.timerActive) {
        ui.timerInfo.innerHTML = '<strong>—</strong> &nbsp;timer is inactive';
    }
}

function toggleBulb() {
    state.isOn = !state.isOn;
    render();
}

function setBrightness(val) {
    let num = parseInt(val);
    if (num < 10) num = 10;
    if (num > 100) num = 100;
    state.brightness = num;
    render();
}

function setType(type) {
    state.type = type;
    ui.typeButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.type === type);
    });
    render();
}

function toggleTimer() {
    state.timerActive = !state.timerActive;
    if (state.timerActive) {
        state.lastActivity = Date.now();
        startInactivityWatcher();
    } else {
        clearInterval(state.inactivityInterval);
    }
    render();
}

function startInactivityWatcher() {
    clearInterval(state.inactivityInterval);
    state.inactivityInterval = setInterval(() => {
        if (!state.timerActive) return;

        const elapsed = Math.floor((Date.now() - state.lastActivity) / 1000);
        const remaining = Math.max(0, state.timerSeconds - elapsed);
        
        const mins = Math.floor(remaining / 60);
        const secs = String(remaining % 60).padStart(2, '0');

        ui.timerInfo.innerHTML = `<strong>${mins}:${secs}</strong> &nbsp;until auto-off`;

        if (remaining === 0 && state.isOn) {
            state.isOn = false;
            render();
        }
    }, 1000);
}