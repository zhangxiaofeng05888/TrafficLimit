/**
 * Created by 123 on 2016/12/6.
 */
fastmap.dataApi.TipVariableDirectionLane = fastmap.dataApi.Tip.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'TIPVARIABLEDIRECTIONLANE';
        this.code = '1311'; // 可变导向车道

        if (data.deep) {
            this.deep = {
                f: data.deep.f || {},
                agl: data.deep.agl || 0,
                ln: data.deep.ln || []
            };

            if (this.deep.f.type === 1 && this.deep.f.id) {
                this.deep.f.id = parseInt(this.deep.f.id, 10);
            }
            for (var i = 0; i < this.deep.ln.length; i++) {
                for (var j = 0; j < this.deep.ln[i].o_array.length; j++) {
                    if (this.deep.ln[i].o_array[j].out.type === 1 && this.deep.ln[i].o_array[j].out.id) {
                        this.deep.ln[i].o_array[j].out.id = parseInt(this.deep.ln[i].o_array[j].out.id, 10);
                    }
                }
            }
        } else {
            this.deep = {
                f: {
                    id: '',
                    type: 1
                },
                agl: 0,
                ln: [
                    {
                        var: 0,
                        o_array: [
                            {
                                out: {
                                    id: '',
                                    type: 1,
                                    num: 0,
                                    geo: {}
                                },
                                time: ''
                            }
                        ]
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

fastmap.dataApi.tipVariableDirectionLane = function (data, options) {
    return new fastmap.dataApi.TipVariableDirectionLane(data, options);
};
