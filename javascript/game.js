let hintsLeft = 3; // Initialize the hint counter
let currentCouple = 0;
let gameTimer;
let timerDelay;
let score = 0;
let timeLeft = 30; // 30 seconds timer
let timerInterval;
let hintUsed = false; // Flag to track if a hint was used
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Extract query param value
function getQueryParam(param) {
    // Create URLSearchParams object with query string
    const urlParams = new URLSearchParams(window.location.search);
    
    // Return param value or null if not found
    return urlParams.get(param);
}
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------



function startGame() {
    // Randomize square values
    randomizeSquareValues();
    
    // Reset current couple index and start timer
    currentCouple = 0;
    startTimer();
    
    // Load stored score from local storage
    let storedScore = localStorage.getItem('squidGameScore');
    
    // Check if stored score exists
    if (storedScore !== null) {
        // Update score variable and display
        score = parseInt(storedScore);
        updateScoreDisplay();
    } else {
        // Reset score to 0 if no score is stored
        score = 0;
    }
}
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function resetTimer(duration) { // reset the timer to initial state
    clearInterval(gameTimer); // clear previous timer if exists
    timeLeft = duration; // set the remaining time to the given duration
    document.getElementById('timer').textContent = timeLeft + ' seconds'; // update the timer display

    gameTimer = setInterval(function() { // create a new timer that runs every second
        timeLeft--; // decrease the remaining time by 1 second
        document.getElementById('timer').textContent = timeLeft + ' seconds'; // update the timer display
        if (timeLeft <= 0) { // if the time has run out
            clearInterval(gameTimer); // clear the timer
            gameOver(); // end the game
        }
    }, 1000); // repeat the timer function every 1000 milliseconds (1 second)
}
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function gameOver() {
    const overlay = document.getElementById('game-over-overlay');
    const gameOverText = document.getElementById('game-over-text');
    const gif = document.getElementById('game-over-gif');

    // Display game over overlay
    overlay.style.display = 'flex';
    gameOverText.style.display = 'block';

    // Stop the timer
    clearInterval(timerInterval);

    // Calculate time taken
    let timeTaken = 30 - timeLeft;

    // Save user score
    let currentUser = sessionStorage.getItem('currentUser');
    if (currentUser) {
        let userScore = { username: currentUser, score: score, time: timeTaken };

        let scores = localStorage.getItem('userScores');
        scores = scores ? JSON.parse(scores) : [];

        scores.push(userScore);
        localStorage.setItem('userScores', JSON.stringify(scores));
    } else {
        alert('No user logged in. Score will not be saved.');
    }

    // Disable all squares
    disableAllSquares();

    // Display game over GIF and hide text
    setTimeout(() => {
        gameOverText.style.display = 'none';
        gif.style.display = 'block';

        // Hide GIF and overlay after delay
        setTimeout(() => {
            gif.style.display = 'none';
            overlay.style.display = 'none';

            // Display game over box with final score and time taken
            document.getElementById('game-over-text').textContent = "Game Over";
            document.getElementById('final-score-value').textContent = score;
            document.getElementById('time-taken').textContent = "Time Taken: " + timeTaken + " seconds";
            document.getElementById('game-over-overlay').style.display = 'flex';
            document.getElementById('return-box').style.display = 'block';
        }, 3000);
    }, 1000);
}
//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function disableAllSquares() {
   // Get all squares from the document
const squares = document.querySelectorAll('.square');

// Iterate through each square
squares.forEach(square => {
    // Remove the click event listener
    square.removeEventListener('click', handleSquareClick);
});
}
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Define click handler for square elements
function handleSquareClick() {
    // Exit if already selected or incorrect couple
    if (this.classList.contains('selected')) {
        return;
    }

    const coupleIndex = parseInt(this.parentElement.getAttribute('data-couple-index'));
    if (coupleIndex !== currentCouple) {
        return;
    }

    // Mark square as selected and determine its value
    this.classList.add('selected');
    const squareValue = parseInt(this.getAttribute('data-value'));

    // Check square value and handle game logic
    if (squareValue === 0) {
        this.classList.add('incorrect');
        gameOver();
    } else {
        this.classList.add('correct');
        let pointsToAdd = 5;
        if (hintUsed) {
            pointsToAdd -= 3;
            animateScore('+2');
            hintUsed = false;
        } else {
            animateScore('+5');
        }
        score += pointsToAdd;
        currentCouple++;
        if (currentCouple >= 5) {
            showCongratulations();
        }
    }
    updateScoreDisplay();
}
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', function() {
     // Accessing overlay and countdown display elements
     const overlay = document.querySelector('.overlay');
     const countdownDisplay = document.querySelector('.countdown-display');
 
     // Countdown time in seconds
     let countdownTimeLeft = 3;
 
     // Show the overlay
     overlay.style.display = 'flex';
 
     // Display countdown time
     countdownDisplay.textContent = countdownTimeLeft;
 
     // Countdown timer
     const countdownTimer = setInterval(function() {
         countdownTimeLeft--;
         countdownDisplay.textContent = countdownTimeLeft;
 
         // Stop countdown when time's up
         if (countdownTimeLeft <= 0) {
             clearInterval(countdownTimer);
             countdownDisplay.textContent = 'Start the game';
 
             // Hide overlay and start the main timer
             setTimeout(function() {
                 overlay.style.display = 'none';
                 startTimer();
             }, 900);
         }
     }, 1000);
});
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
const squares = document.querySelectorAll('.square');
squares.forEach(square => {
    square.addEventListener('click', handleSquareClick);
});

// Assign couple index to each couple for reference
const couples = document.querySelectorAll('.square-couple');
couples.forEach((couple, index) => {
    couple.setAttribute('data-couple-index', index);
});
//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Function to randomize values in squares
function randomizeSquareValues() {
    const couples = document.querySelectorAll('.square-couple');
    couples.forEach(couple => {
        const squares = couple.querySelectorAll('.square');
        const randomValue = Math.round(Math.random());

        squares[0].setAttribute('data-value', randomValue);
        squares[1].setAttribute('data-value', 1 - randomValue);
    });
}
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function showCongratulations() {
    clearInterval(timerInterval); // Stop the timer

    let timeTaken = 30 - timeLeft; // Calculate the time taken
    document.getElementById('final-score-value-congrats').textContent = score;
    document.getElementById('time-taken-congrats').textContent = "Time Taken: " + timeTaken + " seconds";

    document.getElementById('congratulations-box').style.display = 'block'; // Show the congratulations box
}
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Function to animate score changes
function animateScore(text) {
    let scoreDisplay = document.getElementById('score');
    let rect = scoreDisplay.getBoundingClientRect();

    let anim = document.createElement('div');
    anim.classList.add('score-animation');
    anim.textContent = text; // Text like '+2'
    anim.style.top = (rect.top - 40) + 'px';
    anim.style.left = (rect.left + scoreDisplay.offsetWidth) + 'px';
    document.body.appendChild(anim);

    setTimeout(() => {
        document.body.removeChild(anim);
    }, 2000);
}
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Function to animate timer changes
function animateTimer(text) {
    let timerDisplay = document.getElementById('timer');
    let rect = timerDisplay.getBoundingClientRect();

    let anim = document.createElement('div');
    anim.classList.add('timer-animation');
    anim.textContent = text; // Text like '-5 seconds'
    anim.style.top = (rect.top - 40) + 'px';
    anim.style.left = (rect.left - 40) + 'px';
    document.body.appendChild(anim);

    setTimeout(() => {
        document.body.removeChild(anim);
    }, 2000);
}
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Function to highlight a hint square
function highlightHintSquare() {
    const squares = document.querySelectorAll('.square');
    for (let i = 0; i < squares.length; i++) {
        if (!squares[i].classList.contains('selected') && squares[i].getAttribute('data-value') == '1') {
            squares[i].style.backgroundColor = 'green';
            break;
        }
    }
}
//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//showHint function with animations
function showHint() {
    if (hintsLeft <= 0) {
        alert("No more hints left!");
        return;
    }

    hintUsed = true; // Set the hintUsed flag when hint is used
    hintsLeft--; // Decrement the hint counter
    document.getElementById('hint-button').textContent = 'Use Hint (' + hintsLeft + ')';

    // Deduct 5 seconds from the timer
    timeLeft -= 5 ;
    if (timeLeft < 0) {
        timeLeft = 0; // Ensure time doesn't go below zero
    }
    document.getElementById('timer').textContent = timeLeft + ' seconds';

    animateTimer('-5 seconds');
    highlightHintSquare();
}

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//function for restart the game
function restartGame() {
    // Reset squares
    const squares = document.querySelectorAll('.square');
    squares.forEach(square => {
        square.classList.remove('correct', 'incorrect', 'selected');
        square.removeAttribute('style'); // Reset hint styling
        square.removeEventListener('click', handleSquareClick); // Remove old listener
        square.addEventListener('click', handleSquareClick); // Add new listener
    });

    // Randomize square values
    randomizeSquareValues();

    // Reset game variables
    currentCouple = 0;
    score = 0;
    updateScoreDisplay();
    hintsLeft = 3;
    document.getElementById('hint-button').textContent = 'Use Hint (3)'

    // Hide overlays
    document.getElementById('game-over-overlay').style.display = 'none';
    document.getElementById('congratulations-box').style.display = 'none';
    document.getElementById('return-box').style.display = 'none';

    // Restart timer
    startTimer();
}

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function startTimer() {
    clearInterval(timerInterval); // Clear any existing timer interval
    timeLeft = 30; // Reset timer to 30 seconds
    document.getElementById('timer').textContent = timeLeft ;
    timerInterval = setInterval(function() {
        timeLeft--;
        document.getElementById('timer').textContent = timeLeft ;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timeOutGameOver(); // Call a function to handle game over due to timeout
        }
    }, 1000); // Update timer every second
}
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function timeOutGameOver() {
    disableAllSquares();
    let timeTaken = 30 - timeLeft; // Calculate time taken

    // Display the game-over information
    document.getElementById('game-over-overlay').style.display = 'flex';
    document.getElementById('final-score-value').textContent = score; // Update final score
    document.getElementById('time-taken').textContent = "Time Taken: " + timeTaken + " seconds"; // Display time taken

    document.getElementById('return-box').style.display = 'block'; // Show the game over box
}
function goToHomePage() {
    window.location.href = 'home.html'; 
}
function gotologinpage(){
    window.location.href = 'log.html';
}
function exitGame() {
    window.location.href = 'home.html'; 
}
function sc() {
    window.location.href = 'score.html'; 
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function updateScoreDisplay() {
    document.getElementById('score').textContent = score;
    localStorage.setItem('squidGameScore', score.toString()); // Store score in local storage
}

document.addEventListener('DOMContentLoaded', startGame);
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function showRegister() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
}
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function showLogin() {
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
}
//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function register() {
    let username = document.getElementById('registerUsername').value;
    let email = document.getElementById('registerEmail').value;
    let phone = document.getElementById('registerPhone').value;
    let password = document.getElementById('registerPassword').value;
    let confirmPassword = document.getElementById('confirmPassword').value;

    if (!username || !email || !phone || !password || !confirmPassword) {
        alert('Please fill in all fields');
        return;
    }

    // Check username availability
    if (localStorage.getItem('user_' + username) !== null) {
        alert('Username already exists');
        return;
    }

    // Validate email
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(email)) {
        alert('Invalid email format');
        return;
    }

    // Validate password
    const passwordPattern = /[!@#$%^&*(),.?":{}|<>]/;
    if (!passwordPattern.test(password)) {
        alert('Password requires a special character');
        return;
    }

    // Confirm password match
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    // Validate phone number
    if (phone.length !== 10 || isNaN(phone)) {
        alert('Invalid 10-digit phone number');
        return;
    }

    localStorage.setItem('user_' + username, JSON.stringify({ email, phone, password }));
    alert('Registration successful');
    showLogin();
}

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function login() {
    // Get input values
    let username = document.getElementById('loginUsername').value;
    let password = document.getElementById('loginPassword').value;

    // Retrieve user data from local storage
    let userData = localStorage.getItem('user_' + username);

    // Check if user exists
    if (userData) {
        // Parse user data
        userData = JSON.parse(userData);

        // Validate password
        if (userData.password === password) {
            // Set current user in session storage
            sessionStorage.setItem('currentUser', username);
            alert('Login successful');

        } else {
            // Show incorrect password message
            alert('Incorrect password');
        }
    } else {
        // Show user not found message
        alert('User not found');
    }
}
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function logout() {
    // remove currentUser from sessionStorage
    sessionStorage.removeItem('currentUser');
}
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
    let scores = localStorage.getItem('userScores');
    scores = scores ? JSON.parse(scores) : [];

    // Sort scores in descending order
    scores.sort((a, b) => b.score - a.score);

  
});
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function displayUserScores() {
    const currentUser = sessionStorage.getItem('currentUser');
    const userScoresTable = document.getElementById('userScoresTable');

    // Clear existing rows except the header
    userScoresTable.innerHTML = `<tr>
                                    <th>Score</th>
                                    <th>Time Taken</th>
                                 </tr>`;

    if (!currentUser) {
        userScoresTable.innerHTML += '<tr><td colspan="2">No user logged in.</td></tr>';
        return;
    }

    let scores = JSON.parse(localStorage.getItem('userScores')) || [];
    scores = scores.filter(score => score.username === currentUser);

    scores.forEach(score => {
        userScoresTable.innerHTML += `<tr><td>${score.score}</td><td>${score.time} seconds</td></tr>`;
    });
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function displayGlobalHighScores() {
    // Get user scores from local storage
    let scores = JSON.parse(localStorage.getItem('userScores')) || [];

    // Create object to store global high scores
    let highScores = {};

    // Iterate through user scores and add/update high scores
    scores.forEach(score => {
        if (!highScores[score.username] || highScores[score.username].score < score.score) {
            highScores[score.username] = score;
        }
    });

    // Get global scores table element from the DOM
    const globalScoresTable = document.getElementById('globalScoresTable');

    // Clear global scores table content
    globalScoresTable.innerHTML = `<tr>
                                      <th>User</th>
                                      <th>Score</th>
                                      <th>Time Taken</th>
                                   </tr>`;

    // Sort high scores in descending order and append them to the global scores table
    Object.values(highScores).sort((a, b) => b.score - a.score).forEach(score => {
        globalScoresTable.innerHTML += `<tr>
                                           <td>${score.username}</td>
                                           <td>${score.score}</td>
                                           <td>${score.time} seconds</td>
                                        </tr>`;
    });
}

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
    // Display user scores by default when the page loads
    displayUserScores();

    // Event listener for the "Your Score" button
    const yourScoreBtn = document.getElementById('yourScoreBtn');
    yourScoreBtn.addEventListener('click', function() {
        toggleScoreDisplay(false);
    });

    // Event listener for the "Global Score" button
    const globalScoreBtn = document.getElementById('globalScoreBtn');
    globalScoreBtn.addEventListener('click', function() {
        toggleScoreDisplay(true);
    });
});
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Function to toggle display of score tables
function toggleScoreDisplay(showGlobal) {
    const yourScoresDiv = document.getElementById('yourScores');
    const globalScoresDiv = document.getElementById('globalScores');

    if (showGlobal) {
        yourScoresDiv.style.display = 'none';
        globalScoresDiv.style.display = 'block';
        displayGlobalHighScores(); // Update and show global scores
    } else {
        yourScoresDiv.style.display = 'block';
        globalScoresDiv.style.display = 'none';
        displayUserScores(); // Update and show user scores
    }
}

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function showForgotPassword() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('forgotPasswordForm').style.display = 'block';
}
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function resetPassword() {
    // Get email input
    let email = document.getElementById('forgotEmail').value;
    let found = false;

    // Iterate through local storage
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);

        // Check if key starts with 'user_'
        if (key.startsWith('user_')) {
            let userData = JSON.parse(localStorage.getItem(key));

            // Check if user's email matches the input
            if (userData.email === email) {
                found = true;
                let newPassword = prompt("Enter your new password:");
``
                // Check if new password contains a special character
                const passwordPattern = /[!@#$%^&*(),.?":{}|<>]/;
                if (!passwordPattern.test(newPassword)) {
                    alert('Password must contain at least one special character');
                    return;
                }

                // Update user's password
                userData.password = newPassword;
                localStorage.setItem(key, JSON.stringify(userData));

                // Display success message and hide other forms
                alert("Password reset successful.");
                document.getElementById('forgotPasswordForm').style.display = 'none';
                document.getElementById('registerForm').style.display = 'none';
                document.getElementById('loginForm').style.display = 'block';

                break;
            }
        }
    }

    // Display error message if email is not found
    if (!found) {
        alert("Email not found.");
    }
}
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
    const bgMusic = document.getElementById('bg-music');
    const audioToggle = document.getElementById('audioToggle');
   
    // Add event listener for audio toggle
   if (audioToggle) {
    audioToggle.addEventListener('change', function() {
        if (this.checked) { // If toggle checked, play music
            bgMusic.play();
        } else { // If toggle unchecked, pause music
            bgMusic.pause();
        }
    });
}
 
});



