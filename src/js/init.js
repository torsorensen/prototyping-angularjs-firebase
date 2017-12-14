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

var projectName = "angular-template-e59e2";
var config = {
	apiKey: "AIzaSyCXrSfAWYojPip0ufh6D6MNCHm3w3Dcx8A",
	authDomain: "angular-template-e59e2.firebaseapp.com",
	databaseURL: "https://angular-template-e59e2.firebaseio.com",
	storageBucket: "angular-template-e59e2.appspot.com"
};
firebase.initializeApp(config);