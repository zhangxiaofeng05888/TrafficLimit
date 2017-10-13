/**
 * Created by wangmingdong on 2017/5/31.
 */
angular.module('app').controller('enterErrorCtrl', ['$scope', 'dsFcc', '$ocLazyLoad', '$http',
    function ($scope, dsFcc, $ocLazyLoad, $http) {
        var initPage = function () {
            if (!$scope.quaData) {
                $http.get('../../scripts/components/road/ctrls/attr_tips_ctrl/errorTipsConfig.json').then(function (data) {
                    $scope.quaData = {};
                    $scope.quaData.reason = $scope.errorReasons[0];
                    $scope.quaData.quRank = $scope.errorLevels[3];
                    $scope.quaData.erContent = data.data[$scope.tipData.source.s_sourceType];
                    $scope.quaData.isPrefer = 0;
                });
            }
        };

        // 等级
        $scope.errorLevels = [
            'S',
            'A',
            'B',
            'C'
        ];

        // 错误原因
        $scope.errorReasons = [
            '录入错误',
            '录入遗漏'
        ];

        // 错误内容
        $scope.errorContents = [
            {
                name: '道路信息',
                group: [
                    '道路挂接',
                    '道路形状',
                    '道路种别',
                    '车道数',
                    '道路方向',
                    '道路名称',
                    '供用信息',
                    '收费信息',
                    '路径采纳',
                    '上下线分离',
                    '开发状态',
                    'IMI代码',
                    '功能等级（FC）',
                    '车道等级',
                    'DICI城市类型',
                    '行人步行属性',
                    '中央隔离带',
                    '占道停车场',
                    '高架',
                    '路灯设施',
                    '城市内道路属性',
                    '特殊交通',
                    '铺设状态',
                    '行政区划',
                    '停车设施',
                    'ADAS',
                    '分层（Z-Level）',
                    '立交桥名称',
                    '禁止穿行',
                    '维修',
                    '单行限制',
                    '车辆限制',
                    '穿行限制',
                    '施工中不开放',
                    '季节性关闭道路',
                    'Usage fee required',
                    '超车限制',
                    '警示信息',
                    '铁路信息',
                    '铁路立交',
                    '普通限速信息',
                    '条件限速信息',
                    '线限速',
                    '限速等级',
                    '同一点',
                    '同一线',
                    '航线',
                    '窄道',
                    '减速带',
                    '图幅接边',
                    '卡车专用限制信息',
                    '卡车地图',
                    'INT_RTIC',
                    'RTIC',
                    'ZONE',
                    'TMC',
                    '车道限速信息',
                    'CLM信息',
                    '潮汐车道',
                    '收费站前点限速',
                    '高速HW信息',
                    'NBT信息',
                    '商业运营车辆',
                    '限制（特殊交通限制、未定义、交通区域）',
                    'Controlled Access',
                    '其他'
                ]
            },
            {
                name: 'CRF信息',
                group: [
                    'CRF Intersection',
                    'CRF Road',
                    'CRF Object'
                ]
            },
            {
                name: '行人导航',
                group: [
                    '人行便道信息',
                    '人行过道信息',
                    '阶梯信息',
                    '虚拟连接',
                    '人渡'
                ]
            },
            {
                name: '路口信息',
                group: [
                    '路口登记',
                    '路口名称',
                    '红绿灯',
                    '电子眼',
                    '车信',
                    '顺行',
                    '大门',
                    '交限',
                    '路口限制',
                    '货车交限',
                    '分叉提示',
                    '路口语音引导',
                    '坡度',
                    '方向看板',
                    '普通3D',
                    '提右3D',
                    '提左3D',
                    '复杂路口模式图',
                    '普通道路方面名称',
                    '专用模式图',
                    '实景图',
                    '高速分歧',
                    '自然语音',
                    '连续分歧',
                    '分歧号',
                    'IC/方面名称',
                    '收费站',
                    '其他'
                ]
            },
            {
                name: 'NODE形态',
                group: [
                    '未调查',
                    '无属性',
                    '图廓点',
                    'CRFinfo点',
                    '收费站',
                    'Highway起点',
                    'Highway终点',
                    'IC',
                    'JCT',
                    '桥',
                    '隧道',
                    '车站',
                    '障碍物',
                    '门牌号码点',
                    'f幅宽变化点',
                    '种别变化点',
                    '车道变化点',
                    '分隔带变化点',
                    '铁路道口',
                    '有人看守铁路道口',
                    '无人看守铁路道口',
                    'Citymodel与铁路交点',
                    'KDZone与铁路交点'
                ]
            },
            {
                name: '道路形态',
                group: [
                    '未调查',
                    '无属性',
                    '其他',
                    'IC',
                    'JCT',
                    'SA',
                    'PA',
                    '全封闭道路',
                    '匝道',
                    '跨线天桥/跨线地道',
                    '私道',
                    '步行街',
                    '过街天桥',
                    '公交专用道路',
                    '自行车道',
                    '跨线立交桥',
                    '桥',
                    '隧道',
                    '立交桥',
                    '环岛',
                    '辅路',
                    '调头路',
                    'POI连接路',
                    '提右连接路',
                    '提左连接路',
                    '主辅路出入口',
                    '窄道路',
                    '主路',
                    '侧道',
                    '交叉点内道路',
                    '未定义交通区域',
                    '区域内道路',
                    '停车场出入口连接路',
                    '停车场出入口虚拟连接路',
                    'Highway对象外JCT',
                    '风景路线',
                    '停车位引导道路',
                    '虚拟提左提右',
                    '虚拟调头口'
                ]
            },
            {
                name: '非道路信息',
                group: [
                    '点门牌',
                    '显示文字',
                    '兴趣点',
                    '邮政编码',
                    '地名',
                    '形状',
                    '3D西南点',
                    '土地利用逻辑关系',
                    '徒弟覆盖逻辑关系',
                    '市街图逻辑关系',
                    '点要素引导坐标',
                    '点要素显示坐标',
                    '中文名称/拼音',
                    '英文名',
                    'Z-Level值',
                    '种别',
                    '等级',
                    '3D信息',
                    'Citymodel敏感区域名称',
                    '值域'
                ]
            },
            {
                name: '预处理',
                group: [
                    '内页预处理'
                ]
            }
        ];

        // 保存
        $scope.doSaveQua = function () {
            var param = {};
            // 问题描述必须输入
            if (!$scope.quaData.quDesc) {
                swal('提示', '请输入问题说明！', 'warning');
                return;
            }
            // 编辑
            if ($scope.quaEdit) {
                for (var key in $scope.originData) {
                    if ($scope.originData[key] != $scope.quaData[key]) {
                        param[key] = $scope.quaData[key];
                    }
                }
                param.erType = 1;
                dsFcc.updateWrong(param, $scope.quaData.logId).then(function (res) {
                    $scope.$emit('switchQualityModal', {
                        flag: false,
                        close: false
                    });
                    $scope.$emit('afterSaveQuaData', true);
                });
            } else {
                param = {
                    checkTaskId: App.Temp.subTaskId,
                    quDesc: $scope.quaData.quDesc,
                    reason: $scope.quaData.reason,
                    erContent: $scope.quaData.erContent,
                    quRank: $scope.quaData.quRank,
                    isPrefer: parseInt($scope.quaData.isPrefer, 10),
                    checker: App.Temp.userName + App.Temp.userId,
                    objectType: $scope.tipData.source.s_sourceType,
                    objectId: $scope.tipData.rowkey,
                    erType: 1 // 由于增加了道路检查质检，增加这个参数用以区别道路还是tips（1代表质检tips    2代表数据检查log）
                };
                dsFcc.saveWrong(param).then(function (res) {
                    if (res) {
                        $scope.$emit('switchQualityModal', {
                            flag: false,
                            close: false
                        });
                        $scope.$emit('afterSaveQuaData', true);
                        $scope.quaData = res;
                    }
                });
            }
        };

        $scope.close = function () {
            $scope.$emit('CloseQualityModal');
        };

        // 转化时间格式
        function formatDateFunc(date) {
            var year = date.substr(0, 4);
            var month = date.substr(4, 2);
            var day = date.substr(6, 2);
            var time = date.substr(8, 2) + ':' + date.substr(10, 2) + ':' + date.substr(12, 2);
            return year + '-' + month + '-' + day + ' ' + time;
        }

        $scope.$on('refreshEnterError', function (event, data) {
            if (data) {
                if (data.data && data.data.logId) {
                    $scope.quaEdit = true;
                    $scope.quaData = data.data;
                    if ($scope.quaData.workTime) {
                        $scope.formatDate = formatDateFunc($scope.quaData.workTime);
                    }
                    $scope.originData = Utils.clone(data.data);
                } else {
                    $scope.quaEdit = false;
                    $scope.quaData = null;
                }
                $scope.tipData = data.tip;
                $scope.tipType = FM.uikit.Config.Tip().getNameByCode($scope.tipData.source.s_sourceType);
            } else {
                $scope.quaEdit = false;
                $scope.quaData = null;
            }
            initPage();
        });
    }
]);
