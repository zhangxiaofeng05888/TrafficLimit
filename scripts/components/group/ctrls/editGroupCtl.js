/**
 * 返回情报列表中编辑操作
 * @author zhaohang
 * @date   2017/9/27
 * @param  {object} $window 窗口
 * @param  {object} $scope 作用域
 * @param  {object} $timeout 定时
 * @param  {object} NgTableParams 构造函数
 * @param  {object} dsFcc 接口服务
 * @param  {object} appPath app路径
 * @return {undefined}
 */
angular.module('app').controller('editGroupCtrl', ['$window', '$scope', '$timeout', 'NgTableParams', 'dsFcc', 'appPath',
    function ($window, $scope, $timeout, NgTableParams, dsFcc, appPath) {
        /**
         * 初始化表格
         * @author Niuxinyi
         * @date   2017-11-16
         * @return {undefined}
         */
        $scope.groupType = [
            {
                value: 1,
                name: '新增'
            },
            {
                value: 2,
                name: '删除'
            },
            {
                value: 3,
                name: '修改'
            },
            {
                value: 4,
                name: '已制作'
            }
        ];
        /**
         * 弹出框添加数据功能
         * @method addItem
         * @author Niuxinyi
         * @date   2017-11-16
         * @return {undefined}
         */
        $scope.addItem = function () {
            $scope.row.push({
                time: '',
                target: '',
                range: '',
                strategy: ''
            });
        };
        /**
         * 弹出框删除数据功能
         * @method deleteItem
         * @author Niuxinyi
         * @date   2017-11-16
         * @param  {object} index 当前数据索引
         * @return {undefined}
         */
        $scope.deleteItem = function (index) {
            if ($scope.row.length === 1) {
                return;
            }
            $scope.row.splice(index, 1);
        };
        /**
         * 弹出框数据内容输入限制，禁止输入“|”
         * @method limit
         * @author Niuxinyi
         * @date   2017-11-16
         * @param  {object} event 包括事件
         * @param  {object} index 包括索引
         * @param  {object} name 包括命名
         * @return {undefined}
         */
        $scope.limit = function (event, index, name) {
            if (event.keyCode === 220) {
                swal('提示', '不能输入"|"', 'warning');
                $scope.row[index][name] = $scope.row[index][name].substring(0, $scope.row[index][name].length - 1);
            }
        };
        // 获取字符串字符长度
        var getLength = function (str) {
            // <summary>获得字符串实际长度，中文2，英文1</summary>
            var realLength = 0;
            var len = str.length;
            var charCode = -1;
            for (var i = 0; i < len; i++) {
                charCode = str.charCodeAt(i);
                if (charCode >= 0 && charCode <= 128) {
                    realLength += 1;
                } else {
                    realLength += 2;
                }
            }
            return realLength;
        };
        /**
         * 弹出框数据进行保存操作
         * @method saveGroup
         * @author Niuxinyi
         * @date   2017-11-16
         * @return {undefined}
         */
        $scope.saveGroup = function () {
            var principle = '';
            for (var i = 0; i < $scope.row.length; i++) {
                if (!$scope.row[i].time) {
                    swal('提示', '请输入限制时间', 'warning');
                    return;
                }
                if (!$scope.row[i].target) {
                    swal('提示', '请输入限行对象', 'warning');
                    return;
                }
                if (!$scope.row[i].range) {
                    swal('提示', '请输入限行范围', 'warning');
                    return;
                }
                if (!$scope.row[i].strategy) {
                    swal('提示', '请输入限行策略', 'warning');
                    return;
                }
                var str = '限行时间:' + $scope.row[i].time + '|限行对象:' + $scope.row[i].target + '|限行范围:' + $scope.row[i].range + '|限行策略:' + $scope.row[i].strategy;
                // 转换非法字符（自定义范围内）
                var str1 = $scope.replaceIllegalChar(str);
                // 非中文的字符全角转半角
                str = $scope.ToCDB(str1);
                // 校验字符串格式
                if ($scope.matchResult(str)) {
                    var result = str.match(/[^a-z0-9A-Z\u4e00-\u9fa5-;,:()\\|\\.\\+]/g);
                    swal('提示', '存在非法字符 ' + result.toString(), 'warning');
                    return;
                }
                if (i + 1 === $scope.row.length) {
                    principle += str;
                } else {
                    principle = principle + str + '||';
                }
            }
            if (principle.length > 600) {
                swal({
                    title: '限行规定超出600个字符长度<br>是否继续保存',
                    html: true,
                    type: 'warning',
                    animation: 'slide-from-top',
                    allowEscapeKey: false,
                    showCancelButton: true,
                    confirmButtonText: '确认',
                    confirmButtonColor: '#ec6c62',
                    closeOnConfirm: false,
                    cancelButtonText: '取消'
                }, function (f) {
                    if (f) {
                        let params = {
                            command: 'UPDATE',
                            type: 'SCPLATERESGROUP',
                            objId: $scope.groupData.groupId,
                            data: {
                                groupType: $scope.groupData.groupType,
                                principle: principle,
                                objStatus: 'UPDATE'
                            }
                        };
                        dsFcc.addGroup(params).then(function (data) {
                            $scope.$emit('closeGroupDialog', 'editGroup');
                            if (data == -1) {
                                return;
                            }
                            swal('提示', '修改成功', 'success');
                        });
                    }
                });
            } else {
                let params = {
                    command: 'UPDATE',
                    type: 'SCPLATERESGROUP',
                    objId: $scope.groupData.groupId,
                    data: {
                        groupType: $scope.groupData.groupType,
                        principle: principle,
                        objStatus: 'UPDATE'
                    }
                };
                dsFcc.addGroup(params).then(function (data) {
                    $scope.$emit('closeGroupDialog', 'editGroup');
                    swal('提示', '修改成功', 'success');
                });
            }
        };
        /**
         * 初始化数据
         * @author Niuxinyi
         * @date   2017-11-16
         * @param  {object} event 包括事件
         * @param  {object} data 包括数据值
         * @return {undefined}
         */
        var initialize = function (event, data) {
            $scope.groupData = Object.assign({}, data.data);
            $scope.row = [];
            var doubleRow = $scope.groupData.principle.split('||');
            for (var i = 0; i < doubleRow.length; i++) {
                var arr = doubleRow[i].split('|');
                $scope.row.push({
                    time: arr[0].substring(5),
                    target: arr[1].substring(5),
                    range: arr[2].substring(5),
                    strategy: arr[3].substring(5)
                });
            }
        };
        $scope.replaceIllegalChar = function (str) {
            var regex1 = /[→—―\—\―]/g;
            str = str.replace(regex1, '-');
            var regex2 = /[“”"《》\s\t\n]/g;
            str = str.replace(regex2, '');
            var regex3 = /[、。；]/g;
            str = str.replace(regex3, ';');
            var regex4 = /--/g;
            str = str.replace(regex4, '-');
            str = str.replace(/[<]/g, '小于');
            str = str.replace(/&lt;/g, '小于');
            str = str.replace(/&gt;/g, '大于');
            str = str.replace(/[>]/g, '大于');
            str = str.replace(/[︰]/g, ':');
            str = str.replace(/[Ⅰ]/g, 'I');
            str = str.replace(/[Ⅱ]/g, 'II');
            str = str.replace(/[Ⅲ]/g, 'III');
            str = str.replace(/[Ⅳ]/g, 'IV');
            str = str.replace(/[Ⅴ]/g, 'V');
            str = str.replace(/[〉]/g, ')');
            str = str.replace(/[〈]/g, '(');

            return str;
        };
        // 匹配字符
        $scope.matchResult = function (str) {
            var regex = /[^a-z0-9A-Z\u4e00-\u9fa5-;,:()\\|\\.\\+]/;
            if (regex.test(str)) {
                return true;
            }
            return false;
        };
        // 全角自动转成半角
        $scope.ToCDB = function (str) { // 全角转半角
            var tmp;
            if (str) {
                tmp = '';
                for (var i = 0; i < str.length; i++) {
                    if (str.charCodeAt(i) == 12288) {
                        tmp += String.fromCharCode(32);
                    } else if (str.charCodeAt(i) > 65248 && str.charCodeAt(i) < 65375) {
                        tmp += String.fromCharCode(str.charCodeAt(i) - 65248);
                    } else {
                        tmp += str[i];
                    }
                }
            } else {
                tmp = str;
            }
            return tmp;
        };
        var unbindHandler = $scope.$on('ReloadData-editGroup', initialize);
        $scope.$on('$destroy', function (event, data) {

        });
    }
]).directive('contenteditable', ['$window', function () {
    // 为含有contenteditable属性的元素绑定ng-model
    return {
        restrict: 'A',
        require: '?ngModel', // 此指令所代替的函数
        link: function (scope, element, attrs, ngModel) {
            if (!ngModel) {
                return;
            }
            ngModel.$render = function () {
                element.html(ngModel.$viewValue || '');
            };
            let readViewText = function () {
                var html = element.html();
                if (attrs.stripBr && html === '<br>') {
                    html = '';
                }
                ngModel.$setViewValue(html);
            };
            element.on('blur keyup change', function () {
                scope.$apply(readViewText);
            });
        }
    };
}]);
