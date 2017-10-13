/**
 * Created by mali on 2016/6/6.
 */
angular.module('app').controller('restaurantCtl', function ($scope) {
    // $scope.restaurant = $scope.poi.restaurants[0];
    $scope.creditCard = FM.dataApi.Constant.CREDIT_CARD;
    $scope.parkingOptions = [
        { id: 0, label: ' 未调查' },
        { id: 1, label: ' 无停车位' },
        { id: 2, label: ' 收费停车' },
        { id: 3, label: ' 免费停车' }
    ];

    var valueAllFalse = function (obj) {
        var flag = true;
        for (var key in obj) {
            if (obj.hasOwnProperty(key) && obj[key]) {
                flag = false;
                break;
            }
        }
        return flag;
    };

    var setDefaultValue = function (obj) {
        var kindCode = $scope.poi.kindCode;
        if (kindCode == '110101') { // 中餐馆
            obj['2016'] = true;
        } else if (kindCode == '110102') { // 异国风味
            obj['1001'] = true;
        } else if (kindCode == '110103') { // 地方风味店、地方名店
            obj['2016'] = true;
        } else if (kindCode == '110302') { // 冷饮店
            obj['3015'] = true;
        } else if (kindCode == '110200') { // 快餐
            obj['3009'] = true;
        }
    };

    $scope.creditCardChange = function (event) {
        var obj = $scope.poi.restaurants[0].creditCard;
        var rejectVal = '0';
        if (valueAllFalse(obj)) { // 如果没有选中的信用卡类型，默认选中0
            obj[rejectVal] = true;
            return;
        }
        Utils.setCheckboxMutex(event, obj, rejectVal);
    };

    $scope.foodType1Change = function (event) {
        var obj = $scope.poi.restaurants[0].foodType1;
        Utils.setCheckBoxSingleCheck(event, obj);
        // 单独处理不能同时存在的几个风味
        var rejectArr = ['2016', '1001', '3009', '3015'];
        var obj2 = $scope.poi.restaurants[0].foodType2;
        for (var i = 0; i < rejectArr.length; i++) {
            if (event.target.value == rejectArr[i]) {
                var keys = Object.getOwnPropertyNames(obj2);
                for (var j = 0; j < keys.length; j++) {
                    var key = keys[j];
                    obj2[key] = false;
                }
                break;
            }
        }
        if (valueAllFalse(obj) && valueAllFalse(obj2)) {  // 如果没有选中的菜品风味，需要选中默认值
            setDefaultValue(obj);
        }
    };

    $scope.foodType2Change = function (event) {
        var obj = $scope.poi.restaurants[0].foodType2;
        Utils.setCheckBoxSingleCheck(event, obj);
        // 单独处理不能同时存在的几个风味
        var rejectArr = ['2016', '1001', '3009', '3015'];
        var obj1 = $scope.poi.restaurants[0].foodType1;
        var keys = Object.getOwnPropertyNames(obj1);
        for (var j = 0; j < keys.length; j++) {
            var key = keys[j];
            for (var i = 0; i < rejectArr.length; i++) {
                if (key == rejectArr[i]) {
                    obj1[key] = false;
                }
            }
        }
        if (valueAllFalse(obj) && valueAllFalse(obj1)) {  // 如果没有选中的菜品风味，需要选中默认值
            setDefaultValue(obj1);
        }
    };

    $scope.avgCostBlur = function () {
        var avgCost = $scope.poi.restaurants[0].avgCost;
        if (!avgCost) {
            $scope.poi.restaurants[0].avgCost = 0;
        }
    };
});
