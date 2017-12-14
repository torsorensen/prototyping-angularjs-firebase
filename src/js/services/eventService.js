services.service("eventService", function($rootScope) {
		
	this.broadcast = function(msg, extra) {
		$rootScope.$broadcast(msg, extra);
	}

	this.listen = function(msg, callback) { 
		$rootScope.$on( msg, function(msg, extra) { 
			callback(extra) 
		});
	}

});