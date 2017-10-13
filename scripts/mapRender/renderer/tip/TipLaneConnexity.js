FM.mapApi.render.renderer.TipLaneConnexity = FM.mapApi.render.Renderer.extend({
    initialize: function (feature, zoom) {
        FM.mapApi.render.Renderer.prototype.initialize.call(this, feature, zoom);
        // 绑定函数作用域
        FM.Util.bind(this);
    },

    getSymbol: function () {
        var colors = ['#9b9b9b', '#ff6159', '#ffbd2e', '#29cf42'];
        var info = this._feature.properties.info;
        var len = info.length;
        var compositeSymbols = [];
        var url1 = [];  //  第一行
        var url2 = [];  //  第二行
        var urlG = '';
        var urlB = '';
        var f = false;

        for (var i = 0; i < len; i++) {
            var item = info[i];

            if (item.arwG || item.arwG == '') {
                urlG = '../../images/road/1301/1301_0_' + item.arwG + '.svg';
                if (item.ext == 1) {
                    urlG = '../../images/road/1301/1301_2_' + item.arwG + '.svg';
                }
                url1.push(urlG);

                urlB = '';
                if (item.arwB) {
                    urlB = '../../images/road/1301/1301_1_' + item.arwB + '.svg';
                    f = true;
                }
                url2.push(urlB);
            }
        }

        var urls = f ? [url1, url2] : [url1];
        var multiData = {
            type: 'MultiImageMarkerSymbol',
            urls: urls,
            width: 16,
            height: 16,
            hGap: 16,
            vGap: 16,
            angle: this._feature.properties.angle
        };
        var multiSymbol = this._symbolFactory.createSymbol(multiData);
        multiSymbol.geometry = this._geometryFactory.createPoint(this._feature.geometry.coordinates);

        //  直接添加边框，太拥挤，另画一个边框
        var urlsEmpty = new Array(url1.length);
        var width = len * 18;
        var borderData = {
            type: 'MultiImageMarkerSymbol',
            urls: f ? [urlsEmpty, urlsEmpty] : [urlsEmpty],
            width: 18,
            height: 18,
            hGap: 18,
            vGap: 18,
            angle: this._feature.properties.angle,
            outLine: {
                width: 1,
                color: colors[this._feature.properties.path]
            }
        };
        var borderSymbol = this._symbolFactory.createSymbol(borderData);
        borderSymbol.geometry = this._geometryFactory.createPoint(this._feature.geometry.coordinates);

        var offY = f ? 18 : 9;
        if (this._feature.properties.status > 0) {
            var blurSymbol = {
                type: 'ImageMarkerSymbol',
                url: '../../images/road/tips/icon/status_' + this._feature.properties.status + '.svg',
                width: 11,
                height: 11,
                offsetX: width / 2,
                offsetY: -offY
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
            offsetY: offY
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
        var info = this._feature.properties.info;
        var len = info.length;
        var url1 = [];
        var f = false;

        for (var i = 0; i < len; i++) {
            var item = info[i];

            if (item.arwG || item.arwG == '') {
                url1.push('');
                if (item.arwB) {
                    f = true;
                }
            }
        }

        var urls = f ? [url1, url1] : [url1];
        var multiData = {
            type: 'MultiImageMarkerSymbol',
            urls: urls,
            width: 18,
            height: 18,
            hGap: 18,
            vGap: 18,
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
/*
    getSymbol: function () {
        var testSymbol = {
            type: 'ImageMarkerSymbol',
            url: '../../images/road/tips/1301/0.svg',
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
        var compositeSymbols = [borderSymbol, testSymbol, blurSymbol];
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
        symbol.geometry = this._geometryFactory.fromGeojson(this._feature.geometry);
        return symbol;
    }*/
});

