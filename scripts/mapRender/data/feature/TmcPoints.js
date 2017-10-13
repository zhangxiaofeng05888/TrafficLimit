/**
 * TmcPoints的前端数据模型
 * @class FM.mapApi.render.data.TmcPoints
 * @author LiuZhe
 * @date   2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */
FM.mapApi.render.data.TmcPoints = function (data) {
    var parts = [];
    for (var i = 0; i < data.g.length; i++) {
        var temp = {
            g: data.g[i],
            i: data.m.a[i],
            m: {
                a: data.m.b[i],
                b: data.m.c[i]
            }
        };
        parts.push(new FM.mapApi.render.data.TmcPoint(temp));
    }
    // parts.push(new FM.mapApi.render.data.TmcLineString(data));
    return parts;
};
