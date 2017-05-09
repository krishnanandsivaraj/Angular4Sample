(function (angularApp) {
    if (!angularApp || !angularApp.controllerProvider) {
        return;
    }

    angularApp.controllerProvider.register('gridSettingsCtrl', ['$scope', 'mediatorService', '$state', '$injector', 'appConstants', 'utilityService', '$timeout', 'widgetframework', 'siteConfigService',
 function ($scope, mediatorService, $state, $injector, appConstants, utilityService, $timeout, widgetframework, siteConfigService) {
     var partial = null, dataAdapter = null, args = arguments, anyChangesMade, isEditMode = !!$scope.popupParams.state,
        cellInputEditableTemplate = '<input class="grdwidth" data-ng-class="\'colt\' + col.index" type="text" data-ng-model="row.entity.displayName"/>',
        cellCheckboxEditableTemplate = '<input class="checkwidth" data-ng-class="\'colt\' + col.index" type="checkbox" data-ng-model="row.entity.visible"/>',
        cellOptionsEditableTemplate = '<select class="selecwidh" data-ng-class="\'colt\' + col.index" data-ng-input="row.entity.cellFilter" data-ng-model="row.entity.cellFilter" data-ng-options="columnFormat.value as columnFormat.text for columnFormat in  columnFormats"></select>';
     $scope.init = function () {
         $scope.dataBind();
         $scope.toasterOption = utilityService.toasterOption();
     }
     $scope.dataBind = function () {        
         var params = $scope.getParams();
         if ($scope.dataAdapter) {
             $scope.inProgress = true;
             $scope.dataAdapter.getData(params).then(function (response) {
                 $scope.metaData = $scope.dataAdapter.transformation ? $scope.dataAdapter.transformation(response.result, params) : response.result;
                 $scope.metaDataAdapter = utilityService.find($scope.metaData.data, function (metaDetails) {                     
                     return metaDetails.name == $scope.settings.dataAdapterSettings.getData.name;
                 });
                 $scope.metaDataAdapter.granularity.selected = $scope.metaDataAdapter.granularity[0];
                 $scope.metaDataGranulariry = utilityService.find($scope.metaDataAdapter.granularity, function (granularity) {
                     return granularity.isDefault == true;
                 }); 
                 $scope.settingsData = utilityService.find($scope.settings.widget.controller.data.granularity, function (granularity) {
                     return granularity.name == $scope.metaDataGranulariry.name;
                 });
                 mergeColumnDefs($scope.settingsData.gridOption.columnDefs, $scope.metaDataGranulariry.metaData.columnDefs);
                 $scope.list = $scope.settingsData.gridOption.columnDefs;
             })
             .finally(function () {
                 $scope.inProgress = false;
             });
         }
     }

     $scope.gridOptions = {
         data: 'list',
         enableRowSelection: false,
         enableCellEditOnFocus: true,
         multiSelect: false,
         columnDefs: [
           { field: 'visible', displayName: 'Select All', enableCellEdit: false, cellTemplate: cellCheckboxEditableTemplate },
           { field: 'field', displayName: 'Column Name', enableCellEdit: false },
           { field: 'displayName', displayName: 'Alias', enableCellEdit: false, cellTemplate: cellInputEditableTemplate },
           { field: 'cellFilter', displayName: 'Column Format', enableCellEdit: false, cellTemplate: cellOptionsEditableTemplate}
         ]
     };
     $scope.save = function () {
         var columnDefs = [];
         utilityService.forEach($scope.settingsData.gridOption.columnDefs, function (columnDef, index) {
             if (!utilityService.isUndefined(columnDef.visible)) {
                 columnDefs.push(columnDef);
             }
         });
         $scope.settingsData.gridOption.columnDefs = [];
         $scope.settingsData.gridOption.columnDefs = columnDefs;
         utilityService.forEach($scope.settings.widget.controller.data.granularity, function (granularityGridOption, index) {
             if (granularityGridOption.name == $scope.settingsData.gridOption.name) {
                 $scope.settings.widget.controller.data.granularity.splice(index, 1);
                 $scope.settings.widget.controller.data.granularity.push($scope.settingsData.gridOption);
             }
         });
         $scope.popupParams.params.settings = $scope.settings;
         $scope.baseSave();
         utilityService.statusMessage('success', "Grid settings saved successfully");
         utilityService.trackEvent('Reporting Management', 'Grid Setting Change', $scope.settings.dataAdapterSettings.getData.name, $scope.user);
     }
     var pageSize = function () {
         return paginationPageSize = [
                 { text: '10', value: 10 },
                 { text: '25', value: 25 },
                 { text: '50', value: 50 },
                 { text: '100', value: 100 }
         ];
     };
     $scope.granularityOnChange = function () {
        $scope.metaDataGranulariry = utilityService.find($scope.metaDataAdapter.granularity, function (granularity) {
            return granularity.name == $scope.metaDataAdapter.granularity.selected.name;
         });
         $scope.settingsData = utilityService.find($scope.settings.widget.controller.data.granularity, function (granularity) {
             return granularity.name == $scope.metaDataAdapter.granularity.selected.name;
         });
         $scope.list = utilityService.merge($scope.settingsData.gridOption.columnDefs, $scope.metaDataGranulariry.metaData.columnDefs);
     }
     $scope.pageSizes = pageSize();
     var columnFormat = function () {
         return columnFormat = [                 
                 { text: 'string', value: "" },
                 { text: 'hyperlink', value: "hyperlink" },
                 { text: 'description-popup', value: "descriptionpopup" },
                 { text: 'number', value: "numberFormatter:\"number.wholeNumber\"" },
                 { text: 'decimal', value: "numberFormatter:\"number.decimal\"" },
                 { text: 'currency', value: "numberFormatter:\"currency.dollar\"" },
                 { text: 'currency - decimal', value: "numberFormatter:\"currency.decimal\"" },
                 { text: 'percentage', value: "numberFormatter:\"number.percentage\"" },
                 { text: 'percentage - decimal', value: "numberFormatter:\"number.percentagedecimal\"" },
                 { text: 'date', value: "dateFormatter:\"date.US\"" }
                 
         ];
     };
     $scope.columnFormats = columnFormat();
     $scope.changePaginationPageSize = function (selectedPageSize) {
         if (selectedPageSize == 10)
             $scope.settingsData.gridOption.paginationPageSizes = [10, 20, 40, 60];

         if (selectedPageSize == 25)
             $scope.settingsData.gridOption.paginationPageSizes = [25, 50, 75, 100];

         if (selectedPageSize == 50)
             $scope.settingsData.gridOption.paginationPageSizes = [50, 100, 150, 200];

         if (selectedPageSize == 100)
             $scope.settingsData.gridOption.paginationPageSizes = [100, 200, 300, 400];
     }
     $scope.updateHScrollOption = function ($event) {
         if ($event.target.checked)
             $scope.settingsData.gridOption.enableHorizontalScrollbar = 1;
         else
             $scope.settingsData.gridOption.enableHorizontalScrollbar = 0;
     }
     $scope.updateVScrollOption = function ($event) {
         if ($event.target.checked)
             $scope.settingsData.gridOption.enableVerticalScrollbar = 1;
         else
             $scope.settingsData.gridOption.enableVerticalScrollbar = 0;
     }
     $scope.isopen = {
         first: true,
         second: false
     }
     $scope.getParams = function () {
         return { metaData: 1, granularity: 'daily', adapterName: $scope.settings.dataAdapterSettings.getData.name };
     }
     $scope.init();
     function mergeColumnDefs(pageObject, adapterObject) {
         utilityService.forEach(adapterObject, function (adapter, index) {
             utilityService.forEach(pageObject, function (page, index) {
                 if (page.field == adapter.field) {
                     adapter.visible = page.visible;
                     adapter.displayName = page.displayName;
                     adapter.cellFilter = page.cellFilter;
                 }
             });
         });
         $scope.settingsData.gridOption.columnDefs = [];
         $scope.settingsData.gridOption.columnDefs = adapterObject;
     }
 }]);
}(app));