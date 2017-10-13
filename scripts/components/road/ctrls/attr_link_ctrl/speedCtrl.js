/**
 * Created by linglong on 2016/12/22.
 */
angular.module('app').controller('speedController', function ($scope) {
    // 限速来源;
    $scope.fromLimitSrcOption = [
        {
            id: 0,
            label: '无'
        },
        {
            id: 1,
            label: '现场标牌'
        },
        // {
        //     id: 2,
        //     label: '城区标识'
        // },
        // {
        //     id: 3,
        //     label: '高速标识'
        // },
        // {
        //     id: 4,
        //     label: '车道限速'
        // },
        // {
        //     id: 5,
        //     label: '方向限速'
        // },
        // {
        //     id: 6,
        //     label: '机动车限速'
        // },
        {
            id: 7,
            label: '匝道未调查'
        },
        // {
        //     id: 8,
        //     label: '缓速行驶'
        // },
        {
            id: 9,
            label: '未调查'
        }
    ];
    // 限速等级
    $scope.speedClassOption = [
        {
            id: 0,
            label: '0级: 未赋值'
        }, {
            id: 1,
            label: '1级: >130'
        }, {
            id: 2,
            label: '2级: [100.1~130]'
        }, {
            id: 3,
            label: '3级: [90.1~100]'
        }, {
            id: 4,
            label: '4级: [70.1~90]'
        }, {
            id: 5,
            label: '5级: [50.1~70]'
        }, {
            id: 6,
            label: '6级: [30.1~50]'
        }, {
            id: 7,
            label: '7级: [11~30]'
        }, {
            id: 8,
            label: '8级: <11'
        }
    ];
    // 限速条件;
    $scope.speedDependentOption = {
        0: '无',
        1: '雨天',
        2: '雪天',
        3: '雾天',
        6: '学校',
        10: '时间限制',
        11: '车道限制',
        12: '季节时段',
        13: '医院',
        14: '购物',
        15: '居民区',
        16: '企事业单位',
        17: '景点景区',
        18: '交通枢纽'
    };

    $scope.currentSpeedData = null; // 当前选中的名称数据(会在子ctrl用到);
    $scope.currentActiveSpeedIndex = undefined;

    // 选中行进行名称编辑时更新当前数据以及索引;
    $scope.rememberNameNum = function ($index, data) {
        $scope.currentActiveSpeedIndex = $index;
        $scope.currentSpeedData = data;
    };

    $scope.rename = function (name, index) {
        return name + '$' + index + '$';
    };

    // 增加link限速条件数据;
    $scope.addLinkName = function () {
        $scope.linkData.speedlimits.push(FM.dataApi.rdLinkSpeedLimit({
            speedType: 3,
            linkPid: $scope.linkData.pid,
            speedDependent: 0
        }));
    };

    // 手动修改限速值对限速等级的维护;
    $scope.changeSpeed = function (flag) {
        $scope.linkData._speedLimitLevel(flag);
        $scope.linkData.options.isChanged = true;
    };

    // 在模型里设置方法处理等级赋值的关联维护;
    $scope.changeSource = function (newVal, oldVal) {
        $scope.linkData._changeSpeedLimitSource(newVal, oldVal);
    };
    // 删除link限速条件数据;
    $scope.deleteLinkConditionSpeed = function ($index, data, event) {
        if (data.rowId) {
            $scope.linkData.speedlimits = $scope.linkData.speedlimits.filter(function (item) {
                return item.rowId != data.rowId;
            });
        } else {
            $scope.linkData.speedlimits = $scope.linkData.speedlimits.filter(function (item) {
                return item.$$hashKey != data.$$hashKey;
            });
        }
        event.stopPropagation();
    };
    // 修改等级赋值的关联维护;
    $scope.changeClassWork = function () {
        // 当改变等级赋值时，需要根据限速值再维护限速等级;
        $scope.linkData._speedLimitLevel();
    };
});

