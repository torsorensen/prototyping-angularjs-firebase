controllers.controller("loginController", function($scope, $parse, $timeout, dbService, eventService) {
	
	/** 
		View click handlers
	*/

	$scope.onKeyPressedLogin = function(event) {
	    if (event.keyCode == 13) { //enter
	         $scope.onLoginClicked();
	    };
	}

	$scope.onKeyPressedRegister = function(event) {
	    if (event.keyCode == 13) { //enter
	         $scope.onRegisterClicked();
	    };
	}

	$scope.onRegisterClicked = function() {
		console.log("REGISTER CLICKED " +$scope.email);

		var name = $scope.name;
		var email = $scope.email;
		var password = $scope.password;
		var password2 = $scope.password2;

		if(!name || name == "") {
			$scope.statusMsg = "Please provide your name";
			console.log("Please provide your name");
			return;
		}
		if(!login || login == "") {
			$scope.statusMsg = "Please provide your email";
			console.log("Please provide your email");
			return;
		}
		if(!password || password == "") {
			$scope.statusMsg = "Please provide a password";
			console.log("Please provide a password");
			return;
		}
		if(!password2 || password2 == "") {
			$scope.statusMsg = "Please repeat your password";
			console.log("Please repeat your password");
			return;
		}
		if(password != password2) {
			$scope.statusMsg = "Passwords don't match";
			console.log("Passwords don't match");
			return;
		}

		$scope.statusMsg = "Registering... please wait.";
		
		//Register on client
		firebase.auth().createUserWithEmailAndPassword(email, password)
			.then(function(user) {
				
				var name = $scope.name; //user.displayName || ;
				var email = user.email;
				var uid = user.uid;

				//Ask server to register the user data except password
				dbService.register(name, email, uid, completedRegistrationCallback, errorCallback);
			})
			.catch(function(error) {
				updateStatusMsg(error.message);
				console.log("Error register. ErrorCode: " + error.code);
			});
	}

	$scope.onLoginClicked = function() {
		console.log("LOG IN CLICKED");

		var login = $scope.email;
		var password = $scope.password;

		if(!login || login == "") {
			$scope.statusMsg = "Please provide an email";
			console.log("Please provide an email");
			return;
		}
		if(!password || password == "") {
			$scope.statusMsg = "Please provide a password";
			console.log("Please provide a password");
			return;
		}

		$scope.statusMsg = "Logging in... please wait.";

		//Auth on client
		firebase.auth().signInWithEmailAndPassword(login, password)
			.catch(function(error) {
				updateStatusMsg(error.message);
				console.log("Error login. ErrorCode: " + error.code);
			});
	}

	$scope.onSendCodeClicked = function() {
		var forgot_email = $scope.email;
		
		if(!forgot_email ||forgot_email == "") {
			$scope.statusMsg = "Please provide an email";
			console.log("Please provide an email");
			return;
		}

		firebase.auth().sendPasswordResetEmail(forgot_email)
			.then(function() {
				updateStatusMsg("Password reset email sent");
			})
			.catch(function(error) {
				updateStatusMsg(error.message);
				console.log("Error sending pw. ErrorCode: " + error.code);
			});
	}

	// Goto Register button clicked
	$scope.onGotoRegisterClicked = function() {
		$timeout(function(){
			eventService.broadcast("GOTO_REGISTER");
		}, 100);
	}

	// Goto Register button clicked
	$scope.onGotoForgotClicked = function() {
		$timeout(function(){
			eventService.broadcast("GOTO_FORGOT");
		}, 100);
	}

	// Goto Register button clicked
	$scope.onGotoLoginClicked = function() {
		gotoLogin();
	}


	/**
		Helpers
	*/

	// Goto Register button clicked
	var gotoLogin = function() {
		$timeout(function(){
			eventService.broadcast("GOTO_LOGIN");
		}, 100);
	}

	var updateStatusMsg = function(msg) {
	    $scope.$apply(function () {
			$scope.statusMsg = msg;
        });
	}


	/**
		Callbacks from database service
	*/

	var completedRegistrationCallback = function() {
		console.log("LoginController: Registration with own Firebase table completed");
	}

	var errorCallback = function() {
		updateStatusMsg("LoginController: Error when trying to use own Firebase");
	}


	/** 
		Events
	*/

	eventService.listen("LOGGED_OUT", function() {
		console.log("LOGGED_OUT event received in loginController");

		firebase.auth().signOut().then(function() {
		  	console.log("LoginController: User signed out");
		}, function(error) {
		    console.log("LoginController: USER SIGNED OUT ERROR");
		});
	});


	/** 
		Init
	*/
	$scope.pageClass = 'page-login';

	// Auto-fill input fields to speed up testing
	//$scope.email = "torsorensen@gmail.com";
	//$scope.password = $scope.password2 = "passion";

	//This var holds the error msg bound to the view. It can only be updated from within async functions that use $scope.$apply
	$scope.statusMsg = "";

	
});
