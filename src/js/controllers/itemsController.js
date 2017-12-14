controllers.controller("itemsController", function($rootScope, $scope, $timeout, $parse, $firebaseObject, $firebaseArray, eventService, dbService, offlineService){
		

	/**
		Functions bound to scope
	*/
		
	$scope.totalItemVotes = function(item) {
		var index = $scope.synchedItems.indexOf(item);

		var length = 0;
		if ($scope.synchedItems[index]["voters"]) {
			var votersArray = Object.keys($scope.synchedItems[index]["voters"]);
			length = votersArray.length;
		}
		
		return length;
	}


	/** 
		View click handlers
	*/

	$scope.onGotoItemClicked = function(itemId) {
		console.log("ItemsController: Clicked on item " + itemId);

		$timeout(function(){
			eventService.broadcast("GOTO_ITEM", itemId);
		}, 100);
	}

	$scope.onGotoProfileClicked = function(itemId) {
		console.log("ItemsController: Clicked on goto user");

		$timeout(function(){
			eventService.broadcast("GOTO_PROFILE");
		}, 100);
	}

	$scope.onCreateItemClicked = function() {
		$scope.synchedItems.$add({
	        name: "test",
	        creatorName: $rootScope.userInfo.name,
	        creatorId: $rootScope.userInfo.userId,
	        timestamp: firebase.database.ServerValue.TIMESTAMP
	    });
	}


	/** 
		Events
	*/
	
	eventService.listen("NEW_ITEM", function() {
		console.log("NEW_ITEM event received in itemCtrl");
		createNewItem();
	});

	
	eventService.listen("LOGGED_IN", function() {
		console.log("LOGGED_IN event received in itemsCtrl");
	});


	/**
	 	Watches
	*/

	$scope.$watch("synchedItems", function(newVal, oldVal) {
		if(!newVal) return;
		offlineService.setCachedItems( newVal );
	}, true);


	/**
	 	Send updates to firebase
	*/

	var createFirebaseBindingsArray = function() {
		var currentArrayRef = firebase.database().ref( "Items/" );
		$scope.synchedItems = $firebaseArray(currentArrayRef);
		
		console.log("itemsController: AngularFire bound to array Items");
	}	


	/**
	 	Init
	*/

	console.log("itemsController initialised");
	$scope.pageClass = 'page-items';

	//Setup AngularFire 3-way-bindings (online) or read from cache (offline)
	if( offlineService.isOnline()) {
		console.log("itemsController: Client online");
		createFirebaseBindingsArray();
	} 
	else {
		console.log("itemsController: Client offline");
		$scope.synchedItems = offlineService.getCachedItems();
	}
	

});