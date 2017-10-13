/**
 * Created by wuzhen on 2017/4/14.
 */

fastmap.uikit.editControl.BatchSelectControl = fastmap.uikit.editControl.SelectControl.extend({
    initialize: function (map, geoLiveType, options) {
        fastmap.uikit.editControl.EditControl.prototype.initialize.apply(this, map);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.selectMode = options.selectMode ? options.selectMode : 'batch';
        this.geoLiveType = geoLiveType;
        this.options = options;

        this.selectedFeatures = [];
    },

    run: function () {
        // 注意:选择流程不需要切换场景
        this.setCurrentControl(this);

        var toolName = this.getToolName(this.selectMode);
        var success = this.toolController.resetCurrentTool(toolName, this.onSelectFinish, this.geoLiveType);

        if (!success) {
            swal('提示', '未能激活选择工具:' + toolName, 'info');
            return false;
        }

        this.status = 'Running';

        return true;
    },

    getToolName: function (selectMode) {
        switch (selectMode) {
            case 'batch':
                return 'RectSelectTool'; // 批量框选
            case 'track':
                return 'TrackSelectTool'; // 追踪选
            default:
                return 'RectSelectTool';
        }
    },

    regroup: function (features) {
        var featureArr = [];
        for (var i = 0, len = features.length; i < len; i++) {
            var canvasFeature = {
                id: features[i].properties.id,
                geoLiveType: features[i].properties.geoLiveType,
                type: features[i].type
            };
            featureArr.push(canvasFeature);
        }
        return featureArr;
    },

    filterTips: function (features) {
        var tipsArr = [];
        features.forEach(function (item, index) {
            if (item.type === 'tips') {
                tipsArr.push(item);
            }
        });
        return tipsArr;
    },

    onSelectFinish: function (features, event, options) {
        if (features) {
            if (this.geoLiveType) {
                if (this.geoLiveType === 'TIPS') { // 这里会返回框选范围内所有的数据包括要素和tips，需要进行过滤
                    features = this.filterTips(features);
                }
                if (this.selectMode === 'batch') {
                    features = this.regroup(features);
                }
                this.eventController.fire(L.Mixin.EventTypes.BATCHOBJECTSELECTED, { features: features, event: event, options: options });
            } else {
                this.eventController.fire(L.Mixin.EventTypes.OBJECTSELECTED, { features: features, event: event });
            }
        }

        // 支持连续选择
        if (this.selectMode === 'batch') { // 追踪选不能继续启动流程
            // this.run();
        }
    }
});
