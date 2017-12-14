var express = require('express');
var compress = require('compression');
var bodyParser = require('body-parser'); //For easy access to POST request parameters

//Own includes
var api = require('./node_files/api');

// Create app
var app = express();
app.set('port', (process.env.PORT || 3336));

app.use(compress()); // Compress and serve content

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); //for parsing application/x-www-form-urlencoded

// Serve static files from the following folders. Precedence to top-most.
app.use(express.static(__dirname + '/public')); 

app.post('/login',function(req, res){
	console.log(req.body.login);
	console.log(req.body.password);

	var login = req.body.login;
	var password = req.body.password;

	api.login(login, password, res);
});

app.post('/register',function(req, res){
	console.log(req.body.name);
	console.log(req.body.email);
	console.log(req.body.uid);

	var name = req.body.name;
	var email = req.body.email;
	var uid = req.body.uid;

	api.register(name, email, uid, res);
});


app.get('*', function(request, response) {
    response.sendFile(__dirname + '/public/index.html');
});



app.listen(app.get('port'), function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
