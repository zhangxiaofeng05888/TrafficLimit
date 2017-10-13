/**
 * Created by zhaohang on 2016/4/5.
 */
FM.dataApi.AdAdmin = FM.dataApi.Feature.extend({
    setAttributes: function (data) {
        this.geoLiveType = 'ADADMIN';
        this.pid = data.pid;
        this.adminId = data.adminId || 0;
        this.extendId = data.extendId || 0;
        this.adminType = data.adminType || 0;
        this.capital = data.capital || 0;
        this.population = data.population || null;
        this.geometry = data.geometry;
        this.linkPid = data.linkPid || 0;
        this.side = data.side || 0;
        this.jisCode = data.jisCode || 0;
        this.meshId = data.meshId || 0;
        if (typeof data.editFlag !== 'undefined') {
            this.editFlag = data.editFlag;
        } else {
            this.editFlag = 1;
        }
        this.memo = data.memo || null;

        this.names = [];
        if (data.names && data.names.length > 0) {
            for (var i = 0, len = data.names.length; i < len; i++) {
                var name = FM.dataApi.adAdminName(data.names[i]);
                this.names.push(name);
            }
        }
        // 引导点和引导线
        this.guidePoint = {
            type: 'Point',
            coordinates: []
        };
        this.guideLink = {
            type: 'LineString',
            coordinates: [[data.geometry.coordinates[0], data.geometry.coordinates[1]]]
        };

        this.rowId = data.rowId || null;
    },

    /*
     *获取的道路信息
     */
    getIntegrate: function () {
        var data = {};
        data.pid = this.pid;
        data.adminId = this.adminId;
        data.extendId = this.extendId;
        data.adminType = this.adminType;
        data.capital = this.capital;
        data.population = this.population;
        data.geometry = this.geometry;
        data.linkPid = this.linkPid;
        data.side = this.side;
        data.jisCode = this.jisCode;
        data.meshId = this.meshId;
        data.editFlag = this.editFlag;
        data.memo = this.memo;
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
        data.pid = this.pid;
        data.adminId = this.adminId;
        data.extendId = this.extendId;
        data.adminType = this.adminType;
        data.capital = this.capital;
        data.population = this.population;
        data.geometry = this.geometry;
        data.linkPid = this.linkPid;
        data.side = this.side;
        data.jisCode = this.jisCode;
        data.meshId = this.meshId;
        data.editFlag = this.editFlag;
        data.memo = this.memo;
        data.geoLiveType = this.geoLiveType;
        var names = [];
        for (var i = 0, len = this.names.length; i < len; i++) {
            names.push(this.names[i].getIntegrate());
        }
        data.names = names;
        data.rowId = this.rowId;
        return data;
    },

    _doValidate: function () {
        var _self = this;
        // 该检查删掉了;
        // if ((!this.names.length)) {
        //     this._pushError('GLM50099', '行政区划代表点要素至少有一个名称存在');
        // }
        if (this.adminType != 0 && this.adminId.toString().length != 6) {
            this._pushError('GLM50097', '行政区划代表点的ADMIN_TYPE不为0且ADMIN_ID(行政代码)长度不是6位');
        }
        // GLM50099检查;
        var tempAdminId = this.adminId.toString();
        if (this.adminType != 0) {
            var allNameLangCode = [];
            this.names.forEach(function (item) {
                if (allNameLangCode.indexOf(item.langCode == -1)) {
                    allNameLangCode.push(item.langCode);
                }
            });
            var temp = [];
            if (tempAdminId.substr(0, 2) == '82') {
                temp = FM.Util.intersection(['POR', 'ENG', 'CHT'], allNameLangCode);
                if (temp.length != 3) {
                    this._pushError('GLM50099', 'ADMIN_ID前两位为82时，名称表应同时存在LANG_CODE=POR、ENG和CHT的的记录');
                }
            } else if (tempAdminId.substr(0, 2) == '81') {
                temp = FM.Util.intersection(['ENG', 'CHT'], allNameLangCode);
                if (temp.length != 2) {
                    this._pushError('GLM50099', 'ADMIN_ID前两位为81时，名称表应同时存在LANG_CODE=ENG和CHT的的记录');
                }
            } else {
                temp = FM.Util.intersection(['ENG', 'CHI'], allNameLangCode);
                if (temp.length != 2) {
                    this._pushError('GLM50099', 'ADMIN_ID前两位不为81或82时，名称表应同时存在LANG_CODE=ENG和CHI的记录');
                }
            }
        }
        // GLM50102
        this.names.forEach(function (item) {
            if (!item.name) {
                _self._pushError('GLM50102', '名称表中NAME字段不能为空');
                return;
            }
        });
        // GLM50100 GLM50102
        this.names.forEach(function (item) {
            if (['CHI', 'CHT', 'ENG', 'POR'].indexOf(item.langCode) != -1 && Utils.getBLength(item.name) > 35) {
                _self._pushError('GLM50100_GLM50102', '中文/英文/葡文名称超过35个字符');
                return;
            }
        });
        // GLM50103
        this.names.forEach(function (item) {
            if (['CHI', 'CHT'].indexOf(item.langCode) != -1 && (!item.phonetic)) {
                _self._pushError('GLM50103', '名称表中LANG_CODE=CHI|CHT时，名称发音（PHONETIC）不能为空');
                return;
            }
        });
        // GLM50104
        this.names.forEach(function (item) {
            if (Utils.getBLength(item.phonetic) > 120) {
                _self._pushError('GLM50104', '名称发音（PHONETIC）长度超过120个字符');
                return;
            }
        });
        // GLM50106
        if (this.adminType == 3 || this.adminType == 3.5) {
            this.names.forEach(function (item) {
                if (item.name.substr(item.name.length - 2) != '市区' && item.langCode === 'CHI') {
                    _self._pushError('GLM50106', 'ADMIN_TYPE为“3：地级市市区（GCZone）”和“3.5：地级市市区（未作区界）”时，行政区划中文名称必须以“市区”结尾');
                    return;
                }
            });
        }

        var nameGroup = [];
        var nameGroupinitArr = [];
        this.names.forEach(function (item) {
            if (!nameGroup[item.nameGroupid - 1]) {
                nameGroup[item.nameGroupid - 1] = [];
            }
            nameGroup[item.nameGroupid - 1].push(item);
        });
        // GLM50125
        if (this.adminType != 8 && this.adminType != 9) {
            if (tempAdminId.substr(0, 2) != '82' && tempAdminId.substr(0, 2) != '81') {
                nameGroup.forEach(function (outerItem, outerIndex) {
                    nameGroupinitArr[outerIndex] = ['CHI_1', 'ENG_1', 'CHI_3', 'ENG_3'];
                    outerItem.forEach(function (innerItem, innerIndex) {
                        if (innerItem.langCode === 'CHI' && innerItem.nameClass === 1) {
                            nameGroupinitArr[outerIndex] = FM.Util.without(nameGroupinitArr[outerIndex], 'CHI_1');
                        }
                        if (innerItem.langCode === 'ENG' && innerItem.nameClass === 1) {
                            nameGroupinitArr[outerIndex] = FM.Util.without(nameGroupinitArr[outerIndex], 'ENG_1');
                        }
                        if (innerItem.langCode === 'CHI' && innerItem.nameClass === 3) {
                            nameGroupinitArr[outerIndex] = FM.Util.without(nameGroupinitArr[outerIndex], 'CHI_3');
                        }
                        if (innerItem.langCode === 'ENG' && innerItem.nameClass === 3) {
                            nameGroupinitArr[outerIndex] = FM.Util.without(nameGroupinitArr[outerIndex], 'ENG_3');
                        }
                    });
                });
            } else if (tempAdminId.substr(0, 2) == '82') {
                nameGroup.forEach(function (outerItem, outerIndex) {
                    nameGroupinitArr[outerIndex] = ['CHT_1', 'ENG_1', 'CHT_3', 'ENG_3', 'POR_1'];
                    outerItem.forEach(function (innerItem, innerIndex) {
                        if (innerItem.langCode === 'CHT' && innerItem.nameClass === 1) {
                            nameGroupinitArr[outerIndex] = FM.Util.without(nameGroupinitArr[outerIndex], 'CHT_1');
                        }
                        if (innerItem.langCode === 'ENG' && innerItem.nameClass === 1) {
                            nameGroupinitArr[outerIndex] = FM.Util.without(nameGroupinitArr[outerIndex], 'ENG_1');
                        }
                        if (innerItem.langCode === 'CHT' && innerItem.nameClass === 3) {
                            nameGroupinitArr[outerIndex] = FM.Util.without(nameGroupinitArr[outerIndex], 'CHT_3');
                        }
                        if (innerItem.langCode === 'ENG' && innerItem.nameClass === 3) {
                            nameGroupinitArr[outerIndex] = FM.Util.without(nameGroupinitArr[outerIndex], 'ENG_3');
                        }
                        if (innerItem.langCode === 'POR' && innerItem.nameClass === 1) {
                            nameGroupinitArr[outerIndex] = FM.Util.without(nameGroupinitArr[outerIndex], 'POR_1');
                        }
                    });
                });
            } else if (tempAdminId.substr(0, 2) == '81') {
                nameGroup.forEach(function (outerItem, outerIndex) {
                    nameGroupinitArr[outerIndex] = ['CHT_1', 'CHT_3', 'ENG_1', 'ENG_3'];
                    outerItem.forEach(function (innerItem, innerIndex) {
                        if (innerItem.langCode === 'CHT' && innerItem.nameClass === 1) {
                            nameGroupinitArr[outerIndex] = FM.Util.without(nameGroupinitArr[outerIndex], 'CHT_1');
                        }
                        if (innerItem.langCode === 'POR' && innerItem.nameClass === 1) {
                            nameGroupinitArr[outerIndex] = FM.Util.without(nameGroupinitArr[outerIndex], 'POR_1');
                        }
                        if (innerItem.langCode === 'CHT' && innerItem.nameClass === 3) {
                            nameGroupinitArr[outerIndex] = FM.Util.without(nameGroupinitArr[outerIndex], 'CHT_3');
                        }
                        if (innerItem.langCode === 'ENG' && innerItem.nameClass === 1) {
                            nameGroupinitArr[outerIndex] = FM.Util.without(nameGroupinitArr[outerIndex], 'ENG_1');
                        }
                        if (innerItem.langCode === 'ENG' && innerItem.nameClass === 3) {
                            nameGroupinitArr[outerIndex] = FM.Util.without(nameGroupinitArr[outerIndex], 'ENG_3');
                        }
                    });
                });
            }
            var message = '';
            nameGroupinitArr.forEach(function (outerLoop, outerIndex) {
                if (outerLoop.length) {
                    message += '第' + (outerIndex + 1) + '组缺少';
                }
                // message += '第' + (outerIndex + 1) + '组缺少';
                outerLoop.forEach(function (innerLoop) {
                    if (innerLoop === 'CHI_1') {
                        message += '简体中文标准化,';
                    }
                    if (innerLoop === 'CHI_3') {
                        message += '简体中文简称,';
                    }
                    if (innerLoop === 'CHT_1') {
                        message += '繁体中文标准化,';
                    }
                    if (innerLoop === 'CHT_3') {
                        message += '繁体中文简称,';
                    }
                    if (innerLoop === 'ENG_1') {
                        message += '英文标准化,';
                    }
                    if (innerLoop === 'ENG_3') {
                        message += '英文简称,';
                    }
                    if (innerLoop === 'POR_1') {
                        message += '葡文标准化,';
                    }
                });
            });
            if (message) {
                this._pushError('GLM50125', message);
            }
        }
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

FM.dataApi.adAdmin = function (data, options) {
    return new FM.dataApi.AdAdmin(data, options);
};
