(function (angularApp) {
    if (!angularApp || !angularApp.provide) {
        return;
    }
    angularApp.provide.service('gridDataSettings', ['appConstants', 'utilityService', function (appConstants, utilityService) {
        this.register = function (callee, calleeArgs) {
            var scope = calleeArgs[0],
                mediatorService = calleeArgs[1],
                controllerConfig = calleeArgs[3],
                gridDataSettings = {},
                dataSettings = { drilldown: 'drilldown' },
                expandableRowTemplate = '/widgets/newgrid/templates/expandablerowtemplate.html',
                enableRowSelection = true,
                subGridRowHeight = 50,
                expandableRowHeight = 0;
            scope.expandSubGrid = 0;
            if (!scope) {
                return;
            }

            gridDataSettings[dataSettings.drilldown] = function (dataSetting) {
                if (!scope.dataSource) {
                    return;
                }
                scope.VerticalScrollbar = scope.dataSource.enableVerticalScrollbar;
                scope.dataSource.enableExpandable = true;
                scope.dataSource.enableExpandableRowHeader = true;
                scope.dataSource.expandableRowTemplate = expandableRowTemplate;
                scope.dataSource.onRegisterApi = function (gridApi) {
                    var testgridHeight = [];
                    gridApi.expandable.on.rowExpandedStateChanged(scope, function (row) {
                        var granularityControllerConfig = utilityService.find(controllerConfig.data.granularity, function (granularity) {
                            return granularity.name == scope.dataSettngsGranularity;
                        });
                        var dataAdapter2 = utilityService.getDataAdapterInstance(controllerConfig.dataAdapterSettings), params = scope.getParams();
                        if (row.isExpanded) {
                            row.entity.subGridOptions = {
                                enableExpandableRowHeader: false,
                                enableExpandable: false,
                                showHeader: false,
                                rowHeight: subGridRowHeight,
                                columnDefs: granularityControllerConfig.gridOption.columnDefs
                            };
                            toolTip(row.entity.subGridOptions);
                            params.drilldown = true;
                            utilityService.forEach(row.entity.subGridOptions.columnDefs, function (colDef) {
                                if (colDef.key) {
                                    params.filters.push({ name: colDef.field, value: row.entity[colDef.field] });
                                }
                            });

                            if (dataAdapter2 && params) {
                                scope.inProgress = true;
                                dataAdapter2.getData(params).then(function (response) {
                                    scope.dataSource.expandableRowHeight = subGridRowHeight * response.result.data.length;
                                    row.grid.options.expandableRowHeight = scope.dataSource.expandableRowHeight;
                                    row.entity.subGridOptions.excessRows = response.result.data.length;
                                    angular.element(".grid" + row.grid.id).css({ "height": (angular.element(".grid" + row.grid.id).height() + scope.dataSource.expandableRowHeight) + 'px' });
                                    row.entity.subGridOptions.data = dataAdapter2.transformation ? dataAdapter2.transformation(response.result.data, params) : response.result.data;
                                    formatData(row.entity.subGridOptions);
                                })
                                .finally(function () {
                                    scope.inProgress = false;
                                });
                            }
                        }
                        else {
                            angular.element(".grid" + row.grid.id).css({ "height": (angular.element(".grid" + row.grid.id).height() - (subGridRowHeight * row.entity.subGridOptions.data.length)) + 'px' });
                        }
                    });
                }
            };


            if (controllerConfig.data.dataSettings && controllerConfig.data.dataSettings.length > 0) {
                utilityService.forEach(controllerConfig.data.dataSettings, function (dataSetting) {
                    if (gridDataSettings[dataSetting]) {
                        gridDataSettings[dataSetting](dataSetting);
                    }
                });
            }

            function formatData(dataSource) {
                if (dataSource) {
                    utilityService.forEach(dataSource.columnDefs, function (columnDef, index) {
                        if (columnDef.cellFilter) {
                            if (columnDef.cellFilter.indexOf('Formatter') > 0) {
                                columnDef.cellClass = function (grid, row, col, rowRenderIndex, colRenderIndex) {
                                    if (grid.getCellValue(row, col) < 0) {
                                        return 'grid-number-align-nagative';
                                    } else {
                                        return 'grid-number-align';
                                    }
                                }
                            }
                        }
                    });
                }
            }

            function toolTip(dataSource) {
                if (dataSource) {
                    utilityService.forEach(dataSource.columnDefs, function (columnDef, index) {
                        if (columnDef.cellFilter == '') {
                            columnDef.cellTooltip = true;
                        }
                    });
                }
            }
        };
    }]);
}(app));