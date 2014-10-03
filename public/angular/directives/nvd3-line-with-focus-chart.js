'use strict';

angular.module('octobluApp')
    .directive('nvd3LineWithFocusChart', function () {
        return {
            restrict: 'AE',
            replace: true,
            template: '<div class="chart"></div>',
            scope: {
                data: '=',
                height: '@',
                width: '@',
                axisXLabel: '@',
                axisXFormat: '@',
                axisXType: '@',
                axisYLabel: '@',
                axisYFormat: '@',
                axisYType: '@',
                interpolate: '@',
                showLegend: '@',
                showXAxis: '@',
                showYAxis: '@'
            },
            link: function (scope, element, attr) {
                attr.axisXFormat = attr.axisXFormat || '';
                attr.axisYFormat = attr.axisYFormat || ',';
                attr.showLegend = attr.showLegend || 'true';
                attr.showXAxis = attr.showXAxis || 'true';
                attr.showYAxis = attr.showYAxis || 'true';
		attr.yScale = attr.yScale || null;
		attr.yScaleMax = attr.yScaleMax || 1;
		attr.yScaleMin = attr.yScaleMin || 0;

                /*These lines are all chart setup.  Pick and choose which chart features you want to utilize. */
		var chart = nv.models.lineWithFocusChart();
		  //Configure how the tooltip looks.
	
		  //We want to show shapes other than circles.

		  if (attr.axisXLabel) {
                        chart.xAxis.axisLabel(attr.axisXLabel);
			chart.x2Axis.axisLabel(attr.axisXLabel);
                    }

                  chart.xAxis.tickFormat(function (d) {
                            if (attr.axisXType && attr.axisXType === 'date') {
                                return d3.time.format(attr.axisXFormat)(new Date(d));
                            }

                            return d3.format(attr.axisXFormat)(d);
                 });

                    // Chart y-axis settings
                    if (attr.axisYLabel) {
                        chart.margin({left: 100})  // Adjust chart margins to give the y-axis some breathing room.
                        chart.yAxis.axisLabel(attr.axisYLabel);
                    }

                    chart.yAxis.tickFormat(function (d) {
                            if (attr.axisYType && attr.axisYType === 'date') {
                                return d3.time.format(attr.axisYFormat)(new Date(d));
                            }

                            return d3.format(attr.axisYFormat)(d);
                    });
		   chart.x2Axis.tickFormat(function (d) {
                            if (attr.axisXType && attr.axisXType === 'date') {
                                return d3.time.format(attr.axisXFormat)(new Date(d));
                            }

                            return d3.format(attr.axisXFormat)(d);
                    });


                    var svg = d3.select(element[0])
                        .append('svg');

                    if (attr.height) {
                        svg.style('height', attr.height + 'px');
                    }

                    if (attr.width) {
                        chart.style('width', attr.width + 'px');
                    }

                    // Watch data for any changes.
                    scope.$watch('data', function (newVal) {
                        if (newVal) {
                            svg.datum(scope.data); // Populate the <svg> element with chart data...
                            svg.call(chart);          //Finally, render the chart!
                        }
                    });

		  nv.utils.windowResize(chart.update);

		  return chart;
            }
        }
    });
