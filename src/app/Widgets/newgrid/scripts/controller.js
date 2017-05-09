(function (angularApp) {
    if (!angularApp || !angularApp.controllerProvider) {
        return;
    }
    var gridIndex = -1; /* This is global variable for grid index*/
    angularApp.controllerProvider.register('gridCtrl', ['$scope', 'mediatorService', '$state', 'controllerConfig', 'appConstants', 'utilityService', 'gridEventSubscriptions', 'uiGridConstants', 'gridDataSettings','$location',
        function ($scope, mediatorService, $state, controllerConfig, appConstants, utilityService, gridEventSubscriptions, uiGridConstants, gridDataSettings,$location) {
            var dataAdapter, args = arguments,
                selectedGranularity = 'daily';
            $scope.init = function () {
                mediatorService.configure($scope);
                configureController();
            };
            $scope.dataBind = function () {
                angular.element('[data-toggle="popover"]').popover('hide');
                var params = $scope.getParams(controllerConfig.dataAdapterSettings.getData.defaultParams);
                if (dataAdapter && params) {
                    $scope.inProgress = true;
                    gridIndex += 1;
                    var currentGridIndex = utilityService.cloneDeep(gridIndex);
                    if (gridIndex >= angular.element(".grid-progess").parent().length - 1) {
                        gridIndex = -1;
                    }
                    dataAdapter.getData(params).then(function (response) {
                        $scope.data = dataAdapter.transformation ? dataAdapter.transformation(response.result.data, params) : response.result.data;
                        if (($scope.data) && (angular.element(".ui-grid")[currentGridIndex])) {
                            var rowheight = ($scope.dataSource.enablePaginationControls) ? 80 : 45;
                            if (($scope.dataSource.enablePaginationControls) && ($scope.data.length > $scope.dataSource.paginationPageSize)) {
                                angular.element("." + angular.element(".ui-grid")[currentGridIndex].className.replace(/\s/g, '.')).css({
                                    "height": (($scope.dataSource.paginationPageSize * 50) + rowheight) + 'px',
                                    "margin-bottom": '10px'
                                });
                            } else {
                                angular.element("." + angular.element(".ui-grid")[currentGridIndex].className.replace(/\s/g, '.')).css({
                                    "height": (($scope.data.length * 50) + rowheight) + 'px',
                                    "margin-bottom": '10px'
                                });
                            }
                            $scope.dataSource.data = $scope.data;
                            formatData($scope.dataSource);
                        }
                    }).finally(function () {
                        $scope.inProgress = false;
                    });
                }
            };
            $scope.destroy = function () {
                mediatorService.unsubscribe($scope.subscriberId);
            };
            $scope.$on('$destroy', function () {
                $scope.destroy();
            });

            function configureController() {
                if (!controllerConfig) {
                    return;
                }
                dataAdapter = utilityService.getDataAdapterInstance(controllerConfig.dataAdapterSettings);
                gridEventSubscriptions.register(this, args, controllerConfig.eventSubscriptions);
                $scope.getControllerConfig();
            }

            function setupConfigData(configData) {
                if (!configData) {
                    return;
                }
                configData = utilityService.cloneDeep(configData);
                $scope.dataSource = {};
                if (configData.gridOption) {
                    $scope.dataSource.enableSorting = configData.gridOption.enableSorting;
                    $scope.dataSource.enablePagination = configData.gridOption.enablePaging;
                    $scope.dataSource.enablePaginationControls = configData.gridOption.enablePaging;
                    $scope.dataSource.paginationPageSizes = configData.gridOption.paginationPageSizes;
                    $scope.dataSource.paginationPageSize = configData.gridOption.paginationPageSize;
                    $scope.dataSource.enableGridMenu = configData.gridOption.enableGridMenu;
                    $scope.dataSource.enableFiltering = configData.gridOption.enableFiltering;
                    $scope.dataSource.enableHorizontalScrollbar = configData.gridOption.enableHorizontalScrollbar;
                    $scope.dataSource.enableVerticalScrollbar = configData.gridOption.enableVerticalScrollbar;
                    $scope.dataSource.exporterCsvFilename = configData.gridOption.exporterCsvFilename;
                    toolTip(configData.gridOption);
                    $scope.dataSource.columnDefs = configData.gridOption.columnDefs;                   
                    $scope.dataSource.gridMenuShowHideColumns = false;
                    $scope.dataSource.enableColumnMenus = false;
                    $scope.dataSource.enableExpandable = false;
                    $scope.dataSource.enableExpandableRowHeader = false;
                    $scope.dataSource.rowHeight = 50;
                    $scope.dataSource.height = 0;
                }
            }

           
            $scope.popOverInformation = function (e) {
                utilityService.getPopOverInformation(e);
            }

            $scope.getControllerConfig = function () {
                var tmpGranularity = selectedGranularity;

                if (controllerConfig.data.granularity.length > 0) {
                    tmpGranularity = controllerConfig.data.granularity[0].name;
                }

                if ($scope.ctrlParameters) {
                    if ($scope.ctrlParameters.granularity) {
                        tmpGranularity = $scope.ctrlParameters.granularity;
                    }
                }

                $scope.filterType = controllerConfig.data.filterType;
                var resultControllerConfig = utilityService.find(controllerConfig.data.granularity, function (granularity) {
                    return granularity.name == tmpGranularity;
                });

                if (resultControllerConfig) {
                    $scope.dataSettngsGranularity = tmpGranularity;
                    setupConfigData(resultControllerConfig);
                    gridDataSettings.register(this, args);
                }
            };

            function setDefaultParams(defaultParams, params) {
                var key, newParams = {};
                if (!defaultParams) {
                    return params;
                }
                if (params) {
                    newParams = utilityService.cloneDeep(params);
                    for (key in defaultParams) {
                        newParams[key] = defaultParams[key];
                    }
                }
                return newParams;
            }

            $scope.getParams = function (defaultParams) {
                var params = {
                    client: $scope.user.client,
                    pageName: $location.path(),
                    clearCache: $scope.ctrlParameters.clearCache ? true : false
                };
                params = setDefaultParams(defaultParams, params);
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
                    } else {
                        params.reportDate = utilityService.date.format(utilityService.date.add(Date.now(), -1, 'days'), 'YYYY-MM-DD');
                    }
                    if ($scope.ctrlParameters.granularity) {
                        params.granularity = $scope.ctrlParameters.granularity;
                    } else {
                        params.granularity = selectedGranularity;
                    }
                    if ($scope.ctrlParameters.filters) {
                        params.filters = $scope.ctrlParameters.filters;
                    }
                    if ($scope.ctrlParameters.standardDeviation) {
                        params.standardDeviation = $scope.ctrlParameters.standardDeviation;
                    }
                    if ($scope.ctrlParameters.minFlightSearches) {
                        params.minFlightSearches = $scope.ctrlParameters.minFlightSearches;
                    }
                    if ($scope.ctrlParameters.flightSearchChange) {
                        params.flightSearchChange = $scope.ctrlParameters.flightSearchChange;
                    }
                } else {
                    params.reportDate = utilityService.date.format(utilityService.date.add(Date.now(), -1, 'days'), 'YYYY-MM-DD');
                    params.granularity = selectedGranularity;
                    params.filters = [];
                }
                if ($scope.filterType) {
                    params.filterType = $scope.filterType;
                }
                return params;
            };

            function formatData(dataSource) {
                if (dataSource) {
                    utilityService.forEach(dataSource.columnDefs, function (columnDef, index) {
                        if (columnDef.cellFilter && columnDef.cellFilter.indexOf('Formatter') > 0) {
                            columnDef.cellClass = function (grid, row, col, rowRenderIndex, colRenderIndex) {
                                if (grid.getCellValue(row, col) < 0) {
                                    return 'grid-number-align-nagative';
                                } else {
                                    return 'grid-number-align';
                                }
                            };
                        }
                    });
                }
            }

            
            function toolTip(dataSource) {
                if (dataSource) {
                    utilityService.forEach(dataSource.columnDefs, function (columnDef, index) {
                        columnDef.headerTooltip = columnDef.displayName;
                        if (columnDef.cellFilter == '') {
                            columnDef.cellTooltip = true;
                        } else if(columnDef.cellFilter =='hyperlink'){
                            columnDef.cellTemplate = '<div ng-show="row.entity.url" class="ui-grid-cell-contents"><a data-ng-href={{row.entity.url}} title="{{ COL_FIELD }}" target="_blank">{{ COL_FIELD }}</a></div><div class="ui-grid-cell-contents" ng-show="!row.entity.url">{{ COL_FIELD }}</div>';
                            columnDef.cellFilter= 'string';
                        } else if (columnDef.cellFilter == 'descriptionpopup') {
                            columnDef.cellTemplate = '<div class="ui-grid-cell-contents"><a class="pop-content" data-toggle="popover" data-container="body" data-ng-click="grid.appScope.popOverInformation($event);" title="{{ COL_FIELD }}" data-content="{{row.entity.description}}">{{ COL_FIELD }}</a></div>';
                        }
                    });
                }
            }
            $scope.init();
        }
    ]);
}(app));