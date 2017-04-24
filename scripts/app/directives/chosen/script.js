app.directive('chosen', function ($timeout) {
    var linker = function (scope, element, attr) {

        scope.$watch(attr.chosen, function () {
            $timeout(function () {
                element.trigger('chosen:updated');
            }, 0, false);
        }, true);

        scope.$watch(attr.ngDisabled, function (oldVal, newVal) {
            $timeout(function () {
                element.trigger('chosen:updated');
                if (oldVal === true && newVal === true) {
                    element.prop('disabled', true).trigger('chosen:updated');
                }
            }, 0, false);
        });

        scope.$watch(attr.ngModel, function () {
            $timeout(function () {
                element.trigger('chosen:updated');
            }, 0, false);
        }, true);

        $timeout(function () {
            element.chosen();
        }, 0, false);
    };
    return {
        restrict: 'A',
        link: linker
    };
});