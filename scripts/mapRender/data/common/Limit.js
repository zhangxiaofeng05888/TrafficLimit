/**
 * 要素渲染数据模型的基类
 * @class FM.mapApi.render.data.Feature
 * @author ChenXiao
 * @date   2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */
FM.mapApi.render.data.Limit = FM.mapApi.render.data.DataModel.extend({
    /**
     * 模型转换初始化函数，在这里对公共属性进行初始化
     * @method initialize
     * @author ChenXiao
     * @date   2017-09-12
     * @param  {object} data 接口返回的数据
     * @return {undefined}
     */
    initialize: function (data) {
        this.type = 'limit';
        this.geometry = null;
        this.properties = null;

        if (data) {
            this.geometry = {};
            this.geometry.coordinates = data.g;

            this.properties = {};
            this.properties.id = data.m.a;
        }

        this.setAttribute.apply(this, arguments);

        this.convertGeometry();
    },

    /**
     * 几何转换函数，子类需要覆盖后使用
     * @method convertGeometry
     * @author ChenXiao
     * @date   2017-09-12
     * @return {undefined}
     */
    convertGeometry: function () {

    },

    statics: {
        /**
         * 要素渲染数据模型路由函数，在这里匹配对应的构造方法
         * @method create
         * @author ChenXiao
         * @date   2017-09-12
         * @param  {object} data 接口返回的数据
         * @param  {object} tile 瓦片对象
         * @return {object}  要素渲染数据模型
         */
        create: function (data, tile) {
            var zoom = tile.z;
            var ret;
            switch (data.t) {
                case 1001: // 临时线
                    ret = new FM.mapApi.render.data.CopyToLine(data, zoom);
                    break;
                case 1002: // 临时面-线
                    ret = new FM.mapApi.render.data.CopyToPolygon(data, zoom);
                    break;
                case 1003: // 临时面
                    ret = new FM.mapApi.render.data.DrawPolygon(data, zoom);
                    break;
                case 1004: // 成果线
                    ret = new FM.mapApi.render.data.GeometryLine(data, zoom);
                    break;
                case 1005: // 成果面
                    ret = new FM.mapApi.render.data.GeometryPolygon(data, zoom);
                    break;
                default:
                    ret = null;
                    break;
            }
            return ret;
        }
    }
});
