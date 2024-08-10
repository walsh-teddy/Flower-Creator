import * as storage from "./local-storage.js";
import * as firebase from "./firebase.js";

let outputStatus;
let outputResults;

function init() {
    // Get references to different parts of the HTML
    outputStatus = document.querySelector("#element-status");
    outputResults = document.querySelector("#output");

    // Display all the different spellcards
    firebase.displayAllSpells(outputResults, outputStatus, storage.addSpell, storage.spellInBook);
}

init();