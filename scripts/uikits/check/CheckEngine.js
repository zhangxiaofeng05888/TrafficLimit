/**
 * Created by xujie3949 on 2016/12/8.
 */

fastmap.uikit.check.CheckEngine = L.Class.extend({
    initialize: function (geoLiveType, situation) {
        // 绑定函数作用域
        FM.Util.bind(this);

        this.geoLiveType = geoLiveType;
        this.situation = situation;
        this.checkRules = [];
        this.lastErrors = [];
    },

    /**
     * 检查editResult是否符合所有规则
     * 通过所有检查返回true,否则返回false
     * @param editResult 待检查的编辑结果
     * @returns {boolean}
     */
    check: function (editResult) {
        this.lastErrors = [];

        for (var i = 0; i < this.checkRules.length; ++i) {
            var rule = this.checkRules[i];
            this.checkRule(rule, editResult, this.geoLiveType);
        }

        return this.lastErrors.length === 0;
    },

    checkRule: function (rule, editResult, geoLiveType) {
        try {
            var result = rule.check(editResult, geoLiveType);
            if (result) {
                this.lastErrors = this.lastErrors.concat(result);
            }
        } catch (err) {
            result = new fastmap.uikit.check.CheckResult();
            result.situation = this.situation;
            result.geoLiveType = this.geoLiveType;
            result.message = err.message;
            this.lastErrors.push(result);
        }
    },

    addRule: function (checkRule) {
        this.checkRules.push(checkRule);
    }
});
