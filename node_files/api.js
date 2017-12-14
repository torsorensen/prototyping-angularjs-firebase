/**
	Global Namespace and "public" vars
*/

var api = { };

/**
	"Public" exposed functions across server.
	Usage: var api = require('./js/api');
*/

module.exports = {
	
	/** CODE BELOW IS IF WE WANT TO PROCESS LOGIN SERVER SIDE WITHOUT FIREBASE AUTH */
	/*login: function (login, password, res) {
		api.login.login = login;
		api.login.password = password;

		var childKeyToFind = "email";
		var childValToFind = login;
		getOnceWithChild("UsersLogin", childKeyToFind, childValToFind, "value", processLogin, validateLoginWithServer, res);
	},*/
	register: function (name, email, uid, res) { 

		var data =  {};
		data[uid] = {
			name : name,
			email : email,
			items : {},
			timestamp: firebase.database.ServerValue.TIMESTAMP
		};
		updateNewUser("Users", data, completedRegistration, res);
	}
};


/**
	Firebase API access from server
*/

// Setup
var firebase = require("firebase");
var config = {
  //if file: serviceAccount: "angular-template-f0418690d4ad.json",
  //else inline
	serviceAccount: {
	    projectId: "...........#replace...........",
	    clientEmail: "...........#replace...........",
	    privateKey: "...........#replace..........."
	  },
  databaseURL: "...........#replace..........."
};
firebase.initializeApp(config);
var rootRef = firebase.database().ref();
var dbRef = function(key) {
	return firebase.database().ref(key);
}

var getOnceWithChild = function(key, childKey, childVal, type, process, callback, res){
	if(!process) process = defaultProcess; 
	if(!callback) callback = defaultCallback; 
	
	console.log("Backend Api: Getting once with childKey " + childKey + ", childVal " + childVal + " from key: " + key);
	
	dbRef(key).orderByChild(childKey).equalTo(childVal).once(type, function(obj){
		if(process) process(obj, callback, res);
	}, errorFunc);
}

//Updates existing data array by adding to existing array
var updateNewUser = function(key, dataArr, callback, res){
	console.log("Backend Api: Updating new user " + key);
	dbRef(key).update(dataArr, function(error){
		if(error){
			errorFunc(error);
		}else{
			if(callback) callback(dataArr, res);
		}
	});
}

//Sets existing data array by removing keys that are not existing anymore
var setData = function(key, dataArr, callback, res){
	console.log("Backend Api: Setting at " + key);
	dbRef(key).set(dataArr, function(error){
		if(error){
			errorFunc(error);
		}else{
			if(callback) callback(res);
		}
	});
}

//Updates existing data array by adding to existing array
var updateData = function(key, dataArr, callback, res){
	console.log("Backend Api: Updating " + key);
	dbRef(key).update(dataArr, function(error){
		if(error){
			errorFunc(error);
		}else{
			if(callback) callback(res);
		}
	});
}


/**
	Firebase API callbacks
*/

var errorFunc = function(e) {
	console.log("Error func: " + e);
}

var defaultProcess = function(obj, callback){
	console.log("Default processing function");
	obj = obj.val();
	if(callback) callback(obj);
}

var defaultCallback = function(obj) {
	console.log("Default callback function");
}

var completedRegistration = function(data, res) {
	res.sendStatus(200);
}

/** CODE BELOW IS IF WE WANT TO PROCESS LOGIN SERVER SIDE WITHOUT FIREBASE AUTH */

/*var processLogin = function(obj, callback, res){
	obj = obj.val();

	console.log(obj);

	if(!obj) { 
		console.log("Login not found on server");

		//Send response to client here
		res.sendStatus(400);
		return;
	}
	
	//Go one step deeper in the firebase json object
	for (first in obj) break;
	obj = obj[first];

	//Save the key name, otherwise it will be lost wen obj is passed on
	obj.keyName = first;

	//Callback can be either completedLogin or retrivePasswordFromServer
	if(callback) callback(obj, res);
}*/

/*var validateLoginWithServer = function(obj, res) {
	var loginFromServer = obj.email;
	var passwordFromServer = obj.password;

	var email = obj.email; 
	var name = obj.name;
	var userId = obj.userId;
	var username = obj.userId;

	if(passwordFromServer == api.login.password) {
		console.log("Login succeeded. Passwords match. Retrieving useful stuff for user");

		///Retrieve real user info based on id
		var childKeyToFind = "userId";
		var childValToFind = userId;

		//TODO1: Make one call more to get all content
		//getOnceWithChild("Users", childKeyToFind, childValToFind, "value", processLogin, completedLogin, res);
		
		//TEMP SOLTUTION1: Send response to login here 
		var userInfo = {
			"userId" : userId,
			"name" : name,
			"email" : email,
			"username" : username
		}
		var resObj = {"userInfo":userInfo};
		res.json(resObj);
		
	}
	else {
		console.log(api.login.password + " doesn't match server's: " + passwordFromServer);
		
		//Send response to login here
		res.sendStatus(400);
	}
}*/