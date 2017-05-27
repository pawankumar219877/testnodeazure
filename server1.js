var express =require('express');
var app = express();
var port=process.env.PORT || 3000;

//app.use(express.static(__dirname + '/public'));


app.get('/',function(req,res){
console.log('hello from server');
 //res.render('./public/index.html');
});


app.post('/phpcallback', function(req, res) {
    var content = req.body;
     var content = req.body;
    //console.log('message received from php: ' + JSON.stringify(content));
    //to-do: forward the message to the connected nodes.
   
   // ifscode=content.ifscode;
    
    console.log("TokenNo:  "+content.tokenno+"\n");
    console.log("WinNo: "+content.windowno+"\n");
 
});

// added by pawan 
app.listen(port);
console.log('Server Listening at port'+port);