(function (angularApp) {
    if (!angularApp || !angularApp.controllerProvider) {
        return;
    }
    angularApp.controllerProvider.register('graphCtrl', ['$scope', 'mediatorService', '$state', 'controllerConfig', 'utilityService', 'graphTransformations', 'graphEventSubscriptions', 'appConstants','$location',
        function ($scope, mediatorService, $state, controllerConfig, utilityService, graphTransformations, graphEventSubscriptions, appConstants, $location) {
            var dataAdapter, dataAdapterObj, args = arguments, selectedGranularity = 'daily';
            $scope.init = function () {
                mediatorService.configure($scope);
                configureController();
            };
            $scope.dataBind = function () {
                var params = $scope.getParams();
                if (dataAdapter) {
                    if (params) {
                        $scope.inProgress = true;
                        dataAdapter.getData(params).then(function (response) {
                            $scope.dataLength = response.result ? 1 : 0;
                            $scope.chartConfig = dataAdapter.transformation ? dataAdapter.transformation(response.result.data, params) : response.result.data;
                        })
                        .finally(function () {
                            $scope.inProgress = false;
                        });
                    }
                }
            };
            $scope.$on('$destroy', function () {
                $scope.destroy();
            });
            $scope.destroy = function () {
                mediatorService.unsubscribe($scope.subscriberId);
            };
            $scope.reset = function () {
                $scope.event = {};
                $scope.isEventSubmited = false;
            };
            $scope.reset();
            $scope.metricsOnChange = function () {
                mediatorService.publishEvent({ eventName: appConstants.eventsList.graph.metricOnChange, data: getFilter() });
                $scope.dataBind();
                $scope.reset();
            }
            $scope.quickViewOnChange = function () {
                mediatorService.publishEvent({ eventName: appConstants.eventsList.graph.quickViewOnChange, data: getFilter() });
                $scope.dataBind();
                $scope.reset();
            }

            $scope.bindGraphMetrics = function () {
                var tmpGranularity = selectedGranularity;
                if ($scope.ctrlParameters) {
                    if ($scope.ctrlParameters.granularity) {
                        tmpGranularity = $scope.ctrlParameters.granularity;
                    }
                }else {
                    utilityService.forEach(controllerConfig.data.granularity, function (granularity) {
                        if (granularity.isDefault) tmpGranularity = granularity.name;
                    });
                }

                $scope.resultControllerConfig = utilityService.find(controllerConfig.data.granularity, function (granularity) {
                    return granularity.name == tmpGranularity;
                });
                if ($scope.resultControllerConfig) {
                    if ($scope.resultControllerConfig.metaData.metrics) {
                        $scope.resultControllerConfig.metaData.metrics.selected = $scope.resultControllerConfig.metaData.metrics[0].id;
                    }
                    if ($scope.resultControllerConfig.metaData.quickView) {
                        $scope.resultControllerConfig.metaData.quickView.selected = $scope.resultControllerConfig.metaData.quickView[0].value;
                    }

                    if (dataAdapter) {
                        var transformationPrefix = 'trns.'
                        dataAdapter.transformation = graphTransformations[transformationPrefix + controllerConfig.dataAdapter];
                    }
                }
            }

            function configureController() {
                var key, childKey;
                if (!controllerConfig) {
                    return;
                }

                graphTransformations.register(this, args, controllerConfig.data);
                dataAdapter = utilityService.getDataAdapterInstance(controllerConfig.dataAdapterSettings);

                setupConfigData(controllerConfig.data);
                graphEventSubscriptions.register(this, args, controllerConfig.eventSubscriptions);
                $scope.bindGraphMetrics();
            }
            function setupConfigData(configData) {
                if (!configData) {
                    return;
                }
            }

            function getFilter() {
                var filterParams = {};
                if ($scope.resultControllerConfig) {
                    if ($scope.resultControllerConfig.metaData.metrics) {
                        filterParams.metricId = $scope.resultControllerConfig.metaData.metrics.selected;
                    }
                    if ($scope.resultControllerConfig.metaData.quickView) {
                        filterParams.quickView = $scope.resultControllerConfig.metaData.quickView.selected;
                    }
                }
                if ($scope.ctrlParameters) {
                    if ($scope.ctrlParameters.date) {
                        filterParams.date = $scope.ctrlParameters.date;
                    }
                    if ($scope.ctrlParameters.granularity) {
                        filterParams.granularity = $scope.ctrlParameters.granularity;
                    }
                    if ($scope.ctrlParameters.filters) {
                        filterParams.filters = $scope.ctrlParameters.filters;
                    }
                }
                return filterParams;
            }

            $scope.getParams = function () {
                var params = {
                    client: $scope.user.client,
                    pageName: $location.path(),
                    clearCache: $scope.ctrlParameters.clearCache ? true : false
                };
                if ($scope.ctrlParameters) {
                    if ($scope.ctrlParameters.date) {
                        if ($scope.ctrlParameters.granularity) {
                            var mDate = $scope.ctrlParameters.date.split('-');
                            if (mDate.length == 2) {
                                params.reportDate = mDate[0] + '-' + '01' + '-' + mDate[1];
                            } else {
                                params.reportDate = $scope.ctrlParameters.date;
                            }
                        }
                    }
                    if ($scope.ctrlParameters.granularity) {
                        params.granularity = $scope.ctrlParameters.granularity;
                    }
                    if ($scope.ctrlParameters.filters) {
                        params.filters = $scope.ctrlParameters.filters;
                    }
                    if ($scope.ctrlParameters.metricId) {
                        params.metricId = $scope.ctrlParameters.metricId;
                    } else {
                        params.metricId = ($scope.resultControllerConfig && $scope.resultControllerConfig.metaData.metrics) ? $scope.resultControllerConfig.metaData.metrics.selected : "";
                    }
                    if ($scope.ctrlParameters.quickView) {
                        params.quickView = $scope.ctrlParameters.quickView;
                    } else {
                        params.quickView = ($scope.resultControllerConfig && $scope.resultControllerConfig.metaData.quickView) ? $scope.resultControllerConfig.metaData.quickView.selected : "";
                    }
                } else {
                    params.reportDate = utilityService.date.format(utilityService.date.add(Date.now(), -1, 'days'), 'YYYY-MM-DD');
                    params.granularity = selectedGranularity;
                    params.filters = [];
                    params.metricId = ($scope.resultControllerConfig && $scope.resultControllerConfig.metaData.metrics) ? $scope.resultControllerConfig.metaData.metrics.selected : "";
                    params.quickView = ($scope.resultControllerConfig && $scope.resultControllerConfig.metaData.quickView) ? $scope.resultControllerConfig.metaData.quickView.selected : "";
                }
                return params;
            }

            $scope.init();
        }]);
}(app));