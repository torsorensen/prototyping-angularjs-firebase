controllers.controller("navController",  function($rootScope, $scope, $timeout, $routeParams, $location, dbService, eventService, offlineService) {
	
	/** 
		View click handlers
	*/

	// Navbar Logout button clicked
	$scope.onLogoutClicked = function() {
		console.log("NavCtrl: Logout clicked");
        eventService.broadcast("LOGGED_OUT");
	}


	/** 
		Events
	*/
	
	eventService.listen("GOTO_REGISTER", function() {
		console.log("GOTO_REGISTER event received in navCtrl");
		navigateTo("register");
	});

	eventService.listen("GOTO_LOGIN", function() {
		console.log("GOTO_LOGIN event received in navCtrl");
		navigateTo("login");
	});

	eventService.listen("GOTO_FORGOT", function() {
		console.log("GOTO_FORGOT event received in navCtrl");
		navigateTo("forgot");
	});
	
	eventService.listen("GOTO_PROFILE", function(itemId) {
		console.log("GOTO_PROFILE event received in navCtrl");
		navigateTo("profile");
	});
	
	eventService.listen("GOTO_ITEMS", function() {
		console.log("GOTO_ITEMS event received in navCtrl");
		navigateTo("items");
	});
	
	eventService.listen("GOTO_ITEM", function(itemId) {
		console.log("GOTO_ITEM event received in navCtrl with extra " + itemId );
		navigateTo("items/" + itemId);
	});
	

	eventService.listen("LOGGED_IN", function() {
		console.log("LOGGED_IN event received in navCtrl " + $location + " " + $location.path() );
		
		//Navigate to path in URL bar (e.g. if link is copied or refreshed)
		if( $location.path() == "/" || $location.path() == "/login" || $location.path() == "/register") {
			navigateTo("items");
		}
		else {
			navigateTo( $location.path() );
		}		

		//Fetch user data
		if( offlineService.isOnline()) {
			var uid = firebase.auth().currentUser.uid;
			console.log("NavController: Client online. Fetching user data for uid " + uid);
			fetchUserData(uid);
		} 
		else {
			console.log("NavController: Client offline");
		}

	});

	eventService.listen("LOGGED_OUT", function() {
		console.log("LOGGED_OUT event received in navCtrl");
		navigateTo("login");
	});
	

	/** 
		Watches
	*/

	//Watch log in/out status
	firebase.auth().onAuthStateChanged(function(user) {
	  
	  if (user) {
		var user = firebase.auth().currentUser;
		if (user != null) {	

			$rootScope.auth = firebase.auth;

			var name = user.displayName  || "NoDisplayName";
			var email = user.email 		 || "NoEmail";
			var photoUrl = user.photoURL || "NoPhotoUrl";
			var uid = user.uid 			 || "NoUserId";  
			var token = user.getToken()  || "NoToken"; 	// The user's ID, unique to the Firebase project. Do NOT use this value to authenticate with your backend server, if you have one. Use User.getToken() instead.
			
			console.log("NavController: User signed in: " + email + " " + name + " " + photoUrl + " " + uid + " token: " + token);

			eventService.broadcast("LOGGED_IN"); 
		}

	  } else {
	      console.log("NavController: No user signed in.");
	      eventService.broadcast("LOGGED_OUT");
	  }
	});


	/** 
		Helpers
	*/

	var navigateTo = function(state) { 
		$timeout(function() {
			console.log("NavController: Navigating to " + state);
			$location.path(state);
		});

		// Convert all potential emoji chars to img's
		twemoji.size = '16x16'; 
		twemoji.parse(document.body);
	}

	// Retrieve real user info based on id from client side
	var fetchUserData = function(uid) {
		dbService.getOnce("Users/"+uid, "value", processUserData, retrievedUserdataFromServer);
	}


	/**
		Callbacks from database service
	*/

	//Retrieve from db (called when user already logged in)
	var processUserData = function(dataSnapshot, callback){
		if(dataSnapshot.val) {
			var key = dataSnapshot.key;
			dataSnapshot = dataSnapshot.val();
			dataSnapshot.userId = key;
		}
		if(callback) callback(dataSnapshot);
	}

	var retrievedUserdataFromServer = function(obj) {
		console.log("NavController: User data retrieved from server and saved to rootScope");

		//Re-try in case a new user's data is not yet registered to firebase
		if(!obj) {
			console.log("Retrieving again ...");
			fetchUserData(firebase.auth().currentUser.uid);
			return;
		}

		var userId = obj.userId || -1;
		var name = obj.name || "UnknownName"
		var email = obj.email || "UnknownEmail";
		var username = name;

    	var userInfo = {
			"userId" : userId,
			"name" : name,
			"email" : email,
			"username" : username
		}
		$rootScope.userInfo = userInfo;

        var userItems = obj.userItems || {};

        var userItems = {
			"userItems" : userItems
		}
	    $rootScope.userItems = userItems;
	}

	//For front-end debugging of routes
	/*this.$route = $route;
    this.$location = $location;
    this.$routeParams = $routeParams;*/

    /* HTML Debugging fields for playing with ng-view
	<pre>$location.path() = {{navCtrl.$location.path()}}</pre>
	<pre>$route.current.templateUrl = {{navCtrl.$route.current.templateUrl}}</pre>
	<pre>$route.current.params = {{navCtrl.$route.current.params}}</pre>
	<pre>$routeParams = {{navCtrl.$routeParams}}</pre> */
	
});