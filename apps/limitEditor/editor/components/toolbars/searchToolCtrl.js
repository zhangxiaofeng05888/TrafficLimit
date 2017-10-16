/**
 * Created by wuzhen on 2017/1/12.
 */
angular.module('app').controller('searchToolCtrl', ['$scope', 'dsEdit',
    function ($scope, dsEdit) {
        var eventCtrl = new fastmap.uikit.EventController();
        $scope.closeImg = '../../images/newPoi/rightPanelIcon/icon-right-close.png';
        $scope.openImg = '../../images/newPoi/rightPanelIcon/icon-right-open.png';
        $scope.showKindFlag = false; // 树形结构显示标志
        $scope.showResultFlag = false; // 树形结构显示标志
        $scope.searchLoading = false;  // 搜索加载效果
        $scope.searchText = '';
        $scope.pagation = {
            pageNum: 1,
            pageSize: 10,
            total: 1,
            maxSize: 2
        };
        $scope.searchParma = {
            pageNum: $scope.pagation.pageNum,
            pageSize: $scope.pagation.pageSize,
            data: {},
            type: ''
        };
        $scope.selectedItem = {
            key: 'pid',
            name: 'POI',
            type: 'IXPOI',
            selected: true
        };
        $scope.searchDataList = [];

        // 搜索框效果;
        $scope.searchInputStatus = true;

        // 当再下拉框外点的时候再隐藏
        $(document).click(function (e) {
            var clickTarget = e.toElement;
            if (clickTarget != $('.searchInput')[0]) {
                var obj = $('.searchPanel')[0];
                var isChild = $(clickTarget).parents().hasClass('searchPanel');
                var isSelf = (clickTarget == obj);
                var notHide = (isSelf || isChild);
                if (!notHide) {
                    $scope.$apply(function () {
                        $scope.hideDownPanel();
                    });
                }
            }
        });

        $scope.showAction = function (evt) {
            $scope.searchInputStatus = !$scope.searchInputStatus;
            var obj = evt.currentTarget;
            var container = $(obj).closest('.inputWrapper');
            if (!$scope.searchInputStatus) {
                container.addClass('active');
                evt.preventDefault();
            } else if ($scope.searchInputStatus) {
                container.removeClass('active');
                container.find('.searchInput').val('');
                $scope.hideDownPanel();
            }
        };
        // 显示搜索加载效果;
        $scope.showLoadingAffected = function () {
            $scope.searchLoading = true;
        };
        // 隐藏搜索加载效果;
        $scope.hideLoadingAffected = function () {
            $scope.searchLoading = false;
        };

        // 展示高级搜索面板;
        $scope.showAdvanceSearchPanel = function () {
            var options = {
                panelName: 'AdvancedSearchPanel',
                data: {
                    selectedData: null,
                    currentData: null
                }
            };
            eventCtrl.fire(L.Mixin.EventTypes.PARTSREFRESH, options);
        };

        $scope.showKindPanel = function () {
            $scope.showKindFlag = !$scope.showKindFlag;
            $scope.showResultFlag = false;
        };

        // 点击pid高亮并定位;
        $scope.showInmap = function (item) {
            $scope.$emit('ClearPage');
            // 分歧调用getByPid的时候type是RDBRANCH，并且需要子类型
            var branch = ['RDBRANCHDETAIL', 'RDBRANCHREALIMAGE', 'RDSIGNASREAL', 'RDSERIESBRANCH', 'RDBRANCHSCHEMATIC', 'RDSIGNBOARD'];
            if (branch.indexOf(item.type) > -1) {
                $scope.$emit('ObjectSelected', { feature: { pid: item.pid, geoLiveType: $scope.selectedItem.geoLiveType } });
            } else {
                $scope.$emit('ObjectSelected', { feature: { pid: item.pid, geoLiveType: item.type } });
            }
        };

        /* 公共方法 */
        function ValidateLocation(param) {
            var tempArray = param.split(',');
            var log = tempArray[0];
            var lat = tempArray[1];
            if (!log || !lat) {
                return false;
            }
            if (log > 180 || log < 0) {
                return false;
            }
            if (lat > 90 || lat < 0) {
                return false;
            }
            return true;
        }
        var marker = null;
        var createMarker = function (latlon) {
            var myIcon = L.icon({
                iconUrl: '../../images/poi/map/marker_red_16.png',
                iconSize: [24, 33],
                iconAnchor: [12, 33]
            });
            marker = L.marker(latlon, {
                icon: myIcon
            }).addTo(map);
        };
        $scope.clearMarker = function () {
            if (marker) {
                map.removeLayer(marker);
                marker = null;
            }
        };

        // 查询数据;
        $scope.doSearch = function (e) {
            if (e.charCode === 13) {
                var text = Utils.trim($scope.searchText);
                var key = $scope.selectedItem.key;
                $scope.searchParma.type = $scope.selectedItem.type;
                if (!text) { return; }
                if (isNaN(text)) {
                    // 如果输入是坐标;
                    if (text.indexOf(',') != -1) {
                        $scope.showKindFlag = false;
                        if (ValidateLocation(text)) {
                            var temp = text.split(',');
                            temp[0] = parseFloat(temp[0]);
                            temp[1] = parseFloat(temp[1]);
                            var geoObj = new fastmap.uikit.Util().createPoint(temp);
                            $scope.$emit('Map-LocationByCoordinate', { coordinate: geoObj });
                            $scope.clearMarker();
                            createMarker([temp[1], temp[0]]);
                        } else {
                            swal('提示', '坐标输入有误!', 'warning');
                        }
                        return;
                    }
                    if ($scope.searchParma.type === 'RDLINK' || $scope.searchParma.type === 'IXPOI') {
                        key = 'name';
                    } else {
                        swal('提示', '只能输入数字!', 'warning');
                        return;
                    }
                }
                $scope.searchParma.data = {};
                $scope.searchParma.data[key] = text;
                $scope.pagation.total = 1; // 重新搜索初始化总页数;
                $scope.searchByParmas();
            }
        };
        // 数据查询接口;
        $scope.searchByParmas = function () {
            $scope.showLoadingAffected();
            $scope.showResultFlag = true;
            $scope.showKindFlag = false;
            $scope.searchParma.pageNum = $scope.pagation.pageNum;
            $scope.searchDataList = []; // 清空上一次搜索的数据;
            dsEdit.normalSearch($scope.searchParma).then(function (data) {
                if (data) {
                    $scope.hideLoadingAffected();
                    for (var i = 0; i < data.rows.length; i++) {
                        data.rows[i].shortPid = (data.rows[i].pid.length > 10) ? data.rows[i].pid.substring(0, 10) + '...' : data.rows[i].pid;
                        data.rows[i].shortName = (data.rows[i].name.length > 12) ? data.rows[i].name.substring(0, 12) + '...' : data.rows[i].name;
                    }
                    $scope.searchDataList = data.rows;
                    $scope.pagation.total = Math.ceil(data.total / $scope.pagation.pageSize);
                }
            });
        };

        $scope.selectFirst = function (item) {
            item.selected = !item.selected;
        };

        $scope.selectSecond = function (child) {
            for (var i = 0; i < $scope.kindList.length; i++) {
                var temp = $scope.kindList[i];
                for (var j = 0; j < temp.children.length; j++) {
                    var ch = temp.children[j];
                    ch.selected = false;
                }
            }
            $scope.selectedItem = child;
            child.selected = true;
        };

        // 跳转页
        $scope.goToPage = function () {
            $scope.searchByParmas();
        };

        $scope.hideDownPanel = function () {
            $scope.showKindFlag = false;
            $scope.showResultFlag = false;
        };
    }
]);
