/**
 * Created by xujie3949 on 2016/12/8.
 */

fastmap.uikit.operation.OperationController = L.Class.extend({
    initialize: function () {
        this.step = 100;
        this.undoStack = [];
        this.redoStack = [];
    },

    add: function (operation) {
        if (this.undoStack.length >= this.step) {
            this.undoStack.shift();
        }
        operation.do();
        this.redoStack = [];
        this.undoStack.push(operation);
    },

    undo: function () {
        if (!this.canUndo()) {
            return;
        }

        var operation = this.undoStack.pop();
        operation.undo();

        this.redoStack.push(operation);
    },

    redo: function () {
        if (!this.canRedo()) {
            return;
        }

        var operation = this.redoStack.pop();
        operation.do();

        this.undoStack.push(operation);
    },

    canUndo: function () {
        return this.undoStack.length !== 0;
    },

    canRedo: function () {
        return this.redoStack.length !== 0;
    },

    clear: function () {
        this.undoStack = [];
        this.redoStack = [];
    },

    destroy: function () {
        fastmap.uikit.operation.OperationController.instance = null;
    },

    statics: {
        instance: null,

        getInstance: function () {
            if (!fastmap.uikit.operation.OperationController.instance) {
                fastmap.uikit.operation.OperationController.instance =
                    new fastmap.uikit.operation.OperationController();
            }
            return fastmap.uikit.operation.OperationController.instance;
        }
    }
});
