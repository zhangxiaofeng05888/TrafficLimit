/**
 * Created by xujie3949 on 2016/12/8.
 * 增加形状点操作
 */

fastmap.uikit.operation.PolygonEditOperation = fastmap.uikit.operation.Operation.extend({
    initialize: function (description, shapeEditor, index, point, snap) {
        fastmap.uikit.operation.Operation.prototype.initialize.call(
            this,
            description,
            shapeEditor.onRedo,
            shapeEditor.onUndo
        );

        this.index = index;
        this.point = point;
        this.snap = snap;
        this.oldEditResult = shapeEditor.editResult;
        this.newEditResult = null;

        this.checkController = fastmap.uikit.check.CheckController.getInstance();
        this.geometryAlgorithm = fastmap.mapApi.geometry.GeometryAlgorithm.getInstance();
    },

    canDo: function () {
        var engine = this.checkController.getCheckEngine(this.newEditResult.geoLiveType, 'runtime');
        if (engine && !engine.check(this.newEditResult)) {
            this.lastErrors = engine.lastErrors;
            return false;
        }

        return true;
    },

    getError: function () {
        var errMsg = '';
        var length = this.lastErrors.length;
        for (var i = 0; i < length; ++i) {
            var err = this.lastErrors[i];
            errMsg += err.message;
            if (i !== length - 1) {
                errMsg += '\n';
            }
        }
        return errMsg;
    },

    do: function () {
        this.redoCallback(this.oldEditResult, this.newEditResult);
    },

    undo: function () {
        this.undoCallback(this.oldEditResult, this.newEditResult);
    },

    getNewEditResult: function () {
        throw new Error('未重写getNewEditResult方法');
    },

    pointEqual: function (p1, p2) {
        var dis = this.geometryAlgorithm.distance(p1, p2);
        var precision = 1e-10;
        if (dis < precision) {
            return true;
        }
        return false;
    }
});
