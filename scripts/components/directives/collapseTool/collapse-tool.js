/**
 * Created by zhaohang on 2017/2/20.
 */
angular.module('fastmap.uikit').directive('toolCollapse', function () {
    return {
        restrict: 'EA',
        replace: true,
        transclude: true,
        scope: {
            title: '@expanderTitle'
        },
        templateUrl: '../../scripts/components/directives/collapseTool/collapse-tool.html',
        link: function (scope, element, attrs) {
            scope.showMe = true;
            scope.toggle = function toggle() {
                scope.showMe = !scope.showMe;
            };
        }
    };
});
