/**
 * Created by 123 on 2016/12/6.
 */
fastmap.dataApi.TipCrossVoiceGuide = fastmap.dataApi.Tip.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'TIPCROSSVOICEGUIDE';
        this.code = '1306'; // 路口语音引导

        if (data.deep) {
            this.deep = {
                id: data.deep.id || '',
                in: data.deep.in || {},
                agl: data.deep.agl || 0,
                info: data.deep.info || [],
                nId: data.deep.nId || 0,
                o_array: data.deep.o_array || []
            };
            if (this.deep.in.type === 1 && this.deep.in.id) {
                this.deep.in.id = parseInt(this.deep.in.id, 10);
            }
            for (var i = 0; i < this.deep.o_array.length; i++) {
                for (var j = 0; j < this.deep.o_array[i].out.length; j++) {
                    if (this.deep.o_array[i].out[j].type === 1 && this.deep.o_array[i].out[j].id) {
                        this.deep.o_array[i].out[j].id = parseInt(this.deep.o_array[i].out[j].id, 10);
                    }
                }
            }
        } else {
            this.deep = {
                id: '',
                in: {
                    id: '',
                    type: 1
                },
                agl: 0,
                info: [
                    {
                        info: 0,
                        sq: 0
                    }
                ],
                nId: 0,
                o_array: [
                    {
                        sq: 0,
                        out: [
                            {
                                id: '',
                                type: 1,
                                num: 0,
                                geo: {}
                            }
                        ],
                        oInfo: 0
                    }
                ]
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

fastmap.dataApi.tipCrossVoiceGuide = function (data, options) {
    return new fastmap.dataApi.TipCrossVoiceGuide(data, options);
};
