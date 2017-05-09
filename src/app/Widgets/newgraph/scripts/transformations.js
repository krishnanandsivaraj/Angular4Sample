(function (angularApp) {
    if (!angularApp || !angularApp.provide) {
        return;
    }
    angularApp.provide.service('graphTransformations', ['utilityService', function (utilityService) {
        this.register = function (callee, calleeArgs, lstControllerConfig) {
            var scope = calleeArgs[0], mediatorService = calleeArgs[1], controllerConfig = calleeArgs[3], parent = this, vPrefix = '', vSuffix = '';
            if (!scope) {
                return;
            }
           
            function getChartObject(transformedData) {
                var resultControllerConfig = utilityService.find(controllerConfig.data.granularity, function (granularity) {
                    return granularity.name == scope.ctrlParameters.granularity;
                });

                if (resultControllerConfig) {
                    var metricConfig = utilityService.find(resultControllerConfig.metaData.metrics, function (metric) {
                        return transformedData[0].Title.toLowerCase() == metric.displayName.toLowerCase();
                    });
                    vPrefix = '', vSuffix = '', showLegend = true;
                    if (metricConfig) {
                        if (metricConfig.Prefix) {
                            vPrefix = metricConfig.Prefix;
                        }
                        if (metricConfig.Suffix) {
                            vSuffix = metricConfig.Suffix;
                        }
                        if (metricConfig.showLegend  != undefined && metricConfig.showLegend == false) {
                            showLegend = metricConfig.showLegend;
                        }
                    }
                }

                return {
                    options: {
                        chart: {
                            type: resultControllerConfig.metaData.graphType[0].value
                        },
                        navigator: {
                            enabled: false
                        },
                        scrollbar: {
                            enabled: false
                        },
                        legend: (!showLegend) ? {
                            enabled: false
                        } : {
                            align: 'center',
                            verticalAlign: 'bottom'
                        }
                    },
                    yAxis: {
                        title: {
                            text: transformedData[0].Title,
                        }
                    },
                    exporting: {
                        enabled: true
                    },
                    tooltip: {
                        valuePrefix: vPrefix,
                        valueSuffix: vSuffix
                    },
                    xAxis: {
                        categories: transformedData[0].x
                    },
                    series: transformedData[0].y,
                    title: {
                        text: transformedData[0].Title
                    },
                    credits: {
                        enabled: false
                    },
                    loading: false
                };
            }

            
            function transform(cacheKey, rawData, params) {                
                var transformedData = [], chartData;
                if (rawData) {
                    utilityService.forEach(rawData, function (rwData) {
                        transformedData.push({
                            x: rawData.XaxisLabel, y: rawData.GraphPointsData, Title: rawData.Title
                        });
                    });
                }
                else {
                    transformedData.push({
                        x: "", y: "", Title: "Chart Title"
                    });
                }
                return getChartObject(utilityService.cloneDeep(transformedData));
            }
            parent['trns.' + controllerConfig.dataAdapter] = function (rawData, params) {
                var cacheKey = "";
                return transform(cacheKey, rawData, params);
            }
        };
    }]);
}(app));