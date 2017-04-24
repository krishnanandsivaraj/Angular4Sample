(function (angularApp) {
    if (!angularApp) {
        return;
    }

    angularApp.directive('sectionHighlighter', ['$modal', '$state', function ($modal, $state) {
        function highlightSections(element) {
            var doHighlight = !element.is('[data-remove-border]');
            function getParams(viewData) {
                var reportPreviewStr = 'reportpreview.', reportStr = 'report.',
                    pageState = $state.current.name.replace(reportPreviewStr, reportStr),
                    state = viewData.state ? viewData.state.name.replace(reportPreviewStr, reportStr) : null,
                    section = viewData.name.replace(reportPreviewStr, reportStr);

                return { pageState: pageState, state: state, section: section };
            }
            if (doHighlight) {
                element.text('Edit Off');
                element.attr('data-remove-border', '');
                $(".popup-border div[data-ui-view]").addClass("borderclass");
                var configure = $('<a class="pos"><span class="configBtn" ></span></a>');
                $("div[data-ui-view *='section'] > div:not(:first)").append(configure);
                $(".configBtn").click(function () {
                    var params = getParams($(this).closest("div[data-ui-view]").data('$uiView'));
                    $modal.open({
                        templateUrl: '/widgets/framework/templates/template.html',
                        backdrop: 'static',
                        keyboard: false,
                        windowClass: 'widgetframework',
                        controller: 'widgetFrameworkCtrl',
                        resolve: {
                            popupParams: function () {
                                return { params: params };
                            },
                            controllerConfig: function () {
                                return {
                                    dataAdapterSettings: {
                                        getSection: {
                                            name: 'widgetframework.getSection',
                                            endpoint: 'widgetframework/getsection',
                                            disableCache: true
                                        },
                                        getWidgets: {
                                            name: 'widgetframework.getWidgets',
                                            endpoint: 'widgetframework/getwidgets',
                                            disableCache: true
                                        },
                                        getDataAdapters: {
                                            name: 'widgetframework.getDataAdapters',
                                            endpoint: 'widgetframework/getdataadapters',
                                            disableCache: true
                                        },
                                        saveSection: {
                                            name: 'widgetframework.saveSection',
                                            endpoint: 'widgetframework/savesection',
                                            httpAction: 'POST',
                                            disableCache: true
                                        },
                                        addSection: {
                                            name: 'widgetframework.addSection',
                                            endpoint: 'widgetframework/addsection',
                                            httpAction: 'POST',
                                            disableCache: true
                                        },
                                        fetchUser: {
                                            name: 'authentication.fetchUser',
                                            endpoint: 'authentication/fetchuser',
                                            disableCache: true
                                        },
                                    }
                                }
                            }
                        }
                    })
                    .result.then(function (result) {
                        if (result && result.refresh) {
                            $state.go($state.current.name, {}, { reload: true });                            
                        }
                    });
                });
            } else {
                element.text('Edit Template');
                element.removeAttr('data-remove-border');
                $("div[data-ui-view]").removeClass("borderclass");
                $(".pos").remove();
            }
        }
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.on('click', function (event) {
                    highlightSections(element);
                });
            }
        };
    }]);
}(app));