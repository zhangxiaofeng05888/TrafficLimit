/**
 * Created by xujie3949 on 2016/12/8.
 * link平滑修行工具
 */

fastmap.uikit.shapeEdit.PointAddTool = fastmap.uikit.shapeEdit.ShapeTool.extend({
    initialize: function () {
        fastmap.uikit.shapeEdit.ShapeTool.prototype.initialize.call(this);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.name = 'PointAddTool';
        this.snapActor = null;
        this.selectGeoLiveTypes = [];
        // 首次打的点
        this.firstPoint = null;
    },

    startup: function () {
        this.resetStatus();

        fastmap.uikit.shapeEdit.ShapeTool.prototype.startup.apply(this, arguments);

        this.refresh();
        this.selectGeoLiveTypes = this.getSelectedGeoLiveTypes();
    },

    shutdown: function () {
        fastmap.uikit.shapeEdit.ShapeTool.prototype.shutdown.apply(this, arguments);

        this.resetStatus();
    },

    resetStatus: function () {
        fastmap.uikit.shapeEdit.ShapeTool.prototype.resetStatus.apply(this, arguments);

        this.snapActor = null;
        this.selectGeoLiveTypes = [];
    },

    getSelectedGeoLiveTypes: function () {
        var geoLiveTypes = [];
        if (!this.options) {
            geoLiveTypes = this.getSceneGeoLiveTypes();
        } else {
            geoLiveTypes = [this.options];
        }

        return geoLiveTypes;
    },

    refresh: function () {
        this.resetFeedback();
        this.resetSnapActor();
    },

    resetSnapActor: function () {
        this.uninstallSnapActor(this.snapActor);

        var linkType = this.shapeEditor.editResult.linkType;

        this.snapActor = this.createFeatureSnapActor(linkType, null);

        this.installSnapActor(this.snapActor);
    },

    resetFeedback: function () {
        if (!this.defaultFeedback) {
            return;
        }

        this.defaultFeedback.clear();
        // 高亮捕捉线
        // if (!this.shapeEditor.editResult.linkGeometry) {
        this.drawSnapLinks();
        // }


        // 高亮选中线
        this.drawFinalLink();

        // 高亮点
        this.drawFinalGeometry();

        this.refreshFeedback();
    },

    drawFinalGeometry: function () {
        var point = this.shapeEditor.editResult.finalGeometry;
        if (!point) {
            return;
        }

        var symbol = this.symbolFactory.getSymbol('shapeEdit_pt_selected_vertex');

        this.defaultFeedback.add(point, symbol);
    },

    drawFinalLink: function () {
        var linkSymbol = this.symbolFactory.getSymbol('ls_rdLink_out');
        this.defaultFeedback.add(this.shapeEditor.editResult.linkGeometry, linkSymbol);
    },

    drawSnapLinks: function () {
        var linkSymbol;
        for (var i = 0; i < this.shapeEditor.editResult.snapLinks.length; ++i) {
            linkSymbol = this.symbolFactory.getSymbol('ls_rdLink_in');
            this.defaultFeedback.add(this.shapeEditor.editResult.snapLinks[i].geometry, linkSymbol);
        }
    },

    onMouseMove: function (event) {
        if (!fastmap.uikit.shapeEdit.PathTool.prototype.onMouseMove.apply(this, arguments)) {
            return false;
        }

        this.snapController.snap(this.mousePoint);

        return true;
    },
    getBox: function (point, tolerance) {
        var x = point.coordinates[0];
        var y = point.coordinates[1];
        var pixelPoint = this.map.project([y, x]);
        var left = pixelPoint.x - tolerance;
        var right = pixelPoint.x + tolerance;
        var top = pixelPoint.y - tolerance;
        var bottom = pixelPoint.y + tolerance;

        var geojson = {
            type: 'Polygon',
            coordinates: []
        };

        var coordinates = [];
        var leftTop = this.map.unproject([left, top]);
        var rightTop = this.map.unproject([right, top]);
        var rightBottom = this.map.unproject([right, bottom]);
        var leftBottom = this.map.unproject([left, bottom]);

        coordinates.push([leftTop.lng, leftTop.lat]);
        coordinates.push([rightTop.lng, rightTop.lat]);
        coordinates.push([rightBottom.lng, rightBottom.lat]);
        coordinates.push([leftBottom.lng, leftBottom.lat]);
        coordinates.push([leftTop.lng, leftTop.lat]);

        geojson.coordinates = [coordinates];

        return geojson;
    },
    onLeftButtonClick: function (event) {
        if (!fastmap.uikit.shapeEdit.ShapeTool.prototype.onLeftButtonClick.apply(this, arguments)) {
            return false;
        }
        if (this.shapeEditor.editResult.flag) {
            var res = this.snapController.snap(this.mousePoint);
            if (!res) {
                this.setCenterError('Node必须捕捉到Link上', 2000);
            } else {
                this.firstPoint = res.point;
                var box = this.getBox(this.firstPoint, 4);
                var features = this.featureSelector.selectByGeometry(box, [this.shapeEditor.editResult.linkType]);
                var newEditResult = FM.Util.clone(this.shapeEditor.editResult);
                newEditResult.snapLinks = features;
                if (features.length > 1) {
                    newEditResult.flag = 0;
                    this.setMouseInfo('此处有多根link，请选择要作业的link!');
                    var snapFeatures = features.map(function (link) {
                        return {
                            id: link.properties.id,
                            geoLiveType: link.properties.geoLiveType
                        };
                    });
                    this.uninstallSnapActor(this.snapActor);
                    this.snapActor = this.createGivenFeatureSnapActor(snapFeatures);
                    this.installSnapActor(this.snapActor);
                    newEditResult.finalGeometry = res.point;
                    this.shapeEditor.createOperation('选择要作业的link！', newEditResult);
                } else {
                    this.createNode(res.feature, res.point);
                }
            }
        } else {
            var mousePoint = this.latlngToPoint(event.latlng);
            var rest = this.snapController.snap(mousePoint);
            var point = this.geometryAlgorithm.nearestPoints(this.firstPoint, rest.feature.geometry).point2;
            this.setMouseInfo('link已选择，请点保存进行创建!');
            this.createNode(rest.feature, point);
        }

        return true;
    },
    // createNode: function (res) {
    //     var newEditResult = FM.Util.clone(this.shapeEditor.editResult);
    //     newEditResult.finalGeometry = res.point;
    //     newEditResult.linkPid = res.feature.properties.id;
    //     this.shapeEditor.createOperation('创建点位', newEditResult);
    // },
    createNode: function (feature, point) {
        var newEditResult = FM.Util.clone(this.shapeEditor.editResult);
        newEditResult.finalGeometry = point;
        newEditResult.linkGeometry = feature.geometry;
        newEditResult.linkPid = feature.properties.id;
        this.shapeEditor.createOperation('创建点位', newEditResult);
    }
});

