/**
 * Created by wangmingdong on 2016/6/23.
 */
var namesOfBranch = angular.module('app');
namesOfBranch.controller('SignBoardOfBranchCtrl', ['$scope', '$timeout', '$ocLazyLoad', 'dsEdit', 'appPath', 'dsMeta', '$q', function ($scope, $timeout, $ocLazyLoad, dsEdit, appPath, dsMeta, $q) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var layerCtrl = fastmap.uikit.LayerController();
    var rdBranch = layerCtrl.getLayerById('relationData');
    var eventController = fastmap.uikit.EventController();
    var tooltipsCtrl = fastmap.uikit.ToolTipsController();
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var highlightCtrl = FM.mapApi.render.HighlightController.getInstance();
    var rdLink = layerCtrl.getLayerById('rdLink');

    $scope.divergenceIds = objCtrl.data;
    var oldPatCode;

    // 更新数据行政区划代表点的数据；
    function refreshNames() {
        $scope.diverObj.signboards[0].names = [];
        for (var i = 0, len = $scope.nameGroup.length; i < len; i++) {
            for (var j = 0, le = $scope.nameGroup[i].length; j < le; j++) {
                $scope.diverObj.signboards[0].names.unshift($scope.nameGroup[i][j]);
            }
        }
    }

    /* 正则检测实景图输入是否正确*/
    function testRegExp(str) {
        var result = false;
        if (str.length == 1) {
            result = new RegExp('^[0-9]*$').test(str.substr(-1, 1));
        } else if (str.length < 12) {
            result = new RegExp('^[A-Z0-9]+$').test(str.substr(-1, 1));
        } else if (str.length > 11) {
            result = false;
        }
        return result;
    }

    /* 全角转半角*/
    function CtoH(str) {
        var result = '';
        for (var i = 0; i < str.length; i++) {
            if (str.charCodeAt(i) == 12288) {
                result += String.fromCharCode(str.charCodeAt(i) - 12256);
                continue;
            }
            if (str.charCodeAt(i) > 65280 && str.charCodeAt(i) < 65375) result += String.fromCharCode(str.charCodeAt(i) - 65248);
            else result += String.fromCharCode(str.charCodeAt(i));
        }
        return result;
    }

    /* clone对象*/
    function clone(obj) {
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
                        o.push(clone(obj[i]));
                    }
                } else {
                    o = {};
                    for (var k in obj) {
                        if (k) {
                            o[k] = clone(obj[k]);
                        }
                    }
                }
                break;
            default:
                o = obj;
                break;
        }
        return o;
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
    /* 点击关系类型*/
    $scope.switchRelType = function (code) {
        $scope.diverObj.relationshipType = code;
    };
    /* 点击箭头图标志*/
    $scope.switchArrowType = function (code) {
        $scope.diverObj.signboards[0].arrowFlag = code;
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
            name: $scope.diverObj.signboards[0].arrowCode,
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
            if ($.trim($scope.diverObj.signboards[0].arrowCode) == '') {
                $scope.diverObj.signboards[0].backimageCode = '';
            }
            $scope.diverObj.signboards[0].arrowCode = CtoH($scope.diverObj.signboards[0].arrowCode);
            if (!testRegExp($scope.diverObj.signboards[0].arrowCode)) {
                $scope.diverObj.signboards[0].arrowCode = $scope.diverObj.signboards[0].arrowCode.substring(0, $scope.diverObj.signboards[0].arrowCode.length - 1);
                $scope.$apply();
                return false;
            }
            return true;
        });
        $timeout(function () {
            if ($.trim($scope.diverObj.signboards[0].arrowCode).length > 0) {
                $scope.diverObj.signboards[0].backimageCode = '0' + $.trim($scope.diverObj.signboards[0].arrowCode).substr(1);
                $scope.picNowNum = 1;
                $scope.getPicsData();
                $scope.arrowMapShow = $scope.getArrowPic($scope.diverObj.signboards[0].arrowCode);
                $scope.backimageCodeSrc = $scope.getArrowPic($scope.diverObj.signboards[0].backimageCode);
                if ($.trim($scope.diverObj.signboards[0].arrowCode) == '') {
                    $scope.showImgData = false;
                } else {
                    $scope.showImgData = true;
                }
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
        $scope.diverObj.signboards[0].arrowCode = code;
        $scope.diverObj.signboards[0].backimageCode = '0' + $.trim($scope.diverObj.signboards[0].arrowCode).substr(1);
        $scope.arrowMapShow = $scope.getArrowPic(code);
        $scope.backimageCodeSrc = $scope.getArrowPic($scope.diverObj.signboards[0].backimageCode);
        $scope.showImgData = false;
        oldPatCode = $scope.diverObj.signboards[0].backimageCode;
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
                    o[key] = clone(obj[key]);
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
    $scope.changeBackimageCode = function () {
        if ($scope.diverObj.signboards[0].backimageCode.charAt(0) == oldPatCode.charAt(0) ||
            $scope.diverObj.signboards[0].backimageCode.length > oldPatCode.length ||
            ($scope.diverObj.signboards[0].backimageCode.length + 1 <= oldPatCode.length && $scope.diverObj.signboards[0].backimageCode.length + 1 != oldPatCode.length)) {
            $scope.diverObj.signboards[0].backimageCode = oldPatCode;
        }
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

    function initNameInfo() {
        // 如果没有名称信息就不组装名称组数据结构;
        if (!$scope.diverObj.signboards[0].names.length) return;
        $scope.nameGroup = [];
        $scope.diverObj.signboards[0].names.sort(compare('nameGroupid'));
        // 获取所有的nameGroupid
        var nameGroupidArr = [];
        for (var i = 0; i < $scope.diverObj.signboards[0].names.length; i++) {
            nameGroupidArr.push($scope.diverObj.signboards[0].names[i].nameGroupid);
        }
        nameGroupidArr = Utils.distinctArr(nameGroupidArr);

        for (var item = 0; item < nameGroupidArr.length; item++) {
            var tempArr = [];
            for (var j = 0, le = $scope.diverObj.signboards[0].names.length; j < le; j++) {
                if ($scope.diverObj.signboards[0].names[j].nameGroupid == nameGroupidArr[item]) {
                    tempArr.push($scope.diverObj.signboards[0].names[j]);
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
        $scope.branchNames = null;
        $scope.selectedLangcodeArr = []; // 当前选中组中的已选语言代码;
        $scope.diverObj = objCtrl.data;
        // 回到初始状态（修改数据后样式会改变，新数据时让它回到初始的样式）
        if ($scope.nameBranchForm) {
            $scope.nameBranchForm.$setPristine();
        }
        var dObj = $scope.diverObj;
        $scope.nameGroup = [];
        $scope.selectedLangcodeArr = []; // 当前选中组中的已选语言代码;
        $scope.currentGroupIndex = null;
        $scope.currentItempIndex = null;
        initNameInfo(); // 组成名称组数据结构;
        /* 经过线*/
        if (dObj) {
            /* 模式图信息条数*/
            if (dObj.signboards.length > 0) {
                if ($scope.diverObj.signboards[0].arrowCode) {
                    $scope.arrowMapShow = $scope.getArrowPic($scope.diverObj.signboards[0].arrowCode);
                }
                $scope.backimageCodeSrc = $scope.getArrowPic($scope.diverObj.signboards[0].backimageCode);
                /* 分歧号码*/
                $scope.branchPid = dObj.signboards[0].branchPid;
            }
        }
        $ocLazyLoad.load('../../scripts/components/road/ctrls/attr_branch_ctrl/rdBranchNamesCtrl.js');
    };
    /* 数组删除一个元素*/
    $scope.arrRemove = function (array, dx) {
        if (isNaN(dx) || dx > array.length) {
            return false;
        }
        return array.splice(dx, 1);
    };
    /* 过滤signboards[0].names中未修改的名称*/
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
        if ($scope.diverObj.signboards[0].names.length > 0) {
            maxNameGroupId = Utils.getArrMax($scope.diverObj.signboards[0].names, 'nameGroupid');
        }
        $scope.diverObj.signboards[0].names.unshift(fastmap.dataApi.rdBranchSignBoardName({
            nameGroupid: maxNameGroupId + 1,
            seqNum: maxNameGroupId + 1
        }));
        initNameInfo();
    };
    /* 展示详细信息*/
    $scope.showDetail = function (type, nameInfo, nameGroupid) {
        var tempCtr = '';
        var tempTepl = '';
        if (type == 0) {  // 名称信息
            tempCtr = appPath.road + 'ctrls/attr_branch_ctrl/rdSignBoardNameCtl';
            tempTepl = appPath.root + appPath.road + 'tpls/attr_branch_tpl/signBoardNameTpl.html';
        } else {  // 经过线
            if (!$scope.diverObj.vias.length) {
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

    /* 删除pid*/
    $scope.delete = function () {
        var detailId = $scope.diverObj.signboards[0].pid;
        dsEdit.deleteBranchByDetailId(detailId, 9).then(
            function (params) {
                if (params) {
                    if (map.floatMenu) {
                        map.removeLayer(map.floatMenu);
                        map.floatMenu = null;
                    }
                    rdBranch.redraw();
                }
            }
        );
    };

    // 英文翻译
    var translateName = function (param, branchName) {
        dsMeta.nameTranslate(param).then(function (data) {
            if (data.errcode == 0) {
                $scope.branchNames.push(fastmap.dataApi.rdBranchName({
                    nameGroupid: $scope.branchNames[0].nameGroupid,
                    langCode: branchName.id,
                    name: data.data.eng
                }));
            } else {
                swal('查找失败', '可能是服务出错或者输入过长，请重新尝试', 'error');
            }
            $scope.refreshNames();
        });
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
                        translateName(nParam, $scope.langCodeOptions[i]);
                    } else {
                        $scope.branchNames.push(fastmap.dataApi.rdBranchSignBoardName({
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
    // 数据拖动的处理;
    $scope.onDropComplete = function (index, obj) {
        $scope.diverObj.signboards[0].names.sort(function (a, b) {
            return a.nameGroupid - b.nameGroupid;
        });
        // 重新排序
        var idx = $scope.diverObj.signboards[0].names.indexOf(obj[0]);
        if (index > idx) {
            for (var i = idx; i <= index; i++) {
                $scope.diverObj.signboards[0].names[i].nameGroupid -= 1;
            }
            $scope.diverObj.signboards[0].names[idx].nameGroupid = index + 1;
        } else if (index < idx) {
            for (var j = index; j <= idx; j++) {
                $scope.diverObj.signboards[0].names[j].nameGroupid += 1;
            }
            $scope.diverObj.signboards[0].names[idx].nameGroupid = index + 1;
        }
        initNameInfo();
    };

    $scope.removeItem = function (index, pIndex, item) {
        var i = 0;
        var j = 0;
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

    var unbindHandler = $scope.$on('ReloadData', $scope.initDiver);

    $scope.$on('$destroy', function () {
        unbindHandler = null;
    });
}]);
