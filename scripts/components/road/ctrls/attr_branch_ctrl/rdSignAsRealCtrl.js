/**
 * Created by wangmingdong on 2016/6/23.
 */
var namesOfBranch = angular.module('app');
namesOfBranch.controller('SignAsRealOfBranchCtrl', ['$scope', '$timeout', '$ocLazyLoad', 'dsEdit', 'appPath', 'dsMeta', '$popover', '$q', function ($scope, $timeout, $ocLazyLoad, dsEdit, appPath, dsMeta, $popover, $q) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var oldPatCode;
    var originSvgCode;
    var timer;

    $scope.divergenceIds = objCtrl.data;
    var svgPopover = $popover($('#signAsRealPanel'), {
        trigger: 'manual',
        container: '#signAsRealPanel',
        placement: 'left',
        animation: 'am-flip-x',
        autoClose: false,
        templateUrl: '../../scripts/components/road/tpls/attr_branch_tpl/rdSvgShowTpl.html'
    });

    // 加载svg图
    var loadSvgPic = function () {
        svgPopover.$promise.then(function () {
            $timeout(function () {
                svgPopover.show();
                if ($scope.diverObj.signasreals[0].svgfileCode) {
                    $scope.initSvgShow($scope.diverObj.signasreals[0].svgfileCode);
                }
                $scope.$apply();
            }, 100);
        });
    };
    $scope.initializeData = function () {
        $scope.diverObj = objCtrl.data;
        loadSvgPic();
    };

    // 关闭popover
    var controlPopover = function (e) {
        if (angular.element(e.target).closest('#roadRightEditPanel').length == 0) {
            svgPopover.$promise.then(svgPopover.hide);
        } else {
            if (!$('#signAsRealPanel div').length) {
                loadSvgPic();
            }
        }
    };
    /* 点击关系类型*/
    $scope.switchRelType = function (code) {
        $scope.diverObj.relationshipType = code;
    };
    /* 点击箭头图标志*/
    $scope.switchArrowType = function (code) {
        $scope.diverObj.signasreals[0].arrowFlag = code;
    };
    /* 根据id获取箭头图图片*/
    $scope.getArrowPic = function (id) {
        var params = {
            id: id + ''
        };
        return dsMeta.getArrowImg(JSON.stringify(params));
    };
    /* 根据code获取svg图片 */
    $scope.getSVGPicByCode = function (code) {
        var params = {
            id: code + ''
        };
        return dsMeta.getSvgImg(JSON.stringify(params));
    };

    // 初始化svg显示
    $scope.initSvgShow = function (code) {
        var params = {
            id: code + ''
        };
        dsMeta.getSvgImg(params).then(function (data) {
            var draw = SVG('svgDrawing').size(400, 350);
            if (data.errcode == -1) {
                return;
            }
            draw.each(function (i, children) {
                this.remove();
            }, true);
            draw.svg(data);
            $scope.highlightArrow();
            SVG.select('#svgDrawing svg').width(400);
            SVG.select('#svgDrawing svg').height(300);
        });
    };
    // 高亮箭头图
    $scope.highlightArrow = function () {
        var arrowCodeArray = $scope.diverObj.signasreals[0].arrowCode.split('|');
        if (arrowCodeArray.length) {
            SVG.select('text').fill('#FFF');
            SVG.select('path').fill('#008800');
            SVG.select('polygon').fill('#FFF');
            for (var i = 0; i < arrowCodeArray.length; i++) {
                if (new RegExp('^b{1}[0-9]{1}p{1}[0-9]{1}$').test(arrowCodeArray[i])) {
                    var bSvg = '#b' + arrowCodeArray[i].split('p')[0].split('b')[1];
                    var pSvg = '#p' + arrowCodeArray[i].split('p')[1];
                    SVG.select(bSvg + ' ' + pSvg + ' text').fill('red');
                    SVG.select(bSvg + ' ' + pSvg + ' path').fill('red');
                    SVG.select(bSvg + ' ' + pSvg + ' polygon').fill('red');
                }
            }
        } else {
            SVG.select('text').fill('#FFF');
            SVG.select('path').fill('#008800');
            SVG.select('polygon').fill('#FFF');
        }
    };
    $scope.picNowNum = 0;
    $scope.getPicsData = function () {
        $scope.loadText = 'loading...';
        $scope.showPicLoading = true;
        $scope.picPageNum = 0;
        if ($scope.picNowNum == 0) {
            $scope.picNowNum = 1;
        }
        $scope.picPageNum = $scope.picNowNum - 1;
        var params = {
            name: $scope.diverObj.signasreals[0].arrowCode,
            pageNum: $scope.picPageNum,
            pageSize: 6
        };
        dsMeta.getArrowImgGroup(params).then(function (data) {
            if (data.errcode == 0) {
                if (data.data.total == 0) {
                    $scope.loadText = '搜不到数据';
                    $scope.pictures = [];
                } else {
                    $scope.showPicLoading = false;
                    $scope.pictures = data.data.data;
                    $scope.picTotal = Math.ceil(data.data.total / 6);
                }
            }
        });
    };
    $scope.getSVGPicsData = function () {
        $scope.loadText = 'loading...';
        $scope.showPicLoading = true;
        $scope.picPageNum = 0;
        if ($scope.picNowNum == 0) {
            $scope.picNowNum = 1;
        }
        $scope.picPageNum = $scope.picNowNum - 1;
        var params = {
            name: $scope.diverObj.signasreals[0].svgfileCode,
            pageNum: $scope.picPageNum,
            pageSize: 6
        };
        dsMeta.getSVGImgGroup(params).then(function (data) {
            if (data.errcode == 0) {
                if (data.data.total == 0) {
                    $scope.loadText = '搜不到数据';
                    $scope.pictures = [];
                } else {
                    $scope.showPicLoading = false;
                    $scope.pictures = data.data.data;
                    $scope.picTotal = Math.ceil(data.data.total / 6);
                }
            }
        });
    };
    /* 输入箭头图代码显示选择图片界面*/
    $scope.showPicSelect = function (code) {
        // $scope.showImgData = false;
        var bool = false;
        code = code.toLowerCase();
        if ($.trim(code) == '') {
            $scope.diverObj.signasreals[0].backimageCode = '';
        }
        $scope.diverObj.signasreals[0].arrowCode = Utils.ToCDB(code);
        $timeout(function () {
            if (!new RegExp('^[0-9bpBP|]*$').test(code.substr(-1, 1))) {
                $scope.diverObj.signasreals[0].arrowCode = code.substring(0, code.length - 1);
                $scope.$apply();
                bool = false;
            } else {
                $scope.highlightArrow();
                bool = true;
            }
            return bool;
        });
    };
    /* 输入svg图查询列表 */
    $scope.showSVGPicSelect = function () {
        if (timer) {
            $timeout.cancel(timer);
        }
        if (!new RegExp('^[S][A-Z0-9]{0,11}$').test($scope.diverObj.signasreals[0].svgfileCode)) {
            $scope.diverObj.signasreals[0].svgfileCode = originSvgCode;
            return;
        }
        $scope.showSVGImg = false;
        timer = $timeout(function () {
            if ($.trim($scope.diverObj.signasreals[0].svgfileCode) == '') {
                $scope.diverObj.signasreals[0].backimageCode = '';
            }
            $scope.diverObj.signasreals[0].svgfileCode = $.trim(Utils.ToCDB($scope.diverObj.signasreals[0].svgfileCode));
            if ($scope.diverObj.signasreals[0].svgfileCode.length > 0) {
                originSvgCode = $scope.diverObj.signasreals[0].svgfileCode;
                $scope.picNowNum = 1;
                $scope.getSVGPicsData();
                // $scope.arrowMapShow = $scope.getArrowPic($scope.diverObj.signasreals[0].svgfileCode);
                // $scope.backimageCodeSrc = $scope.getArrowPic($scope.diverObj.signasreals[0].backimageCode);
                if ($.trim($scope.diverObj.signasreals[0].svgfileCode) == '') {
                    $scope.showSVGImg = false;
                } else {
                    $scope.showSVGImg = true;
                }
                $scope.$apply();
            }
        });
    };
    /* svg图号校验*/
    function testSVGReg(str) {
        var bool = false;
        if (str.length == 1) {
            bool = new RegExp('^[S]+$').test(str);
        } else {
            bool = str.length < 13;
        }
        return bool;
    }
    /* 输入svg图号过滤*/
    $scope.changeSVGCode = function () {
        if (!testSVGReg($scope.diverObj.signasreals[0].svgfileCode)) {
            $scope.diverObj.signasreals[0].svgfileCode = $scope.diverObj.signasreals[0].svgfileCode.substring(0, $scope.diverObj.signasreals[0].svgfileCode.length - 1);
        }
    };
    /* 箭头图代码点击下一页*/
    $scope.picNext = function (type) {
        $scope.picNowNum += 1;
        if (type == 1) {
            $scope.getPicsData();
        } else {
            $scope.getSVGPicsData();
        }
    };
    /* 箭头图代码点击上一页*/
    $scope.picPre = function (type) {
        $scope.picNowNum -= 1;
        if (type == 1) {
            $scope.getPicsData();
        } else {
            $scope.getSVGPicsData();
        }
    };
    /* 点击选中的图片*/
    $scope.selectPicCode = function (code) {
        $scope.diverObj.signasreals[0].arrowCode = code;
        $scope.diverObj.signasreals[0].backimageCode = '0' + $.trim($scope.diverObj.signasreals[0].arrowCode).substr(1);
        $scope.arrowMapShow = $scope.getArrowPic(code);
        $scope.showImgData = false;
        oldPatCode = $scope.diverObj.signasreals[0].backimageCode;
    };
    /* 点击选中的SVG图片*/
    $scope.selectSVGPicCode = function (pic) {
        $scope.diverObj.signasreals[0].svgfileCode = pic.fileName;
        $timeout(function () {
            $scope.initSvgShow(pic.fileName);
            $scope.$apply();
        });
        // $scope.$broadcast('refreshSvgPic', pic.fileName);
        $scope.showSVGImg = false;
    };
    /* 点击关闭隐藏选择图片界面*/
    $scope.hidePicSelect = function (e) {
        $scope.showImgData = false;
    };
    /* 点击关闭隐藏选择SVG图片界面*/
    $scope.hideSVGPicSelect = function (e) {
        $scope.showSVGImg = false;
    };
    /* 修改模式图号*/
    $scope.changeBackimageCode = function () {
        if ($scope.diverObj.signasreals[0].backimageCode.charAt(0) == oldPatCode.charAt(0) ||
            $scope.diverObj.signasreals[0].backimageCode.length > oldPatCode.length ||
            ($scope.diverObj.signasreals[0].backimageCode.length + 1 <= oldPatCode.length && $scope.diverObj.signasreals[0].backimageCode.length + 1 != oldPatCode.length)) {
            $scope.diverObj.signasreals[0].backimageCode = oldPatCode;
        }
    };
    /* 关系类型*/
    $scope.relationType = [
        { code: 1, label: '路口' },
        { code: 2, label: '线线' }
    ];
    /* 初始化信息显示*/
    $scope.initDiver = function () {
        $scope.initializeData();
        var dObj = $scope.diverObj;
        oldPatCode = $scope.diverObj.signasreals[0] ? $scope.diverObj.signasreals[0].backimageCode : '';
        /* 经过线*/
        if (dObj) {
            /* 模式图信息条数*/
            if (dObj.signasreals.length > 0) {
                if ($scope.diverObj.signasreals[0].arrowCode) {
                    $scope.arrowMapShow = $scope.getArrowPic($scope.diverObj.signasreals[0].arrowCode);
                }
                $scope.diverObj.signasreals[0].backimageCode = '0' + $.trim($scope.diverObj.signasreals[0].arrowCode).substr(1);
                // $scope.backimageCodeSrc = $scope.getArrowPic($scope.diverObj.signasreals[0].backimageCode);
                /* 分歧号码*/
                $scope.branchPid = dObj.signasreals[0].branchPid;
            }
        }
    };

    // 事件绑定到body上，点击面板之外则关闭实景看板图
    document.body.addEventListener('click', controlPopover);

    $scope.$on('ReloadData', $scope.initDiver);

    $scope.$on('$destroy', function () {
        document.body.removeEventListener('click', controlPopover);
    });
}]);
