// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.11.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
import { getDatabase, ref, set, push, onValue, increment, get, update } from  "https://www.gstatic.com/firebasejs/9.11.0/firebase-database.js";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDpONjwc6CXmeRf74Ap0E7MIh9kP3C7rPI",
    authDomain: "high-scores-2b387.firebaseapp.com",
    projectId: "high-scores-2b387",
    storageBucket: "high-scores-2b387.appspot.com",
    messagingSenderId: "934645463722",
    appId: "1:934645463722:web:5326d581c1dc2c29f1aed3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Increase the like count of this spell (or start it at 1)
export const addSpell = (spellID, spellSRC) => {
    const db = getDatabase();
    const spellRef = ref(db, 'pickedSpells/' + spellID);

    // does it already exist?
    // get will just look once
    get(spellRef).then(snapshot => {
        let spell;
        if (snapshot.exists()) {
            // if it's already in "pickedSpells/" - update the number of likes
            spell = snapshot.val();
            const picks = spell.picks + 1;
            const newData = {
                spellSRC: spellSRC,
                picks
            };
            const updates = {};
            updates['pickedSpells/' + spellID] = newData;
            update(ref(db), updates);
        } else {
            // if it does not exist, add to "pickedSpells/"
            set(spellRef, {
                spellSRC: spellSRC,
                picks: 1
            });
        }
    }).catch((error) => {
        console.error(error);
    });
}

// Reduce the pick count of this spell by 1 (to a min of 0)
export const removeSpell = (spellID, spellSRC) => {
    // Get a reference to the database and the spell itself
    const db = getDatabase();
    const spellRef = ref(db, 'pickedSpells/' + spellID);

    // Check if it exists already
    get(spellRef).then(snapshot => {
        let spell;
        if (snapshot.exists()) {
            // if it's already in "pickedSpells/" - update the number of likes
            spell = snapshot.val();
            let picks = spell.picks - 1;
            // Make sure picks don't go below 0
            if (picks < 0) { // It went below 0
                picks = 0;
            }
            const newData = {
                spellSRC: spellSRC,
                picks
            };
            const updates = {};
            updates['pickedSpells/' + spellID] = newData;
            update(ref(db), updates);
        } else {
            // if it does not exist, add to "mostFavorited/"
            set(spellRef, {
                spellSRC: spellSRC,
                picks: 0
            });
        }
    }).catch((error) => {
        console.error(error);
    });
}

// Return the amount of times this spell is in a spellbook
export const getPickCount = (spellID) => {
    // Get a reference to the database and the spell itself
    const db = getDatabase();
    const spellRef = ref(db, 'pickedSpells/' + spellID);

    // This is the only way that I've been able to pass info outside of the .then() callback function
    const dataStorage = document.createElement("div");
    dataStorage.setAttribute("id", "data-storage");

    // Check if it exists already
    get(spellRef).then(snapshot => {
        if (snapshot.exists()) {
            // Save the pick count to the data-storage div
            document.querySelector("#data-storage").innerHTML = snapshot.val().picks;
        } else { // The spell isn't in the databse so nobody has added it
            document.querySelector("#data-storage").innerHTML = 0;
        }
    }).catch((error) => {
        console.error(error);
    });
    let pickCount = dataStorage.innerHTML;
    return pickCount;
}

export const setOnValue = (pickCountContainer, spellID, spellSRC) => {
    // Get references to everything
    const db = getDatabase();
    const spellRef = ref(db, 'pickedSpells/' + spellID);

    // Set up the callback function
    onValue(spellRef, (spellSnapshot) => {
        if (spellSnapshot.exists()) {
            // Save the pickCount
            let pickCount = spellSnapshot.val().picks;
            // Alter the HTML if it is in some spellbooks
            if (pickCount > 0) { // It is in some spellbooks
                // Make it different for singular vs plural
                if (pickCount == 1) { // It is in 1 and should use singular
                    pickCountContainer.innerHTML = `<span class="has-text-warning">This spell is in ${pickCount} spellbook!</span>`;
                }
                else { // It is in multiple and should use plural
                    pickCountContainer.innerHTML = `<span class="has-text-warning">This spell is in ${pickCount} different spellbooks!</span>`;
                }
            }
            else { // It is not in any spellbooks
                pickCountContainer.innerHTML = "";
            }
        }
        else {
            // if it does not exist, add to "pickedSpells/"
            console.log(`This spell doesn't yet exist so create it at 0: ${spellSRC}`);
            set(spellRef, {
                spellSRC: spellSRC,
                picks: 0
            });
        }
    });
}

// Return a list of every spell
export const displayAllSpells = (outputResults, outputStatus, addSpellCallback, spellInBookCallback) => {
    // Get a reference to the database and the spell itself
    const db = getDatabase();
    const reference = ref(db, 'pickedSpells/');

    // Check if it exists already
    get(reference).then(snapshot => {
        // Record how many spells there are
        let spellCount = 0;

        // Loop through each spell result and add it
        snapshot.forEach(spell => {
            const spellData = spell.val();

            // Display the spell if its picked at least once
            if (spellData.picks > 0) { // It has been picked at least once
                // Create the card
                const card = document.createElement("spell-card");

                // Input data
                card.dataset.src = spellData.spellSRC;
                card.addCallbackStorage = addSpellCallback;
                card.addCallbackFirebase = addSpell;
                card.removeCallbackStorage = (data) => {
                    storage.removeSpell(data);
                    outputResults.removeChild(card);
                }
                card.removeCallbackFirebase = removeSpell;
                card.checkCallbackStorage = spellInBookCallback;
                card.checkCallbackFirebase = getPickCount;
                card.setOnValueCallback = setOnValue;

                // Add the card to the page
                outputResults.appendChild(card);

                // Increment the spell count
                spellCount += 1;
            }
        });

        if (spellCount == 0) { // There are no spells in the spellbook
            outputStatus.innerHTML = "No results found :(";
        }
        else { // There are spells in the spellbook
            outputStatus.innerHTML = `Found ${spellCount} results!`;
        }
    }).catch((error) => {
        console.error(error);
    });
}