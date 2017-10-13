/**
 * Created by chenxiao on 2016/5/3.
 * Class DataModel 数据模型基类
 * 继承后可重写相关的方法，一般要求重写dataModelType属性，setAttributes、getSnapShot方法
 */
FM.dataApi.DataModel = FM.Class.extend({
    options: {},
    /**
     * @param id
     * 模型ID
     */
    _id: null,

    /**
     * @param dataModelType
     * 模型类型
     */
    dataModelType: 'DATA_MODEL',

    /**
     * @param _originalJson
     * 原始json
     */
    _originalJson: null,

    _deleted: false,

    _errors: {
        edit: {}, // 编辑过程中的错误信息
        form: {} // 表单验证中的错误信息
    },

    /**
     * @param data
     * @param options
     */
    initialize: function (data, options) {
        FM.setOptions(this, options);

        this.setAttributes.apply(this, arguments);
        // // zxm修改，如有问题请及时沟通
        var boolBatch = (options && options.boolBatch) === true ? options.boolBatch : false;
        this._originalJson = this.getIntegrate(boolBatch);
    },

    /**
     * 设置对象属性方法，需要重写
     */
    setAttributes: function (data) {},

    /**
     * 获取对象完整属性信息，需要重写
     * @return 全属性对象
     */
    getIntegrate: function () {},

    /**
     * 获取对象概要属性信息，需要重写
     * @return 概要属性对象
     */
    getSnapShot: function () {},

    /**
     * 获取原始数据信息
     * @return 原始数据
     */
    getOriginalData: function () {
        return this._originalJson;
    },

    _compareJson: function (newJson, oldJson) {
        var changed = {};
        var newVal,
            oldVal,
            tempObj,
            tempArray;
        var k,
            i,
            j,
            delFlag;
        if (newJson && !oldJson) { // 新增
            for (k in newJson) {
                if (newJson.hasOwnProperty(k) && k !== 'geometry') {
                    newVal = newJson[k];
                    if (typeof newVal === 'object') {
                        if (FM.Util.isObject(newVal)) {
                            tempObj = this._compareJson(newVal, null);
                            if (tempObj) {
                                changed[k] = tempObj;
                            }
                        } else if (FM.Util.isArray(newVal)) {
                            tempArray = [];
                            for (i = 0; i < newVal.length; i++) {
                                tempObj = this._compareJson(newVal[i], null);
                                if (tempObj) {
                                    tempArray.push(tempObj);
                                }
                            }
                            if (tempArray.length > 0) {
                                changed[k] = tempArray;
                            }
                        }
                    } else {
                        changed[k] = newVal;
                    }
                }
            }
            changed.objStatus = 'INSERT';
        } else if (!newJson && oldJson) { // 删除
            for (k in oldJson) {
                if (oldJson.hasOwnProperty(k) && k !== 'geometry') {
                    oldVal = oldJson[k];
                    if (typeof oldVal === 'object') {
                        if (FM.Util.isObject(oldVal)) {
                            tempObj = this._compareJson(null, oldVal);
                            if (tempObj) {
                                changed[k] = tempObj;
                            }
                        } else if (FM.Util.isArray(oldVal)) {
                            tempArray = [];
                            for (i = 0; i < oldVal.length; i++) {
                                tempObj = this._compareJson(null, oldVal[i]);
                                if (tempObj) {
                                    tempArray.push(tempObj);
                                }
                            }
                            if (tempArray.length > 0) {
                                changed[k] = tempArray;
                            }
                        }
                    } else if (k === 'rowId' || k === 'pid' || k === 'linkPid' || k === 'nodePid' || k === 'formOfWay') {
                        changed[k] = oldJson[k];
                    }
                }
            }
            changed.objStatus = 'DELETE';
        } else { // 修改
            for (k in newJson) {
                // 不比较几何坐标
                if (newJson.hasOwnProperty(k) && k !== 'geometry') {
                    newVal = newJson[k];
                    oldVal = oldJson[k];
                    if (typeof newVal === 'object') {
                        if (FM.Util.isObject(newVal) && FM.Util.isObject(oldVal)) {
                            tempObj = this._compareJson(newVal, oldVal);
                            if (tempObj) {
                                changed[k] = tempObj;
                            }
                        } else if (FM.Util.isArray(newVal) && FM.Util.isArray(oldVal)) {
                            tempArray = [];
                            for (i = 0; i < newVal.length; i++) {
                                tempObj = null;
                                if (newVal[i].hasOwnProperty('rowId') && newVal[i].rowId) { // 修改
                                    for (j = 0; j < oldVal.length; j++) {
                                        if (newVal[i].rowId === oldVal[j].rowId) {
                                            tempObj = this._compareJson(newVal[i], oldVal[j]);
                                            // 增加返回optins属性，主要为了批量编辑
                                            if (newVal[i].options && newVal[i].options.correspondingArr && tempObj) {
                                                tempObj.options = newVal[j].options;
                                            }
                                            break;
                                        }
                                    }
                                } else { // 新增
                                    tempObj = this._compareJson(newVal[i], null);
                                }
                                if (tempObj) {
                                    tempArray.push(tempObj);
                                }
                            }
                            for (i = 0; i < oldVal.length; i++) { // 删除
                                delFlag = true;
                                for (j = 0; j < newVal.length; j++) {
                                    if (newVal[j].rowId === oldVal[i].rowId) {
                                        delFlag = false;
                                        break;
                                    }
                                }
                                if (delFlag) {
                                    tempObj = this._compareJson(null, oldVal[i]);
                                    if (tempObj) {
                                        tempArray.push(tempObj);
                                    }
                                }
                            }
                            if (tempArray.length > 0) {
                                changed[k] = tempArray;
                            }
                        }
                    } else if (newVal !== oldVal) {
                        changed[k] = newVal;
                    }
                }
            }
            if (!FM.Util.isEmptyObject(changed)) {
                if (newJson.hasOwnProperty('rowId')) {
                    changed.rowId = newJson.rowId;
                }
                if (newJson.hasOwnProperty('pid') && !changed.hasOwnProperty('pid')) {
                    changed.pid = newJson.pid;
                }
                if (newJson.hasOwnProperty('linkPid') && !changed.hasOwnProperty('linkPid')) {
                    changed.linkPid = newJson.linkPid;
                }
                changed.objStatus = 'UPDATE';
            }
        }
        if (FM.Util.isEmptyObject(changed)) { // 如果没有任何变化，则返回null
            return null;
        }
        return changed;
    },

    /**
     * @param options
     * @return {Object} result.
     */
    compareCommon: function (options) {
        var compareObj = options.compareObj || {};
        var rules = options.rules || [];

        for (var key in Object.keys(this)) {
            if (!FM.Util.isContains(rules, Object.keys(this)[key])) {
                if (this.hasOwnProperty(Object.keys(this)[key]) && compareObj.hasOwnProperty(Object.keys(this)[key])) {
                    if (this[Object.keys(this)[key]] != compareObj[Object.keys(this)[key]]) {
                        this[Object.keys(this)[key]] = -1;
                    }
                }
            }
        }
        return this;
    },

    /** *
     * 比较对象不同属性，并返回不同属性值
     * @param options {
     *    compareObj:'',//要比较对象
     *    rules:''//对比原则
     * }
     */
    compareDiff: function (options) {
        var compareObj = options.compareObj || {};
        var rules = options.rules || [];
        var item = options.key || null; // 当前循环的link对象中的key
        var boolDirect = options.sameDirect;
        var result = {};
        for (var key in this) {
            if (!FM.Util.isContains(rules, key)) {
                if (this.hasOwnProperty(key) && compareObj.hasOwnProperty(key)) {
                    if (boolDirect) {
                        if (this[key] != compareObj[key]) {
                           // result[key] = compareObj[key];
                            result[key] = '-';
                        }
                    } else {
                        switch (item) {
                            case 'speedlimits':
                                if (key == 'fromSpeedLimit') {
                                    if (this[key] != compareObj.toSpeedLimit) {
                                        result[key] = '-';
                                    }
                                } else if (key == 'toSpeedLimit') {
                                    if (this[key] != compareObj.fromSpeedLimit) {
                                        result[key] = '-';
                                    }
                                } else if (key == 'fromLimitSrc') {
                                    if (this[key] != compareObj.toLimitSrc) {
                                        result[key] = '-';
                                    }
                                } else if (key == 'toLimitSrc') {
                                    if (this[key] != compareObj.fromLimitSrc) {
                                        result[key] = '-';
                                    }
                                } else if (this[key] != compareObj[key]) {
                                    result[key] = '-';
                                }
                                break;
                            case 'limit':
                            case 'limitTrucks':
                                if (key == 'limitDir') {
                                    if (this[key] == 2 && compareObj[key] != 3) {
                                        this[key] = '-';
                                    } else if (this[key] == 3 && compareObj[key] != 2) {
                                        this[key] = '-';
                                    }
                                } else if (this[key] != compareObj[key]) {
                                    result[key] = '-';
                                }
                                break;
                            case 'intRtics':
                            case 'rtics':
                                if (key == 'rticDir') {
                                    if (this[key] == 1 && compareObj[key] != 2) {
                                        this[key] = '-';
                                    } else if (this[key] == 2 && compareObj[key] != 1) {
                                        this[key] = '-';
                                    }
                                } else if (this[key] != compareObj[key]) {
                                    result[key] = '-';
                                }
                                break;
                            case 'sidewalks':
                            case 'walkstairs':
                                if (key == 'workDir') {
                                    if (this[key] == 1 && compareObj[key] != 2) {
                                        this[key] = '-';
                                    } else if (this[key] == 2 && compareObj[key] != 1) {
                                        this[key] = '-';
                                    }
                                } else if (this[key] != compareObj[key]) {
                                    result[key] = '-';
                                }
                                break;
                            default:
                                if (this[key] != compareObj[key]) {
                                    result[key] = '-';
                                }
                        }
                    }
                }
            }
        }
        return result;
    },

    compareNodeDiff: function (options) {
        var compareObj = options.compareObj || {};
        var rules = options.rules || [];
        var item = options.key || null; // 当前循环的link对象中的key
        var result = {};
        for (var key in this) {
            if (!FM.Util.isContains(rules, key)) {
                if (this.hasOwnProperty(key) && compareObj.hasOwnProperty(key)) {
                    if (this[key] != compareObj[key]) {
                        result[key] = '-';
                    }
                }
            }
        }
        return result;
    },


    /**
     * 获取对象的属性变化
     * @return 变化的属性对象
     */
    getChanges: function (boolBatch) {
        return this._compareJson(this.getIntegrate(boolBatch), this._originalJson);
    },

    /**
     * 对象复制方法
     * @return 一个全新的对象
     */
    clone: function () {
        return new this.constructor(this.getIntegrate());
    },

    /**
     * 逻辑删除对象
     */
    delete: function () {
        this._deleted = true;
    },

    undelete: function () {
        this._deleted = false;
    },

    deleted: function () {
        return this._deleted;
    },

    /**
     * setError 和 removeError 是一对，用于编辑过程中的
     */
    addError: function (key, errorMessage, errorLevel) {
        this._errors.edit[key] = {
            code: errorLevel || 1, // 1：严重错误；2：提示信息；3：确认信息
            message: errorMessage
        };
    },
    removeError: function (key) {
        delete this._errors.edit[key];
    },

    // 内部方法：属性验证方法入口
    // 注意：此方法需要在子模型里重写
    _doValidate: function () {
        // this._pushError('错误键值', '错误描述');
    },
    /**
     * _pushError 和 _clearErrors是一对
     * 内部方法，只用于doValidate方法中
     */
    _pushError: function (key, errorMessage, errorLevel) {
        this._errors.form[key] = {
            code: errorLevel || 1, // 1：严重错误；2：提示信息；3：确认信息
            message: errorMessage
        };
    },
    _clearErrors: function () {
        this._errors.form = {};
    },
    getErrors: function () {
        return this._errors;
    },
    validate: function () {
        this._clearErrors();
        this._doValidate();
        return FM.Util.isEmptyObject(this._errors.edit) && FM.Util.isEmptyObject(this._errors.form);
    }
});
