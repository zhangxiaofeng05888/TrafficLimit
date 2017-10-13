/**
 * Created by wuzhen on 2017/4/13.
 */

fastmap.uikit.check.rule.rdObject_form_check = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'rdObject_form_check';
        this.description = 'rdLink、crfInter、crfRoad至少需要框选一个';
    },

    check: function (editResult) {
        if (editResult.links.length > 0 || editResult.inters.length > 0 || editResult.roads.length > 0) {
            return [];
        }
        return [this.getCheckResult(this.description, editResult.geoLiveType, 'precheck')];
    }
});
