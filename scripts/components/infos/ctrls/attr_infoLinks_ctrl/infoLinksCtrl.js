/**
 * Created by Chensonglin on 17.4.17.
 */
angular.module('app').controller('linksCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var selectCtrl = fastmap.uikit.SelectController();
    $scope.linksOrigin = [
        {
            id: 0, origin: 'GPS测线（手持端）'
        },
        {
            id: 1, origin: '惯性测线'
        },
        {
            id: 2, origin: '自绘测线'
        },
        {
            id: 3, origin: '影像矢量测线'
        },
        {
            id: 4, origin: '情报'
        }
    ];
    $scope.linksKind = [
        {
            id: 0, label: '作业中'
        },
        {
            id: 1, label: '高速道路'
        },
        {
            id: 2, label: '城市道路'
        },
        {
            id: 3, label: '国道'
        },
        {
            id: 4, label: '省道'
        },
        {
            id: 5, label: '预留'
        },
        {
            id: 6, label: '县道'
        },
        {
            id: 7, label: '乡镇村道路'
        },
        {
            id: 8, label: '其他道路'
        },
        {
            id: 9, label: '非引导道路'
        },
        {
            id: 10, label: '步行道路'
        },
        {
            id: 11, label: '人渡'
        },
        {
            id: 13, label: '轮渡' },
        {
            id: 15, label: '10级路（障碍物）'
        }
    ];
    $scope.roadNumber = [
        {
            id: 0, label: '0(左右车道数不一致)'
        },
        {
            id: 1, label: '1'
        },
        {
            id: 2, label: '2'
        },
        {
            id: 3, label: '3'
        },
        {
            id: 4, label: '4'
        },
        {
            id: 5, label: '5'
        },
        {
            id: 6, label: '6'
        },
        {
            id: 7, label: '7'
        },
        {
            id: 8, label: '8'
        },
        {
            id: 9, label: '9'
        },
        {
            id: 10, label: '10'
        },
        {
            id: 11, label: '11'
        },
        {
            id: 12, label: '12'
        },
        {
            id: 13, label: '13'
        },
        {
            id: 14, label: '14'
        },
        {
            id: 15, label: '15'
        },
        {
            id: 16, label: '16'
        }

    ];

    $scope.initializeData = function () {
        $scope.links = objCtrl.data;
        if ($scope.links.feedback.f_array && $scope.links.feedback.f_array.length > 0) {
            for (var i = 0; i < $scope.links.feedback.f_array.length; i++) {
                if ($scope.links.feedback.f_array[i].type == 3) {
                    $scope.links.content = $scope.links.feedback.f_array[i].content;
                }
            }
        }
        $scope.selectedDate = '';
        if ($scope.links.deep.time !== '') {
            $scope.selectedDate = Utils.dateFormatShort($scope.links.deep.time);
        }
    };
    $scope.changeDate = function (date) {
        $scope.links.deep.time = date.replace(/-/g, '');
    };
    $scope.changeBuild = function () {
        $scope.selectedDate = '';
        $scope.links.deep.time = '';
    };
    var unbindHandler = $scope.$on('ReloadData', $scope.initializeData);

    $scope.$on('$destroy', function () {
        unbindHandler = null;
    });
}]);
