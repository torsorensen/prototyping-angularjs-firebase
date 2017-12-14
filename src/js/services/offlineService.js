services.service("offlineService", function($rootScope, dbService) {

    var svc = {};

    /**
        Private helpers
    */

   

    /**
        Public functions
    */

    // Is browser online? 
    svc.isOnline = function(){
        return navigator.onLine; 
    }

    // Browsers behave differently regarding navigator.onLine method above.
    // So if we really want to be sure about the state, we send a GET request to a local resource, that is not listed in the cache manifest
    // Note, that this answer is provided async and thus takes a moment to process, so be sure to handle the calling of this method correctly.
    svc.isReallyOnline = function(yes, no){
        var xhr = XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHttp');
        xhr.onload = function(){
            if(yes instanceof Function){
                yes();
            }
        }
        xhr.onerror = function(){
            if(no instanceof Function){
                no();
            }
        }
        xhr.open("GET","onlinetester.dont.add.to.cache.manifest",true);
        xhr.send();
    }

    svc.setLocalStorage = function(name, obj) {
        window.localStorage.setItem(name, JSON.stringify(obj));
    }

    svc.getLocalStorage = function(name) {
        return JSON.parse( window.localStorage.getItem(name) );
    }

    svc.setCachedProfile = function(obj) {
        svc.setLocalStorage("profile", obj);
    }

    svc.getCachedProfile = function() {
        return svc.getLocalStorage("profile");
    }

    svc.setCachedItems = function(obj) {
        svc.setLocalStorage("items", obj);
    }

    svc.getCachedItems = function() {
        return svc.getLocalStorage("items");
    }


    return svc;
});
