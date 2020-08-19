url = "ws://localhost:8080";

var Socket = new WebSocket(url);

Socket.onopen = function() {
    console.log("Opened web socket at port 8080");
    Socket.send("open");
}

Socket.onmessage = function(e) {
    console.log(e);
    Socket.send("Message received: " + e.data);
}

Socket.onclose = function(e) {
    console.log("Closed");
}

Socket.onerror = function(e) {
    console.log(`error: ${JSON.stringify(e)}`);
    if(e.code == "EHOSTDOWN") {
        console.log("server down")
    }
}

window.onload = function() {
    $("#sendButton").onclick = function() {
        Socket.send($("#inputMessage").value);
        console.log("sent")
    }
}

$("canvasSurface").onchange = function() {
    try {
        Socket.send($("canvasSurface").value)
        console.log("sent")
    }
    catch {
        
    }
}