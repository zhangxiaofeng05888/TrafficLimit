/**
 * Created by liuzhaoxia on 2016/1/5.
 */
var dataTipsApp = angular.module('app');
dataTipsApp.controller('sceneAllTipsController', ['$scope', '$timeout', '$ocLazyLoad', 'dsEdit', 'dsFcc',
    function ($scope, $timeout, $ocLazyLoad, dsEdit, dsFcc) {
        var eventController = fastmap.uikit.EventController();
        var sceneCtrl = fastmap.mapApi.scene.SceneController.getInstance();
        var flashHighlightCtrl = FM.mapApi.render.FlashHighlightController.getInstance();
        var tipInfo = {};

        $scope.getFeatDataCallback = function (link, type) {
            if (!link) {
                return;
            }
            if (link.type == 1) { // 道路link
                $scope.$emit('ObjectSelected', {
                    feature: {
                        pid: link.id,
                        geoLiveType: 'RDLINK'
                    }
                });
            } else if (link.type == 3) {
                if (type === 'RWLINK') { // 1116,type为3时，关联要素是rwLink
                    $scope.$emit('ObjectSelected', {
                        feature: {
                            pid: link.id,
                            geoLiveType: 'RWLINK'
                        }
                    });
                } else { // 道路node
                    $scope.$emit('ObjectSelected', {
                        feature: {
                            pid: link.id,
                            geoLiveType: 'RDNODE'
                        }
                    });
                }
            } else { // 关联要素为测线时，只高亮tip,不加载数据
                $scope.$emit('HighlightTipLinks', link);
            }
        };

        function formatTime(time) {
            var arr = [];
            time = Utils.trim(time);

            if (time) {
                if (time.endsWith(';')) {
                    time = time.substring(0, time.length - 1);
                    arr = time.split(';');
                } else {
                    arr = time.split(';');
                }
            }

            return arr;
        }

        // 查询质检信息
        var queryQualityData = function () {
            dsFcc.queryWrong($scope.rowkey).then(function (res) {
                if (res && JSON.stringify(res) != '{}') {
                    $scope.wrongData = res;
                } else {
                    $scope.wrongData = null;
                }
                $scope.$emit('getTipQualityData', $scope.wrongData);
            });
        };

        // 刷新质检
        $scope.$on('refreshTipQuality', function (event, data) {
            $scope.wrongData = data;
        });

        // 关闭弹窗，刷新质检
        $scope.$on('refreshTipsQuaPanel', function (event, data) {
            queryQualityData();
        });

        $scope.showItem = function (index) {
            $scope.wArrayitem = $scope.dataTipsData.deep.w_array[index];
        };
        $scope.showMutiInfoItem = function (index) {
            $scope.oArrayItem = $scope.dataTipsData.deep.o_array[index];
        };

        $scope.showOutLink = function (item) {
            $scope.restrictOutLinks = item;
            var data = [];

            item.out.forEach(function (out) {
                data.push({
                    pid: out.id,
                    featureType: out.type == 1 ? 'RDLINK' : 'TIPLINKS',
                    symbolName: 'ls_link_selected'
                });
            });
            flashHighlightCtrl.resetFeedback(data);
        };

        var flashLink = function (items) {
            var data = [];

            items.forEach(function (item) {
                data.push({
                    pid: item.out.id,
                    featureType: item.out.type == 1 ? 'RDLINK' : 'TIPLINKS',
                    symbolName: 'ls_link_selected'
                });
            });
            flashHighlightCtrl.resetFeedback(data);
        };

        $scope.highlightSymbol = function (infoSq, index) {
            $scope.referPicIndex = index;
            var oArray = $scope.dataTipsData.deep.o_array;
            for (var i = 0; i < oArray.length; i++) {
                if (oArray[i].sq === infoSq) {
                    $scope.oarrayData = oArray[i];
                    flashLink(oArray[i].d_array);
                    break;
                }
            }
        };

        $scope.showTruckLimitItem = function (index) {
            $scope.oArrayItem = $scope.dataTipsData.deep.o_array[index];

            var cArray = $scope.dataTipsData.deep.o_array[index].c_array;

            for (var i = 0; i < cArray.length; i++) {
                $scope.dataTipsData['truckTime' + i] = formatTime(cArray[i].time);
            }
        };

        // 初始化DataTips相关数据
        var initialize = function (event, data) {
            flashHighlightCtrl.clearFeedback();

            if (data.data == -1) {
                return;
            }
            $scope.photos = [];
            $scope.bigImgSrc = '';
            $scope.audios = [];
            $scope.remarksContent = null;
            $scope.dataTipsData = data.data;
            $scope.rowkey = $scope.dataTipsData.rowkey;
            $scope.allTipsType = $scope.dataTipsData.code;
            $scope.referPicIndex = 0;   //  用于参考图片选中效果的控制

            var lastTrackInfo = $scope.dataTipsData.track.t_trackInfo[$scope.dataTipsData.track.t_trackInfo.length - 1];
            $scope.disabledFlag = false; // 标识状态可以点击
            if (lastTrackInfo && lastTrackInfo.stage == 2) {
                $scope.disabledFlag = true; // 标识状态不可以点击
            }

            // 显示状态
            if ($scope.dataTipsData) {
                switch ($scope.dataTipsData.track.t_lifecycle) {
                    case 1:
                        $scope.showContent = '外业删除';
                        $scope.statusColor = 'red';
                        break;
                    case 2:
                        $scope.showContent = '外业修改';
                        $scope.labelInfo = false;
                        $scope.labelSuc = true;
                        $scope.statusColor = '#ffbf5f';
                        break;
                    case 3:
                        $scope.showContent = '外业新增';
                        $scope.labelInfo = true;
                        $scope.labelSuc = false;
                        $scope.statusColor = '#008000';
                        break;
                    case 0:
                        $scope.showContent = '默认值';
                        $scope.statusColor = 'inherit';
                        break;
                    default:
                        break;
                }
            }
            $scope.wArrayitem = {};
            $scope.oArrayItem = {};
            $scope.schemaType = '';
            $scope.timeDomain = '';
            $scope.sceneExit = '';
            $scope.scheName = '';
            $scope.JVCSchemaNo = '';
            $scope.roadCameraType = '';
            $scope.otherData = '';
            $scope.parkingLoc = '';
            $scope.loc = '';
            $scope.tollGateTp = '';
            $scope.TollETC = '';
            $scope.tollGateLoc = '';
            $scope.mileageNum = '';
            $scope.mileageNm = '';
            $scope.mileageSrc = '';
            $scope.busDriveway = '';
            $scope.deleteFlagLinkId = '';
            $scope.outIdS = [];
            $scope.variableDirectionInfo = '';

            // 放在这里复用，每个 case 中各自声明，报语法错误
            var lnArr = [];
            var tmpArr = [];

            var commandObj = { //  数据指令字段值，从 case '1207' 剪切到这里，在其它 case 下复用
                0: '不应用',
                1: '删除',
                2: '修改',
                3: '新增'
            };

            switch ($scope.allTipsType) {
                case '1101': // 点限速
                    $scope.speedDirectTypeOptions = [{
                        id: 0,
                        label: '未调查'
                    }, {
                        id: 2,
                        label: '顺方向'
                    }, {
                        id: 3,
                        label: '逆方向'
                    }];
                    for (var i in $scope.speedDirectTypeOptions) {
                        if ($scope.speedDirectTypeOptions[i].id == $scope.dataTipsData.deep.rdDir) {
                            $scope.rdDir = $scope.speedDirectTypeOptions[i].label;
                        }
                    }
                    $scope.limitSrcOption = [{
                        id: 0,
                        label: '无'
                    }, {
                        id: 1,
                        label: '现场标牌'
                    }, {
                        id: 2,
                        label: '城区标识'
                    }, {
                        id: 3,
                        label: '高速标识'
                    }, {
                        id: 4,
                        label: '车道限速'
                    }, {
                        id: 5,
                        label: '方向限速'
                    }, {
                        id: 6,
                        label: '机动车限速'
                    }, {
                        id: 7,
                        label: '匝道未调查'
                    }, {
                        id: 8,
                        label: '缓速行驶'
                    }, {
                        id: 9,
                        label: '未调查'
                    }];
                    for (i = 0; i < $scope.limitSrcOption.length; i++) {
                        if ($scope.limitSrcOption[i].id == $scope.dataTipsData.deep.src) {
                            $scope.limitSrc = $scope.limitSrcOption[i].label;
                        }
                    }
                    $scope.limitDesc = $scope.dataTipsData.deep.desc;
                    break;
                case '1102': // 红绿灯
                    var trafficLightArr = $scope.dataTipsData.deep.f_array;
                    $scope.inCt = $scope.dataTipsData.deep.inCt;
                    $scope.dataTipsData.enableCtl = [];
                    $scope.dataTipsData.disableCtl = [];
                    for (i = 0; i < trafficLightArr.length; i++) {
                        $scope.dataTipsData.disableCtl.push(trafficLightArr[i]);
                    }
                    $scope.dataTipsData.isTrafficLights = true;
                    break;
                case '1103': // 红绿灯方向
                    $scope.linkPid = $scope.dataTipsData.deep.in.id;
                    var directionObj = {
                        0: '未调查',
                        1: '左',
                        2: '右',
                        3: '左右',
                        4: '上',
                        5: '左上',
                        6: '右上',
                        7: '左上右'
                    };
                    $scope.dataTipsData.traffDirection = directionObj[$scope.dataTipsData.deep.loc];
                    $scope.dataTipsData.isTrafficLightsDir = true;
                    break;
                case '1104': // 大门
                    $scope.inLinkPid = $scope.dataTipsData.deep.in.id;
                    $scope.outLinkPid = '';
                    if ($scope.dataTipsData.deep.out) {
                        $scope.outLinkPid = $scope.dataTipsData.deep.out.id;
                    }
                    var gateTypeObj = {
                        0: 'EG',
                        1: 'KG',
                        2: 'PG'
                    };
                    var gateDirObj = {
                        0: '未调查',
                        1: '单向',
                        2: '双向'
                    };
                    $scope.passObj = {
                        0: '机动车辆',
                        1: '行人',
                        2: '自行车',
                        3: '三轮车'
                    };
                    $scope.dataTipsData.gateType = gateTypeObj[$scope.dataTipsData.deep.tp];
                    $scope.dataTipsData.gateDir = gateDirObj[$scope.dataTipsData.deep.dir];
                    $scope.dataTipsData.isGate = true;
                    break;
                case '1105':
                    $scope.wArrayitem = $scope.dataTipsData.deep.w_array[0];
                    $scope.dangerTypeObj = {
                        10501: '上陡坡',
                        10502: '下陡坡',
                        10701: '两侧变窄',
                        13401: '事故易发路段',
                        13703: '交通意外黑点',
                        20301: '会车让行',
                        20101: '停车让行',
                        11802: '傍山险路(右)',
                        11801: '傍山险路(左)',
                        20201: '减速让行',
                        10901: '双向交通',
                        10301: '反向弯路a',
                        10702: '右侧变窄',
                        13603: '右侧绕行',
                        10202: '向右急弯路',
                        10201: '向左急弯路',
                        11902: '堤坝路(右)',
                        11901: '堤坝路(左)',
                        10703: '左侧变窄',
                        13602: '左侧绕行',
                        13601: '左右绕行',
                        13702: '文字性警示标牌',
                        13101: '斜杠符号a50米',
                        13102: '斜杠符号b100米',
                        13103: '斜杠符号c150米',
                        12901: '无人看守铁路道口',
                        11701: '易滑',
                        12801: '有人看守铁路道口',
                        12001: '村庄',
                        11101: '注意儿童',
                        13701: '注意危险',
                        14402: '注意右侧合流',
                        14401: '注意左侧合流',
                        11601: '注意横风',
                        14101: '注意潮汐车道',
                        11201: '注意牲畜',
                        11502: '注意落石(右)',
                        11501: '注意落石(左)',
                        22901: '禁止超车',
                        10801: '窄桥',
                        23001: '解除禁止超车',
                        12401: '路面不平',
                        12601: '路面低洼',
                        12501: '路面高凸',
                        12701: '过水路面',
                        10601: '连续下坡',
                        10401: '连续弯路',
                        14001: '隧道开车灯',
                        12301: '驼峰桥',
                        31501: '鸣喇叭'
                    };
                    break;
                case '1106': // 坡度
                    var slopeTypeObj = {
                        0: '未调查',
                        1: '水平',
                        2: '上坡',
                        3: '下坡'
                    };
                    var endSlopeFlagObj = {
                        0: '否',
                        1: '是'
                    };
                    $scope.dataTipsData.slopeType = slopeTypeObj[$scope.dataTipsData.deep.tp];
                    $scope.dataTipsData.endSlopeFlag = endSlopeFlagObj[$scope.dataTipsData.deep.end];
                    $scope.dataTipsData.isSlope = true;
                    break;
                case '1107': // 收费站
                    $scope.TollType = [{
                        id: 0,
                        label: '未调查'
                    }, {
                        id: 1,
                        label: '领卡'
                    }, {
                        id: 2,
                        label: '交卡付费'
                    }, {
                        id: 3,
                        label: '固定收费(次费)'
                    }, {
                        id: 4,
                        label: '交卡付费后再领卡'
                    }, {
                        id: 5,
                        label: '交卡付费并代收固定费用'
                    }, {
                        id: 6,
                        label: '验票(无票收费)值先保留'
                    }, {
                        id: 7,
                        label: '领卡并代收固定费用'
                    }, {
                        id: 8,
                        label: '持卡打标识不收费'
                    }, {
                        id: 9,
                        label: '验票领卡'
                    }, {
                        id: 10,
                        label: '交卡不收费'
                    }];
                    for (i in $scope.TollType) {
                        if ($scope.TollType[i].id == $scope.dataTipsData.deep.tp) {
                            $scope.tollGateTp = $scope.TollType[i].label;
                        }
                    }
                    $scope.TollETC = $scope.dataTipsData.deep.etc.join(',');
                    $scope.TollLoc = [{
                        id: 0,
                        label: '未调查'
                    }, {
                        id: 1,
                        label: '否'
                    }, {
                        id: 2,
                        label: '是'
                    }];
                    for (i in $scope.TollLoc) {
                        if ($scope.TollLoc[i].id == $scope.dataTipsData.deep.loc) {
                            $scope.tollGateLoc = $scope.TollLoc[i].label;
                        }
                    }
                    var photoObj = {
                        1: '未采集',
                        2: '现场无标牌',
                        3: '已采集'
                    };
                    $scope.photoType = photoObj[$scope.dataTipsData.deep.photo];
                    break;
                case '1109': // 电子眼
                    var otherData = {
                        0: '否',
                        1: '是'
                    };
                    $scope.otherData = otherData[$scope.dataTipsData.deep.thrd];
                    var typeObj = {
                        1: '限速摄像头',
                        10: '交通信号灯摄像头',
                        12: '单行线摄像头',
                        13: '非机动车道摄像头',
                        14: '出入口摄像头',
                        15: '公交车道摄像头',
                        16: '禁止左/右转摄像头',
                        18: '应急车道摄像头',
                        19: '交通标线摄像头',
                        20: '区间测速开始',
                        21: '区间测速结束',
                        22: '违章停车摄像头',
                        23: '限行限号摄像头',
                        98: '其他'
                    };
                    $scope.roadCameraType = typeObj[$scope.dataTipsData.deep.tp];
                    var loc = {
                        0: '未调查',
                        1: '左',
                        2: '右',
                        4: '上'
                    };
                    $scope.loc = loc[$scope.dataTipsData.deep.loc];
                    break;
                case '1110': // 卡车限制
                    $scope.dataTipsData.isLimitTruck = true;
                    $scope.ht = $scope.dataTipsData.deep.ht + 'm';
                    $scope.wd = $scope.dataTipsData.deep.wd + 'm';
                    break;
                case '1111': // 条件限速
                    $scope.dataTipsData.limitConditionObj = {
                        1: '雨天',
                        2: '雪天',
                        3: '雾天',
                        6: '学校',
                        10: '时间限制',
                        12: '季节时段'
                    };
                    for (i = 0; i < $scope.dataTipsData.deep.d_array.length; i++) {
                        if (!$scope.dataTipsData.deep.d_array[i].time) {
                            $scope.dataTipsData.deep.d_array[i].time = 0;
                        }
                    }
                    $scope.dataTipsData.isConditionLimit = true;
                    break;
                case '1112':
                    var limitDirObj = {
                        0: '未调查',
                        1: '左',
                        2: '右',
                        3: '上'
                    };
                    $scope.dataTipsData.limitDir = limitDirObj[$scope.dataTipsData.deep.loc];
                    $scope.dataTipsData.isVariableSpeedLimit = true;
                    break;
                case '1113':
                    var len = 0;
                    var limitValue = $scope.dataTipsData.deep.value;
                    limitValue.sort(function (a, b) {
                        return a < b ? 1 : -1;
                    });
                    for (i = 0, len = limitValue.length; i < len; i++) {
                        if (i != len - 1) {
                            $scope.limitValue = limitValue[i] + '|';
                        } else {
                            $scope.limitValue = limitValue[i];
                        }
                    }
                    $scope.dataTipsData.limitValue = limitValue.join('|');
                    $scope.dataTipsData.isDrivewayLimit = true;
                    break;
                case '1201': // 道路种别
                    $scope.returnKindType = function (code) {
                        switch (code) {
                            case 0:
                                return '作业中';
                            case 1:
                                return '高速道路';
                            case 2:
                                return '城市高速';
                            case 3:
                                return '国道';
                            case 4:
                                return '省道';
                            case 5:
                                return '预留';
                            case 6:
                                return '县道';
                            case 7:
                                return '乡镇村道路';
                            case 8:
                                return '其他道路';
                            case 9:
                                return '非引导道路';
                            case 10:
                                return '步行道路';
                            case 11:
                                return '人渡';
                            case 13:
                                return '轮渡';
                            case 15:
                                return '10级路（障碍物）';
                            default:
                                return '';
                        }
                    };
                    $scope.kindType = $scope.returnKindType($scope.dataTipsData.deep.kind);
                    break;
                case '1202': // 车道数
                    var sideObj = {
                        0: '不应用',
                        1: '左',
                        2: '右'
                    };
                    $scope.dataTipsData.sideDir = sideObj[$scope.dataTipsData.deep.side];
                    break;
                case '1203': // 道路方向
                    if ($scope.dataTipsData.deep.dr == 1) {
                        $scope.drs = '双方向';
                    } else {
                        $scope.drs = '单方向';
                    }
                    $scope.fData = $scope.dataTipsData.deep.f;
                    $scope.time = $scope.dataTipsData.deep.time;
                    break;
                case '1204': // 可逆车道
                    $scope.dataTipsData.isReversibleLine = true;
                    lnArr = $scope.dataTipsData.deep.ln;
                    var arr = [];

                    for (i = 0; i < lnArr.length; i++) {
                        arr.push(lnArr[i].rev);
                        $scope.dataTipsData['revTime' + i] = formatTime(lnArr[i].time);
                    }

                    $scope.dataTipsData.revs = arr.join(',');
                    break;
                case '1205': // SA
                    $scope.fData = $scope.dataTipsData.deep.f;
                    break;
                case '1206': // PA
                    $scope.fData = $scope.dataTipsData.deep.f;
                    break;
                case '1207': // 匝道
                case '1512': // 辅路
                case '1605': // POI连接路
                case '1606': // 收费站开放道路
                    $scope.dataTipsData.commandData = commandObj[$scope.dataTipsData.track.t_command];
                    break;
                case '1208': // 停车场出入口
                    var parkingLoc = {
                        0: '地上停车场',
                        1: '地下停车场'
                    };
                    $scope.parkingLoc = parkingLoc[$scope.dataTipsData.deep.under];
                    break;
                case '1301': // 车信
                    $scope.oarrayData = $scope.dataTipsData.deep.o_array[0];
                    $scope.dataTipsData.isLaneConnexity = true;
                    break;
                case '1302': // 交限
                    // 高亮
                    $scope.restrictOutLinks = $scope.dataTipsData.deep.o_array[0];
                    $scope.dataTipsData.nomalRestriction = true;
                    break;
                case '1303': // 卡车交限
                    $scope.dataTipsData.isTruckLimit = true;
                    $scope.oArrayItem = $scope.dataTipsData.deep.o_array[0]; // 默认显示第一个
                    var cArray = $scope.dataTipsData.deep.o_array[0].c_array;

                    for (i = 0; i < cArray.length; i++) {
                        $scope.dataTipsData['truckTime' + i] = formatTime(cArray[i].time);
                    }

                    $scope.outsideCarObj = {
                        0: '不应用',
                        1: '仅限制外埠车辆',
                        2: '仅限制本埠车辆'
                    };
                    break;
                case '1304': // 禁止穿行
                    $scope.dataTipsData.isNoCrossing = true;
                    break;
                case '1305': // 禁止驶入
                    $scope.dataTipsData.eliminateCarObj = [{
                        id: 1,
                        label: '客车'
                    }, {
                        id: 2,
                        label: '配送卡车'
                    }, {
                        id: 3,
                        label: '运输卡车'
                    }, {
                        id: 5,
                        label: '出租车'
                    }];
                    for (i = 0; i < $scope.dataTipsData.eliminateCarObj.length; i++) {
                        for (var j = 0; j < $scope.dataTipsData.deep.vt.length; j++) {
                            if ($scope.dataTipsData.eliminateCarObj[i].id == $scope.dataTipsData.deep.vt[j]) {
                                $scope.dataTipsData.eliminateCarObj[i].checked = true;
                            }
                        }
                    }
                    $scope.dataTipsData.isNoDriveIn = true;
                    break;
                case '1306': // 路口语音引导
                    $scope.oArrayItem = $scope.dataTipsData.deep.o_array[0];
                    $scope.dataTipsData.crossVoice = true;
                    $scope.crossVoiceCode = {
                        1: '直行',
                        2: '右斜前',
                        4: '右转',
                        6: '右后转',
                        8: '左后转',
                        10: '左转',
                        12: '左斜前'
                    };
                    break;
                case '1308': // 禁止卡车驶入
                    $scope.outsideCarLimit = $scope.dataTipsData.deep.c_array[0].out;
                    $scope.outsideCarObj = {
                        0: '不应用',
                        1: '仅限制外埠车辆',
                        2: '仅限制本埠车辆'
                    };
                    if ($scope.dataTipsData.deep.c_array[0].time) {
                        $scope.timeDomain = $scope.dataTipsData.deep.c_array[0].time.split(';');
                    }
                    break;
                case '1311': // 可变导向车道
                    tmpArr = [];
                    lnArr = $scope.dataTipsData.deep.ln;
                    $scope.dataTipsData.isVariableDirectionLane = true;

                    for (i = 0; i < lnArr.length; i++) {
                        tmpArr.push(lnArr[i].var);
                        $scope.dataTipsData['varDirTime' + i] = {};
                        for (j = 0; j < lnArr[i].o_array.length; j++) {
                            $scope.dataTipsData['varDirTime' + i][j] = formatTime(lnArr[i].o_array[j].time);
                        }
                    }

                    $scope.dataTipsData.varRoad = tmpArr.join(',');
                    break;
                case '1401': // 方向看板
                    /* 进入*/
                    $scope.sceneEnty = $scope.dataTipsData.deep.in;
                    /* 退出*/
                    $scope.sceneOut = $scope.dataTipsData.deep.o_array;
                    break;
                case '1402': // real sign
                    /* 进入*/
                    $scope.sceneEnty = $scope.dataTipsData.deep.in.id;
                    /* 退出*/
                    $scope.sceneOut = $scope.dataTipsData.deep.o_array;
                    break;
                case '1403': // 3D
                    /* 进入*/
                    $scope.sceneEnty = $scope.dataTipsData.deep.in;
                    /* 退出*/
                    $scope.sceneOut = $scope.dataTipsData.deep.o_array;
                    /* 模式图号*/
                    $scope.dataTipsData.schemaNo = $scope.dataTipsData.deep.ptn;
                    break;
                case '1404': // 提左提右
                    /* 进入*/
                    $scope.sceneEnty = $scope.dataTipsData.deep.in;
                    /* 退出*/
                    $scope.sceneOut = $scope.dataTipsData.deep.o_array;
                    /* 模式图*/
                    $scope.dataTipsData.leftAndRightSchemaNo = $scope.dataTipsData.deep.ptn;
                    $scope.dataTipsData.leftAndRight = true;
                    break;
                case '1405': // 一般道路方面
                    /* 进入*/
                    $scope.sceneEnty = $scope.dataTipsData.deep.in;
                    /* 退出数组*/
                    $scope.sceneOut = $scope.dataTipsData.deep.o_array;
                    $scope.dataTipsData.isGeneralRoad = true;
                    break;
                case '1406': // 实景图
                    /* 进入*/
                    $scope.sceneEnty = $scope.dataTipsData.deep.in.id;
                    /* 实景图代码*/
                    $scope.dataTipsData.JVCSchemaNo = $scope.dataTipsData.deep.ptn;
                    /* 实景图类型*/
                    if ($scope.dataTipsData.deep.tp == 1) {
                        $scope.schemaType = '普通路口';
                    } else if ($scope.dataTipsData.deep.tp == 3) {
                        $scope.schemaType = '高速入口';
                    } else {
                        $scope.schemaType = '高速出口';
                    }
                    $scope.dataTipsData.realImgArray = [];
                    for (i = 0; i < $scope.dataTipsData.deep.o_array.length; i++) {
                        $scope.dataTipsData.realImgArray.push($scope.dataTipsData.deep.o_array[i].out);
                    }
                    break;
                case '1407': // 高速分歧
                    /* 进入*/
                    $scope.sceneEnty = $scope.dataTipsData.deep.in.id;
                    /* 模式图号*/
                    $scope.dataTipsData.schemaNo = $scope.dataTipsData.deep.ptn;
                    /* 出口编号*/
                    /* $scope.sceneExit = [];
                    $.each($scope.dataTipsData.o_array, function(i, v) {
                        if (v.out) {
                            $scope.sceneExit.push(v.out.id);
                        }
                    });*/
                    $scope.dataTipsData.isBranch = true;
                    break;
                case '1409': // 普通路口模式图
                    /* 进入*/
                    $scope.sceneEnty = $scope.dataTipsData.deep.in.id;
                    /* 退出*/
                    $scope.bottomPicture = $scope.dataTipsData.deep.ptn;
                    break;
                case '1501': // 上下线分离
                    $scope.upperAndLowerArrayLink = $scope.dataTipsData.deep.f_array;
                    break;
                case '1502': // 路面覆盖
                    $scope.roadArrayLink = $scope.dataTipsData.deep.f_array;
                    break;
                case '1510': // 桥
                    $scope.brigeArrayLink = $scope.dataTipsData.deep.f_array;
                    break;
                case '1514': // 施工
                case '1515': // 维修
                    $scope.constructionArrayLink = $scope.dataTipsData.deep.f_array;
                    if ($scope.dataTipsData.deep.time) {
                        if ($scope.dataTipsData.deep.time.endsWith(';')) {
                            $scope.dataTipsData.deep.time = $scope.dataTipsData.deep.time.substring(0, $scope.dataTipsData.deep.time.length - 1);
                            $scope.timeDomain = $scope.dataTipsData.deep.time.split(';');
                        } else {
                            $scope.timeDomain = $scope.dataTipsData.deep.time.split(';');
                        }
                    } else {
                        $scope.timeDomain = [];
                    }
                    break;
                case '1517': // Usage Fee Required
                    $scope.dataTipsData.usageEliminateCarObj = [{
                        id: 1,
                        label: '客车',
                        checked: false
                    }, {
                        id: 2,
                        label: '配送卡车',
                        checked: false
                    }, {
                        id: 3,
                        label: '运输卡车',
                        checked: false
                    }, {
                        id: 5,
                        label: '出租车',
                        checked: false
                    }, {
                        id: 6,
                        label: '公交车',
                        checked: false
                    }];
                    for (i = 0; i < $scope.dataTipsData.usageEliminateCarObj.length; i++) {
                        for (j = 0; j < $scope.dataTipsData.deep.vt.length; j++) {
                            if ($scope.dataTipsData.usageEliminateCarObj[i].id == $scope.dataTipsData.deep.vt[j]) {
                                $scope.dataTipsData.usageEliminateCarObj[i].checked = true;
                            }
                        }
                    }
                    $scope.dataTipsData.isUsageFeeRequired = true;
                    break;
                case '1604': // 区域内道路
                    $scope.fData = $scope.dataTipsData.deep.f_array;
                    $scope.dataTipsData.commandData = commandObj[$scope.dataTipsData.track.t_command];
                    break;
                case '1703': // 分叉口提示
                    $scope.sceneEnty = $scope.dataTipsData.deep.in;
                    $scope.roadCrossOut = $scope.dataTipsData.deep.o_array;
                    $scope.dataTipsData.roadCrossProm = true;
                    break;
                case '1704': // 交叉路口
                    $scope.fData = $scope.dataTipsData;
                    $scope.dataTipsData.isCrossRoad = true;
                    break;
                case '1707': // 里程桩
                    $scope.dataTipsData.isMileage = true;
                    break;
                case '1116': // 立交
                    $scope.dataTipsData.GSC = true;
                    break;
                case '1803': // 挂接
                    if ($scope.dataTipsData.deep.pcd) { // 有图片时，显示图片
                        $scope.pcd = '../../images/road/hook/' + $scope.dataTipsData.deep.pcd.substr(5, 4) + '.svg';
                        // $scope.pcd="./css/hook/2081.svg";
                    } else { // 无图片时获取经纬度，高亮
                        $scope.garray = $scope.dataTipsData.g_array;
                        // if ($scope.garray.geo.type == 'Point') {
                        //
                        // } else if ($scope.garray.geo.type == 'Line') {
                        //
                        // };
                    }
                    break;
                case '1901': // 道路名
                    $scope.nArrayData = $scope.dataTipsData.deep.n_array;
                    break;
                case '2001': // 测线
                    $scope.returnLineType = function (code) {
                        switch (code) {
                            case 0:
                                return '作业中';
                            case 1:
                                return '1-高速道路';
                            case 2:
                                return '2-城市高速';
                            case 3:
                                return '3-国道';
                            case 4:
                                return '4-省道';
                            case 5:
                                return '5-预留';
                            case 6:
                                return '6-县道';
                            case 7:
                                return '7-乡镇村道路';
                            case 8:
                                return '8-其他道路';
                            case 9:
                                return '9-非引导道路';
                            case 10:
                                return '10-步行道路';
                            case 11:
                                return '11-人渡';
                            case 13:
                                return '13-轮渡';
                            case 15:
                                return '15-10级路（障碍物）';
                            default:
                                return '';
                        }
                    };
                    /* 测线来源*/
                    $scope.returnLineSrc = function (code) {
                        switch (code) {
                            case 0:
                                return 'GPS测线';
                            case 1:
                                return '惯导测线';
                            case 2:
                                return '自绘测线';
                            case 3:
                                return '影像矢量测线';
                            case 4:
                                return '情报';
                            default:
                                return '';
                        }
                    };
                    if ($scope.dataTipsData) {
                        /* 种别*/
                        $scope.dataTipsData.lineType = $scope.returnLineType($scope.dataTipsData.deep.kind);
                        /* 来源*/
                        $scope.dataTipsData.lineSrc = $scope.returnLineSrc($scope.dataTipsData.deep.src);
                        /* 车道数*/
                        $scope.dataTipsData.carNumber = $scope.dataTipsData.deep.ln;
                        /* 长度*/
                        $scope.dataTipsData.lineLength = $scope.dataTipsData.deep.len;
                    }
                    $scope.dataTipsData.isMeasuringLine = true;
                    break;
                case '8001': // fcc 预处理
                    break;
                case '1108': // 减速带
                    $scope.dataTipsData.roadDir = true;
                    break;
                case '1310': // 公交车道
                    $scope.dataTipsData.isBusRoad = true;
                    lnArr = $scope.dataTipsData.deep.ln;
                    tmpArr = [];

                    for (i = 0; i < lnArr.length; i++) {
                        tmpArr.push(lnArr[i].bus);
                        $scope.dataTipsData['busTime' + i] = formatTime(lnArr[i].time);
                    }

                    $scope.dataTipsData.busRoad = tmpArr.join(',');
                    break;
                case '2201': // 过街天桥
                    var pArr = $scope.dataTipsData.deep.p_array;
                    var access = [];
                    tmpArr = [];
                    var accessData = {
                        0: '其它',
                        1: '默认为0',
                        2: '直梯',
                        3: '扶梯',
                        4: '阶梯',
                        5: '斜坡'
                    };

                    for (i = 0; i < pArr.length; i++) {
                        access[i] = [];
                        tmpArr = pArr[i].access.split('');

                        if (tmpArr.indexOf('1') < 0) {
                            access[i] = ['未调查'];
                            continue;
                        }

                        for (j = 0; j < tmpArr.length; j++) {
                            if (tmpArr[j] === '1') {
                                access[i].push(accessData[j]);
                            }
                        }
                    }

                    for (i = 0; i < access.length; i++) {
                        access[i] = access[i].join('; ');
                    }

                    $scope.dataTipsData.accessType = access;
                    break;
                case '1708': // ADAS打点
                    $scope.dataTipsData.adasNode = true;
                    break;
                case '2002': // ADAS测线
                    $scope.dataTipsData.adasLink = true;
                    break;
                case '1211': // 高速连接路
                    $scope.roadCameraType = $scope.dataTipsData.deep.tp === 1 ? 'IC' : 'JCT';
                    break;
                case '1117': // 车道限宽限高
                    if ($scope.dataTipsData.deep.ht.length) {
                        $scope.ht = $scope.dataTipsData.deep.ht.join('m,') + 'm';
                    } else {
                        $scope.ht = '';
                    }

                    if ($scope.dataTipsData.deep.wd.length) {
                        $scope.wd = $scope.dataTipsData.deep.wd.join('m,') + 'm';
                    } else {
                        $scope.wd = '';
                    }
                    break;
                default:
                    break;
            }
            /* 时间段*/
            if ($scope.dataTipsData.code !== '1806' && $scope.dataTipsData.deep.time && !$scope.dataTipsData.adasLink) {
                if ($scope.dataTipsData.deep.time.endsWith(';')) {
                    $scope.dataTipsData.deep.time = $scope.dataTipsData.deep.time.substring(0, $scope.dataTipsData.deep.time.length - 1);
                    $scope.timeDomain = $scope.dataTipsData.deep.time.split(';');
                } else {
                    $scope.timeDomain = $scope.dataTipsData.deep.time.split(';');
                }
            } else {
                $scope.timeDomain = [];
            }
            var dir = {
                0: '不应用',
                2: '顺方向',
                3: '逆方向'
            };
            var sourceCodeObj = {
                1: '情报',
                2: '外业现场',
                3: '代理店',
                4: '监察',
                5: '常规',
                6: '人行过道',
                7: '多源',
                8: '众包',
                11: '成果数据mark',
                13: '数据挖掘',
                14: '预处理',
                15: '内业'
            };
            $scope.sourceCode = sourceCodeObj[$scope.dataTipsData.source.s_sourceCode];

            if ($scope.dataTipsData.code !== '1806') {
                $scope.rdDir = dir[$scope.dataTipsData.deep.rdDir];
            }
            
            /**
             * 图片、语音、备注
             */
            var fArray = $scope.dataTipsData.feedback.f_array;
            $scope.tipsPhotos = [];
            var content;
            for (i = 0; i < fArray.length; i++) {
                if (fArray[i].type === 1) { //   照片
                    var imgId = 0;
                    var imgData = {
                        type: 0, // type 0代表服务返回的数据，1代表照片不足时本地添加的数据
                        content: fArray[i].content,
                        src: App.Config.serviceUrl + '/fcc/photo/getSnapshotByRowkey?access_token=' + App.Temp.accessToken + '&parameter={"rowkey":"' + fArray[i].content + '",type:"thumbnail"}',
                        id: imgId
                    };
                    $scope.photos.push(imgData);
                    imgId++;
                } else if (fArray[i].type === 2) { //    语音
                    var audioId = 0;
                    var audioData = {
                        flag: true,
                        id: audioId,
                        src: App.Config.serviceUrl + '/fcc/audio/getSnapshotByRowkey?access_token=' + App.Temp.accessToken + '&parameter={"rowkey":"' + fArray[i].content + '"}',
                        content: fArray[i].content
                    };
                    $scope.audios.push(audioData);
                    audioId++;
                } else if (fArray[i].type === 3) { //    文字
                    $scope.remarksContent = fArray[i].content;
                }
            }

            //  没有 photo 和 audio 不显示
            $scope.dataTipsData.showPhoto = $scope.photos.length > 0;
            $scope.dataTipsData.showAudio = $scope.audios.length > 0;

            /**
             * 图片数量为5个，没有那么多图片是用no_photo 代替
             * @type {Number}
             */
            if ($scope.photos.length < 5) {
                for (var a = $scope.photos.length; a < 5; a++) {
                    var img = {
                        type: 1,
                        src: '../../images/newRoad/leftPanelIcon/no_photo.png',
                        id: a
                    };
                    $scope.photos.push(img);
                }
            }
            if ($scope.audios.length < 5) {
                for (var b = $scope.audios.length; b < 5; b++) {
                    var audio = {
                        flag: false,
                        id: b
                    };
                    $scope.audios.push(audio);
                }
            }
            var tipInitImage = document.getElementById('roadTipsPhoto');
            // 大图片初始化显示
            if ($scope.photos[0].type === 0) {
                $scope.bigImgSrc = App.Config.serviceUrl + '/fcc/photo/getSnapshotByRowkey?access_token=' + App.Temp.accessToken + '&parameter={"rowkey":"' + $scope.photos[0].content + '",type:"origin"}';
                // 如果连续打开同一个tip，wheelzoom不初始化
                if (tipInfo.rowkey != data.data.rowkey) {
                    tipInitImage.dispatchEvent(new CustomEvent('wheelzoom.destroy'));
                    wheelzoom(tipInitImage);
                    tipInfo = data.data;
                    $scope.activeImg = 0;
                }
            } else {
                $scope.bigImgSrc = '../../images/newRoad/leftPanelIcon/no_photo.png';
            }
            $scope.imgSrcList = $scope.photos.slice(0, 5);
            $scope.audioSrcList = $scope.audios.slice(0, 5);
            if ($scope.isQuality) {
                queryQualityData();
                $scope.$emit('getTipDataEvent', $scope.dataTipsData);
            }
        };

        // 切换大图片
        $scope.changeBigImg = function (data, index) {
            if (data.type === 0) {
                if ($scope.activeImg == index) {
                    return;
                }
                $scope.bigImgSrc = App.Config.serviceUrl + '/fcc/photo/getSnapshotByRowkey?access_token=' + App.Temp.accessToken + '&parameter={"rowkey":"' + data.content + '",type:"origin"}';
                var tipImage = document.getElementById('roadTipsPhoto');
                tipImage.dispatchEvent(new CustomEvent('wheelzoom.destroy'));
                wheelzoom(tipImage);
            } else {
                $scope.bigImgSrc = '../../images/newRoad/leftPanelIcon/no_photo.png';
            }
            $scope.activeImg = index;
        };
        // 旋转
        $scope.rotateBigImg = function (flag) {
            var imgSrc = $scope.photos[$scope.activeImg].content;
            if (imgSrc) {
                var param = {
                    fccPid: imgSrc,
                    flag: flag
                };
                $scope.showProgress = true;
                dsFcc.rotatePhoto(param).then(function (data) {
                    $scope.showProgress = false;
                    if (data && data.data) {
                        if (data.data.message === '旋转成功') {
                            var timestamp = new Date().getTime();
                            var originUrl = $scope.photos[$scope.activeImg].content.split('&_time=')[0];
                            var thumbUrl = $scope.imgSrcList[$scope.activeImg].content.split('&_time=')[0];
                            // $scope.photos[$scope.activeImg].content = App.Config.serviceUrl + '/fcc/photo/getSnapshotByRowkey?access_token=' + App.Temp.accessToken + '&parameter={"rowkey":"' + imgSrc + '",type:"origin"}&_time="' + timestamp + '"';
                            $scope.photos[$scope.activeImg].src = App.Config.serviceUrl + '/fcc/photo/getSnapshotByRowkey?access_token=' + App.Temp.accessToken + '&parameter={"rowkey":"' + originUrl + '",type:"origin"}&_time="' + timestamp + '"';
                            $scope.bigImgSrc = $scope.photos[$scope.activeImg].src;
                            $scope.imgSrcList[$scope.activeImg].src = App.Config.serviceUrl + '/fcc/photo/getSnapshotByRowkey?access_token=' + App.Temp.accessToken + '&parameter={"rowkey":"' + thumbUrl + '",type:"origin"}&_time="' + timestamp + '"';
                        }
                    }
                });
            }
        };
        // 上一个缩略图
        $scope.lastImg = function () {
            if ($scope.imgSrcList[0].id > 0) {
                $scope.imgSrcList.unshift($scope.photos[$scope.imgSrcList[0].id - 1]);
                $scope.imgSrcList.pop();
            }
        };
        // 下一个缩略图
        $scope.nextImg = function () {
            if ($scope.imgSrcList[4].id < $scope.photos.length - 1) {
                $scope.imgSrcList.push($scope.photos[$scope.imgSrcList[4].id + 1]);
                $scope.imgSrcList.shift();
            }
        };
        // 切换音频
        $scope.changeAudio = function (data) {
            if (data.flag) {
                var myAudio = document.getElementById('myAudio');
                myAudio.src = data.src;
                myAudio.play();
            }
        };
        // 上一个音频
        $scope.lastAudio = function () {
            if ($scope.audioSrcList[0].id > 0) {
                $scope.audioSrcList.unshift($scope.audios[$scope.audioSrcList[0].id - 1]);
                $scope.audioSrcList.pop();
            }
        };
        // 下一个音频
        $scope.nextAudio = function () {
            if ($scope.audioSrcList[4].id < $scope.audios.length - 1) {
                $scope.audioSrcList.push($scope.audios[$scope.audioSrcList[4].id + 1]);
                $scope.audioSrcList.shift();
            }
        };
        // 打开图片大图页面
        $scope.openOriginPic = function (id) {
            var openOriginObj = {
                loadType: 'tipsPitureContainer',
                propertyCtrl: 'scripts/components/road/ctrls/attr_tips_ctrl/tipsPictureCtrl',
                propertyHtml: '../../../scripts/components/road/tpls/attr_tips_tpl/tipsPictureTpl.html'
            };
            $scope.$emit('transitCtrlAndTpl', openOriginObj);
        };
        $scope.noPic = function () {
            swal('没有照片资料', '', '');
        };
        $scope.openAudio = function (id) {
            var openVideoObj = {
                loadType: 'tipsVideoContainer',
                propertyCtrl: 'components/road/ctrls/attr_tips_ctrl/tipsVideoCtrl',
                propertyHtml: '../../scripts/components/road/tpls/attr_tips_tpl/tipsVideoTpl.html'
            };
            $scope.$emit('transitCtrlAndTpl', openVideoObj);
        };
        $scope.noAudio = function () {
            swal('没有音频资料', '', 'info');
        };

        var updateTipStatus = function (rowkey, featurePid, editStatus, editMeth) {
            var stageLen = $scope.dataTipsData.track.t_trackInfo.length;
            var stage = parseInt($scope.dataTipsData.track.t_trackInfo[stageLen - 1].stage, 10);
            if (stage === 2) {
                // swal('已经录入过，不允许再次录入！');
                return;
            }

            var stageParam = {
                mdFlag: App.Temp.mdFlag,
                handler: App.Temp.userId,
                rowkey: rowkey,
                pid: featurePid,
                editStatus: editStatus,
                editMeth: editMeth
            };

            dsFcc.changeDataTipsState(JSON.stringify(stageParam)).then(function (data) {
                if (data) {
                    $scope.disabledFlag = true;
                    // 刷新tips图层
                    sceneCtrl.redrawLayerByGeoLiveTypes([$scope.dataTipsData.geoLiveType]);
                    $scope.showContent = '外业新增';
                    $scope.dataTipsData.track.t_trackInfo[$scope.dataTipsData.track.t_trackInfo.length - 1].stage = 2;
                    $scope.$emit('reloadTipsStatus');
                }
            });
        };

        var createRestrictByTips = function () {
            var info = null;
            dsEdit.getByPid($scope.dataTipsData.deep.in.id, 'RDLINK').then(function (data) {
                var restrictObj = {};
                restrictObj.inLinkPid = parseInt($scope.dataTipsData.deep.in.id, 10);
                var dataTipsGeo = $scope.dataTipsData.geometry.g_location.coordinates;
                var outLinkPids = [];
                for (var outNum = 0, outLen = $scope.dataTipsData.deep.o_array.length; outNum < outLen; outNum++) {
                    var outLinks = $scope.dataTipsData.deep.o_array[outNum].out;
                    if (!outLinks) {
                        swal('没有退出线，请手动建立交限', null, 'info');
                        return;
                    }
                    for (var outLinksN = 0, outLinksL = outLinks.length; outLinksN < outLinksL; outLinksN++) {
                        outLinkPids.push(parseInt(outLinks[outLinksN].id, 10));
                    }
                }
                restrictObj.outLinkPids = outLinkPids;
                var inLinkGeo = data.geometry.coordinates;
                var inNode;
                if (data.direct === 1) {
                    var dataTipsToStart = Math.abs(dataTipsGeo[0] - inLinkGeo[0][0]) + Math.abs(dataTipsGeo[1] - inLinkGeo[0][1]);
                    var dataTipsToEnd = Math.abs(dataTipsGeo[0] - inLinkGeo[inLinkGeo.length - 1][0]) + Math.abs(dataTipsGeo[1] - inLinkGeo[inLinkGeo.length - 1][1]);
                    if (dataTipsToStart - dataTipsToEnd) {
                        inNode = parseInt(data.eNodePid, 10);
                    } else {
                        inNode = parseInt(data.sNodePid, 10);
                    }
                } else if (data.direct === 2) {
                    inNode = parseInt(data.eNodePid, 10);
                } else if (data.direct === 3) {
                    inNode = parseInt(data.sNodePid, 10);
                }
                restrictObj.nodePid = inNode;
                dsEdit.create('RDRESTRICTION', restrictObj).then(function (rt) {
                    if (rt) {
                        updateTipStatus($scope.rowkey, data.pid, 2, 2);

                        var ft = new FM.dataApi.Feature({
                            pid: rt.pid,
                            geoLiveType: 'RDRESTRICTION'
                        });
                        $scope.$emit('ObjectUpdated', {
                            feature: ft,
                            updateLogs: rt.log
                        });
                    }
                });
            });
        };

        /* 转换*/
        $scope.$on('doKeyEntry', function () {
            $scope.transBridge();
        });

        var getRoadWidth = function (laneNum) {
            var width;
            if (laneNum == 1) {
                width = 30;
            } else if (laneNum >= 2 && laneNum <= 3) {
                width = 55;
            } else {
                width = 130;
            }

            return width;
        };

        var getLaneClass = function (laneNum) {
            var laneClass;
            if (laneNum == 0) {
                laneClass = 0;
            } else if (laneNum == 1) {
                laneClass = 1;
            } else if (laneNum >= 2 && laneNum <= 3) {
                laneClass = 2;
            } else {
                laneClass = 3;
            }

            return laneClass;
        };

        var testTransForm = function () {
            var track = $scope.dataTipsData.track;
            var stage = parseInt(track.t_trackInfo[track.t_trackInfo.length - 1].stage, 10);
            var f = true;

            if (App.Temp.mdFlag === 'd' && stage === 2 && track.t_dEditStatus === 2) {
                f = false;
            } else if (App.Temp.mdFlag === 'm' && stage === 3 && track.t_mEditStatus === 2) {
                f = false;
            }
            return f;
        };

        $scope.transBridge = function () {
            if (!testTransForm()) {
                swal('操作提示', '数据已经转换过，不需要再次转换！', 'info');
                return;
            }

            if ($scope.dataTipsData.code === '2001') { // 测线
                // 修改测线的数据格式
                var laneNum = $scope.dataTipsData.deep.ln;
                var paramOfLink = {
                    eNodePid: 0,
                    sNodePid: 0,
                    kind: $scope.dataTipsData.deep.kind,
                    laneNum: laneNum,
                    geometry: {
                        type: 'LineString',
                        coordinates: $scope.dataTipsData.geometry.g_location.coordinates
                    },
                    catchLinks: []
                };

                // add by chenx on 2017-6-6, 增加车道等级和幅宽的关联维护
                if (laneNum > 0) {
                    paramOfLink.laneClass = getLaneClass(Math.ceil(laneNum / 2));
                    paramOfLink.width = getRoadWidth(laneNum);
                }

                dsEdit.create('RDLINK', paramOfLink).then(function (data) {
                    if (data) {
                        updateTipStatus($scope.rowkey, data.pid, 2, 2);

                        var ft = new FM.dataApi.Feature({
                            pid: data.pid,
                            geoLiveType: 'RDLINK'
                        });
                        $scope.$emit('ObjectUpdated', {
                            feature: ft,
                            updateLogs: data.log
                        });
                    }
                });
            } else if ($scope.dataTipsData.code === '1201') { // 道路种别
                var oPid = parseInt($scope.dataTipsData.deep.f.id, 10);
                dsEdit.getByPid(oPid, 'RDLINK').then(function (rest) {
                    var feature = FM.dataApi.Feature.create(rest);
                    feature.changeKind($scope.dataTipsData.deep.kind, feature.kind);
                    var changed = feature.getChanges();
                    dsEdit.update(oPid, 'RDLINK', changed).then(function (data) {
                        updateTipStatus($scope.rowkey, oPid, 2, 2);

                        var ft = new FM.dataApi.Feature({
                            pid: oPid,
                            geoLiveType: 'RDLINK'
                        });
                        $scope.$emit('ObjectUpdated', {
                            feature: ft,
                            updateLogs: data.log
                        });
                    });
                });
            } else if ($scope.dataTipsData.code === '1302') {
                createRestrictByTips();
            }
        };

        // 切换作业状态
        $scope.dStatusChange = function (data) {
            if (data.Status === '2') { // 作业状态：2有问题待确认
                data.t_dInProc = 1;
                data.t_dStatus = 0;
            } else {
                data.t_dInProc = 0;
                data.t_dStatus = parseInt(data.Status, 10);
            }
        };

        // 删除质检问题记录
        $scope.deleteQuaRecord = function () {
            // $scope.$emit('deleteQualityData', true);
            dsFcc.deleteWrong($scope.wrongData.logId).then(function (res) {
                swal('删除成功!', '', '');
                $scope.wrongData = null;
                // $scope.$emit('saveTipQualityData');
                $scope.$emit('switchQualityModal', {
                    flag: false,
                    close: true
                });
            });
        };

        $scope.$on('ReloadData', initialize);
        $scope.$on('$destroy', function () {
            flashHighlightCtrl.clearFeedback();
        });
    }
]);
