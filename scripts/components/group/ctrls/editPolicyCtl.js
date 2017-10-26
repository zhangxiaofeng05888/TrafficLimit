/**
 * Created by zhaohang on 2017/10/12.
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
            specFlag: [] // 排除日期
        };
        $scope.carType = [
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
                name: '受限本地车(如京G)'
            }, {
                id: 6,
                name: '非香港车辆(含粤牌)'
            }, {
                id: 7,
                name: '非澳门车辆(含粤牌)'
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
                id: 0,
                name: 0
            }, {
                id: 1,
                name: 1
            }, {
                id: 2,
                name: 2
            }, {
                id: 3,
                name: 3
            }, {
                id: 4,
                name: 4
            }, {
                id: 5,
                name: 5
            }, {
                id: 6,
                name: 6
            }, {
                id: 7,
                name: 7
            }, {
                id: 8,
                name: 8
            }, {
                id: 9,
                name: 9
            }, {
                id: '26个字母',
                name: '26个英文字母'
            }];
        $scope.energyType = [
            {
                id: 1,
                name: '燃油'
            }, {
                id: 2,
                name: '油电'
            }, {
                id: 3,
                name: '纯电'
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
                name: '预留'
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
            }];
        $scope.changeVehicle = function () {
            if ($scope.policyData.vehicle.length !== 1 || $scope.policyData.vehicle[0] !== 1) {
                $scope.policyData.seatnum = 0;
                $scope.policyData.resWeigh = 0;
                $scope.policyData.resAxleLoad = 0;
                $scope.policyData.resAxleCount = 0;
            }
        };
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
        $scope.changeTemp = function () {
            $scope.policyData.tempPlateNum = 0;
        };
        $scope.changeChar = function () {
            $scope.policyData.charToNum = 0;
        };
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
            if ($scope.policyData.vehicle.length === 0) {
                swal('提示', '请选择车辆类型', 'warning');
                return;
            }
            if ($scope.policyData.attribution.length === 0) {
                swal('提示', '请选择本外地', 'warning');
                return;
            }
            if ($scope.policyData.tempPlate === -1) {
                swal('提示', '请选择临牌转换原则', 'warning');
                return;
            }
            if ($scope.policyData.charSwitch === -1) {
                swal('提示', '请选择字母转换原则', 'warning');
                return;
            }
            if ($scope.policyData.tailNumber.length === 0) {
                swal('提示', '请选择限行尾号', 'warning');
                return;
            }
            if ($scope.policyData.energyType.length === 0) {
                swal('提示', '请选择能源类型', 'warning');
                return;
            }
            if ($scope.policyData.gasEmisstand.length === 0) {
                swal('提示', '请选择油气排放标准', 'warning');
                return;
            }
            if ($scope.policyData.platecolor.length === 0) {
                swal('提示', '请选择车牌颜色', 'warning');
                return;
            }
            if ($scope.policyData.resDatetype.length === 0) {
                swal('提示', '请选择限行时间类型', 'warning');
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
            if ($scope.policyData.restrict) {
                params.data.restrict = $scope.policyData.restrict;
            }
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
        function changeStrArr(strArray) {
            var strArr = strArray;
            var intArr = [];
            for (var i = 0; i < strArr.length; i++) {
                if (strArr[i] === '26个字母') {
                    intArr.push(strArr[i]);
                } else {
                    intArr.push(parseInt(strArr[i], 10));
                }
            }
            return intArr;
        }
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
            $scope.policyData.gasEmisstand = changeStrArr(policyData.energyType.split('|'));
            $scope.policyData.platecolor = changeStrArr(policyData.platecolor.split('|'));
            $scope.policyData.vehicleLength = policyData.vehicleLength;
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
            $scope.policyData.specFlag = changeStrArr(policyData.specFlag.split('|'));
        };

        var unbindHandler = $scope.$on('ReloadData-editPolicy', initialize);
        $scope.$on('$destroy', function (event, data) {

        });
    }
]);
