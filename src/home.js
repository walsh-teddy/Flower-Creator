import * as phillotaxis from "./phyllotaxis.js";

window.onload = init;
const canvasWidth = 500, canvasHeight = 500;
let ctx;

function init() {
    ctx = canvas.getContext("2d");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    phillotaxis.clearCanvas(ctx);
    phillotaxis.drawFlower(ctx, canvasWidth/2, canvasHeight/2);
}