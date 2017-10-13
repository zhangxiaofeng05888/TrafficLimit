/**
 * 管理平台数据规划的link和poi渲染数据模型的基类
 * @class FM.mapApi.render.data.DataPlan
 * @author ZhaoHang
 * @date   2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */
FM.mapApi.render.data.DataPlan = FM.mapApi.render.data.DataModel.extend({
    /**
     * 模型转换初始化函数，在这里对公共属性进行初始化
     * @method initialize
     * @author ZhaoHang
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
         * @author ZhaoHang
         * @date   2017-09-12
         * @param  {object} data 接口返回的数据
         * @param  {object} tile 瓦片对象
         * @return {object}  要素渲染数据模型
         */
        create: function (data, tile) {
            var zoom = tile.z;
            var ret;
            switch (data.t) {
                case 4: // rdlink
                    ret = new FM.mapApi.render.data.DataPlanRdLink(data, zoom);
                    break;
                case 21: // poi
                    // if((data.g[0] >= -5 && data.g[0] <= 260) && (data.g[1] >= -5 && data.g[1] <= 260)){
                    //     ret = new FM.mapApi.render.data.IXPOI(data);
                    // }
                    ret = new FM.mapApi.render.data.DataPlanIXPOI(data, zoom);
                    break;
                default:
                    ret = null;
                    break;
            }
            return ret;
        }
    }
});
