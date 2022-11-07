const express = require('express');
const app = express();
const WebSocket = require("ws");
Object.assign(global, { WebSocket: require("ws") });
const SFS2X = require("sfs2x-api");
var sfs;


app.get("/", (req, res) => {
    var config = {};
    config.host = "54.169.74.104"
    config.port = 9393
    config.zone = "Ludo_Game"
    config.debug = true;
    
    console.log("Test", config);
    
   // Create SmartFox client instance
    sfs = new SFS2X.SmartFox(config);

    // Add event listeners
    sfs.addEventListener(SFS2X.SFSEvent.CONNECTION, onConnection, this);
    sfs.addEventListener(SFS2X.SFSEvent.CONNECTION_LOST, onConnectionLost, this);
    sfs.addEventListener(SFS2X.SFSEvent.LOGIN, onLogin, this);
    sfs.addEventListener(SFS2X.SFSEvent.LOGIN_ERROR, onLoginError, this);
    sfs.addEventListener(SFS2X.SFSEvent.ROOM_JOIN, onRoomJoined, this);
    sfs.addEventListener(SFS2X.SFSEvent.ROOM_JOIN_ERROR, onRoomJoinError, this);


    // Attempt connection
    sfs.connect();
})

function onConnection(event) {
    if (event.success) {
        console.log('connection success');
        // res.status(200).json({message:"connection success"});
        sfs.send(new SFS2X.LoginRequest("Shubham", "", null, "Ludo_Lobby"));
    }
    else {
        console.log('connection failed');
    }
}

function onConnectionLost(event) {
    console.log("Disconnection occurred; reason is: " + event.reason);
}


function onLogin(evtParams) {
    console.log("Login successful!");
    reqSend();
  //  sfs.send(new SFS2X.JoinRoomRequest("Lobby"));
}

function onLoginError(evtParams) {
    console.log("Login failure: " + evtParams.errorMessage);
}

function onRoomJoined(evtParams) {
    console.log("Room joined successfully: " + evtParams.room);
   // reqSend();
}

function onRoomJoinError(evtParams) {
    console.log("Room joining failed: " + evtParams.errorMessage);
}

function reqSend() {
    sfs.addEventListener(SFS2X.SFSEvent.EXTENSION_RESPONSE, onExtensionResponse, this);
    let params = new SFS2X.SFSObject();
    // params.putInt("client_id",10);
    // params.putInt("game_id", 67);

    console.log('Running..')
    sfs.send(new SFS2X.ExtensionRequest("GetUserDetail", params));
}

function onExtensionResponse(evtParams) {
    console.log('response')
    evtParams.cmd == "GetUserDetail"
    var responseParams = evtParams.params;

    console.log('working...')
    //  console.log("The sum is: " + responseParams.get("TableListHandler"));
    console.log("Data is ..." +evtParams);
}
app.listen(4000, () => {
    console.log("Example app listening on port 3000")
})