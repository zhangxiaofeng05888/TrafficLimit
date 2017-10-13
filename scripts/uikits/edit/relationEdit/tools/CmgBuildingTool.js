/**
 * Created by mali on 2017/5/9.
 */
fastmap.uikit.relationEdit.CmgBuildingTool = fastmap.uikit.relationEdit.RectSelectTool.extend({
    initialize: function () {
        fastmap.uikit.relationEdit.RectSelectTool.prototype.initialize.call(this);
        this.eventController = fastmap.uikit.EventController();

        // 绑定函数作用域
        FM.Util.bind(this);

        this.name = 'CmgBuildingTool';
    },

    startup: function () {
        fastmap.uikit.relationEdit.RectSelectTool.prototype.startup.apply(this, arguments);

        this.eventController.on(L.Mixin.EventTypes.CTRLPANELSELECTED, this.updateSelectedFeatures);

        this.selectTypes = ['CMGBUILDFACE'];
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
        if (!this.editResult.faces) {
            return;
        }
        // 高亮选中faces
        this.drawFaces();
        // 绘制包络线
        var geometry = this.combineNodes();
        this.drawBuffer(geometry);
        this.refreshFeedback();
    },

    // 获取包络线的点几何
    combineNodes: function () {
        var geometry = {
            type: 'MultiPoint',
            coordinates: []
        };

        var length = this.editResult.faces.length;
        for (var i = 0; i < length; ++i) {
            var face = this.editResult.faces[i];
            if (face.checked) {
                for (var j = 0; j < face.geometry.coordinates[0].length; j++) {
                    geometry.coordinates.push(face.geometry.coordinates[0][j]);
                }
            }
        }
        return geometry;
    },

    drawFaces: function () {
        var length = this.editResult.faces.length;
        if (!length) {
            return;
        }
        var faceSymbol = this.symbolFactory.getSymbol('pt_face');
        for (var i = 0; i < length; ++i) {
            if (this.editResult.faces[i].checked) {
                this.defaultFeedback.add(this.editResult.faces[i].geometry, faceSymbol);
            }
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

    onLeftButtonUp: function (event) {
        if (!fastmap.uikit.relationEdit.RectSelectTool.prototype.onLeftButtonUp.apply(this, arguments)) {
            return false;
        }

        if (event.originalEvent.ctrlKey) {
            this.modifyfaces();
        } else {
            this.selectedFaces();
        }

        return true;
    },

    modifyfaces: function () {
        var newEditResult = FM.Util.clone(this.editResult);
        var addItems = FM.Util.differenceBy(this.selectedFeatures, newEditResult.faces, 'properties.id');
        var remainItems = FM.Util.differenceBy(newEditResult.faces, this.selectedFeatures, 'properties.id');
        newEditResult.faces = remainItems.concat(addItems);
        newEditResult.faces.forEach(function (data) {
            data.checked = true;
        });
        this.createOperation('修改市街图feature的组成面', newEditResult);
    },

    
    selectedFaces: function () {
        var newEditResult = FM.Util.clone(this.editResult);
        newEditResult.faces = this.selectedFeatures;
        newEditResult.faces.forEach(function (data) {
            data.checked = true;
            data.isActive = false;
        });
        this.createOperation('框选市街图feature的组成面', newEditResult);
    }
});
