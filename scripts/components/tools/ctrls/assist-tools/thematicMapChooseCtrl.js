/**
 * Created by zhaohang on 2016/11/14.
 */
angular.module('app').controller('ThematicMap', ['$scope',
    function ($scope) {
        $scope.temSelectId = App.Temp.temSelectId;
        $scope.ThematicMapArray = [{
            id: 53,
            type: 'rdLinkProperty',
            name: 'FC作业场景专题图',
            minZoom: 15,
            temporaryTM: 1
        }, {
            id: 54,
            type: 'rdLinkProperty',
            name: '收免费作业场景专题图',
            minZoom: 13,
            temporaryTM: 2
        }, {
            id: 55,
            type: 'rdLinkProperty',
            name: '速度等级跳跃调整场景专题图',
            minZoom: 13,
            temporaryTM: 3
        }, {
            id: 1,
            type: 'rdLinkLimitTruck',
            name: '卡车限制信息',
            minZoom: 10
        }, {
            id: 2,
            type: 'rdLinkLimit',
            name: 'link限制信息数量（普通限制信息）',
            minZoom: 10
        }, {
            id: 3,
            type: 'rdlinkSpeedlimitSpeedClass',
            name: '普通线限速限速等级',
            minZoom: 10
        }, {
            id: 4,
            type: 'rdlinkSpeedlimitSpeedClassWork',
            name: '普通线限速限速等级赋值标识',
            minZoom: 10
        }, {
            id: 5,
            type: 'rdlinkSpeedlimitSpeedLimitSrc',
            name: '普通线限速限速来源',
            minZoom: 10
        }, {
            id: 6,
            type: 'rdLinkLaneClass',
            name: 'link车道等级',
            minZoom: 10
        }, {
            id: 7,
            type: 'rdLinkFunctionClass',
            name: 'link功能等级',
            minZoom: 10
        }, {
            id: 8,
            type: 'rdLinkLaneNum',
            name: '车道数（总数）',
            minZoom: 10
        }, {
            id: 9,
            type: 'rdLinkDevelopState',
            name: '开发状态',
            minZoom: 10
        }, {
            id: 10,
            type: 'rdLinkMultiDigitized',
            name: '上下线分离',
            minZoom: 10
        }, {
            id: 11,
            type: 'rdLinkPaveStatus',
            name: '铺设状态',
            minZoom: 10
        }, {
            id: 12,
            type: 'rdLinkTollInfo',
            name: '收费信息',
            minZoom: 13
        }, {
            id: 13,
            type: 'rdLinkSpecialTraffic',
            name: '特殊交通',
            minZoom: 10
        }, {
            id: 14,
            type: 'rdLinkIsViaduct',
            name: '高架',
            minZoom: 10
        }, {
            id: 15,
            type: 'rdLinkAppInfo',
            name: '供用信息',
            minZoom: 10
        }, {
            id: 16,
            type: 'rdLinkForm50',
            name: '交叉口内道路',
            minZoom: 10
        }, {
            id: 17,
            type: 'rdLinkNameContent',
            name: '道路名内容',
            minZoom: 17
        }, {
            id: 18,
            type: 'rdLinkNameGroupid',
            name: '道路名组数',
            minZoom: 10
        }, {
            id: 19,
            type: 'rdLinkNameType',
            name: '名称类型',
            minZoom: 13
        }, {
            id: 20,
            type: 'rdlinkSpeedlimitConditionCount',
            name: '条件线限速个数',
            minZoom: 10
        }, {
            id: 21,
            type: 'rdLinkLimitType3',
            name: '禁止穿行',
            minZoom: 10
        }, {
            id: 22,
            type: 'rdLinkFormOfWay10',
            name: 'IC',
            minZoom: 10
        }, {
            id: 23,
            type: 'rdLinkFormOfWay11',
            name: 'JCT',
            minZoom: 10
        }, {
            id: 24,
            type: 'rdLinkFormOfWay12',
            name: 'SA',
            minZoom: 10
        }, {
            id: 25,
            type: 'rdLinkFormOfWay13',
            name: 'PA',
            minZoom: 10
        }, {
            id: 26,
            type: 'rdLinkFormOfWay14',
            name: '全封闭道路',
            minZoom: 10
        }, {
            id: 27,
            type: 'rdLinkFormOfWay15',
            name: '匝道',
            minZoom: 10
        }, {
            id: 28,
            type: 'rdLinkFormOfWay16',
            name: '跨线天桥',
            minZoom: 10
        }, {
            id: 29,
            type: 'rdLinkFormOfWay17',
            name: '跨线地道',
            minZoom: 10
        }, {
            id: 30,
            type: 'rdLinkFormOfWay20',
            name: '步行街',
            minZoom: 10
        }, {
            id: 31,
            type: 'rdLinkFormOfWay31',
            name: '隧道',
            minZoom: 10
        }, {
            id: 32,
            type: 'rdLinkFormOfWay33',
            name: '环岛',
            minZoom: 10
        }, {
            id: 33,
            type: 'rdLinkFormOfWay34',
            name: '辅路',
            minZoom: 10
        }, {
            id: 34,
            type: 'rdLinkFormOfWay35',
            name: '调头口',
            minZoom: 10
        }, {
            id: 35,
            type: 'rdLinkFormOfWay36',
            name: 'POI连接路',
            minZoom: 10
        }, {
            id: 36,
            type: 'rdLinkFormOfWay37',
            name: '提右',
            minZoom: 10
        }, {
            id: 37,
            type: 'rdLinkFormOfWay38',
            name: '提左',
            minZoom: 10
        }, {
            id: 38,
            type: 'rdLinkFormOfWay39',
            name: '主辅路出入口',
            minZoom: 10
        }, {
            id: 39,
            type: 'rdLinkLimitType0',
            name: '道路维修中',
            minZoom: 10
        }, {
            id: 40,
            type: 'rdLinkLimitType8',
            name: '外地车限行',
            minZoom: 10
        }, {
            id: 41,
            type: 'rdLinkLimitType9',
            name: '尾号限行',
            minZoom: 10
        }, {
            id: 42,
            type: 'rdLinkLimitType10',
            name: '在建',
            minZoom: 10
        }, {
            id: 43,
            type: 'rdLinkLimitType2',
            name: '车辆限制',
            minZoom: 10
        }, {
            id: 44,
            type: 'rdLinkLimitType5',
            name: '季节性关闭道路',
            minZoom: 10
        }, {
            id: 45,
            type: 'rdLinkLimitType6',
            name: 'Usage fee required',
            minZoom: 10
        }, {
            id: 46,
            type: 'rdLinkLimitType7',
            name: '超车限制',
            minZoom: 10
        }, {
            id: 47,
            type: 'rdLinkLimitType1',
            name: '单行限制',
            minZoom: 10
        }, {
            id: 48,
            type: 'rdLinkRticRank',
            name: 'RTIC等级',
            minZoom: 10
        }, {
            id: 49,
            type: 'rdLinkIntRticRank',
            name: 'IntRtic等级',
            minZoom: 10
        }, {
            id: 50,
            type: 'rdLinkZoneTpye',
            name: 'ZONE类型',
            minZoom: 10
        }, {
            id: 51,
            type: 'rdLinkZoneCount',
            name: 'ZONE个数',
            minZoom: 10
        }, {
            id: 52,
            type: 'rdLinkZoneSide',
            name: 'link的左右ZONE号码',
            minZoom: 10
        }];
        $scope.selectThematicMap = function (data, $event) {
            var layerCtrl = fastmap.uikit.LayerController();
            var layer = layerCtrl.getLayerById('thematicLink');
            if (data.type === 'close') {
                layerCtrl.setLayerVisible('rdLink', true);
                layerCtrl.setLayerVisible('thematicLink', false);
                $scope.temSelectId = 0;
                App.Temp.temporaryTM = 0;
                App.Temp.temSelectId = 0;
                App.Temp.thematicMapType = null;
                layerCtrl.setLayerVisible('rdLink', true);
                layerCtrl.setLayerVisible('thematicLink', false);
            } else if (data.type === 'rdLinkProperty') { // 对三个场景特殊处理成专题图
                App.Temp.temporaryTM = data.temporaryTM;
                App.Temp.thematicMapType = data.type;
                App.Temp.temSelectId = data.id;
                $scope.temSelectId = data.id;
                layerCtrl.setLayerVisible('rdLink', false);
                layerCtrl.setLayerVisible('thematicLink', true);
                layer.options.minZoom = data.minZoom;
                layer.url.parameter.types = [data.type];
                layer.redraw();
            } else {
                layerCtrl.setLayerVisible('rdLink', false);
                layerCtrl.setLayerVisible('thematicLink', true);
                App.Temp.temporaryTM = 0;
                App.Temp.thematicMapType = data.type;
                App.Temp.temSelectId = data.id;
                $scope.temSelectId = data.id;
                layerCtrl.setLayerVisible('rdLink', false);
                layerCtrl.setLayerVisible('thematicLink', true);
                layer.options.minZoom = data.minZoom;
                layer.url.parameter.types = [data.type];
                layer.redraw();
            }
        };
    }
]);
