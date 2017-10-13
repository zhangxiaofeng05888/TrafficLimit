/**
 * Created by zhaohang on 2017/6/6.
 */

fastmap.uikit.topoEdit.TipGPSDotTopoEditor = fastmap.uikit.topoEdit.TipTopoEditor.extend({
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
    getCreateEditResult: function (options) {
        var editResult = new fastmap.uikit.relationEdit.PointLinkResult();
        editResult.snapActors = [{
            geoLiveType: 'TIPLINKS',
            priority: 1,
            enable: true,
            exceptions: []
        }, {
            geoLiveType: 'RDLINK',
            priority: 0,
            enable: true,
            exceptions: []
        }];
        editResult.geoLiveType = 'TIPGPSDOT';
        return editResult;
    },

    /**
     * 修改工具需要使用的EditResult
     * @param options
     * @returns {null}
     */
    getModifyEditResult: function (options) {
        var obj = options.originObject;
        var editResult = new fastmap.uikit.relationEdit.PointLinkResult();
        editResult.snapActors = [{
            geoLiveType: 'TIPLINKS',
            priority: 1,
            enable: true,
            exceptions: []
        }, {
            geoLiveType: 'RDLINK',
            priority: 0,
            enable: true,
            exceptions: []
        }];
        editResult.point = obj.geometry.g_location;
        editResult.geoLiveType = 'TIPGPSDOT';
        if (obj.deep.f.type === 1) {
            editResult.link = this.featureSelector.selectByFeatureId(parseInt(obj.deep.f.id, 10), 'RDLINK');
        } else if (obj.deep.f.type === 2) {
            editResult.link = this.featureSelector.selectByFeatureId(obj.deep.f.id, 'TIPLINKS');
        }
        editResult.originObject = obj;
        return editResult;
    },

    /**
     * 创建接口
     * 子类需要重写此方法
     * @param editResult 编辑结果
     */
    create: function (editResult) {
        var gpsDotData = fastmap.dataApi.tipGPSDot({});
        gpsDotData.geometry.g_location = this.geometryAlgorithm.precisionGeometry(editResult.point, 5);
        gpsDotData.geometry.g_guide = this.geometryAlgorithm.precisionGeometry(editResult.point, 5);
        gpsDotData.deep.f.id = editResult.link.properties.id.toString();
        gpsDotData.deep.f.type = editResult.link.type === 'tips' ? 2 : 1;
        return this.dataServiceTips.saveTips(gpsDotData, 0);
    },

    /**
     * 更新接口
     * 子类需要重写此方法
     * @param editResult 编辑结果
     */
    update: function (editResult) {
        var gpsDotData = editResult.originObject;
        gpsDotData.geometry.g_location = this.geometryAlgorithm.precisionGeometry(editResult.point, 5);
        gpsDotData.geometry.g_guide = this.geometryAlgorithm.precisionGeometry(editResult.point, 5);
        gpsDotData.deep.f.id = editResult.link.properties.id.toString();
        gpsDotData.deep.f.type = editResult.link.type === 'tips' ? 2 : 1;
        return this.dataServiceTips.saveTips(gpsDotData, 1);
    }
});

