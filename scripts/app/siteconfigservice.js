(function (angularApp) {
    var siteConfiguration;
    if (!angularApp || !angularApp.service) {
        return;
    }

    angularApp.service('siteConfigService', ['utilityService', '$window', '$state', '$cookieStore', '$location', function (utilityService, $window, $state, $cookieStore, $location) {
        this.configureSite = function (user) {
            var registeredStates = [], cacheKey = 'siteConfig', cachedSiteConfig, reportingContainerID = 'reportingcontainer', reportPreviewKeyword = 'reportpreview';
            if (!user || !user.siteConfig) {
                cachedSiteConfig = angularApp.appCache.get(cacheKey);
                if (!cachedSiteConfig) {
                    return;
                }
                user = { siteConfig: cachedSiteConfig };
            }
            else {
                angularApp.appCache.put(cacheKey, user.siteConfig);
            }

            function findReportingContainer(stateConfig) {
                return (!stateConfig || !stateConfig.layout) ? false : utilityService.find(stateConfig.layout.sections, function (section) {
                    return section.widget.name.toLowerCase() === reportingContainerID;
                });
            }
            function configureState(config, parentStateName, parentAppUrl, isReportingContainerState) {
                var stateName = isReportingContainerState ? (parentStateName + '.' + config.layout.name) : (config.layout.name + '.' + config.name),
                    hasReportingContainer = (!!findReportingContainer(config)), regStateIndex = registeredStates.indexOf(stateName), stateConfig = { views: {} };
                var sharedReport = config.sharedreport ? true : false;

                utilityService.forEach(config.layout.sections, function (section) {
                    if (section.widget && section.widget.name && section.widget.name.toLowerCase() === reportingContainerID) {
                        stateConfig.views[section.name] = { templateUrl: section.widget.layout.templateUrl };
                        if (config.sharedreport) {
                            section.widget.sharedreport = true;
                        }
                        configureState(section.widget, stateName, config.appUrl, true);
                        return true;
                    }

                    stateConfig.views[section.name] = {
                        resolve: {
                            loadFiles: ['$q', '$rootScope', '$timeout', function ($q, $rootScope, $timeout) {
                                var filePaths = section.widget.filePaths || [];
                                if (section.widget.cssFilePaths && section.widget.cssFilePaths.length) {
                                    filePaths = filePaths.concat(section.widget.cssFilePaths);
                                }
                                return loadFiles($q, $rootScope, $timeout, filePaths);
                            }],
                            controllerConfig: function () {
                                var ctrlConfig = { dataAdapterSettings: section.dataAdapterSettings, dataSelectors: section.dataSelectors };
                                if (section.widget.controller) {
                                    ctrlConfig.data = section.widget.controller.data;
                                    ctrlConfig.eventSubscriptions = section.widget.controller.eventSubscriptions;
                                }
                                return ctrlConfig;
                            }
                        },
                        templateUrl: section.widget.templateUrl
                    };
                    if (section.widget.controller) {
                        stateConfig.views[section.name].controller = section.widget.controller.name;
                    }
                });

                if (!parentStateName && stateName.indexOf(reportPreviewKeyword) < 0) {
                    stateConfig.resolve = {
                        loadFiles: function () {
                            currentRenderingID = (new Date().getTime()).toString();
                            lastLoadedFilePaths = [];
                        }
                    };
                }
                if (!isReportingContainerState) {
                    if (!hasReportingContainer) {
                        stateConfig.url = config.appUrl;
                        if (sharedReport) {
                            stateConfig.authenticate = false;
                        } else {
                            stateConfig.resolve.isLoggedIn = checkLoggedin;
                        }
                    }
                } else {
                    stateConfig.url = parentAppUrl;
                    if (sharedReport) {
                        stateConfig.authenticate = false;
                        if (!$location.search().token) {
                            $location.path('login');
                        }
                    } else {
                        stateConfig.resolve = { isLoggedIn: checkLoggedin };
                    }
                }

                if (stateConfig.views && regStateIndex < 0) {
                    registeredStates.push(stateName);
                    angularApp.stateProvider.state(stateName, stateConfig);
                }
            }
            function addReportPreviewStates(siteConfigs) {
                var reportPreviewStates = [], previewKeyword = 'preview';
                if (!siteConfigs || !siteConfigs.length) {
                    return;
                }

                utilityService.forEach(siteConfigs, function (siteConfig) {
                    var clonedSiteConfig = utilityService.cloneDeep(siteConfig), reportingContainerSection = findReportingContainer(clonedSiteConfig),
                        hasReportingContainer = !!reportingContainerSection, previewTemplateSectionID = reportPreviewKeyword + '@';
                    if (clonedSiteConfig && hasReportingContainer) {
                        if (clonedSiteConfig.appUrl) {
                            clonedSiteConfig.appUrl += previewKeyword;
                        }
                        if (clonedSiteConfig.layout) {
                            clonedSiteConfig.layout.name += previewKeyword;
                            for (var index = clonedSiteConfig.layout.sections.length - 1; index >= 0; index--) {
                                if (clonedSiteConfig.layout.sections[index].name !== reportingContainerSection.name) {
                                    clonedSiteConfig.layout.sections.splice(index, 1);
                                }
                            }
                        }
                        reportingContainerSection.name = previewTemplateSectionID;
                        reportPreviewStates.push(clonedSiteConfig);
                    }
                });
                return siteConfigs.concat(reportPreviewStates);
            }

            $state.clear();
            user.siteConfig = addReportPreviewStates(user.siteConfig);
            utilityService.forEach(user.siteConfig, function (config) {
                var stateConfig, stateName = config.layout.name, regStateIndex = registeredStates.indexOf(stateName);
                if (regStateIndex < 0 && stateName !== reportPreviewKeyword) {
                    stateConfig = { templateUrl: config.layout.templateUrl };
                    if (config.layout.appUrl) {
                        stateConfig.url = config.layout.appUrl;
                    }
                    registeredStates.push(stateName);
                    angularApp.stateProvider.state(stateName, stateConfig);
                }
            });
            utilityService.forEach(user.siteConfig, function (config) {
                configureState(config);
            });
            //angularApp.urlRouteProvider.otherwise('home');
        }
    }]);
}(app));