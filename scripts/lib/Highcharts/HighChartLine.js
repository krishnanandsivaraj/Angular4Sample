function HighChartLine(chartdata,pNo) {
    var limit = 10;
    var offset = ((pNo - 1) * limit)
    var vPrefix = '';
    var vSuffix = '';
    var vDecimal = 0;
    if (chartdata.GraphPointsData.length > 0) {
        if (chartdata.Title.toLowerCase().indexOf("revenue") > -1) {
            vPrefix = '$';
        }
		if (chartdata.Title.toLowerCase().indexOf("conversion") > -1) {
			
			vDecimal =1;
            vSuffix = ' %';
        }
    }
    var arrChartData = chartdata.GraphPointsData.slice(offset, offset + limit);
    var hchartdata = {
        options: {
            chart: {
                type: 'line'
            },
            plotOptions: {
                series: {
                    stacking: ''
                }
            },
            xAxis: {
                categories: chartdata.XaxisLabel
            },
            yAxis: {
                title: {
                    text: chartdata.Title
                },
                min: 0
            },
            tooltip: {
				valueDecimals: vDecimal,  
                valuePrefix: vPrefix,
				valueSuffix: vSuffix
            }
        },
        series: arrChartData,
        title: {
            text: chartdata.Title
        },
        credits: {
            enabled: false
        },
        loading: false
    }

    return hchartdata;
}