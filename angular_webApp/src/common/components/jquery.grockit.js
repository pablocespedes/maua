/**
 * Created by Jose on 5/8/14.
 */

$(function(){

   /* Easy Pie charts*/

    init.push(function () {
        // Easy Pie Charts
        var easyPieChartDefaults = {
        animate: 2000,
        scaleColor: false,
        lineWidth: 6,
        lineCap: 'square',
        size: 90,
        trackColor: '#e5e5e5'
        }

        $('#easy-pie-chart-2').easyPieChart($.extend({}, easyPieChartDefaults, {
        barColor: PixelAdmin.settings.consts.COLORS[1]
        }));

        });

});