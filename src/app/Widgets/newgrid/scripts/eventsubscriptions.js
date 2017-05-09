(function (angularApp) {
    if (!angularApp || !angularApp.provide) {
        return;
    }
    angularApp.provide.service('gridEventSubscriptions', ['appConstants', 'utilityService',
        function(appConstants, utilityService) {
        this.register = function (callee, calleeArgs, lstEventSubscriptions) {
                var scope = calleeArgs[0],
                    mediatorService = calleeArgs[1],
                    controllerConfig = calleeArgs[3],
                    eventSubscriptions = {};
            if (!scope) {
                return;
            }

            eventSubscriptions[appConstants.eventsList.filter.onLoad] = function (eventSubscription) {
                mediatorService.subscribeForAnEvent({
                    subscriberId: scope.subscriberId,
                    eventName: appConstants.eventsList.filter.onLoad,
                    eventHandler: function (eventData) {
                        scope.ctrlParameters = eventData.data;
                        scope.dataBind();
                    }
                });
            };

            eventSubscriptions[appConstants.eventsList.filter.OnChange] = function (eventSubscription) {
                mediatorService.subscribeForAnEvent({
                    subscriberId: scope.subscriberId,
                    eventName: appConstants.eventsList.filter.OnChange,
                    eventHandler: function (eventData) {
                        scope.ctrlParameters = eventData.data;
                        scope.dataBind();
                    }
                });
            };

            eventSubscriptions[appConstants.eventsList.granularity.calendarChange] = function (eventSubscription) {
                mediatorService.subscribeForAnEvent({
                    subscriberId: scope.subscriberId,
                    eventName: appConstants.eventsList.granularity.calendarChange,
                    eventHandler: function (eventData) {
                        scope.ctrlParameters = eventData.data;
                        scope.dataBind();
                    }
                });
            };

            eventSubscriptions[appConstants.eventsList.event.onAddEvent] = function (eventSubscription) {
                mediatorService.subscribeForAnEvent({
                    subscriberId: scope.subscriberId,
                    eventName: appConstants.eventsList.event.onAddEvent,
                    eventHandler: function (eventData) {
                        scope.ctrlParameters = eventData.data;
                        scope.dataBind();
                    }
                });
            };

            eventSubscriptions[appConstants.eventsList.granularity.onClick] = function (eventSubscription) {
                mediatorService.subscribeForAnEvent({
                    subscriberId: scope.subscriberId,
                    eventName: appConstants.eventsList.granularity.onClick,
                    eventHandler: function (eventData) {
                        scope.ctrlParameters = eventData.data;
                        scope.getControllerConfig();
                        scope.dataBind();
                    }
                });
            };

            eventSubscriptions[appConstants.eventsList.alertSettings.onLoad] = function (eventSubscription) {
                mediatorService.subscribeForAnEvent({
                    subscriberId: scope.subscriberId,
                    eventName: appConstants.eventsList.alertSettings.onLoad,
                    eventHandler: function (eventData) {
                        if (eventData.data && eventSubscription && eventSubscription.filter && eventSubscription.filter.type === eventData.data.type) {
                            scope.ctrlParameters = eventData.data;
                            scope.dataBind();
                        }
                    }
                });
            };

            eventSubscriptions[appConstants.eventsList.alertSettings.onApply] = function (eventSubscription) {
                mediatorService.subscribeForAnEvent({
                    subscriberId: scope.subscriberId,
                    eventName: appConstants.eventsList.alertSettings.onApply,
                    eventHandler: function (eventData) {
                        if (eventData.data && eventSubscription && eventSubscription.filter && eventSubscription.filter.type === eventData.data.type) {
                            scope.ctrlParameters = eventData.data;
                            scope.dataBind();
                        }
                    }
                });
            };

            eventSubscriptions[appConstants.eventsList.alertSettings.onSave] = function (eventSubscription) {
                mediatorService.subscribeForAnEvent({
                    subscriberId: scope.subscriberId,
                    eventName: appConstants.eventsList.alertSettings.onSave,
                    eventHandler: function (eventData) {
                        if (eventData.data && eventSubscription && eventSubscription.filter && eventSubscription.filter.type === eventData.data.type) {
                            scope.ctrlParameters = eventData.data;
                            scope.dataBind();
                        }
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
        }
    ]);
}(app));