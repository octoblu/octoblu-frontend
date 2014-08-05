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
                attr.showLegend = attr.showLegend || 'true';
                attr.showXAxis = attr.showXAxis || 'true';
                attr.showYAxis = attr.showYAxis || 'true';
		attr.yScale = attr.yScale || null;
		attr.yScaleMax = attr.yScaleMax || 1;
		attr.yScaleMin = attr.yScaleMin || 0;

                /*These lines are all chart setup.  Pick and choose which chart features you want to utilize. */
                nv.addGraph(function () {
			var chart = nv.models.scatterChart()
               	 	.showDistX(true)    //showDist, when true, will display those little distribution lines on the axis.
	                .showDistY(true)
        	        .transitionDuration(350)
	                .color(d3.scale.category10().range());
			
		  //Configure how the tooltip looks.
		  chart.tooltipContent(function(key) {
		      return '<h3>' + key + '</h3>';
		  });

		  //Axis settings
		  // Chart x-axis settings
                    if (attr.axisXLabel) {
                        chart.xAxis.axisLabel(attr.axisXLabel);
                    }

                    chart.xAxis.tickFormat(function (d) {
                            if (attr.axisXType && attr.axisXType === 'date') {
                                return d3.time.format(attr.axisXFormat)(new Date(d));
                            }
			    else if (attr.yScale == "ordinal") { return d; }

                            return d3.format(attr.axisXFormat)(d);
                        });
		  // Chart y-axis settings
		  if (attr.axisYLabel) {
                        chart.margin({left: 100})  // Adjust chart margins to give the y-axis some breathing room.
                        chart.yAxis.axisLabel(attr.axisYLabel);
                    }

		  var eventCodes = [100, 101, 102, 200, 201, 204, 205, 300, 301, 302, 400, 401, 402, 403, 500, 600, 700];
		  chart.yAxis.tickFormat(d3.format('.02f'));
			//.tickValues(eventCodes);
		  if (attr.yScale == "quantize"){
                        console.log("setting scale quantize");
			console.log("Min: " + attr.yScaleMin + ", Max: " + attr.yScaleMax);
                        chart.yScale(d3.scale.quantize().domain([attr.yScaleMin, attr.yScaleMax]).range(eventCodes));
                  } else if (attr.yScale == "log") {
                        console.log("setting scale log");
                        chart.yScale(d3.scale.log());
		  } else if (attr.yScale == "ordinal") {
			console.log("setting scale ordinal");
			chart.yAxis.scale(d3.scale.ordinal().domain(eventCodes).range(eventCodes.length));
                  } else {
			console.log("setting scale " + chart.yScale());
		  }

		  var svg = d3.select(element[0])
                        .append('svg');

                    if (attr.height) {
                        svg.style('height', attr.height + 'px');
                    }

                    if (attr.width) {
                        chart.style('width', attr.width + 'px');
                    }

    		  scope.$watch('data', function (newVal) {
                        if (newVal) {
                            svg.datum(scope.data); // Populate the <svg> element with chart data...
                            svg.call(chart);          //Finally, render the chart!
                        }
                    });
		  nv.utils.windowResize(chart.update);

		  return chart;
                    /* var chart = nv.models.scatterChart()
                        .useInteractiveGuideline(true)  //We want nice looking tooltips and a guideline!
                        .transitionDuration(350)  //how fast do you want the lines to transition?
                        .showLegend(attr.showLegend === 'true')       //Show the legend, allowing users to turn on/off line series.
                        .showYAxis(attr.showYAxis === 'true')        //Show the y-axis
                        .showXAxis(attr.showXAxis === 'true');        //Show the x-axis
                        //.interpolate(attr.interpolate);

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

                    return chart; */
                });
            }
        }
    });
