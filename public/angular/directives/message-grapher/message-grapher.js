angular.module('octobluApp')
    .directive('messageGrapher', function ($interval) {
        return {
            restrict: 'AE',
            templateUrl: 'angular/directives/message-grapher/message-grapher.html',
            replace: true,
            scope: {
                device: '='
            },
            link: function (scope, element) {
                var smoothie = new SmoothieChart();
                var line1 = new TimeSeries();
                smoothie.addTimeSeries(line1);
                smoothie.streamTo(element.find('canvas')[0]);
                scope.$on('skynet:message:' + scope.device.uuid, function(){
                   console.log('directive got event');
                    line1.append(new Date().getTime(), 1);
                });

                var intervalPromise = $interval(function(){
                    line1.append(new Date().getTime(), 0);
                }, 1000);

                scope.$on('$destroy', function(){
                    $interval.cancel(intervalPromise);
                });
            }
        }
    });
