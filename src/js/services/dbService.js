services.service("dbService", function($http, $q, eventService) {


	var svc = {};

	/**
		Firebase ref
	*/

	var dbRef = function(key) {
		return firebase.database().ref(key);
	}


	/**
		Firebase API access via server
	*/

	// Upon registration using Google Auth, let backend server save user data to own Firebase table
	svc.register = function(name, email, uid, completedRegistrationCallback, errorCallback) {
		console.log("DbService: Registering " + email + " and all user data with own server");
		var data =  {
			name : name,
			email : email,
			uid : uid
		};
		$http.post('/register', data).
	        success(function(resObj) {
	            console.log("Register posted successfully " + JSON.stringify(resObj));
	            completedRegistrationCallback();
	        }).error(function(resObj) {
	            console.error("Register posting error" + resObj);
	            errorCallback();
	        });
	}


	/**
		Firebase API access from client
	*/

	svc.getOnce = function(key, type, process, callback){
		console.log("DbService: Getting once: " + key);
		dbRef(key).once(type, function(dataSnapshot){
			if(process) process(dataSnapshot, callback); 
		}, errorFunc);
	}

	svc.getOnceWithChild = function(key, childKey, childVal, type, process, callback){
		console.log("DbService: Getting once with childKey " + childKey + ", childVal " + childVal);
		dbRef(key).orderByChild(childKey).equalTo(childVal).once(type, function(dataSnapshot){
			if(process) process(dataSnapshot, callback);
		}, errorFunc);
	}


	//Updates existing data array by adding to existing array
	svc.updateData = function(key, dataArr, callback){
		console.log("DbService: Updating " + key);
		dbRef(key).update(dataArr, function(error){
			if(error){
				errorFunc(error);
			}else{
				if(callback) callback();
			}
		});
	}
	
	//Sets existing data array by removing keys that are not existing anymore
	svc.setData = function(key, dataArr, callback){
		console.log("DbService: Setting at " + key);
		dbRef(key).set(dataArr, function(error){
			if(error){
				errorFunc(error);
			}else{
				if(callback) callback();
			}
		});
	}
	
	//Push and save the Firebase auto-generated id based on timestamp
	svc.pushData = function(key, dataArr, callback){
		console.log("DbService: Pushing data to " + key);
		var dbRef2 = dbRef(key).push();
		//var generatedId = dbRef2.key;
		//dataArr.itemId = generatedId;

		dbRef2.set(dataArr, function(error) {
			if(error){ errorFunc(error); }
			else{
				if(callback) callback(dataArr);
			}
		});
	}
	
	//Remove
	svc.removeData = function(key, callback){
		console.log("DbService: Removing at " + key);
		dbRef(key).remove(function(error){
			if(error){
				errorFunc(error);
			}else{
				if(callback) callback();
			}
		});
	}

	var errorFunc = function(errorObject){
		console.log(JSON.stringify(errorObject));
	}
	
	return svc;

});