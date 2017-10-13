/**
 * Created by liuyang on 2016/8/9.
 * Class RdObject
 */

FM.dataApi.RdObject = FM.dataApi.Feature.extend({
    /**
     *
     * @param data
     * @param options 其他可选参数
     */
    setAttributes: function (data) {
        this.geoLiveType = 'RDOBJECT';
        this.pid = data.pid || '';
        this.geometry = data.geometry || '';
        this.links = [];
        this.nodes = [];
        this.inters = [];
        this.roads = [];
        this.names = [];
        var i;
        for (i = 0; i < data.links.length; i++) {
            var link = FM.dataApi.rdObjectLinks(data.links[i]);
            this.links.push(link);
        }
        for (i = 0; i < data.nodes.length; i++) {
            var node = FM.dataApi.rdObjectNodes(data.nodes[i]);
            this.nodes.push(node);
        }
        for (i = 0; i < data.inters.length; i++) {
            var inter = FM.dataApi.rdObjectInters(data.inters[i]);
            this.inters.push(inter);
        }
        for (i = 0; i < data.roads.length; i++) {
            var road = FM.dataApi.rdObjectRoads(data.roads[i]);
            this.roads.push(road);
        }
        for (i = 0; i < data.names.length; i++) {
            var name = FM.dataApi.rdObjectNames(data.names[i]);
            this.names.push(name);
        }
        this.rowId = data.rowId || null;
    },

    /**
     * 获取RdObject简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot: function () {
        var data = {};
        data.pid = this.pid;
        data.nodes = [];
        data.links = [];
        data.inters = [];
        data.roads = [];
        data.names = [];
        data.geoLiveType = this.geoLiveType;
        var i;
        for (i = 0; i < this.links.length; i++) {
            data.links.push(this.links[i].getIntegrate());
        }
        for (i = 0; i < this.nodes.length; i++) {
            data.nodes.push(this.nodes[i].getIntegrate());
        }
        for (i = 0; i < this.inters.length; i++) {
            data.inters.push(this.inters[i].getIntegrate());
        }
        for (i = 0; i < this.roads.length; i++) {
            data.roads.push(this.roads[i].getIntegrate());
        }
        for (i = 0; i < this.names.length; i++) {
            data.names.push(this.names[i].getIntegrate());
        }
        data.rowId = this.rowId;
        return data;
    },

    /**
     * 获取RdObject详细信息
     * @method getIntegrate
     *
     * @return {object} getIntegrate.
     */
    getIntegrate: function () {
        var data = {};
        data.pid = this.pid;
        data.nodes = [];
        data.links = [];
        data.inters = [];
        data.roads = [];
        data.names = [];
        // data.geoLiveType = this.geoLiveType;
        var i;
        for (i = 0; i < this.links.length; i++) {
            data.links.push(this.links[i].getIntegrate());
        }
        for (i = 0; i < this.nodes.length; i++) {
            data.nodes.push(this.nodes[i].getIntegrate());
        }
        for (i = 0; i < this.inters.length; i++) {
            data.inters.push(this.inters[i].getIntegrate());
        }
        for (i = 0; i < this.roads.length; i++) {
            data.roads.push(this.roads[i].getIntegrate());
        }
        for (i = 0; i < this.names.length; i++) {
            data.names.push(this.names[i].getIntegrate());
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
 * RdSlope初始化函数
 * @param id
 * @param options 其他可选参数
 * @returns {.dataApi.RdObject}
 */
FM.dataApi.rdObject = function (data, options) {
    return new FM.dataApi.RdObject(data, options);
};

