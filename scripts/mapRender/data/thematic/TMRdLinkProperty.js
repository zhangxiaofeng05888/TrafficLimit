/**
 * 临时对三个场景处理为专题图 的前端数据模型
 * @class FM.mapApi.render.data.TMRdLinkProperty
 * @author ZhaoHang
 * @date   2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */
FM.mapApi.render.data.TMRdLinkProperty = FM.mapApi.render.data.Thematic.extend({
    setAttribute: function (data) {
        this.geometry.type = 'LineString';
        this.properties.geoLiveType = 'RDLINK';
        this.properties.kind = data.m.a;
        this.properties.indexNumFC = parseInt(data.m.i, 10);
        this.properties.indexNumRank = parseInt(data.m.n, 10);
        this.properties.indexNumFree = parseInt(data.m.m, 10);
        this.properties.name = data.m.b;
        this.properties.limit = data.m.c;
        this.properties.direct = data.m.d;
        this.properties.snode = data.m.e;
        this.properties.enode = data.m.f;


        this.properties.form = data.m.h; // 形态
        this.properties.fc = data.m.i; // fc功能等级
        this.properties.imiCode = data.m.j; // imi代码
        this.properties.length = data.m.k; // 长度
        this.properties.totalDriveway = data.m.l; // 总车道数
        this.properties.collect = data.m.m; // 收费信息
        this.properties.speedRank = data.m.n; // 速度等级
    }
});
