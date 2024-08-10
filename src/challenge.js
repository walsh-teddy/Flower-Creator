import * as phillotaxis from "./phyllotaxis.js";
import * as sliders from "./sliders.js";
import * as localStorage from "./localStorage.js";
"use strict";

window.onload = init;
const canvasWidth = 500;
const canvasHeight = 500;
let AICtx;
let playerCtx;

// HTML elements
let AICanvas;
let playerCanvas;
let divergenceSlider;
let divergenceText;
let paddingSlider;
let paddingText;
let divergenceChangeSlider;
let divergenceChangeText;
let paddingChangeSlider;
let paddingChangeText;
let scoreRoundText;
let scoreNumberText;
let scoreGuessText;
let scoreScoreText;
let scoreHighScoreText;
let guessButton;
let nextButton;
let restartButton;

// AI Variables
let AIDivergence = sliders.divergence.defaultValue;
let AIPadding = sliders.padding.defaultValue;
let AIPaddingChange = sliders.divergenceChange.defaultValue;
let AIDivergenceChange = sliders.paddingChange.defaultValue;

// Player Variables
let playerDivergence = sliders.divergence.defaultValue;
let playerPadding = sliders.padding.defaultValue;
let playerDivergenceChange = sliders.divergenceChange.defaultValue;
let playerPaddingChange = sliders.paddingChange.defaultValue;

// Score variables
let guessIndex;
const scoreMax = 100;
let scoreNumberTextDefault;
let scoreGuessTextDefault;
let scoreScoreTextDefault;
let score = 0;

// Round variables
let round = 1;
const maxRounds = 5;

function init() {
    // Point to html elements
    AICanvas = document.querySelector("#AICanvas");
    playerCanvas = document.querySelector("#playerCanvas");
    divergenceSlider = document.querySelector("#divergenceSlider");
    divergenceText = document.querySelector("#divergenceText");
    paddingSlider = document.querySelector("#paddingSlider");
    paddingText = document.querySelector("#paddingText");
    divergenceChangeSlider = document.querySelector("#divergenceChangeSlider");
    divergenceChangeText = document.querySelector("#divergenceChangeText");
    paddingChangeSlider = document.querySelector("#paddingChangeSlider");
    paddingChangeText = document.querySelector("#paddingChangeText");
    scoreRoundText = document.querySelector("#scoreRound");
    scoreNumberText = document.querySelector("#scoreCorrect");
    scoreGuessText = document.querySelector("#scoreGuess");
    scoreScoreText = document.querySelector("#scoreScore");
    scoreHighScoreText = document.querySelector("#scoreHighscore");
    guessButton = document.querySelector("#btn-guess");
    nextButton = document.querySelector("#btn-next");
    restartButton = document.querySelector("#btn-restart");

    // Save default values for the score texts
    scoreNumberTextDefault = scoreNumberText.innerHTML;
    scoreGuessTextDefault = scoreGuessText.innerHTML;
    scoreScoreTextDefault = scoreScoreText.innerHTML;

    // Set up AI canvas
    AICtx = AICanvas.getContext("2d");
    AICanvas.width = canvasWidth;
    AICanvas.height = canvasHeight;

    // Set up Player Canvas
    playerCtx = playerCanvas.getContext("2d");
    playerCanvas.width = canvasWidth;
    playerCanvas.height = canvasHeight;

    // Set up callback functions
    divergenceSlider.oninput = () => {
        // Save value (with 1 decimal place)
        playerDivergence = +(divergenceSlider.value * sliders.divergence.scale).toFixed(1);

        // Update text
        if (playerDivergence == sliders.divergence.defaultValue) { // Its the default
            divergenceText.innerText = `${playerDivergence}° (default)`;
        }
        else { // Its not the default
            divergenceText.innerText = `${playerDivergence}°`;
        }
    }
    paddingSlider.oninput = () => {
        // Save value (with 1 decimal place)
        playerPadding = +(paddingSlider.value * sliders.padding.scale).toFixed(1);

        // Update text
        if (playerPadding == sliders.padding.defaultValue) { // Its the default
            paddingText.innerText = `${playerPadding} (default)`;
        }
        else { // Its not the default
            paddingText.innerText = `${playerPadding}`;
        }
    }
    divergenceChangeSlider.oninput = () => {
        // Save value (with 1 decimal place)
        playerDivergenceChange = (divergenceChangeSlider.value * sliders.divergenceChange.scale).toFixed(3);

        // Update text
        if (playerDivergenceChange == sliders.divergenceChange.defaultValue) { // Its the default
            divergenceChangeText.innerText = `+${playerDivergenceChange}° (default)`;
        }
        else if (playerDivergenceChange > 0) { // Its positive
            divergenceChangeText.innerText = `+${playerDivergenceChange}°`;
        }
        else { // Its negative
            divergenceChangeText.innerText = `${playerDivergenceChange}°`;
        }

    }
    paddingChangeSlider.oninput = () => {
        // Save value (with 1 decimal place)
        playerPaddingChange = (paddingChangeSlider.value * sliders.paddingChange.scale).toFixed(3);

        // Update text
        if (playerPaddingChange == sliders.paddingChange.defaultValue) { // Its the default
            paddingChangeText.innerText = `+${playerPaddingChange} (default)`;
        }
        else if (playerPaddingChange > 0) { // Its positive
            paddingChangeText.innerText = `+${playerPaddingChange}`;
        }
        else { // Its negative
            paddingChangeText.innerText = `${playerPaddingChange}`;
        }
    }
    guessButton.onclick = guessPlayerFlower;
    nextButton.onclick = newRound;
    restartButton.onclick = newGame;

    // Start a new game
    newGame();
}

function newGame() {
    // Reset the buttons
    guessButton.disabled = false;
    nextButton.disabled = true;
    restartButton.disabled = true;

    // Clear both canvases
    phillotaxis.clearCanvas(AICtx);
    phillotaxis.clearCanvas(playerCtx);

    // Reset score (and score text)
    scoreNumberText.innerHTML = scoreNumberTextDefault;
    scoreGuessText.innerHTML = scoreGuessTextDefault;
    score = 0;
    round = 1;
    updateScoreText();
    updateRoundText();
    updateHighScoreText();

    // Set the sliders to default
    sliders.resetSlider(divergenceSlider, sliders.divergence);
    sliders.resetSlider(paddingSlider, sliders.padding);
    sliders.resetSlider(divergenceChangeSlider, sliders.divergenceChange);
    sliders.resetSlider(paddingChangeSlider, sliders.paddingChange);

    // Generate a new flower
    generateRandomFlower();
}

function finishRound() {
    // Check if the game is over
    if (round >= maxRounds) { // The game is over
        guessButton.disabled = true;
        nextButton.disabled = true;
        restartButton.disabled = false;
    }
    else { // There are still rounds left
        guessButton.disabled = true;
        nextButton.disabled = false;
        restartButton.disabled = false;
    }
}

function newRound() {
    // Incriment the round counter
    round += 1;
    updateRoundText();

    // Update all the buttons
    guessButton.disabled = false;
    nextButton.disabled = true;
    restartButton.disabled = false;

    // Reset guess and number text
    scoreNumberText.innerHTML = scoreNumberTextDefault;
    scoreGuessText.innerHTML = scoreGuessTextDefault;

    // Clear both canvases
    phillotaxis.clearCanvas(AICtx);
    phillotaxis.clearCanvas(playerCtx);

    // Set the sliders to default
    sliders.resetSlider(divergenceSlider, sliders.divergence);
    sliders.resetSlider(paddingSlider, sliders.padding);
    sliders.resetSlider(divergenceChangeSlider, sliders.divergenceChange);
    sliders.resetSlider(paddingChangeSlider, sliders.paddingChange);

    // Generate a new flower
    generateRandomFlower();
}

function guessPlayerFlower() {
    phillotaxis.clearCanvas(playerCtx);
    phillotaxis.drawFlower(
        playerCtx, // ctx
        canvasWidth/2, // centerX
        canvasHeight/2, // centerY
        null, // petalText
        null, // divergenceText
        null, // paddingText
        playerDivergence, // divergence
        playerPadding, // padding
        parseFloat(playerDivergenceChange), // divergenceChange
        parseFloat(playerPaddingChange), // paddingChange
        false, // drawLines
        null // Scale
    );
    addScore();
    finishRound();
}

function updateScoreText() {
    scoreScoreText.innerHTML = score;
}

function updateRoundText() {
    scoreRoundText.innerHTML = `${round}/${maxRounds}`;
}

function generateRandomFlower() {
    // Generate Random Numbers
    AIDivergence = sliders.generateRandomValue(sliders.divergence);
    AIPadding = sliders.generateRandomValue(sliders.padding);
    AIDivergenceChange = sliders.generateRandomValue(sliders.divergenceChange);
    AIPaddingChange = sliders.generateRandomValue(sliders.paddingChange);

    // Decided which of the 4 stats should chosen
    guessIndex = sliders.generateRandomNumber(4, 1);
    if (guessIndex != 1) { // Divergence
        sliders.setSliderValue(divergenceSlider, AIDivergence, sliders.divergence);
        divergenceSlider.disabled = true;
    }
    if (guessIndex != 2) { // Padding
        sliders.setSliderValue(paddingSlider, AIPadding, sliders.padding);
        paddingSlider.disabled = true;
    }
    if (guessIndex != 3) { // Divergence Change
        sliders.setSliderValue(divergenceChangeSlider, AIDivergenceChange, sliders.divergenceChange);
        divergenceChangeSlider.disabled = true;
    }
    if (guessIndex != 4) { // Padding Change
        sliders.setSliderValue(paddingChangeSlider, AIPaddingChange, sliders.paddingChange);
        paddingChangeSlider.disabled = true;
    }
    console.log(guessIndex);

    // Draw the actual flower
    phillotaxis.drawFlower(AICtx, canvasWidth/2, canvasHeight/2, null, null, null, AIDivergence, AIPadding, AIDivergenceChange, AIPaddingChange, false);
}

function addScore() {
    // Calculate the score (different for each slider)
    if (guessIndex == 1) { // Divergence
        calculateScore(sliders.divergence, AIDivergence, playerDivergence, true, false);
    }
    if (guessIndex == 2) { // Padding
        calculateScore(sliders.padding, AIPadding, playerPadding, false, false);
    }
    if (guessIndex == 3) { // Divergence Change
        calculateScore(sliders.divergenceChange, AIDivergenceChange, playerDivergenceChange, true, true);
    }
    if (guessIndex == 4) { // Padding Change
        calculateScore(sliders.paddingChange, AIPaddingChange, playerPaddingChange, false, true);
    }

    updateHighScoreText();
}

function calculateScore(setting, number, guess, isDegrees, isAddetive) {
    // Calculate the score
    let closeness = Math.abs(number - guess) / setting.scale;
    let total = (setting.max - setting.min) / setting.scale;
    score += scoreMax - scoreMax * (closeness / total).toFixed(1);

    // Update the text
    let degreesSymbol = '';
    let addetiveSymbolNumber = '';
    let addetiveSymbolGuess = '';

    // Add the degree symbol if it needs it
    if (isDegrees) { // It needs the ° symbol
        degreesSymbol = '°';
    }

    // Add the + sign if it needs it
    if (isAddetive) { // It needs the + or - symbols

        // Check the number
        if (number >= 0) { // Its positive (or +0)
            addetiveSymbolNumber = '+';
        }

        // Check the guess
        if (guess >= 0) { // Its positive (or +0)
            addetiveSymbolGuess = '+';
        }

    }
    scoreNumberText.innerHTML = `${addetiveSymbolNumber}${number}${degreesSymbol}`;
    scoreGuessText.innerHTML = `${addetiveSymbolGuess}${guess}${degreesSymbol}`;
    updateScoreText();
}

function updateHighScoreText() {
    // See if the current score would be a new highscore
    if (localStorage.trySetHighScore(score)) { // This is the new highscore
        scoreHighScoreText.innerHTML = "This right now!";
    }
    else { // Its not a new highscore yet
        scoreHighScoreText.innerHTML = localStorage.getHighScore();
    }
}