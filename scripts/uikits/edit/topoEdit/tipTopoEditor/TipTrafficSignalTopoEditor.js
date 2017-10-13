/**
 * Created by zhaohang on 2017/5/19.
 */

fastmap.uikit.topoEdit.TipTrafficSignalTopoEditor = fastmap.uikit.topoEdit.TipTopoEditor.extend({
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
        var editResult = new fastmap.uikit.shapeEdit.PointResult();
        editResult.geoLiveType = 'TIPTRAFFICSIGNAL';
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
        return editResult;
    },

    /**
     * 修改工具需要使用的EditResult
     * @param options
     * @returns {null}
     */
    getModifyEditResult: function (options) {
        var obj = options.originObject;
        var editResult = new fastmap.uikit.shapeEdit.PointResult();
        editResult.coordinate = obj.geometry.g_location;
        editResult.geoLiveType = 'TIPTRAFFICSIGNAL';
        editResult.originObject = obj;
        var links = [];
        for (var i = 0; i < obj.deep.f_array.length; i++) {
            links.push({
                linkData: this.featureSelector.selectByFeatureId(obj.deep.f_array[i].f.id, obj.deep.f_array[i].f.type === 1 ? 'RDLINK' : 'TIPLINKS'),
                pointData: obj.deep.f_array[i].f.geo
            });
        }
        editResult.links = links;
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
        return editResult;
    },

    /**
     * 创建接口
     * 子类需要重写此方法
     * @param editResult 编辑结果
     */
    create: function (editResult) {
        var signalData = fastmap.dataApi.tipTrafficSignal({});
        signalData.geometry.g_location = this.geometryAlgorithm.precisionGeometry(editResult.coordinate, 5);
        signalData.geometry.g_guide = this.geometryAlgorithm.precisionGeometry(editResult.coordinate, 5);
        var links = editResult.links;
        var array = [];
        if (links.length > 0) {
            signalData.deep.inCt = 0;
        } else {
            signalData.deep.inCt = 1;
        }
        for (var i = 0; i < links.length; i++) {
            array.push({
                f: {
                    id: links[i].linkData.properties.id.toString(),
                    type: links[i].linkData.type === 'tips' ? 2 : 1,
                    num: 101 + i,
                    geo: this.geometryAlgorithm.precisionGeometry(links[i].pointData, 5)
                },
                nId: 0,
                ctrl: 1
            });
        }
        signalData.deep.f_array = array;
        return this.dataServiceTips.saveTips(signalData, 0);
    },

    /**
     * 更新接口
     * 子类需要重写此方法
     * @param editResult 编辑结果
     */
    update: function (editResult) {
        var signalData = editResult.originObject;
        signalData.geometry.g_location = this.geometryAlgorithm.precisionGeometry(editResult.coordinate, 5);
        signalData.geometry.g_guide = this.geometryAlgorithm.precisionGeometry(editResult.coordinate, 5);
        var links = editResult.links;
        var array = [];
        if (links.length > 0) {
            signalData.deep.inCt = 0;
        } else {
            signalData.deep.inCt = 1;
        }
        for (var i = 0; i < links.length; i++) {
            array.push({
                f: {
                    id: links[i].linkData.properties.id.toString(),
                    type: links[i].linkData.type === 'tips' ? 2 : 1,
                    num: 101 + i,
                    geo: this.geometryAlgorithm.precisionGeometry(links[i].pointData, 5)
                },
                nId: 0,
                ctrl: 1
            });
        }
        signalData.deep.f_array = array;
        return this.dataServiceTips.saveTips(signalData, 1);
    }
});

