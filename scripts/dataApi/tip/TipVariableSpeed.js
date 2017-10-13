/**
 * Created by 123 on 2016/12/6.
 */
fastmap.dataApi.TipVariableSpeed = fastmap.dataApi.Tip.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'TIPVARIABLESPEED';
        this.code = '1112'; // 可变限速

        if (data.deep) {
            this.deep = {
                id: data.deep.id || '',
                in: data.deep.in || {},
                nId: data.deep.nId || 0,
                out: data.deep.out || {},
                agl: data.deep.agl || 0,
                loc: data.deep.loc || 0
            };
            if (this.deep.in.type === 1 && this.deep.in.id) {
                this.deep.in.id = parseInt(this.deep.in.id, 10);
            }
            if (this.deep.out.type === 1 && this.deep.out.id) {
                this.deep.out.id = parseInt(this.deep.out.id, 10);
            }
        } else {
            this.deep = {
                id: '',
                in: {
                    id: '',
                    type: 1
                },
                nId: 0,
                out: {
                    id: '',
                    type: 1
                },
                agl: 0,
                loc: 0
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

fastmap.dataApi.tipVariableSpeed = function (data, options) {
    return new fastmap.dataApi.TipVariableSpeed(data, options);
};
