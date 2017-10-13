/**
 * Created by Chensonglin on 17.4.11.
 */
fastmap.dataApi.TipTrafficSignal = fastmap.dataApi.Tip.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'TIPTRAFFICSIGNAL';
        this.code = '1102'; // 红绿灯
        this.source.s_sourceType = '1102';
        if (data.deep) {
            this.deep = {
                id: data.deep.id || '',
                inCt: data.deep.inCt || (data.deep.inCt === 0 ? 0 : 1),
                f_array: []
            };
            if (this.deep.f_array) {
                this.deep.f_array = data.deep.f_array;
            }
            for (var i = 0; i < this.deep.f_array.length; i++) {
                if (this.deep.f_array[i].f.type === 1 && this.deep.f_array[i].f.id) {
                    this.deep.f_array[i].f.id = parseInt(this.deep.f_array[i].f.id, 10);
                }
            }
        } else {
            this.deep = {
                id: '',
                inCt: 1,
                f_array: []
            };
        }
    },
    getIntegrate: function () {
        var data = this.deepCopy(this);
        if (data.deep.f_array) {
            for (var i = 0; i < data.deep.f_array.length; i++) {
                data.deep.f_array[i].f.id = data.deep.f_array[i].f.id.toString();
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

fastmap.dataApi.tipTrafficSignal = function (data, options) {
    return new fastmap.dataApi.TipTrafficSignal(data, options);
};
