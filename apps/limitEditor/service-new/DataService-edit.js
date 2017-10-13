/**
 * Created by xujie3949 on 2017/1/6.
 */

fastmap.service.DataServiceEdit = L.Class.extend({
    initialize: function () {
        // 绑定函数作用域
        FM.Util.bind(this);
    },

    createAjaxPromise: function (method, url, parameter) {
        var fullUrl;
        if (parameter.urlType == 'spec') {
            fullUrl = App.Util.getSpecUrl(url);
        } else {
            fullUrl = App.Util.getFullUrl(url);
        }

        var promise = new Promise(function (resolve, reject) {
            var options = {
                url: fullUrl,
                requestParameter: parameter,
                timeout: 100000,
                responseType: 'json',
                onSuccess: function (json) {
                    if (json.errcode === 0 || json.errcode === 999) { // 操作成功
                        resolve(json.data);
                    } else {
                        reject(json.errmsg);
                    }
                },
                onFail: function (errmsg) {
                    reject(errmsg);
                },
                onError: function (errmsg) {
                    reject(errmsg);
                },
                onTimeout: function (errmsg) {
                    reject(errmsg);
                }
            };
            fastmap.mapApi.ajax[method](options);
        });

        return promise;
    },

    /**
     * 根据pid查询要素详细信息接口
     * @param  {[type]} param [description]
     * @return {[type]}       [description]
     */
    editGetByPid: function (param) {
        param = param || {};
        param.dbId = param.dbId || App.Temp.dbId;

        return this.createAjaxPromise('get', 'edit/getByPid', param);
    },

    /**
     * 执行数据编辑操作接口（道路）
     * @param  {[type]} param [description]
     * @return {[type]}       [description]
     */
    editRun: function (param) {
        param = param || {};
        param.dbId = param.dbId || App.Temp.dbId;
        param.subtaskId = param.subTaskId || App.Temp.subTaskId;

        return this.createAjaxPromise('post', 'edit/run/', param);
    },

    /**
     * 执行数据编辑操作接口（POI）
     * @param  {[type]} param [description]
     * @return {[type]}       [description]
     */
    editRowRun: function (param) {
        param = param || {};
        param.dbId = param.dbId || App.Temp.dbId;
        param.subtaskId = param.subTaskId || App.Temp.subTaskId;

        return this.createAjaxPromise('post', 'editrow/run/', param);
    },

    getByPid: function (pid, geoLiveType, dbId) {
        var params = {
            dbId: dbId,
            type: geoLiveType,
            pid: pid
        };

        return this.editGetByPid(params);
    },

    //  查询删除状态的要素，目前只有点限速有查询删除状态要素的需求；getByPid 不支持查询删除状态的要素
    getDelByPid: function (pid, geoLiveType, dbId) {
        var params = {
            dbId: dbId || App.Temp.dbId,
            type: geoLiveType,
            pid: pid
        };

        return this.createAjaxPromise('get', 'edit/getDelByPid', params);
    },

    getByPids: function (pids, geoLiveType) {
        var params = {
            dbId: App.Temp.dbId,
            type: geoLiveType,
            pids: pids
        };

        var url = 'edit/getByPids';

        return this.createAjaxPromise('get', url, params);
    },

    /**
     * 根据道路id获得分歧的详细属性(branchType = 0、1、2、3、4、6、8、9)
     * @param detailId     分歧的DetailId
     * @param branchType   分歧类型
     */
    getBranchByDetailId: function (detailId, branchType, dbId) {
        var params = {
            dbId: dbId,
            type: 'RDBRANCH',
            detailId: detailId,
            rowId: '',
            branchType: branchType
        };

        return this.editGetByPid(params);
    },

    /**
     * 根据道路id获得分歧的详细属性(branchType = 5、7)
     * @param rowId        分歧的rowId
     * @param branchType   分歧类型
     */
    getBranchByRowId: function (rowId, branchType, dbId) {
        var params = {
            dbId: dbId,
            type: 'RDBRANCH',
            detailId: 0,
            rowId: rowId,
            branchType: branchType
        };

        return this.editGetByPid(params);
    },

    getByCondition: function (params) {
        if (params) {
            params.dbId = params.dbId || App.Temp.dbId;
        }

        var url = 'edit/getByCondition';

        return this.createAjaxPromise('get', url, params);
    },

    create: function (geoLiveType, data) {
        var params = {
            command: 'CREATE',
            type: geoLiveType,
            data: data
        };

        return this.editRun(params);
    },

    joinFaces: function (geoLiveType, data) {
        var params = {
            command: 'RELATION',
            type: geoLiveType,
            data: data
        };

        return this.editRun(params);
    },

    upDownDepart: function (geoLiveType, data) {
        var params = {
            command: 'UPDOWNDEPART',
            type: geoLiveType,
            distance: data.distance,
            data: data.data
        };

        return this.editRun(params);
    },

    createSideRoad: function (geoLiveType, data) {
        var params = {
            command: 'CREATESIDEROAD',
            type: geoLiveType,
            distance: data.distance,
            sideType: data.sideType,
            sNodePid: data.sNodePid,
            data: data.data
        };

        return this.editRun(params);
    },

    addJoinBorder: function (geoLiveType, data) {
        var opDesc = '创建' + geoLiveType;
        var params = {
            user: App.Temp.userId,
            g_location: data.g_location,
            content: data.content,
            memo: data.memo
        };
        var url = 'fcc/tip/createEdgeMatch/';
        return this.createAjaxPromise('post', url, params);
    },

    update: function (geoLiveType, data) {
        var params = {
            command: 'UPDATE',
            type: geoLiveType,
            data: data
        };

        return this.editRun(params);
    },

    changeLinkDirect: function (pid, geoLiveType, data) {
        var params = {
            command: 'UPDATE',
            type: geoLiveType,
            objId: pid,
            data: data
        };

        return this.editRun(params);
    },

    adjustImage: function (url) {
        return this.createAjaxPromise('get', url, {});
    },
    
    repair: function (geoLiveType, id, data) {
        var params = {
            command: 'REPAIR',
            type: geoLiveType,
            objId: id,
            data: data
        };

        return this.editRun(params);
    },

    addPair: function (geoLiveType, data) {
        var params = {
            command: 'CREATE',
            type: 'RDELECEYEPAIR',
            data: data
        };

        return this.editRun(params);
    },

    move: function (geoLiveType, data) {
        var params = {
            command: 'MOVE',
            type: geoLiveType,
            data: data
        };

        return this.editRun(params);
    },

    moveObj: function (geoLiveType, param) {
        var params = {
            command: 'MOVE',
            type: geoLiveType,
            data: {}
        };
        FM.extend(params, param);

        return this.editRun(params);
    },

    batch: function (geoLiveType, data) {
        var params = {
            command: 'BATCH',
            type: geoLiveType,
            data: data
        };

        return this.editRun(params);
    },

    /**
     * 由于参数不规范,临时对应
     * @param geoLiveType
     * @param data
     * @returns {*}
     */
    batchCross: function (geoLiveType, pid, data) {
        var params = {
            command: 'BATCH',
            type: geoLiveType,
            objId: pid,
            data: data
        };

        return this.editRun(params);
    },

    createPOI: function (geoLiveType, data) {
        var params = {
            command: 'CREATE',
            type: geoLiveType,
            data: data
        };

        return this.editRowRun(params);
    },

    movePOI: function (geoLiveType, param) {
        var params = {
            command: 'MOVE',
            type: geoLiveType,
            data: {}
        };
        FM.extend(params, param);

        return this.editRowRun(params);
    },

    batchMovePOI: function (data) {
        var params = {
            command: 'BATCHMOVE',
            type: 'IXPOI',
            data: data
        };

        return this.editRowRun(params);
    },

    queryBySpatial: function (data) {
        var url = 'edit/getBySpatial';
        var params = {
            dbId: App.Temp.dbId,
            types: data.types,
            wkt: data.wkt
        };
        return this.createAjaxPromise('post', url, params);
    },
    /** *
     * poi要素创建父poi
     */
    createParent: function (param) {
        var params = {
            command: 'CREATE',
            type: 'IXPOIPARENT',
            objId: param.pid,
            parentPid: param.parentPid
        };

        return this.editRowRun(params);
    },

    /** *
     * poi要素修改父poi
     */
    updateParent: function (param) {
        var params = {
            command: 'UPDATE',
            type: 'IXPOIPARENT',
            objId: param.pid,
            parentPid: param.parentPid
        };

        return this.editRowRun(params);
    },

    /** *
     * poi要素删除父poi
     */
    deleteParent: function (param) {
        var params = {
            command: 'DELETE',
            type: 'IXPOIPARENT',
            objId: param.pid
        };

        return this.editRowRun(params);
    },

    /** *
     * poi 同一关系
     */
    createSamePoi: function (param) {
        var params = {
            command: 'CREATE',
            type: 'IXSAMEPOI',
            poiPids: param.pids
        };

        return this.editRowRun(params);
    },

    updateObj: function (geoLiveType, param) {  // 临时这么写，等服务接口规范后再修改
        var params = {
            command: 'UPDATE',
            type: geoLiveType,
            data: {}
        };
        FM.extend(params, param);

        return this.editRun(params);
    },

    /**
     * 由于参数不规范,临时对应
     * @param geoLiveType
     * @param data
     * @returns {*}
     */
    createNode: function (geoLiveType, linkPid, data) {
        var params = {
            command: 'CREATE',
            type: geoLiveType,
            objId: linkPid,
            data: data
        };

        return this.editRun(params);
    },

    /**
     * 由于参数不规范,临时对应
     * @param geoLiveType
     * @param data
     * @returns {*}
     */
    moveNode: function (geoLiveType, nodePid, data) {
        var params = {
            command: 'MOVE',
            type: geoLiveType,
            objId: nodePid,
            data: data
        };

        return this.editRun(params);
    },

    getObject: function (geoLiveType, pids, dbId) {
        var url = 'edit/getObject/';

        var params = {
            dbId: dbId || App.Temp.dbId,
            type: geoLiveType,
            pids: pids
        };

        return this.createAjaxPromise('post', url, params);
    },

    getDeleteConfirmInfo: function (pid, geoLiveType) {
        var params = {
            command: 'DELETE',
            type: geoLiveType,
            objId: pid,
            infect: 1
        };

        return this.editRun(params);
    },

    delete: function (pid, geoLiveType) {
        var params = {
            command: 'DELETE',
            type: geoLiveType,
            objId: pid
        };

        return this.editRun(params);
    },

    /**
     * 获取删除分歧的确认信息(branchType = 5、7)
     * @param detailid
     * @param branchType
     */
    getDeleteBranchConfirmInfoByRowId: function (rowId, branchType) {
        var params = {
            command: 'DELETE',
            type: 'RDBRANCH',
            detailId: 0,
            rowId: rowId,
            branchType: branchType,
            infect: 1
        };

        return this.editRun(params);
    },

    /**
     * 根据rowId删除分歧(branchType = 5、7)
     * @param detailid
     * @param branchType
     */
    deleteBranchByRowId: function (rowId, branchType) {
        var params = {
            command: 'DELETE',
            type: 'RDBRANCH',
            detailId: 0,
            rowId: rowId,
            branchType: branchType
        };

        return this.editRun(params);
    },

    /**
     * 获取删除分歧的确认信息(branchType = 除了5、7)
     * @param detailid
     * @param branchType
     */
    getDeleteBranchConfirmInfoByDetailId: function (detailId, branchType) {
        var params = {
            command: 'DELETE',
            type: 'RDBRANCH',
            detailId: detailId,
            rowId: '',
            branchType: branchType,
            infect: 1
        };

        return this.editRun(params);
    },

    /**
     * 根据detailId删除分歧(branchType = 除了5、7)
     * @param detailid
     * @param branchType
     */
    deleteBranchByDetailId: function (detailId, branchType) {
        var params = {
            command: 'DELETE',
            type: 'RDBRANCH',
            detailId: detailId,
            rowId: '',
            branchType: branchType
        };

        return this.editRun(params);
    },

    updateChanges: function (pid, geoLiveType, changes) {
        var params = {
            command: 'UPDATE',
            type: geoLiveType,
            objId: pid,
            data: changes
        };

        return this.editRun(params);
    },

    breakLinks: function (geoLiveType, links, data) {
        var params = {
            command: 'TOPOBREAK',
            type: geoLiveType,
            objId: links,
            data: data
        };

        return this.editRun(params);
    },

    /**
     * 根据外包矩形查询所在的大区库
     * @param bbox
     * @returns {*}
     */
    queryDbIdByBbox: function (bbox) {
        return this.createAjaxPromise('post', 'edit/getDbIds/', bbox);
    },

    destroy: function () {
        fastmap.service.DataServiceEdit.instance = null;
    },

    statics: {
        instance: null,

        getInstance: function () {
            if (!fastmap.service.DataServiceEdit.instance) {
                fastmap.service.DataServiceEdit.instance =
                    new fastmap.service.DataServiceEdit();
            }
            return fastmap.service.DataServiceEdit.instance;
        }
    }
});
