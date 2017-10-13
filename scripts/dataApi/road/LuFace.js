/**
 * Created by mali on 2016/7/25.
 */
FM.dataApi.LuFace = FM.dataApi.Feature.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'LUFACE';
        this.pid = data.pid;
        this.featureId = data.featureId || 0;
        this.geometry = data.geometry;
        this.kind = data.kind || 0;
        this.area = data.area || 0;
        this.perimeter = data.perimeter || 0;
        this.meshId = data.meshId || 0;
        this.faceNames = [];
        if (data.faceNames) {
            for (var i = 0, len = data.faceNames.length; i < len; i++) {
                this.faceNames.push(FM.dataApi.luFaceName(data.faceNames[i]));
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
        data.featureId = this.featureId;
        data.geometry = this.geometry;
        data.kind = this.kind;
        data.area = this.area;
        data.perimeter = this.perimeter;
        data.meshId = this.meshId;
        // data.geoLiveType = this.geoLiveType;
        data.faceNames = [];
        if (this.faceNames) {
            for (var i = 0, len = this.faceNames.length; i < len; i++) {
                data.faceNames.push(this.faceNames[i].getIntegrate());
            }
        }
        data.rowId = this.rowId;
        return data;
    },

    getSnapShot: function () {
        var data = {};
        data.pid = this.pid;
        data.featureId = this.featureId;
        data.geometry = this.geometry;
        data.area = this.area;
        data.perimeter = this.perimeter;
        data.meshId = this.meshId;
        data.geoLiveType = this.geoLiveType;
        data.faceNames = [];
        if (this.names) {
            for (var i = 0, len = this.faceNames.length; i < len; i++) {
                data.faceNames.push(this.faceNames[i].getIntegrate());
            }
        }
        data.rowId = this.rowId;
        return data;
    },

    _doValidate: function () {
        var _self = this;
        if (this.kind === 11 && (!this.faceNames.length)) {
            this._pushError('GLM52028', '机场种别的LuFace，名称不能为空');
        }
        if (this.kind === 12 && this.faceNames.length) {
            this._pushError('GLM52029', '机场跑到种别的LuFace，名称必须为空');
        }

        // CHECK_FACE_NAME1
        this.faceNames.forEach(function (item) {
            if ((!item.phonetic && item.name && (item.langCode === 'CHI' || item.langCode === 'CHT'))) {
                _self._pushError('CHECK_FACE_NAME1', '名称内容有值，名称发音无值');
            }
        });
        // GLM51091
        this.faceNames.forEach(function (item) {
            if (item.phonetic && !item.name && (item.langCode === 'CHI' || item.langCode === 'CHT')) {
                _self._pushError('GLM51091', '名称发音有值，名称内容无值');
            }
        });

        // CHECK_FACE_NAME3
        var nameGroup = [];
        var nameGroupinitArr = [];
        this.faceNames.forEach(function (item) {
            if (!nameGroup[item.nameGroupid - 1]) {
                nameGroup[item.nameGroupid - 1] = [];
            }
            nameGroup[item.nameGroupid - 1].push(item);
        });

        nameGroup.forEach(function (item, outerIndex) {
            nameGroupinitArr[outerIndex] = [];
            for (var i = 0; i < item.length; i++) {
                if (item[i].langCode === 'ENG') {
                    nameGroupinitArr[outerIndex].push(item[i].langCode);
                }
                if (item[i].langCode === 'CHI' || item.langCode === 'CHT') {
                    nameGroupinitArr[outerIndex].push(item[i].langCode);
                }
            }
        });

        nameGroup.forEach(function (item, index) {
            if (nameGroupinitArr[index].length === 2) {
                var chi = false;
                var eng = false;
                item.forEach(function (innerItem) {
                    if (innerItem.langCode === 'ENG' && innerItem.name) {
                        eng = true;
                    } else if (innerItem.langCode === 'ENG' && !innerItem.name) {
                        eng = false;
                    }
                    if (innerItem.langCode === 'CHI' && innerItem.name) {
                        chi = true;
                    } else if (innerItem.langCode === 'CHI' && !innerItem.name) {
                        chi = false;
                    }
                });
                if (eng && !chi) {
                    _self._pushError('CHECK_FACE_NAME3', '组' + (index + 1) + '英文名称有值，中文名称无值');
                }
                if (!eng && !chi) {
                    _self._pushError('CHECK_FACE_NAME4', '组' + (index + 1) + '中文和英文名称不能同时为空');
                }
            }
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

FM.dataApi.luFace = function (data, options) {
    return new FM.dataApi.LUFace(data, options);
};
