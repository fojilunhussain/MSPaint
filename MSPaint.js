var canvas, ctx, flag = false,
    prevX = 0,
    curX = 0,
    prevY = 0,
    curY = 0,
    isDrawing = false,
    penColour = "black";

$(document).ready(function () {
    canvas = document.getElementById("canvasSurface");
    ctx = canvas.getContext("2d");
    width = canvas.width;
    height = canvas.height;

    penWidth = $("#brushSizeSlider").value;

    retrieveCanvas(canvas);

    canvas.addEventListener("mousemove", function (e) {
        findCoord("move", e)
    }, false);
    canvas.addEventListener("mousedown", function (e) {
        console.log(event.type);
        findCoord("down", e)
    }, false);
    canvas.addEventListener("mouseup", function (e) {
        findCoord("up", e)
    }, false);
    canvas.addEventListener("mouseout", function (e) {
        findCoord("out", e)
    }, false);

    $("#brushSizeSlider").change(function (event) {
        console.log("PEN WIDTH: " + this.value);
        penWidth = this.value;
    });

    $(".paletteColour").click(function (event) {
        penColour = $(this).css("background-color");
    });

    $("#btnUndoStroke").click(function (event) {

    });

    $("#btnRedoStroke").click(function (event) {

    });

    $("#btnClearCanvas").click(function (event) {
        var confirmClear = confirm("Clear canvas?");
        if (confirmClear) {
            ctx.clearRect(0, 0, width, height);
        }

        canvas = document.getElementById("canvasSurface");
        storeCanvas(canvas);
    });

    $("#btnSaveCanvas").click(function (event) {

    });

    $("#btnImgSearch").click(function () {
        const imgQuery = $("#inputImgSearch").val();
        console.log("Image query: " + imgQuery);
        $.ajax({
                url: `https://api.imgur.com/3/gallery/search/?q=${imgQuery}`,
                headers: {
                    'Authorization': 'Client-ID af79a73753ebd81'
                },
                type: "GET",
                dataType: "json",
                success: function (response) {
                    console.log("success");
                }
            })
            .done(function (reponse) {
                getRandomImage(reponse);
            })
            .fail(function(response) {
                console.log(response.status);
                $("#imgResult").html(`
                    <p>oh no</p>
                `);
            });
    });
});

function draw() {
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(curX, curY);
    ctx.strokeStyle = penColour;
    ctx.lineWidth = penWidth;
    ctx.stroke();
    ctx.closePath();

    canvasSurface = $("#canvasSurface");
    storeCanvas(canvasSurface);
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

function storeCanvas(canvasSurface) {
    try {
        var canvasDataUrl = canvasSurface[0].toDataURL();
        localStorage.setItem("canvasDataUrl", canvasDataUrl);
    } catch (err) {
        console.log(err)
        var canvasDataUrl = canvasSurface.toDataURL();
        console.log(canvasSurface)
        localStorage.setItem("canvasDataUrl", canvasDataUrl);
    }

}

function retrieveCanvas(canvas) {
    var canvasDataUrl = localStorage.getItem("canvasDataUrl");

    var canvasImage = new Image;
    canvasImage.src = canvasDataUrl;
    canvasImage.onload = function () {
        ctx.drawImage(canvasImage, 0, 0);
    }
}

function getRandomImage(response) {
    const numOfAlbumResults = response.data.length;

    const randomAlbumIndex = Math.floor(Math.random() * Math.floor(numOfAlbumResults - 1));
    const numOfAlbumImageResults = response.data[randomAlbumIndex].images.length;
    const randomAlbumImageIndex = Math.floor(Math.random() * Math.floor(numOfAlbumImageResults - 1));

    const randomImage = response.data[randomAlbumIndex].images[randomAlbumImageIndex].link;

    $("#imgResult").html(`
        <img src=${randomImage} width="500" height="500"/>
    `);
}