/**
 * Created by liuyang   on 2016/12/12.
 */
angular.module('app').controller('commonDeepCtl', ['$scope', '$ocLazyLoad', 'dsMeta', function ($scope, $ocLazyLoad, dsMeta) {
    $scope.teleSum = 0;
    $scope.timeItems = [];
    $scope.showHospital = false;
    $scope.areaCode = {
        code: '010',
        telLength: 11,
        len: 8
    };
    $scope.contacts = [];
    var objectCtrl = fastmap.uikit.ObjectEditController();

    var getAreaCode = function () {
        var taskId = App.Temp.subTaskId;
        dsMeta.queryAreaCodeByRegionId(objectCtrl.data.regionId, taskId).then(function (data) {
            if (data) {
                var keys = Object.getOwnPropertyNames(data);
                for (var j = 0; j < keys.length; j++) {
                    var key = keys[j];
                    $scope.areaCode.code = data[key].code;
                    $scope.areaCode.telLength = data[key].telLength;
                    $scope.areaCode.len = data[key].telLength - $scope.areaCode.code.length;
                }
            }
        });
    };

    function formatMonthDay(month, day) {
        var dayStr = null;
        if (parseInt(day, 0) < 0) { //  如果为负数，例如-1，对应本月最后一天，以此类推
            if ([1, 3, 5, 7, 8, 10, 12].indexOf(parseInt(month, 0)) > -1) {
                dayStr = (31 + parseInt(day, 0) + 1).toString();
            } else {
                dayStr = (30 + parseInt(day, 0) + 1).toString();
            }
        } else {
            dayStr = day;
        }
        return month + '-' + dayStr;
    }

    function formatWeek(week) {
        var str = week.split('');
        var arr = {};
        for (var j = 0; j < str.length; j++) {
            if (parseInt(str[j], 0) === 1) {
                arr[j] = true;
            } else {
                arr[j] = false;
            }
        }
        return arr;
    }

    function formatTime(begin, dur) {
        var hour;
        var min;
        var exo = 0;
        var strB = begin.split(':');
        var strD = dur.split(':');
        if (parseInt(strB[1], 0) + parseInt(strD[1], 0) > 59) {
            min = parseInt(strB[1], 0) + parseInt(strD[1], 0) - 60;
            exo = 1;
        } else {
            min = parseInt(strB[1], 0) + parseInt(strD[1], 0);
        }
        if (parseInt(strB[0], 0) + parseInt(strD[0], 0) + exo > 23 && min >= 0) {
            hour = parseInt(strB[0], 0) + parseInt(strD[0], 0) + exo - 24;
        } else if (parseInt(strB[0], 0) + parseInt(strD[0], 0) + exo === 24 && min === 0) {
            hour = 23;
            min = 59;
        } else if (parseInt(strB[0], 0) + parseInt(strD[0], 0) + exo < 24) {
            hour = parseInt(strB[0], 0) + parseInt(strD[0], 0) + exo;
        }
        return hour + ':' + min;
    }


    function initBusinessTime(times) {
        for (var i = 0; i < times.length; i++) {
            var timeObj = {
                monDaySrt: null,
                monDayEnd: null,
                timeSrt: null,
                timeEnd: null,
                validWeek: null,
                rowId: null
            };
            timeObj.monDaySrt = formatMonthDay(times[i].monSrt, times[i].daySrt);
            timeObj.monDayEnd = formatMonthDay(times[i].monEnd, times[i].dayEnd);
            timeObj.timeSrt = '2017-01-01 ' + times[i].timeSrt;
            timeObj.timeEnd = '2017-01-01 ' + formatTime(times[i].timeSrt, times[i].timeDur);
            timeObj.validWeek = formatWeek(times[i].validWeek);
            timeObj.rowId = times[i].rowId;
            $scope.timeItems.push(timeObj);
        }
    }

    var initDeepData = function () {
        $scope.teleSum = 0;
        $scope.timeItems = [];
        $scope.showHospital = false;
        $scope.areaCode = {
            code: '010',
            telLength: 11
        };
        $scope.contacts = [];
        if (objectCtrl.data.details.length === 0) { // 解决默认details为空的情况
            objectCtrl.data.details[0] = new FM.dataApi.IxPoiDetail({ pid: objectCtrl.data.pid });
        }
        $scope.details = objectCtrl.data.details[0];
        $scope.businesstimes = objectCtrl.data.businesstimes;
        initBusinessTime($scope.businesstimes);
        // 医院等级是否可见
        var kindCode = objectCtrl.data.kindCode;
        if (['170100', '170101', '170102'].indexOf(kindCode) > -1) {
            $scope.showHospital = true;
        }
        // 传真'
        for (var k = 0; k < objectCtrl.data.contacts.length; k++) {
            if (objectCtrl.data.contacts[k].contactType === 11) {
                $scope.teleSum += 1;
                $scope.contacts.push(objectCtrl.data.contacts[k]);
            }
        }
        getAreaCode();
    };
    initDeepData();
    $scope.$on('reloadDeepData', function () {
        initDeepData();
    });

    $scope.hospitalClassState = [   // 医院类型
        { id: 0, label: '未调查' },
        { id: 1, label: '三级甲等' },
        { id: 2, label: '三级乙等' },
        { id: 3, label: '三级丙等' },
        { id: 4, label: '三级其他' },
        { id: 5, label: '二级甲等' },
        { id: 6, label: '二级乙等' },
        { id: 7, label: '二级丙等' },
        { id: 8, label: '二级其他' },
        { id: 9, label: '其他' }
    ];

    $scope.addContact = function () {
        if ($scope.teleSum <= 2) {
            var contactNew = new FM.dataApi.IxPoiContact({
                contactType: 11,
                code: $scope.areaCode.code,
                contact: ''
            });
            $scope.contacts.push(contactNew);
            objectCtrl.data.contacts.push(contactNew);
            $scope.teleSum += 1;
        } else {
            swal('提示', '传真个数不能超过3个！', 'warning');
        }
    };
    $scope.deleteContact = function (index) {
        var hashKey = $scope.contacts[index].$$hashKey;
        for (var i = 0; i < objectCtrl.data.contacts.length; i++) {
            if (objectCtrl.data.contacts[i].$$hashKey === hashKey) {
                objectCtrl.data.contacts.splice(i, 1);
                i--;
            }
        }
        $scope.contacts.splice(index, 1);
        $scope.teleSum -= 1;
    };
    $scope.checkTelNo = function (index, t) {
        var temp = $scope.contacts[index];
        if (temp.contact && !Utils.verifyNumber(temp.contact)) {
            swal('保存提示', '电话填写不正确,不能保存！', 'warning');
            return;
        }
        if (temp.code && temp.contact) {
            if (temp.code == $scope.areaCode.code) {
                var len1 = $scope.areaCode.telLength - temp.code.length;
                if (len1 != temp.contact.length) {
                    swal('提示', '电话填写不正确,不算区号长度应该是' + len1 + '位！', 'warning');
                }
                return;
            }
            dsMeta.queryTelLength(temp.code).then(function (data) {
                if (data) {
                    var len = data - temp.code.length;
                    if (temp.contact.length != len) {
                        swal('提示', '电话填写不正确,不算区号长度应该是' + len + '位！', 'warning');
                    }
                } else {
                    swal('保存提示', '电话区号不正确,请检查！', 'warning');
                }
            });
        } else {
            // swal("保存提示","电话区号不正确,不能保存！","warning");
        }
    };
    /**
     * 校验区号
     */
    $scope.checkTelAreaCode = function (index, t) {
        var areaCode = $scope.contacts[index].code;
        if (areaCode != $scope.areaCode.code) {
            dsMeta.queryTelLength(areaCode).then(function (data) {
                if (data) {
                    // $scope.$parent.teleCodeToLength[areaCode] = data - areaCode.length;
                } else {
                    // $scope.$parent.teleCodeToLength[areaCode] = 0;
                    swal('保存提示', '电话区号不正确,不能保存！', 'warning');
                }
            });
        }
    };
    /**
     * 打开网址
     */
    $scope.openBaidu = function () {
        window.open('https://www.baidu.com');
    };
    $scope.addBusinessTime = function () {
        $scope.timeItems.push({
            monDaySrt: '1-1',
            monDayEnd: '12-31',
            timeSrt: '2017-01-01 00:00',
            timeEnd: '2017-01-01 23:59',
            validWeek: {
                0: true,
                1: true,
                2: true,
                3: true,
                4: true,
                5: true,
                6: true
            },
            rowId: ''
        });
        $scope.businesstimes.push(new fastmap.dataApi.IxPoiBusinesstime({
            pid: objectCtrl.data.pid,
            monSrt: '1',
            monEnd: '12',
            weekInYearSrt: '1',
            weekInYearEnd: '-1',
            weekInMonthSrt: '1',
            weekInMonthEnd: '-1',
            validWeek: '1111111',
            daySrt: '1',
            dayEnd: '31',
            timeSrt: '00:00',
            timeDur: '23:59'
        }));
    };
    $scope.weekOpenDays = {
        0: '日',
        1: '一',
        2: '二',
        3: '三',
        4: '四',
        5: '五',
        6: '六'
    };

    $scope.deleteItem = function (index) {
        $scope.timeItems.splice(index, 1);
        $scope.businesstimes.splice(index, 1);
    };

    function timeStamp2String(time) {
        var datetime = new Date();
        datetime.setTime(time);
        var year = datetime.getFullYear();
        var month = datetime.getMonth() + 1;
        var date = datetime.getDate();
        var hour = datetime.getHours();
        var minute = datetime.getMinutes();
        return year + '-' + month + '-' + date + ' ' + hour + ':' + minute;
    }
    function formatDayAndMonth(str) {
        if (parseInt(str, 10) < 10 && str.length < 2) {
            str = '0' + str;
        }
        return str;
    }
    function formatMinAndHourTime(str) {
        var hour = parseInt(str.split(':')[0], 10);
        var min = parseInt(str.split(':')[1], 10);
        if (hour < 10) {
            hour = '0' + hour;
        }
        if (min < 10) {
            min = '0' + min;
        }
        return hour + ':' + min;
    }

    function formatBusinessTime(timeObj) {
        var times = {
            dayEnd: null,
            daySrt: null,
            monEnd: null,
            monSrt: null,
            timeDur: null,
            timeSrt: null,
            validWeek: null,
            weekInMonthEnd: '-1',
            weekInMonthSrt: '1',
            weekInYearEnd: '-1',
            weekInYearSrt: '1'
        };
        var exo = 0;
        var hour = 0;
        var min = 0;
        var validWeek = [];
        var monDaySrt;
        var monDayEnd;

        if (typeof (timeObj.monDaySrt) == 'string') {
            times.monSrt = formatDayAndMonth(timeObj.monDaySrt.split('-')[0]);
            times.daySrt = formatDayAndMonth(timeObj.monDaySrt.split('-')[1]);
        } else if (typeof (timeObj.monDaySrt) == 'undefined') {
            timeObj.monDaySrt = '1-1';
            times.monSrt = '01';
            times.daySrt = '01';
        } else if (typeof (timeObj.monDaySrt) == 'number') {
            var dSrt = timeStamp2String(timeObj.monDaySrt);
            monDaySrt = dSrt.split(' ')[0];
            times.monSrt = formatDayAndMonth(monDaySrt.split('-')[1]);
            times.daySrt = formatDayAndMonth(monDaySrt.split('-')[2]);
        }

        if (typeof (timeObj.monDayEnd) == 'string') {
            times.monEnd = formatDayAndMonth(timeObj.monDayEnd.split('-')[0]);
            times.dayEnd = formatDayAndMonth(timeObj.monDayEnd.split('-')[1]);
        } else if (typeof (timeObj.monDayEnd) == 'undefined') {
            timeObj.monDayEnd = '12-31';
            times.monEnd = '12';
            times.dayEnd = '31';
        } else if (typeof (timeObj.monDayEnd) == 'number') {
            var dEnd = timeStamp2String(timeObj.monDayEnd);
            monDayEnd = dEnd.split(' ')[0];
            times.monEnd = formatDayAndMonth(monDayEnd.split('-')[1]);
            times.dayEnd = formatDayAndMonth(monDayEnd.split('-')[2]);
        }

        if (typeof (timeObj.timeSrt) == 'object') {
            var hour1 = timeObj.timeSrt.getHours();
            var minute1 = timeObj.timeSrt.getMinutes();
            times.timeSrt = hour1 + ':' + minute1;
        } else if (typeof (timeObj.timeSrt) == 'string') {
            times.timeSrt = timeObj.timeSrt.split(' ')[1];
        } else {
            timeObj.timeSrt = '2017-01-01 00:00';
            times.timeSrt = '00:00';
        }
        if (typeof (timeObj.timeEnd) == 'object') {
            var hour2 = timeObj.timeEnd.getHours();
            var minute2 = timeObj.timeEnd.getMinutes();
            times.timeEnd = hour2 + ':' + minute2;
            if (times.timeEnd == '0:0') {
                timeObj.timeEnd = '2017-01-01 23:59';
                times.timeEnd = '23:59';
            }
        } else if (typeof (timeObj.timeEnd) == 'string') {
            times.timeEnd = timeObj.timeEnd.split(' ')[1];
        } else {
            timeObj.timeEnd = '2017-01-01 23:59';
            times.timeEnd = '23:59';
        }

        if (parseInt(times.timeEnd.split(':')[1], 0) < parseInt(times.timeSrt.split(':')[1], 0)) {
            min = parseInt(times.timeEnd.split(':')[1], 0) + 60 - parseInt(times.timeSrt.split(':')[1], 0);
            exo = -1;
        } else {
            min = parseInt(times.timeEnd.split(':')[1], 0) - parseInt(times.timeSrt.split(':')[1], 0);
        }
        if ((parseInt(times.timeEnd.split(':')[0], 0) + exo) < parseInt(times.timeSrt.split(':')[0], 0)) {
            hour = parseInt(times.timeEnd.split(':')[0], 0) + exo + 24 - parseInt(times.timeSrt.split(':')[0], 0);
        } else {
            hour = parseInt(times.timeEnd.split(':')[0], 0) + exo - parseInt(times.timeSrt.split(':')[0], 0);
        }
        times.timeDur = formatMinAndHourTime(hour + ':' + min);
        times.timeSrt = formatMinAndHourTime(times.timeSrt);
        for (var i = 0; i < 7; i++) {
            if (timeObj.validWeek[i]) {
                validWeek.push(1);
            } else {
                validWeek.push(0);
            }
        }
        times.validWeek = validWeek.join('');
        return times;
    }

    $scope.changeTimeItem = function (index) {
        var timeObj = formatBusinessTime($scope.timeItems[index]);
        var keys = Object.getOwnPropertyNames(timeObj);
        for (var j = 0; j < keys.length; j++) {
            var obj = keys[j];
            $scope.businesstimes[index][obj] = timeObj[obj];
        }
    };
    /**
     * 部分属性转全角
     */
    $scope.strToDBC = function (type, str) {
        $scope.details[type] = Utils.ToDBC(str);
    };
    // 电话校验
    $scope.queryTelephone = function (item) {
        var param = {
            code: item.code
        };
        param = JSON.stringify(param);
        return {
            url: App.Config.serviceUrl + '/metadata/queryTelLength/?access_token=' + App.Temp.accessToken + '&parameter=' + param,
            compare: function (data) {
                var flag = true;
                if (data && data.errcode == 0) {
                    if (data.data == '') {
                        flag = false;
                    } else {
                        // 返回了电话的长度
                        var len = data.data;
                        item.len = len - item.code.length; // 总长度减去区号的长度
                    }
                } else {
                    flag = false;
                }
                return flag;
            }
        };
    };
    $scope.rename = function (name, index) {
        return name + '$' + index + '$';  // 使用ng-repeat时必须这样进行命名
    };
    $scope.checkContact = function (item) {
        if (item.len == undefined) {
            return true;
        }
        if (item.len == item.contact.length) {
            return true;
        }
        return false;
    };
}]);
