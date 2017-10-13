FM.mapApi.render.renderer.RdSpeedLimit = FM.mapApi.render.Renderer.extend({
    initialize: function (feature, zoom) {
        FM.mapApi.render.Renderer.prototype.initialize.call(this, feature, zoom);
        // 绑定函数作用域
        FM.Util.bind(this);
    },
    _getTextImage: function () {
        var json = {};
        var sJson = {};
        var compositeSymbols = [];
        var speedValueText = 0;
        var laneJson = {};
        var laneSpeed = 0;
        var props = this._feature.properties;
        var iconName = '../../images/road/1101/theory_speedlimit_start.svg';
        var startEndArrow = '../../images/road/tips/1111/1111_0_0.svg';
        var squareColor = '';

        if (props.speedType === 0 || props.speedType === 1) {
            if (props.captureFlag === 1) { // 理论判断，限速开始和结束都为蓝色
                if (props.speedFlag === 0) { // 解除限速
                    iconName = '../../images/road/1101/theory_speedlimit_start.svg';
                    startEndArrow = '../../images/road/1101/1101_0_0_s.svg';
                } else {
                    iconName = '../../images/road/1101/theory_speedlimit_end.svg';
                    startEndArrow = '../../images/road/1101/1101_1_1_e.svg';
                }
                squareColor = '#0000ff';
            } else {
                // 现场采集，限速开始为红色，结束为黑色
                if (props.speedFlag === 0) { // 解除限速
                    iconName = '../../images/road/1101/normal_speedlimit_start.svg';
                    startEndArrow = '../../images/road/1101/1101_0_0_s.svg';
                    squareColor = '#cd5e3c';
                } else {
                    iconName = '../../images/road/1101/normal_speedlimit_end.svg';
                    startEndArrow = '../../images/road/1101/1101_1_1_e.svg';
                    squareColor = '#222222';
                }
            }
            laneJson = {
                type: 'TextMarkerSymbol',
                text: props.speedValue,
                font: '微软雅黑',
                size: 12,
                angle: -90
            };
        } else if (props.speedType === 3) {
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
            if (props.speedFlag === 0) {
                iconName = '../../images/road/1101/condition_speedlimit_start.svg';
                startEndArrow = '../../images/road/1101/1101_0_0_s.svg';
                squareColor = '#ff0000';
            } else if (props.speedFlag === 1) {
                iconName = '../../images/road/1101/condition_speedlimit_end.svg';
                startEndArrow = '../../images/road/1101/1101_0_1_e.svg';
                squareColor = '#000000';
            }
            laneJson = {
                type: 'TextMarkerSymbol',
                text: conditionObj[props.speedDependent] + ' ' + props.speedValue,
                font: '微软雅黑',
                size: 12,
                align: 'center',
                baseline: 'middle',
                direction: 'ltr',
                offsetX: 0,
                offsetY: 0,
                angle: -90
            };
        } else if (props.speedType === 4) { // 车道限速
            laneJson = {
                type: 'TextMarkerSymbol',
                text: props.speedValue,
                font: '微软雅黑',
                size: 12,
                angle: -90
            };
            squareColor = '#0000ff';
        }

        var waringSymbol = {
            type: 'ImageMarkerSymbol',
            url: iconName,
            width: props.speedType === 3 ? 50 : 24,
            height: props.speedType === 3 ? 20 : 24,
            angle: -90,
            outLine: {
                width: props.speedType === 3 ? 1 : 2,
                color: squareColor
            }
        };

        var arrowSymbol = {
            type: 'ImageMarkerSymbol',
            url: startEndArrow,
            width: 32,
            height: 32,
            angle: props.speedFlag === 1 ? 270 : -90,
            offsetY: props.speedType === 3 ? -35 : -23
        };

        if (props.speedFlag == 1) {
            if (props.speedType == 0) {
                arrowSymbol.offsetY = 23;
            }
            if (props.speedType == 3) {
                arrowSymbol.offsetY = 35;
            }
        }

        compositeSymbols = [waringSymbol, arrowSymbol, laneJson];

        if (props.speedType === 4 && !props.text && !props.tollgateFlag) {
            sJson = {
                type: 'TextMarkerSymbol',
                text: props.laneSpeedValue.join('|'),
                font: '微软雅黑',
                size: 12,
                offsetX: 0,
                offsetY: -60,
                angle: -90
            };
            compositeSymbols.push(sJson);
        }

        if (props.state === 2) {
            var blurSymbol = {  //  点限速删除状态 X 号小图标
                type: 'ImageMarkerSymbol',
                url: '../../images/road/1101/type_3.svg',
                width: 9,
                height: 9,
                offsetX: props.speedType === 3 ? 7 : 12,
                offsetY: props.speedType === 3 ? 23 : 12
            };
            compositeSymbols.push(blurSymbol);
        }

        return compositeSymbols;
    },
    getSymbol: function () {
        var symbols = [];
        var symbolData = {
            type: 'CompositeMarkerSymbol',
            symbols: this._getTextImage(),
            angle: this._feature.properties.rotate
        };
        var symbol = this._symbolFactory.createSymbol(symbolData);
        symbol.geometry = this._geometryFactory.createPoint(this._feature.geometry.coordinates);

        symbols.push(symbol);
        symbols.push(this._getDescriptionSymbol());

        return symbols;
    },

    _getDescriptionSymbol: function () {
        var description = '';
        var laneValue = '';
        var props = this._feature.properties;
        var tollgateLimit = props.tollgateFlag ? '收费站前限速' : '';

        if (props.text && props.tollgateFlag) {
            description = props.text + ' / ' + tollgateLimit;
        } else if (props.text && !props.tollgateFlag) {
            description = props.text;
        } else if (!props.text && props.tollgateFlag) {
            description = tollgateLimit;
        }

        if (props.speedType === 4 && (props.text || props.tollgateFlag)) {
            laneValue += props.laneSpeedValue.join('|');
        }

        if (laneValue) {
            description = laneValue + ' / ' + description;
        }

        var offset = 0;
        if (props.rotate > 55 && props.rotate < 310) {
            offset = props.speedType === 3 ? -39 : -22;
        } else {
            offset = props.speedType === 3 ? -52 : -39;
        }

        var json = {
            type: 'TextMarkerSymbol',
            text: description,
            font: '微软雅黑',
            size: 12,
            offsetY: offset
        };

        var textSymbol = this._symbolFactory.createSymbol(json);
        textSymbol.geometry = this._geometryFactory.createPoint(this._feature.geometry.coordinates);

        return textSymbol;
    },

    getHighlightSymbol: function () {
        var symbolData = {
            type: 'CompositeMarkerSymbol',
            symbols: this._getTextImage(),
            angle: this._feature.properties.rotate
        };
        var symbol = this._symbolFactory.createSymbol(symbolData);
        symbol.geometry = this._geometryFactory.createPoint(this._feature.geometry.coordinates);
        return symbol;
    }
});
