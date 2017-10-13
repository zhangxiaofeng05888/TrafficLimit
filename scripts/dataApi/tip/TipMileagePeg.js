/**
 * Created by 123 on 2016/12/6.
 */
fastmap.dataApi.TipMileagePeg = fastmap.dataApi.Tip.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'TIPMILEAGEPEG';
        this.code = '1707'; // 里程桩

        if (data.deep) {
            this.deep = {
                id: data.deep.id || '',
                f: data.deep.f || {},
                rdNm: data.deep.rdNm || '',
                rdName: data.deep.rdName || '',
                num: data.deep.num || 0,
                src: data.deep.src || 1
            };
            if (this.deep.f.type === 1 && this.deep.f.id) {
                this.deep.f.id = parseInt(this.deep.f.id, 10);
            }
        } else {
            this.deep = {
                id: '',
                f: {
                    id: '',
                    type: 1
                },
                rdNm: '',
                rdName: '',
                num: 0,
                src: 1
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

fastmap.dataApi.tipMileagePeg = function (data, options) {
    return new fastmap.dataApi.TipMileagePeg(data, options);
};
