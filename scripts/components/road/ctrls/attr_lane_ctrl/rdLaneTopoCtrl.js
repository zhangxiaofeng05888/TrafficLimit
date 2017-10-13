/**
 * Created by liuyang on 2016/9/9.
 */
/*
 * 动态拼的div作用域在controllor之外，只能写到这里
 * */
var inLanePid = null;
var outLanePid = null;
var outLinkPid = null;
var laneTopoVias = [];
var showPanelIndex = null;
var panelIndex = null;

// 重新计数
function modifyNums() {
    for (var i = 0; i < laneTopoVias.length; i++) {
        laneTopoVias[i].seqNum = i + 1;
        $('#label' + laneTopoVias[i].lanePid).text(laneTopoVias[i].seqNum.toString());
    }
}
// 选择车道
function selectLane(self, event, inLinkPid, linkPid, lanePid, laneDir, index) {
    var i;
    if (showPanelIndex) {
        showPanelIndex = null;
        panelIndex = null;
        $('.red').removeClass('red');
        $('.green').removeClass('green');
        $('.yellow').removeClass('yellow');
    }
    if (index === 1) { // 选中车道，一条link上的车道只能被选一次
        if (linkPid === inLinkPid) { // 进入车道,只能选一条进入线
            if (inLanePid == null) {
                inLanePid = lanePid;
                $('#' + lanePid).addClass('red');
                $('#checkbox' + lanePid).prop({
                    checked: true
                });
            } else if (inLanePid === lanePid) { // 取消选择
                $('#' + inLanePid).removeClass('red');
                $('#checkbox' + inLanePid).prop({
                    checked: false
                });
                inLanePid = null;
            } else if (inLanePid === lanePid) { // 取消选择
                $('#' + inLanePid).removeClass('red');
                $('#checkbox' + inLanePid).prop({
                    checked: false
                });
                inLanePid = null;
            } else {
                $('#' + inLanePid).removeClass('red');
                $('#checkbox' + inLanePid).prop({
                    checked: false
                });
                inLanePid = lanePid;
                $('#' + lanePid).addClass('red');
                $('#checkbox' + lanePid).prop({
                    checked: true
                });
            }
        } else { // 作为经过车道
            var selfFlag = true;
            if (outLinkPid === linkPid) { // 退出车道所在的link
                return;
            }
            for (var kk = 0; kk < laneTopoVias.length; kk++) { // 取消选择
                if (laneTopoVias[kk].lanePid === lanePid) {
                    $('#' + lanePid).removeClass('green');
                    $('#label' + lanePid).text('');
                    laneTopoVias.splice(kk, 1);
                    kk--;
                    selfFlag = false;
                }
            }
            if (!selfFlag) {
                modifyNums();
                return;
            }
            laneTopoVias.push({
                lanePid: lanePid,
                seqNum: laneTopoVias.length + 1,
                linkPid: linkPid
            });
            for (i = 0; i < laneTopoVias.length - 1; i++) {
                if (laneTopoVias[i].linkPid === linkPid) {
                    $('#label' + laneTopoVias[i].lanePid).text('');
                    laneTopoVias.splice(i, 1);
                    break;
                }
            }
            $('#' + lanePid).siblings().removeClass('green');
            $('#' + lanePid).siblings().find('.bottom').prop({
                checked: false
            });
            $('#' + lanePid).addClass('green');
            $('#label' + lanePid).text(laneTopoVias.length);
        }
    } else { // 选中checkbox,经过线不会是checkbox
        event.stopPropagation();
        if (self.checked === true) {
            if (linkPid === inLinkPid) { // 进入车道
                if (inLanePid == null) {
                    inLanePid = lanePid;
                    $('#' + lanePid).addClass('red');
                } else {
                    $('#' + inLanePid).removeClass('red');
                    $('#checkbox' + inLanePid).prop({
                        checked: false
                    });
                    inLanePid = lanePid;
                    $('#' + lanePid).addClass('red');
                }
            } else if (outLanePid == null) { // 退出车道
                $('#' + lanePid).siblings().removeClass('yellow');
                $('#' + lanePid).siblings().removeClass('green');
                $('#' + lanePid).siblings().find('.bottom').prop({
                    checked: false
                });
                $('#' + lanePid).siblings().find('.number').text('');
                for (var k = 0; k < laneTopoVias.length; k++) { // 之前是经过车道，去掉
                    if (laneTopoVias[k].linkPid === linkPid) {
                        $('#' + laneTopoVias[k].lanePid).removeClass('green');
                        $('#label' + laneTopoVias[k].lanePid).text('');
                        laneTopoVias.splice(k, 1);
                        k--;
                    }
                }
                outLanePid = lanePid;
                outLinkPid = linkPid;
                $('#' + lanePid).addClass('yellow');
            } else {
                $('#checkbox' + outLanePid).prop({
                    checked: false
                });
                $('#' + outLanePid).removeClass('yellow');
                if (outLinkPid !== linkPid) {
                    laneTopoVias.push({
                        lanePid: outLanePid,
                        seqNum: laneTopoVias.length + 1,
                        linkPid: linkPid
                    });
                    $('#' + outLanePid).removeClass('green');
                }
                outLanePid = lanePid;
                outLinkPid = linkPid;
                for (i = 0; i < laneTopoVias.length; i++) {
                    if (laneTopoVias[i].linkPid === linkPid) {
                        laneTopoVias.splice(i, 1);
                        i--;
                    }
                }
                $('#label' + lanePid).text('');
                $('#' + lanePid).addClass('yellow');
            }
        } else if (linkPid === inLinkPid) { // 进入车道
            inLanePid = null;// 清空进入车道
            $('#' + lanePid).removeClass('red');
        } else if (linkPid === outLinkPid) { // 退出线
            outLanePid = null;
            outLinkPid = null;
            $('#' + lanePid).removeClass('yellow');
        }
    }
    modifyNums();
}

angular.module('app').controller('rdLaneTopoCtrl', ['$scope', '$compile', 'dsEdit', '$sce', '$timeout', '$ocLazyLoad', 'hotkeys', function ($scope, $compile, dsEdit, $sce, $timeout, $ocLazyLoad, hotkeys) {
    var featCodeCtrl = fastmap.uikit.FeatCodeController();
    var objCtrl = fastmap.uikit.ObjectEditController();
    $scope.deleteLaneTopoArr = [];// 所有的删除的车道连通
    $scope.insertLaneTopoArr = [];// 所有的新增的车道连通
    $scope.showLaneDetail = false;
    $scope.index = null;
    $scope.laneDetail = null;
    $scope.showPanel = false;
    $scope.batchTopoArr = [];
    $scope.showBatchLane = false;
    $scope.batchLanes = {
        processFlag: 2,
        throughTurn: 0,
        timeDomain: ''
    };
    var laneTopo = null;
    var nodeGeo = null;
    var nodePid = null;
    var inLinkPid = null;
    var laneInfoObject = {};
    var rdLaneTopoDetail = {
        topoIds: [],
        updateInfos: [],
        inLinkPid: null,
        inNodePid: null,
        laneTopoInfos: []
    };
    var inLinkToLane = {};
    $scope.formatInlink = function (topoId) {
        return inLinkToLane[topoId];
    };
    // 初始化地图;
    var topoMap = new L.Map('topoMap', {
        attributionControl: false,
        doubleClickZoom: false,
        zoomControl: false,
        minZoom: 16,
        maxZoom: 22
    });

    $scope.processFlagOption = [
        { id: 1, label: '人工（与批处理原则不一致）' },
        { id: 2, label: '批处理' },
        { id: 3, label: '人工（与批处理原则一致）' }
    ];
    $scope.throughTurnOption = [
        { id: 0, label: '否' },
        { id: 1, label: '是' }
    ];
    $scope.reachDirTrans = {
        0: '0 未调查',
        1: '1 直',
        2: '2 左',
        3: '3 右',
        4: '4 调',
        5: '5 左斜前',
        6: '6 右斜前'
    };
    $scope.vehicleOptions = [
        { id: 0, label: '客车(小汽车)', checked: false },
        { id: 1, label: '配送卡车', checked: false },
        { id: 2, label: '运输卡车', checked: false },
        { id: 3, label: '步行者', checked: false },
        { id: 4, label: '自行车', checked: false },
        { id: 5, label: '摩托车', checked: false },
        { id: 6, label: '机动脚踏两用车', checked: false },
        { id: 7, label: '急救车', checked: false },
        { id: 8, label: '出租车', checked: false },
        { id: 9, label: '公交车', checked: false },
        { id: 10, label: '工程车', checked: false },
        { id: 11, label: '本地车辆', checked: false },
        { id: 12, label: '自用车辆', checked: false },
        { id: 13, label: '多人乘坐车辆', checked: false },
        { id: 14, label: '军车', checked: false },
        { id: 15, label: '有拖车的车', checked: false },
        { id: 16, label: '私营公共汽车', checked: false },
        { id: 17, label: '农用车', checked: false },
        { id: 18, label: '载有易爆品的车辆', checked: false },
        { id: 19, label: '载有水污染品的车辆', checked: false },
        { id: 20, label: '载有其它危险品的车辆', checked: false },
        { id: 21, label: '电车', checked: false },
        { id: 22, label: '轻轨', checked: false },
        { id: 23, label: '校车', checked: false },
        { id: 24, label: '四轮驱动车', checked: false },
        { id: 25, label: '装有防雪链的车', checked: false },
        { id: 26, label: '邮政车', checked: false },
        { id: 27, label: '槽罐车', checked: false },
        { id: 28, label: '残疾人车', checked: false }
    ];

    $scope.getLayerById = function (layerId) {
        var layers = null;
        for (var item in topoMap._layers) {
            if (topoMap._layers[item].id) {
                if (topoMap._layers[item].id === layerId) {
                    layers = topoMap._layers[item];
                }
            }
        }
        return layers;
    };
    $scope.changeLineColor = function (e) {
        var selectLine = e.target.id + 'polyLine';
        var selectLineLayer = $scope.getLayerById(selectLine);
        var newStyle = {
            // color: "#FFA8FF",
            weight: 10
        };
        selectLineLayer.setStyle(newStyle);
    };
    $scope.resetLineColor = function (e) {
        var selectLine = e.target.id + 'polyLine';
        var selectLineLayer = $scope.getLayerById(selectLine);
        var newStyle = {
            // color: "#FFA8FF",
            weight: 5
        };
        selectLineLayer.setStyle(newStyle);
    };
    $scope.resetLaneInfo = function () {
        inLanePid = null;
        outLanePid = null;
        outLinkPid = null;
        laneTopoVias = [];
    };
    $scope.deleteLaneDetails = function (item, index) {
        rdLaneTopoDetail.topoIds.push(item.pid);
        $scope.deleteLaneTopoArr.push(item);
        $scope.laneTopoInfoArr.splice(index, 1);
        if (index === panelIndex && showPanelIndex === 1) {
            $('.red').removeClass('red');
            $('.green').removeClass('green');
            $('.yellow').removeClass('yellow');
        }
    };

    $timeout(function () {
        $ocLazyLoad.load('../../scripts/components/tools/fmTimeComponent/fmdateTimer.js').then(function () {
            $scope.dateURL = '../../scripts/components/tools/fmTimeComponent/fmdateTimer.html';
        });
    });
    /* 时间控件 */
    $scope.fmdateTimer = function (str) {
        if (str == 'laneDetail') {
            $scope.$on('get-date', function (event, data) {
                $scope.laneDetail.timeDomain = data;
            });
            $timeout(function () {
                $scope.$broadcast('set-code', $scope.laneDetail.timeDomain);
            }, 100);
        } else {
            $scope.$on('get-date', function (event, data) {
                $scope.batchLanes.timeDomain = data;
            });
            $timeout(function () {
                $scope.$broadcast('set-code', $scope.batchLanes.timeDomain);
            }, 100);
        }
    };

    /* 展示车道连通详情 */
    $scope.showLaneDetails = function (item, index, panelFlag, clearFlag) {
        $('.red').removeClass('red');
        $('.green').removeClass('green');
        $('.yellow').removeClass('yellow');
        $('.number').text('');
        $('.bottom').prop({
            checked: false
        });
        $scope.resetLaneInfo();

        // 清除批量选择
        if (clearFlag) {
            $scope.showBatchLane = false;
            $scope.batchTopoArr = [];
            for (var bta = 0; bta < $scope.laneTopoInfoArr.length; bta++) {
                if ($scope.laneTopoInfoArr[bta].flag) {
                    $scope.laneTopoInfoArr[bta].flag = false;
                }
            }
        }

        $scope.showPanel = (panelFlag === 2);
        if (showPanelIndex !== panelFlag) {
            showPanelIndex = panelFlag;
            panelIndex = index;
            $scope.showLaneDetail = true;
            $scope.laneDetail = item;
            $scope.fmdateTimer('laneDetail');
            $scope.$broadcast('set-code', $scope.laneDetail.timeDomain);
            $('#' + item.inLanePid).addClass('red');
            $('#' + item.outLanePid).addClass('yellow');
            for (var iii = 0; iii < item.laneTopoVias.length; iii++) {
                $('#' + item.laneTopoVias[iii].lanePid).addClass('green');
            }
        } else if (panelIndex === index) {
            showPanelIndex = null;
            panelIndex = null;
            $scope.showLaneDetail = false;
        } else {
            panelIndex = index;
            $scope.showLaneDetail = true;
            $scope.laneDetail = item;
            $scope.fmdateTimer('laneDetail');
            $scope.$broadcast('set-code', $scope.laneDetail.timeDomain);
            $('#' + item.inLanePid).addClass('red');
            $('#' + item.outLanePid).addClass('yellow');
            for (var i = 0; i < item.laneTopoVias.length; i++) {
                $('#' + item.laneTopoVias[i].lanePid).addClass('green');
            }
        }
    };
    // 清除车道样式
    $scope.clearLanes = function () {
        $('#' + inLanePid).removeClass('red');
        $('#' + outLanePid).removeClass('yellow');
        $('#checkbox' + inLanePid).prop({
            checked: false
        });
        $('#checkbox' + outLanePid).prop({
            checked: false
        });
        for (var i = 0; i < laneTopoVias.length; i++) {
            $('#label' + laneTopoVias[i].lanePid).text('');
            $('#' + laneTopoVias[i].lanePid).removeClass('green');
        }
    };
    // 检查是否重复
    $scope.checkRepeat = function () {
        var checkFlag = 1;
        for (var i1 = 0; i1 < $scope.insertLaneTopoArr.length; i1++) {
            if ($scope.insertLaneTopoArr[i1].inLanePid === inLanePid &&
                $scope.insertLaneTopoArr[i1].outLanePid === outLanePid) {
                checkFlag = 0;
                return checkFlag;
            }
        }
        for (var i = 0; i < $scope.laneTopoInfoArr.length; i++) {
            if ($scope.laneTopoInfoArr[i].inLanePid === inLanePid &&
                $scope.laneTopoInfoArr[i].outLanePid === outLanePid) {
                checkFlag = i + 10;
                return checkFlag;
            }
        }
        return checkFlag;
    };
    // 检查是否连通
    $scope.checkLanes = function () {
        var checkFlag = true;
        var lastNodePid = $scope.rdLaneData.nodePid;
        if (inLanePid == null) {
            checkFlag = false;
            return checkFlag;
        }
        if (outLanePid == null || outLinkPid == null) {
            checkFlag = false;
            return checkFlag;
        }
        if (laneTopoVias && laneTopoVias.length > 0) { // 有经过线
            for (var i = 0; i < laneTopoVias.length; i++) {
                if (laneInfoObject[laneTopoVias[i].linkPid].direct === 2 &&
                    laneInfoObject[laneTopoVias[i].linkPid].sNode === lastNodePid) {
                    lastNodePid = laneInfoObject[laneTopoVias[i].linkPid].eNode;
                } else if (laneInfoObject[laneTopoVias[i].linkPid].direct === 3 &&
                    laneInfoObject[laneTopoVias[i].linkPid].eNode === lastNodePid) {
                    lastNodePid = laneInfoObject[laneTopoVias[i].linkPid].sNode;
                } else if (laneInfoObject[laneTopoVias[i].linkPid].direct === 1) {
                    if (laneInfoObject[laneTopoVias[i].linkPid].sNode === lastNodePid) {
                        lastNodePid = laneInfoObject[laneTopoVias[i].linkPid].eNode;
                    } else if (laneInfoObject[laneTopoVias[i].linkPid].eNode === lastNodePid) {
                        lastNodePid = laneInfoObject[laneTopoVias[i].linkPid].sNode;
                    } else {
                        checkFlag = false;
                        return checkFlag;
                    }
                } else {
                    checkFlag = false;
                    return checkFlag;
                }
            }
        }
        // 检查退出线是否连通
        checkFlag = (laneInfoObject[outLinkPid].direct === 1 && (laneInfoObject[outLinkPid].sNode === lastNodePid || laneInfoObject[outLinkPid].eNode === lastNodePid)) ||
            (laneInfoObject[outLinkPid].direct === 2 && laneInfoObject[outLinkPid].sNode === lastNodePid) ||
            (laneInfoObject[outLinkPid].direct === 3 && laneInfoObject[outLinkPid].eNode === lastNodePid);
        return checkFlag;
    };
    // 关闭按钮
    $scope.doClose = function () {
        $scope.$emit('CLOSERDLANETOPO');
        $scope.resetLaneInfo();
        featCodeCtrl.setFeatCode(null);
        // hotkeys.unbind(hotkeys.combo);
    };
    // 创建按钮
    $scope.doCreate = function () {
        $scope.clearLanes();
        var flag = $scope.checkLanes();
        if (!flag) {
            $scope.resetLaneInfo();
            swal('提示', '车道不连通，创建失败！', 'error');
            return;
        }
        var repeat = $scope.checkRepeat();
        if (repeat === 0) {
            $scope.resetLaneInfo();
            swal('提示', '已经新增过该车道连通！', 'error');
            return;
        }
        // 不能直接new一个rdlanetopoDetail对象，其他字段不需要
        var newTopoDetail = {
            pid: 0,
            inLanePid: inLanePid,
            outLanePid: outLanePid,
            outLinkPid: outLinkPid,
            laneTopoVias: laneTopoVias,
            processFlag: 2,
            throughTurn: 0,
            timeDomain: ''
        };
        if (repeat === 1) {
            rdLaneTopoDetail.laneTopoInfos.push(newTopoDetail);
            $scope.insertLaneTopoArr.push(newTopoDetail);
            $scope.resetLaneInfo();
            swal('提示', '创建车道连通成功！', 'success');
        } else {
            swal({
                title: '跟现有车道连通重复',
                type: 'warning',
                animation: 'slide-from-top',
                showCancelButton: true,
                confirmButtonText: '替换',
                cancelButtonText: '放弃',
                confirmButtonColor: '#ec6c62',
                closeOnConfirm: false
            }, function (f) {
                if (f) {
                    rdLaneTopoDetail.topoIds.push($scope.laneTopoInfoArr[repeat - 10].pid);
                    $scope.deleteLaneTopoArr.push($scope.laneTopoInfoArr[repeat - 10]);
                    $scope.laneTopoInfoArr.splice(repeat - 10, 1);
                    rdLaneTopoDetail.laneTopoInfos.push(newTopoDetail);
                    $scope.insertLaneTopoArr.push(newTopoDetail);
                    $scope.resetLaneInfo();
                    swal('提示', '创建车道连通成功！', 'success');
                } else {
                    $scope.resetLaneInfo();
                }
            });
        }
    };
    // hotkeys.bindTo($scope).add({
    //     combo: 'space',
    //     description: '创建车道连通',
    //     callback: function () {
    //         $scope.doCreate();
    //     }
    // });
    // 保存按钮
    $scope.doSave = function () {
        var changes = objCtrl.data.getChanges();
        if ((rdLaneTopoDetail.topoIds.length === 0 && rdLaneTopoDetail.laneTopoInfos.length === 0)
            && !changes) {
            swal('提示', '车道连通信息未发生改变！', 'warning');
            return;
        }
        if (changes && changes.laneTopoInfos) {
            if (changes.laneTopoInfos.length > 0) {
                for (var cl = 0; cl < changes.laneTopoInfos.length; cl++) {
                    var laneData = changes.laneTopoInfos[cl];
                    // 必须是修改的数据，且不能为比较出来删除修改的：目前只更改3个字段，加上pid和status、rowId，正好是6个
                    if (laneData.objStatus === 'UPDATE' && Object.getOwnPropertyNames(laneData).length < 7) {
                        rdLaneTopoDetail.updateInfos.push({
                            objId: laneData.pid,
                            data: laneData
                        });
                    }
                }
            }
        }
        var param = {
            command: 'BATCH',
            type: 'RDLANETOPODETAIL',
            dbId: App.Temp.dbId,
            data: rdLaneTopoDetail
        };
        // 调用编辑接口;
        dsEdit.save(param).then(function (data) {
            if (data != null) {
                swal({
                    title: '保存成功，是否关闭制作面板？',
                    type: 'warning',
                    animation: 'slide-from-top',
                    showCancelButton: true,
                    confirmButtonText: '是',
                    cancelButtonText: '否',
                    confirmButtonColor: '#ec6c62'
                }, function (f) {
                    if (f) {
                        $scope.clearLanes();
                        $scope.$emit('CLOSERDLANETOPODETAIL');
                        $scope.resetLaneInfo();
                        featCodeCtrl.setFeatCode(null);
                    } else {
                        $scope.clearLanes();
                        var paramNew = {
                            type: 'RDLANE',
                            dbId: App.Temp.dbId,
                            data: $scope.rdLaneData
                        };
                        dsEdit.getByCondition(paramNew).then(function (newData) {
                            if (newData != null) {
                                // 清空变量，重新加载数据
                                $scope.deleteLaneTopoArr = [];
                                $scope.insertLaneTopoArr = [];
                                $scope.showLaneDetail = false;
                                $scope.index = null;
                                $scope.laneDetail = null;
                                $scope.showPanel = false;
                                $scope.batchTopoArr = [];
                                $scope.showBatchLane = false;
                                $scope.batchLanes = {
                                    processFlag: 2,
                                    throughTurn: 0,
                                    timeDomain: ''
                                };
                                laneTopo = null;
                                nodeGeo = null;
                                nodePid = null;
                                inLinkPid = null;
                                laneInfoObject = {};
                                rdLaneTopoDetail = {
                                    topoIds: [],
                                    updateInfos: [],
                                    inLinkPid: null,
                                    inNodePid: null,
                                    laneTopoInfos: []
                                };
                                inLinkToLane = {};
                                featCodeCtrl.setFeatCode({
                                    laneTopo: newData.data,
                                    rdLaneData: $scope.rdLaneData
                                });
                                $scope.initTopoData();
                                $scope.initMapData();
                            } else {
                                $scope.doClose();
                            }
                        });
                    }
                });
            }
        });
    };
    var watch = $scope.$watch('batchLanes', function (newVal, oldVal) {
        for (var bta = 0; bta < $scope.batchTopoArr.length; bta++) {
            for (var item in newVal) {
                if (newVal[item] !== oldVal[item]) {
                    $scope.batchTopoArr[bta][item] = newVal[item];
                }
            }
        }
    }, true);
    // checkbox中的处理方法
    $scope.batchItems = function (item, event, index) {
        item.flag = !item.flag;
        if (!item.flag) {
            for (var bt = 0; bt < $scope.batchTopoArr.length; bt++) {
                if ($scope.batchTopoArr[bt].pid === item.pid) {
                    $scope.batchTopoArr.splice(bt, 1);
                    bt--;
                }
            }
        } else if ($scope.batchTopoArr.indexOf(item.pid) < 0) {
            $scope.batchTopoArr.push(item);
        }
        if ($scope.batchTopoArr.length === 1) {
            $scope.showLaneDetails($scope.batchTopoArr[0], index, 1, 0);
            return;
        }
        $scope.fmdateTimer('batchLanes');
        $scope.$broadcast('set-code', $scope.batchLanes.timeDomain);
        $scope.showLaneDetail = false;
        showPanelIndex = null;
        panelIndex = null;
        $scope.laneDetail = null;
        event.stopPropagation();

        $scope.showBatchLane = ($scope.batchTopoArr.length > 0);
    };

    // 初始化车道连通数据
    $scope.initTopoData = function () {
        laneTopo = featCodeCtrl.getFeatCode().laneTopo;// 服务返回的数据;
        $scope.rdLaneData = featCodeCtrl.getFeatCode().rdLaneData;// 创建前保留的数据
        $scope.laneInfoArr = laneTopo[0].laneInfos;// 所有的详细车道
        laneTopo[0].geoLiveType = 'RDLANETOPODETAILARR';
        objCtrl.setData(laneTopo[0]);
        $scope.laneTopoInfoArr = objCtrl.data.laneTopoInfos;// 所有的原始的车道连通
        inLinkPid = $scope.rdLaneData.linkPids[0]; // 进入线
        nodePid = $scope.rdLaneData.nodePid; // 进入点
        for (var iii = 0; iii < $scope.laneTopoInfoArr.length; iii++) {
            $scope.laneTopoInfoArr[iii].flag = false;
        }
        for (var ii = 0; ii < $scope.laneInfoArr.length; ii++) {
            laneInfoObject[$scope.laneInfoArr[ii].linkPid] = {
                eNode: $scope.laneInfoArr[ii].eNodePid,
                sNode: $scope.laneInfoArr[ii].sNodePid,
                direct: $scope.laneInfoArr[ii].direct,
                distance: $scope.laneInfoArr[ii].length
            };
            if ($scope.laneInfoArr[ii].linkPid === inLinkPid) {
                for (var jj = 0; jj < $scope.laneInfoArr[ii].lanes.length; jj++) {
                    inLinkToLane[$scope.laneInfoArr[ii].lanes[jj].pid] = '进' + (jj + 1);
                }
            }
            if ($scope.laneInfoArr[ii].linkPid === inLinkPid &&
                $scope.laneInfoArr[ii].sNodePid === nodePid) {
                nodeGeo = $scope.laneInfoArr[ii].geometry.coordinates[0];
            } else if ($scope.laneInfoArr[ii].linkPid === inLinkPid &&
                $scope.laneInfoArr[ii].eNodePid === nodePid) {
                var lastIndex = $scope.laneInfoArr[ii].geometry.coordinates.length - 1;
                nodeGeo = $scope.laneInfoArr[ii].geometry.coordinates[lastIndex];
            }
        }
        rdLaneTopoDetail.inLinkPid = $scope.rdLaneData.linkPids[0];
        rdLaneTopoDetail.inNodePid = $scope.rdLaneData.nodePid;
    };

    // 初始地图相关
    $scope.initMapData = function () {
        if (topoMap.markerLayer) {
            topoMap.removeLayer(topoMap.markerLayer);
            topoMap.markerLayer = null;
        }
        var polyLines = new L.LayerGroup();
        polyLines.id = 'polyLines';

        var allGeo = [];
        for (var i = 0; i < $scope.laneInfoArr.length; i++) {
            var linkPid = $scope.laneInfoArr[i].linkPid;
            var geo = [];
            var guideLine;
            for (var j = 0; j < $scope.laneInfoArr[i].geometry.coordinates.length; j++) {
                geo.push({
                    lng: $scope.laneInfoArr[i].geometry.coordinates[j][0],
                    lat: $scope.laneInfoArr[i].geometry.coordinates[j][1]
                });
            }
            if (linkPid === inLinkPid) {
                guideLine = L.polyline(geo, {
                    color: 'red',
                    weight: 5
                });
            } else {
                guideLine = L.polyline(geo, {
                    color: '#AE8F00',
                    weight: 5
                });
            }
            allGeo = allGeo.concat(geo);
            guideLine.id = linkPid + 'polyLine';
            polyLines.addLayer(guideLine);

            var lanesArr = $scope.laneInfoArr[i].lanes;
            if (lanesArr.length > 0) {
                var sLng = $scope.laneInfoArr[i].geometry.coordinates[0][0];
                var sLat = $scope.laneInfoArr[i].geometry.coordinates[0][1];
                var lastOne = $scope.laneInfoArr[i].geometry.coordinates.length - 1;
                var eLng = $scope.laneInfoArr[i].geometry.coordinates[lastOne][0];
                var eLat = $scope.laneInfoArr[i].geometry.coordinates[lastOne][1];
                var a = {
                    x: 0,
                    y: 0
                };
                var directFlag;
                // 处理双方向道路的车道方向
                if (($scope.laneInfoArr[i].direct === 1) &&
                    (nodePid === $scope.laneInfoArr[i].eNodePid &&
                    inLinkPid === $scope.laneInfoArr[i].linkPid)) {
                    directFlag = 2;
                } else if (($scope.laneInfoArr[i].direct === 1) &&
                    (nodePid === $scope.laneInfoArr[i].sNodePid &&
                    inLinkPid === $scope.laneInfoArr[i].linkPid)) {
                    directFlag = 3;
                } else if (($scope.laneInfoArr[i].direct === 1) &&
                    (inLinkPid !== $scope.laneInfoArr[i].linkPid)) {
                    if (L.latLng(sLat, sLng).distanceTo(new L.LatLng(nodeGeo[1], nodeGeo[0])) >
                        L.latLng(eLat, eLng).distanceTo(new L.LatLng(nodeGeo[1], nodeGeo[0]))) {
                        directFlag = 3;
                    } else {
                        directFlag = 2;
                    }
                }
                if ($scope.laneInfoArr[i].direct === 2 || directFlag === 2) {
                    a.x = eLat - sLat;
                    a.y = eLng - sLng;
                } else if ($scope.laneInfoArr[i].direct === 3 || directFlag === 3) {
                    a.x = sLat - eLat;
                    a.y = sLng - eLng;
                }
                var deg = (Math.acos(a.x / Math.sqrt((a.x * a.x) + (a.y * a.y))) * 180) / Math.PI;
                if (a.y < 0) {
                    deg = 360 - deg;
                }
                if (inLinkPid === $scope.laneInfoArr[i].linkPid) {
                    var w = -20;
                    var htmlInlink = "<div style='width:" + w + 'px;-webkit-transform:rotate(' + deg + "deg);'>";
                    htmlInlink += "<span>'进入线'</span>";
                    htmlInlink += '</div>';
                    var textIcon = L.divIcon({
                        iconSize: [0, 0],
                        html: htmlInlink
                    });
                    var textMarker = L.marker([(sLat + eLat) / 2, (sLng + eLng) / 2], {
                        icon: textIcon,
                        title: 'linkPid=' + linkPid
                    });
                    polyLines.addLayer(textMarker);
                }
                var _width = (lanesArr.length * 30) + 20;
                var html = "<div class ='lane-img-container' id ='html" + linkPid + "' style='width:" + _width + 'px;-webkit-transform:rotate(' + deg + "deg);'>";
                html += "<div class='roadside-left'>";
                html += '</div>';
                for (var k = 0; k < lanesArr.length; k++) {
                    var lanePid = lanesArr[k].pid;
                    var laneDir = lanesArr[k].laneDir;
                    var arrowDir = lanesArr[k].arrowDir;
                    var m = k + 1;
                    html += "<div class='lane-driveway' id='" + lanePid + "' onclick='selectLane(this,event," + inLinkPid + ',' + linkPid + ',' + lanePid + ',' + laneDir + ',' + 1 + ")'>";
                    html += "<span class='top'>" + m + '</span>';
                    html += "<div class='middle'>";
                    html += "<img src='../../images/road/1301/1301_0_" + arrowDir + ".svg' style='width: 30px;height:30px;'/>";
                    html += '</div>';
                    html += "<span class='number' id ='label" + lanePid + "'></span>";
                    html += "<input class='bottom' id='checkbox" + lanePid + "' type='checkbox' style='margin:" + 0 + "px' onclick='selectLane(this,event," + inLinkPid + ',' + linkPid + ',' + lanePid + ',' + laneDir + ',' + 2 + ");'>";
                    html += '</div>';
                }
                html += "<div class='roadside-right'></div>";
                html += '</div>';
                var myIcon = L.divIcon({
                    iconSize: [0, 0],
                    html: html
                });
                var marker;
                var distance = laneInfoObject[linkPid].distance;
                if (distance < 150) {
                    marker = L.marker([sLat, sLng], {
                        icon: myIcon,
                        draggable: true,
                        title: 'linkPid=' + linkPid
                    }).on('drag', $scope.changeLineColor).on('dragend', $scope.resetLineColor);
                    marker.id = linkPid;
                    polyLines.addLayer(marker);
                } else {
                    marker = L.marker([(sLat + eLat) / 2, (sLng + eLng) / 2], {
                        icon: myIcon,
                        draggable: true,
                        title: 'linkPid=' + linkPid
                    }).on('drag', $scope.changeLineColor).on('dragend', $scope.resetLineColor);
                    marker.id = linkPid;
                    polyLines.addLayer(marker);
                }
            }
        }
        topoMap.addLayer(polyLines);
        topoMap.markerLayer = polyLines;
        topoMap.fitBounds(allGeo);
    };
    if (topoMap != undefined) {
        $scope.initTopoData();
        $scope.initMapData();
    }
    $scope.$on('resetTopoMap', function () {
        if (topoMap != undefined) {
            $scope.deleteLaneTopoArr = [];
            $scope.insertLaneTopoArr = [];
            $scope.showLaneDetail = false;
            $scope.index = null;
            $scope.laneDetail = null;
            $scope.showPanel = false;
            $scope.batchTopoArr = [];
            $scope.showBatchLane = false;
            $scope.batchLanes = {
                processFlag: 2,
                throughTurn: 0,
                timeDomain: ''
            };
            laneTopo = null;
            nodeGeo = null;
            nodePid = null;
            inLinkPid = null;
            laneInfoObject = {};
            rdLaneTopoDetail = {
                topoIds: [],
                updateInfos: [],
                inLinkPid: null,
                inNodePid: null,
                laneTopoInfos: []
            };
            inLinkToLane = {};
            $scope.initTopoData();
            $scope.initMapData();
        }
    });
}]);
