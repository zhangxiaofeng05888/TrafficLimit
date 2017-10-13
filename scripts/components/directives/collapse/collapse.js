/**
 * Created by liwanchong on 2016/11/28.
 */
angular.module('fastmap.uikit').directive('fastCollapse', function () {
    return {
        restrict: 'EA',
        replace: true,
        transclude: true,
        scope: {
            title: '@expanderTitle',
            toolIcon: '@expanderToolIcon'
        },
        templateUrl: '../../scripts/components/directives/collapse/collapse.html',
        link: function (scope, element, attrs) {
            scope.showMe = true;
            scope.toggle = function toggle() {
                scope.showMe = !scope.showMe;
            };
        }
    };
});
