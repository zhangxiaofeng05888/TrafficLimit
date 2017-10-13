/**
 * Created by linglong on 2016/8/12.
 */
FM.dataApi.LcFace = FM.dataApi.Feature.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'LCFACE';
        this.pid = data.pid;
        this.featurePid = data.featurePid || 0;
        this.geometry = data.geometry;
        this.meshId = data.meshId || 0;
        this.kind = data.kind || 0;
        this.form = data.form || 0;
        this.displayClass = data.displayClass || 0;
        this.area = data.area || 0;
        this.perimeter = data.perimeter || 0;
        this.scale = data.scale || 0;
        this.detailFlag = data.detailFlag || 0;
        this.names = [];
        if (data.names) {
            for (var i = 0, len = data.names.length; i < len; i++) {
                this.names.push(FM.dataApi.lcFaceName(data.names[i]));
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
        data.featureId = this.featurePid;
        data.geometry = this.geometry;
        data.meshId = this.meshId;
        data.kind = this.kind;
        data.form = this.form;
        data.displayClass = this.displayClass;
        data.area = this.area;
        data.perimeter = this.perimeter;
        data.scale = this.scale;
        data.detailFlag = this.detailFlag;
        data.names = [];
        if (this.names) {
            for (var i = 0, len = this.names.length; i < len; i++) {
                data.names.push(this.names[i].getIntegrate());
            }
        }
        // data.geoLiveType = this.geoLiveType;
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
        data.names = [];
        if (this.names) {
            for (var i = 0, len = this.names.length; i < len; i++) {
                data.names.push(this.names[i].getIntegrate());
            }
        }
        data.rowId = this.rowId;
        return data;
    },

    _doValidate: function () {
        var _self = this;
        if (this.kind === 5 && (!this.names.length)) {
            this._pushError('GLM51047', '港湾种别的Face，名称不能为空');
        }
        if (this.kind === 12 && (!this.names.length)) {
            this._pushError('GLM51051', '高尔夫种别的Face，名称不能为空');
        }
        if (this.kind === 11 && (!this.names.length)) {
            this._pushError('GLM51050', '公园种别的Face，名称不能为空');
        }
        if (this.kind === 1 && (!this.names.length)) {
            this._pushError('GLM51043', '海域种别的Face，名称不能为空');
        }
        if (this.kind === 13 && (!this.names.length)) {
            this._pushError('GLM51052', '滑雪场种别的Face，名称不能为空');
        }
        if (this.kind === 4 && (!this.names.length)) {
            this._pushError('GLM51046', '水库种别的Face，名称不能为空');
        }
        if (this.kind === 8 && (!this.names.length)) {
            this._pushError('GLM51007', '水系假象线种别的Face，名称不能为空');
        }
        if ([1, 2, 3, 4, 5].indexOf(this.kind) != -1 && this.displayClass == 0) {
            this._pushError('PROPERTY_CHECK_WATERFACE_SHOWLEVEL', '土地覆盖中水系类面的显示等级值只能为1,2,3,4,5,6,7,8');
        }
        // CHECK_FACE_NAME1
        this.names.forEach(function (item) {
            if ((!item.phonetic && item.name && (item.langCode === 'CHI' || item.langCode === 'CHT'))) {
                _self._pushError('CHECK_FACE_NAME1', '名称内容有值，名称发音无值');
            }
        });
        // GLM51091
        this.names.forEach(function (item) {
            if (item.phonetic && !item.name && (item.langCode === 'CHI' || item.langCode === 'CHT')) {
                _self._pushError('GLM51091', '名称发音有值，名称内容无值');
            }
        });
        // PROPERTY_CHECK_WATERFACE_SHOWLEVEL;
        if ([1, 2, 3, 4, 5, 6].indexOf(this.kind) != -1 && this.displayClass === 0) {
            _self._pushError('GLM51091', '土地覆盖中水系类面的显示等级值只能为1,2,3,4,5,6,7,8');
        }

        // CHECK_FACE_NAME3
        var nameGroup = [];
        var nameGroupinitArr = [];
        this.names.forEach(function (item) {
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
            nameGroupinitArr[outerIndex] = [];
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

FM.dataApi.lcFace = function (data, options) {
    return new FM.dataApi.LCFace(data, options);
};
