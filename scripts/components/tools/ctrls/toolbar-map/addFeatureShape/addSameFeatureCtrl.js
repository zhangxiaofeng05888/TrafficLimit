/**
 * Created by liuyang on 2016/8/5.
 */
angular.module('app').controller('addSameFeatureCtrl', ['$scope', '$ocLazyLoad', 'dsEdit', 'appPath', 'ngDialog',
    function ($scope, $ocLazyLoad, dsEdit, appPath, ngDialog) {
        var layerCtrl = fastmap.uikit.LayerController();
        var shapeCtrl = fastmap.uikit.ShapeEditorController();
        var tooltipsCtrl = fastmap.uikit.ToolTipsController();
        var rdNode = layerCtrl.getLayerById('rdNode');
        var rwNode = layerCtrl.getLayerById('rwNode');
        var adNode = layerCtrl.getLayerById('adNode');
        var zoneNode = layerCtrl.getLayerById('zoneNode');
        var luNode = layerCtrl.getLayerById('luNode');

        var rdLink = layerCtrl.getLayerById('rdLink');
        var rwLink = layerCtrl.getLayerById('rwLink');
        var adLink = layerCtrl.getLayerById('adLink');
        var zoneLink = layerCtrl.getLayerById('zoneLink');
        var luLink = layerCtrl.getLayerById('luLink');
        var eventController = fastmap.uikit.EventController();
        var objCtrl = fastmap.uikit.ObjectEditController();
        /**
         * 添加geometry
         * @param type
         * @param num
         * @param event
         */
        $scope.addShape = function (event, type) {
            // 大于17级才可以选择地图上各种geometry
            if (map.getZoom() < 17) {
                swal('提示', '地图缩放等级必须大于16级才可操作', 'info');
                return;
            }

            // 开始启动工具
            $scope.$emit('Map-EnableTool', null);

            if (type === 'RDSAMENODE') {
                shapeCtrl.setEditingType('rdSameNode');
                // $scope.resetOperator('addRelation', type);
                tooltipsCtrl.setCurrentTooltip('请框选同一点要素点！');
                map.currentTool = new fastmap.uikit.SelectForRectang({
                    map: map,
                    shapeEditor: shapeCtrl,
                    LayersList: [] // rdNode, adNode, zoneNode, luNode 配置的顺序影响返回框选点的顺序
                });
                map.currentTool.enable();

                var compleData = function (srcArr, desArr, nodeType, equalKind) {
                    if (srcArr && srcArr.length > 0) {
                        for (var j = 0; j < srcArr.length; j++) {
                            var o = {};
                            if (nodeType == 'LUNODE') {
                                if (srcArr[j].m.a[0].kinds.indexOf(equalKind) > -1) {
                                    o.childType = 'LUNODE_1';
                                } else {
                                    o.childType = 'LUNODE_2';
                                }
                            }
                            o.featType = nodeType;
                            // o.id = parseInt(srcArr[j].i);// 待服务返回数据格式修改后，需要将此处的parseInt去掉（mali）
                            o.id = srcArr[j].i; // 服务已经返回为数字
                            o.checked = false;
                            o.isMain = 0;
                            desArr.push(o);
                        }
                    }
                };
                // 剔除掉种别不在kindArr数组中的数据 剔除掉已经做过同一点的数据 剔除掉图廓点
                var filterByKind = function (srcArr, kindArr, form) {
                    if (srcArr) {
                        for (var j = srcArr.length - 1; j >= 0; j--) {
                            if (srcArr[j].m.sameNode) { // 已经是同一点了
                                srcArr.splice(j, 1);
                            } else if (srcArr[j].m.form == form) {
                                srcArr.splice(j, 1);
                            } else if (kindArr.length > 0) {
                                var kinds = srcArr[j].m.a[0].kinds.split(',');
                                var flag = false;
                                for (var p = 0; p < kinds.length; p++) {
                                    if (kindArr.indexOf(kinds[p]) > -1) {
                                        flag = true;
                                        break;
                                    }
                                }
                                if (!flag) {
                                    srcArr.splice(j, 1);
                                }
                            }
                        }
                    }
                };
                // 按照种别(kindArr)的顺序进行排序,不在kindArr中的种别将被放置在最后
                var sortByKind = function (srcArr, kindArr) {
                    var result = [];
                    for (var j = 0; j < kindArr.length; j++) {
                        for (var p = srcArr.length - 1; p >= 0; p--) {
                            var kinds = srcArr[p].m.a[0].kinds.split(',');
                            if (kinds.indexOf(kindArr[j]) > -1) {
                                result.push(srcArr[p]);
                                srcArr.splice(p, 1);
                            }
                        }
                    }
                    return result.concat(srcArr);
                };
                eventController.off(eventController.eventTypes.GETRECTDATA);
                eventController.on(eventController.eventTypes.GETRECTDATA, function (data) {
                    var param = {
                        types: ['RDNODE', 'ADNODE', 'ZONENODE', 'LUNODE'], // , 'ADNODE', 'ZONENODE', 'LUNODE'
                        wkt: {
                            type: 'Polygon',
                            coordinates: [
                                []
                            ]
                        }
                    };
                    var pointArr = data.border._latlngs;
                    for (var i = 0; i < pointArr.length; i++) {
                        param.wkt.coordinates[0].push([pointArr[i].lng, pointArr[i].lat]);
                    }
                    if (param.wkt.coordinates[0].length >= 1) {
                        param.wkt.coordinates[0].push([pointArr[0].lng, pointArr[0].lat]);
                    }
                    $scope.showLoading.flag = true;
                    dsEdit.queryBySpatial(param).then(function (res) {
                        $scope.showLoading.flag = false;
                        var arr = [];
                        filterByKind(res.RDNODE, [], 2); // 去除形态为图廓点的道路点.
                        compleData(res.RDNODE, arr, 'RDNODE');

                        filterByKind(res.ADNODE, ['1', '2', '3'], 1); // 包含对应的link种别为1 2 3的node点 图廓点.
                        compleData(res.ADNODE, arr, 'ADNODE');

                        filterByKind(res.ZONENODE, ['1', '2'], 1); // 包含对应的link种别为1 2 的node点 图廓点.
                        var sortArr = sortByKind(res.ZONENODE, ['2', '1']);
                        compleData(sortArr, arr, 'ZONENODE');

                        filterByKind(res.LUNODE, ['21', '1', '2', '3', '4', '5', '6', '7', '22', '23'], 1); // 包含对应的link种别为12345672223 的node点 图廓点.
                        sortArr = sortByKind(res.LUNODE, ['21']);
                        compleData(sortArr, arr, 'LUNODE', '21'); //  包含bua 边界线的和不包含bua 边界线的算两种要素

                        if (arr.length < 1) {
                            swal('警告', '没有框选到符合条件的数据!', 'warning');
                            return;
                        }
                        objCtrl.data = arr;
                        $ocLazyLoad.load(appPath.road + 'ctrls/attr_same_ctrl/rdMainSameNodeCtrl.js').then(function () {
                            ngDialog.open({
                                template: appPath.road + 'tpls/attr_same_tpl/rdMainSameNodeTpl.html',
                                controller: 'SameRelationshapController',
                                className: 'ngdialog-theme-default ngdialog-theme-plain padding-style',
                                width: '550px',
                                height: '320px',
                                scope: $scope,
                                closeByEscape: false,
                                closeByDocument: false
                            });
                        });
                    });
                });
            } else if (type === 'RDSAMELINK') {
                shapeCtrl.setEditingType('rdSameLink');
                tooltipsCtrl.setCurrentTooltip('请框选同一线要素线！');
                map.currentTool = new fastmap.uikit.SelectForRectang({
                    map: map,
                    shapeEditor: shapeCtrl,
                    LayersList: [rdLink, adLink, zoneLink, luLink] // 配置的顺序影响返回框选点的顺序
                });
                map.currentTool.enable();

                // 对接返回的数据格式进行转化， equalKind和luIncludeKind只是对于LuLink有用
                var compleLinkdata = function (srcArr, desArr, nodeType, equalKind, luIncludeKind) {
                    if (srcArr && srcArr.length > 0) {
                        for (var j = 0; j < srcArr.length; j++) {
                            var o = {};
                            o.featType = nodeType;
                            o.kind = srcArr[j].m.c; // 种别
                            if (nodeType == 'LULINK') { // luLink需要根据分类分成两种
                                if (o.kind == equalKind) {
                                    o.childFeatType = 'LULINK_1';
                                } else {
                                    var kindArr = o.kind.split(';');
                                    for (var m = 0; m < kindArr.length; m++) {
                                        if (luIncludeKind.indexOf(kindArr[m]) > -1) {
                                            o.childFeatType = 'LULINK_2';
                                            break;
                                        }
                                    }
                                }
                            } else {
                                o.childFeatType = o.featType;
                            }
                            o.id = srcArr[j].i; // 服务已经返回为数字 pid
                            o.checked = false;
                            o.sNodePid = parseInt(srcArr[j].m.a, 10); // 起点的pid
                            o.eNodePid = parseInt(srcArr[j].m.b, 10); // 终点的pid
                            o.sameLinkPid = srcArr[j].m.d; // 同一线的pid 用于判断是否已经做过同一线，如果有值表示做过同一线了
                            o.sameNodeStartPid = srcArr[j].m.e; // 起点同一点的pid ，如果有值表示已经做了同一点
                            o.sameNodeEndPid = srcArr[j].m.f; // 终点同一点的pid ，如果有值表示已经做了同一点
                            if (o.sameNodeStartPid && o.sameNodeEndPid && !o.sameLinkPid) { // 表示已经做过同一点，没有做过同一线的才可以创建同一线
                                desArr.push(o);
                            }
                        }
                    }
                };
                // 过滤 lulink的kind值能是BUA边界线，和 包含种别为大学，购物中心，医院，体育场，公墓，停车场，工业区，邮区边界线，FM面边界线的数据；
                var filterLuLink = function (srcArr, equalKind, includeKind) {
                    var returnArr = [];
                    for (var i = 0; i < srcArr.length; i++) {
                        var temp = srcArr[i];
                        var kind = temp.m.c;
                        if (kind == equalKind) {
                            returnArr.push(temp);
                            continue;
                        }
                        var kindArr = kind.split(';');
                        for (var j = 0; j < kindArr.length; j++) {
                            if (includeKind.indexOf(kindArr[j]) > -1) {
                                returnArr.push(temp);
                                break;
                            }
                        }
                    }
                    return returnArr;
                };
                // 只有kind 为KDzonelink、AOIlink的才可以做同一线
                var filterZoneLink = function (srcArr) {
                    var returnArr = [];
                    for (var i = 0; i < srcArr.length; i++) {
                        var temp = srcArr[i];
                        if (temp.m.c == '1' || temp.m.c == '2') {
                            returnArr.push(temp);
                        }
                    }
                    return returnArr;
                };
                eventController.off(eventController.eventTypes.GETRECTDATA);
                eventController.on(eventController.eventTypes.GETRECTDATA, function (data) {
                    var param = {
                        types: ['RDLINK', 'ADLINK', 'ZONELINK', 'LULINK'],
                        wkt: {
                            type: 'Polygon',
                            coordinates: [
                                []
                            ]
                        }
                    };
                    var pointArr = data.border._latlngs;
                    for (var i = 0; i < pointArr.length; i++) {
                        param.wkt.coordinates[0].push([pointArr[i].lng, pointArr[i].lat]);
                    }
                    if (param.wkt.coordinates[0].length >= 1) {
                        param.wkt.coordinates[0].push([pointArr[0].lng, pointArr[0].lat]);
                    }
                    $scope.showLoading.flag = true;
                    dsEdit.queryBySpatial(param).then(function (dres) {
                        $scope.showLoading.flag = false;
                        var arr = [];
                        var equalKind = '21';
                        var luIncludeKind = ['1', '2', '3', '4', '5', '6', '7', '22', '23', '40'];
                        compleLinkdata(dres.RDLINK, arr, 'RDLINK');
                        compleLinkdata(dres.ADLINK, arr, 'ADLINK');
                        dres.ZONELINK = filterZoneLink(dres.ZONELINK); // 根据kind过滤zoneLink
                        compleLinkdata(dres.ZONELINK, arr, 'ZONELINK');
                        dres.LULINK = filterLuLink(dres.LULINK, equalKind, luIncludeKind); // 根据kind过滤LuLink
                        compleLinkdata(dres.LULINK, arr, 'LULINK', equalKind, luIncludeKind);
                        console.info(arr);
                        if (arr.length < 1) {
                            swal('警告', '没有框选到符合条件的数据!', 'warning');
                            return;
                        }
                        objCtrl.data = arr;
                        $ocLazyLoad.load(appPath.road + 'ctrls/attr_same_ctrl/rdMainSameLinkCtrl.js').then(function () {
                            ngDialog.open({
                                template: appPath.road + 'tpls/attr_same_tpl/rdMainSameLinkTpl.html',
                                controller: 'MainSameLinkController',
                                className: 'ngdialog-theme-default ngdialog-theme-plain padding-style',
                                width: '550px',
                                height: '320px',
                                scope: $scope,
                                closeByEscape: false,
                                closeByDocument: false
                            });
                        });
                    });
                    // 和测试人员确认，行政区划都可以做同一线，不用进行种别的判断

                    // console.info(data);
                    // if (data.data.length <= 0) {
                    //     return;
                    // }
                    // // 根据ID去重
                    // var removeRepeatArr = []; // 去重后的数据
                    // var removeRepeatIdArr = [];
                    // for (i = 0, len = data.data.length; i < len; i++) {
                    //     if (removeRepeatIdArr.indexOf(data.data[i].data.properties.id) < 0) {
                    //         if (data.data[i].data.properties.geoLiveType === 'ZONELINK' && data.data[i].data.properties.kind === 0) {
                    //             break;
                    //         }
                    //         removeRepeatIdArr.push(data.data[i].data.properties.id);
                    //         removeRepeatArr.push(data.data[i]);
                    //     }
                    // }
                    //
                    // var arr = [];
                    // for (i = 0, len = removeRepeatArr.length; i < len; i++) {
                    //     var o = {};
                    //     o.featType = removeRepeatArr[i].data.properties.geoLiveType;
                    //     o.id = removeRepeatArr[i].data.properties.id;
                    //     o.checked = false;
                    //     o.kind = removeRepeatArr[i].data.properties.kind;
                    //     arr.push(o);
                    // }
                    //
                    // if (arr.length < 1) {
                    //     swal('警告', '没有框选到符合条件的数据!', 'warning');
                    //     return;
                    // }
                    // objCtrl.data = arr;
                    // $ocLazyLoad.load(appPath.road + 'ctrls/attr_same_ctrl/rdMainSameLinkCtrl.js').then(function () {
                    //     ngDialog.open({
                    //         template: appPath.road + 'tpls/attr_same_tpl/rdMainSameLinkTpl.html',
                    //         controller: 'MainSameLinkController',
                    //         className: 'ngdialog-theme-default ngdialog-theme-plain padding-style',
                    //         width: '550px',
                    //         height: '320px',
                    //         scope: $scope,
                    //         closeByEscape: false,
                    //         closeByDocument: false
                    //     });
                    // });
                });
            }

            // 选择工具启动
            if (map.currentTool.enabled()) {
                $scope.$emit('Map-ToolEnabled', {
                    event: event,
                    tool: map.currentTool,
                    operationType: 'ADD',
                    geoLiveType: type
                });
            }
        };
    }
]);
