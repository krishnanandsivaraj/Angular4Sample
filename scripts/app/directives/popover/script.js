app.directive('popOver', function ($compile) {
    var itemsTemplate = '<ul class="unstyled"><li>ExecutionLog &#58;</li><table class="detailedtable"><thead><tr><th class="width30">Process</th><th class="width30">Status</th><th class="width30">Step</th></tr></thead><tbody >' +
'<tr data-ng-repeat="item in items.executionLog"><td class="tableborder-n">{{item.process}}</td><td class="tableborder-n">{{item.status}}</td><td class="tableborder-n">{{item.step}}</td></tr></tbody></table>' +
    '<li class="alert alert-danger" role="alert" data-ng-show="checkStatus(items)">ErrorLog &#58; {{items.errorLog.message}}</li></ul>';
    var getTemplate = function (contentType) {
        var template = '';
        switch (contentType) {
            case 'items':
                template = itemsTemplate;
                break;
        }
        return template;
    }
    return {
        restrict: "A",
        transclude: true,
        template: "<span ng-transclude></span>",
        link: function (scope, element, attrs) {
            var popOverContent;
            if (scope.items) {
                var html = getTemplate("items");
                popOverContent = $compile(html)(scope);
            }
            var options = {
                content: popOverContent,
                placement: "right",
                trigger:"click",
                html: true,
                title: scope.title
                
            };
            $(element).popover(options);
            scope.checkStatus = function (status) {
                if (status.errorLog) {
                    return true;
                }
            }
        },
        scope: {
            items: '=',
            title: '@'
        }
    };
});