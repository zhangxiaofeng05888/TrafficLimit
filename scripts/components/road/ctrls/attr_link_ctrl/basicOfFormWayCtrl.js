/**
 * Created by linglong on 2017/1/13.
 */
angular.module('app').controller('formOfWayController', function ($scope) {
    // rdlink的form形态;
    $scope.fromOfWayOption = [
        {
            id: '0',
            label: '未调查',
            isCheck: false
        },
        {
            id: '1',
            label: '无属性',
            isCheck: false
        },
        {
            id: '2',
            label: '其他',
            isCheck: false
        },
        {
            id: '10',
            label: 'IC',
            isCheck: false
        },
        {
            id: '11',
            label: 'JCT',
            isCheck: false
        },
        {
            id: '12',
            label: 'SA',
            isCheck: false
        },
        {
            id: '13',
            label: 'PA',
            isCheck: false
        },
        {
            id: '14',
            label: '全封闭道路',
            isCheck: false
        },
        {
            id: '15',
            label: '匝道',
            isCheck: false
        },
        {
            id: '16',
            label: '跨线天桥(Overpass)',
            isCheck: false
        },
        {
            id: '17',
            label: '跨线地道(Underpass)',
            isCheck: false
        },
        {
            id: '18',
            label: '私道',
            isCheck: false
        },
        {
            id: '20',
            label: '步行街',
            isCheck: false
        },
        {
            id: '21',
            label: '过街天桥',
            isCheck: false
        },
        {
            id: '22',
            label: '公交专用道',
            isCheck: false
        },
        {
            id: '23',
            label: '自行车道',
            isCheck: false
        },
        {
            id: '24',
            label: '跨线立交桥',
            isCheck: false
        },
        {
            id: '30',
            label: '桥',
            isCheck: false
        },
        {
            id: '31',
            label: '隧道',
            isCheck: false
        },
        {
            id: '32',
            label: '立交桥',
            isCheck: false
        },
        {
            id: '33',
            label: '环岛',
            isCheck: false
        },
        {
            id: '34',
            label: '辅路',
            isCheck: false
        },
        {
            id: '35',
            label: '调头口(U-Turn)',
            isCheck: false
        },
        {
            id: '36',
            label: 'POI连接路',
            isCheck: false
        },
        {
            id: '37',
            label: '提右',
            isCheck: false
        },
        {
            id: '38',
            label: '提左',
            isCheck: false
        },
        {
            id: '39',
            label: '主辅路出入口',
            isCheck: false
        },
        {
            id: '43',
            label: '窄道路',
            isCheck: false
        },
        {
            id: '48',
            label: '主路',
            isCheck: false
        },
        {
            id: '49',
            label: '侧道',
            isCheck: false
        },
        {
            id: '50',
            label: '交叉点内道路',
            isCheck: false
        },
        {
            id: '51',
            label: '未定义交通区域(UTA)',
            isCheck: false
        },
        {
            id: '52',
            label: '区域内道路',
            isCheck: false
        },
        {
            id: '53',
            label: '停车场出入口连接路',
            isCheck: false
        },
        {
            id: '54',
            label: '停车场出入口虚拟连接路',
            isCheck: false
        },
        {
            id: '57',
            label: 'Highway对象外JCT',
            isCheck: false
        },
        {
            id: '60',
            label: '风景路线',
            isCheck: false
        },
        {
            id: '80',
            label: '停车位引导道路(Parking Lane)',
            isCheck: false
        },
        {
            id: '81',
            label: '虚拟调头口',
            isCheck: false
        },
        {
            id: '82',
            label: '虚拟提左提右',
            isCheck: false
        }
    ];

    for (var i = 0; i < $scope.linkData.forms.length; i++) {
        for (var j = 0; j < $scope.fromOfWayOption.length; j++) {
            if ($scope.fromOfWayOption[j].id == $scope.linkData.forms[i].formOfWay && !$scope.linkData.forms[i].deleted()) {
                $scope.fromOfWayOption[j].isCheck = true;
            }
        }
    }

    // 修改link的form属性;
    $scope.changeLinkFormList = function (data) {
        var count = 0;
        if (data.isCheck) {
            // 更新当前对象的forms属性;
            if (parseInt(data.id, 10) == 0 || parseInt(data.id, 10) == 1) {
                $scope.fromOfWayOption.forEach(function (item) {
                    if (item.id === data.id) {
                        item.isCheck = true;
                    } else {
                        item.isCheck = false;
                    }
                });
                $scope.linkData.forms.forEach(function (item) {
                    if (item.formOfWay === parseInt(data.id, 10)) {
                        item.undelete();
                        count++;
                    } else {
                        item.delete();
                    }
                });
                if (count === 0) {
                    $scope.linkData.forms.push(FM.dataApi.rdLinkForm({
                        linkPid: $scope.linkData.pid,
                        formOfWay: parseInt(data.id, 10),
                        auxiFlag: 0
                    }));
                }
            } else {
                $scope.linkData.forms.forEach(function (item) {
                    if (item.formOfWay === 0 || item.formOfWay === 1) {
                        item.delete();
                    }
                    if (item.formOfWay === parseInt(data.id, 10)) {
                        count++;
                        item.undelete();
                    }
                });
                if (count === 0) {
                    $scope.linkData.forms.push(FM.dataApi.rdLinkForm({
                        linkPid: $scope.linkData.pid,
                        formOfWay: parseInt(data.id, 10),
                        auxiFlag: 0
                    }));
                }
                $scope.fromOfWayOption[0].isCheck = false;
                $scope.fromOfWayOption[1].isCheck = false;
            }
        } else {
            // 更新当前对象的forms属性;
            $scope.linkData.forms.forEach(function (item) {
                if (item.formOfWay === parseInt(data.id, 10)) {
                    item.delete();
                }
                if (!item.deleted()) {
                    count++;
                }
            });
            // 如果全部反选得留‘无属性’;
            if (count === 0) {
                $scope.fromOfWayOption[1].isCheck = true;
                $scope.linkData.forms.forEach(function (item) {
                    if (item.formOfWay === 1) {
                        item.undelete();
                        count++;
                    }
                });
                if (count === 0) {
                    $scope.linkData.forms.push(FM.dataApi.rdLinkForm({
                        linkPid: $scope.linkData.pid,
                        formOfWay: 1,
                        auxiFlag: 0
                    }));
                }
            }
        }
        $scope.linkData._changeRdlinkForm_speedClass(data);
        $scope.$emit('formChangetoPave');
    };
});
