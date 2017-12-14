controllers.controller("profileController", function($rootScope, $scope, $routeParams, $timeout, $parse, $firebaseObject, $firebaseArray, eventService, dbService, uploadService, offlineService){

	/** 
		View click handlers
	*/


	$scope.onClearImageClicked = function() {
		console.log("profileController: cleaing image");

		$scope.picFile = "data/images/placeholder_submit.png";

		var success = function(){
			console.log("profileController: image cleared");
		};
		var userId = firebase.auth().currentUser.uid;
		dbService.removeData("Users/"+userId+"/profilePicture", success);
	}

	$scope.onUploadPic = function(file) {

		var userId = firebase.auth().currentUser.uid;
		var extension = file.name.split('.').pop();
		var dir = "profilePictures";
		var filename =  userId + "." + extension;

   	    uploadService.uploadImageToFirebaseStorage(file, filename, dir, onUploadSuccess, onUploadError, onUploadProgress);
    }


	/**
	 	Send updates to firebase
	*/

	var createFirebaseBindingsObject = function(scopeRefName) {

		if($scope.unbindCurrentItem) {
			console.log("Unbound previous current item three-way binding")
			$scope.unbindCurrentItem();
		}

		var userId = firebase.auth().currentUser.uid;

		//AngularFire 3-way-bindings
		var currentItemRef = firebase.database().ref( "Users/"+userId );
		var currentItemSyncObject = $firebaseObject(currentItemRef);
		currentItemSyncObject.$bindTo($scope, scopeRefName).then(function(unbind){
		    $scope.unbindCurrentItem = unbind;      
	    });

		var unwatchCurrentItem = currentItemSyncObject.$watch(watchCurrentItem); // at some time in the future, we can unregister using unwatchCurrentItem()

		console.log("profileController: AngularFire bound to userid " + userId);
	}

	var watchCurrentItem = function(event) {
		//console.log("Data changed " + JSON.stringify(e));
	}


	/**
	 	Watches
	*/

	$scope.$watch("syncObjectProfile", function(newVal, oldVal) {
		if(!newVal) return;
		offlineService.setCachedProfile( newVal );
	}, true);

	//Watch log in/out status so if user enters /profile directly, the bindings will be made
	firebase.auth().onAuthStateChanged(function(user) {
	  	
		//Return if already authed when initialising the controller
	  	if(authed) return;

	  	if (user) {
			var user = firebase.auth().currentUser;
			if (user != null) {	
				authed = true;
				createFirebaseBindingsObject("syncObjectProfile");
			}
		}

	});


	/**
		Callbacks
	*/

	var onUploadSuccess = function(url, filename) {
		console.log("profileController: Uploaded " + filename + " to Firebase. " + url);
		
		$scope.progress = 0;
        $scope.result = 200;

        var data = {
			filename: filename,
			url: url
		};
		var userId = firebase.auth().currentUser.uid;
		dbService.updateData("Users/"+userId+"/profilePicture", data);
	}
	var onUploadError = function(error) {
	}
	var onUploadProgress = function(progress) {

		$timeout(function() {			
            $scope.progress = progress.toFixed(0);
            console.log("uploadController: progress: " + $scope.progress + "% ");
 	    });
	}


    

	/**
	 	Init
	*/
	
	console.log("profileController initialised");
	$scope.pageClass = 'page-profile';

	//Boolean used if user enters /profile directly and auth doesn't have time to complete
	var authed = false;

	//Setup AngularFire 3-way-bindings (online) or read from cache (offline)
	if( offlineService.isOnline()) {
		console.log("profileController: Client online");

		if(firebase.auth().currentUser != null) {
			authed = true;
			createFirebaseBindingsObject("syncObjectProfile");
		}

	}  
	else {
		console.log("profileController: Client offline");
		$scope.syncObjectProfile = offlineService.getCachedProfile();
	}

});