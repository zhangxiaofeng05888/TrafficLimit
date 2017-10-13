angular.module('app').controller('chargingStationCtrl', function ($scope) {
    $scope.chargingTypeArr = [   // 充电站类型
        { id: 0, label: '--请选择--' },
        { id: 1, label: '充电站' },
        { id: 2, label: '充换电站' },
        { id: 3, label: '充电桩组' },
        { id: 4, label: '换电站' }
    ];

    $scope.chargingOpenType = FM.dataApi.Constant.chargingOpenType;
    $scope.chargingOpenTypeChange = function (event) {
        var rejectVal = '1';
        var obj;
        obj = $scope.poi.chargingstations[0].changeOpenType;
        Utils.setCheckboxMutex(event, obj, rejectVal);
    };
    $scope.parkingFeesArr = FM.dataApi.Constant.parkingFees;
    $scope.stationAvailableState = [   // 充电站类型
        { id: 0, label: '开放' },
        { id: 1, label: '未开放' },
        { id: 2, label: '维修中' },
        { id: 3, label: '建设中' },
        { id: 4, label: '规划中' }
    ];

    $scope.selectChargingType = function () {
        var type = $scope.poi.chargingstations[0].chargingType;
        if (type == 2 || type == 4) {
            $scope.poi.chargingstations[0].changeBrands = ['0'];
        } else {
            $scope.poi.chargingstations[0].changeBrands = [''];
        }
    };

    var initServiceProv = function () {
        var provs = $scope.metaData.charingChain;
        var carProvs = [];  // 汽车服务商
        var otherProvs = [];  // 非汽车服务商
        var obj = null;

        for (var i = 0, len = provs.length; i < len; i++) {
            obj = {
                chainCode: provs[i].chainCode,
                chainName: provs[i].chainName
            };
            if (provs[i].chainCode.length === 4) {
                obj.chainName += ' (汽车)';
                carProvs.push(obj);
            } else {
                obj.chainName += ' (非汽车)';
                otherProvs.push(obj);
            }
        }
        $scope.serviceProvArr = otherProvs.concat(carProvs);
    };

    /**
     * 部分字段转半角
     */
    $scope.chargingstationsToCDB = function () {
        if ($scope.poi.chargingstations[0].parkingInfo) {
            $scope.poi.chargingstations[0].parkingInfo = Utils.ToCDB($scope.poi.chargingstations[0].parkingInfo);
        }
    };

    $scope.chainList = {};
    /* 初始化品牌*/
    $scope.initChain = function () {
        var charingChain = $scope.metaData.charingChain;
        for (var i in charingChain) {
            if (i) {
                var cha = charingChain[i];
                $scope.chainList[cha.chainCode] = { // 转换成chosen-select可以解析的格式
                    chainCode: cha.chainCode,
                    chainName: cha.chainName,
                    hm_flag: cha.hm_flag
                };
            }
        }

        initServiceProv();
        // $scope.chainList['0'] = {  //  根据geoLiveModel说明
        //     chainCode: '0',
        //     chainName: '无法获取品牌'
        // };
    };
    $scope.initChain();
});
