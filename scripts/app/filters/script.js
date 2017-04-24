(function (angularApp) {
    if (!angularApp) {
        return;
    }

    angularApp.filter('makeRange', function () {
        return function (input) {
            var lowBound, highBound;
            switch (input.length) {
                case 1:
                    lowBound = 0;
                    highBound = parseInt(input[0]) - 1;
                    break;
                case 2:
                    lowBound = parseInt(input[0]);
                    highBound = parseInt(input[1]);
                    break;
                default:
                    return input;
            }
            var result = [];
            for (var i = lowBound; i <= highBound; i++)
                result.push(i);
            return result;
        };
    });

    angularApp.filter('unique', function () {
        return function (items, filterOn) {
            if (filterOn === false) {
                return items;
            }

            if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
                var hashCheck = {}, newItems = [];

                var extractValueToCompare = function (item) {
                    if (angular.isObject(item) && angular.isString(filterOn)) {
                        return item[filterOn];
                    } else {
                        return item;
                    }
                };

                angular.forEach(items, function (item) {
                    var valueToCheck, isDuplicate = false;

                    for (var i = 0; i < newItems.length; i++) {
                        if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
                            isDuplicate = true;
                            break;
                        }
                    }
                    if (!isDuplicate) {
                        newItems.push(item);
                    }

                });
                items = newItems;
            }
            return items;
        };
    });

    angularApp.filter('splitAtSpaces', function () {
        return function (text, length, end) {
            if (text) {
                var t = text.split(',').join('<br/>');
                return t;
            }
        }
    });

    angularApp.filter('offset', function () {
        return function (input, start) {
            if (input && input.slice) {
                start = parseInt(start, 10);
                return input.slice(start);
            } else {
                return;
            }
        };

        var platformQuickView = function () {
            return platformQuickView = [
                { name: "All", value: "" },
                { name: "Analytics", value: "Analytics" },
                { name: "Mobile", value: "Mobile" },
                { name: "Social", value: "Social" },
                { name: "Syndication", value: "Syndication" }
            ];
        };
    });

    angularApp.filter('numberFormatter', ['utilityService', 'appConstants', function (utilityService, appConstants) {
        return function (input, strFormat) {
            return utilityService.numberFormatter(input).format(utilityService.getValueByDotSyntax(appConstants.formatStrings, strFormat));
        };
    }]);

    angularApp.filter('numberFormat', ['utilityService', function (utilityService) {
        return function (input, strFormat) {
            return utilityService.numberFormatter(input).format(strFormat);
        };
    }]);

    angularApp.filter('dateFormatter', ['utilityService', 'appConstants', function (utilityService, appConstants) {
        return function (input, strFormat, isUTC) {
            if (isUTC) {
                isUTC = isUTC.toLowerCase();
            }
            return utilityService.date.format(input, utilityService.getValueByDotSyntax(appConstants.formatStrings, strFormat), (isUTC === 'utc'));
        };
    }]);

    angularApp.filter('dateFormat', ['utilityService', 'appConstants', function (utilityService, appConstants) {
        return function (input, strFormat, isUTC) {
            if (isUTC) {
                isUTC = isUTC.toLowerCase();
            }
            return utilityService.date.format(input, strFormat, (isUTC === 'utc'));
        };
    }]);
}(app));