/**
 * Created by liuyang on 2016/12/29.
 */
angular.module('app').controller('PoiParentController', ['$scope', '$ocLazyLoad', 'appPath', 'dsEdit', '$timeout', 'ngDialog', function ($scope, $ocLazyLoad, appPath, dsEdit, $timeout, ngDialog) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var eventCtrl = new fastmap.uikit.EventController();
    $scope.parent = [];

    var kindFormat = $scope.metaData.kindFormat;
    var currentPoi = objCtrl.data;

    /**
     * 过滤可以作为父的数据
     * 需求参见一体化日编POI业务需求说明书中的1.20章节
     * @param obj
     * @returns {null|*}
     */
    var filterData = function (obj) {
        var selectedDataList = obj.selectedData;
        var currentData = obj.currentData;


        for (var k = selectedDataList.length - 1; k >= 0; k--) {
            var isContain = $scope.metaData.parentPoiNums.indexOf(selectedDataList[k].properties.poiNum) > -1;
            var parentFlag = $scope.metaData.kindFormat[selectedDataList[k].properties.kindCode].parentFlag;
            if (!(parentFlag == 1 || isContain)) {
                selectedDataList.splice(k, 1);
                continue;
            }
            if (currentData.kindCode !== '230218') { // 停车场（换停车场、货车专用停车场）只能是充电站的父
                if (['230210', '230213', '230214'].indexOf(selectedDataList[k].properties.kindCode) > -1) {
                    selectedDataList.splice(k, 1);
                    continue;
                }
            }
            if (currentData.kindCode === '230227') { // 充电桩只能以充电站为父
                if (selectedDataList[k].properties.kindCode !== '230218') {
                    selectedDataList.splice(k, 1);
                }
            }
        }
        return selectedDataList;
    };
    /**
     * 初始化方法
     */
    $scope.initializeData = function (obj) {
        $scope.parent = [];
        obj = filterData(obj);
        if (!(obj && obj.length > 0)) {
            return;
        }
        for (var i = 0, len = obj.length; i < len; i++) {
            var pData = {};
            pData.pid = obj[i].properties.id;
            pData.name = obj[i].properties.name;
            var temp = kindFormat[obj[i].properties.kindCode];
            pData.kindName = temp ? temp.kindName : '';
            if (currentPoi.parents.length > 0 && obj[i].properties.id === currentPoi.parents[0].parentPoiPid) {
                pData.labelText = '当前父';
                pData.inputText = '解除父';
                pData.color = 1;
            } else {
                pData.labelText = '可为父';
                pData.inputText = '作为父';
                pData.color = 2;
            }
            $scope.parent.push(pData);
        }
    };

    /*
     变更父子关系
     */
    $scope.changePoiParent = function (parentId) {
        var myParent = objCtrl.data.parents;
        var operFlag;
        if (myParent.length > 0) { // 1新增 2删除 3修改
            if (myParent[0].parentPoiPid == parentId) { // 解除
                operFlag = 2;
            } else { // 更新
                operFlag = 3;
            }
        } else { // 新增
            operFlag = 1;
        }
        if (operFlag === 3) {
            swal({
                title: '提示',
                text: '已存在父，是否解除重新创建?',
                type: 'info',
                animation: 'slide-from-top',
                showCancelButton: true,
                confirmButtonText: '确定'
            }, function (f) {
                if (f) {
                    eventCtrl.fire(L.Mixin.EventTypes.PARTSSELECTEDCHANGED, { operFlag: operFlag, parentPid: parentId });
                }
            });
        } else {
            eventCtrl.fire(L.Mixin.EventTypes.PARTSSELECTEDCHANGED, { operFlag: operFlag, parentPid: parentId });
        }
    };

    var unbindHandler = $scope.$on('ReloadData', function (event, obj) {
        $scope.initializeData(obj);
    });

    $scope.$on('$destroy', function () {
        unbindHandler = null;
    });
}]);
