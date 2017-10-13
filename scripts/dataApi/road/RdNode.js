/**
 * Created by wangtun on 2015/9/9.
 * Class Rdnode
 */
FM.dataApi.RdNode = FM.dataApi.Feature.extend({
    setAttributes: function (data) {
        this.geoLiveType = 'RDNODE';
        this.pid = data.pid || '';
        this.kind = data.kind || 1;
        this.geometry = data.geometry || null;
        if (typeof data.adasFlag !== 'undefined') {
            this.adasFlag = data.adasFlag;
        } else {
            this.adasFlag = 2;
        }
        if (typeof data.editFlag !== 'undefined') {
            this.editFlag = data.editFlag;
        } else {
            this.editFlag = 1;
        }
        this.difGroupid = data.difGroupid || '';
        this.srcFlag = data.srcFlag || 6;
        this.digitalLevel = data.digitalLevel || 0;
        this.reserved = data.reserved || '';
        this.forms = [];
        this.meshes = [];

        for (var i = 0; i < data.forms.length; i++) {
            var form = FM.dataApi.rdNodeForm(data.forms[i]);
            this.forms.push(form);
        }

        for (var j = 0; j < data.meshes.length; j++) {
            var mesh = FM.dataApi.rdNodeMesh(data.meshes[j]);
            this.meshes.push(mesh);
        }

        this.links = data.links || [];
        this.rowId = data.rowId || null;
    },

    /**
     * 获取Node简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot: function () {
        var data = {};
        data.pid = this.pid;
        data.kind = this.kind;
        data.geometry = this.geometry;
        data.adasFlag = this.adasFlag;
        data.editFlag = this.editFlag;
        data.difGroupid = this.difGroupid;
        data.srcFlag = this.srcFlag;
        data.digitalLevel = this.digitalLevel;
        data.reserved = this.reserved;
        data.forms = this.forms;
        data.meshes = this.meshes;
        data.geoLiveType = this.geoLiveType;
        data.forms = [];

        for (var i = 0; i < this.forms.length; i++) {
            data.forms.push(this.forms[i].getIntegrate());
        }

        data.meshes = [];
        for (var j = 0; j < this.meshes.length; j++) {
            data.meshes.push(this.meshes[j].getIntegrate());
        }
        data.rowId = this.rowId;
        return data;
    },

    /**
     * 获取Node详细信息
     * @method getIntegrate
     *
     * @return {object} getIntegrate.
     */
    getIntegrate: function (boolBatch) {
        var data = {};
        data.pid = this.pid;
        data.kind = this.kind;
        data.geometry = this.geometry;
        data.adasFlag = this.adasFlag;
        data.editFlag = this.editFlag;
        data.difGroupid = this.difGroupid;
        data.srcFlag = this.srcFlag;
        data.digitalLevel = this.digitalLevel;
        data.reserved = this.reserved;
        data.geoLiveType = this.geoLiveType;
        data.forms = [];
        data.meshes = [];

        for (var i = 0; i < this.forms.length; i++) {
            data.forms.push(this.forms[i].getIntegrate(boolBatch));
        }

        for (var j = 0; j < this.meshes.length; j++) {
            data.meshes.push(this.meshes[j].getIntegrate(boolBatch));
        }
        data.rowId = this.rowId;
        return data;
    },

    toCanvasFeature: function () {
        var data = {
            i: this.pid,
            g: this.geometry.coordinates,
            m: {
                a: '',
                b: this.forms.map(function (it) {
                    return it.formOfWay;
                }).join(';'),
                c: this.kind
            }
        };

        return new FM.dataApi.CanvasFeature.RdNode(data);
    },

    /** *
     * 覆盖父类的方法，进行线对象对比
     * @param options
     */
    compareCommon: function (options) {
        var compareObj = options.compareObj || {};
        var rules = options.rules || [];
        for (var key in this) {
            if (this.hasOwnProperty(key) && !FM.Util.isContains(rules, key)) {
                if (FM.Util.isArray(this[key])) {
                    if (this[key].length > 0 && compareObj[key].length > 0) {
                        this[key] = this._compareArr1(this, compareObj, key);
                    } else {
                        this[key] = [];
                    }
                } else if (FM.Util.isObject(this[key])) {
                    var com = this.compareCommon(FM.Util.clone(this[key]), FM.Util.clone(compareObj[key]));
                    this[key] = com;
                } else if (this[key] != compareObj[key]) {
                    this[key] = -1;
                }
            }
        }
        return this;
    },

    _compareArr1: function (Base, From, key) {
        var result = [];
        for (var i = 0; i < Base[key].length; i++) {
            for (var j = 0; j < From[key].length; j++) {
                var com = Base[key][i].compareNodeDiff({
                    key: key,
                    compareObj: From[key][j],
                    rules: ['rowId', 'nodePid', 'geoLiveType', 'options', '_initHooksCalled', '_originalJson', 'meshes']
                });
                var compareResult = FM.Util.isEmptyObject(com);
                if (compareResult) {
                    // 保存对应关系
                    var correspondingArr = [];
                    if (Base[key][i].options && !Base[key][i].options.correspondingArr) {
                        Base[key][i].options.correspondingArr = [];
                        correspondingArr = [{
                            nodePid: Base[key][i].nodePid,
                            rowId: Base[key][i].rowId
                        }, {
                            nodePid: From[key][j].nodePid,
                            rowId: From[key][j].rowId
                        }];
                    } else {
                        correspondingArr.push({
                            nodePid: From[key][j].nodePid,
                            rowId: From[key][j].rowId
                        });
                    }
                    Base[key][i].options.correspondingArr = Base[key][i].options.correspondingArr.concat(correspondingArr);
                    result.push(Base[key][i]);
                }
            }
        }
        return result;
    }
});

/** *
 * Rdnode初始化函数
 * @param id
 * @param point 初始化rdnode的点
 * @param options 其他可选参数
 * @returns {.dataApi.rdNode}
 */
FM.dataApi.rdNode = function (data, options) {
    return new FM.dataApi.RdNode(data, options);
};
