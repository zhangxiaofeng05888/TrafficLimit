/**
 * Created by zhaohang on 2017/10/16.
 */

fastmap.uikit.complexEdit.CopyTool = fastmap.uikit.complexEdit.RectSelectTool.extend({
    initialize: function () {
        fastmap.uikit.complexEdit.RectSelectTool.prototype.initialize.call(this);
        // 绑定函数作用域
        FM.Util.bind(this);

        this.name = 'CopyTool';
    },

    startup: function () {
        this.resetStatus();

        fastmap.uikit.complexEdit.RectSelectTool.prototype.startup.apply(this, arguments);

        this.selectFeedback = new fastmap.mapApi.Feedback();
        this.installFeedback(this.selectFeedback);
        this.selectTypes = this.editResult.types;
        this.selectedFeatures = [];

        this.refresh();
    },

    refresh: function () {
        this.resetSelectFeedback();
        this.resetEditResultFeedback();
        this.resetMouseInfo();
    },

    resetMouseInfo: function () {
        if (this.editResult.links.length === 0) {
            this.setMouseInfo('请在地图上框选link');
        } else {
            this.setMouseInfo('按ctrl键继续框选，或者按空格保存');
        }
    },

    resetEditResultFeedback: function () {
        if (!this.defaultFeedback) {
            return;
        }

        this.defaultFeedback.clear();

        if (this.editResult && this.editResult.links) {
            var length = this.editResult.links.length;
            if (length > 0) {
                for (var i = 0; i < length; ++i) {
                    var feature = this.editResult.links[i];
                    var linkSymbol = this.symbolFactory.getSymbol('ls_link');
                    if (feature.type === 'tips') {
                        this.defaultFeedback.add(feature.geometry.geometries[1], linkSymbol);
                    } else {
                        this.defaultFeedback.add(feature.geometry, linkSymbol);
                    }
                }
            }
        }

        this.refreshFeedback();
    },

    onLeftButtonUp: function (event) {
        if (!fastmap.uikit.complexEdit.RectSelectTool.prototype.onLeftButtonUp.apply(this, arguments)) {
            return false;
        }

        if (event.originalEvent.ctrlKey) {
            this.modifyLinks();
        } else {
            this.replaceLinks();
        }

        return true;
    },

    modifyLinks: function () {
        var newEditResult = FM.Util.clone(this.editResult);
        var addItems = FM.Util.differenceBy(this.selectedFeatures, newEditResult.links, 'properties.id');
        var remainItems = FM.Util.differenceBy(newEditResult.links, this.selectedFeatures, 'properties.id');
        var linkFilter = remainItems.concat(addItems);
        if (newEditResult.geoLiveType == 'DRAWPOLYGON') {
            linkFilter = remainItems.concat(addItems).filter(item=>item.properties.groupId == App.Temp.groupId);
        }
        newEditResult.links = linkFilter;
        this.createOperation('框选增加link', newEditResult);
    },

    replaceLinks: function () {
        var newEditResult = FM.Util.clone(this.editResult);
        var linkFilter = this.selectedFeatures;
        if (newEditResult.geoLiveType == 'DRAWPOLYGON') {
            linkFilter = this.selectedFeatures.filter(item=>item.properties.groupId == App.Temp.groupId);
        }
        newEditResult.links = linkFilter;
        this.createOperation('框选link', newEditResult);
    },

    onRedo: function (oldEditResult, newEditResult) {
        this.editResult = newEditResult;
        this.refresh();
    },

    onUndo: function (oldEditResult, newEditResult) {
        this.editResult = oldEditResult;
        this.refresh();
    },
    onKeyUp: function (event) {
        var key = event.key;
        switch (key) {
            case 'c':
                alert('检查');
                break;
            default:
                break;
        }

        fastmap.uikit.complexEdit.RectSelectTool.prototype.onKeyUp.call(this, event);
    }
});
