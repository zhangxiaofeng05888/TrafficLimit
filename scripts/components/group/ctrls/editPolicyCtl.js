/**
 * 编辑策略表中编辑记录
 * @author zhaohang
 * @date   2017/10/12
 * @param  {object} $window 窗口
 * @param  {object} $scope 作用域
 * @param  {object} $timeout 定时
 * @param  {object} NgTableParams 构造函数
 * @param  {object} dsFcc 接口服务
 * @param  {object} appPath app路径
 * @param  {object} $ocLazyLoad 延时加载
 * @return {undefined}
 */
angular.module('app').controller('editPolicyCtrl', ['$window', '$scope', '$timeout', 'NgTableParams', 'dsFcc', 'appPath', '$ocLazyLoad',
    function ($window, $scope, $timeout, NgTableParams, dsFcc, appPath, $ocLazyLoad) {
        $scope.policyData = {
            groupId: 0,
            manoeuvreId: 0,
            vehicle: [], // 车辆类型
            seatnum: 0, // 车座限制
            attribution: [], // 本外地
            tempPlate: -1, // 临牌转换原则
            tempPlateNum: 0, // 临牌对应数字
            restrict: '', // 受限本地车
            charSwitch: -1, // 字母转换原则
            charToNum: 0, // 字母对应数字
            tailNumber: [], // 限行尾号
            energyType: [], // 能源类型
            gasEmisstand: [], // 油气排放标准
            platecolor: [], // 车牌颜色
            vehicleLength: 0, // 车长限制
            resWeigh: 0, // 限制载重
            resAxleLoad: 0, // 限制轴重
            resAxleCount: 0, // 限制轴数
            startDate: '', // 开始日期
            endDate: '', // 结束日期
            resDatetype: [], // 限行时间类型
            time: '', // 限行时间
            specFlag: [], // 排除日期
            specPlate: '' // 排除不限行号牌
        };
        /**
         * 初始化数据，包括（车辆类型、本外地、临牌转换原则、字母转换原则、限行尾号、能源类型、车牌颜色、油气排放标准、限行时间类型、排除日期）
         * @author Niuxinyi
         * @date   2017-11-16
         */
        $scope.carType = [
            {
                id: 0,
                name: '全选'
            },
            {
                id: 1,
                name: '客车'
            }, {
                id: 2,
                name: '微型货车'
            }, {
                id: 3,
                name: '轻型货车'
            }, {
                id: 4,
                name: '中型货车'
            }, {
                id: 5,
                name: '重型货车'
            }, {
                id: 6,
                name: '全挂牵引车'
            }, {
                id: 7,
                name: '半挂牵引车'
            }, {
                id: 8,
                name: '半挂车'
            }, {
                id: 9,
                name: '全挂车'
            }, {
                id: 10,
                name: '专用汽车'
            }, {
                id: 11,
                name: '其他货车'
            }];
        $scope.location = [
            {
                id: 1,
                name: '外地车(有通行证)'
            }, {
                id: 2,
                name: '外地车(无通行证)'
            }, {
                id: 3,
                name: '本地车(有通行证)'
            }, {
                id: 4,
                name: '本地车(无通行证)'
            }, {
                id: 5,
                name: '受限本地车(如沪C)'
            }, {
                id: 6,
                name: '非香港车辆(含粤牌)'
            }, {
                id: 7,
                name: '非澳门车辆(含粤牌)'
            }, {
                id: 8,
                name: '临牌限行（本地）'
            }, {
                id: 9,
                name: '临牌限行（外地）'
            }];
        $scope.tempPlate = [
            {
                id: -1,
                name: '请选择'
            },
            {
                id: 1,
                name: '转换为固定数字'
            }, {
                id: 2,
                name: '视为常规车牌'
            }, {
                id: 3,
                name: '不转换'
            }];
        $scope.tempPlateNum = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        $scope.charSwitch = [
            {
                id: -1,
                name: '请选择'
            },
            {
                id: 1,
                name: '转换为固定数字'
            }, {
                id: 2,
                name: '以字母前一位阿拉伯数字为准'
            }, {
                id: 3,
                name: '原值转出'
            }];
        $scope.charToNum = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        $scope.tailNumber = [
            {
                id: -1,
                name: '全选'
            },
            {
                id: 0,
                name: '限行尾号0'
            }, {
                id: 1,
                name: '限行尾号1'
            }, {
                id: 2,
                name: '限行尾号2'
            }, {
                id: 3,
                name: '限行尾号3'
            }, {
                id: 4,
                name: '限行尾号4'
            }, {
                id: 5,
                name: '限行尾号5'
            }, {
                id: 6,
                name: '限行尾号6'
            }, {
                id: 7,
                name: '限行尾号7'
            }, {
                id: 8,
                name: '限行尾号8'
            }, {
                id: 9,
                name: '限行尾号9'
            }, {
                id: 10,
                name: '26个英文字母'
            }, {
                id: 11,
                name: '奇数排序字母'
            }, {
                id: 12,
                name: '偶数排序字母'
            }];
        $scope.energyType = [
            {
                id: 0,
                name: '全选'
            },
            {
                id: 1,
                name: '燃油'
            }, {
                id: 2,
                name: '油电'
            }, {
                id: 3,
                name: '纯电'
            }, {
                id: 4,
                name: '汽油'
            }, {
                id: 5,
                name: '柴油'
            }];
        $scope.gasEmisstand = [
            {
                id: 0,
                name: '未限制'
            }, {
                id: 1,
                name: '国Ⅰ'
            }, {
                id: 2,
                name: '国Ⅱ'
            }, {
                id: 3,
                name: '国Ⅲ'
            }, {
                id: 4,
                name: '国Ⅳ'
            }, {
                id: 5,
                name: '国Ⅴ'
            }];
        $scope.platecolor = [
            {
                id: 1,
                name: '蓝牌'
            }, {
                id: 2,
                name: '黄牌'
            }, {
                id: 3,
                name: '黑牌'
            }, {
                id: 4,
                name: '白牌'
            }, {
                id: 5,
                name: '绿牌(新能源、农用车)'
            }, {
                id: 6,
                name: '黄绿'
            }];
        $scope.resDatetype = [
            {
                id: 1,
                name: '连续时间'
            }, {
                id: 2,
                name: '星期一'
            }, {
                id: 3,
                name: '星期二'
            }, {
                id: 4,
                name: '星期三'
            }, {
                id: 5,
                name: '星期四'
            }, {
                id: 6,
                name: '星期五'
            }, {
                id: 7,
                name: '星期六'
            }, {
                id: 8,
                name: '星期日'
            }, {
                id: 9,
                name: '单日'
            }, {
                id: 10,
                name: '双日'
            }, {
                id: 11,
                name: '日期以0结尾'
            }, {
                id: 12,
                name: '日期以1结尾'
            }, {
                id: 13,
                name: '日期以2结尾'
            }, {
                id: 14,
                name: '日期以3结尾'
            }, {
                id: 15,
                name: '日期以4结尾'
            }, {
                id: 16,
                name: '日期以5结尾'
            }, {
                id: 17,
                name: '日期以6结尾'
            }, {
                id: 18,
                name: '日期以7结尾'
            }, {
                id: 19,
                name: '日期以8结尾'
            }, {
                id: 20,
                name: '日期以9结尾'
            }, {
                id: 21,
                name: '工作日'
            }, {
                id: 22,
                name: '双休日'
            }, {
                id: 23,
                name: '双休日单号'
            }, {
                id: 24,
                name: '双休日双号'
            }, {
                id: 25,
                name: '节假日'
            }, {
                id: 26,
                name: '节假日单号'
            }, {
                id: 27,
                name: '节假日双号'
            }, {
                id: 28,
                name: '寒假'
            }, {
                id: 29,
                name: '暑假'
            }, {
                id: 30,
                name: '春季'
            }, {
                id: 31,
                name: '夏季'
            }, {
                id: 32,
                name: '秋季'
            }, {
                id: 33,
                name: '冬季'
            }];
        $scope.specFlag = [
            {
                id: 1,
                name: '星期六'
            }, {
                id: 2,
                name: '星期日'
            }, {
                id: 3,
                name: '节假日'
            }, {
                id: 4,
                name: '特定日期'
            }, {
                id: 5,
                name: '寒假'
            }, {
                id: 6,
                name: '暑假'
            }, {
                id: 7,
                name: '春季'
            }, {
                id: 8,
                name: '夏季'
            }, {
                id: 9,
                name: '秋季'
            }, {
                id: 10,
                name: '冬季'
            }];
        /**
         * 本外地中选择受限本地车，受限本地车内容可编辑
         * @method changeAttribution
         * @author Niuxinyi
         * @date   2017-11-16
         * @return {undefined}
         */
        $scope.changeAttribution = function () {
            if ($scope.policyData.attribution.indexOf(5) < 0) {
                $scope.policyData.restrict = '';
            }
        };
        /**
         * 能源类型内容全选操作
         * @method changeEnergyType
         * @author Niuxinyi
         * @date   2017-11-16
         * @return {undefined}
         */
        $scope.changeenergyType = function () {
            if ($scope.policyData.energyType.indexOf(0) > -1) {
                if ($scope.policyData.energyType.length === 4) {
                    $scope.policyData.energyType = [];
                } else {
                    $scope.policyData.energyType = [];
                    for (var i = 1; i < $scope.energyType.length; i++) {
                        $scope.policyData.energyType.push($scope.energyType[i].id);
                    }
                }
            }
        };
        /**
         * 限行尾号内容全选操作
         * @method changeTailNumber
         * @author Niuxinyi
         * @date   2017-11-16
         * @return {undefined}
         */
        $scope.changeTailNumber = function () {
            if ($scope.policyData.tailNumber.indexOf(-1) > -1) {
                if ($scope.policyData.tailNumber.length === 12) {
                    $scope.policyData.tailNumber = [];
                } else {
                    $scope.policyData.tailNumber = [];
                    for (var i = 1; i < $scope.tailNumber.length; i++) {
                        $scope.policyData.tailNumber.push($scope.tailNumber[i].id);
                    }
                }
            }
        };
        /**
         * 车辆类型内容改变触发操作
         * @method changeVehicle
         * @author Niuxinyi
         * @date   2017-11-16
         * @return {undefined}
         */
        $scope.changeVehicle = function () {
            if ($scope.policyData.vehicle.indexOf(0) > -1) {
                if ($scope.policyData.vehicle.length === 12) {
                    $scope.policyData.vehicle = [];
                } else {
                    $scope.policyData.vehicle = [];
                    for (var i = 1; i < $scope.carType.length; i++) {
                        $scope.policyData.vehicle.push($scope.carType[i].id);
                    }
                }
            }
            if ($scope.policyData.vehicle.indexOf(1) < 0) {
                $scope.policyData.seatnum = 0;
            }
            if ($scope.policyData.vehicle.length === 1 && $scope.policyData.vehicle[0] === 1) {
                $scope.policyData.resWeigh = 0;
                $scope.policyData.resAxleLoad = 0;
                $scope.policyData.resAxleCount = 0;
            }
        };
        /**
         * 车长限制触发操作
         * @method formateNumbers
         * @author Niuxinyi
         * @date   2017-11-16
         * @param  {object} field 包括传入值
         * @param  {object} len 包括四舍五入小数位数
         * @return {undefined}
         */
        $scope.formateNumbers = function (field, len) {
            var val = $scope.policyData[field];
            if (!val) {
                $scope.policyData[field] = 0;
                return;
            }
            var b = parseFloat(val);
            $scope.policyData[field] = parseFloat(Number(b).toFixed(len));
        };
        var validateForm = function (form) {
            if (form.doValidate) {
                form.doValidate();
            }
            for (var k in form) {
                if (form.hasOwnProperty(k) && k.indexOf('$') < 0 && Utils.isObject(form[k]) && form[k].constructor.name === 'FormController') {
                    validateForm(form[k]);
                }
            }
        };
        /**
         * 临牌转换原则触发事件
         * @method changeTemp
         * @author Niuxinyi
         * @date   2017-11-16
         * @return {undefined}
         */
        $scope.changeTemp = function () {
            $scope.policyData.tempPlateNum = 0;
        };
        /**
         * 字母转换原则触发事件
         * @method changeChar
         * @author Niuxinyi
         * @date   2017-11-16
         * @return {undefined}
         */
        $scope.changeChar = function () {
            $scope.policyData.charToNum = 0;
        };
        /**
         * 保存并验证
         * @method savePolicy
         * @author Niuxinyi
         * @date   2017-11-16
         * @return {undefined}
         */
        $scope.savePolicy = function () {
            validateForm($scope.policyForm);
            if ($scope.policyForm.$invalid) {
                swal('注意', '属性输入有错误，请检查！', 'error');
                return;
            }
            var params = {
                command: 'UPDATE',
                type: 'SCPLATERESMANOEUVRE',
                groupId: $scope.policyData.groupId,
                objId: $scope.policyData.manoeuvreId,
                data: {
                    objStatus: 'UPDATE'
                }
            };
            if ($scope.policyData.vehicle.length === 0 || isNaN($scope.policyData.vehicle[0])) {
                swal('提示', '请选择车辆类型', 'warning');
                return;
            }
            if ($scope.policyData.attribution.length === 0 || isNaN($scope.policyData.attribution[0])) {
                swal('提示', '请选择本外地', 'warning');
                return;
            }
            if ([1, 2, 3].indexOf($scope.policyData.tempPlate) < 0) {
                swal('提示', '请选择临牌转换原则', 'warning');
                return;
            }
            if ($scope.policyData.tempPlate === 1 && $scope.tempPlateNum.indexOf($scope.policyData.tempPlateNum) < 0) {
                swal('提示', '请选择临牌对应数字', 'warning');
                return;
            }
            if ([1, 2, 3].indexOf($scope.policyData.charSwitch) < 0) {
                swal('提示', '请选择字母转换原则', 'warning');
                return;
            }
            if ($scope.policyData.charSwitch === 1 && $scope.charToNum.indexOf($scope.policyData.charToNum) < 0) {
                swal('提示', '请选择字母对应数字', 'warning');
                return;
            }
            if ($scope.policyData.tailNumber.length === 0 || isNaN($scope.policyData.tailNumber[0])) {
                swal('提示', '请选择限行尾号', 'warning');
                return;
            }
            if ($scope.policyData.energyType.length === 0 || isNaN($scope.policyData.energyType[0])) {
                swal('提示', '请选择能源类型', 'warning');
                return;
            }
            if ($scope.policyData.gasEmisstand.length === 0 || isNaN($scope.policyData.gasEmisstand[0])) {
                swal('提示', '请选择油气排放标准', 'warning');
                return;
            }
            if ($scope.policyData.platecolor.length === 0 || isNaN($scope.policyData.platecolor[0])) {
                swal('提示', '请选择车牌颜色', 'warning');
                return;
            }
            if ($scope.policyData.resDatetype.length === 0 || isNaN($scope.policyData.resDatetype[0])) {
                swal('提示', '请选择限行时间类型', 'warning');
                return;
            }
            var resDatetypeArr = $scope.policyData.resDatetype;
            if (resDatetypeArr && resDatetypeArr.indexOf(1) > -1 && resDatetypeArr.length > 1) {
                swal('提示', '持续时间不能与其他时间同时存在,请重新选择', 'warning');
                return;
            }

            // 受限本地车不为空时，只能为半角字母或数字或'|'
            var restrictStr = $scope.policyData.restrict;
            if (restrictStr) {
                var regex = /[^0-9A-Z\u4E00-\u9FA5|]/g;
                if (regex.test(restrictStr)) {
                    swal('提示', '受限本地车内容只能包含汉字、半角大写字母、数字或\'|\'', 'warning');
                    return;
                }
            }
            // 排除不限行号牌，只为能大写字母。汉字活'|'
            var specPlate = $scope.policyData.specPlate;
            if (specPlate) {
                var reg = /[^0-9A-Z\u4E00-\u9FA5|]/g;
                if (reg.test(specPlate)) {
                    swal('提示', '排除不限行牌号内容只能包含汉字、半角大写字母、数字或\'|\'', 'warning');
                    return;
                }
            }
            if (isNaN($scope.policyData.vehicleLength)) {
                swal('提示', '限制车长只能是数字', 'warning');
                return;
            }
            if (isNaN($scope.policyData.resWeigh) || Math.abs($scope.policyData.resWeigh) > 60) {
                swal('提示', '限制载重只能是数字并且数值不能大于60', 'warning');
                return;
            }
            if (isNaN($scope.policyData.resAxleCount) || Math.abs($scope.policyData.resAxleCount) > 10) {
                swal('提示', '限制轴只能是数字并且数值不能大于10', 'warning');
                return;
            }
            if (isNaN($scope.policyData.resAxleLoad) || Math.abs($scope.policyData.resAxleLoad) > 15) {
                swal('提示', '限制轴重只能是数字并且数值不能大于15', 'warning');
                return;
            }
            if (isNaN($scope.policyData.seatnum) || Math.abs($scope.policyData.seatnum) > 55) {
                swal('提示', '车座限制只能是数字并且数值不能大于55', 'warning');
                return;
            }
            var startDate0 = $scope.policyData.startDate;
            var endDate0 = $scope.policyData.endDate;
            var regex2 = /^\d{4}-(0[1-9]|1[0-2])-([0-2]\d|3[01])$/;
            if (startDate0 && !regex2.test(startDate0)) {
                swal('提示', '开始时间错误,请重新选择', 'warning');
                return;
            }
            if (endDate0 && !regex2.test(endDate0)) {
                swal('提示', '结束时间错误,请重新选择', 'warning');
                return;
            }

            var timeRegex = /^\[\(h([01]\d|2[0-3]|\d)m([0-5]\d|60|\d)\)\(h([01]\d|2[0-3]|\d)m([0-5]\d|60|\d)\)\]$/;
            if ($scope.policyData.time && !timeRegex.test($scope.policyData.time)) {
                swal('提示', '限行时间为错误,请重新选择', 'warning');
                return;
            }
            var regex3 = /^\[\(h0m0\)\(h23m59\)\]$/;
            if ($scope.policyData.time && regex3.test($scope.policyData.time)) {
                swal('提示', '限行时间为00:00-23:59,请重新选择', 'warning');
                return;
            }
            params.data.vehicle = $scope.policyData.vehicle.join('|');
            params.data.seatnum = $scope.policyData.seatnum;
            params.data.attribution = $scope.policyData.attribution.join('|');
            params.data.tempPlate = $scope.policyData.tempPlate;
            if ($scope.policyData.tempPlate === 1) {
                params.data.tempPlateNum = $scope.policyData.tempPlateNum;
            } else {
                params.data.tempPlateNum = '';
            }
            params.data.restrict = $scope.policyData.restrict;
            params.data.charSwitch = $scope.policyData.charSwitch;
            if ($scope.policyData.charSwitch === 1) {
                params.data.charToNum = $scope.policyData.charToNum;
            } else {
                params.data.charToNum = '';
            }
            params.data.tailNumber = $scope.policyData.tailNumber.join('|');
            params.data.energyType = $scope.policyData.energyType.join('|');
            params.data.gasEmisstand = $scope.policyData.gasEmisstand.join('|');
            params.data.platecolor = $scope.policyData.platecolor.join('|');
            params.data.vehicleLength = $scope.policyData.vehicleLength;
            params.data.vehicleWidth = $scope.policyData.vehicleWidth;
            params.data.vehicleHigh = $scope.policyData.vehicleHigh;
            params.data.specPlate = $scope.policyData.specPlate;
            params.data.resWeigh = $scope.policyData.resWeigh;
            params.data.resAxleLoad = $scope.policyData.resAxleLoad;
            params.data.resAxleCount = $scope.policyData.resAxleCount;
            var startDate = $scope.policyData.startDate;
            var endDate = $scope.policyData.endDate;
            if (startDate) {
                params.data.startDate = startDate.replace(new RegExp(/(-)/g), '');
            } else {
                params.data.startDate = '';
            }
            if (endDate) {
                params.data.endDate = endDate.replace(new RegExp(/(-)/g), '');
            } else {
                params.data.endDate = '';
            }
            params.data.resDatetype = $scope.policyData.resDatetype.join('|');
            if ($scope.policyData.time) {
                params.data.time = $scope.policyData.time;
            } else {
                params.data.time = '';
            }
            if ($scope.policyData.specFlag.length !== 0) {
                params.data.specFlag = $scope.policyData.specFlag.join('|');
            } else {
                params.data.specFlag = '';
            }
            dsFcc.addPolicy(params).then(function (data) {
                if (data !== -1) {
                    $scope.$emit('Dialog-Closed', 'editPolicy');
                    swal('提示', '保存成功', 'success');
                }
            });
        };
        /**
         * 限行时间添加触发事件
         * @method fmdateTimer
         * @author Niuxinyi
         * @date   2017-11-16
         * @param  {object} str 为 $scope.policyData.time
         * @return {undefined}
         */
        $scope.fmdateTimer = function (str) {
            $scope.$on('get-date', function (event, data) {
                $scope.policyData.time = data;
            });
            $timeout(function () {
                $scope.$broadcast('set-code', str);
                $scope.policyData.time = str;
                $scope.$apply();
            }, 100);
        };
        /**
         * 数组中字符触发事件
         * @method changeStrArr
         * @author Niuxinyi
         * @date   2017-11-16
         * @param  {object} strArray 为传入的字符串数组
         * @return {undefined}
         */
        function changeStrArr(strArray) {
            var strArr = strArray;
            var intArr = [];
            for (var i = 0; i < strArr.length; i++) {
                if (strArr[i] === '26个英文字母') {
                    intArr.push(strArr[i]);
                } else {
                    intArr.push(parseInt(strArr[i], 10));
                }
            }
            return intArr;
        }
        /**
         * 转换油气排放标准
         * @method changeStrArr
         * @author ZhaoHang
         * @date   2018-01-02
         * @param  {object} strArray 为传入的字符串数组
         * @return {undefined}
         */
        function changeStrArrForGas(strArray) {
            var strArr = strArray;
            var intArr = [];
            for (var i = 0; i < strArr.length; i++) {
                for (var j = 0; j < $scope.gasEmisstand.length; j++) {
                    if (strArr[i] === $scope.gasEmisstand[j].name) {
                        intArr.push($scope.gasEmisstand[j].id);
                    }
                }
            }
            return intArr;
        }
        /**
         * 初始化数据
         * @author Niuxinyi
         * @date   2017-11-16
         * @param  {object} event 包括事件
         * @param  {object} data 包括数据值
         * @return {undefined}
         */
        var initialize = function (event, data) {
            var policyData = Object.assign({}, data.data);
            $scope.policyData.groupId = policyData.groupId;
            $scope.policyData.manoeuvreId = policyData.manoeuvreId;
            $scope.policyData.vehicle = changeStrArr(policyData.vehicle.split('|'));
            $scope.policyData.seatnum = policyData.seatnum;
            $scope.policyData.attribution = changeStrArr(policyData.attribution.split('|'));
            $scope.policyData.tempPlate = policyData.tempPlate;
            if (policyData.tempPlateNum === '') {
                $scope.policyData.tempPlateNum = 0;
            } else {
                $scope.policyData.tempPlateNum = parseInt(policyData.tempPlateNum, 10);
            }
            $scope.policyData.restrict = policyData.restrict;
            $scope.policyData.charSwitch = policyData.charSwitch;
            if (policyData.charToNum === '') {
                $scope.policyData.charToNum = 0;
            } else {
                $scope.policyData.charToNum = parseInt(policyData.charToNum, 10);
            }
            $scope.policyData.tailNumber = changeStrArr(policyData.tailNumber.split('|'));
            $scope.policyData.energyType = changeStrArr(policyData.energyType.split('|'));
            $scope.policyData.gasEmisstand = changeStrArrForGas(policyData.gasEmisstand.split('|'));
            $scope.policyData.platecolor = changeStrArr(policyData.platecolor.split('|'));
            $scope.policyData.vehicleLength = policyData.vehicleLength;
            $scope.policyData.vehicleWidth = policyData.vehicleWidth;
            $scope.policyData.vehicleHigh = policyData.vehicleHigh;
            $scope.policyData.specPlate = policyData.specPlate;
            $scope.policyData.resWeigh = policyData.resWeigh;
            $scope.policyData.resAxleLoad = policyData.resAxleLoad;
            $scope.policyData.resAxleCount = policyData.resAxleCount;
            if (policyData.startDate === '') {
                $scope.policyData.startDate = policyData.startDate;
            } else {
                $scope.policyData.startDate = Utils.dateFormatShort(policyData.startDate);
            }
            if (policyData.endDate === '') {
                $scope.policyData.endDate = policyData.endDate;
            } else {
                $scope.policyData.endDate = Utils.dateFormatShort(policyData.endDate);
            }
            $scope.policyData.resDatetype = changeStrArr(policyData.resDatetype.split('|'));
            $scope.policyData.time = policyData.time;
            if (policyData.specFlag !== '') {
                $scope.policyData.specFlag = changeStrArr(policyData.specFlag.split('|'));
            }

            var ctrl = '../../scripts/components/tools/fmTimeComponent/fmdateTimer.js';
            var tmpl = '../../scripts/components/tools/fmTimeComponent/fmdateTimer.html';
            $ocLazyLoad.load([ctrl, tmpl]).then(function () {
                $scope.dateURL = tmpl;
                $timeout(function () {
                    $scope.fmdateTimer($scope.policyData.time);
                });
            });
        };

        var unbindHandler = $scope.$on('ReloadData-editPolicy', initialize);
        $scope.$on('$destroy', function (event, data) {

        });
    }
]);
