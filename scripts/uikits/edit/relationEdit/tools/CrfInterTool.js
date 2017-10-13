/**
 * Created by wuzhen on 2017/4/1.
 * 用户框选点 ，已经使用与crf点的创建，还可以继续适用于其他相同的操作
 */

fastmap.uikit.relationEdit.CrfInterTool = fastmap.uikit.relationEdit.RectSelectTool.extend({
    initialize: function () {
        fastmap.uikit.relationEdit.RectSelectTool.prototype.initialize.call(this);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.name = 'CrfInterTool';
    },

    startup: function () {
        this.resetStatus();

        fastmap.uikit.relationEdit.RectSelectTool.prototype.startup.apply(this, arguments);

        this.removeFeatureSelFilter();

        this.selectFeedback = new fastmap.mapApi.Feedback();
        this.installFeedback(this.selectFeedback);
        this.selectTypes = ['RDNODE', 'RDINTER']; // , 'RDINTER'
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

        if (this.editResult && this.editResult.nodes) {
            var geometry = {
                type: 'MultiPoint',
                coordinates: []
            };
            var length = this.editResult.nodes.length;
            for (var i = 0; i < length; ++i) {
                var feature = this.editResult.nodes[i];
                var nodeSymbol = this.symbolFactory.getSymbol('pt_node_cross');
                this.defaultFeedback.add(feature.geometry, nodeSymbol);
                geometry.coordinates.push(feature.geometry.coordinates);
            }
            if (this.editResult.links && this.editResult.links.length > 0) {
                for (var j = 0; j < this.editResult.links.length; j++) {
                    var feat = this.editResult.links[j];
                    var nodeSymb = this.symbolFactory.getSymbol('ls_rdLink_in');
                    this.defaultFeedback.add(feat.geometry, nodeSymb);
                }
            }

            if (length > 0) {
                this.geojsonTransform.setEnviroment(this.map, null, this.convertToPixel);
                var pixelGeometry = this.geojsonTransform.convertGeometry(geometry);
                var convexHull = this.geometryAlgorithm.convexHull(pixelGeometry);
                var buffer = this.geometryAlgorithm.buffer(convexHull, 20);
                this.geojsonTransform.setEnviroment(this.map, null, this.convertToGeography);
                var geographyGeometry = this.geojsonTransform.convertGeometry(buffer);
                // 绘制包络线
                var bufferSymbol = this.symbolFactory.getSymbol('relationEdit_py_buffer');
                this.defaultFeedback.add(geographyGeometry, bufferSymbol);
            }
        }

        this.refreshFeedback();
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
            features = this.filterRdInter(features);// 排除掉已经做过rdInter的rdNode
        } else {
            features = this.filterNoSelfRdInter(features); // 排除掉非本身的rdInter和非本身的已经做了rdInter的rdnode
        }

        if (event.originalEvent.ctrlKey) {
            this.modifyNodes(features);
        } else {
            this.replaceNodes(features);
        }

        return true;
    },

    /**
     * 排除掉非本身的rdInter和非本身的已经做了rdInter的rdnode,返回rdNode对象的数组
     * @param dataList
     * @returns {Array}
     */
    filterNoSelfRdInter: function (dataList) {
        var originRdInter = this.editResult.originObject;
        var i,
            j,
            len;
        var rdNodeList = [];
        var rdInterNodeIdList = [];
        for (i = 0, len = dataList.length; i < len; i++) {
            if (dataList[i].properties.geoLiveType === 'RDNODE') {
                rdNodeList.push(dataList[i]);
            } else if (dataList[i].properties.geoLiveType === 'RDINTER') {
                if (dataList[i].properties.id !== originRdInter.pid) {
                    for (j = 0; j < dataList[i].properties.nodes.length; j++) {
                        rdInterNodeIdList.push(dataList[i].properties.nodes[j].nodeId);
                    }
                }
            }
        }

        for (i = 0; i < rdNodeList.length; i++) {
            var nodeId = rdNodeList[i].properties.id;
            if (rdInterNodeIdList.indexOf(nodeId) > -1) {
                rdNodeList.splice(i, 1);
                i--;
            }
        }

        return rdNodeList;
    },

    /**
     * 排除掉已经做过rdInter的rdNode
     * @param dataList
     * @returns {Array}
     */
    filterRdInter: function (dataList) {
        var i,
            j,
            len;
        var rdNodeList = [];
        var usedNodeIdList = [];
        for (i = 0, len = dataList.length; i < len; i++) {
            if (dataList[i].properties.geoLiveType === 'RDNODE') {
                rdNodeList.push(dataList[i]);
            } else if (dataList[i].properties.geoLiveType === 'RDINTER') {
                for (j = 0; j < dataList[i].properties.nodes.length; j++) {
                    usedNodeIdList.push(dataList[i].properties.nodes[j].nodeId);
                }
            }
        }

        usedNodeIdList = FM.Util.unique(usedNodeIdList);

        for (i = 0; i < rdNodeList.length; i++) {
            var nodeId = rdNodeList[i].properties.id;
            if (usedNodeIdList.indexOf(nodeId) > -1) {
                rdNodeList.splice(i, 1);
                i--;
            }
        }

        return rdNodeList;
    },

    /**
     * 过滤已经做过CRFR 的link,
     * @example 三根线串联时，如果此三根线的两个端点分别做了crfI，然后三根线又做了一个crfR，这是如果在将中间的两个点做CRFI的时候，需要将中间的线排除掉
     * @param links
     * @returns {*}
     */
    filterCrfiLinks: function (links) {
        var crfrs = this.featureSelector.selectByGeoLiveType('RDROAD');
        var crfrsLinks = [];
        // 获取所有crfis 的link
        for (var z = 0; z < crfrs.length; z++) {
            if (crfrs[z].properties.links) {
                crfrsLinks = crfrsLinks.concat(crfrs[z].properties.links);
            }
        }
        for (var j = 0; j < crfrsLinks.length; j++) {
            for (var i = 0; i < links.length; i++) {
                if (links[i].properties.id == crfrsLinks[j].linkId) {
                    links.splice(i, 1);
                    i--;
                }
            }
        }
        return links;
    },

    modifyNodes: function (features) {
        var newEditResult = FM.Util.clone(this.editResult);
        var addItems = FM.Util.differenceBy(features, newEditResult.nodes, 'properties.id'); // 新增的点
        var remainItems = FM.Util.differenceBy(newEditResult.nodes, features, 'properties.id');// 原有的点
        newEditResult.nodes = remainItems.concat(addItems);

        newEditResult.links = this.getLinks(remainItems, addItems, newEditResult.links);
        this.createOperation('修改道路点', newEditResult);
    },

    replaceNodes: function (features) {
        var newEditResult = FM.Util.clone(this.editResult);
        newEditResult.nodes = features;
        newEditResult.links = this.getLinks([], features, []);
        
        this.createOperation('修改道路点', newEditResult);
    },

    /**
     * 根据nodes获取links，原则是如果一条线的两个端点都被选中则获取此link
     * @param remainItems {Array} 保留的nodes
     * @param addItems {Array} 新增的nodes
     * @returns {Array}
     */
    getLinks: function (remainItems, addItems, originLinks) {
        var links = [];
        var originLinkPids = [];
        var addLinkPids = [];
        var bridgeLinkPids = [];
        var i = 0;
        // 获取原始保留的node之间的线
        if (remainItems && remainItems.length > 0) {
            for (i = 0; i < remainItems.length; i++) {
                originLinkPids = originLinkPids.concat(remainItems[i].properties.links);
            }
            var originLinkPidsTemp = FM.Util.getRepeat(originLinkPids);
            for (i = 0; i < originLinkPidsTemp.length; i++) {
                for (var j = 0; j < originLinks.length; j++) {
                    if (originLinkPidsTemp[i] === originLinks[j].properties.id) {
                        links.push(originLinks[j]);
                    }
                }
            }
        }
        // 获取新增加node之间的线
        if (addItems && addItems.length > 0) {
            for (i = 0; i < addItems.length; i++) {
                addLinkPids = addLinkPids.concat(addItems[i].properties.links);
            }
            var addLinkPidsTemp = FM.Util.getRepeat(addLinkPids);
            for (i = 0; i < addLinkPidsTemp.length; i++) {
                links.push(this.featureSelector.selectByFeatureId(addLinkPidsTemp[i], 'RDLINK'));
            }
        }

        // 获取新增加的node和原始node之间的线
        bridgeLinkPids = FM.Util.intersection(originLinkPids, addLinkPids);
        for (i = 0; i < bridgeLinkPids.length; i++) {
            links.push(this.featureSelector.selectByFeatureId(bridgeLinkPids[i], 'RDLINK'));
        }
        links = FM.Util.uniqueBy(links, 'properties.id');
        // links = this.filterCrfiLinks(links);

        return links;
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
