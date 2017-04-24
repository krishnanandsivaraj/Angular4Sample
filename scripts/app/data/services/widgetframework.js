(function (angularApp) {
    if (!angularApp) {
        return;
    }
    angularApp.factory('widgetframework', ['$resource', '$q', '$http', 'servicesConfig', 'utilityService',
        function ($resource, $q, $http, servicesConfig, utilityService) {
            return {
                saveSection: function (params) {
                    var deferred = $q.defer();
                    var resource = utilityService.createResource(servicesConfig.services.baseUrl + 'widgetframework/savesection', 'POST');
                    resource.execute(params,
                    function processResponse(response) {
                        deferred.resolve(response.result);
                    },
                    function errorHandler(error) {
                        deferred.reject(error);
                    });
                    return deferred.promise;
                },
                addSection: function (params) {
                    var deferred = $q.defer();
                    var resource = utilityService.createResource(servicesConfig.services.baseUrl + 'widgetframework/addsection', 'POST');
                    resource.execute(params,
                    function processResponse(response) {
                        deferred.resolve(response.result);
                    },
                    function errorHandler(error) {
                        deferred.reject(error);
                    });
                    return deferred.promise;
                },
                getSection: function (params) {
                    var deferred = $q.defer();
                    var resource = utilityService.createResource(servicesConfig.services.baseUrl + 'widgetframework/getsection', 'GET');
                    resource.execute(params,
                    function processResponse(response) {
                        deferred.resolve(response.result);
                    },
                    function errorHandler(error) {
                        deferred.reject(error);
                    });
                    return deferred.promise;
                },
                getWidgets: function (params) {
                    var deferred = $q.defer();
                    var resource = utilityService.createResource(servicesConfig.services.baseUrl + 'widgetframework/getwidgets', 'GET');
                    resource.execute(params,
                    function processResponse(response) {
                        deferred.resolve(response.result);
                    },
                    function errorHandler(error) {
                        deferred.reject(error);
                    });
                    return deferred.promise;
                },
                getDataAdapters: function (params) {
                    var deferred = $q.defer();
                    var resource = utilityService.createResource(servicesConfig.services.baseUrl + 'widgetframework/getdataadapters', 'GET');
                    resource.execute(params,
                    function processResponse(response) {
                        deferred.resolve(response.result);
                    },
                    function errorHandler(error) {
                        deferred.reject(error);
                    });
                    return deferred.promise;
                }
            };
        }]);
}(app));