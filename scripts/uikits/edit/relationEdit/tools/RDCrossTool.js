/**
 * Created by xujie3949 on 2016/12/8.
 */

fastmap.uikit.relationEdit.RDCrossTool = fastmap.uikit.relationEdit.RectSelectTool.extend({
    initialize: function () {
        fastmap.uikit.relationEdit.RectSelectTool.prototype.initialize.call(this);
        this.eventController = fastmap.uikit.EventController();

        // 绑定函数作用域
        FM.Util.bind(this);

        this.name = 'RDCrossTool';
    },

    startup: function () {
        fastmap.uikit.relationEdit.RectSelectTool.prototype.startup.apply(this, arguments);

        this.eventController.on(L.Mixin.EventTypes.CTRLPANELSELECTED, this.updateSelectedFeatures);

        this.selectTypes = ['RDNODE'];
    },

    shutdown: function () {
        fastmap.uikit.relationEdit.RectSelectTool.prototype.shutdown.apply(this, arguments);

        this.eventController.off(L.Mixin.EventTypes.CTRLPANELSELECTED, this.updateSelectedFeatures);

        this.resetStatus();
    },

    onRedo: function (oldEditResult, newEditResult) {
        this.editResult = newEditResult;
        this.refresh();
    },

    onUndo: function (oldEditResult, newEditResult) {
        this.editResult = oldEditResult;
        this.refresh();
    },

    resetEditResultFeedback: function () {
        if (!this.defaultFeedback) {
            return;
        }

        this.defaultFeedback.clear();

        if (!this.editResult.nodes || !this.editResult.links) {
            return;
        }

        var geometry = this.combineNodes();

        this.drawNodes();

        this.drawLinks();

        this.drawBuffer(geometry);

        this.closedNodesGroupPanel(geometry);

        this.refreshFeedback();
    },

    combineNodes: function (nodes) {
        var geometry = {
            type: 'MultiPoint',
            coordinates: []
        };

        var length = this.editResult.nodes.length;
        for (var i = 0; i < length; ++i) {
            var node = this.editResult.nodes[i];
            if (node.checked) {
                geometry.coordinates.push(node.geometry.coordinates);
            }
        }
        return geometry;
    },

    drawNodes: function () {
        var length = this.editResult.nodes.length;
        if (length === 0) {
            return;
        }

        var nodeSymbol = this.symbolFactory.getSymbol('relationEdit_pt_node');
        var lineSymbol = this.symbolFactory.getSymbol('ls_link');
        for (var i = 0; i < length; ++i) {
            if (this.editResult.nodes[i].checked) {
                var point = this.coordinatesToPoint(this.editResult.nodes[i].geometry.coordinates);
                this.defaultFeedback.add(point, nodeSymbol);
                if (this.editResult.nodes[i].isActive) {
                    // 获得该点挂接的link，并高亮显示;
                    var nodePid = this.editResult.nodes[i].properties.id;
                    var nodeFeature = this.featureSelector.selectByFeatureId(nodePid, 'RDNODE');
                    for (var j = 0; j < nodeFeature.properties.links.length; j++) {
                        var lineFeature = this.featureSelector.selectByFeatureId(nodeFeature.properties.links[j], 'RDLINK');
                        this.defaultFeedback.add(lineFeature.geometry, lineSymbol);
                    }
                }
            }
        }
    },

    drawLinks: function () {
        var length = this.editResult.links.length;
        if (length === 0) {
            return;
        }

        var linkSymbol = this.symbolFactory.getSymbol('relationEdit_ls_edge');
        for (var i = 0; i < length; ++i) {
            var link = this.editResult.links[i];
            this.defaultFeedback.add(link.geometry, linkSymbol);
        }
    },

    drawBuffer: function (geometry) {
        if (geometry.coordinates.length === 0) {
            return;
        }

        this.geojsonTransform.setEnviroment(this.map, null, this.convertToPixel);
        var pixelGeometry = this.geojsonTransform.convertGeometry(geometry);
        var convexHull = this.geometryAlgorithm.convexHull(pixelGeometry);
        var buffer = this.geometryAlgorithm.buffer(convexHull, 20);
        this.geojsonTransform.setEnviroment(this.map, null, this.convertToGeography);
        var geographyGeometry = this.geojsonTransform.convertGeometry(buffer);
        // 绘制包络线
        var bufferSymbol = this.symbolFactory.getSymbol('relationEdit_py_buffer');
        this.defaultFeedback.add(geographyGeometry, bufferSymbol);
    },

    closedNodesGroupPanel: function () {
        if (this.editResult.nodes.length < 2) {
            this.eventController.fire(L.Mixin.EventTypes.PARTSCLOSEPANEL, { panelName: 'RdCrossPanel' });
            return;
        }

        var bigArr = [];

        for (var i = 0; i < this.editResult.nodes.length - 1; i++) {
            var tempArr = [];
            var flag = false;
            for (var key in bigArr) {
                if (bigArr[key].indexOf(this.editResult.nodes[i]) != -1) {
                    flag = true;
                }
            }
            if (flag) continue;
            for (var j = i + 1; j < this.editResult.nodes.length; j++) {
                if (this.uikitUtil.isSamePoint(this.editResult.nodes[i].geometry, this.editResult.nodes[j].geometry)) {
                    tempArr.push(this.editResult.nodes[j]);
                }
            }
            if (tempArr.length) {
                tempArr.push(this.editResult.nodes[i]);
                bigArr.push(tempArr);
            }
        }

        if (bigArr.length) {
            this.eventController.fire(L.Mixin.EventTypes.PARTSOPENPANEL, { panelName: 'RdCrossPanel', data: bigArr });
        } else {
            this.eventController.fire(L.Mixin.EventTypes.PARTSCLOSEPANEL, { panelName: 'RdCrossPanel' });
        }
    },

    onLeftButtonUp: function (event) {
        if (!fastmap.uikit.relationEdit.RectSelectTool.prototype.onLeftButtonUp.apply(this, arguments)) {
            return false;
        }

        if (event.originalEvent.ctrlKey) {
            this.modifyNodes();
        } else {
            this.replaceNodes();
        }

        return true;
    },

    modifyNodes: function () {
        var newEditResult = FM.Util.clone(this.editResult);
        var addItems = FM.Util.differenceBy(this.selectedFeatures, newEditResult.nodes, 'properties.id');
        var remainItems = FM.Util.differenceBy(newEditResult.nodes, this.selectedFeatures, 'properties.id');
        newEditResult.nodes = remainItems.concat(addItems);
        newEditResult.nodes.forEach(function (data) {
            data.checked = true;
            data.isActive = false;
        });
        newEditResult.links = this.getRDCrossLinks(newEditResult.nodes);
        this.createOperation('修改道路点', newEditResult);
    },

    replaceNodes: function () {
        var newEditResult = FM.Util.clone(this.editResult);
        newEditResult.nodes = this.selectedFeatures;
        newEditResult.nodes.forEach(function (data) {
            data.checked = true;
            data.isActive = false;
        });
        newEditResult.links = this.getRDCrossLinks(newEditResult.nodes);
        this.createOperation('框选道路点', newEditResult);
    },

    updateSelectedFeatures: function (data) {
        var newEditResult = FM.Util.clone(this.editResult);
        for (var i = 0; i < newEditResult.nodes.length; i++) {
            if (newEditResult.nodes[i].properties.id === data.data.properties.id) {
                newEditResult.nodes[i] = data.data;
                newEditResult.nodes[i].isActive = true;
            }
        }
        newEditResult.links = this.getRDCrossLinks(newEditResult.nodes);
        this.createOperation('选取同位点', newEditResult);
    },

    getRDCrossLinks: function (nodes) {
        nodes = nodes.filter(function (data) {
            return data.checked;
        });
        var linkIds = this.getNodeTopoLinkIds(nodes);

        var rdCrossLinks = [];
        for (var i = 0; i < linkIds.length; ++i) {
            var linkId = linkIds[i];
            var link = this.featureSelector.selectByFeatureId(linkId, 'RDLINK');
            var sNodePid = parseInt(link.properties.snode, 10);
            var eNodePid = parseInt(link.properties.enode, 10);
            if (this.isRDCrossNode(nodes, sNodePid) && this.isRDCrossNode(nodes, eNodePid)) {
                rdCrossLinks.push(link);
            }
        }
        return rdCrossLinks;
    },

    getNodeTopoLinkIds: function (nodes) {
        var links = [];
        for (var i = 0; i < nodes.length; ++i) {
            var node = nodes[i];
            var topoLinks = node.properties.links;
            links = links.concat(topoLinks);
        }

        links = FM.Util.unique(links);
        return links;
    },

    isRDCrossNode: function (nodes, nodePid) {
        var links = [];
        for (var i = 0; i < nodes.length; ++i) {
            var node = nodes[i];
            if (node.properties.id === nodePid) {
                return true;
            }
        }

        return false;
    }
});
