/**
 * Created by zhaohang on 2016/11/22.
 */
angular.module('app').controller('userToolCtrl', ['$rootScope', '$scope', '$ocLazyLoad', 'ngDialog', 'appPath', 'dsEdit', 'dsColumn', 'dsManage', 'dsFcc', '$interval', 'dsOutput', '$timeout',
    function ($rootScope, $scope, $ocLazyLoad, ngDialog, appPath, dsEdit, dsColumn, dsManage, dsFcc, $interval, dsOutput, $timeout) {
        var eventCtrl = fastmap.uikit.EventController();
        var sceneController = fastmap.mapApi.scene.SceneController.getInstance();
        $scope.menuList = []; // 控制菜单是否可用
        $scope.searchModel = {
            pageNum: 1,
            pageSize: 20,
            infoId: '',
            sPublicTime: '',
            ePublicTime: '',
            status: [false, false, false],
            period: [false, false],
            project: [false, false, false, false],
            sortype: '',
            sortord: ''
        };
        var initMenuList = function () {
            $scope.menuList = ['policyTable', 'resultList', 'submit', 'infoPanel', 'limit', 'log', 'intersectList', 'temporaryList', 'dealfailureList', 'datadifference', 'geometryCheck', 'geometryResult'];
        };
        $scope.backToInfo = function (flag) {
            if (flag) {
                return;
            }
            window.location.href = '#/group?access_token=' + App.Temp.accessToken + '&random=' + Math.floor(Math.random() * 100);
        };

        // 打开策略表
        $scope.showPolicyTool = function (flag) {
            if (flag) {
                return;
            }
            $scope.$emit('ShowInfoPage', {
                type: 'showPolicyPanel'
            });
        };
        // 编辑线列表
        $scope.spareLineList = function (flag) {
            if (flag) {
                return;
            }
            $scope.$emit('ShowInfoPage', {
                type: 'spareLine'
            });
        };
        // 相交线列表
        $scope.intersectList = function (flag) {
            if (flag) {
                return;
            }
            $scope.$emit('ShowInfoPage', {
                type: 'intersectLineList'
            });
        };
        // 重新批复
        $scope.submitAgain = function (flag) {
            if (flag) {
                return;
            }
            var params = {
                command: 'BATCH',
                type: 'SCPLATERESRDLINK',
                dbId: App.Temp.dbId,
                data: {
                    groupId: App.Temp.groupId
                }
            };
            dsFcc.submitAgain(params).then(function (data) {
                if (data !== -1) {
                    swal('提示', '批赋成功', 'success');
                    $scope.$emit('RefreshIntersectLineList');
                    eventCtrl.fire(eventCtrl.eventTypes.REFRESHDEALFAILURELIST);
                    sceneController.redrawLayerByGeoLiveTypes(['COPYTOLINE', 'COPYTOPOLYGON', 'DRAWPOLYGON', 'GEOMETRYLINE', 'GEOMETRYPOLYGON', 'LIMITLINE']);
                }
            });
        };
        // 提交几何
        $scope.submitGeometry = function (flag) {
            if (flag) {
                return;
            }
            var params = {
                command: 'CREATE',
                type: 'SCPLATERESGEOMETRY',
                dbId: App.Temp.dbId,
                data: {
                    groupId: App.Temp.groupId
                }
            };
            var paramInfo = {
                type: 'SCPLATERESINFO',
                condition: {
                    adminArea: App.Temp.infoToGroupData.cityId,
                    infoIntelId: App.Temp.infoToGroupData.infoId,
                    pageSize: 20,
                    pageNum: 1
                }
            };
            dsFcc.getInfoListData(paramInfo).then(function (res1) {
                if (res1 !== -1) {
                    var item1 = res1.data[0]; //  主键查询，查询成功只会有一条数据
                    var complete = item1.complete;
                    var param = {
                        type: 'NIVALEXCEPTION',
                        condition: {
                            searchType: 1,
                            infoIntelId: App.Temp.infoToGroupData.infoId
                        }
                    };
                    dsFcc.unTreatedList(param).then(function (result) {
                        if (result.total && result.total === 1) {
                            swal({ title: '提示', text: '存在未处理的检查log', type: 'warning', confirmButtonText: '确定' }, function (f) {
                                if (complete === 1) {
                                    $timeout(function () {
                                        swal({ title: '提示', text: '请手动更改当前作业情报的完成状态', type: 'warning', confirmButtonText: '确定' }, function (f1) {
                                            dsFcc.submitGeo(params).then(function (data) {
                                                if (data === '属性值未发生变化') {
                                                    $timeout(function () {
                                                        swal('提示', '无提交内容！', 'warning');
                                                    }, 1000);
                                                    return;
                                                }
                                                if (data !== -1) {
                                                    $timeout(function () {
                                                        swal('提示', '提交成功', 'success');
                                                    }, 1000);
                                                    $scope.$emit('RefreshResultList');
                                                    $scope.$emit('RefreshIntersectLineList');
                                                    eventCtrl.fire(eventCtrl.eventTypes.REFRESHDEALFAILURELIST);
                                                    sceneController.redrawLayerByGeoLiveTypes(['COPYTOLINE', 'COPYTOPOLYGON', 'DRAWPOLYGON', 'GEOMETRYLINE', 'GEOMETRYPOLYGON', 'LIMITLINE']);
                                                }
                                            });
                                        });
                                    }, 1000);
                                } else {
                                    dsFcc.submitGeo(params).then(function (data) {
                                        if (data === '属性值未发生变化') {
                                            $timeout(function () {
                                                swal('提示', '无提交内容！', 'warning');
                                            }, 1000);
                                            return;
                                        }
                                        if (data !== -1) {
                                            $timeout(function () {
                                                swal('提示', '提交成功', 'success');
                                            }, 1000);
                                            $scope.$emit('RefreshResultList');
                                            $scope.$emit('RefreshIntersectLineList');
                                            eventCtrl.fire(eventCtrl.eventTypes.REFRESHDEALFAILURELIST);
                                            sceneController.redrawLayerByGeoLiveTypes(['COPYTOLINE', 'COPYTOPOLYGON', 'DRAWPOLYGON', 'GEOMETRYLINE', 'GEOMETRYPOLYGON', 'LIMITLINE']);
                                        }
                                    });
                                }
                            });
                        } else {
                            if (complete === 1) {
                                $timeout(function () {
                                    swal({ title: '提示', text: '请手动更改当前作业情报的完成状态', type: 'warning', confirmButtonText: '确定' }, function (f1) {
                                        dsFcc.submitGeo(params).then(function (data) {
                                            if (data === '属性值未发生变化') {
                                                $timeout(function () {
                                                    swal('提示', '无提交内容！', 'warning');
                                                }, 1000);
                                                return;
                                            }
                                            if (data !== -1) {
                                                $timeout(function () {
                                                    swal('提示', '提交成功', 'success');
                                                }, 1000);
                                                $scope.$emit('RefreshResultList');
                                                $scope.$emit('RefreshIntersectLineList');
                                                eventCtrl.fire(eventCtrl.eventTypes.REFRESHDEALFAILURELIST);
                                                sceneController.redrawLayerByGeoLiveTypes(['COPYTOLINE', 'COPYTOPOLYGON', 'DRAWPOLYGON', 'GEOMETRYLINE', 'GEOMETRYPOLYGON', 'LIMITLINE']);
                                            }
                                        });
                                    });
                                }, 1000);
                            } else {
                                dsFcc.submitGeo(params).then(function (data) {
                                    if (data === '属性值未发生变化') {
                                        $timeout(function () {
                                            swal('提示', '无提交内容！', 'warning');
                                        }, 1000);
                                        return;
                                    }
                                    if (data !== -1) {
                                        $timeout(function () {
                                            swal('提示', '提交成功', 'success');
                                        }, 1000);
                                        $scope.$emit('RefreshResultList');
                                        $scope.$emit('RefreshIntersectLineList');
                                        eventCtrl.fire(eventCtrl.eventTypes.REFRESHDEALFAILURELIST);
                                        sceneController.redrawLayerByGeoLiveTypes(['COPYTOLINE', 'COPYTOPOLYGON', 'DRAWPOLYGON', 'GEOMETRYLINE', 'GEOMETRYPOLYGON', 'LIMITLINE']);
                                    }
                                });
                            }
                        }
                    });
                }
            });
        };

        // 几何检查
        $scope.geometryCheck = function () {
            $scope.$emit('ShowInfoPage', {
                type: 'geometryCheck'
            });
        };
        // 查看几何检查结果
        $scope.geometryCheckResult = function () {
            $scope.$emit('ShowInfoPage', {
                type: 'geometryCheckResult'
            });
        };
        // 打开几何成果列表
        $scope.showResultListPanel = function (flag) {
            if (flag) {
                return;
            }

            $scope.$emit('ShowInfoPage', {
                type: 'ResultListPanel'
            });
        };
        // 打开临时几何成果列表
        $scope.showTemporaryResultListPanel = function (flag) {
            if (flag) {
                return;
            }

            $scope.$emit('ShowInfoPage', {
                type: 'temporaryPanel'
            });
        };
        // 重复批赋失败的数据
        $scope.showdealfailureResultListPanel = function (flag) {
            if (flag) {
                return;
            }

            $scope.$emit('ShowInfoPage', {
                type: 'dealfailureList'
            });
        };
        // 数据差分数据列表
        $scope.showdatadifferenceResultListPanel = function (flag) {
            if (flag) {
                return;
            }

            $scope.$emit('ShowInfoPage', {
                type: 'datadifference'
            });
        };
        var initUserTool = function () {
            initMenuList();
        };

        initUserTool();
    }
]);
