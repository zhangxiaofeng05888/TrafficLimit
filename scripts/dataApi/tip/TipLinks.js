/**
 * Created by Chensonglin on 17.4.14.
 */
fastmap.dataApi.TipLinks = fastmap.dataApi.Tip.extend({
    setAttributes: function (data) {
        this.geoLiveType = 'TIPLINKS';
        this.code = '2001'; // 侧线
        this.source.s_sourceType = '2001';
        if (data.deep) {
            this.deep = {
                id: data.deep.id || '',
                geo: data.deep.geo || {},
                src: data.deep.src || (data.deep.src === 0 ? 0 : 3),
                ln: data.deep.ln || (data.deep.ln === 0 ? 0 : 1),
                kind: data.deep.kind || (data.deep.kind === 0 ? 0 : 8),
                len: data.deep.len || 0.0,
                shp: data.deep.shp || 0,
                prj: data.deep.prj || '',
                sTime: data.deep.sTime || 0.0,
                eTime: data.deep.eTime || 0.0,
                cons: data.deep.cons || 0,
                time: data.deep.time || '',
                sGrip: data.deep.sGrip || 0,
                eGrip: data.deep.eGrip || 0
            };
        } else {
            this.deep = {
                id: '',
                geo: {},
                src: 3,
                ln: 1,
                kind: 8,
                len: 0.0,
                shp: 0,
                prj: '',
                sTime: 0.0,
                eTime: 0.0,
                cons: 0,
                time: '',
                sGrip: 0,
                eGrip: 0
            };
        }
    },
    getIntegrate: function () {
        var data = this.deepCopy(this);
        return data;
    },
    getSnapShot: function () {
        var data = {};
        data.deep = this.deep;
        return data;
    }
});
fastmap.dataApi.tipLinks = function (data, options) {
    return new fastmap.dataApi.TipLinks(data, options);
};
