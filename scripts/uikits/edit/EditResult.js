/**
 * Created by xujie3949 on 2016/12/8.
 */

fastmap.uikit.EditResult = L.Class.extend({
    initialize: function (type) {
        // 绑定函数作用域
        FM.Util.bind(this);

        this.type = type;
        this.originObject = null;
        this.geoLiveType = 'unknown';

        this.checkController = fastmap.uikit.check.CheckController.getInstance();
    },

    clone: function () {
        throw new Error('未实现clone方法');
    },

    cloneProperties: function (editResult) {
        if (!editResult) {
            return;
        }

        editResult.type = this.type;
        editResult.originObject = this.originObject;
        editResult.geoLiveType = this.geoLiveType;
    },

    check: function (situation) {
        var errMsg = '';
        var engine = this.checkController.getCheckEngine(this.geoLiveType, situation);
        if (engine && !engine.check(this)) {
            var length = engine.lastErrors.length;
            for (var i = 0; i < length; ++i) {
                var err = engine.lastErrors[i];
                errMsg += err.message;
                if (i !== length - 1) {
                    errMsg += '\n';
                }
            }
        }

        return errMsg;
    }
});
