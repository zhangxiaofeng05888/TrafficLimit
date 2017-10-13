/**
 * Created by zhongxiaoming on 2017/5/24.
 */
FM.mapApi.render.renderer.CustomTipLinks = FM.mapApi.render.Renderer.extend({
    initialize: function (feature, zoom) {
        FM.mapApi.render.Renderer.prototype.initialize.call(this, feature, zoom);
        // 绑定函数作用域
        FM.Util.bind(this);
    },
    getSymbol: function () {
        var simpleSymbol = this.addSimpleLineSymbol();
        var nameSymbol = this.addNameSymbol();
        var imageSymbol = this.addImageSymbol();
        return [simpleSymbol, nameSymbol, imageSymbol];
    },
    addSimpleLineSymbol: function () {
        var symbolData = {
            type: 'SimpleLineSymbol',
            color: 'red',
            width: 2
        };
        var symbol = this._symbolFactory.createSymbol(symbolData);
        symbol.geometry = this._geometryFactory.createLineString(this._feature.geometry.geometries[1].coordinates);
        return symbol;
    },
    addNameSymbol: function () {
        var text = '';
        if (this._feature.properties.ln || this._feature.properties.ln === 0) {
            text = 'W' + this._feature.properties.ln;
        }
        if (this._feature.properties.kind || this._feature.properties.kind === 0) {
            if (text.length > 0) {
                text = text + '/K' + this._feature.properties.kind;
            } else {
                text = 'K' + this._feature.properties.kind;
            }
        }
        var symbolNameData = {
            type: 'TextLineSymbol',
            text: text,
            gap: 300,
            marker: {
                type: 'TextMarkerSymbol',
                font: '微软雅黑',
                size: 10,
                color: 'black'
            }
        };
        var symbol = this._symbolFactory.createSymbol(symbolNameData);
        symbol.geometry = this._geometryFactory.createLineString(this._feature.geometry.geometries[1].coordinates);
        return symbol;
    },
    addImageSymbol: function () {
        var waringSymbol = {
            type: 'ImageMarkerSymbol',
            url: '../../images/road/tips/2001/0.svg',
            width: 18,
            height: 18
        };
        var borderSymbol = {
            type: 'ImageMarkerSymbol',
            url: '../../images/road/tips/icon/icon_' + this._feature.properties.path + '.svg',
            width: 22,
            height: 22
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
        var compositeSymbols = [borderSymbol, waringSymbol, blurSymbol];
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
            symbols: compositeSymbols
        };
        var symbol = this._symbolFactory.createSymbol(symbolData);
        symbol.geometry = this._geometryFactory.createPoint(this._feature.geometry.geometries[0].coordinates);
        return symbol;
    },
    getHighlightSymbol: function () {
        var symbols = [];
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
        symbol.geometry = this._geometryFactory.createPoint(this._feature.geometry.geometries[0].coordinates);
        symbols.push(symbol);
        var symbolData1 = {
            type: 'SimpleLineSymbol',
            color: '#00ffff',
            width: 2
        };
        var symbol1 = this._symbolFactory.createSymbol(symbolData1);
        symbol1.geometry = this._geometryFactory.createLineString(this._feature.geometry.geometries[1].coordinates);

        symbols.push(symbol1);

        return symbols;
    }
});

