/**
 * Created by wangtun on 2016/3/15.
 */
FM.dataApi.RdBranchSignBoard = FM.dataApi.Feature.extend({

    setAttributes: function (data) {
        this.geoLiveType = 'RDBRANCHSIGNBOARD';
        this.pid = data.pid;
        this.rowId = data.rowId || null;
        this.branchPid = data.branchPid;
        this.backimageCode = data.backimageCode || '';
        this.arrowCode = data.arrowCode || '';
        this.names = [];
        for (var i = 0; i < data.names.length; i++) {
            var name = FM.dataApi.rdBranchSignBoardName(data.names[i]);
            this.names.push(name);
        }
    },

    getIntegrate: function () {
        var data = {};
        data.pid = this.pid;
        data.rowId = this.rowId;
        data.branchPid = this.branchPid;
        data.backimageCode = this.backimageCode;
        data.arrowCode = this.arrowCode;
        data.names = [];
        if (this.names.length) {
            for (var i = 0; i < this.names.length; i++) {
                data.names.push(this.names[i].getIntegrate());
            }
        }
        return data;
    },

    getSnapShot: function () {
        var data = {};
        data.pid = this.pid;
        data.rowId = this.rowId;
        data.branchPid = this.branchPid;
        data.backimageCode = this.backimageCode;
        data.arrowCode = this.arrowCode;
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

FM.dataApi.rdBranchSignBoard = function (data, options) {
    return new FM.dataApi.RdBranchSignBoard(data, options);
};
