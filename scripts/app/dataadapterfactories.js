(function (angularApp) {
    if (!angularApp) {
        return;
    }

    angularApp.factory('dataAdapterFactory', ['$resource', '$q', 'servicesConfig', 'utilityService',
    function ($resource, $q, servicesConfig, utilityService) {
        return {
            getInstance: function (dataAdapterSettings) {
                return function (params) {
                    var deferred = $q.defer(), cacheKey, data, defaultEndpointBaseUrlConfigKey = 'services', defaultHttpAction = 'GET';
                    if (!dataAdapterSettings.disableCache) {
                        cacheKey = dataAdapterSettings.name + utilityService.getHashCode(params);
                        data = angularApp.appCache.get(cacheKey);
                        if (data) {
                            deferred.resolve(data);
                            return deferred.promise;
                        }
                    }
                    dataAdapterSettings.httpAction = dataAdapterSettings.httpAction || defaultHttpAction;
                    dataAdapterSettings.endpointBaseUrlConfigKey = dataAdapterSettings.endpointBaseUrlConfigKey || defaultEndpointBaseUrlConfigKey;
                    utilityService.createResource(servicesConfig[dataAdapterSettings.endpointBaseUrlConfigKey].baseUrl + dataAdapterSettings.endpoint, dataAdapterSettings.httpAction, (dataAdapterSettings.postBody ? null : params)/*dataAdapterSettings.enabledParams ? params : null*/)
                    .execute(params, function processResponse(response) {
                        deferred.resolve(response);
                    }, function errorHandler(error) {
                        deferred.reject(error);
                    });
                    return deferred.promise;
                };
            }
        };
    }]);
}(app));