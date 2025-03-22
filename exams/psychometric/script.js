document.addEventListener('DOMContentLoaded', () => {
    let currentQuestionIndex = 0;
    let questions = [];
    let userAnswers = [];
    let timeRemaining = 600; // 10 minutes
    let score = 0;
    let progressBar = document.getElementById('progress-bar');

    // Fetch questions from the backend
    async function fetchQuestions() {
        const response = await fetch('https://delicate-queen-800c.cubiodojo.workers.dev/questions');
        questions = await response.json();
        loadQuestion();
        startTimer();
    }

    // Load current question on the screen
    function loadQuestion() {
        const question = questions[currentQuestionIndex];
        document.getElementById('question-text').textContent = question.question;
        const optionsContainer = document.getElementById('options-container');
        optionsContainer.innerHTML = ''; // Clear previous options

        if (question.type === 'multiple-choice') {
            question.options.forEach(option => {
                const optionButton = document.createElement('button');
                optionButton.textContent = option;
                optionButton.onclick = () => submitAnswer(option);
                optionsContainer.appendChild(optionButton);
            });
        } else {
            // Text input
            const input = document.createElement('input');
            input.type = 'text';
            optionsContainer.appendChild(input);
        }
    }

    // Submit the answer and proceed to next question
    async function submitAnswer(answer) {
        const response = await fetch('https://delicate-queen-800c.cubiodojo.workers.dev/submit-answer', {
            method: 'POST',
            body: JSON.stringify({
                questionId: currentQuestionIndex,
                userAnswer: answer
            }),
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();
        if (data.isCorrect) {
            alert('Correct answer!');
            score++;
        } else {
            alert('Incorrect answer.');
        }

        userAnswers.push({ questionId: currentQuestionIndex, answer });
        currentQuestionIndex++;

        if (currentQuestionIndex < questions.length) {
            loadQuestion();
        } else {
            // Finish exam and show results
            showResults();
        }
    }

    // Show the results of the exam
    function showResults() {
        document.getElementById('score').textContent = 'Your score: ' + score;
        document.getElementById('results').style.display = 'block';
    }

    // Start the exam timer
    function startTimer() {
        const timerInterval = setInterval(() => {
            timeRemaining--;
            document.getElementById('timer').textContent = `Time Remaining: ${Math.floor(timeRemaining / 60)}:${timeRemaining % 60}`;
            
            // Update progress bar
            progressBar.style.width = `${(600 - timeRemaining) / 600 * 100}%`;
            
            if (timeRemaining <= 0) {
                clearInterval(timerInterval);
                alert('Time is up!');
                showResults();
            }
        }, 1000);
    }

    // Handle the start of the exam
    document.getElementById('start-btn').addEventListener('click', () => {
        document.querySelector('.intro').style.display = 'none';
        document.querySelector('.question-container').style.display = 'block';
        fetchQuestions();
    });
});
