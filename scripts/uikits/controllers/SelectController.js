/**
 * Created by wangtun on 2015/9/10.
 * 保存选取的元素
 * @namespace fastmap.uikit
 * @class SelectController
 */

fastmap.uikit.SelectController = (function () {
    var instantiated;
    function init(options) {
        var Controller = L.Class.extend({

            /**
             * 相关属性
             */
            options: {
            },
            /**
             * 构造函数
             * @class SelectController
             * @constructor
             * @param {Object}options
             */
            initialize: function (option) {
                L.setOptions(this, option);
                this.selectedFeatures = null;
                this.snapObj = null;
                var eventController = fastmap.uikit.EventController();
                eventController.on(eventController.eventTypes.SELECTBYATTRIBUTE, this.OnSelectByAttribute, this);
            },
            /**
             * 根据属性获取元素
             * @method selectByAttribute
             */
            OnSelectByAttribute: function (event) {
                this.rowKey = event.feather;
                var features = [];
                this.onSelected(features);
            },
            /**
             *框选、圆选获取元素
             * @selectByGeometry
             * @param {Geometry}geometry
             */
            selectByGeometry: function (geometry) {
                this.geometry = geometry;
                var features = { geometry: geometry };
                if (geometry === 'circle') {
                    // ToDo
                }

                this.onSelected(features);
            },
            /**
             * 当前被选择的元素
             * @method onSelected
             * @param {Object}features
             */
            onSelected: function (features) {
                this.selectedFeatures = features;
            },
            /**
             * 清空存放数据的数组
             * @method clear
             */
            clear: function () {
                this.selectedFeatures = [];
            },

            /** *
             * 当前捕捉到的对象
              */
            getSnapObj: function () {
                return this.snapObj;
            },

            setSnapObj: function (obj) {
                this.snapObj = obj;
            }
        });
        return new Controller(options);
    }
    return function (options) {
        if (!instantiated) {
            instantiated = init(options);
        }
        return instantiated;
    };
}());

