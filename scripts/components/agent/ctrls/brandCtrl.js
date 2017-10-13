/**
 * Created by wuzhen on 2017/5/25.
 */
angular.module('app').controller('brandCtrl', ['$scope', 'NgTableParams', 'ngTableEventsChannel', 'dsEdit', 'dsAgent', 'FileUploader', '$location', '$interval',
    function ($scope, NgTableParams, ngTableEventsChannel, dsEdit, dsAgent, FileUploader, $location, $interval) {
        var accessToken = App.Util.getUrlParam('access_token');
        var height = document.documentElement.clientHeight - 133;
        $scope.tableBodyHeight = {
            height: height + 'px'
        };

        var loadTableData = function (status) {
            $scope.tableParams.settings({
                dataset: []
            });
            $scope.loadTableDataMsg = '数据加载中...';
            var param = {
                chainStatus: status,
                pageSize: 1,
                pageNum: 999
            };
            dsAgent.queryBrandDataList(param).then(function (data) {
                if (data && data.record) {
                    $scope.loadTableDataMsg = '列表无数据';

                    $scope.tableParams.settings({
                        dataset: data.record
                    });
                } else {
                    $scope.loadTableDataMsg = '数据加载失败!';
                }
            });
        };

        // 品牌上传
        var uploader = $scope.uploader = new FileUploader({
            url: App.Util.getFullUrl('dealership/uploadChainExcel')
        });
        uploader.filters.push({
            name: 'fileFilter',
            fn: function (item, options) {
                var suffixName = item.name.substr(-4);
                var flag = suffixName === '.zip';
                return flag;
            }
        });
        uploader.onAfterAddingFile = function (fileItem) {
            $scope.showLoading.flag = true;
            uploader.uploadAll();
        };
        uploader.onWhenAddingFileFailed = function (item, filter, options) {
            swal('提示', '格式不符,只能上传后缀为.zip的文件', 'error');
        };
        uploader.onSuccessItem = function (fileItem, response, status, headers) {
            $scope.showLoading.flag = false;
            if (response.errcode == 0) {
                swal('提示', '文件上传成功', 'success');
                loadTableData($scope.dataListType);
            } else {
                swal('提示', '文件上传失败' + response.errmsg, 'error');
            }
        };

        var queryJobStatus = function (jobId, callback) {
            if (jobId == 0) {
                if (callback) {
                    callback();
                }
                return;
            }
            $scope.showLoading.flag = true;
            var flag = true; // 用于控制getJobById接口比较慢的时候会弹出多次提示信息的bug
            var timer = $interval(function () {
                dsEdit.getJobById(jobId).then(function (data) {
                    if (flag && (data.status == 3 || data.status == 4)) { // 1-创建，2-执行中 3-成功 4-失败
                        $scope.showLoading.flag = false;
                        $interval.cancel(timer);
                        if (data.status == 3) {
                            if (callback) {
                                callback();
                            }
                        } else {
                            swal('提示', data.resultMsg, 'error');
                        }
                        flag = false;
                    }
                });
            }, 500);
        };

        // 补充增量数据上传
        var increaseUploader = $scope.increaseUploader = new FileUploader({
            url: App.Util.getFullUrl('dealership/addChainData')
        });
        increaseUploader.filters.push({
            name: 'fileFilter',
            fn: function (item, options) {
                var suffixName1 = item.name.substr(-5);
                var suffixName2 = item.name.substr(-4);
                var flag = false;
                if (suffixName1 === '.xlsx' || suffixName2 === '.xls') {
                    flag = true;
                }
                return flag;
            }
        });
        increaseUploader.onAfterAddingFile = function (fileItem) {
            $scope.showLoading.flag = true;
            increaseUploader.uploadAll();
        };
        increaseUploader.onWhenAddingFileFailed = function (item, filter, options) {
            swal('提示', '格式不符,只能上传后缀为.xlsx或者.xls的文件', 'error');
        };
        increaseUploader.onSuccessItem = function (fileItem, response, status, headers) {
            $scope.showLoading.flag = false;
            if (response.errcode == 0) {
                queryJobStatus(response.data, function () {
                    swal('提示', '补充增量数据完成!', 'info');
                    loadTableData($scope.dataListType);
                });
            } else {
                swal('提示', '文件上传失败' + response.errmsg, 'error');
            }
        };

        var formatWorkType = function (scope, row) {
            var worktype = row.workType;
            var retVal = '无';
            if (worktype === 1) {
                retVal = '品牌更新';
            } else if (worktype === 2) {
                retVal = '一览表';
            }
            return retVal;
        };

        var formatChainWeight = function (scope, row) {
            var chainWeight = row.chainWeight;
            var retVal = '重要'; // 0
            if (chainWeight === 1) {
                retVal = '普通';
            }
            return retVal;
        };

        $scope.cols = [
            { field: 'selector', headerTemplateURL: 'headerCheckboxId', title: '选择', show: true, width: '60px' },
            { field: 'numIndex', title: '序号', show: true, width: '70px' },
            { field: 'chainName', title: '品牌名称', show: true },
            { field: 'chainWeight', title: '权重', show: true, getValue: formatChainWeight },
            { field: 'workType', title: '作业类型', show: true, getValue: formatWorkType }
        ];

        var initTable = function () {
            $scope.tableParams = new NgTableParams({
                count: 20
            }, {
                counts: [5, 10, 20, 30, 50, 100],
                paginationMaxBlocks: 5,
                paginationMinBlocks: 2,
                dataset: []
            });
        };


        // 给每条数据安排序号;
        ngTableEventsChannel.onAfterReloadData(function () {
            if ($scope.tableParams && $scope.tableParams.data) {
                angular.forEach($scope.tableParams.data, function (data, index) {
                    data.numIndex = ($scope.tableParams.page() - 1) * $scope.tableParams.count() + index + 1;
                    data.checked = false; // 增加checked属性 默认不选中
                });
            }
        });

        // 全选
        $scope.selectAllData = function () {
            var isChecked = $scope.tableParams.checkedAll;
            var dataArr = $scope.tableParams.data;
            for (var i = 0; i < dataArr.length; i++) {
                dataArr[i].checked = isChecked;
            }
        };

        var initData = function () {
            $scope.dataListType = 0;
            $scope.workItemName = '品牌作业';
            initTable();
            loadTableData($scope.dataListType);
        };
        
        $scope.changeDataList = function (flag) {
            $scope.dataListType = flag;
            loadTableData(flag);
        };

        $scope.chainUpdate = function () {
            swal({
                title: '对所有未开启的品牌进行更新?',
                type: 'info',
                showCancelButton: true,
                closeOnConfirm: true,
                confirmButtonText: '确定',
                confirmButtonColor: '#ec6c62'
            }, function (f) {
                if (f) {
                    var flag = true; // 用于控制getJobById接口比较慢的时候会弹出多次提示信息的bug
                    $scope.showLoading.flag = true;
                    dsAgent.chainUpdate().then(function (job) {
                        if (job && job.jobId) {
                            var timer = $interval(function () {
                                dsEdit.getJobById(job.jobId).then(function (data) {
                                    if (flag && (data.status == 3 || data.status == 4)) { // 1-创建，2-执行中 3-成功 4-失败
                                        $scope.showLoading.flag = false;
                                        $interval.cancel(timer);
                                        if (data.status == 3) {
                                            loadTableData();
                                        } else {
                                            swal('提示', '更新品牌失败:' + data.resultMsg, 'error');
                                        }
                                        flag = false;
                                    }
                                });
                            }, 500);
                        } else {
                            $scope.showLoading.flag = false;
                        }
                    });
                }
            });
        };

        $scope.exportWorkResult = function () {
            var data = $scope.tableParams.data;
            var chainArr = [];
            data.forEach(function (item, index, items) {
                if (item.checked) {
                    chainArr.push(item.chainCode);
                }
            });
            if (chainArr.length < 1) {
                swal('提示', '请至少选择一个品牌!', 'info');
                return;
            }
            dsAgent.exportWorkResult({ chains: chainArr });
        };

        $scope.runtimeUpdate = function () {
            swal({
                title: '对所有一览表品牌开启实时更新?',
                type: 'info',
                showCancelButton: true,
                closeOnConfirm: true,
                confirmButtonText: '确定',
                confirmButtonColor: '#ec6c62'
            }, function (f) {
                if (f) {
                    $scope.showLoading.flag = true;
                    dsAgent.liveUpdate({}).then(function (jobId) {
                        $scope.showLoading.flag = false;
                        if (jobId) {
                            queryJobStatus(jobId, function () {
                                loadTableData($scope.dataListType);
                            });
                        }
                    });
                }
            });
        };

        $scope.closeChain = function () {
            var data = $scope.tableParams.data;
            var chainArr = [];
            data.forEach(function (item, index, items) {
                if (item.checked) {
                    chainArr.push(item.chainCode);
                }
            });
            if (chainArr.length !== 1) {
                swal('提示', '请选择一个品牌!', 'info');
                return;
            }
            // swal({
            //     title: '确定关闭品牌?',
            //     type: 'info',
            //     showCancelButton: true,
            //     closeOnConfirm: true,
            //     confirmButtonText: '确定',
            //     confirmButtonColor: '#ec6c62'
            // }, function (f) {
            //     if (f) {
            $scope.showLoading.flag = true;
            var param = {
                chainCode: chainArr[0]
            };
            dsAgent.closeChain(param).then(function (da) {
                $scope.showLoading.flag = false;
                if (da) {
                    swal('提示', '关闭品牌成功!', 'info');
                    $scope.tableParams.checkedAll = false;
                    loadTableData($scope.dataListType);
                }
                // $scope.tableParams.checkedAll = false;
                // loadTableData($scope.dataListType);
            });
            //     }
            // });
        };

        $scope.openChain = function () {
            var data = $scope.tableParams.data;
            var chainArr = [];
            data.forEach(function (item, index, items) {
                if (item.checked) {
                    chainArr.push(item.chainCode);
                }
            });
            if (chainArr.length < 1) {
                swal('提示', '请选择品牌!', 'info');
                return;
            }
            var param = {
                chainCode: chainArr
            };
            $scope.showLoading.flag = true;
            dsAgent.openChain(param).then(function (da) {
                $scope.showLoading.flag = false;
                if (da) {
                    swal('提示', '重启品牌成功!', 'info');
                    $scope.tableParams.checkedAll = false;
                    loadTableData($scope.dataListType);
                }
            });
        };

        $scope.workDiff = function (row) {
            var workType = row.workType;
            var chainCode = row.chainCode;
            if (workType == 1 || workType == 2) {
                var url = '#/diff?access_token=' + accessToken + '&chainCode=' + chainCode + '&random=' + (new Date()).getTime();
                window.location.href = url;
                // $location.path(url);
            } else {
                // swal('列表接口数据有误!');
            }
        };

        var unbindHandler = $scope.$on('WorkItemPanelReload', initData);

        $scope.$on('$destroy', function () {
            unbindHandler = null;
        });
    }
]);
