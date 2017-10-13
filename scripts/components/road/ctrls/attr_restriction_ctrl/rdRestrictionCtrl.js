/**
 * Created by liwanchong on 2015/10/24.
 */
angular.module('app').controller('showRdRestrictionController', ['$rootScope', '$scope', '$timeout', '$ocLazyLoad',
    'dsFcc', 'dsEdit', '$q', 'hotkeys', '$popover', 'dsLazyload',
    function ($rootScope, $scope, $timeout, $ocLazyLoad, dsFcc, dsEdit, $q, hotkeys, $popover, dsLazyload) {
        var objectEditCtrl = fastmap.uikit.ObjectEditController();
        var flashHighlightCtrl = FM.mapApi.render.FlashHighlightController.getInstance();
        $scope.dateURL = null;

        // 交限类型
        $scope.restrictionType = 0; // 0--普通交限 1--卡车交限

        // 判断当前交限是卡车交限还是普通交限
        function isTruckRestriction() {
            var flag = false;
            // $scope.restrictionType = 0; // 普通交限
            var details = $scope.rdRestrictCurrentData.details;
            for (var i = 0; i < details.length; i++) {
                if (details[i].conditions && details[i].conditions[0]) {
                    var bin = Utils.dec2bin(details[i].conditions[0].vehicle);
                    var reverseBin = bin.split('').reverse();
                    var a = reverseBin[1];
                    var b = reverseBin[2];
                    if (a === '1' || b === '1') {
                        flag = true;
                    }
                }
            }
            return flag;
        }

        // 转换infotype;
        function transformType(data) {
            var temp;
            if (data.flag == 1) {
                temp = data.restricInfo;
            } else {
                temp = '[' + data.restricInfo + ']';
            }
            return temp;
        }
        // (重新组装主表restricInfo)
        function upDateRestricInfo(data) {
            data.restricInfo = '';
            for (var i = 0; i < data.details.length; i++) {
                if (i == data.details.length - 1) {
                    data.restricInfo += transformType(data.details[i]);
                } else {
                    data.restricInfo += transformType(data.details[i]) + ',';
                }
            }
        }

        // 初始化数据
        var initializeData = function () {
            flashHighlightCtrl.clearFeedback();
            // 交限数据;
            $scope.rdRestrictCurrentData = objectEditCtrl.data;
            var ctrl = '../../scripts/components/tools/fmTimeComponent/fmdateTimer.js';
            var tmpl = '../../scripts/components/tools/fmTimeComponent/fmdateTimer.html';
            $ocLazyLoad.load([ctrl, tmpl]).then(function () {
                $scope.dateURL = tmpl;
                $timeout(function () {
                    $scope.showData(0);
                    // 交限的第一条详细信息;
                    $scope.restrictionType = isTruckRestriction() ? 1 : 0;
                    if ($scope.rdRestrictionCurrentDetail.type == 2) {
                        $scope.changeLimitType(2);
                    }
                });
            });
        };

        var getSelectedLinks = function () {
            var data = [];
            var laneIndex = $scope.currentEditIndex;
            if (laneIndex >= 0) {
                var topo = $scope.rdRestrictCurrentData.details[laneIndex];
                data.push({
                    pid: topo.outLinkPid,
                    featureType: 'RDLINK',
                    symbolName: 'ls_link_selected'
                });
                for (var i = 0; i < topo.vias.length; i++) {
                    data.push({
                        pid: topo.vias[i].linkPid,
                        featureType: 'RDLINK',
                        symbolName: 'ls_link_selected'
                    });
                }
            }

            return data;
        };

        // 点击限制方向时,显示其有的属性信息
        $scope.showData = function (index) {
            $scope.currentEditIndex = index;
            var item = $scope.rdRestrictCurrentData.details[index];
            $scope.rdRestrictionCurrentDetail = item;
            $scope.rdRestrictionOriginDetail = angular.copy(item);
            // 如果有时间域则显示
            if ($scope.rdRestrictionCurrentDetail.type == 2 && $scope.rdRestrictionCurrentDetail.conditions.length) {
                $scope.fmdateTimer($scope.rdRestrictionCurrentDetail.conditions[0].timeDomain);
            }

            flashHighlightCtrl.resetFeedback(getSelectedLinks());
        };
        // 修改交限方向的理论或实际
        $scope.changeType = function (detail) {
            if (detail.flag == 2 && detail.type == 2) {
                $scope.rdRestrictionCurrentDetail.type = 0;
                $scope.rdRestrictionCurrentDetail.conditions[0].timeDomain = '';
            }
            upDateRestricInfo($scope.rdRestrictCurrentData);
        };
        // 删除交限detail子表;
        $scope.deleteDirect = function (item, event, index) {
            var len = $scope.rdRestrictCurrentData.details.length;
            if (len === 1) {
                swal('无法操作', '请点击删除按钮删除该交限！', 'info');
            } else {
                $scope.rdRestrictCurrentData.details.splice(index, 1);
                upDateRestricInfo($scope.rdRestrictCurrentData);
            }
        };

        $scope.fmdateTimer = function (str) {
            $scope.$on('get-date', function (event, data) {
                $scope.rdRestrictionCurrentDetail.conditions[0].timeDomain = data;
            });
            $timeout(function () {
                $scope.$broadcast('set-code', str);
                $scope.rdRestrictionCurrentDetail.conditions[0].timeDomain = str;
                $scope.$apply();
            }, 100);
        };
        // 限制类型修改当由时间段禁止改为其他类型时删除原有时间;
        $scope.changeLimitType = function (type) {
            if (type == 2) {
                $timeout(function () {
                    var currentDetailId = $scope.rdRestrictionCurrentDetail.pid;
                    if (!$scope.rdRestrictionCurrentDetail.conditions[0]) {
                        var obj = {
                            detailId: currentDetailId,
                            timeDomain: ''
                        };
                        $scope.rdRestrictionCurrentDetail.conditions[0] = FM.dataApi.rdRestrictionCondition(obj);
                    }
                    $scope.fmdateTimer($scope.rdRestrictionCurrentDetail.conditions[0].timeDomain);
                    $scope.$broadcast('set-code', $scope.rdRestrictionCurrentDetail.conditions[0].timeDomain);
                });
            } else {
                $scope.fmdateTimer('');
            }
        };

        /* ******************************************卡车限制信息对数据输入判断******************************************* */
        // 校验小数
        $scope.verifyFloat = function (t, min, max) {
            var value = parseFloat(t.target.value, 10);
            if (isNaN(value)) {
                t.target.value = 0;
                return;
            }

            if (value < min) {
                t.target.value = min;
                return;
            }
            if (value > max) {
                t.target.value = max;
                return;
            }

            var valueStr = value.toString();
            var temp = valueStr.split('.');
            if (temp[1] && temp[1].length > 2) {
                t.target.value = value.toFixed(2);
                return;
            }

            if (valueStr !== t.target.value) {
                t.target.value = value;
                return;
            }
        };
        // 校验实数
        $scope.verifyNumber = function (t, min, max) {
            var value = parseInt(t.target.value, 10);
            if (isNaN(value)) {
                t.target.value = 0;
                return;
            }
            if (value < min) {
                t.target.value = min;
                return;
            }
            if (value > max) {
                t.target.value = max;
                return;
            }
            if (value.toString() !== t.target.value) {
                t.target.value = value;
                return;
            }
        };

        /* *****************************************************页面初始化和销毁**************************************************/
        $scope.$on('ReloadData', initializeData);

        $scope.$on('$destroy', function () {
            flashHighlightCtrl.clearFeedback();
        });
    }
]);
