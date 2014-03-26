'use strict';

angular.module('e2eApp')
    .directive('toggleSwitch', function () {
        return {
            restrict: 'E',
            replace: true,

            scope: {
                state: '@',
                size : '@',
                onText: '@',
                offText: '@',
                onColor:'@',
                offColor:'@',
                label : '@',
                readOnly : '@',
                value: '@',
                ngModel: '='
            },
            template: '<input type="checkbox">',
            link: function (scope, element, attr) {


                attr.state = attr.state || false;
                attr.onText = attr.onText || 'ON';
                attr.offText = attr.offText || 'OFF';
                attr.onColor = attr.onColor || 'success';
                attr.offColor = attr.offColor|| 'danger';
                attr.size = attr.size || '';
                attr.label = attr.label || '';
                attr.readOnly = attr.readOnly || false;


                if( attr.state ){
                    $(element).attr('checked', '');
                } else{
                    $(element).removeAttr('checked');
                }


                $(element).bootstrapSwitch('size', attr.size);
                $(element).bootstrapSwitch('onText', attr.onText);
                $(element).bootstrapSwitch('onColor', attr.onColor);
                $(element).bootstrapSwitch('offText', attr.offText);
                $(element).bootstrapSwitch('offColor', attr.offText);
                $(element).bootstrapSwitch('animate', true);
                if(attr.readOnly){
                    $(element).bootstrapSwitch('readOnly', attr.readOnly);
                }

                if(attr.label && attr.label.length > 0){
                    $(element).attr('data-label-text', attr.label);
                }

//                $(element).bootstrapSwitch('state', attr.state);

              attr.$observe('state', function(val){
                  if(val){
                      console.log('value' + val);
                      $(element).attr('checked', '' );
                  } else {
                      $(element).removeAttr('checked');
                  }

              });
            }
        }
    });