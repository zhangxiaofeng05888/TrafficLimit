/**
 * Created by Chensonglin on 17.4.11.
 */
fastmap.dataApi.TipGSC = fastmap.dataApi.Tip.extend({
    setAttributes: function (data) {
        this.geoLiveType = 'TIPGSC';
        this.code = '1116'; // 立交
        this.source.s_sourceType = '1116';
        if (data.deep) {
            this.deep = {
                f_array: data.deep.f_array || []
            };
            for (var i = 0, len = this.deep.f_array.length; i < len; i++) {
                if ((this.deep.f_array[i].type === 1 || this.deep.f_array[i].type === 3) && this.deep.f_array[i].id) {
                    this.deep.f_array[i].id = parseInt(this.deep.f_array[i].id, 10);
                }
            }
        } else {
            this.deep = {
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
fastmap.dataApi.tipGSC = function (data, options) {
    return new fastmap.dataApi.TipGSC(data, options);
};
