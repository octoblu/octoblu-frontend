'use strict';

/* Inspired by Lee Byron's test data generator. */
function stream_layers(n, m, o) {
  if (arguments.length < 3) o = 0;
  function bump(a) {
    var x = 1 / (.1 + Math.random()),
        y = 2 * Math.random() - .5,
        z = 10 / (.1 + Math.random());
    for (var i = 0; i < m; i++) {
      var w = (i / m - y) * z;
      a[i] += x * Math.exp(-w * w);
    }
  }
  return d3.range(n).map(function() {
      var a = [], i;
      for (i = 0; i < m; i++) a[i] = o + o * Math.random();
      for (i = 0; i < 5; i++) bump(a);
      return a.map(stream_index);
    });
}

/* Another layer generator using gamma distributions. */
function stream_waves(n, m) {
  return d3.range(n).map(function(i) {
    return d3.range(m).map(function(j) {
        var x = 20 * j / m - i / 3;
        return 2 * x * Math.exp(-.5 * x);
      }).map(stream_index);
    });
}

function stream_index(d, i) {
  return {x: i, y: Math.max(0, d)};
}

function exampleData() {
  return stream_layers(3,10+Math.random()*100,.1).map(function(data, i) {
    return {
      key: 'Stream #' + i,
      values: data
    };
  });
}

angular.module('octobluApp')
    .directive('nvd3MultibarChart', function () {
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
                showYAxis: '@',
		domain: '@'
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
		attr.domain = attr.domain || null;
		console.log("starting multibar directive");
                /*These lines are all chart setup.  Pick and choose which chart features you want to utilize. */
		// Watch data for any changes.
		var chart = nv.models.multiBarChart()
	      .transitionDuration(350)
	      .reduceXTicks(true)   //If 'false', every single x-axis tick label will be rendered.
	      .rotateLabels(0)      //Angle to rotate x-axis labels.
	      //.showControls(true)   //Allow user to switch between 'Grouped' and 'Stacked' mode.
		.stacked(false).showControls(false)
		.groupSpacing(0.1)    //Distance between each group of bars.
    		;

		 console.log("setting x axis options");
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
		 console.log("setting y axis options");
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

			console.log("setting up svg");
                    var svg = d3.select(element[0])
                        .append('svg');

                    if (attr.height) {
                        svg.style('height', attr.height + 'px');
                    }

                    if (attr.width) {
                        svg.style('width', attr.width + 'px');
                    } else {
		    }
		    

		scope.$watch('data', function (newVal) {
                if (newVal) {
	
			    console.log("new data in multibar");
			    console.log(scope.data);
			    console.log(exampleData());
                            svg.datum(scope.data); // Populate the <svg> element with chart data...
                            svg.call(chart);          //Finally, render the chart!
                        }
                    });

		  nv.utils.windowResize(chart.update);

		  return chart;
            }
        }
    });
