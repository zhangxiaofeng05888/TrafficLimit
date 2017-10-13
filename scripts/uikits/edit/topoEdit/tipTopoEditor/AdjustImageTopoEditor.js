/**
 * Created by zhongxiaoming on 2017/8/24.
 */
/**
 * Created by zhongxiaoming on 2017/7/28.
 */

fastmap.uikit.topoEdit.AdjustImageTopoEditor = fastmap.uikit.topoEdit.TipTopoEditor.extend({
    initialize: function (map) {
        fastmap.uikit.topoEdit.TipTopoEditor.prototype.initialize.call(this, map);

        // 绑定函数作用域
        FM.Util.bind(this);
    },

    /**
     * 创建工具需要使用的EditResult
     * @param options
     * @returns {null}
     */
    getAdjustImageResult: function (options) {
        var editResult = new fastmap.uikit.complexEdit.AdjustImageResult();
        editResult.startPoint = options.startPoint;
        editResult.endPoint = options.endPoint;
        editResult.geoLiveType = 'ADJUSTIMAGE';
        return editResult;
    },
    /**
     * 创建接口
     * 子类需要重写此方法
     * @param editResult 编辑结果
     */
    create: function (editResult) {
        var data = {
            distance: editResult.distance,
            pid: editResult.pid
        };
        return this.dataServiceTips.tipLinkUpDownDepart('RDLINK', data);
    },

    adjustImage: function (editResult) {
        return this.dataServiceTips.adjustImage('http://192.168.0.44:7090/naviserver/correction?W=1&BBOX='
          + editResult.bBox + '&X=' + (editResult.startPoint[0] - editResult.endPoint[0]) + '&Y=' + (editResult.startPoint[1] - editResult.endPoint[1]));
    }

});

