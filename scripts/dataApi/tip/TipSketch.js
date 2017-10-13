/**
 * Created by 123 on 2016/12/13.
 */
fastmap.dataApi.TipSketch = fastmap.dataApi.Tip.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'TIPSKETCH';
        this.code = '1806'; // 草图
        this.source.s_sourceType = '1806';
        this.deep = null;
        this.g_point = [];
        this.g_line = [];
        this.g_polygon = [];
        if (data.feedback && data.feedback.f_array && data.feedback.f_array.length > 0) {
            var fArray = data.feedback.f_array;
            var i,
                j;
            var temp;
            for (i = 0; i < fArray.length; i++) {
                for (j = 0; j < fArray[i].content.length; j++) {
                    temp = fArray[i].content[j];
                    if (temp.geo) {
                        if (temp.geo.type === 'Point') {
                            this.g_point.push(temp.geo);
                        } else if (temp.geo.type === 'LineString') {
                            this.g_line.push(temp.geo);
                        } else if (temp.geo.type === 'Polygon') {
                            this.g_polygon.push(temp.geo);
                        }
                    }
                }
            }
        }
    },
    getIntegrate: function () {
        var data = this.deepCopy(this);
        return data;
    },
    getSnapShot: function () {
        var data = {};
        return data;
    }
});
fastmap.dataApi.tipSketch = function (data, options) {
    return new fastmap.dataApi.TipSketch(data, options);
};
