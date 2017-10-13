/**
 * Created by zhaohang on 2017/3/22.
 */
fastmap.uikit.check.rule.rdSpeedBump_link_kind_check = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'GLM34001';
        this.description = '高速、城市高速、8级、9级、10级路、高速、城市高速、人渡、轮渡上不能创建减速带!';
    },

    check: function (editResult) {
        if (!editResult.inLink) {
            return [];
        }
        if ([1, 2, 8, 9, 10, 11, 13].indexOf(editResult.inLink.properties.kind) > -1) {
            var result = new fastmap.uikit.check.CheckResult();
            result.message = this.description;
            result.geoLiveType = editResult.geoLiveType;
            result.situation = 'runtime';
            return [result];
        }
        return [];
    }
});
