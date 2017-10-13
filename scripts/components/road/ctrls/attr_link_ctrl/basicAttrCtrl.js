/**
 * Created by linglong on 2015/12/23.
 */
angular.module('app').controller('basicAttrCtrl', function ($scope) {
    /* ************************************************ 基础属性 ******************************************************/
    // 道路种别;
    $scope.kindOptions = [
        {
            id: 1,
            label: '1 高速道路'
        },
        {
            id: 2,
            label: '2 城市高速'
        },
        {
            id: 3,
            label: '3 国道'
        },
        {
            id: 4,
            label: '4 省道'
        },
        {
            id: 6,
            label: '6 县道'
        },
        {
            id: 7,
            label: '7 乡镇村道路'
        },
        {
            id: 8,
            label: '8 其它道路'
        },
        {
            id: 9,
            label: '9 非引导道路'
        },
        {
            id: 10,
            label: '10 步行道路'
        },
        {
            id: 11,
            label: '11 人渡'
        },
        {
            id: 13,
            label: '13 轮渡'
        }
    ];
    // 车道等级;
    $scope.laneClassOptions = [
        {
            id: 1,
            label: '1: 一条车道'
        },
        {
            id: 2,
            label: '2: 2或3条'
        },
        {
            id: 3,
            label: '3: 4条及以上'
        }
    ];
    // IMI代码;
    $scope.imiCodeOptions = [
        {
            id: 0,
            label: '0: 其他道路'
        },
        {
            id: 1,
            label: '1: 交叉点内部道路'
        },
        {
            id: 2,
            label: '2: 转弯道'
        },
        {
            id: 3,
            label: '3: 无法描述的'
        }
    ];
    // 功能等级;
    $scope.functionClassOptions = [
        {
            id: 1,
            label: '1: 等级1'
        },
        {
            id: 2,
            label: '2: 等级2'
        },
        {
            id: 3,
            label: '3: 等级3'
        },
        {
            id: 4,
            label: '4: 等级4'
        },
        {
            id: 5,
            label: '5: 等级5'
        }
    ];
    // 道路形态;
    $scope.fromOfWayOption = {
        0: '未调查',
        1: '无属性',
        2: '其他',
        10: 'IC',
        11: 'JCT',
        12: 'SA',
        13: 'PA',
        14: '全封闭道路',
        15: '匝道',
        16: '跨线天桥(Overpass)',
        17: '跨线地道(Underpass)',
        18: '私道',
        20: '步行街',
        21: '过街天桥',
        22: '公交专用道',
        23: '自行车道',
        24: '跨线立交桥',
        30: '桥',
        31: '隧道',
        32: '立交桥',
        33: '环岛',
        34: '辅路',
        35: '调头口(U-Turn)',
        36: 'POI连接路',
        37: '提右',
        38: '提左',
        39: '主辅路出入口',
        43: '窄道路',
        48: '主路',
        49: '侧道',
        50: '交叉点内道路',
        51: '未定义交通区域(UTA)',
        52: '区域内道路',
        53: '停车场出入口连接路',
        54: '停车场出入口虚拟连接路',
        57: 'Highway对象外JCT',
        60: '风景路线',
        80: '停车位引导道路(Parking Lane)',
        81: '虚拟调头口',
        82: '虚拟提左提右'
    };
    // 辅助标志;
    $scope.auxiFlagoption = {
        0: '添加辅助标志',
        55: '服务区内道路',
        56: '环岛IC链接路',
        58: '补助道路',
        70: 'JCT道路名删除',
        71: '线假立交',
        72: '功能面关联道路',
        73: '环岛直连MD',
        76: '7级降8级标志',
        77: '交叉点间Link'
    };
    /* ************************************************ 附加属性 ******************************************************/
    // 收费信息;
    $scope.toolinfoOption = [
        {
            id: 0,
            label: '未调查'
        },
        {
            id: 1,
            label: '收费'
        },
        {
            id: 2,
            label: '免费'
        },
        {
            id: 3,
            label: '收费道路的免费区间'
        }
    ];
    // 数据来源;
    $scope.srcFlagOption = [
        { id: 1, label: '施工图' },
        { id: 2, label: '高精度测量' },
        { id: 3, label: '卫星影像' },
        { id: 4, label: '惯导测量' },
        { id: 5, label: '基础数据' },
        { id: 6, label: 'GPS测量' }
    ];
    // 精度级别
    $scope.digitalLevelOption = [
        { id: 0, label: '无' },
        { id: 1, label: '±0~5米' },
        { id: 2, label: '±5~10米' },
        { id: 3, label: '±10~15米' },
        { id: 4, label: '±15~20米' }
    ];
    /* ************************************************ Zone属性 ******************************************************/
    // Zone类型
    $scope.typeoption = [
        {
            id: 0,
            label: '未分类'
        },
        {
            id: 1,
            label: 'AOIZone'
        },
        {
            id: 2,
            label: 'KDZone'
        },
        {
            id: 3,
            label: 'GCZone'
        }
    ];

    function getFormNameById(param) {
        var name = '';
        angular.forEach($scope.fromOfWayOption, function (data) {
            if (data.id == param) {
                name = data.label;
            }
        });
        return name;
    }

    function getFormNameByType(param) {
        var name = '';
        angular.forEach($scope.auxiFlagoption, function (data) {
            if (data.id == param) {
                name = data.label;
            }
        });
        return name;
    }
    
    // 当对link形态类型选择时更新当前操作对象的索引;
    $scope.rememberLinkFormIndex = function (index, item) {
        $scope.currentFormType = item;
    };

    // 对link形态类型的事件监听;
    $scope.$on('formTypeSelect', function (event, data) {
        // 更新当前对象的forms的类型属性;
        $scope.currentFormType.auxiFlag = data.id;
    });

    // 总车道数修改对车道等级的维护；
    $scope.changeTotalLane = function () {
        $scope.linkData.changeLaneNum();
    };

    // 左右车道数修改对车道等级的维护；
    $scope.changeLeftOrRightLane = function () {
        $scope.linkData.changeLeftOrRightLaneNum();
    };

    // link种类变换的关联维护;
    $scope.changeKind = function (newVal, oldVal) {
        // 在模型里设置方法处理种别 变化的关联维护;
        $scope.linkData.changeKind(newVal, oldVal);
    };

    // 修改城市属性对限速值的维护
    $scope.changeUrban = function () {
        $scope.linkData._limitSpeed();
    };

    // 计费标准输入控制
    $scope.verifyfeeStd = function (newValue, oldValue) {
        var codeRange = [46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57];
        if (newValue) {
            if (new RegExp(/^(\d{1,3}|\d{1,3}\.\d{0,2})$/).test(newValue)) {
                var lastCode = newValue.charCodeAt(newValue.length - 1);
                // 开始输入不合法的情况：
                // 输入不为数字或.
                // 第一个字符为.
                // 0之前还有0
                // 连续输入两个.
                var notANumber = (codeRange.indexOf(lastCode) == -1);
                var isDotFirst = (lastCode == 46 && lastCode == newValue[0].charCodeAt(0));
                var isDoubleZeroFront = /^00/.test(newValue);
                var doubleDot = /\.\d*\./.test(newValue);
                var length = newValue.length;
                if (notANumber || isDotFirst || isDoubleZeroFront || doubleDot) {
                    $scope.linkData.feeStd = parseFloat(oldValue);
                    return;
                }
                // 开始输入合法的情况
                // 存在小数，最长不能超过6位，不存在小数，最长为5位
                var isFloatNumer = /\./.test(newValue);
                if (isFloatNumer) {
                    // 小数点不能超过2位
                    // length不能大于6
                    if (length > 6 || /\.\d{3,}/.test(newValue) || (length == 6 && newValue.charCodeAt(newValue.length - 1) == 46)) {
                        $scope.linkData.feeStd = parseFloat(oldValue);
                    }
                } else {
                    $scope.linkData.feeStd = length > 5 ? parseFloat(oldValue) : newValue;
                }
            } else {
                $scope.linkData.feeStd = parseFloat(oldValue);
            }
        } else {
            $scope.linkData.feeStd = 0;
        }
    };
});

