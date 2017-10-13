/**
 * Created by chenx on 2017/4/09.
 */

fastmap.uikit.relationEdit.GradeSeperateCrossResult = fastmap.uikit.EditResult.extend({
    initialize: function () {
        fastmap.uikit.EditResult.prototype.initialize.call(this, 'GradeSeperateCrossResult');

        this.crossPoints = []; // 备选立交点
        this.point = null; // 选中立交点
        this.parts = []; // 立交关系组成要素
        this.selectBox = null; // 框选几何
        this.featureTypes = ['RDLINK', 'RWLINK', 'LCLINK', 'CMGBUILDLINK']; // 可建立立交关系的要素类型
        this.operation = 'BoxSelect'; // 操作类型：BoxSelect、SelectCross、SortLink
    }
});
