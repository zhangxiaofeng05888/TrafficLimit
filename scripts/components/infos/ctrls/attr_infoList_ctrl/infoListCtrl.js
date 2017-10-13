/**
 * Created by Chensonglin on 17.4.10.
 */
angular.module('app').controller('infoListCtrl', ['$scope', 'NgTableParams', function ($scope, NgTableParams) {
    var dataServiceInfo = fastmap.service.DataServiceInfo.getInstance();
    function ParameterModel(data) { // 数据模型
        this.i_level = [
            { id: 1, name: '一级', checked: false },
            { id: 2, name: '二级', checked: false },
            { id: 3, name: '三级', checked: false }
        ];
        this.c_isAdopted = [
            { id: 0, name: '未处理' },
            { id: 1, name: '未采纳' },
            { id: 2, name: '采纳' },
            { id: 3, name: '部分采纳' }
        ];
        this.denyReason = [
            { id: 0, name: '影像不清晰' },
            { id: 1, name: '库中已有' },
            { id: 2, name: '无图片' },
            { id: 3, name: '一级情报' },
            { id: 4, name: '无效轨迹' },
            { id: 5, name: '不需要处理' }
        ];
        if (data) {
            this.globalId = data.globalId || '';
            this.i_infoCode = data.i_infoCode || '';
            this.i_infoName = data.i_infoName || '';
            this.i_topicName = data.i_topicName || '';
            this.i_infoContent = data.i_infoContent || '';
            this.i_infoTypeName = data.i_infoTypeName || '';
            this.i_gainType = data.i_gainType || '';
            this.useBegin = data.useBegin || '';
            this.useEnd = data.useEnd || '';
            this.pubBegin = data.pubBegin || '';
            this.pubEnd = data.pubEnd || '';
        } else {
            this.globalId = '';
            this.i_infoCode = '';
            this.i_infoName = '';
            this.i_topicName = '';
            this.i_infoContent = '';
            this.i_infoTypeName = '';
            this.i_gainType = '';
            this.useBegin = '';
            this.useEnd = '';
            this.pubBegin = '';
            this.pubEnd = '';
        }
    }

    $scope.loadTableDataMsg = '数据加载中...';
    $scope.parameterModel = new ParameterModel();
    // 处理情报等级
    $scope.levelselected = [];
    // 反馈
    $scope.adoptedselected = [];
    // 未采纳
    $scope.denyselected = [];
    var _updateSelection = function ($event, id, selectedArray) {
        var checkbox = $event.target;
        var checked = checkbox.checked;
        if (checked) {
            selectedArray.push(id);
        } else {
            var idx = selectedArray.indexOf(id);
            selectedArray.splice(idx, 1);
        }
    };

    var _isChecked = function (id, selectedArray) {
        return selectedArray.indexOf(id) >= 0;
    };

    // 情报等级
    $scope.isLevelChecked = function (id) {
        return _isChecked(id, $scope.levelselected);
    };

    $scope.updateLevelSelection = function ($event, id) {
        _updateSelection($event, id, $scope.levelselected);
    };

    // 情报反馈
    $scope.isAdoptedChecked = function (id) {
        return _isChecked(id, $scope.adoptedselected);
    };

    $scope.updateAdoptedSelection = function ($event, id) {
        _updateSelection($event, id, $scope.adoptedselected);
    };

    // 情报未采纳原因
    $scope.isDenyChecked = function (id) {
        return _isChecked(id, $scope.denyselected);
    };

    $scope.updateDenySelection = function ($event, id) {
        _updateSelection($event, id, $scope.denyselected);
    };

    var getParameter = function () {
        var para = {};
        // 拷贝$scope.parameterModel中不为空的属性作为查询条件传给后台
        Object.assign(para, JSON.parse(JSON.stringify($scope.parameterModel, function (key, value) {
            if (value === '') {
                return undefined;
            }
            return value;
        })));
        if ($scope.levelselected.length != 0) {
            para.i_level = $scope.levelselected;
        } else {
            delete para.i_level;
        }
        if ($scope.adoptedselected.length != 0) {
            para.c_isAdopted = $scope.adoptedselected;
        } else {
            delete para.c_isAdopted;
        }
        if ($scope.denyselected.length != 0) {
            para.denyReason = $scope.denyselected;
        } else {
            delete para.denyReason;
        }
        return para;
    };

    function initTable(infoFilter) {
        $scope.defaultConfigTableParams = new NgTableParams({
            page: 1,
            count: 10
        }, {
            counts: [],
            getData: function ($defer, params) {
                var parameter = infoFilter;
                parameter.pageNum = params.page();
                parameter.pageSize = params.count();

                dataServiceInfo.getInfoList(parameter).then(function (data) {
                    $scope.loadTableDataMsg = '列表无数据';
                    $scope.defaultConfigTableParams.total(data.totalCount);
                    $defer.resolve(data.list);
                });
            }
        });
    }
    $scope.infoFilterFlag = true;
    $scope.resetFilter = function () {
        $scope.levelselected = [];
        $scope.showInfoList = {
            display: 'none'
        };
        $scope.parameterModel = new ParameterModel();
    };
    $scope.searchInfo = function () {
        $scope.showInfoList = {
            display: 'block'
        };
        var para = getParameter();
        initTable(para);
    };
    $scope.hideInfoFilter = function () {
        $scope.infoFilterFlag = false;
    };
    $scope.showInfoFilter = function () {
        $scope.infoFilterFlag = true;
    };

    // 表格配置搜索;
    $scope.filters = {
        i_infoName: '',
        langCode: ''
    };

    function getStatus(scope, row) {
        var statusObj = { 0: '未处理', 1: '未采纳', 2: '采纳', 3: '部分采纳' };
        return statusObj[row.c_isAdopted];
    }
    $scope.typeTableCols = [
        {
            field: 'i_infoName',
            title: '名称',
            width: '35px',
            show: true
        },
        {
            field: 'i_level',
            title: '等级',
            width: '35px',
            show: true
        },
        {
            field: 'c_isAdopted',
            title: '反馈',
            width: '35px',
            show: true,
            getValue: getStatus
        }
    ];


    $scope.$on('FilterData', function (event, data) {
        if (data) {
            $scope.parameterModel = new ParameterModel(data);
            $scope.levelselected = data.i_level || [];
            $scope.denyselected = data.denyReason || [];
            $scope.adoptedselected = data.c_isAdopted || [];
            $scope.searchInfo();
        }
    });
    $scope.selectVal = function (row, index, type) {
        var fdata = getParameter();
        $scope.$emit('ToDetail', {
            detail: row,
            filterData: fdata
        });
    };
}]);
