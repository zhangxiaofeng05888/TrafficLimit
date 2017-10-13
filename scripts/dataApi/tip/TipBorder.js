/**
 * Created by 123 on 2016/12/6.
 */
fastmap.dataApi.TipBorder = FM.dataApi.Tip.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'TIPBORDER';
        this.code = '8002'; // 接边
        this.rowkey = data.rowkey;
        this.g_guide = data.guide || null;
        this.g_location = data.g_location || null;
        this.g_line = {
            type: 'MultiLineString',
            coordinates: []
        };
        if (data.feedback.f_array && data.feedback.f_array.length > 0) {
            this.feedback = this.deepCopy(data.feedback);
            for (var j = 0; j < data.feedback.f_array.length; j++) {
                if (data.feedback.f_array[j].content instanceof Array) {
                    for (var i = 0; i < data.feedback.f_array[j].content.length; i++) {
                        var line = data.feedback.f_array[j].content[i].geo.coordinates;
                        this.g_line.coordinates.push(line);
                    }
                } else {
                    this.memo = data.feedback.f_array[j].content;
                }
            }
        }
        if (data.t_trackInfo) {
            this.t_trackInfo = this.deepCopy(data.t_trackInfo);
        }
    },
    getIntegrate: function () {
        var data = {};
        data.g_guide = this.g_guide;
        data.g_location = this.g_location;
        data.feedback = this.feedback;
        data.t_trackInfo = this.t_trackInfo;
        data.rowkey = this.rowkey;
        data.memo = this.memo;
       // data.code = this.code;
       // data.geoLiveType = this.geoLiveType;
        return data;
    },

    getSnapShot: function () {
        var data = {};
        data.g_guide = this.g_guide;
        data.g_location = this.g_location;
        data.feedback = this.feedback;
        data.t_trackInfo = this.t_trackInfo;
        data.rowkey = this.rowkey;
        data.code = this.code;
        data.memo = this.memo;
        data.geoLiveType = this.geoLiveType;
        return data;
    }
});

fastmap.dataApi.tipBorder = function (data, options) {
    return new fastmap.dataApi.TipBorder(data, options);
};
