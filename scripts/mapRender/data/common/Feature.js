/**
 * 要素渲染数据模型的基类
 * @class FM.mapApi.render.data.Feature
 * @author ChenXiao
 * @date   2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */
FM.mapApi.render.data.Feature = FM.mapApi.render.data.DataModel.extend({
    /**
     * 模型转换初始化函数，在这里对公共属性进行初始化
     * @method initialize
     * @author ChenXiao
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
            this.properties.dbId = data.d;
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
                case 2: // 照片
                    break;
                case 3: // 交限
                    // if (data.m.a != 1) { // add by chenx on 20161024, 目前未做卡车交限的功能，暂时屏蔽渲染
                    ret = new FM.mapApi.render.data.RdRestriction(data, zoom);
                    // }
                    break;
                case 4: // rdlink
                    ret = new FM.mapApi.render.data.RdLink(data, zoom);
                    break;
                case 5: // 车信
                    ret = new FM.mapApi.render.data.RdLaneConnexity(data, zoom);
                    break;
                case 6: // 点限速
                    ret = new FM.mapApi.render.data.RdSpeedLimit(data, zoom);
                    break;
                case 7: // 分歧
                    ret = new FM.mapApi.render.data.RdBranch(data, zoom);
                    break;
                case 8: // 路口
                    ret = new FM.mapApi.render.data.RdCross(data, zoom);
                    break;
                case 9: // 线限速
                    ret = new FM.mapApi.render.data.RdLinkSpeedLimit(data, zoom);
                    break;
                case 10: // rtic
                    ret = new FM.mapApi.render.data.RdRtic(data, zoom);
                    break;
                case 11: // 立交
                    ret = new FM.mapApi.render.data.RdGsc(data, zoom);
                    break;
                case 12: // 行政区划线
                    ret = new FM.mapApi.render.data.AdLink(data, zoom);
                    break;
                case 13: // 行政区划面
                    ret = new FM.mapApi.render.data.AdFace(data, zoom);
                    break;
                case 14: // 铁路
                    ret = new FM.mapApi.render.data.RwLink(data, zoom);
                    break;
                case 15: // 行政区划点
                    if ((data.g[0] >= -12 && data.g[0] <= 267) && (data.g[1] >= -12 && data.g[1] <= 267)) {
                        ret = new FM.mapApi.render.data.AdAdmin(data, zoom);
                    }
                    break;
                case 16: // RDNODE
                    if ((data.g[0] >= -3 && data.g[0] <= 258) && (data.g[1] >= -3 && data.g[1] <= 258)) {
                        ret = new FM.mapApi.render.data.RdNode(data, zoom);
                    }
                    break;
                case 17: // AdNode
                    if ((data.g[0] >= -3 && data.g[0] <= 258) && (data.g[1] >= -3 && data.g[1] <= 258)) {
                        ret = new FM.mapApi.render.data.AdNode(data, zoom);
                    }
                    break;
                case 18: // zoneLink
                    ret = new FM.mapApi.render.data.ZoneLink(data, zoom);
                    break;
                case 19: // zoneFace
                    ret = new FM.mapApi.render.data.ZoneFace(data, zoom);
                    break;
                case 20: // zoneNode
                    if ((data.g[0] >= -3 && data.g[0] <= 258) && (data.g[1] >= -3 && data.g[1] <= 258)) {
                        ret = new FM.mapApi.render.data.ZoneNode(data, zoom);
                    }
                    break;
                case 21: // poi
                    // if((data.g[0] >= -5 && data.g[0] <= 260) && (data.g[1] >= -5 && data.g[1] <= 260)){
                    //     ret = new FM.mapApi.render.data.IXPOI(data);
                    // }
                    ret = new FM.mapApi.render.data.IXPOI(data, zoom);
                    break;
                case 22: // rwNode
                    if ((data.g[0] >= -3 && data.g[0] <= 258) && (data.g[1] >= -3 && data.g[1] <= 258)) {
                        ret = new FM.mapApi.render.data.RwNode(data, zoom);
                    }
                    break;
                case 23: // 大门
                    ret = new FM.mapApi.render.data.RdGate(data, zoom);
                    break;
                case 24: // 坡度
                    ret = new FM.mapApi.render.data.RdSlope(data, zoom);
                    break;
                case 25: // 警示信息
                    ret = new FM.mapApi.render.data.RdLinkWarning(data, zoom);
                    break;
                case 26: // 电子眼
                    ret = new FM.mapApi.render.data.RdElectronicEye(data, zoom);
                    break;
                case 27: // 红绿灯
                    ret = new FM.mapApi.render.data.RdTrafficSignal(data, zoom);
                    break;
                case 28: // LUNode
                    ret = new FM.mapApi.render.data.LuNode(data, zoom);
                    break;
                case 29: // LULink
                    ret = new FM.mapApi.render.data.LuLink(data, zoom);
                    break;
                case 30: // LUFace
                    ret = new FM.mapApi.render.data.LuFace(data, zoom);
                    break;
                case 33: // LCNode
                    ret = new FM.mapApi.render.data.LcNode(data, zoom);
                    break;
                case 31: // LULink
                    ret = new FM.mapApi.render.data.LcLink(data, zoom);
                    break;
                case 32: // LCFace
                    ret = new FM.mapApi.render.data.LcFace(data, zoom);
                    break;
                case 34: // 分叉口提示
                    ret = new FM.mapApi.render.data.RdSe(data, zoom);
                    break;
                case 35: // 顺行
                    ret = new FM.mapApi.render.data.RdDirectRoute(data, zoom);
                    break;
                case 36: // 减速带
                    ret = new FM.mapApi.render.data.RdSpeedBump(data, zoom);
                    break;
                case 37: // 同一点
                    if ((data.g[0] >= -3 && data.g[0] <= 258) && (data.g[1] >= -3 && data.g[1] <= 258)) {
                        ret = new FM.mapApi.render.data.RdSameNode(data, zoom);
                    }
                    break;
                case 38: // 同一线
                    ret = new FM.mapApi.render.data.RdSameLink(data, zoom);
                    break;
                case 39: // CRF交叉点
                    ret = new FM.mapApi.render.data.RdInter(data, zoom);
                    break;
                case 40: // CRF道路
                    ret = new FM.mapApi.render.data.RdRoad(data, zoom);
                    break;
                case 41: // CRF对象
                    ret = new FM.mapApi.render.data.RdObject(data, zoom);
                    break;
                case 42: // 收费站
                    ret = new FM.mapApi.render.data.RdTollgate(data, zoom);
                    break;
                case 44: // 语音导航
                    ret = new FM.mapApi.render.data.RdVoiceGuide(data, zoom);
                    break;
                case 43: // 收费站
                    ret = new FM.mapApi.render.data.RdVariableSpeed(data, zoom);
                    break;
                case 45: // rtic
                    ret = new FM.mapApi.render.data.RdRtic(data, zoom);
                    break;
                case 46: // CLM
                    ret = new FM.mapApi.render.data.RdLane(data, zoom);
                    break;
                case 48: // TMCPoint
                    ret = new FM.mapApi.render.data.TmcPoint(data, zoom);
                    break;
                case 49: // TMCLocation
                    ret = new FM.mapApi.render.data.TmcLocation(data, zoom);
                    break;
                case 47: // 限高限重
                    ret = new FM.mapApi.render.data.RdHgwgLimit(data, zoom);
                    break;
                case 50: // 里程桩
                    ret = new FM.mapApi.render.data.RdMileagePile(data, zoom);
                    break;
                case 52: // CmgBuildNode
                    ret = new FM.mapApi.render.data.CmgBuildNode(data, zoom);
                    break;
                case 51: // CmgBuildLink
                    ret = new FM.mapApi.render.data.CmgBuildLink(data, zoom);
                    break;
                case 53: // CmgBuildFace
                    ret = new FM.mapApi.render.data.CmgBuildFace(data, zoom);
                    break;
                case 54: // CmgBuildFeature
                    ret = new FM.mapApi.render.data.CmgBuildFeature(data, zoom);
                    break;
                default:
                    ret = null;
                    break;
            }
            return ret;
        }
    }
});
