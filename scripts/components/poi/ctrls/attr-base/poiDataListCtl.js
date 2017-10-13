angular.module('app').controller('PoiDataListCtl', ['$scope', '$rootScope', 'NgTableParams', 'ngTableEventsChannel', 'uibButtonConfig', '$sce', 'dsEdit',
    '$document', 'appPath', '$interval', '$timeout', 'dsOutput', 'dsFcc', 'ngDialog',
    function (scope, $rootScope, NgTableParams, ngTableEventsChannel, uibBtnCfg, $sce, dsEdit, $document, appPath, $interval, $timeout, dsOutput, dsFcc, ngDialog) {
        var tip = FM.uikit.Config.Tip();
        scope.showLoading = { flag: false };
        var workStatus = {
            1: 0,
            2: 2,
            3: 1
        };

        scope.dataTableType = 1;
        scope.dataListType = 1;
        scope.tipsListType = 1;
        scope.tableHeight = {
            height: document.documentElement.clientHeight - 100 + 'px'
        };
        scope.tablesHeight = {
            height: document.documentElement.clientHeight - 90 + 'px'
        };
        // 表格配置搜索;
        scope.filters = {
            value: '',
            name: '',
            pid: 0
        };
        scope.searchType = 'name';
        /* 改变搜索类型*/
        scope.changeSearchType = function (type) {
            scope.searchType = type;
            scope.filters.value = '';
            scope.filters.name = '';
            scope.filters.pid = 0;
        };
        // 切换搜索条件清空输入;
        /* scope.$watch('radio_select',function(newValue,oldValue,scope){
         scope.filters.value = '';
         scope.filters.name = '';
         scope.filters.pid = 0;
         });*/
        // 刷新表格方法;
        var refreshData = function (flag) {
            scope.tableParams.reload();
        };
        // 获取下一页数据
        var getNextPage = function () {
            var totalpage = parseInt(scope.tableParams.total() / scope.tableParams.count(), 0) + ((scope.tableParams.total() % scope.tableParams.count()) > 0 ? 1 : 0);
            var currentPage = scope.tableParams.page();
            if (totalpage > currentPage) {
                scope.tableParams.page(currentPage + 1);
            }
        };
        scope.$watch('searchText', function (newValue, oldewValue) {
            if (scope.dataTableType == 1 && newValue == '') {
                refreshData();
            }
        });

        scope.doSearchPoiList = function (e) {
            var code = e.keyCode;
            if (code == 13 && scope.dataTableType == 1) { // 按enter键时触发，并且只对poi标签有效
                refreshData();
            }
        };

        function initPoiTable() {
            scope.showLoading.flag = true;
            scope.tableParams = new NgTableParams({
                page: 1,
                count: 100,
                filter: scope.filters
            }, {
                counts: [],
                getData: function ($defer, params) {
                    var param = {
                        dbId: App.Temp.dbId,
                        subtaskId: App.Temp.subTaskId,
                        type: scope.dataListType,
                        pageNum: params.page(),
                        pageSize: params.count(),
                        pidName: scope.searchText
                        // pid: parseInt(params.filter().pid || 0)
                    };
                    dsEdit.getPoiList(param).then(function (data) {
                        scope.showLoading.flag = false;
                        scope.poiListTableMsg = '列表无数据';
                        if (data) {
                            if (scope.dataListType === 1 || scope.dataListType === 2) {
                                var poiPids = [];
                                for (var i = 0; i < data.rows.length; i++) {
                                    poiPids.push(data.rows[i].pid);
                                }
                                sessionStorage.setItem('poiPids', poiPids);
                            }
                            scope.tableParams.total(data.total);
                            $defer.resolve(data.rows);
                        } else {
                            if (scope.dataListType === 1) {
                                sessionStorage.setItem('poiPids', []);
                            }
                            scope.tableParams.total(0);
                            $defer.resolve([]);
                        }
                    });
                }
            });
        }

        var initTipsTable = function () {
            scope.itemActive = null;
            scope.showLoading.flag = true;
            dsFcc.getTipsStatics(workStatus[scope.tipsListType]).then(function (data) {
                scope.showLoading.flag = false;
                if (data == -1) {
                    return;
                }
                var arr = [];
                var transArr = [];
                transArr = data.data.rows;
                for (var i = 0, len = transArr.length; i < len; i++) {
                    var obj = {};
                    var objArr = {};
                    obj = transArr[i];
                    var keys = Object.getOwnPropertyNames(obj);
                    for (var j = 0; j < keys.length; j++) {
                        var item = keys[j];
                        objArr.name = tip.getNameByCode(item);
                        objArr.id = item;
                        objArr.flag = true;
                        // scope.tipsObj[item] = true;
                        objArr.total = obj[item];
                        arr.push(objArr);
                    }
                }
                scope.tipTypes = data.data.rows.length;
                scope.tipCount = data.data.total;
                scope.tableParams1 = new NgTableParams({
                    count: 10000
                }, {
                    counts: [],
                    dataset: arr
                });
            });
        };

        // 当前表格数据;
        scope.finalData = null;
        /* 初始化显示table提示*/
        scope.poiListTableMsg = '数据加载中...';
        /* 切换poi列表类型*/
        scope.changeDataList = function (val) {
            scope.dataListType = val;
            // if (scope.filters.name || scope.filters.pid) {
            //     scope.filters.name = ''; // 当过滤条件发生变化时会自动调用表格的查询
            //     scope.filters.pid = null;
            // } else {
            //     _self.tableParams.page(1); // 设置为第一页
            //     _self.tableParams.reload();
            // }
            initPoiTable();
        };
        /* 切换tips列表类型*/
        scope.changeTipsList = function (val) {
            scope.tipsListType = val;
            initTipsTable();
        };
        /* 切换table类型*/
        scope.changeDataTable = function (val) {
            scope.dataTableType = val;
            if (val === 1) {
                initPoiTable();
            } else {
                initTipsTable();
            }
        };

        scope.getTipsDetail = function (item) {
            scope.itemActive = item.id;
            scope.showLoading.flag = true;
            dsFcc.getTipsListItems(workStatus[scope.tipsListType], item.id).then(function (data) {
                scope.showLoading.flag = false;
                if (data == -1) {
                    return;
                }
                var tipArr = data.data;
                var arr = [];
                for (var i = 0, len = tipArr.length; i < len; i++) {
                    var tipsObj = {};
                    tipsObj.g = tipArr[i].g;
                    tipsObj.i = tipArr[i].i;
                    tipsObj.a = tipArr[i].m.a;
                    tipsObj.b = tipArr[i].m.b;
                    if (tipArr[i].m.e) {
                        tipsObj.e = tipArr[i].m.e;
                    } else {
                        tipsObj.e = '未命名';
                    }
                    tipsObj.f = tipArr[i].m.f;
                    tipsObj.t = tipArr[i].t;
                    arr.push(tipsObj);
                }
                scope.tableParams2 = new NgTableParams({
                    count: 10000
                }, {
                    counts: [],
                    dataset: arr
                });
            });
        };
        scope.showTips = function (item) {
            var feature = {
                id: item.i,
                code: item.t,
                geoLiveType: tip.getGLTByCode(item.t),
                status: item.a
            };
            scope.$emit('ObjectSelected', {
                feature: feature
            });
            ngDialog.close();
        };
        scope.showPoi = function (item) {
            var feature = {
                pid: item.pid,
                geoLiveType: 'IXPOI'
            };
            scope.$emit('ObjectSelected', {
                feature: feature
            });
            ngDialog.close();
        };
        // 给每条数据安排序号;
        ngTableEventsChannel.onAfterReloadData(function () {
            // scope.itemActive = -1;
            angular.forEach(scope.tableParams.data, function (data, index) {
                data.num_index = (scope.tableParams.page() - 1) * scope.tableParams.count() + index + 1;
            });
        });
        /* 初始化方法*/
        initPoiTable();
        /* -----------------------------------格式化函数部分----------------------------------*/
        /* 采集时间*/
        function getCollectTime(a, row) {
            var temp = '';
            if (row.collectTime) {
                temp = Utils.dateFormatShort(row.collectTime);
            } else {
                temp = '无';
            }
            return $sce.trustAsHtml(temp);
        }

        /* 采集时间*/
        function getDealTime(b, row) {
            var temp = '';
            if (row.dealTime) {
                temp = Utils.dateFormat(row.dealTime);
            } else {
                temp = '无';
            }
            return $sce.trustAsHtml(temp);
        }

        /* 新鲜度验证*/
        function getFreshnessVefication(d, row) {
            return $sce.trustAsHtml(row.freshnessVefication == 0 ? '否' : '是');
        }

        /* 名称 */
        function getName(e, row) {
            var name = row.name;
            if (name == undefined) {
                name = '';
            }
            return '<span style="cursor: pointer;" ng-click="showPoi(row)">' + name + '</span>';
        }

        /* 分类*/
        function getKindName(f, row) {
            if (row.kindCode) {
                if (scope.metaData.kindFormat[row.kindCode] && scope.metaData.kindFormat[row.kindCode].kindName) {
                    return $sce.trustAsHtml(scope.metaData.kindFormat[row.kindCode].kindName);
                }
                return $sce.trustAsHtml('');
            }
            return $sce.trustAsHtml('');
        }

        function getStatus(g, row) {
            return {
                0: '<span title="无">无</span>',
                1: '<span style="color: #35c9ae">增加</span>',
                2: '<span style="color: #fa5883">删除</span>',
                3: '<span style="color: #fbd318">修改</span>'
            }[row.status];
        }

        // 初始化ng-table表头;
        scope.cols1 = [{
            field: 'num_index',
            title: '序号',
            width: '35px'
        }, {
            field: 'poiNum',
            title: 'POI num',
            width: '90px'
        }, {
            field: 'pid',
            title: 'PID',
            width: '70px'
        }, {
            field: 'status',
            title: '状态',
            html: true,
            width: '30px',
            getValue: getStatus
        }, {
            field: 'name',
            title: '名称',
            html: true,
            width: '110px',
            getValue: getName
        }, {
            field: 'kindCode',
            title: '分类',
            width: '60px',
            getValue: getKindName
        }, {
            field: 'flag',
            title: '标记',
            width: '40px'
        }, {
            field: 'photo',
            title: '照片',
            width: '40px'
        }, {
            field: 'memo',
            title: '备注',
            width: '40px'
        }, {
            field: 'auditProblem',
            title: '监察问题',
            width: '110px'
        }, {
            field: 'collectTime',
            title: '采集时间',
            width: '60px',
            getValue: getCollectTime
        }];
        // 初始化ng-table表头;
        scope.cols2 = [{
            field: 'num_index',
            title: '序号',
            width: '35px'
        }, {
            field: 'poiNum',
            title: 'POI num',
            width: '90px'
        }, {
            field: 'pid',
            title: 'PID',
            width: '70px'
        }, {
            field: 'status',
            title: '状态',
            html: true,
            width: '30px',
            getValue: getStatus
        }, {
            field: 'name',
            title: '名称',
            html: true,
            width: '110px',
            getValue: getName
        }, {
            field: 'kindCode',
            title: '分类',
            width: '60px',
            getValue: getKindName
        }, {
            field: 'errorCount',
            title: '错误',
            width: '50px'
        }, {
            field: 'errorType',
            title: '错误类型',
            width: '60px'
        }, {
            field: 'flag',
            title: '标记',
            width: '40px'
        }, {
            field: 'photo',
            title: '照片',
            width: '40px'
        }, {
            field: 'memo',
            title: '备注',
            width: '110px'
        }, {
            field: 'auditProblem',
            title: '监察问题',
            width: '110px'
        }, {
            field: 'auditStatus',
            title: '问题状态',
            width: '40px'
        }, {
            field: 'freshnessVefication',
            title: '鲜度验证',
            width: '50px',
            getValue: getFreshnessVefication
        }, {
            field: 'collectTime',
            title: '采集时间',
            width: '60px',
            getValue: getCollectTime
        }
        ];
        // 初始化ng-table表头;
        scope.cols3 = [{
            field: 'num_index',
            title: '序号',
            width: '35px'
        }, {
            field: 'poiNum',
            title: 'POI num',
            width: '90px'
        }, {
            field: 'pid',
            title: 'PID',
            width: '70px'
        }, {
            field: 'status',
            title: '状态',
            html: true,
            width: '30px',
            getValue: getStatus
        }, {
            field: 'name',
            title: '名称',
            html: true,
            width: '110px',
            getValue: getName
        }, {
            field: 'kindCode',
            title: '分类',
            width: '60px',
            getValue: getKindName
        }, {
            field: 'flag',
            title: '标记',
            width: '40px'
        }, {
            field: 'photo',
            title: '照片',
            width: '40px'
        }, {
            field: 'memo',
            title: '备注',
            width: '110px'
        }, {
            field: 'freshnessVefication',
            title: '鲜度验证',
            width: '50px',
            getValue: getFreshnessVefication
        }, {
            field: 'collectTime',
            title: '采集时间',
            width: '60px',
            getValue: getCollectTime
        }];
        // 初始化ng-table表头;
        scope.tipsCols = [{
            field: 'name',
            title: 'TIPS类型',
            width: '80px'
        }, {
            field: 'total',
            title: '个数',
            width: '20px'
        }];
        // 初始化ng-table表头;
        scope.dataCols = [{
            field: 'e',
            title: '各项名称',
            width: '200px'
        }];

        /**
         * POI提交
         * 返回成功后刷新POI列表，重新绘制POI图层
         */
        scope.doSubmitData = function () {
            swal({
                title: '确认提交？',
                type: 'warning',
                animation: 'none',
                showCancelButton: true,
                closeOnConfirm: true,
                confirmButtonText: '是的，我要提交',
                cancelButtonText: '取消'
            }, function (f) {
                if (f) {
                    scope.showLoading.flag = true;
                    var param = {
                        dbId: App.Temp.dbId,
                        gridIds: App.Temp.gridList,
                        subtaskId: App.Temp.subTaskId
                    };
                    var flag = true; // 用于控制接口比较慢的时候会弹出多次提示信息的bug
                    dsEdit.submitPoi(param).then(function (jobId) {
                        if (jobId) {
                            var timer = $interval(function () {
                                dsEdit.getJobById(jobId).then(function (data) {
                                    if (flag && (data.status == 3 || data.status == 4)) { // 1-创建，2-执行中 3-成功 4-失败
                                        scope.showLoading.flag = false;
                                        initPoiTable();
                                        $interval.cancel(timer);
                                        if (data.status == 3) {
                                            dsOutput.push({
                                                op: 'POI提交JOB执行成功',
                                                type: 'succ',
                                                pid: '0',
                                                childPid: ''
                                            });
                                            swal('提交提示', '提交完成', 'info');
                                        } else {
                                            dsOutput.push({
                                                op: 'POI提交JOB执行失败',
                                                type: 'fail',
                                                pid: '0',
                                                childPid: ''
                                            });
                                            swal('提交提示', '提交失败,' + data.resultMsg, 'warning');
                                        }
                                        scope.changeDataList(2);
                                        flag = false;
                                    }
                                });
                            }, 500);
                        } else {
                            scope.showLoading.flag = false;
                        }
                    });
                }
            });
        };
    }
]);
