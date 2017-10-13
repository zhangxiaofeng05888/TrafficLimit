/**
 * 矢量化平台的情报渲染数据模型的基类
 * @class FM.mapApi.render.data.Info
 * @author ZhaoHang
 * @date   2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */
FM.mapApi.render.data.Info = FM.mapApi.render.data.DataModel.extend({
    /**
     * 模型转换初始化函数，在这里对公共属性进行初始化
     * @method initialize
     * @author ZhaoHang
     * @date   2017-09-12
     * @param  {object} data 接口返回的数据
     * @return {undefined}
     */
    initialize: function (data) {
        this.type = 'info';
        this.geometry = null;
        this.properties = null;

        if (data) {
            this.geometry = {};
            this.geometry.coordinates = data.g_location;

            this.properties = {};
            this.properties.id = data.globalId;
        }

        this.setAttribute.apply(this, arguments);
    },

    statics: {
        /**
         * 要素渲染数据模型路由函数，在这里匹配对应的构造方法
         * @method create
         * @author ZhaoHang
         * @date   2017-09-12
         * @param  {object} data 接口返回的数据
         * @return {object}  要素渲染数据模型
         */
        create: function (data) {
            var geo = data.g_location[0];
            var info = null;
            switch (data.type) {
                case 'Point':
                    info = new FM.mapApi.render.data.PointInfo(data);
                    break;
                case 'LineString':
                    info = new FM.mapApi.render.data.LineInfo(data);
                    break;
                case 'Polygon':
                    info = new FM.mapApi.render.data.PolygonInfo(data);
                    break;
                default:
            }
            // if (FM.Util.isArray(geo)) {
            //     info = new FM.mapApi.render.data.LineInfo(data);
            // } else {
            //     info = new FM.mapApi.render.data.PointInfo(data);
            // }
            return info;
        },

        /**
         * 要素渲染数据模型转换函数，调用路由函数新建模型对象
         * @method transform
         * @author ZhaoHang
         * @date   2017-09-12
         * @param  {object} data 接口返回的数据
         * @param  {string} tileKey 瓦片键值
         * @param  {number} zoom 地图缩放等级
         * @return {object}  要素渲染数据模型
         */
        transform: function (data, tileKey, zoom) {
            var list = [];

            for (var i = 0, len = data.length; i < len; i++) {
                var tmp = FM.mapApi.render.data.Info.create(data[i], zoom);
                list.push(tmp);
            }

            return list;
        }
    }

});
