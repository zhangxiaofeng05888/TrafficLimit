FM.mapApi.render.renderer.RdLaneConnexity = FM.mapApi.render.Renderer.extend({
    initialize: function (feature, zoom) {
        FM.mapApi.render.Renderer.prototype.initialize.call(this, feature, zoom);
        // 绑定函数作用域
        FM.Util.bind(this);
    },
    getSymbol: function () {
        var row1Urls = [];
        var row2Urls = [];
        var laneArr = this._feature.properties.laneArr.split(',');
        for (var i = 0; i < laneArr.length; ++i) {
            var lane = laneArr[i];
            if (lane.indexOf('[') !== -1) {
                var laneArrowType1 = lane.substr(lane.indexOf('[') + 1, 1);
                row1Urls.push('../../images/road/1301/1301_2_' + laneArrowType1 + '.svg');
            } else {
                var laneArrowType2 = lane.substr(0, 1);
                row1Urls.push('../../images/road/1301/1301_0_' + laneArrowType2 + '.svg');
            }
            if (lane.indexOf('<') !== -1) {
                // 如果存在公交车道，公交车道数组长度应与目前的普通车道（+附加车道）数组长度保持一致
                // 目的是能够让公交车箭头渲染在对应的普通车道下
                row2Urls.length = row1Urls.length - 1;
                var laneArrowType3 = lane.substr(lane.indexOf('<') + 1, 1);
                row2Urls.push('../../images/road/1301/1301_1_' + laneArrowType3 + '.svg');
            }
        }

        var urls = [];
        if (row1Urls.length > 0) {
            urls.push(row1Urls);
        }

        if (row2Urls.length > 0) {
            urls.push(row2Urls);
        }

        var symbolData = {
            type: 'MultiImageMarkerSymbol',
            urls: urls,
            width: 20,
            height: 20,
            hGap: 10,
            vGap: 17,
            angle: this._feature.properties.rotate
        };

        var symbol = this._symbolFactory.createSymbol(symbolData);
        symbol.geometry = this._geometryFactory.fromGeojson(this._feature.geometry);
        return symbol;
    },
    getHighlightSymbol: function () {
        var row1Urls = [];
        var row2Urls = [];
        var laneArr = this._feature.properties.laneArr.split(',');
        for (var i = 0; i < laneArr.length; ++i) {
            var lane = laneArr[i];
            row1Urls.push('');
            if (lane.indexOf('<') !== -1) {
                row2Urls.push('');
            }
        }

        var urls = [];
        if (row1Urls.length > 0) {
            urls.push(row1Urls);
        }

        if (row2Urls.length > 0) {
            urls.push(row2Urls);
        }

        var symbolData = {
            type: 'MultiImageMarkerSymbol',
            urls: urls,
            width: 20,
            height: 20,
            hGap: 10,
            vGap: 17,
            angle: this._feature.properties.rotate,
            outLine: {
                width: 3,
                color: '#45c8f2'
            }
        };
        var symbol = this._symbolFactory.createSymbol(symbolData);
        symbol.geometry = this._geometryFactory.fromGeojson(this._feature.geometry);
        return symbol;
    }
});
