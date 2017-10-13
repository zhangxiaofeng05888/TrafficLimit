/**
 * Created by Chensonglin on 17.4.13.
 */
fastmap.dataApi.TipBridge = fastmap.dataApi.Tip.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'TIPBRIDGE';
        this.code = '1510'; // 桥
        this.source.s_sourceType = '1510';
        if (data.deep) {
            this.deep = {
                name: data.deep.name || '',
                gSLoc: data.deep.gSLoc || {},
                gELoc: data.deep.gELoc || {},
                f_array: []
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
                name: '',
                gSLoc: {},
                gELoc: {},
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
fastmap.dataApi.tipBridge = function (data, options) {
    return new fastmap.dataApi.TipBridge(data, options);
};

