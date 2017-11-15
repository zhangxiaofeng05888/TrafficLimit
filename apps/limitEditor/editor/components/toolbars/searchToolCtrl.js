/**
 * Created by wuzhen on 2017/1/12.
 */
angular.module('app').controller('searchToolCtrl', ['$scope', 'dsEdit',
    function ($scope, dsEdit) {
        var eventCtrl = new fastmap.uikit.EventController();

        $scope.advancePanelFlag = false;
        $scope.searchInputStatus = true;    // 搜索框效果;
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
            dsEdit.normalSearch(data).then(function (res) {
                if (res) {
                    if (res.rows.length > 0) {
                        showAdvanceSearchPanel(res);
                    } else {
                        swal('提示', '输入的道路名称或PID不存在', 'info');
                    }
                }
            });
        };

        // 查询数据; 1模糊查询；2精准查询；3根据pid查询。
        $scope.doSearch = function (type) {
            var text = Utils.trim($scope.searchText);
            if (!text) { return; }

            var data = {};
            if (isNaN(text)) {
                data.type = type;
                data.condition = {
                    adminCode: App.Temp.infoToGroupData.cityId,
                    names: [text]
                };
            } else {
                data.type = 3;
                data.condition = {
                    adminCode: App.Temp.infoToGroupData.cityId,
                    linkPid: text
                };
            }

            startSearch(data);
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

            var data = {
                type: type,
                condition: {
                    adminCode: App.Temp.infoToGroupData.cityId,
                    names: names
                }
            };

            startSearch(data);
        };
    }
]);
