services.service("uploadService", function(eventService) {

	var svc = {};

	/**
		Firebase ref
	*/

	var storageRef = function() {
		return firebase.storage().ref();
	}


	/**
		Firebase API access from client
	*/

	svc.uploadImageToFirebaseStorage = function(file, filename, dir, succeessCallback, errorCallback, progressCallback) {

        console.log("uploadController: Uploading to Firebase storage: " + filename + " to " + dir);

        //Get ref for new firebase storage location
		var uploadRef = storageRef().child(dir + "/" + filename);
		
		//Define internal callbacks
		var onProgress = function(snapshot) {
			
			var prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
			if(progressCallback) progressCallback(prog);

			switch (snapshot.state) {
				case firebase.storage.TaskState.PAUSED: 
				    console.log("Upload is PAUSED");
				    break;
				case firebase.storage.TaskState.RUNNING:
				    console.log("Upload is RUNNING");
				    break;
			}
		}
		var onError = function(error) {
			if(errorCallback) errorCallback(error);
		}
		var onSuccess = function() {
			var url = uploadTask.snapshot.downloadURL;
			if(succeessCallback) succeessCallback(url, filename);
		
		}

		//Upload file to Firebase
		uploadTask = uploadRef.put(file);

		//Monitor progress
		uploadTask.on('state_changed', onProgress, onError, onSuccess);

	}
	
	return svc;

});