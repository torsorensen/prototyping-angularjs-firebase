/**
	All module variables declared first with their injected moodules
	Attach all future filters/controllers/services to these variables
*/
var filters = angular.module('filters', []);

var services = angular.module("services", []);

var controllers = angular.module("controllers", ["services"]);

//var simpleLoginTools = angular.module('simpleLoginTools', []);

angular.module("templates", []);

var app = angular.module("app", [
	//"simpleLoginTools",
	"ngRoute", 
	"templates",
	"ngAnimate", 
	"controllers", 
	"firebase",
	"ngFileUpload"
]);


/**
	Firebase Setup
*/

var projectName = "...........#replace............";
var config = {
	apiKey: "...........#replace............",
	authDomain: "...........#replace............",
	databaseURL: "...........#replace............",
	storageBucket: "...........#replace............"
};
firebase.initializeApp(config);