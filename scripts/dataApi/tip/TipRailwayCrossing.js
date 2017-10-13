/**
 * Created by zhaohang on 2017/4/12.
 */
fastmap.dataApi.TipRailwayCrossing = fastmap.dataApi.Tip.extend({
    /*
     *返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'TIPRAILWAYCROSSING';
        this.code = '1702';    // 铁路道口
        this.source.s_sourceType = '1702';
        if (data.deep && data.deep.f) {
            this.deep = {
                f: {
                    id: data.deep.f.id || '',
                    type: data.deep.f.type || 1
                }
            };
            if ((this.deep.f.type === 1 || this.deep.f.type === 3) && this.deep.f.id) {
                this.deep.f.id = parseInt(this.deep.f.id, 10);
            }
        } else {
            this.deep = {
                f: {}
            };
        }
    },

    getIntegrate: function () {
        var data = this.deepCopy(this);
        if (data.deep.f.id) {
            data.deep.f.id = data.deep.f.id.toString();
        }
        return data;
    },

    getSnapShot: function () {
        var data = {};
        data.deep = this.deep;
        return data;
    }
});

fastmap.dataApi.tipRailwayCrossing = function (data, options) {
    return new fastmap.dataApi.TipRailwayCrossing(data, options);
};

