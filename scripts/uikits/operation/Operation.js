/**
 * Created by xujie3949 on 2016/12/8.
 * 操作基类,所有操作从此类派生
 */

fastmap.uikit.operation.Operation = L.Class.extend({
    initialize: function (description, redoCallback, undoCallback) {
        this.description = description;
        this.redoCallback = redoCallback;
        this.undoCallback = undoCallback;
        this.lastErrors = [];
    },

    /**
     * 子类需要重写此方法
     */
    do: function () {
        throw new Error('未重写do方法');
    },

    /**
     * 子类需要重写此方法
     */
    undo: function () {
        throw new Error('未重写undo方法');
    }
});
