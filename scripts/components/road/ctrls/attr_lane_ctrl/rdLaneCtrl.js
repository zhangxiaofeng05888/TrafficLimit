/**
 * Created by wangmingdong on 2016/8/26.
 */

angular.module('app').controller('ClmCtl', ['$scope', 'dsEdit', 'appPath', '$timeout', '$ocLazyLoad', 'dsFcc', function ($scope, dsEdit, appPath, $timeout, $ocLazyLoad, dsFcc) {
    var layerCtrl = fastmap.uikit.LayerController();
    var objCtrl = fastmap.uikit.ObjectEditController();
    var eventController = fastmap.uikit.EventController();
    var relationData = layerCtrl.getLayerById('relationData');
    var selectCtrl = fastmap.uikit.SelectController();
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    $scope.checkValueFlag = false;
    // objCtrl.setOriginalData(objCtrl.data.getIntegrate());
    $scope.clmData = objCtrl.data;
    $scope.carData = [];
    // 高亮link
    $scope.highLightLaneLink = function () {
        var highLightFeatures = [];
        highLightFeatures.push({
            id: objCtrl.memo.nodePid.toString(),
            layerid: 'rdLink',
            type: 'node',
            style: {
                strokeWidth: 3,
                color: 'yellow'
            }
        });
        for (var i = 0, len = objCtrl.memo.links.length; i < len; i++) {
            if (i === 0) {
                highLightFeatures.push({
                    id: objCtrl.memo.links[0].toString(),
                    layerid: 'rdLink',
                    type: 'line',
                    style: {
                        strokeWidth: 3,
                        color: 'rgb(255, 0, 0)'
                    }
                });
            } else {
                highLightFeatures.push({
                    id: objCtrl.memo.links[i].toString(),
                    layerid: 'rdLink',
                    type: 'line',
                    style: {
                        strokeWidth: 3,
                        color: 'rgb(0, 245, 255)'
                    }
                });
            }
        }
        highRenderCtrl.highLightFeatures = highLightFeatures;
        highRenderCtrl.drawHighlight();
    };
    $scope.initializeData = function () {
        $scope.laneLength = $scope.clmData.laneInfos.length;
        $scope.laneIndex = 0;
        $scope.refreshLaneData();
        $('.datetip-double').hide();
        $('.datetip').hide();
        $scope.highLightLaneLink();
    };
    // $ocLazyLoad.load('../../scripts/components/road/ctrls/attr_variableSpeed_ctrl/carTypeCtrl.js');
    // 初始化函数;
    $scope.$on('warningCarType', function (event) {
        $scope.checkAllowed();
    });

    // 获取汽车的组合字符
    function getViche32BitValue(data, flag) {
        var newArray = [];
        var result = '';
        data.forEach(function (item) {
            if (item.checked) {
                newArray.push(item.id);
            }
        });
        for (var i = 31; i >= 0; i--) {
            if (i == 31) {
                if (flag) {
                    result += '1';// 允许
                } else {
                    result += '0';// 禁止
                }
            } else if ($.inArray(i, newArray) != -1) {
                result += '1';
            } else {
                result += '0';
            }
        }
        return result;
    }
    // 二进制转10进制
    function bin2dec(bin) {
        var c = bin.split('');
        var dec = 0;
        var temp;
        for (var i = 0; i < c.length; i++) {
            temp = 1;
            if (c[i] == 1) {
                for (var j = i + 1; j < c.length; j++) temp *= 2;
                dec += temp;
            } else if (c[i] != 0) {
                return 0;
            }
        }
        return dec;
    }
    // 监听车辆类型是否选择允许;
    $scope.checkAllowed = function () {
        var bit32Value = getViche32BitValue($scope.vehicleOptions, $scope.checkValueFlag);
        $scope.laneInfo.conditions[0].vehicle = parseInt(bin2dec(bit32Value), 10);
    };

    $scope.getCheckData = function (data) {
        var towbin = Utils.dec2bin(data);
        // 循环车辆值域，根据数据库数据取出新的数组显示在页面
        var originArray = [];
        var len = towbin.length - 1;
        // 长度小于32即是没有选中checkbox，不允许
        if (towbin.length < 32) {
            $scope.checkValueFlag = false;
        } else {
            len = towbin.length - 2;
            $scope.checkValueFlag = true;
        }
        for (var i = len; i >= 0; i--) {
            if (towbin.split('').reverse().join('')[i] == 1) {
                originArray.push($scope.vehicleOptions[i]);
            }
        }

        if (originArray.length == 0) {
            $scope.carData = [];
        } else {
            for (var m = 0; m < $scope.vehicleOptions.length; m++) {
                $scope.vehicleOptions[m].checked = false;
            }
            for (var p = 0; p < originArray.length; p++) {
                $scope.vehicleOptions[originArray[p].id].checked = true;
                $scope.carData.push($scope.vehicleOptions[originArray[p].id]);
            }
        }
    };
    // 刷新车道图
    $scope.refreshLaneData = function () {
        $scope.selectLaneActive = -1;
        if ($scope.clmData.laneInfos.length > 0) {
            $scope.laneInfo = $scope.clmData.laneInfos[$scope.laneIndex];
        } else {
            $scope.laneInfo = fastmap.dataApi.rdLane({ pid: 0 });
            $scope.clmData.laneInfos.push($scope.laneInfo);
        }
        if ($scope.laneInfo && $scope.laneInfo.conditions.length > 0) {
            $scope.showvehicle($scope.laneInfo.conditions[0].vehicle);
        }
        var _width = $scope.clmData.laneInfos.length * 30 + 20;
        if (_width > 300) {
            $scope.laneStyle = { width: _width, 'overflow-x': 'auto' };
        } else {
            $scope.laneStyle = { width: _width, top: 'auto', position: 'relative' };
        }
        for (var i = 0, len = $scope.clmData.laneInfos.length; i < len; i++) {
            $scope.clmData.laneInfos[i].seqNum = i + 1;
        }
        $scope.laneLength = $scope.clmData.laneInfos.length;
        $('body .carTypeTip:last').hide();
    };
    $scope.refreshData = function () {
        var param = {
            type: 'RDLANE',
            dbId: App.Temp.dbId,
            data: {
                linkPid: $scope.clmData.linkPids[0],
                laneDir: $scope.clmData.laneDir
            }
        };
        dsEdit.getByCondition(param).then(function (data) {
            var laneData = {
                geoLiveType: 'RDLANE',
                linkPids: $scope.clmData.linkPids,
                laneDir: $scope.clmData.laneDir,
                laneInfos: data.data
            };
            objCtrl.setData(laneData);
            $scope.clmData = objCtrl.data;
            $scope.initializeData();
            $scope.refreshLaneData();
        });
    };
    // 车道总数修改
    $scope.changeCarLane = function () {
        if (parseInt($scope.laneLength, 10) > $scope.clmData.laneInfos.length) {   // 增加
            var addMount = parseInt($scope.laneLength, 10) - $scope.clmData.laneInfos.length;
            for (var i = 0; i < addMount; i++) {
                $scope.clmData.laneInfos.push(fastmap.dataApi.rdLane({ pid: 0 }));
            }
        } else if (parseInt($scope.laneLength, 10) < $scope.clmData.laneInfos.length) {  // 减少
            $scope.clmData.laneInfos.splice(parseInt($scope.laneLength, 10) + 1, $scope.clmData.laneInfos.length - parseInt($scope.laneLength, 10));
            if (parseInt($scope.laneLength, 10) < $scope.laneIndex) {
                $scope.laneIndex = 0;
                $scope.laneInfo = $scope.clmData.laneInfos[$scope.laneIndex];
                $scope.$emit('SWITCHCONTAINERSTATE', {
                    subAttrContainerTpl: false,
                    attrContainerTpl: true
                });
            }
        }
        $scope.refreshLaneData();
    };
    // 删除车道
    $scope.removeLane = function (index) {
        $scope.clmData.laneInfos.splice(index, 1);
        $scope.refreshLaneData();
        if (index == $scope.laneIndex) {
            $scope.laneIndex = 0;
            $scope.laneInfo = $scope.clmData.laneInfos[0];
        } else {
            $scope.laneInfo = $scope.clmData.laneInfos[$scope.laneIndex];
        }
        objCtrl.originalData.laneInfos.splice(index, 1);
        for (var i = 0, len = objCtrl.originalData.laneInfos.length; i < len; i++) {
            if (i >= index) {
                objCtrl.originalData.laneInfos[i].seqNum--;
            }
        }
    };
    // 修改车道类型
    $scope.changeLaneType = function () {
        if ($scope.laneInfo.laneType != 11) {
            $scope.laneInfo.conditions = [];
        } else {
            $scope.laneInfo.conditions.push(fastmap.dataApi.rdLaneCondition({ pid: 0 }));
            $('.datetip-double').hide();
            $('.datetip').hide();
            if ($scope.laneInfo && $scope.laneInfo.conditions.length > 0) {
                $timeout(function () {
                    $scope.fmdateTimer($scope.laneInfo.conditions[0].directionTime);
                    $scope.$broadcast('set-code', $scope.laneInfo.conditions[0].directionTime);
                    $scope.$apply();
                }, 100);
                $timeout(function () {
                    $scope.carFmdateTimer($scope.laneInfo.conditions[0].vehicleTime);
                    $scope.$broadcast('set-code-2', $scope.laneInfo.conditions[0].vehicleTime);
                    $scope.$apply();
                }, 100);
            }
        }
    };
    // 弹出车道方向面板
    $scope.showLaneDirect = function (e, index, dir) {
        $('body').append($(e.target).parents('.fm-container').find('.carTypeTip'));
        if (index > -1) {
            $scope.laneIndex = index;
            $('.carTypeTip').css({ top: ($(e.target).offset().top - 100) + 'px', right: '310px' });
            $scope.showLaneSelect = true;
            $('body .carTypeTip:last').show();
            $scope.selectLaneActive = dir;
        } else {
            $scope.showLaneSelect = false;
            $('body .carTypeTip:last').fadeOut(300);
        }
        $scope.laneInfo = $scope.clmData.laneInfos[$scope.laneIndex];
      // $scope.$emit('SWITCHCONTAINERSTATE', {
      //   'subAttrContainerTpl': false,
      //   'attrContainerTpl': true
      // });
    };
    // 选择车道方向
    $scope.selectLaneDir = function (dir, index) {
        $scope.selectLaneActive = dir;
        $scope.clmData.laneInfos[$scope.laneIndex].arrowDir = dir;
    };
    // 选择车辆类型时，将选中的类型转成所要的格式;
    $scope.carSelect = function () {
        var bit32Value = getViche32BitValue($scope.vehicleOptions, $scope.checkValueFlag);
        $scope.laneInfo.conditions[0].vehicle = parseInt(bin2dec(bit32Value), 10);
    };
    $scope.showvehicle = function (vehicle) {
        var towbin = Utils.dec2bin(vehicle);

        // 循环车辆值域，根据数据库数据取出新的数组显示在页面
        var originArray = [];
        $scope.checkValue = false;
        var len = towbin.length - 1;
        // 长度小于32即是没有选中checkbox，不允许
        if (towbin.length < 32) {
            $scope.checkValue = false;
        } else {
            len = towbin.length - 2;
            $scope.checkValue = true;
        }
        for (var i = len; i >= 0; i--) {
            if (towbin.split('').reverse().join('')[i] == 1) {
                originArray.push($scope.vehicleOptions[i]);
            }
        }

        if (originArray.length === 0) {
            $scope.carData = [];
        } else {
            for (var p in originArray) {
                if (p) {
                    for (var s in $scope.vehicleOptions) {
                        if (originArray[p].id.toString() == $scope.vehicleOptions[s].id) {
                            $scope.vehicleOptions[s].checked = true;
                            $scope.carData.push($scope.vehicleOptions[s]);
                        }
                    }
                }
            }
        }
    };
    $scope.checkViche = function () {
        var newArray = [];
        var result = '';
        for (var j = 0; j < $scope.carData.length; j++) {
            newArray.push($scope.carData[j].id);
        }
        for (var i = 31; i >= 0; i--) {
            if (i == 31) {
                if ($scope.checkValue) {
                    result += '1';// 允许
                } else {
                    result += '0';// 禁止
                }
            } else if ($.inArray(i, newArray) != -1) {
                result += '1';
            } else {
                result += '0';
            }
        }

        $scope.laneInfo.conditions[0].vehicle = parseInt(Utils.bin2dec(result), 10);
    };

    $timeout(function () {
        $ocLazyLoad.load('../../scripts/components/tools/fmTimeComponent/fmdateTimer.js').then(function () {
            $scope.dateURL = '../../scripts/components/tools/fmTimeComponent/fmdateTimer.html';
            /* 查询数据库取出时间字符串*/
            if ($scope.laneInfo && $scope.laneInfo.conditions.length > 0) {
                $scope.fmdateTimer($scope.laneInfo.conditions[0].directionTime);
                $scope.$broadcast('set-code', $scope.laneInfo.conditions[0].directionTime);
            }
            $ocLazyLoad.load('../../scripts/components/tools/fmTimeComponent/fmdateTimer2.js').then(function () {
                $scope.dateDoubleURL = '../../scripts/components/tools/fmTimeComponent/fmdateTimer2.html';
                if ($scope.laneInfo && $scope.laneInfo.conditions.length > 0) {
                    $scope.carFmdateTimer($scope.laneInfo.conditions[0].vehicleTime);
                    $scope.$broadcast('set-code-2', $scope.laneInfo.conditions[0].vehicleTime);
                }
            });
        });
    });

    /* 时间控件*/
    $scope.fmdateTimer = function (str) {
        $scope.$on('get-date', function (event, data) {
            $scope.laneInfo.conditions[0].directionTime = data;
        });
        $timeout(function () {
            $scope.$broadcast('set-code', str);
            $scope.laneInfo.conditions[0].directionTime = str;
            $scope.$apply();
        }, 100);
    };
    $scope.carFmdateTimer = function (str) {
        $scope.$on('get-date-2', function (event, data) {
            $scope.laneInfo.conditions[0].vehicleTime = data;
        });
        $timeout(function () {
            $scope.$broadcast('set-code-2', str);
            $scope.laneInfo.conditions[0].vehicleTime = str;
            $scope.$apply();
        }, 100);
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
    // 中央分隔带
    $scope.centerDividerObj = [
      { id: 1, label: '双方向道路' },
      { id: 2, label: '单方向或上下线分离道路' }
    ];
    // 车道标识
    $scope.laneFlag = [
      { id: 0, label: '不应用' },
      { id: 1, label: '车道形成' },
      { id: 2, label: '车道结束' },
      { id: 3, label: '车道形成&结束' }
    ];
    // 车道标识
    $scope.laneFormingObj = [
      { id: 0, label: '不应用' },
      { id: 1, label: '车道形成' },
      { id: 2, label: '车道结束' },
      { id: 3, label: '车道形成&结束' }
    ];
    // 车道方向
    $scope.laneDirObj = [
      { id: 1, label: '无' },
      { id: 2, label: '顺方向' },
      { id: 3, label: '逆方向' }
    ];
    // 车道类型
    $scope.laneTypeObj = [
      { id: 0, label: '常规车道' },
      { id: 1, label: '复合车道' },
      { id: 2, label: '加速车道' },
      { id: 3, label: '减速车道' },
      { id: 4, label: '满载车道' },
      { id: 5, label: '快车道' },
      { id: 6, label: '慢车道' },
      { id: 7, label: '超车道' },
      { id: 8, label: '可行驶路肩带' },
      { id: 9, label: '卡车停车道' },
      { id: 10, label: '管制车道' },
      { id: 11, label: '潮汐车道' },
      { id: 12, label: '中心转向车道' },
      { id: 13, label: '转向车道' },
      { id: 14, label: '空车道' },
      { id: 15, label: '转向可变车道' }
    ];
    // 车道分隔带
    $scope.laneDividerObj = [
      { id: 0, label: '未调查' },
      { id: 10, label: '虚线' },
      { id: 11, label: '短虚线' },
      { id: 12, label: '短粗虚线' },
      { id: 13, label: '双虚线' },
      { id: 20, label: '单实线' },
      { id: 21, label: '双实线' },
      { id: 30, label: '左实线/右虚线' },
      { id: 31, label: '左虚线/右实线' },
      { id: 40, label: '填充区标线' },
      { id: 50, label: '警告线' },
      { id: 51, label: '中心转向标线' },
      { id: 60, label: '其他物理隔离' },
      { id: 61, label: '栅栏' },
      { id: 62, label: '绿化带' },
      { id: 63, label: '混合' },
      { id: 99, label: '无' }
    ];
    // 车道方向集合
    $scope.laneDirectArray = [0, 1, 2, 3, 4, 5, 'a', 'b', 'c',
        'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

    var unbindHandler = $scope.$on('ReloadData', $scope.initializeData);

    $scope.$on('$destroy', function () {
        unbindHandler = null;
    });
    $scope.$on('$refreshRdlane', function () {
        $scope.refreshData();
    });
}]);
