/**
 * Created by zhaohang on 2017/8/7.
 */
fastmap.dataApi.TipBuildTimeChange = fastmap.dataApi.Tip.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'TIPBUILDTIMECHANGE';
        this.code = '1520'; // 在建时间变更
        this.source.s_sourceType = '1520';
        if (data.deep) {
            this.deep = {
                gSLoc: data.deep.gSLoc || {},
                gELoc: data.deep.gELoc || {},
                f_array: [],
                time: data.deep.time || ''
            };
            if (data.deep.f_array) {
                this.deep.f_array = data.deep.f_array;
            }
            for (var i = 0; i < this.deep.f_array.length; i++) {
                if (this.deep.f_array[i].type === 1 && this.deep.f_array[i].id) {
                    this.deep.f_array[i].id = parseInt(this.deep.f_array[i].id, 10);
                }
            }
        } else {
            this.deep = {
                gSLoc: {},
                gELoc: {},
                f_array: [],
                time: ''
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
fastmap.dataApi.tipBuildTimeChange = function (data, options) {
    return new fastmap.dataApi.TipBuildTimeChange(data, options);
};

