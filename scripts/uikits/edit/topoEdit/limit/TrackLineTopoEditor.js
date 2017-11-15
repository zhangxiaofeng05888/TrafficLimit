/**
 * Created by zhaohang on 2017/11/15.
 */

fastmap.uikit.topoEdit.TrackLineTopoEditor = fastmap.uikit.topoEdit.TopoEditor.extend({
    initialize: function (map) {
        fastmap.uikit.topoEdit.TopoEditor.prototype.initialize.call(this, map);

        // 绑定函数作用域
        FM.Util.bind(this);
        this.eventController = fastmap.uikit.EventController();
    },

    /**
     * 创建工具需要使用的EditResult
     * @param options
     * @returns {null}
     */

    getTrackResult: function (options) {
        var editResult = new fastmap.uikit.complexEdit.TrackResult();
        editResult.geoLiveType = 'TRACKLINE';
        editResult.linkPids = options;
        return editResult;
    },

    track: function (editResult) {
        var params = {
            dbId: App.Temp.dbId,
            type: 'RDLINK',
            condition: {
                inLinkPid: editResult.inLink.properties.id,
                inNodePid: editResult.inNode.properties.id,
                outLinkPid: editResult.outLink.properties.id,
                outNodePid: editResult.outNode.properties.id
            }
        };
        if (editResult.linkPids && editResult.linkPids.length > 0) {
            params.condition.filterLinks = editResult.linkPids;
        }
        return this.dataServiceFcc.trackLine(params);
    }
});

