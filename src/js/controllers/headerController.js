controllers.controller("headerController",  function($scope, $route, $location, $timeout, $parse, dbService, eventService){
	
	$scope.showHeader = true;


	/** 
		Scope functions bound to view
	*/

	//Update menu selection according to routeProvider
 	$scope.isActive = function (viewLocation) { 
        return $location.path().indexOf(viewLocation) == 0;
    };


	/** 
		View click handlers
	*/

	$scope.onGotoItemsClicked = function() {
		console.log("UserCtrl: Goto Items clicked");
        eventService.broadcast("GOTO_ITEMS");
	}

	$scope.onGotoProfileClicked = function() {
		console.log("UserCtrl: Goto Profile clicked");
        eventService.broadcast("GOTO_PROFILE");
	}

	$scope.onGotoLogoutClicked = function() {
		console.log("UserCtrl: Goto Logout clicked");
        eventService.broadcast("LOGGED_OUT");
	}


	/** 
		Events
	*/
	
	eventService.listen("LOGGED_IN", function() {
		console.log("LOGGED_IN event received in headerController");
		$scope.showHeader = true;
	});

	eventService.listen("LOGGED_OUT", function() {
		console.log("LOGGED_OUT event received in headerController");
		$scope.showHeader = false;
	});

});