/**
	Global Namespace and "public" vars
*/

var api = {
	/*projectName: "angular-template-e59e2",

	login : {
		name:"",
		login:"",
		password:""
	}*/
};

/**
	"Public" exposed functions across server.
	Usage: var api = require('./js/api');
*/

module.exports = {
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
	    projectId: "angular-template-e59e2",
	    clientEmail: "torsorensen@angular-template-e59e2.iam.gserviceaccount.com",
	    privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCQjXbhqsalVMrk\n4Lu3u0rBfvKTtWAPXargfK6R2hHhqpR8MbXPYKnIqwt/cyvO8tVFFG/XkzzyYhtf\nVupOPhZEL9FKYb+YcBPdbRLubrUoQhgudkpG+NCKZxYmDxufxXwfsYXhHNsRXLEz\n0vbdW2Nj7PuyvwAnfQL5GO6KXcvWZIUl8vQLlXHrasumeizFjpa3HWbhb+V2G1c6\nChTLjAAZv2r3/O7kp/5AdZaAjzqEsa6tYupCBw39FnjV/eH9hTI7v+meJve6vcln\nblWDD0krDwTa1qB8EN77ZcRo10Q3muUnCE69WoQjgqvzIiIPh4y6OX3H4AV9Tapr\n9ipmE8vXAgMBAAECggEAeB7WN1jukd0QbXnDBD8DNCAF/HCwTpSLtthlSJZqXZie\no0W7y4SMElDw0Qwnz2VDjJAbEI0uDE0yaduUAUjev/LsfF8WE9qu50YIgVJGABpM\nde+ecbO5uAlKAn5zeiVlrACdPB/6e0cHigU5V2DmCteXoUXPHwFnQxBQyXKAPLsz\noyQKxqqcBXtcAked0reV+hlGldAZDK+Iy+LMHnrGOXrtWMFocSB3UygcLbjv5t/g\nseSJ3zOuJ6atgC7GtLvneWfOhea2Jt6qdh3Rexz+f23uUh86Qo903nkk9cpqeAdW\nTkCCLiW/f3p8NdNNOVZtyFbdrouDxpCKJpkd+DYYIQKBgQDA3bPw+DwRXv4+B6Ik\nsIAhAABFrrofpFuaDnTPUIy6JFQp84Fs0w9O0MVuArEwe2nN2fcK6o9RXAHGMeqO\nCLVRxBxmRdu1abVGj4dNbyizfuC0WD0qeYFztEkb0DxpA+k097oNdyvlMjK4vLdr\nn/IjaUvNAtNvLLdlM6W2q8P4/QKBgQC/3xCZA94v+wGTvhO63fUqs/osDTRlZRqM\nqWnMoQC3wICjZSwZJ/LcgiLlW2pWhuJrnqeqmd8zxFA413/094ayBK6M9sIS2dHY\nWtMyTe7s7zEqDuYK/rKVPI3aoqYGHgGIXy7jz9GiIiJCvzWeNwH2y0tDMwCUf/zC\n06D2g4UqYwKBgBkfiCYWn/R/VE0OP3/aAgbKcj6hgRtIFKqfwXWT/5Dr1I7WaoCb\nib3xkhY/gYdYPDMVdonUfjDR9GU18WDpH310N2LXLMSX7YYwgiaDGWEwYOL9L5KN\n22AQFwnpeUUQvlso/fJtGKm1fUf1RUtevXMBb19YQ+SShZ1IOgjunQudAoGBALB1\nBV60H/MgdSLa/GovFvpe6wT4X+egQ/p5E8QNjgtwDt42fYflJYWGaXFl0TYidrli\n/+/180A4m06rYhJ4UngFtkIN7g5IJKVFYlYxNjrQ//YeHZKfCr4VIqCgVO/rSJ2S\nbB03UyQ5ICkikL0g+b1u2ZjDnxTzYBINb0tHSYDhAoGADOB4hZoNShjAI+TMKNPG\n+2QqxMnytXctsBPbQVsT+S7jNlEhekK+YOpMWyx9ZxEKEK13zs/5kI2YwP/HIInM\nDV1K3e7hkAiwY7y+4rHMjgWxlwbK4Az0nW7aElmDXZTvW1YCeGt0lAzeFtFz1W1c\nWBtoJhWmIjnXP8m54pkB7rQ=\n-----END PRIVATE KEY-----\n"
	  },
  databaseURL: "https://angular-template-e59e2.firebaseio.com/"
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