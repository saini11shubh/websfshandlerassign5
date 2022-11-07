const express = require('express');
const app = express();
const WebSocket = require("ws");
Object.assign(global, { WebSocket: require("ws") });
const SFS2X = require("sfs2x-api");
app.use(express.json())
var sfs;
var reqPara,response;

app.listen(3000, () => {
    console.log("Example app listening on port 3000")
})

app.get("/", (req, res) => {
    var config = {};
    config.host = "54.169.74.104"
    config.port = 8080
    config.zone = "Ludo_Lobby"
    config.debug = true;
    response=res;
    reqPara = req.body;
    console.log("Test", config);
    console.log(reqPara)
    //  Create SmartFox client instance
    sfs = new SFS2X.SmartFox(config);

    // Add event listeners
    sfs.addEventListener(SFS2X.SFSEvent.CONNECTION, onConnection, this);
    sfs.addEventListener(SFS2X.SFSEvent.CONNECTION_LOST, onConnectionLost, this);
    sfs.addEventListener(SFS2X.SFSEvent.LOGIN, onLogin, this);
    sfs.addEventListener(SFS2X.SFSEvent.LOGIN_ERROR, onLoginError, this);
    sfs.addEventListener(SFS2X.SFSEvent.EXTENSION_RESPONSE, onExtensionResponse, this);
    // sfs.addEventListener(SFS2X.SFSEvent.ROOM_JOIN, onRoomJoined, this);
    // sfs.addEventListener(SFS2X.SFSEvent.ROOM_JOIN_ERROR, onRoomJoinError, this);


    // Attempt connection
    sfs.connect();
})

function onConnection(event) {
    if (event.success) {
        console.log('connection success');
        // res.status(200).json({message:"connection success"});
        sfs.send(new SFS2X.LoginRequest("player08", "", null, "Ludo_Lobby"));
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
    //    sfs.send(new SFS2X.JoinRoomRequest("Lobby"));
}

function onLoginError(evtParams) {
    console.log("Login failure: " + evtParams.errorMessage);
}

// function onRoomJoined(evtParams) {
//     console.log("Room joined successfully: " + evtParams.room);
//     reqSend();
// }

// function onRoomJoinError(evtParams) {
//     console.log("Room joining failed: " + evtParams.errorMessage);
// }



function reqSend() {
    
    let params = new SFS2X.SFSObject();
    params.putDouble("entry_fee", parseFloat(reqPara.entry_fee));
    params.putInt("max_winner", parseInt(reqPara.max_winner));
    params.putInt("min_player", parseInt(reqPara.min_player));
    params.putInt("max_player", parseInt(reqPara.max_player));
    params.putInt("botTime", parseInt(reqPara.botTime));
    params.putDouble("rake", parseFloat(reqPara.rake));
    params.putBool("is_default", true);
    params.putUtfString("dt_creation", reqPara.dt_creation);
    params.putInt("timer_speed", parseInt(reqPara.timer_speed));
    params.putInt("lu_tableid", parseInt(reqPara.lu_tableid));
    params.putInt("table_id", parseInt(reqPara.table_id));
    params.putBool("status", true);
    params.putBool("is_publish", true);
    params.putInt("is_owner", parseInt(reqPara.is_owner));
    params.putDouble("owner_rake", parseFloat(reqPara.owner_rake));
    params.putDouble("admin_percent", parseFloat(reqPara.admin_percent));
    params.putInt("owner_id", parseInt(reqPara.owner_id));
    params.putUtfString("owner_username", reqPara.owner_username);
    params.putInt("affiliate_sharing", parseInt(reqPara.affiliate_sharing));
    params.putInt("validity", parseInt(reqPara.validity));
    params.putUtfString("valid_till", reqPara.valid_till);
    params.putUtfString("win_list", reqPara.win_list);
    params.putUtfString("sfs_created", reqPara.sfs_created);
    params.putUtfString("dt_modification", reqPara.dt_modification);
    params.putUtfString("game_type", reqPara.game_type);
    params.putUtfString("game_time", reqPara.game_time);
    params.putBool("is_bot", reqPara.is_bot);
    params.putInt("PawnOpen", parseInt(reqPara.pawn_open));
    params.putInt("max_bot", parseInt(reqPara.max_bot));
    params.putBool("botautosit", reqPara.botautosit);
    params.putUtfString("table_type", reqPara.table_type);
    params.putInt("client_id", parseInt(reqPara.client_id));        //client id or client name
    params.putInt("game_id", parseInt(reqPara.game_id));
    params.putUtfString("table_name", reqPara.table_id);            //table name or table id
    params.putUtfString("publishOrUnpublish", reqPara.type_state);

    sfs.send(new SFS2X.ExtensionRequest("PublishUnpublish", params));
}
function onExtensionResponse(evtParams) {
    console.log("Response ")
    console.log(evtParams.params)
    if (evtParams.cmd == "PublishUnpublish") {
        var responseParams = evtParams.params;
         console.log("The publish data is : " + responseParams.get("PublishUnpublish"));
        console.log("Data is ..." + evtParams);
        response.status(200).json({message:responseParams.get("PublishUnpublish")})
    }
}

