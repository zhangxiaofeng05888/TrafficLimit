/**
 * Created by xujie3949 on 2016/12/8.
 * 编辑结果操作
 */

fastmap.uikit.operation.EditResultOperation = fastmap.uikit.operation.Operation.extend({
    initialize: function (description, redoCallback, undoCallback, oldEditResult, newEditResult) {
        fastmap.uikit.operation.Operation.prototype.initialize.call(this, description, redoCallback, undoCallback);

        this.relationEditor = fastmap.uikit.relationEdit.RelationEditor.getInstance();
        this.checkController = fastmap.uikit.check.CheckController.getInstance();

        this.oldEditResult = oldEditResult;
        this.newEditResult = newEditResult;
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
    }
});
