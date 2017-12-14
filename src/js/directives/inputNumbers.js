app.directive('decimalInput', function() {
  return {
    require: '?ngModel',
    link: function(scope, element, attrs, ngModelCtrl) {
      if(!ngModelCtrl) {
        return; 
      }

      ngModelCtrl.$parsers.push(function(val) {
        if (angular.isUndefined(val)) {
            var val = '';
        }
        var clean = val.replace(/[^0-9\.]/g, '');
        
        var decimalCheck = clean.split('.');

        if(!angular.isUndefined(decimalCheck[1])) {
            decimalCheck[1] = decimalCheck[1].slice(0,2);
            clean =decimalCheck[0] + '.' + decimalCheck[1];
        }

        if (val !== clean) {
          ngModelCtrl.$setViewValue(clean);
          ngModelCtrl.$render();
        }
        if( isNaN(f) ) f = 0;

        var f = parseFloat(clean);
        return f;
      });

      element.bind('keypress', function(event) {
        if(event.keyCode === 32) {
          event.preventDefault();
        }
      });
    }
  };
})

//Shows typed letters, but removes them.
//Both command and dot are allowed
.directive('onlyFloats', function () {

    return {
        restrict: 'A',
        require: '?ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (inputValue) {
                if (inputValue == undefined) return '';

                modelCtrl.$setViewValue(String(inputValue).replace(/,/g, '.')); //this line updates view, but it doesnt :/
                inputValue = String(inputValue).replace(/,/g, '.');

                var transformedInput = inputValue.replace(/[^0-9\.]/g, '');
                if (transformedInput !== inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }
                var floated = parseFloat(transformedInput);
                if(_.isNaN(floated)) floated = 0;
                return floated ;
            });
        }
    };
});