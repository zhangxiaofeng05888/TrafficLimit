/**
 * Created by zhaohang on 2017/2/15.
 */
FM.mapApi.render.renderer.RdLinkSpeedLimitDependent = FM.mapApi.render.Renderer.extend({
    initialize: function (feature, zoom) {
        FM.mapApi.render.Renderer.prototype.initialize.call(this, feature, zoom);
        // 绑定函数作用域
        FM.Util.bind(this);
    },
    getSymbol: function () {
        var iconName = '../../images/road/1101/condition_speedlimit_start.svg';
        var startEndArrow = '../../images/road/1101/1101_0_0_s.svg';
        var symbolData = [];
        var conditionObj = {
            0: '无',
            1: '雨',
            2: '雪',
            3: '雾',
            6: '学',
            10: '时',
            11: '车',
            12: '季',
            13: '医',
            14: '购',
            15: '居',
            16: '企',
            17: '景',
            18: '交'
        };
        for (var i = 0; i < this._feature.properties.speedData.length; i++) {
            var symbolData1 = {
                type: 'ImageMarkerSymbol',
                url: iconName,
                width: 50,
                height: 20,
                offsetY: 21 * i
            };
            var symbolData2 = {
                type: 'TextMarkerSymbol',
                text: conditionObj[this._feature.properties.speedData[i][2]] + ' ' + parseInt(this._feature.properties.speedData[i][0], 10) / 10,
                font: '微软雅黑',
                size: 12,
                offsetY: 21 * i
            };
            symbolData.push(symbolData1);
            symbolData.push(symbolData2);
        }
        var symbolData3 = {
            type: 'ImageMarkerSymbol',
            url: startEndArrow,
            width: 24,
            height: 24,
            offsetX: 33
            //  下面这个算数表达式有问题，拿数组对象进行运算，没有产生Y方向偏移效果，并且让修改后的X方向偏移不生效，先注释起来
            // offsetY: (-17 - this._feature.properties.speedData) * this._feature.properties.speedData.length
        };
        symbolData.push(symbolData3);
        var json = {
            type: 'CompositeMarkerSymbol',
            symbols: symbolData,
            angle: (this._feature.properties.rotate - 90)
        };
        var symbol = this._symbolFactory.createSymbol(json);
        symbol.geometry = this._geometryFactory.fromGeojson(this._feature.geometry);
        return symbol;
    }
});
