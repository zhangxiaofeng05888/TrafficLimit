/**
 * Created by 王明东 on 2017/8/23.
 */

fastmap.uikit.check.rule.linkWarning_move_canpass_link = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'linkWarning_move_canpass_link';
        this.description = '不能移动到没有与原link连通的道路上';
    },

    check: function (editResult) {
        var uikitUtil = fastmap.uikit.Util.getInstance();
        if (!editResult.link) {
            return [];
        }
        if (editResult.link) {
            if (!editResult.originLink) {
                return [];
            }
            if (editResult.link.properties.id == editResult.originLink.properties.id) {
                return [];
            }
            if (uikitUtil.canPass(editResult.link, editResult.originLink)) {
                return [];
            }
        }
        var result = new fastmap.uikit.check.CheckResult();
        result.message = this.description;
        result.geoLiveType = editResult.geoLiveType;
        result.situation = 'runtime';
        return [result];
    }
});
