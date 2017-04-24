(function (angularApp) {
    if (!angularApp || !angularApp.service) {
        return;
    }

    angularApp.service('mediatorService', ['utilityService', '$window', function (utilityService, $window) {
        var subscribers = [];

        this.name = 'Original';
        // e.g. for the input parameter, { subscriberId: '82f6ddaf-b09c-41d0-8cc9-e785153edc8d', eventName: 'filter.search', eventHandler: function (data) {} }
        this.subscribeForAnEvent = function (subscriber) {
            if (!subscribers) {
                subscribers = [];
            }

            subscribers.push(subscriber);
        }

        // e.g. for the input parameter, { name: 'filter.search', data: {} }
        this.publishEvent = function (event) {
            if (!event) {
                return;
            }
            subscribers.forEach(function (subscriber) {
                if ((event.eventName === subscriber.eventName || subscriber.eventName === '*') && subscriber.eventHandler && event.subscriberId != subscriber.subscriberId) {
                    subscriber.eventHandler.call(undefined, {
                        event: {
                            name: event.eventName
                        },
                        data: utilityService.cloneDeep(event.data)
                    });
                }
            });
        }

        // Unsubscribe from all events
        this.unsubscribe = function (subscriberId) {
            var i = -1;
            if (!subscribers || subscribers.length < 1) {
                return;
            }

            i = subscribers.length - 1;
            while (i >= 0) {
                if (subscribers[i].subscriberId === subscriberId) {
                    subscribers.splice(i, 1);
                }
                i--;
            }
        }

        // first function to be called in controllers to set up pub-sub behavior
        this.configure = function (scope) {
            scope.subscriberId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                alert(v.toString(16));
                return v.toString(16);
            });
        }

        $window.mediatorService = this;
    }]);

    angularApp.factory('utilityService', ['$window', '$resource', '$injector', 'toaster', 'Analytics', function ($window, $resource, $injector, toaster, Analytics) {
        var utility = $window._, stringUtility = utility.string, dateUtility = $window.moment, linq = { Enumerable: $window.Enumerable },
            numberFormatter = $window.numeral, statusMessage, landingPage, closemsg;

        return {
            cloneDeep: function (object) {
                return utility.cloneDeep(object);
            },
            restrictCollection: function (params) {
                var restrictedCollection = null;
                if (!params || !params.collection) {
                    return restrictedCollection;
                }
                if (!params.restrictions) {
                    return params.collection;
                }

                restrictCollection = utility.filter(params.collection, function (data) {
                    return utility.contains(params.restrictions, data[params.fieldNameToRestrictBy])
                });
                return restrictCollection;
            },
            find: utility.find,
            groupBy: utility.groupBy,
            filter: utility.filter,
            every: utility.every,
            forEach: utility.forEach,
            merge: utility.merge,
            startsWith: function (stringToSearchIn, searchString) {
                if (!utility.isString(stringToSearchIn) || !utility.isString(searchString)) {
                    return false;
                }

                return stringToSearchIn.slice(0, searchString.length) === searchString;
            },
            getValueByDotSyntax: function (object, path) {
                var paths = [], tempObject = null;
                if (!object || !path || !utility.isString(path)) {
                    return object;
                }

                paths = path.split('.');
                if (!paths) {
                    return object;
                }


                counter = -1;
                tempObject = object;
                while (counter < paths.length) {
                    counter += 1;
                    tempObject = tempObject[paths[counter]];
                    if (!tempObject) {
                        return tempObject;
                    }

                    if (counter === paths.length - 1) {
                        return tempObject;
                    }
                }
                return null;
            },
            isNumber: function (value) {
                var val = Number(value);
                return (value !== null && utility.isNumber(val) && !utility.isNaN(val));
            },
            aggregator: {
                sum: function (collection, selectDelegate) {
                    if (!collection || !utility.isFunction(selectDelegate)) {
                        return null;
                    }

                    return linq.Enumerable.From(collection)
                            .Select(selectDelegate)
                            .Sum();
                },
                average: function (collection, selectDelegate) {
                    if (!collection || !utility.isFunction(selectDelegate)) {
                        return null;
                    }

                    return linq.Enumerable.From(collection)
                            .Select(selectDelegate)
                            .Average();
                }
            },
            isEmpty: utility.isEmpty,
            isNull: utility.isNull,
            isUndefined: utility.isUndefined,
            numberFormatter: numberFormatter,
            pluck: utility.pluck,
            sortBy: utility.sortBy,
            map: utility.map,
            values: utility.values,
            removeFromArray: utility.remove,
            isArray: utility.isArray,
            prune: stringUtility.prune,
            truncate: stringUtility.truncate,
            flatten: utility.flatten,
            every: utility.every,
            date: {
                add: function (date, num, datepart) {
                    date = dateUtility(date);
                    if (!date.isValid()) {
                        return null;
                    }
                    if (!utility.isNumber(num)) {
                        num = 0;
                    }
                    return date.add(num, datepart).toDate();
                },
                subtract: function (date, num, datepart) {
                    date = dateUtility(date);
                    if (!date.isValid()) {
                        return null;
                    }
                    if (!utility.isNumber(num)) {
                        num = 0;
                    }
                    return date.subtract(num, datepart).toDate();
                },
                resetDatePart: function (date, datepart, resetToEnd) {
                    date = dateUtility(date);
                    if (!date.isValid()) {
                        return null;
                    }
                    return resetToEnd ? date.endOf(datepart).toDate() : date.startOf(datepart).toDate();
                },
                format: function (date, format, isUTC) {
                    isUTC = typeof isUTC == 'undefined' ? false : isUTC;
                    date = isUTC ? dateUtility.utc(date) : dateUtility(date);
                    if (!date.isValid()) {
                        return null;
                    }
                    return format ? date.format(format.toUpperCase()) : date;
                },
                difference: function (date1, date2, datepart) {
                    date1 = dateUtility(date1);
                    date2 = dateUtility(date2);
                    if (!date1.isValid() || !date2.isValid()) {
                        return null;
                    }
                    return date1.diff(date2, datepart);
                },
                isValid: function (date) {
                    return dateUtility(date).isValid();
                },
                fromNow: function (date, removeSuffix) {
                    return dateUtility(date).fromNow(removeSuffix);
                },
                getDate: function (date) {
                    date = dateUtility(date);
                    if (!date.isValid()) {
                        return null;
                    }
                    date = date.add(5, 'hour').toDate();
                    date = dateUtility(date);
                    var newData = date.format('L');
                    return newData;
                },
                fndate: function (date) {
                    date = dateUtility(date);
                    if (!date.isValid()) {
                        return null;
                    }
                    return date.toDate();
                }
            },
            createResource: function createResource(url, httpAction, params) {
                var callbackUrlParams = '?alt=:alt&method=:callback';
                if (httpAction === 'GET') {
                    httpAction = 'JSONP';
                }
                else {
                    callbackUrlParams = '';
                }

                return $resource(url + callbackUrlParams, callbackUrlParams ? { alt: 'json', callback: 'JSON_CALLBACK' } : null,
                {
                    execute: {
                        method: httpAction, params:params,headers: [
                            { 'Content-Type': 'application/json' },
                            { 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' }]
                    }, isArray: false
                });
            },
            getHashCode: function (inputParams) {
                return JSON.stringify(inputParams);
            },
            getInstance: function (instanceName) {
                return instanceName ? this.cloneDeep($injector.get(instanceName)) : null;
            },
            getDataAdapterInstance: function (dataAdapterSettings) {
                var dataAdapterFactory, defaultDataAdapterFactory = 'dataAdapterFactory', dataAdapterInstance = {}, parent = this;
                if (!dataAdapterSettings) {
                    return;
                }
                Object.keys(dataAdapterSettings).forEach(function (dataAdapterSettingKey) {
                    var dataAdapterSetting = dataAdapterSettings[dataAdapterSettingKey];
                    dataAdapterSetting.dataAdapterFactory = dataAdapterSetting.dataAdapterFactory || defaultDataAdapterFactory;
                    dataAdapterFactory = $injector.get(dataAdapterSetting.dataAdapterFactory);
                    if (dataAdapterFactory) {
                        dataAdapterInstance[dataAdapterSettingKey] = parent.cloneDeep(dataAdapterFactory.getInstance(dataAdapterSetting));
                    }
                });
                return dataAdapterInstance;
            },
            stripHtml: function (str, replaceStr) {
                return str ? str.replace(/(<([^>]+)>)/ig, (replaceStr ? replaceStr : '')) : str;
            },
            setStatusMessage: function (message) {
                statusMessage = message;
            },
            getStatusMessage: function () {
                return statusMessage;
            },
            getPopOverInformation: function (e) {
                angular.element('[data-toggle="popover"]').popover('show');
                angular.forEach(angular.element('[data-toggle="popover"]'), function (value, key) {
                    if (!angular.element(value).is(e.target)
                        && angular.element(value).has(e.target).length === 0
                        && angular.element('.popover').has(e.target).length === 0) {
                        angular.element(value).popover('hide');
                    }
                });
            },
            getLandingPage: function (siteConfig) {
                var homePage = { page: 'home.landing.report', url: 'home' };
                var landingpage = utility.filter(siteConfig, function (config) {
                    return config.landingPage == true;
                });
                if (!utility.isUndefined(landingpage) && landingpage.length > 0) {
                    var reportingContainer = utility.filter(landingpage[0].layout.sections, function (section) {
                        return section.widget.name == "reportingContainer";
                    });
                    if (!utility.isUndefined(reportingContainer) && reportingContainer.length > 0) {
                        homePage.page = landingpage[0].layout.name + '.' + landingpage[0].name + '.' + reportingContainer[0].widget.layout.name;
                        homePage.url = landingpage[0].name
                    } else {
                        homePage.page = landingpage[0].layout.name + '.' + landingpage[0].name;
                        homePage.url = landingpage[0].name
                    }
                }
                return homePage;
            },
            getPageState: function (siteConfig) {
                var pageURL = 'home.landing.report';
                var reportingContainer = utility.filter(siteConfig.layout.sections, function (section) {
                    return section.widget.name == "reportingContainer";
                });
                if (!utility.isUndefined(reportingContainer) && reportingContainer.length > 0) {
                    pageURL = siteConfig.layout.name + '.' + siteConfig.name + '.' + reportingContainer[0].widget.layout.name;
                } else {
                    pageURL = siteConfig.layout.name + '.' + siteConfig.name;
                }
                return pageURL;
            },
            toasterOption: function () {
                return "{'time-out': 3000,'show-duration':3000, 'close-button':true,'position-class': 'toast-top-full-width'}";
            },
            statusMessage: function (type, message) {
                if (type == 'success') {
                    return toaster.success({ title: "Success", body: message });
                }
                else if (type == 'error') {
                    return toaster.error(type, message);
                }
                else if (type == 'info') {
                    return toaster.info(type, message);
                }

            },
            dataofdate: function (dod) {
                var digits = [];
                digits = ("" + dod).split("");
                var year = digits[0] + "" + digits[1] + "" + digits[2] + "" + digits[3];
                var month = digits[4] + "" + digits[5];
                var day = digits[6] + "" + digits[7];
                return month + "/" + day + "/" + year;
            },
            setClose: function (msg) {
                closemsg = msg
            },
            getClose: function () {
                return closemsg;
            },
            elementSetClose: function (msg) {
                closemsg = msg
            },
            elementGetClose: function () {
                return closemsg;
            },
            trackPage: function (pageObject, state, cutomObject) {
                var pageDetails = utility.find(pageObject, function (page) {
                    return page.appUrl == state;
                });
                if (pageDetails) {
                    Analytics.trackPage(pageDetails.name, pageDetails.displayName, { dimension1: cutomObject.clientName, dimension2: cutomObject.roleName, dimension3: cutomObject.profile.firstName + ' ' + cutomObject.profile.lastName });
                }
            },
            trackEvent: function (eventCategory, eventAction, eventLabel, cutomObject) {
                Analytics.trackEvent(eventCategory, eventAction, eventLabel, { dimension1: cutomObject.clientName, dimension2: cutomObject.roleName, dimension3: cutomObject.profile.firstName + ' ' + cutomObject.profile.lastName });
            },
            isInView: function (element, options) {
                var $win = angular.element($window);
                /*jshint -W106*/
                var $element = $(element);

                if (!$element.is(':visible')) {
                    return false;
                }

                var window_left = $win.scrollLeft(),
                    window_top = $win.scrollTop(),
                    offset = $element.offset(),
                    left = offset.left,
                    top = offset.top;

                options = $.extend({ topoffset: 0, leftoffset: 0 }, options);

                if (top + $element.height() >= window_top && top - options.topoffset <= window_top + $win.height() &&
                    left + $element.width() >= window_left && left - options.leftoffset <= window_left + $win.width()) {
                    return true;
                } else {
                    return false;
                }
            },           
            granularityDates: function (granularity, weekStartDay, date) {
                var sDate, eDate, tempDate = utility.isUndefined(date) ? new Date() : new Date(date);;
                switch (granularity) {
                    case "monthly":
                        sDate = new Date(tempDate.getFullYear(), tempDate.getMonth(), 1);
                        eDate = new Date(tempDate.getFullYear(), tempDate.getMonth() + 1, 0);
                        break;
                    case "weekly":
                        sDate = tempDate;
                        switch (weekStartDay) {
                            case 1:
                                sDate.setDate(sDate.getDate() - (sDate.getDay() + 6) % 7);
                                break;
                            case 6:
                                sDate.setDate(sDate.getDate() - (sDate.getDay() + 8) % 7);
                                break;
                            default:
                                sDate.setDate(sDate.getDate() - (sDate.getDay() + 7) % 7);
                        }
                        sDate.setDate(sDate.getDate() - 7);
                        eDate = new Date(sDate);
                        eDate.setDate(sDate.getDate() + 6);
                        break;
                    default:
                        sDate = tempDate;
                        sDate.setDate(sDate.getDate() - 1);
                        var month = sDate.getMonth() + 1;
                        var day = sDate.getDate();
                        eDate = new Date((month < 10 ? '0' : '') + month + '/' + (day < 10 ? '0' : '') + day + '/' + sDate.getFullYear());
                        sDate = eDate;
                }
                return { startDate: sDate, endDate: eDate };
            }
        }
    }]);
}(app));