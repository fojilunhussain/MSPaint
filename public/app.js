require('dotenv').config();

const apiKey = process.env.API_KEY;

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
        try {
            const imageQuery = $("#inputImgSearch").val();
            console.log("Image : " + imageQuery);

            if (imageQuery == null || imageQuery == undefined || imageQuery.trim() == "") {
                const imageQuerytype = undefined;
                throw new imageQueryTypeException(imageQuerytype);
            }

            // if SFW filter on then throw new error
        }
        catch (err) {
            console.log(err)
        }
        finally {

        }

        const imgQuery = $("#inputImgSearch").val();
        console.log("Image query: " + imgQuery);
        console.log(imgQuery);

        console.log(imgQuery.value);
        (imgQuery == null || imgQuery == undefined || imgQuery.trim() == "") ?
        $("#imgResult").html(`<p>Can't make an empty search. Please try again</p>`) :
        $.ajax({
            url: `https://api.imgur.com/3/gallery/search/?q=${imgQuery}`,
            headers: {
                'Authorization': apiKey
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
        .fail(function (response) {
            console.log(response.status);
            $("#imgResult").html(`
                <p>Oops! Please try again</p>
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

function imageSearchTypeException(imageQuerytype) {
    this.imageQuerytype = imageQueryType;
    this.message = "cannot have a blank image query";
    this.toString = function () {
        return this.value + this.message;
    }
}

// function sfw exception
// can't search for nsfw images

function imageResponseTypeException(imageResponseType) {
    this.imageResponseType = imageResponseType;
    this.message = "is not a jpeg image";
    this.toString = function () {
        return this.value + this.message;
    }
}

function getRandomImage(response) {
    try {
        const numOfAlbumResults = response.data.length;
        console.log(`Number of albums: ${numOfAlbumResults}`);

        const randomAlbumIndex = Math.floor(Math.random() * Math.floor(numOfAlbumResults - 1));
        console.log(`Index of random album chosen: ${randomAlbumIndex}`);

        const numOfAlbumImageResults = response.data[randomAlbumIndex].images.length;
        console.log(`Number of images in chosen album: ${numOfAlbumImageResults}`);

        const randomAlbumImageIndex = Math.floor(Math.random() * Math.floor(numOfAlbumImageResults - 1));
        console.log(`Index of random image chosen: ${randomAlbumImageIndex}`);

        const randomImageLink = response.data[randomAlbumIndex].images[randomAlbumImageIndex].link;

        const imageResponseType = response.data[randomAlbumIndex].images[randomAlbumImageIndex].type;

        if (response.data[randomAlbumIndex].images[randomAlbumImageIndex].type != "image/jpeg") {
            throw new imageResponseTypeException(imageResponseType);
        }

        console.log(`Random image link: ${randomImageLink}`);
        $("#imgResult").html(`<img src=${randomImageLink} width="500" height="500"/>`);
    } catch (err) {
        console.log(err)
        $("#imgResult").html(`<p>Make sure you're searching for a valid image. Please try again</p>`);
    }
}