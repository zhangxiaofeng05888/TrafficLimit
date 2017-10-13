/**
 * Created by mali on 2017/4/12.
 * 元数据折叠
 */
angular.module('fastmap.uikit').directive('metaCollapse', function () {
    return {
        restrict: 'EA',
        replace: true,
        transclude: true,
        scope: {
            title: '@expanderTitle'
        },
        templateUrl: '../../scripts/components/directives/metaCollapse/collapse.html',
        link: function (scope, element, attrs) {
            scope.showMe = true;
            scope.toggle = function toggle() {
                scope.showMe = !scope.showMe;
            };
        }
    };
});
