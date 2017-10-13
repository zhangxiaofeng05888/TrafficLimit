FM.mapApi.render.renderer.TipNomalRestriction = FM.mapApi.render.Renderer.extend({
    initialize: function (feature, zoom) {
        FM.mapApi.render.Renderer.prototype.initialize.call(this, feature, zoom);
        // 绑定函数作用域
        FM.Util.bind(this);
    },

    getSymbol: function () {
        var colors = ['#9b9b9b', '#ff6159', '#ffbd2e', '#29cf42'];
        var oArray = this._feature.properties.oArray;
        var len = oArray.length;
        var compositeSymbols = [];
        var urls = [];
        var url = '';

        for (var i = 0; i < len; i++) {
            url = '../../images/road/1302/1302_' + oArray[i].flag + '_' + oArray[i].oInfo + '.svg';
            urls.push(url);
        }

        var multiData = {
            type: 'MultiImageMarkerSymbol',
            urls: [urls],
            width: 16,
            height: 16,
            hGap: 18,
            angle: this._feature.properties.angle
        };
        var multiSymbol = this._symbolFactory.createSymbol(multiData);
        multiSymbol.geometry = this._geometryFactory.createPoint(this._feature.geometry.coordinates);

        //  直接添加边框，太拥挤，另画一个边框
        var urlsEmpty = new Array(len);
        var width = len * 20;
        var borderData = {
            type: 'MultiImageMarkerSymbol',
            urls: [urlsEmpty],
            width: 20,
            height: 20,
            hGap: 20,
            angle: this._feature.properties.angle,
            outLine: {
                width: 1,
                color: colors[this._feature.properties.path]
            }
        };
        var borderSymbol = this._symbolFactory.createSymbol(borderData);
        borderSymbol.geometry = this._geometryFactory.createPoint(this._feature.geometry.coordinates);

        if (this._feature.properties.status > 0) {
            var blurSymbol = {
                type: 'ImageMarkerSymbol',
                url: '../../images/road/tips/icon/status_' + this._feature.properties.status + '.svg',
                width: 11,
                height: 11,
                offsetX: width / 2,
                offsetY: -10
            };

            compositeSymbols.push(blurSymbol);
        }

        var timeSymbol = {
            type: 'ImageMarkerSymbol',
            url: '../../images/road/tips/icon/icon_time.svg',
            width: 6,
            height: 6,
            offsetX: -width / 2
        };
        var outLineSymbol = {
            type: 'ImageMarkerSymbol',
            url: '../../images/road/tips/icon/icon_outline.svg',
            width: 6,
            height: 6,
            offsetX: width / 2
        };
        var accessorySymbol = {
            type: 'ImageMarkerSymbol',
            url: '../../images/road/tips/icon/icon_attachment.svg',
            width: 6,
            height: 6,
            offsetY: 10
        };
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
            angle: this._feature.properties.angle,
            symbols: compositeSymbols

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

        return [guideSymbol, multiSymbol, borderSymbol, symbol];
    },

    getHighlightSymbol: function () {
        var urls = new Array(this._feature.properties.oArray.length);
        var multiData = {
            type: 'MultiImageMarkerSymbol',
            urls: [urls],
            width: 20,
            height: 20,
            hGap: 20,
            angle: this._feature.properties.angle,
            outLine: {
                width: 3,
                color: '#00ffff'
            }
        };
        var multiSymbol = this._symbolFactory.createSymbol(multiData);
        multiSymbol.geometry = this._geometryFactory.createPoint(this._feature.geometry.coordinates);

        return multiSymbol;
    }

    //  以前的实现，先注释起来
  /*  getSymbol: function () {
        var waringSymbol = {
            type: 'ImageMarkerSymbol',
            url: '../../images/road/tips/1302/0.svg',
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
    }*/
});
