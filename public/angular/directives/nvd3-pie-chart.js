'use strict';

angular.module('octobluApp')
    .directive('nvd3PieChart', function () {
        return {
            restrict: 'A',
            replace: true,
            template: '<div class="chart"></div>',
            scope: {
                data: '=',
                height: '@',
                width: '@',
                donutRatio: '@',
                labelThreshold: '@',
                labelType: '@',
		objectequality: '@',
                showLabels: '@'
            },
            link: function (scope, element, attr) {
                attr.showLabels = attr.showLabels || 'true';
                attr.donutRatio = attr.donutRatio ? attr.donutRatio + 0 : 0.35;
                attr.labelThreshold = attr.labelThreshold ? attr.labelThreshold + 0 : .05;
                attr.labelType = attr.labelType || 'percent';
                attr.donut = attr.donut || 'false';

                /*These lines are all chart setup.  Pick and choose which chart features you want to utilize. */
                nv.addGraph(function () {
                    var chart = nv.models.pieChart()
                        .x(function(d) { return d.label })
                        .y(function(d) { return d.value })
                        .showLabels(attr.showLabels === 'true')     //Display pie labels
                        .labelThreshold(attr.labelThreshold)  //Configure the minimum slice size for labels to show up
                        .labelType(attr.labelType); //Configure what type of data to show in the label. Can be "key", "value" or "percent"

                    if (attr.donut === 'true') {
                        chart
                            .donut(true)          //Turn on Donut mode. Makes pie chart look tasty!
                            .donutRatio(attr.donutRatio);     //Configure how big you want the donut hole size to be.
                    }
                    var svg = d3.select(element[0])
                        .append('svg');

                    if (attr.height) {
                        svg.style('height', attr.height + 'px');
                    }

                    if (attr.width) {
                        svg.style('width', attr.width + 'px');
                    }

                    // Watch data for any changes.
                    scope.$watch('data', function (newVal) {
                        if (newVal) {
			    console.log("piechart new data");
			    console.log(newVal);
			    svg.empty();
                            svg.datum(scope.data).call(scope.chart); // Populate the <svg> element with chart data... and render!
                        }
                    });

                    //Update the chart when window resizes.
                    nv.utils.windowResize(chart.update);
		    scope.chart = chart;
                    return chart;
                });
            }
        }
    });
