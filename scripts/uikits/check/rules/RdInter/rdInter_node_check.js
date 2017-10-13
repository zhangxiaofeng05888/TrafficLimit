/**
 * Created by wuzhen on 2017/8/30.
 */

fastmap.uikit.check.rule.rdInter_node_check = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'rdInter_node_check';
        this.description = '图廓点不能参与制作CRFI';
    },

    check: function (editResult) {
        var check = [];
        if ((editResult.nodes && editResult.nodes.length > 0)) {
            for (var i = 0; i < editResult.nodes.length; i++) {
                if (editResult.nodes[i].properties.forms != 1) {
                    check = [this.getCheckResult(this.description, editResult.geoLiveType, 'runtime')];
                    break;
                }
            }
        }
        return check;
    }
});
