/**
 * Created by liuyang on 2016/12/23.
 */
angular.module('app').controller('poiLeftViewPanelCtrl', ['$scope', '$rootScope', 'FileUploader', 'NgTableParams',
    'dsFcc', 'dsEdit',
    function ($scope, $rootScope, FileUploader, NgTableParams, dsFcc, dsEdit) {
        var objCtrl = fastmap.uikit.ObjectEditController();
        var topoEditFactory = fastmap.uikit.topoEdit.TopoEditFactory.getInstance();
        var topoEditor = topoEditFactory.createTopoEditor('IXPOI', null);
        var poiType = '';

        /**
         * 获取当前页的照片
         * @param currentPage
         */
        var getCurrentPagePhotos = function (currentPage) {
            var i = 0;
            var startIndex = (currentPage - 1) * 5;
            var arr = $scope.poi.photos.slice(startIndex, startIndex + 5);
            if (!$scope.deepInfoFlag) {
                arr = $scope.poi.photos.slice(startIndex, startIndex + 5);
            } else { // 深度信息 ,深度信息不显示tag等于7的照片
                var tempArr = [];
                var allSencePhoto = null;
                for (i = 0; i < $scope.poi.photos.length; i++) {
                    if ($scope.poi.photos[i].tag === 7) {
                        allSencePhoto = $scope.poi.photos[i];
                        break;
                    }
                }

                for (i = 0; i < $scope.poi.photos.length; i++) {
                    if ($scope.poi.photos[i].tag !== 7) {
                        var photo = $scope.poi.photos[i];
                        photo.tagFlag = false;
                        if (allSencePhoto && photo.fccPid === allSencePhoto.memo) {
                            photo.tagFlag = true;
                        }
                        tempArr.push($scope.poi.photos[i]);
                    }
                }
                arr = tempArr.slice(startIndex, startIndex + 5);
            }
            $scope.tempPhotos = arr;
            if (arr.length > 0) {
                $scope.nowActiveImg = arr[0];
                $scope.nowActiveIndex = 1;
            } else {
                $scope.nowActiveImg = {};
                $scope.nowActiveIndex = 0;
            }
            if ($scope.tempPhotos.length < 5) {
                var len = $scope.tempPhotos.length;
                for (i = 0; i < 5 - len; i++) {
                    $scope.tempPhotos.push({
                        originUrl: '',
                        thumbnailUrl: '',
                        noimg: true
                    });
                }
            }
        };

        var selectLastPhoto = function () {
            for (var i = 0; i < $scope.tempPhotos.length; i++) {
                if ($scope.tempPhotos[i].noimg) {
                    break;
                }
            }
            $scope.nowActiveImg = $scope.tempPhotos[i - 1];
            $scope.nowActiveIndex = i;
        };

        var uploader = $scope.uploader = new FileUploader({
            url: App.Util.getFullUrl('dropbox/upload/resource'),
            formData: [{
                parameter: JSON.stringify({
                    filetype: 'photo',
                    dbId: App.Temp.dbId,
                    pid: objCtrl.data.pid
                })
            }]
        });
        uploader.filters.push({
            name: 'fileFilter',
            fn: function (item, options) {
                var type = item.type.slice(item.type.lastIndexOf('/') + 1);
                return ['jpg', 'png', 'jpeg', 'bmp', 'gif'].indexOf(type) !== -1;
            }
        });
        /* 添加完所有文件*/
        uploader.onAfterAddingFile = function (fileItem) {
            uploader.uploadAll();
        };
        uploader.onBeforeUploadItem = function (item) {
            $scope.showProgress = true;
        };
        uploader.onCompleteAll = function () {
            if ($scope.uploader.progress == 100) {
                $scope.showProgress = false;
            }
        };
        /* 添加上传文件失败*/
        uploader.onWhenAddingFileFailed = function (item, filter, options) {
            swal('文件格式不符', '只能上传格式为jpg|png|jpeg|bmp|gif的图片', 'warning');
        };
        uploader.onSuccessItem = function (fileItem, response, status, headers) {
            if (response.errcode == 0) {
                var url = 'fcc/photo/getSnapshotByRowkey';
                var img = new FM.dataApi.IxPoiPhoto({
                    thumbnailUrl: App.Util.getFullUrl(url) + '&parameter={"rowkey":"' + response.data.PID + '",type:"thumbnail"}',
                    originUrl: App.Util.getFullUrl(url) + '&parameter={"rowkey":"' + response.data.PID + '",type:"origin"}',
                    fccPid: response.data.PID
                });

                $scope.poi.photos.push(img);
                var countPages = Math.ceil($scope.poi.photos.length / 5);
                getCurrentPagePhotos(countPages);
                selectLastPhoto();
            }
        };

        $scope.bigImgStyle = {
            width: 'auto',
            height: 'auto',
            'max-height': '100%',
            'max-width': '100%',
            cursor: 'move'
        };

        function initPhotos() {
            $scope.currentPage = 1;
            getCurrentPagePhotos(1);
        }

        function initDeepPhotos() {
            var i;
            for (i = 0; i < $scope.poi.photos.length; i++) {
                if ($scope.poi.photos[i].tag !== 7) { // 深度信息显示的是tag不等于7的照片
                    $scope.poi.photos[i].tagFlag = false;
                    $scope.tempPhotos.push($scope.poi.photos[i]);
                }
            }
            for (i = 0; i < $scope.poi.photos.length; i++) {
                if ($scope.poi.photos[i].tag === 7) {
                    for (var j = 0; j < $scope.tempPhotos.length; j++) {
                        if ($scope.poi.photos[i].memo === $scope.tempPhotos[j].fccPid) {
                            $scope.tempPhotos[j].tagFlag = true;
                        }
                    }
                }
            }
            $scope.currentPage = 1;
            /* 当前选中图片*/
            $scope.nowActiveImg = $scope.tempPhotos[0] || '';
            $scope.nowActiveIndex = 0;
            if ($scope.tempPhotos.length) {
                for (i = 0; i < $scope.tempPhotos.length; i++) {
                    if ($scope.tempPhotos[i].originUrl) {
                        $scope.nowActiveIndex = 1;
                    }
                }
            }
        }

        function initCheckResult(flag) {
            var checkType;
            if (flag === 2) {
                checkType = 'DEEP';
            } else {
                checkType = 'POI_ROW_COMMIT';
            }
            $scope.checkResultTableParam = new NgTableParams({}, {
                counts: [],
                getData: function (params) {
                    return dsEdit.getPoiCheckData($scope.poi.pid, checkType).then(function (data) {
                        var ret = [];
                        if (data !== -1) {
                            // params.total(data.total);
                            for (var i = 0, len = data.data.length; i < len; i++) {
                                ret.push(new FM.dataApi.IxCheckResult(data.data[i]));
                            }
                        }
                        return ret;
                    });
                }
            });
        }

        $scope.doIgnoreCheckResult = function (row) {
            dsEdit.updateCheckStatus(row.pid, 0, 2).then(function (data) {
                if (data !== -1) {
                    $scope.checkResultTableParam.reload();
                }
            });
        };

        var initTools = function () {
            // 图片放大缩小
            var poiImage = document.getElementById('poiImage');
            if (poiImage) {
                poiImage.dispatchEvent(new CustomEvent('wheelzoom.destroy'));
                wheelzoom(poiImage);
            }

            if (App.Temp.monthTaskType) { // 月编深度信息
                poiType = 'deepPids';
            } else {
                poiType = 'poiPids';
            }
            // 当前编辑条数
            var poiPids = sessionStorage.getItem(poiType) ? sessionStorage.getItem(poiType).split(',') : [];
            $scope.poiPidList = poiPids;
            $scope.poiListTotal = poiPids.length;
            var listSelectedPid = sessionStorage.getItem('listSelectedPid');
            var index = poiPids.indexOf(listSelectedPid);
            if (index > -1) {
                $scope.poiIndexPage = index + 1;
            }

            // 由于poi列表替换为前端分页，所以如下代码暂时屏蔽以免后面再换成前端分页
            // var poiSession = sessionStorage.getItem('poiDataListParam') ? sessionStorage.getItem('poiDataListParam').split(',') : [];
            // if (poiSession.length) {
            //     var pageNum = parseInt(poiSession[1], 10) - 1;
            //     var pageSize = parseInt(poiSession[2], 10);
            //     $scope.poiListTotal = poiSession[3];
            //     $scope.poiIndexPage = (poiPids.indexOf($scope.poi.pid.toString()) + 1) + pageNum * pageSize;
            // }
        };

        function initData() {
            $scope.poi = objCtrl.data;
            $scope.fmFormEditable = $rootScope.Editable && topoEditor.canEdit($scope.poi) && topoEditor.canDelete($scope.poi);
            $scope.picType = 1;
            $scope.allPhotos = true;
            $scope.showProgress = false;
            $scope.deepInfoFlag = false;
            if (App.Temp.monthTaskType) {
                $scope.deepInfoFlag = true;
                if (App.Temp.monthTaskType == 'deepDetail') { // 当为‘通用’时需要显示全景照片的功能
                    $scope.showWholeScene = true;
                } else {
                    $scope.showWholeScene = false;
                }
            }
            var param = JSON.parse(uploader.formData[0].parameter); // 由于上传组件只在第一次加载的时候初始化，所以需要动态改变参数
            param.pid = $scope.poi.pid;
            uploader.formData[0].parameter = JSON.stringify(param);
            if ($scope.poi.uDate) {
                $scope.poiDate = Utils.dateFormat($scope.poi.uDate);
            } else {
                $scope.poiDate = '';
            }

            if (App.Temp.monthTaskType) {
                initCheckResult(2);
            } else {
                initCheckResult(1);
            }
            initPhotos();
            initTools();
        }

        /* 数据状态*/
        $scope.recordObject = {
            0: '无',
            1: '新增',
            2: '删除',
            3: '修改'
        };
        /* 鲜度验证*/
        $scope.freshObject = {
            0: '否',
            1: '是'
        };
        /* 审核状态*/
        $scope.statusObject = {
            1: '待作业',
            2: '待提交',
            3: '已提交'
        };
        /* 照片标识*/
        $scope.photoTypeOptions = [{
            id: 1,
            label: '全部'
        }, {
            id: 2,
            label: '当前作业季'
        }];
        /* 照片标识*/
        $scope.photoTagOptions = [{
            id: 1,
            label: '全貌'
        }, {
            id: 2,
            label: '水牌'
        }, {
            id: 3,
            label: '名称'
        }, {
            id: 4,
            label: '名片'
        }, {
            id: 5,
            label: '英文名'
        }, {
            id: 7,
            label: '产品全貌'
        }, {
            id: 100,
            label: '其他'
        }];
        $scope.photoTagType = 1;

        /* 预览active图片的缩略图*/
        $scope.showPreviewImg = function (img, index) {
            if (!img.originUrl) {
                return;
            }
            if ($scope.nowActiveIndex === index + 1) { // 解决双击照片后不显示的bug
                return;
            }
            $scope.nowActiveImg = img;
            $scope.nowActiveIndex = index + 1;

            var poiImage = document.getElementById('poiImage');
            if (!img.noimg) {
                if (poiImage) {
                    poiImage.dispatchEvent(new CustomEvent('wheelzoom.destroy'));
                }
                wheelzoom(poiImage);
            }
        };

        $scope.changePage = function (type) {
            if (type == 1) { // 上一页
                if ($scope.currentPage > 1) {
                    $scope.currentPage--;
                    getCurrentPagePhotos($scope.currentPage);
                }
            } else { // 下一页
                if ($scope.currentPage < Math.ceil($scope.poi.photos.length / 5)) { // 下一页
                    $scope.currentPage++;
                    getCurrentPagePhotos($scope.currentPage);
                }
            }
        };
        /* 删除照片*/
        $scope.deletePhoto = function (activePhoto) {
            if (!activePhoto.thumbnailUrl) {
                return;
            }

            for (var i = 0; i < $scope.poi.photos.length; i++) { // 从$scope.poi的photo中删除
                var photo = $scope.poi.photos[i];
                if (photo.fccPid == activePhoto.fccPid) {
                    $scope.poi.photos.splice(i, 1);
                    break;
                }
            }

            var countPages = Math.ceil($scope.poi.photos.length / 5);
            getCurrentPagePhotos(countPages);
        };
        // 切换显示全部和当前作业季
        $scope.changePhotoType = function () {
            $scope.jobSeasons = [];
            // 显示全部照片
            if ($scope.picType === 1) {
                $scope.allPhotos = true;
                initPhotos();
            } else {
                $scope.allPhotos = false;
                var param = {
                    rowkeys: []
                };
                for (var i = 0; i < $scope.tempPhotos.length; i++) {
                    param.rowkeys.push($scope.tempPhotos[i].fccPid);
                }
                dsFcc.getPhotosByRowkey(param).then(function (data) {
                    if (data.length) {
                        for (var j = 0; j < data.length; j++) {
                            if (data[j].version == 1) {
                                $scope.jobSeasons.push(new FM.dataApi.IxPoiPhoto({
                                    fccPid: data[j].rowkey
                                }));
                            }
                        }
                        /* tips图片当前页数*/
                        $scope.currentPage = 1;
                        /* 当前选中图片*/
                        $scope.nowActiveImg = $scope.jobSeasons[0];
                        $scope.nowActiveIndex = 0;
                        if ($scope.jobSeasons.length) {
                            $scope.nowActiveIndex = 1;
                        }
                    }
                });
            }
        };

        $scope.creatPNG = function (image) {
            $scope.cancelAll(); // 先把已有的删掉
            if (image && image.fccPid) {
                var param = {
                    newFccPid: image.fccPid,
                    oldFccPid: '',
                    flag: 1
                };
                dsFcc.setPhoto(param).then(function (data) {
                    if (data.PID) {
                        var img = new FM.dataApi.IxPoiPhoto({
                            fccPid: data.PID,
                            poiPid: $scope.poi.pid,
                            rowId: '',
                            memo: image.fccPid,
                            tag: 7
                        });
                        image.tagFlag = true;
                        $scope.poi.photos.push(img);
                    }
                });
            }
        };
        $scope.cancelAll = function () {
            for (var i = 0; i < $scope.poi.photos.length; i++) {
                if ($scope.poi.photos[i].tag === 7) {
                    for (var j = 0; j < $scope.tempPhotos.length; j++) {
                        if ($scope.tempPhotos[j].fccPid === $scope.poi.photos[i].memo) {
                            $scope.tempPhotos[j].tagFlag = false;
                            $scope.poi.photos.splice(i, 1);
                            break;
                        }
                    }
                }
            }
        };

        $scope.rotateBigImg = function (item, flag) {
            if (item && item.fccPid) {
                var param = {
                    fccPid: item.fccPid,
                    flag: flag
                };
                $scope.showProgress = true;
                dsFcc.rotatePhoto(param).then(function (data) {
                    $scope.showProgress = false;
                    if (data && data.data) {
                        if (data.data.message === '旋转成功') {
                            var timestamp = new Date().getTime();
                            var thumbUrl = item.thumbnailUrl.split('&_time=')[0];
                            var originUrl = item.originUrl.split('&_time=')[0];
                            item.thumbnailUrl = thumbUrl + '&_time="' + timestamp + '"';
                            item.originUrl = originUrl + '&_time="' + timestamp + '"';
                        }
                    }
                });
            }
        };

        /**
         * 从服务获取数据
         * @param param
         * @param flag 1--上一页 2--下一页
         */
        var getDataFormServer = function (param, flag) {
            dsEdit.getPoiList(param).then(function (data) {
                if (data) {
                    if (data.rows.length) {
                        var pids = [];
                        for (var i = 0; i < data.rows.length; i++) {
                            pids.push(data.rows[i].pid);
                        }
                        sessionStorage.setItem(poiType, pids);
                        sessionStorage.setItem('poiDataListParam', [param.type, param.pageNum, param.pageSize, data.total]);
                        var poiInfo = {
                            pid: parseInt(data.rows[0].pid, 0),
                            geoLiveType: 'IXPOI'
                        };
                        if (flag == 1) { // 上一页是需要取最后一条数据
                            poiInfo.pid = parseInt(data.rows[data.rows.length - 1].pid, 0);
                        }
                        sessionStorage.setItem('listSelectedPid', poiInfo.pid); // 用于判断当前编辑的是地图上选择的还是列表中的
                        $scope.$emit('ObjectSelected', {
                            feature: poiInfo
                        });
                    } else {
                        var msg = '';
                        if (flag == 1) {
                            msg = '已经是第一条数据了！';
                        } else {
                            msg = '已经是最后一条数据了！';
                        }
                        swal('注意', msg, 'info');
                    }
                }
            });
        };

        $scope.getPreInfo = function () {
            if (!sessionStorage.getItem(poiType)) {
                swal('注意', '没有找到上一条数据！', 'info');
                return;
            }
            var poiPids = sessionStorage.getItem(poiType).split(',');
            var pid = sessionStorage.getItem('listSelectedPid');
            var index = poiPids.indexOf(pid);
            if (index > 0) {
                var feature = {
                    pid: parseInt(poiPids[index - 1], 0),
                    geoLiveType: 'IXPOI'
                };
                sessionStorage.setItem('listSelectedPid', feature.pid); // 用于判断当前编辑的是地图上选择的还是列表中的
                $scope.$emit('ObjectSelected', {
                    feature: feature
                });
            } else if (index === 0) {
                swal('注意', '已经是第一条数据了！', 'info');
            } else {
                swal('注意', '没有找到上一条数据！', 'info');
            }
        };
        $scope.getNextInfo = function () {
            if (!sessionStorage.getItem(poiType)) {
                swal('注意', '没有找到下一条数据！', 'info');
                return;
            }
            var poiPids = sessionStorage.getItem(poiType).split(',');
            var pid = sessionStorage.getItem('listSelectedPid');
            var index = poiPids.indexOf(pid);
            if (index > -1 && index !== (poiPids.length - 1)) {
                var feature = {
                    pid: parseInt(poiPids[index + 1], 0),
                    geoLiveType: 'IXPOI'
                };
                sessionStorage.setItem('listSelectedPid', feature.pid); // 用于判断当前编辑的是地图上选择的还是列表中的
                $scope.$emit('ObjectSelected', {
                    feature: feature
                });
            } else if (index === (poiPids.length - 1)) {
                swal('注意', '已经是最后一条数据了！', 'info');
            } else {
                swal('注意', '没有找到下一条数据！', 'info');
            }
        };

        $scope.showPoi = function (item) {
            $scope.$emit('ObjectSelected', {
                feature: {
                    pid: item.pid,
                    geoLiveType: 'IXPOI'
                }
            });
        };

        $scope.$on('PoiLeftViewPanelReload', initData);
    }
]);
