Utils = {
    trim: function (str) {
        return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
    },
    split: function (str, sep) {
        return this.trim(str).split(sep || /\s+/);
    },
    ToDBC: function (txtstring) { // 半角转换为全角函数
        if (txtstring == null || txtstring == '' || txtstring == ' ') {
            return '';
        }
        var tmp = '';
        for (var i = 0; i < txtstring.length; i++) {
            if (txtstring.charCodeAt(i) == 32) {
                tmp += String.fromCharCode(12288);
            } else if (txtstring.charAt(i) != '|' && txtstring.charCodeAt(i) < 127) {
                tmp += String.fromCharCode(txtstring.charCodeAt(i) + 65248);
            } else {
                tmp += String.fromCharCode(txtstring.charCodeAt(i));
            }
        }
        return tmp;
    },
    ToCDB: function (str) { // 全角转半角
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
    },
    // 第二参数表示连接符号，默认 -
    dateFormat: function (str, concat) {
        var ret;
        var cat;
        if (concat) {
            cat = concat;
        } else {
            cat = '-';
        }
        if (str.length < 14) {
            if (str.length === 8) {
                ret = str.substr(0, 4) + cat + str.substr(4, 2) + cat + str.substr(6, 2);
            } else {
                ret = str;
            }
        } else { // yyyy-mm-dd hh:mi:ss
            ret = str.substr(0, 4) + cat + str.substr(4, 2) + cat + str.substr(6, 2) + ' ' + str.substr(8, 2) + ':' + str.substr(10, 2) + ':' + str.substr(12, 2);
        }
        return ret;
    },
    dateFormatShort: function (str) {
        var ret;
        if (str.length < 14) {
            if (str.length === 8) {
                ret = str.substr(0, 4) + '-' + str.substr(4, 2) + '-' + str.substr(6, 2);
            } else {
                ret = str;
            }
        } else { // yyyy-mm-dd
            ret = str.substr(0, 4) + '-' + str.substr(4, 2) + '-' + str.substr(6, 2);
        }
        return ret;
    },
    newDateFormat: function (date, fmt) {
        var o = {
            'M+': date.getMonth() + 1, // 月份
            'd+': date.getDate(), // 日
            'h+': date.getHours(), // 小时
            'm+': date.getMinutes(), // 分
            's+': date.getSeconds(), // 秒
            'q+': Math.floor((date.getMonth() + 3) / 3) // 季度
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
        }
        return fmt;
    },
    setCheckboxMutex: function (event, obj, rejectVal) {
        if (event.target.value == rejectVal) {
            if (event.target.checked) {
                for (var key in obj) {
                    if (key != rejectVal) {
                        obj[key] = false;
                    }
                }
            }
        } else if (event.target.checked) {
            obj[rejectVal] = false;
        }
    },
    setCheckBoxSingleCheck: function (event, obj) {
        if (event.target.checked) {
            for (var key in obj) {
                if (key != event.target.value) {
                    obj[key] = false;
                }
            }
        }
    },
    stringToJson: function (str) {
        var ret = str;
        try {
            ret = JSON.parse(str);
        } catch (e) {
            try {
                ret = JSON.parse(str.replace(/\\"/g, '"'));
            } catch (e1) {
                try {
                    ret = JSON.parse(str.replace(/'/g, '"'));
                } catch (e2) {
                    ret = str;
                }
            }
        }
        return ret;
    },
    /**
     * 数组去重
     * @param arr
     * @returns {Array}
     */
    distinctArr: function (arr) {
        var dObj = {};
        for (var i = 0, len = arr.length; i < len; i++) {
            dObj[arr[i]] = true;
        }
        return Object.keys(dObj);
    },
    /**
     * 校验是否是纯数字，如果是纯数字就返回true
     */
    verifyNumber: function (str) {
        return /^[0-9]*$/.test(str);
    },
    /**
     * 校验是否是电话，如果是电话就返回true
     */
    verifyTelphone: function (str) {
        return /^[1][3-8]+\d{9}$/.test(str);
    },
    isObject: function (obj) {
        return Object.prototype.toString.call(obj) === '[object Object]';
    },
    isArray: function (obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    },
    clone: function (obj) {
        var ret = {};
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (obj[key] && typeof obj[key] === 'object') {
                    if (this.isArray(obj[key])) {
                        ret[key] = [];
                        for (var i = 0, n = obj[key].length; i < n; i++) {
                            if (obj[key][i] && typeof obj[key][i] === 'object') {
                                ret[key].push(this.clone(obj[key][i]));
                            } else {
                                ret[key].push(obj[key][i]);
                            }
                        }
                    } else {
                        ret[key] = this.clone(obj[key]);
                    }
                } else {
                    ret[key] = obj[key];
                }
            }
        }
        // }
        return ret;
    },
    /** *
     * 获取数组中某属性的最大值
     */
    getArrMax: function (arr, name) {
        var max = arr[0][name];
        var len = arr.length;
        for (var i = 1; i < len; i++) {
            if (arr[i][name] > max) {
                max = arr[i][name];
            }
        }
        return max;
    },
    /**
     * 判断点1和点2是否是同一个点
     * @param point1
     * @param point2
     * @param precision  精度
     */
    isSamePoint: function (point1, point2, precision) {
        if (!precision) {
            precision = 5;
        }
        if (Number(point1.x).toFixed(precision) != Number(point2.x).toFixed(precision)) {
            return false;
        }
        if (Number(point1.y).toFixed(precision) != Number(point2.y).toFixed(precision)) {
            return false;
        }
        return true;
    },
    /**
     * 十进制转二进制
     * @param dec
     * @returns {string}
     */
    dec2bin: function (dec) {
        var bin = '';
        while (dec > 0) {
            if (dec % 2 !== 0) {
                bin = '1' + bin;
            } else {
                bin = '0' + bin;
            }
            dec = Math.floor(dec / 2);
        }
        return bin;
    },
    /**
     * 二进制转10进制
     * @param bin
     * @returns {number}
     */
    bin2dec: function (bin) {
        var c = bin.split('');
        var len = c.length;
        var dec = 0;
        for (var i = 0; i < len; i++) {
            var temp = 1;
            if (parseInt(c[i], 10) === 1) {
                for (var j = i + 1; j < len; j++) {
                    temp *= 2;
                }
                dec += temp;
            }
        }
        return dec;
    },
    lpad: function (str, padChar, len) {
        str = str.toString();
        padChar = padChar.toString();
        if (str && padChar) {
            while (str.length < len) {
                str = padChar + str;
            }
        }
        return str;
    },
    isEmptyObject: function (e) {
        for (var k in e) {
            if (e.hasOwnProperty(k)) {
                return false;
            }
        }
        return true;
    },
    minusSimpleArray: function (arrayA, arrayB) {
        var ret = [];
        for (var i = 0; i < arrayA.length; i++) {
            if (arrayB.indexOf(arrayA[i]) < 0) {
                ret.push(arrayA[i]);
            }
        }
        return ret;
    },
    intersectSimpleArray: function (arrayA, arrayB) {
        var ret = [];
        for (var i = 0; i < arrayA.length; i++) {
            if (arrayB.indexOf(arrayA[i]) >= 0) {
                ret.push(arrayA[i]);
            }
        }
        return ret;
    },

    // 计算字符数数;
    getBLength: function (param) {
        var len = 0;
        for (var i = 0; i < param.length; i++) {
            if (param.charCodeAt(i) > 127 || param.charCodeAt(i) == 94) {
                len += 2;
            } else {
                len++;
            }
        }
        return len;
    }

};
