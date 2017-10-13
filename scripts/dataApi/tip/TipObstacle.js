/**
 * Created by 123 on 2016/12/6.
 */
fastmap.dataApi.TipObstacle = fastmap.dataApi.Tip.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'TIPOBSTACLE';
        this.code = '1701'; // 障碍物

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
                f: {
                    id: '',
                    type: 1
                }
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

fastmap.dataApi.tipObstacle = function (data, options) {
    return new fastmap.dataApi.TipObstacle(data, options);
};
