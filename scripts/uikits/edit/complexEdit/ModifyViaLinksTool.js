/**
 * Created by xujie3949 on 2016/12/8.
 */

fastmap.uikit.relationEdit.CreateRestrictionTool = fastmap.uikit.relationEdit.RelationTool.extend({
    initialize: function () {
        this.base = fastmap.uikit.relationEdit.RelationTool.prototype;
        this.base.initialize.apply(this, arguments);

        this.eventController = fastmap.uikit.EventController();

        this.name = 'CreateRestrictionTool';
        this.snapActor = null;
        this.isOpen = false;

        this.editResult = null;
    },

    onActive: function (onFinish) {
        if (!this.base.onActive.apply(this, arguments)) {
            return false;
        }

        this.startup();
        return true;
    },

    onDeactive: function () {
        if (!this.base.onDeactive.apply(this, arguments)) {
            return false;
        }

        this.shutdown();
        return true;
    },

    startup: function () {
        this.editResult = FM.Util.clone(this.relationEditor.editResult);

        this.resetFeedback();
        if (!this.editResult.inLink || !this.editResult.node) {
            this.partsOpenPanel();
        }
        this.resetSnapActor();
    },

    shutdown: function () {
        this.partsClosePanel();
        this.snapActor = null;
        this.editResult = null;
    },

    partsOpenPanel: function () {
        if (this.isOpen) {
            return;
        }

        var options = this.getPartsPanelOptions();
        this.eventController.fire(L.Mixin.EventTypes.PARTSOPENPANEL, options);
        this.eventController.on(L.Mixin.EventTypes.PARTSSELECTEDCHANGED, this.onPartsSelectedChanged);
        this.eventController.on(L.Mixin.EventTypes.PARTSADD, this.onPartsAdd);
        this.eventController.on(L.Mixin.EventTypes.PARTSDEL, this.onPartsDel);
        this.isOpen = true;
    },

    getPartsPanelOptions: function () {
        var panelName = 'normalRestriction';
        var items = this.editResult.parts.map(function (part, index) {
            return {
                key: part.key,
                type: part.type
            };
        });
        if (this.editResult.isTruckRestriction) {
            panelName = 'truckRestriction';
            items = this.editResult.parts.map(function (part, index) {
                return part.key;
            });
        }

        var options = {
            panelName: panelName,
            items: items,
            index: this.editResult.currentPart
        };

        return options;
    },

    partsClosePanel: function () {
        if (!this.isOpen) {
            return;
        }

        this.eventController.fire(L.Mixin.EventTypes.PARTSCLOSEPANEL, this.editResult.panel);
        this.eventController.off(L.Mixin.EventTypes.PARTSSELECTEDCHANGED, this.onPartsSelectedChanged);
        this.eventController.off(L.Mixin.EventTypes.PARTSADD, this.onPartsAdd);
        this.eventController.off(L.Mixin.EventTypes.PARTSDEL, this.onPartsDel);
        this.isOpen = false;
    },

    onPartsSelectedChanged: function (event) {
        var index = event.index;
        this.editResult.currentPart = index;
        this.resetFeedback();
        this.resetSnapActor();
    },

    onPartsAdd: function (event) {
        var key = event.key;
        var part = {
            key: key,
            vias: [],
            outLint: 0
        };
        if (this.editResult.isTruckRestriction) {
            part.type = event.type;
        }
        this.editResult.parts.push(part);
        this.resetFeedback();
    },

    onPartsDel: function (event) {
        var index = event.index;
        this.editResult.parts.splice(index, 1);
        this.resetFeedback();
    },

    resetSnapActor: function () {
        this.snapActor = new fastmap.mapApi.snap.FeatureSnapActor();
        if (!this.editResult.inLink) {
            this.resetFeatureSnapActor('rdLink');
            return;
        }

        if (!this.editResult.node) {
            this.resetFeatureSnapActor('rdNode');
            return;
        }

        if (this.editResult.currentPart !== -1) {
            this.resetFeatureSnapActor('rdLink');
        }
    },

    resetFeatureSnapActor: function (layerId) {
        this.base.uninstallSnapActor.apply(this, this.snapActor);

        if (!layerId) {
            return;
        }

        this.snapActor = new fastmap.mapApi.snap.FeatureSnapActor();
        this.snapActor.layerId = layerId;

        this.base.installSnapActor.apply(this, this.snapActor);
    },

    resetFeedback: function () {
        this.defaultFeedback.clear();

        if (this.editResult.inLink) {
            var inLinkSymbol = this.symbolFactory.getSymbol('relationEdit_ls_inLink');
            var inLink = this.featureSelector.selectByFeatureId(this.editResult.inLink, 'RDLINK');
            this.defaultFeedback.add(inLink.geometry, inLinkSymbol);
        }

        if (this.editResult.node) {
            var nodeSymbol = this.symbolFactory.getSymbol('relationEdit_pt_node');
            var node = this.featureSelector.selectByFeatureId(this.editResult.node, 'RDLINK');
            this.defaultFeedback.add(node.geometry, nodeSymbol);
        }

        if (this.editResult.parts) {
            var length = this.editResult.parts.length;
            for (var i = 0; i < length; ++i) {
                var part = this.editResult.parts[i];
                if (i === this.editResult.currentPart) {
                    this.resetSelectedPart(part);
                } else {
                    this.resetPart(part);
                }
            }
        }

        this.feedbackController.refresh();
    },

    resetPart: function (part) {
        if (part.vias) {
            this.resetVias(part.vias, 'relationEdit_ls_viaLink');
        }

        var outLinkSymbol = this.symbolFactory.getSymbol('relationEdit_ls_outLink');
        var outLink = this.featureSelector.selectByFeatureId(this.editResult.outLink, 'RDLINK');
        this.defaultFeedback.add(outLink.geometry, outLinkSymbol);
    },

    resetSelectedPart: function (part) {
        if (part.vias) {
            this.resetVias(part.vias, 'relationEdit_ls_viaLink_selected');
        }

        var outLinkSymbol = this.symbolFactory.getSymbol('relationEdit_ls_outLink_selected');
        var outLink = this.featureSelector.selectByFeatureId(this.editResult.outLink, 'RDLINK');
        this.defaultFeedback.add(outLink.geometry, outLinkSymbol);
    },

    resetVias: function (viaLinks, symbolName) {
        if (viaLinks.length === 0) {
            return;
        }

        var viaLinkSymbol = this.symbolFactory.getSymbol(symbolName);

        for (var i = 0; i < viaLinks.length; ++i) {
            var viaLinkId = viaLinks[i];
            var viaLink = this.featureSelector.selectByFeatureId(viaLinkId, 'RDLINK');
            this.defaultFeedback.add(viaLink.geometry, viaLinkSymbol);
        }
    },

    createOperation: function (name, editResult) {
        var operation = new fastmap.uikit.operation.EditResultOperation(name, editResult);
        if (!operation.canDo()) {
            var err = operation.getError();
            console.log(err);
            return;
        }
        this.operationController.add(operation);
        this.resetFeedback();
    },

    onKeyPress: function (event) {
        if (!this.base.onKeyPress.apply(this, arguments)) {
            return false;
        }

        var key = event.key;
        switch (key) {
            case 'Escape':
                this.startup();
                break;
            case ' ':
                if (this.onFinish) {
                    this.onFinish(this.editResult);
                    this.shutdown();
                }
                break;
            case 'z':
                break;
            case 'x':
                break;
            default:
                break;
        }

        return true;
    },

    onMouseMove: function (event) {
        if (!this.base.onMouseMove.apply(this, arguments)) {
            return false;
        }

        var mousePoint = event.latlng;
        if (this.snapController.isSnapping()) {
            this.snapController.snap(mousePoint);
            this.snapController.draw();
            this.feedbackController.refresh();
        }

        return true;
    },

    onMouseClick: function (event) {
        if (!this.base.onMouseMove.apply(this, arguments)) {
            return false;
        }

        var mousePoint = event.latlng;
        if (!this.snapController.snap(mousePoint)) {
            return true;
        }

        var res = this.snapController.getSnapResult();
        var snapedId = res.feature.properties.id;

        if (!this.editResult.inLink) {
            this.editResult.inLink = snapedId;
            this.resetSnapActor();
        } else if (!this.editResult.node) {
            this.editResult.node = snapedId;
            this.resetSnapActor();
            this.partsOpenPanel();
        } else {
            var currentPart = this.editResult.currentPart;
            if (currentPart !== -1) {
                this.editResult.parts[currentPart].outLink = snapedId;
                // var options = {
                //     url: '',
                //     onSuccess: this.onGetPart
                // };
                // fastmap.mapApi.ajax(options);
            }
        }

        this.resetFeedback();

        return true;
    }

    // onGetPart: function (json) {
    //     // 高亮经过线和退出线
    // }
});
