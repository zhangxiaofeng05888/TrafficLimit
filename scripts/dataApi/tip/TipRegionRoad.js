/**
 * Created by Chensonglin on 17.4.11.
 */
fastmap.dataApi.TipRegionRoad = fastmap.dataApi.Tip.extend({
    setAttributes: function (data) {
        this.geoLiveType = 'TIPREGIONROAD';
        this.code = '1604'; // 区域内道路
        this.source.s_sourceType = '1604';
        if (data.deep) {
            this.deep = {
                geo: data.deep.geo || {},
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
fastmap.dataApi.tipRegionRoad = function (data, options) {
    return new fastmap.dataApi.TipRegionRoad(data, options);
};
