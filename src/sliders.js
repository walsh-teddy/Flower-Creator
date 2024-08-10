export function generateRandomValue(setting) {
    return generateRandomNumber(setting.max, setting.min, setting.scale);
}

export function generateRandomNumber(max, min, scale = 1) {
    return Math.floor(Math.random() * ((max - min) / scale + 1)) * scale + min;
}

export function setSliderValue(slider, value, setting) {
    slider.value = value / setting.scale;
    slider.oninput();
}

export function setRandomSliderValue(slider, setting) {
    setSliderValue(slider, generateRandomValue(setting), setting);
}

export function setRandomCheckboxValue(checkbox) {
    // Flip a coin
    checkbox.checked = (generateRandomNumber(1, 0) == 0);
    checkbox.oninput();
}

export function resetSlider(slider, setting) {
    setSliderValue(slider, setting.defaultValue, setting);
    slider.disabled = false;
}

// Settings
export const divergence = {
    "defaultValue" : 137.5,
    "scale" : 0.1,
    "max" : 138.0,
    "min" : 137.0
};

export const padding = {
    "defaultValue": 4,
    "scale" : 1,
    "max" : 0,
    "min" : 8
}

export const divergenceChange = {
    "defaultValue": 0,
    "scale" : 0.001,
    "max" : 0.005,
    "min" : -0.005
}

export const paddingChange = {
    "defaultValue": 0,
    "scale" : 0.001,
    "max" : 0.005,
    "min" : -0.005
}

export const includeLines = {
    "defaultValue" : false
}