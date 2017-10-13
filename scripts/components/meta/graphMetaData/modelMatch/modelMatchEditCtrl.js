/**
 * Created by mali on 2017/4/19.
 * 编辑模式图匹配表
 */
angular.module('app').controller('modelMatchEditCtrl', ['$scope', '$ocLazyLoad', 'appPath', '$interval', 'dsMeta', 'FileUploader',
    function ($scope, $ocLazyLoad, appPath, $interval, dsMeta, FileUploader) {
        var objectCtrl = fastmap.uikit.ObjectEditController();
        $scope.productLineOpt = [
            { id: 'NIDB-G', label: 'NIDB-G' },
            { id: 'NIDB-K', label: 'NIDB-K' }
        ];
        $scope.initializeData = function () {
            var type = $scope.modelMatchGFlag;
            $scope.modelMatchGData = fastmap.dataApi.scModelMatchG({});
            if (type == 'add') {
                $scope.modelMatchGData = fastmap.dataApi.scModelMatchG({});
                $scope.imageUploadable = true;
                $scope.imageFile = '';
            } else if (type == 'edit') {
                $scope.modelMatchGData = objectCtrl.data;
                // 不转的话时间控件里不显示
                $scope.modelMatchGData.impDate = new Date($scope.modelMatchGData.impDate);
                objectCtrl.setOriginalData(objectCtrl.data.getIntegrate());
                $scope.imageUploadable = false;
            }
        };

        // 新增重置
        $scope.reset = function () {
            $scope.modelMatchGData = fastmap.dataApi.scModelMatchG({});
        };
        $scope.initializeData();

        // 图片上传
        var uploader = $scope.uploader = new FileUploader({
            url: App.Util.getFullUrl('metadata/metadataEdit/patternImage/save'),
            queueLimit: 1,
            formData: [{
                parameter: JSON.stringify({
                    tableName: App.Temp.currentTableName,
                    data: $scope.modelMatchGData.getIntegrate()
                })
            }]
        });
        uploader.filters.push({
            name: 'fileFilter',
            fn: function (item, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif'.indexOf(type) !== -1;
            }
        });
        /* 添加完所有文件*/
        uploader.onAfterAddingFile = function (fileItem) {
            $scope.imageFile = fileItem.file.name;
        };
        uploader.onBeforeUploadItem = function (item) {
            this.formData = [{
                parameter: JSON.stringify({
                    tableName: App.Temp.currentTableName,
                    data: $scope.modelMatchGData.getIntegrate()
                })
            }];
        };
        uploader.onCompleteAll = function () {

        };
        // CALLBACKS
        /* 添加上传文件失败*/
        uploader.onWhenAddingFileFailed = function (item, filter, options) {
            swal('文件格式不符', '只能上传格式为jpg|png|jpeg|bmp|gif的图片', 'warning');
        };
        uploader.onSuccessItem = function (fileItem, response, status, headers) {
            if (response.errcode == 0) {
                $scope.closeSubModal();
                swal({
                    title: '保存成功',
                    type: 'info',
                    showCancelButton: false,
                    closeOnConfirm: true,
                    confirmButtonText: '确定'
                }, function (f) {
                    if (f) {
                        $scope.refreshData();
                        $scope.$emit('freshload', { flag: false });
                    }
                });
                uploader.removeFromQueue(fileItem);
            } else {
                swal('保存失败', response.errmsg, 'warning');
            }
        };
        /** *
         * 关闭编辑面板
         */
        $scope.closeSearchModal = function () {
            $scope.searchModal = false;
        };
        // 时间格式转换 object 转 string
        var datedToFormat = function (date, fmt) {
            var o = {
                'M+': date.getMonth() + 1, // 月份
                'd+': date.getDate(), // 日
                'h+': date.getHours(), // 小时
                'm+': date.getMinutes(), // 分
                's+': date.getSeconds(), // 秒
                'q+': Math.floor((date.getMonth() + 3) / 3) // 季度
            };
            if (/(y+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
            }
            for (var k in o) {
                if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
            }
            return fmt;
        };
        /** *
         * 保存
         */
        $scope.doSave = function () {
            var param = {};
            if ($scope.modelMatchGFlag == 'add') {
                if (!$scope.modelMatchGData.productLine || !$scope.modelMatchGData.version || !$scope.modelMatchGData.projectNm || !$scope.modelMatchGData.bType || !$scope.modelMatchGData.fileName || !$scope.modelMatchGData.format || !$scope.modelMatchGData.impWorker || !$scope.modelMatchGData.impDate || !$scope.modelMatchGData.urlDb || !$scope.modelMatchGData.urlFile) {
                    swal('提示', '产品线、文件版本、项目名称、大文件类型、文件名称、文件后缀、导入人员、导入日期、路径名称、相对路径均为必填字段，请检查', 'info');
                    return;
                }
                if (!uploader.queue.length) {
                    swal('提示', '请选择图片', 'info');
                    return;
                }
                // 手动修改上传文件的formdata
                uploader.queue[0].formData[0] = {
                    parameter: JSON.stringify({
                        tableName: App.Temp.currentTableName,
                        data: $scope.modelMatchGData.getIntegrate()
                    })
                };
                uploader.uploadAll();
                $scope.$emit('freshload', { flag: true });
            } else if ($scope.modelMatchGFlag == 'edit') {
                // 时间控件小缺陷
                if (typeof $scope.modelMatchGData.impDate == 'object') {
                    $scope.modelMatchGData.impDate = datedToFormat($scope.modelMatchGData.impDate, 'yyyy-MM-dd hh:mm:ss');
                }
                var changes = objectCtrl.data.getChanges();
                if (changes) {
                    if (!$scope.modelMatchGData.productLine || !$scope.modelMatchGData.version || !$scope.modelMatchGData.projectNm || !$scope.modelMatchGData.bType || !$scope.modelMatchGData.fileName || !$scope.modelMatchGData.format || !$scope.modelMatchGData.impWorker || !$scope.modelMatchGData.impDate || !$scope.modelMatchGData.urlDb || !$scope.modelMatchGData.urlFile) {
                        swal('提示', '产品线、文件版本、项目名称、大文件类型、文件名称、文件后缀、导入人员、导入日期、路径名称、相对路径均为必填字段，请检查', 'info');
                        return;
                    }
                    $scope.$emit('freshload', { flag: true });
                    param = {
                        tableName: App.Temp.currentTableName,
                        data: $scope.modelMatchGData.getIntegrate()
                    };
                    dsMeta.graphMetaDataSave(param).then(function (data) {
                        if (data) {
                            $scope.closeSubModal();
                            swal({
                                title: '保存成功',
                                type: 'info',
                                showCancelButton: false,
                                closeOnConfirm: true,
                                confirmButtonText: '确定'
                            }, function (f) {
                                if (f) {
                                    $scope.refreshData();
                                    $scope.$emit('freshload', { flag: false });
                                }
                            });
                        }
                    });
                } else {
                    swal('属性值没有变化', '', 'info');
                }
            }
        };

        var unbindHandler = $scope.$on('SubModalReload', $scope.initializeData);
        $scope.$on('$destroy', function () {
            unbindHandler = null;
        });
    }
]);
