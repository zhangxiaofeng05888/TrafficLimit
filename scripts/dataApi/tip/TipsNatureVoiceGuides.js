/**
 * Created by 123 on 2016/12/6.
 */
fastmap.dataApi.TipNatureVoiceGuide = fastmap.dataApi.Tip.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'TIPNATUREVOICEGUIDE';
        this.code = '1307'; // 自然语音引导

        if (data.deep) {
            this.deep = {
                exp: data.deep.exp || {},
                agl: data.deep.agl || 0,
                obj: data.deep.obj || {}
            };
        } else {
            this.deep = {
                exp: {
                    id: '',
                    type: 1
                },
                agl: 0,
                obj: {
                    poiId: 0,
                    name: '',
                    geo: {},
                    desc: '',
                    src: '',
                    srcTp: ''
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

fastmap.dataApi.tipNatureVoiceGuide = function (data, options) {
    return new fastmap.dataApi.TipNatureVoiceGuide(data, options);
};
