# AngularJS + Firebase + Nodejs Prototyping Template

This is a personal AngularJS template project. The overall purpose is to provide a quick starting point for prototyping and building everyday web applications that store their data in the cloud. Functionality-wise, the project seeks go to beyond individual "getting started" templates and ties often used functionalities together in one application. While adding features, the rule is to follow best practice approaches as documented by the original authors whenever possible.

Pages included:
* Login
* Register
* Forgot 
* Items
* Item (detail)
* Profile

Current features implemented using best practice:
* AngularJS structure (Controllers for each page, data processing in Services, view templates as partials)
* AngularJS routing (using $routeProvider)
* Offline capabilities (caching data using browser's localStorage)
* Firebase cloud storage synced to frontend (using AngularFire for 3-way binding)
* Firebase Rules (to restrict users from accessing other users' private content)
* Firebase Auth (using user specified email and password)
* Firebase Storage (for uploading images from camera or media)
* Sass stylesheets separated according to View

## Usage

**Build source files**
Run `gulp` to compile the source js, sass and html template files into a functioning website that can be served from the public/ folder. 

Run `gulp watch` and the page will automatically reload if you change any of the source files. 

**Edit Firebase details**
Setup your own Firebase project in the Firebase Console. After setting up your own Firebase project, please replace the src/js/init.js with your own details including apiKey, authDomain, databaseURL, storageBucket. 

Furthermore, the Nodejs server is setup to perform post-registration tasks on user accounts upon registration. Thus, the Nodejs server needs to be registered as a ServiceAccount to the Firebase application in the Firebase settings panel. When setting this up, you will need to replace node_files/api.js (lines 47-51) with the service account details, including projectId, clientEmail, privateKey, databaseURL (alternatively download the config as a json file and provide the relative path on line 44).

## Development server

Run `node index` for a dev server. Navigate to `http://localhost:3336/`. 
