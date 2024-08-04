const canvas = document.getElementById('paint-canvas');
const ctx = canvas.getContext('2d');
let painting = false;
let lineWidth = 5;
let tool = 'pen';
let selectedColor = '#000000';

const currentColorDisplay = document.getElementById('current-color');

// Select all tool buttons except #download-button and #clear-button
const toolButtons = document.querySelectorAll('.tool-button:not(#download-button):not(#clear-button):not(#undo-button):not(#redo-button)');

toolButtons.forEach(button => {
    button.addEventListener('click', () => {
        toolButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        if (button.id === 'pen-button') {
            tool = 'pen';
            lineWidth = 5;
        } else if (button.id === 'eraser-button') {
            tool = 'eraser';
            selectedColor = '#FFFFFF';
            lineWidth = 10;
        } else if (button.id === 'fill-button') {
            tool = 'fill';
        }
        updateCurrentColorDisplay();
    });
});

function startPosition(e) {
    if (tool === 'pen' || tool === 'eraser') {
        painting = true;
        saveState();
        draw(e);
    }
}

function endPosition() {
    if (tool === 'pen' || tool === 'eraser') {
        painting = false;
        ctx.beginPath();
    }
}

function draw(e) {
    if (!painting) return;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.strokeStyle = selectedColor;

    ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
}

function updateCurrentColorDisplay() {
    currentColorDisplay.style.backgroundColor = selectedColor;
}

canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', endPosition);
canvas.addEventListener('mousemove', draw);

canvas.addEventListener('click', (e) => {
    if (tool === 'fill') {
        saveState();
        const x = e.clientX - canvas.offsetLeft;
        const y = e.clientY - canvas.offsetTop;
        floodFill(x, y, hexToRgb(selectedColor));
    }
});

function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b, 255];
}

function floodFill(x, y, fillColor) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const targetColor = getPixelColor(imageData, x, y);
    const tolerance = 120;
    const visited = new Array(canvas.width * canvas.height).fill(false);

    const stack = [[x, y]];
    while (stack.length) {
        const [cx, cy] = stack.pop();
        if (cx < 0 || cx >= canvas.width || cy < 0 || cy >= canvas.height || visited[cy * canvas.width + cx]) continue;
        const currentColor = getPixelColor(imageData, cx, cy);
        if (colorsMatchWithTolerance(currentColor, targetColor, tolerance)) {
            setPixelColor(imageData, cx, cy, fillColor);
            visited[cy * canvas.width + cx] = true;
            stack.push([cx + 1, cy]);
            stack.push([cx - 1, cy]);
            stack.push([cx, cy + 1]);
            stack.push([cx, cy - 1]);
        }
    }
    
    ctx.putImageData(imageData, 0, 0);
}

function colorsMatchWithTolerance(a, b, tolerance) {
    return Math.abs(a[0] - b[0]) <= tolerance &&
           Math.abs(a[1] - b[1]) <= tolerance &&
           Math.abs(a[2] - b[2]) <= tolerance &&
           Math.abs(a[3] - b[3]) <= tolerance;
}

function getPixelColor(imageData, x, y) {
    const index = (y * imageData.width + x) * 4;
    return [
        imageData.data[index],
        imageData.data[index + 1],
        imageData.data[index + 2],
        imageData.data[index + 3],
    ];
}

function setPixelColor(imageData, x, y, fillColor) {
    const index = (y * imageData.width + x) * 4;
    imageData.data[index] = fillColor[0];
    imageData.data[index + 1] = fillColor[1];
    imageData.data[index + 2] = fillColor[2];
    imageData.data[index + 3] = 255;
}

function colorsMatch(a, b) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
}

document.querySelectorAll('.color-button').forEach(button => {
    button.addEventListener('click', () => {
        selectedColor = rgbToHex(button.style.backgroundColor);
        updateCurrentColorDisplay();
    });
});

function rgbToHex(rgb) {
    let rgbArray = rgb.replace(/[^\d,]/g, '').split(',');
    let hex = rgbArray.map(val => {
        let hexVal = parseInt(val).toString(16);
        return hexVal.length === 1 ? '0' + hexVal : hexVal;
    }).join('');
    return '#' + hex;
}

updateCurrentColorDisplay();

document.getElementById('download-button').addEventListener('click', (event) => {
    event.preventDefault();
    
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');

    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;

    tempCtx.fillStyle = 'white';
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    tempCtx.drawImage(canvas, 0, 0);

    const downloadLink = document.createElement('a');
    downloadLink.setAttribute('download', 'canvas_image.png');
    const dataURL = tempCanvas.toDataURL('image/png');
    const url = dataURL.replace(/^data:image\/png/, 'data:application/octet-stream');
    downloadLink.setAttribute('href', url);

    downloadLink.click();
});

document.getElementById('clear-button').addEventListener('click', (event) => {
    event.preventDefault();
    saveState();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Function to convert image URL to Base64
function convertImageToBase64(url, callback) {
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function() {
        var canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(this, 0, 0);
        var dataURL = canvas.toDataURL('image/png');
        callback(dataURL);
    };
    img.onerror = function() {
        callback(null);
    };
    img.src = url;
}

// Function to draw black outlines of PNG onto the canvas
function drawBlackOutlines(base64Data) {
    var img = new Image();
    img.onload = function() {
        ctx.drawImage(img, 0, 0);
        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        for (var y = 0; y < imageData.height; y++) {
            for (var x = 0; x < imageData.width; x++) {
                var index = (y * imageData.width + x) * 4;
                var r = imageData.data[index];
                var g = imageData.data[index + 1];
                var b = imageData.data[index + 2];
                var a = imageData.data[index + 3];
                if (a === 0) {
                    // Treat transparent pixels as white
                    r = 255;
                    g = 255;
                    b = 255;
                }
                if (r < 128 && g < 128 && b < 128) {
                    imageData.data[index] = 0;
                    imageData.data[index + 1] = 0;
                    imageData.data[index + 2] = 0;
                    imageData.data[index + 3] = 255;
                } else {
                    imageData.data[index + 3] = 0;
                }
            }
        }
        ctx.putImageData(imageData, 0, 0);
    };
    img.src = base64Data;
}

// List of image URLs
const imageUrls = [
    'HomePage paint program/Preset 1.png',
    'HomePage paint program/Preset 2.png',
    'HomePage paint program/Preset 3.png',
    // Add more URLs as needed
];

// Function to select a random image, convert to Base64, and draw black outlines
function processRandomImage() {
    const randomUrl = imageUrls[Math.floor(Math.random() * imageUrls.length)];
    convertImageToBase64(randomUrl, function(base64Data) {
        if (base64Data) {
            drawBlackOutlines(base64Data);
        } else {
            console.error('Error converting image to base64');
        }
    });
}

// Call this function to process a random image
processRandomImage();

// Undo and Redo functionality
let undoStack = [];
let redoStack = [];

function saveState() {
    undoStack.push(canvas.toDataURL());
    redoStack = []; // Clear the redo stack
}

function restoreState(stack) {
    if (stack.length) {
        const state = stack.pop();
        const img = new Image();
        img.src = state;
        img.onload = function() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
    }
}

document.getElementById('undo-button').addEventListener('click', () => {
    if (undoStack.length) {
        redoStack.push(canvas.toDataURL());
        restoreState(undoStack);
    }
});

document.getElementById('redo-button').addEventListener('click', () => {
    if (redoStack.length) {
        undoStack.push(canvas.toDataURL());
        restoreState(redoStack);
    }
});
