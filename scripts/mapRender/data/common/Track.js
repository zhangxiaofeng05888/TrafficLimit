/**
 * 矢量化平台的轨迹渲染数据模型的基类
 * @class FM.mapApi.render.data.Track
 * @author ZhongXiaoMing
 * @date   2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */
FM.mapApi.render.data.Track = FM.mapApi.render.data.DataModel.extend({
    /**
     * 模型转换初始化函数，在这里对公共属性进行初始化
     * @method initialize
     * @author ZhongXiaoMing
     * @date   2017-09-12
     * @param  {object} data 接口返回的数据
     * @return {undefined}
     */
    initialize: function (data) {
        this.type = 'feature';
        this.geometry = null;
        this.properties = null;

        if (data) {
            this.geometry = {};
            this.geometry.type = 'Point';
            this.geometry.coordinates = data.g;

            this.properties = {};
            this.properties.id = data.i;
        }

        this.setAttribute.apply(this, arguments);
    },
    statics: {
        /**
         * 要素渲染数据模型路由函数，在这里匹配对应的构造方法
         * @method create
         * @author ZhongXiaoMing
         * @date   2017-09-12
         * @param  {object} data 接口返回的数据
         * @param  {object} tile 瓦片对象
         * @return {object}  要素渲染数据模型
         */
        create: function (data, tile) {
            var zoom = tile.z;
            var ret;
            switch (data.t) {
                case 1001:  // gps
                    ret = new FM.mapApi.render.data.GpsTrack(data, zoom);
                    break;
                case 1002:  // tab
                    ret = new FM.mapApi.render.data.VectorTab(data, zoom);
                    break;
                case 1003: // 疑似道路
                    ret = new FM.mapApi.render.data.VectorSuspected(data, zoom);
                    break;
                case 1004: // 滴滴缺失道路
                    ret = new FM.mapApi.render.data.MissRoadDidi(data, zoom);
                    break;
                case 1005: // 腾讯缺失道路
                    ret = new FM.mapApi.render.data.MissRoadTengxun(data, zoom);
                    break;
                default:
                    break;
            }
            return ret;
        }
    }
});
