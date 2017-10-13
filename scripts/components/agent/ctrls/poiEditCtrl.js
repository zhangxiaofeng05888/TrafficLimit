/**
 * Created by wuzhen on 2017/5/25.
 */
angular.module('app').controller('poiEditCtrl', ['$scope', 'dsAgent',
    function ($scope, dsAgent) {
        var accessToken = App.Util.getUrlParam('access_token');

        /* 初始化品牌*/
        var initChain = function (kindCode) {
            var chainArray = $scope.metaData.allChain[kindCode];
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
        /* 切换 分类 (只有当手动切换分类的时候需要触发的事件写在这里)*/
        $scope.kindChange = function (obj) {
            initChain(obj.kindCode);
        };

        $scope.copyKindCode = function () {
            $scope.editingPoi.kindCode = $scope.dealership.dp_attr.kindCode;
            initChain($scope.editingPoi.kindCode);
        };
        /**
         * 将代理店的品牌赋值给poi
         */
        $scope.copyChain = function () {
            if ($scope.editingPoi.kindCode !== $scope.dealership.dp_attr.kindCode) {
                $scope.editingPoi.kindCode = $scope.dealership.dp_attr.kindCode;
                initChain($scope.editingPoi.kindCode);
            }

            $scope.editingPoi.chain = $scope.dealership.dp_attr.chain;
        };

        /**
         *  获取官方标准中文名和简称
         * @param poi
         * @param region 1 大陆  2 港澳
         * @param type 1 官方标准  2 别名
         * @private
         */
        var combineName = function (poi, region, type) {
            var name = '';

            for (var i = 0; i < poi.names.length; i++) {
                var str = poi.names[i].nameClass.toString() + poi.names[i].nameType.toString() + poi.names[i].langCode.toString();
                if (region == 1) { // 大陆
                    if (type == 1) {
                        if (str == '11CHI') { // 官方标准中文名
                            name = poi.names[i].name;
                            break;
                        }
                    } else {
                        if (str == '31CHI') { // 别名
                            name = poi.names[i].name;
                            break;
                        }
                    }
                }

                if (region == 2) { // 港澳
                    if (type == 1) {
                        if (str == '11CHT') {
                            name = poi.names[i].name;
                            break;
                        }
                    } else {
                        if (str == '31CHT') {
                            name = poi.names[i].name;
                            break;
                        }
                    }
                }
            }
            return name;
        };

        /**
         * @param poi
         * @param flag 1-维修 2-销售 3-其他 4-特殊
         * @returns {string}
         */
        var combineTelphone = function (poi, flag) {
            var _teleDec2bin = function (dec) {
                var bin = Utils.dec2bin(dec);
                while (bin.length < 8) {
                    bin = '0' + bin;
                }
                return bin;
            };

            var arrs = [];
            for (var i = 0; i < poi.contacts.length; i++) {
                var temp = poi.contacts[i];
                var bin = _teleDec2bin(temp.contactDepart);
                var b;
                if (flag === 1) { // 维修
                    b = bin.substr(4, 1);
                } else if (flag === 2) { // 销售
                    b = bin.substr(3, 1);
                } else if (flag === 3) { // 其他
                    b = bin.substr(5, 1);
                }
                if (b === '1') {
                    arrs.push(temp.contact);
                }
            }
            return arrs.join(';');
        };

        var resetEditingPoi = function (poi) {
            var region = 1; // 默认大陆,暂时不用后面用于区分港澳
            var returnObj = {};
            returnObj.kindCode = poi.kindCode;
            returnObj.chain = poi.chain;
            returnObj.postCode = poi.postCode;
            returnObj.name = combineName(poi, region, 1);
            returnObj.shortName = combineName(poi, region, 2);
            returnObj.telService = combineTelphone(poi, 1);
            returnObj.telSale = combineTelphone(poi, 2);
            returnObj.telOther = combineTelphone(poi, 3);
            return returnObj;
        };

        var initData = function (scope, data) {
            data = data.data;
            $scope.dealership = data.dealership;
            if ($scope.dealership.cfmPoiNum) { // 表示有挂接的poi
                for (var i = 0; i < data.pois.length; i++) {
                    if ($scope.dealership.cfmPoiNum === data.pois[i].pid) {
                        $scope.selectedPoi = data.pois[i];
                        break;
                    }
                }
            } else {
                $scope.selectedPoi = data.pois[0];
            }
            $scope.editingPoi = resetEditingPoi($scope.selectedPoi);
            initChain($scope.editingPoi.kindCode);
        };

        var unbindHandler = $scope.$on('ReloadData', initData);

        $scope.$on('$destroy', function () {
            unbindHandler = null;
        });
    }
]);
