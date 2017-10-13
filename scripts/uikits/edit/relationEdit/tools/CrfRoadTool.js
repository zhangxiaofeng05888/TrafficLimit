/**
 * Created by wuzhen on 2017/4/9.
 * 框选线，适用于cfr道路
 */

fastmap.uikit.relationEdit.CrfRoadTool = fastmap.uikit.relationEdit.RectSelectTool.extend({
    initialize: function () {
        fastmap.uikit.relationEdit.RectSelectTool.prototype.initialize.call(this);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.name = 'CrfRoadTool';
    },

    startup: function () {
        this.resetStatus();

        fastmap.uikit.relationEdit.RectSelectTool.prototype.startup.apply(this, arguments);
        
        this.removeFeatureSelFilter(); // crf作业时需要跨大区作业

        this.selectFeedback = new fastmap.mapApi.Feedback();
        this.installFeedback(this.selectFeedback);
        this.selectTypes = ['RDLINK', 'RDINTER', 'RDROAD']; // , 'RDINTER'
        this.selectedFeatures = [];

        this.refresh();
    },

    refresh: function () {
        this.resetSelectFeedback();
        this.resetEditResultFeedback();
        this.resetMouseInfo();
    },

    resetMouseInfo: function () {
        if (!(this.editResult.nodes && this.editResult.nodes.length > 0)) {
            this.setMouseInfo('请在地图上框选或者空格保存!');
        } else {
            this.setMouseInfo('');
        }
    },

    resetEditResultFeedback: function () {
        if (!this.defaultFeedback) {
            return;
        }

        this.defaultFeedback.clear();

        if (this.editResult && this.editResult.links) {
            var geometry = {
                type: 'MultiPoint',
                coordinates: []
            };

            var length = this.editResult.links.length;
            if (length > 0) {
                for (var i = 0; i < length; ++i) {
                    var feature = this.editResult.links[i];
                    var linkSymbol = this.symbolFactory.getSymbol('ls_link');
                    this.defaultFeedback.add(feature.geometry, linkSymbol);
                }

                geometry.coordinates = this.getPointOnLinks(this.editResult.links);

                this.geojsonTransform.setEnviroment(this.map, null, this.convertToPixel);
                var pixelGeometry = this.geojsonTransform.convertGeometry(geometry);
                var convexHull = this.geometryAlgorithm.convexHull(pixelGeometry);
                var buffer = this.geometryAlgorithm.buffer(convexHull, 20);
                this.geojsonTransform.setEnviroment(this.map, null, this.convertToGeography);
                var geographyGeometry = this.geojsonTransform.convertGeometry(buffer); //
                // 绘制包络线
                var bufferSymbol = this.symbolFactory.getSymbol('relationEdit_py_buffer');
                this.defaultFeedback.add(geographyGeometry, bufferSymbol);
            }
        }

        this.refreshFeedback();
    },

    /**
     * 获取线的所有点的坐标
     * @param links
     * @returns {Array}
     */
    getPointOnLinks: function (links) {
        var coordinates = [];
        for (var i = 0, len = links.length; i < len; i++) {
            coordinates = coordinates.concat(links[i].geometry.coordinates);
        }
        return coordinates;
    },

    onLeftButtonDown: function (event) {
        this.startPoint = this.mousePoint;
        this.isDragging = true;

        return true;
    },

    onLeftButtonUp: function (event) {
        if (!this.isDragging) {
            return false;
        }

        this.isDragging = false;

        var box = this.getSelectBox(this.startPoint, this.endPoint);

        var features = this.featureSelector.selectByGeometry(box, this.selectTypes);

        if (this.editResult.isCreate) {
            features = this.filterRdlinks(features);// 排除掉已经做过rdRoad的rdlink
        } else {
            features = this.filterRdRoadAndRdLinks(features);
        }

        if (event.originalEvent.ctrlKey) {
            this.modifyLinks(features);
        } else {
            this.replaceLinks(features);
        }

        return true;
    },

    modifyLinks: function (features) {
        var newEditResult = FM.Util.clone(this.editResult);
        var addItems = FM.Util.differenceBy(features, newEditResult.links, 'properties.id');
        var remainItems = FM.Util.differenceBy(newEditResult.links, features, 'properties.id');
        newEditResult.links = remainItems.concat(addItems);
        this.createOperation('修改cfr道路', newEditResult);
    },

    replaceLinks: function (features) {
        var newEditResult = FM.Util.clone(this.editResult);
        newEditResult.links = features;
        this.createOperation('框选cfr道路', newEditResult);
    },

    /**
     * 排除掉已经做过rdRoad和rdInter的rdlink
     * @param dataList
     * @returns {Array}
     */
    filterRdlinks: function (dataList) {
        var i,
            j,
            len;
        var rdLinkList = [];
        var usedLinkIdList = [];
        for (i = 0, len = dataList.length; i < len; i++) {
            if (dataList[i].properties.geoLiveType === 'RDLINK') {
                rdLinkList.push(dataList[i]);
            } else if (dataList[i].properties.geoLiveType === 'RDINTER') {
                for (j = 0; j < dataList[i].properties.links.length; j++) {
                    usedLinkIdList.push(dataList[i].properties.links[j].linkId);
                }
            } else if (dataList[i].properties.geoLiveType === 'RDROAD') {
                for (j = 0; j < dataList[i].properties.links.length; j++) {
                    usedLinkIdList.push(dataList[i].properties.links[j].linkId);
                }
            }
        }

        usedLinkIdList = FM.Util.unique(usedLinkIdList);

        for (i = 0; i < rdLinkList.length; i++) {
            var linkId = rdLinkList[i].properties.id;
            if (usedLinkIdList.indexOf(linkId) > -1) {
                rdLinkList.splice(i, 1);
                i--;
            }
        }

        return rdLinkList;
    },

    /**
     * 排除掉已经做了rdRoad和rdInter的rdLink(不包括当前rdroad本身),返回rdLink对象的数组
     * @param linkList
     * @returns {Array}
     */
    filterRdRoadAndRdLinks: function (dataList) {
        var originRdRoad = this.editResult.originObject;
        var i,
            j,
            len;
        var rdLinkList = [];
        var usedLinkIdList = [];
        for (i = 0, len = dataList.length; i < len; i++) {
            if (dataList[i].properties.geoLiveType === 'RDLINK') {
                rdLinkList.push(dataList[i]);
            } else if (dataList[i].properties.geoLiveType === 'RDINTER') {
                for (j = 0; j < dataList[i].properties.links.length; j++) {
                    usedLinkIdList.push(dataList[i].properties.links[j].linkId);
                }
            } else if (dataList[i].properties.geoLiveType === 'RDROAD') {
                if (dataList[i].properties.id !== originRdRoad.pid) {
                    for (j = 0; j < dataList[i].properties.links.length; j++) {
                        usedLinkIdList.push(dataList[i].properties.links[j].linkId);
                    }
                }
            }
        }
        usedLinkIdList = FM.Util.unique(usedLinkIdList);

        for (i = 0; i < rdLinkList.length; i++) {
            var nodeId = rdLinkList[i].properties.id;
            if (usedLinkIdList.indexOf(nodeId) > -1) {
                rdLinkList.splice(i, 1);
                i--;
            }
        }

        return rdLinkList;
    },

    onRedo: function (oldEditResult, newEditResult) {
        this.editResult = newEditResult;
        this.refresh();
    },

    onUndo: function (oldEditResult, newEditResult) {
        this.editResult = oldEditResult;
        this.refresh();
    }
});
