angular.module('lazymodule', []).controller('DateCtrl', ['$scope', '$timeout', '$compile', function ($scope, $timeout, $compile) {
    /* 星期*/
    var eventController = fastmap.uikit.EventController();
    var wks = $scope.wks = {};
    wks.values = [
        {
            code: '1',
            value: '日',
            name: '周日',
            checked: false
        },
        {
            code: '2',
            value: '一',
            name: '周一',
            checked: false
        },
        {
            code: '3',
            value: '二',
            name: '周二',
            checked: false
        },
        {
            code: '4',
            value: '三',
            name: '周三',
            checked: false
        },
        {
            code: '5',
            value: '四',
            name: '周四',
            checked: false
        },
        {
            code: '6',
            value: '五',
            name: '周五',
            checked: false
        },
        {
            code: '7',
            value: '六',
            name: '周六',
            checked: false
        }
    ];
    /* 固定时间星期*/
    wks.selection = wks.values[0];
    /* 持续时间——周——开始时间*/
    wks.wBeginSelection = wks.values[0];
    /* 持续时间——周——开始时间*/
    wks.wEndSelection = wks.values[0];
    /* 复合时间——周——开始时间*/
    wks.cBeginSelection = wks.values[0];
    /* 复合时间——周——开始时间*/
    wks.cEndSelection = wks.values[0];
    /** *******如果窗口打开状态，窗口关闭*/
    // if($('body .datetip:last').show()){
    //     $('body .datetip:last').hide()
    // }
    /* 日、周、月*/
    var dwm = $scope.dwm = {};
    dwm.values = [
        {
            code: 'd',
            value: '日'
        },
        {
            code: 'w',
            value: '周'
        },
        {
            code: 'm',
            value: '月'
        }
    ];
    dwm.selection = dwm.values[0];
    /* 月份*/
    var mons = $scope.mons = {};
    mons.values = [
        {
            code: 1,
            label: '1月'
        },
        {
            code: 2,
            label: '2月'
        },
        {
            code: 3,
            label: '3月'
        },
        {
            code: 4,
            label: '4月'
        },
        {
            code: 5,
            label: '5月'
        },
        {
            code: 6,
            label: '6月'
        },
        {
            code: 7,
            label: '7月'
        },
        {
            code: 8,
            label: '8月'
        },
        {
            code: 9,
            label: '9月'
        },
        {
            code: 10,
            label: '10月'
        },
        {
            code: 11,
            label: '11月'
        },
        {
            code: 12,
            label: '12月'
        }
    ];
    /* 持续时间--开始月份*/
    mons.begin = mons.values[0];
    /* 持续时间--结束月份*/
    mons.end = mons.values[0];
    /* 时间段list*/
    $scope.dateList = [];
    $scope.dateListAll = [];
    $scope.initOption = function () {
        // dwm.selection = dwm.values[0];
        $scope.showDatePicker = true;
        // $('label[name=weekGroupBtn]').removeClass('active');
        for (var i = 0; i < wks.values.length; i++) {
            wks.values[i].checked = false;
        }
        $scope.wks.checks = [];
        $scope.begin_time = '';
        $scope.end_time = '';
        $scope.w_begin_time = '';
        $scope.w_end_time = '';
        // 默认显示固定时间
        $scope.timeType = '0';
    };
    $scope.isFuzzy = false;
    /* 初始化时间段tip*/
    $scope.dateInit = function () {
        /* 固定时间*/
        $scope.wks.checks = [];
        for (var h = 0; h < wks.values.length; h++) {
            wks.values[h].checked = false;
        }
        $scope.wks.selection = $scope.wks.values[0];
        $scope.begin_time = '';
        $scope.end_time = '';
        /* 日*/
        $scope.dBeginDate = '';
        $scope.dEndDate = '';
        $scope.d_begin_time = '';
        $scope.d_end_time = '';
        /* 周*/
        $scope.wks.wBeginSelection = $scope.wks.values[0];
        $scope.wks.wEndSelection = $scope.wks.values[0];
        /* 月*/
        $scope.mons.begin = $scope.mons.values[0];
        $scope.mons.end = $scope.mons.values[0];
        // 复合时间
        $scope.cTimeType = '0';
        $scope.cMonthType = '1';
        $scope.cMonsBegin = $scope.mons.values[0];
        $scope.cMonsEnd = $scope.mons.values[0];
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
    var newArr = $scope.newStr($scope.dateString, true);
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
    // 判断字符出现次数
    function changeRaiseLength(str) {
        var obj = {};
        str.split('').sort().join('').replace(/(.)(\1+)?/g, function (m, k) {
            if (k == '[' || k == ']' || k == 'y' || k == 'd31' || k == 'd') {
                obj[k] = m.length;
            }
        });
        return obj;
    }
    // 对于有 + 相连的单时间段，补上【】后操作
    function addBracketForSimpleDate() {
        if ($scope.dateString.indexOf('z') > -1) {
            $scope.dateString = $scope.dateString.substr(1, $scope.dateString.length - 3);
            $scope.dateString = '[[' + $scope.dateString + ']]z';
        } else {
            $scope.dateString = '[' + $scope.dateString + ']';
        }
    }
    // 排除单个时间段情况，增加[]
    var exceptSimpleTime = function () {
        var objKeyLength = changeRaiseLength($scope.dateString);
        // 排除只选星期的情况
        if ($scope.dateString.split('){d1}]+[(t').length > 1 && $scope.dateString.indexOf('y') == -1 && $scope.dateString.indexOf('M') == -1 && $scope.dateString.indexOf('h') == -1) {
            if ($scope.dateString.split('+').length == $scope.dateString.split('[(t').length - 1
                && $scope.dateString.split('+').length == objKeyLength['['] - 1) {
                addBracketForSimpleDate();
            }
        }
        // 排除只选年月日 跨年
        if ($scope.dateString.split(')]+[(y').length > 1 && $scope.dateString.indexOf('y') > -1 && $scope.dateString.indexOf('t') == -1 && $scope.dateString.indexOf('h') == -1) {
            if ($scope.dateString.split('+').length == objKeyLength.y / 2 && $scope.dateString.split('+').length == objKeyLength['['] - 1
                && $scope.dateString.match(/d31/g).length + 1 == $scope.dateString.split('+').length) {
                addBracketForSimpleDate();
            }
        }
        // 排除选年月日 时间 跨年
        if ($scope.dateString.split(')]+[(y').length > 1 && $scope.dateString.indexOf('y') > -1 && $scope.dateString.indexOf('t') == -1 && $scope.dateString.indexOf(')]]*[(h') > -1) {
            // if ($scope.dateString.split('+').length == objKeyLength.y / 2 && $scope.dateString.split('+').length == objKeyLength['['] - 2
            //     && $scope.dateString.match(/d31/g).length + 1 == $scope.dateString.split('+').length) {
            //     addBracketForSimpleDate();
            // }
            // 一个时间段
            if ($scope.dateString.split('+').length == objKeyLength.y / 2 && $scope.dateString.split('+').length == objKeyLength['['] / 2
                && $scope.dateString.match(/d31/g).length + 1 == $scope.dateString.split('+').length) {
                addBracketForSimpleDate();
            }
        }
        // 排除年月日 时分 不跨年
        if ($scope.dateString.split(')]*[(h').length > 1 && $scope.dateString.indexOf('y') > -1 && $scope.dateString.indexOf('t') == -1
            && $scope.dateString.indexOf('h') > -1 && $scope.dateString.indexOf('+') == -1) {
            $scope.dateString = '[' + $scope.dateString + ']';
        }
        // 排除只选星期和时间的情况
        if ($scope.dateString.indexOf(')]*[(h') > -1 && $scope.dateString.indexOf('y') == -1 && $scope.dateString.indexOf('t') > -1
            && $scope.dateString.indexOf('h') > -1 && $scope.dateString.indexOf('+') == -1) {
            $scope.dateString = '[' + $scope.dateString + ']';
        }
        // 排除只选星期和时间的情况{d1}
        if ($scope.dateString.indexOf('){d1}]]*[(h') > -1 && $scope.dateString.indexOf('y') == -1 && $scope.dateString.indexOf('t') > -1
            && $scope.dateString.indexOf('h') > -1 && $scope.dateString.split('+').length + 1 == $scope.dateString.split('{d1}').length) {
            var startStr = $scope.dateString.split('){d1}]]*[(h')[0];
            var endStr = $scope.dateString.split('){d1}]]*[(h')[1];
            var startKeyObj = changeRaiseLength(startStr);
            var endKeyObj = changeRaiseLength(endStr);
            if (startKeyObj['['] == endKeyObj[']'] && endStr.indexOf('+') == -1) {
                $scope.dateString = '[' + $scope.dateString + ']';
            }
        }
    };
    /* 外部传递str*/
    $scope.$on('set-code', function (event, data) {
        if (data) {
            $scope.dateList = [];
            $scope.dateString = data;
            if ($scope.dateString && $scope.dateString.indexOf('z') > -1) {
                // $scope.dateString = $scope.dateString.substr(0, $scope.dateString.length - 1);
                $scope.vagueTime = true;
            } else {
                $scope.vagueTime = false;
            }
            exceptSimpleTime();
            newArr = $scope.newStr($scope.dateString);
            newArr = $scope.listInit(newArr);
            $scope.translate(newArr);
            // $scope.dateString = newArr.join('+');
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
    eventController.on('disableFuzzy', function (event) {
        $scope.isFuzzy = event.isFuzzy;
    });
    /* 初始化字符串*/
    // $scope.listInit();
    /* 根据星期 转换成中文*/
    $scope.weekTranslate = function (week) {
        switch (week) {
            case '1':
                return '周日';
            case '2':
                return '周一';
            case '3':
                return '周二';
            case '4':
                return '周三';
            case '5':
                return '周四';
            case '6':
                return '周五';
            case '7':
                return '周六';
            default:
                return '未知';
        }
    };
    /* 判断是否为最后一个，有加、没有不加*/
    $scope.isLast = function (arr, str) {
        $.each(arr, function (i, v) {
            if (i == arr.length) {
                str += v;
            } else {
                str += v + '、';
            }
        });
    };
    /* 数组去空*/
    $scope.arrEmpty = function (arr) {
        return $.grep(arr, function (n) {
            return $.trim(n).length > 0;
        });
    };
    /* 解析时间*/
    $scope.timeAnalyze = function (time) {
        if (time.indexOf('m') > -1 || time.indexOf('h') > -1) { // 如果时间包含时分
            var cTime = time.split('h')[1].split('m');
            if (time.split('h')[0].substr(0, 1) == 'y') {
                var tDate = time.split('h')[0];
                return tDate.split('y')[1].split('M')[0] + '年' + tDate.split('y')[1].split('M')[1].split('d')[0] + '月' + tDate.split('y')[1].split('M')[1].split('d')[1] + '日的' + cTime[0] + ':' + cTime[1];
            }
            var hTemp = (cTime[0] == '0' || !cTime[0]) ? '00' : cTime[0];
            var mTemp = (cTime[1] == '0' || !cTime[1]) ? '00' : cTime[1];
            return hTemp + ':' + mTemp;
        } else if (time.indexOf('M') > -1 && time.indexOf('d') > -1 && time.indexOf('y') == -1) { // (Mxdx)
            return time.split('M')[1].split('d')[0] + '月' + time.split('M')[1].split('d')[1] + '日';
        } else if (time.indexOf('M') > -1 && time.indexOf('d') > -1 && time.indexOf('y') > -1) { // 只有年月日
            return time.split('y')[1].split('M')[0] + '年' + time.split('y')[1].split('M')[1].split('d')[0] + '月' + time.split('y')[1].split('M')[1].split('d')[1] + '日';
        } else if (time.indexOf('d') > -1) {
            return $scope.weekTranslate(time.split('){d')[0]) + '起' + time.split('){d')[1].split('}')[0] + '天內';
        }
        return '周' + time;
    };
    // 如果时间段为数组，组合字符串
    function mutiArrayDate(arr) {
        var cResult = '';
        if (typeof arr == 'string') {
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
        if (dateSingle.length == 1) {
            var weeks = dateSingle.join('');
            var weeksArr = weeks.split(')*(');
            var weeksStr = [];
            var _time = ''; // 时间
            var dateTme = ''; // 时间
            var mutiDate = []; // 多维数组
            var dateMonth = []; // 月份
            var tempDays = []; // [[(xxxx)(xxxx)]*[(t2){d4}]]
            var fixWeeks = [];  // 固定时间 星期
            var fixTimes = [];  // 固定时间 时间
            var beginTime = '';
            var endTime = '';
            var endWeek;
            /* 存在[[(h7m30)(h12)]*(t4t5t6)]+[[(h14)(h20)]*(t4t5t6)]类似情况*/
            if (weeksArr[0].indexOf(')]*(') > -1) {
                $.each(weeksArr[0].split(')]*('), function (i, item) {
                    if (item.indexOf('t') > -1 && item.indexOf('(') > -1) {
                        item = item.slice(0, item.indexOf(')')).concat(item.slice(item.indexOf('(') + 1, item.length));
                    }
                    if (item.indexOf('t') > -1) {
                        weeksArr[1] = item;
                    } else {
                        weeksArr[0] = item;
                    }
                });
            } else if (weeksArr[0].indexOf(')*[(') > -1) {
                $.each(weeksArr[0].split(')*[('), function (i, item) {
                    if (item.indexOf('t') > -1 && item.indexOf('(') > -1) {
                        item = item.slice(0, item.indexOf(')')).concat(item.slice(item.indexOf('(') + 1, item.length));
                    }
                    if (item.indexOf('t') > -1) {
                        weeksArr[1] = item;
                    } else {
                        weeksArr[0] = item;
                    }
                });
            }
            /* 存在[[(t2)(t6)]*[[(h7m0)(h9m0)]+[(h17m0)(h20m0)]]]类似情况*/
            /* if (weeksArr[0].indexOf(')]*[(') > -1 && weeksArr[0].indexOf('{d1}') == -1) {
             $.each(weeksArr[0].split(')]*[('), function (i, item) {
             if (item.indexOf('t') > -1 && item.indexOf('(') > -1) {
             item = item.slice(0, item.indexOf(')')).concat(item.slice(item.indexOf('(') + 1, item.length));
             }
             if (item.indexOf('t') > -1) {
             weeksArr[1] = item;
             } else {
             weeksArr[0] = item;
             }
             });
             } else */
            if (weeksArr[0].indexOf(')]*[(') == -1 && weeksArr[0].indexOf('{d1}') > -1 && weeksArr[0].indexOf('t') == 0 && weeksArr[0].indexOf('+') == -1) {    // 固定时间，时间和日期 [(t7){d1}]*[(h19m00)(h21m00)]
                var splitSimpleDate = weeksArr[0].split('){d1}]*[(');
                fixTimes = splitSimpleDate[1].split(')(');
                fixWeeks.push(splitSimpleDate[0].split('t')[1]);
            } else if (weeksArr[0].indexOf(')]*[(') > -1 && weeksArr[0].indexOf('{d1}') > -1 && weeksArr[0].indexOf('[(t') > -1) {    // 固定时间，时间和日期 [[(h14m00)(h15m00)]*[(t3){d1}]+[(h14m00)(h15m00)]*[(t4){d1}]+[(h14m00)(h15m00)]*[(t6){d1}]]
                var mixFixedDate = weeksArr[0].split('][');
                for (var z = 0; z < mixFixedDate.length; z++) {
                    if (mixFixedDate[z].indexOf('){d1}') > -1) {
                        var splitFixDate = mixFixedDate[z].split(']*[');
                        fixTimes = splitFixDate[0].substr(1, splitFixDate[0].length - 2).split(')(');
                        fixWeeks.push(splitFixDate[1].split('){')[0].split('t')[1]);
                    }
                }
            } else if (weeksArr.length > 1 && weeksArr[1].indexOf(')]*[(') > -1) {
                $.each(weeksArr[1].split(')]*[('), function (i, item) {
                    if (item.indexOf('t') > -1 && item.indexOf('(') > -1) {
                        item = item.slice(0, item.indexOf(')')).concat(item.slice(item.indexOf('(') + 1, item.length));
                    }
                    if (item.indexOf('t') > -1) {
                        weeksArr[1] = item;
                    } else {
                        weeksArr[0] = item;
                    }
                });
            } else if (weeksArr.length > 1 && weeksArr[0].indexOf('t') > -1 && weeksArr[1].indexOf('t') == -1) {
                weeksArr.reverse();
            } else if (weeksArr.length == 1 && weeksArr[0].indexOf('){d1}]]*[(h') > -1) {
                var splitDate = weeksArr[0].split(']*[');
                var splitWeeks = splitDate[0].split('}][(');
                var fTime = splitDate[1];
                if (fTime.charAt(fTime.length - 1) == ')') {
                    fixTimes = fTime.substring(1, splitDate[1].length - 1).split(')(');
                } else {
                    fixTimes = fTime.substring(1).split(')(');
                }
                // $scope.begin_time = fixTimes[0];
                // $scope.end_time = fixTimes[1];
                for (var s = 0; s < splitWeeks.length; s++) {
                    fixWeeks.push(splitWeeks[s].split('){')[0].split('t')[1]);
                }
            } else if (weeksArr.length == 1 && weeksArr[0].indexOf('){d1}]*[(h') > -1) {   // 固定时间 只选择一天 和 时间
                var splitSimDate = weeksArr[0].split('){d1}]*[');
                fixTimes = splitSimDate[1].substring(1, splitSimDate[1].length - 1).split(')(');
                fixWeeks.push(splitSimDate[0].split('t')[1]);
            }
            // 固定日期 时间 星期
            if (weeksArr.length > 1 && weeksArr[0].indexOf(')(h') > -1 && weeksArr[0].indexOf('{d') == -1 && weeksArr[1].indexOf('{d') == -1) {
                weeksStr = $scope.arrEmpty(weeksArr[1].split('t')); // 星期数组去空
                dateTme = weeksArr[0];
                // }else if(weeksArr.length > 1 && weeksArr[0].indexOf(')(y') > -1){      //持续——日，例如 [(y2015M07d16h14m34)(y2015M12d30h16m36)]
            } else if (weeksArr[0].split('')[0] == '(' && weeksArr[0].split('')[weeksArr[0].split('').length - 1] == ')') {
                /* var dateArr = weeksArr[0].split('');
                dateArr[0] = '';
                dateArr[dateArr.length - 1] = '';
                weeksStr.push($scope.arrEmpty(dateArr).join(''));*/
                weeksStr.push(weeksArr[0].substr(1, weeksArr[0].length - 2));
            } else if (weeksArr[0].split('')[0] == 'M') { // 月份拆分
                dateMonth = weeksArr[0].split(')(');
            } else if (weeksArr.length > 1 && (weeksArr[0].indexOf('){d') > -1 || weeksArr[1].indexOf('){d') > -1)) { // 持续——周——连续天数{d4}
                weeksArr[0] = weeksArr[0].substr(1, weeksArr[0].length - 2);
            } else if (weeksArr[0].indexOf('){d1}][') > -1 && !fixWeeks.length) {  // 固定时间，只选星期 [[(t2){d1}]+[(t3){d1}]+[(t7){d1}]]
                var weekTemp = weeksArr[0].split('{d1}').join('').split(')][(').join('');
                weeksStr = weekTemp.substr(1, weekTemp.length - 2).split();
            } else if (weeksArr[0].indexOf('){d1}][') > -1 && fixWeeks.length) {  // 固定时间，选星期和时间 [[(h13m00)(h14m00)]*[(t3){d1}]+[(h13m00)(h14m00)]*[(t4){d1}]]
                dateTme = fixTimes.join(')(');
                weeksStr = fixWeeks.join('t').split();
            } else if (weeksArr.length == 1 && weeksArr[0].indexOf('){d1') > -1 && weeksArr[0].split(')]*[(').length == 2 && weeksArr[0].indexOf('y') == -1) {  // 固定时间，只选星期中的一天，包含时间
                var _splitTime = weeksArr[0].split(')]*[(');
                dateTme = _splitTime[0];
                weeksStr = _splitTime[1].split('){d1');
            } else if (weeksArr[0].indexOf('){d1}]*[(h') > -1 && fixWeeks.length == 1 && fixTimes.length == 2) {  // 固定时间，选一个星期和时间
                dateTme = fixTimes.join(')(');
                weeksStr = fixWeeks.join('t').split();
            } else if (weeksArr.length == 1 && weeksArr[0].indexOf('){d1') > -1 && weeksArr[0].indexOf('y') == -1) {  // 固定时间，只选星期中的一天，不包含时间
                weeksStr = weeksArr[0].split('){d1')[0].split();
            } else if (weeksArr.length == 1 && weeksArr[0].indexOf('){d1') > -1 && weeksArr[0].indexOf('y') > -1) {  // 持续时间，日，跨天，跨月
                weeksStr = weeksArr;
            } else if (weeksArr.length == 1 && weeksArr[0].indexOf(')(t') > -1 && weeksArr[0].indexOf('y') == -1 && weeksArr[0].indexOf('h') == -1) {  // 持续时间 周 只选择周
                weeksStr = weeksArr;
            } else if (weeksArr.length == 1 && weeksArr[0].indexOf(')]*[(h') > -1 && weeksArr[0].indexOf('t') > -1 && weeksArr[0].indexOf('y') == -1) {  // 单独的持续时间 周  有时间
                weeksStr = weeksArr;
            } else {
                weeksStr = $scope.arrEmpty(weeksArr[0].split('t'));
            }
            mutiDate = weeksStr.join('').split('][');
            if (weeksStr.length >= 1 && weeksStr[0].indexOf(')(') == -1 && mutiDate.length == 1 &&
                mutiDate[0].indexOf('y') == -1 && mutiDate[0].indexOf('{d') == -1) {
                for (var i = 0; i < weeksStr.length; i++) {
                    var splitWeek = weeksStr[i].split('t').join('').split('');
                    for (var j = 0; j < splitWeek.length; j++) {
                        // 排除不合法数据
                        if (!new RegExp(/^\d$/).test(splitWeek[j])) {
                            splitWeek.splice(j, 1, '');
                            continue;
                        }
                        wks.values[splitWeek[j] - 1].checked = true;
                        if (j == splitWeek.length - 1) {
                            detail += $scope.weekTranslate(splitWeek[j]);
                        } else {
                            detail += $scope.weekTranslate(splitWeek[j]) + '、';
                        }
                    }
                }
                detail = '每星期的' + detail;
                // 如果选择时分
                if (dateTme) {
                    $.each(dateTme.split(')('), function (n, item) { // 选择固定 时间（只选择时间）
                        if (n == 0) {
                            _time = $scope.timeAnalyze(item);
                        } else {
                            _time = _time + ' 到 ' + $scope.timeAnalyze(item);
                        }
                    });
                    detail = detail + '，从每天的 ' + _time; // 每个星期的周几的几点到几点
                }
            } else if ((weeksStr.length == 1 && mutiDate.length == 1 && weeksStr[0].indexOf(')(t') == -1 && weeksStr[0].indexOf('){d1}]*[(h') == -1 && weeksStr[0].indexOf('y') == -1) || (weeksArr[0].indexOf('M') > -1 && weeksArr[0].indexOf('y') == -1 && weeksArr[0].indexOf('d') == -1)) {
                _time = '';
                $.each(weeksStr.join('').split(')('), function (h, item) { // 选择固定 时间（只选择时间）
                    if (item.indexOf('][') > -1) {
                        return;
                    }
                    if (h == 0) {
                        _time = $scope.timeAnalyze(item);
                    } else {
                        _time = _time + ' 到 ' + $scope.timeAnalyze(item);
                    }
                });
                if (weeksArr[0].split('')[0] == '(' && weeksArr[0].split('')[weeksArr[0].split('').length - 1] == ')' && weeksArr[0].indexOf(']*[') > -1) { // 如果是持续时间 从...
                    detail = '从' + _time;
                    if (weeksArr[0].indexOf(')(M') > -1) { // (M12d1)(M12d31)]*[(h23m0)(h23m59)
                        var temp = weeksArr[0].substr(1, weeksArr[0].length - 2);
                        var _arr = temp.split(')]*[(');
                        detail = '从' + $scope.timeAnalyze(_arr[0].split(')(')[0]) + '到' + $scope.timeAnalyze(_arr[0].split(')(')[1]) + '，每天的' + $scope.timeAnalyze(_arr[1].split(')(')[0]) + '的' + $scope.timeAnalyze(_arr[1].split(')(')[1]);
                    }
                } else if (weeksArr[0].indexOf('t') > -1) { // 持续时间——周，同一天
                    var shortArr = weeksArr[0].split('*');
                    var weekCode = '';
                    if (shortArr[0].indexOf('t') > -1) {
                        weekCode = shortArr[0].substr('1');
                    } else {
                        weekCode = shortArr[1].substr('1');
                    }
                    detail = '每个' + $scope.weekTranslate(weekCode) + '的' + _time.substr(0, _time.length - 2);
                } else if (weeksArr[0].indexOf('y') > -1) {
                    detail = _time;
                } else {
                    detail = '每天的 ' + _time; // 如果是固定时间——每天的...
                }
            } else if ((weeksStr.length == 1 && mutiDate.length == 1 && weeksStr[0].indexOf(')(t') > -1 && weeksStr[0].indexOf('y') == -1)) {
                // 持续时间 周
                var conStr = weeksStr.join('');
                var weekTimeSplit = conStr.split(')]*[(');
                var beginWeek = weekTimeSplit[0].split(')(t')[0].split('t')[1];
                endWeek = weekTimeSplit[0].split(')(t')[1];
                // 没有时分
                if (weekTimeSplit.length == 1) {
                    detail = '每星期的' + $scope.weekTranslate(beginWeek) + '到' + $scope.weekTranslate(endWeek);
                } else {
                    beginTime = weekTimeSplit[1].split(')(')[0];
                    endTime = weekTimeSplit[1].split(')(')[1];
                    detail = '每星期的' + $scope.weekTranslate(beginWeek) + '到' + $scope.weekTranslate(endWeek) +
                        '，从每天的' + $scope.timeAnalyze(beginTime) + '到' + $scope.timeAnalyze(endTime);
                }
            } else if ((weeksStr.length == 1 && mutiDate.length > 1 && weeksArr[0].indexOf('{d1}') == -1) || (weeksStr.length == 1 && mutiDate.length == 1 && weeksArr[0].indexOf('+') == -1 && weeksArr[0].indexOf('{d1}') == -1)) {   // 持续时间
                var splitArr = [];
                var beginDate,
                    endDate,
                    timeSplit,
                    beginDateSplit,
                    endDateSplit,
                    beginTimeSplit,
                    endTimeSplit;
                // 如果有具体时间
                if (mutiDate[0].indexOf(')]*[(h') > -1) {
                    for (i = 0; i < mutiDate.length; i++) {
                        timeSplit = mutiDate[i].split(')]*[(');
                        beginDateSplit = timeSplit[0].split(')(')[0];
                        beginTimeSplit = timeSplit[1].split(')(')[0];
                        endDateSplit = timeSplit[0].split(')(')[1];
                        endTimeSplit = timeSplit[1].split(')(')[1];
                        // 如果是复杂时间（多个）
                        if (mutiDate.length > 1) {
                            if (i == 0) {
                                beginDate = beginDateSplit.substr(2);
                                beginTime = beginTimeSplit;
                            } else if (i == mutiDate.length - 1) {
                                endDate = endDateSplit;
                                endTime = endTimeSplit.substr(0, endTimeSplit.length - 2);
                            }
                        } else {    // 一个时间段，普通时间 length = 1
                            beginDate = beginDateSplit;
                            beginTime = beginTimeSplit;
                            endDate = endDateSplit;
                            endTime = endTimeSplit;
                        }
                    }
                    detail = '从' + $scope.timeAnalyze(beginDate) + '到' + $scope.timeAnalyze(endDate) + '，每天的' + $scope.timeAnalyze(beginTime) + '的' + $scope.timeAnalyze(endTime);
                } else if (mutiDate[mutiDate.length - 1].indexOf(']]*[(h') > -1) {  // 有时间，每天的xx到xx
                    for (i = 0; i < mutiDate.length; i++) {
                        mutiDate[i] = mutiDate[i].substr(1, mutiDate[i].length - 2);
                        timeSplit = mutiDate[i].split(')]]*[(');
                        beginDateSplit = timeSplit[0].split(')(')[0];
                        endDateSplit = timeSplit[0].split(')(')[1];
                        if (i == 0) {
                            if (beginDateSplit.substr(0, 1) == 'y') {
                                beginDate = beginDateSplit;
                            } else {
                                beginDate = beginDateSplit.substr(1);
                            }
                        } else if (i == mutiDate.length - 1) {
                            beginTimeSplit = timeSplit[1].split(')(')[0];
                            endTimeSplit = timeSplit[1].split(')(')[1];
                            endDate = endDateSplit;
                            beginTime = beginTimeSplit;
                            endTime = endTimeSplit;
                        }
                    }
                    detail = '从' + $scope.timeAnalyze(beginDate) + '到' + $scope.timeAnalyze(endDate) + '，每天的' + $scope.timeAnalyze(beginTime) + '的' + $scope.timeAnalyze(endTime);
                } else {
                    if (mutiDate.length == 1) {
                        splitArr = mutiDate[0].split(')(');
                    } else {
                        $.each(mutiDate, function (m, n) {
                            if (m == 0) {
                                n = n.substring(0, n.length - 1);
                                splitArr.push(n.split(')(')[0]);
                            } else if (m == mutiDate.length - 1) {
                                n = n.substring(1, n.length);
                                splitArr.push(n.split(')(')[1]);
                            } else {
                                n = n.substring(1, n.length - 1);
                            }
                        });
                    }
                    $.each(splitArr, function (p, item) { // 选择持续 日（连续的年月日，跨年处理）
                        if (p == 0) {
                            _time = $scope.timeAnalyze(item);
                        } else {
                            _time = _time + ' 到 ' + $scope.timeAnalyze(item);
                        }
                    });
                    detail = '从' + _time;
                }
            } else if (((weeksArr[0] && weeksArr[0].indexOf('{d') > -1) || (weeksArr[1] && weeksArr[1].indexOf('{d') > -1)) && fixTimes.length == 0 && fixWeeks.length == 0 && (weeksArr[0].indexOf('y') == -1 && weeksArr[1].indexOf('y') == -1)) { // {d4}的情况
                if (weeksArr[0].indexOf('){d') > -1) {
                    temp = weeksArr[0].split('){');
                    detail = '每个星期中' + $scope.weekTranslate(temp[0].split('t')[1]) + '的' + $scope.timeAnalyze(weeksArr[1].split(')(')[0]) + '到' + $scope.weekTranslate(parseInt(temp[0].split('t')[1], 10) + parseInt(temp[1].split('d')[1], 10) + '') + '的' + $scope.timeAnalyze(weeksArr[1].split(')(')[1]);
                } else {
                    temp = weeksArr[1].split('){');
                    detail = '每个星期中' + $scope.weekTranslate(temp[0].split('t')[1]) + '的' + $scope.timeAnalyze(weeksArr[0].split(')(')[0]) + '到' + $scope.weekTranslate(parseInt(temp[0].split('t')[1], 10) + parseInt(temp[1].split('d')[1], 10) + '') + '的' + $scope.timeAnalyze(weeksArr[0].split(')(')[1]);
                }
            } else if (fixTimes.length || fixWeeks.length) {    // 固定时间 选择星期和时间、持续时间 周
                var weekDetail = '';
                var startWeek;
                // 连续周
                if ('1234567'.indexOf(fixWeeks.join('')) > -1 && fixWeeks.length > 1) {
                    startWeek = $scope.weekTranslate(fixWeeks[0]);
                    endWeek = $scope.weekTranslate(fixWeeks[fixWeeks.length - 1]);
                    detail = startWeek + '到' + endWeek + '每天的 ' + $scope.timeAnalyze(fixTimes[0]) + ' 到 ' + $scope.timeAnalyze(fixTimes[1]);
                } else {
                    for (var g = 0; g < fixWeeks.length; g++) {
                        if (g == 0) {
                            weekDetail = $scope.weekTranslate(fixWeeks[g]);
                        } else {
                            weekDetail += '、' + $scope.weekTranslate(fixWeeks[g]);
                        }
                    }
                    detail = '每个星期中' + weekDetail + '的 ' + $scope.timeAnalyze(fixTimes[0]) + ' 到 ' + $scope.timeAnalyze(fixTimes[1]);
                }
            } else if (weeksArr[0].indexOf('y') > -1 && weeksArr[0].indexOf('{d1}') > -1) { // 持续时间 日 跨天 跨月 {d1}
                var dBeginDate,
                    dEndDate,
                    dBeginTime,
                    dEndTime,
                    dTimeSplit,
                    dBeginDateSplit,
                    dEndDateSplit,
                    dBeginTimeSplit,
                    dEndTimeSplit;
                // 如果有具体时间
                for (i = 0; i < mutiDate.length; i++) {
                    dTimeSplit = mutiDate[i].split(']*[(');
                    dBeginDateSplit = dTimeSplit[0].split(')')[0];
                    dBeginTimeSplit = dTimeSplit[1].split(')(')[0];
                    dEndDateSplit = dTimeSplit[0].split(')')[0];
                    dEndTimeSplit = dTimeSplit[1].split(')(')[1];
                    if (i == 0) {
                        dBeginDate = dBeginDateSplit.substr(2);
                        dBeginTime = dBeginTimeSplit;
                    } else if (i == mutiDate.length - 1) {
                        dEndDate = dEndDateSplit.substr(2);
                        dEndTime = dEndTimeSplit.substr(0, dEndTimeSplit.length - 2);
                    }
                }
                detail = '从' + $scope.timeAnalyze(dBeginDate) + '的' + $scope.timeAnalyze(dBeginTime) + '到' + $scope.timeAnalyze(dEndDate) + '的' + $scope.timeAnalyze(dEndTime);
            }
            if (dateMonth.length > 1) { // 不跨年的月份
                detail = '每年的 ' + dateMonth[0].substr(1) + ' 月份到 ' + dateMonth[1].substr(1) + ' 月份';
            }
        } else {
            /* 所选月份跨年*/
            var mBegin,
                mEnd;
            $.each(dateSingle, function (m, n) {
                if (m == 0) {
                    mBegin = n.split('M')[1].split(')(')[0];
                } else if (m == 1) {
                    mEnd = n.split('M')[2].split(')')[0];
                }
            });
            detail = '每年的' + mBegin + '月到次年的' + mEnd + '月';
        }
        /* 持续时间——周，例如：每个星期中周二的09:33到周六的14:33*/
        if (v.split('][').length > 1 && (
            (v.split('][')[0].indexOf('t') > -1 && v.split('][')[0].indexOf('h') > -1 && v.split('][')[0].indexOf('m') > -1 && v.split('][')[0].indexOf('y') == -1 && v.split('][')[0].indexOf('M') == -1 && v.split('][')[0].indexOf('d') == -1) || (v.split('][')[1].indexOf('t') > -1 && v.split('][')[1].indexOf('h') > -1 && v.split('][')[1].indexOf('m') > -1 && v.split('][')[1].indexOf('y') == -1 && v.split('][')[1].indexOf('M') == -1 && v.split('][')[1].indexOf('d') == -1))) {
            var weekArr = [];
            var bwk,
                ewk,
                btime,
                etime;
            if (vague) {
                v = v.substring(2, v.split('').length - 2);
                weekArr = v.split('][');
            } else {
                v = v.substring(1, v.split('').length - 1);
                weekArr = v.split('][');
            }
            /* 类似[(t2)(t6)]*[[(h7m0)(h9m0)]+[(h17m0)(h20m0)]]旧值格式*/
            if (weekArr.length == 2 && ((weekArr[0].indexOf('t') > -1 && weekArr[1].indexOf('t') == -1) || (weekArr[1].indexOf('t') > -1 && weekArr[0].indexOf('t') == -1))) {
                var btime2,
                    etime2,
                    tempWk;
                if (weekArr[0].indexOf('t') > -1) {
                    if (weekArr[0].indexOf(')]*[[(')) {
                        tempWk = weekArr[0].split(')]*[[(');
                        bwk = $scope.weekTranslate(tempWk[0].split(')(t')[0].substr(1));
                        ewk = $scope.weekTranslate(tempWk[0].split(')(t')[1]);
                        btime = $scope.timeAnalyze(tempWk[1].split(')(')[0]);
                        etime = $scope.timeAnalyze(tempWk[1].split(')(')[1].substring(0, tempWk[1].split(')(')[1].length - 3));
                        btime2 = $scope.timeAnalyze(weekArr[1].split(')(')[0].substr(1));
                        etime2 = $scope.timeAnalyze(weekArr[1].split(')(')[1].substring(0, weekArr[1].split(')(')[1].length - 2));
                        detail = '每个星期中' + bwk + '到' + ewk + '的' + btime + '到' + etime + '和' + btime2 + '到' + etime2;
                    }
                } else {
                    tempWk = weekArr[1].split(')]]*[(');
                    bwk = $scope.weekTranslate(tempWk[1].split(')(t')[0].substr(1));
                    ewk = $scope.weekTranslate(tempWk[1].split(')(t')[1]);
                    btime = $scope.timeAnalyze(tempWk[0].split(')(')[0]);
                    etime = $scope.timeAnalyze(tempWk[0].split(')(')[1].substring(0, tempWk[0].split(')(')[1].length - 3));
                    btime2 = $scope.timeAnalyze(weekArr[0].split(')(')[0].substr(1));
                    etime2 = $scope.timeAnalyze(weekArr[0].split(')(')[1].substring(0, weekArr[0].split(')(')[1].length - 2));
                    detail = '每个星期中' + bwk + '到' + ewk + '的' + btime + '到' + etime + '和' + btime2 + '到' + etime2;
                }
            } else {
                $.each(weekArr, function (m, n) {
                    var wkAtime = [];
                    if (m == 0) {
                        wkAtime = n.split('*');
                        if (wkAtime[0].indexOf('t') > -1) {
                            bwk = $scope.weekTranslate(wkAtime[0].substr(1));
                            btime = wkAtime[1].split(')(')[0].split('[(')[1];
                        } else {
                            bwk = $scope.weekTranslate(wkAtime[1].substr(1));
                            btime = wkAtime[0].split(')(')[0].split('[(')[1];
                        }
                    } else if (m == weekArr.length - 1) {
                        wkAtime = n.split('*');
                        if (wkAtime[0].indexOf('t') > -1) {
                            ewk = $scope.weekTranslate(wkAtime[0].substr(1));
                            etime = wkAtime[1].split(')(')[1].split(')]')[0];
                        } else if (wkAtime.length > 1) {
                            ewk = $scope.weekTranslate(wkAtime[1].substr(1));
                            etime = wkAtime[0].split(')(')[1].split(')]')[0];
                        } else if (wkAtime.length == 1 && weekArr.length > 1) {
                            ewk = $scope.weekTranslate(wkAtime[0].substring(1, wkAtime[0].length - 1));
                            etime = wkAtime[0].substring(1, wkAtime[0].length - 1).split(')(')[1];
                        }
                    }
                });
                btime = $scope.timeAnalyze(btime);
                etime = $scope.timeAnalyze(etime);
                detail = '每个星期中' + bwk + '的' + btime + '到' + ewk + '的' + etime;
            }
        }
        if (vague) detail += '（模糊）';
        $scope.dateList.push({
            code: mutiArrayDate(originCode),
            describe: detail
        });
    };
    /* 解析字符串数组*/
    $scope.translate = function (arr) {
        var vague = false; // 是否模糊
        $.each(arr, function (i, v) {
            if (v) {
                if (v.split('')[0] == '[') {
                    v = $scope.newStr(v, true);
                } else {
                    v = $scope.newStr(v);
                }
                $scope.translateDetail(v, vague);
            }
        });
    };
    $scope.translate($scope.arrEmpty(newArr));
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
        } else if ($scope.dateString.charAt($scope.dateString.length - 1) == 'z') {
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
            if ($scope.dateList[i].code == itemCode) {
                $scope.dateList.splice(i, 1);
            }
        }
        if ($scope.dateList.length === 0) {
            $scope.dateString = '';
        }
        // 如果删到只剩最后一条数据，删除外围[]
        if ($scope.dateList.length === 1) {
            // $scope.dateString = $scope.dateString.substr(1, $scope.dateString.length - 2);
            if (typeof $scope.dateList[0].code == 'string') {
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
                if (i == 0) {
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
    $scope.dateSelect = function (e) {
        eventController.fire('limitTimeCtrl');
        $('.datetip').hide();
        if ($('.datetip').length > 1) {
            for (var i = 0; i < $('.datetip').length - 1; i++) {
                $('.datetip')[i].remove();
            }
        }
        $scope.showDatePicker = true;
        $scope.dateInit();
        // 默认显示固定时间
        $scope.timeType = '0';
        var eId = 'fmDateTimer-' + $scope.$id;
        var dateTimeWell = $(e.target).parents('.date-well').parent();
        var dateTip = dateTimeWell.find('.datetip');
        if ($('#' + eId).length == 0) {
            dateTip.attr('id', eId);
            if (dateTimeWell.attr('is-relativePover') == 1) {
                dateTip.css({
                    top: ($(e.target).offset().top - $(e.target).parents('.popover').offset().top) / 2 + 'px',
                    right: '300px'
                });
                dateTip.appendTo(dateTimeWell);
            } else {
                dateTip.css({
                    top: ($(e.target).offset().top - 100) + 'px',
                    right: (dateTimeWell.attr('data-type') == 1) ? '360px' : '600px'
                });
                // dateTip.appendTo('body');
                dateTip.appendTo(dateTimeWell);
            }
            dateTip.show();
        } else {
            if (dateTimeWell.attr('is-relativePover') == 1) {
                $('#' + eId).css({
                    top: ($(e.target).offset().top - $(e.target).parents('.popover').offset().top) / 2 + 'px',
                    right: '300px'
                });
            } else {
                $('#' + eId).css({
                    top: ($(e.target).offset().top - 100) + 'px',
                    right: (dateTimeWell.attr('data-type') == 1) ? '360px' : '600px'
                });
            }
            $('#' + eId).show();
        }
        $scope.dateIndex = -1;
    };
    // 如果时分只有一位，自动补0
    var timeCoverZero = function (time) {
        var _hour = time.split(':')[0];
        var _mins = time.split(':')[1];
        if (_hour.length == 1) {
            _hour = '0' + _hour;
        }
        if (_mins.length == 1) {
            _mins = '0' + _mins;
        }
        return _hour + ':' + _mins;
    };
    // 逆向解析 自动选择时间
    $scope.reverseDateTime = function (code) {
        var splitDate = [];
        var splitWeeks,
            splitTimes,
            fixTimes,   // 固定时间
            fixWeeks,   // 固定星期
            complexDate,
            dateArray,
            beginYear,
            beginMonth,
            beginDay,
            endYear,
            endMonth,
            endDay,
            i,
            j;
        // 固定时间 既选日期又选时间
        if (code.indexOf('){d1}]]*[(h') > -1) {
            if (code.charAt(code.length - 3) == ')') {
                code = code.substring(1, code.length - 3);
            } else {
                code = code.substring(1, code.length - 2);
            }
            splitDate = code.split(']]*[(h');
            splitWeeks = splitDate[0].split('t');
            for (i = 0; i < splitWeeks.length; i++) {
                if (i > 0) {
                    wks.values[splitWeeks[i].charAt(0) - 1].checked = true;
                    $scope.wks.checks.push(wks.values[splitWeeks[i].charAt(0) - 1]);
                }
            }
            $scope.timeType = '0';
            fixTimes = splitDate[1];
            $scope.begin_time = timeCoverZero(splitDate[1].split(')(h')[0].replace(/m/, ':'));
            $scope.end_time = timeCoverZero(splitDate[1].split(')(h')[1].replace(/m/, ':'));
        } else if (code.indexOf('){d1}]*[(h') > -1) {   // 固定时间 只选星期中一天 和时间
            code = code.substring(1, code.length - 3);
            if (code.charAt(code.length - 1) == ')') {
                code = code.substring(0, code.length - 1);
            }
            splitDate = code.split(']*[(h');
            splitWeeks = splitDate[0].split('t');
            for (i = 0; i < splitWeeks.length; i++) {
                if (i > 0) {
                    wks.values[splitWeeks[i].charAt(0) - 1].checked = true;
                    $scope.wks.checks.push(wks.values[splitWeeks[i].charAt(0) - 1]);
                }
            }
            $scope.timeType = '0';
            fixTimes = splitDate[1];
            $scope.begin_time = timeCoverZero(splitDate[1].split(')(h')[0].replace(/m/, ':'));
            $scope.end_time = timeCoverZero(splitDate[1].split(')(h')[1].replace(/m/, ':'));
        } else if (code.indexOf('{d1}') > -1 && code.indexOf('y') == -1 && code.indexOf('h') == -1) {  // 只选择星期
            splitWeeks = code.split('t');
            for (i = 0; i < splitWeeks.length; i++) {
                if (i > 0) {
                    wks.values[splitWeeks[i].charAt(0) - 1].checked = true;
                    $scope.wks.checks.push(wks.values[splitWeeks[i].charAt(0) - 1]);
                }
            }
            $scope.timeType = '0';
        } else if (code.indexOf('+') == -1 && code.indexOf('h') > -1 && code.indexOf('t') == -1 && code.indexOf('y') == -1) {
            // 只选择时分，没有星期
            code = code.substring(3, code.length - 2);
            // code = code.substr(3, code.length - 4);
            $scope.begin_time = timeCoverZero(code.split(')(h')[0].replace(/m/, ':'));
            $scope.end_time = timeCoverZero(code.split(')(h')[1].replace(/m/, ':'));
            $scope.timeType = '0';
        } else if (code.indexOf('t') > -1 && code.indexOf('+') == -1 && code.indexOf('y') == -1 && code.indexOf('h') == -1) { // 持续时间 周 不选时分
            code = code.substr(3, code.length - 5);
            splitWeeks = code.split(')(t');
            $scope.wks.wBeginSelection = wks.values[splitWeeks[0] - 1];
            $scope.wks.wEndSelection = wks.values[splitWeeks[1] - 1];
            $scope.timeType = '1';
            dwm.selection = dwm.values[1];
        } else if (code.indexOf('t') > -1 && code.indexOf('+') == -1 && code.indexOf('y') == -1 && code.indexOf('h') > -1) { // 持续时间 周 选时分
            code = code.substring(4, code.length - 3);
            splitDate = code.split(')]*[(h');
            splitWeeks = splitDate[0].split(')(t');
            $scope.wks.wBeginSelection = wks.values[splitWeeks[0] - 1];
            $scope.wks.wEndSelection = wks.values[splitWeeks[1] - 1];
            $scope.w_begin_time = timeCoverZero(splitDate[1].split(')(h')[0].replace(/m/, ':'));
            $scope.w_end_time = timeCoverZero(splitDate[1].split(')(h')[1].replace(/m/, ':'));
            $scope.timeType = '1';
            dwm.selection = dwm.values[1];
        } else if (code.indexOf('M') > -1 && code.indexOf('+') == -1 && code.indexOf('y') == -1) { // 选择月份
            code = code.substr(2, code.length - 4);
            $scope.mons.begin = mons.values[code.split(')(')[0].split('M')[1] - 1];
            $scope.mons.end = mons.values[code.split(')(')[1].split('M')[1] - 1];
            $scope.timeType = '1';
            dwm.selection = dwm.values[2];
        } else if (code.indexOf('y') > -1 && code.indexOf('+') == -1 && code.indexOf('h') == -1) {
            // 从xxxx年x月x日到xxxx年x月x日，不跨年
            code = code.substring(2, code.length - 2);
            splitDate = code.split(')(');
            beginYear = splitDate[0].split('M')[0].split('y')[1];
            beginMonth = splitDate[0].split('M')[1].split('d')[0];
            beginDay = splitDate[0].split('d')[1];
            endYear = splitDate[1].split('M')[0].split('y')[1];
            endMonth = splitDate[1].split('M')[1].split('d')[0];
            endDay = splitDate[1].split('d')[1];
            $scope.dBeginDate = new Date(beginYear, beginMonth - 1, beginDay);
            $scope.dEndDate = new Date(endYear, endMonth - 1, endDay);
            $scope.timeType = '1';
            dwm.selection = dwm.values[0];
        } else if (code.indexOf('y') > -1 && code.indexOf('+') > -1 && code.indexOf('h') == -1) {
            // 从xxxx年x月x日到xxxx年x月x日，跨年
            code = code.substring(3, code.length - 3);
            dateArray = code.split(')]+[(');
            splitDate.push(dateArray[0].split(')(')[0]);
            splitDate.push(dateArray[dateArray.length - 1].split(')(')[1]);
            beginYear = splitDate[0].split('M')[0].split('y')[1];
            beginMonth = splitDate[0].split('M')[1].split('d')[0];
            beginDay = splitDate[0].split('d')[1];
            endYear = splitDate[1].split('M')[0].split('y')[1];
            endMonth = splitDate[1].split('M')[1].split('d')[0];
            endDay = splitDate[1].split('d')[1];
            $scope.dBeginDate = new Date(beginYear, beginMonth - 1, beginDay);
            $scope.dEndDate = new Date(endYear, endMonth - 1, endDay);
            $scope.timeType = '1';
            dwm.selection = dwm.values[0];
        } else if (code.indexOf('y') > -1 && code.indexOf('+') == -1 && code.indexOf('h') > -1) {
            // 从xxxx年x月x日到xxxx年x月x日，每天的x点到x点，不跨年
            code = code.substring(3, code.length - 3);
            complexDate = code.split(')]*[(h');
            splitDate = complexDate[0].split(')(');
            beginYear = splitDate[0].split('M')[0].split('y')[1];
            beginMonth = splitDate[0].split('M')[1].split('d')[0];
            beginDay = splitDate[0].split('d')[1];
            endYear = splitDate[1].split('M')[0].split('y')[1];
            endMonth = splitDate[1].split('M')[1].split('d')[0];
            endDay = splitDate[1].split('d')[1];
            $scope.dBeginDate = new Date(beginYear, beginMonth - 1, beginDay);
            $scope.dEndDate = new Date(endYear, endMonth - 1, endDay);
            $scope.d_begin_time = timeCoverZero(complexDate[1].split(')(h')[0].replace(/m/, ':'));
            $scope.d_end_time = timeCoverZero(complexDate[1].split(')(h')[1].replace(/m/, ':'));
            $scope.timeType = '1';
            dwm.selection = dwm.values[0];
        } else if (code.indexOf('y') > -1 && code.indexOf('+') > -1 && code.indexOf('h') > -1) {
            // 从xxxx年x月x日到xxxx年x月x日，每天的x点到x点，跨年
            code = code.substring(4, code.length - 3);
            complexDate = code.split(')]]*[(h');
            dateArray = complexDate[0].split(')]+[(');
            splitDate.push(dateArray[0].split(')(')[0]);
            splitDate.push(dateArray[dateArray.length - 1].split(')(')[1]);
            beginYear = splitDate[0].split('M')[0].split('y')[1];
            beginMonth = splitDate[0].split('M')[1].split('d')[0];
            beginDay = splitDate[0].split('d')[1];
            endYear = splitDate[1].split('M')[0].split('y')[1];
            endMonth = splitDate[1].split('M')[1].split('d')[0];
            endDay = splitDate[1].split('d')[1];
            $scope.dBeginDate = new Date(beginYear, beginMonth - 1, beginDay);
            $scope.dEndDate = new Date(endYear, endMonth - 1, endDay);
            $scope.d_begin_time = timeCoverZero(complexDate[1].split(')(h')[0].replace(/m/, ':'));
            $scope.d_end_time = timeCoverZero(complexDate[1].split(')(h')[1].replace(/m/, ':'));
            $scope.timeType = '1';
            dwm.selection = dwm.values[0];
        }
       /* if ($scope.timeType == '0') {
            $scope.begin_time = fixTimes.split(')(h')[0].replace(/m/, ':');
            $scope.end_time = fixTimes.split(')(h')[1].replace(/m/, ':');
        }*/
    };
    // 单独修改某一个时间段
    $scope.dateEdit = function (code, index, e) {
        $scope.dateSelect(e);
        var dateTimeWell = $(e.target).parents('.date-well').parent();
        var dateTip = dateTimeWell.find('.datetip');
        $scope.timeType = '0';
        if (dateTimeWell.attr('data-type') == 1) {
            dateTip.css({
                top: $(e.target).offset().top - 95 + 'px',
                right: '300px'
            });
        } else {
            dateTip.css({
                top: $(e.target).offset().top - $(e.target).parents('.popover').offset().top - 95 + 'px',
                right: '300px'
            });
        }
        $scope.dateIndex = index;
        $scope.reverseDateTime(code);
        // dateTip.show();
    };
    $scope.close = function () {
        $scope.showDatePicker = false;
        $('#fmDateTimer-' + $scope.$id).hide();
    };
    /* 点击选择时间*/
    $scope.selectTime = function (e) {
        $(e.target).timepicki($scope, $(e.target).attr('ng-model'));
    };
    /* 选择 日月周 ，切换*/
    $scope.dwmType = function (e, switchObj) {
        switch (switchObj.code) {
            case 'd':
                dwm.selection = dwm.values[0];
                break;
            case 'w':
                dwm.selection = dwm.values[1];
                break;
            case 'm':
                dwm.selection = dwm.values[2];
                break;
            default:
                dwm.selection = dwm.values[0];
                break;
        }
    };
    /* 点击输入框选择日期*/
    $scope.selectDate = function (e) {
        $timeout(function () {
            $(e.target).parents('.time-select').find('.date-picker').triggerHandler('click');
        });
    };
    /* 点击星期 激活active*/
    $scope.wks.checks = [];
    $scope.weekGroup = function (wek) {
        if (wek.checked) {
            wek.checked = false;
            $scope.wks.checks.splice(jQuery.inArray(wek, $scope.wks.checks), 1);
        } else {
            wek.checked = true;
            $scope.wks.checks.push(wek);
        }
       /* var checkObject = {
            name: $(e.target).attr('check-name'),
            value: $(e.target).attr('check-value'),
            code: $(e.target).attr('check-code')
        };
        if ($(e.target).hasClass('active')) {
            $(e.target).removeClass('active');
            $scope.wks.checks.splice(jQuery.inArray(checkObject, $scope.wks.checks), 1);
        } else {
            $(e.target).addClass('active');
            $scope.wks.checks.push(checkObject);
        }*/
    };
    /* 选择星期*/
    $scope.seletedAddon = function (e) {
        if ($(e.target).attr('ng-model') == 'wks.wBeginSelection') {
            if ($scope.wks.wBeginSelection) {
                if ($scope.wks.wBeginSelection.code > $scope.wks.wEndSelection.code) {
                    $scope.wks.wEndSelection = $scope.wks.values[6];
                }
            }
        } else if ($scope.wks.wEndSelection) {
            if ($scope.wks.wBeginSelection.code > $scope.wks.wEndSelection.code) {
                $scope.wks.wBeginSelection = $scope.wks.values[0];
            }
        }
    };
    /* 错误提示*/
    $scope.alertMsg = function (dateWell, msg) {
        dateWell.find('.error-msg').text(msg);
        dateWell.find('.date-msg').show();
        var timer = $timeout(function () {
            dateWell.find('.date-msg').fadeOut();
        }, 2000);
    };
    /* 成功提示*/
    $scope.alertSucMsg = function (dateWell, msg) {
        dateWell.find('.success-msg').text(msg);
        dateWell.find('.date-suc-msg').show();
        var timer = $timeout(function () {
            dateWell.find('.date-suc-msg').fadeOut();
        }, 2000);
    };
    /* 验证输入是否合法*/
    $scope.dateValid = function (dateWell) {
        if (dateWell.find("input[time-type='fix-time']").is(':checked')) {
            if ($scope.wks.checks.length == 0 && !$scope.begin_time && !$scope.end_time) {
                $scope.alertMsg(dateWell, '请至少选择一个条件！');
                return false;
            }
            if (!$scope.begin_time && $scope.end_time) {
                $scope.alertMsg(dateWell, '请选择开始时间！');
                return false;
            }
            if ($scope.begin_time && !$scope.end_time) {
                $scope.alertMsg(dateWell, '请选择结束时间！');
                return false;
            }
            if ($scope.begin_time >= $scope.end_time && $scope.begin_time && $scope.end_time) {
                $scope.alertMsg(dateWell, '结束时间必须大于开始时间！');
                return false;
            }
            return true;
        }
        /* 如果选择 持续时间分为三种情况——日、周、月*/
        switch (dwm.selection.code) {
            case 'd':
                if (!$scope.dBeginDate) {
                    $scope.alertMsg(dateWell, '请选择开始日期！');
                    break;
                }
                if (!$scope.dEndDate) {
                    $scope.alertMsg(dateWell, '请选择结束日期！');
                    break;
                }
                if (!$scope.d_begin_time && $scope.d_end_time) {
                    $scope.alertMsg(dateWell, '请选择开始时间！');
                    break;
                }
                if ($scope.d_begin_time && !$scope.d_end_time) {
                    $scope.alertMsg(dateWell, '请选择结束时间！');
                    break;
                }
                if ($scope.dBeginDate == $scope.dEndDate && !$scope.d_begin_time && !$scope.d_end_time) {
                    $scope.alertMsg(dateWell, '开始时间不能等于结束时间！');
                    break;
                }
                if ($scope.dBeginDate == $scope.dEndDate && $scope.d_begin_time > $scope.d_end_time) {
                    $scope.alertMsg(dateWell, '结束时间必须大于开始时间！');
                    break;
                }
                return true;
            case 'w':
                if (!$scope.wks.wBeginSelection && $scope.wks.wEndSelection) {
                    $scope.alertMsg(dateWell, '请选择开始时间的星期！');
                    break;
                }
                if (!$scope.w_begin_time && $scope.w_end_time) {
                    $scope.alertMsg(dateWell, '请选择开始时间！');
                    break;
                }
                if (!$scope.wks.wEndSelection && $scope.wks.wBeginSelection) {
                    $scope.alertMsg(dateWell, '请选择结束时间的星期！');
                    break;
                }
                if (!$scope.w_end_time && $scope.w_begin_time) {
                    $scope.alertMsg(dateWell, '请选择结束时间！');
                    break;
                }
                // 与小武确认时间有自定义检查项，故前端不做控制
                // if (($scope.w_begin_time && $scope.w_end_time) && ($scope.w_begin_time == $scope.w_end_time)) {
                //     $scope.alertMsg(dateWell, '开始时间不能等于结束时间！');
                //     break;
                // }
                // if (($scope.w_begin_time && $scope.w_end_time) && ($scope.w_begin_time > $scope.w_end_time)) {
                //     $scope.alertMsg(dateWell, '开始时间不能大于结束时间！');
                //     break;
                // }
                return true;
            case 'm':
                if (!$scope.mons.begin.code) {
                    $scope.alertMsg(dateWell, '请选择开始月份！');
                    break;
                }
                if (!$scope.mons.end.code) {
                    $scope.alertMsg(dateWell, '请选择结束月份！');
                    break;
                }
                if ($scope.mons.end.code == $scope.mons.begin.code) {
                    $scope.alertMsg(dateWell, '开始月份不能等于结束月份！');
                    break;
                }
                if ($scope.mons.end.code < $scope.mons.begin.code) {
                    $scope.alertMsg(dateWell, '开始月份不能大于结束月份！');
                    break;
                }
                return true;
            default:
                $scope.alertMsg(dateWell, '请正确输入！');
                break;
        }
        return false;
    };
    // 判断在某月有多少天，并返回
    function daysInMounth(year, month) {
        var result = {
            final: false,
            nextDay: 0,
            nextMonth: 0
        };
        var realDay;
        var curDate = new Date(year, month - 1);
        /* 获取当前月份 */
        var curMonth = curDate.getMonth();
        /*  生成实际的月份: 由于curMonth会比实际月份小1, 故需加1 */
        curDate.setMonth(curMonth + 1);
        /* 将日期设置为0 */
        curDate.setDate(0);
        return curDate.getDate();
    }
    /* 保存时间段*/
    $scope.dateSave = function (e) {
        var dateWell = $(e.target).parents('.datetip');
        var dateListWell = $(e.target).parents('.date-well');
        /* 保存时处理过的数据，一个code一个中文描述*/
        var dateTime = {
            code: function () {
                if ($scope.timeType == '0') {
                    var checksList = [];
                    $.each($scope.wks.checks, function (i, v) {
                        checksList.push(v.code);
                    });
                    var _result = '';
                    /* 第一种可能：固定时间 只选择了星期*/
                    var $beginTime,
                        $endTime,
                        $beginHour,
                        $beginMinute,
                        $endHour,
                        $endMinute,
                        $weeks,
                        $result;
                    $result = '';
                    $weeks = checksList.sort();
                    // 固定时间 只选择星期
                    if (!$scope.begin_time && !$scope.end_time) {
                        for (var o = 0; o < $weeks.length; o++) {
                            if (o == 0) {
                                if ($weeks.length == 1) {
                                    _result = '(t' + $weeks[o] + '){d1}';
                                } else {
                                    _result = '[(t' + $weeks[o] + '){d1}]';
                                }
                            } else {
                                _result += '+[(t' + $weeks[o] + '){d1}]';
                            }
                        }
                       /* if ($scope.vagueTime) {
                            _result = '[[' + _result + ']*z]';
                        } else {
                            _result = '[' + _result + ']';
                        }*/
                        return '[' + _result + ']';
                    } else if ($scope.wks.checks.length != 0 && $scope.begin_time && $scope.end_time) { // 第二种可能：固定时间 选了 星期和 时间段
                        $beginTime = $scope.begin_time.split(':');
                        $endTime = $scope.end_time.split(':');
                        $beginHour = $beginTime[0];
                        $beginMinute = $beginTime[1];
                        $endHour = $endTime[0];
                        $endMinute = $endTime[1];
                        for (var k = 0; k < $weeks.length; k++) {
                            if (k == 0) {
                                if ($weeks.length == 1) {
                                    $result = '(t' + $weeks[k] + '){d1}';
                                } else {
                                    $result = '[(t' + $weeks[k] + '){d1}]';
                                }
                            } else {
                                $result += '+[(t' + $weeks[k] + '){d1}]';
                            }
                        }
                        if ($weeks.length) {
                            $result = '[' + $result + ']';
                        }
                        $result = '[' + $result + '*[(h' + $beginHour + 'm' + $beginMinute + ')(h' + $endHour + 'm' + $endMinute + ')]]';
                        return $result;
                        /* $beginTime = $scope.begin_time.split(':');
                         $endTime = $scope.end_time.split(':');
                         $beginHour = $beginTime[0];
                         $beginMinute = $beginTime[1];
                         $endHour = $endTime[0];
                         $endMinute = $endTime[1];
                         if ($scope.vagueTime) {
                         return '[[[(h' + $beginHour + 'm' + $beginMinute + ')(h' + $endHour + 'm' + $endMinute + ')]*(' + _result + ')]*z]';
                         }
                         return '[[(h' + $beginHour + 'm' + $beginMinute + ')(h' + $endHour + 'm' + $endMinute + ')]*(' + _result + ')]';*/
                    } else if ($scope.wks.checks.length == 0) { // 第三种可能：固定时间 只选择时间段
                        $beginTime = $scope.begin_time.split(':');
                        $endTime = $scope.end_time.split(':');
                        $beginHour = $beginTime[0];
                        $beginMinute = $beginTime[1];
                        $endHour = $endTime[0];
                        $endMinute = $endTime[1];
                        return '[(h' + $beginHour + 'm' + $beginMinute + ')(h' + $endHour + 'm' + $endMinute + ')]';
                    }
                } else if ($scope.timeType == '1') {
                    /* 如果选择 持续时间分为三种情况——日、周、月*/
                    var i;
                    switch (dwm.selection.code) {
                        case 'd':
                            var $beginDate;
                            if (typeof $scope.dBeginDate == 'object') {
                                $beginDate = Utils.newDateFormat($scope.dBeginDate, 'yyyy-MM-dd').split('-');
                            } else {
                                $beginDate = $scope.dBeginDate.split('-');
                            }
                            var $beginYear = $beginDate[0]; // 开始年份
                            var $beginMonth = parseInt($beginDate[1], 10); // 开始月份
                            var $beginDay = parseInt($beginDate[2], 10); // 开始天数
                            var $endDate;
                            if (typeof $scope.dEndDate == 'object') {
                                $endDate = Utils.newDateFormat($scope.dEndDate, 'yyyy-MM-dd').split('-');
                            } else {
                                $endDate = $scope.dEndDate.split('-');
                            }
                            var $endYear = $endDate[0]; // 结束年份
                            var $endMonth = parseInt($endDate[1], 10); // 结束月份
                            var $endDay = parseInt($endDate[2], 10); // 结束天数
                            if ($scope.d_begin_time) {
                                $beginTime = $scope.d_begin_time.split(':');
                                $beginHour = $beginTime[0]; // 开始小时数
                                $beginMinute = $beginTime[1]; // 开始分钟
                            }
                            if ($scope.d_end_time) {
                                $endTime = $scope.d_end_time.split(':');
                                $endHour = $endTime[0]; // 结束小时数
                                $endMinute = $endTime[1]; // 结束分钟
                            }
                            var yearLength = parseInt($endYear, 10) - parseInt($beginYear, 10);
                            var difYear,
                                bYear,
                                $start,
                                $middle,
                                $end;
                            if (!$scope.d_begin_time || !$scope.d_end_time) {
                                if (yearLength == 0) { // 开始年和结束年为同一年
                                    return '[(y' + $beginYear + 'M' + $beginMonth + 'd' + $beginDay + ')' +
                                        '(y' + $endYear + 'M' + $endMonth + 'd' + $endDay + ')]';
                                } else if (yearLength == 1) { // 结束年是开始年的后一年
                                    return '[[(y' + $beginYear + 'M' + $beginMonth + 'd' + $beginDay + ')' +
                                        '(y' + $beginYear + 'M12d31)]+[(y' + $endYear + 'M1d1)' +
                                        '(y' + $endYear + 'M' + $endMonth + 'd' + $endDay + ')]]';
                                } else if (yearLength > 1) { // 结束年比开始年大若干年份
                                    difYear = '';
                                    bYear = parseInt($beginYear, 10);
                                    for (i = 1; i < yearLength; i++) {
                                        difYear = difYear + '+[(y' + (bYear + i) + 'M1d1)(y' + (bYear + i) + 'M12d31)]';
                                    }
                                    return '[[(y' + $beginYear + 'M' + $beginMonth + 'd' + $beginDay + ')' +
                                        '(y' + $beginYear + 'M12d31)]' + difYear + '+[(y' + $endYear + 'M1d1)' +
                                        '(y' + $endYear + 'M' + $endMonth + 'd' + $endDay + ')]]';
                                }
                            } else if (yearLength == 0) {  // 同一年
                                // 如果同一年，直接拼，不同年，跨年
                                return '[[(y' + $beginYear + 'M' + $beginMonth + 'd' + $beginDay + ')(y' + $endYear + 'M' + $endMonth + 'd' + $endDay
                                    + ')]*[(h' + $beginHour + 'm' + $beginMinute + ')(h' + $endHour + 'm' + $endMinute + ')]]';
                            } else if (yearLength > 1) {
                                difYear = '';
                                bYear = parseInt($beginYear, 10);
                                for (i = 1; i < yearLength; i++) {
                                    if (i == 1) {
                                        difYear = '[(y' + (bYear + i) + 'M1d1)(y' + (bYear + i) + 'M12d31)]';
                                    } else {
                                        difYear = difYear + '+[(y' + (bYear + i) + 'M1d1)(y' + (bYear + i) + 'M12d31)]';
                                    }
                                }
                                $start = '[(y' + $beginYear + 'M' + $beginMonth + 'd' + $beginDay + ')(y' + $beginYear + 'M12d31)]';
                                $middle = difYear;
                                $end = '[(y' + $endYear + 'M1d1)(y' + $endYear + 'M' + $endMonth + 'd' + $endDay + ')]';
                                return '[[' + $start + '+' + $middle + '+' + $end + ']*[(h' + $beginHour + 'm' + $beginMinute + ')(h' + $endHour + 'm' + $endMinute + ')]]';
                            }
                            /* else if (yearLength == 0) { // 开始年和结束年为同一年
                                // 同月
                                if ($beginMonth == $endMonth) {
                                    // 同日
                                    if ($beginDay == $endDay) {
                                        return '[[(y' + $beginYear + 'M' + $beginMonth + 'd' + $beginDay + '){d1}]*[(h' + $beginHour + 'm' + $beginMinute + ')(h' + $endHour + 'm' + $endMinute + ')]]';
                                    }
                                    // 不同日
                                    $start = '[[(y' + $beginYear + 'M' + $beginMonth + 'd' + $beginDay + '){d1}]*[(h' + $beginHour + 'm' + $beginMinute + ')(h23m59)]]';
                                    $end = '[[(y' + $endYear + 'M' + $endMonth + 'd' + $endDay + '){d1}]*[(h0m0)(h' + $endHour + 'm' + $endMinute + ')]]';
                                    // 天数相差1天以上
                                    if ($endDay - $beginDay > 1) {
                                        $middle = '[[(y' + $beginYear + 'M' + $beginMonth + 'd' + ($beginDay + 1) + ')(y' + $endYear + 'M' + $endMonth + 'd' + ($endDay - 1) + ')]*[(h0m0)(h23m59)]]';
                                        return '[' + $start + '+' + $middle + '+' + $end + ']';
                                    } else if ($endDay - $beginDay == 1) {
                                        $middle = '[[(y' + $beginYear + 'M' + $beginMonth + 'd' + ($beginDay + 1) + '){d1}]*[(h0m0)(h23m59)]]';
                                        return '[' + $start + '+' + $middle + '+' + $end + ']';
                                    }
                                    $middle = '[[(y' + $beginYear + 'M' + $beginMonth + 'd' + ($beginDay + 1) + ')(y' + $endYear + 'M' + $endMonth + 'd' + ($beginDay + 1) + ')]*[(h0m0)(h23m59)]]';
                                    return '[' + $start + '+' + $end + ']';
                                }
                                // 不同月
                                var beginDayResult = daysInMounth($beginYear, $beginMonth);
                                $start = '[[(y' + $beginYear + 'M' + $beginMonth + 'd' + $beginDay + '){d1}]*[(h' + $beginHour + 'm' + $beginMinute + ')(h23m59)]]';
                                $end = '[[(y' + $endYear + 'M' + $endMonth + 'd' + $endDay + '){d1}]*[(h0m0)(h' + $endHour + 'm' + $endMinute + ')]]';
                                // 普通情况
                                if (beginDayResult != $beginDay && $endDay != 1) {
                                    $middle = '[[(y' + $beginYear + 'M' + $beginMonth + 'd' + ($beginDay + 1) + ')(y' + $endYear + 'M' + $endMonth + 'd' + ($endDay - 1) + ')]*[(h0m0)(h23m59)]]';
                                } else if (beginDayResult == $beginDay && $endDay != 1) {   // 起始是当月最后一天
                                    $middle = '[[(y' + $beginYear + 'M' + ($beginMonth + 1) + 'd1)(y' + $endYear + 'M' + $endMonth + 'd' + ($endDay - 1) + ')]*[(h0m0)(h23m59)]]';
                                } else if (beginDayResult != $beginDay && $endDay == 1) {   // 终止是当月第一天
                                    $middle = '[[(y' + $beginYear + 'M' + $beginMonth + 'd' + ($beginDay + 1) + ')(y' + $endYear + 'M' + ($endMonth - 1) + 'd' + daysInMounth($endYear, $endMonth - 1) + ')]*[(h0m0)(h23m59)]]';
                                } else if (beginDayResult == $beginDay && $endDay == 1) {   // 特殊情况
                                    $middle = '[[(y' + $beginYear + 'M' + ($beginMonth + 1) + 'd1)(y' + $endYear + 'M' + ($endMonth - 1) + 'd' + daysInMounth($endYear, $endMonth - 1) + ')]*[(h0m0)(h23m59)]]';
                                }
                                return '[' + $start + '+' + $middle + '+' + $end + ']';
                            } else if (yearLength == 1) { // 结束年是开始年的后一年
                                $start = '[[(y' + $beginYear + 'M' + $beginMonth + 'd' + $beginDay + ')(y' + $beginYear + 'M12d31)]*[(h' + $beginHour + 'm' + $beginMinute + ')(h23m59)]]';
                                $end = '[[(y' + $endYear + 'M1d1)(y' + $endYear + 'M' + $endMonth + 'd' + $endDay + ')]*[(h0m0)(h' + $endHour + 'm' + $endMinute + ')]]';
                                return '[' + $start + '+' + $end + ']';
                            } else if (yearLength > 1) { // 结束年比开始年大若干年份
                                difYear = '';
                                bYear = parseInt($beginYear, 10);
                                for (i = 1; i < yearLength; i++) {
                                    if (i == 1) {
                                        difYear = '[[(y' + (bYear + i) + 'M1d1)(y' + (bYear + i) + 'M12d31)]*[(h0m0)(h23m59)]]';
                                    } else {
                                        difYear = difYear + '+[[(y' + (bYear + i) + 'M1d1)(y' + (bYear + i) + 'M12d31)]*[(h0m0)(h23m59)]]';
                                    }
                                }
                                $start = '[[(y' + $beginYear + 'M' + $beginMonth + 'd' + $beginDay + ')(y' + $beginYear + 'M12d31)]*[(h' + $beginHour + 'm' + $beginMinute + ')(h23m59)]]';
                                $middle = difYear;
                                $end = '[[(y' + $endYear + 'M1d1)(y' + $endYear + 'M' + $endMonth + 'd' + $endDay + ')]*[(h0m0)(h' + $endHour + 'm' + $endMinute + ')]]';
                                return '[' + $start + '+' + $middle + '+' + $end + ']';
                            }*/
                            break;
                        case 'w': // 持续时间——周
                            var $beginWeek = $scope.wks.wBeginSelection;
                            var $beginWeekCode = $beginWeek.code; // 开始周数code
                            var $beginWeekName = $beginWeek.name; // 开始周数name
                            var $endWeek = $scope.wks.wEndSelection;
                            var $endWeekCode = $endWeek.code; // 结束周数code
                            var $endWeekName = $endWeek.name; // 结束周数name
                            if ($scope.w_begin_time) {
                                $beginTime = $scope.w_begin_time.split(':');
                                $beginHour = $beginTime[0]; // 开始小时数
                                $beginMinute = $beginTime[1]; // 开始分钟
                            }
                            if ($scope.w_end_time) {
                                $endTime = $scope.w_end_time.split(':');
                                $endHour = $endTime[0]; // 结束小时数
                                $endMinute = $endTime[1]; // 结束分钟
                            }
                            var bWeek = $scope.wks.wBeginSelection;
                            var eWeek = $scope.wks.wEndSelection;
                            // var selWeek = [];
                            // for (i = bWeek.code - 1; i < $scope.wks.values.length; i++) {
                            //     if (i == eWeek.code) {
                            //         break;
                            //     }
                            //     selWeek.push($scope.wks.values[i].code);
                            // }
                            // _result = [];
                            // for (var w = 0; w < selWeek.length; w++) {
                            //     _result.push('[(t' + selWeek[w] + '){d1}]');
                            // }
                            // 既选星期又选时间
                            if ($scope.w_begin_time && $scope.w_end_time) {
                                return '[[(t' + bWeek.code + ')(t' + eWeek.code + ')]*[(h' + $beginHour + 'm' + $beginMinute + ')(h' + $endHour + 'm' + $endMinute + ')]]';
                            }
                            return '[(t' + bWeek.code + ')(t' + eWeek.code + ')]';
                           /* $.each(selWeek, function (index, v) {
                                if ($scope.w_begin_time && $scope.w_end_time) {
                                    if (index == 0) {
                                        _result.push('[t' + v + '*[(h' + $beginHour + 'm' + $beginMinute + ')(h23m59)]]');
                                    } else if (index == selWeek.length - 1) {
                                        _result.push('[t' + v + '*[(h0m0)(h' + $endHour + 'm' + $endMinute + ')]]');
                                    } else {
                                        _result.push('[t' + v + '*[(h0m0)(h23m59)]]');
                                    }
                                } else {
                                    _result.push('t' + v);
                                }
                            });
                            if ($scope.vagueTime) {
                                /!* 模糊*!/
                                if ($scope.w_begin_time && $scope.w_end_time) {
                                    return '[[' + _result.join('+') + ']*z]';
                                }
                                return '[[(' + _result.join('') + ')]*z]';
                            }
                            /!* 精确*!/
                            if ($scope.w_begin_time && $scope.w_end_time) {
                                return '[' + _result.join('+') + ']';
                            }
                            return '[(' + _result.join('') + ')]';*/
                        case 'm':
                            var $monBegin = $scope.mons.begin;
                            var $monEnd = $scope.mons.end;
                            var $monBeginCode = $monBegin.code; // 开始月份code
                            var $monBeginName = $monBegin.label; // 开始月份label
                            var $monEndCode = $monEnd.code; // 结束月份code
                            var $monEndName = $monEnd.label; // 结束月份label
                            if ($monBeginCode > $monEndCode) {
                                return '[(M' + $monBeginCode + ')(M12)+(M1)(M' + $monEndCode + ')]';
                            }
                            return '[(M' + $monBeginCode + ')(M' + $monEndCode + ')]';
                        default:
                            $scope.alertMsg(dateWell, '出现错误！');
                            return 'error';
                    }
                } else {    // 复杂模式
                    var cAllYear,
                        cBeginWeek,
                        cEndWeek,
                        cBeginDay,
                        cEndDay,
                        cBeginTime,
                        cEndTime,
                        strBegin,
                        strMiddle,
                        strEnd;
                    var mutiString = true;
                    switch ($scope.cTimeType) {
                        // 月
                        case '0':
                            // 选择年
                            if ($scope.cYear) {
                                strBegin = '[(y' + $scope.cYear + 'M' + $scope.cMonsBegin + ')(y' + $scope.cEnd + 'M' + $scope.cMonsEnd + ')]';
                            }
                            // 周
                            if ($scope.cMonthType == '1') {
                                strMiddle = '[(t' + $scope.wks.cBeginSelection + ')(t' + $scope.wks.cEndSelection + ')]';
                            } else {    // 日

                            }
                            // 日
                            // if ($scope.w_begin_time && $scope.w_end_time) {}
                            break;
                        // 周
                        case '1':
                            break;
                        // 日
                        case '2':
                            break;
                        default:
                            break;
                    }
                }
                return 'error';
            },
            describe: function () {
                if (dateWell.find("input[time-type='fix-time']").is(':checked')) {
                    var checksList = [];
                    $.each($scope.wks.checks, function (i, v) {
                        checksList.push(v.name);
                    });
                    var _result = '';
                    /* 新建对象，用于中文排序*/
                    var compareData = {
                        周日: 1,
                        周一: 2,
                        周二: 3,
                        周三: 4,
                        周四: 5,
                        周五: 6,
                        周六: 7
                    };
                    $.each(checksList.sort(function (a, b) {
                        return compareData[a] - compareData[b];
                    }), function (i, v) {
                        if (i == checksList.sort(function (a, b) {
                            return compareData[a] - compareData[b];
                        }).length - 1) {
                            _result += v;
                        } else {
                            _result += v + '、';
                        }
                    });
                    /* 第一种可能：固定时间 只选择了星期*/
                    if (!$scope.begin_time && !$scope.end_time) {
                        return '每个星期中' + _result;
                    } else if ($scope.wks.checks.length != 0 && $scope.begin_time && $scope.end_time) { // 第二种可能：固定时间 既有星期还有时间段
                        return '每个星期中' + _result + '，从每天的' + $scope.begin_time + '到' + $scope.end_time;
                    } else if ($scope.wks.checks.length == 0) { // 第三种可能：固定时间 只选择时间段
                        return '每天的' + $scope.begin_time + '到' + $scope.end_time;
                    }
                } else {
                    /* 如果选择 持续时间分为三种情况——日、周、月*/
                    var $beginTime,
                        $beginHour,
                        $beginMinute;
                    var $endTime,
                        $endHour,
                        $endMinute;
                    switch (dwm.selection.code) {
                        case 'd':
                            var $beginDate;
                            if (typeof $scope.dBeginDate == 'object') {
                                $beginDate = Utils.newDateFormat($scope.dBeginDate, 'yyyy-MM-dd').split('-');
                            } else {
                                $beginDate = $scope.dBeginDate.split('-');
                            }
                            var $beginYear = $beginDate[0]; // 开始年份
                            var $beginMonth = $beginDate[1]; // 开始月份
                            var $beginDay = $beginDate[2]; // 开始天数
                            var $endDate;
                            if (typeof $scope.dEndDate == 'object') {
                                $endDate = Utils.newDateFormat($scope.dEndDate, 'yyyy-MM-dd').split('-');
                            } else {
                                $endDate = $scope.dEndDate.split('-');
                            }
                            var $endYear = $endDate[0]; // 结束年份
                            var $endMonth = $endDate[1]; // 结束月份
                            var $endDay = $endDate[2]; // 结束天数
                            if ($scope.d_begin_time) {
                                $beginTime = $scope.d_begin_time.split(':');
                                $beginHour = $beginTime[0]; // 开始小时数
                                $beginMinute = $beginTime[1]; // 开始分钟
                            }
                            if ($scope.d_end_time) {
                                $endTime = $scope.d_end_time.split(':');
                                $endHour = $endTime[0]; // 结束小时数
                                $endMinute = $endTime[1]; // 结束分钟
                            }
                            if (!$scope.d_begin_time || !$scope.d_end_time) {
                                return '从' + $beginYear + '年' + $beginMonth + '月' + $beginDay + '日到' + $endYear + '年' + $endMonth + '月' + $endDay + '日';
                            }
                            return '从' + $beginYear + '年' + $beginMonth + '月' + $beginDay + '日到' + $endYear + '年' + $endMonth + '月' + $endDay + '日，每天的' + $scope.d_begin_time + '到' + $scope.d_end_time;
                        case 'w':
                            var $beginWeek = $scope.wks.wBeginSelection;
                            var $beginWeekCode = $beginWeek.code; // 开始周数code
                            var $beginWeekName = $beginWeek.name; // 开始周数name
                            var $endWeek = $scope.wks.wEndSelection;
                            var $endWeekCode = $endWeek.code; // 结束周数code
                            var $endWeekName = $endWeek.name; // 结束周数name
                            if ($beginTime) {
                                $beginTime = $scope.d_begin_time.split(':');
                                $beginHour = $beginTime[0]; // 开始小时数
                                $beginMinute = $beginTime[1]; // 开始分钟
                            }
                            if ($endTime) {
                                $endTime = $scope.d_end_time.split(':');
                                $endHour = $endTime[0]; // 结束小时数
                                $endMinute = $endTime[1]; // 结束分钟数
                            }
                            /* 精确*/
                            if ($scope.w_begin_time && $scope.w_end_time) {
                                return '每星期的' + $beginWeekName + '到' + $endWeekName + '，从每天的' + $scope.w_begin_time + '到' + $scope.w_end_time;
                            }
                            return '每星期的' + $beginWeekName + '到' + $endWeekName;
                        case 'm':
                            var $monBegin = $scope.mons.begin;
                            var $monEnd = $scope.mons.end;
                            var $monBeginCode = $monBegin.code; // 开始月份code
                            var $monBeginName = $monBegin.label; // 开始月份label
                            var $monEndCode = $monEnd.code; // 结束月份code
                            var $monEndName = $monEnd.label; // 结束月份label
                            if ($monBeginCode > $monEndCode) {
                                return '每年的' + $monBeginName + '到次年的' + $monEndName;
                            }
                            return '每年的' + $monBeginName + '到' + $monEndName;
                        default:
                            var $week;
                            return '[(h' + $beginHour + 'm' + $beginMinute + 't' + $week + ')(h' + $endHour + 'm' + $endMinute + 't' + $week + ')]';
                    }
                }
                return null;
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

            if (dateWell.find("input[time-type='fix-time']").is(':checked')) {
                $scope.alertSucMsg(dateWell, dateTime.describe);
            } else {
                dateWell.fadeOut();
                $scope.showDatePicker = false;
            }
            if ($scope.dateIndex == -1) {
                $scope.dateInit();
            }
            var allStr = '';
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
            } else if ($scope.dateList.length == 1) {
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
    /* 清空*/
    $scope.dateEmpty = function (e) {
        $scope.dateList.length = 0;
        $scope.dateString = '';
        // $scope.$emit('get-date', '[]');
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
