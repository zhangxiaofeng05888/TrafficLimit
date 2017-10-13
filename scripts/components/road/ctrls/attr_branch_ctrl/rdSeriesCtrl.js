/**
 * Created by wangmingdong on 2016/6/23.
 */
var namesOfBranch = angular.module('app');
namesOfBranch.controller('SeriesOfBranchCtrl', ['$scope', '$timeout', '$ocLazyLoad', 'dsEdit', 'appPath', 'dsMeta', '$q', function ($scope, $timeout, $ocLazyLoad, dsEdit, appPath, dsMeta, $q) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var layerCtrl = fastmap.uikit.LayerController();
    var rdBranch = layerCtrl.getLayerById('relationData');
    var eventController = fastmap.uikit.EventController();
    var tooltipsCtrl = fastmap.uikit.ToolTipsController();
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var highlightCtrl = FM.mapApi.render.HighlightController.getInstance();
    var rdLink = layerCtrl.getLayerById('rdLink');
    var oldPatCode;

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
    // 自动计算声音方向
    function calculationVoiceDirect(arrow, pattern) {
        var voiceDirect = '';
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
    /* 点击声音方向*/
    $scope.switchVoiceType = function (code) {
        $scope.diverObj.seriesbranches[0].voiceDir = code;
    };
    /* 点击箭头图标志*/
    $scope.switchArrowType = function (code) {
        $scope.diverObj.seriesbranches[0].arrowFlag = code;
    };
    /* 根据id获取箭头图图片*/
    $scope.getArrowPic = function (id) {
        var params = {
            id: id + ''
        };
        return dsMeta.getArrowImg(JSON.stringify(params));
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
            name: $scope.diverObj.seriesbranches[0].arrowCode,
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
    /* 输入箭头图代码显示选择图片界面*/
    $scope.showPicSelect = function () {
        $scope.showImgData = false;
        $timeout(function () {
            if ($.trim($scope.diverObj.seriesbranches[0].arrowCode) == '') {
                $scope.diverObj.seriesbranches[0].patternCode = '';
            }
            if (!new RegExp(/^[a-f0-9]+$/).test($scope.diverObj.seriesbranches[0].arrowCode)) {
                $scope.diverObj.seriesbranches[0].arrowCode = '';
            }
            $scope.diverObj.seriesbranches[0].arrowCode = CtoH($scope.diverObj.seriesbranches[0].arrowCode);
            var bool;
            if (!testRegExp($scope.diverObj.seriesbranches[0].arrowCode)) {
                $scope.diverObj.seriesbranches[0].arrowCode = $scope.diverObj.seriesbranches[0].arrowCode.substring(0, $scope.diverObj.seriesbranches[0].arrowCode.length - 1);
                $scope.$apply();
                bool = false;
            } else {
                bool = true;
            }
            return bool;
        });
        $timeout(function () {
            if ($.trim($scope.diverObj.seriesbranches[0].arrowCode).length > 6) {
                $scope.diverObj.seriesbranches[0].patternCode = '8' + $.trim($scope.diverObj.seriesbranches[0].arrowCode).substr(1);
                $scope.picNowNum = 1;
                $scope.getPicsData();
                $scope.arrowMapShow = $scope.getArrowPic($scope.diverObj.seriesbranches[0].arrowCode);
                $scope.patternCodeSrc = $scope.getArrowPic($scope.diverObj.seriesbranches[0].patternCode);
                if ($.trim($scope.diverObj.seriesbranches[0].arrowCode) == '') {
                    $scope.showImgData = false;
                } else {
                    $scope.showImgData = true;
                }
                $scope.diverObj.seriesbranches[0].voiceDir = calculationVoiceDirect($scope.diverObj.seriesbranches[0].arrowCode, $scope.diverObj.seriesbranches[0].patternCode);
                $scope.$apply();
            }
        }, 1000);
    };

    /* 箭头图代码点击下一页*/
    $scope.picNext = function () {
        $scope.picNowNum += 1;
        $scope.getPicsData();
    };
    /* 箭头图代码点击上一页*/
    $scope.picPre = function () {
        $scope.picNowNum -= 1;
        $scope.getPicsData();
    };
    /* 点击选中的图片*/
    $scope.selectPicCode = function (code) {
        $scope.diverObj.seriesbranches[0].arrowCode = code;
        $scope.diverObj.seriesbranches[0].patternCode = '8' + $.trim($scope.diverObj.seriesbranches[0].arrowCode).substr(1);
        $scope.arrowMapShow = $scope.getArrowPic(code);
        $scope.patternCodeSrc = $scope.getArrowPic($scope.diverObj.seriesbranches[0].patternCode);
        $scope.showImgData = false;
        oldPatCode = $scope.diverObj.seriesbranches[0].patternCode;
        $scope.diverObj.seriesbranches[0].voiceDir = calculationVoiceDirect($scope.diverObj.seriesbranches[0].arrowCode, $scope.diverObj.seriesbranches[0].patternCode);
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
        if ($scope.diverObj.seriesbranches[0].patternCode.charAt(0) == oldPatCode.charAt(0) ||
            $scope.diverObj.seriesbranches[0].patternCode.length > oldPatCode.length ||
            ($scope.diverObj.seriesbranches[0].patternCode.length + 1 <= oldPatCode.length && $scope.diverObj.seriesbranches[0].patternCode.length + 1 != oldPatCode.length)) {
            $scope.diverObj.seriesbranches[0].patternCode = oldPatCode;
        }
        $scope.diverObj.seriesbranches[0].voiceDir = calculationVoiceDirect($scope.diverObj.seriesbranches[0].arrowCode, $scope.diverObj.seriesbranches[0].patternCode);
    };
    // 清除地图要素选择要素监听事件;
    function clearMapTool() {
        if (eventController.eventTypesMap[eventController.eventTypes.GETLINKID]) {
            for (var ii = 0, lenII = eventController.eventTypesMap[eventController.eventTypes.GETLINKID].length; ii < lenII; ii++) {
                eventController.off(eventController.eventTypes.GETLINKID, eventController.eventTypesMap[eventController.eventTypes.GETLINKID][ii]);
            }
        }
        if (map.currentTool) {
            map.currentTool.disable(); // 禁止当前的参考线图层的事件捕获
        }
    }

    // 获取一条link对象;
    function getLinkInfos(param) {
        var defer = $q.defer();
        dsEdit.getByPid(param, 'RDLINK').then(function (data) {
            if (data) {
                defer.resolve(data);
            }
        });
        return defer.promise;
    }
    // 修改经过线;
    $scope.modifyThroughLink = function () {
        // 最后一根经过线;
        for (var i = 0; i < $scope.diverObj.vias.length; i++) {
            if ($scope.diverObj.vias[i].seqNum == $scope.diverObj.vias.length) {
                $scope.lastLinkLine = $scope.diverObj.vias[i].linkPid;
            }
        }
        // //获取退出线的进入点以供修改经过线使用;
        $q.all([getLinkInfos($scope.diverObj.outLinkPid), getLinkInfos($scope.lastLinkLine)]).then(function (data) {
            var tempArr1 = [];
            var tempArr2 = [];
            tempArr1.push(data[0].eNodePid);
            tempArr1.push(data[0].sNodePid);
            tempArr2.push(data[1].eNodePid);
            tempArr2.push(data[1].sNodePid);
            for (var ix = 0; ix < tempArr1.length; ix++) {
                if (tempArr2.indexOf(tempArr1[ix]) != -1) {
                    $scope.outLinkInNode = tempArr1[ix];
                }
            }
        });
        // 开始修改经过线前清除对修改某一方向箭头的事件监听;
        clearMapTool();
        var temp = angular.copy($scope.diverObj);
        temp.vias = [];
        var tempHighlightObj = angular.copy($scope.diverObj);
        tempHighlightObj.signboards.length = 0;
        tempHighlightObj.signboards[0] = temp;
        highlightCtrl.clear();
        highlightCtrl.highlight(tempHighlightObj);
        // 修改退出线;
        map.currentTool = new fastmap.uikit.SelectPath({
            map: map,
            currentEditLayer: rdLink,
            linksFlag: true,
            shapeEditor: shapeCtrl
        });
        // 开启link的捕捉功能;
        map.currentTool.snapHandler.addGuideLayer(rdLink);
        map.currentTool.enable();
        tooltipsCtrl.setCurrentTooltip('开始修改经过线！', 'info');
        var nodeArr = [$scope.diverObj.nodePid];
        var linkArr = [];
        eventController.off(eventController.eventTypes.GETLINKID);
        eventController.on(eventController.eventTypes.GETLINKID, function (dataresult) {
            /*
             * 对经过线的合法性前判断;
             * （1）经过线不能为退出线;
             * （2）经过线不能为进入线;
             * （3）经过线必须相互连续;
             * */
            if (dataresult.id == $scope.diverObj.inLinkPid) {
                tooltipsCtrl.notify('经过线和进入线不能为同一条线！', 'error');
                return;
            }
            if (dataresult.id == $scope.diverObj.outLinkPid) {
                tooltipsCtrl.notify('经过线和退出线不能为同一条线！', 'error');
                return;
            }
            var selectLink = parseInt(dataresult.id, 10);
            var repeatNum = linkArr.indexOf(selectLink);
            if (linkArr.length && repeatNum != -1) {
                nodeArr.splice(repeatNum + 1);
                linkArr.splice(repeatNum);
                tooltipsCtrl.setCurrentTooltip('请继续选择经过线！', 'info');
            } else if (parseInt(dataresult.properties.direct, 10) == 1) {
                if (parseInt(dataresult.properties.enode, 10) == nodeArr[nodeArr.length - 1] || parseInt(dataresult.properties.snode, 10) == nodeArr[nodeArr.length - 1]) {
                    var tempNode = (parseInt(dataresult.properties.enode, 10) == nodeArr[nodeArr.length - 1]) ? parseInt(dataresult.properties.snode, 10) : parseInt(dataresult.properties.enode, 10);
                    nodeArr.push(parseInt(tempNode, 10));
                    linkArr.push(selectLink);
                    tooltipsCtrl.setCurrentTooltip('已选择一条经过线！', 'info');
                } else {
                    tooltipsCtrl.notify('经过线选择错误！', 'error');
                    return;
                }
            } else if (parseInt(dataresult.properties.enode, 10) == nodeArr[nodeArr.length - 1] && parseInt(dataresult.properties.direct, 10) == 3) {
                nodeArr.push(dataresult.properties.snode);
                linkArr.push(selectLink);
                tooltipsCtrl.setCurrentTooltip('已选择一条经过线！', 'info');
            } else if (parseInt(dataresult.properties.snode, 10) == nodeArr[nodeArr.length - 1] && parseInt(dataresult.properties.direct, 10) == 2) {
                nodeArr.push(parseInt(dataresult.properties.enode, 10));
                linkArr.push(selectLink);
                tooltipsCtrl.setCurrentTooltip('已选择一条经过线！', 'info');
            } else {
                tooltipsCtrl.notify('经过线选择错误！', 'error');
                return;
            }
            if (nodeArr[nodeArr.length - 1] == $scope.outLinkInNode) {
                tooltipsCtrl.setCurrentTooltip('经过线与退出线已连续，请点击保存！', 'info');
            }

            // 重新绘制;
            $scope.diverObj.vias = [];
            for (var j = 0; j < linkArr.length; j++) {
                $scope.diverObj.vias.push(FM.dataApi.rdBranchVia({
                    rowId: '',
                    linkPid: linkArr[j],
                    seqNum: j + 1
                }));
            }
            // 高亮部分;
            highlightCtrl.clear();
            highlightCtrl.highlight($scope.diverObj);
        });
    };
    /* 关系类型*/
    $scope.relationType = [
        { code: 1, label: '路口' },
        { code: 2, label: '线线' }
    ];
    /* 分歧类型*/
    $scope.branchTypeOptions = [
        { id: 0, label: '普通连续分歧' },
        { id: 1, label: '特殊连续分歧' }
    ];
    /* 初始化信息显示*/
    $scope.initDiver = function () {
        $scope.diverObj = objCtrl.data;
        var dObj = $scope.diverObj;
        /* 经过线*/
        if (dObj) {
            /* 模式图信息条数*/
            if (dObj.seriesbranches.length > 0) {
                if ($scope.diverObj.seriesbranches[0].arrowCode) {
                    $scope.arrowMapShow = $scope.getArrowPic($scope.diverObj.seriesbranches[0].arrowCode);
                }
                $scope.patternCodeSrc = $scope.getArrowPic($scope.diverObj.seriesbranches[0].patternCode);
                /* 分歧号码*/
                $scope.branchPid = dObj.seriesbranches[0].branchPid;
            }
        }
        oldPatCode = $scope.diverObj.seriesbranches[0] ? $scope.diverObj.seriesbranches[0].patternCode : '';
    };
    /* 数组删除一个元素*/
    $scope.arrRemove = function (array, dx) {
        if (isNaN(dx) || dx > array.length) {
            return false;
        }
        return array.splice(dx, 1);
    };
    /* 过滤seriesbranches[0].names中未修改的名称*/
    $scope.delEmptyNames = function (arr) {
        for (var i = arr.length - 1; i > -1; i--) {
            if (!arr[i].objStatus) {
                // $scope.arrRemove(arr,i);
                arr.splice(i, 1);
            }
        }
    };
    /* 展示详细信息*/
    $scope.showDetail = function () {
        if ($scope.diverObj.vias.length == 0) {
            return;
        }
        var tempCtr = '';
        var tempTepl = '';
        tempCtr = appPath.road + 'ctrls/attr_branch_ctrl/passlineCtrl';
        tempTepl = appPath.root + appPath.road + 'tpls/attr_branch_tpl/passlineTepl.html';
        var detailInfo = {
            loadType: 'subAttrTplContainer',
            propertyCtrl: tempCtr,
            propertyHtml: tempTepl
        };
        $scope.$emit('transitCtrlAndTpl', detailInfo);
    };

    var unbindHandler = $scope.$on('ReloadData', $scope.initDiver);

    $scope.$on('$destroy', function () {
        unbindHandler = null;
    });
}]);
