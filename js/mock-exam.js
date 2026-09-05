// ============================================
// Mock Exam Engine — Timer, Navigation, Auto-Submit
// ============================================

const QUESTION_BANK = {
  math: [
    {q:"Simplify: 5x − 3(x − 4)", o:["2x − 4","2x + 12","2x − 12","8x + 12"], a:1, sol:"Expand: 5x − 3x + 12 = 2x + 12"},
    {q:"Solve: x² − 9x + 20 = 0", o:["x = 4 or 5","x = −4 or −5","x = 2 or 10","x = 1 or 20"], a:0, sol:"Factor: (x−4)(x−5)=0, so x=4 or 5"},
    {q:"Simplify: (2³)² × 2⁻⁴", o:["2","4","8","16"], a:1, sol:"(2³)² = 2⁶; 2⁶ × 2⁻⁴ = 2² = 4"},
    {q:"If log₃ x = 4, find x.", o:["12","27","81","243"], a:2, sol:"x = 3⁴ = 81"},
    {q:"Each interior angle of regular hexagon = ?", o:["90°","108°","120°","135°"], a:2, sol:"Sum = (6−2)×180=720; each = 720/6 = 120°"},
    {q:"Evaluate: sin 30° + cos 60°", o:["0","1/2","1","√3"], a:2, sol:"sin 30° = 1/2, cos 60° = 1/2, sum = 1"},
    {q:"Median of: 12, 15, 8, 20, 10, 18, 9", o:["10","12","13","15"], a:1, sol:"Sorted: 8,9,10,12,15,18,20; middle=12"},
    {q:"Volume of cube of side 5 cm", o:["25","75","125","150"], a:2, sol:"V = 5³ = 125"},
    {q:"P(even number on fair die)", o:["1/6","1/3","1/2","2/3"], a:2, sol:"3 even out of 6 = 1/2"},
    {q:"Make r subject: V = (4/3)πr³", o:["3V/4π","∛(V/π)","∛(3V/4π)","(3V/4π)²"], a:2, sol:"r³ = 3V/4π → r = ∛(3V/4π)"},
    {q:"10th term of AP: 3,7,11,15,...", o:["35","39","43","47"], a:1, sol:"a=3,d=4; T₁₀ = 3+9(4) = 39"},
    {q:"Sum of first 8 terms GP: 2,6,18,...", o:["4374","6560","13120","19682"], a:1, sol:"a=2,r=3; S₈ = 2(3⁸−1)/(3−1) = 6560"},
    {q:"Convert 1101₂ to base 10", o:["11","12","13","14"], a:2, sol:"8+4+0+1 = 13"},
    {q:"A={1,2,3,4}, B={3,4,5,6}; A∩B = ?", o:["{1,2}","{3,4}","{5,6}","{1,2,5,6}"], a:1, sol:"Common elements = {3,4}"},
    {q:"y∝x; y=12 when x=4. Find y when x=7.", o:["14","21","24","28"], a:1, sol:"k=3; y=3(7)=21"},
    {q:"d/dx(4x³ − 6x² + 5x − 2) = ?", o:["12x²−12x+5","4x²−6x+5","12x³−12x²+5","x²−x+5"], a:0, sol:"Power rule: 12x²−12x+5"},
    {q:"∫(3x² + 2x) dx = ?", o:["6x+2+C","x³+x²+C","x²+x+C","3x³+2x²+C"], a:1, sol:"x³+x²+C"},
    {q:"Area of triangle base 12, height 8", o:["20","40","48","96"], a:2, sol:"½×12×8 = 48"},
    {q:"Circumference of circle r=14, π=22/7", o:["44","88","154","616"], a:1, sol:"2πr = 2×22/7×14 = 88"},
    {q:"Simplify: √50 + √18", o:["4√2","6√2","8√2","9√2"], a:2, sol:"5√2 + 3√2 = 8√2"},
    {q:"Solve: 2(x+3) = 5x − 6", o:["2","3","4","5"], a:2, sol:"2x+6=5x−6; 12=3x; x=4"},
    {q:"From 30m, angle of elevation 45°. Tree height?", o:["15m","20m","30m","60m"], a:2, sol:"tan 45°=1; h=30m"},
    {q:"Solve: 3x − 5 ≥ 7", o:["x ≤ 4","x ≥ 4","x > 4","x < 4"], a:1, sol:"3x≥12; x≥4"},
    {q:"Mode of: 4,5,5,6,7,5,8,9,5", o:["4","5","6","7"], a:1, sol:"5 appears 4 times"},
    {q:"Express 0.45 as %", o:["4.5%","45%","0.45%","450%"], a:1, sol:"0.45 × 100 = 45%"},
    {q:"Share ₦240 in ratio 3:5. Smaller share?", o:["₦90","₦120","₦150","₦180"], a:0, sol:"3/8 × 240 = 90"},
    {q:"Solve: 2x²+3x−5=0", o:["1, −5/2","−1, 5/2","2, −5","5, −2"], a:0, sol:"Discriminant=49; x=1 or −5/2"},
    {q:"f(x)=2x²−3; find f(4)", o:["13","19","29","32"], a:2, sol:"2(16)−3 = 29"},
    {q:"Sum=30, diff=6. Larger number?", o:["12","15","18","24"], a:2, sol:"x+y=30, x−y=6; x=18"},
    {q:"Angles in triangle ratio 2:3:5. Largest?", o:["36°","54°","90°","108°"], a:2, sol:"5/10 × 180 = 90°"}
  ],
  physics: [
    {q:"SI unit of electric current", o:["Volt","Ampere","Ohm","Coulomb"], a:1, sol:"Ampere is SI unit of current"},
    {q:"Car: 100m in 5s from rest. Acceleration?", o:["2","4","8","20"], a:2, sol:"s=½at²; 100=12.5a; a=8 m/s²"},
    {q:"60W bulb for 2 hr. Energy in J?", o:["120","7200","216000","432000"], a:3, sol:"E=Pt = 60×7200 = 432000 J"},
    {q:"Wave: λ=0.5m, f=200Hz. Speed?", o:["50","100","200","400"], a:1, sol:"v=fλ=200×0.5=100 m/s"},
    {q:"4Ω + 6Ω series, 20V. Current?", o:["1","2","5","10"], a:1, sol:"R=10; I=V/R=2A"},
    {q:"Heat engine: 800J in, 600J out. η = ?", o:["15%","20%","25%","75%"], a:2, sol:"W=200; η=200/800=25%"},
    {q:"F = ma; 5kg, a=4. F = ?", o:["9N","20N","1.25N","0.8N"], a:1, sol:"F=5×4=20N"},
    {q:"KE of 2kg at 6m/s", o:["6J","18J","36J","72J"], a:2, sol:"½mv²=½(2)(36)=36J"},
    {q:"PE of 5kg at 10m (g=10)", o:["50J","100J","250J","500J"], a:3, sol:"mgh=5×10×10=500J"},
    {q:"Frequency of wave with period 0.02s", o:["20Hz","50Hz","100Hz","200Hz"], a:1, sol:"f=1/T=1/0.02=50Hz"}
  ],
  chemistry: [
    {q:"Noble gas?", o:["Oxygen","Chlorine","Argon","Sodium"], a:2, sol:"Argon is in Group 0"},
    {q:"Mass of 0.25 mol CaCO₃ (M=100)", o:["10g","20g","25g","100g"], a:2, sol:"0.25 × 100 = 25g"},
    {q:"Volume of 0.2M HCl to neutralize 25cm³ of 0.1M NaOH", o:["12.5","25","50","100"], a:0, sol:"n(NaOH)=0.0025; V(HCl)=0.0025/0.2=12.5cm³"},
    {q:"pH if [H⁺]=10⁻⁴", o:["2","3","4","10"], a:2, sol:"pH=−log(10⁻⁴)=4"},
    {q:"IUPAC name CH₃CH₂CH₂OH", o:["Methanol","Ethanol","Propan-1-ol","Butanol"], a:2, sol:"3 carbons + OH = propan-1-ol"},
    {q:"NOT a metallic property", o:["Conductor","Malleable","Brittle","Lustrous"], a:2, sol:"Brittleness is non-metallic"},
    {q:"Number of moles in 80g NaOH (M=40)", o:["0.5","1","2","4"], a:2, sol:"80/40 = 2 mol"},
    {q:"Atomic number of Na", o:["10","11","12","23"], a:1, sol:"Na has 11 protons"},
    {q:"Electron configuration of Mg(12)", o:["2,8,1","2,8,2","2,8,3","2,8,8"], a:1, sol:"Mg: 2,8,2"},
    {q:"Balanced: H₂ + O₂ → H₂O", o:["1:1:1","2:1:2","1:2:2","2:2:1"], a:1, sol:"2H₂ + O₂ → 2H₂O"}
  ],
  english: [
    {q:"Synonym of 'candid'", o:["Rude","Honest","Polite","Lengthy"], a:1, sol:"Candid means truthful/honest"},
    {q:"'The boy ___ before father came back'", o:["finishes","finished","had finished","has finished"], a:2, sol:"Past perfect for earlier past action"},
    {q:"'Wind whispered through trees' = ?", o:["Simile","Metaphor","Personification","Hyperbole"], a:2, sol:"Human action attributed to wind"},
    {q:"Same vowel as 'cup'", o:["Cool","Cope","Cut","Caught"], a:2, sol:"Both 'cup' and 'cut' have /ʌ/"},
    {q:"Antonym of 'commendable'", o:["Praiseworthy","Reprehensible","Acceptable","Respectable"], a:1, sol:"Opposite of praiseworthy"}
  ]
};

let examState = {
  questions: [],
  currentIndex: 0,
  answers: {},
  flagged: new Set(),
  totalTime: 0,
  remainingTime: 0,
  timerInterval: null,
  startTime: null
};

function startExam() {
  const subject = document.getElementById('examSubject').value;
  const length = parseInt(document.getElementById('examLength').value);
  const timePerQ = parseInt(document.getElementById('examTimePerQ').value);

  // Build question pool
  let pool;
  if (subject === 'mixed') {
    pool = [...QUESTION_BANK.math, ...QUESTION_BANK.physics, ...QUESTION_BANK.chemistry, ...QUESTION_BANK.english];
  } else {
    pool = QUESTION_BANK[subject] || QUESTION_BANK.math;
  }

  // Shuffle and pick
  pool = pool.sort(() => Math.random() - 0.5);
  examState.questions = pool.slice(0, Math.min(length, pool.length));
  examState.totalTime = examState.questions.length * timePerQ;
  examState.remainingTime = examState.totalTime;
  examState.startTime = Date.now();
  examState.currentIndex = 0;
  examState.answers = {};
  examState.flagged = new Set();

  document.getElementById('setupScreen').style.display = 'none';
  document.getElementById('examScreen').style.display = 'block';
  document.getElementById('totalQNum').textContent = examState.questions.length;

  buildQuestionNav();
  showQuestion(0);
  startTimer();
}

function startTimer() {
  updateClock();
  examState.timerInterval = setInterval(() => {
    examState.remainingTime--;
    updateClock();
    if (examState.remainingTime <= 0) {
      autoSubmit();
    }
  }, 1000);
}

function updateClock() {
  const m = Math.floor(examState.remainingTime / 60);
  const s = examState.remainingTime % 60;
  document.getElementById('clockDisplay').textContent =
    `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;

  const display = document.getElementById('timerDisplay');
  display.classList.remove('normal','warning');
  if (examState.remainingTime <= 60) {
    display.classList.add('warning');
  } else if (examState.remainingTime <= 300) {
    display.classList.add('warning');
  } else {
    display.classList.add('normal');
  }
}

function buildQuestionNav() {
  const nav = document.getElementById('questionNav');
  nav.innerHTML = '';
  examState.questions.forEach((_, i) => {
    const btn = document.createElement('button');
    btn.className = 'qnav-btn';
    btn.textContent = i + 1;
    btn.onclick = () => showQuestion(i);
    btn.id = `qnav-${i}`;
    nav.appendChild(btn);
  });
}

function updateNav() {
  examState.questions.forEach((_, i) => {
    const btn = document.getElementById(`qnav-${i}`);
    if (!btn) return;
    btn.className = 'qnav-btn';
    if (i === examState.currentIndex) btn.classList.add('current');
    else if (examState.answers[i] !== undefined) btn.classList.add('answered');
    if (examState.flagged.has(i)) btn.classList.add('flagged');
  });
  document.getElementById('answeredCount').textContent = Object.keys(examState.answers).length;
  document.getElementById('currentQNum').textContent = examState.currentIndex + 1;
  const flagBtn = document.getElementById('flagBtn');
  flagBtn.classList.toggle('flagged', examState.flagged.has(examState.currentIndex));
}

function showQuestion(idx) {
  examState.currentIndex = idx;
  const q = examState.questions[idx];
  const area = document.getElementById('questionArea');
  area.innerHTML = `
    <div class="mock-question">
      <h3>Question ${idx + 1}: ${q.q}</h3>
      <ul class="options">
        ${q.o.map((opt, i) => `
          <li class="${examState.answers[idx] === i ? 'selected' : ''}" onclick="selectAnswer(${i})">
            ${String.fromCharCode(65 + i)}. ${opt}
          </li>
        `).join('')}
      </ul>
    </div>
  `;
  updateNav();
}

function selectAnswer(optIdx) {
  examState.answers[examState.currentIndex] = optIdx;
  showQuestion(examState.currentIndex);
}

function nextQuestion() {
  if (examState.currentIndex < examState.questions.length - 1) {
    showQuestion(examState.currentIndex + 1);
  }
}

function prevQuestion() {
  if (examState.currentIndex > 0) {
    showQuestion(examState.currentIndex - 1);
  }
}

function toggleFlag() {
  if (examState.flagged.has(examState.currentIndex)) {
    examState.flagged.delete(examState.currentIndex);
  } else {
    examState.flagged.add(examState.currentIndex);
  }
  updateNav();
}

function confirmSubmit() {
  const unanswered = examState.questions.length - Object.keys(examState.answers).length;
  let msg = 'Submit your exam now?';
  if (unanswered > 0) msg += `\n\n⚠️ You have ${unanswered} unanswered question(s).`;
  if (confirm(msg)) submitExam();
}

function autoSubmit() {
  alert('⏰ Time is up! Your exam will be submitted automatically.');
  submitExam();
}

function submitExam() {
  clearInterval(examState.timerInterval);
  let correct = 0, incorrect = 0, skipped = 0;

  examState.questions.forEach((q, i) => {
    if (examState.answers[i] === undefined) skipped++;
    else if (examState.answers[i] === q.a) correct++;
    else incorrect++;
  });

  const total = examState.questions.length;
  const percent = Math.round((correct / total) * 100);
  const timeUsed = examState.totalTime - examState.remainingTime;
  const m = Math.floor(timeUsed / 60), s = timeUsed % 60;

  document.getElementById('examScreen').style.display = 'none';
  document.getElementById('resultsScreen').style.display = 'block';
  document.getElementById('finalScore').textContent = percent + '%';
  document.getElementById('correctCount').textContent = correct;
  document.getElementById('incorrectCount').textContent = incorrect;
  document.getElementById('skippedCount').textContent = skipped;
  document.getElementById('timeUsed').textContent = `${m}:${String(s).padStart(2,'0')}`;

  const circle = document.getElementById('scoreCircle');
  const color = percent >= 70 ? '#16a34a' : percent >= 50 ? '#f59e0b' : '#dc2626';
  circle.style.background = `conic-gradient(${color} ${percent * 3.6}deg, #e5e7eb 0deg)`;

  const msg = percent >= 90 ? '🏆 Outstanding! You aced it!' :
              percent >= 70 ? '👏 Great job! You passed with distinction.' :
              percent >= 50 ? '✅ You passed. Keep practicing.' :
              '📚 Keep studying — review your weak areas and try again!';
  document.getElementById('resultMessage').textContent = msg;

  // Save attempt to localStorage
  const attempts = JSON.parse(localStorage.getItem('examAttempts') || '[]');
  attempts.push({ date: new Date().toISOString(), subject: document.getElementById('examSubject').value, score: percent, total, correct });
  localStorage.setItem('examAttempts', JSON.stringify(attempts));
}

function reviewAnswers() {
  const review = document.getElementById('reviewArea');
  review.style.display = 'block';
  review.innerHTML = '<h2 style="margin:30px 0 20px;">📝 Detailed Review</h2>' +
    examState.questions.map((q, i) => {
      const userAns = examState.answers[i];
      const correct = q.a;
      const isCorrect = userAns === correct;
      const isSkipped = userAns === undefined;
      const status = isSkipped ? '⏭️ Skipped' : isCorrect ? '✅ Correct' : '❌ Incorrect';
      const color = isSkipped ? '#6b7280' : isCorrect ? '#16a34a' : '#dc2626';
      return `
        <div class="mock-question" style="border-left-color:${color};">
          <div style="display:flex;justify-content:space-between;margin-bottom:10px;">
            <strong>Question ${i + 1}</strong>
            <span style="color:${color};font-weight:600;">${status}</span>
          </div>
          <h3>${q.q}</h3>
          <div style="background:#f9fafb;padding:12px;border-radius:8px;margin:10px 0;">
            ${q.o.map((opt, j) => {
              let style = '';
              if (j === correct) style = 'background:#dcfce7;font-weight:600;';
              if (j === userAns && j !== correct) style = 'background:#fee2e2;font-weight:600;';
              return `<div style="padding:8px;${style}border-radius:6px;margin:4px 0;">${String.fromCharCode(65+j)}. ${opt} ${j===correct?' ✓':''}</div>`;
            }).join('')}
          </div>
          <div style="background:#eef4ff;padding:12px;border-radius:8px;border-left:3px solid #0b5ed7;">
            <strong>💡 Solution:</strong> ${q.sol}
          </div>
        </div>
      `;
    }).join('');
  review.scrollIntoView({ behavior: 'smooth' });
}
