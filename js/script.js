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

const plates = [
    {
        id: 1,
        number: 12,
        label: 'Kontrol',
        bgH: [80, 150],
        bgS: [10, 25],
        bgL: [35, 60],
        numH: [0, 25],
        numS: [75, 100],
        numL: [40, 55],
    },
    {
        id: 2,
        number: 6,
        label: 'Red-Green',
        bgH: [60, 140],
        bgS: [40, 75],
        bgL: [30, 55],
        numH: [0, 30],
        numS: [65, 100],
        numL: [35, 55],
    },
    {
        id: 3,
        number: 8,
        label: 'Red-Green',
        bgH: [350, 30],
        bgS: [40, 75],
        bgL: [30, 50],
        numH: [70, 140],
        numS: [55, 90],
        numL: [35, 55],
    },
    {
        id: 4,
        number: 5,
        label: 'Red-Green',
        bgH: [40, 80],
        bgS: [30, 65],
        bgL: [25, 50],
        numH: [330, 15],
        numS: [65, 100],
        numL: [40, 60],
    },
    {
        id: 5,
        number: 3,
        label: 'Red-Green',
        bgH: [100, 160],
        bgS: [40, 70],
        bgL: [30, 55],
        numH: [5, 40],
        numS: [70, 100],
        numL: [35, 55],
    },
    {
        id: 6,
        number: 7,
        label: 'Protan',
        bgH: [60, 120],
        bgS: [20, 45],
        bgL: [25, 40],
        numH: [355, 25],
        numS: [20, 45],
        numL: [25, 40],
    },
    {
        id: 7,
        number: 2,
        label: 'Deutan',
        bgH: [80, 150],
        bgS: [40, 65],
        bgL: [45, 65],
        numH: [340, 20],
        numS: [50, 75],
        numL: [45, 65],
    },
    {
        id: 8,
        number: 9,
        label: 'Tritan',
        bgH: [220, 300],
        bgS: [50, 80],
        bgL: [30, 55],
        numH: [50, 120],
        numS: [55, 85],
        numL: [35, 55],
    },
    {
        id: 9,
        number: 4,
        label: 'Tritan',
        bgH: [180, 240],
        bgS: [40, 70],
        bgL: [30, 50],
        numH: [300, 350],
        numS: [55, 85],
        numL: [35, 55],
    },
    {
        id: 10,
        number: 10,
        label: 'Kontrol',
        bgH: [20, 50],
        bgS: [10, 25],
        bgL: [30, 55],
        numH: [200, 230],
        numS: [85, 100],
        numL: [40, 60],
    },
];

let currentIndex = 0;
let answers = [];
let isProcessing = false;

function randomColor(hRange, sRange, lRange) {
    const h = randInt(hRange[0], hRange[1]);
    const s = randInt(sRange[0], sRange[1]);
    const l = randInt(lRange[0], lRange[1]);
    return hsl(h, s, l);
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
    const idx = (py * mask.width + px) * 4;
    return mask.data[idx] < 128;
}

function generatePlate(plateConfig, cb) {
    const r = rand(5, 9);
    const gap = r * 2.4;
    const pad = 20;
    const mask = createNumberMask(plateConfig.number, D);

    const bgPalette = generatePalette(plateConfig.bgH, plateConfig.bgS, plateConfig.bgL, 80);
    const numPalette = generatePalette(plateConfig.numH, plateConfig.numS, plateConfig.numL, 40);

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
            const color = palette[randInt(0, palette.length - 1)];

            dots.push({ x: jx, y: jy, r: dotR, color, inNum });
        }
    }

    ctx.clearRect(0, 0, D, D);

    function drawFrame(i) {
        if (i >= dots.length) {
            if (cb) cb();
            return;
        }
        const d = dots[i];
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = d.color;
        ctx.fill();
        requestAnimationFrame(() => drawFrame(i + 20));
    }

    drawFrame(0);
}

function showPlate(index) {
    if (index >= plates.length) {
        finishTest();
        return;
    }

    const plate = plates[index];
    document.getElementById('plate-counter').textContent = `${index + 1} / ${plates.length}`;
    document.getElementById('progress-fill').style.width = `${((index) / plates.length) * 100}%`;
    document.getElementById('answer-input').value = '';
    document.getElementById('answer-input').focus();
    isProcessing = false;

    generatePlate(plate);
}

function submitAnswer() {
    if (isProcessing) return;
    const input = document.getElementById('answer-input');
    const val = input.value.trim();
    if (val === '') return;

    isProcessing = true;
    const plate = plates[currentIndex];
    const userAnswer = parseInt(val, 10);
    const correct = userAnswer === plate.number;

    answers.push({
        plate: plate,
        userAnswer: userAnswer,
        correct: correct,
    });

    currentIndex++;
    setTimeout(() => showPlate(currentIndex), 300);
}

function skipAnswer() {
    if (isProcessing) return;
    isProcessing = true;

    const plate = plates[currentIndex];
    answers.push({
        plate: plate,
        userAnswer: null,
        correct: false,
    });

    currentIndex++;
    setTimeout(() => showPlate(currentIndex), 300);
}

function finishTest() {
    const screen = document.getElementById('test-screen');
    screen.classList.remove('active');

    const correctCount = answers.filter(a => a.correct).length;
    const total = answers.length;

    let verdict, description;
    const missedRedGreen = answers.filter((a, i) =>
        [1, 2, 3, 4, 5, 6].includes(i) && !a.correct
    ).length;
    const missedTritan = answers.filter((a, i) =>
        [7, 8].includes(i) && !a.correct
    ).length;
    const missedControl = answers.filter((a, i) =>
        [0, 9].includes(i) && !a.correct
    ).length;

    if (missedControl >= 1) {
        verdict = 'Hasil Tidak Meyakinkan';
        description = 'Anda salah menjawab plat kontrol yang seharusnya terlihat oleh semua orang. Silakan coba lagi dengan pencahayaan yang cukup dan jaga jarak pandang yang sesuai.';
    } else if (correctCount >= 9) {
        verdict = 'Penglihatan Warna Normal';
        description = 'Hasil tes menunjukkan Anda tidak mengalami gangguan buta warna. Anda berhasil menjawab hampir semua plat dengan benar.';
    } else if (missedRedGreen >= 3 && missedTritan >= 1) {
        verdict = 'Kemungkinan Buta Warna Total (Monokromasi)';
        description = 'Anda kesulitan melihat angka pada plat merah-hijau maupun biru-kuning. Silakan konsultasi dengan dokter mata untuk pemeriksaan lebih lanjut.';
    } else if (missedRedGreen >= 3) {
        verdict = 'Kemungkinan Buta Warna Merah-Hijau (Protanopia/Deuteranopia)';
        description = 'Anda mengalami kesulitan membedakan plat dengan warna merah dan hijau. Ini adalah jenis buta warna yang paling umum. Silakan konsultasi dengan dokter mata untuk diagnosis lebih lanjut.';
    } else if (missedTritan >= 1) {
        verdict = 'Kemungkinan Buta Warna Biru-Kuning (Tritanopia)';
        description = 'Anda mengalami kesulitan membedakan plat dengan warna biru dan kuning. Jenis ini lebih jarang terjadi. Silakan konsultasi dengan dokter mata untuk diagnosis lebih lanjut.';
    } else {
        verdict = 'Penglihatan Warna Normal';
        description = 'Hasil tes menunjukkan Anda tidak mengalami gangguan buta warna.';
    }

    document.getElementById('result-summary').innerHTML = `
        <div class="score">${correctCount} / ${total}</div>
        <div class="verdict">${verdict}</div>
        <div class="desc">${description}</div>
    `;

    const typeLabels = ['Kontrol', 'Red-Green', 'Red-Green', 'Red-Green', 'Red-Green', 'Protan', 'Deutan', 'Tritan', 'Tritan', 'Kontrol'];
    let detailsHTML = `<table>
        <tr><th>#</th><th>Tipe</th><th>Angka</th><th>Jawaban</th><th>Status</th></tr>`;
    answers.forEach((a, i) => {
        const status = a.correct ? '<span class="correct">✓ Benar</span>' : '<span class="wrong">✗ Salah</span>';
        const answerText = a.userAnswer !== null ? a.userAnswer : 'Tidak Ada';
        const label = typeLabels[i] || '';
        detailsHTML += `<tr>
            <td>${i + 1}</td>
            <td>${label}</td>
            <td>${a.plate.number}</td>
            <td>${answerText}</td>
            <td>${status}</td>
        </tr>`;
    });
    detailsHTML += '</table>';
    document.getElementById('result-details').innerHTML = detailsHTML;

    document.getElementById('result-screen').classList.add('active');
}

// Event Handlers
document.getElementById('start-btn').addEventListener('click', () => {
    document.getElementById('start-screen').classList.remove('active');
    document.getElementById('test-screen').classList.add('active');
    currentIndex = 0;
    answers = [];
    showPlate(0);
});

document.getElementById('restart-btn').addEventListener('click', () => {
    document.getElementById('result-screen').classList.remove('active');
    document.getElementById('start-screen').classList.add('active');
    currentIndex = 0;
    answers = [];
});

document.getElementById('submit-btn').addEventListener('click', submitAnswer);

document.getElementById('skip-btn').addEventListener('click', skipAnswer);

document.getElementById('answer-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submitAnswer();
});
