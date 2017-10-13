/**
 * Created by linglong on 2016/12/21.
 */
angular.module('app').controller('formTypeFlagCtrl', ['$scope',
    function ($scope) {
        $scope.auxiFlagoption = [
            { id: 0, label: '无' },
            { id: 55, label: '服务区内道路' },
            { id: 56, label: '环岛IC链接路' },
            { id: 58, label: '补助道路' },
            { id: 70, label: 'JCT道路名删除' },
            { id: 71, label: '线假立交' },
            { id: 72, label: '功能面关联道路' },
            { id: 73, label: '环岛直连MD' },
            { id: 76, label: '7级降8级标志' },
            { id: 77, label: '交叉点间Link' }
        ];
        $scope.changeFormType = function (item) {
            $scope.$emit('formTypeSelect', item);
        };
    }
]);
