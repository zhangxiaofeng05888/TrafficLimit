/**
 * Created by zhaohang on 2017/3/21.
 */
fastmap.uikit.check.rule.mileagePile_link_kind_check = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'mileagePile_link_kind_check';
        this.description = '里程桩关联link不能是1,2,3,4级以外的道路';
    },

    check: function (editResult) {
        if (!editResult.link) {
            return [];
        }
        if (editResult.link.properties.kind !== 1 &&
            editResult.link.properties.kind !== 2 &&
            editResult.link.properties.kind !== 3 &&
            editResult.link.properties.kind !== 4) {
            var result = new fastmap.uikit.check.CheckResult();
            result.message = this.description;
            result.geoLiveType = editResult.geoLiveType;
            result.situation = 'runtime';
            return [result];
        }
        return [];
    }
});
