/**
 * 矢量化平台的缺失道路渲染数据模型的基类
 * @class FM.mapApi.render.data.Deletion
 * @author ZhaoHang
 * @date   2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */
FM.mapApi.render.data.Deletion = FM.mapApi.render.data.DataModel.extend({
    /**
     * 模型转换初始化函数，在这里对公共属性进行初始化
     * @method initialize
     * @author ZhaoHang
     * @date   2017-09-12
     * @param  {object} data 接口返回的数据
     * @return {undefined}
     */
    initialize: function (data) {
        this.type = 'deletion';
        this.geometry = null;
        this.properties = null;

        if (data) {
            this.geometry = {};
            this.geometry.coordinates = data.geometry;

            this.properties = {};
            this.properties.id = new Date().getTime();
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
         * @param  {number} zoom 地图缩放等级
         * @return {object}  要素渲染数据模型
         */
        create: function (data, zoom) {
            // var geo = data.geometry;
            // var info = null;
            // if (Object.prototype.toString.apply(geo) === '[object Array]') {
            //     info = new FM.mapApi.render.data.CanvasInfo.LineInfo(data);
            // } else {
            //     info = new FM.mapApi.render.data.CanvasInfo.PointInfo(data);
            // }
            // return info;
            return new FM.mapApi.render.data.LinkDeletion(data);
        },

        /**
         * 要素渲染数据模型转换函数，调用路由函数新建模型对象
         * @method transform
         * @author ZhaoHang
         * @date   2017-09-12
         * @param  {object} data 接口返回的数据
         * @param  {object} tileKey 瓦片键值
         * @param  {number} zoom 地图缩放等级
         * @return {object}  要素渲染数据模型
         */
        transform: function (data, tileKey, zoom) {
            var list = [];

            for (var i = 0, len = data.length; i < len; i++) {
                var tmp = FM.mapApi.render.data.Deletion.create(data[i], zoom);
                list.push(tmp);
            }

            return list;
        }
    }
});
