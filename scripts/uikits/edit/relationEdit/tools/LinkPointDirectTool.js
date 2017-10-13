/**
 * Created by zhaohang on 2017/3/14.
 */

fastmap.uikit.relationEdit.LinkPointDirectTool = fastmap.uikit.relationEdit.RelationTool.extend({
    initialize: function () {
        fastmap.uikit.relationEdit.RelationTool.prototype.initialize.call(this);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.eventController = fastmap.uikit.EventController();

        this.name = 'LinkPointDirectTool';
        this.snapActor = null;
        this.forwardPoint = null;
        this.reversePoint = null;
        this.lineRight = null;
        this.lineLeft = null;
    },

    startup: function () {
        this.resetStatus();

        fastmap.uikit.relationEdit.RelationTool.prototype.startup.apply(this, arguments);

        this.refresh();
    },

    shutdown: function () {
        fastmap.uikit.relationEdit.RelationTool.prototype.shutdown.apply(this, arguments);

        this.resetStatus();
    },

    resetStatus: function () {
        fastmap.uikit.relationEdit.RelationTool.prototype.resetStatus.apply(this, arguments);

        this.snapActor = null;
    },

    refresh: function () {
        this.calculationDirection();
        this.resetFeedback();
        this.resetSnapActor();
        this.resetMouseInfo();
    },

    onRedo: function (oldEditResult, newEditResult) {
        this.editResult = newEditResult;
        this.refresh();
    },

    onUndo: function (oldEditResult, newEditResult) {
        this.editResult = oldEditResult;
        this.refresh();
    },

    resetMouseInfo: function () {
        if (!this.editResult.link) {
            this.setMouseInfo('在link上点击增加' + FM.uikit.Config.Feature().getName(this.editResult.geoLiveType) + '!');
        } else {
            if (this.editResult.link.properties.direct === 1) {
                this.setMouseInfo('点击调整' + FM.uikit.Config.Feature().getName(this.editResult.geoLiveType) + '方向或者按空格保存!');
            } else {
                this.setMouseInfo('点击空格保存!');
            }
        }
    },

    resetSnapActor: function () {
        this.uninstallSnapActor(this.snapActor);
        if (!this.editResult.point || (this.editResult.point && this.editResult.direct)) {
            this.installLinkSnapActor();
            return;
        }
        if (this.forwardPoint && this.reversePoint) {
            this.installNodeSnapActor(this.forwardPoint, this.reversePoint);
        }
    },

    installLinkSnapActor: function () {
        this.uninstallSnapActor(this.snapActor);

        this.snapActor = this.createFeatureSnapActor('RDLINK', null);

        this.installSnapActor(this.snapActor);
    },

    // 计算顺逆方向坐标
    calculationDirection: function () {
        var newEditResult = FM.Util.clone(this.editResult);
        if (newEditResult.link && newEditResult.point) {
            this.lineRight = new fastmap.mapApi.symbol.LineString();
            this.lineLeft = new fastmap.mapApi.symbol.LineString();
            if (newEditResult.link.properties.direct == 1 || newEditResult.link.properties.direct == 2) {
                // 顺方向
                var vectorPointRight = this.getPointByVector(true);
                this.forwardPoint = [vectorPointRight.lng, vectorPointRight.lat];
                this.lineRight.coordinates.push(this.editResult.point.coordinates);
                this.lineRight.coordinates.push([vectorPointRight.lng, vectorPointRight.lat]);
            }
            if (newEditResult.link.properties.direct == 1 || newEditResult.link.properties.direct == 3) {
                // 逆方向
                var vectorPointLeft = this.getPointByVector(false);
                this.reversePoint = [vectorPointLeft.lng, vectorPointLeft.lat];
                this.lineLeft.coordinates.push(this.editResult.point.coordinates);
                this.lineLeft.coordinates.push([vectorPointLeft.lng, vectorPointLeft.lat]);
            }
        }
    },

    resetFeedback: function () {
        if (!this.defaultFeedback) {
            return;
        }

        this.defaultFeedback.clear();

        if (this.editResult.link) {
            var inLinkSymbol = this.symbolFactory.getSymbol('ls_rdLink_in');
            this.defaultFeedback.add(this.editResult.link.geometry, inLinkSymbol);
        }

        // 为了让point压在线上,point最后绘制
        if (this.editResult.point) {
            var pointSymbol = this.symbolFactory.getSymbol('pt_line_point');
            this.defaultFeedback.add(this.editResult.point, pointSymbol);
            // 如果双方向，选择方向
            if (this.editResult.link.properties.direct == 1) {
                // 如果已经选择方向 / 未选方向
                this.getCurrentDirect(this.editResult.direct);
            } else {
                // this.getSingleDirect();
                this.getCurrentDirect(this.editResult.link.properties.direct);
            }
        }
        this.refreshFeedback();
    },

    // 如果是双方向
    getCurrentDirect: function (direct) {
        if (direct == 1 || direct == 2) {
            // 顺方向
            var vectorPointRight = this.getPointByVector(true);
            this.forwardPoint = [vectorPointRight.lng, vectorPointRight.lat];
            this.lineRight.coordinates.push(this.editResult.point.coordinates);
            this.lineRight.coordinates.push([vectorPointRight.lng, vectorPointRight.lat]);
        }
        if (direct == 1 || direct == 3) {
            // 逆方向
            var vectorPointLeft = this.getPointByVector(false);
            this.reversePoint = [vectorPointLeft.lng, vectorPointLeft.lat];
            this.lineLeft.coordinates.push(this.editResult.point.coordinates);
            this.lineLeft.coordinates.push([vectorPointLeft.lng, vectorPointLeft.lat]);
        }

        // 回执point两端的箭头
        var triangleMarkerSymbol = this.symbolFactory.getSymbol('relationEdit_ls_line_point_direct');
        // 2 顺方向
        if ((direct == 2 || this.editResult.direct == 2) && this.lineRight.coordinates.length) {
            this.defaultFeedback.add(this.lineRight, triangleMarkerSymbol);
        } else if ((direct == 3 || this.editResult.direct == 3) && this.lineLeft.coordinates.length) { // 3 逆方向
            this.defaultFeedback.add(this.lineLeft, triangleMarkerSymbol);
        } else if (this.lineRight.coordinates.length && this.lineLeft.coordinates.length) {    // 未选方向
            this.defaultFeedback.add(this.lineRight, triangleMarkerSymbol);
            this.defaultFeedback.add(this.lineLeft, triangleMarkerSymbol);
        }
    },

    // 计算向量后获取平移后的新坐标
    getPointByVector: function (flag) {
        var newEditResult = FM.Util.clone(this.editResult);
        // 计算点在线上最近的形状点
        var res = this.geometryAlgorithm.nearestLocations(newEditResult.point, newEditResult.link.geometry);
        var sPoint = this.lnglatToPixel(res.previousPoint);
        // 经纬度坐标转像素
        var ePoint = this.lnglatToPixel(res.nextPoint);
        var selectPointPixel = this.lnglatToPixel(newEditResult.point);
        var newVector = ePoint.minus(sPoint);   // 向量坐标
        newVector.normalize();
        // 像素坐标转经纬度
        var resultPixel = this.getDirectionPoint(selectPointPixel, newVector, flag, 40);
        return this.map.unproject(L.point([resultPixel.x, resultPixel.y]));
    },

    lnglatToPixel: function (point) {
        var pixelPoint = this.map.project([point.coordinates[1], point.coordinates[0]]);
        var nPoint = new fastmap.mapApi.symbol.Point(pixelPoint.x, pixelPoint.y);
        return nPoint;
    },

    // 获取顺向/逆向坐标
    getDirectionPoint: function (point, vector, flag, length) {
        var dValue = vector.multiNumber(length);
        var vResult;
        if (flag) {
            vResult = point.plusVector(dValue);
        } else {
            dValue.x *= -1;
            dValue.y *= -1;
            vResult = point.plusVector(dValue);
        }
        return vResult;
    },

    // 开启捕捉可选方向端点
    installNodeSnapActor: function (forwardPoint, reversePoint) {
        this.uninstallSnapActor(this.snapActor);

        var sPoint = {
            type: 'Point',
            coordinates: forwardPoint
        };
        var ePoint = {
            type: 'Point',
            coordinates: reversePoint
        };
        // 直接组成pairs格式
        var pairs = [];
        pairs.push({ key: sPoint, value: '2' });
        pairs.push({ key: ePoint, value: '3' });
        this.snapActor = this.createGivenPointSnapActor(pairs);

        this.installSnapActor(this.snapActor);
    },

    onSelectLink: function (editResult, res) {
        if (!editResult.point || (editResult.point && editResult.direct)) {
            var link = res.feature;
            var point = res.point;
            editResult.link = link;
            editResult.point = point;
        }
    },

    onSelectCurrentDirect: function (res) {
        var newEditResult = FM.Util.clone(this.editResult);
        this.onSelectLink(newEditResult, res);
        if (res && res.value) {
            newEditResult.direct = res.value;
        }
        this.createOperation('点击空格保存', newEditResult);
    },

    onSelectSingleDirect: function (res) {
        var newEditResult = FM.Util.clone(this.editResult);
        newEditResult.point = res.point;
        newEditResult.link = res.feature;
        newEditResult.direct = newEditResult.link.properties.direct;

        // 清空方向端点
        this.forwardPoint = null;
        this.reversePoint = null;
        this.createOperation('点击空格保存', newEditResult);
    },

    onMouseMove: function (event) {
        if (!fastmap.uikit.relationEdit.RelationTool.prototype.onMouseMove.apply(this, arguments)) {
            return false;
        }

        this.snapController.snap(this.mousePoint);

        return true;
    },

    onWheel: function (event) {
        if (!fastmap.uikit.relationEdit.RelationTool.prototype.onWheel.apply(this, arguments)) {
            return false;
        }
        this.refresh();

        return true;
    },

    onKeyUp: function (event) {
        if (!fastmap.uikit.relationEdit.RelationTool.prototype.onKeyUp.apply(this, arguments)) {
            return false;
        }

        var key = event.key;
        switch (key) {
            case 'c':   // 重新选择点位
                var newEditResult = FM.Util.clone(this.editResult);
                newEditResult.point = null;
                newEditResult.direct = null;
                this.createOperation('重新选择点位', newEditResult);
                break;
            default:
                break;
        }

        return true;
    },

    onLeftButtonClick: function (event) {
        if (!fastmap.uikit.relationEdit.RelationTool.prototype.onLeftButtonClick.apply(this, arguments)) {
            return false;
        }

        var res = this.snapController.snap(this.mousePoint);
        if (!res) {
            return true;
        }
        // if (!this.editResult.point || (this.editResult.point && this.editResult.direct)) {    // 如果没有选择point
        //     this.onSelectLink(res);
        // }
        // 如果是单方向直接赋值direct，如果是双方向需要选择方向
        if ((res.feature && res.feature.properties.direct != 1)) {
            this.onSelectSingleDirect(res);
        } else {
            this.onSelectCurrentDirect(res);
        }

        return true;
    }
});
