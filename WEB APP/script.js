// ==========================
// Quiz Data
// ==========================
const quizData = {
    javascript: [
        {
            question: "What does '===' mean in JavaScript?",
            options: ["Equal value", "Equal value and type", "Assignment", "Not equal"],
            answer: 1,
            difficulty: "easy"
        },
        {
            question: "Which method converts JSON to object?",
            options: ["JSON.parse()", "JSON.stringify()", "JSON.convert()", "JSON.toObject()"],
            answer: 0,
            difficulty: "medium"
        }
    ],
    html: [
        {
            question: "What does HTML stand for?",
            options: ["Hyper Trainer Marking Language", "Hyper Text Markup Language", "Hyper Text Marketing Language", "Hyper Tool Multi Language"],
            answer: 1,
            difficulty: "easy"
        },
        {
            question: "Which CSS property controls text size?",
            options: ["font-style", "text-size", "font-size", "text-style"],
            answer: 2,
            difficulty: "easy"
        }
    ],
    react: [
        {
            question: "What is React?",
            options: ["Framework", "Library", "Language", "Database"],
            answer: 1,
            difficulty: "easy"
        },
        {
            question: "What hook is used for state?",
            options: ["useEffect", "useState", "useRef", "useMemo"],
            answer: 1,
            difficulty: "easy"
        }
    ]
};

// ==========================
// Variables
// ==========================
let currentCategory = [];
let currentQuestionIndex = 0;
let score = 0;
let correctAnswers = 0;
let streak = 0;
let bestStreak = 0;
let userAnswers = [];

// ==========================
// Elements
// ==========================
const homeScreen = document.getElementById("homeScreen");
const quizScreen = document.getElementById("quizScreen");
const resultsScreen = document.getElementById("resultsScreen");

const questionText = document.getElementById("questionText");
const optionsContainer = document.getElementById("optionsContainer");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const difficultyIndicator = document.getElementById("difficultyIndicator");

const totalScoreEl = document.getElementById("totalScore");
const accuracyEl = document.getElementById("accuracy");
const streakEl = document.getElementById("streak");

// Sounds
const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");

// ==========================
// Start Quiz
// ==========================
document.querySelectorAll(".category-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const category = btn.dataset.category;
        startQuiz(category);
    });
});

function startQuiz(category) {
    currentCategory = quizData[category];
    currentQuestionIndex = 0;
    score = 0;
    correctAnswers = 0;
    streak = 0;
    bestStreak = 0;
    userAnswers = [];

    homeScreen.classList.remove("active");
    quizScreen.classList.add("active");

    loadQuestion();
}

// ==========================
// Load Question
// ==========================
function loadQuestion() {
    const currentQ = currentCategory[currentQuestionIndex];

    questionText.textContent = currentQ.question;
    optionsContainer.innerHTML = "";

    currentQ.options.forEach((option, index) => {
        const btn = document.createElement("button");
        btn.classList.add("option-btn");
        btn.textContent = option;

        btn.addEventListener("click", () => selectAnswer(index));
        optionsContainer.appendChild(btn);
    });

    // Difficulty
    difficultyIndicator.innerHTML = `<span class="difficulty ${currentQ.difficulty}">${currentQ.difficulty}</span>`;

    updateProgress();
}

// ==========================
// Select Answer
// ==========================
function selectAnswer(selectedIndex) {
    if (userAnswers[currentQuestionIndex] !== undefined) return;

    const correctIndex = currentCategory[currentQuestionIndex].answer;
    userAnswers[currentQuestionIndex] = selectedIndex;

    const buttons = document.querySelectorAll(".option-btn");

    buttons.forEach((btn, index) => {
        btn.disabled = true;

        if (index === correctIndex) {
            btn.classList.add("correct");
        }

        if (index === selectedIndex && index !== correctIndex) {
            btn.classList.add("wrong");
        }
    });

    if (selectedIndex === correctIndex) {
        score += 10;
        correctAnswers++;
        streak++;
        bestStreak = Math.max(bestStreak, streak);
        correctSound.play();
    } else {
        streak = 0;
        wrongSound.play();
    }

    updateStats();
}

// ==========================
// Navigation
// ==========================
document.getElementById("nextBtn").addEventListener("click", () => {
    if (currentQuestionIndex < currentCategory.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
    } else {
        showResults();
    }
});

document.getElementById("prevBtn").addEventListener("click", () => {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadQuestion();
    }
});

// ==========================
// Progress + Stats
// ==========================
function updateProgress() {
    const progress = ((currentQuestionIndex + 1) / currentCategory.length) * 100;
    progressFill.style.width = progress + "%";
    progressText.textContent = `Question ${currentQuestionIndex + 1}/${currentCategory.length}`;
}

function updateStats() {
    totalScoreEl.textContent = score;
    const accuracy = Math.round((correctAnswers / (currentQuestionIndex + 1)) * 100);
    accuracyEl.textContent = accuracy + "%";
    streakEl.textContent = streak;
}

// ==========================
// Results
// ==========================
function showResults() {
    quizScreen.classList.remove("active");
    resultsScreen.classList.add("active");

    const finalScore = Math.round((correctAnswers / currentCategory.length) * 100);

    document.getElementById("finalScore").textContent = finalScore + "%";
    document.getElementById("resultsCorrect").textContent = correctAnswers;
    document.getElementById("resultsTotal").textContent = currentCategory.length;
    document.getElementById("resultsStreak").textContent = bestStreak;

    document.getElementById("resultsTitle").textContent =
        finalScore > 80 ? "Excellent!" :
        finalScore > 50 ? "Good Job!" : "Keep Practicing!";
}

// ==========================
// Restart
// ==========================
document.getElementById("restartBtn").addEventListener("click", () => {
    resultsScreen.classList.remove("active");
    homeScreen.classList.add("active");
});

// ==========================
// Practice Mode
// ==========================
document.getElementById("practiceMode").addEventListener("click", () => {
    startQuiz("javascript");
});
