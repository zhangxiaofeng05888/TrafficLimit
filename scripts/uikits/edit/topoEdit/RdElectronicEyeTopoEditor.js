/**
 * Created by wangmingdong on 2017/3/16.
 */
fastmap.uikit.topoEdit.RDElectronicEyeTopoEditor = fastmap.uikit.topoEdit.TopoEditor.extend({
    initialize: function (map) {
        fastmap.uikit.topoEdit.TopoEditor.prototype.initialize.call(this, map);

        // 绑定函数作用域
        FM.Util.bind(this);
    },

    /**
     * 创建工具需要使用的EditResult
     * @param options
     * @returns {null}
     */
    getCreateEditResult: function (options) {
        var editResult = new fastmap.uikit.relationEdit.LinkPointDirectResult();
        editResult.geoLiveType = 'RDELECTRONICEYE';
        return editResult;
    },

    /**
     * 修改工具需要使用的EditResult
     * @param options
     * @returns {null}
     */
    getModifyEditResult: function (options) {
        var obj = options.originObject;
        var editResult = new fastmap.uikit.relationEdit.LinkPointDirectResult();
        editResult.originObject = obj;
        editResult.geoLiveType = 'RDELECTRONICEYE';
        editResult.link = this.featureSelector.selectByFeatureId(obj.linkPid, 'RDLINK');
        editResult.direct = obj.direct;
        editResult.moveDistance = 100;
        return editResult;
    },

    /**
     * 配对电子眼需要使用的EditResult
     * @param options
     * @returns {null}
     */
    addPairEditResult: function (options) {
        var obj = options.originObject;
        var editResult = new fastmap.uikit.relationEdit.AddPairElectronicEyeResult();
        editResult.originObject = obj;
        editResult.geoLiveType = 'RDELECTRONICEYE';
        if (obj.pairs.length) {
            if (obj.pid == obj.pairs[0].parts[0].eleceyePid) {
                editResult.pairFeature = this.featureSelector.selectByFeatureId(obj.pairs[0].parts[1].eleceyePid, 'RDELECTRONICEYE');
            } else {
                editResult.pairFeature = this.featureSelector.selectByFeatureId(obj.pairs[0].parts[0].eleceyePid, 'RDELECTRONICEYE');
            }
        }
        return editResult;
    },

    /**
     * 创建接口
     * 子类需要重写此方法
     * @param editResult 编辑结果
     */
    create: function (editResult) {
        var data = {
            direct: parseInt(editResult.direct, 10),
            linkPid: editResult.link.properties.id,
            longitude: editResult.point.coordinates[0],
            latitude: editResult.point.coordinates[1]
        };
        return this.dataService.create('RDELECTRONICEYE', data);
    },

    /**
     * 更新接口
     * 子类需要重写此方法
     * @param editResult 编辑结果
     */
    update: function (editResult) {
        var data = {
            pid: editResult.originObject.pid,
            direct: parseInt(editResult.direct, 10),
            linkPid: editResult.link.properties.id,
            longitude: editResult.point.coordinates[0],
            latitude: editResult.point.coordinates[1]
        };
        return this.dataService.move('RDELECTRONICEYE', data);
    },

    /**
     * 电子眼配对接口
     * 子类需要重写此方法
     * @param editResult 编辑结果
     */
    addPair: function (editResult) {
        var data = {
            startPid: editResult.originObject.pid,
            endPid: editResult.pairFeature.pid
        };
        return this.dataService.addPair('RDELECTRONICEYE', data);
    }
});

