/**
 * Created by linglong on 2017/3/15.
 */
fastmap.uikit.topoEdit.RDSideRoadTopoEditor = L.Class.extend({
    initialize: function (map) {
        // 绑定函数作用域
        FM.Util.bind(this);
        this.dataService = fastmap.service.DataServiceEdit.getInstance();
    },

    /**
     * 创建工具需要使用的EditResult
     * @param options
     * @returns {null}
     */
    getCreateEditResult: function (options) {
        var editResult = new fastmap.uikit.complexEdit.SideRoadResult();
        editResult.geoLiveType = 'RDSIDEROAD';
        return editResult;
    },

    /**
     * 创建接口
     * @param editResult 编辑结果
     */
    create: function (editResult) {
        var linksPids = [];
        editResult.links.forEach(function (data) {
            linksPids.push(data.properties.id);
        });
        var data = {
            distance: editResult.distance,
            sideType: editResult.sideType,
            sNodePid: editResult.sNodePid,
            data: { linkPids: linksPids }
        };
        return this.dataService.createSideRoad('RDLINK', data);
    }
});
