controllers.controller("itemController", function($rootScope, $scope, $routeParams, $timeout, $parse, $firebaseObject, $firebaseArray, eventService, dbService, uploadService, offlineService){
	

	/**
		Functions bound to view
	*/

	$scope.isCreator = function() {
		if(!firebase.auth().currentUser) return;
		if(!$scope.syncObjectItem) return;

		var userId = $rootScope.userInfo.userId;
		return $scope.syncObjectItem.creatorId == userId;
	}


	/** 
		View click handlers
	*/

	$scope.onGotoItemsClicked = function() {
		$timeout(function(){
			eventService.broadcast("GOTO_ITEMS");
		}, 100);
	}

	$scope.onVoteClicked = function() {
		var success = function(){
			console.log("itemController: Vote success");
		};
		var data = { 
			vote :"up"
	    };
		var userId = $rootScope.userInfo.userId;
		dbService.setData("Items/"+itemId+"/voters/"+userId, data, success);
	}

	$scope.onDeleteClicked = function() {
		var success = function(){
			console.log("itemController: Remove item success");
			eventService.broadcast("GOTO_ITEMS");
		}
		dbService.removeData("Items/"+itemId, success);
	}

	$scope.onAddToOwnListClicked = function(item) {
		var success = function(){
			console.log("itemController: Added item to own list success");
		};

		//Copy some of the item details and store it with the same key as in the Items table
		var data = {};
		data[itemId] = {
			name : item.name,
			creator : item.creatorName,
			creatorId : item.creatorId,
	        timestamp: firebase.database.ServerValue.TIMESTAMP
		};
		var userId = $rootScope.userInfo.userId;
		dbService.updateData("Users/"+userId+"/ownItems", data, success);
	}

	$scope.onClearImageClicked = function() {
		console.log("itemController: cleaing image");

		$scope.picFile = "data/images/placeholder_submit.png";
		
		var success = function(){
			console.log("itemController: image cleared");
		};
		dbService.removeData("Items/"+itemId+"/image", success);
	}

	$scope.onUploadPic = function(file) {

		var extension = file.name.split('.').pop();
		var dir = "itemPictures";
		var filename =  itemId + "." + extension;

   	    uploadService.uploadImageToFirebaseStorage(file, filename, dir, onUploadSuccess, onUploadError, onUploadProgress);
    }


	/**
	 	Send updates to firebase
	*/

	var createFirebaseBindingsObject = function(scopeRefName, itemId) {

		if($scope.unbindCurrentItem) {
			console.log("Unbound previous current item three-way binding")
			$scope.unbindCurrentItem();
		}

		//AngularFire 3-way-bindings
		var currentItemRef = firebase.database().ref( "Items/"+itemId );
		var currentItemSyncObject = $firebaseObject(currentItemRef);
		currentItemSyncObject.$bindTo($scope, scopeRefName).then(function(unbind){
		    $scope.unbindCurrentItem = unbind;      
	    });

		var unwatchCurrentItem = currentItemSyncObject.$watch(watchCurrentItem); // at some time in the future, we can unregister using unwatchCurrentItem()

		console.log("itemController: AngularFire bound to itemId " + itemId);
	}

	var watchCurrentItem = function(event) {
		//console.log("Data changed " + JSON.stringify(e));
	}


	/**
		Callbacks
	*/

	var onUploadSuccess = function(url, filename) {
		console.log("itemController: Uploaded " + filename + " to Firebase. " + url);

		$scope.progress = 0;
        $scope.result = 200;

        var data = {
			filename: filename,
			url: url
		};
		var userId = firebase.auth().currentUser.uid;
		dbService.updateData("Items/"+itemId+"/image", data);
	}
	var onUploadError = function(error) {
	}
	var onUploadProgress = function(progress) {

		$timeout(function() {	
            $scope.progress = progress.toFixed(0);
            console.log("itemController: progress: " + $scope.progress + "% ");
 	    });
	}	


	/**
	 	Init
	*/
	
	console.log("itemController initialised");
	$scope.pageClass = 'page-item';

	//Retrieve itemId from route params
	var itemId = $routeParams.itemId;

	//Setup AngularFire 3-way-bindings (online) or read from cache (offline)
	if( offlineService.isOnline()) {
		console.log("itemController: Client online");
		createFirebaseBindingsObject("syncObjectItem", itemId);
	} 
	else {
		console.log("itemController: Client offline");

		//Find the item in cached items with the specific itemId
		var cachedItems = offlineService.getCachedItems();
		obj = _.find(cachedItems, function(obj) { 
			return obj.itemId == itemId }
		)
		$scope.syncObjectItem = obj;
	}

});