/**
 * Created by zhaohang on 2016/11/10.
 */
angular.module('app').controller('PoiRightEditPanelCtrl', ['$scope', '$rootScope', 'dsLazyload',
    'appPath', 'dsEdit', 'dsColumn', '$timeout', 'hotkeys',
    function ($scope, $rootScope, dsLazyload, appPath, dsEdit, dsColumn, $timeout, hotkeys) {
        var objectEditCtrl = FM.uikit.ObjectEditController();
        var eventCtrl = fastmap.uikit.EventController();
        var topoEditFactory = fastmap.uikit.topoEdit.TopoEditFactory.getInstance();
        var topoEditor = topoEditFactory.createTopoEditor('IXPOI', null);
        $scope.deletable = true;

        /* 审核状态*/
        $scope.statusObject = {
            1: '待作业',
            2: '待提交',
            3: '已提交'
        };

        var initialize = function () {
            if ($rootScope.CurrentObject) {
                var ctrl,
                    tmpl;
                $scope.fmFormEditable = $rootScope.Editable;
                if (App.Temp.monthTaskType) {
                    $scope.deletable = false;
                    ctrl = appPath.poi + 'ctrls/attr-base/deepInfoCtl.js';
                    tmpl = appPath.poi + 'tpls/attr-base/deepInfoTpl.html';
                    dsLazyload.loadInclude($scope, 'poiEditTmpl', ctrl, tmpl).then(function () {
                        $scope.$broadcast('ReloadData', {
                            data: $rootScope.CurrentObject
                        });
                    });
                } else {
                    ctrl = appPath.poi + 'ctrls/attr-base/generalBaseCtl.js';
                    tmpl = appPath.poi + 'tpls/attr-base/generalBaseTpl.html';
                    dsLazyload.loadInclude($scope, 'poiEditTmpl', ctrl, tmpl).then(function () {
                        $scope.$broadcast('ReloadData', {
                            data: $rootScope.CurrentObject
                        });
                    });
                }

                $scope.editable = $rootScope.Editable;
                $scope.deletable = topoEditor.canDelete($rootScope.CurrentObject);
                // POI不可删除时，也不能进行编辑，但是可以进行保存
                $scope.fmFormEditable = $rootScope.Editable && topoEditor.canEdit($rootScope.CurrentObject) && $scope.deletable;

                eventCtrl.fire('deletePoiToToolPanel', {
                    context: $scope,
                    panelType: 'singlePanel'
                });
            }
        };

        var emitObjUpdate = function (feature) {
            $scope.$emit('ObjectUpdated', {
                feature: feature,
                updateLogs: [{
                    type: 'IXPOI'
                }]
            });
        };

        var emitObjDelete = function (feature) {
            $scope.$emit('ObjectDeleted', {
                feature: feature,
                updateLogs: [{
                    type: 'IXPOI'
                }]
            });
        };

        // 执行完poi和深度信息保存后回调
        var callBackForPoi = function (poiList, feature) {
            if (poiList) { // 列表已打开
                var listSelectedPid = sessionStorage.getItem('listSelectedPid');
                var editingPid = objectEditCtrl.data.pid.toString();
                if (listSelectedPid) {
                    if (listSelectedPid === editingPid) {
                        if (poiList.indexOf(editingPid) > -1 && poiList.indexOf(editingPid) !== (poiList.length - 1)) {
                            feature.pid = parseInt(poiList[poiList.indexOf(editingPid) + 1], 0);
                            sessionStorage.setItem('listSelectedPid', feature.pid);
                            emitObjUpdate(feature);
                        } else if (poiList.indexOf(editingPid) === (poiList.length - 1)) {
                            emitObjUpdate(feature);
                            swal('注意', '已经是最后一条数据了！', 'info');
                        }
                    } else { // 未从列表中选中poi
                        var index = poiList.indexOf(listSelectedPid);
                        if (index === (poiList.length - 1)) {
                            emitObjUpdate(feature);
                        } else {
                            var pid = poiList[index + 1];
                            if (pid) {
                                feature.pid = pid;
                                sessionStorage.setItem('listSelectedPid', feature.pid);
                            }
                            emitObjUpdate(feature);
                        }
                    }
                } else {
                    emitObjUpdate(feature);
                }
            } else { // 列表未打开
                emitObjUpdate(feature);
            }
        };

        var save = function () {
            var geoLiveType = objectEditCtrl.data.geoLiveType;
            var simpleFeature;
            var changes = objectEditCtrl.data.getChanges();

            if (objectEditCtrl.data.state === 2) { // 删除状态的数据
                changes = {};
            }
            // 不修改直接点保存，能够保存，数据状态改变，跳转到下一条
            if (changes == null) {
                changes = {};
            }
            simpleFeature = new FM.dataApi.Feature({
                pid: objectEditCtrl.data.pid,
                geoLiveType: objectEditCtrl.data.geoLiveType
            });

            if (App.Temp.monthTaskType) { // 深度信息保存
                var param = {
                    type: 'IXPOI',
                    dbId: App.Temp.dbId,
                    objId: objectEditCtrl.data.pid,
                    secondWorkItem: App.Temp.monthTaskType,
                    subtaskId: App.Temp.subTaskId,
                    data: changes
                };
                dsColumn.saveDeepDataList(param).then(function (data) {
                    // 深度信息保存后切换到下一条数据，数据的pid列表已经放到session里
                    var poiPids;
                    if (sessionStorage.getItem('deepPids')) {
                        poiPids = sessionStorage.getItem('deepPids').split(',');
                    }
                    callBackForPoi(poiPids, simpleFeature);
                });
            } else { // 常规poi保存
                dsEdit.update(objectEditCtrl.data.pid, geoLiveType, changes).then(function (rest) {
                    var poiPids;
                    if (sessionStorage.getItem('poiPids')) {
                        poiPids = sessionStorage.getItem('poiPids').split(',');
                    }
                    callBackForPoi(poiPids, simpleFeature);
                });
            }
        };

        var deletePOi = function () {
            var geoLiveType = objectEditCtrl.data.geoLiveType;
            var simpleFeature = new FM.dataApi.Feature({
                pid: objectEditCtrl.data.pid,
                geoLiveType: objectEditCtrl.data.geoLiveType
            });
            dsEdit.delete(objectEditCtrl.data.pid, geoLiveType).then(function (rest) {
                var poiPids;
                if (sessionStorage.getItem('poiPids')) {
                    poiPids = sessionStorage.getItem('poiPids').split(',');
                }
                // 对数据删除进行时 如果是列表中的跳转到下一条 地图上选的关闭
                if (poiPids) {
                    var editPid = objectEditCtrl.data.pid.toString();
                    if (poiPids.indexOf(editPid) > -1 && poiPids.indexOf(editPid) != (poiPids.length - 1)) {
                        simpleFeature.pid = parseInt(poiPids[poiPids.indexOf(editPid) + 1], 0);
                        sessionStorage.setItem('listSelectedPid', simpleFeature.pid);
                        emitObjUpdate(simpleFeature);
                    } else if (poiPids.indexOf(editPid) == (poiPids.length - 1)) {
                        emitObjDelete(simpleFeature);
                        swal('注意', '已经是最后一条数据了！', 'info');
                        // getNextPage(function (pid) {
                        //     simpleFeature.pid = pid;
                        //     emitObjUpdate(simpleFeature);
                        // });
                    } else if (poiPids.indexOf(editPid) < 0) {   // 不在列表中
                        emitObjDelete(simpleFeature);
                    }
                } else {
                    emitObjDelete(simpleFeature);
                }
            });
        };

        var confirmVipPoiDel = function () {
            var level = objectEditCtrl.data.level;
            var title = '确定要删除POI吗？';
            if (level === 'A') {
                title = '确定要删除该重要POI吗？';
            }
            swal({
                title: title,
                type: 'warning',
                showCancelButton: true,
                closeOnConfirm: true,
                confirmButtonText: '确定',
                confirmButtonColor: '#ec6c62'
            }, function (f) {
                if (f) {
                    deletePOi();
                }
            });
        };

        $scope.doDelete = function () {
            var taskCookie = App.Util.getSessionStorage('SubTask');
            if ((App.Temp.taskType == 0 || App.Temp.taskType == 2) && taskCookie.qcTaskFlag) { // 质检
                swal({
                    title: '确认删除?', type: 'warning', showCancelButton: true, closeOnConfirm: true, confirmButtonText: '确定', confirmButtonColor: '#ec6c62'
                }, function (f) {
                    if (f) {
                        var handler = $scope.$on('DoSaveOfExQuality', function (p1, p2) {
                            if (p2 == 'ExternalQuality') {
                                handler();
                                handler = null;
                                deletePOi();
                            }
                        });
                        $scope.$emit('ShowInfoPage', { type: 'ExternalQuality' });
                    }
                });
            } else { // 常规 -- 只是针对常规会有重要poi的提醒
                confirmVipPoiDel();
            }
        };

        var validateForm = function (form) {
            if (form.doValidate) {
                form.doValidate();
            }
            for (var k in form) {
                if (form.hasOwnProperty(k) && k.indexOf('$') < 0 && Utils.isObject(form[k]) && form[k].constructor.name === 'FormController') {
                    validateForm(form[k]);
                }
            }
        };

        var showInfo = function () {
            var forms = objectEditCtrl.data.getErrors().form;
            var edits = objectEditCtrl.data.getErrors().edit;
            var errors = [];
            if (forms && !Utils.isEmptyObject(forms)) {
                for (var k in forms) {
                    if (forms.hasOwnProperty(k)) {
                        errors.push(forms[k]);
                        break;
                    }
                }
            }
            if (edits && !Utils.isEmptyObject(edits)) {
                for (var p in edits) {
                    if (edits.hasOwnProperty(p)) {
                        errors.push(edits[p]);
                        break;
                    }
                }
            }
            if (errors.length > 0) {
                if (errors[0].code == 1) {
                    swal('注意', errors[0].message, 'error');
                } else if (errors[0].code == 2) {
                    swal('注意', errors[0].message, 'info');
                }
            }
        };

        var confirmVipPoiSave = function (callback) {
            var changes = objectEditCtrl.data.getChanges();
            var freVefi = objectEditCtrl.data.freshnessVefication; // 0--否 非0--是
            var oldLevel = objectEditCtrl.data._originalJson.level;
            var state = objectEditCtrl.data.state; // state --1新增，2删除 3修改
            if (state == 3 && freVefi == 0 && changes != null && oldLevel == 'A') {
                swal({
                    title: '确定要维护该重要POI吗？',
                    type: 'warning',
                    showCancelButton: true,
                    closeOnConfirm: true,
                    confirmButtonText: '确定',
                    confirmButtonColor: '#ec6c62'
                }, function (f) {
                    if (f) {
                        callback();
                    }
                });
            } else {
                callback();
            }
        };

        $scope.doSave = function () {
            if (objectEditCtrl.data.state != 2) { // 删除状态的数据不进行验证
                validateForm($scope.poiForm);
                if ($scope.poiForm.$invalid) {
                    swal('注意', '属性输入有错误，请检查！', 'error');
                    return;
                }

                if (!objectEditCtrl.data.validate()) {
                    showInfo();
                    return;
                }
            }

            var taskCookie = App.Util.getSessionStorage('SubTask');
            var handler;
            // 0: poi采集 2：一体化采集
            if ((App.Temp.taskType == 0 || App.Temp.taskType == 2) && taskCookie.qcTaskFlag) {
                handler = $scope.$on('DoSaveOfExQuality', function (p1, p2) {
                    if (p2 == 'ExternalQuality') {
                        handler();
                        handler = null;
                        save();
                    }
                });
                $scope.$emit('ShowInfoPage', { type: 'ExternalQuality' });
            } else if (App.Temp.taskType == 7) {   // 7: 月编专项
                if (taskCookie.qcTaskFlag) {
                    handler = $scope.$on('DoSaveOfExQuality', function (p1, p2) {
                        if (p2 == 'DeepInfoQuality') {
                            handler();
                            handler = null;
                            save();
                        }
                    });
                    $scope.$emit('ShowInfoPage', { type: 'DeepInfoQuality' });
                } else {
                    save();
                }
            } else { // 常规，只有常规需要进行重要poi的提醒
                confirmVipPoiSave(function () {
                    save();
                });
            }
        };

        // 监听POI点位调整
        eventCtrl.on(eventCtrl.eventTypes.POIMOVEABLEREQ, function (data) {
            var html = '<div class="input-radio" id="rawFileds"><div><input type="radio" name="rawFields" checked value="8">与道路逻辑关系调整</div>' +
                '<div><input type="radio" name="rawFields" value="9">与设施逻辑关系调整</div>' +
                '<div><input type="radio" name="rawFields" value="10">精度调整</div></div>';
            swal({
                title: '移动的距离是‘' + data.distance + '’米，确定移动么？确认点击‘是’并选择移动原因，否则点击‘否’',
                text: html,
                html: true,
                animation: 'slide-from-top',
                allowEscapeKey: false,
                showCancelButton: true,
                confirmButtonText: '是',
                confirmButtonColor: '#ec6c62',
                cancelButtonText: '否'
            }, function (f) {
                if (f) {
                    var rawFields = $("#rawFileds input[type='radio'][name='rawFields']:checked").val();
                    eventCtrl.fire(eventCtrl.eventTypes.POIMOVEABLERES, { rawFields: rawFields });
                }
            });
        });

        var bindHotKeys = function () {
            hotkeys.bindTo($scope).add({
                combo: 'ctrl+s',
                description: '保存POI信息',
                allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
                callback: function (e) {
                    e.preventDefault();
                    if (!$scope.loading.flag) { // 解决用户连续点击ctrl+s保存导致数据错误的问题
                        $scope.doSave();
                    }
                }
            });
        };
        bindHotKeys();

        $scope.$on('PoiRightEditPanelReload', initialize);

        $scope.$on('$destroy', function () {
        });
    }
]);
