/**
 * Created by 王明东 on 2017/3/21.
 * 选择point、linkPid、direct
 */

fastmap.uikit.check.rule.point_direct_link_no_empty = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'point_direct_link_no_empty';
        this.description = '创建要素所需条件不全，无法创建';
    },

    check: function (editResult) {
        // 配对电子眼不需要此校验
        if (editResult.type == 'AddPairElectronicEyeResult') {
            return [];
        }
        if (editResult.point && editResult.direct && editResult.link) {
            return [];
        }
        var result = new fastmap.uikit.check.CheckResult();
        result.message = this.description;
        result.geoLiveType = editResult.geoLiveType;
        result.situation = 'precheck';
        return [result];
    }
});
