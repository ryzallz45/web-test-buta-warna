const canvas = document.getElementById('plate-canvas');
const ctx = canvas.getContext('2d');

const D = 400;

function hsl(h, s, l) {
    return `hsl(${h}, ${s}%, ${l}%)`;
}

function rand(a, b) {
    return a + Math.random() * (b - a);
}

function randInt(a, b) {
    return Math.floor(rand(a, b + 1));
}

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

const typeLabel = {
    control: 'Kontrol',
    'red-green': 'Merah-Hijau',
    protan: 'Protan',
    deutan: 'Deutan',
    tritan: 'Tritan',
};

const allPlates = [
    // --- Kontrol (4) ---
    { number: 12, type: 'control', bgH: [80, 150], bgS: [10, 25], bgL: [35, 60], numH: [0, 25], numS: [75, 100], numL: [40, 55] },
    { number: 10, type: 'control', bgH: [20, 50], bgS: [10, 25], bgL: [30, 55], numH: [200, 230], numS: [85, 100], numL: [40, 60] },
    { number: 7, type: 'control', bgH: [200, 260], bgS: [10, 20], bgL: [40, 65], numH: [120, 150], numS: [70, 100], numL: [35, 55] },
    { number: 5, type: 'control', bgH: [30, 60], bgS: [5, 18], bgL: [40, 65], numH: [280, 310], numS: [70, 100], numL: [40, 55] },

    // --- Merah-Hijau (9) ---
    { number: 6, type: 'red-green', bgH: [60, 140], bgS: [40, 75], bgL: [30, 55], numH: [0, 30], numS: [65, 100], numL: [35, 55] },
    { number: 8, type: 'red-green', bgH: [350, 30], bgS: [40, 75], bgL: [30, 50], numH: [70, 140], numS: [55, 90], numL: [35, 55] },
    { number: 5, type: 'red-green', bgH: [40, 80], bgS: [30, 65], bgL: [25, 50], numH: [330, 15], numS: [65, 100], numL: [40, 60] },
    { number: 3, type: 'red-green', bgH: [100, 160], bgS: [40, 70], bgL: [30, 55], numH: [5, 40], numS: [70, 100], numL: [35, 55] },
    { number: 2, type: 'red-green', bgH: [80, 150], bgS: [40, 65], bgL: [45, 65], numH: [340, 20], numS: [50, 80], numL: [40, 60] },
    { number: 9, type: 'red-green', bgH: [0, 30], bgS: [40, 70], bgL: [30, 50], numH: [80, 150], numS: [50, 85], numL: [35, 55] },
    { number: 4, type: 'red-green', bgH: [50, 90], bgS: [30, 60], bgL: [25, 45], numH: [340, 20], numS: [60, 95], numL: [35, 55] },
    { number: 1, type: 'red-green', bgH: [90, 160], bgS: [35, 70], bgL: [30, 55], numH: [355, 25], numS: [65, 100], numL: [35, 55] },
    { number: 11, type: 'red-green', bgH: [60, 110], bgS: [25, 55], bgL: [25, 50], numH: [0, 30], numS: [50, 85], numL: [30, 50] },

    // --- Protan-spesifik (4) --- bg dan num punya luminansi mirip, saturasi rendah
    { number: 7, type: 'protan', bgH: [60, 120], bgS: [18, 40], bgL: [25, 40], numH: [355, 25], numS: [18, 40], numL: [25, 40] },
    { number: 3, type: 'protan', bgH: [40, 80], bgS: [18, 38], bgL: [22, 36], numH: [350, 20], numS: [18, 38], numL: [22, 36] },
    { number: 8, type: 'protan', bgH: [80, 130], bgS: [15, 35], bgL: [25, 38], numH: [0, 20], numS: [15, 35], numL: [25, 38] },
    { number: 6, type: 'protan', bgH: [50, 100], bgS: [18, 38], bgL: [22, 38], numH: [355, 25], numS: [18, 38], numL: [22, 38] },

    // --- Deutan-spesifik (4) --- saturasi medium, lightness mirip
    { number: 2, type: 'deutan', bgH: [80, 150], bgS: [40, 65], bgL: [45, 65], numH: [340, 20], numS: [45, 70], numL: [45, 65] },
    { number: 5, type: 'deutan', bgH: [70, 130], bgS: [40, 60], bgL: [48, 68], numH: [350, 15], numS: [42, 65], numL: [48, 68] },
    { number: 9, type: 'deutan', bgH: [90, 160], bgS: [35, 60], bgL: [42, 62], numH: [0, 25], numS: [42, 65], numL: [42, 62] },
    { number: 4, type: 'deutan', bgH: [100, 170], bgS: [35, 55], bgL: [45, 65], numH: [345, 20], numS: [42, 60], numL: [45, 65] },

    // --- Tritan (3) --- bg biru/ungu, num kuning/hijau atau bg hijau-kebiruan, num merah-ungu
    { number: 9, type: 'tritan', bgH: [220, 300], bgS: [50, 80], bgL: [30, 55], numH: [50, 120], numS: [55, 85], numL: [35, 55] },
    { number: 4, type: 'tritan', bgH: [180, 240], bgS: [40, 70], bgL: [30, 50], numH: [300, 350], numS: [55, 85], numL: [35, 55] },
    { number: 3, type: 'tritan', bgH: [240, 300], bgS: [45, 75], bgL: [35, 55], numH: [50, 90], numS: [60, 90], numL: [35, 55] },
    { number: 6, type: 'tritan', bgH: [190, 250], bgS: [35, 65], bgL: [30, 55], numH: [310, 350], numS: [50, 80], numL: [35, 55] },
];

let lightMode = 'bright';
let testPlates = [];
let currentIndex = 0;
let answers = [];
let isProcessing = false;
let currentRAF = null;
let isRendered = false;

const modeModifiers = {
    bright: { bgL: 0, numL: 0, bgS: 0, numS: 0 },
    dim: { bgL: 8, numL: -6, bgS: 15, numS: 10 },
};

function randomColor(hRange, sRange, lRange) {
    return hsl(
        randInt(hRange[0], hRange[1]),
        randInt(sRange[0], sRange[1]),
        randInt(lRange[0], lRange[1])
    );
}

function generatePalette(hRange, sRange, lRange, count) {
    const colors = [];
    for (let i = 0; i < count; i++) {
        colors.push(randomColor(hRange, sRange, lRange));
    }
    return colors;
}

function createNumberMask(number, size) {
    const offscreen = document.createElement('canvas');
    offscreen.width = size;
    offscreen.height = size;
    const oc = offscreen.getContext('2d');

    oc.fillStyle = 'white';
    oc.fillRect(0, 0, size, size);

    oc.fillStyle = 'black';
    const text = number.toString();
    const fontSize = text.length > 1 ? size * 0.45 : size * 0.55;
    oc.font = `bold ${fontSize}px "Arial", "Helvetica", sans-serif`;
    oc.textAlign = 'center';
    oc.textBaseline = 'middle';
    oc.fillText(text, size / 2, size / 2 + 2);

    return oc.getImageData(0, 0, size, size);
}

function isInMask(mask, x, y) {
    const px = Math.round(x);
    const py = Math.round(y);
    if (px < 0 || px >= mask.width || py < 0 || py >= mask.height) return false;
    return mask.data[(py * mask.width + px) * 4] < 128;
}

function generatePlate(plateConfig, done) {
    if (currentRAF) {
        cancelAnimationFrame(currentRAF);
        currentRAF = null;
    }
    isRendered = false;

    const mod = modeModifiers[lightMode] || modeModifiers.bright;

    function clampL(v) { return Math.max(0, Math.min(100, v)); }
    function clampS(v) { return Math.max(0, Math.min(100, v)); }

    const bgL = [clampL(plateConfig.bgL[0] + mod.bgL), clampL(plateConfig.bgL[1] + mod.bgL)];
    const numL = [clampL(plateConfig.numL[0] + mod.numL), clampL(plateConfig.numL[1] + mod.numL)];
    const bgS = [clampS(plateConfig.bgS[0] + mod.bgS), clampS(plateConfig.bgS[1] + mod.bgS)];
    const numS = [clampS(plateConfig.numS[0] + mod.numS), clampS(plateConfig.numS[1] + mod.numS)];

    const r = rand(5, 9);
    const gap = r * 2.4;
    const pad = 20;
    const mask = createNumberMask(plateConfig.number, D);
    const bgPalette = generatePalette(plateConfig.bgH, bgS, bgL, 80);
    const numPalette = generatePalette(plateConfig.numH, numS, numL, 40);

    ctx.clearRect(0, 0, D, D);
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, D, D);

    const dots = [];
    for (let y = pad; y < D - pad; y += gap) {
        for (let x = pad; x < D - pad; x += gap) {
            const jx = x + rand(-gap * 0.3, gap * 0.3);
            const jy = y + rand(-gap * 0.3, gap * 0.3);
            const dotR = r * rand(0.5, 1.1);
            const inNum = isInMask(mask, jx, jy);
            const palette = inNum ? numPalette : bgPalette;
            dots.push({ x: jx, y: jy, r: dotR, color: palette[randInt(0, palette.length - 1)] });
        }
    }

    ctx.clearRect(0, 0, D, D);

    let i = 0;
    function drawFrame() {
        const batch = Math.min(i + 30, dots.length);
        for (; i < batch; i++) {
            const d = dots[i];
            ctx.beginPath();
            ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
            ctx.fillStyle = d.color;
            ctx.fill();
        }
        if (i >= dots.length) {
            isRendered = true;
            if (done) done();
            return;
        }
        currentRAF = requestAnimationFrame(drawFrame);
    }
    drawFrame();
}

function pickTestPlates(count = 10) {
    const needed = ['control', 'red-green', 'protan', 'deutan', 'tritan'];
    const selected = [];
    const pool = [...allPlates];

    for (const type of needed) {
        const idx = pool.findIndex(p => p.type === type);
        if (idx !== -1) selected.push(pool.splice(idx, 1)[0]);
    }

    shuffle(pool);
    while (selected.length < count && pool.length > 0) {
        selected.push(pool.pop());
    }

    shuffle(selected);
    return selected;
}

function showPlate(index) {
    if (index >= testPlates.length) {
        finishTest();
        return;
    }

    const plate = testPlates[index];
    document.getElementById('plate-counter').textContent = `${index + 1} / ${testPlates.length}`;
    document.getElementById('progress-fill').style.width = `${(index / testPlates.length) * 100}%`;
    document.getElementById('answer-input').value = '';
    document.getElementById('answer-input').focus();
    isProcessing = true;

    generatePlate(plate, () => {
        isProcessing = false;
    });
}

function submitAnswer() {
    if (isProcessing || !isRendered) return;
    const input = document.getElementById('answer-input');
    const val = input.value.trim();
    if (val === '' || isNaN(Number(val))) return;

    isProcessing = true;
    const plate = testPlates[currentIndex];
    const userAnswer = parseInt(val, 10);
    const correct = userAnswer === plate.number;

    answers.push({ plate, userAnswer, correct });
    currentIndex++;
    setTimeout(() => showPlate(currentIndex), 300);
}

function skipAnswer() {
    if (isProcessing || !isRendered) return;
    isProcessing = true;

    const plate = testPlates[currentIndex];
    answers.push({ plate, userAnswer: null, correct: false });

    currentIndex++;
    setTimeout(() => showPlate(currentIndex), 300);
}

function finishTest() {
    document.getElementById('test-screen').classList.remove('active');

    const correctCount = answers.filter(a => a.correct).length;
    const total = answers.length;

    const missedControl = answers.filter(a => !a.correct && a.plate.type === 'control').length;
    const missedRG = answers.filter(a => !a.correct && (a.plate.type === 'red-green' || a.plate.type === 'protan' || a.plate.type === 'deutan')).length;
    const missedProtan = answers.filter(a => !a.correct && a.plate.type === 'protan').length;
    const missedDeutan = answers.filter(a => !a.correct && a.plate.type === 'deutan').length;
    const missedTritan = answers.filter(a => !a.correct && a.plate.type === 'tritan').length;

    let verdict, description;
    if (missedControl >= 2) {
        verdict = 'Hasil Tidak Meyakinkan';
        description = 'Anda salah menjawab beberapa plat kontrol yang seharusnya terlihat oleh semua orang. Silakan coba lagi dengan pencahayaan yang cukup.';
    } else if (correctCount >= total - 1) {
        verdict = 'Penglihatan Warna Normal';
        description = 'Hasil tes menunjukkan Anda tidak mengalami gangguan buta warna.';
    } else if (missedRG >= 4 && missedTritan >= 2) {
        verdict = 'Kemungkinan Buta Warna Total (Monokromasi)';
        description = 'Anda kesulitan melihat angka pada plat merah-hijau maupun biru-kuning. Silakan konsultasi dengan dokter mata.';
    } else if (missedRG >= 4) {
        if (missedProtan >= 3 && missedDeutan < 2) {
            verdict = 'Kemungkinan Buta Warna Merah (Protanopia)';
            description = 'Anda kesulitan membedakan warna merah. Silakan konsultasi dengan dokter mata untuk diagnosis lebih lanjut.';
        } else if (missedDeutan >= 3 && missedProtan < 2) {
            verdict = 'Kemungkinan Buta Warna Hijau (Deuteranopia)';
            description = 'Anda kesulitan membedakan warna hijau. Silakan konsultasi dengan dokter mata untuk diagnosis lebih lanjut.';
        } else {
            verdict = 'Kemungkinan Buta Warna Merah-Hijau (Protanopia/Deuteranopia)';
            description = 'Anda mengalami kesulitan membedakan warna merah dan hijau. Silakan konsultasi dengan dokter mata.';
        }
    } else if (missedTritan >= 2) {
        verdict = 'Kemungkinan Buta Warna Biru-Kuning (Tritanopia)';
        description = 'Anda mengalami kesulitan membedakan warna biru dan kuning. Silakan konsultasi dengan dokter mata.';
    } else {
        verdict = 'Penglihatan Warna Normal (Ringan)';
        description = 'Hasil tes menunjukkan kemungkinan penglihatan warna normal, meskipun ada beberapa jawaban kurang tepat.';
    }

    document.getElementById('result-summary').innerHTML = `
        <div class="score">${correctCount} / ${total}</div>
        <div class="verdict">${verdict}</div>
        <div class="desc">${description}</div>
    `;

    let html = `<table>
        <tr><th>#</th><th>Tipe</th><th>Angka</th><th>Jawaban</th><th>Status</th></tr>`;
    answers.forEach((a, i) => {
        const status = a.correct
            ? '<span class="correct">&#10003; Benar</span>'
            : '<span class="wrong">&#10007; Salah</span>';
        const answerText = a.userAnswer !== null ? a.userAnswer : 'Tidak Ada';
        html += `<tr>
            <td>${i + 1}</td>
            <td>${typeLabel[a.plate.type] || ''}</td>
            <td>${a.plate.number}</td>
            <td>${answerText}</td>
            <td>${status}</td>
        </tr>`;
    });
    html += '</table>';
    document.getElementById('result-details').innerHTML = html;

    saveHistory({ correctCount, total, verdict, details: answers.map(a => ({
        type: a.plate.type, number: a.plate.number, userAnswer: a.userAnswer, correct: a.correct
    })) });
    renderHistory();
    document.getElementById('result-screen').classList.add('active');
}

function getHistory() {
    try {
        return JSON.parse(localStorage.getItem('ishihara_history')) || [];
    } catch { return []; }
}

function saveHistory(result) {
    const history = getHistory();
    const entry = {
        id: Date.now(),
        date: new Date().toLocaleString('id-ID'),
        score: `${result.correctCount}/${result.total}`,
        correctCount: result.correctCount,
        total: result.total,
        verdict: result.verdict,
        lightMode: lightMode,
        details: result.details,
    };
    history.unshift(entry);
    if (history.length > 20) history.length = 20;
    localStorage.setItem('ishihara_history', JSON.stringify(history));
}

function clearHistory() {
    localStorage.removeItem('ishihara_history');
    renderHistory();
}

function renderHistory() {
    const list = document.getElementById('history-list');
    const history = getHistory();

    if (history.length === 0) {
        list.innerHTML = '<div class="empty-history">Belum ada riwayat tes.</div>';
        return;
    }

    let html = '';
    history.forEach((h, idx) => {
        html += `
        <div class="history-item" data-idx="${idx}">
            <div class="history-item-header">
                <span class="history-date">${h.date}</span>
                <span class="history-score">${h.score}</span>
                <span class="history-verdict">${h.verdict}</span>
            </div>
            <div class="history-details" id="hd-${idx}">
                <table>
                    <tr><th>#</th><th>Tipe</th><th>Angka</th><th>Jawaban</th><th>Status</th></tr>
                    ${h.details.map((d, i) => {
                        const s = d.correct ? '<span class="correct">&#10003;</span>' : '<span class="wrong">&#10007;</span>';
                        const a = d.userAnswer !== null ? d.userAnswer : 'Tidak Ada';
                        return `<tr><td>${i+1}</td><td>${typeLabel[d.type]||''}</td><td>${d.number}</td><td>${a}</td><td>${s}</td></tr>`;
                    }).join('')}
                </table>
            </div>
        </div>`;
    });
    list.innerHTML = html;

    list.querySelectorAll('.history-item').forEach(el => {
        el.addEventListener('click', () => {
            const details = el.querySelector('.history-details');
            details.classList.toggle('open');
        });
    });
}

// Event Handlers
document.getElementById('start-btn').addEventListener('click', () => {
    document.getElementById('start-screen').classList.remove('active');
    document.getElementById('test-screen').classList.add('active');
    testPlates = pickTestPlates(10);
    currentIndex = 0;
    answers = [];
    showPlate(0);
});

document.getElementById('restart-btn').addEventListener('click', () => {
    document.getElementById('result-screen').classList.remove('active');
    document.getElementById('start-screen').classList.add('active');
    testPlates = [];
    currentIndex = 0;
    answers = [];
});

document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        lightMode = btn.dataset.mode;
    });
});

document.getElementById('submit-btn').addEventListener('click', submitAnswer);
document.getElementById('skip-btn').addEventListener('click', skipAnswer);
document.getElementById('answer-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') submitAnswer();
});

document.getElementById('clear-history-btn').addEventListener('click', clearHistory);
