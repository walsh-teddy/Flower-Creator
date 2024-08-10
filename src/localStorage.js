import * as sliders from "./sliders.js";

// Empty flower settings
const defaultData = {
    settings: {
        "divergence" : sliders.divergence.defaultData,
        "padding" : sliders.padding.defaultData,
        "divergenceChange" : sliders.divergenceChange.defaultData,
        "paddingChange" : sliders.paddingChange.defaultData,
        "includeLines" : sliders.includeLines.defaultData
    },
    highScore : 0
}

// Key used to find this local data
const storeName = "tjw6911-330-p2";

// Gets the up-to-date data from local storage
const readLocalStorage = () => {
    let allValues = null;

    try {
        allValues = JSON.parse(localStorage.getItem(storeName)) || defaultData;
    }
    catch(error) {
        console.log(`Problem with JSON.parse() and ${storeName} !`);
        throw error;
    }

    return allValues;
};

// Overwrites local storage with a new value
const writeLocalStorage = (allValues) => {
    localStorage.setItem(storeName, JSON.stringify(allValues));
};

export const clearLocalStorage = () => writeLocalStorage(defaultData);

// Return the settings
export const getSettings = () => {
    return (readLocalStorage().settings);
}

// Overwrite the current settings
export const writeSettings = (newSettings) => {
    let newData = readLocalStorage();
    newData.settings = newSettings;
    writeLocalStorage(newData);
}

// Also allow for changing 1 seteting at a time

// Divergence
export const getDivergence = () => {
    return (readLocalStorage().settings.divergence);
}
export const writeDivergence = (newDivergence) => {
    let newData = readLocalStorage();
    newData.settings.divergence = newDivergence;
    writeLocalStorage(newData);
}

// Padding
export const getPadding = () => {
    return (readLocalStorage().settings.padding);
}
export const writePadding = (newPadding) => {
    let newData = readLocalStorage();
    newData.settings.padding = newPadding;
    writeLocalStorage(newData);
}

// Change in divergence
export const getDivergenceChange = () => {
    return (readLocalStorage().settings.divergenceChange);
}
export const writeDivergenceChange = (newDivergenceChange) => {
    let newData = readLocalStorage();
    newData.settings.divergenceChange = newDivergenceChange;
    writeLocalStorage(newData);
}

// Change in padding
export const getPaddingChange = () => {
    return (readLocalStorage().settings.paddingChange);
}
export const writePaddingChange = (newPaddingChange) => {
    let newData = readLocalStorage();
    newData.settings.paddingChange = newPaddingChange;
    writeLocalStorage(newData);
}

// Include lines
export const getIncludeLines = () => {
    return (readLocalStorage().settings.includeLines);
}
export const writeIncludeLines = (newIncludeLines) => {
    let newData = readLocalStorage();
    newData.settings.includeLines = newIncludeLines;
    writeLocalStorage(newData);
}

// High Score
export const getHighScore = () => {
    return (readLocalStorage().highScore);
}

export const setHighScore = (newHighScore) => {
    let newData = readLocalStorage();
    newData.highScore = newHighScore;
    writeLocalStorage(newData);
}

export const trySetHighScore = (score) => {
    // Only save this score if its more than the current
    if (score > getHighScore()) {
        setHighScore(score);

        // Tell the program that its this score right now
        return true;
    }
}