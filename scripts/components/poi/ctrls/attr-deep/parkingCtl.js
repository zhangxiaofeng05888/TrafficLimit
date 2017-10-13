/**
 * Created by mali on 2016/5/31.
 */
angular.module('app').controller('parkingCtl', function ($scope) {
    var objectCtrl = fastmap.uikit.ObjectEditController();
    $scope.parkingBuildingType = FM.dataApi.Constant.PARKING_TYPE;
    $scope.tollStd = FM.dataApi.Constant.TOLLSTD;
    $scope.tollWay = FM.dataApi.Constant.TOLLWAY;
    $scope.remark = FM.dataApi.Constant.REMARK;
    /* 支付方式*/
    $scope.paymentObj = FM.dataApi.Constant.PAYMENT;

    var initDeepData = function () {
        $scope.poi = objectCtrl.data;
    };
    // initDeepData();
    // $scope.$on('reloadDeepData', function () {
    //     initDeepData();
    // });

    $scope.tollStdChange = function (event) {
        var obj = $scope.poi.parkings[0].tollStd;
        var rejectVal = '5';
        if (event.target.value == rejectVal) {
            if (event.target.checked) {
                for (var key in obj) {
                    if (key != rejectVal) {
                        obj[key] = false;
                    }
                }
            }
        } else if (event.target.checked) {
            obj[rejectVal] = false;
        }
        // Utils.setCheckboxMutex(event, obj, rejectVal);
    };
    $scope.remarkChange = function (event) {
        var exclude = ['7', '11', '12', '14', '16', '17', '18']; // 和'无条件免费'不互斥的值域
        var obj = $scope.poi.parkings[0].remark;
        var rejectVal = '0';
        if (event.target.value == rejectVal) {
            if (event.target.checked) {
                for (var key in obj) {
                    if (key != rejectVal && exclude.indexOf(key) < 0) {
                        obj[key] = false;
                    }
                }
            }
        } else if (event.target.checked && exclude.indexOf(event.target.value) < 0) {
            obj[rejectVal] = false;
        }
//        Utils.setCheckboxMutex(event,obj,rejectVal);
    };
    /**
     * 部分属性转全角
     */
    $scope.desToDBC = function () {
        if ($scope.poi.parkings[0].tollDes) {
            $scope.poi.parkings[0].tollDes = Utils.ToDBC($scope.poi.parkings[0].tollDes);
        }
        if ($scope.poi.parkings[0].openTiime) {
            $scope.poi.parkings[0].openTiime = Utils.ToDBC($scope.poi.parkings[0].openTiime);
        }
    };
    $scope.initTypeOptions = [
        { id: 0, label: ' 未修改' },
        { id: 1, label: ' 例外' },
        { id: 2, label: ' 确认不修改' },
        { id: 3, label: ' 确认已修改' }
    ];

    $scope.renameType = function (type, index) { // 使用了w5c-validate 的指令必须这么写
        return type + '$' + index + '$';
    };
});
