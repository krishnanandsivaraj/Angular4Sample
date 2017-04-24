(function (angularApp) {
    //if (!angularApp || !angularApp.compileProvider) {
    //    return;
    //}

    angularApp.directive('progressNotification', [function () {
        var opts = {
            lines: 10, // The number of lines to draw
            length: 5, // The length of each line
            width: 4, // The line thickness
            radius: 10, // The radius of the inner circle
            corners: 1, // Corner roundness (0..1)
            rotate: 0, // The rotation offset
            color: '#3c3d3f', // #rgb or #rrggbb
            speed: 1, // Rounds per second
            trail: 60, // Afterglow percentage
            shadow: false, // Whether to render a shadow
            hwaccel: false, // Whether to use hardware acceleration
            className: 'spinner', // The CSS class to assign to the spinner
            zIndex: 2e9, // The z-index (defaults to 2000000000)
            top: '40%', // Top position relative to parent in px
            left: '50%', // Left position relative to parent in px
            position: 'relative'
        };

        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var spinner = new Spinner(opts);
                scope.$watch(attrs.progressNotification, function () {
                    if (scope[attrs.progressNotification]) {
                        spinner.spin(element[0]);
                    }
                    else {
                        spinner.stop(element[0]);
                    }
                });
            }
        };
    }]);
}(app));