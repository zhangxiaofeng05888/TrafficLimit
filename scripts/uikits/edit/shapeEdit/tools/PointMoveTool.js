/**
 * Created by xujie3949 on 2016/12/8.
 * link平滑修行工具
 */

fastmap.uikit.shapeEdit.PointMoveTool = fastmap.uikit.shapeEdit.ShapeTool.extend({
    initialize: function () {
        fastmap.uikit.shapeEdit.ShapeTool.prototype.initialize.call(this);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.name = 'PointMoveTool';
        this.isDragging = null;
        this.topoLinks = null;
        this.dashTopoLinks = null;
        this.dashLineFeedback = null;
    },

    startup: function () {
        this.resetStatus();

        fastmap.uikit.shapeEdit.ShapeTool.prototype.startup.apply(this, arguments);

        this.dashLineFeedback = new fastmap.mapApi.Feedback();
        this.dashLineFeedback.priority = 0;
        this.defaultFeedback.priority = 1;
        this.installFeedback(this.dashLineFeedback);
        this.isDragging = false;
        this.topoLinks = this.getTopoLinks();
        this.dashTopoLinks = this.getTopoLinks();

        this.refresh();
    },

    shutdown: function () {
        fastmap.uikit.shapeEdit.ShapeTool.prototype.shutdown.apply(this, arguments);

        this.resetStatus();
    },

    resetStatus: function () {
        fastmap.uikit.shapeEdit.ShapeTool.prototype.resetStatus.apply(this, arguments);

        this.isDragging = null;
        this.topoLinks = null;
    },

    refresh: function () {
        this.updateTopoLinks();
        this.updateDashTopoLinks();
        this.resetDashLineFeedback();
        this.resetFeedback();
    },

    resetFeedback: function () {
        if (!this.defaultFeedback) {
            return;
        }

        this.defaultFeedback.clear();

        this.drawTopoLinks();

        this.drawFinalGeometry();

        this.refreshFeedback();
    },

    resetDashLineFeedback: function () {
        if (!this.dashLineFeedback) {
            return;
        }

        this.dashLineFeedback.clear();

        this.refreshFeedback();

        if (!this.isDragging) {
            return;
        }

        this.drawDashTopoLinks();

        this.drawMousePoint();

        this.refreshFeedback();
    },

    drawTopoLinks: function () {
        if (!this.topoLinks) {
            return;
        }

        for (var i = 0; i < this.topoLinks.length; ++i) {
            var ls = this.topoLinks[i];
            var lineSymbol = this.symbolFactory.getSymbol('shapeEdit_ls_edge');
            this.defaultFeedback.add(ls.geometry, lineSymbol);
        }
    },

    drawDashTopoLinks: function () {
        if (!this.dashTopoLinks) {
            return;
        }

        for (var i = 0; i < this.dashTopoLinks.length; ++i) {
            var ls = this.dashTopoLinks[i];
            var lineSymbol = this.symbolFactory.getSymbol('shapeEdit_ls_dash');
            this.dashLineFeedback.add(ls.geometry, lineSymbol);
        }
    },

    drawFinalGeometry: function () {
        var point = this.shapeEditor.editResult.finalGeometry;
        if (!point) {
            return;
        }

        var symbol = this.symbolFactory.getSymbol('shapeEdit_pt_selected_vertex');

        this.defaultFeedback.add(point, symbol);
    },

    drawMousePoint: function () {
        if (!this.mousePoint) {
            return;
        }

        var symbol = this.symbolFactory.getSymbol('shapeEdit_pt_selected_vertex');

        this.dashLineFeedback.add(this.mousePoint, symbol);
    },

    getTopoLinks: function () {
        var node = this.shapeEditor.editResult.originObject;
        var linkType = this.shapeEditor.editResult.linkType;
        var topoLinks = [];
        var links = node.links;
        for (var i = 0; i < links.length; ++i) {
            var linkPid = links[i];

            // add by chenx on 2017-9-7
            // 解决跨大区图廓点移动时，选择不上node挂接的非当前大区link的问题
            // 在此工具中临时去掉选择器的当前大区要素的过滤器
            // 另外一个可考虑的方案是直接去掉shapeTool中startup时增加的filter，应该是没什么影响的
            var filterOpt = this.featureSelector.options.filter;
            if (filterOpt) {
                this.featureSelector.removeOption('filter');
            }
            var link = this.featureSelector.selectByFeatureId(linkPid, linkType);
            if (filterOpt) {
                this.featureSelector.setOptions({
                    filter: filterOpt
                });
            }

            var geometry = link.geometry;
            var eNodePid = link.properties.enode;
            var sNodePid = link.properties.snode;
            if (sNodePid === eNodePid) {
                topoLinks.push({
                    twoWay: true,
                    geometry: geometry
                });
            } else {
                if (eNodePid == node.pid) {
                    geometry.coordinates.reverse();
                }

                topoLinks.push({
                    twoWay: false,
                    geometry: geometry
                });
            }
        }

        return topoLinks;
    },

    updateTopoLinks: function (geometryParam) {
        if (!this.topoLinks) {
            return;
        }

        var point = geometryParam ? geometryParam : this.shapeEditor.editResult.finalGeometry;

        for (var i = 0; i < this.topoLinks.length; ++i) {
            var ls = this.topoLinks[i];
            if (ls.twoWay) {
                ls.geometry.coordinates[ls.geometry.coordinates.length - 1] = point.coordinates;
            }
            ls.geometry.coordinates[0] = point.coordinates;
        }
    },

    updateDashTopoLinks: function () {
        if (!this.dashTopoLinks || !this.mousePoint) {
            return;
        }

        var point = this.mousePoint;

        for (var i = 0; i < this.dashTopoLinks.length; ++i) {
            var ls = this.dashTopoLinks[i];
            ls.geometry.coordinates[0] = point.coordinates;
            if (ls.twoWay) {
                ls.geometry.coordinates[ls.geometry.coordinates.length - 1] = point.coordinates;
            }
            ls.geometry.coordinates[0] = point.coordinates;
        }
    },

    onLeftButtonDown: function (event) {
        if (!fastmap.uikit.shapeEdit.ShapeTool.prototype.onLeftButtonDown.apply(this, arguments)) {
            return false;
        }

        this.isDragging = true;

        this.updateDashTopoLinks();

        this.resetDashLineFeedback();

        return true;
    },

    onMouseMove: function (event) {
        if (!fastmap.uikit.shapeEdit.ShapeTool.prototype.onMouseMove.apply(this, arguments)) {
            return false;
        }

        if (!this.isDragging) {
            return false;
        }

        this.updateDashTopoLinks();

        this.resetDashLineFeedback();

        return true;
    },

    onLeftButtonUp: function (event) {
        if (!fastmap.uikit.shapeEdit.ShapeTool.prototype.onLeftButtonUp.apply(this, arguments)) {
            return false;
        }

        if (!this.isDragging) {
            return false;
        }

        this.isDragging = false;

        this.updateNode();

        return true;
    },

    updateNode: function () {
        var newEditResult = FM.Util.clone(this.shapeEditor.editResult);
        newEditResult.finalGeometry = this.mousePoint;
        this.updateTopoLinks(newEditResult.finalGeometry);
        newEditResult.topoLinks = this.topoLinks;
        this.shapeEditor.createOperation('移动点位', newEditResult);
    },

    onKeyUp: function (event) {
        var key = event.key;
        switch (key) {
            case 'Escape':
                this.isDragging = false;
                this.topoLinks = this.getTopoLinks();
                var newEditResult = FM.Util.clone(this.shapeEditor.originEditResult);
                this.shapeEditor.createOperation('恢复初始状态', newEditResult);
                break;
            case ' ':
                this.isDragging = false;
                if (this.onFinish) {
                    this.onFinish(null);
                }
                break;
            case 'z':
                if (event.ctrlKey) {
                    this.isDragging = false;
                    this.operationController.undo();
                }
                break;
            case 'x':
                if (event.ctrlKey) {
                    this.isDragging = false;
                    this.operationController.redo();
                }
                break;
            default:
                break;
        }

        return true;
    }
});

