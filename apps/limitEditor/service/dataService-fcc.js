angular.module('dataService').service('dsFcc', ['$http', '$q', 'ajax', 'dsOutput', function ($http, $q, ajax, dsOutput) {
    var showLoading; // 主页面控制Loading的开关的引用
    // 利用对象引用的特性，将本地变量showLoading指向主scope中的控制loadingbar显隐的开关对象
    // 主页面初始化的时候绑定一次即可
    this.referenceLoadingSwitch = function (loadingSwitch) {
        showLoading = loadingSwitch;
    };
    // 私有函数，修改loadingbar开关的状态
    var toggleLoading = function (flag) {
        if (showLoading) {
            showLoading.flag = flag;
        }
    };
    /** *
     * 获取情报作业列表
     */
    this.getInfoListData = function (params) {
        var defer = $q.defer();
        ajax.get('limit/getLimitDataByCondition', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('查找info信息出错：', data.errmsg, 'error');
                defer.resolve(-1);
            }
        }).error(function (rejection) {
            swal('提示', '查找info信息出错', 'error');
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /*
    * 更新情报数据接口
    * */
    this.updateInfoList = function (params) {
        var defer = $q.defer();
        ajax.get('limit/run', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('更新info信息出错：', data.errmsg, 'error');
                defer.resolve(-1);
            }
        }).error(function (rejection) {
            swal('提示', '更新info信息出错', 'error');
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /*
     * 提交几何
     * */
    this.submitGeo = function (params) {
        var defer = $q.defer();
        ajax.get('limit/run', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('提交几何出错：', data.errmsg, 'error');
                defer.resolve(-1);
            }
        }).error(function (rejection) {
            swal('提示', '提交几何出错', 'error');
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /*
    * 像情报部门发送接口，更新情报库
    * */
    this.updateToInfoDepartments = function (params) {
        var defer = $q.defer();
        ajax.get('InfoDataAction.do?operate=saveLimitFB', {
            data: {
                datas: JSON.stringify(params)
            },
            type: 'infoDepartment'
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('更新情报库出错：', data.errmsg, 'error');
                defer.resolve(-1);
            }
        }).error(function (rejection) {
            swal('提示', '更新情报库出错', 'error');
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /*
    * 查询作业组列表
    * */
    this.getGroupList = function (params) {
        var defer = $q.defer();
        ajax.get('limit/getMetaDataByCondition', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('查询作业组信息出错：', data.errmsg, 'error');
                defer.resolve(-1);
            }
        }).error(function (rejection) {
            swal('提示', '查询作业组信息出错', 'error');
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /*
    * 新增作业组
    * */
    this.addGroup = function (params) {
        var defer = $q.defer();
        ajax.get('limit/run', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('新增作业组信息出错：', data.errmsg, 'error');
                defer.resolve(-1);
            }
        }).error(function (rejection) {
            swal('提示', '新增作业组信息出错', 'error');
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /**
     * 查询大区库id
     * */
    this.getDbId = function (params) {
        var defer = $q.defer();
        ajax.get('limit/getRegionIdByAdmin', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('查询大区库信息出错：', data.errmsg, 'error');
                defer.resolve(-1);
            }
        }).error(function (rejection) {
            swal('提示', '查询大区库信息出错', 'error');
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /**
     * 查询行政区划几何
     * */
    this.getCityGeometry = function (params) {
        var defer = $q.defer();
        ajax.get('limit/getAdminPosition', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('查询行政区划几何出错：', data.errmsg, 'error');
                defer.resolve(-1);
            }
        }).error(function (rejection) {
            swal('提示', '查询行政区划几何出错', 'error');
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /*
     * 查询策略表
     * */
    this.getPolicyList = function (params) {
        var defer = $q.defer();
        ajax.get('limit/getMetaDataByCondition', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('查询策略表信息出错：', data.errmsg, 'error');
                defer.resolve(-1);
            }
        }).error(function (rejection) {
            swal('提示', '查询策略表信息出错', 'error');
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /*
     * 新增策略表
     * */
    this.addPolicy = function (params) {
        var defer = $q.defer();
        ajax.get('limit/run', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('新增策略表信息出错：', data.errmsg, 'error');
                defer.resolve(-1);
            }
        }).error(function (rejection) {
            swal('提示', '新增策略表信息出错', 'error');
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /*
     * 新增策略表
     * */
    this.copyToLine = function (params) {
        var defer = $q.defer();
        ajax.post('limit/run', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('复制出错：', data.errmsg, 'error');
                defer.resolve(-1);
            }
        }).error(function (rejection) {
            swal('提示', '复制出错', 'error');
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /*
     * 批量删除
     * */
    this.batchDelete = function (params) {
        var defer = $q.defer();
        ajax.get('limit/run', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('删除出错：', data.errmsg, 'error');
                defer.resolve(-1);
            }
        }).error(function (rejection) {
            swal('提示', '删除出错', 'error');
            defer.reject(rejection);
        });
        return defer.promise;
    };
}]);
