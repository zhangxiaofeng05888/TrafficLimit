/**
 * Created by liuyang on 2016/8/5.
 */
angular.module('app').controller('addRdRelationCtrl', ['$scope', '$ocLazyLoad', 'dsEdit', 'appPath', '$timeout', '$q', 'dsMeta', 'hotkeys', 'ngDialog',
    function ($scope, $ocLazyLoad, dsEdit, appPath, $timeout, $q, dsMeta, hotkeys, ngDialog) {
        var layerCtrl = fastmap.uikit.LayerController();
        var editLayer = layerCtrl.getLayerById('edit');
        var shapeCtrl = fastmap.uikit.ShapeEditorController();
        var selectCtrl = fastmap.uikit.SelectController();
        var tooltipsCtrl = fastmap.uikit.ToolTipsController();
        var featCodeCtrl = fastmap.uikit.FeatCodeController();
        var rdLink = layerCtrl.getLayerById('rdLink');
        var rwLink = layerCtrl.getLayerById('rwLink');
        var lcLink = layerCtrl.getLayerById('lcLink');
        var rdnode = layerCtrl.getLayerById('rdNode');
        var tmcLayer = layerCtrl.getLayerById('tmcData');
        var highRenderCtrl = fastmap.uikit.HighRenderController();
        var objCtrl = fastmap.uikit.ObjectEditController();
        var eventController = fastmap.uikit.EventController();
        var highlightCtrl = FM.mapApi.render.HighlightController.getInstance();
        $scope.jsonData = null;
        $scope.limitRelation = {};
        /**
         * 两点之间的距离
         * @param pointA
         * @param pointB
         * @returns {number}
         */
        $scope.distance = function (pointA, pointB) {
            var len = Math.pow((pointA.x - pointB.x), 2) + Math.pow((pointA.y - pointB.y), 2);
            return Math.sqrt(len);
        };
        /**
         * 两点之间的夹角
         * @param pointA
         * @param pointB
         * @returns {*}
         */
        $scope.includeAngle = function (pointA, pointB) {
            var angle = 0;
            var dValue = pointA.x - pointB.x;
            var PI = Math.PI;
            if (dValue === 0) {
                angle = PI / 2;
            } else {
                angle = Math.atan((pointA.y - pointB.y) / (pointA.x - pointB.x));
            }
            return angle;
        };
        /**
         * 数组去重
         * @param arr
         * @returns {Array}
         */
        $scope.distinctArr = function (arr) {
            var dObj = {};
            for (var i = 0, len = arr.length; i < len; i++) {
                dObj[arr[i]] = true;
            }
            return Object.keys(dObj);
        };
        /**
         * 数据中是否有rdLink
         * @param data
         * @returns {boolean}
         */
        $scope.containsRdLink = function (data) {
            return data.filter(function (item) {
                return item.type === 'RDLINK';
            }).length !== 0;
        };
        /**
         * 数据中是否有rwLink
         * @param data
         * @returns {boolean}
         */
        $scope.containsRwLink = function (data) {
            return data.filter(function (item) {
                return item.type === 'RWLINK';
            }).length !== 0;
        };
        /**
         * 数据中是否有lcLink
         * @param data
         * @returns {boolean}
         */
        $scope.containsLcLink = function (data) {
            return data.filter(function (item) {
                return item.type === 'LCLINK';
            }).length !== 0;
        };
        /**
         * 计算角度
         * @param pointA,pointB
         * @returns {angle}
         */
        $scope.angleOfLink = function (pointA, pointB) {
            var PI = Math.PI;
            var angle;
            if ((pointA.x - pointB.x) === 0) {
                angle = PI / 2;
            } else {
                angle = Math.atan((pointA.y - pointB.y) / (pointA.x - pointB.x));
            }
            return angle;
        };
        /**
         * 将线分离
         * @param Points
         * @returns {links}
         */
        $scope.seprateLink = function (shapePoints) {
            var linksObj = {};
            var pointsObj = [];
            var points = [];
            if (shapePoints.length < 3) { // 表示只有两个点
                linksObj.pointsObj = [
                    [shapePoints[0], shapePoints[1]]
                ];
                return linksObj;
            }
            var point1,
                point2,
                point3,
                angle1,
                angle2;
            for (var j = 0; j < shapePoints.length - 1;) {
                point1 = map.latLngToContainerPoint([shapePoints[j].y, shapePoints[j].x]);
                if ((j + 2) < shapePoints.length) {
                    point2 = map.latLngToContainerPoint([shapePoints[j + 1].y, shapePoints[j + 1].x]);
                    point3 = map.latLngToContainerPoint([shapePoints[j + 2].y, shapePoints[j + 2].x]);
                    angle1 = $scope.angleOfLink(point1, point2);
                    angle2 = $scope.angleOfLink(point2, point3);
                    if (Math.abs(angle1 - angle2) > 0.06) {
                        points = [];
                        points.push(shapePoints[j]);
                        points.push(shapePoints[j + 1]);
                        pointsObj.push(points);
                        j++;
                    } else {
                        shapePoints.splice(j + 1, 1);
                        // tempPoint = shapePoints[j + 1];
                    }
                } else {
                    points = [];
                    if (pointsObj.length == 0) {
                        points.push(shapePoints[0]); // 第一个
                        points.push(shapePoints[j + 1]); // 最后一个
                        pointsObj.push(points);
                    } else {
                        var temp = pointsObj[pointsObj.length - 1];
                        points.push(temp[1]);
                        points.push(shapePoints[j + 1]); // 最后一个
                        pointsObj.push(points);
                    }
                    j++;
                }
            }
            linksObj.pointsObj = pointsObj;
            return linksObj;
        };
        /**
         * 运算两条线的交点坐标
         * @param a: 直线段
         * @param b: 直线段
         * @returns {*}
         */
        $scope.segmentsIntr = function (a, b) {
            var areaAbc = (a[0].x - b[0].x) * (a[1].y - b[0].y) - (a[0].y - b[0].y) * (a[1].x - b[0].x);
            var areaAbd = (a[0].x - b[1].x) * (a[1].y - b[1].y) - (a[0].y - b[1].y) * (a[1].x - b[1].x);
            // 面积符号相同则两点在线段同侧,不相交 (对点在线段上的情况,本例当作不相交处理);
            if (areaAbc * areaAbd >= 0) {
                return false;
            }
            var areaCda = (b[0].x - a[0].x) * (b[1].y - a[0].y) - (b[0].y - a[0].y) * (b[1].x - a[0].x);
            var areaCdb = areaCda + areaAbc - areaAbd;
            if (areaCda * areaCdb >= 0) {
                return false;
            }
            // 计算交点坐标
            var t = areaCda / (areaAbd - areaAbc);
            var dx = t * (a[1].x - a[0].x);
            var dy = t * (a[1].y - a[0].y);
            return {
                x: (a[0].x + dx).toFixed(5),
                y: (a[0].y + dy).toFixed(5),
                linkIdA: a[2],
                featTypeA: a[3],
                linkIdB: b[2],
                featTypeB: b[3]
            }; // 保留小数点后5位
        };
        /*
         * 计算以像素表达（左上最小，右下最大）的向量与水平线的夹角，值域为 0~2PI
         */
        var pixelVectorAngle = function (pt1, pt2) {
            var angle;
            if ((pt2.x - pt1.x) === 0) {
                if (pt2.y > pt1.y) {
                    angle = Math.PI / 2;
                } else {
                    angle = 3 * Math.PI / 2;
                }
            } else {
                angle = Math.atan((pt2.y - pt1.y) / (pt2.x - pt1.x));
                if (angle > 0 && (pt2.x - pt1.x) < 0) {
                    angle = Math.PI + angle;
                } else if (angle < 0 && (pt2.x - pt1.x) < 0) {
                    angle = Math.PI + angle;
                } else if (angle < 0 && (pt2.x - pt1.x) > 0) {
                    angle = 2 * Math.PI + angle;
                }
            }
            return angle;
        };
        /*
         * 计算以像素表达（左上最小，右下最大）的向量与水平线的夹角，值域为 0~2PI
         */
        var pixelVectorAngle1 = function (pt1, pt2) {
            var angle;
            if ((pt2.x - pt1.x) === 0) {
                if (pt2.y > pt1.y) {
                    angle = Math.PI / 2;
                } else {
                    angle = 3 * Math.PI / 2;
                }
            } else {
                angle = Math.atan((pt2.y - pt1.y) / (pt2.x - pt1.x));
            }
            return angle;
        };
        /**
         * 将折线拆分成多条第一个线段与最后一个线段的夹角小于一个固定角度的折线
         * 注：用于替代上边的$scope.seprateLink()
         * @param shapePoints link的形状点数组（地理坐标）
         */
        var seperateLink = function (shapePoints, startIndex) {
            var segments = []; // 折线数组
            var seg = []; // 一条折线
            seg.push(shapePoints[0]);
            seg.push(shapePoints[1]);
            var pt1 = map.latLngToContainerPoint([shapePoints[0].y, shapePoints[0].x]);
            var pt2 = map.latLngToContainerPoint([shapePoints[1].y, shapePoints[1].x]);
            var bAngle = pixelVectorAngle1(pt1, pt2); // 第一条线段的水平夹角
            var pt3,
                pt4,
                rAngle;
            var i = 1;
            var diffAngle;
            while (i < shapePoints.length - 1) {
                pt3 = map.latLngToContainerPoint([shapePoints[i].y, shapePoints[i].x]);
                pt4 = map.latLngToContainerPoint([shapePoints[i + 1].y, shapePoints[i + 1].x]);
                rAngle = pixelVectorAngle1(pt3, pt4);
                diffAngle = Math.abs(rAngle - bAngle);
                if (((pt2.x - pt1.x) * (pt4.x - pt3.x)) < 0) {
                    diffAngle = Math.PI - diffAngle;
                }
                if (diffAngle <= (Math.PI / 2)) {
                    seg.push(shapePoints[i + 1]);
                    i++;
                } else {
                    break;
                }
            }
            segments.push({
                startIndex: startIndex,
                shapePoints: seg
            });
            if (i < shapePoints.length - 1) {
                Array.prototype.push.apply(segments, seperateLink(shapePoints.slice(i), startIndex + i));
            }
            return segments;
        };
        /**
         * 使用向量叉积的方法计算直线段的交点
         */
        var segmentIntersect = function (pt1, pt2, pt3, pt4) {
            // 计算向量p3p1和向量p2p1的叉积
            var _vec = function (p1, p2, p3) {
                return (p1.x - p3.x) * (p1.y - p2.y) - (p1.y - p3.y) * (p1.x - p2.x);
            };
            // 判断点p3是否在线段p1 p2上
            var _onSegment = function (p1, p2, p3) {
                if (Math.min(p1.x, p2.x) <= p3.x && p3.x <= Math.max(p1.x, p2.x)) {
                    if (Math.min(p1.y, p2.y) <= p3.y && p3.y <= Math.max(p1.y, p2.y)) {
                        return true;
                    }
                }
                return false;
            };
            var inter = null;
            var v1 = _vec(pt3, pt4, pt1);
            var v2 = _vec(pt3, pt4, pt2);
            var v3 = _vec(pt1, pt2, pt3);
            var v4 = _vec(pt1, pt2, pt4);
            if (v1 * v2 < 0 && v3 * v4 < 0) { // 相交
                var t = v3 / (v2 - v1);
                var dx = (pt4.x - pt3.x) * t;
                var dy = (pt4.y - pt3.y) * t;
                inter = {
                    flag: 0,
                    point: {
                        x: parseFloat((pt3.x + dx).toFixed(5)),
                        y: parseFloat((pt3.y + dy).toFixed(5))
                    }
                };
            } else if (v1 == 0 && v2 != 0 && _onSegment(pt3, pt4, pt1)) { // 以下都是相切的情况
                inter = {
                    flag: 1,
                    point: pt1
                };
            } else if (v2 == 0 && v1 != 0 && _onSegment(pt3, pt4, pt2)) {
                inter = {
                    flag: 2,
                    point: pt2
                };
            } else if (v3 == 0 && v4 != 0 && _onSegment(pt1, pt2, pt3)) {
                inter = {
                    flag: 3,
                    point: pt3
                };
            } else if (v4 == 0 && v3 != 0 && _onSegment(pt1, pt2, pt4)) {
                inter = {
                    flag: 4,
                    point: pt4
                };
            }
            return inter;
        };
        /**
         * 计算折线段的交点
         */
        var linkIntersect = function (seg1, seg2) {
            var i,
                j,
                pt1,
                pt2,
                pt3,
                pt4;
            var interList = [];
            var inter;
            for (i = 0; i < seg1.shapePoints.length - 1; i++) {
                pt1 = seg1.shapePoints[i];
                pt2 = seg1.shapePoints[i + 1];
                for (j = 0; j < seg2.shapePoints.length - 1; j++) {
                    pt3 = seg2.shapePoints[j];
                    pt4 = seg2.shapePoints[j + 1];
                    inter = segmentIntersect(pt1, pt2, pt3, pt4);
                    if (inter) {
                        interList.push(inter);
                    }
                }
            }
            return interList;
        };
        /**
         * 去除重复的坐标点，保留一个
         * @param arr
         * @returns {*}
         * @constructor
         */
        $scope.ArrUnique = function (arr) {
            for (var i = 0; i < arr.length; i++) {
                for (var j = 0; j < arr.length; j++) {
                    if (i != j) {
                        if (arr[i].x == arr[j].x && arr[i].y == arr[j].y) {
                            arr.splice(j, 1);
                        }
                    }
                }
            }
            /* 清除空数组*/
            arr.filter(function (v) {
                return v.length > 0;
            });
            return arr;
        };
        $scope.changeIndexCallback = function (data) {
            $scope.jsonData.linkObjs.sort(function (a, b) {
                if (a.zlevel < b.zlevel) {
                    return 1;
                } else if (a.zlevel > b.zlevel) {
                    return -1;
                }
                return 0;
            });
            /* 把当前link的zlevel升高一级*/
            for (var zLevelNum = 0, zLevelLen = $scope.jsonData.linkObjs.length; zLevelNum < zLevelLen; zLevelNum++) {
                if ($scope.jsonData.linkObjs[zLevelNum].pid == data.id) {
                    if (($scope.jsonData.linkObjs[zLevelNum].zlevel) <= zLevelLen - 1 && zLevelNum !== 0) {
                        $scope.jsonData.linkObjs[zLevelNum - 1].zlevel -= 1;
                        $scope.jsonData.linkObjs[zLevelNum].zlevel += 1;
                        break;
                    }
                }
            }
            $scope.jsonData.linkObjs.sort(function (a, b) {
                return a.zlevel - b.zlevel;
            });
            /* 重绘link颜f色*/
            for (var i = 0; i < $scope.jsonData.linkObjs.length; i++) {
                var tempObj = {
                    RDLINK: 'rdLink',
                    RWLINK: 'rwLink',
                    LCLINK: 'lcLink'
                };
                var COLORTABLE = ['#14B7FC', '#4FFFB6', 'F8B19C', '#FCD6A4'];
                highRenderCtrl.highLightFeatures.push({
                    id: $scope.jsonData.linkObjs[i].pid.toString(),
                    // layerid: $scope.jsonData.linkObjs[i]["type"] === "RDLINK" ? 'rdLink' : 'rwLink',
                    layerid: tempObj[$scope.jsonData.linkObjs[i].type],
                    type: 'line',
                    index: $scope.jsonData.linkObjs[i].zlevel,
                    style: {
                        strokeWidth: 5,
                        strokeColor: COLORTABLE[$scope.jsonData.linkObjs[i].zlevel]
                    }
                });
                highRenderCtrl.drawHighlight();
            }
        };
        $scope.changeGSCIndex = function (data) {
            if (data.drawGeometry.geos.length == 2) {
                data.drawGeometry.geos.reverse();
            } else {
                var geos = data.drawGeometry.geos[data.index];
                data.drawGeometry.geos.splice(data.index, 1);
                if (data.index == data.drawGeometry.geos.length - 1) {
                    data.drawGeometry.geos.unshift(geos);
                } else {
                    data.drawGeometry.geos.push(geos);
                }
            }
            editLayer._redraw();
        };
        /**
         * 调整link层级高低
         */
        $scope.changeLevel = function () {
            editLayer.drawGeometry = null;
            map.currentTool.options.repeatMode = false;
            shapeCtrl.stopEditing();
            editLayer.bringToBack();
            $(editLayer.options._div).unbind();
            // $scope.changeBtnClass("");
            shapeCtrl.shapeEditorResult.setFinalGeometry(null);
            shapeCtrl.shapeEditorResult.setOriginalGeometry(null);
            editLayer.clear();
            $scope.$emit('SWITCHCONTAINERSTATE', {
                attrContainerTpl: false
            });
            map._container.style.cursor = '';
            if ($scope.containsRdLink($scope.jsonData.linkObjs)) {
                map.currentTool = new fastmap.uikit.SelectPath({
                    map: map,
                    currentEditLayer: rdLink,
                    linksFlag: true,
                    shapeEditor: shapeCtrl
                });
                map.currentTool.enable();
            }
            if ($scope.containsRwLink($scope.jsonData.linkObjs)) {
                map.currentTool.rwEvent = new fastmap.uikit.SelectPath({
                    map: map,
                    currentEditLayer: rwLink,
                    linksFlag: true,
                    shapeEditor: shapeCtrl
                });
                map.currentTool.rwEvent.enable();
            }
            if ($scope.containsLcLink($scope.jsonData.linkObjs)) {
                map.currentTool.lcEvent = new fastmap.uikit.SelectPath({
                    map: map,
                    currentEditLayer: lcLink,
                    linksFlag: true,
                    shapeEditor: shapeCtrl
                });
                map.currentTool.lcEvent.enable();
            }
            rdLink.options.selectType = 'link';
            rdLink.options.editable = true;
            eventController.off(eventController.eventTypes.GETLINKID, $scope.changeIndexCallback);
            eventController.on(eventController.eventTypes.GETLINKID, $scope.changeIndexCallback);
        };
        /**
         *  路口创建中的方法 根据node删除对象中的重复
         * @param nodesArr
         * @param linksArr
         * @param nodes
         * @returns {{link: Array, node: Array}}
         */
        $scope.minusArrByNode = function (nodesArr, linksArr, nodes) {
            var nodesObj = {};
            var linksObj = {};
            for (var i = 0, lenI = nodesArr.length; i < lenI; i++) {
                nodesObj[nodesArr[i]] = true;
            }
            for (var j = 0, lenJ = linksArr.length; j < lenJ; j++) {
                linksObj[linksArr[j]] = true;
            }
            for (var m = 0, lenM = nodes.length; m < lenM; m++) {
                if (nodesObj[nodes[m].node]) {
                    delete nodesObj[nodes[m].node];
                }
                if (linksObj[nodes[m].link]) {
                    delete linksObj[nodes[m].link];
                }
            }
            return {
                link: Object.keys(linksObj),
                node: Object.keys(nodesObj)
            };
        };
        /**
         *   路口创建中的方法 根据link删除对象中的重复
         * @param linksArr
         * @param nodesArr
         * @param links
         * @returns {{link: Array, node: Array}}
         */
        $scope.minusArrByLink = function (linksArr, nodesArr, links) {
            var nodesObj = {};
            var linksObj = {};
            for (var j = 0, lenJ = linksArr.length; j < lenJ; j++) {
                linksObj[linksArr[j]] = true;
            }
            for (var i = 0, lenI = nodesArr.length; i < lenI; i++) {
                nodesObj[nodesArr[i]] = true;
            }
            for (var m = 0, lenM = links.length; m < lenM; m++) {
                if (links[m].nodes) {
                    if (nodesObj[links[m].nodes[0]]) {
                        delete nodesObj[links[m].nodes[0]];
                    } else if (nodesObj[links[m].nodes[1]]) {
                        delete nodesObj[links[m].nodes[1]];
                    }
                } else if (links[m].links) {
                    delete linksObj[links[m].link];
                }
            }
            return {
                link: Object.keys(linksObj),
                node: Object.keys(nodesObj)
            };
        };
        /**
         * 路口创建中的方法 新增一个node点
         * @param nodesArr
         * @param linksArr
         * @param nodes
         * @param node
         */
        $scope.addArrByNode = function (nodesArr, linksArr, nodes, node) {
            for (var i = 0, lenI = nodes.length; i < lenI; i++) {
                for (var j = 0, lenJ = node.length; j < lenJ; j++) {
                    if (nodes[i].link === node[j].link) {
                        linksArr.push(node[j].link);
                        nodesArr.push(node[j].node);
                    } else {
                        nodesArr.push(node[j].node);
                    }
                }
            }
            nodes = nodes.concat(node);
            return nodes;
        };
        /**
         *  路口创建中的方法 增加一个link
         * @param linksArr
         * @param nodesArr
         * @param links
         * @param nodes
         * @param link
         */
        $scope.addArrByLink = function (linksArr, nodesArr, links, nodes, link) {
            for (var i = 0, lenI = link.length; i < lenI; i++) {
                linksArr.push(link[i].link);
                nodesArr = nodesArr.concat(link[i].node);
                links.push(link[i].link);
                nodes = nodesArr.concat(link[i].node);
            }
        };
        /**
         *  路口创建中的方法 是否包含某个link
         * @param linksArr
         * @param links
         */
        $scope.containLink = function (linksArr, links) {
            var flag = false;
            var linksObj = {};
            for (var i = 0, len = linksArr.length; i < len; i++) {
                linksObj[linksArr[i]] = true;
            }
            for (var j = 0, lenJ = links.length; j < lenJ; j++) {
                if (linksObj[j].links) {
                    flag = true;
                    break;
                }
            }
        };
        /**
         *  路口创建中的方法 是否包含某个node
         * @param arr
         * @param node
         * @returns {boolean}
         */
        $scope.containsNode = function (arr, node) {
            var obj = {};
            var flag = false;
            for (var i = 0, len = arr.length; i < len; i++) {
                obj[arr[i]] = true;
            }
            for (var j = 0, lenJ = node.length; j < lenJ; j++) {
                if (obj[node[j].node]) {
                    flag = true;
                    break;
                }
            }
            return flag;
        };
        /**
         *  路口创建中的方法 提取框选中的数据为创建路口
         * @param data
         * @returns {{links: Array, nodes: Array}}
         */
        $scope.getDataFromRectangleForCross = function (data) {
            var borderData = data.data;
            var border = data.border;
            var linkArr = [];
            var nodeArr = [];
            var points = border._latlngs;
            var point0 = new fastmap.mapApi.Point(points[1].lng, points[1].lat);
            var point1 = new fastmap.mapApi.Point(points[2].lng, points[2].lat);
            var point2 = new fastmap.mapApi.Point(points[3].lng, points[3].lat);
            var point3 = new fastmap.mapApi.Point(points[0].lng, points[0].lat);
            var lineString = new fastmap.mapApi.LinearRing([point0, point1, point2, point3, point0]);
            var polygon = new fastmap.mapApi.Polygon([lineString]);

            // var keys = Object.getOwnPropertyNames(borderData);
            for (var key = 0; key < borderData.length; key++) {
            // for (var item in borderData) {
                // var properties = borderData[item].data.properties;
                // var coordinates = borderData[item].line.points;
                var properties = borderData[key].data.properties;
                var coordinates = borderData[key].line.points;
                var startPoint = coordinates[0];
                var endPoint = coordinates[coordinates.length - 1];
                if (polygon.containsPoint(startPoint)) {
                    if (polygon.containsPoint(endPoint)) {
                        linkArr.push({
                            node: [parseInt(properties.snode, 10), parseInt(properties.enode, 10)],
                            link: parseInt(properties.id, 10)
                        });
                    } else {
                        var sObj = {
                            node: parseInt(properties.snode, 10),
                            link: parseInt(properties.id, 10)
                        };
                        nodeArr.push(sObj);
                    }
                } else if (polygon.containsPoint(endPoint)) {
                    if (polygon.containsPoint(startPoint)) {
                        linkArr.push({
                            node: [parseInt(properties.snode, 10), parseInt(properties.enode, 10)],
                            link: parseInt(properties.id, 10)
                        });
                    } else {
                        var eObj = {
                            node: parseInt(properties.enode, 10),
                            link: parseInt(properties.id, 10)
                        };
                        nodeArr.push(eObj);
                    }
                }
            }
            return {
                links: linkArr,
                nodes: nodeArr
            };
        };
        /**
         * 高亮要素
         *  arr [{
         *      id:123,
         *      type:'node','line',
         *      layerId: 'rdLink'
         *     style:{
         *         color:''
         *     }
         *  }]
         */
        $scope.highLightObj = function (arr) {
            highRenderCtrl.clear();
            var highlightFeatures = [];
            for (var i = 0, lenI = arr.length; i < lenI; i++) {
                highlightFeatures.push({
                    id: arr[i].id.toString(),
                    layerid: arr[i].layerId ? arr[i].layerId : 'rdLink',
                    type: arr[i].type ? arr[i].type : 'line',
                    style: arr[i].style ? arr[i].style : {}
                });
            }
            highRenderCtrl.highLightFeatures = highlightFeatures;
            highRenderCtrl.drawHighlight();
        };
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

            if (type.indexOf('RDRESTRICTION') != -1) {
                shapeCtrl.setEditingType('addRestriction');
                var restrictionType = (type.indexOf('TRUCK') != -1) ? 1 : 0;
                map.currentTool = new fastmap.uikit.SelectFeature({
                    map: map,
                    shapeEditor: shapeCtrl
                });
                map.currentTool.enable();
                type = 'RDRESTRICTION'; // 卡车交限与普通交限模型类型一样;
                featCodeCtrl.setFeatCode({ resType: restrictionType });
                tooltipsCtrl.setCurrentTooltip('正要新建交限!');
            } else if (type === 'RDSPEEDLIMIT') {
                var minLen = 100000;
                var pointsOfDis,
                    pointForAngle,
                    angle;
                var rdSpeedLimit = {
                    rowId: 'rdSpeenLimit001',
                    geoLiveType: 'DEFAULTSELECTPOINTTOPO',
                    inLinkPid: 0,
                    selectGeo: {
                        type: 'Point',
                        coordinates: []
                    }
                };
                if (shapeCtrl.shapeEditorResult) {
                    shapeCtrl.shapeEditorResult.setFinalGeometry(fastmap.mapApi.lineString([fastmap.mapApi.point(0, 0)]));
                    selectCtrl.selectByGeometry(shapeCtrl.shapeEditorResult.getFinalGeometry());
                    layerCtrl.pushLayerFront('edit');
                }
                shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.POINTVERTEXADD);
                shapeCtrl.startEditing();
                map.currentTool = shapeCtrl.getCurrentTool();
                map.currentTool.enable();
                map.currentTool.snapHandler.addGuideLayer(rdLink);
                tooltipsCtrl.setCurrentTooltip('点击增加限速!！');
                eventController.off(eventController.eventTypes.RESETCOMPLETE);
                eventController.on(eventController.eventTypes.RESETCOMPLETE, function (e) {
                    var pro = e.property;
                    if (pro.form.indexOf('50') > -1) {
                        selectCtrl.selectedFeatures = null;
                        editLayer.drawGeometry = null;
                        shapeCtrl.shapeEditorResult.setFinalGeometry(null);
                        shapeCtrl.shapeEditorResult.setOriginalGeometry(null);
                        editLayer.clear();
                        tooltipsCtrl.notify('交叉点内道路属性link上不能制作点限速,请重新选择link!', 'error');
                        return;
                    }
                    dsEdit.getByPid(pro.id, 'RDLINK').then(function (data) {
                        if ((e.latlng.distanceTo(L.latLng(data.geometry.coordinates[0][1], data.geometry.coordinates[0][0]))) < 0.5 || e.latlng.distanceTo(L.latLng(data.geometry.coordinates[data.geometry.coordinates.length - 1][1], data.geometry.coordinates[data.geometry.coordinates.length - 1][0])) < 0.5) {
                            selectCtrl.selectedFeatures = null;
                            editLayer.drawGeometry = null;
                            shapeCtrl.shapeEditorResult.setFinalGeometry(null);
                            shapeCtrl.shapeEditorResult.setOriginalGeometry(null);
                            editLayer.clear();
                            tooltipsCtrl.notify('点限速不能制作到关联link端点！', 'error');
                            map.currentTool.selectedFeatures.pop();
                            return;
                        }
                        if (data) {
                            rdSpeedLimit.inLinkPid = data.pid;
                            rdSpeedLimit.selectGeo.coordinates = [e.latlng.lng, e.latlng.lat];
                            highlightCtrl.clear();
                            highlightCtrl.highlight(rdSpeedLimit);
                            selectCtrl.onSelected({
                                geometry: data.geometry.coordinates,
                                id: data.pid,
                                direct: pro.direct,
                                point: $.extend(true, {}, shapeCtrl.shapeEditorResult.getFinalGeometry())
                            });
                            if (pro.direct == 1) {
                               // tooltipsCtrl.setEditEventType(FM.dataApi.GeoLiveModelType.RDSPEEDLIMIT);
                                var point = shapeCtrl.shapeEditorResult.getFinalGeometry();
                                var linkCoords = data.geometry.coordinates;
                                // 计算鼠标点位置与线的节点的关系，判断与鼠标点最近的节点
                                // 并用斜率判断默认值
                                var tp = map.latLngToContainerPoint([point.y, point.x]);
                                var dist;
                                var sVertex;
                                var eVertex;
                                var d1;
                                var d2;
                                var d3;
                                for (var i = 0, len = linkCoords.length - 1; i < len; i++) {
                                    sVertex = map.latLngToContainerPoint(L.latLng(linkCoords[i][1], linkCoords[i][0]));
                                    eVertex = map.latLngToContainerPoint(L.latLng(linkCoords[i + 1][1], linkCoords[i + 1][0]));
                                    dist = L.LineUtil.pointToSegmentDistance(tp, sVertex, eVertex);
                                    if (dist < 5) {
                                        d1 = (tp.x - sVertex.x) * (tp.x - sVertex.x) + (tp.y - sVertex.y) * (tp.y - sVertex.y);
                                        d2 = (tp.x - eVertex.x) * (tp.x - eVertex.x) + (tp.y - eVertex.y) * (tp.y - eVertex.y);
                                        d3 = (sVertex.x - eVertex.x) * (sVertex.x - eVertex.x) + (sVertex.y - eVertex.y) * (sVertex.y - eVertex.y);
                                        if (d1 <= d3 && d2 <= d3) {
                                            break;
                                        }
                                    }
                                }
                                angle = $scope.angleOfLink(sVertex, eVertex);
                                if (sVertex.x > eVertex.x || (sVertex.x == eVertex.x && sVertex.y > eVertex.y)) {
                                    angle += Math.PI;
                                }
                                var marker = {
                                    flag: false,
                                    point: point,
                                    type: 'marker',
                                    angle: angle,
                                    orientation: '2', // 默认都是顺方向
                                    pointForDirect: point
                                };
                                layerCtrl.pushLayerFront('edit');
                                var sObj = shapeCtrl.shapeEditorResult;
                                editLayer.drawGeometry = marker;
                                editLayer.draw(marker, editLayer);
                                sObj.setOriginalGeometry(marker);
                                sObj.setFinalGeometry(marker);
                                shapeCtrl.setEditingType('speedLimit');
                                shapeCtrl.startEditing();
                                tooltipsCtrl.setCurrentTooltip('选择方向!');
                                eventController.off(eventController.eventTypes.DIRECTEVENT);
                                eventController.on(eventController.eventTypes.DIRECTEVENT, function (dd) {
                                    selectCtrl.selectedFeatures.direct = parseInt(dd.geometry.orientation, 10);
                                    tooltipsCtrl.setChangeInnerHtml('点击空格保存,或者按ESC键取消!');
                                });
                            } else {
                                // shapeCtrl.shapeEditorResult.setFinalGeometry(null);
                                tooltipsCtrl.setEditEventType('speedLimit');
                                tooltipsCtrl.setCurrentTooltip('请点击空格,创建限速!');
                                shapeCtrl.setEditingType('speedLimit');
                            }
                        }
                    });
                });
            } else if (type === 'RDMILEAGEPILE') { // 里程桩
                shapeCtrl.setEditFeatType(null);
                shapeCtrl.setEditingType('addMileagePile');
                shapeCtrl.startEditing();
                map.currentTool = shapeCtrl.getCurrentTool();
                map.currentTool.snapHandler.addGuideLayer(rdLink);
                map.currentTool.enable();
                tooltipsCtrl.setEditEventType('addMileagePile');
                tooltipsCtrl.setCurrentTooltip('在link上点击增加里程桩!！', 'info');
                eventController.off(eventController.eventTypes.RESETCOMPLETE);
                eventController.on(eventController.eventTypes.RESETCOMPLETE, function (e) {
                    shapeCtrl.setEditFeatType(null);
                    var pro = e.property;
                    var highLightrdMileagepile = {
                        rowId: 'rdMileagepile009',
                        geoLiveType: 'DEFAULTSELECTPOINTTOPO',
                        inLinkPid: pro.id,
                        selectGeo: {
                            type: 'Point',
                            coordinates: [e.latlng.lng, e.latlng.lat]
                        }
                    };
                    /*
                     * 对里程桩的合法性做判断;
                     * (1)不能为道路的端点;
                     * (2)关联link种别不能为0、5、6、7、8、9、10、11、13、15，否则，给提示“里程桩关联link不能是8级及以下道路”，不允许创建里程桩;
                     * (3)里程桩的点位必须在其关联link上
                     * (4)里程桩的关联link不可以是图廓线;
                     * */
                    if (['1', '2', '3', '4'].indexOf(pro.kind) == -1) {
                        editLayer.drawGeometry = null;
                        shapeCtrl.shapeEditorResult.setFinalGeometry(null);
                        shapeCtrl.shapeEditorResult.setOriginalGeometry(null);
                        editLayer.clear();
                        tooltipsCtrl.notify('里程桩关联link不能是1,2,3,4级以外的道路！', 'error');
                        return;
                    }
                    if (pro.form.indexOf('50') > -1 || pro.form.indexOf('35') > -1 || pro.form.indexOf('39') > -1 || pro.form.indexOf('37') > -1 || pro.form.indexOf('38') > -1) {
                        editLayer.drawGeometry = null;
                        shapeCtrl.shapeEditorResult.setFinalGeometry(null);
                        shapeCtrl.shapeEditorResult.setOriginalGeometry(null);
                        editLayer.clear();
                        tooltipsCtrl.notify('道路形态为交叉点内道路、调头口、主辅路出入口、提左、提右时不能创建里程桩！', 'error');
                        return;
                    }
                    shapeCtrl.setEditFeatType('mileagePile');
                    dsEdit.getByPid(pro.id, 'RDLINK').then(function (data) {
                        if (data) {
                            if (e.latlng.distanceTo(L.latLng(data.geometry.coordinates[0][1], data.geometry.coordinates[0][0])) < 1 || e.latlng.distanceTo(L.latLng(data.geometry.coordinates[data.geometry.coordinates.length - 1][1], data.geometry.coordinates[data.geometry.coordinates.length - 1][0])) < 1) {
                                selectCtrl.selectedFeatures = null;
                                editLayer.drawGeometry = null;
                                shapeCtrl.shapeEditorResult.setFinalGeometry(null);
                                shapeCtrl.shapeEditorResult.setOriginalGeometry(null);
                                editLayer.clear();
                                tooltipsCtrl.notify('道路的端点不能作为里程桩，请重新选择位置！', 'error');
                                return;
                            }
                            // selectCtrl.selectedFeatures = {
                            //    linkPid:pro.id,
                            //    point:e.latlng
                            // };
                            shapeCtrl.shapeEditorResult.setProperties({
                                linkPid: pro.id
                            });
                            highlightCtrl.clear();
                            highlightCtrl.highlight(highLightrdMileagepile);
                            shapeCtrl.setEditFeatType('mileagePile');
                            tooltipsCtrl.setCurrentTooltip('请点击空格,创建里程桩!', 'succ');
                        }
                    });
                });
            } else if (type === 'RDCROSS') {
                var linksArr = [];
                var nodesArr = [];
                var nodes = [];
                var links = [];
                var crossForm = {
                    rowId: '0',
                    geoLiveType: 'DEFAULTRDSLOPETOPO',
                    joinLinkPid: [],
                    inNodePid: []
                };
                shapeCtrl.setEditingType('addCross');
                tooltipsCtrl.setCurrentTooltip('请框选路口组成Node！');
                shapeCtrl.toolsSeparateOfEditor('addRdCross', {
                    map: map,
                    layer: [rdLink],
                    type: 'rectangle'
                });
                map.currentTool = shapeCtrl.getCurrentTool();
                eventController.off(eventController.eventTypes.GETBOXDATA);
                eventController.on(eventController.eventTypes.GETBOXDATA, function (dd) {
                    tooltipsCtrl.setCurrentTooltip('已选择路口，按空格保存或者esc取消！');
                    var data = $scope.getDataFromRectangleForCross(dd);
                    if (nodesArr.length === 0) {
                        for (var nodeNum = 0, nodeLen = data.nodes.length; nodeNum < nodeLen; nodeNum++) {
                            nodesArr.push(data.nodes[nodeNum].node);
                        }
                        for (var linkNum = 0, linkLen = data.links.length; linkNum < linkLen; linkNum++) {
                            nodesArr = nodesArr.concat(data.links[linkNum].node);
                            linksArr.push(data.links[linkNum].link);
                        }
                        nodes = nodes.concat(data.nodes);
                        links = links.concat(data.links);
                    } else if (data.nodes) {
                        if ($scope.containsNode(nodesArr, data.nodes)) {
                            var minusObj = $scope.minusArrByNode(nodesArr, linksArr, data.nodes);
                            linksArr = minusObj.link;
                            nodesArr = minusObj.node;
                        } else {
                            nodes = $scope.addArrByNode(nodesArr, linksArr, nodes, data.nodes);
                        }
                    } else if (data.links) {
                        if ($scope.containLink(linksArr, data.links)) {
                            var minusLink = $scope.minusArrByLink(linksArr, nodesArr, data.links);
                            linksArr = minusLink.link;
                            nodesArr = minusLink.node;
                        } else {
                            $scope.addArrByLink(linksArr, nodesArr, links, nodes, data.links);
                        }
                    }
                    linksArr = $scope.distinctArr(linksArr);
                    nodesArr = $scope.distinctArr(nodesArr);
                    var i;
                    for (i = 0; i < linksArr.length; i++) {
                        linksArr[i] = parseInt(linksArr[i], 10);
                    }
                    for (i = 0; i < nodesArr.length; i++) {
                        nodesArr[i] = parseInt(nodesArr[i], 10);
                    }
                    crossForm.joinLinkPid = linksArr;
                    crossForm.inNodePid = nodesArr;
                    highlightCtrl.clear();
                    highlightCtrl.highlight(crossForm);
                    selectCtrl.onSelected(crossForm);
                });
            } else if (type === 'RDLANECONNEXITY') {
                map.currentTool = new fastmap.uikit.SelectForRestriction({
                    map: map,
                    createLaneFlag: true,
                    currentEditLayer: rdLink,
                    shapeEditor: shapeCtrl,
                    operationList: ['line', 'point', 'line']
                });
                map.currentTool.enable();
            } else if (type === 'RDGSC_BAK') {
                $scope.selfInter = false; // 是否是自相交
                $scope.selfInterData = {};
                $scope.selfInterData.crossGeos = [];

                tooltipsCtrl.setEditEventType('rdgsc');
                tooltipsCtrl.setCurrentTooltip('正要新建立交,请框选立交点位！');
                shapeCtrl.toolsSeparateOfEditor('addRdGsc', {
                    map: map,
                    layer: [rdLink, rwLink, lcLink],
                    type: 'rectangle'
                });
                map.currentTool = shapeCtrl.getCurrentTool();
                var COLORTABLE = ['#14B7FC', '#4FFFB6', 'F8B19C', '#FCD6A4'];
                var LINKTYPES = {
                    RDLINK: 'rdLink',
                    RWLINK: 'rwLink',
                    LCLINK: 'lcLink'
                };
                eventController.off(eventController.eventTypes.GETBOXDATA);
                eventController.on(eventController.eventTypes.GETBOXDATA, function (dd) {
                    $scope.jsonData = null;
                    highRenderCtrl._cleanHighLight();
                    highRenderCtrl.highLightFeatures.length = 0;
                    var data = dd.data;
                    var highlightFeatures = [];
                    var containObj = {};
                    var dealData = [];
                    var rectangleData = { // 矩形框信息geoJson
                        type: 'Polygon',
                        coordinates: [
                            []
                        ]
                    };
                    var latArr = dd.border._latlngs;
                    /* 过滤框选后的数组，去重*/
                    for (var num = 0, numLen = data.length; num < numLen; num++) {
                        if (!containObj[data[num].data.properties.id]) {
                            dealData.push(data[num]);
                            containObj[data[num].data.properties.id] = true;
                        }
                    }
                    // 获取矩形框的外包矩形
                    for (var rec = 0; rec < latArr.length; rec++) {
                        var tempArr = [];
                        tempArr.push(latArr[rec].lng);
                        tempArr.push(latArr[rec].lat);
                        rectangleData.coordinates[0].push(tempArr);
                        if (rec == latArr.length - 1) {
                            rectangleData.coordinates[0].push(rectangleData.coordinates[0][0]);
                        }
                    }

                    var selectOneGSC = function (e, crossGeos) { // 立交点击事件
                        map.removeLayer(map.markerLayer); // 取消掉mark图层
                        var currentPoint = L.latLng(e.latlng.lng, e.latlng.lat);
                        var minDis = Number.MAX_VALUE;
                        var index = 0;
                        for (var c = 0; c < crossGeos.length; c++) { // //获取交点到当前点击点最近的那个交点
                            var tempPoint = L.latLng(Number(crossGeos[c].x), Number(crossGeos[c].y));
                            var dis = currentPoint.distanceTo(tempPoint);
                            if (dis < minDis) {
                                minDis = dis;
                                index = c;
                            }
                        }
                        var tempObjA = {
                            pid: crossGeos[index].linkIdA,
                            type: crossGeos[index].featTypeA, // 必须定义成type
                            zlevel: 0
                        };
                        var tempObjB = {
                            pid: crossGeos[index].linkIdB,
                            type: crossGeos[index].featTypeB,
                            zlevel: 1
                        };
                        var tempOjbs = [];
                        tempOjbs.push(tempObjA);
                        tempOjbs.push(tempObjB);
                        $scope.jsonData.linkObjs = tempOjbs;
                        $scope.jsonData.gscPoint = {
                            latitude: crossGeos[index].y,
                            longitude: crossGeos[index].x
                        };
                        highRenderCtrl._cleanHighLight();
                        highRenderCtrl.highLightFeatures.length = 0;
                        highlightFeatures = [];
                        for (var i = 0, lenI = tempOjbs.length; i < lenI; i++) {
                            highlightFeatures.push({
                                id: tempOjbs[i].pid.toString(),
                                layerid: LINKTYPES[tempOjbs[i].type],
                                type: 'line',
                                index: i,
                                style: {
                                    strokeWidth: 5,
                                    strokeColor: COLORTABLE[i]
                                }
                            });
                        }
                        highRenderCtrl.highLightFeatures = highlightFeatures;
                        highRenderCtrl.drawHighlight();
                        tooltipsCtrl.setCurrentTooltip('点击link调整层级、空格保存或者按ESC键取消!');
                        $scope.changeLevel();
                        shapeCtrl.shapeEditorResult.setFinalGeometry($scope.jsonData);
                    };

                    /* 当坐标数组拆分组合完成后*/
                    var crossGeos = [];
                    var i = 0;
                    var sepLinks = [];
                    $scope.jsonData = {
                        geometry: rectangleData,
                        linkObjs: []
                    };
                    if (dealData.length > 1) { // 有bug，一条线和另一条线有多个交点时不适用
                        sepLinks = [];
                        for (i = 0; i < dealData.length; i++) {
                            var linkArr = $scope.seprateLink(dealData[i].line.points).pointsObj; // 将线分成多条线
                            var linkData = [];
                            for (var t = 0; t < linkArr.length; t++) {
                                var linkObj = {
                                    line: linkArr[t],
                                    data: dealData[i].data,
                                    index: t
                                };
                                linkData.push(linkObj);
                            }
                            sepLinks = sepLinks.concat(linkData);
                        }
                        var lineGeoArr = function (mark) {
                            return [sepLinks[mark].line[0], sepLinks[mark].line[sepLinks[mark].line.length - 1], sepLinks[mark].data.properties.id, sepLinks[mark].data.properties.featType];
                        };
                        for (i = 0; i < sepLinks.length; i++) {
                            for (var j = i + 1; j < sepLinks.length; j++) {
                                var temp = $scope.segmentsIntr(lineGeoArr(i), lineGeoArr(j));
                                if (temp) {
                                    temp.index = sepLinks[i].index + '-' + sepLinks[j].index;
                                    crossGeos.push(temp);
                                }
                            }
                        }
                        crossGeos = $scope.ArrUnique(crossGeos);
                    } else if (dealData.length == 1) {
                        if (dealData[0].line.points.length > 3) {
                            var shapePoints = dealData[0].line.points; // 形状点
                            sepLinks = $scope.seprateLink(shapePoints); // 将线分成多条线
                            $scope.selfInterData.links = sepLinks;
                            var lineGeos = function (index) {
                                return [sepLinks.pointsObj[index][0], sepLinks.pointsObj[index][sepLinks.pointsObj[index].length - 1]];
                            };
                            for (i = 0; i < sepLinks.pointsObj.length - 1; i++) {
                                for (j = i + 1; j < sepLinks.pointsObj.length; j++) {
                                    var te = $scope.segmentsIntr(lineGeos(i), lineGeos(j)); // 获取线的交点
                                    if (te) {
                                        crossGeos.push(te);
                                        $scope.selfInter = true;
                                        te.index = i + '-' + j;
                                        $scope.selfInterData.crossGeos.push(te);
                                    }
                                }
                            }
                            if (crossGeos.length > 0) {
                                $scope.selfInterData.crosses = crossGeos;
                            }
                        } else {
                            swal('错误信息', '所选Link无自相交点，请重新选择立交点位！', 'error');
                            highRenderCtrl._cleanHighLight();
                        }
                    }

                    // 判断相交点数
                    if (crossGeos.length == 0) { // 无相交点
                        swal('错误信息', '所选区域无相交点，请重新选择立交点位！', 'error');
                        // tooltipsCtrl.setCurrentTooltip('所选区域无相交点，请重新选择立交点位！');
                    } else if (crossGeos.length > 1) { // 有多个相交点，提示选择其中一个
                        map.currentTool.disable(); // 取消鼠标事件
                        var markerArr = [];
                        for (i = 0; i < crossGeos.length; i++) {
                            var point = new L.LatLng(parseFloat(crossGeos[i].y), parseFloat(crossGeos[i].x));
                            var poiFeature = L.marker(point, {
                                draggable: false,
                                opacity: 0.8,
                                riseOnHover: true,
                                riseOffset: 300,
                                rotate: false,
                                angle: 20,
                                title: '点击制作立交',
                                icon: L.icon({
                                    iconUrl: appPath.root + 'images/road/img/cross.svg',
                                    iconSize: [16, 16],
                                    popupAnchor: [0, -32]
                                })
                            }).on('click', function (e) {
                                selectOneGSC(e, crossGeos);
                            });
                            markerArr.push(poiFeature);
                        }
                        var layers = L.layerGroup(markerArr);
                        map.markerLayer = layers;
                        map.addLayer(layers);
                    } else if ($scope.selfInter) { // 自相交，不能用highRenderCtrl的方式高亮
                        map.currentTool.disable(); // 取消鼠标事件
                        var mark = $scope.selfInterData.crossGeos[0].index.split('-');
                        var points = $scope.selfInterData.links.pointsObj;
                        var pointLine1 = points[parseInt(mark[0], 10)];
                        var pointLine2 = points[parseInt(mark[1], 10)];
                        var feature = {};
                        var colors = ['#14B7FC', '#4FFFB6', '#F8B19C', '#FCD6A4'];
                        var lines = [];
                        lines.push(pointLine1);
                        lines.push(pointLine2);
                        feature.type = 'GSC';
                        feature.geos = lines;
                        feature.style = colors;
                        layerCtrl.pushLayerFront('edit'); // 使编辑图层置顶
                        editLayer.drawGeometry = feature;
                        editLayer.draw(feature, editLayer, colors); // 在编辑图层中画出需要编辑的几何体
                        var tempObj = {
                            pid: dealData[0].data.properties.id,
                            type: dealData[0].data.properties.featType,
                            zlevel: 0
                        };
                        var tempObjs = {
                            pid: dealData[0].data.properties.id,
                            type: dealData[0].data.properties.featType,
                            zlevel: 1
                        };
                        $scope.jsonData.linkObjs.push(tempObj);
                        $scope.jsonData.linkObjs.push(tempObjs);
                        tooltipsCtrl.setCurrentTooltip('点击link调整层级,空格保存,或者按ESC键取消!');
                        shapeCtrl.shapeEditorResult.setFinalGeometry($scope.jsonData);
                        map._container.style.cursor = '';
                        map.currentTool = new fastmap.uikit.SelectGSC({
                            map: map,
                            currentEditLayer: editLayer
                        });
                        map.currentTool.enable();
                        eventController.off(eventController.eventTypes.GETEDITDATA, $scope.changeGSCIndex);
                        eventController.on(eventController.eventTypes.GETEDITDATA, $scope.changeGSCIndex);
                    } else { // 只有一个相交点，直接高亮进行操作
                        var lenI = 0;
                        for (i = 0, lenI = dealData.length; i < lenI; i++) {
                            highlightFeatures.push({
                                id: dealData[i].data.properties.id.toString(),
                                layerid: LINKTYPES[dealData[i].data.properties.featType],
                                type: 'line',
                                index: i,
                                style: {
                                    strokeWidth: 5,
                                    strokeColor: COLORTABLE[i]
                                }
                            });
                        }
                        highRenderCtrl.highLightFeatures = highlightFeatures;
                        highRenderCtrl.drawHighlight();
                        // map.currentTool.disable();//禁止当前的参考线图层的事件捕获
                        /* 重组linkData格式*/
                        for (var linkMark = 0; linkMark < dealData.length; linkMark++) {
                            tempObj = {
                                pid: dealData[linkMark].data.properties.id,
                                type: dealData[linkMark].data.properties.featType,
                                zlevel: linkMark
                            };
                            $scope.jsonData.linkObjs.push(tempObj);
                        }
                        tooltipsCtrl.setCurrentTooltip('点击link调整层级,空格保存,或者按ESC键取消!');
                        $scope.changeLevel();
                        shapeCtrl.shapeEditorResult.setFinalGeometry($scope.jsonData);
                    }
                });
            } else if (type === 'RDGSC') {
                // 如果两个点离的很近，则认为是同一个点
                var _isSamePoint = function (pt1, pt2) {
                    return (Math.abs(pt1.x - pt2.x) < 0.00001 && Math.abs(pt1.y - pt2.y) < 0.00001);
                };
                // 合并两个数组，将featList2中满足条件的数据合并到featList1中
                var _mergeFeatureList = function (featList1, featList2) {
                    var i,
                        j,
                        f;
                    var temp = [];
                    for (i = 0; i < featList2.length; i++) {
                        f = true;
                        for (j = 0; j < featList1.length; j++) {
                            if (featList1[j].featType === featList2[i].featType && featList1[j].pid === featList2[i].pid) {
                                // 去重两种数据：1.完全相同；2.同一要素的相邻的折线段
                                if (Math.abs(featList1[j].index - featList2[i].index) <= 1) {
                                    f = false;
                                    break;
                                }
                            }
                        }
                        if (f) {
                            temp.push(featList2[i]);
                        }
                    }
                    if (temp.length > 0) {
                        Array.prototype.push.apply(featList1, temp);
                    }
                };
                var _createPolyLine = function (linkSegment, linkSegments) {
                    var sps = linkSegment.segment.shapePoints;
                    var latLngs = [];
                    for (var i = 0; i < sps.length; i++) {
                        latLngs.push(new L.LatLng(sps[i].y, sps[i].x));
                    }
                    return L.polyline(latLngs, {
                        color: linkSegment.style.color,
                        weight: 5,
                        opacity: 1
                    }).on('click', function (e) {
                        var colorTable = ['#14B7FC', '#4FFFB6', '#F8B19C', '#FCD6A4', '#14B7FC', '#4FFFB6', '#F8B19C', '#FCD6A4'];
                        if (linkSegment.prop.geoLiveType == 'RDLINK' && linkSegment.prop.form.indexOf('31') > -1) {
                            // 隧道排在最底层
                            linkSegments.sort(function (a, b) {
                                var result;
                                if (a.type == 'RDLINK') {
                                    result = a.prop.form.indexOf('31') >= 0 ? 1 : -1;
                                } else {
                                    result = a.pid - b.pid;
                                }
                                return result;
                            });
                            return;
                        }
                        this.bringToFront();
                        for (i = 0; i < linkSegments.length; i++) {
                            if (linkSegments[i].pid === linkSegment.pid && linkSegments[i].type === linkSegment.type && linkSegments[i].index === linkSegment.index) {
                                linkSegments.splice(i, 1);
                                break;
                            }
                        }
                        linkSegments.push(linkSegment);
                        var polylines = [];
                        for (i = 0; i < linkSegments.length; i++) {
                            linkSegments[i].style = {
                                color: colorTable[i]
                            };
                            polylines.push(_createPolyLine(linkSegments[i], linkSegments));
                        }
                        map.EditingVectorLayers.push(L.featureGroup(polylines).addTo(map).bringToFront());
                    });
                };
                var _highlightGscLink = function (linkSegments) {
                    $scope.clearEditingVertorLayer();
                    var polylines = [];
                    for (var i = 0; i < linkSegments.length; i++) {
                        polylines.push(_createPolyLine(linkSegments[i], linkSegments));
                    }
                    map.EditingVectorLayers.push(L.featureGroup(polylines).addTo(map).bringToFront());
                };
                // 矩形框信息geoJson
                var selectBox = {
                    type: 'Polygon',
                    coordinates: [
                        []
                    ]
                };
                // 创建立交
                var _addRdGSC = function (intersectPoint) {
                    var colorTable = ['#14B7FC', '#4FFFB6', '#F8B19C', '#FCD6A4', '#14B7FC', '#4FFFB6', '#F8B19C', '#FCD6A4'];
                    // 隧道排在最底层
                    intersectPoint.data.sort(function (a, b) {
                        var result;
                        if (a.type == 'RDLINK') {
                            result = a.prop.form.indexOf('31') >= 0 ? 1 : -1;
                        } else {
                            result = a.pid - b.pid;
                        }
                        return result;
                    });
                    for (var i = 0; i < intersectPoint.data.length; i++) {
                        intersectPoint.data[i].style = {
                            color: colorTable[i]
                        };
                    }
                    shapeCtrl.shapeEditorResult.setFinalGeometry({
                        geometry: selectBox,
                        gscPoint: {
                            latitude: intersectPoint.point.y,
                            longitude: intersectPoint.point.x
                        },
                        linkObjs: intersectPoint.data
                    });
                    _highlightGscLink(intersectPoint.data);
                    tooltipsCtrl.setCurrentTooltip('点击link调整层级，空格保存，或者按ESC键取消操作!');
                };
                var _createMarker = function (inter) {
                    return L.marker(new L.LatLng(inter.point.y, inter.point.x), {
                        draggable: false,
                        opacity: 0.8,
                        riseOnHover: true,
                        riseOffset: 300,
                        rotate: false,
                        angle: 20,
                        title: '点击制作立交',
                        icon: L.icon({
                            iconUrl: appPath.root + 'images/road/img/cross.svg',
                            iconSize: [16, 16],
                            popupAnchor: [0, -32]
                        })
                    }).on('click', function () {
                        _addRdGSC(inter);
                    });
                };

                tooltipsCtrl.setEditEventType('rdGsc');
                tooltipsCtrl.setCurrentTooltip('正要新建立交,请框选立交点位！');
                shapeCtrl.setEditingType('addRdGsc');
                shapeCtrl.toolsSeparateOfEditor('addRdGsc', {
                    map: map,
                    layer: [rdLink, rwLink, lcLink],
                    type: 'rectangle'
                });
                map.currentTool = shapeCtrl.getCurrentTool();
                eventController.off(eventController.eventTypes.GETBOXDATA);
                eventController.on(eventController.eventTypes.GETBOXDATA, function (dd) {
                    $scope.clearEditingVertorLayer();
                    var featList = [];
                    /* 过滤框选后的数组，去重*/
                    var pushed = {};
                    var i,
                        j,
                        k;
                    // 生成框选框的几何信息
                    for (i = 0; i < dd.border._latlngs.length; i++) {
                        selectBox.coordinates[0].push([dd.border._latlngs[i].lng, dd.border._latlngs[i].lat]);
                    }
                    selectBox.coordinates[0].push(selectBox.coordinates[0][0]);
                    for (i = 0; i < dd.data.length; i++) {
                        if (!pushed[dd.data[i].data.properties.id]) {
                            featList.push(dd.data[i]);
                            pushed[dd.data[i].data.properties.id] = true;
                        }
                    }
                    var linkSegments = []; // 要素link拆分出来的线段（与角度有关系，可能是曲线）
                    var segments;
                    for (i = 0; i < featList.length; i++) {
                        segments = seperateLink(featList[i].line.points, 0); // 将线分成多条线
                        for (j = 0; j < segments.length; j++) {
                            linkSegments.push({
                                pid: featList[i].data.properties.id,
                                type: featList[i].data.properties.geoLiveType,
                                prop: featList[i].data.properties,
                                segment: segments[j],
                                index: j
                            });
                        }
                    }
                    // 测试，将分割后的线段高亮
                    // var test;
                    // for (i = 0; i < linkSegments.length; i++) {
                    //     linkSegments[i].zIndex = i;
                    //     test = _createPolyLine(linkSegments[i]);
                    //     test.addTo(map);
                    //     map.EditingVectorLayers.push(test);
                    // }
                    var intersectList = [];
                    var interPointList;
                    // 计算折线段的交点
                    for (i = 0; i < linkSegments.length - 1; i++) {
                        for (j = i + 1; j < linkSegments.length; j++) {
                            // 同一个要素link的相挂接的两条折线不进行相交计算
                            if (!(linkSegments[i].pid == linkSegments[j].pid && linkSegments[i].type == linkSegments[j].type && Math.abs(linkSegments[i].index - linkSegments[j].index) === 1)) {
                                interPointList = linkIntersect(linkSegments[i].segment, linkSegments[j].segment);
                                if (interPointList.length > 0) {
                                    for (k = 0; k < interPointList.length; k++) {
                                        intersectList.push({
                                            point: interPointList[k].point,
                                            data: [linkSegments[i], linkSegments[j]]
                                        });
                                    }
                                }
                            }
                        }
                    }
                    // 从交点数据列表中去掉未被框选的
                    // map.EditingVectorLayers.push(L.polygon(event.border._latlngs).addTo(map)); // 测试用，显示框选区域
                    for (i = intersectList.length - 1; i >= 0; i--) {
                        if (!dd.border.getBounds().contains(L.latLng(intersectList[i].point.y, intersectList[i].point.x))) {
                            // map.EditingVectorLayers.push(L.marker(L.latLng(intersectList[i].point.y,
                            // intersectList[i].point.x)).addTo(map)); // 测试用，显示不在范围内的交点
                            intersectList.splice(i, 1);
                        }
                    }
                    // 合并交点相同（相近）的数据
                    for (i = 0; i < intersectList.length - 1; i++) {
                        if (!intersectList[i].merged) {
                            for (j = i + 1; j < intersectList.length; j++) {
                                if (!intersectList[j].merged) {
                                    if (_isSamePoint(intersectList[i].point, intersectList[j].point)) {
                                        _mergeFeatureList(intersectList[i].data, intersectList[j].data);
                                        intersectList[j].merged = true;
                                    }
                                }
                            }
                        }
                    }
                    // 从交点数据列表中去掉被合并的
                    for (i = intersectList.length - 1; i >= 0; i--) {
                        if (intersectList[i].merged) {
                            intersectList.splice(i, 1);
                        }
                    }
                    // 判断相交点数
                    var intersectMarkers = [];
                    var inter,
                        marker;
                    if (intersectList.length == 0) { // 无相交点
                        swal('框选区域无相交点，请重新选择立交点位！', null, 'info');
                        // tooltipsCtrl.notify('所选区域无相交点，请重新选择立交点位！', 'error');
                    } else if (intersectList.length > 1) { // 有多个相交点，提示选择其中一个
                        map.currentTool.disable(); // 取消鼠标事件
                        for (i = 0; i < intersectList.length; i++) {
                            intersectMarkers.push(_createMarker(intersectList[i]));
                        }
                        var layer = L.layerGroup(intersectMarkers).addTo(map);
                        map.EditingVectorLayers.push(layer);
                        tooltipsCtrl.setCurrentTooltip('框选区域有多个相交点，请点击其中一个创建立交!');
                    } else { // 只有一个相交点，直接高亮进行操作
                        map.currentTool.disable(); // 取消鼠标事件
                        _addRdGSC(intersectList[0]);
                    }
                });
            } else if (type === 'RDTRAFFICSIGNAL') { // 信号灯
                var rdTrafficSignalHighLight = {
                    rowId: 'RDTRAFFICSIGNAL008',
                    geoLiveType: 'DEFAULTNODETOPO',
                    nodePid: 0
                };
                shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.TRAFFICSIGNAL);
                tooltipsCtrl.setCurrentTooltip('请选择制作信号灯的路口！');
                layerCtrl.pushLayerFront('edit'); // 置顶editLayer
                // 初始化选择点工具
                map.currentTool = new fastmap.uikit.SelectNode({
                    map: map,
                    // nodesFlag: true,
                    shapeEditor: shapeCtrl
                });
                map.currentTool.enable();
                // 需要捕捉的图层
                eventController.off(eventController.eventTypes.GETNODEID);
                eventController.on(eventController.eventTypes.GETNODEID, function (data) {
                    // $scope.$emit('SWITCHCONTAINERSTATE', {
                    //     subAttrContainerTpl: false
                    // });
                    // 地图小于17级时不能选择
                    // if (map.getZoom < 17) {
                    //     return;
                    // }
                    // map.closePopup(); // 如果有popup的话清除它
                    // if (map.floatMenu) {
                    //     map.removeLayer(map.floatMenu);
                    //     map.floatMenu = null;
                    // }
                    rdTrafficSignalHighLight.nodePid = parseInt(data.id, 10);
                    highlightCtrl.clear();
                    highlightCtrl.highlight(rdTrafficSignalHighLight);
                    tooltipsCtrl.setCurrentTooltip('点击空格保存信号灯,或者按ESC键取消!');
                });
            } else if (type === 'RDGATE') { // 大门
                var rdGateHighLight = {
                    rowId: 'RDGATE0010',
                    geoLiveType: 'DEFAULTTOPO',
                    inLinkPid: 0,
                    nodePid: 0,
                    outLinkPid: 0
                };
                // 保存所有需要高亮的图层数组;线方向
                var linkDirect = 0;
                // 设置快捷键保存的事件类型供热键通过（shapeCtrl.editType）监听;
                shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.GATE);
                // 地图编辑相关设置;
                tooltipsCtrl.setEditEventType('rdGate');
                tooltipsCtrl.setCurrentTooltip('请选择进入线！');
                map.currentTool = new fastmap.uikit.SelectForRestriction({
                    map: map,
                    createBranchFlag: true,
                    currentEditLayer: rdLink,
                    shapeEditor: shapeCtrl,
                    operationList: ['line', 'point']
                });
                map.currentTool.enable();
                map.currentTool.snapHandler.addGuideLayer(rdLink);
                $scope.gate = {};
                featCodeCtrl.setFeatCode($scope.gate);
                var automaticCommand = function () { // 自动计算退出线
                    var param = {};
                    param.dbId = App.Temp.dbId;
                    param.type = 'RDLINK';
                    param.data = {
                        nodePid: $scope.gate.nodePid
                    };
                    dsEdit.getByCondition(param).then(function (continueLinks) {
                        if (continueLinks.errcode === -1) {
                            return;
                        }
                        if (continueLinks.data) {
                            if (continueLinks.data.length > 2) {
                                // featCodeCtrl.setFeatCode({});
                                swal('错误信息', '退出线有多条，不允许创建大门', 'error');
                                tooltipsCtrl.setCurrentTooltip('退出线有多条，不允许创建大门!');
                                return;
                            }
                            for (var i = 0, len = continueLinks.data.length; i < len; i++) {
                                if (continueLinks.data[i].pid != $scope.gate.inLinkPid) {
                                    $scope.gate.outLinkPid = continueLinks.data[i].pid;
                                    rdGateHighLight.outLinkPid = $scope.gate.outLinkPid;
                                    highlightCtrl.clear();
                                    highlightCtrl.highlight(rdGateHighLight);
                                    map.currentTool.selectedFeatures.push($scope.gate.outLinkPid.toString());
                                    // featCodeCtrl.setFeatCode($scope.gate);
                                    tooltipsCtrl.setCurrentTooltip('已选退出线,点击空格键保存!');
                                    break;
                                }
                            }
                            if (!$scope.gate.outLinkPid) {
                                tooltipsCtrl.setCurrentTooltip('当前所选线没有退出线，不能创建!');
                            }
                        }
                    });
                };
                eventController.off(eventController.eventTypes.GETLINKID);
                eventController.on(eventController.eventTypes.GETLINKID, function (data) {
                    if (data.index === 0) { // 进入线;
                        map.currentTool.snapHandler.snaped = false;
                        map.currentTool.clearCross();
                        map.currentTool.snapHandler._guides = [];
                        map.currentTool.snapHandler.addGuideLayer(rdnode);
                        $scope.gate.inLinkPid = parseInt(data.id, 10);
                        rdGateHighLight.inLinkPid = $scope.gate.inLinkPid;
                        highlightCtrl.clear();
                        highlightCtrl.highlight(rdGateHighLight);
                        linkDirect = data.properties.direct;
                        if (linkDirect == 2 || linkDirect == 3) { // 单方向
                            dsEdit.getByCondition({
                                dbId: App.Temp.dbId,
                                type: 'RDLINK',
                                data: {
                                    nodePid: linkDirect == 2 ? data.properties.enode : data.properties.snode
                                }
                            }).then(function (joinLinks) {
                                if (joinLinks.data.length !== 2) {
                                    tooltipsCtrl.notify('大门点的挂接link数必须为2条,请重新选择进入线!', 'error');
                                    map.currentTool.selectedFeatures.pop();
                                    return;
                                }
                                map.currentTool.snapHandler.snaped = false;
                                map.currentTool.clearCross();
                                map.currentTool.snapHandler._guides = [];
                                $scope.gate.nodePid = parseInt(linkDirect == 2 ? data.properties.enode : data.properties.snode, 10);
                                rdGateHighLight.nodePid = $scope.gate.nodePid;
                                highlightCtrl.clear();
                                highlightCtrl.highlight(rdGateHighLight);
                                map.currentTool.selectedFeatures.push($scope.gate.nodePid.toString());
                                automaticCommand();
                                // featCodeCtrl.setFeatCode($scope.gate);
                                // tooltipsCtrl.setCurrentTooltip("已选进入点,请选择退出线!");
                            });
                        } else {
                            tooltipsCtrl.setCurrentTooltip('已经选择进入线,请选择进入点!');
                        }
                    } else if (data.index === 1) { // 进入点
                        dsEdit.getByCondition({
                            dbId: App.Temp.dbId,
                            type: 'RDLINK',
                            data: {
                                nodePid: data.id
                            }
                        }).then(function (joinLinks) {
                            if (joinLinks.data.length !== 2) {
                                tooltipsCtrl.notify('大门点的挂接link数必须为2条!', 'error');
                                map.currentTool.selectedFeatures.pop();
                                return;
                            }
                            map.currentTool.snapHandler.snaped = false;
                            map.currentTool.clearCross();
                            map.currentTool.snapHandler._guides = [];
                            // map.currentTool.snapHandler.addGuideLayer(rdLink); //增加吸附图层
                            $scope.gate.nodePid = parseInt(data.id, 10);
                            rdGateHighLight.nodePid = $scope.gate.nodePid;
                            highlightCtrl.clear();
                            highlightCtrl.highlight(rdGateHighLight);
                            map.currentTool.selectedFeatures.push($scope.gate.nodePid.toString());
                            automaticCommand();
                        });
                        // 清除鼠标十字
                    } else if (data.index >= 2) { // 退出线
                        $scope.gate.outLinkPid = parseInt(data.id, 10);
                        rdGateHighLight.outLinkPid = $scope.gate.outLinkPid;
                        highlightCtrl.clear();
                        highlightCtrl.highlight(rdGateHighLight);
                        map.currentTool.selectedFeatures.push($scope.gate.outLinkPid.toString());
                        featCodeCtrl.setFeatCode($scope.gate);
                        tooltipsCtrl.setCurrentTooltip('已选退出线,点击空格键保存!');
                    }
                });
            } else if (type === 'RDLINKWARNING') { // 警示信息
                featCodeCtrl.setFeatCode({});
                // 保存所有需要高亮的图层数组;线方向
                var highLightFeatures = [];
                var rdWarninginfo = {
                    rowId: 'rdInfoWarning0110',
                    geoLiveType: 'DEFAULTTOPO',
                    inLinkPid: 0,
                    nodePid: 0
                };
                linkDirect = 0;
                // 设置快捷键保存的事件类型供热键通过（shapeCtrl.editType）监听;
                shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.WARNINGINFO);
                // 地图编辑相关设置;
                tooltipsCtrl.setEditEventType('rdLinkWarning');
                tooltipsCtrl.setCurrentTooltip('请选择进入线！');
                map.currentTool = new fastmap.uikit.SelectForRestriction({
                    map: map,
                    createBranchFlag: true,
                    currentEditLayer: rdLink,
                    shapeEditor: shapeCtrl,
                    operationList: ['line', 'point']
                });
                map.currentTool.enable();
                map.currentTool.snapHandler.addGuideLayer(rdLink);
                $scope.warningInfo = {};
                eventController.off(eventController.eventTypes.GETLINKID);
                eventController.on(eventController.eventTypes.GETLINKID, function (data) {
                    if (data.index === 0) { // 进入线;
                        if (data.properties.kind == 10 || data.properties.kind == 11 || data.properties.form.indexOf('20') > -1) {
                            tooltipsCtrl.notify('10级路、步行街、人渡不能作为警示信息的进入线!', 'error');
                            map.currentTool.selectedFeatures.pop();
                            return;
                        }
                        map.currentTool.snapHandler.snaped = false;
                        map.currentTool.clearCross();
                        map.currentTool.snapHandler._guides = [];
                        map.currentTool.snapHandler.addGuideLayer(rdnode);
                        $scope.warningInfo.inLinkPid = parseInt(data.id, 10);
                        rdWarninginfo.inLinkPid = $scope.warningInfo.inLinkPid;
                        highlightCtrl.clear();
                        highlightCtrl.highlight(rdWarninginfo);
                        tooltipsCtrl.setCurrentTooltip('已经选择进入线,选择进入点!');
                        linkDirect = data.properties.direct;
                        if (linkDirect == 2 || linkDirect == 3) { // 单方向
                            map.currentTool.snapHandler.snaped = false;
                            map.currentTool.clearCross();
                            map.currentTool.snapHandler._guides = [];
                            $scope.warningInfo.nodePid = parseInt(linkDirect == 2 ? data.properties.enode : data.properties.snode, 10);
                            dsEdit.getByPid($scope.warningInfo.nodePid, 'RDNODE').then(function (dat) {
                                if (dat) {
                                    if (dat.meshes.length > 1) {
                                        tooltipsCtrl.setCurrentTooltip('警示信息中的点形态不能是图廓点,请重新选择进入线!', 'error');
                                        map.currentTool.selectedFeatures.pop();
                                        rdWarninginfo = {
                                            rowId: 'rdLinkWarning0110',
                                            geoLiveType: 'DEFAULTTOPO',
                                            inLinkPid: 0,
                                            nodePid: 0
                                        };
                                        highlightCtrl.clear();
                                    } else {
                                        rdWarninginfo.nodePid = $scope.warningInfo.nodePid;
                                        highlightCtrl.clear();
                                        highlightCtrl.highlight(rdWarninginfo);
                                        map.currentTool.selectedFeatures.push($scope.warningInfo.nodePid.toString());
                                        featCodeCtrl.setFeatCode($scope.warningInfo);
                                        tooltipsCtrl.setCurrentTooltip('已选进入点,点击空格键保存!');
                                    }
                                } else {
                                    tooltipsCtrl.setCurrentTooltip('请重新选择进入点!');
                                }
                            });
                        }
                    } else if (data.index === 1) { // 进入点
                        $scope.warningInfo.nodePid = parseInt(data.id, 10);
                        dsEdit.getByPid($scope.warningInfo.nodePid, 'RDNODE').then(function (dat) {
                            if (dat) {
                                if (dat.meshes.length > 1) {
                                    tooltipsCtrl.notify('警示信息中的点形态不能是图廓点!', 'error');
                                    map.currentTool.selectedFeatures.pop();
                                } else {
                                    rdWarninginfo.nodePid = $scope.warningInfo.nodePid;
                                    highlightCtrl.clear();
                                    highlightCtrl.highlight(rdWarninginfo);
                                    map.currentTool.selectedFeatures.push($scope.warningInfo.nodePid.toString());
                                    featCodeCtrl.setFeatCode($scope.warningInfo);
                                    tooltipsCtrl.setCurrentTooltip('已选进入点,点击空格键保存!');
                                }
                            } else {
                                tooltipsCtrl.setCurrentTooltip('请重新选择进入点!');
                            }
                        });
                    }
                });
            } else if (type === 'RDELECTRONICEYE') { // 电子眼
                var rdElectRoniceye = {
                    rowId: 'rdElectRoniceye001',
                    geoLiveType: 'DEFAULTSELECTPOINTTOPO',
                    inLinkPid: 0,
                    selectGeo: {
                        type: 'Point',
                        coordinates: []
                    }
                };
                if (shapeCtrl.shapeEditorResult) {
                    shapeCtrl.shapeEditorResult.setFinalGeometry(fastmap.mapApi.lineString([fastmap.mapApi.point(0, 0)]));
                    selectCtrl.selectByGeometry(shapeCtrl.shapeEditorResult.getFinalGeometry());
                    layerCtrl.pushLayerFront('edit');
                }
                shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.POINTVERTEXADD);
                shapeCtrl.startEditing();
                map.currentTool = shapeCtrl.getCurrentTool();
                map.currentTool.enable();
                map.currentTool.snapHandler.addGuideLayer(rdLink);
                tooltipsCtrl.setEditEventType('pointVertexAdd');
                tooltipsCtrl.setCurrentTooltip('请选择电子眼位置点！');
                eventController.off(eventController.eventTypes.RESETCOMPLETE);
                eventController.on(eventController.eventTypes.RESETCOMPLETE, function (e) {
                    var pro = e.property;
                    dsEdit.getByPid(pro.id, 'RDLINK').then(function (data) {
                        if (data) {
                            rdElectRoniceye.inLinkPid = data.pid;
                            rdElectRoniceye.selectGeo.coordinates = [e.latlng.lng, e.latlng.lat];
                            highlightCtrl.clear();
                            highlightCtrl.highlight(rdElectRoniceye);
                            selectCtrl.onSelected({
                                geometry: data.geometry.coordinates,
                                id: data.pid,
                                direct: pro.direct,
                                point: $.extend(true, {}, shapeCtrl.shapeEditorResult.getFinalGeometry())
                            });
                            if (pro.direct == 1) {
                               // tooltipsCtrl.setEditEventType(FM.dataApi.GeoLiveModelType.RDELECTRONICEYE);
                                var point = shapeCtrl.shapeEditorResult.getFinalGeometry();
                                var linkCoords = data.geometry.coordinates;
                                // 计算鼠标点位置与线的节点的关系，判断与鼠标点最近的节点
                                // 并用斜率判断默认值
                                var index = 0;
                                var tp = map.latLngToContainerPoint([point.y, point.x]);
                                var dist,
                                    sVertex,
                                    eVertex,
                                    d1,
                                    d2,
                                    d3;
                                for (var i = 0, len = linkCoords.length - 1; i < len; i++) {
                                    sVertex = map.latLngToContainerPoint(L.latLng(linkCoords[i][1], linkCoords[i][0]));
                                    eVertex = map.latLngToContainerPoint(L.latLng(linkCoords[i + 1][1], linkCoords[i + 1][0]));
                                    dist = L.LineUtil.pointToSegmentDistance(tp, sVertex, eVertex);
                                    if (dist < 5) {
                                        d1 = (tp.x - sVertex.x) * (tp.x - sVertex.x) + (tp.y - sVertex.y) * (tp.y - sVertex.y);
                                        d2 = (tp.x - eVertex.x) * (tp.x - eVertex.x) + (tp.y - eVertex.y) * (tp.y - eVertex.y);
                                        d3 = (sVertex.x - eVertex.x) * (sVertex.x - eVertex.x) + (sVertex.y - eVertex.y) * (sVertex.y - eVertex.y);
                                        if (d1 <= d3 && d2 <= d3) {
                                            index = i;
                                            break;
                                        }
                                    }
                                }
                                angle = $scope.angleOfLink(sVertex, eVertex);
                                if (sVertex.x > eVertex.x || (sVertex.x == eVertex.x && sVertex.y > eVertex.y)) { // 从右往左划线或者从下网上划线
                                    angle = Math.PI + angle;
                                }
                                // tooltipsCtrl.setEditEventType(fastmap.dataApi.GeoLiveModelType.RDELECTRONICEYE);
                                var marker = {
                                    flag: false,
                                    point: point,
                                    type: 'marker',
                                    angle: angle,
                                    orientation: '2',
                                    pointForDirect: point
                                };
                                layerCtrl.pushLayerFront('edit');
                                var sObj = shapeCtrl.shapeEditorResult;
                                editLayer.drawGeometry = marker;
                                editLayer.draw(marker, editLayer);
                                // marker.orientation =2;
                                sObj.setOriginalGeometry(marker);
                                sObj.setFinalGeometry(marker);
                                shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.ELECTRONICEYE);
                                shapeCtrl.startEditing();
                                tooltipsCtrl.setCurrentTooltip('点击方向图标开始修改方向！');
                                eventController.off(eventController.eventTypes.DIRECTEVENT);
                                eventController.on(eventController.eventTypes.DIRECTEVENT, function (dd) {
                                    selectCtrl.selectedFeatures.direct = parseInt(dd.geometry.orientation, 10);
                                    tooltipsCtrl.setChangeInnerHtml('点击空格保存,或者按ESC键取消!');
                                });
                            } else {
                                shapeCtrl.shapeEditorResult.setFinalGeometry(null);
                                // tooltipsCtrl.setEditEventType(fastmap.dataApi.GeoLiveModelType.RDELECTRONICEYE);
                                tooltipsCtrl.setCurrentTooltip('请点击空格,创建电子眼!');
                                shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.ELECTRONICEYE);
                            }
                        } else {
                            tooltipsCtrl.setCurrentTooltip('请重新选择位置创建电子眼!');
                        }
                    });
                });
            } else if (type === 'RDSLOPE') { // 坡度
                var rdSlopeHighlight = {
                    rowId: 'RDSLOPE008',
                    geoLiveType: 'DEFAULTRDSLOPETOPO',
                    joinLinkPid: [],
                    inNodePid: 0,
                    DefaultOutLinkPid: [],
                    outLinkPid: 0
                };
                shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.RDSLOPE);
                tooltipsCtrl.setEditEventType('rdSlope');
                tooltipsCtrl.setCurrentTooltip('请选择坡度起始点！！');
                map.currentTool = new fastmap.uikit.SelectForRestriction({
                    map: map,
                    createBranchFlag: true,
                    currentEditLayer: rdLink,
                    shapeEditor: shapeCtrl,
                    operationList: ['point', 'line']
                });
                map.currentTool.enable();
                map.currentTool.snapHandler.addGuideLayer(rdnode);
                var slopeData = { // 保存坡度数据;
                    inNode: '',
                    outNode: '',
                    ouLink: '',
                    links: [],
                    linkLength: 0,
                    lastNode: '',
                    recomendOutLinks: [] // 坡度退出线可推荐的link
                };
                eventController.off(eventController.eventTypes.GETLINKID);
                eventController.on(eventController.eventTypes.GETLINKID, function (dataresult) {
                    if (dataresult.index === 0) {
                        var nodeLinks = angular.copy(dataresult.links);
                        /*
                         * 判断如果选择的是进入点不满足条件的判断;
                         * (1) 如果进入点是孤立的点（一般只有错误数据才有）
                         *（2）如果进入点挂接一个link，并且该link方向错误；
                         * */
                        for (var i = 0; i < dataresult.links.length; i++) {
                            var inNodeError = ((dataresult.links[i].enode == dataresult.id) && (dataresult.links[i].direct == 2)) ||
                                ((dataresult.links[i].snode == dataresult.id) && (dataresult.links[i].direct == 3));
                            if (inNodeError) {
                                dataresult.links.splice(i, 1);
                                i--;
                            }
                        }

                        if (dataresult.links.length === 0) {
                            map.currentTool.selectedFeatures.pop();
                            tooltipsCtrl.notify('该点无法做坡度', 'error');
                        } else {
                            // 图廓点不能作为进入点;
                            dsEdit.getByPid(dataresult.id, 'RDNODE').then(function (nodeData) {
                                if (nodeData.errcode === -1) { return; }
                                var flag = false;
                                nodeData.forms.forEach(function (item) {
                                    if (item.formOfWay == 2) {
                                        flag = true;
                                    }
                                });
                                if (nodeData.meshes.length >= 2 || flag) {
                                    tooltipsCtrl.notify('该点无法做坡度', 'error');
                                    map.currentTool.selectedFeatures.pop();
                                    return;
                                }
                                // 无论一条还是多条都是高亮显示并手动选择
                                rdSlopeHighlight.inNodePid = parseInt(dataresult.id, 10);
                                slopeData.inNode = dataresult.id.toString();
                                slopeData.lastNode = dataresult.id.toString();
                                tooltipsCtrl.setCurrentTooltip('已选择进入点，根据提示选择退出线');
                                for (var ai = 0; ai < dataresult.links.length; ai++) {
                                    slopeData.recomendOutLinks.push(parseInt(dataresult.links[ai].id, 10));
                                }
                                rdSlopeHighlight.DefaultOutLinkPid = slopeData.recomendOutLinks;
                                highlightCtrl.clear();
                                highlightCtrl.highlight(rdSlopeHighlight);
                                map.currentTool.snapHandler._guides.length = 0;
                                map.currentTool.snapHandler.addGuideLayer(rdLink);
                            });
                        }
                    } else {
                        var selectOutLinkIndexInRecArr = slopeData.recomendOutLinks.indexOf(dataresult.id);
                        var isOutLinkBySelected = (!slopeData.ouLink && selectOutLinkIndexInRecArr != -1) ||
                            (slopeData.ouLink && selectOutLinkIndexInRecArr != -1 && dataresult.id != slopeData.ouLink);
                        // 如果点击的是退出线;
                        if (isOutLinkBySelected) {
                            slopeData.links.length = 0;
                            slopeData.ouLink = dataresult.id;
                            slopeData.outNode = dataresult.properties.enode == slopeData.inNode ? dataresult.properties.snode : dataresult.properties.enode;
                            slopeData.lastNode = slopeData.outNode;
                            slopeData.outLinkLength = parseFloat(dataresult.properties.length);
                            slopeData.linkLength = 0;
                            slopeData.linkLength += parseFloat(dataresult.properties.length);
                            rdSlopeHighlight.DefaultOutLinkPid = [];
                            rdSlopeHighlight.joinLinkPid = [];
                            rdSlopeHighlight.outLinkPid = parseInt(dataresult.id, 10);
                            highlightCtrl.clear();
                            highlightCtrl.highlight(rdSlopeHighlight);
                            // console.log('------------------------------已选择退出线----------------------------');
                            dsEdit.getByCondition({
                                dbId: App.Temp.dbId,
                                type: 'RDLINK',
                                data: {
                                    nodePid: slopeData.outNode
                                }
                            }).then(function (joinLinks) {
                                var satisfiedJoinLinks = [];
                                for (var ji = 0; ji < joinLinks.data.length; ji++) {
                                    if (parseInt(joinLinks.data[ji].kind, 10) < 10 && joinLinks.data[ji].pid != dataresult.id) {
                                        satisfiedJoinLinks.push(joinLinks.data[ji]);
                                    }
                                }
                                // 判断这些连接link的挂接个数
                                if (satisfiedJoinLinks.length == 0 || satisfiedJoinLinks.length >= 2) {
                                    // console.log('退出线无挂接或挂接除10级外的link>=2');
                                    tooltipsCtrl.setCurrentTooltip('坡度长度为' + slopeData.linkLength + '米');
                                    return;
                                }
                                // 判断这些连接link的方向；
                                if (satisfiedJoinLinks.length == 1) {
                                    // 方向正确的条件
                                    var isDirectRight = (satisfiedJoinLinks[0].direct == 1) ||
                                        (satisfiedJoinLinks[0].sNodePid == slopeData.outNode && satisfiedJoinLinks[0].direct == 2) ||
                                        (satisfiedJoinLinks[0].eNodePid == slopeData.outNode && satisfiedJoinLinks[0].direct == 3);
                                    if (isDirectRight) {
                                        if (parseFloat(slopeData.linkLength) < 100) {
                                            // console.log('开始追踪');
                                            var param = {};
                                            param.dbId = App.Temp.dbId;
                                            param.type = 'RDLINK';
                                            param.data = {
                                                linkPid: slopeData.ouLink,
                                                nodePidDir: slopeData.outNode,
                                                length: slopeData.linkLength,
                                                queryType: 'RDSLOPE'
                                            };
                                            dsEdit.getByCondition(param).then(function (linkData) {
                                                if (linkData.errcode === -1) {
                                                    return;
                                                }
                                                if (linkData.data.length) {
                                                    for (var bi = 0; bi < linkData.data.length; bi++) {
                                                        slopeData.links.push(linkData.data[bi]);
                                                        slopeData.linkLength += parseFloat(linkData.data[bi].length);
                                                        rdSlopeHighlight.joinLinkPid.push(linkData.data[bi].pid);
                                                    }
                                                    highlightCtrl.clear();
                                                    highlightCtrl.highlight(rdSlopeHighlight);
                                                }
                                                tooltipsCtrl.setCurrentTooltip('坡度长度为' + slopeData.linkLength.toFixed(3) + '米');
                                            });
                                        } else {
                                            tooltipsCtrl.setCurrentTooltip('坡度长度为' + slopeData.linkLength.toFixed(3) + '米');
                                            /* console.log('退出线大于100米，不自动追踪'); */
                                        }
                                    } else {
                                        tooltipsCtrl.setCurrentTooltip('坡度长度为' + slopeData.linkLength.toFixed(3) + '米');
                                        /* console.log('下一个接续线方向错误,不追踪'); */
                                        return;
                                    }
                                }
                            });
                        } else if (!slopeData.ouLink && selectOutLinkIndexInRecArr == -1) {
                            tooltipsCtrl.notify('请先选择退出线', 'error');
                            return;
                        } else if (slopeData.ouLink && slopeData.ouLink == dataresult.id) {
                            /* console.log('退出线与之前的重复'); */
                            return;
                        } else {
                            /* console.log('**********开始判断接续线**********'); */
                            // 为了返回的数据和从瓦片那倒的对应数据有相同的键;
                            dataresult.properties.eNodePid = dataresult.properties.enode;
                            dataresult.properties.sNodePid = dataresult.properties.snode;
                            dataresult.properties.pid = dataresult.properties.id;

                            var setLastNode = function (index) {
                                if (index == undefined) {
                                    if (slopeData.links.length == 0) {
                                        slopeData.lastNode = slopeData.outNode;
                                    } else if (slopeData.links.length == 1) {
                                        slopeData.lastNode = slopeData.links[0].eNodePid == slopeData.outNode ? slopeData.links[0].sNodePid : slopeData.links[0].eNodePid;
                                    } else if (slopeData.links.length > 1) {
                                        if ((slopeData.links[slopeData.links.length - 1].eNodePid == slopeData.links[slopeData.links.length - 2].eNodePid)) {
                                            slopeData.lastNode = slopeData.links[slopeData.links.length - 1].sNodePid;
                                        }
                                        if ((slopeData.links[slopeData.links.length - 1].eNodePid == slopeData.links[slopeData.links.length - 2].sNodePid)) {
                                            slopeData.lastNode = slopeData.links[slopeData.links.length - 1].sNodePid;
                                        }
                                        if ((slopeData.links[slopeData.links.length - 1].sNodePid == slopeData.links[slopeData.links.length - 2].eNodePid)) {
                                            slopeData.lastNode = slopeData.links[slopeData.links.length - 1].eNodePid;
                                        }
                                        if ((slopeData.links[slopeData.links.length - 1].sNodePid == slopeData.links[slopeData.links.length - 2].sNodePid)) {
                                            slopeData.lastNode = slopeData.links[slopeData.links.length - 1].eNodePid;
                                        }
                                    }
                                } else if (index == 0) {
                                    slopeData.lastNode = slopeData.outNode;
                                } else if (index == 1) {
                                    slopeData.lastNode = slopeData.links[0].eNodePid == slopeData.outNode ? slopeData.links[0].eNodePid : slopeData.links[0].sNodePid;
                                } else if (index > 1) {
                                    if ((slopeData.links[index].eNodePid == slopeData.links[index - 1].eNodePid)) {
                                        slopeData.lastNode = slopeData.links[index - 1].eNodePid;
                                    }
                                    if ((slopeData.links[index].eNodePid == slopeData.links[index - 1].sNodePid)) {
                                        slopeData.lastNode = slopeData.links[index - 1].sNodePid;
                                    }
                                    if ((slopeData.links[index].sNodePid == slopeData.links[index - 1].eNodePid)) {
                                        slopeData.lastNode = slopeData.links[index - 1].eNodePid;
                                    }
                                    if ((slopeData.links[index].sNodePid == slopeData.links[index - 1].sNodePid)) {
                                        slopeData.lastNode = slopeData.links[index - 1].sNodePid;
                                    }
                                }
                            };
                            var linkInJoinLinksIndex = -1;
                            for (var ci = 0; ci < slopeData.links.length; ci++) {
                                if (dataresult.id == slopeData.links[ci].pid) {
                                    linkInJoinLinksIndex = ci;
                                }
                            }
                            if (linkInJoinLinksIndex == -1) {
                                setLastNode();
                                dsEdit.getByCondition({
                                    dbId: App.Temp.dbId,
                                    type: 'RDLINK',
                                    data: {
                                        nodePid: slopeData.lastNode
                                    }
                                }).then(function (joinLinks) {
                                    var satisfiedJoinLinks = [];
                                    for (var si = 0; si < joinLinks.data.length; si++) {
                                        var lastLinkPid = (slopeData.links.length) ? slopeData.links[slopeData.links.length - 1].pid : slopeData.ouLink;
                                        var isJoinLink = (parseInt(joinLinks.data[si].kind, 10) < 10 && joinLinks.data[si].pid != lastLinkPid);
                                        if (isJoinLink) {
                                            satisfiedJoinLinks.push(joinLinks.data[si]);
                                        }
                                    }
                                    // 判断这些连接link的挂接个数
                                    if (satisfiedJoinLinks.length == 0 || satisfiedJoinLinks.length >= 2) {
                                        /* console.log('退出线无挂接或挂接除10级外的link>=2'); */
                                        tooltipsCtrl.notify('挂接link不符合条件，不能再做接续线', 'error');
                                        return;
                                    }
                                    if (satisfiedJoinLinks.length == 1 && satisfiedJoinLinks[0].pid == dataresult.id) {
                                        if ((dataresult.properties.direct == 2 && dataresult.properties.eNodePid == slopeData.lastNode) || (dataresult.properties.direct == 3 && dataresult.properties.sNodePid == slopeData.lastNode)) {
                                            tooltipsCtrl.notify('接续线方向错误，不能再做接续线', 'error');
                                            return;
                                        }
                                        if ((slopeData.linkLength + parseFloat(dataresult.properties.length)) > 150) {
                                            tooltipsCtrl.notify('坡度长度超过150米，不能再做接续线', 'error');
                                            return;
                                        }
                                        slopeData.lastNode = (dataresult.properties.enode == slopeData.lastNode) ? dataresult.properties.snode : dataresult.properties.enode;
                                        slopeData.links.push(dataresult.properties);
                                        slopeData.linkLength += parseFloat(dataresult.properties.length);
                                        tooltipsCtrl.setCurrentTooltip('坡度长度为' + slopeData.linkLength.toFixed(3) + '米');
                                        rdSlopeHighlight.joinLinkPid.push(dataresult.properties.pid);
                                        highlightCtrl.clear();
                                        highlightCtrl.highlight(rdSlopeHighlight);
                                        /* console.log('add');*/
                                    } else {
                                        tooltipsCtrl.notify('接续线选择错误!', 'error');
                                    }
                                });
                            } else {
                                setLastNode(linkInJoinLinksIndex);
                                slopeData.links.splice(linkInJoinLinksIndex);
                                var temp = 0;
                                for (var ki = 0; ki < slopeData.links.length; ki++) {
                                    temp += parseFloat(slopeData.links[ki].length);
                                }
                                slopeData.linkLength = temp + parseFloat(slopeData.outLinkLength);
                                tooltipsCtrl.setCurrentTooltip('坡度长度为' + slopeData.linkLength.toFixed(3) + '米');
                                rdSlopeHighlight.joinLinkPid.splice(linkInJoinLinksIndex);
                                highlightCtrl.clear();
                                highlightCtrl.highlight(rdSlopeHighlight);
                            }
                        }
                    }
                    featCodeCtrl.setFeatCode(slopeData);
                });
            } else if (type === 'RDDIRECTROUTE') { // 顺行
                // 保存所有需要高亮的图层数组;
                linkDirect = 0;
                var rdDirectRouteHighLight = {
                    rowId: 'RDDIRECTROUTE0010',
                    geoLiveType: 'DEFAULTTOPO',
                    inLinkPid: 0,
                    nodePid: 0,
                    outLinkPid: 0
                };
                // 设置快捷键保存的事件类型供热键通过（shapeCtrl.editType）监听;
                shapeCtrl.setEditingType('rdDirectRoute');
                // 地图编辑相关设置;
                tooltipsCtrl.setEditEventType('rdDirectRoute');
                tooltipsCtrl.setCurrentTooltip('正要新建顺行,先选择线！');
                $scope.directRoute = {};
                map.currentTool = new fastmap.uikit.SelectForRestriction({
                    map: map,
                    createBranchFlag: true,
                    currentEditLayer: rdLink,
                    shapeEditor: shapeCtrl,
                    operationList: ['line', 'point', 'line']
                });
                map.currentTool.enable();
                // map.currentTool.snapHandler.addGuideLayer(rdnode);
                map.currentTool.snapHandler.addGuideLayer(rdLink); // 添加自动吸附的图层
                // 获取退出线并高亮;
                $scope.getOutLink = function (dataId) {
                    $scope.directRoute.outLinkPid = parseInt(dataId, 10);
                    rdDirectRouteHighLight.outLinkPid = $scope.directRoute.outLinkPid;
                    highlightCtrl.clear();
                    highlightCtrl.highlight(rdDirectRouteHighLight);
                    tooltipsCtrl.setCurrentTooltip('已选退出线,点击空格键保存!');
                };
                // 选择分歧监听事件;
                eventController.on(eventController.eventTypes.GETLINKID, function (data) {
                    if (data.index === 0) {
                        if (data.properties.form.indexOf('50') > -1) {
                            tooltipsCtrl.notify('交叉口不能作为进入线', 'error');
                            map.currentTool.selectedFeatures.pop();
                            return;
                        }
                        if (data.properties.kind == 10 || data.properties.kind == 11 || data.properties.form.indexOf('20') > -1) {
                            tooltipsCtrl.notify('10级路、步行街、人渡不能作为顺行的进入线!', 'error');
                            map.currentTool.selectedFeatures.pop();
                            return;
                        }
                        // 清除吸附的十字
                        map.currentTool.snapHandler.snaped = false;
                        map.currentTool.clearCross();
                        map.currentTool.snapHandler._guides = [];
                        map.currentTool.snapHandler.addGuideLayer(rdnode);
                        // 进入线;
                        $scope.directRoute.inLinkPid = parseInt(data.id, 10);
                        rdDirectRouteHighLight.inLinkPid = $scope.directRoute.inLinkPid;
                        highlightCtrl.clear();
                        highlightCtrl.highlight(rdDirectRouteHighLight);
                        tooltipsCtrl.setCurrentTooltip('已经选择进入线,选择进入点!');
                        linkDirect = data.properties.direct;
                        if (linkDirect == 2 || linkDirect == 3) {
                            $scope.directRoute.nodePid = parseInt(linkDirect == 2 ? data.properties.enode : data.properties.snode, 10);
                            rdDirectRouteHighLight.nodePid = $scope.directRoute.nodePid;
                            highlightCtrl.clear();
                            highlightCtrl.highlight(rdDirectRouteHighLight);
                            map.currentTool.selectedFeatures.push($scope.directRoute.nodePid.toString());
                            tooltipsCtrl.setCurrentTooltip('已经选择进入点,选择退出线!');
                            // 清除吸附的十字
                            map.currentTool.snapHandler.snaped = false;
                            map.currentTool.clearCross();
                            map.currentTool.snapHandler._guides = [];
                            map.currentTool.snapHandler.addGuideLayer(rdLink);
                        }
                    } else if (data.index === 1) {
                        if (linkDirect == 2 || linkDirect == 3) {
                            $scope.getOutLink(data.id);
                        } else {
                            $scope.directRoute.nodePid = parseInt(data.id, 10);
                            rdDirectRouteHighLight.nodePid = $scope.directRoute.nodePid;
                            highlightCtrl.clear();
                            highlightCtrl.highlight(rdDirectRouteHighLight);
                            tooltipsCtrl.setCurrentTooltip('已经选择进入点,选择退出线!');
                            // 清除吸附的十字
                            map.currentTool.snapHandler.snaped = false;
                            map.currentTool.clearCross();
                            map.currentTool.snapHandler._guides = [];
                            map.currentTool.snapHandler.addGuideLayer(rdLink);
                        }
                    } else if (data.index > 1) {
                        if (data.id == map.currentTool.selectedFeatures[0]) {
                            tooltipsCtrl.notify('进入线不能同时作为退出线', 'error');
                            map.currentTool.selectedFeatures.pop();
                            return;
                        }
                        if (data.properties.form.indexOf('50') > -1) {
                            tooltipsCtrl.notify('交叉口不能作为退出线', 'error');
                            map.currentTool.selectedFeatures.pop();
                            return;
                        }
                        if (data.properties.kind == 10 || data.properties.kind == 11 || data.properties.form.indexOf('20') > -1) {
                            tooltipsCtrl.notify('10级路、步行街、人渡不能作为顺行的退出线!', 'error');
                            map.currentTool.selectedFeatures.pop();
                            return;
                        }
                        $scope.getOutLink(data.id);
                        $scope.directRoute.outLinkPid = parseInt(data.id, 10);
                    }
                    featCodeCtrl.setFeatCode($scope.directRoute);
                });
            } else if (type === 'RDSPEEDBUMP') { // 减速带
                // 保存所有需要高亮的图层数组;线方向
                var rdSpeenBump = {
                    rowId: 'rdSpeenBump001',
                    geoLiveType: 'DEFAULTTOPO',
                    inLinkPid: 0,
                    nodePid: 0
                };
                linkDirect = 0;
                // 设置快捷键保存的事件类型供热键通过（shapeCtrl.editType）监听;
                shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.RDSPEEDBUMP);
                // 地图编辑相关设置;
                tooltipsCtrl.setEditEventType('rdSpeedBump');
                tooltipsCtrl.setCurrentTooltip('请选择进入线！');
                map.currentTool = new fastmap.uikit.SelectForRestriction({
                    map: map,
                    createBranchFlag: true,
                    currentEditLayer: rdLink,
                    shapeEditor: shapeCtrl,
                    operationList: ['line', 'point']
                });
                map.currentTool.enable();
                map.currentTool.snapHandler.addGuideLayer(rdLink);
                $scope.speedBumpInfo = {};
                eventController.off(eventController.eventTypes.GETLINKID);
                eventController.on(eventController.eventTypes.GETLINKID, function (data) {
                    if (data.index === 0) { // 进入线;
                        if (['1', '2', '8', '9', '10', '11', '13'].indexOf(data.properties.kind) > -1) {
                            tooltipsCtrl.notify('8级、9级、10级路、高速、城市高速、人渡、轮渡上不能创建减速带,请重新选择', 'error');
                            map.currentTool.selectedFeatures.pop();
                            return;
                        }
                        if (data.properties.form.indexOf('52') > -1 || data.properties.form.indexOf('37') > -1 || data.properties.form.indexOf('38') > -1 ||
                          data.properties.form.indexOf('50') > -1 || data.properties.form.indexOf('33') > -1 || data.properties.form.indexOf('35') > -1 ||
                          data.properties.form.indexOf('10') > -1 || data.properties.form.indexOf('39') > -1) {
                            tooltipsCtrl.notify('区域内道路、提左、提右、交叉口内道路、环岛、调头口、主辅路出入口、步行街上不能创建减速带,请重新选择', 'error');
                            map.currentTool.selectedFeatures.pop();
                            return;
                        }
                        map.currentTool.snapHandler.snaped = false;
                        map.currentTool.clearCross();
                        map.currentTool.snapHandler._guides = [];
                        map.currentTool.snapHandler.addGuideLayer(rdnode);
                        $scope.speedBumpInfo.inLinkPid = parseInt(data.id, 10);
                        rdSpeenBump.inLinkPid = $scope.speedBumpInfo.inLinkPid;
                        highlightCtrl.clear();
                        highlightCtrl.highlight(rdSpeenBump);
                        tooltipsCtrl.setCurrentTooltip('已经选择进入线,选择进入点!');
                        linkDirect = data.properties.direct;
                        if (linkDirect == 2 || linkDirect == 3) { // 单方向
                            map.currentTool.snapHandler.snaped = false;
                            map.currentTool.clearCross();
                            map.currentTool.snapHandler._guides = [];
                            $scope.speedBumpInfo.nodePid = parseInt(linkDirect == 2 ? data.properties.enode : data.properties.snode, 10);
                            rdSpeenBump.nodePid = $scope.speedBumpInfo.nodePid;
                            highlightCtrl.clear();
                            highlightCtrl.highlight(rdSpeenBump);
                            map.currentTool.selectedFeatures.push($scope.speedBumpInfo.nodePid.toString());
                            featCodeCtrl.setFeatCode($scope.speedBumpInfo);
                            tooltipsCtrl.setCurrentTooltip('已选进入点,点击空格键保存!');
                        }
                    } else if (data.index === 1) { // 进入点
                        $scope.speedBumpInfo.nodePid = parseInt(data.id, 10);
                        rdSpeenBump.nodePid = $scope.speedBumpInfo.nodePid;
                        highlightCtrl.clear();
                        highlightCtrl.highlight(rdSpeenBump);
                        map.currentTool.selectedFeatures.push($scope.speedBumpInfo.nodePid.toString());
                        featCodeCtrl.setFeatCode($scope.speedBumpInfo);
                        tooltipsCtrl.setCurrentTooltip('已选进入点,点击空格键保存!');
                    }
                });
            } else if (type === 'RDSE') { // 分叉口提示
                // 保存所有需要高亮的图层数组;线方向
                var rdSeHighLight = {
                    rowId: 'RDSE0008',
                    geoLiveType: 'DEFAULTRDSLOPETOPO',
                    inLinkPid: 0,
                    inNodePid: 0,
                    DefaultOutLinkPid: [],
                    outLinkPid: 0
                };
                var seLinkDirect = 0;
                // 设置快捷键保存的事件类型供热键通过（shapeCtrl.editType）监听;
                $scope.rdSe = {
                    inLinkPid: '',
                    outLinkPid: '',
                    nodePid: '',
                    links: [],
                    linkPids: []
                };
                shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.RDSE);
                // 地图编辑相关设置;
                tooltipsCtrl.setEditEventType('rdSe');
                tooltipsCtrl.setCurrentTooltip('请选择进入线！');
                map.currentTool = new fastmap.uikit.SelectForRestriction({
                    map: map,
                    createBranchFlag: true,
                    currentEditLayer: rdLink,
                    shapeEditor: shapeCtrl,
                    operationList: ['line', 'point', 'line']
                });
                map.currentTool.enable();
                map.currentTool.snapHandler.addGuideLayer(rdLink);
                $scope.rdSe = {};
                // 格式化link对象
                var formatLinkObject = function (link) {
                    var newObj = {};
                    newObj.direct = link.direct;
                    newObj.eNodePid = parseInt(link.enode, 10);
                    newObj.kind = link.kind;
                    newObj.length = link.length;
                    newObj.pid = parseInt(link.id, 10);
                    newObj.sNodePid = parseInt(link.snode, 10);
                    return newObj;
                };
                // 计算可选的link
                var getSelectLink = function () {
                    $scope.rdSe.linkPids = [];
                    for (var i = 0; i < $scope.rdSe.links.length; i++) {
                        if ($scope.rdSe.links[i].pid != $scope.rdSe.inLinkPid) {
                            /* for (var j = 0; i < continueLinks.data[i].forms.length; j++) {
                                if (j == continueLinks.data[i].forms.length - 1 && continueLinks.data[i].forms[j].formOfWay != 50) {
                                    if (continueLinks.data[i].direct == 2 && continueLinks.data[i].sNodePid == $scope.rdSe.nodePid) {
                                        $scope.rdSe.linkPids.push($scope.rdSe.links[i].pid);
                                    } else if (continueLinks.data[i].direct == 3 && continueLinks.data[i].eNodePid == $scope.rdSe.nodePid) {
                                        $scope.rdSe.linkPids.push($scope.rdSe.links[i].pid);
                                    } else if (continueLinks.data[i].direct == 1 && (continueLinks.data[i].sNodePid == $scope.rdSe.nodePid || $scope.rdSe.links[i].eNodePid == $scope.rdSe.nodePid)) {
                                        $scope.rdSe.linkPids.push($scope.rdSe.links[i].pid);
                                    }
                                }
                            }*/
                            if ($scope.rdSe.links[i].direct == 2 && $scope.rdSe.links[i].sNodePid == $scope.rdSe.nodePid) {
                                $scope.rdSe.linkPids.push($scope.rdSe.links[i].pid);
                            } else if ($scope.rdSe.links[i].direct == 3 && $scope.rdSe.links[i].eNodePid == $scope.rdSe.nodePid) {
                                $scope.rdSe.linkPids.push($scope.rdSe.links[i].pid);
                            } else if ($scope.rdSe.links[i].direct == 1 && ($scope.rdSe.links[i].sNodePid == $scope.rdSe.nodePid || $scope.rdSe.links[i].eNodePid == $scope.rdSe.nodePid)) {
                                $scope.rdSe.linkPids.push($scope.rdSe.links[i].pid);
                            }
                        }
                    }
                    return $scope.rdSe.linkPids.length;
                };

                var highLightFeature = function () {
                    highlightCtrl.clear();
                    rdSeHighLight = {
                        rowId: 'RDSE0008',
                        geoLiveType: 'DEFAULTRDSLOPETOPO',
                        inLinkPid: 0,
                        inNodePid: 0,
                        DefaultOutLinkPid: [],
                        outLinkPid: 0
                    };
                    if ($scope.rdSe.inLinkPid) {
                        rdSeHighLight.inLinkPid = $scope.rdSe.inLinkPid;
                    }
                    if ($scope.rdSe.outLinkPid) {
                        rdSeHighLight.outLinkPid = $scope.rdSe.outLinkPid;
                    }
                    if ($scope.rdSe.nodePid) {
                        rdSeHighLight.inNodePid = $scope.rdSe.nodePid;
                    }
                    if ($scope.rdSe.linkPids && $scope.rdSe.linkPids.length) {
                        for (var i = 0; i < $scope.rdSe.linkPids.length; i++) {
                            rdSeHighLight.DefaultOutLinkPid.push($scope.rdSe.linkPids[i]);
                        }
                    }
                    highlightCtrl.highlight(rdSeHighLight);
                };
                eventController.off(eventController.eventTypes.GETLINKID);
                eventController.on(eventController.eventTypes.GETLINKID, function (data) {
                    if (data.index === 0) { // 进入线;
                        map.currentTool.snapHandler.snaped = false;
                        map.currentTool.clearCross();
                        map.currentTool.snapHandler._guides = [];
                        map.currentTool.snapHandler.addGuideLayer(rdnode);
                        $scope.rdSe.inLinkPid = parseInt(data.id, 10);
                        highLightFeature();
                        tooltipsCtrl.setCurrentTooltip('已经选择进入线,选择进入点!');
                        seLinkDirect = data.properties.direct;
                        if (seLinkDirect == 2 || seLinkDirect == 3) { // 单方向
                            map.currentTool.snapHandler.snaped = false;
                            map.currentTool.clearCross();
                            map.currentTool.snapHandler._guides = [];
                            $scope.rdSe.nodePid = parseInt(seLinkDirect == 2 ? data.properties.enode : data.properties.snode, 10);
                            highLightFeature();
                            var param = {};
                            param.dbId = App.Temp.dbId;
                            param.type = 'RDLINK';
                            param.data = {
                                nodePid: $scope.rdSe.nodePid
                            };
                            dsEdit.getByCondition(param).then(function (continueLinks) {
                                if (continueLinks.errcode === -1) {
                                    map.currentTool.selectedFeatures.pop();
                                    return;
                                }
                                if (continueLinks.data.length > 2) {
                                    $scope.rdSe.links = continueLinks.data;
                                    $scope.rdSe.linkPids = [];
                                    for (var i = 0; i < continueLinks.data.length; i++) {
                                        if (continueLinks.data[i].pid != $scope.rdSe.inLinkPid) {
                                            for (var j = 0; j < continueLinks.data[i].forms.length; j++) {
                                                if (j == continueLinks.data[i].forms.length - 1 && continueLinks.data[i].forms[j].formOfWay != 50 && parseInt(continueLinks.data[i].forms[j].imiCode, 10) != 1 && parseInt(continueLinks.data[i].forms[j].imiCode, 10) != 2) {
                                                    if (continueLinks.data[i].direct == 2 && continueLinks.data[i].sNodePid == $scope.rdSe.nodePid) {
                                                        $scope.rdSe.linkPids.push($scope.rdSe.links[i].pid);
                                                    } else if (continueLinks.data[i].direct == 3 && continueLinks.data[i].eNodePid == $scope.rdSe.nodePid) {
                                                        $scope.rdSe.linkPids.push($scope.rdSe.links[i].pid);
                                                    } else if (continueLinks.data[i].direct == 1 && (continueLinks.data[i].sNodePid == $scope.rdSe.nodePid || $scope.rdSe.links[i].eNodePid == $scope.rdSe.nodePid)) {
                                                        $scope.rdSe.linkPids.push($scope.rdSe.links[i].pid);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    if ($scope.rdSe.linkPids.length < 2) {
                                        $scope.rdSe.inLinkPid = '';
                                        $scope.rdSe.nodePid = '';
                                        $scope.rdSe.linkPids = [];
                                        tooltipsCtrl.notify('进入点挂接可用link至少有两个！', 'error');
                                        tooltipsCtrl.setCurrentTooltip('请选择进入线！');
                                        map.currentTool.selectedFeatures = [];
                                        highLightFeature();
                                    } else {
                                        highLightFeature();
                                        map.currentTool.selectedFeatures.push($scope.rdSe.nodePid.toString());
                                    }
                                } else {
                                    $scope.rdSe.inLinkPid = '';
                                    $scope.rdSe.nodePid = '';
                                    tooltipsCtrl.notify('进入线选择不符合规则，请重新选择进入线！', 'error');
                                    tooltipsCtrl.setCurrentTooltip('请选择进入线！');
                                    map.currentTool.selectedFeatures = [];
                                    highLightFeature();
                                }
                            });
                            // featCodeCtrl.setFeatCode($scope.rdSe);
                            tooltipsCtrl.setCurrentTooltip('已选进入点,请选择退出线!');
                        }
                    } else if (data.index === 1) { // 进入点
                        map.currentTool.snapHandler.snaped = false;
                        map.currentTool.clearCross();
                        map.currentTool.snapHandler._guides = [];
                        map.currentTool.snapHandler.addGuideLayer(rdLink);
                        $scope.rdSe.nodePid = parseInt(data.id, 10);
                        $scope.rdSe.links = [];
                        for (var i = 0; i < data.links.length; i++) {
                            if (parseInt(data.links[i].form, 10) != 50 && parseInt(data.links[i].imiCode, 10) != 1 && parseInt(data.links[i].imiCode, 10) != 2) {
                                $scope.rdSe.links.push(formatLinkObject(data.links[i]));
                            }
                        }
                        if (getSelectLink() < 2) {
                            $scope.rdSe.nodePid = '';
                            tooltipsCtrl.notify('选择的进入点不符合规则，请重新选择！', 'error');
                            map.currentTool.selectedFeatures.pop();
                            return;
                        }
                        highLightFeature();
                        featCodeCtrl.setFeatCode($scope.rdSe);
                        tooltipsCtrl.setCurrentTooltip('已选进入点,请选择退出线!');
                    } else if (data.index >= 2) { // 退出线
                        if (data.properties.imiCode === '1' || data.properties.imiCode === '2') {
                            tooltipsCtrl.notify('具有II属性或者M属性的link不能作为分岔口提示退出线，请重新选择！', 'error');
                            map.currentTool.selectedFeatures.pop();
                            return;
                        }
                        // 具有II属性和M属性的link不可以作为分叉口提示信息的退出线
                        if ($scope.rdSe.linkPids.indexOf(parseInt(data.properties.id, 10)) == -1) {
                            tooltipsCtrl.notify('请注意退出线作业方向，请重新选择！', 'error');
                            map.currentTool.selectedFeatures.pop();
                            return;
                        }
                        //  判断是否为交叉口link
                        if (parseInt(data.properties.form, 10) == 50 && parseInt(data.links[i].imiCode, 10) != 1 && parseInt(data.links[i].imiCode, 10) != 2) {
                            tooltipsCtrl.notify('退出线不能为分叉口link，请重新选择！', 'error');
                            map.currentTool.selectedFeatures.pop();
                            return;
                        }
                        // 退出线必须挂接进入点
                        if (parseInt(data.properties.snode, 10) != $scope.rdSe.nodePid && parseInt(data.properties.enode, 10) != $scope.rdSe.nodePid) {
                            tooltipsCtrl.notify('退出线必须挂接在进入点上，请重新选择！', 'error');
                            map.currentTool.selectedFeatures.pop();
                            return;
                        }
                        // 判断该退出线是否符合作业方向规则
                        if ($scope.rdSe.linkPids.indexOf(parseInt(data.properties.id, 10)) == -1) {
                            tooltipsCtrl.notify('请注意退出线作业方向，请重新选择！', 'error');
                            map.currentTool.selectedFeatures.pop();
                            return;
                        }
                        $scope.rdSe.outLinkPid = parseInt(data.id, 10);
                        highLightFeature();
                        featCodeCtrl.setFeatCode($scope.rdSe);
                        tooltipsCtrl.setCurrentTooltip('已选退出线,点击空格键保存!');
                    }
                });
            } else if (type === 'RDTOLLGATE') { // 收费站
                featCodeCtrl.setFeatCode({});
                $scope.rdTollgateData = {
                    rowId: 'RDTOLLGATE0010',
                    geoLiveType: 'RDTOLLGATE',
                    inLinkPid: 0,
                    nodePid: 0,
                    outLinkPid: []
                };
                // 保存所有需要高亮的图层数组;线方向
                highLightFeatures = [];
                linkDirect = 0;
                // 设置快捷键保存的事件类型供热键通过（shapeCtrl.editType）监听;
                shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.RDTOLLGATE);
                // 地图编辑相关设置;
                tooltipsCtrl.setEditEventType('rdTollgate');
                tooltipsCtrl.setCurrentTooltip('请选择进入线！');
                map.currentTool = new fastmap.uikit.SelectForRestriction({
                    map: map,
                    createBranchFlag: true,
                    currentEditLayer: rdLink,
                    shapeEditor: shapeCtrl,
                    operationList: ['line', 'point']
                });
                map.currentTool.enable();
                map.currentTool.snapHandler.addGuideLayer(rdLink);
                var automaticCommandTollGate = function () { // 自动计算退出线
                    var param = {};
                    param.dbId = App.Temp.dbId;
                    param.type = 'RDLINK';
                    param.data = {
                        nodePid: $scope.rdTollgateData.nodePid
                    };
                    dsEdit.getByCondition(param).then(function (continueLinks) {
                        if (continueLinks.errcode === -1) {
                            return;
                        }
                        if (continueLinks.data) {
                            if (continueLinks.data.length > 2) {
                                featCodeCtrl.setFeatCode({});
                                tooltipsCtrl.notify('退出线有多条，不允许创建，请重新选择进入点!', 'error');
                                $scope.rdTollgateData.nodePid = 0;
                                map.currentTool.selectedFeatures.pop();
                                map.currentTool.selectedFeatures.pop();
                                highlightCtrl.clear();
                                highlightCtrl.highlight($scope.rdTollgateData);
                                return;
                            }
                            if (continueLinks.data.length == 1) {
                                featCodeCtrl.setFeatCode({});
                                tooltipsCtrl.notify('没有退出线，请重新选择进入点!', 'error');
                                $scope.rdTollgateData.nodePid = 0;
                                map.currentTool.selectedFeatures.pop();
                                map.currentTool.selectedFeatures.pop();
                                highlightCtrl.clear();
                                highlightCtrl.highlight($scope.rdTollgateData);
                                return;
                            }
                            for (var i = 0, len = continueLinks.data.length; i < len; i++) {
                                if (continueLinks.data[i].pid != $scope.rdTollgateData.inLinkPid) {
                                    if (continueLinks.data[i].kind == 10 || continueLinks.data[i].kind == 11 ||
                                        continueLinks.data[i].forms[0].formOfWay == 20) {
                                        tooltipsCtrl.notify('10级路、步行街、人渡不能作为收费站的退出线!', 'error');
                                        map.currentTool.selectedFeatures.pop();
                                        map.currentTool.selectedFeatures.pop();
                                        highlightCtrl.clear();
                                        highlightCtrl.highlight($scope.rdTollgateData);
                                        return;
                                    }
                                    // 顺方向接续点不能为eNode
                                    if (continueLinks.data[i].direct == 2 && continueLinks.data[i].eNodePid == $scope.rdTollgateData.nodePid) {
                                        tooltipsCtrl.notify('请确认退出线的通行方向是否正确，重新选择退出线！', 'error');
                                        map.currentTool.selectedFeatures.pop();
                                        map.currentTool.selectedFeatures.pop();
                                        highlightCtrl.clear();
                                        highlightCtrl.highlight($scope.rdTollgateData);
                                        return;
                                    }
                                    // 逆方向接续点不能为sNode
                                    if (continueLinks.data[i].direct == 3 && continueLinks.data[i].sNodePid == $scope.rdTollgateData.nodePid) {
                                        tooltipsCtrl.notify('请确认退出线的通行方向是否正确，重新选择退出线！', 'error');
                                        map.currentTool.selectedFeatures.pop();
                                        map.currentTool.selectedFeatures.pop();
                                        highlightCtrl.clear();
                                        highlightCtrl.highlight($scope.rdTollgateData);
                                        return;
                                    }
                                    if (continueLinks.data[i].kind != 10 && continueLinks.data[i].kind != 11) {
                                        var flag = false;

                                        var keys = Object.getOwnPropertyNames(continueLinks.data[i].forms);
                                        for (var j = 0; j < keys.length; j++) {
                                            var key = keys[j];
                                            flag = false;
                                            if (continueLinks.data[i].forms[key].formOfWay == 20) {
                                                flag = true;
                                                break;
                                            }
                                        }

                                        // for (var form in continueLinks.data[i].forms) {
                                        //     flag = false;
                                        //     if (continueLinks.data[i].forms[form].formOfWay == 20) {
                                        //         flag = true;
                                        //         break;
                                        //     }
                                        // }
                                        if (!flag) {
                                            $scope.rdTollgateData.outLinkPid = continueLinks.data[i].pid;
                                            highlightCtrl.clear();
                                            highlightCtrl.highlight($scope.rdTollgateData);
                                            map.currentTool.selectedFeatures.push($scope.rdTollgateData.outLinkPid.toString());
                                            featCodeCtrl.setFeatCode($scope.rdTollgateData);
                                            tooltipsCtrl.setCurrentTooltip('已选退出线,点击空格键保存!');
                                            break;
                                        } else {
                                            tooltipsCtrl.setCurrentTooltip('步行街不能作为收费站的退出线!', 'error');
                                        }
                                    } else {
                                        tooltipsCtrl.setCurrentTooltip('10级路、人渡不能作为收费站的退出线!', 'error');
                                    }
                                }
                            }
                        }
                    });
                };
                eventController.off(eventController.eventTypes.GETLINKID);
                eventController.on(eventController.eventTypes.GETLINKID, function (data) {
                    if (data.index === 0) { // 进入线;
                        map.currentTool.snapHandler.snaped = false;
                        map.currentTool.clearCross();
                        map.currentTool.snapHandler._guides = [];
                        map.currentTool.snapHandler.addGuideLayer(rdnode);
                        $scope.rdTollgateData.inLinkPid = parseInt(data.id, 10);
                        if (data.properties.kind == 10 || data.properties.kind == 11 || data.properties.form.indexOf('20') > -1) {
                            tooltipsCtrl.notify('10级路、步行街、人渡不能作为收费站的进入线!', 'error');
                            map.currentTool.selectedFeatures.pop();
                            return;
                        }
                        highlightCtrl.clear();
                        highlightCtrl.highlight($scope.rdTollgateData);
                        tooltipsCtrl.setCurrentTooltip('已经选择进入线,选择进入点!');
                        linkDirect = data.properties.direct;
                        if (linkDirect == 2 || linkDirect == 3) { // 单方向
                            map.currentTool.snapHandler.snaped = false;
                            map.currentTool.clearCross();
                            map.currentTool.snapHandler._guides = [];
                            $scope.rdTollgateData.nodePid = parseInt(linkDirect == 2 ? data.properties.enode : data.properties.snode, 10);
                            dsEdit.getByPid($scope.rdTollgateData.nodePid, 'RDNODE').then(function (rdata) {
                                if (rdata) {
                                    if (rdata.kind == 2 || rdata.kind == 3 || rdata.forms[0].formOfWay != 1) {
                                        if (rdata.kind == 2 || rdata.kind == 3) {
                                            tooltipsCtrl.notify('属性变化点和路上点不能作为收费站的进入点，请重新选择进入线!', 'error');
                                        }
                                        if (rdata.forms[0].formOfWay != 1) {
                                            tooltipsCtrl.notify('收费站的进入点只能为无属性点，请重新选择进入线!', 'error');
                                            // tooltipsCtrl.notify('图廓点不能作为收费站的进入点，请重新选择进入线!', 'error');
                                        }
                                        map.currentTool.selectedFeatures.pop();
                                        map.currentTool.selectedFeatures.pop();
                                    } else {
                                        map.currentTool.selectedFeatures.push($scope.rdTollgateData.nodePid.toString());
                                        automaticCommandTollGate();
                                        highlightCtrl.clear();
                                        highlightCtrl.highlight($scope.rdTollgateData);
                                    }
                                } else {
                                    tooltipsCtrl.setCurrentTooltip('请重新选择进入点!');
                                }
                            });
                            // featCodeCtrl.setFeatCode($scope.rdTollgateData);
                            // tooltipsCtrl.setCurrentTooltip("已选进入点,请选择退出线!");
                        }
                    } else if (data.index === 1) { // 进入点
                        // 清除鼠标十字
                        map.currentTool.snapHandler.snaped = false;
                        map.currentTool.clearCross();
                        map.currentTool.snapHandler._guides = [];
                        // map.currentTool.snapHandler.addGuideLayer(rdLink); //增加吸附图层
                        $scope.rdTollgateData.nodePid = parseInt(data.id, 10);
                        dsEdit.getByPid($scope.rdTollgateData.nodePid, 'RDNODE').then(function (ndata) {
                            if (ndata) {
                                if (ndata.kind == 2 || ndata.kind == 3 || ndata.forms[0].formOfWay != 1) {
                                    if (ndata.kind == 2 || ndata.kind == 3) {
                                        tooltipsCtrl.notify('属性变化点和路上点不能作为收费站的进入点，请重新选择进入点!', 'error');
                                    }
                                    if (ndata.forms[0].formOfWay != 1) {
                                        tooltipsCtrl.notify('收费站的进入点只能为无属性点，请重新选择进入点!', 'error');
                                        // tooltipsCtrl.notify('图廓点不能作为收费站的进入点，请重新选择进入点!', 'error');
                                    }
                                    map.currentTool.selectedFeatures.pop();
                                } else {
                                    highlightCtrl.clear();
                                    highlightCtrl.highlight($scope.rdTollgateData);
                                    map.currentTool.selectedFeatures.push($scope.rdTollgateData.nodePid.toString());
                                    automaticCommandTollGate();
                                }
                            } else {
                                tooltipsCtrl.setCurrentTooltip('请重新选择进入点!');
                            }
                        });
                    } else if (data.index === 2) { // 退出线
                        $scope.rdTollgateData.outLinkPid = parseInt(data.id, 10);
                        if (data.properties.kind == 10 || data.properties.kind == 11 || data.properties.form.indexOf('20') > -1) {
                            tooltipsCtrl.notify('10级路、步行街、人渡不能作为收费站的退出线!', 'error');
                            map.currentTool.selectedFeatures.pop();
                            return;
                        }
                        // 顺方向接续点不能为eNode
                        if (data.properties.direct == 2 && data.properties.enode == $scope.rdTollgateData.inLinkPid) {
                            tooltipsCtrl.notify('请确认退出线的通行方向是否正确，重新选择退出线！', 'error');
                            map.currentTool.selectedFeatures.pop();
                            return;
                        }
                        // 逆方向接续点不能为sNode
                        if (data.properties.direct == 3 && data.properties.snode == $scope.rdTollgateData.inLinkPid) {
                            tooltipsCtrl.notify('请确认退出线的通行方向是否正确，重新选择退出线！', 'error');
                            map.currentTool.selectedFeatures.pop();
                            return;
                        }
                        // rdTollGateHighLight.outLinkPid = $scope.rdTollgateData.outLinkPid;
                        map.currentTool.selectedFeatures.push($scope.rdTollgateData.outLinkPid.toString());
                        featCodeCtrl.setFeatCode($scope.rdTollgateData);
                        tooltipsCtrl.setCurrentTooltip('已选退出线,点击空格键保存!');
                    }
                });
            } else if (type === 'RDVOICEGUIDE') { // 语音引导
                // 保存所有需要高亮的图层数组;线方向
                var rdVoiceGuideHighLight = {
                    rowId: 'RDVOICEGUIDE0010',
                    geoLiveType: 'DEFAULTTOPO',
                    inLinkPid: 0,
                    nodePid: 0,
                    outLinkPid: []
                };
                linkDirect = 0;
                // 设置快捷键保存的事件类型供热键通过（shapeCtrl.editType）监听;
                shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.RDVOICEGUIDE);
                // 地图编辑相关设置;
                tooltipsCtrl.setCurrentTooltip('请选择进入线！');
                map.currentTool = new fastmap.uikit.SelectForRestriction({
                    map: map,
                    createBranchFlag: true,
                    currentEditLayer: rdLink,
                    shapeEditor: shapeCtrl,
                    operationList: ['line', 'point', 'line']
                });
                map.currentTool.enable();
                map.currentTool.snapHandler.addGuideLayer(rdLink);
                $scope.rdVoiceguide = {};
                $scope.rdVoiceguide.outLinkPids = [];
                eventController.off(eventController.eventTypes.GETLINKID);
                eventController.on(eventController.eventTypes.GETLINKID, function (data) {
                    if (data.index === 0) { // 进入线;
                        if (data.properties.kind === '9' || data.properties.kind === '10' || data.properties.form === '20' ||
                          data.properties.kind === '11' || data.properties.kind === '1' || data.properties.kind === '2') {
                            tooltipsCtrl.notify('9级路、10级路、步行街、人渡、高速道路、城市高速不能作为语音引导的进入线!', 'error');
                            map.currentTool.selectedFeatures.pop();
                            return;
                        }
                        if (data.properties.form === '33') {
                            tooltipsCtrl.notify('环岛不能作为语音引导的进入线!', 'error');
                            map.currentTool.selectedFeatures.pop();
                            return;
                        }
                        if (data.properties.form === '50') {
                            tooltipsCtrl.notify('交叉点内道路不能作为语音引导的进入线!', 'error');
                            map.currentTool.selectedFeatures.pop();
                            return;
                        }
                        map.currentTool.snapHandler.snaped = false;
                        map.currentTool.clearCross();
                        map.currentTool.snapHandler._guides = [];
                        map.currentTool.snapHandler.addGuideLayer(rdnode);
                        $scope.rdVoiceguide.inLinkPid = parseInt(data.id, 10);
                        rdVoiceGuideHighLight.inLinkPid = $scope.rdVoiceguide.inLinkPid;
                        highlightCtrl.clear();
                        highlightCtrl.highlight(rdVoiceGuideHighLight);
                        tooltipsCtrl.setCurrentTooltip('已经选择进入线,选择进入点!');
                        linkDirect = data.properties.direct;
                        if (linkDirect == 2 || linkDirect == 3) { // 单方向
                            map.currentTool.snapHandler.snaped = false;
                            map.currentTool.clearCross();
                            map.currentTool.snapHandler._guides = [];
                            $scope.rdVoiceguide.nodePid = parseInt(linkDirect == 2 ? data.properties.enode : data.properties.snode, 10);
                            rdVoiceGuideHighLight.nodePid = $scope.rdVoiceguide.nodePid;
                            highlightCtrl.clear();
                            highlightCtrl.highlight(rdVoiceGuideHighLight);
                            map.currentTool.selectedFeatures.push($scope.rdVoiceguide.nodePid.toString());
                            tooltipsCtrl.setCurrentTooltip('已选进入点,请选择退出线!');
                        }
                    } else if (data.index === 1) { // 进入点
                        // 清除鼠标十字
                        map.currentTool.snapHandler.snaped = false;
                        map.currentTool.clearCross();
                        map.currentTool.snapHandler._guides = [];
                        map.currentTool.snapHandler.addGuideLayer(rdLink); // 增加吸附图层
                        $scope.rdVoiceguide.nodePid = parseInt(data.id, 10);
                        rdVoiceGuideHighLight.nodePid = $scope.rdVoiceguide.nodePid;
                        highlightCtrl.clear();
                        highlightCtrl.highlight(rdVoiceGuideHighLight);
                        map.currentTool.selectedFeatures.push($scope.rdVoiceguide.nodePid.toString());
                        tooltipsCtrl.setCurrentTooltip('已选进入点,请选择退出线!');
                    } else if (data.index >= 2) { // 退出线
                        if (data.properties.form === '20' || data.properties.kind === '10' ||
                          data.properties.kind === '11' || data.properties.kind === '9') {
                            tooltipsCtrl.notify('9级路、10级路、步行街、人渡不能作为语音引导的退出线!', 'error');
                            map.currentTool.selectedFeatures.pop();
                            return;
                        }
                        if (data.properties.form === '33') {
                            tooltipsCtrl.notify('环岛不能作为语音引导的退出线!', 'error');
                            map.currentTool.selectedFeatures.pop();
                            return;
                        }
                        if (data.properties.form === '50') {
                            tooltipsCtrl.notify('交叉点内道路不能作为语音引导的退出线!', 'error');
                            map.currentTool.selectedFeatures.pop();
                            return;
                        }
                        if (parseInt(data.id, 10) === $scope.rdVoiceguide.inLinkPid) {
                            tooltipsCtrl.notify('退出线不能与进入线为同一条link!', 'error');
                            map.currentTool.selectedFeatures.pop();
                            return;
                        }
                        if ($scope.rdVoiceguide.outLinkPids.indexOf(parseInt(data.id, 10)) < 0) {
                            $scope.rdVoiceguide.outLinkPids.push(parseInt(data.id, 10));
                            rdVoiceGuideHighLight.outLinkPid = $scope.rdVoiceguide.outLinkPids;
                            highlightCtrl.clear();
                            highlightCtrl.highlight(rdVoiceGuideHighLight);
                            featCodeCtrl.setFeatCode($scope.rdVoiceguide);
                            tooltipsCtrl.setEditEventType('rdVoiceguide');
                            tooltipsCtrl.setCurrentTooltip('继续选择退出线,或者点击空格键保存!');
                        } else {
                            $scope.rdVoiceguide.outLinkPids = $scope.rdVoiceguide.outLinkPids.filter(function (item) {
                                return item != parseInt(data.id, 10);
                            }); // 选中的link在之前的数组里，移除它
                            rdVoiceGuideHighLight.outLinkPid = $scope.rdVoiceguide.outLinkPids;
                            highlightCtrl.clear();
                            highlightCtrl.highlight(rdVoiceGuideHighLight);
                            featCodeCtrl.setFeatCode($scope.rdVoiceguide);
                            tooltipsCtrl.setEditEventType('rdVoiceguide');
                            tooltipsCtrl.setCurrentTooltip('继续选择退出线,或者点击空格键保存!');
                        }
                    }
                });
            } else if (type === 'RDVARIABLESPEED') {
                var rdVariableSpeed = {
                    rowId: 'RDVARIABLESPEED008',
                    geoLiveType: 'DEFAULTRDSLOPETOPO',
                    joinLinkPid: [],
                    inNodePid: 0,
                    DefaultOutLinkPid: [],
                    outLinkPid: 0,
                    inLinkPid: 0
                };
                $scope.jointNode = $scope.jointLink = '';
                $scope.limitRelation.vias = [];
                highRenderCtrl.highLightFeatures = [];
                $scope.linkNodes = [];
                $scope.links = [];
                linkDirect = 0;
                // 可变限速

                // 保存所有需要高亮的图层数组;
                shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.VARIABLESPEED);
                // 地图编辑相关设置;
                tooltipsCtrl.setEditEventType('rdBranch');
                tooltipsCtrl.setCurrentTooltip('正要新建可变限速,先选择线！');
                map.currentTool = new fastmap.uikit.SelectForRestriction({
                    map: map,
                    createBranchFlag: true,
                    currentEditLayer: rdLink,
                    shapeEditor: shapeCtrl,
                    operationList: ['line', 'point', 'line']
                });
                map.currentTool.enable();
                // 添加自动吸附的图层
                map.currentTool.snapHandler.addGuideLayer(rdLink);
                // // 获取选中线的详细信息;
                // function getLinkInfos(param) {
                //     var defer = $q.defer();
                //     dsEdit.getByPid(param, 'RDLINK').then(function (data) {
                //         if (data) {
                //             defer.resolve(data);
                //         }
                //     });
                //     return defer.promise;
                // }
                // 高亮退出线方法;
                var hightlightOutLink = function () {
                    rdVariableSpeed.outLinkPid = $scope.limitRelation.outLinkPid;
                    highlightCtrl.clear();
                    highlightCtrl.highlight(rdVariableSpeed);
                    tooltipsCtrl.setCurrentTooltipText('请选择接续线!');
                };
                // 高亮接续线方法;
                var hightlightViasLink = function () {
                    rdVariableSpeed.joinLinkPid = $scope.limitRelation.vias;
                    highlightCtrl.clear();
                    highlightCtrl.highlight(rdVariableSpeed);
                    tooltipsCtrl.setCurrentTooltipText('已选接续线!');
                };
                // 选择接续线（支持修改退出线和接续线）;
                var selectOutOrSeriesLinks = function (dataresult) {
                    // 判断选的线的合法性;
                    if (dataresult.id == $scope.limitRelation.inLinkPid) {
                        tooltipsCtrl.notify('所选线不能与进入线重复!');
                        map.currentTool.selectedFeatures.pop();
                        return;
                    }
                    if (dataresult.id == $scope.limitRelation.outLinkPid) {
                        tooltipsCtrl.notify('所选线不能与退出线重复!');
                        map.currentTool.selectedFeatures.pop();
                        return;
                    }
                    dsEdit.getByPid($scope.limitRelation.inLinkPid, 'RDLINK').then(function (inLinkPidData) {
                        if (inLinkPidData) {
                            dsEdit.getByPid(dataresult.id, 'RDLINK').then(function (selectIdData) {
                                if (selectIdData) {
                                    if (inLinkPidData.meshId !== selectIdData.meshId) {
                                        tooltipsCtrl.notify('接续link不能跨图幅，请重新选择');
                                        map.currentTool.selectedFeatures.pop();
                                        return;
                                    }
                                    /* -----------------------------------如果增加的是接续线（支持修改）;-----------------------------------*/
                                    /* 如果没有接续线接续线直接跟退出线挂接;*/
                                    if ($scope.limitRelation.vias.indexOf(parseInt(dataresult.id, 10)) == -1) {
                                        if (dataresult.properties.enode == $scope.linkNodes[$scope.linkNodes.length - 1] && dataresult.properties.direct == 3) {
                                            $scope.limitRelation.vias.push(parseInt(dataresult.id, 10));
                                            // 对于node和link数组的维护;
                                            $scope.links.push(parseInt(dataresult.id, 10));
                                            $scope.linkNodes.push(parseInt(dataresult.properties.snode, 10));
                                            hightlightViasLink();
                                        } else if (dataresult.properties.snode == $scope.linkNodes[$scope.linkNodes.length - 1] && dataresult.properties.direct == 2) {
                                            $scope.limitRelation.vias.push(parseInt(dataresult.id, 10));
                                            // 对于node和link数组的维护;
                                            $scope.links.push(parseInt(dataresult.id, 10));
                                            $scope.linkNodes.push(parseInt(dataresult.properties.enode, 10));
                                            hightlightViasLink();
                                        } else if ((dataresult.properties.enode == $scope.linkNodes[$scope.linkNodes.length - 1] || dataresult.properties.snode == $scope.linkNodes[$scope.linkNodes.length - 1]) && dataresult.properties.direct == 1) {
                                            // 对于node和link数组的维护;
                                            $scope.links.push(parseInt(dataresult.id, 10));
                                            $scope.limitRelation.vias.push(parseInt(dataresult.id, 10));
                                            // (dataresult.properties.enode == $scope.linkNodes[$scope.linkNodes.length - 1]) ?
                                            // $scope.linkNodes.push(parseInt(dataresult.properties.snode)) :
                                            // $scope.linkNodes.push(parseInt(dataresult.properties.enode));
                                            if (dataresult.properties.enode == $scope.linkNodes[$scope.linkNodes.length - 1]) {
                                                $scope.linkNodes.push(parseInt(dataresult.properties.snode, 10));
                                            } else {
                                                $scope.linkNodes.push(parseInt(dataresult.properties.enode, 10));
                                            }
                                            hightlightViasLink();
                                        } else {
                                            tooltipsCtrl.notify('您选择的接续线与上一条不连续或方向错误!');
                                            map.currentTool.selectedFeatures.pop();
                                            return;
                                        }
                                    } else {
                                        var selectIndex = $scope.limitRelation.vias.indexOf(parseInt(dataresult.id, 10));
                                        $scope.links.splice(selectIndex);
                                        $scope.linkNodes.splice(selectIndex + 2);
                                        $scope.limitRelation.vias.splice(selectIndex);
                                        hightlightViasLink();
                                    }
                                }
                            });
                        }
                    });
                };
                // 初始化新增数据;
                $scope.limitRelation.vias = [];
                $scope.limitRelation.inLinkPid = '';
                $scope.limitRelation.nodePid = '';
                $scope.limitRelation.outLinkPid = '';
                var highLightObjs = [];
                // 自动追踪功能;
                var autoTrail = function (param) {
                    dsEdit.getByCondition(param).then(function (upAndDownData) {
                        if (upAndDownData.errcode !== 0) {
                            return;
                        }
                        var arrLinks = upAndDownData.data;
                        if (arrLinks.length === 0) {
                            tooltipsCtrl.setCurrentTooltip('没有找到接续线，请手动选择或保存或ESC退出！');
                            return;
                        }
                        for (var i = 0; i < arrLinks.length; i++) { // 获取第二条到最后的数据(排除第一条)
                            $scope.limitRelation.vias.push(arrLinks[i].pid);
                        }
                        rdVariableSpeed.joinLinkPid = $scope.limitRelation.vias;
                        highlightCtrl.clear();
                        highlightCtrl.highlight(rdVariableSpeed);
                        $scope.highLightObj(highLightObjs);
                        tooltipsCtrl.setCurrentTooltip('接续线已经自动计算，请按空格保存或者修改接续线！');
                    });
                };
                // 选择分歧监听事件;
                eventController.off(eventController.eventTypes.GETLINKID);
                eventController.on(eventController.eventTypes.GETLINKID, function (data) {
                    if (['8', '9', '10', '11', '13'].indexOf(data.properties.kind) > -1 || ['33', '50'].indexOf(data.properties.form) > -1 || data.properties.special === '1') {
                        tooltipsCtrl.notify('8、9、10级路、人渡、轮渡、环岛、特殊交通类型、交叉口内道路的LINK不可作为可变限速的进入link、退出link、接续link');
                        map.currentTool.selectedFeatures.pop();
                        return;
                    }
                    if (data.index === 0) { // 第一次选择进入线的逻辑
                        linkDirect = data.properties.direct;
                        if (linkDirect === '2' || linkDirect === '3') {
                            var nodePid = parseInt(linkDirect === '2' ? data.properties.enode : data.properties.snode, 10);
                            dsEdit.getByPid(nodePid, 'RDNODE').then(function (nodeData) {
                                var nodeFlag1 = false;
                                for (var i = 0; i < nodeData.forms.length; i++) {
                                    if (nodeData.forms[i].formOfWay === 2) {
                                        nodeFlag1 = true;
                                    }
                                }
                                if (nodeFlag1) {
                                    tooltipsCtrl.notify('可变限速的进入点不能为图廓点, 请重新选择', 'error');
                                    map.currentTool.selectedFeatures.pop();
                                    nodeFlag1 = false;
                                    return;
                                }
                                // 清除吸附的十字
                                map.currentTool.snapHandler.snaped = false;
                                map.currentTool.clearCross();
                                map.currentTool.snapHandler._guides = [];
                                map.currentTool.snapHandler.addGuideLayer(rdnode);
                                // 高亮进入线;
                                $scope.limitRelation.inLinkPid = parseInt(data.id, 10);
                                rdVariableSpeed.inLinkPid = $scope.limitRelation.inLinkPid;
                                $scope.limitRelation.nodePid = parseInt(linkDirect === '2' ? data.properties.enode : data.properties.snode, 10);
                                $scope.linkNodes.push($scope.limitRelation.nodePid);
                                rdVariableSpeed.inNodePid = $scope.limitRelation.nodePid;
                                highlightCtrl.clear();
                                highlightCtrl.highlight(rdVariableSpeed);
                                map.currentTool.selectedFeatures.push($scope.limitRelation.nodePid.toString());
                                tooltipsCtrl.setCurrentTooltip('已经选择进入点,选择退出线!');
                                map.currentTool.snapHandler.addGuideLayer(rdLink);
                            });
                        } else {
                            // 清除吸附的十字
                            map.currentTool.snapHandler.snaped = false;
                            map.currentTool.clearCross();
                            map.currentTool.snapHandler._guides = [];
                            map.currentTool.snapHandler.addGuideLayer(rdnode);
                            // 高亮进入线;
                            $scope.limitRelation.inLinkPid = parseInt(data.id, 10);
                            rdVariableSpeed.inLinkPid = $scope.limitRelation.inLinkPid;
                            highlightCtrl.clear();
                            highlightCtrl.highlight(rdVariableSpeed);
                            tooltipsCtrl.setCurrentTooltip('已经选择进入线,选择进入点!');
                        }


                        // 进入线的方向属性;
                        // 如果进入线是单方向道路，自动选择进入点;
                        // if (linkDirect === '2' || linkDirect === '3') {
                        //    $scope.limitRelation.nodePid = parseInt(linkDirect === '2' ? data.properties.enode : data.properties.snode, 10);
                        //    $scope.linkNodes.push($scope.limitRelation.nodePid);
                        //    rdVariableSpeed.inNodePid = $scope.limitRelation.nodePid;
                        //    highlightCtrl.clear();
                        //    highlightCtrl.highlight(rdVariableSpeed);
                        //    map.currentTool.selectedFeatures.push($scope.limitRelation.nodePid.toString());
                        //    tooltipsCtrl.setCurrentTooltip('已经选择进入点,选择退出线!');
                        //    map.currentTool.snapHandler.addGuideLayer(rdLink);
                        // }
                    } else if (data.index === 1) {
                        dsEdit.getByPid(parseInt(data.id, 10), 'RDNODE').then(function (nodeData) {
                            var nodeFlag = false;
                            for (var i = 0; i < nodeData.forms.length; i++) {
                                if (nodeData.forms[i].formOfWay === 2) {
                                    nodeFlag = true;
                                }
                            }
                            if (nodeFlag) {
                                tooltipsCtrl.notify('可变限速的进入点不能为图廓点, 请重新选择', 'error');
                                map.currentTool.selectedFeatures.pop();
                                nodeFlag = false;
                                return;
                            }
                            // 如果进入线是双方向的，则根据用户的选择高亮进入点;
                            $scope.limitRelation.nodePid = parseInt(data.id, 10);
                            $scope.linkNodes.push($scope.limitRelation.nodePid);
                            rdVariableSpeed.inNodePid = $scope.limitRelation.nodePid;
                            highlightCtrl.clear();
                            highlightCtrl.highlight(rdVariableSpeed);
                            tooltipsCtrl.setCurrentTooltip('已经选择进入点,请选择退出线!');
                            map.currentTool.snapHandler.addGuideLayer(rdLink);
                        });
                    } else if (data.index === 2) {
                        if (data.properties.snode != $scope.limitRelation.nodePid && data.properties.enode != $scope.limitRelation.nodePid) {
                            tooltipsCtrl.notify('退出线必须与进入点衔接!');
                            map.currentTool.selectedFeatures.pop();
                            return;
                        }
                        if (data.id == $scope.limitRelation.inLinkPid) {
                            tooltipsCtrl.notify('退出线不能与进入线重合!');
                            map.currentTool.selectedFeatures.pop();
                            return;
                        }
                        if (data.properties.enode == $scope.linkNodes[0] && data.properties.direct == 3) {
                            $scope.limitRelation.outLinkPid = data.id;
                            $scope.linkNodes.push(parseInt(data.properties.snode, 10));
                        } else if (data.properties.snode == $scope.linkNodes[0] && data.properties.direct == 2) {
                            $scope.limitRelation.outLinkPid = data.id;
                            $scope.linkNodes.push(parseInt(data.properties.enode, 10));
                        } else if ((data.properties.enode == $scope.linkNodes[0] || data.properties.snode == $scope.linkNodes[0]) && data.properties.direct == 1) {
                            $scope.limitRelation.outLinkPid = data.id;
                            var tmepNode = (data.properties.enode == $scope.linkNodes[0]) ? parseInt(data.properties.snode, 10) : parseInt(data.properties.enode, 10);
                            $scope.linkNodes.push(parseInt(tmepNode, 10));
                        } else {
                            tooltipsCtrl.notify('退出线没有和进入点衔接或者方向有误！');
                            map.currentTool.selectedFeatures.pop();
                            return;
                        }
                        $scope.limitRelation.outLinkPid = data.id;
                        rdVariableSpeed.outLinkPid = $scope.limitRelation.outLinkPid;
                        highlightCtrl.clear();
                        highlightCtrl.highlight(rdVariableSpeed);
                        var param = {
                            command: 'CREATE',
                            dbId: App.Temp.dbId,
                            type: 'RDLINK',
                            data: {
                                queryType: 'RDVARIABLESPEED',
                                linkPid: data.id,
                                nodePid: ($scope.limitRelation.nodePid == data.properties.enode) ? data.properties.snode : data.properties.enode
                            }
                        };
                        autoTrail(param);
                    } else if (data.index > 2) {
                        selectOutOrSeriesLinks(data);
                    }
                    /* 组装数据对象*/
                    featCodeCtrl.setFeatCode($scope.limitRelation);
                });
            } else if (type === 'RDLANE') { // 详细车道
                $scope.rdLaneObj = {
                    rowId: '0',
                    pid: 0,
                    geoLiveType: 'DEFAULTRDLANETOPO',
                    inLinkPid: 0,
                    nodePid: 0,
                    outLinkPids: [],
                    vias: [],
                    refOutLinks: []
                };
                // 保存所有需要高亮的图层数组;线方向
                var selLinkDirect = 0;
                // 设置快捷键保存的事件类型供热键通过（shapeCtrl.editType）监听;
                shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.RDLANE);
                // 地图编辑相关设置;
                tooltipsCtrl.setEditEventType('rdLane');
                tooltipsCtrl.setCurrentTooltip('请选择道路线！');
                map.currentTool = new fastmap.uikit.SelectForRestriction({
                    map: map,
                    createBranchFlag: true,
                    currentEditLayer: rdLink,
                    shapeEditor: shapeCtrl,
                    operationList: ['line', 'point', 'line']
                });
                map.currentTool.enable();
                map.currentTool.snapHandler.addGuideLayer(rdLink);
                $scope.laneInfo = {
                    links: []
                };
                $scope.linkArray = [];
                eventController.off(eventController.eventTypes.GETLINKID);
                eventController.on(eventController.eventTypes.GETLINKID, function (data) {
                    // 过滤
                    $scope.unique = function (arr) {
                        var result = [];
                        var hash = {};
                        for (var i = 0, elem; arr[i] != null; i++) {
                            elem = arr[i];
                            if (!hash[elem]) {
                                result.push(elem);
                                hash[elem] = true;
                            }
                        }
                        return result;
                    };
                    // 追踪高亮
                    $scope.getTrackLinks = function (laneInfo) {
                        var param = {
                            command: 'CREATE',
                            dbId: App.Temp.dbId,
                            type: 'RDLINK',
                            data: {
                                linkPid: laneInfo.inLinkPid,
                                nodePidDir: laneInfo.nodePid,
                                maxNum: 30
                            }
                        };
                        dsEdit.getByCondition(param).then(function (res) {
                            // $scope.linkArray = res.data;
                            // $scope.laneInfo.links = res.data;
                            for (var i = 0, len = res.data.length; i < len; i++) {
                                if (i > 0) {
                                    $scope.linkArray.push($scope.formatLink(res.data[i]));
                                    $scope.rdLaneObj.vias.push(res.data[i].pid);
                                    $scope.laneInfo.links.push(res.data[i].pid);
                                }
                            }
                            highlightCtrl.clear();
                            highlightCtrl.highlight($scope.rdLaneObj);
                        });
                    };
                    // 格式化link
                    $scope.formatLink = function (link) {
                        var newLink = link;
                        for (var k in newLink) {
                            if (k == 'id') {
                                newLink.pid = parseInt(newLink.id, 10);
                            } else if (k == 'snode') {
                                newLink.sNodePid = parseInt(newLink.snode, 10);
                            } else if (k == 'enode') {
                                newLink.eNodePid = parseInt(newLink.enode, 10);
                            }
                        }
                        return newLink;
                    };
                    if (data.index === 0) { // 进入线;
                        $scope.laneInfo.inLinkPid = parseInt(data.id, 10);
                        $scope.linkArray.push($scope.formatLink(data.properties));
                        $scope.laneInfo.links.push(data.id);
                        $scope.rdLaneObj.inLinkPid = data.id;
                        highlightCtrl.clear();
                        highlightCtrl.highlight($scope.rdLaneObj);
                        tooltipsCtrl.setCurrentTooltip('已经选择进入线,选择进入点!');
                        selLinkDirect = parseInt(data.properties.direct, 10);
                        if (selLinkDirect == 2 || selLinkDirect == 3) { // 单方向
                            $scope.laneInfo.nodePid = parseInt(selLinkDirect == 2 ? data.properties.enode : data.properties.snode, 10);
                            $scope.laneInfo.laneDir = selLinkDirect;
                            $scope.rdLaneObj.nodePid = $scope.laneInfo.nodePid;
                            highlightCtrl.clear();
                            highlightCtrl.highlight($scope.rdLaneObj);
                            map.currentTool.selectedFeatures.push($scope.laneInfo.nodePid.toString());
                            $scope.getTrackLinks($scope.laneInfo);
                            tooltipsCtrl.setCurrentTooltip('已选进入点,请选择道路线!');
                        }
                    } else if (data.index === 1) { // 进入点
                        $scope.laneInfo.nodePid = parseInt(data.id, 10);
                        if (parseInt($scope.linkArray[0].snode, 10) == $scope.laneInfo.nodePid) {
                            $scope.laneInfo.laneDir = 3;
                        } else if (parseInt($scope.linkArray[0].enode, 10) == $scope.laneInfo.nodePid) {
                            $scope.laneInfo.laneDir = 2;
                        }
                        $scope.rdLaneObj.nodePid = $scope.laneInfo.nodePid;
                        highlightCtrl.clear();
                        highlightCtrl.highlight($scope.rdLaneObj);
                        map.currentTool.selectedFeatures.push($scope.laneInfo.nodePid.toString());
                        $scope.getTrackLinks($scope.laneInfo);
                        tooltipsCtrl.setCurrentTooltip('已选进入点,请选择道路线!');
                    } else if (data.index > 1) {
                        if ($scope.rdLaneObj.vias.indexOf(data.id) > -1) {
                            $scope.rdLaneObj.vias.length = $scope.rdLaneObj.vias.indexOf(data.id);
                            highlightCtrl.clear();
                            highlightCtrl.highlight($scope.rdLaneObj);
                            for (var i = 0; i < $scope.linkArray.length; i++) {
                                if ($scope.linkArray[i].pid === data.id) {
                                    $scope.linkArray.length = i;
                                    break;
                                }
                            }
                            for (var j = 0; j < $scope.laneInfo.links.length; j++) {
                                if ($scope.laneInfo.links[j].pid === data.id) {
                                    $scope.laneInfo.links.length = j;
                                    break;
                                }
                            }
                        } else if (([data.properties.snode, data.properties.enode].indexOf($scope.linkArray[$scope.linkArray.length - 1].eNodePid.toString()) > -1) ||
                            ([data.properties.snode, data.properties.enode].indexOf($scope.linkArray[$scope.linkArray.length - 1].sNodePid.toString()) > -1)) {
                            $scope.rdLaneObj.vias.push(data.id);
                            highlightCtrl.clear();
                            highlightCtrl.highlight($scope.rdLaneObj);
                            $scope.linkArray.push($scope.formatLink(data.properties));
                            $scope.laneInfo.links.push(data.id);
                        }
                    }
                    featCodeCtrl.setFeatCode($scope.laneInfo);
                });
            } else if (type === 'RDHGWGLIMIT') { // 限高限重
                // var angle;
                var hgwgLimitObj = {};
                if (shapeCtrl.shapeEditorResult) {
                    // shapeCtrl.shapeEditorResult.setFinalGeometry(fastmap.mapApi.lineString([fastmap.mapApi.point(0,
                    // 0)])); selectCtrl.selectByGeometry(shapeCtrl.shapeEditorResult.getFinalGeometry());
                    layerCtrl.pushLayerFront('edit');
                }
                shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.POINTVERTEXADD); // 可以共用一个api
                shapeCtrl.startEditing();
                map.currentTool = shapeCtrl.getCurrentTool();
                map.currentTool.enable();
                map.currentTool.snapHandler.addGuideLayer(rdLink);
                tooltipsCtrl.setCurrentTooltip('请选择限高限重位置点！');
                eventController.off(eventController.eventTypes.RESETCOMPLETE);
                eventController.on(eventController.eventTypes.RESETCOMPLETE, function (e) {
                    var pro = e.property;
                    dsEdit.getByPid(pro.id, 'RDLINK').then(function (data) {
                        if (data) {
                            // 当前点位和线的断点距离小于0.5米就认为是同一点
                            if ((e.latlng.distanceTo(L.latLng(data.geometry.coordinates[0][1], data.geometry.coordinates[0][0]))) < 0.5 || e.latlng.distanceTo(L.latLng(data.geometry.coordinates[data.geometry.coordinates.length - 1][1], data.geometry.coordinates[data.geometry.coordinates.length - 1][0])) < 0.5) {
                                selectCtrl.selectedFeatures = null;
                                editLayer.drawGeometry = null;
                                shapeCtrl.shapeEditorResult.setFinalGeometry(null);
                                shapeCtrl.shapeEditorResult.setOriginalGeometry(null);
                                editLayer.clear();
                                tooltipsCtrl.notify('卡车地图不能制作到关联link端点！', 'error');
                                return;
                            }
                            tooltipsCtrl.setEditEventType('pointVertexAdd');
                            hgwgLimitObj.linkPid = pro.id;
                            hgwgLimitObj.latitude = e.latlng.lat;
                            hgwgLimitObj.longitude = e.latlng.lng;
                            highLightFeatures = {
                                rowId: 'rdHgWgLimit007',
                                geoLiveType: 'DEFAULTSELECTPOINTTOPO',
                                inLinkPid: pro.id,
                                selectGeo: {
                                    type: 'Point',
                                    coordinates: [e.latlng.lng, e.latlng.lat]
                                }
                            };
                            highlightCtrl.clear();
                            highlightCtrl.highlight(highLightFeatures);
                            selectCtrl.onSelected({
                                linkPid: pro.id,
                                latitude: e.latlng.lat,
                                longitude: e.latlng.lng,
                                direct: pro.direct
                            });
                            if (pro.direct == 1) {
                                // tooltipsCtrl.setEditEventType(fastmap.dataApi.GeoLiveModelType.RDHGWGLIMIT);
                                var point = shapeCtrl.shapeEditorResult.getFinalGeometry();
                                var linkCoords = data.geometry.coordinates;
                                // 计算鼠标点位置与线的节点的关系，判断与鼠标点最近的节点
                                // 并用斜率判断默认值
                                var index = 0;
                                var tp = map.latLngToContainerPoint([point.y, point.x]);
                                var dist,
                                    sVertex,
                                    eVertex,
                                    d1,
                                    d2,
                                    d3;
                                for (var i = 0, len = linkCoords.length - 1; i < len; i++) {
                                    sVertex = map.latLngToContainerPoint(L.latLng(linkCoords[i][1], linkCoords[i][0]));
                                    eVertex = map.latLngToContainerPoint(L.latLng(linkCoords[i + 1][1], linkCoords[i + 1][0]));
                                    dist = L.LineUtil.pointToSegmentDistance(tp, sVertex, eVertex);
                                    if (dist < 5) {
                                        d1 = (tp.x - sVertex.x) * (tp.x - sVertex.x) + (tp.y - sVertex.y) * (tp.y - sVertex.y);
                                        d2 = (tp.x - eVertex.x) * (tp.x - eVertex.x) + (tp.y - eVertex.y) * (tp.y - eVertex.y);
                                        d3 = (sVertex.x - eVertex.x) * (sVertex.x - eVertex.x) + (sVertex.y - eVertex.y) * (sVertex.y - eVertex.y);
                                        if (d1 <= d3 && d2 <= d3) {
                                            index = i;
                                            break;
                                        }
                                    }
                                }
                                angle = $scope.angleOfLink(sVertex, eVertex);
                                if (sVertex.x > eVertex.x || (sVertex.x == eVertex.x && sVertex.y > eVertex.y)) { // 从右往左划线或者从下网上划线
                                    angle = Math.PI + angle;
                                }
                                // tooltipsCtrl.setEditEventType(fastmap.dataApi.GeoLiveModelType.RDHGWGLIMIT);
                                var marker = {
                                    flag: false,
                                    point: point,
                                    type: 'marker',
                                    angle: angle,
                                    orientation: '2',
                                    pointForDirect: point
                                };
                                layerCtrl.pushLayerFront('edit');
                                var sObj = shapeCtrl.shapeEditorResult;
                                editLayer.drawGeometry = marker;
                                editLayer.draw(marker, editLayer);
                                sObj.setOriginalGeometry(marker);
                                sObj.setFinalGeometry(marker);
                                shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.RDHGWGLIMIT);
                                shapeCtrl.startEditing();
                                tooltipsCtrl.setCurrentTooltip('点击方向图标开始修改方向！');
                                selectCtrl.selectedFeatures.direct = 2; // 默认顺方向
                                eventController.off(eventController.eventTypes.DIRECTEVENT);
                                eventController.on(eventController.eventTypes.DIRECTEVENT, function (dd) {
                                    selectCtrl.selectedFeatures.direct = parseInt(dd.geometry.orientation, 10);
                                    tooltipsCtrl.setChangeInnerHtml('点击空格保存,或者按ESC键取消!');
                                });
                            } else {
                                shapeCtrl.shapeEditorResult.setFinalGeometry(null);
                                tooltipsCtrl.setCurrentTooltip('请点击空格,创建限高限重!');
                                shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.RDHGWGLIMIT);
                            }
                        } else {
                            tooltipsCtrl.setCurrentTooltip('请重新选择位置创建限高限重!');
                        }
                    });
                });
            } else if (type === 'RDLANETOPO') { // 车道连通
                var laneTopoData = {
                    linkPids: [],
                    nodePid: '',
                    laneDir: 1
                };
                $scope.rdLaneTopoObj = {
                    rowId: '0',
                    pid: 0,
                    geoLiveType: 'DEFAULTRDLANETOPO',
                    inLinkPid: 0,
                    nodePid: 0,
                    outLinkPids: [],
                    vias: [],
                    refOutLinks: []
                };
                // 设置快捷键保存的事件类型供热键通过（shapeCtrl.editType）监听;
                shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.RDLANETOPODETAIL);
                // 地图编辑相关设置;
                tooltipsCtrl.setEditEventType('rdLaneTopoDetail');
                tooltipsCtrl.setCurrentTooltip('请选择进入线！');
                map.currentTool = new fastmap.uikit.SelectForRestriction({
                    map: map,
                    currentEditLayer: rdLink,
                    shapeEditor: shapeCtrl,
                    operationList: ['line', 'point', 'line']
                });
                map.currentTool.enable();
                eventController.off(eventController.eventTypes.GETLINKID);
                eventController.on(eventController.eventTypes.GETLINKID, function (data) {
                    if (data.index === 0) {
                        if (parseInt(data.properties.direct, 10) == 1) {
                            laneTopoData.linkPids.push(parseInt(data.id, 10));
                            $scope.rdLaneTopoObj.inLinkPid = laneTopoData.linkPids[0];
                            highlightCtrl.clear();
                            highlightCtrl.highlight($scope.rdLaneTopoObj);
                            tooltipsCtrl.setCurrentTooltip('已经选择进入线, 请选择进入点!');
                        } else if (parseInt(data.properties.direct, 10) == 2 || parseInt(data.properties.direct, 10) == 3) {
                            laneTopoData.linkPids.push(parseInt(data.id, 10));
                            $scope.rdLaneTopoObj.inLinkPid = laneTopoData.linkPids[0];
                            if (parseInt(data.properties.direct, 10) == 2) {
                                laneTopoData.nodePid = parseInt(data.properties.enode, 10);
                            } else if (parseInt(data.properties.direct, 10) == 3) {
                                laneTopoData.nodePid = parseInt(data.properties.snode, 10);
                            }
                            $scope.rdLaneTopoObj.nodePid = laneTopoData.nodePid;
                            highlightCtrl.clear();
                            highlightCtrl.highlight($scope.rdLaneTopoObj);
                            var param = {
                                type: 'RDLANE',
                                dbId: App.Temp.dbId,
                                data: {
                                    linkPid: laneTopoData.linkPids[0],
                                    nodePid: laneTopoData.nodePid
                                }
                            };
                            // 查找已经有的退出线
                            dsEdit.getByCondition(param).then(function (outData) {
                                if (outData != null) {
                                    if (outData.data && outData.data.length > 0) {
                                        $scope.rdLaneTopoObj.refOutLinks = outData.data;
                                        highlightCtrl.clear();
                                        highlightCtrl.highlight($scope.rdLaneTopoObj);
                                    }
                                }
                            });
                            tooltipsCtrl.setCurrentTooltip('已经选择进入点, 请选择退出线!');
                            map.currentTool.selectedFeatures.push(laneTopoData.nodePid);
                        }
                    } else if (data.index === 1) {
                        laneTopoData.nodePid = parseInt(data.id, 10);
                        $scope.rdLaneTopoObj.nodePid = laneTopoData.nodePid;
                        highlightCtrl.clear();
                        highlightCtrl.highlight($scope.rdLaneTopoObj);
                        param = {
                            type: 'RDLANE',
                            dbId: App.Temp.dbId,
                            data: {
                                linkPid: laneTopoData.linkPids[0],
                                nodePid: laneTopoData.nodePid
                            }
                        };
                        dsEdit.getByCondition(param).then(function (outData) {
                            if (outData != null) {
                                if (outData.data && outData.data.length > 0) {
                                    $scope.rdLaneTopoObj.refOutLinks = outData.data;
                                    highlightCtrl.clear();
                                    highlightCtrl.highlight($scope.rdLaneTopoObj);
                                }
                            }
                        });
                        tooltipsCtrl.setCurrentTooltip('已经选择进入点, 请选择退出线!');
                        map.currentTool.selectedFeatures.push(laneTopoData.nodePid);
                    } else if (data.index > 1) {
                        if (laneTopoData.linkPids.indexOf(parseInt(data.id, 10)) < 0) {
                            laneTopoData.linkPids.push(parseInt(data.id, 10));
                            $scope.rdLaneTopoObj.outLinkPids.push(data.id);
                            highlightCtrl.clear();
                            highlightCtrl.highlight($scope.rdLaneTopoObj);
                        } else if (laneTopoData.linkPids.indexOf(parseInt(data.id, 10)) > 0) {
                            laneTopoData.linkPids.splice(laneTopoData.linkPids.indexOf(parseInt(data.id, 10)), 1);
                            $scope.rdLaneTopoObj.outLinkPids.splice($scope.rdLaneTopoObj.outLinkPids.indexOf(parseInt(data.id, 10)), 1);
                            highlightCtrl.clear();
                            highlightCtrl.highlight($scope.rdLaneTopoObj);
                        }
                        tooltipsCtrl.setCurrentTooltip('继续选退出线, 或者点击空格创建,或者按ESC键取消!');
                    }
                    shapeCtrl.shapeEditorResult.setFinalGeometry(laneTopoData);
                });
            }

            // 启动工具成功
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
