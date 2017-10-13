/**
 * Created by wuzhen on 2017/5/24.
 */
angular.module('app').controller('customerCtrl', ['$scope', '$q', 'NgTableParams', 'ngTableEventsChannel', 'dsAgent', 'dsMeta', 'FileUploader',
    function ($scope, $q, NgTableParams, ngTableEventsChannel, dsAgent, dsMeta, FileUploader) {
        $scope.metaData = {};
        $scope.metaData.kindFormat = {}; // 存放分类--以键值存放
        $scope.allChain = {};
        var height = document.documentElement.clientHeight - 133;
        $scope.tableBodyHeight = {
            height: height + 'px'
        };
        $scope.dataListType = 1;
        $scope.chainCode = '0'; // 默认是全部,使用此字段是要注意如果是'0'，则需要将其改成''
        $scope.cols = [];

        var loadTableData = function (cfmStatus) {
            $scope.tableParams.settings({
                dataset: []
            });
            $scope.loadTableDataMsg = '数据加载中...';
            var param = {
                type: 1, // 1客户确认列表，2外业确认列表
                chainCode: $scope.chainCode == '0' ? '' : $scope.chainCode,
                cfmStatus: cfmStatus,
                pageSize: 1,
                pageNum: 9999
            };
            dsAgent.queryOuterWorkDataList(param).then(function (data) {
                if (data) {
                    $scope.loadTableDataMsg = '列表无数据';

                    $scope.tableParams.settings({
                        dataset: data
                    });
                } else {
                    $scope.loadTableDataMsg = '数据加载失败！';
                }
            });
        };

        var uploader = $scope.uploader = new FileUploader({
            url: App.Util.getFullUrl('dealership/impConfirmData')
        });
        uploader.filters.push({
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
        uploader.onAfterAddingFile = function (fileItem) {
            $scope.showLoading.flag = true;
            uploader.uploadAll();
        };
        uploader.onBeforeUploadItem = function (item) {
        };
        uploader.onCompleteAll = function () {
        };
        uploader.onWhenAddingFileFailed = function (item, filter, options) {
            swal('提示', '格式不符,只能上传后缀为.xlsx或者.xls的文件', 'error');
        };
        uploader.onSuccessItem = function (fileItem, response, status, headers) {
            $scope.showLoading.flag = false;
            if (response.errcode == 0) {
                loadTableData($scope.dataListType);
            } else {
                swal('提示', '文件上传失败' + response.errmsg, 'error');
            }
        };

        var formatKindCode = function (scope, row) {
            var ret = '';
            if (row.kindCode) {
                ret = $scope.metaData.kindFormat[row.kindCode].kindName;
            }
            return ret;
        };

        var formatArea = function (scope, row) {
            return (row.province ? row.province : '(空)省') + '-' + (row.city ? row.city : '(空)市');
        };

        var initTable = function () {
            $scope.cols = [
                { field: 'selector', headerTemplateURL: 'headerCheckboxId', title: '选择', show: true, width: '60px' },
                { field: 'numIndex', title: '序号', show: true, width: '100px' },
                { field: 'resultId', title: 'UUID', show: true, width: '200px' },
                { field: 'name', title: '代理店名称', show: true },
                { field: 'address', title: '代理店地址', show: true },
                { field: 'city', title: '归属区域', show: true, getValue: formatArea },
                { field: 'kindCode', title: '分类', show: true, getValue: formatKindCode },
                { field: 'toClientDate', title: '发布时间', show: $scope.dataListType === 2 },
                { field: 'fbDate', title: '反馈时间', show: $scope.dataListType === 3 },
                { field: 'fbContent', title: '反馈意见', show: $scope.dataListType === 3 },
                { field: 'fbAuditRemark', title: '作业意见', show: $scope.dataListType === 3 },
                { field: 'cfmMemo', title: '备注', show: true }
            ];

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

        // 获取分类和品牌
        var initMetaData = function (callback) {
            var promises = [];
            var param = {
                mediumId: '',
                region: 0
            };
            promises.push(dsMeta.getKindList(param).then(function (kindData) {
                $scope.metaData.kindFormat = {};
                $scope.metaData.kindList = [];
                for (var i = 0; i < kindData.length; i++) {
                    $scope.metaData.kindFormat[kindData[i].kindCode] = {
                        kindId: kindData[i].id,
                        kindName: kindData[i].kindName,
                        level: kindData[i].level,
                        extend: kindData[i].extend,
                        parentFlag: kindData[i].parent,
                        chainFlag: kindData[i].chainFlag,
                        dispOnLink: kindData[i].dispOnLink,
                        mediumId: kindData[i].mediumId
                    };
                }
            }));
            $q.all(promises).then(function () {
                if (callback) {
                    callback();
                }
            });
        };

        // $scope.chageChianCode = function () {
        //     initTable();
        //     loadTableData($scope.dataListType);
        // };

        // 关闭作业
        $scope.closeWork = function () {
            var data = $scope.tableParams.data;
            var resultIdArr = [];
            data.forEach(function (item, index, items) {
                if (item.checked) {
                    resultIdArr.push(item.resultId);
                }
            });
            if (resultIdArr.length < 1) {
                swal('提示', '请选择数据!', 'info');
                return;
            }
            var param = {
                resultIds: resultIdArr
            };
            $scope.showLoading.flag = true;
            dsAgent.closeWork(param).then(function (da) {
                $scope.showLoading.flag = false;
                if (da) {
                    swal('提示', '关闭作业成功!', 'info');
                    $scope.tableParams.checkedAll = false;
                    loadTableData($scope.dataListType);
                }
            });
        };

        var searchAllChain = function () {
            dsAgent.queryBrandDataList({}).then(function (data) {
                if (data && data.record) {
                    $scope.allChain['0'] = '--全部--'; // 增加全部并且赋值为0可以是全部显示在最顶层
                    data.record.forEach(function (item, index, items) {
                        $scope.allChain[item.chainCode] = item.chainName;
                    });
                }
            });
        };

        $scope.chainChange = function () {
            loadTableData($scope.dataListType);
        };

        // 导出数据
        $scope.download = function () {
            if ($scope.chainCode == '0') {
                swal('提示', '请先选择品牌', 'info');
                return;
            }
            var param = {
                chainCode: $scope.chainCode
            };
            dsAgent.exportToClient(param);
        };

        // 转内业
        $scope.passDealership = function () {
            var data = $scope.tableParams.data;
            var resultIdArr = [];
            data.forEach(function (item, index, items) {
                if (item.checked) {
                    resultIdArr.push(item.resultId);
                }
            });
            if (resultIdArr.length < 1) {
                swal('提示', '请选择数据!', 'info');
                return;
            }
            var param = {
                resultIds: resultIdArr
            };
            $scope.showLoading.flag = true;
            dsAgent.passDealership(param).then(function (da) {
                $scope.showLoading.flag = false;
                if (da) {
                    swal('提示', '转内业成功!', 'success');
                    $scope.tableParams.checkedAll = false;
                    loadTableData($scope.dataListType);
                }
            });
        };


        var initData = function () {
            searchAllChain();
            initMetaData(function () {
                initTable();
                loadTableData($scope.dataListType);
            });
        };

        $scope.changeDataList = function (flag) {
            $scope.dataListType = flag;
            initTable();
            loadTableData(flag);
        };

        var unbindHandler = $scope.$on('WorkItemPanelReload', initData);

        $scope.$on('$destroy', function () {
            unbindHandler = null;
        });
    }
]);
