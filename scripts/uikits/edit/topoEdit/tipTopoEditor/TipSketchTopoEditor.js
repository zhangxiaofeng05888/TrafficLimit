/**
 * Created by zhaohang on 2017/5/31.
 */

fastmap.uikit.topoEdit.TipSketchTopoEditor = fastmap.uikit.topoEdit.TipTopoEditor.extend({
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
    getCreateEditResult: function () {
        var editResult = new fastmap.uikit.shapeEdit.TipSketchResult();
        editResult.geoLiveType = 'TIPSKETCH';
        return editResult;
    },

    /**
     * 修改工具需要使用的EditResult
     * @param options
     * @returns {null}
     */
    getModifyEditResult: function (options) {
        var obj = options.originObject;
        var editResult = new fastmap.uikit.shapeEdit.TipSketchResult();
        editResult.originObject = obj;
        editResult.geoLiveType = 'TIPSKETCH';
        editResult.startNode = obj.geometry.g_location;
        var coordinates = [];
        for (var i = 0; i < obj.feedback.f_array.length; i++) {
            if (obj.feedback.f_array[i].type === 6) {
                for (var j = 0; j < obj.feedback.f_array[i].content.length; j++) {
                    coordinates.push(obj.feedback.f_array[i].content[j].geo.coordinates);
                }
            }
        }
        editResult.finalGeometry = {
            coordinates: coordinates,
            type: 'MultiLineString'
        };
        return editResult;
    },

    /**
     * 创建接口
     * 子类需要重写此方法
     * @param editResult 编辑结果
     */
    create: function (editResult) {
        var sketchData = fastmap.dataApi.tipSketch({});
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        if (month < 10) {
            month = '0' + month.toString();
        } else {
            month = month.toString();
        }
        var day = date.getDate();
        var hour = date.getHours();
        var minute = date.getMinutes();
        var seconds = date.getSeconds();
        var time = year.toString() + month + day.toString() + hour.toString() + minute.toString() + seconds.toString();
        sketchData.geometry.g_location = this.geometryAlgorithm.precisionGeometry(editResult.startNode, 5);
        sketchData.geometry.g_guide = this.geometryAlgorithm.precisionGeometry(editResult.startNode, 5);
        var content = [];
        for (var i = 0; i < editResult.finalGeometry.coordinates.length; i++) {
            content.push({
                geo: {
                    type: 'LineString',
                    coordinates: editResult.finalGeometry.coordinates[i]
                },
                style: '105000000'
            });
            content[i].geo = this.geometryAlgorithm.precisionGeometry(content[i].geo, 5);
        }
        sketchData.feedback.f_array.push(
            {
                user: App.Temp.userId,
                userRole: '',
                type: 6,
                content: content,
                auditRemark: '',
                date: time
            }
        );
        return this.dataServiceTips.saveTips(sketchData, 0);
    },

    /**
     * 更新接口
     * 子类需要重写此方法
     * @param editResult 编辑结果
     */
    update: function (editResult) {
        var sketchData = editResult.originObject;
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        if (month < 10) {
            month = '0' + month.toString();
        } else {
            month = month.toString();
        }
        var day = date.getDate();
        var hour = date.getHours();
        var minute = date.getMinutes();
        var seconds = date.getSeconds();
        var time = year.toString() + month + day.toString() + hour.toString() + minute.toString() + seconds.toString();
        sketchData.geometry.g_location = this.geometryAlgorithm.precisionGeometry(editResult.startNode, 5);
        sketchData.geometry.g_guide = this.geometryAlgorithm.precisionGeometry(editResult.startNode, 5);
        var content = [];
        for (var i = 0; i < editResult.finalGeometry.coordinates.length; i++) {
            content.push({
                geo: {
                    type: 'LineString',
                    coordinates: editResult.finalGeometry.coordinates[i]
                },
                style: '105000000'
            });
            content[i].geo = this.geometryAlgorithm.precisionGeometry(content[i].geo, 5);
        }
        for (var j = 0; j < sketchData.feedback.f_array.length; j++) {
            if (sketchData.feedback.f_array[j].type === 6) {
                sketchData.feedback.f_array.splice(j, 1);
                break;
            }
        }
        sketchData.feedback.f_array.push(
            {
                user: App.Temp.userId,
                userRole: '',
                type: 6,
                content: content,
                auditRemark: '',
                date: time
            }
        );
        return this.dataServiceTips.saveTips(sketchData, 1);
    }
});

