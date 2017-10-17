/**
 * Created by liuyang on 2016/8/5.
 */
angular.module('app').controller('startEditCtrl', ['$scope',
    function ($scope) {
        var sceneCtrl = fastmap.mapApi.scene.SceneController.getInstance();
        var dataServiceFcc = fastmap.service.DataServiceFcc.getInstance();
        var map = $scope.map;
        var minEditZoom = App.Config.map.layerZoom.minEditZoom || 17;

        var testEditZoom = function () {
            if (map.getZoom() < minEditZoom) {
                swal('提示', '地图缩放等级在' + minEditZoom + '级以上才可操作', 'info');
                return false;
            }
            return true;
        };

        $scope.create = function (event, geoLiveType, options) {
            if (!testEditZoom()) {
                return;
            }

            $scope.$emit('Map-EnableTool', {
                geoLiveType: geoLiveType,
                operation: 'Create'
            });
            $scope.selectTool.name = geoLiveType;

            var factory = fastmap.uikit.editControl.EditControlFactory.getInstance();
            var createControl = factory.createControl(map, geoLiveType, options);

            if (!createControl) {
                swal('提示', '编辑流程未实现', 'info');
                return;
            }

            createControl.run();
            $scope.$emit('Map-ToolEnabled');
        };

        // 创建辅路和上下线分离流程
        $scope.createUpDownAndSideRoad = function (event, geoLiveType, options) {
            if (!testEditZoom()) {
                return;
            }

            $scope.$emit('Map-EnableTool', {
                geoLiveType: geoLiveType,
                operation: 'Create'
            });
            $scope.selectTool.name = geoLiveType;

            var factory = fastmap.uikit.editControl.EditControlFactory.getInstance();
            var createControl = factory.createBuffer(map, geoLiveType, options);

            if (!createControl) {
                swal('提示', '编辑流程未实现', 'info');
                return;
            }

            createControl.run();

            $scope.$emit('Map-ToolEnabled');
        };

        $scope.createAdminJoinFaces = function (event, geoLiveType) {
            if (!testEditZoom()) {
                return;
            }

            $scope.$emit('Map-EnableTool', {
                geoLiveType: geoLiveType,
                operation: 'Build'
            });
            $scope.selectTool.name = geoLiveType;

            var factory = fastmap.uikit.editControl.EditControlFactory.getInstance();
            var createControl = factory.createAdminJoinFaces(map, 'ADADMIN');

            if (!createControl) {
                swal('提示', '编辑流程未实现', 'info');
                return;
            }

            createControl.run();

            $scope.$emit('Map-ToolEnabled');
        };

        $scope.build = function (event, geoLiveType, options) {
            if (!testEditZoom()) {
                return;
            }

            $scope.$emit('Map-EnableTool', {
                geoLiveType: geoLiveType,
                operation: 'Build'
            });

            $scope.selectTool.name = geoLiveType;
            if (geoLiveType.indexOf('BUILD-') === 0) {
                geoLiveType = geoLiveType.substr(6); // 选中效果是根据geoLiveType参数来添加的，所以需要加前缀进行区分
            }

            var factory = fastmap.uikit.editControl.EditControlFactory.getInstance();
            var createControl = factory.createLineDimensions(map, geoLiveType);

            if (!createControl) {
                swal('提示', '编辑流程未实现', 'info');
                return;
            }

            createControl.run();

            $scope.$emit('Map-ToolEnabled');
        };

        $scope.select = function (event, geoLiveType, mode) {
            if (!testEditZoom()) {
                return;
            }

            $scope.$emit('Map-EnableTool', {
                geoLiveType: geoLiveType,
                operation: 'Select'
            });
            $scope.selectTool.name = 'SELECT';

            var factory = fastmap.uikit.editControl.EditControlFactory.getInstance();
            var selectControl = factory.selectControl(map, geoLiveType, {
                selectMode: mode ? mode : 'point'
            });

            if (!selectControl) {
                swal('提示', '编辑流程未实现', 'info');
                return;
            }

            selectControl.run();

            // add by chenx on 2017-9-4
            // 记录选择工具，当数据刷新后，依然启动选择工具
            $scope.$emit('Map-ToolEnabled', {
                editCtrl: selectControl
            });
            $scope.$emit('StartEditCtrl-ChangeFirstTool', $scope.selectTool.name);
        };

        $scope.modify = function (event, geoLiveType) {
            if (!testEditZoom()) {
                return;
            }

            $scope.$emit('Map-EnableTool', {
                geoLiveType: geoLiveType,
                operation: 'Modify'
            });

            var factory = fastmap.uikit.editControl.EditControlFactory.getInstance();
            var modifyControl = factory.modifyControl(map, geoLiveType);

            if (!modifyControl) {
                swal('提示', '编辑流程未实现', 'info');
                return;
            }

            modifyControl.run();

            $scope.$emit('Map-ToolEnabled');
        };

        $scope.pan = function (event) {
            $scope.$emit('Map-EnableTool', {
                operation: 'Pan'
            });
            $scope.selectTool.name = 'PAN';

            var factory = fastmap.uikit.editControl.EditControlFactory.getInstance();
            var startupToolControl = factory.startupToolControl(map, 'PanTool');

            if (!startupToolControl) {
                swal('提示', '编辑流程未实现', 'info');
                return;
            }

            startupToolControl.run();

            $scope.$emit('Map-ToolEnabled');
        };

        $scope.copyLine = function (event, geoLiveType) {
            if (!testEditZoom()) {
                return;
            }

            $scope.$emit('Map-EnableTool');

            var factory = fastmap.uikit.editControl.EditControlFactory.getInstance();
            var createTipsControl = factory.createControl(map, geoLiveType);

            if (!createTipsControl) {
                swal('提示', '编辑流程未实现', 'info');
                return;
            }

            createTipsControl.run();

            $scope.$emit('Map-ToolEnabled');
        };

        $scope.addTips = function (event, geoLiveType, options) {
            if (!testEditZoom()) {
                return;
            }

            $scope.$emit('Map-EnableTool', {
                geoLiveType: geoLiveType,
                operation: 'Create'
            });

            var factory = fastmap.uikit.editControl.EditControlFactory.getInstance();
            var createTipsControl = factory.createTipsControl(map, geoLiveType, options);

            if (!createTipsControl) {
                swal('提示', '编辑流程未实现', 'info');
                return;
            }

            createTipsControl.run();

            $scope.$emit('Map-ToolEnabled');
        };

        $scope.batchSelect = function (event, geoLiveType, operate) {
            if (!testEditZoom()) {
                return;
            }

            $scope.$emit('Map-EnableTool', {
                geoLiveType: geoLiveType,
                operation: 'BatchSelect'
            });
            if (operate) {
                $scope.selectTool.name = operate + '-' + geoLiveType;
            } else {
                $scope.selectTool.name = 'batch-' + geoLiveType;
            }

            var options = {
                selectMode: operate
            };
            var factory = fastmap.uikit.editControl.EditControlFactory.getInstance();
            var selectControl = factory.batchSelectControl(map, geoLiveType, options);

            if (!selectControl) {
                swal('提示', '编辑流程未实现', 'info');
                return;
            }

            selectControl.run();

            $scope.$emit('Map-ToolEnabled', {
                editCtrl: selectControl
            });
            $scope.$emit('StartEditCtrl-ChangeFirstTool', $scope.selectTool.name);
        };

        $scope.angle = function () {
            $scope.$emit('Map-EnableTool', {
                operation: 'Angle'
            });
            $scope.selectTool.name = 'angle';

            var factory = fastmap.uikit.editControl.EditControlFactory.getInstance();
            var startupToolControl = factory.startupToolControl(map, 'AngleTool');

            if (!startupToolControl) {
                swal('提示', '编辑流程未实现', 'info');
                return;
            }

            startupToolControl.run();

            $scope.$emit('Map-ToolEnabled');
        };

        $scope.distance = function () {
            $scope.$emit('Map-EnableTool', {
                operation: 'Distance'
            });
            $scope.selectTool.name = 'distance';

            var factory = fastmap.uikit.editControl.EditControlFactory.getInstance();
            var startupToolControl = factory.startupToolControl(map, 'DistanceTool');

            if (!startupToolControl) {
                swal('提示', '编辑流程未实现', 'info');
                return;
            }

            startupToolControl.run();

            $scope.$emit('Map-ToolEnabled');
        };

        $scope.area = function () {
            $scope.$emit('Map-EnableTool', {
                operation: 'Area'
            });
            $scope.selectTool.name = 'area';

            var factory = fastmap.uikit.editControl.EditControlFactory.getInstance();
            var startupToolControl = factory.startupToolControl(map, 'AreaTool');

            if (!startupToolControl) {
                swal('提示', '编辑流程未实现', 'info');
                return;
            }

            startupToolControl.run();

            $scope.$emit('Map-ToolEnabled');
        };

        $scope.autoBreak = function (geoLiveType) {
            if (!testEditZoom()) {
                return;
            }

            $scope.$emit('Map-EnableTool', {
                operation: 'AutoBreak'
            });
            $scope.selectTool.name = 'autoBreak';

            var factory = fastmap.uikit.editControl.EditControlFactory.getInstance();
            var startupToolControl = factory.autoBreakControl(map, geoLiveType);

            if (!startupToolControl) {
                swal('提示', '编辑流程未实现', 'info');
                return;
            }

            startupToolControl.run();

            $scope.$emit('Map-ToolEnabled');
        };

        $scope.finishPlanData = function (taskId) {
            if (!taskId) {
                swal('提示', '未选择任务不能提交', 'info');
                return;
            }
            swal({
                title: '完成数据规划',
                type: 'success',
                animation: 'slide-from-top',
                closeOnConfirm: true,
                showCancelButton: true,
                confirmButtonText: '提交',
                cancelButtonText: '取消'
            }, function () {
                dataServiceFcc.uploadPlanData(taskId).then(function (data) {
                    swal({ title: '该任务已经完成数据规划并提交成功',
                        type: 'success',
                        animation: 'slide-from-top',
                        closeOnConfirm: true,
                        showCancelButton: true,
                        confirmButtonText: '确定'
                    }, function () {
                        $scope.$emit('COMMIT-SUCCESS-REFRESH', { taskId: taskId });
                    });
                });
            });
        };
        $scope.upLoadSubTask = function (subtaskId) {
            if (!subtaskId) {
                swal('提示', '没选择子任务不能提交', 'info');
                return;
            }
            swal({
                title: '完成质检圈画分',
                type: 'success',
                animation: 'slide-from-top',
                closeOnConfirm: true,
                showCancelButton: true,
                confirmButtonText: '提交',
                cancelButtonText: '取消'
            }, function () {
                dataServiceFcc.qualityCommit(subtaskId).then(function (data) {
                    swal('提示', '该子任务已经完成质检圈规划并提交成功', 'success');
                    var drawCircle = fastmap.DrawCircle.getInstance();
                    drawCircle.clear();
                    $scope.$emit('COMMIT-SUCCESS-REFRESH', { subtaskId: subtaskId });
                    // swal({
                    //     title: '该子任务已经完成质检圈规划并提交成功',
                    //     type: 'success',
                    //     animation: 'slide-from-top',
                    //     closeOnConfirm: true,
                    //     confirmButtonText: '确定'
                    // }, function () {
                    //     $scope.$emit('COMMIT-SUCCESS-REFRESH', { subtaskId: subtaskId });
                    // });
                });
            });
        };

        $scope.showBatchSelctPanel = function () {

        };

        $scope.batchTranslatePoiLocation = function () {
            $scope.$emit('Map-EnableTool', {
                geoLiveType: 'IXPOI',
                operation: 'BatchTranslatePoiLocation'
            });
            $scope.selectTool.name = 'batchTranslatePoiLocation';

            var factory = fastmap.uikit.editControl.EditControlFactory.getInstance();
            var batchTranslatePoiLocationControl = factory.batchTranslatePoiLocationControl(map);

            if (!batchTranslatePoiLocationControl) {
                swal('提示', '编辑流程未实现', 'info');
                return;
            }

            batchTranslatePoiLocationControl.run();

            $scope.$emit('Map-ToolEnabled');
        };

        $scope.batchConvergePoiLocation = function () {
            $scope.$emit('Map-EnableTool', {
                geoLiveType: 'IXPOI',
                operation: 'BatchConvergePoiLocation'
            });
            $scope.selectTool.name = 'batchConvergePoiLocation';

            var factory = fastmap.uikit.editControl.EditControlFactory.getInstance();
            var batchConvergePoiLocationControl = factory.batchConvergePoiLocationControl(map);

            if (!batchConvergePoiLocationControl) {
                swal('提示', '编辑流程未实现', 'info');
                return;
            }

            batchConvergePoiLocationControl.run();

            $scope.$emit('Map-ToolEnabled');
        };

        $scope.batchPoiGuideManual = function () {
            $scope.$emit('Map-EnableTool', {
                geoLiveType: 'IXPOI',
                operation: 'BatchPoiGuideManual'
            });
            $scope.selectTool.name = 'batchPoiGuideManual';

            var factory = fastmap.uikit.editControl.EditControlFactory.getInstance();
            var batchPoiGuideManualControl = factory.batchPoiGuideManualControl(map);

            if (!batchPoiGuideManualControl) {
                swal('提示', '编辑流程未实现', 'info');
                return;
            }

            batchPoiGuideManualControl.run();

            $scope.$emit('Map-ToolEnabled');
        };

        $scope.batchPoiGuideAuto = function () {
            $scope.$emit('Map-EnableTool', {
                geoLiveType: 'IXPOI',
                operation: 'BatchPoiGuideAuto'
            });
            $scope.selectTool.name = 'batchPoiGuideAuto';

            var factory = fastmap.uikit.editControl.EditControlFactory.getInstance();
            var batchPoiGuideAutoControl = factory.batchPoiGuideAutoControl(map);

            if (!batchPoiGuideAutoControl) {
                swal('提示', '编辑流程未实现', 'info');
                return;
            }

            batchPoiGuideAutoControl.run();

            $scope.$emit('Map-ToolEnabled');
        };
    }
]);
