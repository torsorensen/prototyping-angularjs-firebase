/**
	Configure the Routes
*/

app.config(function($routeProvider, $locationProvider) {

	//Exclude from ng/animation	
	//$animateProvider.classNameFilter(/^((?!(picker-day)).)*$/); //To add several classes use pipe operator: elOrClass1|elOrClass2

	var titleSep = "|";
	var titleApp = "Angular Template";

	//Note. Dont ever route to index ;-)	
	//Note. There can only be one ng-view, so initially decide whether to apply it to the whole page or for the content container	
	$routeProvider
		.when("/", {
			controller: "loginController",
			title: "Login " + titleSep + " " + titleApp,
			templateUrl: "login.html",
	        reloadOnSearch: false
	    })

		.when("/register", {
			controller: "loginController",
			title: "Login " + titleSep + " " + titleApp,
			templateUrl: "register.html",
	        reloadOnSearch: false
	    })

		.when("/login", {
			controller: "loginController",
			title: "Login " + titleSep + " " + titleApp,
			templateUrl: "login.html",
	        reloadOnSearch: false
	    })

		.when("/forgot", {
			controller: "loginController",
			title: "Login " + titleSep + " " + titleApp,
			templateUrl: "forgot.html",
	        reloadOnSearch: false
	    })

		.when("/profile", {
			controller: "profileController",
			title: "Profile " + titleSep + " " + titleApp,
			templateUrl: "profile.html",
	        reloadOnSearch: false
	    })
		
		.when("/items", {
			controller: "itemsController",
			title: "Items " + titleSep + " " + titleApp,
			templateUrl: "items.html",
	        reloadOnSearch: false
	    })
		
		.when("/items/:itemId", {
			controller: "itemController",
			title: "Items " + titleSep + " " + titleApp,
			templateUrl: "item.html",
	        reloadOnSearch: false
	    })
		
		// else 404
		//.otherwise("/404", {templateUrl: "item.html"});
		.otherwise( {
	        redirectTo: "/login"
	    });

    $locationProvider.html5Mode(true);
})

//Update page title on route change
app.run(["$rootScope", "$route", function($rootScope, $route) {
    $rootScope.$on("$routeChangeSuccess", function() {
        document.title = $route.current.title;
    });
}]);