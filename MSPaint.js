var ctx = false,
    flag = false,
    canvas = false,
    isDrawing = false;
var prevX = 0,
    curX = 0,
    prevY = 0,
    curY = 0;
var penColour = "black";

$(document).ready(function () {
    var canvas = document.getElementById("canvasSurface");
    ctx = canvas.getContext("2d");
    var width = canvas.width;
    var height = canvas.height;
    penWidth = $("#brushSizeSlider").value;

    retrieveCanvas();

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
    
    $("#brushSizeSlider").change(function (event) {
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

        storeCanvas();
    });

    $("#btnSaveCanvas").click(function (event) {

    });

    $("#btnImgSearch").click(function () {
        var imgQuery = $("#inputImgSearch").val();
        try {
            console.log("User searched for: " + imgQuery);
            if (imgQuery == null || imgQuery == undefined || imgQuery.trim() == "") {
                var imgQueryType = undefined;
                $("#imgResult").html(`<p>Can't make an empty search. Please try again</p>`)
                throw new imgQueryTypeException(imgQueryType);
            }
            // var imgQuery = $("#inputImgSearch").val();
            $.ajax({
                // cache: false,
                // crossDomain: true,
                // dataType: 'jsonp',
                headers: {
                    'Authorization': 'Client-ID ',
                },
                success: function (response) {
                    console.log("success");
                },
                // type: "GET",
                url: `https://api.imgur.com/3/gallery/search/?q=${imgQuery}`
             })
            .done(function (response) {
                getRandomImage(response);
            })
            .fail(function (response) {
                console.log(response.status);
                $("#imgResult").html(`
                    <p>Oops! Please try again</p>
                `);
            });
        }
        catch (err) {
            console.log(err)
        }
        finally {

        }        
    });

    function draw() {
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(curX, curY);
        ctx.strokeStyle = penColour;
        ctx.lineWidth = penWidth;
        ctx.stroke();
        ctx.closePath();

        storeCanvas();
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
    
    function storeCanvas() {
        var canvasDataUrl = canvas.toDataURL();
        localStorage.setItem("canvasDataUrl", canvasDataUrl);
    }
    
    function retrieveCanvas() {
        var canvasDataUrl = localStorage.getItem("canvasDataUrl");
    
        var canvasImage = new Image;
        canvasImage.src = canvasDataUrl;
        canvasImage.onload = function () {
            ctx.drawImage(canvasImage, 0, 0);
        }
    }
});
