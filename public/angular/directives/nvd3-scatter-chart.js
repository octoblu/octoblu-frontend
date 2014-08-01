'use strict';

angular.module('octobluApp')
    .directive('nvd3ScatterChart', function () {
        return {
            restrict: 'A',
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
                attr.interpolate = attr.interpolate || 'cardinal';
                attr.showLegend = attr.showLegend || 'true';
                attr.showXAxis = attr.showXAxis || 'true';
                attr.showYAxis = attr.showYAxis || 'true';

                /*These lines are all chart setup.  Pick and choose which chart features you want to utilize. */
                nv.addGraph(function () {
                    var chart = nv.models.lineChart()
                        .useInteractiveGuideline(true)  //We want nice looking tooltips and a guideline!
                        .transitionDuration(350)  //how fast do you want the lines to transition?
                        .showLegend(attr.showLegend === 'true')       //Show the legend, allowing users to turn on/off line series.
                        .showYAxis(attr.showYAxis === 'true')        //Show the y-axis
                        .showXAxis(attr.showXAxis === 'true')        //Show the x-axis
                        .interpolate(attr.interpolate);

                    // Chart x-axis settings
                    if (attr.axisXLabel) {
                        chart.xAxis.axisLabel(attr.axisXLabel);
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

                    //Update the chart when window resizes.
                    nv.utils.windowResize(function() { chart.update() });

                    return chart;
                });
            }
        }
    });
