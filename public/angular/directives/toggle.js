'use strict';

angular.module('e2eApp')
    .directive('toggleSwitch', function () {
        return {
            restrict: 'E',
            replace: true,
            template: '<input type="checkbox" checked data-on-color="success" data-off-color="danger">',
            scope: {
                value: '@',
                onText: '@',
                offText: '@',
                onClass:'@',
                offClass:'@',
                label : '@'
            },
            link: function (scope, element, attr) {

                $(element).bootstrapSwitch();
                attr.value = attr.value || 'false';
                attr.onText = attr.onText || 'ON';
                attr.offText = attr.offText || 'OFF';
                attr.onClass = attr.onClass || 'success';
                attr.offClass = attr.offClass || 'danger';
                attr.label = attr.label || '';

                if( attr.value ){
                    $(element).attr('checked', 'checked');
                } else{
                    $(element).attr('checked', null );
                }

            }
        }
    });