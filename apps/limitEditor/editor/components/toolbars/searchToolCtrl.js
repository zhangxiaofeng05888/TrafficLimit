/**
 * Created by wuzhen on 2017/1/12.
 */
angular.module('app').controller('searchToolCtrl', ['$scope', 'dsEdit',
    function ($scope, dsEdit) {
        var eventCtrl = new fastmap.uikit.EventController();

        $scope.pagation = {
            pageNum: 1,
            pageSize: 10,
            total: 1,
            maxSize: 2
        };

        $scope.closeImg = '../../images/newPoi/rightPanelIcon/icon-right-close.png';
        $scope.openImg = '../../images/newPoi/rightPanelIcon/icon-right-open.png';
        $scope.showResultFlag = false;
        $scope.showKindFlag = false;
        $scope.advancePanelFlag = false;
        $scope.searchInputStatus = true;    // 搜索框效果;
        $scope.searchLoading = false;

        $scope.kindList = [{
            name: '兴趣点',
            children: [{
                key: 'pid',
                name: 'POI',
                type: 'IXPOI',
                selected: true
            }],
            selected: true
        },
        {
            name: '道路背景',
            children: [{
                key: 'linkPid',
                name: '道路线',
                type: 'RDLINK',
                selected: false
            }],
            selected: false
        }];

        $scope.selectedItem = {
            key: 'pid',
            name: 'POI',
            type: 'IXPOI',
            selected: true
        };
        $scope.roadNames = [
            { text: '' }
        ];

        $scope.addItem = function () {
            $scope.roadNames.push({ text: '' });
        };

        $scope.deleteItem = function (index) {
            if ($scope.roadNames.length === 1) {
                return;
            }

            $scope.roadNames.splice(index, 1);
        };

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
                if ($scope.advancePanelFlag) {
                    $scope.advancePanelFlag = !$scope.advancePanelFlag;
                }
                $scope.showKindFlag = false;
                $scope.showResultFlag = false;
            }
        };

        // 高级搜索面板显隐控制;
        $scope.toggleAdvancePanel = function () {
            $scope.advancePanelFlag = !$scope.advancePanelFlag;
        };

        // 展示高级搜索查询结果面板;
        var showAdvanceSearchPanel = function (results) {
            var options = {
                panelName: 'AdvancedSearchPanel',
                data: results
            };
            eventCtrl.fire(L.Mixin.EventTypes.PARTSREFRESH, options);
        };

        var startSearch = function (data) {
            $scope.showLoadingAffected();
            if ($scope.searchParmas.type == 'IXPOI') {
                dsEdit.normalPoiSearch($scope.searchParmas).then(function (res) {
                    if (res) {
                        $scope.hideLoadingAffected();
                        $scope.searchDataList = res.rows;
                        $scope.pagation.total = res.total;
                    }
                });
            } else {
                dsEdit.normalSearch($scope.searchParmas).then(function (res) {
                    if (res) {
                        if (res.rows.length > 0) {
                            showAdvanceSearchPanel(res);
                        } else {
                            swal('提示', '输入的道路名称或PID不存在', 'info');
                        }
                    }
                });
            }
        };

        // 查询数据; 1模糊查询；2精准查询；3根据pid查询。
        $scope.doSearch = function (type) {
            $scope.searchParmas = {
                name: $scope.searchText,
                pageNum: $scope.pagation.pageNum,
                pageSize: $scope.pagation.pageSize
            };
            var text = Utils.trim($scope.searchText);
            if (!text) { return; }
            if ($scope.selectedItem.type == 'IXPOI') {
                $scope.showResultFlag = true;
                $scope.searchParmas = {
                    type: $scope.selectedItem.type,
                    condition: {
                        name: $scope.searchText,
                        pageNum: $scope.pagation.pageNum,
                        pageSize: $scope.pagation.pageSize
                    }
                };
            } else {
                if (isNaN(text)) {
                    $scope.searchParmas = {
                        type: type,
                        condition: {
                            adminCode: App.Temp.infoToGroupData.cityId,
                            names: [text]
                        }
                    };
                } else {
                    $scope.searchParmas = {
                        type: 3,
                        condition: {
                            adminCode: App.Temp.infoToGroupData.cityId,
                            names: text
                        }
                    };
                }
            }
            var data = {};
            $scope.searchDataList = [];
            $scope.pagation.total = 1;
            startSearch();
        };

        var getSearchNames = function () {
            var names = [];
            var text = '';

            for (var i = 0, len = $scope.roadNames.length; i < len; i++) {
                text = Utils.trim($scope.roadNames[i].text);
                if (text) {
                    names.push(text);
                }
            }

            return names;
        };

        // 高级查询; 1模糊查询；2精准查询；3根据pid查询。
        $scope.doAdvanceSearch = function (type) {
            var names = getSearchNames();

            if (names.length === 0) {
                return;
            }

            $scope.searchParmas = {
                type: type,
                condition: {
                    adminCode: App.Temp.infoToGroupData.cityId,
                    names: names
                }
            };

            startSearch();
        };

        // 显示搜索加载效果;
        $scope.showLoadingAffected = function () {
            $scope.searchLoading = true;
        };
        // 隐藏搜索加载效果;
        $scope.hideLoadingAffected = function () {
            $scope.searchLoading = false;
        };

        $scope.goToPage = function () {
            $scope.searchParmas.condition.pageNum = $scope.pagation.pageNum;
            startSearch();
        };

        $scope.showKindPanel = function () {
            $scope.showKindFlag = !$scope.showKindFlag;
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

        // 点击pid高亮并定位;
        $scope.showInmap = function (item) {
            $scope.$emit('ObjectSelected', {
                feature: { pid: item.pid, geoLiveType: 'IXPOI' }
            });
        };
        // 监听输入框的变化
        $scope.$watch('searchText', function (a, b) {
            if (a == '') {
                $scope.showResultFlag = false;
            }
        });
    }
]);
