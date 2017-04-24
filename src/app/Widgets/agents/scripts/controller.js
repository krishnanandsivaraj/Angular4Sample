(function (angularApp) {
    if (!angularApp || !angularApp.controllerProvider) {
        return;
    }
    angularApp.controllerProvider.register('agentsCtrl', ['$scope', 'mediatorService', '$state', 'controllerConfig', '$injector', '$cookieStore', 'siteConfigService', '$modal', 'utilityService', '$timeout', '$window', 'popupParams',
        function ($scope, mediatorService, $state, controllerConfig, $injector, $cookieStore, siteConfigService, $modal, utilityService, $timeout, $window, popupParams) {
            var dataAdapter = null, args = arguments, criteria;
            $scope.init = function () {
                mediatorService.configure($scope);
                configureController();
                $scope.Clients = popupParams.user.clients;
            }
            $scope.destroy = function () {
                mediatorService.unsubscribe($scope.subscriberId);
            }
            $scope.$on('$destroy', function () {
                $scope.destroy();
            });
            $scope.closeModal = function () {
                $scope.$dismiss();
            };
            $scope.submit = function (isValied, clientname) {
                if (!isValied) {
                    return false;
                } else {
                    if (dataAdapter) {
                        $scope.inProgress = true;
                        dataAdapter.fetchUser({ emailAddress: popupParams.user.emailAddress.toLowerCase(), client: clientname.name.toLowerCase(), loginTime: new Date() })
                        .then(function (response) {
                            $cookieStore.put('users', false);
                            if (response && response.result) {
                                var userOjbect = { username: response.result.username, profile: response.result.profile, client: response.result.client, clientName: response.result.clientName, clients: popupParams.user.clients, roleName: response.result.roleName, weekStartDay: response.result.weekStartDay, url: response.result.url};
                                $cookieStore.put('users', userOjbect);
                                siteConfigService.configureSite(response.result);
                                $state.go(utilityService.getLandingPage(response.result.siteConfig).page);
                                $scope.$dismiss();
                            }
                            else if (response.error) {
                                $scope.message = response.error;
                            }
                        })
                        .finally(function () {
                            $scope.inProgress = false;
                        });
                    }
                }
            };
            function configureController() {
                if (!controllerConfig) {
                    return;
                }
                dataAdapter = utilityService.getDataAdapterInstance(controllerConfig.dataAdapterSettings);
                setupConfigData(controllerConfig.data);
            }
            function setupConfigData(configData) {
                if (!configData) {
                    return;
                }
            }
            $scope.init();
        }]);
}(app));