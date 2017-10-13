/**
 * Created by 123 on 2016/12/6.
 */
fastmap.dataApi.TipRoadCross = fastmap.dataApi.Tip.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'TIPROADCROSS';
        this.code = '1704'; // 交叉路口

        if (data.deep) {
            this.deep = {
                id: data.deep.id || '',
                f: data.deep.f || {},
                name: data.deep.name || ''
            };
            if ((this.deep.f.type === 1 || this.deep.f.type === 3) && this.deep.f.id) {
                this.deep.f.id = parseInt(this.deep.f.id, 10);
            }
        } else {
            this.deep = {
                id: '',
                f: {
                    id: '',
                    type: 1
                },
                name: ''
            };
        }
    },

    getIntegrate: function () {
        var data = {};
        data.deep = this.deep;
        return data;
    },

    getSnapShot: function () {
        var data = {};
        data.deep = this.deep;
        return data;
    }
});

fastmap.dataApi.tipRoadCross = function (data, options) {
    return new fastmap.dataApi.TipRoadCross(data, options);
};
