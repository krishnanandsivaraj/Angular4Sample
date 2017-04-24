var LineChart = function (chartName, chartdata,pNo) {
    var limit = 10;
    var offset = ((pNo - 1) * limit)
    var arrChartData = chartdata.GraphPointsData.slice(offset, offset + limit);

    var metricName = chartdata.Title;
    var fChartData = [];
    var fSeriesData = [];
    angular.forEach(arrChartData, function (val) {
        var sdata = [];                
        //binding the Series Data
        sdata.push(val.Series.toString());
        fSeriesData.push(sdata);
        var i = 0;
        var cdata = [];
        for (i = 0; i < val.XaxisLabel.length; i++) {
            var vdata = [];
            vdata.push(val.XaxisLabel[i], val.Data[i]);
            cdata.push(vdata);
        }
        fChartData.push(cdata);
    });
    var plot1 = $.jqplot(chartName, fChartData, {
        title: metricName,
        grid: {
            drawGridLines: false,
            drawBorder: false,
            borderWidth: 0,
            shadow: false,
            background: '#ffffff'
        },
        legend: {
            // This renderer is needed for advance legends.
            renderer: jQuery.jqplot.EnhancedLegendRenderer,
            labels: fSeriesData,
            show: true,
            location: 'ne',
            placement: 'outside',
            // Breaks the ledgend into horizontal.
            rendererOptions: {
                numberRows: '10'
            },
            seriesToggle: true
        },
        axes: {
            xaxis: {
                drawMajorGridlines: false,
                renderer: $.jqplot.CategoryAxisRenderer,
                 tickOptions: {
                     formatString: '%#m/%#d/%y'
                 },
                rendererOptions:{
                    sortMergedLabels:true
                   },
            },
            yaxis: {
                drawMajorGridlines: false
            }
        },
        highlighter: {
            show: true,
            showLabel: true,
            tooltipAxes : 'both',
            sizeAdjust: 7.5
        },
        cursor: {
            show: false
        }
    });
    plot1.replot();
}