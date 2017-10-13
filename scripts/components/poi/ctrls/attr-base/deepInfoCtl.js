angular.module('app').controller('deepInfoCtl', ['$scope', '$ocLazyLoad', '$q', 'appPath',
    function ($scope, $ocLazyLoad, $q, appPath) {
        var objectCtrl = fastmap.uikit.ObjectEditController();
        var pKindFormat = {};
        var pKindList = [];
        var pAllChain = {};
        $scope.kindName = '';
        $scope.chainName = '';
        $scope.poiName = '';
        $scope.fullName = '';
        $scope.teleNum = '';
        $scope.parkType = '';
        $scope.deepPanelHeight = {
            height: '100%',
            width: '100%'
        };
        // var type = App.Util.getUrlParam('monthTaskType');
        var type = App.Temp.monthTaskType;
        if (type) {
            if (type === 'deepParking') {
                $scope.deepType = 1;
                $ocLazyLoad.load(appPath.poi + 'ctrls/attr-deep/deepParkingCtl.js').then(function () {
                    $scope.deepInfoToolbarTpl = appPath.poi + 'tpls/attr-deep/deepParkingTpl.html';
                });
            } else if (type === 'deepDetail') {
                $scope.deepType = 2;
                $ocLazyLoad.load(appPath.poi + 'ctrls/attr-deep/commonDeepCtl.js').then(function () {
                    $scope.deepInfoToolbarTpl = appPath.poi + 'tpls/attr-deep/commonDeepTpl.html';
                });
            } else if (type === 'deepCarrental') {
                $scope.deepType = 3;
                $ocLazyLoad.load(appPath.poi + 'ctrls/attr-deep/carRentalCtl.js').then(function () {
                    $scope.deepInfoToolbarTpl = appPath.poi + 'tpls/attr-deep/deepRentalTpl.html';
                });
            }
        }
        var initData = function () {
            $scope.kindName = '';
            $scope.chainName = '';
            $scope.poiName = '';
            $scope.fullName = '';
            $scope.teleNum = '';
            $scope.parkType = '';
            var tele = [];
            var i;
            pKindList = $scope.$parent.metaData.kindList;
            pKindFormat = $scope.$parent.metaData.kindFormat;
            pAllChain = $scope.$parent.metaData.allChain;
            $scope.poi = objectCtrl.data;
            if ($scope.poi.names && $scope.poi.names.length > 0) {
                for (i = 0; i < $scope.poi.names.length; i++) {
                    if ($scope.poi.names[i].nameClass == 1 && $scope.poi.names[i].nameType == 2 && $scope.poi.names[i].langCode == 'CHI') {
                        $scope.poiName = $scope.poi.names[i].name;
                        break;
                    }
                }
            }
            if ($scope.poi.addresses && $scope.poi.addresses.length > 0) {
                for (i = 0; i < $scope.poi.addresses.length; i++) {
                    if ($scope.poi.addresses[i].nameGroupid == 1 && ($scope.poi.addresses[i].langCode == 'CHI' || $scope.poi.addresses[i].langCode == 'CHT')) {
                        $scope.fullName = $scope.poi.addresses[i].fullname;
                        break;
                    }
                }
            }
            if (pKindFormat[$scope.poi.kindCode]) {
                $scope.kindName = pKindFormat[$scope.poi.kindCode].kindName;
            }
            if ($scope.poi.chain && pAllChain[$scope.poi.kindCode]) {
                for (i = 0; i < pAllChain[$scope.poi.kindCode].length; i++) {
                    if ($scope.poi.chain == pAllChain[$scope.poi.kindCode].chainCode) {
                        $scope.chainName = pAllChain[$scope.poi.kindCode].chainName;
                    }
                }
            }
            if ($scope.poi.contacts && $scope.poi.contacts.length > 0) {
                for (var j = 0; j < $scope.poi.contacts.length; j++) {
                    if ($scope.poi.contacts[j].contactType === 1) {
                        tele.push($scope.poi.contacts[j].code + '-' + $scope.poi.contacts[j].contact);
                    } else if ($scope.poi.contacts[j].contactType === 2) {
                        tele.push($scope.poi.contacts[j].contact);
                    }
                }
                $scope.teleNum = tele.join('|');
            }
            if ($scope.poi.parkings && $scope.poi.parkings.length > 0) {
                var parkingType = $scope.poi.parkings[0].parkingType;
                switch (parkingType) {
                    case '0':
                        $scope.parkType = '室内';
                        break;
                    case '1':
                        $scope.parkType = '室外';
                        break;
                    case '2':
                        $scope.parkType = '占道';
                        break;
                    case '3':
                        $scope.parkType = '室内（地上）';
                        break;
                    case '4':
                        $scope.parkType = '室外（地下）';
                        break;
                    default:
                        $scope.parkType = '无法获取';
                        break;
                }
            }
        };

        /**
         * 用于表单验证
         * @returns {boolean}
         */
        var validateForm = function () {
            return true;
        };
        $scope.poiSaveBefore = function () {
            var flag = validateForm();
            if ($scope.poiDeepForm.$invalid) {
                flag = false;
            }
            if (flag) {
                $scope.$emit('PoiSave');
            }
        };

        $scope.$on('ReloadData', function () {
            initData();
            $scope.$broadcast('reloadDeepData');
        });
    }
]);
