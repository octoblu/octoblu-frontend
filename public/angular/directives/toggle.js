'use strict';

angular.module('octobluApp')
    .directive('toggleSwitch', function () {
        return {
            restrict: 'AE',
            replace: true,

            scope: {
                state: '@',
                size : '@',
                onText: '@',
                offText: '@',
                onColor:'@',
                offColor:'@',
                label : '@',
                disabled : '@',
                readOnly : '@',
                value: '@',
                'class' : '@',
                ngModel: '='
            },
            template: '<input type="checkbox" >',
            link: function (scope, element, attr) {


                attr.state = attr.state || false;
                attr.onText = attr.onText || 'YES';
                attr.offText = attr.offText || 'NO';
                attr.onColor = attr.onColor || 'success';
                attr.offColor = attr.offColor|| 'danger';
                attr.size = attr.size || '';
                attr.label = attr.label || '';
                attr.readOnly = attr.readOnly || false;
                attr.disabled = attr.disabled || false;

                $(element).attr('data-on-text', attr.onText);
                $(element).attr('data-on-color', attr.onColor);
                $(element).attr('data-off-text', attr.offText);
                $(element).attr('data-off-color', attr.offColor);
                $(element).attr('data-animate', true);

                if(attr.size.length > 0){
                    $(element).attr('data-size', attr.size);

                }

                if( attr.state ){
                    $(element).attr('checked', '');
                } else{
                    $(element).removeAttr('checked');
                }

                if(attr.readOnly){
                    $(element).attr('readonly', 'readonly');
                }

                if(attr.disabled){
                    $(element).attr('disabled', 'disabled');
                }

                if(attr.label && attr.label.length > 0){
                    $(element).attr('data-label-text', attr.label);
                }

                $(element).bootstrapSwitch();


              attr.$observe('state', function(val){
                  $(element).bootstrapSwitch('state', val);
              });
            }
        }
    });