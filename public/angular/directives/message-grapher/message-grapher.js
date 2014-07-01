angular.module('octobluApp')
    .directive('messageGrapher', function ($interval) {
        return {
            restrict: 'AE',
            templateUrl: 'angular/directives/message-grapher/message-grapher.html',
            scope: {
                device: '='
            },
            link: function (scope, element) {
                var messages = [];
                var messageLines = {
                    message: new TimeSeries()
                };
                var smoothie = new SmoothieChart({
                    grid: { strokeStyle: 'rgb(125, 0, 0)', fillStyle: 'rgb(60, 0, 0)',
                        lineWidth: 1, millisPerLine: 250, verticalSections: 6 },
                    labels: { fillStyle: 'rgb(255,255,255)' }
                });
                smoothie.addTimeSeries(messageLines.message, { strokeStyle: 'rgb(0, 255, 0)', fillStyle: 'rgba(0, 255, 0, 0.4)', lineWidth: 3 });
                smoothie.streamTo(element.find('canvas')[0], 200);
                scope.$on('skynet:message:' + scope.device.uuid, function (event, message) {
                    messages.push(message.payload);
                    _.each(_.keys(message.payload), function (key) {
                        if ((typeof message.payload[key] === 'number') && !messageLines[key]) {
                            messageLines[key] = new TimeSeries();
                            smoothie.addTimeSeries(messageLines[key], { strokeStyle: 'rgb(255,0, 0)', fillStyle: 'rgba(255,0,0,0.4)', lineWidth: 3 });
                            console.log('added line for: ' + key);
                        }
                    });
                });

                var intervalPromise = $interval(function () {
                    messageLines.message.append(new Date().getTime(), messages.length);

                    if (messages.length) {
                        _.each(_.keys(messageLines), function (key) {
                            if (key !== 'message' && (typeof messages[0][key] === 'number')) {
                                messageLines[key].append(new Date().getTime(), messages[0][key]);
                            }
                        });
                    }

                    messages = [];
                }, 1000);

                scope.$on('$destroy', function () {
                    $interval.cancel(intervalPromise);
                });
            }
        }
    });
