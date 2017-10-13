angular.module('app').controller('baseInfoCtl', ['$scope', '$ocLazyLoad', '$q', 'dsMeta', '$timeout', function ($scope, $ocll, $q, dsMeta, $timeout) {
    var pKindFormat = {};
    var pAllChain = {};

    pKindFormat = $scope.$parent.metaData.kindFormat;
    pAllChain = $scope.$parent.metaData.allChain;
    $scope.truckTypeOpt = FM.dataApi.Constant.truckType;
    $scope.teleCodeToLength = {}; // 用于缓存区号和对应的电话的长度，减少与数据库的减少次数

    /**
     * 根据分类初始化对应的品牌
     * @param kindCode
     */
    var initChain = function (kindCode) {
        var chainArray = pAllChain[kindCode];
        $scope.chainList = {};
        if (chainArray) {
            chainArray.unshift({
                chainCode: '0', // 增加默认值0，可以使 “--请选择--”显示在最前面
                chainName: '--请选择--'
            });
            for (var i = 0, len = chainArray.length; i < len; i++) {
                var cha = chainArray[i];
                $scope.chainList[cha.chainCode] = { // 转换成chosen-select可以解析的格式
                    category: cha.category,
                    chainCode: cha.chainCode,
                    weight: cha.weight,
                    chainName: cha.chainName
                };
            }
        }
    };

    // 初始化level
    $scope.rootCommonTemp.levelArr = [];

    /**
     * kindcode chain name rating 变化时，联动level
     */
    var getLevel = function () {
        var ratingVal = 0;
        if ($scope.poi.kindCode == '120101') { // 酒店星级
            ratingVal = $scope.poi.hotels[0].rating;
        }
        if ($scope.poi.chain == null || $scope.poi.chain == '0') {
            $scope.poi.chain = '';
        }
        var param = {
            dbId: App.Temp.dbId,
            pid: $scope.poi.pid,
            poi_num: $scope.poi.poiNum,
            kindCode: $scope.poi.kindCode,
            chainCode: $scope.poi.chain,
            name: $scope.poi.name.name,
            rating: ratingVal,
            level: $scope.poi.level
        };
        dsMeta.queryLevel(param).then(function (data) {
            $scope.rootCommonTemp.levelArr = [];
            if (data.values) {
                if (data.values && data.values.indexOf('|') > -1) {
                    $scope.rootCommonTemp.levelArr = data.values.split('|');
                    $scope.poi.level = data.defaultVal;
                } else {
                    $scope.rootCommonTemp.levelArr.push(data.values);
                    $scope.poi.level = data.defaultVal;
                }
            } else {
                swal('提示', '等级信息查询出错！', 'warning');
            }
        });
    };
    /* 切换 分类（种别）只有当手动切换分类的时候需要触发的事件写在这里*/
    $scope.kindChange = function (evt, obj) {
        // 不同类型的餐饮相互切换的时候需要清空一下子表
        if (pKindFormat[$scope.poi.kindCode].extend === 6) {
            if ($scope.poi.restaurants.length === 0) {
                $scope.poi.restaurants.push(new FM.dataApi.IxPoiRestaurant({}));
            } else {
                $scope.poi.restaurants[0] = new FM.dataApi.IxPoiRestaurant({});
            }
        }
        initChain($scope.poi.kindCode);
        $scope.$emit('kindChange', pKindFormat[$scope.poi.kindCode]);
        // poi 新增时，未根据分类将等级、卡车入库，所以前端需要查一次来显示正确结果
        getLevel();
        $scope.getTruckByKindChain($scope.poi.kindCode, '');
    };
    /* 切换 品牌*/
    $scope.brandChange = function (evt, obj) {
        getLevel();
        $scope.getTruckByKindChain($scope.poi.kindCode, $scope.poi.chain);
    };

    /**
     * 获取电话数组中priority的最大值
     * @param contacts
     * @returns {number}
     */
    var getMaxPriority = function (contacts) {
        var index = 0;
        contacts.forEach(function (item, ind, arr) {
            if (item.priority >= index) {
                index = item.priority;
            }
        });
        return index;
    };

    $scope.addContact = function () {
        if (!$scope.telphone.areaCode) {  // 如果正在获取电话区号，直接返回
            return;
        }

        var priority = getMaxPriority($scope.poi.contactParts) + 1;
        $scope.poi.contactParts.push(
            new FM.dataApi.IxPoiContact({
                contactType: 1,
                code: $scope.telphone.areaCode,
                contact: '',
                priority: priority
            })
        );
    };

    /**
     * 删除电话，如果电话数组中没有手机和固话时默认一个固话
     * @param index
     */
    $scope.deleteContact = function (index) {
        $scope.poi.contactParts.splice(index, 1);

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
    };
    // 电话校验
    $scope.queryTelephone = function (item) {
        var param = {
            code: item.code
        };
        param = JSON.stringify(param);
        return {
            url: App.Config.serviceUrl + '/metadata/queryTelLength/?access_token=' + App.Temp.accessToken + '&parameter=' + param,
            compare: function (data) {
                var flag = true;
                if (data && data.errcode == 0) {
                    if (data.data == '') {
                        flag = false;
                    } else {
                        // 返回了电话的长度
                        var len = data.data;
                        item.len = len - item.code.length; // 总长度减去区号的长度
                    }
                } else {
                    flag = false;
                }
                return flag;
            }
        };
    };

    $scope.rename = function (name, index) {
        return name + '$' + index + '$';  // 使用ng-repeat时必须这样进行命名
    };

    /**
     * 合法电话校验方法
     * @param item
     * @returns {boolean}
     */
    $scope.checkContact = function (item) {
        // 解决复制后还报检查的问题 --begin--
        if (item.contact.length === 11 || item.contact.substring(0, 1) === '1') {
            item.contactType = 2; // 手机
            item.code = '';
        } else if (item.contact) {
            item.contactType = 1; // 固话
            item.code = $scope.telphone.areaCode;
            item.len = $scope.telphone.len;
        }
        // --end--

        var flag = false;
        if (item.contactType === 1) { // 电话
            if (item.len == undefined) {
                flag = true;
            } else if ((item.len == item.contact.length) || (item.contact.length == 0)) { // 电话不用进行非空校验，因为如果电话为空则会删除电话组
                flag = true;
            }
        } else {   //  手机
            if (item.contact.length === 0) {
                flag = true;
            } else {
                // var rge = /^1\d{10}$/;
                // /(^10|11|12|16|19\d{9}$)|(^154|172|174|179|141|142|143|144|146|148\d{8}$)/
                var rge = /^(((13[0-9])|(18[0-9])|(14[579])|(15[^4])|(17[^249]))\d{8})$/; // 需求手机为不能以10、11、12、16、19、154、172、1174、179、141、142、143、144、146、148开头
                flag = rge.test(item.contact);
            }
        }
        return flag;
    };

    $scope.$on('initPoiInfo', function () {
        initChain($scope.poi.kindCode);
        $scope.$emit('kindChange', pKindFormat[$scope.poi.kindCode]);
        // poi 新增时，未根据分类将等级入库，所以前端需要查一次来显示正确结果
        getLevel();
        // $scope.getTruckByKindChain($scope.poi.kindCode, '');
        $timeout(function () {
            angular.element('#mainName').focus(); // 光标默认定位在名称上
        });
    });

    $scope.validateOptions = {
        rules: {
            name: {
                required: 'POI名称不能为空！'
            },
            teleArea: {
                w5cremotecheck: '不存在此区号！'
            },
            teleContact: {
                // required: '必填项',
                w5cDynamicCustomizer: '电话输入有误！'
            },
            cellphone: {
                required: '手机号码不能为空！',
                w5cDynamicCustomizer: '手机号码格式不正确!'
            }
        }
    };
}]);
