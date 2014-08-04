angular.module('octobluApp')
    .service('FlowLinkRenderer', function () {
        var nodeType = {
            width: 100,
            height: 35
        };
        var dispatch = d3.dispatch('linkChanged');
        var renderLine = d3.svg.line()
            .x(function (coordinate) {
                return coordinate.x;
            })
            .y(function (coordinate) {
                return coordinate.y;
            })
            .interpolate('basis');
        return function (renderScope) {
            var linkRenderer = this;

            this.render = function (links) {
                var linkData = renderScope.selectAll('.flow-link').data(links);
                linkData.enter().append('path');

                linkRenderer.update(linkData);
                linkData.exit().remove();
                return dispatch;
            };

            this.update = function (links) {
                links
                    .attr('class', function (link) {
                        var classes = [ 'flow-link' ];
                        classes.push('contains-node-' + link.from);
                        classes.push('contains-node-' + link.to);

                        return classes.join(' ');
                    })
                    .attr('d', function (link) {
                        var sourceNode = renderScope.select('.flow-node-' + link.from).data()[0],
                            targetNode = renderScope.select('.flow-node-' + link.to).data()[0];

                        var fromCoordinate = {
                            x: sourceNode.x + nodeType.width,
                            y: sourceNode.y + (nodeType.height / 2)
                        };

                        var fromCoordinateCurveStart = {
                            x: fromCoordinate.x + nodeType.height,
                            y: fromCoordinate.y
                        };

                        var toCoordinate = {x: targetNode.x, y: targetNode.y + (nodeType.height / 2)};

                        var toCoordinateCurveStart = {x: toCoordinate.x - nodeType.height, y: toCoordinate.y};

                        return renderLine([fromCoordinate, fromCoordinateCurveStart, toCoordinateCurveStart, toCoordinate]);
                    });
            };

            this.updateLinksContaining = function (flowNode) {
                this.update(d3.selectAll('.contains-node-' + flowNode.id));
            };

            this.clear = function () {
                renderScope.select('.flow-link').remove();
            }
        };
    });
