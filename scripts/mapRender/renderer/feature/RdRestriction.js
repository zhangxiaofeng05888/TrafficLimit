FM.mapApi.render.renderer.RdRestriction = FM.mapApi.render.Renderer.extend({
    initialize: function (feature, zoom) {
        FM.mapApi.render.Renderer.prototype.initialize.call(this, feature, zoom);

        // 绑定函数作用域
        FM.Util.bind(this);

        this._symbol = null;
    },

    getSymbol: function () {
        var restrictArr = this._feature.properties.restrictionArr;
        var restrictType = this._feature.properties.restrictionType;
        var angle = this._feature.properties.rotate;
        var urls = [];
        if (restrictType === '0') {
            // 普通交限
            urls = this._getRestrictionUrls(restrictArr);
        } else {
            urls = this._getTruckRestrictionUrls(restrictArr);
        }

        var json = {
            type: 'MultiImageMarkerSymbol',
            urls: [urls],
            width: 16,
            height: 16,
            angle: angle
        };
        var symbol = this._symbolFactory.createSymbol(json);
        symbol.geometry = this._geometryFactory.fromGeojson(this._feature.geometry);

        return symbol;
    },

    getHighlightSymbol: function (feature, zoom) {
        var restrictArr = this._feature.properties.restrictionArr;
        var angle = this._feature.properties.rotate;

        var json = {
            type: 'RectangleMarkerSymbol',
            opacity: 1,
            color: 'transparent',
            width: 18 * restrictArr.length,
            height: 18,
            angle: angle,
            outLine: {
                width: 3,
                color: '#45c8f2'
            }
        };
        var symbol = this._symbolFactory.createSymbol(json);
        symbol.geometry = this._geometryFactory.fromGeojson(this._feature.geometry);

        return symbol;
    },

    _getRestrictionUrls: function (restrictArr) {
        var urls = [];
        var actualRestrictPath = '../../images/road/1302/1302_1_';
        var academicRestrictPath = '../../images/road/1302/1302_2_';
        for (var i = 0; i < restrictArr.length; i++) {
            if (restrictArr[i].indexOf('[') !== -1) {
                urls.push(academicRestrictPath + restrictArr[i][1] + '.svg');
            } else {
                urls.push(actualRestrictPath + restrictArr[i] + '.svg');
            }
        }

        return urls;
    },

    _getTruckRestrictionUrls: function (restrictArr) {
        var urls = [];
        var truchRestrictPath = '../../images/road/1302/1302_0_';
        for (var i = 0; i < restrictArr.length; i++) {
            if (restrictArr[i].indexOf('[') !== -1) {
                urls.push(truchRestrictPath + restrictArr[i][1] + '.svg');
            } else {
                urls.push(truchRestrictPath + restrictArr[i] + '.svg');
            }
        }

        return urls;
    }
});

