/**
 * Created by wuzhen on 2017/7/3.
 */
fastmap.uikit.complexEdit.LinksAutoBreakResult = fastmap.uikit.EditResult.extend({
    initialize: function () {
        fastmap.uikit.EditResult.prototype.initialize.call(this, 'LinksAutoBreakResult');

        this.crossPoints = []; // 备选交叉点
        this.point = null; // 选中交叉
        this.parts = []; // 选中关系组成要素
        this.selectBox = null; // 框选几何
        this.nodePid = 0; // 选中的node点
        this.operation = 'BoxSelect'; // 操作类型：BoxSelect、SelectCross、Save
    }
});
