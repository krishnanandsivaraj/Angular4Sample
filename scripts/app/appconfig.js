var app = angular.module('app', ['ui.router', 'ui.bootstrap', 'jmdobry.angular-cache', 'ngGrid', 'ngResource', 'ngCookies', 'ui.grid', 'ui.grid.selection', 'ui.grid.exporter', 'ui.grid.pagination', 'ui.grid.expandable', 'multi-select', 'timepickerPop', 'ngSanitize', 'toaster', 'mgo-angular-wizard', 'angAccordion', 'highcharts-ng', 'ui.grid.autoResize', 'angular-google-analytics', 'pageslide-directive']);

app.config(['$urlRouterProvider', '$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$stateProvider','AnalyticsProvider',
    function ($urlRouterProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $stateProvider, AnalyticsProvider) {
        app.controllerProvider = $controllerProvider;
        app.compileProvider = $compileProvider;
        app.urlRouteProvider = $urlRouterProvider;
        app.filterProvider = $filterProvider;
        app.provide = $provide;
        app.stateProvider = $stateProvider;
        AnalyticsProvider.setAccount('UA-70286111-1');
        AnalyticsProvider.trackPages(true);
        AnalyticsProvider.setDomainName('tapestrykpi.com');
        AnalyticsProvider.useAnalytics(true);
    }]);

app.run(['$angularCacheFactory', 'siteConfigService', 'Analytics', function ($angularCacheFactory, siteConfigService) {
    app.appCache = $angularCacheFactory('appCache', {
        // Items added to this cache expire after 30 minutes
        maxAge: 1800000,

        // Items will be actively deleted when they expire
        deleteOnExpire: 'aggressive',

        // This cache will check for expired items once every 15 minutes
        recycleFreq: 900000,

        // This cache will clear itself every 1 hour
        // Give it a value of 1 if you are debugging the application and want to disable client side caching temporarily
        //3600000
        cacheFlushInterval: 3600000,

        // This cache will sync itself with localStorage
        storageMode: 'localStorage',

        // Full synchronization with localStorage on every operation
        verifyIntegrity: true
    });

    siteConfigService.configureSite({});
}]);

function endsWith(stringToSearchFor, stringToBeSearched) {
    return stringToSearchFor.indexOf(stringToBeSearched, stringToSearchFor.length - stringToBeSearched.length) !== -1;
}

// Start: UI-router setup
// Utility function to lazy load reference files for each widget
var lastLoadedFilePaths = [], currentRenderingID;
function loadFiles($q, $scope, $timeout, filePaths) {
    var uniqueFilePaths = [], newFilePaths = [], deferred, headElement = $('head');
    if (!$q || !$scope || !$timeout || !filePaths) {
        return;
    }

    $.each(filePaths, function (i, filePath) {
        if ($.inArray(filePath, uniqueFilePaths) === -1) {
            uniqueFilePaths.push(filePath);
        }
    });

    if (!lastLoadedFilePaths) {
        lastLoadedFilePaths = [];
        newFilePaths = uniqueFilePaths;
    }
    else {
        $.each(uniqueFilePaths, function (i, filePath) {
            var lnkForCurrentCssFilePath = $("link[data-dynamic-css][href='" + filePath + "']");
            if (endsWith(filePath, '.css')) {
                if (!lnkForCurrentCssFilePath.length) {
                    headElement.append("<link data-dynamic-css='" + currentRenderingID + "' href='" + filePath + "' rel='stylesheet' />");
                }
                else {
                    if (currentRenderingID) {
                        lnkForCurrentCssFilePath.attr('data-dynamic-css', currentRenderingID);
                    }
                }
            }
        });
        setTimeout(function () {
            if (currentRenderingID) {
                $("link[data-dynamic-css][data-dynamic-css!='" + currentRenderingID + "']").remove();
            }
        }, 1000);

        $.each(uniqueFilePaths, function (i, filePath) {
            if (endsWith(filePath, '.js') && $.inArray(filePath, lastLoadedFilePaths) === -1) {
                newFilePaths.push(filePath);
            }
        });
    }

    lastLoadedFilePaths = lastLoadedFilePaths.concat(newFilePaths);

    deferred = $q.defer();
    if (!newFilePaths || newFilePaths.length === 0) {
        deferred.resolve();
    }
    else {
        // Load the dependencies
        $script(newFilePaths, function () {
            // all dependencies have now been loaded by so resolve the promise
            $timeout(function () {
                $scope.$apply(function () {
                    deferred.resolve();
                });
            });
        });
    }
    return deferred.promise;
}

var checkLoggedin = function ($resource, $q, $timeout, $rootScope, $state, $cookieStore, servicesConfig) {
    function createResource(url) {
        return $resource(url + '?alt=:alt&method=:callback',
        { alt: 'json', callback: 'JSON_CALLBACK' },
        {
            get: {
                method: 'JSONP', headers: [
                    { 'Content-Type': 'application/json' },
                    { 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' }]
            }, isArray: false
        });
    }

    var deferred = $q.defer();
    createResource(servicesConfig.services.baseUrl + 'authentication/getloggedinuser').get(
    function processResponse(response) {
        if (response.success && response.result) {
            var userObj = $cookieStore.get("users");
            if (userObj == false) {
                $rootScope.user = response.result;
            } else {
                $rootScope.user = $cookieStore.get("users");
            }
            deferred.resolve();
        }
        else {
            $state.go('login');
            deferred.reject();
        }
    }, function () {
        $state.go('login');
        deferred.reject();
    });

    return deferred.promise;
};

// Start: Application configuration setup
app.constant('servicesConfig', {
    services: {
        //baseUrl: 'https://v2services.tapestrykpi.com/'
        baseUrl: 'http://localhost:7000/'
    },
    clusterController: {
        //baseUrl: 'https://v2cluster.tapestrykpi.com/'
        baseUrl: 'http://localhost:8000/'
    }
});

app.constant('appConstants', {
    appConfig: {
        brandName: 'Tapestry',
        brandLogoUrl: '',
        appName: ''
    },
    eventsList: {
        login: {
            successful: 'login.successful'
        },
        filter: {
            onLoad: 'filter.onLoad',
            OnChange: 'filter.OnChange'
        },
        granularity: {
            onClick: 'granularity.click',
            calendarChange: 'granularity.calendarChange'
        },
        graph: {
            quickViewOnChange: 'graph.quickViewOnChange',
            metricOnChange: 'graph.metricOnChange'
        },
        alertSettings: {
            onLoad: 'alertSettings.onLoad',
            onApply: 'alertSettings.onApply',
            onSave: 'alertSettings.onSave'
        },
        event: {
            onAddEvent: 'event.onAddEvent'
        },
        cache: {
            onClick: 'cache.click'
        }
    },
    formatStrings: {
        number: {
            wholeNumber: '0,0',
            decimal: '0,0.00',
            percentage: '0,0%',
            percentagedecimal: '0,0.00%'
        },
        currency: {
            dollar: '$0,0',
            decimal: '$0,0.00'
        },
        date: {
            US: 'MM/DD/YYYY'
        },
        convert: {
            wholeNumber: '0,0a',
            decimal: '0,0.00a',
            percentage: '0,0a%',
            percentagedecimal: '0,0.00a%'
        }
    }
});

// Start: UI-router setup
app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('login');
    $stateProvider.state('login', {
        resolve: {
            loadFiles: ['$q', '$rootScope', '$timeout', function ($q, $rootScope, $timeout) {
                currentRenderingID = (new Date().getTime()).toString();
                lastLoadedFilePaths = [];
                var filePaths = [
                    '/widgets/login/scripts/controller.js',
                    '/widgets/login/directives/script.js',
                    '/widgets/login/css/style.css'
                ];
                return loadFiles($q, $rootScope, $timeout, filePaths);
            }],
            controllerConfig: function () {
                return {
                    dataAdapterSettings: {
                        login: {
                            name: 'authentication.login',
                            endpoint: 'authentication/login',
                            disableCache: true
                        },
                        sharedReports: {
                            name: 'authentication.sharedReports',
                            endpoint: 'authentication/sharedReports',
                            disableCache: true
                        }
                    }
                };
            }
        },
        url: '/login',
        templateUrl: '/widgets/login/templates/template.html',
        controller: 'loginCtrl'
    });

    $stateProvider.state('changepassword', {
        resolve: {
            loadFiles: ['$q', '$rootScope', '$timeout', function ($q, $rootScope, $timeout) {
                currentRenderingID = (new Date().getTime()).toString();
                lastLoadedFilePaths = [];
                var filePaths = [
                    '/widgets/changepassword/scripts/controller.js',
                    '/widgets/changepassword/css/style.css'
                ];
                return loadFiles($q, $rootScope, $timeout, filePaths);
            }],
            controllerConfig: function () {
                return {
                    dataAdapterSettings: {
                        login: {
                            name: 'authentication.login',
                            endpoint: 'authentication/login',
                            disableCache: true
                        },
                        changePassword: {
                            name: 'authentication.changePassword',
                            endpoint: 'authentication/changePassword',
                            disableCache: true
                        }
                    }
                };
            }
        },
        url: '/changepassword/:token',
        templateUrl: '/widgets/changepassword/templates/template.html',
        controller: 'changePasswordCtrl'
    });

    $stateProvider.state('unsubscribe', {
        resolve: {
            loadFiles: ['$q', '$rootScope', '$timeout', function ($q, $rootScope, $timeout) {
                currentRenderingID = (new Date().getTime()).toString();

                lastLoadedFilePaths = [];
                var filePaths = [
                    '/widgets/unsubscribe/scripts/controller.js',
                    '/widgets/unsubscribe/css/style.css'
                ];
                return loadFiles($q, $rootScope, $timeout, filePaths);
            }],
            controllerConfig: function () {
                return {
                    dataAdapterSettings: {
                        unsubscribe: {
                            name: 'emailBlast.unSubscribeUser',
                            endpoint: 'emailBlast/unSubscribeUser',
                            disableCache: true
                        }
                    }
                };
            }
        },
        url: '/unsubscribe',
        templateUrl: '/widgets/unsubscribe/templates/template.html',
        controller: 'unsubscribeCtrl',
        authenticate: false
    });

    $stateProvider.state('reportpreview', {
        parent: 'admin.reportingmanagement',
        abstract: true,
        onEnter: ['$modal', '$state', '$modalStack', function ($modal, $state, $modalStack) {
            $modal.open({
                templateUrl: '/layouttemplates/reports/preview.html',
                backdrop: 'static',
                keyboard: false,
                controller: function ($scope) {
                    $scope.closeModal = function () {
                        $state.go('admin.reportingmanagement');
                    };

                    $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                        $modalStack.dismissAll();
                    });
                }
            });
        }]
    });
}]);
// End: UI-router setup

