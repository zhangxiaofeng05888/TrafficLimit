/**
 * Created by zhaohang on 2017/7/12.
 */
fastmap.uikit.editControl.DrawQualityCircleControl = fastmap.uikit.editControl.EditControl.extend({
    initialize: function (map, geoLiveType) {
        fastmap.uikit.editControl.EditControl.prototype.initialize.call(this, map);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.geoLiveType = geoLiveType;
        this.shapeEditor = fastmap.uikit.shapeEdit.ShapeEditor.getInstance();
        this.dataService = fastmap.service.DataServiceEdit.getInstance();
        this.drawCircle = fastmap.DrawCircle.getInstance();
        this.geometryAlgorithm = fastmap.mapApi.geometry.GeometryAlgorithm.getInstance();
    },

    run: function () {
        if (!fastmap.uikit.editControl.EditControl.prototype.run.apply(this, arguments)) {
            return false;
        }

        var editResult = new fastmap.uikit.shapeEdit.PolygonResult();
        editResult.geoLiveType = 'DRAWQUALITYCIRCLE';
        editResult.finalGeometry = {
            type: 'LineString',
            coordinates: []
        };
        this.shapeEditor.start(editResult, this.onToolFinish);

        return true;
    },

    abort: function () {
        this.shapeEditor.abort();
    },

    onToolFinish: function (editResult) {
        if (!this.precheck(editResult)) {
            return;
        }
        var self = this;
        swal({
            title: '请确认是否保存质检圈!',
            type: 'warning',
            animation: 'slide-from-top',
            showCancelButton: true,
            confirmButtonText: '是',
            cancelButtonText: '否',
            confirmButtonColor: '#ec6c62'
        }, function (f) {
            if (f) {
                var geometry = {
                    type: 'Polygon',
                    coordinates: [editResult.finalGeometry.coordinates]
                };
                var params = {
                    subtaskId: self.drawCircle.param.subtaskId,
                    geometry: self.geometryAlgorithm.geoJsonToWkt(geometry)
                };
                self.dataService.createQualitySubTask(params)
                    .then(self.onCreateSuccess)
                    .catch(self.onCreateFail);
            }
        });
    },

    onCreateSuccess: function (res) {
        this.shapeEditor.stop();
        this.eventController.fire(L.Mixin.EventTypes.DRAWTASKCIRCLE);
        this.run();
    },

    onCreateFail: function (err) {
        swal({
            title: err,
            type: 'error',
            allowEscapeKey: false
        });
    }
});
