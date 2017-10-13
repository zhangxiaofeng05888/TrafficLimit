/**
 * Created by zhaohang on 2016/4/7.
 */
FM.dataApi.RwLink = FM.dataApi.Feature.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'RWLINK';
        this.pid = data.pid;
        this.linkPid = data.linkPid;
        this.featurePid = data.featurePid || 0;
        this.sNodePid = data.sNodePid;
        this.eNodePid = data.eNodePid;
        this.kind = data.kind || 1;
        this.form = data.form || 0;
        this.length = data.length || 0;
        this.geometry = data.geometry;
        this.meshId = data.meshId || 0;
        this.scale = data.scale || 0;
        this.detailFlag = data.detailFlag || 0;
        if (typeof data.editFlag !== 'undefined') {
            this.editFlag = data.editFlag;
        } else {
            this.editFlag = 1;
        }
        this.color = data.color || null;
        this.names = [];
        if (data.names && data.names.length > 0) {
            for (var i = 0, len = data.names.length; i < len; i++) {
                var name = FM.dataApi.rwLinkName(data.names[i]);
                this.names.push(name);
            }
        }
        this.rowId = data.rowId || null;
    },

    /*
     *获取的道路信息
     */
    getIntegrate: function () {
        var data = {};
        data.pid = this.pid;
        data.linkPid = this.linkPid;
        data.featurePid = this.featurePid;
        data.sNodePid = this.sNodePid;
        data.eNodePid = this.eNodePid;
        data.kind = this.kind;
        data.form = this.form;
        data.length = this.length;
        data.meshId = this.meshId;
        data.scale = this.scale;
        data.detailFlag = this.detailFlag;
        data.editFlag = this.editFlag;
        data.color = this.color;
        var names = [];
        for (var i = 0, len = this.names.length; i < len; i++) {
            names.push(this.names[i].getIntegrate());
        }
        data.names = names;
        data.rowId = this.rowId;
        return data;
    },

    getSnapShot: function () {
        var data = {};
        data.linkPid = this.linkPid;
        data.featurePid = this.featurePid;
        data.sNodePid = this.sNodePid;
        data.eNodePid = this.eNodePid;
        data.kind = this.kind;
        data.form = this.form;
        data.length = this.length;
        data.geometry = this.geometry;
        data.meshId = this.meshId;
        data.scale = this.scale;
        data.detailFlag = this.detailFlag;
        data.editFlag = this.editFlag;
        data.color = this.color;
        data.geoLiveType = this.geoLiveType;
        data.rowId = this.rowId;
        return data;
    },

    _doValidate: function () {
        var _self = this;
        this.names.forEach(function (nameItem) {
            if (!nameItem.name) {
                _self._pushError('nameNotNull', 'rwLink道路名称中的NAME值不能为空');
                return;
            }
        });
    }
});

FM.dataApi.rwLink = function (data, options) {
    return new FM.dataApi.RwLink(data, options);
};

