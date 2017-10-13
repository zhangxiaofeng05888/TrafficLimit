/**
 * Created by xujie3949 on 2016/12/8.
 */

fastmap.uikit.Editor = L.Class.extend({
    initialize: function (options) {
        FM.setOptions(this, options);

        this.isEditing = false;
        this.onFinish = null;
    },

    start: function () {
        if (this.isEditing) {
            return;
        }

        this.isEditing = true;
    },

    stop: function () {
        if (!this.isEditing) {
            return;
        }

        this.isEditing = false;
    },

    abort: function () {
        this.isEditing = false;
    }
});
