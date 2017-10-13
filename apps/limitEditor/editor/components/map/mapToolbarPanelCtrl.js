/**
 * Created by zhaohang on 2016/11/22.
 */
angular.module('app').controller('MapAllToolbarPanelCtrl', ['$scope', '$rootScope', '$compile', '$timeout',
    function ($scope, $rootScope, $compile, $timeout) {
        // var layerCtrl = fastmap.uikit.LayerController();
        var shapeCtrl = fastmap.uikit.ShapeEditorController();

        $scope.editable = false;

        var toggleEditable = function (event, data) {
            $scope.editable = data.editable;
        };

        $scope.toggleToRecent = function (e) {
            if ($scope.editable) {
                var elem = angular.element(e.currentTarget);
                var p = elem.parent();
                if (p.hasClass('selected')) {
                    $scope.$emit('MapToolbar-removeTool', {
                        ngController: p.attr('ng-controller'),
                        ngClick: p.attr('ng-click')
                    });
                    p.removeClass('selected');
                } else {
                    $scope.$emit('MapToolbar-addTool', {
                        title: p.attr('title'),
                        ngController: p.attr('ng-controller'),
                        ngClick: p.attr('ng-click'),
                        ngClass: p.attr('ng-class'),
                        icon: elem.html()
                    });
                    p.addClass('selected');
                }
                e.stopPropagation();
            }
        };

        var replaceTool = function (event, data) {
            var allTools = $('.map-toolbar-panel li.tool');
            var tool;
            for (var i = 0; i < allTools.length; i++) {
                tool = $(allTools[i]);
                if (tool.attr('ng-controller') === data.ngController && tool.attr('ng-click') === data.ngClick) {
                    tool.removeClass('selected');
                    break;
                }
            }
        };

        var test = function (data) {
            var recentTools = data.data;
            var allTools = $('.map-toolbar-panel li.tool');
            var i,
                j,
                t;
            for (i = 0; i < allTools.length; i++) {
                t = $(allTools[i]);
                for (j = 0; j < recentTools.length; j++) {
                    if (t.attr('ng-controller') === recentTools[j].ngController && t.attr('ng-click') === recentTools[j].ngClick) {
                        t.addClass('selected');
                        break;
                    }
                }
            }
        };

        // 初始化工具栏，判定哪些工具已被添加到常用工具栏，将其样式修改为selected
        var initTools = function (event, data) {
            // 由于页面中用了其他指令（tool-collapse）来生成html页面，因此当此html加载完成时，tool-collapse指令尚未加载完成
            // 此时如果用jquery的dom选择器，则选择不上tool-collapse指令中dom元素
            // 因此使用$timeout来等待页面全部渲染完成后，在获取dom元素
            $timeout(function () {
                test(data);
            });
        };

        $scope.$on('MapToolbarPanelReload', initTools);

        $scope.$on('MapToolbar-toggleEditable', toggleEditable);

        $scope.$on('MapToolbar-replaceTool', replaceTool);

        $scope.$on('$destroy', function (event, data) {
            $scope.$emit('MapToolbar-panelClosed');
        });
    }
]);
