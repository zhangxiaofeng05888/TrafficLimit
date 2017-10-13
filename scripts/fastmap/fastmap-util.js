FM.Util = FM.Util || {};
FM.extend(FM.Util, {
    trim: function (str) {
        return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
    },
    split: function (str, sep) {
        return FM.Util.trim(str).split(sep || /\s+/);
    },
    ToDBC: function (txtstring) { // 半角转全角
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
    isObject: Object.isObject || function (obj) {
        return (Object.prototype.toString.call(obj) === '[object Object]');
    },
    isArray: Array.isArray || function (obj) {
        return (Object.prototype.toString.call(obj) === '[object Array]');
    },
    clone: function (obj) {
        // eslint-disable-next-line no-undef
        return _.cloneDeep(obj);
    },
    extend: function (object, source) {
        // eslint-disable-next-line no-undef
        return _.extend(object, source);
    },
    merge: function (object, source) {
        // eslint-disable-next-line no-undef
        return _.merge(object, source);
    },
    isEmptyObject: function (obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    },
    isContains: function (arr, obj) {
        var i = arr.length;
        while (i--) {
            if (arr[i] === obj) {
                return true;
            }
        }
        return false;
    },
    /**
     * 将对象实例上所有的方法绑定到对象实例上
     * @param instance 需要绑定的对象实例
     */
    bind: function (instance) {
        if (!instance) {
            throw new Error('绑定错误: 没有提供实例对象.');
        }

        var prototype = Object.getPrototypeOf(instance);
        var propertyNames = Object.getOwnPropertyNames(prototype);
        propertyNames.forEach(function (propertyName) {
            var property = instance[propertyName];

            // 跳过非函数的属性
            if (typeof property !== 'function') {
                return;
            }

            instance[propertyName] = property.bind(instance);
        });
    },
    /**
     * 控制台输出信息,所有需要在控制台输出的信息请调用此方法,有利于统一控制
     * @param msg
     */
    log: function (msg) {
        console.log(msg);
    },
    unionBy: function (array1, array2, identity) {
        // eslint-disable-next-line no-undef
        return _.unionBy(array1, array2, identity);
    },
    unique: function (array) {
        // eslint-disable-next-line no-undef
        return _.uniq(array);
    },
    uniqueBy: function (array, identity) {
        // eslint-disable-next-line no-undef
        return _.uniqBy(array, identity);
    },
    uniqueWith: function (array, comparator) {
        // eslint-disable-next-line no-undef
        return _.uniqWith(array, comparator);
    },
    difference: function (array1, array2) {
        // eslint-disable-next-line no-undef
        return _.difference(array1, array2);
    },
    differenceBy: function (array1, array2, identity) {
        // eslint-disable-next-line no-undef
        return _.differenceBy(array1, array2, identity);
    },
    differenceWith: function (array1, array2, comparator) {
        // eslint-disable-next-line no-undef
        return _.differenceWith(array1, array2, comparator);
    },
    intersection: function (array1, array2) {
        // eslint-disable-next-line no-undef
        return _.intersection(array1, array2);
    },
    intersectionBy: function (array1, array2, identity) {
        // eslint-disable-next-line no-undef
        return _.intersectionBy(array1, array2, identity);
    },
    intersectionWith: function (array1, array2, comparator) {
        // eslint-disable-next-line no-undef
        return _.intersectionWith(array1, array2, comparator);
    },
    isEqual: function (obj1, obj2) {
        // eslint-disable-next-line no-undef
        return _.isEqual(obj1, obj2);
    },
    isEqualWith: function (obj1, obj2, comparator) {
        // eslint-disable-next-line no-undef
        return _.isEqualWith(obj1, obj2, comparator);
    },
    decimal2BinaryArray: function (dec, size) {
        dec = +dec;
        var arr = dec.toString(2).split('');
        arr.forEach(function (it, idx) {
            arr[idx] = parseInt(it, 10);
        });
        for (var i = 0, len = arr.length; i < size - len; i++) {
            arr.unshift(0);
        }
        return arr;
    },
    binaryArray2Decimal: function (arr) {
        return parseInt(arr.join(''), 2);
    },
    without: function (arr, identity) {
        // eslint-disable-next-line no-undef
        return _.without(arr, identity);
    },
    /**
     * 返回数组中重复的值
     * @param {Array}
     * @returns {Array}
     */
    getRepeat: function (arr) {
        var ids = [];
        var obj = {};
        for (var i = 0; i < arr.length; i++) {
            if (obj[arr[i]]) {
                ids.push(arr[i]);
            } else {
                obj[arr[i]] = true;
            }
        }
        ids = this.unique(ids);
        return ids;
    }
});
