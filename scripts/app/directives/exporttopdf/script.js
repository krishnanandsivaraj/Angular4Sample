(function (angularApp) {
    if (!angularApp || !angularApp.compileProvider) {
        return;
    }

    angularApp.compileProvider.directive('exportToPdf', ['utilityService', '$timeout', function (utilityService, $timeout) {
        function exportElements(doc, elementsToBeExportedWithMetaInfo, fileName) {
            utilityService.forEach(elementsToBeExportedWithMetaInfo, function (elementToBeExportedWithMetaInfo, index) {
                elementToBeExported = $(elementToBeExportedWithMetaInfo.elementToBeExported);
                elementToBeExported.css('background-color', '#FFFFFF');
                (function (elementToBeExported, elementToBeExportedWithMetaInfo) {
                    html2canvas(elementToBeExported, {
                        onrendered: function (canvas) {
                            elementToBeExportedWithMetaInfo.canvas = canvas;
                            elementToBeExported.css('background-color', '');
                        }
                    });
                }(elementToBeExported, elementToBeExportedWithMetaInfo));
            });


            var maxAttempts = 5, counter = 0, interval = setInterval(function () {
                utilityService.forEach(elementsToBeExportedWithMetaInfo, function (elementToBeExportedWithMetaInfo, index) {
                    if (elementToBeExportedWithMetaInfo.canvas && !elementToBeExportedWithMetaInfo.isRendered) {
                        elementToBeExportedWithMetaInfo.isRendered = true;
                        var pageIndex = 1;
                        elementToBeExported = $(elementToBeExportedWithMetaInfo.elementToBeExported);
                        (function (elementToBeExported, elementToBeExportedWithMetaInfo) {
                            if (pageIndex !== elementToBeExportedWithMetaInfo.pageIndex) {
                                doc.addPage();
                                pageIndex = elementToBeExportedWithMetaInfo.index;

                            }
                            doc.addImage(elementToBeExportedWithMetaInfo.canvas.toDataURL("image/jpeg"), 'jpeg', elementToBeExportedWithMetaInfo.xPos, elementToBeExportedWithMetaInfo.yPos, elementToBeExportedWithMetaInfo.width, elementToBeExportedWithMetaInfo.height);
                        }(elementToBeExported, elementToBeExportedWithMetaInfo));
                    }
                });
                counter++;
                var unRenderedElement = utilityService.find(elementsToBeExportedWithMetaInfo, function (elementToBeExportedWithMetaInfo) {
                    return (!elementToBeExportedWithMetaInfo.canvas || !elementToBeExportedWithMetaInfo.isRendered);
                });
                if (counter >= maxAttempts || !unRenderedElement) {
                    utilityService.forEach(elementsToBeExportedWithMetaInfo, function (elementToBeExportedWithMetaInfo, index) {
                        delete elementToBeExportedWithMetaInfo.isRendered;
                        delete elementToBeExportedWithMetaInfo.canvas;
                    });
                    doc.save(fileName);
                    clearInterval(interval);
                }
            }, 1000);
        }

        function cleanTempChanges(elementsToBeExported) {
            $timeout(function () {
                utilityService.forEach(elementsToBeExported, function (elementToBeExported, index) {
                    elementToBeExported = $(elementToBeExported);
                    elementToBeExported.css('background-color', '');
                });
            }, 5000);
        }

        function prepareExportElements(elementsToBeExported, exportMetaInfo) {
            var elementsWithNoExportMetaInfoPageIndex = 100;
            if (!exportMetaInfo || exportMetaInfo.length === 0) {
                return elementsToBeExported;
            }
            utilityService.forEach(elementsToBeExported, function (elementToBeExported, index) {
                var widgetId, metaInfo;
                elementToBeExported = $(elementToBeExported);
                widgetId = elementToBeExported.attr('data-widget-id');
                if (!widgetId) {
                    return true;
                }

                metaInfo = utilityService.find(exportMetaInfo, function (info) {
                    return info.widgetId === widgetId;
                });

                if (!metaInfo) {
                    metaInfo = { pageIndex: elementsWithNoExportMetaInfoPageIndex++, index: 1, xPos: 15, yPos: 40, width: 150, height: 75 };
                    exportMetaInfo.push(metaInfo);
                }
                metaInfo.availableToExport = !!metaInfo;
                metaInfo.elementToBeExported = elementToBeExported;
            });
            return utilityService.sortBy(exportMetaInfo, ['availableToExport', 'pageIndex', 'index']);
        }

        return {
            restrict: 'A',
            scope: { exportMetaInfo: '=' },
            link: function (scope, element, attrs) {
                element.on('click', function (event) {
                    var elementsToBeExported;
                    if (!attrs.selector || !attrs.fileName) {
                        return;
                    }

                    elementsToBeExported = $(attrs.selector), doc = new jsPDF();
                    if (elementsToBeExported.length === 0) {
                        return;
                    }

                    exportElements(doc, prepareExportElements(elementsToBeExported, scope.exportMetaInfo), attrs.fileName);
                    cleanTempChanges(elementsToBeExported);
                });
            }
        };
    }]);
}(app));