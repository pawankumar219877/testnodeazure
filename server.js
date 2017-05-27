
var options = {
  pingTimeout: 3000,
  pingInterval: 3000,
  transports: ['websocket'],
  allowUpgrades: false,
  cookie: false
};
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
app.use(bodyParser.json());
var users=[];
var sid=[];
var path = require("path");

var local_socketid=0;
var local_windowno=0;
var local_tokenno=0;
var ifsccode=0;
var NumberofClients = 0;

app.get('/', function(req, res){
    res.sendFile(__dirname + '/testnode.html');
}); 


http.listen(3000, function(){
    console.log('listening on *:3000');
});

app.post('/phpcallback', function(req, res) {
    var content = req.body;
     var content = req.body;
    //console.log('message received from php: ' + JSON.stringify(content));
    //to-do: forward the message to the connected nodes.
   
   // ifscode=content.ifscode;
    
    console.log("TokenNo:  "+content.tokenno+"\n");
    console.log("WinNo: "+content.windowno+"\n");
    console.log("sent to socket: "+content.socketid);
   console.log("sent to socket: "+content.tvchallanmsg);  
    // "message","WinNo:"+ content.windowno + "<::>"+"TokenNo:"+content.tokenno
     console.log(" ifsccode ="+content.ifsccode);
     console.log('message received from php: ' + "WinNo:"+ content.windowno + "<::>"+"TokenNo:"+content.tokenno+"<::>tvchallanmsg:"+content.tvchallanmsg);
     io.to(content.ifsccode).emit('updateUsers',"WinNo:"+ content.windowno + "<::>"+"TokenNo:"+content.tokenno+"<::>tvchallanmsg:"+content.tvchallanmsg);
     
     res.end('1');
});




app.post('/phpcallbackMultipleToken', function(req, res) {
     var content = req.body;
     var message_from_php_server=content.ifsccode+"<::>"+content.MAPID+"<::>"+content.TokenID+"<::>"+content.StatusFlag+"<::>"+content.parentIndex+"<::>"+content.index+"<::>"+content.type;
     console.log("message_from_php_server="+message_from_php_server);
     io.to(content.ifsccode).emit('updateUsersMultipleToken',message_from_php_server);
         //console.log(content); 
});




app.post('/phpcallbackTokenComplete', function(req, res) {
     var content = req.body;
     var message_from_php_server=content.ifsccode+"<::>"+content.TokenID+"<::>"+content.email;
     console.log("message_from_php_server="+message_from_php_server);
     io.to(content.ifsccode).emit('CompleteToken',message_from_php_server);
         //console.log(content); 
});

app.post('/phpcallbackStartToken', function(req, res) {
     var content = req.body; 
     var message_from_php_server=content.ifsccode+"<::>"+content.TokenID+"<::>"+content.email;
     console.log("message_from_php_serverStartToken="+message_from_php_server);
     io.to(content.ifsccode).emit('StartToken',message_from_php_server);
         //console.log(content); 
});

app.post('/phpcallbackUserDataModified', function(req, res) {
     var content = req.body;
     var message_from_php_server=content.ifsccode+"<::>"+content.TokenID+"<::>"+content.email;
     console.log("message_from_php_serverDataModified="+message_from_php_server);
     io.to(content.ifsccode).emit('UserDataModified',message_from_php_server);
     //console.log(content); 
});


/*app.post('/phpcallbackSendToken', function(req, res) {
     var content = req.body;     
     var message_from_php_server=content.ifsccode+"<::>"+content.tokenPassNode;
     console.log("message_from_php_serverDataModified="+message_from_php_server);
     io.to(content.ifsccode).emit('SendToken',message_from_php_server);
     //console.log(content); 
}); */

 //console.log(' io.sockets.clients ' +  io.sockets.clients().length+ ' of client(s)'); 
io.sockets.on('connection', function (socket) {
    
         // for android kiosk
        socket.on('create or join', function (room) {
            //  console.log(' Request come from socket id' + socket.id+ ' of  random no='+room);
            socket.join(room);
        });
        
        
        // for teller multipple token
        socket.on('addifsccode', function (room) {
            //  console.log(' Request come from socket id' + socket.id+ ' of  random no='+room);
            console.log(room+" joined for multipple token");
            socket.join(room);
        });
        
        
        
        
        /*Removing the socket on disconnect*/
        socket.on('disconnect', function(reason) {
        });

});


var getUsersInRoomNumber = function(roomName, namespace) {
    if (!namespace) namespace = '/';
    var room = io.nsps[namespace].adapter.rooms[roomName];
    if (!room) return null;
    return Object.keys(room).length;
}
/*other function*/
function sendHeartbeat(){
    setTimeout(sendHeartbeat, 8000);
    io.sockets.emit('ping', { beat : 1 });
    //console.log("pinged");
}
function deleteFromArray(my_array, element) {
  var position = my_array.indexOf(element);
  console.log("position="+position+"\n");
  my_array.splice(position, 1);
}

app.post('/Monitorphpcallback', function(req, res) {
    
    console.log("Monitorphpcallback");
  
    NumberofClients = io.sockets.sockets.length;
    
    var str = "ON,"+NumberofClients;
        
    res.end(str);
     
});