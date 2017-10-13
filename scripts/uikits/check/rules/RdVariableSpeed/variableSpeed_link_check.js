/**
 * Created by zhaohang on 2017/3/27.
 */
fastmap.uikit.check.rule.rdVariableSpeed_link_check = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'rdVariableSpeed_link_check';
        this.description = '8、9、10级路、人渡、轮渡、环岛、特殊交通类型、交叉口内道路的LINK不可作为可变限速的进入link、退出link';
    },

    check: function (editResult) {
        var result = new fastmap.uikit.check.CheckResult();
        result.message = this.description;
        result.geoLiveType = editResult.geoLiveType;
        result.situation = 'runtime';
        if (!editResult.inLink) {
            return [];
        }
        if (['8', '9', '10', '11', '13'].indexOf(editResult.inLink.properties.kind) > -1 ||
            ['33', '50'].indexOf(editResult.inLink.properties.form) > -1 ||
            editResult.inLink.properties.special == '1') {
            return [result];
        }
        if (!editResult.outLink) {
            return [];
        }
        if (['8', '9', '10', '11', '13'].indexOf(editResult.outLink.properties.kind) > -1 ||
            ['33', '50'].indexOf(editResult.outLink.properties.form) > -1 ||
            editResult.outLink.properties.special == '1') {
            return [result];
        }

        return [];
    }
});
