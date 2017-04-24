var PieChart = function (chartName, chartdata) {
    var cdata = [];
    angular.forEach(chartdata, function (val) {
        var vdata = [];
        vdata.push(val.ReportDate + "<br/><b>" + val.Values + "</b>");
        vdata.push(val.oValues);        
        cdata.push(vdata);
    });
    var plot2 = $.jqplot(chartName, [cdata], {
        seriesColors: ["#3c3d3f", "#8CC328", "#E4B900", "#9A9A1A", "#F7E967"],
        seriesDefaults: {
            renderer: $.jqplot.PieRenderer,
            rendererOptions: {
                showDataLabels: true
            }
        },
        grid: {
            drawGridLines: false,
            drawBorder: false,
            borderWidth: 0,
            shadow: false,
            background: '#ffffff'
        },
        axesDefaults: {
            showTicks: false,
            shadow: false,
            showTickMarks: false
        },
        legend: {
            show: true,
            location: 'e',           
            border:'none'
        }         
    });
}
