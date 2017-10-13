/**
 * Created by wangtun on 2016/3/14.
 */
FM.dataApi.RdCross = FM.dataApi.Feature.extend({

    setAttributes: function (data) {
        this.geoLiveType = 'RDCROSS';
        this.pid = data.pid;
        this.type = data.type || 0;
        this.signal = data.signal || 0;
        this.kgFlag = data.kgFlag || 0;
        this.electroeye = data.electroeye || 0;
        this.names = [];
        if (data.names.length > 0) {
            for (var i = 0; i < data.names.length; i++) {
                var name = FM.dataApi.rdCrossName(data.names[i]);
                this.names.push(name);
            }
        }
        this.links = [];
        if (data.links.length > 0) {
            for (var j = 0; j < data.links.length; j++) {
                var link = FM.dataApi.rdCrossLink(data.links[j]);
                this.links.push(link);
            }
        }
        this.nodes = [];
        if (data.nodes.length > 0) {
            for (var k = 0; k < data.nodes.length; k++) {
                var node = FM.dataApi.rdCrossNode(data.nodes[k]);
                this.nodes.push(node);
            }
        }
        this.rowId = data.rowId || null;
    },

    getSnapShot: function () {
        var data = {};
        data.pid = this.pid;
        data.type = this.type;
        data.signal = this.signal;
        data.electroeye = this.electroeye;
        data.geoLiveType = this.geoLiveType;
        data.kgFlag = this.kgFlag;
        data.links = [];
        for (var i = 0, len = this.data.links.length; i < len; i++) {
            data.links.push(this.data.links[i].getIntegrate());
        }

        data.names = [];
        for (var j = 0, nameLen = this.data.names.length; j < nameLen; j++) {
            data.names.push(this.data.names[j].getIntegrate());
        }

        data.nodes = [];
        for (var k = 0, nodeLen = this.data.nodes.length; k < nodeLen; k++) {
            data.nodes.push(this.data.nodes[k].getIntegrate());
        }

        data.rowId = this.rowId;
        return data;
    },

    getIntegrate: function () {
        var data = {};
        data.pid = this.pid;
        data.type = this.type;
        data.signal = this.signal;
        data.electroeye = this.electroeye;
        data.geoLiveType = this.geoLiveType;
        data.kgFlag = this.kgFlag;
        data.links = [];
        for (var i = 0, len = this.links.length; i < len; i++) {
            data.links.push(this.links[i].getIntegrate());
        }

        data.names = [];
        for (var j = 0, nameLen = this.names.length; j < nameLen; j++) {
            data.names.push(this.names[j].getIntegrate());
        }

        data.nodes = [];
        for (var k = 0, nodeLen = this.nodes.length; k < nodeLen; k++) {
            data.nodes.push(this.nodes[k].getIntegrate());
        }
        data.rowId = this.rowId;
        return data;
    },

    _doValidate: function () {
        var _self = this;
        var nameGroup = [];
        this.names.forEach(function (item) {
            if (!nameGroup[item.nameGroupid - 1]) {
                nameGroup[item.nameGroupid - 1] = [];
            }
            nameGroup[item.nameGroupid - 1].push(item);
        });
        // 判断多音字是否进行了选择
        nameGroup.forEach(function (item, outerIndex) {
            for (var i = 0; i < item.length; i++) {
                if (item[i].langCode === 'CHI' || item.langCode === 'CHT') {
                    if (item[i].phoneticArr.length) {
                        for (var j = 0; j < item[i].phoneticArr.length; j++) {
                            if (item[i].phoneticArr[j].length > 1) {
                                _self._pushError('多音字检查', '请选择多音字');
                                break;
                            }
                        }
                    }
                }
            }
        });
    }
});
/** *
 * rdCross初始化函数
 * @param data node数据
 * @param options 其他可选参数
 * @returns {.dataApi.rdCross}
 */
FM.dataApi.rdCross = function (data, options) {
    return new FM.dataApi.RdCross(data, options);
};
