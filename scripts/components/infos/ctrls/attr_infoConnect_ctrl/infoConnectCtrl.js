/**
 * Created by Chensonglin on 17.3.31.
 */
angular.module('app').controller('connectCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var selectCtrl = fastmap.uikit.SelectController();
    var geometryAlgorithm = fastmap.mapApi.geometry.GeometryAlgorithm.getInstance();
    $scope.connectType = [
        { id: 1, tp: '普通挂接' },
        { id: 2, tp: '带辅路挂接' }
    ];
    $scope.connectCode1 = [
        { id: 2081, url: '2081.svg', checked: false },
        { id: 2082, url: '2082.svg', checked: false },
        { id: 2083, url: '2083.svg', checked: false },
        { id: 2084, url: '2084.svg', checked: false },
        { id: 2085, url: '2085.svg', checked: false },
        { id: 2086, url: '2086.svg', checked: false },
        { id: 2087, url: '2087.svg', checked: false },
        { id: 2088, url: '2088.svg', checked: false },
        { id: 2089, url: '2089.svg', checked: false },
        { id: 2090, url: '2090.svg', checked: false },
        { id: 2091, url: '2091.svg', checked: false },
        { id: 2092, url: '2092.svg', checked: false },
        { id: 2093, url: '2093.svg', checked: false },
        { id: 2094, url: '2094.svg', checked: false },
        { id: 2095, url: '2095.svg', checked: false },
        { id: 2096, url: '2096.svg', checked: false },
        { id: 2097, url: '2097.svg', checked: false },
        { id: 2098, url: '2098.svg', checked: false },
        { id: 2099, url: '2099.svg', checked: false },
        { id: 2100, url: '2100.svg', checked: false },
        { id: 2101, url: '2101.svg', checked: false },
        { id: 2102, url: '2102.svg', checked: false },
        { id: 2103, url: '2103.svg', checked: false },
        { id: 2104, url: '2104.svg', checked: false },
        { id: 2105, url: '2105.svg', checked: false },
        { id: 2106, url: '2106.svg', checked: false },
        { id: 2107, url: '2107.svg', checked: false },
        { id: 2108, url: '2108.svg', checked: false },
        { id: 2109, url: '2109.svg', checked: false },
        { id: 2136, url: '2136.svg', checked: false },
        { id: 2137, url: '2137.svg', checked: false },
        { id: 2138, url: '2138.svg', checked: false },
        { id: 2139, url: '2139.svg', checked: false },
        { id: 2140, url: '2140.svg', checked: false },
        { id: 2141, url: '2141.svg', checked: false },
        { id: 2142, url: '2142.svg', checked: false },
        { id: 2143, url: '2143.svg', checked: false },
        { id: 2144, url: '2144.svg', checked: false },
        { id: 2145, url: '2145.svg', checked: false },
        { id: 2146, url: '2146.svg', checked: false },
        { id: 2147, url: '2147.svg', checked: false },
        { id: 2163, url: '2163.svg', checked: false },
        { id: 2164, url: '2164.svg', checked: false }
    ];
    $scope.connectCode2 = [
        { id: 2113, url: '2113.svg', checked: false },
        { id: 2114, url: '2114.svg', checked: false },
        { id: 2115, url: '2115.svg', checked: false },
        { id: 2116, url: '2116.svg', checked: false },
        { id: 2117, url: '2117.svg', checked: false },
        { id: 2118, url: '2118.svg', checked: false },
        { id: 2119, url: '2119.svg', checked: false },
        { id: 2120, url: '2120.svg', checked: false },
        { id: 2121, url: '2121.svg', checked: false },
        { id: 2122, url: '2122.svg', checked: false },
        { id: 2123, url: '2123.svg', checked: false },
        { id: 2124, url: '2124.svg', checked: false },
        { id: 2125, url: '2125.svg', checked: false },
        { id: 2126, url: '2126.svg', checked: false },
        { id: 2127, url: '2127.svg', checked: false },
        { id: 2128, url: '2128.svg', checked: false },
        { id: 2129, url: '2129.svg', checked: false },
        { id: 2130, url: '2130.svg', checked: false },
        { id: 2131, url: '2131.svg', checked: false },
        { id: 2132, url: '2132.svg', checked: false },
        { id: 2133, url: '2133.svg', checked: false },
        { id: 2134, url: '2134.svg', checked: false },
        { id: 2135, url: '2135.svg', checked: false },
        { id: 2148, url: '2148.svg', checked: false },
        { id: 2149, url: '2149.svg', checked: false },
        { id: 2150, url: '2150.svg', checked: false },
        { id: 2151, url: '2151.svg', checked: false },
        { id: 2152, url: '2152.svg', checked: false },
        { id: 2153, url: '2153.svg', checked: false },
        { id: 2154, url: '2154.svg', checked: false },
        { id: 2155, url: '2155.svg', checked: false },
        { id: 2156, url: '2156.svg', checked: false },
        { id: 2157, url: '2157.svg', checked: false },
        { id: 2158, url: '2158.svg', checked: false },
        { id: 2159, url: '2159.svg', checked: false },
        { id: 2160, url: '2160.svg', checked: false },
        { id: 2161, url: '2161.svg', checked: false },
        { id: 2162, url: '2162.svg', checked: false }
    ];
    $scope.changeDegFlag = false;

    function getPoint(ang) {
        var vY = new fastmap.mapApi.symbol.Vector(0, -1);
        var matrix = new fastmap.mapApi.symbol.Matrix();
        matrix = matrix.makeRotate(ang);
        var vector = vY.crossMatrix(matrix);
        vector = vector.multiNumber(64);
        var startPoint = new fastmap.mapApi.symbol.Point(150, 68);
        return startPoint.plusVector(vector);
    }

    $scope.initializeData = function () {
        $scope.connect = objCtrl.data;
        var ang = $scope.connect.deep.agl;
        $scope.endPoint = getPoint(ang);
        $scope.transformStyle = {
            transform: 'rotate(' + ang + 'deg)'
        };
        if ($scope.connect.deep.tp === 1) {
            for (var m = 0; m < $scope.connectCode1.length; m++) {
                if ($scope.connect.deep.pcd.split('_')[1] == $scope.connectCode1[m].id) {
                    $scope.connectCode1[m].checked = true;
                    $scope.connectImgUrl = $scope.connectCode1[m].url;
                }
            }
        } else if ($scope.connect.deep.tp === 2) {
            for (var n = 0; n < $scope.connectCode2.length; n++) {
                if ($scope.connect.deep.pcd.split('_')[1] == $scope.connectCode2[n].id) {
                    $scope.connectCode2[n].checked = true;
                    $scope.connectImgUrl = $scope.connectCode2[n].url;
                }
            }
        }
        if ($scope.connect.feedback.f_array && $scope.connect.feedback.f_array.length > 0) {
            for (var i = 0; i < $scope.connect.feedback.f_array.length; i++) {
                if ($scope.connect.feedback.f_array[i].type == 3) {
                    $scope.connect.content = $scope.connect.feedback.f_array[i].content;
                }
            }
        }
    };
    $scope.changeCode = function (data) {
        if ($scope.connect.deep.tp === 1) {
            for (var m = 0; m < $scope.connectCode1.length; m++) {
                if (data.id == $scope.connectCode1[m].id) {
                    $scope.connectCode1[m].checked = true;
                } else {
                    $scope.connectCode1[m].checked = false;
                }
            }
        } else if ($scope.connect.deep.tp === 2) {
            for (var n = 0; n < $scope.connectCode2.length; n++) {
                if (data.id == $scope.connectCode2[n].id) {
                    $scope.connectCode2[n].checked = true;
                } else {
                    $scope.connectCode2[n].checked = false;
                }
            }
        }
        $scope.connect.deep.pcd = '1803_' + data.id + '_0';
        $scope.connectImgUrl = data.url;
    };

    $scope.pressDown = function (event) {
        var mousePoint = new fastmap.mapApi.symbol.Point(event.offsetX, event.offsetY);
        if (mousePoint.distance($scope.endPoint) <= 10) {
            $scope.changeDegFlag = true;
        }
    };

    $scope.pressUp = function (event) {
        $scope.changeDegFlag = false;
    };

    $scope.pressMove = function (event) {
        if ($scope.changeDegFlag) {
            var x = event.offsetX - 150;
            var y = event.offsetY - 64;
            var vY = new fastmap.mapApi.symbol.Vector(0, -1);
            var vY1 = new fastmap.mapApi.symbol.Vector(x, y);
            var angle = vY.angleTo(vY1);
            var cross = vY.cross(vY1);
            if (cross < 0) {
                angle = 360 - angle;
            }
            $scope.endPoint = getPoint(angle);
            $scope.transformStyle = {
                transform: 'rotate(' + angle + 'deg)'
            };
            angle = geometryAlgorithm.precision(angle, 5);
            $scope.connect.deep.agl = angle;
        }
    };

    var unbindHandler = $scope.$on('ReloadData', $scope.initializeData);

    $scope.$on('$destroy', function () {
        unbindHandler = null;
    });
}]);
