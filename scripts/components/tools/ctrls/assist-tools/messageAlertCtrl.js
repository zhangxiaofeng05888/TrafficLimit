/**
 * Created by wangmingdong on 2017/1/9.
 */
angular.module('app').controller('MessageAlertCtrl', ['$scope', '$interval', 'dsFcc', 'dsEdit', 'dsOutput',
    function ($scope, $interval, dsFcc, dsEdit, dsOutput) {
        var hisPageNum;
        $scope.activeMainMenu = 'message';
        $scope.activeMenu = 'system';
        // 切换主类别
        $scope.changeMainType = function (type) {
            if (type == 'message') {
                $scope.activeMenu = 'system';
            } else {
                $scope.activeMenu = 'jobRecord';
            }
            $scope.activeMainMenu = type;
        };

        // 切换子类别
        $scope.changeChildType = function (type) {
            $scope.activeMenu = type;
        };

        // 清空履历
        $scope.clearData = function () {
            dsOutput.clear();
        };

        // 地图定位
        $scope.showOnMap = function (pid, feadType) {
            $scope.$emit('ObjectSelected', {
                feature: {
                    id: pid,
                    geoLiveType: feadType
                }
            });
            /* dsEdit.getByPid(pid, feadType).then(function (data) {
                if (!data) {
                    return;
                }
                if (data.errcode === -1) {
                    swal('', data.errmsg, '提示信息');
                    return;
                }
                map.setView([data.geometry.coordinates[1], data.geometry.coordinates[0]], map.getZoom() < 17 ? 17 : map.getZoom());
                objCtrl.setCurrentObject(feadType, data);
            });*/
        };

        // 处理时间
        $scope.formatTime = function (time) {
            var tMonth = new Date().getMonth() + 1;
            var tDay = new Date().getDate();
            var result = '';
            var month = parseInt(time.substr(4, 2), 10);
            var day = parseInt(time.substr(6, 2), 10);
            if (month == tMonth && day == tDay) {
                result = '今天';
            } else {
                result = month + '月' + day + '日';
            }
            return result;
        };

        // 获取全部消息
        $scope.getAllMsg = function () {
            dsEdit.getListAll().then(function (data) {
                var i;
                var key;
                $scope.msgList.manage = {};
                $scope.msgList.sys = {};
                var timeKey;
                // 管理消息
                if (data.manage) {
                    for (i = 0; i < data.manage.length; i++) {
                        if (data.manage[i].createTime) {
                            data.manage[i].time = Utils.dateFormat(data.manage[i].createTime);
                            timeKey = $scope.formatTime(data.manage[i].createTime);
                        }
                        if (!$scope.msgList.manage[timeKey]) {
                            $scope.msgList.manage[timeKey] = [];
                        }
                        $scope.msgList.manage[timeKey].push(data.manage[i]);
                    }
                    // 如果是今天消息默认展开
                    for (key in $scope.msgList.manage) {
                        if (key == '今天') {
                            $scope.msgList.manageList.push(true);
                        } else {
                            $scope.msgList.manageList.push(false);
                        }
                    }
                }
                // 系统消息
                if (data.sys) {
                    for (i = 0; i < data.sys.length; i++) {
                        if (data.sys[i].createTime) {
                            data.sys[i].time = Utils.dateFormat(data.sys[i].createTime);
                            timeKey = $scope.formatTime(data.sys[i].createTime);
                        }
                        data.sys[i].msgParam = JSON.parse(data.sys[i].msgParam);
                        if (data.sys[i].msgParam && data.sys[i].msgParam.relateObject == 'JOB') {
                            data.sys[i].jobId = data.sys[i].msgParam.relateObjectId;
                        }
                        if (!$scope.msgList.sys[timeKey]) {
                            $scope.msgList.sys[timeKey] = [];
                        }
                        $scope.msgList.sys[timeKey].push(data.sys[i]);
                    }
                    for (key in $scope.msgList.sys) {
                        if (key == '今天') {
                            $scope.msgList.systemList.push(true);
                        } else {
                            $scope.msgList.systemList.push(false);
                        }
                    }
                }
                // 关闭loading
                $scope.msgList.isLoading = false;
            });
        };

        // 获取历史消息
        $scope.getHistoryList = function (num, size) {
            dsEdit.getListHistory(num, size).then(function (data) {
                var i;
                var key;
                var timeKey;

                if (data) {
                    // 判断是否还有新数据
                    $scope.msgList.getNewHis = data.result.length == size;
                    for (i = 0; i < data.result.length; i++) {
                        if (data.result[i].createTime) {
                            data.result[i].time = Utils.dateFormat(data.result[i].createTime);
                            timeKey = $scope.formatTime(data.result[i].createTime);
                        }
                        if (!$scope.msgList.his[timeKey]) {
                            $scope.msgList.his[timeKey] = [];
                        }
                        $scope.msgList.his[timeKey].push(data.result[i]);
                    }
                    for (key in $scope.msgList.his) {
                        if (key) {
                            $scope.msgList.historyList.push(false);
                        }
                    }
                }
                hisPageNum += 1;
                // 关闭loading
                $scope.msgList.isHisLoading = false;
            });
        };

        // 加载更多历史消息
        $scope.getMoreHistory = function () {
            $scope.msgList.isHisLoading = true;
            $scope.getHistoryList(hisPageNum, 20);
        };

        // 切换展开箭头
        $scope.doCollapse = function (type, index) {
            if (type == 'manage') {
                $scope.msgList.manageList[index] = !$scope.msgList.manageList[index];
            } else if (type == 'system') {
                $scope.msgList.systemList[index] = !$scope.msgList.systemList[index];
            } else if (type == 'history') {
                $scope.msgList.historyList[index] = !$scope.msgList.historyList[index];
            }
        };

        $scope.initialize = function () {
            hisPageNum = 1;
            $scope.msgList = {
                manage: {}, // 管理
                sys: {},    // 系统
                his: {},    // 历史
                manageList: [], // 箭头控制
                systemList: [],
                historyList: [],
                getNewHis: false,  // 获取到的新历史消息
                isLoading: true,    // 是否加载中
                isHisLoading: true  // 历史消息加载中
            };
            $scope.recordResult = dsOutput.output;
            $scope.getAllMsg();
            $scope.getMoreHistory();
        };

        $scope.initialize();

        // 监听获取新消息
        $scope.$on('getMessage', function (event, data) {
            $scope.initialize();
        });
    }
]);
