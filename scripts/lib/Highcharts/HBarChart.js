function HBarChartExt(chartdata) {

    var arrChartData = chartdata.GraphPointsData;
   
    var hchartdata = {
        options: {
            chart: {
                type: 'bar',
                height: 180
            },
            colors: ["#3c3d3f"],
            plotOptions: {
                series: {
                    stacking: ''
                }
            },
            xAxis: {
                categories: chartdata.XaxisLabel,
                gridLineWidth: 0
            },
            yAxis: {
                gridLineWidth: 0,
                title: {
                    text: ''
                },
                labels:{
                  enabled: false
                }
            },
            title: {
                    text: null
                },
                subtitle: {
                    text: null
                },
            legend: {
                    enabled: false
                },
        },
        series: arrChartData,      
        credits: {
            enabled: false
        },
        loading: false
    }
    
    return hchartdata;
}