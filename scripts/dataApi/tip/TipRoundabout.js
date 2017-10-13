/**
 * Created by Chensonglin on 17.4.14.
 */
fastmap.dataApi.TipRoundabout = fastmap.dataApi.Tip.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'TIPROUNDABOUT';
        this.code = '1601'; // 环岛
        this.source.s_sourceType = '1601';
        if (data.deep) {
            this.deep = {
                geo: data.deep.geo || {},
                name: data.deep.name || '',
                f_array: []
            };
            if (data.deep.f_array) {
                this.deep.f_array = data.deep.f_array;
                for (var i = 0; i < this.deep.f_array.length; i++) {
                    if (this.deep.f_array[i].type === 1 && this.deep.f_array[i].id) {
                        this.deep.f_array[i].id = parseInt(this.deep.f_array[i].id, 10);
                    }
                }
            }
        } else {
            this.deep = {
                geo: {},
                name: '',
                f_array: []
            };
        }
    },
    getIntegrate: function () {
        var data = this.deepCopy(this);
        if (data.deep.f_array) {
            for (var i = 0; i < data.deep.f_array.length; i++) {
                data.deep.f_array[i].id = data.deep.f_array[i].id.toString();
            }
        }
        return data;
    },
    getSnapShot: function () {
        var data = {};
        data.deep = this.deep;
        return data;
    }
});
fastmap.dataApi.tipRoundabout = function (data, options) {
    return new fastmap.dataApi.TipRoundabout(data, options);
};
