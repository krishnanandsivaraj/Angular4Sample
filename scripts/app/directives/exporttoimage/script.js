(function (angularApp) {
    if (!angularApp || !angularApp.compileProvider) {
        return;
    }

    angularApp.compileProvider.directive('exportToImage', ['utilityService', function (utilityService) {
        function exportElements(elementsToBeExported, fileName) {
            var zip = new JSZip(), img = zip.folder("images"), noOfImage = elementsToBeExported.length, rCount = 0;
            utilityService.forEach(elementsToBeExported, function (elementToBeExported, index) {
                html2canvas(elementToBeExported, {
                    onrendered: function (canvas) {
                        canvas.toBlob(function (blob) {
                            var reader = new FileReader();
                            reader.onload = function (e) {
                                rCount++;
                                img.file(rCount + '.png', e.target.result, { base64: true });
                                if (parseInt(noOfImage) == parseInt(rCount)) {
                                    location.href = "data:application/zip;base64," + zip.generate({ type: "base64" });
                                }
                            };
                            reader.readAsArrayBuffer(blob);
                        });
                    }
                });
            });
        }

        return {
            restrict: 'A',
            scope: {},
            link: function (scope, element, attrs) {
                element.on('click', function (event) {
                    var elementsToBeExported;
                    if (!attrs.selector || !attrs.fileName) {
                        return;
                    }

                    elementsToBeExported = angular.element(attrs.selector);
                    if (elementsToBeExported.length === 0) {
                        return;
                    }
                    exportElements(elementsToBeExported, attrs.fileName);
                });
            }
        };
    }]);
}(app));