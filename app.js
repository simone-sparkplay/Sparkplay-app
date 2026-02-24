const state = {
    screen: 'home',
    age: null,
    missionIndex: 0,
    stepIndex: 0,
    dailyCompleted: 0,
    history: JSON.parse(localStorage.getItem('sparkplay_history') || '[]'),
    missions: [
        {
            title: "ESPLORATORE DEL MATTINO",
            steps: [
                { title: "OBIETTIVO", text: "Trova un oggetto rosso in giro per casa." },
                { title: "IL PASSO", text: "Portalo vicino alla finestra per fargli prendere luce." },
                { title: "CONCLUSIONE", text: "Adesso rimettilo al suo posto in silenzio." }
            ]
        },
        {
            title: "PICCOLO CHEF",
            steps: [
                { title: "OBIETTIVO", text: "Aiuta a preparare la tavola." },
                { title: "IL PASSO", text: "Metti le posate al posto giusto con molta cura." },
                { title: "CONCLUSIONE", text: "Fai un inchino come un vero cameriere." }
            ]
        },
        {
            title: "CUSTODE DEI SOGNI",
            steps: [
                { title: "OBIETTIVO", text: "Scegli un peluche o un libro preferito." },
                { title: "IL PASSO", text: "Raccontagli cosa ti ha fatto ridere oggi." },
                { title: "CONCLUSIONE", text: "Dagli un bacio e mettilo a riposare." }
            ]
        }
    ]
};

// --- NAVIGATION ---
function showScreen(id) {
    window.speechSynthesis.cancel();
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(`screen-${id}`).classList.add('active');
    state.screen = id;
}

// --- TTS ---
function speak(text) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'it-IT';
    utterance.rate = 0.8; // Leggermente più lento
    window.speechSynthesis.speak(utterance);
}

// --- GAME LOGIC ---
function startMissions() {
    showScreen('eta');
}

function selectAge(age) {
    state.age = age;
    document.getElementById('val-eta').textContent = age;
    state.missionIndex = state.dailyCompleted % state.missions.length;
    state.stepIndex = 0;
    updateGameScreen();
    showScreen('gioco');
}

function updateGameScreen() {
    const mission = state.missions[state.missionIndex];
    const step = mission.steps[state.stepIndex];
    
    document.getElementById('missione-titolo').textContent = mission.title;
    document.getElementById('passo-titolo').textContent = step.title;
    document.getElementById('passo-testo').textContent = step.text;
    document.getElementById('passi-indicatore').textContent = `${state.stepIndex + 1}/${mission.steps.length}`;
    
    speak(`${step.title}. ${step.text}`);
}

function nextStep() {
    const mission = state.missions[state.missionIndex];
    if (state.stepIndex < mission.steps.length - 1) {
        state.stepIndex++;
        updateGameScreen();
    } else {
        completeMission();
    }
}

function prevStep() {
    if (state.stepIndex > 0) {
        state.stepIndex--;
        updateGameScreen();
    }
}

function completeMission() {
    state.dailyCompleted++;
    document.getElementById('count-oggi').textContent = state.dailyCompleted;
    
    // Save to history
    state.history.push({
        title: state.missions[state.missionIndex].title,
        date: new Date().toLocaleDateString('it-IT')
    });
    localStorage.setItem('sparkplay_history', JSON.stringify(state.history));
    
    showScreen('genitore');
    speak("MISSIONE COMPLETATA. COMPLIMENTI.");
}

function updateDiary() {
    const list = document.getElementById('lista-ricordi');
    list.innerHTML = '';
    state.history.slice().reverse().forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${item.date} - ${item.title}</span><span class="icon-book"></span>`;
        list.appendChild(li);
    });
}

// --- EVENT LISTENERS ---
document.getElementById('btn-inizia').onclick = () => startMissions();
document.getElementById('btn-goto-diario').onclick = () => {
    updateDiary();
    showScreen('diario');
};

document.querySelectorAll('.btn-age').forEach(btn => {
    btn.onclick = () => selectAge(btn.dataset.age);
});

document.querySelectorAll('.btn-back').forEach(btn => {
    btn.onclick = () => showScreen(state.screen === 'diario' ? 'home' : 'home');
});

document.getElementById('btn-esci').onclick = () => showScreen('home');
document.getElementById('btn-next').onclick = () => nextStep();
document.getElementById('btn-prev').onclick = () => prevStep();

document.getElementById('btn-finisci').onclick = () => {
    const input = document.getElementById('gate-input').value;
    if (input == "10") {
        showScreen('home');
        document.getElementById('gate-input').value = '';
    }
};

document.getElementById('btn-altre-3').onclick = () => {
    const input = document.getElementById('gate-input').value;
    if (input == "10") {
        state.missionIndex = (state.missionIndex + 1) % state.missions.length;
        state.stepIndex = 0;
        updateGameScreen();
        showScreen('gioco');
        document.getElementById('gate-input').value = '';
    }
};

document.getElementById('btn-speciale').onclick = () => {
    const input = document.getElementById('gate-input').value;
    if (input == "10") {
        alert("Contenuto speciale sbloccato!"); // Semplificato per l'MVP
        showScreen('home');
        document.getElementById('gate-input').value = '';
    }
};

// Initial state
document.getElementById('count-oggi').textContent = state.dailyCompleted;
