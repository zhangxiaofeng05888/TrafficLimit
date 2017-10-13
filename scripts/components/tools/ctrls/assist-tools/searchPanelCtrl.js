/**
 * Created by chenxiao on 2016/7/26.
 */
angular.module('app').controller('SearchPanelCtrl', ['$scope', '$interval', 'dsEdit',
    function ($scope, $interval, dsEdit) {
        $scope.searchText = null;
        $scope.running = false;
        $scope.progress = 0;
        $scope.searchMapping = [
            { id: 'linkPid', type: 'RDLINK', lable: '道路Pid' },
            { id: 'nodePid', type: 'RDNODE', lable: '道路点Pid' },
            { id: 'name', type: 'RDLINK', lable: '道路名称' },
            { id: 'pid', type: 'IXPOI', lable: 'POI Pid' },
            { id: 'name', type: 'IXPOI', lable: 'POI名称' },
            { id: 'linkPid', type: 'RWLINK', lable: '铁路Pid' },
            { id: 'nodePid', type: 'RWNODE', lable: '铁路点Pid' },
            { id: 'pid', type: 'RDSLOPE', lable: '坡度Pid' },
            { id: 'pid', type: 'RDSPEEDLIMIT', lable: '限速Pid' },
            { id: 'pid', type: 'RDCROSSWALK', lable: '人行过道Pid' },
            { id: 'pid', type: 'RDTRAFFICSIGNAL', lable: '信号灯Pid' },
            { id: 'pid', type: 'RDLINKWARNING', lable: '警示信息Pid' },
            { id: 'pid', type: 'RDELECTRONICEYE', lable: '电子眼Pid' },
            { id: 'bumpPid', type: 'RDSPEEDBUMP', lable: '减速带Pid' },
            { id: 'pid', type: 'RDGATE', lable: '大门Pid' },
            { id: 'pid', type: 'RDRESTRICTION', lable: '交限Pid' },
            { id: 'pid', type: 'RDDIRECTROUTE', lable: '顺行Pid' },
            { id: 'branchPid', type: 'RDBRANCH', lable: '分歧Pid' },
            { id: 'pid', type: 'RDLANECONNEXITY', lable: '车信Pid' },
            { id: 'lanePid', type: 'RDLANE', lable: '详细车道Pid' },
            { id: 'pid', type: 'RDTOLLGATE', lable: '收费站Pid' },
            { id: 'pid', type: 'RDVOICEGUIDE', lable: '语音引导Pid' },
            { id: 'pid', type: 'RDSE', lable: '分叉口提示Pid' },
            { id: 'vspeedPid', type: 'RDVARIABLESPEED', lable: '可变限速Pid' },
            { id: 'pid', type: 'RDGSC', lable: '立交Pid' },
            { id: 'groupId', type: 'RDSAMELINK', lable: '同一线groupId' },
            { id: 'groupId', type: 'RDSAMENODE', lable: '同一点groupId' },
            { id: 'pid', type: 'RDHGWGLIMIT', lable: '限高限重pid' },
            { id: 'pid', type: 'RDMILEAGEPILE', lable: '里程桩pid' },
            { id: 'pid', type: 'RDCROSS', lable: '路口pid' },
            { id: 'pid', type: 'RDINTER', lable: 'CRF交叉点pid' },
            { id: 'pid', type: 'RDROAD', lable: 'CRF道路pid' },
            { id: 'pid', type: 'RDOBJECT', lable: 'CRF对象pid' },
            { id: 'regionId', type: 'ADADMIN', lable: '行政区划代表点pid' },
            { id: 'nodePid', type: 'ADNODE', lable: '行政区划点pid' },
            { id: 'linkPid', type: 'ADLINK', lable: '行政区划线pid' },
            { id: 'facePid', type: 'ADFACE', lable: '行政区划面pid' },
            { id: 'nodePid', type: 'LUNODE', lable: 'LU点pid' },
            { id: 'linkPid', type: 'LULINK', lable: 'LU线pid' },
            { id: 'facePid', type: 'LUFACE', lable: 'LU面pid' },
            { id: 'nodePid', type: 'LCNODE', lable: 'LC点pid' },
            { id: 'linkPid', type: 'LCLINK', lable: 'LC线面pid' },
            { id: 'facePid', type: 'LCFACE', lable: 'LCpid' },
            { id: 'nodePid', type: 'ZONENODE', lable: 'ZONE点pid' },
            { id: 'linkPid', type: 'ZONELINK', lable: 'ZONE线pid' },
            { id: 'facePid', type: 'ZONEFACE', lable: 'ZONE面pid' }
        ];
        $scope.doExecute = function () {
            if (!$scope.searchId) {
                swal('请选择一个搜索项', '', 'info');
                return;
            } else if (!$scope.searchText) {
                swal('请输入要搜索的内容', '', 'info');
                return;
            }
            $scope.running = true;
            $scope.$emit('job-search', {
                status: 'begin'
            });
            $scope.progress = 0;
            dsEdit.getSearchData(1, $scope.searchId, $scope.searchText, $scope.searchType).then(function (data) {
                $scope.progress = 100;
                $scope.running = false;
                $scope.$emit('job-search', {
                    status: 'end'
                });
                /* 弹出搜索结果*/
                $scope.$emit('openConsole', {
                    type: 'searchResult',
                    data: data,
                    param: [1, $scope.searchId, $scope.searchText, $scope.searchType]
                });
            });
        };
        /* 回车搜索 */
        $scope.keyDoExecute = function ($event) {
            if ($event.keyCode == 13) {
                $scope.doExecute();
            }
        };
        $scope.selectItem = function (item) {
            $scope.searchLable = item.lable;
            $scope.searchId = item.id;
            $scope.searchType = item.type;
        };
    }
]);
