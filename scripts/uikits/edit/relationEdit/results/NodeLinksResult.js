/**
 * Created by wuzhen on 2017/3/16.
 */
fastmap.uikit.relationEdit.NodeLinksResult = fastmap.uikit.EditResult.extend({
    initialize: function () {
        fastmap.uikit.EditResult.prototype.initialize.call(this, 'NodeLinksResult');


        this.inNode = null;   // 进入点
        this.outLink = null;  // 退出线
        this.joinLinks = [];  // 已选接续线
        this.canSelectOutLinks = []; // 可选的退出线
        this.linkLength = 0;  // 退出线加上接续线的长度
    }
});
