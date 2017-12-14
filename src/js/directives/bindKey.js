/* 
Attach a key code to a controller function.
Usage: <input id="password" bind-key="onLoginClicked()" key="13"/>
http://stackoverflow.com/a/17364716 
*/
app.directive('bindKey', function() {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            if(event.which === Number(attrs.key)) {
                scope.$apply(function(){
                    scope.$eval(attrs.bindKey, {'event': event});
                });

                event.preventDefault();
            }
        });
    };
});