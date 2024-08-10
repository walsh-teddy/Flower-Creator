// Set up constant values
const FPS = 60;
const dotCount = 500;
const circleSize = 2;
let stillDrawing = true;
// let timeOutID;

export const drawFlower = (ctx, centerX, centerY, petalText = null, divergenceText = null, paddingText = null, divergence = 137.5, padding = 4, divergenceChange = 0, paddingChange = 0, drawLines = false, scale = 0) => {
    let n = 0;

    stillDrawing = true;

    // Start both the previous locations out as the center
    let previousX = centerX;
    let previousY = centerY;

    // Recursively loop through each dot

    // If scale is 0 then that means this is going to calculate it itself
    if (!scale) { // Scale was left blank which means this has to calculate it
        scale = ctx.canvas.width / defaultWidth;
    }

    const drawPettle = () => {
        // End condition
        if (n < dotCount && stillDrawing) { // There are still more pettles to draw
            ctx.timeOutID = setTimeout(drawPettle, 1000 / FPS);
            // Calculate rotational values
            let a = n * dtr(divergence); // Angle
            let r = padding * Math.sqrt(n); // Radius
    
            // now calculate the polar coordinates
            let x = r * Math.cos(a)*scale + centerX;
            let y = r * Math.sin(a)*scale + centerY;
    
            // Calculate color (300 is found to perfectly go from red to purple)
            let color = `hsl(${n * (300 / dotCount)},100%,50%)`;
            
            // Draw the lines before you draw the circle to draw them under the dot
            if (drawLines) { // drawLine was selected
                // Draw the line
                drawLine(ctx, previousX, previousY, x, y);
                
                // Update the previous locations (only do this if they'll be used)
                previousX = x;
                previousY = y;

            }
            // Draw the current petal
            drawCircle(ctx,x,y,scale,color);
    
            // Update variables
            divergence += divergenceChange;
            padding += paddingChange;
            n ++;

            // Update text (if a variable was passed in)
            if (petalText) { // There is a value entered for petal text
                petalText.innerHTML = n;
            }
            if (divergenceText) { // There is a value entered for divergence text
                divergenceText.innerHTML = divergence.toFixed(3);
            }
            if (paddingText) { // There is a value entered for padding text
                paddingText.innerHTML = padding.toFixed(3);
            }
        }
        else { // Its done drawing
            ctx.doneDrawing = true;
        }
        
    }

    ctx.doneDrawing = false;

    drawPettle();
}

// Returns the default width of a cirlce so that other scripts can calculate the scale they want
export const defaultWidth = 180;

// Draws black over the whole canvas
export const clearCanvas = (ctx, color = "black") => {
    stillDrawing = false;
    ctx.save();
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.restore();
    clearTimeout(ctx.timeOutID);
}

// helpers
function dtr(degrees){
    return degrees * (Math.PI/180);
}

function drawCircle(ctx,x,y,scale,color){
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,circleSize*scale,0,Math.PI * 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

function drawLine(ctx, x1, y1, x2, y2) {
    ctx.save();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "white";
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
}