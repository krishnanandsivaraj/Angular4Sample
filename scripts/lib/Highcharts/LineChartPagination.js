var graphCurPage = 1;
var totalPages = 0;
var limit = 10;
var gchartdata;
var PLineChart = function (chartdata, navigation, reset) {
    reset = reset || false;
    if (reset) {
        graphCurPage = 1;
    }
    gchartdata = chartdata;
    var count = Object.keys(chartdata).length
    var fchartdata;
    if (count > 0) {
        if (navigation == 0) {
            totalPages = Math.ceil(chartdata.GraphPointsData.length / limit);
            HideShow();
            fchartdata = HighChartLine(chartdata, graphCurPage);
        }
        else if (navigation == 1) {
            graphCurPage = graphCurPage - 1;
            fchartdata = HighChartLine(chartdata, graphCurPage);
            HideShow();
        }
        else if (navigation == 2) {
            graphCurPage = graphCurPage + 1;
            totalPages = Math.ceil(chartdata.GraphPointsData.length / limit);
            if (graphCurPage > totalPages) graphCurPage = totalPages - 1;
            fchartdata = HighChartLine(chartdata, graphCurPage);
            HideShow();
        }
    }
    return fchartdata;
};

function HideShow() {
    if (graphCurPage == 1)
        $(".gp_prev").hide();
    else
        $(".gp_prev").show();

    totalPages = Math.ceil(gchartdata.GraphPointsData.length / limit);

    if (graphCurPage >= totalPages)
        $(".gp_next").hide();
    else
        $(".gp_next").show();
    $(".pageLbl").html(graphCurPage + " of " + totalPages);
}