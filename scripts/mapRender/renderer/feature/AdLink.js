FM.mapApi.render.renderer.AdLink = FM.mapApi.render.Renderer.extend({
    initialize: function (feature, zoom) {
        FM.mapApi.render.Renderer.prototype.initialize.call(this, feature, zoom);
        // 绑定函数作用域
        FM.Util.bind(this);
    },
    getSymbol: function () {
        if (this._zoom < 7) {
            // 5、6级时我只能看到国家线、国家名
            if (this._feature.properties.kind !== 6) {
                return null;
            }
        } else if (this._zoom > 6 && this._zoom < 9) {
            // 7,8级时我能看到国家线、国家名、升级区划线、省会名
            if (this._feature.properties.kind !== 6 && this._feature.properties.kind !== 1) {
                return null;
            }
        } else if (this._zoom < 17) {
            if (this._feature.properties.kind === 0) {
                return null;
            }
        }

        var kind = this._feature.properties.kind;
        var color = '#FBD356';
        var width = 3;

        if (kind === 1) {
            color = '#ffd0e8';
            width = 2;
        } else if (kind === 3 || kind === 2) {
            color = '#84A5A8';
            width = 1;
        }

        var symbolData = {
            type: 'SimpleLineSymbol',
            color: color,
            width: width,
            opacity: 1,
            style: 'solid'
        };
        var symbol = this._symbolFactory.createSymbol(symbolData);
        symbol.geometry = this._geometryFactory.fromGeojson(this._feature.geometry);
        return symbol;
    },
    getHighlightSymbol: function () {
        if (this._zoom < 7) {
            // 5、6级时我只能看到国家线、国家名
            if (this._feature.properties.kind !== 6) {
                return null;
            }
        } else if (this._zoom > 6 && this._zoom < 9) {
            // 7,8级时我能看到国家线、国家名、升级区划线、省会名
            if (this._feature.properties.kind !== 6 && this._feature.properties.kind !== 1) {
                return null;
            }
        } else if (this._zoom < 17) {
            if (this._feature.properties.kind === 0) {
                return null;
            }
        }
        var symbolData = {
            type: 'SimpleLineSymbol',
            color: '#00ffff',
            width: 3
        };
        var symbol = this._symbolFactory.createSymbol(symbolData);
        symbol.geometry = this._geometryFactory.fromGeojson(this._feature.geometry);
        return symbol;
    }
});
