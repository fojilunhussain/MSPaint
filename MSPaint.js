var canvas, ctx, flag = false,
    prevX = 0,
    curX = 0,
    prevY = 0,
    curY = 0,
    isDrawing = false;

var penColour = "black",
    penWidth = 2;

window.onload = function () {
    canvas = document.getElementById("canvasSurface");
    ctx = canvas.getContext("2d");
    width = canvas.width;
    height = canvas.height;

    canvas.addEventListener("mousemove", function (e) {
        findCoord("move", e)
    }, false);
    canvas.addEventListener("mousedown", function (e) {
        findCoord("down", e)
    }, false);
    canvas.addEventListener("mouseup", function (e) {
        findCoord("up", e)
    }, false);
    canvas.addEventListener("mouseout", function (e) {
        findCoord("out", e)
    }, false);
}

function pickColour(colour) { //
    penColour = colour.id;
}

function draw() {
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(curX, curY);
    ctx.strokeStyle = penColour;
    ctx.lineWidth = penWidth;
    ctx.stroke();
    ctx.closePath();
}

function findCoord(res, e) {
    if (res == "down") {
        prevX = curX;
        prevY = curY;
        curX = e.clientX - canvas.offsetLeft;
        curY = e.clientY - canvas.offsetTop;

        flag = true;
        isDrawing = true;
        if (isDrawing) {
            ctx.beginPath();
            ctx.fillStyle = penColour;
            ctx.fillRect(curX, curY, 2, 2);
            ctx.closePath();
            isDrawing = false;
        }
    }

    if (res == "up" || res == "out") {
        flag = false;
    }

    if (res == "move") {
        if (flag) {
            prevX = curX;
            prevY = curY;
            curX = e.clientX - canvas.offsetLeft;
            curY = e.clientY - canvas.offsetTop;
            draw();
        }
    }
}

function saveCanvas() {

}

function clearCanvas() {
    var confirmClear = confirm("Clear canvas?");
    if (confirmClear) {
        ctx.clearRect(0, 0, width, height);
        $("#canvasImage").style.display = "none";
    }
}

function undoStroke() {

}

function redoStroke() {

}