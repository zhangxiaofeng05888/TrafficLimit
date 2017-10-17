/**
 * Created by wuzhen on 2017/1/12.
 */
angular.module('app').controller('shapeEditPanelCtrl', ['$scope',
    function ($scope) {
        var shapeEditor = fastmap.uikit.shapeEdit.ShapeEditor.getInstance();
        var eventController = fastmap.uikit.EventController();
        $scope.tools = [];
        $scope.snapActors = [];
        $scope.isOpen = false;

        var closePanel = function () {
            $scope.isOpen = false;
        };

        var openPanel = function () {
            $scope.isOpen = true;
        };

        var setTools = function (args) {
            if (args.tools.length <= 0) {
                $scope.isOpen = false;
            }
            $scope.tools = args.tools;
        };

        var setSnapActors = function (args) {
            $scope.snapActors = args.snapActors;
        };

        eventController.on(L.Mixin.EventTypes.OPENSHAPEEDITPANEL, openPanel);
        eventController.on(L.Mixin.EventTypes.REFRESHSHAPEEDITPANELTOOLS, setTools);
        eventController.on(L.Mixin.EventTypes.REFRESHSHAPEEDITPANELSNAPACTORS, setSnapActors);
        eventController.on(L.Mixin.EventTypes.CLOSESHAPEEDITPANEL, closePanel);

        $scope.onToolBtnClick = function (tool) {
            tool.checked = true;
            for (var i = 0; i < $scope.tools.length; ++i) {
                var item = $scope.tools[i];
                if (item.toolName === tool.toolName) {
                    item.checked = true;
                } else {
                    item.checked = false;
                }
            }
            eventController.fire(L.Mixin.EventTypes.SHAPEEDITTOOLCHANGED, { tool: tool });
        };

        $scope.onCloseBtnClick = function () {
            $scope.isOpen = false;
            eventController.fire(L.Mixin.EventTypes.SHAPEEDITPANELCLOSED);
        };

        $scope.onActorCkbClick = function (actor) {
            eventController.fire(L.Mixin.EventTypes.SHAPEEDITSNAPACTORCHANGED, { snapActor: actor });
        };

        $scope.$on('$destroy', function () {
            eventController.off(L.Mixin.EventTypes.OPENSHAPEEDITPANEL, openPanel);
            eventController.off(L.Mixin.EventTypes.REFRESHSHAPEEDITPANELTOOLS, setTools);
            eventController.off(L.Mixin.EventTypes.REFRESHSHAPEEDITPANELSNAPACTORS, setSnapActors);
            eventController.off(L.Mixin.EventTypes.CLOSESHAPEEDITPANEL, closePanel);
        });
    }
]);
