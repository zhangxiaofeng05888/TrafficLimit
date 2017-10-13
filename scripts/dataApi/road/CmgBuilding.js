/**
 * Created by mali on 2017/5/22.
 */
FM.dataApi.CmgBuilding = FM.dataApi.Feature.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'CMGBUILDING';
        this.pid = data.pid;
        this.kind = data.kind || '';
        this.names = [];
        if (data.names && data.names.length > 0) {
            for (var i = 0, len = data.names.length; i < len; i++) {
                var name = FM.dataApi.cmgBuildingName(data.names[i]);
                this.names.push(name);
            }
        }

        this.pois = [];

        this.build3dicons = [];
        if (data.build3dicons && data.build3dicons.length > 0) {
            for (var j = 0, leng = data.build3dicons.length; j < leng; j++) {
                var build3dicon = FM.dataApi.cmgBuilding3dicon(data.build3dicons[j]);
                this.build3dicons.push(build3dicon);
            }
        }
        this.build3dmodels = [];
        if (data.build3dmodels && data.build3dmodels.length > 0) {
            for (var z = 0, length = data.build3dmodels.length; z < length; z++) {
                var build3dModel = FM.dataApi.cmgBuilding3dmodel(data.build3dmodels[z]);
                this.build3dmodels.push(build3dModel);
            }
        }
        this.rowId = data.rowId || null;
    },

    /*
     *建筑物要素表
     */
    getIntegrate: function () {
        var data = {};
        data.pid = this.pid;
        data.kind = this.kind;

        var names = [];
        for (var i = 0, len = this.names.length; i < len; i++) {
            names.push(this.names[i].getIntegrate());
        }
        data.names = names;

        data.pois = [];

        var build3dicons = [];
        for (var j = 0, leng = this.build3dicons.length; j < leng; j++) {
            build3dicons.push(this.build3dicons[j].getIntegrate());
        }
        data.build3dicons = build3dicons;

        var build3dmodels = [];
        for (var z = 0, length = this.build3dmodels.length; z < length; z++) {
            build3dmodels.push(this.build3dmodels[z].getIntegrate());
        }
        data.build3dmodels = build3dmodels;

        data.rowId = this.rowId;
        return data;
    },

    getSnapShot: function () {
        var data = {};
        data.pid = this.pid;
        data.kind = this.kind;

        var names = [];
        for (var i = 0, len = this.names.length; i < len; i++) {
            names.push(this.names[i].getIntegrate());
        }
        data.names = names;

        data.pois = [];

        var build3dicons = [];
        for (var j = 0, leng = this.build3dicons.length; j < leng; j++) {
            build3dicons.push(this.build3dicons[j].getIntegrate());
        }
        data.build3dicons = build3dicons;

        var build3dmodels = [];
        for (var z = 0, length = this.build3dmodels.length; z < length; z++) {
            build3dmodels.push(this.build3dmodels[z].getIntegrate());
        }
        data.build3dmodels = build3dmodels;

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
                    if (item[i].fullNamePhoneticArr.length) {
                        for (var j = 0; j < item[i].fullNamePhoneticArr.length; j++) {
                            if (item[i].fullNamePhoneticArr[j].length > 1) {
                                _self._pushError('多音字检查', '全称发音多音字未选择');
                                break;
                            }
                        }
                    }
                    if (item[i].baseNamePhoneticArr.length) {
                        for (var q = 0; q < item[i].baseNamePhoneticArr.length; q++) {
                            if (item[i].baseNamePhoneticArr[q].length > 1) {
                                _self._pushError('多音字检查', '基本名发音多音字未选择');
                                break;
                            }
                        }
                    }
                    if (item[i].buildNumPhoneticArr.length) {
                        for (var z = 0; z < item[i].buildNumPhoneticArr.length; z++) {
                            if (item[i].buildNumPhoneticArr[z].length > 1) {
                                _self._pushError('多音字检查', '楼号发音多音字未选择');
                                break;
                            }
                        }
                    }
                }
            }
        });
    }

});

FM.dataApi.cmgBuilding = function (data, options) {
    return new FM.dataApi.CmgBuilding(data, options);
};
