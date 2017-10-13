/**
 * Created by zhongxiaoming on 2017/5/25.
 */
FM.mapApi.render.renderer.CustomTipFC = FM.mapApi.render.Renderer.extend({
    initialize: function (feature, zoom) {
        FM.mapApi.render.Renderer.prototype.initialize.call(this, feature, zoom);
        this._colors = ['#FF0000', '#00A000', '#FFC000', '#0000FF', '#909090'];
        // 绑定函数作用域
        FM.Util.bind(this);
    },
    getSymbol: function () {
        var symbols = null;
        if (this._feature.properties.code == '8001') {
            symbols = this.addCompositeSymbol();
            symbols.symbols.push(this.addLevelSymbol());
            symbols.symbols.push(this.addNormalSymbol());
        } else {
            symbols = [];
            symbols.push(this.addImageSymbol());
        }
        return symbols;
    },

    addCompositeSymbol: function () {
        var compositeSymbol = this._symbolFactory.createSymbol({ type: 'CompositeLineSymbol' });
        compositeSymbol.geometry = this._geometryFactory.createLineString(this._feature.geometry.geometries[1].coordinates);
        this._symbol = compositeSymbol;
        return this._symbol;
    },

    addNormalSymbol: function () {
        var symbolData = {
            type: 'SimpleLineSymbol',
            color: this._colors[this._feature.properties.level - 1],
            width: 2,
            opacity: this._opacity,
            style: 'solid'
        };
        var symbol = this._symbolFactory.createSymbol(symbolData);
        return symbol;
    },
    addImageSymbol: function () {
        var waringSymbol = {
            type: 'ImageMarkerSymbol',
            url: '../../images/road/voiceGuide/FC.png',
            width: 18,
            height: 18
        };
        var borderSymbol = {
            type: 'ImageMarkerSymbol',
            url: '../../images/road/tips/icon/icon_' + this._feature.properties.path + '.svg',
            width: 22,
            height: 22
        };
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
        var compositeSymbols = [borderSymbol, waringSymbol];
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

    addLevelSymbol: function () {
        // if (this._zoom <= 14) {
        //     return;
        // }
        //
        // if (!this._feature.properties.name) {
        //     return;
        // }

        var symbolData = {
            type: 'TextLineSymbol',
            text: this._feature.properties.level + '',
            gap: 300,
            marker: {
                type: 'TextMarkerSymbol',
                font: '微软雅黑',
                size: 10,
                color: 'black'
            }
        };
        var symbol = this._symbolFactory.createSymbol(symbolData);

        return symbol;
    },
    getHighlightSymbol: function () {
        var symbolData1 = {
            type: 'SimpleLineSymbol',
            color: '#00ffff',
            width: 2
        };
        var symbol1 = this._symbolFactory.createSymbol(symbolData1);
        symbol1.geometry = this._geometryFactory.createLineString(this._feature.geometry.geometries[1].coordinates);

        return symbol1;
    }
});

