(function (angularApp) {
    if (!angularApp || !angularApp.provide) {
        return;
    }

    angularApp.provide.service('graphEventSubscriptions', ['appConstants', 'utilityService', function (appConstants, utilityService) {
        this.register = function (callee, calleeArgs, lstEventSubscriptions) {
            var scope = calleeArgs[0], mediatorService = calleeArgs[1], controllerConfig = calleeArgs[3], eventSubscriptions = {};
            if (!scope) {
                return;
            }

            eventSubscriptions[appConstants.eventsList.filter.onLoad] = function (eventSubscription) {
                mediatorService.subscribeForAnEvent({
                    subscriberId: scope.subscriberId, eventName: appConstants.eventsList.filter.onLoad, eventHandler: function (eventData) {
                        scope.ctrlParameters = eventData.data;
                        scope.dataBind();
                    }
                });
            };

            eventSubscriptions[appConstants.eventsList.filter.OnChange] = function (eventSubscription) {
                mediatorService.subscribeForAnEvent({
                    subscriberId: scope.subscriberId, eventName: appConstants.eventsList.filter.OnChange, eventHandler: function (eventData) {
                        scope.ctrlParameters = eventData.data;
                        scope.dataBind();
                    }
                });
            };

            eventSubscriptions[appConstants.eventsList.granularity.calendarChange] = function (eventSubscription) {
                mediatorService.subscribeForAnEvent({
                    subscriberId: scope.subscriberId, eventName: appConstants.eventsList.granularity.calendarChange, eventHandler: function (eventData) {
                        scope.ctrlParameters = eventData.data;
                        scope.dataBind();
                    }
                });
            };

            eventSubscriptions[appConstants.eventsList.granularity.onClick] = function (eventSubscription) {
                mediatorService.subscribeForAnEvent({
                    subscriberId: scope.subscriberId, eventName: appConstants.eventsList.granularity.onClick, eventHandler: function (eventData) {
                        scope.ctrlParameters = eventData.data;
                        scope.bindGraphMetrics();
                        scope.dataBind();
                    }
                });
            };

            eventSubscriptions[appConstants.eventsList.cache.onClick] = function (eventSubscription) {
                mediatorService.subscribeForAnEvent({
                    subscriberId: scope.subscriberId,
                    eventName: appConstants.eventsList.cache.onClick,
                    eventHandler: function (eventData) {
                        scope.ctrlParameters = eventData.data;
                        scope.dataBind();
                    }
                });
            };

            if (lstEventSubscriptions && lstEventSubscriptions.length > 0) {
                utilityService.forEach(lstEventSubscriptions, function (eventSubscription) {
                    if (eventSubscriptions[eventSubscription.event]) {
                        eventSubscriptions[eventSubscription.event](eventSubscription);
                    }
                });
            }
        };
    }]);
}(app));