/**
 * Created by zhaohang on 2017/5/17.
 */

fastmap.uikit.topoEdit.TipMultiDigitizedTopoEditor = fastmap.uikit.topoEdit.TipTopoEditor.extend({
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
        var editResult = new fastmap.uikit.relationEdit.TipMultiDigitizedResult();
        editResult.geoLiveType = 'TIPMULTIDIGITIZED';
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
        var editResult = new fastmap.uikit.relationEdit.TipMultiDigitizedResult();
        editResult.originObject = obj;
        editResult.geoLiveType = 'TIPMULTIDIGITIZED';
        var startLinkId = 0;
        var startLinkType = '';
        var finishLinkId = 0;
        var finishLinkType = '';
        for (var i = 0; i < obj.deep.f_array.length; i++) {
            if (obj.deep.f_array[i].flag.indexOf('1') > -1) {
                startLinkId = obj.deep.f_array[i].id;
                startLinkType = obj.deep.f_array[i].type === 2 ? 'TIPLINKS' : 'RDLINK';
            }
            if (obj.deep.f_array[i].flag.indexOf('2') > -1) {
                finishLinkId = obj.deep.f_array[i].id;
                finishLinkType = obj.deep.f_array[i].type === 2 ? 'TIPLINKS' : 'RDLINK';
            }
        }
        editResult.startPointData = {
            linkData: this.featureSelector.selectByFeatureId(startLinkId, startLinkType),
            pointData: obj.deep.gSLoc
        };
        editResult.finishPointData = {
            linkData: this.featureSelector.selectByFeatureId(finishLinkId, finishLinkType),
            pointData: obj.deep.gELoc
        };
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
     * @param editResult 编辑结果
     */
    create: function (editResult) {
        var multiDigitizedData = fastmap.dataApi.tipMultiDigitized({});
        multiDigitizedData.deep.gSLoc = this.geometryAlgorithm.precisionGeometry(editResult.startPointData.pointData, 5);
        multiDigitizedData.deep.gELoc = this.geometryAlgorithm.precisionGeometry(editResult.finishPointData.pointData, 5);
        var array = [];
        if (editResult.startPointData.linkData.properties.id === editResult.finishPointData.linkData.properties.id) {
            array.push({
                id: editResult.startPointData.linkData.properties.id.toString(),
                type: editResult.startPointData.linkData.type === 'tips' ? 2 : 1,
                flag: '1|2'
            });
        } else {
            array.push({
                id: editResult.startPointData.linkData.properties.id.toString(),
                type: editResult.startPointData.linkData.type === 'tips' ? 2 : 1,
                flag: '1'
            });
            array.push({
                id: editResult.finishPointData.linkData.properties.id.toString(),
                type: editResult.finishPointData.linkData.type === 'tips' ? 2 : 1,
                flag: '2'
            });
        }
        multiDigitizedData.deep.f_array = array;
        multiDigitizedData.geometry.g_location = this.geometryAlgorithm.precisionGeometry(editResult.startPointData.pointData, 5);
        multiDigitizedData.geometry.g_guide = this.geometryAlgorithm.precisionGeometry(editResult.startPointData.pointData, 5);
        return this.dataServiceTips.saveTips(multiDigitizedData, 0);
    },

    /**
     * 更新接口
     * @param editResult 编辑结果
     */
    update: function (editResult) {
        var multiDigitizedData = editResult.originObject;
        multiDigitizedData.deep.gSLoc = this.geometryAlgorithm.precisionGeometry(editResult.startPointData.pointData, 5);
        multiDigitizedData.deep.gELoc = this.geometryAlgorithm.precisionGeometry(editResult.finishPointData.pointData, 5);
        var array = [];
        if (editResult.startPointData.linkData.properties.id === editResult.finishPointData.linkData.properties.id) {
            array.push({
                id: editResult.startPointData.linkData.properties.id.toString(),
                type: editResult.startPointData.linkData.type === 'tips' ? 2 : 1,
                flag: '1|2'
            });
        } else {
            array.push({
                id: editResult.startPointData.linkData.properties.id.toString(),
                type: editResult.startPointData.linkData.type === 'tips' ? 2 : 1,
                flag: '1'
            });
            array.push({
                id: editResult.finishPointData.linkData.properties.id.toString(),
                type: editResult.finishPointData.linkData.type === 'tips' ? 2 : 1,
                flag: '2'
            });
        }
        multiDigitizedData.deep.f_array = array;
        multiDigitizedData.geometry.g_location = this.geometryAlgorithm.precisionGeometry(editResult.startPointData.pointData, 5);
        multiDigitizedData.geometry.g_guide = this.geometryAlgorithm.precisionGeometry(editResult.startPointData.pointData, 5);
        return this.dataServiceTips.saveTips(multiDigitizedData, 1);
    }
});
