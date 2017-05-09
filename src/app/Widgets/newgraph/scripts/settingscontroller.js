(function (angularApp) {
    if (!angularApp || !angularApp.controllerProvider) {
        return;
    }

    angularApp.controllerProvider.register('graphSettingsCtrl', ['$scope', 'mediatorService', '$state', '$injector', 'appConstants', 'utilityService', '$timeout', 'widgetframework', 'siteConfigService',
 function ($scope, mediatorService, $state, $injector, appConstants, utilityService, $timeout, widgetframework, siteConfigService) {
     var partial = null, dataAdapter = null, args = arguments, anyChangesMade, isEditMode = !!$scope.popupParams.state,
         cellInputEditableTemplate = '<input class="grdwidth" data-ng-class="\'colt\' + col.index" type="text" data-ng-model="row.entity.displayName"/>',
         cellCheckboxEditableTemplate = '<input class="checkwidth" data-ng-class="\'colt\' + col.index" type="checkbox" data-ng-model="row.entity.visible"/>',
         cellOptionsEditableTemplate = '<select data-ng-class="\'colt\' + col.index" data-ng-input="row.entity.cellFilter" data-ng-model="row.entity.cellFilter" data-ng-options="columnFormat.value as columnFormat.text for columnFormat in  columnFormats" style="width:95%"></select>';
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
                 $scope.metaDataGranulariry.metaData.graphType[0].selected = $scope.settingsData.metaData.graphType[0];
                 mergeMetrics($scope.settingsData.metaData.metrics, $scope.metaDataGranulariry.metaData.metrics);
                 mergeQuickView($scope.settingsData.metaData.quickView, $scope.metaDataGranulariry.metaData.quickView);
                 $scope.metricsList = $scope.settingsData.metaData.metrics;
                 $scope.quickViewList = $scope.settingsData.metaData.quickView;
             })
             .finally(function () {
                 $scope.inProgress = false;
             });
         }
     }
     $scope.graphOptionsMetrics = {
         data: 'metricsList',
         enableRowSelection: false,
         enableCellEditOnFocus: true,
         multiSelect: false,
         columnDefs: [
           { field: 'visible', displayName: 'Select All', enableCellEdit: false, cellTemplate: cellCheckboxEditableTemplate },
           { field: 'metricName', displayName: 'Metric Name', enableCellEdit: false },
           { field: 'displayName', displayName: 'Alias', enableCellEdit: false, cellTemplate: cellInputEditableTemplate }
         ]
     };
     $scope.graphOptionsQuickView = {
         data: 'quickViewList',
         enableRowSelection: false,
         enableCellEditOnFocus: true,
         multiSelect: false,
         columnDefs: [
           { field: 'visible', displayName: 'Select All', enableCellEdit: false, cellTemplate: cellCheckboxEditableTemplate },
           { field: 'value', displayName: 'Value', enableCellEdit: false },
           { field: 'displayName', displayName: 'Alias', enableCellEdit: false, cellTemplate: cellInputEditableTemplate }
         ]
     };
     $scope.save = function () {
         var metrics = [], quickView = [];
         utilityService.forEach($scope.settingsData.metaData.metrics, function (avaiableMetrics, index) {
             if (!utilityService.isUndefined(avaiableMetrics.visible) && avaiableMetrics.visible === true) {
                 metrics.push(avaiableMetrics);
             }
         });
         $scope.settingsData.metaData.metrics = [];
         $scope.settingsData.metaData.metrics = metrics;
         utilityService.forEach($scope.settingsData.metaData.quickView, function (avaiableQuickview, index) {
             if (!utilityService.isUndefined(avaiableQuickview.visible) && avaiableQuickview.visible === true) {
                 quickView.push(avaiableQuickview);
             }
         });
         $scope.settingsData.metaData.quickView = [];
         $scope.settingsData.metaData.quickView = quickView;
         utilityService.forEach($scope.settings.widget.controller.data.granularity, function (granularityGraphOption, index) {
             if (granularityGraphOption.name == $scope.settingsData.name) {
                 $scope.settings.widget.controller.data.granularity.splice(index, 1);
                 $scope.settings.widget.controller.data.granularity.push($scope.settingsData);
             }
         });         
         $scope.popupParams.params.settings = $scope.settings;
         $scope.baseSave();
         utilityService.statusMessage('success', "Graph settings saved successfully");
         utilityService.trackEvent('Reporting Management', 'Graph Setting Change', $scope.settings.dataAdapterSettings.getData.name, $scope.user);
     }
     $scope.granularityOnChange = function () {
         $scope.metaDataGranulariry = utilityService.find($scope.metaDataAdapter.granularity, function (granularity) {
             return granularity.name == $scope.metaDataAdapter.granularity.selected.name;
         });
         $scope.settingsData = utilityService.find($scope.settings.widget.controller.data.granularity, function (granularity) {
             return granularity.name == $scope.metaDataAdapter.granularity.selected.name;
         });         
         $scope.metaDataGranulariry.metaData.graphType[0].selected = $scope.settingsData.metaData.graphType[0];
         mergeMetrics($scope.settingsData.metaData.metrics, $scope.metaDataGranulariry.metaData.metrics);
         mergeQuickView($scope.settingsData.metaData.quickView, $scope.metaDataGranulariry.metaData.quickView);
         $scope.metricsList = $scope.settingsData.metaData.metrics;
         $scope.quickViewList = $scope.settingsData.metaData.quickView;
     }     
     $scope.getParams = function () {
         return { metaData: 1, granularity: 'daily', adapterName: $scope.settings.dataAdapterSettings.getData.name };
     }
     $scope.init();
     function mergeMetrics(pageObject, adapterObject) {
         utilityService.forEach(adapterObject, function (adapter, index) {
             utilityService.forEach(pageObject, function (page, index) {
                 if (page.id == adapter.id) {
                     adapter.visible = true;
                 }
             });
         });
         $scope.settingsData.metaData.metrics = [];
         $scope.settingsData.metaData.metrics = adapterObject;
     }
     function mergeQuickView(pageObject, adapterObject) {
         utilityService.forEach(adapterObject, function (adapter, index) {
             utilityService.forEach(pageObject, function (page, index) {
                 if (page.value == adapter.value) {
                     adapter.visible = true;
                 }
             });
         });
         $scope.settingsData.metaData.quickView = [];
         $scope.settingsData.metaData.quickView = adapterObject;
     }
 }]);
}(app));