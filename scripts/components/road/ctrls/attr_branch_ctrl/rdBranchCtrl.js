/**
 * Created by liwanchong on 2016/2/29.
 */
var namesOfBranch = angular.module('app');
namesOfBranch.controller('namesOfBranchCtrl', ['$scope', '$timeout', '$ocLazyLoad', 'dsEdit', 'appPath', 'dsMeta', function ($scope, $timeout, $ocLazyLoad, dsEdit, appPath, dsMeta) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var layerCtrl = fastmap.uikit.LayerController();
    var rdBranch = layerCtrl.getLayerById('relationData');
    var eventController = fastmap.uikit.EventController();
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var selectCtrl = fastmap.uikit.SelectController();
    var oldPatCode;

    $scope.refreshNames = function () {
        $scope.diverObj.details[0].names = [];
        for (var i = 0, len = $scope.nameGroup.length; i < len; i++) {
            for (var j = 0, le = $scope.nameGroup[i].length; j < le; j++) {
                $scope.diverObj.details[0].names.unshift($scope.nameGroup[i][j]);
            }
        }
    };
    $scope.initializeData = function () {
        // 如果是3d分歧则关系类型改为3
        if (shapeCtrl.editFeatType == 1 || shapeCtrl.editFeatType == 3) {
            // objCtrl.data.details[0].branchType = 3;
            $('[data-toggle="tooltip"]').tooltip();
        }

//        $scope.divergenceIds = objCtrl.data;
//        $scope.diverObj = $scope.divergenceIds;
        $scope.diverObj = objCtrl.data;
        objCtrl.setOriginalData(objCtrl.data.getIntegrate());
        objCtrl.namesInfo = objCtrl.data.details[0].names;
        if ($scope.diverObj.details[0].branchType == 3 || $scope.diverObj.details[0].branchType == 4) {
            $scope.diverObj.details[0].estabType = 9;
            $scope.diverObj.details[0].nameKind = 9;
        }
        // else {
        //     $scope.diverObj.details[0].estabType = 0;
        //     $scope.diverObj.details[0].nameKind = 0;
        // }

        // 回到初始状态（修改数据后样式会改变，新数据时让它回到初始的样式）
        selectCtrl.onSelected({// 记录选中点信息
            geometry: objCtrl.data,
            id: objCtrl.data.pid
        });
        if ($scope.diverObj.details[0].patternCode) {
            $scope.firstLetter = $scope.diverObj.details[0].patternCode.substring(0, 1);
            $scope.rightLetter = $scope.diverObj.details[0].patternCode.substring(1);
        }
    };
    /* 正则检测实景图输入是否正确*/
    function testRegExp(str) {
        var bool = false;
        if (str.length < 12) {
            bool = new RegExp('^[a-f0-9]*$').test(str.substr(-1, 1));
        } else {
            bool = false;
        }
        return bool;
    }

    /* 根据数据中对象某一属性值排序*/
    function compare(propertyName) {
        return function (object1, object2) {
            var value1 = object1[propertyName];
            var value2 = object2[propertyName];
            var result;
            if (value1 < value2) {
                result = -1;
            } else if (value1 > value2) {
                result = 1;
            } else {
                result = 0;
            }
            return result;
        };
    }

    /* 全角转半角*/
    function CtoH(str) {
        var result = '';
        for (var i = 0; i < str.length; i++) {
            if (str.charCodeAt(i) == 12288) {
                result += String.fromCharCode(str.charCodeAt(i) - 12256);
                continue;
            }
            if (str.charCodeAt(i) > 65280 && str.charCodeAt(i) < 65375) {
                result += String.fromCharCode(str.charCodeAt(i) - 65248);
            } else {
                result += String.fromCharCode(str.charCodeAt(i));
            }
        }
        return result;
    }

    // 自动计算声音方向
    function calculationVoiceDirect(arrow, pattern) {
        var voiceDirect = 0;
        var arrowCode = arrow + '';
        var patternCode = pattern + '';
        if (arrowCode == '') {
            return 0;
        }
        if (patternCode.indexOf('8022') == 0) {
            if (arrowCode.indexOf('0') == 0) {
                voiceDirect = 0;
            } else if (arrowCode.indexOf('1') == 0) {
                voiceDirect = 2;
            } else if (arrowCode.indexOf('2') == 0) {
                voiceDirect = 9;
            } else if (arrowCode.indexOf('3') == 0) {
                voiceDirect = 9;
            } else {
                voiceDirect = 9;
            }
        }
        if (patternCode.indexOf('8021') == 0) {
            if (arrowCode.indexOf('0') == 0) {
                voiceDirect = 5;
            } else if (arrowCode.indexOf('1') == 0) {
                voiceDirect = 0;
            } else if (arrowCode.indexOf('2') == 0) {
                voiceDirect = 9;
            } else if (arrowCode.indexOf('3') == 0) {
                voiceDirect = 9;
            } else {
                voiceDirect = 9;
            }
        }
        if (patternCode.indexOf('8023') == 0) {
            if (arrowCode.indexOf('0') == 0) {
                voiceDirect = 5;
            } else if (arrowCode.indexOf('1') == 0) {
                voiceDirect = 2;
            } else if (arrowCode.indexOf('2') == 0) {
                voiceDirect = 9;
            } else if (arrowCode.indexOf('3') == 0) {
                voiceDirect = 9;
            } else {
                voiceDirect = 9;
            }
        }
        if (patternCode.indexOf('80ff') == 0) {
            if (arrowCode.indexOf('0') == 0) {
                voiceDirect = 0;
            } else if (arrowCode.indexOf('1') == 0) {
                voiceDirect = 2;
            } else if (arrowCode.indexOf('2') == 0) {
                voiceDirect = 2;
            } else if (arrowCode.indexOf('3') == 0) {
                voiceDirect = 2;
            } else {
                voiceDirect = 9;
            }
        }
        if (patternCode.indexOf('83') == 0) {
            if (arrowCode.indexOf('0') == 0) {
                voiceDirect = 0;
            } else if (arrowCode.indexOf('1') == 0) {
                voiceDirect = 2;
            } else if (arrowCode.indexOf('2') == 0) {
                voiceDirect = 2;
            } else if (arrowCode.indexOf('3') == 0) {
                voiceDirect = 2;
            } else {
                voiceDirect = 9;
            }
        }
        if (patternCode.indexOf('84') == 0) {
            if (arrowCode.indexOf('0') == 0) {
                voiceDirect = 0;
            } else if (arrowCode.indexOf('1') == 0) {
                voiceDirect = 2;
            } else if (arrowCode.indexOf('2') == 0) {
                voiceDirect = 2;
            } else if (arrowCode.indexOf('3') == 0) {
                voiceDirect = 2;
            } else {
                voiceDirect = 9;
            }
        }
        if (patternCode.indexOf('8a') == 0) {
            if (arrowCode.indexOf('0') == 0) {
                voiceDirect = 0;
            } else if (arrowCode.indexOf('1') == 0) {
                voiceDirect = 2;
            } else if (arrowCode.indexOf('2') == 0) {
                voiceDirect = 2;
            } else if (arrowCode.indexOf('3') == 0) {
                voiceDirect = 2;
            } else {
                voiceDirect = 9;
            }
        }
        if (patternCode.indexOf('80ff0005') == 0) {
            if (arrowCode.indexOf('0') == 0) {
                voiceDirect = 5;
            } else if (arrowCode.indexOf('1') == 0) {
                voiceDirect = 0;
            } else if (arrowCode.indexOf('2') == 0) {
                voiceDirect = 2;
            } else if (arrowCode.indexOf('3') == 0) {
                voiceDirect = 9;
            } else {
                voiceDirect = 9;
            }
        }
        if (patternCode.indexOf('80ff0007') == 0) {
            if (arrowCode.indexOf('0') == 0) {
                voiceDirect = 5;
            } else if (arrowCode.indexOf('1') == 0) {
                voiceDirect = 0;
            } else if (arrowCode.indexOf('2') == 0) {
                voiceDirect = 2;
            } else if (arrowCode.indexOf('3') == 0) {
                voiceDirect = 9;
            } else {
                voiceDirect = 9;
            }
        }
        if (patternCode.indexOf('80ff000a') == 0) {
            if (arrowCode.indexOf('0') == 0) {
                voiceDirect = 5;
            } else if (arrowCode.indexOf('1') == 0) {
                voiceDirect = 2;
            } else if (arrowCode.indexOf('2') == 0) {
                voiceDirect = 9;
            } else if (arrowCode.indexOf('3') == 0) {
                voiceDirect = 9;
            } else {
                voiceDirect = 9;
            }
        }
        if (patternCode.indexOf('80ff000c') == 0) {
            if (arrowCode.indexOf('0') == 0) {
                voiceDirect = 5;
            } else if (arrowCode.indexOf('1') == 0) {
                voiceDirect = 0;
            } else if (arrowCode.indexOf('2') == 0) {
                voiceDirect = 9;
            } else if (arrowCode.indexOf('3') == 0) {
                voiceDirect = 9;
            } else {
                voiceDirect = 9;
            }
        }
        if (patternCode.indexOf('80ff000e') == 0) {
            if (arrowCode.indexOf('0') == 0) {
                voiceDirect = 5;
            } else if (arrowCode.indexOf('1') == 0) {
                voiceDirect = 2;
            } else if (arrowCode.indexOf('2') == 0) {
                voiceDirect = 9;
            } else if (arrowCode.indexOf('3') == 0) {
                voiceDirect = 9;
            } else {
                voiceDirect = 9;
            }
        }
        if (patternCode.indexOf('80ff0015') == 0) {
            if (arrowCode.indexOf('0') == 0) {
                voiceDirect = 0;
            } else if (arrowCode.indexOf('1') == 0) {
                voiceDirect = 0;
            } else if (arrowCode.indexOf('2') == 0) {
                voiceDirect = 2;
            } else if (arrowCode.indexOf('3') == 0) {
                voiceDirect = 9;
            } else {
                voiceDirect = 9;
            }
        }
        if (patternCode.indexOf('83311011') == 0) {
            if (arrowCode.indexOf('0') == 0) {
                voiceDirect = 0;
            } else if (arrowCode.indexOf('1') == 0) {
                voiceDirect = 5;
            } else if (arrowCode.indexOf('2') == 0) {
                voiceDirect = 2;
            } else if (arrowCode.indexOf('3') == 0) {
                voiceDirect = 9;
            } else {
                voiceDirect = 9;
            }
        }
        if (patternCode.indexOf('83313021') == 0) {
            if (arrowCode.indexOf('0') == 0) {
                voiceDirect = 0;
            } else if (arrowCode.indexOf('1') == 0) {
                voiceDirect = 5;
            } else if (arrowCode.indexOf('2') == 0) {
                voiceDirect = 2;
            } else if (arrowCode.indexOf('3') == 0) {
                voiceDirect = 9;
            } else {
                voiceDirect = 9;
            }
        }
        if (patternCode.indexOf('83313032') == 0) {
            if (arrowCode.indexOf('0') == 0) {
                voiceDirect = 0;
            } else if (arrowCode.indexOf('1') == 0) {
                voiceDirect = 5;
            } else if (arrowCode.indexOf('2') == 0) {
                voiceDirect = 2;
            } else if (arrowCode.indexOf('3') == 0) {
                voiceDirect = 9;
            } else {
                voiceDirect = 9;
            }
        }
        if (patternCode.indexOf('83324031') == 0) {
            if (arrowCode.indexOf('0') == 0) {
                voiceDirect = 0;
            } else if (arrowCode.indexOf('1') == 0) {
                voiceDirect = 5;
            } else if (arrowCode.indexOf('2') == 0) {
                voiceDirect = 2;
            } else if (arrowCode.indexOf('3') == 0) {
                voiceDirect = 9;
            } else {
                voiceDirect = 9;
            }
        }
        if (patternCode.indexOf('833a1011') == 0) {
            if (arrowCode.indexOf('0') == 0) {
                voiceDirect = 0;
            } else if (arrowCode.indexOf('1') == 0) {
                voiceDirect = 5;
            } else if (arrowCode.indexOf('2') == 0) {
                voiceDirect = 2;
            } else if (arrowCode.indexOf('3') == 0) {
                voiceDirect = 9;
            } else {
                voiceDirect = 9;
            }
        }
        if (patternCode.indexOf('833a3021') == 0) {
            if (arrowCode.indexOf('0') == 0) {
                voiceDirect = 0;
            } else if (arrowCode.indexOf('1') == 0) {
                voiceDirect = 5;
            } else if (arrowCode.indexOf('2') == 0) {
                voiceDirect = 2;
            } else if (arrowCode.indexOf('3') == 0) {
                voiceDirect = 9;
            } else {
                voiceDirect = 9;
            }
        }
        if (patternCode.indexOf('833b2011') == 0) {
            if (arrowCode.indexOf('0') == 0) {
                voiceDirect = 0;
            } else if (arrowCode.indexOf('1') == 0) {
                voiceDirect = 5;
            } else if (arrowCode.indexOf('2') == 0) {
                voiceDirect = 2;
            } else if (arrowCode.indexOf('3') == 0) {
                voiceDirect = 9;
            } else {
                voiceDirect = 9;
            }
        }
        if (patternCode.indexOf('833b5232') == 0) {
            if (arrowCode.indexOf('0') == 0) {
                voiceDirect = 0;
            } else if (arrowCode.indexOf('1') == 0) {
                voiceDirect = 5;
            } else if (arrowCode.indexOf('2') == 0) {
                voiceDirect = 2;
            } else if (arrowCode.indexOf('3') == 0) {
                voiceDirect = 9;
            } else {
                voiceDirect = 9;
            }
        }
        if (patternCode.indexOf('83412011') == 0) {
            if (arrowCode.indexOf('0') == 0) {
                voiceDirect = 0;
            } else if (arrowCode.indexOf('1') == 0) {
                voiceDirect = 2;
            } else if (arrowCode.indexOf('2') == 0) {
                voiceDirect = 5;
            } else if (arrowCode.indexOf('3') == 0) {
                voiceDirect = 9;
            } else {
                voiceDirect = 9;
            }
        }
        if (patternCode.indexOf('83413022') == 0) {
            if (arrowCode.indexOf('0') == 0) {
                voiceDirect = 0;
            } else if (arrowCode.indexOf('1') == 0) {
                voiceDirect = 2;
            } else if (arrowCode.indexOf('2') == 0) {
                voiceDirect = 5;
            } else if (arrowCode.indexOf('3') == 0) {
                voiceDirect = 9;
            } else {
                voiceDirect = 9;
            }
        }
        if (patternCode.indexOf('83413032') == 0) {
            if (arrowCode.indexOf('0') == 0) {
                voiceDirect = 0;
            } else if (arrowCode.indexOf('1') == 0) {
                voiceDirect = 2;
            } else if (arrowCode.indexOf('2') == 0) {
                voiceDirect = 5;
            } else if (arrowCode.indexOf('3') == 0) {
                voiceDirect = 9;
            } else {
                voiceDirect = 9;
            }
        }
        if (patternCode.indexOf('83512011') == 0) {
            if (arrowCode.indexOf('0') == 0) {
                voiceDirect = 0;
            } else if (arrowCode.indexOf('1') == 0) {
                voiceDirect = 5;
            } else if (arrowCode.indexOf('2') == 0) {
                voiceDirect = 5;
            } else if (arrowCode.indexOf('3') == 0) {
                voiceDirect = 9;
            } else {
                voiceDirect = 9;
            }
        }
        if (patternCode.indexOf('83523012') == 0) {
            if (arrowCode.indexOf('0') == 0) {
                voiceDirect = 0;
            } else if (arrowCode.indexOf('1') == 0) {
                voiceDirect = 5;
            } else if (arrowCode.indexOf('2') == 0) {
                voiceDirect = 5;
            } else if (arrowCode.indexOf('3') == 0) {
                voiceDirect = 9;
            } else {
                voiceDirect = 9;
            }
        }
        if (patternCode.indexOf('83523022') == 0) {
            if (arrowCode.indexOf('0') == 0) {
                voiceDirect = 0;
            } else if (arrowCode.indexOf('1') == 0) {
                voiceDirect = 5;
            } else if (arrowCode.indexOf('2') == 0) {
                voiceDirect = 5;
            } else if (arrowCode.indexOf('3') == 0) {
                voiceDirect = 9;
            } else {
                voiceDirect = 9;
            }
        }
        if (patternCode.indexOf('83524422') == 0) {
            if (arrowCode.indexOf('0') == 0) {
                voiceDirect = 0;
            } else if (arrowCode.indexOf('1') == 0) {
                voiceDirect = 5;
            } else if (arrowCode.indexOf('2') == 0) {
                voiceDirect = 5;
            } else if (arrowCode.indexOf('3') == 0) {
                voiceDirect = 9;
            } else {
                voiceDirect = 9;
            }
        }
        if (patternCode.indexOf('835b2012') == 0) {
            if (arrowCode.indexOf('0') == 0) {
                voiceDirect = 0;
            } else if (arrowCode.indexOf('1') == 0) {
                voiceDirect = 5;
            } else if (arrowCode.indexOf('2') == 0) {
                voiceDirect = 5;
            } else if (arrowCode.indexOf('3') == 0) {
                voiceDirect = 9;
            } else {
                voiceDirect = 9;
            }
        }
        if (patternCode.indexOf('83613032') == 0) {
            if (arrowCode.indexOf('0') == 0) {
                voiceDirect = 5;
            } else if (arrowCode.indexOf('1') == 0) {
                voiceDirect = 5;
            } else if (arrowCode.indexOf('2') == 0) {
                voiceDirect = 2;
            } else if (arrowCode.indexOf('3') == 0) {
                voiceDirect = 9;
            } else {
                voiceDirect = 9;
            }
        }
        if (patternCode.indexOf('83622011') == 0) {
            if (arrowCode.indexOf('0') == 0) {
                voiceDirect = 5;
            } else if (arrowCode.indexOf('1') == 0) {
                voiceDirect = 2;
            } else if (arrowCode.indexOf('2') == 0) {
                voiceDirect = 2;
            } else if (arrowCode.indexOf('3') == 0) {
                voiceDirect = 9;
            } else {
                voiceDirect = 9;
            }
        }
        if (patternCode.indexOf('8a340133') == 0) {
            if (arrowCode.indexOf('0') == 0) {
                voiceDirect = 2;
            } else if (arrowCode.indexOf('1') == 0) {
                voiceDirect = 5;
            } else if (arrowCode.indexOf('2') == 0) {
                voiceDirect = 5;
            } else if (arrowCode.indexOf('3') == 0) {
                voiceDirect = 9;
            } else {
                voiceDirect = 9;
            }
        }
        if (patternCode.indexOf('8a430122') == 0) {
            if (arrowCode.indexOf('0') == 0) {
                voiceDirect = 5;
            } else if (arrowCode.indexOf('1') == 0) {
                voiceDirect = 2;
            } else if (arrowCode.indexOf('2') == 0) {
                voiceDirect = 2;
            } else if (arrowCode.indexOf('3') == 0) {
                voiceDirect = 9;
            } else {
                voiceDirect = 9;
            }
        }
        if (patternCode.indexOf('8a430211') == 0) {
            if (arrowCode.indexOf('0') == 0) {
                voiceDirect = 5;
            } else if (arrowCode.indexOf('1') == 0) {
                voiceDirect = 2;
            } else if (arrowCode.indexOf('2') == 0) {
                voiceDirect = 2;
            } else if (arrowCode.indexOf('3') == 0) {
                voiceDirect = 9;
            } else {
                voiceDirect = 9;
            }
        }
        return voiceDirect;
    }
    $scope.setOriginalDataFunc = function () {
        objCtrl.setOriginalData(objCtrl.data.getIntegrate());
    };
    /* 点击关系类型*/
    $scope.switchRelType = function (code) {
        $scope.diverObj.relationshipType = code;
    };
    /* 点击箭头图标志*/
    $scope.switchArrowType = function (code) {
        $scope.diverObj.details[0].arrowFlag = code;
    };
    /* 根据id获取箭头图图片*/
    function getArrowPic(id) {
        var params = {
            id: id + ''
        };
        return dsMeta.getArrowImg(JSON.stringify(params));
    }

    $scope.picNowNum = 0;
    $scope.getPicsDate = function () {
        $scope.loadText = 'loading...';
        $scope.showPicLoading = true;
        $scope.picPageNum = 0;
        if ($scope.picNowNum == 0) {
            $scope.picNowNum = 1;
        }
        $scope.picPageNum = $scope.picNowNum - 1;
        var params = {
            name: $scope.diverObj.details[0].arrowCode,
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
    // 校验箭头图合法性
    $scope.validArrowCode = function () {
        switch ($scope.diverObj.details[0].branchType) {
            case 0:
                return new RegExp('^[0-2]*$').test($scope.diverObj.details[0].arrowCode.substr(0, 1));
            case 1:
                return new RegExp('^[0-2]*$').test($scope.diverObj.details[0].arrowCode.substr(0, 1));
            case 2:
                return new RegExp('^[0-2]*$').test($scope.diverObj.details[0].arrowCode.substr(0, 1));
            case 3:
                return new RegExp('^[ec]').test($scope.diverObj.details[0].arrowCode);
            case 4:
                return new RegExp('^[ecd]').test($scope.diverObj.details[0].arrowCode);
            default:
                return false;
        }
    };
    /* 输入箭头图代码显示选择图片界面*/
    $scope.showPicSelect = function () {
        if (!$scope.validArrowCode()) {
            $scope.diverObj.details[0].arrowCode = '';
        }
        $scope.showImgData = false;
        $timeout(function () {
            if ($.trim($scope.diverObj.details[0].arrowCode) == '') {
                $scope.diverObj.details[0].patternCode = '';
            }
            $scope.diverObj.details[0].arrowCode = CtoH($scope.diverObj.details[0].arrowCode);
            if ($scope.diverObj.details[0].branchType != 3 && !testRegExp($scope.diverObj.details[0].arrowCode)) {
                $scope.diverObj.details[0].arrowCode = $scope.diverObj.details[0].arrowCode.substring(0, $scope.diverObj.details[0].arrowCode.length - 1);
                $scope.$apply();
                return;
            }
            /* });
             $timeout(function () {*/
            if ($.trim($scope.diverObj.details[0].arrowCode).length > 0) {
                if ($scope.diverObj.details[0].branchType == 4) {
                    $scope.diverObj.details[0].patternCode = '7' + $.trim($scope.diverObj.details[0].arrowCode).substr(1);
                } else {
                    $scope.diverObj.details[0].patternCode = '8' + $.trim($scope.diverObj.details[0].arrowCode).substr(1);
                }
            }
            $scope.picNowNum = 1;
            $scope.getPicsDate();
            $scope.arrowMapShow = getArrowPic($scope.diverObj.details[0].arrowCode);
            $scope.patternCodeSrc = getArrowPic($scope.diverObj.details[0].patternCode);
            if ($scope.diverObj.details[0].branchType == 0 || $scope.diverObj.details[0].branchType == 1 || $scope.diverObj.details[0].branchType == 2) {
                $scope.diverObj.details[0].voiceDir = calculationVoiceDirect($scope.diverObj.details[0].arrowCode, $scope.diverObj.details[0].patternCode);
            }
            // 方面分歧清空箭头图号回归默认值2
            if ($scope.diverObj.details[0].branchType == 1 && !$scope.diverObj.details[0].arrowCode) {
                $scope.diverObj.details[0].voiceDir = 2;
            }
            if ($.trim($scope.diverObj.details[0].arrowCode) == '') {
                $scope.showImgData = false;
            } else {
                $scope.showImgData = true;
            }
            $scope.$apply();
        }, 1000);
    };

    /* 箭头图代码点击下一页*/
    $scope.picNext = function () {
        $scope.picNowNum += 1;
        $scope.getPicsDate();
    };
    /* 箭头图代码点击上一页*/
    $scope.picPre = function () {
        $scope.picNowNum -= 1;
        $scope.getPicsDate();
    };
    /* 改变当前箭头图的坐标位置*/
    function changeArrowPosition() {
        var $picMapShow = $('#picMapShow');
        $picMapShow.show();
    }

    /* 点击选中的图片*/
    $scope.selectPicCode = function (code, url) {
        $scope.diverObj.details[0].arrowCode = code;
        if ($scope.diverObj.details[0].branchType == 4) {
            $scope.diverObj.details[0].patternCode = '7' + $.trim($scope.diverObj.details[0].arrowCode).substr(1);
        } else {
            $scope.diverObj.details[0].patternCode = '8' + $.trim($scope.diverObj.details[0].arrowCode).substr(1);
        }
        $scope.arrowMapShow = url;
        $scope.patternCodeSrc = getArrowPic($scope.diverObj.details[0].patternCode);
        $scope.showImgData = false;
        oldPatCode = $scope.diverObj.details[0].patternCode;
        $scope.firstLetter = $scope.diverObj.details[0].patternCode.substring(0, 1);
        $scope.rightLetter = $scope.diverObj.details[0].patternCode.substring(1);
        if ($scope.diverObj.details[0].branchType == 0 || $scope.diverObj.details[0].branchType == 1 || $scope.diverObj.details[0].branchType == 2) {
            $scope.diverObj.details[0].voiceDir = calculationVoiceDirect($scope.diverObj.details[0].arrowCode, $scope.diverObj.details[0].patternCode);
        }
        changeArrowPosition();
    };
    /* 点击关闭隐藏选择图片界面*/
    $scope.hidePicSelect = function (e) {
        $scope.showImgData = false;
    };
    $scope.strClone = function (obj) {
        var o;
        if (obj.constructor == Object) {
            o = new obj.constructor();
        } else {
            o = new obj.constructor(obj.valueOf());
        }
        for (var key in obj) {
            if (o[key] != obj[key]) {
                if (typeof (obj[key]) === 'object') {
                    o[key] = $scope.clone(obj[key]);
                } else {
                    o[key] = obj[key];
                }
            }
        }
        o.toString = obj.toString;
        o.valueOf = obj.valueOf;
        return o;
    };


    /* 修改模式图号*/
    $scope.changePatternCode = function () {
        if ($scope.diverObj.details[0].patternCode.charAt(0) == oldPatCode.charAt(0) ||
            $scope.diverObj.details[0].patternCode.length > oldPatCode.length ||
            ($scope.diverObj.details[0].patternCode.length + 1 <= oldPatCode.length && $scope.diverObj.details[0].patternCode.length + 1 != oldPatCode.length)) {
            $scope.diverObj.details[0].patternCode = oldPatCode;
        }
        if ($scope.diverObj.details[0].branchType == 1) {
            if ($scope.diverObj.details[0].patternCode.charAt(0) != 5 && $scope.diverObj.details[0].patternCode.charAt(0) != 7 && $scope.diverObj.details[0].patternCode.charAt(0) != 8) {
                $scope.diverObj.details[0].patternCode = $scope.diverObj.details[0].patternCode.substring(1);
            }
        } else if ($scope.diverObj.details[0].branchType == 3) {
            if ($scope.diverObj.details[0].patternCode.charAt(0) == 5 || $scope.diverObj.details[0].patternCode.charAt(0) == 8) {
                $scope.diverObj.details[0].patternCode = $scope.diverObj.details[0].patternCode.substring(0, 1) + $scope.rightLetter;
            } else {
                $scope.diverObj.details[0].patternCode = $scope.firstLetter + $scope.rightLetter;
            }
        } else if ($scope.diverObj.details[0].branchType == 4) {
            if ($scope.diverObj.details[0].patternCode.charAt(0) == 7) {
                $scope.diverObj.details[0].patternCode = $scope.diverObj.details[0].patternCode.substring(0);
            } else {
                $scope.diverObj.details[0].patternCode = $scope.diverObj.details[0].patternCode.substring(1);
            }
        }
        if ($scope.diverObj.details[0].branchType == 0 || $scope.diverObj.details[0].branchType == 1 || $scope.diverObj.details[0].branchType == 2) {
            $scope.diverObj.details[0].voiceDir = calculationVoiceDirect($scope.diverObj.details[0].arrowCode, $scope.diverObj.details[0].patternCode);
        }
    };

    /* 当分歧类型变更时*/
    $scope.changeBranchType = function (type) {
        $scope.diverObj.details[0].branchType = type;
        if (type == 1 || type == 3) {
            $('[data-toggle="tooltip"]').tooltip();
        }
        /* if ($scope.diverObj.details[0].patternCode && $scope.diverObj.details[0].patternCode.length == oldPatCode.length) {
            if (type == 0) {
                if ($scope.diverObj.details[0].patternCode.charAt(0) != 8) {
                    $scope.diverObj.details[0].patternCode = '8' + $.trim($scope.diverObj.details[0].arrowCode).substr(1);
                }
            } else if (type == 1) {
                if ($scope.diverObj.details[0].patternCode.charAt(0) != 5 || $scope.diverObj.details[0].patternCode.charAt(0) != 7 || $scope.diverObj.details[0].patternCode.charAt(0) != 8) {
                    $scope.diverObj.details[0].patternCode = '8' + $.trim($scope.diverObj.details[0].arrowCode).substr(1);
                }
            } else if (type == 3) {
                if ($scope.diverObj.details[0].patternCode.charAt(0) != 5 || $scope.diverObj.details[0].patternCode.charAt(0) != 8) {
                    $scope.diverObj.details[0].patternCode = '8' + $.trim($scope.diverObj.details[0].arrowCode).substr(1);
                }
            } else if (type == 4) {
                if ($scope.diverObj.details[0].patternCode.charAt(0) != 7) {
                    $scope.diverObj.details[0].patternCode = '7' + $.trim($scope.diverObj.details[0].arrowCode).substr(1);
                }
            }
        }*/
        if ($scope.diverObj.details[0].arrowCode.length) {
            if ($scope.diverObj.details[0].branchType == 0 || $scope.diverObj.details[0].branchType == 2) {    // 切换分歧类型为高速/IC
                $scope.diverObj.details[0].voiceDir = 0;
            }
            if ($scope.diverObj.details[0].branchType == 1) {
                $scope.diverObj.details[0].voiceDir = 2;
            }
            if ($scope.diverObj.details[0].branchType == 3 || $scope.diverObj.details[0].branchType == 4) {
                $scope.diverObj.details[0].arrowCode = '';
                $scope.diverObj.details[0].patternCode = '';
            }
        }
        // 如果箭头图不为空，根据箭头图判断声音方向
        if ($scope.diverObj.details[0].arrowCode.length > 7) {
            $scope.diverObj.details[0].voiceDir = calculationVoiceDirect($scope.diverObj.details[0].arrowCode, $scope.diverObj.details[0].patternCode);
        }
        // 复杂路口和3D
       /* if ($scope.diverObj.details[0].branchType == 3 || $scope.diverObj.details[0].branchType == 4) {
            $scope.diverObj.details[0].estabType = 9;
            $scope.diverObj.details[0].nameKind = 9;
            $scope.diverObj.details[0].voiceDir = 9;
            $scope.speacialBranch = true;
        } else {
            // 方面
            if ($scope.diverObj.details[0].branchType == 1) {
                $scope.diverObj.details[0].voiceDir = 2;
            } else {    // 切换分歧类型为高速/IC
                $scope.diverObj.details[0].voiceDir = 0;
            }
            $scope.diverObj.details[0].estabType = 0;
            $scope.diverObj.details[0].nameKind = 0;
            $scope.speacialBranch = false;
        }*/
        // $scope.diverObj.details[0].arrowCode = '';
        // $scope.diverObj.details[0].patternCode = '';
    };
    /* 关系类型*/
    $scope.relationType = [
        { code: 1, label: '路口' },
        { code: 2, label: '线线' }
    ];
    /* 分歧类型*/
    $scope.branchTypeOption1 = [
        { id: 1, label: '方面分歧' },
        { id: 2, label: 'IC分歧' }
    ];
    $scope.branchTypeOption2 = [
        { id: 3, label: '3D分歧' },
        { id: 4, label: '复杂路口模式图(7开头)' }
    ];
    /* 箭头图标志*/
    $scope.arrowPicFlag = [
        { code: 0, label: '无' },
        { code: 1, label: '直行箭头标志' }
    ];
    $scope.estabTypeOptions = [
        { id: 0, label: '0 默认' },
        { id: 1, label: '1 出口' },
        { id: 2, label: '2 入口' },
        { id: 3, label: '3 SA' },
        { id: 4, label: '4 PA' },
        { id: 5, label: '5 JCT' },
        { id: 9, label: '9 不应用' }
    ];

    $scope.nameKindOptions = [
        { id: 0, label: '0 默认' },
        { id: 1, label: '1 IC' },
        { id: 2, label: '2 SA' },
        { id: 3, label: '3 PA' },
        { id: 4, label: '4 JCT' },
        { id: 5, label: '5 出口' },
        { id: 6, label: '6 入口' },
        { id: 7, label: '7 RAMP' },
        { id: 8, label: '8 出入口' },
        { id: 9, label: '9 不应用' }

    ];
    $scope.voiceDirOptions = [
        { id: 0, label: '0 无' },
        { id: 2, label: '2 右' },
        { id: 5, label: '5 左' },
        { id: 9, label: '9 不应用' }
    ];

    $scope.guideCodeOptions = [
        { id: 0, label: '0 无向导' },
        { id: 1, label: '1 高架向导' },
        { id: 2, label: '2 Underpath向导' },
        { id: 3, label: '3 未调查' },
        { id: 9, label: '9 不应用' }
    ];
    // 更新数据行政区划代表点的数据；
    function refreshNames() {
        $scope.diverObj.details[0].names = [];
        for (var i = 0, len = $scope.nameGroup.length; i < len; i++) {
            for (var j = 0, le = $scope.nameGroup[i].length; j < le; j++) {
                // $scope.nameGroup[i][j].seqNum =
                $scope.diverObj.details[0].names.unshift($scope.nameGroup[i][j]);
            }
        }
    }

    function initNameInfo() {
        // 如果没有名称信息就不组装名称组数据结构;
        if (!$scope.diverObj.details[0].names) {
            return;
        }
        $scope.nameGroup = [];
        $scope.diverObj.details[0].names.sort(compare('nameGroupid'));
        // 获取所有的nameGroupid
        var nameGroupidArr = [];
        for (var i = 0; i < $scope.diverObj.details[0].names.length; i++) {
            nameGroupidArr.push($scope.diverObj.details[0].names[i].nameGroupid);
        }
        nameGroupidArr = Utils.distinctArr(nameGroupidArr);

        for (var item = 0; item < nameGroupidArr.length; item++) {
            var tempArr = [];
            for (var j = 0, le = $scope.diverObj.details[0].names.length; j < le; j++) {
                if ($scope.diverObj.details[0].names[j].nameGroupid == nameGroupidArr[item]) {
                    tempArr.push($scope.diverObj.details[0].names[j]);
                    tempArr.sort(function (a, b) {
                        return $scope.langCodeRelation[a.langCode] - $scope.langCodeRelation[b.langCode];
                    });
                }
            }
            $scope.nameGroup.push(tempArr);
        }
        refreshNames();
    }
    /* 初始化信息显示*/
    $scope.initDiver = function () {
        $scope.initializeData();
        var dObj = $scope.diverObj;
        $scope.nameGroup = [];
        $scope.selectedLangcodeArr = []; // 当前选中组中的已选语言代码;
        $scope.currentGroupIndex = null;
        $scope.currentItempIndex = null;
        initNameInfo(); // 组成名称组数据结构;
        $scope.$emit('SWITCHCONTAINERSTATE', { subAttrContainerTpl: false });
        /* 经过线*/
        if (dObj) {
            /* 模式图信息条数*/
            if (dObj.details.length > 0) {
                $scope.arrowMapShow = getArrowPic($scope.diverObj.details[0].arrowCode);
                $scope.patternCodeSrc = getArrowPic($scope.diverObj.details[0].patternCode);
                /* 分歧号码*/
                $scope.branchPid = dObj.details[0].branchPid;
                if (dObj.details.length > 7) {
                    changeArrowPosition();
                }
                if ($scope.diverObj.details[0].branchType == 3 || $scope.diverObj.details[0].branchType == 4) {
                    $scope.diverObj.details[0].estabType = 9;
                    $scope.diverObj.details[0].nameKind = 9;
                    $scope.speacialBranch = true;
                } else {
                    $scope.speacialBranch = false;
                    // $scope.diverObj.details[0].estabType = 0;
                    // $scope.diverObj.details[0].nameKind = 0;
                }
            }
        }
        oldPatCode = $scope.diverObj.details[0] ? $scope.diverObj.details[0].patternCode : '';
        $ocLazyLoad.load('../../scripts/components/road/ctrls/attr_branch_ctrl/rdBranchNamesCtrl.js');
    };
    /* clone对象*/
    $scope.clone = function (obj) {
        var o;
        switch (typeof obj) {
            case 'undefined':
                break;
            case 'string' :
                o = obj + '';
                break;
            case 'number' :
                o = obj - 0;
                break;
            case 'boolean' :
                o = obj;
                break;
            case 'object' :
                if (obj === null) {
                    o = null;
                } else if (obj instanceof Array) {
                    o = [];
                    for (var i = 0, len = obj.length; i < len; i++) {
                        o.push($scope.clone(obj[i]));
                    }
                } else {
                    o = {};
                    for (var k in obj) {
                        if (k) {
                            o[k] = $scope.clone(obj[k]);
                        }
                    }
                }
                break;
            default:
                o = obj;
                break;
        }
        return o;
    };
    /* 私有方法 */
    function getSelectedLangCode() {
        $scope.selectedLangcodeArr.length = 0;
        for (var k in $scope.branchNames) {
            if ($scope.selectedLangcodeArr.indexOf($scope.branchNames[k].langCode) < 0) {
                $scope.selectedLangcodeArr.push($scope.branchNames[k].langCode);
            }
        }
    }
    function getItemByNameGroupid(arr, nameGroupid) {
        var index = -1;
        var item;
        for (var i = 0; i < arr.length; i++) {
            for (var j = 0; j < arr[i].length; j++) {
                if (arr[i][j].nameGroupid == nameGroupid) {
                    index = i;
                    break;
                }
            }
            if (index >= 0) {
                item = arr[i];
                break;
            }
        }
        return item;
    }

    // 数据拖动的处理;
    $scope.onDropComplete = function (index, obj) {
        $scope.diverObj.details[0].names.sort(function (a, b) {
            return a.nameGroupid - b.nameGroupid;
        });
        // 重新排序
        var idx = $scope.diverObj.details[0].names.indexOf(obj[0]);
        if (index > idx) {
            for (var i = idx; i <= index; i++) {
                $scope.diverObj.details[0].names[i].nameGroupid -= 1;
            }
            $scope.diverObj.details[0].names[idx].nameGroupid = index + 1;
        } else if (index < idx) {
            for (var j = index; j <= idx; j++) {
                $scope.diverObj.details[0].names[j].nameGroupid += 1;
            }
            $scope.diverObj.details[0].names[idx].nameGroupid = index + 1;
        }
        initNameInfo();
    };

    // 全角转半角
    $scope.exitNumToCDB = function (str) {
        $scope.diverObj.details[0].exitNum = Utils.ToDBC(str);
    };
    /* 增加item*/
   /* $scope.addItem = function (currentGroupIndex) {
        var groupId = $scope.nameGroup[currentGroupIndex][0].nameGroupid;
        $scope.branchNames = getItemByNameGroupid($scope.nameGroup, groupId);
        getSelectedLangCode();
        for (var i = 0; i < $scope.langCodeOptions.length; i++) {
            if ($scope.selectedLangcodeArr.indexOf($scope.langCodeOptions[i].id) === -1) {
                if (!($scope.selectedLangcodeArr.indexOf('CHI') > -1 || $scope.selectedLangcodeArr.indexOf('CHT') > -1) || !($scope.langCodeOptions[i].id === 'CHI' || $scope.langCodeOptions[i].id === 'CHT')) {
                    if ($scope.langCodeOptions[i].id == 'ENG') {
                        var nParam = {
                            word: $scope.branchNames[0].name,
                            languageType: 'eng'
                        };
                        dsMeta.nameTranslate(nParam).then(function (data) {
                            if (data.errcode == 0) {
                                $scope.branchNames.push(fastmap.dataApi.rdBranchName({
                                    nameGroupid: $scope.branchNames[0].nameGroupid,
                                    langCode: $scope.langCodeOptions[i].id,
                                    name: data.data.eng
                                }));
                            } else {
                                swal('查找失败', '可能是服务出错或者输入过长，请重新尝试', 'error');
                            }
                        });
                    } else {
                        $scope.branchNames.push(fastmap.dataApi.rdBranchName({
                            nameGroupid: $scope.branchNames[0].nameGroupid,
                            langCode: $scope.langCodeOptions[i].id
                        }));
                    }
                    break;
                }
            }
        }
        refreshNames();
    };*/
    /* 移除item*/
    $scope.removeItem = function (index, pIndex, item) {
        var i;
        var j;
        var len;
        var le;
        if (item.langCode === 'CHI' || item.langCode === 'CHT') {
            $scope.nameGroup.splice(pIndex, 1);
            for (i = 0; i < $scope.nameGroup.length; i++) {
                if (i >= pIndex) {
                    for (j = 0; j < $scope.nameGroup[i].length; j++) {
                        $scope.nameGroup[i][j].nameGroupid--;
                    }
                }
            }
        } else {
            for (i = 0, len = $scope.nameGroup.length; i < len; i++) {
                if ($scope.nameGroup[i]) {
                    for (j = 0, le = $scope.nameGroup[i].length; j < le; j++) {
                        if ($scope.nameGroup[i][j] === item) {
                            if ($scope.nameGroup[i].length == 1) {
                                $scope.nameGroup.splice(i, 1);
                                for (var n = 0, nu = $scope.nameGroup.length; n < nu; n++) {
                                    if (n >= i) {
                                        for (var m = 0, num = $scope.nameGroup[n].length; m < num; m++) {
                                            $scope.nameGroup[n][m].nameGroupid--;
                                        }
                                    }
                                }
                            } else {
                                $scope.nameGroup[i].splice(index, 1);
                            }
                        }
                    }
                }
            }
        }
        refreshNames();
    };
    /* 过滤details[0].names中未修改的名称*/
    $scope.delEmptyNames = function (arr) {
        for (var i = arr.length - 1; i > -1; i--) {
            if (!arr[i].objStatus) {
                arr.splice(i, 1);
            }
        }
    };
    /* 语言代码*/
    $scope.langCodeOptions = [
        { id: 'CHI', label: '简体中文' },
        { id: 'CHT', label: '繁体中文' },
        { id: 'ENG', label: '英文' },
        { id: 'POR', label: '葡萄牙文' },
        { id: 'ARA', label: '阿拉伯语' },
        { id: 'BUL', label: '保加利亚语' },
        { id: 'CZE', label: '捷克语' },
        { id: 'DAN', label: '丹麦语' },
        { id: 'DUT', label: '荷兰语' },
        { id: 'EST', label: '爱沙尼亚语' },
        { id: 'FIN', label: '芬兰语' },
        { id: 'FRE', label: '法语' },
        { id: 'GER', label: '德语' },
        { id: 'HIN', label: '印地语' },
        { id: 'HUN', label: '匈牙利语' },
        { id: 'ICE', label: '冰岛语' },
        { id: 'IND', label: '印度尼西亚语' },
        { id: 'ITA', label: '意大利语' },
        { id: 'JPN', label: '日语' },
        { id: 'KOR', label: '韩语' },
        { id: 'LIT', label: '立陶宛语' },
        { id: 'NOR', label: '挪威语' },
        { id: 'POL', label: '波兰语' },
        { id: 'RUM', label: '罗马尼亚语' },
        { id: 'RUS', label: '俄语' },
        { id: 'SLO', label: '斯洛伐克语' },
        { id: 'SPA', label: '西班牙语' },
        { id: 'SWE', label: '瑞典语' },
        { id: 'THA', label: '泰国语' },
        { id: 'TUR', label: '土耳其语' },
        { id: 'UKR', label: '乌克兰语' },
        { id: 'SCR', label: '克罗地亚语' }
    ];

    // 语言代码对应关系
    $scope.langCodeRelation = {
        CHI: 1,
        CHT: 2,
        ENG: 3,
        POR: 4,
        ARA: 5,
        BUL: 6,
        CZE: 7,
        DAN: 8,
        DUT: 9,
        EST: 10,
        FIN: 11,
        FRE: 12,
        GER: 13,
        HIN: 14,
        HUN: 15,
        ICE: 16,
        IND: 17,
        ITA: 18,
        JPN: 19,
        KOR: 20,
        LIT: 21,
        NOR: 22,
        POL: 23,
        RUM: 24,
        RUS: 25,
        SLO: 26,
        SPA: 27,
        SWE: 28,
        THA: 29,
        TUR: 30,
        UKR: 31,
        SCR: 32
    };
    /* 记住当前组和当前组组内的选中 */
    $scope.rememberNameNum = function (fIndex, cIndex) {
        $scope.currentGroupIndex = fIndex;
        $scope.currentItempIndex = cIndex;
        objCtrl.namesInfos = $scope.nameGroup[fIndex][cIndex];
        objCtrl.currentGroup = $scope.nameGroup[fIndex];
    };
    /* removeGroup 删除名称组*/
    $scope.removeGroup = function (pIndex) {
        $scope.nameGroup.splice(pIndex, 1);
        for (var i = 0; i < $scope.nameGroup.length; i++) {
            if (i >= pIndex) {
                for (var j = 0; j < $scope.nameGroup[i].length; j++) {
                    $scope.nameGroup[i][j].nameGroupid--;
                    $scope.nameGroup[i][j].seqNum = $scope.nameGroup[i][j].nameGroupid;
                }
            }
        }
        refreshNames();
        initNameInfo();
    };
    /* 增加group */
    $scope.addGroup = function () {
        refreshNames();
        var maxNameGroupId = 0;
        if ($scope.diverObj.details[0].names.length > 0) {
            maxNameGroupId = Utils.getArrMax($scope.diverObj.details[0].names, 'nameGroupid');
        }
        $scope.diverObj.details[0].names.unshift(fastmap.dataApi.rdBranchName({
            nameGroupid: maxNameGroupId + 1,
            seqNum: maxNameGroupId + 1
        }));
        initNameInfo();
    };
    /* 展示详细信息*/
    $scope.showDetail = function (type, index, nameInfo, nameGroupid) {
        var tempCtr = '';
        var tempTepl = '';
        if (type == 0) {  // 名称信息
            tempCtr = appPath.road + 'ctrls/attr_branch_ctrl/rdBranchNameCtl';
            tempTepl = appPath.root + appPath.road + 'tpls/attr_branch_tpl/rdBranchNameTpl.html';
        } else {  // 经过线
            if ($scope.diverObj.vias.length == 0) {
                return;
            }
            tempCtr = appPath.road + 'ctrls/attr_branch_ctrl/passlineCtrl';
            tempTepl = appPath.root + appPath.road + 'tpls/attr_branch_tpl/passlineTepl.html';
        }
        var showBranchInfoObj = {
            loadType: 'subAttrTplContainer',
            propertyCtrl: 'scripts/components/road/ctrls/blank_ctrl/blankCtrl',
            propertyHtml: '../../../scripts/components/road/tpls/blank_tpl/blankTpl.html',
            callback: function () {
                var detailInfo = {
                    loadType: 'subAttrTplContainer',
                    propertyCtrl: tempCtr,
                    propertyHtml: tempTepl
                };
                $scope.$emit('transitCtrlAndTpl', detailInfo);
            }
        };
        objCtrl.namesInfo = objCtrl.data.details[0].names;
        objCtrl.namesInfos = $scope.getItemByNameGroupid($scope.nameGroup, nameGroupid);
        $scope.$emit('transitCtrlAndTpl', showBranchInfoObj);
    };
    /** **
     * 根据nameGroupid获取对应的数据
     */
    $scope.getItemByNameGroupid = function (arr, nameGroupid) {
        var index = -1;
        var item;
        for (var i = 0; i < arr.length; i++) {
            for (var j = 0; j < arr[i].length; j++) {
                if (arr[i][j].nameGroupid == nameGroupid) {
                    index = i;
                    break;
                }
            }
            if (index >= 0) {
                item = arr[i];
                break;
            }
        }
        return item;
    };

    var unbindHandler = $scope.$on('ReloadData', $scope.initDiver);

    $scope.$on('$destroy', function () {
        unbindHandler = null;
    });
}]);
