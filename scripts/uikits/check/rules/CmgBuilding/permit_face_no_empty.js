/**
 * Created by wuzhen on 2018/8/14.
 */
fastmap.uikit.check.rule.permit_face_no_empty = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'permit_face_no_empty';
        this.description = '创建要素所需条件不全，无法创建';
    },

    check: function (editResult) {
        if (editResult.faces.length < 1) {
            return [this.getCheckResult(this.description, editResult.geoLiveType, 'precheck')];
        }
        return [];
    }
});
