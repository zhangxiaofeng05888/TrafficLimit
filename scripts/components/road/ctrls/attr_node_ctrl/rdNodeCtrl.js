/**
 * Created by liuzhaoxia on 2015/12/10.
 */
angular.module('app').controller('rdNodeCtrl', ['$scope', 'appPath', 'dsEdit', '$ocLazyLoad',
    function ($scope, appPath, dsEdit, $ocLazyLoad) {
        var objectEditCtrl = fastmap.uikit.ObjectEditController();

        $scope.kindOptions = [{
            id: 1,
            label: '平面交叉点'
        }, {
            id: 2,
            label: 'Link属性变化点'
        }, {
            id: 3,
            label: '路上点'
        }];

        $scope.srcFlagOptions = [{
            id: 1,
            label: '1 施工图'
        }, {
            id: 2,
            label: '2 高精度测量'
        }, {
            id: 3,
            label: '3 卫星影像'
        }, {
            id: 4,
            label: '4 惯导测量'
        }, {
            id: 5,
            label: '5 基础数据'
        }, {
            id: 6,
            label: '6 GPS测量'
        }];

        $scope.digitalLeveOptions = [{
            id: 0,
            label: '无'
        }, {
            id: 1,
            label: '1 ±0~5米'
        }, {
            id: 2,
            label: '2 ±5~10米'
        }, {
            id: 3,
            label: '3 ±10~15米'
        }, {
            id: 4,
            label: '4 ±15~20米'
        }];

        $scope.auxiFlagOptions = [{
            id: 0,
            label: '无'
        }, {
            id: 42,
            label: '点假立交'
        }, {
            id: 43,
            label: '路口挂接修改'
        }];

        $scope.fromOfWayOption = [{
            id: 0,
            label: '未调查',
            isCheck: false
        }, {
            id: 1,
            label: '无属性',
            isCheck: false
        }, {
            id: 2,
            label: '图廓点',
            isCheck: false
        }, {
            id: 3,
            label: 'CRF Info点',
            isCheck: false
        }, {
            id: 4,
            label: '收费站',
            isCheck: false
        }, {
            id: 5,
            label: 'Hihgway起点',
            isCheck: false
        }, {
            id: 6,
            label: 'Highway终点',
            isCheck: false
        }, {
            id: 10,
            label: 'IC',
            isCheck: false
        }, {
            id: 11,
            label: 'JCT',
            isCheck: false
        }, {
            id: 12,
            label: '桥',
            isCheck: false
        }, {
            id: 13,
            label: '隧道',
            isCheck: false
        }, {
            id: 14,
            label: '车站',
            isCheck: false
        }, {
            id: 15,
            label: '障碍物',
            isCheck: false
        }, {
            id: 16,
            label: '门牌号码点',
            isCheck: false
        }, {
            id: 20,
            label: '幅宽变化点',
            isCheck: false
        }, {
            id: 21,
            label: '种别变化点',
            isCheck: false
        }, {
            id: 22,
            label: '车道变化点',
            isCheck: false
        }, {
            id: 23,
            label: '分隔带变化点',
            isCheck: false
        }, {
            id: 30,
            label: '铁道道口',
            isCheck: false
        }, {
            id: 31,
            label: '有人看守铁道道口',
            isCheck: false
        }, {
            id: 32,
            label: '无人看守铁道道口',
            isCheck: false
        }, {
            id: 41,
            label: 'KDZone与道路交点',
            isCheck: false
        }];

        function initialForms() {
            $scope.newFromOfWRoadDate = [];
            var p,
                s;
            for (p = 0; p < $scope.rdNodeData.forms.length; p++) {
                for (s = 0; s < $scope.fromOfWayOption.length; s++) {
                    if ($scope.rdNodeData.forms[p].formOfWay == $scope.fromOfWayOption[s].id) {
                        $scope.newFromOfWRoadDate.push($scope.fromOfWayOption[s]);
                    }
                }
            }
        }
        var initializeNodeData = function () {
            objectEditCtrl.setOriginalData(objectEditCtrl.data.getIntegrate());
            $scope.rdNodeData = objectEditCtrl.data;
            $ocLazyLoad.load('../../scripts/components/road/ctrls/attr_node_ctrl/rdNodeFormCtrl.js');
            initialForms();
        };

        objectEditCtrl.nodeObjRefresh = function () {
            initialForms();
        };

        var unbindHandler = $scope.$on('ReloadData', initializeNodeData);

        $scope.$on('$destroy', function () {
            unbindHandler = null;
        });
    }
]);
