angular.module('lazymodule', []).controller('DateCtrl', ['$scope', '$timeout', '$compile', function ($scope, $timeout, $compile) {
    /* 星期*/
    var eventController = fastmap.uikit.EventController();
    /* 时间段list*/
    $scope.dateList = [];
    $scope.dateListAll = [];
    $scope.initOption = function () {
        $scope.showDatePicker = true;
    };
    $scope.isFuzzy = false;
    /* 初始化时间段tip*/
    var dateInit = function () {
        $scope.dTimesDomain = [
            {
                begin: '',
                end: ''
            }
        ];
    };
    /* ——————————解析————————*/
    /* 根据总的时间字符串拆分成多个字符串数组*/
    $scope.newStr = function (str, bracket) {
        if (str) {
            var dateArr = '';
            str = str.replace(/z/g, '');  // 暂时移除z
            if (bracket) {
                dateArr = str.substr(1, str.length - 2).split('');
            } else {
                dateArr = str.split('');
            }
            for (var i = 0; i < dateArr.length; i++) {
                if (dateArr[i] == '+' && (dateArr[i - 1] == ']' && dateArr[i + 1] == '[')) {
                    dateArr[i] = '&';
                }
            }
            return dateArr.join('').split('&');
        }
        return false;
    };
    $scope.listInit = function (newArrTemp) {
        var newArrayList = []; // 新建数组，用于记录要清空的数组角标
        /* 遍历寻找二维数组重新整合数组，二维则进行拼接*/
        if (newArrTemp) {
            var concatStr = '';
            newArrTemp[0] = newArrTemp[0].substr(1);
            if (newArrTemp[newArrTemp.length - 1].charAt(newArrTemp[newArrTemp.length - 1].length - 1) == 'z') {
                newArrTemp[newArrTemp.length - 1] = newArrTemp[newArrTemp.length - 1].substr(0, newArrTemp[newArrTemp.length - 1].length - 2) + 'z';
            } else {
                newArrTemp[newArrTemp.length - 1] = newArrTemp[newArrTemp.length - 1].substr(0, newArrTemp[newArrTemp.length - 1].length - 1);
            }
            for (var i = 0; i < newArrTemp.length; i++) {
                if (concatStr == '') {
                    concatStr = newArrTemp[i];
                } else {
                    concatStr = concatStr + '+' + newArrTemp[i];
                }
                if (concatStr.split('[').length == concatStr.split(']').length) {
                    newArrayList.push(concatStr);
                    concatStr = '';
                }
            }
        }
        return newArrayList;
    };
    /* 外部传递str*/
    $scope.$on('set-code', function (event, data) {
        if (data) {
            $scope.dateList = [];
            $scope.dateString = data;
            if ($scope.dateString && $scope.dateString.indexOf('z') > -1) {
                $scope.vagueTime = true;
            } else {
                $scope.vagueTime = false;
            }
            $scope.translate($scope.dateString);
            $scope.dateString = data;
        } else {
            $scope.dateList = [];
        }
    });
    /* 判断功能按钮状态*/
    $scope.$on('btn-control', function (event, data) {
        if (data) {
            $scope.emptyBtnHide = (data.empty == 'hide');
            $scope.addBtnHide = (data.add == 'hide');
            $scope.delBtnHide = (data.delete == 'hide');
        }
    });
    /* 外部传递模糊时间是否可用 */
    eventController.off('disableFuzzy');
    eventController.on('disableFuzzy', function (event) {
        $scope.isFuzzy = event.isFuzzy;
    });

    // 格式化时间，自动补0
    var formatTime = function (time, i, j) {
        var result = time.split(')(h')[i].split('m')[j];
        if (result.length === 1) {
            result = '0' + result;
        }
        return result;
    };
    // 如果时间段为数组，组合字符串
    function mutiArrayDate(arr) {
        var cResult = '';
        if (typeof arr === 'string') {
            // 多个时间段逗号隔开，换成+
            if (arr.indexOf(',') > -1) {
                arr = arr.replace(/,/g, '+');
            }
            cResult = arr;
        } else {
            for (var i = 0; i < arr.length; i++) {
                if (i == 0) {
                    if (typeof arr[i] == 'string') {
                        cResult = arr[i];
                    } else {
                        cResult = mutiArrayDate(arr[i]);
                    }
                } else if (i > 0) {
                    if (typeof arr[i] == 'string') {
                        cResult += '+' + arr[i];
                    } else {
                        cResult += '+' + mutiArrayDate(arr[i]);
                    }
                }
            }
            cResult = '[' + cResult + ']';
        }
        return cResult;
    }
    // 除去string两边的[]()
    var strFilter = function (str) {
        if (!str) {
            return '';
        }
        // eslint-disable-next-line
        return str.replace(/^([\[,\],\(,\)]*)/, '').replace(/([\[,\],\(,\)]*)$/, '');
    };
    $scope.translateDetail = function (v, vague) { // 验证是否为模糊
        var arrStr = v.join('');
        var detail = '';
        var dateSingle;
        var originCode = v;
        if (v[0].split('')[0] !== '[') {
            originCode = '[' + originCode + ']';
        }
        // v为数组
        if (v.length == 1) {
            originCode = '[' + v.join('') + ']';
        }
        if (arrStr.indexOf('z') > -1) {
            vague = true;
            v = arrStr.slice(0, arrStr.length - 1); // 删除*z
            dateSingle = v.substr(0, v.length - 1).split('+'); // 删除最外层的z
        } else {
            vague = false;
            v = v.join('');
            dateSingle = arrStr.substr(1, arrStr.length - 2).split('+');
        }
        var times = dateSingle.join('');
        times = strFilter(times).substr(1);
        var timeArray = times.split(')][(h');
        var timeDetail = [];
        for (var i = 0; i < timeArray.length; i++) {
            timeDetail.push(formatTime(timeArray[i], 0, 0) + ':'
                + formatTime(timeArray[i], 0, 1)
                + '到'
                + formatTime(timeArray[i], 1, 0)
                + ':'
                + formatTime(timeArray[i], 1, 1));
        }
        detail = '每天的' + timeDetail.join('，');
        if (vague) detail += '（模糊）';
        $scope.dateList.push({
            code: mutiArrayDate(originCode),
            describe: detail
        });
    };
    /* 解析字符串数组*/
    $scope.translate = function (v) {
        if (v.split('')[0] === '[') {
            v = $scope.newStr(v, true);
        } else {
            v = $scope.newStr(v);
        }
        $scope.translateDetail(v, false);
    };
    // 自动判断是否模糊
    $scope.changeIsVague = function () {
        if ($scope.dateString) {
            if ($scope.dateString.indexOf('z') > -1) {
                $scope.vagueTime = true;
            } else {
                $scope.vagueTime = false;
            }
        }
    };
    // 选择模糊时间
    $scope.checkVague = function () {
        if (!$scope.dateString) {
            return;
        }
        if ($scope.vagueTime) {
            $scope.dateString += 'z';
        } else if ($scope.dateString.charAt($scope.dateString.length - 1) === 'z') {
            $scope.dateString = $scope.dateString.substr(0, $scope.dateString.length - 1);
        }
        $scope.$emit('get-date', $scope.dateString);
    };
    /* 删除时间段*/
    $scope.removeList = function (e, index) {
        var dateTimeWell = $(e.target).parents('.date-well').parent();
        var itemCode = $(e.target).parents('.date-list').find('.date-code-list').attr('date-code');
        var i;
        $(e.target).parents('.date-list').remove();
        for (i = 0; i < $scope.dateList.length; i++) {
            if ($scope.dateList[i].code === itemCode) {
                $scope.dateList.splice(i, 1);
            }
        }
        if ($scope.dateList.length === 0) {
            $scope.dateString = '';
        }
        // 如果删到只剩最后一条数据，删除外围[]
        if ($scope.dateList.length === 1) {
            // $scope.dateString = $scope.dateString.substr(1, $scope.dateString.length - 2);
            if (typeof $scope.dateList[0].code === 'string') {
                // 如果code是字符串
                $scope.dateString = $scope.dateList[0].code;
            } else {
                // 如果为数组
                $scope.dateString = '[' + $scope.dateList[0].code.join('+') + ']';
            }
        }
        // 重组时间字符串
        if ($scope.dateList.length > 1) {
            var result = '';
            for (i = 0; i < $scope.dateList.length; i++) {
                if (i === 0) {
                    result = mutiArrayDate($scope.dateList[i].code);
                } else {
                    result += '+' + mutiArrayDate($scope.dateList[i].code);
                }
            }
            $scope.dateString = '[' + result + ']';
        }
        if ($scope.vagueTime && $scope.dateList.length) {
            $scope.dateString += 'z';
        }
        $scope.$emit('get-date', $scope.dateString);
        if (dateTimeWell.hasClass('muti-date')) dateTimeWell.attr('date-str', $scope.dateString);
    };
    /* 点击选择日期*/
    $scope.dateSelect = function (e, flag) {
        eventController.fire('limitTimeCtrl');
        $('.datetip').hide();
        if ($('.datetip').length > 1) {
            for (var i = 0; i < $('.datetip').length - 1; i++) {
                $('.datetip')[i].remove();
            }
        }
        $scope.showDatePicker = true;
        if (!flag) {
            // 默认显示固定时间
            $scope.timeType = '0';
            dateInit();
            $scope.dateIndex = -1;
        }
        var eId = 'fmDateTimer-' + $scope.$id;
        var aId = 'arrowRight-' + $scope.$id;
        var dateTimeWell = $(e.target).parents('.date-well').parent();
        var dateTip = dateTimeWell.find('.datetip');
        var dateArrow = dateTimeWell.find('.arrow_right');
        var popHeight;
        var dateHeight = dateTip.height() + 20;
        var modelHeight = 450;
        var modelWidth = 920;
        // $scope.timeType = '0';
        if (dateTimeWell.attr('data-type') === '1') {
            popHeight = $(e.target).offset().top - 95;
        } else {
            popHeight = $(e.target).offset().top - $(e.target).parents('.popover').offset().top - 95;
        }
        if (popHeight + dateHeight > window.innerHeight) {
            popHeight = window.innerHeight - dateHeight;
        }
        // var popHeight;
        $scope.arrowStyle = {
            top: (dateTimeWell.attr('data-type') === '1') ? e.clientY + 'px' : e.clientY - e.target.offsetParent.offsetTop + 'px',
            right: '300px'
        };
        if ($('#' + eId).length === 0) {
            dateTip.attr('id', eId);
            dateArrow.attr('id', aId);
            dateTip.css({
                top: (modelHeight/2 - dateHeight/2) + 'px',
                left: (modelWidth/2 - 275/2) + 'px'
            });
            dateTip.appendTo(dateTimeWell);
            dateTip.show();
            dateArrow.show();
        } else {
            $('#' + eId).css({
                top: (modelHeight/2 - dateHeight/2) + 'px',
                left: (modelWidth/2 - 275/2) + 'px'
            });
            $('#' + eId).show();
            $('#' + aId).show();
        }
    };
    // 逆向解析 自动选择时间
    $scope.reverseDateTime = function (code) {
        var i;
        code = strFilter(code).substr(1);
        var timeArray = code.split(')]+[(h');
        $scope.dTimesDomain = [];
        for (i = 0; i < timeArray.length; i++) {
            $scope.dTimesDomain.push({
                begin: formatTime(timeArray[i], 0, 0) + ':' + formatTime(timeArray[i], 0, 1),
                end: formatTime(timeArray[i], 1, 0) + ':' + formatTime(timeArray[i], 1, 1)
            });
        }
    };
    // 单独修改某一个时间段
    $scope.dateEdit = function (code, index, e) {
        dateInit();
        $scope.dateIndex = index;
        $scope.reverseDateTime(code);
        $timeout(function () {
            $scope.dateSelect(e, true);
        });
    };
    $scope.close = function () {
        $scope.showDatePicker = false;
        $('#fmDateTimer-' + $scope.$id).hide();
        $('#arrowRight-' + $scope.$id).hide();
    };
    /* 点击选择时间*/
    $scope.selectTime = function (e) {
        $(e.target).timepicki($scope, $(e.target).attr('ng-model'));
    };
    /* 选择持续时间的年月日或月日 */
    $scope.changeContType = function (type) {
        dateInit();
        $scope.contType = type;
    };
    /* 切换时间段类型 固定 持续*/
    $scope.changeTimeType = function () {
        dateInit();
    };
    /* 错误提示*/
    var alertMsg = function (dateWell, msg) {
        dateWell.find('.error-msg').text(msg);
        dateWell.find('.date-msg').show();
        var timer = $timeout(function () {
            dateWell.find('.date-msg').fadeOut();
        }, 2000);
    };
    /* 验证输入是否合法*/
    $scope.dateValid = function (dateWell) {
        var i;
        // 验证时分输入时分是否完整
        for (i = 0; i < $scope.dTimesDomain.length; i++) {
            if (!$scope.dTimesDomain[i].begin && $scope.dTimesDomain[i].end) {
                alertMsg(dateWell, '请输入开始时间！');
                return false;
            }
            if ($scope.dTimesDomain[i].begin && !$scope.dTimesDomain[i].end) {
                alertMsg(dateWell, '请输入结束时间！');
                return false;
            }
            if ($scope.dTimesDomain[i].begin && $scope.dTimesDomain[i].end
                && $scope.dTimesDomain[i].begin >= $scope.dTimesDomain[i].end) {
                alertMsg(dateWell, '结束时间必须大于开始时间！');
                return false;
            }
        }
        return true;
    };
    // 多个时间段解析
    var transMutiTime = function (timeArr) {
        var result;
        // 如果时分只选择一段
        if (timeArr.length === 1) {
            result = '每天的'
                + timeArr[0].begin + '到' + timeArr[0].end;
        } else {
            // 时分有多个
            var timeResult = [];
            for (var i = 0; i < timeArr.length; i++) {
                if (timeArr[i].begin) {
                    timeResult.push(timeArr[i].begin + '到' + timeArr[i].end);
                }
            }
            result = '每天的' + timeResult.join('，');
        }
        return result;
    };
    /* 保存时间段*/
    $scope.dateSave = function (e) {
        var dateWell = $(e.target).parents('.datetip');
        var dateListWell = $(e.target).parents('.date-well');
        var dateArrow = dateWell.parent().find('.arrow_right');
        /* 保存时处理过的数据，一个code一个中文描述*/
        var dateTime = {
            code: function () {
                var $result,
                    i;
                var timeDes = [];
                if ($scope.dTimesDomain[0].begin) {
                    for (i = 0; i < $scope.dTimesDomain.length; i++) {
                        if ($scope.dTimesDomain[i].begin) {
                            timeDes.push(
                                '[(h' + parseInt($scope.dTimesDomain[i].begin.split(':')[0], 10) + 'm'
                                + parseInt($scope.dTimesDomain[i].begin.split(':')[1], 10) + ')(h'
                                + parseInt($scope.dTimesDomain[i].end.split(':')[0], 10) + 'm'
                                + parseInt($scope.dTimesDomain[i].end.split(':')[1], 10) + ')]'
                            );
                        }
                    }
                    if (timeDes.length > 1) {
                        $result =
                            '[' + timeDes.join('+') + ']';
                    } else {
                        $result = timeDes.join('');
                    }
                }
                return $result;
            },
            describe: function () {
                var finalResult;
                if ($scope.dTimesDomain[0].begin) {
                    finalResult = transMutiTime($scope.dTimesDomain);
                }
                return finalResult;
            }
        };
        if ($scope.dateValid(dateWell)) {
            $scope.dateCode = dateTime.code();
            $scope.dateDescribe = dateTime.describe();
            // 编辑
            if ($scope.dateIndex > -1) {
                $scope.dateList[$scope.dateIndex] = {
                    code: mutiArrayDate(dateTime.code()),
                    describe: dateTime.describe()
                };
            } else {    // 新增
                $scope.dateList.push({
                    code: mutiArrayDate(dateTime.code()),
                    describe: dateTime.describe()
                });
            }

            dateWell.fadeOut();
            dateArrow.fadeOut();
            $scope.showDatePicker = false;
            if ($scope.dateIndex === -1) {
                dateInit();
            }
            // 重组时间字符串
            if ($scope.dateList.length > 1) {
                var result = '';
                for (var i = 0; i < $scope.dateList.length; i++) {
                    if (i == 0) {
                        result = mutiArrayDate($scope.dateList[i].code);
                    } else {
                        result += '+' + mutiArrayDate($scope.dateList[i].code);
                    }
                }
                $scope.dateString = '[' + result + ']';
            } else if ($scope.dateList.length === 1) {
                $scope.dateString = $scope.dateList[0].code;
            } else {
                $scope.dateString = '';
            }
            if ($scope.vagueTime) {
                $scope.dateString += 'z';
            }
            $scope.$emit('get-date', $scope.dateString);
            if (dateListWell.parent().hasClass('muti-date')) dateListWell.parent().attr('date-str', $scope.dateString);
        }
    };
    // 操作时分
    $scope.timeDomainOption = function (timeArr, index, type) {
        if (type) {
            // 新增
            timeArr.push({
                begin: '',
                end: ''
            });
        } else {
            // 删除
            timeArr.splice(index, 1);
        }
    };
    /* 清空*/
    $scope.dateEmpty = function (e) {
        $scope.dateList.length = 0;
        $scope.dateString = '';
        $scope.$emit('get-date', '');
        if ($(e.target).parents('.date-well').parent().hasClass('muti-date')) {
            $(e.target).parents('.date-well').parent().attr('date-str', '');
        }
    };

    //  禁用模糊时间复选框时，将其设为反选状态
    $scope.$on('Cancel-Checked', function (event, data) {
        $scope.vagueTime = data;
        $scope.checkVague();
    });
}]);
