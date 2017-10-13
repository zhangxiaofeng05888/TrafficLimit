/**
 * Created by wangmingdong on 2016/7/22.
 */

var rdElectronicEyeApp = angular.module('app');
rdElectronicEyeApp.controller('electronicEyeCtl', ['$scope', 'dsEdit', function ($scope, dsEdit) {
    var layerCtrl = fastmap.uikit.LayerController();
    var objCtrl = fastmap.uikit.ObjectEditController();
    var relationData = layerCtrl.getLayerById('relationData');

    /*
     * 根据当前单击的电子眼位置checkbox是否选中状态，来判断进行异或操作还是或操作
     * 由选中到非选中时，做异或操作，例 只有左100时，与4的二进制 100做异或操作，得到000，也即0
     * 由非选中到选中时，做或操作，例 位置都没有时000，与4的二进制 100做或操作，得到100，即左侧选中
     */
    $scope.locationClick = function (checked, num) {
        if (checked) {
            $scope.electronicEyeData.location ^= num;
        } else {
            $scope.electronicEyeData.location |= num;
        }
        $scope.refreshPosition();
    };
    // 改变电子眼类型
    $scope.changeElecType = function (type) {
        if (type == 1 || type == 2 || type == 3 || type == 20 || type == 21) {
            $scope.electronicEyeData.isSpeedlimit = true;
        } else {
            $scope.electronicEyeData.isSpeedlimit = false;
            $scope.electronicEyeData.speedLimit = 0;
        }
        /*
        *如果电子眼的方位为“未调查”时，当电子眼类型变为“交通标线、高速出入口、违章停车摄像头、
        * 应急车道摄像头、限行限号摄像头、交通信号灯摄像头、单行线摄像头”时，电子眼的方位自动
        * 从“未调查”维护为“上”；如果电子眼方位为非“未调查”，则修改电子眼类型为“交通标线、高速
        * 出入口、违章停车摄像头、应急车道摄像头、限行限号摄像头、交通信号灯摄像头、单行线摄像头”，
        * 电子眼方位不自动维护；
        */
        if ($scope.electronicEyeData.location !== 0) {
            return;
        }
        if (type == 10 || type == 12 || type == 14 || type == 18 || type == 19 || type == 22 || type == 23) {
            $scope.electronicEyeData.location = 4;
            $scope.refreshPosition();
        }
    };
    $scope.refreshData = function () {
        dsEdit.getByPid($scope.electronicEyeData.pid, 'RDELECTRONICEYE').then(function (data) {
            if (data) {
                objCtrl.setData(data);
                $scope.initializeData();
            }
        });
    };
    /* 电子眼类型*/
    $scope.elecEyeType = [
        { id: 0, label: '未调查' },
        { id: 1, label: '限速摄像头' },
        { id: 2, label: '雷达测速摄像头' },
        { id: 3, label: '移动式测速' },
        { id: 10, label: '交通信号灯摄像头' },
        { id: 11, label: '路况监控摄像头' },
        { id: 12, label: '单行线摄像头' },
        { id: 13, label: '非机动车道摄像头' },
        { id: 14, label: '出入口摄像头' },
        { id: 15, label: '公交车道摄像头' },
        { id: 16, label: '禁止左/右转摄像头' },
        { id: 17, label: '禁止掉头摄像头' },
        { id: 18, label: '应急车道摄像头' },
        { id: 19, label: '交通标线摄像头' },
        { id: 20, label: '区间测速开始' },
        { id: 21, label: '区间测速结束' },
        { id: 22, label: '违章停车摄像头' },
        { id: 23, label: '限行限号摄像头' },
        { id: 98, label: '其他' }
    ];
    $scope.srcFlagOption = [
        { id: '0', label: '其他外包数据' },
        { id: '1', label: '外业验证数据' },
        { id: '2', label: '善领' },
        { id: '3', label: '图吧' }
    ];

    /* 作用方向*/
    $scope.directArray = [
        { id: 0, label: '未调查' },
        { id: 2, label: '顺方向' },
        { id: 3, label: '逆方向' }
    ];
    /* 删除配对关系*/
    $scope.deletePairBond = function () {
        swal({
            title: '删除确认',
            text: '确定删除配对关系？',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText: '删除',
            closeOnConfirm: true
        }, function () {
            var param = {
                command: 'DELETE',
                type: 'RDELECEYEPAIR',
                dbId: App.Temp.dbId,
                objId: $scope.electronicEyeData.parts[0].groupId
            };
            dsEdit.save(param).then(function (data) {
                if (data) {
                    objCtrl.setOriginalData(objCtrl.data.getIntegrate());
                    relationData.redraw();
                }
                $scope.refreshData();
            });
        });
    };
    $scope.refreshPosition = function () {
        $scope.electronicEyePosition = {
            left: ($scope.electronicEyeData.location & 1) == 1,
            right: ($scope.electronicEyeData.location & 2) == 2,
            up: ($scope.electronicEyeData.location & 4) == 4
        };
    };
    /* 定位配对电子眼位置*/
    $scope.findPartElecLocation = function (pid) {
        dsEdit.getByPid(pid, 'RDELECTRONICEYE').then(function (data) {
            if (!data) {
                return;
            }
            if (data.errcode === -1) {
                swal('', data.errmsg, '提示信息');
                return;
            }
            map.setView([data.geometry.coordinates[1], data.geometry.coordinates[0]], map.getZoom() < 17 ? 17 : map.getZoom());
            objCtrl.setCurrentObject('RDELECTRONICEYE', data);
            $scope.$emit('ObjectSelected', { feature: objCtrl.data });
        });
    };
    $scope.initializeData = function () {
        $scope.electronicEyeData = objCtrl.data;
        // 电子眼坐标显示
        $scope.coordinates = $scope.electronicEyeData.geometry.coordinates.join(',');
        $scope.refreshPosition();

        if ($scope.electronicEyeData.kind == 1 || $scope.electronicEyeData.kind == 2 || $scope.electronicEyeData.kind == 3 || $scope.electronicEyeData.kind == 20 || $scope.electronicEyeData.kind == 21) {
            $scope.electronicEyeData.isSpeedlimit = true;
        } else {
            $scope.electronicEyeData.isSpeedlimit = false;
            $scope.electronicEyeData.speedLimit = 0;
        }

        if ($scope.electronicEyeData.pairs.length) {
            if ($scope.electronicEyeData.pairs[0].parts[0].eleceyePid == $scope.electronicEyeData.pid) {
                $scope.elecPartPid = $scope.electronicEyeData.pairs[0].parts[1].eleceyePid;
            } else {
                $scope.elecPartPid = $scope.electronicEyeData.pairs[0].parts[0].eleceyePid;
            }
        }
    };

    var unbindHandler = $scope.$on('ReloadData', $scope.initializeData);

    $scope.$on('$destroy', function () {
        unbindHandler = null;
    });
}]);
