import * as phillotaxis from "./phyllotaxis.js";
import * as localStorage from "./localStorage.js";
import * as sliders from "./sliders.js";
"use strict";

window.onload = init;
const canvasWidth = 500;
const canvasHeight = 500;
let ctx;

// HTML elements
let canvas;
let divergenceSlider;
let divergenceText;
let paddingSlider;
let paddingText;
let divergenceChangeSlider;
let divergenceChangeText;
let paddingChangeSlider;
let paddingChangeText;
let currentPetalText;
let currentDivergenceText;
let currentPaddingText;
let lineCheckbox;
let drawButton;
let clearButton;
let randomButton;
let resetButton;

// Changing variables
let divergence = sliders.divergence.defaultValue;
let padding = sliders.padding.defaultValue;
let divergenceChange = sliders.divergenceChange.defaultValue;
let paddingChange = sliders.paddingChange.defaultValue;
let includeLines = sliders.includeLines.defaultValue;

function init() {
    // Point to html elements
    canvas = document.querySelector("#canvas");
    divergenceSlider = document.querySelector("#divergenceSlider");
    divergenceText = document.querySelector("#divergenceText");
    paddingSlider = document.querySelector("#paddingSlider");
    paddingText = document.querySelector("#paddingText");
    divergenceChangeSlider = document.querySelector("#divergenceChangeSlider");
    divergenceChangeText = document.querySelector("#divergenceChangeText");
    paddingChangeSlider = document.querySelector("#paddingChangeSlider");
    paddingChangeText = document.querySelector("#paddingChangeText");
    currentPetalText = document.querySelector("#currentPetal");
    currentDivergenceText = document.querySelector("#currentDivergence");
    currentPaddingText = document.querySelector("#currentPadding");
    lineCheckbox = document.querySelector("#lineCheckbox");
    drawButton = document.querySelector("#btn-draw");
    clearButton = document.querySelector("#btn-clear");
    randomButton = document.querySelector("#btn-random");
    resetButton = document.querySelector('#btn-reset');

    // Set up canvas stuff
    ctx = canvas.getContext("2d");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    phillotaxis.clearCanvas(ctx);

    // Set up callback functions
    divergenceSlider.oninput = () => {
        // Save value (with 1 decimal place)
        divergence = +(divergenceSlider.value * sliders.divergence.scale).toFixed(1);

        // Update text
        if (divergence == sliders.divergence.defaultValue) { // Its the default
            divergenceText.innerText = `${divergence}° (default)`;
        }
        else { // Its not the default
            divergenceText.innerText = `${divergence}°`;
        }

        // Save it to local storage
        localStorage.writeDivergence(divergence);
    }
    paddingSlider.oninput = () => {
        // Save value (with 1 decimal place)
        padding = +(paddingSlider.value * sliders.padding.scale).toFixed(1);

        // Update text
        if (padding == sliders.padding.defaultValue) { // Its the default
            paddingText.innerText = `${padding} (default)`;
        }
        else { // Its not the default
            paddingText.innerText = `${padding}`;
        }

        // Save it to local storage
        localStorage.writePadding(padding);
    }
    divergenceChangeSlider.oninput = () => {
        // Save value (with 1 decimal place)
        divergenceChange = (divergenceChangeSlider.value * sliders.divergenceChange.scale).toFixed(3);

        // Update text
        if (divergenceChange == sliders.divergenceChange.defaultValue) { // Its the default
            divergenceChangeText.innerText = `+${divergenceChange}° (default)`;
        }
        else if (divergenceChange > 0) { // Its positive
            divergenceChangeText.innerText = `+${divergenceChange}°`;
        }
        else { // Its negative
            divergenceChangeText.innerText = `${divergenceChange}°`;
        }

        // Save it to local storage
        localStorage.writeDivergenceChange(divergenceChange);
    }
    paddingChangeSlider.oninput = () => {
        // Save value (with 1 decimal place)
        paddingChange = (paddingChangeSlider.value * sliders.paddingChange.scale).toFixed(3);

        // Update text
        if (paddingChange == sliders.paddingChange.defaultValue) { // Its the default
            paddingChangeText.innerText = `+${paddingChange} (default)`;
        }
        else if (paddingChange > 0) { // Its positive
            paddingChangeText.innerText = `+${paddingChange}`;
        }
        else { // Its negative
            paddingChangeText.innerText = `${paddingChange}`;
        }

        // Save it to local storage
        localStorage.writePaddingChange(paddingChange);
    }
    lineCheckbox.oninput = () => {
        includeLines = lineCheckbox.checked;

        // Save it to local storage
        localStorage.writeIncludeLines(includeLines);
    }
    drawButton.onclick = drawFlower;
    clearButton.onclick = clearCanvas;
    randomButton.onclick = generateRandomFlower;
    resetButton.onclick = () => {
        // Reset all sliders and values back to their default values
        sliders.resetSlider(divergenceSlider, sliders.divergence);
        sliders.resetSlider(paddingSlider, sliders.padding);
        sliders.resetSlider(divergenceChangeSlider, sliders.divergenceChange);
        sliders.resetSlider(paddingChangeSlider, sliders.paddingChange);
        setLineCheckbox(sliders.includeLines.defaultValue);
    }

    // Load settings from localStorage
    loadSettings();

    // Draw a flower when the page loads
    drawFlower();
}

function drawFlower() {
    clearCanvas();
    phillotaxis.drawFlower(
        ctx, // ctx
        canvasWidth/2, // centerX
        canvasHeight/2, // centerY
        currentPetalText, // petalText
        currentDivergenceText, // divergenceText
        currentPaddingText, // paddingText
        divergence, // divergence
        padding, // padding
        parseFloat(divergenceChange), // divergenceChange
        parseFloat(paddingChange), // paddingChange
        includeLines, // drawLines
        null // Scale
    );
}

function clearCanvas() {
    phillotaxis.clearCanvas(ctx);
}

// Load the saved settings in from local storage
function loadSettings() {
    // Divergence
    sliders.setSliderValue(divergenceSlider, localStorage.getDivergence(), sliders.divergence);

    // Padding
    sliders.setSliderValue(paddingSlider, localStorage.getPadding(), sliders.padding);

    // Change in divergence
    sliders.setSliderValue(divergenceChangeSlider, localStorage.getDivergenceChange(), sliders.divergenceChange);

    // Change in padding
    sliders.setSliderValue(paddingChangeSlider, localStorage.getPaddingChange(), sliders.paddingChange);

    // Include lines
    setLineCheckbox(localStorage.getIncludeLines());
}

function generateRandomFlower() {
    // Generate Random Settings
    sliders.setRandomSliderValue(divergenceSlider, sliders.divergence);
    sliders.setRandomSliderValue(paddingSlider, sliders.padding);
    sliders.setRandomSliderValue(divergenceChangeSlider, sliders.divergenceChange);
    sliders.setRandomSliderValue(paddingChangeSlider, sliders.paddingChange);
    sliders.setRandomCheckboxValue(lineCheckbox);
}

function setLineCheckbox(includeLines) {
    lineCheckbox.checked = includeLines;
    lineCheckbox.oninput();
}