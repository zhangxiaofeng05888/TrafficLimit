FM.mapApi.render.renderer.TipRestriction = FM.mapApi.render.Renderer.extend({
    initialize: function (feature, zoom) {
        FM.mapApi.render.Renderer.prototype.initialize.call(this, feature, zoom);
        // 绑定函数作用域
        FM.Util.bind(this);
    },
    getSymbol: function () {
        var url = '';
        if (this._feature.properties.flag === 1) {
            if (this._feature.properties.se === 0) {
                url = '../../images/road/1101/theory_speedlimit_start.svg';
            } else {
                url = '../../images/road/1101/theory_speedlimit_end.svg';
            }
        } else {
            if (this._feature.properties.se === 0) {
                url = '../../images/road/1101/normal_speedlimit_start.svg';
            } else {
                url = '../../images/road/1101/normal_speedlimit_end.svg';
            }
        }
        var testSymbol = {
            type: 'ImageMarkerSymbol',
            url: url,
            width: 18,
            height: 18
        };
        var laneJson = {
            type: 'TextMarkerSymbol',
            text: this._feature.properties.value,
            font: '微软雅黑',
            size: 10,
            angle: -270
        };
        var borderSymbol = {
            type: 'ImageMarkerSymbol',
            url: '../../images/road/tips/icon/icon_' + this._feature.properties.path + '.svg',
            width: 22,
            height: 22
        };
        var arrowSymbol = {
            type: 'ImageMarkerSymbol',
            url: '../../images/road/tips/icon/icon_arrow.svg',
            width: 10,
            height: 12,
            offsetY: -16
        };

        var blurSymbol = null;
        if (this._feature.properties.status === 0) {
            blurSymbol = {
                type: 'CircleMarkerSymbol',
                radius: 9,
                color: 'transparent',
                opacity: 0.5
            };
        } else {
            blurSymbol = {
                type: 'ImageMarkerSymbol',
                url: '../../images/road/tips/icon/status_' + this._feature.properties.status + '.svg',
                width: 11,
                height: 11,
                offsetX: 11,
                offsetY: -11
            };
        }

        var timeSymbol = {
            type: 'ImageMarkerSymbol',
            url: '../../images/road/tips/icon/icon_time.svg',
            width: 6,
            height: 6,

            offsetX: -11
        };
        var outLineSymbol = {
            type: 'ImageMarkerSymbol',
            url: '../../images/road/tips/icon/icon_outline.svg',
            width: 6,
            height: 6,

            offsetX: 11
        };
        var accessorySymbol = {
            type: 'ImageMarkerSymbol',
            url: '../../images/road/tips/icon/icon_attachment.svg',
            width: 6,
            height: 6,
            offsetY: 11
        };
        var compositeSymbols = [borderSymbol, arrowSymbol, testSymbol, laneJson, blurSymbol];
        if (this._feature.properties.accessorySymbol === 1) {
            compositeSymbols.push(accessorySymbol);
        }
        if (this._feature.properties.timeSymbol === 1) {
            compositeSymbols.push(timeSymbol);
        }
        if (this._feature.properties.outLineSymbol === 1) {
            compositeSymbols.push(outLineSymbol);
        }
        var symbolData = {
            type: 'CompositeMarkerSymbol',
            symbols: compositeSymbols,
            angle: this._feature.properties.angle
        };
        var symbol = this._symbolFactory.createSymbol(symbolData);
        symbol.geometry = this._geometryFactory.createPoint(this._feature.geometry.coordinates);
        var guideLinkData = {
            type: 'CartoLineSymbol',
            color: '#4343FF',
            width: 1,
            pattern: [4, 2]
        };
        var guideSymbol = this._symbolFactory.createSymbol(guideLinkData);
        guideSymbol.geometry = this._geometryFactory.fromGeojson(this._feature.guideLink);
        return [guideSymbol, symbol];
    },
    getHighlightSymbol: function () {
        var symbolData = {
            type: 'CircleMarkerSymbol',
            radius: 9,
            color: 'transparent',
            outLine: {
                width: 3,
                color: '#00ffff'
            }
        };
        var symbol = this._symbolFactory.createSymbol(symbolData);
        symbol.geometry = this._geometryFactory.createPoint(this._feature.geometry.coordinates);
        return symbol;
    }
});
