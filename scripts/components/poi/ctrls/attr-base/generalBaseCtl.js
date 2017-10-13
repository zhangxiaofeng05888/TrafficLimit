angular.module('app').controller('generalBaseCtl', ['$scope', '$rootScope', '$ocLazyLoad', '$q', 'dsEdit', 'dsMeta', 'appPath', '$timeout', 'dsLazyload', function ($scope, $rootScope, $ocll, $q, dsEdit, dsMeta, appPath, $timeout, dsLazyload) {
    var objectCtrl = fastmap.uikit.ObjectEditController();
    var kindFormat = $scope.metaData.kindFormat;
    
    var getSiblingPoiKindList = function () {
        $scope.kindFormatPart = {};
        // $scope.kindListPart = [];
        if (objectCtrl.data.state == 0 || objectCtrl.data.state == 2 || objectCtrl.data.state == 3) { // 0原库数据 2删除 3修改 的poi不可以修改大分类
            var kindCode = objectCtrl.data.kindCode;
            for (var i = 0; i < $scope.metaData.kindList.length; i++) {
                if (kindCode.substr(0, 2) === $scope.metaData.kindList[i].value.substr(0, 2)) {
                    $scope.kindFormatPart[$scope.metaData.kindList[i].value] = $scope.metaData.kindFormat[$scope.metaData.kindList[i].value];
                    // $scope.kindListPart.push($scope.metaData.kindList[i]);
                }
            }
        } else {
            // $scope.kindListPart = $scope.metaData.kindList.slice(0);
            for (var k in $scope.metaData.kindFormat) {
                if ($scope.metaData.kindFormat.hasOwnProperty(k)) {
                    $scope.kindFormatPart[k] = $scope.metaData.kindFormat[k];
                }
            }
        }
    };

    function loadComponents() {
        var llPromises = [];
        llPromises.push($ocll.load(appPath.poi + 'ctrls/attr-base/relationInfoCtl.js'));
        llPromises.push($ocll.load(appPath.poi + 'ctrls/attr-base/samePoisCtrl.js'));
        $q.all(llPromises).then(function () {
            $scope.relationInfoTpl = appPath.poi + 'tpls/attr-base/relationInfoTpl.html';
            $scope.sameInfoTpl = appPath.poi + 'tpls/attr-base/samePoisTpl.html';
        });

        dsLazyload.loadInclude($scope, 'baseInfoTpl', appPath.poi + 'ctrls/attr-base/baseInfoCtl.js', appPath.poi + 'tpls/attr-base/baseInfoTpl.html').then(function () {
            // 用于初始化 品牌、等级、卡车类型、深度信息等
            $scope.$broadcast('initPoiInfo');
        });
    }

    // 给餐饮类型赋默认值
    function initCreditCard() {
        var creditCard = $scope.poi.restaurants[0].creditCard;
        if (Utils.isEmptyObject(creditCard)) {
            creditCard['0'] = true;
        }
    }

    function initResDefaultVal() {
        var kindCode = $scope.poi.kindCode;
        if (kindCode == '110101') { // 中餐馆
            $scope.poi.restaurants[0].foodType1['2016'] = true;
        } else if (kindCode == '110102') { // 异国风味
            $scope.poi.restaurants[0].foodType1['1001'] = true;
        } else if (kindCode == '110103') { // 地方风味店、地方名店
            $scope.poi.restaurants[0].foodType1['2016'] = true;
        } else if (kindCode == '110302') { // 冷饮店
            $scope.poi.restaurants[0].foodType2['3015'] = true;
        } else if (kindCode == '110200') { // 快餐
            $scope.poi.restaurants[0].foodType1['3009'] = true;
        }
    }

    // 根据种别给深度信息的的菜品风味赋不同的默认值
    function initFoodTypeByObj() {
        if (!($scope.poi.restaurants && $scope.poi.restaurants.length > 0)) { // 排除掉新建餐饮时深度信息默认为空的情况
            return;
        }
        var foodTypeArr = $scope.poi.restaurants[0].foodTypeArr;
        if (foodTypeArr.length == 2) {
            $scope.poi.restaurants[0].foodType2[foodTypeArr[0]] = true;
            $scope.poi.restaurants[0].foodType1[foodTypeArr[1]] = true;
        } else if (foodTypeArr.length == 1) {
            var type1Names = Object.getOwnPropertyNames($scope.foodType1Obj);
            var type2Names = Object.getOwnPropertyNames($scope.foodType2Obj);
            if (type2Names.indexOf(foodTypeArr[0]) > -1) {
                $scope.poi.restaurants[0].foodType2[foodTypeArr[0]] = true;
            } else if (type1Names.indexOf(foodTypeArr[0]) > -1) {
                $scope.poi.restaurants[0].foodType1[foodTypeArr[0]] = true;
            }
        } else if (foodTypeArr.length == 0) {
            initResDefaultVal();
        }
        // initCreditCard();
    }
    function parseFoodType(foodType) {
        if (foodType.length > 0) {
            $scope.foodType1Obj = {};
            $scope.foodType2Obj = {};
            for (var i = 0, n = foodType.length; i < n; i++) {
                if (foodType[i].foodType == 'A' || foodType[i].foodType == 'C') {
                    $scope.foodType1Obj[foodType[i].foodCode] = foodType[i].foodName;
                } else {
                    $scope.foodType2Obj[foodType[i].foodCode] = foodType[i].foodName;
                }
            }
        }
    }

    // 根据种别给深度信息的的菜品风味赋不同的默认值
    function initFoodType() {
        if ($scope.poi.kindCode == '110200') { // 快餐
            $scope.poi.restaurants[0].foodType1['3009'] = true;
        } else if ($scope.poi.kindCode == '110101') { // 中餐馆
            $scope.poi.restaurants[0].foodType1['2016'] = true;
        } else if ($scope.poi.kindCode == '110103') { // 地方风味
            $scope.poi.restaurants[0].foodType1['2016'] = true;
        } else if ($scope.poi.kindCode == '110302') { // 冷饮店
            $scope.poi.restaurants[0].foodType2['3015'] = true;
        } else if ($scope.poi.kindCode == '110102') { // 异国风味
            $scope.poi.restaurants[0].foodType1['1001'] = true;
        }
    }

    /**
     * 变量，
     * 用于存放区号和对应的电话长度
     * @type {{areaCode: string, length: number}}
     */
    $scope.telphone = {
        areaCode: '010',  //  存放查询到的电话区号 --默认是北京
        len: 8  // 区号对应的电话长度 -- 默认长度是8
    };

    function initTelephoneCode() {
        dsEdit.getTelephone($scope.poi.geometry.coordinates).then(function (data) {
            if (data) {
                $scope.telphone.areaCode = data.code;
                $scope.telphone.len = data.telLength - data.code.length;
            }
            
            if ($scope.poi.contactParts.length === 0) {
                $scope.poi.contactParts.push(
                    new FM.dataApi.IxPoiContact({
                        contactType: 1,
                        code: $scope.telphone.areaCode,
                        contact: '',
                        priority: 1
                    })
                );
            }
        });
    }

    /**
     * 获取父POI，子POI和同一关系poi的名称
     */
    function initPidNames() {
        var pids = [];
        $scope.pidName = {};    // {pid1: pidName1, pid2: pidName2, pid3: pidName3, ...}

        if ($scope.poi.children.length === 0 && $scope.poi.parents.length === 0 && $scope.poi.samepoiParts.length === 0) {
            return;
        }

        if ($scope.poi.parents.length) {
            pids.push($scope.poi.parents[0].parentPoiPid);
        }

        for (var i = 0, len = $scope.poi.children.length; i < len; i++) {
            pids.push($scope.poi.children[i].childPoiPid);
        }

        for (var k = 0, len2 = $scope.poi.samepoiParts.length; k < len2; k++) {
            if ($scope.poi.samepoiParts[k].poiPid !== $scope.poi.pid) {
                pids.push($scope.poi.samepoiParts[k].poiPid);
            }
        }

        var parameter = {
            type: 'IXPOI',
            data: {
                pids: pids
            }
        };
        dsEdit.getByCondition(parameter).then(function (data) {
            if (data) {
                for (var j = 0, len3 = data.data.length; j < len3; j++) {
                    var key = data.data[j].pid;
                    var value = data.data[j].name ? data.data[j].name : '名称未录入';
                    $scope.pidName[key] = value;
                }
            }
        });
    }

    var initDeepInfo = function (kindCode) {
        var data = kindFormat[kindCode];
        switch (data.extend) {
            case 1: // 停车场
                if ($scope.poi.parkings.length === 0) {
                    $scope.poi.parkings.push(new FM.dataApi.IxPoiParking({}));
                }
                break;
            case 2: // 加油站
                if ($scope.poi.oilstations.length === 0) {
                    $scope.poi.oilstations.push(new FM.dataApi.IxPoiOilstation({}));
                }
                break;
            case 3: // 充电站
                if ($scope.poi.chargingstations.length === 0) {
                    $scope.poi.chargingstations.push(new FM.dataApi.IxPoiChargingstation({}));
                }
                break;
            case 4: // 宾馆酒店
                if ($scope.poi.hotels.length === 0) {
                    $scope.poi.hotels.push(new FM.dataApi.IxPoiHotel({}));
                }
                break;
            case 6: // 餐馆
                if ($scope.poi.restaurants.length === 0) {
                    $scope.poi.restaurants.push(new FM.dataApi.IxPoiRestaurant({}));
                    initFoodType($scope.poi.kindCode);
                }
                break;
            case 7: // 加气站
                if ($scope.poi.gasstations.length === 0) {
                    $scope.poi.gasstations.push(new FM.dataApi.IxPoiGasstation({}));
                }
                break;
            case 9: // 充电桩
                if ($scope.poi.chargingplots.length === 0) {
                    $scope.poi.chargingplots.push(new FM.dataApi.IxPoiChargingplot({}));
                }
                break;
            default:
                break;
        }
    };

    function initData() {
        getSiblingPoiKindList();
        $scope.poi = objectCtrl.data;
        $scope.poi.kindFormat = $scope.metaData.kindFormat;
        if ($scope.poi.state == 2) { // 提交、删除状态的POI不允许编辑   state --1新增，2删除 3修改
            $rootScope.isSpecialOperation = true;
        } else {
            $rootScope.isSpecialOperation = false;
        }
        initTelephoneCode();
        initPidNames();
        /**
         * 名称组可地址组特殊处理（暂时只做了大陆的控制）
         * 将名称组中的21CHI的名称放置在name中，如果不存在21CHI的数据，则给name赋值默认数据
         * 将地址组中CHI的地址放置在address中，如果不存在CHI的数据，则给address赋值默认数据
         * @param data
         */
        function _retreatData(data) {
            var flag = true;
            var i;
            for (i = 0; i < data.names.length; i++) {
                if (data.names[i].nameClass == 1 && data.names[i].nameType == 2 && data.names[i].langCode == 'CHI') {
                    flag = false;
                    data.name = data.names[i];
                    break;
                }
            }
            if (flag) {
                var name = new FM.dataApi.IxPoiName({
                    langCode: 'CHI',
                    nameClass: 1,
                    nameType: 2,
                    name: ''
                });
                data.name = name;
            }
            flag = true;
            for (i = 0; i < data.addresses.length; i++) {
                if (data.addresses[i].langCode == 'CHI') {
                    flag = false;
                    data.address = data.addresses[i];
                    break;
                }
            }
            if (flag) {
                var address = new FM.dataApi.IxPoiAddress({
                    langCode: 'CHI',
                    fullname: ''
                });
                data.address = address;
            }

            // 将手机和座机存放到contactParts字段中,解决日编只编辑手机和座机的问题
            var conts = [];
            for (i = 0; i < data.contacts.length; i++) {
                if (data.contacts[i].contactType == 1 || data.contacts[i].contactType == 2) {
                    conts.push(data.contacts[i]);
                }
            }
            data.contactParts = conts;
        }
        _retreatData($scope.poi);
        loadComponents();
        initDeepInfo($scope.poi.kindCode);
    }

    // 接收分类改变后触发的事件
    $scope.$on('kindChange', function (event, data) {
        if (!data) { // 为了解决新增POI时种别为空的情况
            return;
        }
        switch (data.extend) {
            case 1: // 停车场
                if (objectCtrl.data.parkings.length === 0) {
                    objectCtrl.data.parkings.push(new FM.dataApi.IxPoiParking({}));
                }
                $ocll.load(appPath.poi + 'ctrls/attr-deep/parkingCtl.js').then(function () {
                    $scope.deepInfoTpl = appPath.poi + 'tpls/attr-deep/parkingTpl.html';
                });
                break;
            case 2: // 加油站
                if (objectCtrl.data.oilstations.length === 0) {
                    objectCtrl.data.oilstations.push(new FM.dataApi.IxPoiOilstation({}));
                }
                $ocll.load(appPath.poi + 'ctrls/attr-deep/oilStationCtl.js').then(function () {
                    $scope.deepInfoTpl = appPath.poi + 'tpls/attr-deep/oilStationTpl.html';
                });
                break;
            case 3: // 充电站
                if (objectCtrl.data.chargingstations.length === 0) {
                    objectCtrl.data.chargingstations.push(new FM.dataApi.IxPoiChargingstation({}));
                }
                $ocll.load(appPath.poi + 'ctrls/attr-deep/chargingStationCtrl.js').then(function () {
                    $scope.deepInfoTpl = appPath.poi + 'tpls/attr-deep/chargingStationTpl.html';
                });
                break;
            case 4: // 宾馆酒店
                if (objectCtrl.data.hotels.length === 0) {
                    objectCtrl.data.hotels.push(new FM.dataApi.IxPoiHotel({}));
                }
                $ocll.load(appPath.poi + 'ctrls/attr-deep/hotelCtl.js').then(function () {
                    $scope.deepInfoTpl = appPath.poi + 'tpls/attr-deep/hotelTpl.html';
                });
                break;
            case 5: // 运动场馆
                $ocll.load(appPath.poi + 'ctrls/attr-deep/sportsVenuesCtl.js').then(function () {
                    $scope.deepInfoTpl = appPath.poi + 'tpls/attr-deep/sportsVenuesTpl.html';
                });
                break;
            case 6: // 餐馆
                if (objectCtrl.data.restaurants.length === 0) {
                    objectCtrl.data.restaurants.push(new FM.dataApi.IxPoiRestaurant({}));
                    initFoodType($scope.poi.kindCode);
                }
                dsMeta.queryFoodType($scope.poi.kindCode).then(function (ret) {
                    parseFoodType(ret);
                    initFoodTypeByObj();
                    $ocll.load(appPath.poi + 'ctrls/attr-deep/restaurantCtl.js').then(function () {
                        $scope.deepInfoTpl = appPath.poi + 'tpls/attr-deep/restaurantTpl.html';
                    });
                });
                break;
            case 7: // 加气站
                if (objectCtrl.data.gasstations.length === 0) {
                    objectCtrl.data.gasstations.push(new FM.dataApi.IxPoiGasstation({}));
                }
                $ocll.load(appPath.poi + 'ctrls/attr-deep/gasStationCtl.js').then(function () {
                    $scope.deepInfoTpl = appPath.poi + 'tpls/attr-deep/gasStationTpl.html';
                });
                break;
                // case 8: //旅游景点
                //     $ocll.load("scripts/components/poi-new/ctrls/attr-deep/parkingCtl").then(function() {
                //         $scope.deepInfoTpl = "../../../scripts/components/poi-new/tpls/attr-deep/parkingTpl.html";
                //     });
                //     break;
            case 9: // 充电桩
                if (objectCtrl.data.chargingplots.length === 0) {
                    objectCtrl.data.chargingplots.push(new FM.dataApi.IxPoiChargingplot({}));
                }
                $ocll.load(appPath.poi + 'ctrls/attr-deep/chargingPlotCtrl.js').then(function () {
                    $scope.deepInfoTpl = appPath.poi + 'tpls/attr-deep/chargingPlotTpl.html';
                });
                break;
            default:
                $scope.deepInfoTpl = '';
                break;
        }
    });

    var getOilStationFuelType = function (oilstations) {
        var fuelType = null;
        if (oilstations && oilstations.length > 0) {
            var obj = oilstations[0].fuelType;
            var checkedFuelTypeArr = [];
            for (var k in obj) {
                if (obj[k]) {
                    checkedFuelTypeArr.push(k);
                }
            }
            fuelType = checkedFuelTypeArr.join('|');
        }
        return fuelType;
    };


    /** *
     * kindcode chain fueltype变化时，联动truck
     */
    $scope.getTruckByKindChain = function (kindcode, chain) {
        var fuelType = null;
        if (kindcode == '230215') { // 加油站
            fuelType = getOilStationFuelType($scope.poi.oilstations);
        }
        var param = {
            kindCode: kindcode,
            chain: chain,
            fuelType: fuelType
        };
        dsMeta.queryTruck(param).then(function (data) {
            if (data != -1) {
                $scope.poi.truckFlag = data;
            } else {
                $scope.poi.truckFlag = 0;
            }
        });
    };

    var unbindHandler = $scope.$on('ReloadData', initData);

    $scope.$on('$destroy', function () {
        unbindHandler = null;
    });
}]);
