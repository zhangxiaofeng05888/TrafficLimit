/**
 * Created by zhaohang on 2017/4/19.
 */
fastmap.dataApi.TipDeleteTag = fastmap.dataApi.Tip.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'TIPDELETETAG';
        this.code = '2101'; // 删除标记
        this.source.s_sourceType = '2101';
        if (data.deep) {
            this.deep = {
                id: data.deep.id || '',
                f: {}
            };
            if (data.deep.f) {
                this.deep.f = data.deep.f;
                if (this.deep.f.type === 1 && this.deep.f.id) {
                    this.deep.f.id = parseInt(this.deep.f.id, 10);
                }
            }
        } else {
            this.deep = {
                id: '',
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


fastmap.dataApi.tipDeleteTag = function (data, options) {
    return new fastmap.dataApi.TipDeleteTag(data, options);
};
