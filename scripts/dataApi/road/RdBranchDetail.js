/**
 * Created by wangtun on 2016/3/15.
 */
FM.dataApi.RdBranchDetail = FM.dataApi.Feature.extend({

    setAttributes: function (data) {
        this.geoLiveType = 'RDBRANCHDETAIL';
        this.pid = data.pid;
        this.rowId = data.rowId || null;
        this.branchPid = data.branchPid;
        this.branchType = data.branchType || 0;
        this.estabType = data.estabType || 0;
        this.exitNum = data.exitNum || '';
        this.guideCode = data.guideCode || 0;
        this.nameKind = data.nameKind || 0;
        this.patternCode = data.patternCode || '';
        this.voiceDir = data.voiceDir || 0;
        this.arrowCode = data.arrowCode || '';
        this.arrowFlag = data.arrowFlag || 0;
        this.names = [];
        for (var i = 0; i < data.names.length; i++) {
            var name = FM.dataApi.rdBranchName(data.names[i]);
            this.names.push(name);
        }
    },

    getIntegrate: function () {
        var data = {};
        data.pid = this.pid;
        data.rowId = this.rowId;
        data.branchPid = this.branchPid;
        data.branchType = this.branchType;
        data.estabType = this.estabType;
        data.exitNum = this.exitNum;
        data.guideCode = this.guideCode;
        data.nameKind = this.nameKind;
        data.patternCode = this.patternCode;
        data.voiceDir = this.voiceDir;
        data.arrowCode = this.arrowCode;
        data.arrowFlag = this.arrowFlag;
        // data.geoLiveType = this.geoLiveType;
        data.names = [];
        for (var i = 0; i < this.names.length; i++) {
            data.names.push(this.names[i].getIntegrate());
        }

        return data;
    },

    getSnapShot: function () {
        var data = {};
        data.pid = this.pid;
        data.rowId = this.rowId;
        data.branchPid = this.branchPid;
        data.branchType = this.branchType;
        data.estabType = this.estabType;
        data.exitNum = this.exitNum;
        data.guideCode = this.guideCode;
        data.nameKind = this.nameKind;
        data.patternCode = this.patternCode;
        data.voiceDir = this.voiceDir;
        data.arrowCode = this.arrowCode;
        data.arrowFlag = this.arrowFlag;
        data.geoLiveType = this.geoLiveType;
        data.names = [];
        for (var i = 0; i < this.names.length; i++) {
            data.names.push(this.names[i].getIntegrate());
        }

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

FM.dataApi.rdBranchDetail = function (data, options) {
    return new FM.dataApi.RdBranchDetail(data, options);
};
